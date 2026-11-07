// WebAudio engine: synth instruments, a lookahead sequencer that plays the
// songs in data (melody + generated accompaniment), and synthesized SFX.

import { SONGS } from './songs.js';

const NOTE_INDEX = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

export function noteToMidi(tok) {
  const m = /^([a-g])([#b]?)(-?\d)$/i.exec(tok);
  if (!m) return null;
  let n = NOTE_INDEX[m[1].toLowerCase()];
  if (m[2] === '#') n++;
  if (m[2] === 'b') n--;
  return n + (parseInt(m[3], 10) + 1) * 12;
}
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// ---------------------------------------------------------------- chords

const CHORD_SHAPES = {
  '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], sus4: [0, 5, 7], sus2: [0, 2, 7],
  dim: [0, 3, 6], aug: [0, 4, 8], add9: [0, 4, 7, 14], m9: [0, 3, 7, 10, 14], 6: [0, 4, 7, 9], m6: [0, 3, 7, 9],
};

export function parseChord(name) {
  const m = /^([A-G])([#b]?)(.*?)(?:\/([A-G][#b]?))?$/.exec(name);
  if (!m) return null;
  let root = NOTE_INDEX[m[1].toLowerCase()] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  const shape = CHORD_SHAPES[m[3]] ?? CHORD_SHAPES[''];
  let bass = root;
  if (m[4]) bass = NOTE_INDEX[m[4][0].toLowerCase()] + (m[4][1] === '#' ? 1 : m[4][1] === 'b' ? -1 : 0);
  return { root: (root + 12) % 12, bass: (bass + 12) % 12, tones: shape };
}

/** Parse "e5:2 [c4e4g4]:8 r:4" into [{notes:[midi], len}] with 16th-step lengths. */
export function parseLine(str) {
  const out = [];
  for (const tok of str.trim().split(/\s+/)) {
    if (!tok) continue;
    const [body, lenStr] = tok.split(':');
    const len = Number(lenStr || 2);
    if (body === 'r' || body === '-') { out.push({ notes: [], len }); continue; }
    if (body.startsWith('[')) {
      const inner = body.slice(1, -1).match(/[a-g][#b]?-?\d/gi) || [];
      out.push({ notes: inner.map(noteToMidi), len });
    } else {
      out.push({ notes: [noteToMidi(body)], len });
    }
  }
  return out;
}

// ---------------------------------------------------------------- engine

export class AudioEngine {
  constructor(game) {
    this.game = game;
    this.ctx = null;
    this.current = null;
    this.musicVol = 0.55;
    this.sfxVol = 0.6;
    this.pendingSong = null;
    const unlock = () => {
      this.init();
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('pointerdown', unlock);
    };
    window.addEventListener('keydown', unlock);
    window.addEventListener('pointerdown', unlock);
  }

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createDynamicsCompressor();
    this.master.threshold.value = -14;
    this.master.ratio.value = 4;
    this.master.connect(ctx.destination);
    this.musicBus = ctx.createGain();
    this.musicBus.gain.value = this.musicVol;
    this.sfxBus = ctx.createGain();
    this.sfxBus.gain.value = this.sfxVol;
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.impulse(2.8, 2.2);
    this.reverbSend = ctx.createGain();
    this.reverbSend.gain.value = 0.32;
    this.reverbSend.connect(this.reverb);
    this.reverb.connect(this.master);
    this.musicBus.connect(this.master);
    this.musicBus.connect(this.reverbSend);
    this.sfxBus.connect(this.master);
    this.noiseBuf = this.makeNoise();
    this.timer = setInterval(() => this.schedule(), 25);
    if (this.pendingSong) { const p = this.pendingSong; this.pendingSong = null; this.playMusic(p.id, p.opts); }
  }

  setVolumes(music, sfx) {
    this.musicVol = music;
    this.sfxVol = sfx;
    if (this.ctx) {
      this.musicBus.gain.value = music;
      this.sfxBus.gain.value = sfx;
    }
  }

  impulse(sec, decay) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  makeNoise() {
    const ctx = this.ctx;
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ------------------------------------------------------------------ music

  playMusic(id, opts = {}) {
    if (!this.ctx) { this.pendingSong = { id, opts }; return; }
    if (this.current?.id === id && !opts.restart && !this.current.stopping) return;
    const song = SONGS[id];
    if (!song) { this.stopMusic(0.8); return; }
    this.stopMusic(opts.once ? 0.2 : 0.9);
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(song.volume ?? 1, this.ctx.currentTime + (opts.fadeIn ?? 0.6));
    gain.connect(this.musicBus);
    const tracks = buildTracks(song);
    this.current = {
      id, song, gain, tracks, once: !!opts.once || !!song.once,
      step: 0, nextTime: this.ctx.currentTime + 0.12, stepDur: 60 / song.bpm / 4,
      totalSteps: Math.max(...tracks.map((t) => t.totalSteps)),
    };
    if (this.current.once && opts.resume !== false) this.resumeAfter = opts.resumeId || null;
  }

  stopMusic(fade = 1) {
    const cur = this.current;
    if (!cur || !this.ctx) { this.current = null; return; }
    cur.stopping = true;
    const t = this.ctx.currentTime;
    cur.gain.gain.cancelScheduledValues(t);
    cur.gain.gain.setValueAtTime(cur.gain.gain.value, t);
    cur.gain.gain.linearRampToValueAtTime(0, t + fade);
    setTimeout(() => cur.gain.disconnect(), (fade + 0.5) * 1000);
    this.current = null;
  }

  schedule() {
    const cur = this.current;
    if (!cur || !this.ctx) return;
    const ahead = this.ctx.currentTime + 0.15;
    while (cur.nextTime < ahead) {
      for (const tr of cur.tracks) {
        const ev = tr.events.get(cur.step % tr.totalSteps);
        if (!ev) continue;
        for (const e of ev) this.voice(tr.inst, e.midi, cur.nextTime, e.len * cur.stepDur, e.vel * tr.vol, cur.gain);
      }
      cur.step++;
      cur.nextTime += cur.stepDur * (cur.song.swing && cur.step % 2 ? 1.12 : cur.song.swing ? 0.88 : 1);
      if (cur.once && cur.step >= cur.totalSteps) { this.current = null; return; }
    }
  }

  // ------------------------------------------------------------------ instruments

  voice(inst, midi, t, dur, vel, out) {
    const ctx = this.ctx;
    const f = mtof(midi);
    const g = ctx.createGain();
    g.connect(out);
    const env = (a, d, s, r, peak = vel) => {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * s), t + a + d);
      g.gain.setValueAtTime(Math.max(0.0001, peak * s), t + Math.max(a + d, dur));
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(a + d, dur) + r);
      return t + Math.max(a + d, dur) + r + 0.05;
    };
    const osc = (type, freq, detune = 0) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      o.detune.value = detune;
      return o;
    };
    const lp = (freq, q = 0.7) => {
      const fl = ctx.createBiquadFilter();
      fl.type = 'lowpass';
      fl.frequency.value = freq;
      fl.Q.value = q;
      fl.connect(g);
      return fl;
    };
    let end;
    switch (inst) {
      case 'pluck': {
        end = env(0.004, 0.35, 0.15, 0.4, vel * 0.5);
        const fl = lp(Math.min(9000, f * 6));
        fl.frequency.setValueAtTime(f * 8, t);
        fl.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.4);
        const o1 = osc('triangle', f), o2 = osc('sawtooth', f, 4);
        const g2 = ctx.createGain(); g2.gain.value = 0.25;
        o1.connect(fl); o2.connect(g2); g2.connect(fl);
        [o1, o2].forEach((o) => { o.start(t); o.stop(end); });
        break;
      }
      case 'harp': {
        end = env(0.002, 0.8, 0.05, 0.8, vel * 0.45);
        const o1 = osc('triangle', f), o2 = osc('sine', f * 2);
        const g2 = ctx.createGain(); g2.gain.value = 0.3;
        o1.connect(g); o2.connect(g2); g2.connect(g);
        [o1, o2].forEach((o) => { o.start(t); o.stop(end); });
        break;
      }
      case 'piano': {
        end = env(0.003, 1.2, 0.08, 0.6, vel * 0.5);
        const fl = lp(f * 5);
        const o1 = osc('triangle', f), o2 = osc('sine', f * 2, 3), o3 = osc('square', f, -4);
        const g3 = ctx.createGain(); g3.gain.value = 0.06;
        const g2 = ctx.createGain(); g2.gain.value = 0.35;
        o1.connect(fl); o2.connect(g2); g2.connect(fl); o3.connect(g3); g3.connect(fl);
        [o1, o2, o3].forEach((o) => { o.start(t); o.stop(end); });
        break;
      }
      case 'pad': {
        end = env(0.6, 0.5, 0.75, 1.2, vel * 0.16);
        const fl = lp(1400);
        for (const d of [-9, 0, 9]) { const o = osc('sawtooth', f, d); o.connect(fl); o.start(t); o.stop(end); }
        break;
      }
      case 'strings': {
        end = env(0.12, 0.3, 0.8, 0.5, vel * 0.18);
        const fl = lp(f * 4 + 600);
        const lfo = osc('sine', 5.5);
        const lg = ctx.createGain(); lg.gain.value = 6;
        lfo.connect(lg);
        for (const d of [-6, 6]) { const o = osc('sawtooth', f, d); lg.connect(o.detune); o.connect(fl); o.start(t); o.stop(end); }
        lfo.start(t); lfo.stop(end);
        break;
      }
      case 'flute': {
        end = env(0.06, 0.2, 0.85, 0.25, vel * 0.32);
        const o = osc('sine', f);
        const lfo = osc('sine', 5);
        const lg = ctx.createGain(); lg.gain.value = 8;
        lfo.connect(lg); lg.connect(o.detune);
        const o2 = osc('triangle', f * 2);
        const g2 = ctx.createGain(); g2.gain.value = 0.12;
        o.connect(g); o2.connect(g2); g2.connect(g);
        [o, lfo, o2].forEach((x) => { x.start(t); x.stop(end); });
        break;
      }
      case 'bell': {
        end = env(0.002, 1.8, 0.01, 1.2, vel * 0.28);
        const car = osc('sine', f);
        const mod = osc('sine', f * 3.5);
        const mg = ctx.createGain(); mg.gain.setValueAtTime(f * 2, t); mg.gain.exponentialRampToValueAtTime(1, t + 1.5);
        mod.connect(mg); mg.connect(car.frequency);
        car.connect(g);
        [car, mod].forEach((x) => { x.start(t); x.stop(end); });
        break;
      }
      case 'brass': {
        end = env(0.05, 0.2, 0.7, 0.2, vel * 0.22);
        const fl = lp(400, 2);
        fl.frequency.setValueAtTime(400, t);
        fl.frequency.linearRampToValueAtTime(f * 5, t + 0.08);
        fl.frequency.linearRampToValueAtTime(f * 3, t + 0.3);
        for (const d of [-5, 5]) { const o = osc('sawtooth', f, d); o.connect(fl); o.start(t); o.stop(end); }
        break;
      }
      case 'lead': {
        end = env(0.01, 0.15, 0.6, 0.15, vel * 0.18);
        const fl = lp(f * 6);
        const o = osc('square', f);
        const o2 = osc('sawtooth', f, 7);
        o.connect(fl); o2.connect(fl);
        [o, o2].forEach((x) => { x.start(t); x.stop(end); });
        break;
      }
      case 'bass': {
        end = env(0.01, 0.25, 0.6, 0.15, vel * 0.42);
        const fl = lp(f * 4 + 200);
        const o = osc('triangle', f), o2 = osc('sawtooth', f);
        const g2 = ctx.createGain(); g2.gain.value = 0.18;
        o.connect(fl); o2.connect(g2); g2.connect(fl);
        [o, o2].forEach((x) => { x.start(t); x.stop(end); });
        break;
      }
      case 'kick': {
        const o = osc('sine', 150);
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
        g.gain.setValueAtTime(vel * 0.9, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.connect(g); o.start(t); o.stop(t + 0.3);
        break;
      }
      case 'snare': {
        const n = ctx.createBufferSource(); n.buffer = this.noiseBuf;
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200;
        g.gain.setValueAtTime(vel * 0.35, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        n.connect(hp); hp.connect(g); n.start(t); n.stop(t + 0.2);
        break;
      }
      case 'hat': {
        const n = ctx.createBufferSource(); n.buffer = this.noiseBuf;
        const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000;
        g.gain.setValueAtTime(vel * 0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        n.connect(hp); hp.connect(g); n.start(t); n.stop(t + 0.06);
        break;
      }
      case 'timpani': {
        const o = osc('sine', f);
        o.frequency.setValueAtTime(f * 1.5, t);
        o.frequency.exponentialRampToValueAtTime(f, t + 0.05);
        g.gain.setValueAtTime(vel * 0.6, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        o.connect(g); o.start(t); o.stop(t + 0.9);
        break;
      }
      default: {
        end = env(0.01, 0.2, 0.5, 0.2, vel * 0.3);
        const o = osc('triangle', f);
        o.connect(g); o.start(t); o.stop(end);
      }
    }
  }

  // ------------------------------------------------------------------ sfx

  sfx(id) {
    if (!this.ctx) return;
    const fn = SFX[id];
    if (fn) fn(this, this.ctx.currentTime);
  }

  tone(t, freq, dur, { type = 'square', vol = 0.2, slide = 0, attack = 0.005, filter = 0 } = {}) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (filter) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filter;
      o.connect(f);
      node = f;
    }
    node.connect(g);
    g.connect(this.sfxBus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  noise(t, dur, { vol = 0.25, freq = 2000, type = 'bandpass', q = 1, sweep = 0 } = {}) {
    const ctx = this.ctx;
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (sweep) f.frequency.exponentialRampToValueAtTime(freq * sweep, t + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(f); f.connect(g); g.connect(this.sfxBus);
    n.start(t);
    n.stop(t + dur + 0.05);
  }
}

// ---------------------------------------------------------------- SFX table

const SFX = {
  cursor: (a, t) => a.tone(t, 1760, 0.04, { type: 'square', vol: 0.05, filter: 4000 }),
  confirm: (a, t) => { a.tone(t, 1320, 0.06, { vol: 0.07, filter: 5000 }); a.tone(t + 0.05, 1980, 0.08, { vol: 0.06, filter: 5000 }); },
  cancel: (a, t) => a.tone(t, 880, 0.08, { vol: 0.06, slide: 0.6, filter: 3000 }),
  buzzer: (a, t) => a.tone(t, 160, 0.15, { type: 'sawtooth', vol: 0.08, filter: 900 }),
  blip: (a, t) => a.tone(t, 900 + Math.random() * 80, 0.025, { type: 'triangle', vol: 0.035 }),
  item: (a, t) => [0, 4, 7, 12].forEach((s, i) => a.tone(t + i * 0.06, 880 * 2 ** (s / 12), 0.25, { type: 'triangle', vol: 0.08 })),
  chest: (a, t) => { a.noise(t, 0.15, { freq: 400, vol: 0.2 }); [0, 7, 12, 16].forEach((s, i) => a.tone(t + 0.1 + i * 0.07, 660 * 2 ** (s / 12), 0.3, { type: 'triangle', vol: 0.08 })); },
  save: (a, t) => [0, 5, 9, 12, 17].forEach((s, i) => a.tone(t + i * 0.09, 523 * 2 ** (s / 12), 0.6, { type: 'sine', vol: 0.09 })),
  join: (a, t) => [0, 4, 7, 12, 16, 19, 24].forEach((s, i) => a.tone(t + i * 0.07, 523 * 2 ** (s / 12), 0.4, { type: 'triangle', vol: 0.08 })),
  levelup: (a, t) => [0, 4, 7, 12].forEach((s, i) => a.tone(t + i * 0.08, 784 * 2 ** (s / 12), 0.35, { type: 'square', vol: 0.05, filter: 3000 })),
  surprise: (a, t) => { a.tone(t, 880, 0.08, { vol: 0.08 }); a.tone(t + 0.08, 1320, 0.12, { vol: 0.08 }); },
  rumble: (a, t) => a.noise(t, 0.8, { freq: 120, type: 'lowpass', vol: 0.5 }),
  step_exit: (a, t) => a.noise(t, 0.15, { freq: 600, vol: 0.12 }),
  door: (a, t) => { a.noise(t, 0.2, { freq: 300, vol: 0.2 }); a.tone(t, 120, 0.15, { type: 'sine', vol: 0.15 }); },
  door_close: (a, t) => { a.noise(t, 0.1, { freq: 240, vol: 0.14 }); a.tone(t + 0.04, 95, 0.12, { type: 'sine', vol: 0.16 }); },
  encounter: (a, t) => { a.noise(t, 0.5, { freq: 800, sweep: 6, vol: 0.2 }); [0, 3, 6, 9].forEach((s, i) => a.tone(t + i * 0.05, 440 * 2 ** (s / 12), 0.15, { type: 'sawtooth', vol: 0.05, filter: 3000 })); },
  slash: (a, t) => a.noise(t, 0.16, { freq: 3500, sweep: 0.3, vol: 0.3, q: 2 }),
  hit: (a, t) => { a.noise(t, 0.08, { freq: 1500, vol: 0.3 }); a.tone(t, 200, 0.08, { type: 'sine', vol: 0.2, slide: 0.5 }); },
  blunt: (a, t) => { a.noise(t, 0.12, { freq: 500, vol: 0.4, type: 'lowpass' }); a.tone(t, 110, 0.15, { type: 'sine', vol: 0.3, slide: 0.5 }); },
  bow: (a, t) => { a.tone(t, 300, 0.1, { type: 'triangle', vol: 0.1, slide: 2 }); a.noise(t + 0.05, 0.12, { freq: 4000, sweep: 0.5, vol: 0.15 }); },
  gun: (a, t) => { a.noise(t, 0.25, { freq: 900, type: 'lowpass', vol: 0.5 }); a.tone(t, 80, 0.2, { type: 'sine', vol: 0.3, slide: 0.4 }); },
  fire: (a, t) => a.noise(t, 0.6, { freq: 900, sweep: 0.4, vol: 0.35, type: 'lowpass' }),
  ice: (a, t) => { [0, 5, 9].forEach((s, i) => a.tone(t + i * 0.04, 2000 * 2 ** (s / 12), 0.3, { type: 'sine', vol: 0.06 })); a.noise(t, 0.3, { freq: 6000, vol: 0.12 }); },
  bolt: (a, t) => { a.noise(t, 0.35, { freq: 3000, vol: 0.4, q: 0.5 }); a.tone(t, 60, 0.3, { type: 'sawtooth', vol: 0.15, filter: 400 }); },
  wind: (a, t) => a.noise(t, 0.6, { freq: 600, sweep: 4, vol: 0.25, q: 3 }),
  holy: (a, t) => [0, 7, 12, 19].forEach((s, i) => a.tone(t + i * 0.03, 880 * 2 ** (s / 12), 0.7, { type: 'sine', vol: 0.06 })),
  dark: (a, t) => { a.tone(t, 110, 0.6, { type: 'sawtooth', vol: 0.12, slide: 0.5, filter: 600 }); a.noise(t, 0.5, { freq: 300, vol: 0.2, sweep: 0.5 }); },
  quake: (a, t) => a.noise(t, 0.7, { freq: 100, type: 'lowpass', vol: 0.6 }),
  burst: (a, t) => { a.noise(t, 0.4, { freq: 1200, sweep: 0.2, vol: 0.45, type: 'lowpass' }); a.tone(t, 90, 0.3, { type: 'sine', vol: 0.3, slide: 0.4 }); },
  heal: (a, t) => [0, 4, 7, 12, 16].forEach((s, i) => a.tone(t + i * 0.06, 660 * 2 ** (s / 12), 0.4, { type: 'sine', vol: 0.06 })),
  revive: (a, t) => [0, 7, 12, 16, 19, 24].forEach((s, i) => a.tone(t + i * 0.07, 523 * 2 ** (s / 12), 0.6, { type: 'sine', vol: 0.07 })),
  buff: (a, t) => [0, 4, 7].forEach((s, i) => a.tone(t + i * 0.05, 523 * 2 ** (s / 12), 0.25, { type: 'triangle', vol: 0.07 })),
  debuff: (a, t) => [7, 4, 0].forEach((s, i) => a.tone(t + i * 0.06, 440 * 2 ** (s / 12), 0.25, { type: 'triangle', vol: 0.07 })),
  song: (a, t) => [0, 4, 7, 11, 12].forEach((s, i) => a.tone(t + i * 0.09, 659 * 2 ** (s / 12), 0.35, { type: 'sine', vol: 0.06 })),
  summon: (a, t) => { a.noise(t, 1.0, { freq: 200, sweep: 10, vol: 0.3 }); [0, 7, 12].forEach((s) => a.tone(t + 0.3, 220 * 2 ** (s / 12), 1.0, { type: 'sawtooth', vol: 0.05, filter: 2000 })); },
  throw: (a, t) => a.noise(t, 0.2, { freq: 2000, sweep: 0.5, vol: 0.15 }),
  steal: (a, t) => { a.tone(t, 1200, 0.05, { vol: 0.06 }); a.tone(t + 0.06, 1800, 0.05, { vol: 0.06 }); },
  jump: (a, t) => a.tone(t, 200, 0.3, { type: 'triangle', vol: 0.12, slide: 4 }),
  cast: (a, t) => a.tone(t, 440, 0.25, { type: 'sine', vol: 0.06, slide: 2 }),
  hurt: (a, t) => a.noise(t, 0.15, { freq: 800, vol: 0.25, type: 'lowpass' }),
  ko: (a, t) => a.tone(t, 330, 0.5, { type: 'triangle', vol: 0.1, slide: 0.3 }),
  enemyDie: (a, t) => { a.noise(t, 0.5, { freq: 3000, sweep: 0.2, vol: 0.2 }); a.tone(t, 600, 0.4, { type: 'square', vol: 0.04, slide: 0.2, filter: 2000 }); },
  windup: (a, t) => { a.tone(t, 98, 0.9, { type: 'sawtooth', vol: 0.08, slide: 2.5, filter: 900 }); a.noise(t, 0.9, { freq: 180, sweep: 6, vol: 0.12 }); },
  interrupt: (a, t) => { a.noise(t, 0.35, { freq: 6500, vol: 0.3, q: 0.6 }); [24, 19, 12, 7].forEach((s, i) => a.tone(t + i * 0.035, 660 * 2 ** (s / 12), 0.25, { type: 'triangle', vol: 0.06 })); },
  break: (a, t) => { a.noise(t, 0.4, { freq: 5000, vol: 0.35, q: 0.4 }); [12, 7, 0].forEach((s, i) => a.tone(t + i * 0.04, 880 * 2 ** (s / 12), 0.3, { type: 'square', vol: 0.05, filter: 5000 })); },
  flee: (a, t) => [0, 1, 2, 3].forEach((i) => a.noise(t + i * 0.07, 0.06, { freq: 900, vol: 0.12 })),
  surge: (a, t) => a.tone(t, 330, 0.25, { type: 'sawtooth', vol: 0.06, slide: 3, filter: 3000 }),
};
SFX.weak = SFX.break;

// ---------------------------------------------------------------- song building

/**
 * Song format (see songs.js):
 *  { bpm, bars, chords: ['Am','F',...] (one per bar unless chordLen), chordLen (steps),
 *    melody: 'e5:2 ...', melody2, inst: {melody, melody2}, style: {arp, pad, bass, drums, arpPattern} }
 */
export function buildTracks(song) {
  const tracks = [];
  const barSteps = song.barSteps || 16;
  const chordLen = song.chordLen || barSteps;
  const chords = (song.chords || []).map(parseChord);
  const totalFromChords = chords.length * chordLen;
  const style = song.style || {};

  const lineTrack = (str, inst, vol = 1, transpose = 0) => {
    const ev = new Map();
    let step = 0;
    for (const n of parseLine(str)) {
      if (n.notes.length) ev.set(step, n.notes.map((m) => ({ midi: m + transpose, len: n.len * 0.95, vel: 1 })));
      step += n.len;
    }
    return { inst, vol, events: ev, totalSteps: Math.max(step, totalFromChords) };
  };

  if (song.melody) tracks.push(lineTrack(song.melody, song.inst?.melody || 'flute', song.melodyVol ?? 1));
  if (song.melody2) tracks.push(lineTrack(song.melody2, song.inst?.melody2 || 'strings', song.melody2Vol ?? 0.8));
  if (song.bassLine) tracks.push(lineTrack(song.bassLine, 'bass', 1));

  if (chords.length) {
    const total = Math.max(totalFromChords, ...tracks.map((t) => t.totalSteps));
    const chordAt = (step) => chords[Math.floor((step % totalFromChords) / chordLen)];
    const chordMidi = (c, octave) => c.tones.map((s) => 12 * (octave + 1) + c.root + s);

    if (style.pad) {
      const ev = new Map();
      for (let s = 0; s < total; s += chordLen) {
        const c = chordAt(s);
        ev.set(s, chordMidi(c, style.padOctave ?? 4).map((m) => ({ midi: m, len: chordLen * 0.98, vel: 1 })));
      }
      tracks.push({ inst: style.pad === true ? 'pad' : style.pad, vol: style.padVol ?? 0.9, events: ev, totalSteps: total });
    }
    if (style.arp) {
      const pattern = style.arpPattern || [0, 1, 2, 3, 2, 1, 0, 1];
      const rate = style.arpRate || 2;
      const ev = new Map();
      for (let s = 0; s < total; s += rate) {
        const c = chordAt(s);
        const tones = chordMidi(c, style.arpOctave ?? 4);
        const ext = [...tones, tones[0] + 12, tones[1] + 12];
        const idx = pattern[(s / rate) % pattern.length];
        if (idx < 0) continue;
        ev.set(s, [{ midi: ext[idx % ext.length], len: rate * 1.6, vel: 0.85 }]);
      }
      tracks.push({ inst: style.arp, vol: style.arpVol ?? 0.8, events: ev, totalSteps: total });
    }
    if (style.bass) {
      const ev = new Map();
      const pat = style.bass === 'pulse' ? [0, 4, 8, 12] : style.bass === 'drive' ? [0, 2, 4, 6, 8, 10, 12, 14] : style.bass === 'walk' ? [0, 4, 8, 12] : [0, 8];
      for (let s = 0; s < total; s++) {
        const inBar = s % chordLen;
        if (!pat.includes(inBar % 16)) continue;
        const c = chordAt(s);
        let m = 12 * 3 + c.bass;
        if (style.bass === 'walk' && inBar % 16 === 8) m += 7;
        if (style.bass === 'drive' && inBar % 4 === 2) m += 12;
        ev.set(s, [{ midi: m, len: style.bass === 'drive' ? 1.8 : 3.5, vel: 1 }]);
      }
      tracks.push({ inst: 'bass', vol: style.bassVol ?? 1, events: ev, totalSteps: total });
    }
    if (style.drums) {
      const kit = DRUMS[style.drums];
      for (const [inst, pattern, vol] of kit) {
        const ev = new Map();
        for (let s = 0; s < total; s++) {
          const ch = pattern[s % pattern.length];
          if (ch === 'x' || ch === 'X') ev.set(s, [{ midi: inst === 'timpani' ? 12 * 3 + chordAt(s).root : 60, len: 2, vel: ch === 'X' ? 1 : 0.6 }]);
        }
        tracks.push({ inst, vol, events: ev, totalSteps: total });
      }
    }
  }
  return tracks;
}

const DRUMS = {
  march: [['kick', 'x.......x.......', 0.8], ['snare', '....x.......x.x.', 0.7], ['hat', 'x.x.x.x.x.x.x.x.', 0.6]],
  battle: [['kick', 'X..x..x.X..x....', 1], ['snare', '....X.......X..x', 0.9], ['hat', 'xxxxxxxxxxxxxxxx', 0.5]],
  boss: [['kick', 'X.x.X.x.X.x.X.xx', 1], ['snare', '....X.......X.X.', 1], ['hat', 'x.xxx.xxx.xxx.xx', 0.6], ['timpani', 'X...............X.......X...X...', 0.6]],
  soft: [['kick', 'x...............', 0.5], ['hat', '..x...x...x...x.', 0.35]],
  town: [['kick', 'x.......x.......', 0.6], ['snare', '....x.......x...', 0.4], ['hat', 'x.x.x.x.x.x.x.x.', 0.35]],
  timpani: [['timpani', 'X.......x.......', 0.8]],
  heartbeat: [['kick', 'X..x............', 0.8]],
};
