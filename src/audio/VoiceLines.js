// Recorded voice lines (optional). The game ships with none: dialogue "speaks" in
// typing blips (data/voices.js). Drop recordings into voice/ and they play instead.
//
// Every line of dialogue has a stable id, '<speaker>/<12 hex>', derived from who says
// it and its text (script/Lines.js → voiceId). voice/manifest.json lists the ids that
// have a recording:  { "format": "afterlight-voice", "version": 1,
//                      "lines": { "wren/3f9a1c22b7e4": "wren/3f9a1c22b7e4.ogg" } }
// `tools/voice.py export` writes the script with its ids (voice/lines.csv) and
// `tools/voice.py manifest` rebuilds the manifest from the files present.
// See voice/README.md.

const FORMAT = 'afterlight-voice';

/**
 * A line being spoken.
 * @typedef {object} VoiceHandle
 * @property {string} id
 * @property {boolean} done   it finished (or was stopped, or failed to load)
 * @property {() => void} stop
 */

export class VoiceLines {
  /**
   * @param {import('./Audio.js').AudioEngine} audio
   * @param {string} [base] folder holding manifest.json and the recordings
   */
  constructor(audio, base = 'voice/') {
    this.audio = audio;
    this.base = base;
    /** @type {Record<string, string>} id -> file (relative to base) */
    this.lines = {};
    /** @type {Map<string, Promise<AudioBuffer | null>>} decoded recordings */
    this.cache = new Map();
    /** @type {VoiceHandle | null} */
    this.current = null;
    this.ready = this.load();
  }

  /** How many lines have a recording. */
  get count() { return Object.keys(this.lines).length; }

  has(id) { return Object.prototype.hasOwnProperty.call(this.lines, id); }

  /** Read the manifest; a missing or foreign one simply means no voice. */
  async load() {
    try {
      const res = await fetch(`${this.base}manifest.json`, { cache: 'no-cache' });
      if (!res.ok) return;
      const m = await res.json();
      if (m?.format === FORMAT && m.lines && typeof m.lines === 'object') this.lines = m.lines;
    } catch { /* no voice pack */ }
  }

  /** Fetch and decode a recording (once). */
  buffer(id) {
    if (!this.cache.has(id)) {
      const ctx = this.audio.ctx;
      this.cache.set(id, fetch(this.base + this.lines[id])
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${r.status}`))))
        .then((data) => ctx.decodeAudioData(data))
        .catch((err) => { console.warn(`Voice line ${id} failed to load: ${err.message}`); return null; }));
    }
    return this.cache.get(id);
  }

  /** Warm the cache for lines about to be spoken. */
  preload(ids) { if (this.audio.ctx) for (const id of ids) if (this.has(id)) this.buffer(id); }

  /**
   * Speak a line if it has a recording (and sound is on). Any line still playing is
   * cut off; the music ducks under the voice. Returns null when there is nothing to play.
   * @param {string} id
   * @returns {VoiceHandle | null}
   */
  play(id) {
    const audio = this.audio;
    if (!audio.ctx || !this.has(id) || audio.voiceVol <= 0) return null;
    this.current?.stop();
    let source = null;
    const handle = { id, done: false, stop: () => finish(true) };
    const finish = (cut) => {
      if (handle.done) return;
      handle.done = true;
      if (cut && source) {
        // A short fade instead of a click.
        const t = audio.ctx.currentTime;
        gain.gain.setTargetAtTime(0, t, 0.02);
        source.stop(t + 0.12);
      }
      if (this.current === handle) { this.current = null; audio.duck(false); }
    };
    const gain = audio.ctx.createGain();
    gain.connect(audio.voiceBus);
    this.current = handle;
    audio.duck(true);
    this.buffer(id).then((buf) => {
      if (!buf || handle.done) { finish(false); return; }
      source = audio.ctx.createBufferSource();
      source.buffer = buf;
      source.connect(gain);
      source.onended = () => finish(false);
      source.start();
    });
    return handle;
  }

  stop() { this.current?.stop(); }
}
