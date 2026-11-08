// The opening movie (~75 s): the cast, the world, a few battles and the end of the
// sun, cut to music like an anime-style JRPG opening. Staged live from the game's
// own maps, sprites and moods; the screenplay is data in story/opening.js.
// Confirm, Cancel or Menu skips.
//
//   const op = new OpeningScene(game);
//   await game.setScene(op);
//   await op.done;            // the screen is left black for whatever comes next
//
// Shot spec: { id, dur, stage: { map, mood } | { battle: bg } | {}, cut: 'hard'|'white'|'black',
//   cutDur, cam: { at, dist, pitch, yaw, lift, fov } (numbers or [from, to]; `at` is a
//   tile [x, y] or [[x0, y0], [x1, y1]]), ease, cast, text: [captions], cues: [{ at, ... }],
//   sky: 'sun'|'split', sunY, focus: [y, band], outro: seconds of fade-out at the very end }.
// Cues: { music } { stopMusic: fade } { sfx } { shake: [intensity, sec] } { flash: color, dur } { beat }.

import * as THREE from 'three';
import { keyCap } from '../core/Input.js';
import { easeInOutSine, easeOutCubic, lerp } from '../core/util.js';
import { el } from '../ui/UI.js';
import { OPENING } from '../story/opening.js';
import { makeStage, stageKey } from './OpeningStages.js';
import { Captions } from './OpeningCaptions.js';

const CUT_DUR = { hard: 0, white: 0.3, black: 0.7 };
const SKIP_FADE = 0.6;
const EASES = { inout: easeInOutSine, linear: (t) => t, out: easeOutCubic };
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const kv = (v, k) => (Array.isArray(v) ? lerp(v[0], v[1], k) : v);
const kp = (v, k) => (Array.isArray(v[0]) ? [lerp(v[0][0], v[1][0], k), lerp(v[0][1], v[1][1], k)] : v);
const cutDur = (shot) => shot.cutDur ?? CUT_DUR[shot.cut || 'hard'];

export class OpeningScene {
  /** @param {{ shots?: object[], from?: number }} [opts]  `from` starts mid-movie (debugging, frame grabs). */
  constructor(game, opts = {}) {
    const { shots = OPENING, from = 0 } = opts;
    this.game = game;
    this.shots = shots;
    this.index = Math.max(0, Math.min(shots.length - 1, from)) - 1;
    this.time = 0;
    this.finished = false;
    this.log = []; // [{ id, buildMs }] — one entry per shot played (tests read it)
    this.done = new Promise((resolve) => { this.resolveDone = resolve; });
  }

  get shotId() { return this.shot?.id; }

  enter() {
    const game = this.game;
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.3, 500);
    this.root = el('div', 'opening', `<div class="op-bar top"></div><div class="op-bar bottom"></div><div class="op-captions"></div><div class="op-skip">${keyCap('cancel')} Skip</div>`);
    game.ui.layers.hud.appendChild(this.root);
    this.captions = new Captions(this.root.querySelector('.op-captions'));
    this.skipEl = this.root.querySelector('.op-skip');
    this.widget = { el: null, handleInput: (input) => this.handleInput(input) };
    game.ui.push(this.widget);
    game.faderEl.style.background = '#000';
    this.startShot(this.index + 1);
  }

  handleInput(input) {
    if (!['confirm', 'cancel', 'menu'].some((a) => input.pressed(a))) return;
    input.consumeAll();
    if (this.time > 0.5) this.skip(); // the key that started the movie mustn't end it
  }

  /** Fade to black and end early. */
  skip() {
    if (this.skipping || this.finished) return;
    this.skipping = true;
    this.skipT = 0;
    this.game.audio?.stopMusic(SKIP_FADE);
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    this.game.faderEl.style.opacity = '1';
    this.game.renderer.setFlash(0);
    this.captions.clear();
    this.resolveDone();
  }

  exit() {
    this.finish();
    this.stage?.dispose();
    this.game.ui.remove(this.widget);
    this.root.remove();
  }

  // ------------------------------------------------------------------ shots

  startShot(i) {
    if (i >= this.shots.length) { this.finish(); return; }
    this.index = i;
    const shot = this.shots[i];
    this.shot = shot;
    this.t = 0;
    this.cueIndex = 0;
    this.cues = [...(shot.music ? [{ at: 0, music: shot.music }] : []), ...(shot.cues || [])].sort((a, b) => a.at - b.at);
    this.flash = null;
    this.shake = null;
    this.sunMesh?.removeFromParent();
    this.sunMesh = null;

    const t0 = performance.now();
    if (this.stage?.key !== stageKey(shot.stage || {})) {
      this.stage?.dispose();
      this.stage = makeStage(this.game, this.camera, shot.stage || {});
    } else {
      this.stage.clearCast();
    }
    this.stage.cast(shot.cast);
    if (shot.sky === 'sun') this.addSun();
    this.log.push({ id: shot.id, buildMs: Math.round(performance.now() - t0) });

    this.stage.apply(this.game.renderer);
    this.game.renderer.setFocus(...(shot.focus || [0.47, 0.14]));
    this.captions.set(shot.text, shot.dur);
  }

  update(dt) {
    if (this.finished) return;
    // The movie keeps time with its music: real seconds, whatever Fast Mode is set to.
    const real = dt / Math.max(1e-6, this.game.timeScale * this.game.speedFactor);
    this.time += real;
    this.t += real;
    if (this.skipping && (this.skipT += real) >= SKIP_FADE) { this.finish(); return; }
    while (this.t >= this.shot.dur) {
      const over = this.t - this.shot.dur;
      this.startShot(this.index + 1);
      if (this.finished) return;
      this.t = over;
    }
    this.fireCues();
    const k = (EASES[this.shot.ease] || EASES.inout)(clamp01(this.t / this.shot.dur));
    this.updateCamera(k);
    this.stage.update(real, this.time, this.t, this.focus);
    this.updateSky();
    this.captions.update(this.t);
    this.updateCover();
    this.skipEl.style.opacity = String(clamp01((this.time - 1) / 0.6) * 0.75);
  }

  fireCues() {
    const audio = this.game.audio;
    while (this.cueIndex < this.cues.length && this.cues[this.cueIndex].at <= this.t) {
      const c = this.cues[this.cueIndex++];
      if (c.music) audio?.playMusic(c.music, { restart: true, fadeIn: c.fadeIn ?? 0.05 });
      if (c.stopMusic !== undefined) audio?.stopMusic(c.stopMusic);
      if (c.sfx) audio?.sfx(c.sfx);
      if (c.shake) this.shake = { intensity: c.shake[0], dur: c.shake[1], start: c.at };
      if (c.flash) this.flash = { color: c.flash, dur: c.dur ?? 0.35, start: c.at };
      if (c.beat) this.stage.beat?.(c.beat);
    }
  }

  // ------------------------------------------------------------------ camera & cover

  updateCamera(k) {
    const c = this.shot.cam || { at: [0, 0] };
    const [fx, fy] = kp(c.at, k);
    const focus = this.stage.point(fx, fy, kv(c.lift ?? 1, k));
    const dist = kv(c.dist ?? 12, k), pitch = kv(c.pitch ?? 0.3, k), yaw = kv(c.yaw ?? 0, k);
    const cam = this.camera;
    cam.position.set(
      focus.x + Math.sin(yaw) * Math.cos(pitch) * dist,
      focus.y + Math.sin(pitch) * dist,
      focus.z + Math.cos(yaw) * Math.cos(pitch) * dist,
    );
    const st = this.shake ? (this.t - this.shake.start) / this.shake.dur : 1;
    if (st < 1) {
      const s = this.shake.intensity * (1 - st) * this.game.shakeScale;
      cam.position.x += (Math.random() - 0.5) * s;
      cam.position.y += (Math.random() - 0.5) * s;
    }
    cam.lookAt(focus);
    cam.fov = kv(c.fov ?? 30, k);
    this.focus = focus;
  }

  /** Cuts dip through white (the renderer's flash) or black (the screen fader). */
  updateCover() {
    const shot = this.shot, next = this.shots[this.index + 1];
    let black = 0, white = 0, color = '#ffffff';
    const cover = (type, a) => { if (type === 'black') black = Math.max(black, a); else if (type === 'white') white = Math.max(white, a); };
    const dIn = cutDur(shot) * 0.6;
    if (dIn > 0 && this.t < dIn) cover(shot.cut, 1 - this.t / dIn);
    const dOut = next ? cutDur(next) * 0.4 : shot.outro || 0;
    if (dOut > 0 && this.t > shot.dur - dOut) cover(next ? next.cut : 'black', (this.t - (shot.dur - dOut)) / dOut);
    const f = this.flash ? 1 - (this.t - this.flash.start) / this.flash.dur : 0;
    if (f > white) { white = f; color = this.flash.color; }
    if (this.skipping) black = Math.max(black, this.skipT / SKIP_FADE);
    this.game.faderEl.style.opacity = String(clamp01(black));
    this.game.renderer.setFlash(clamp01(white), color);
  }

  // ------------------------------------------------------------------ the sun

  addSun() {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: sunTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    m.renderOrder = -1;
    this.stage.scene.add(m);
    this.sunMesh = m;
  }

  /** Where the sun hangs: far ahead of the camera, above the horizon. */
  sunPosition() {
    const cam = this.camera;
    const fwd = new THREE.Vector3();
    cam.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    const p = cam.position.clone().addScaledVector(fwd, 90);
    p.y = cam.position.y + (this.shot.sunY ?? 9);
    return p;
  }

  /** 'sun': a whole sun on the horizon. 'split': the seven sky-wounds burst out of it. */
  updateSky() {
    const sky = this.shot.sky;
    if (!sky) return;
    const sun = this.sunPosition();
    if (sky === 'sun' && this.sunMesh) {
      this.sunMesh.position.copy(sun);
      this.sunMesh.quaternion.copy(this.camera.quaternion);
      this.sunMesh.scale.setScalar(20 * (1 + 0.03 * Math.sin(this.time * 2)));
    }
    if (sky === 'split') {
      const k = easeOutCubic(clamp01(this.t / 1.8));
      for (const w of this.stage.atmos?.wounds || []) {
        w.position.lerpVectors(sun, w.position.clone(), k);
        w.scale.multiplyScalar(lerp(0.45, 1, k));
      }
    }
  }

  render(time) { this.game.renderer.render(this.stage.scene, this.camera, time); }
}

let sunTex = null;
function sunTexture() {
  if (sunTex) return sunTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,252,236,1)');
  g.addColorStop(0.2, 'rgba(255,236,190,1)');
  g.addColorStop(0.32, 'rgba(255,190,110,0.75)');
  g.addColorStop(0.6, 'rgba(255,130,70,0.25)');
  g.addColorStop(1, 'rgba(255,90,50,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  sunTex = new THREE.CanvasTexture(cv);
  return sunTex;
}
