// Game: owns the renderer, input, audio, UI and persistent state, runs the
// main loop and switches between scenes (Title, Field, Battle...).

import { Renderer } from '../render/Renderer.js';
import { Input } from './Input.js';
import { clamp } from './util.js';

export class Game {
  constructor({ canvas, uiRoot, fader }) {
    this.canvas = canvas;
    this.uiRoot = uiRoot;
    this.faderEl = fader;
    this.renderer = new Renderer(canvas);
    this.input = new Input();
    this.time = 0;
    this.scene = null;
    this.tasks = new Set(); // per-frame updaters: fn(dt) -> true when done
    this.timeScale = 1;
    // Wired up by main.js (and the test harness):
    this.autoConfirm = false; // headless tests: dialogue advances itself
    /** @type {import('../ui/Menus.js').MenuSystem | null} */
    this.menus = null;
    /** @type {(() => Promise<void>) | null} */
    this.returnToTitle = null;
    /** @type {(() => void | Promise<void>) | null} */
    this.onGameOver = null;
    /** @type {((msg: string) => void) | null} battle tracing for ?debug runs */
    this.debugTrace = null;
    const params = new URLSearchParams(location.search);
    this.debug = params.has('debug');
    this.maxDt = Number(params.get('dtmax')) || 0.05; // raised only for headless testing
    this.renderEvery = Number(params.get('sim')) || 1; // headless testing: skip frames
    this.autoBattle = params.has('auto');
    this.debugMood = params.get('mood'); // ?mood=<id> previews a map under another mood
    this._frame = 0;
    this._last = performance.now();
    this._transitioning = false;
    this.shakeScale = 1; // set by applySettings()
  }

  /** Apply the player's settings to every subsystem (audio, text, comfort options). */
  applySettings(settings = this.state.settings) {
    this.input.setBindings(settings.keys);
    this.audio?.setVolumes(settings.musicVolume, settings.sfxVolume);
    this.ui?.applySettings(settings);
    const reduced = !!settings.reduceEffects;
    this.renderer.flashScale = reduced ? 0.25 : 1;
    this.shakeScale = reduced ? 0.3 : 1;
    this.showFastBadge(settings.fastMode ? settings.fastSpeed || 3 : 0);
  }

  /** Small "▶▶ ×3" badge in the corner while Fast Mode is on. */
  showFastBadge(speed) {
    if (!this.fastBadge) {
      this.fastBadge = document.createElement('div');
      this.fastBadge.className = 'fast-badge';
      document.getElementById('app')?.appendChild(this.fastBadge);
    }
    this.fastBadge.textContent = speed ? `▶▶ ×${speed}` : '';
    this.fastBadge.style.display = speed ? '' : 'none';
  }

  /** Inject subsystems created in main.js (keeps construction order explicit). */
  attach({ ui, audio, state }) {
    this.ui = ui;
    this.audio = audio;
    this.state = state;
  }

  /** Enter the first scene and start the loop. Resolves once the scene has entered. */
  start(firstScene, params) {
    const ready = this.setScene(firstScene, params);
    // Headless test mode (sim>1) drives the loop with timers, which advance
    // under virtual time even when no frames are being composited.
    const schedule = this.renderEvery > 1 ? (fn) => setTimeout(() => fn(performance.now()), 16) : requestAnimationFrame.bind(window);
    const frame = (now) => {
      const dt = clamp((now - this._last) / 1000, 0, this.maxDt);
      this._last = now;
      this.tick(dt);
      schedule(frame);
    };
    schedule(frame);
    return ready;
  }

  /**
   * Fast Mode multiplier (Settings / T / left-stick click). It scales the game clock —
   * walking, cutscenes, battles, dialogue typing — but not the UI clock, so menus,
   * key repeat and minigame timing stay real-time.
   */
  get speedFactor() {
    const s = this.state?.settings;
    return s?.fastMode ? s.fastSpeed || 3 : 1;
  }

  toggleFastMode() {
    const s = this.state.settings;
    s.fastMode = !s.fastMode;
    this.applySettings(s);
    this.audio?.sfx('cursor');
    this.ui?.toast(s.fastMode ? `Fast Mode ×${s.fastSpeed || 3}` : 'Fast Mode off', 1200);
  }

  tick(rawDt) {
    const dt = rawDt * this.timeScale * this.speedFactor;
    this.time += dt;
    this.input.update(rawDt);
    if (this.input.pressed('fast') && this.state) { this.input.consume('fast'); this.toggleFastMode(); }

    for (const task of [...this.tasks]) {
      if (task(dt)) this.tasks.delete(task);
    }

    if (this.autoConfirm) {
      // Headless tests press confirm to advance dialogue — but never in the
      // free-roaming field, where it would keep talking to whoever is in front.
      const roaming = this.scene?.player && !this.scene.busy && !this.ui?.top();
      this._autoT = (this._autoT || 0) + rawDt;
      if (this._autoT > 0.12) { this._autoT = 0; if (!roaming) this.input.edges.add('confirm'); }
    }
    const uiTookInput = this.ui ? this.ui.update(rawDt, this.input) : false;
    if (this.scene) {
      this.scene.update(dt, !uiTookInput && !this._transitioning);
      if (++this._frame % this.renderEvery === 0) this.scene.render(this.time);
    }
    this.state?.tickPlaytime(rawDt);
    if (this.debug) this.updateDebugHud(rawDt);
    this.input.endFrame();
  }

  async setScene(scene, params) {
    if (this.scene) this.scene.exit();
    this.scene = scene;
    await scene.enter(params);
  }

  /**
   * Run a scene on top of the current one (battles). The current scene is
   * paused, not exited. Resolves with the value passed to popScene().
   */
  pushScene(scene, params) {
    return new Promise((resolve) => {
      const prev = this.scene;
      prev?.pause?.();
      this.sceneStack = this.sceneStack || [];
      this.sceneStack.push({ scene: prev, resolve });
      this.scene = scene;
      scene.enter(params);
    });
  }

  /** End the pushed scene and resume the one underneath. */
  popScene(result) {
    const top = this.sceneStack?.pop();
    if (!top) return;
    this.scene.exit();
    this.scene = top.scene;
    this.scene?.resume?.();
    top.resolve(result);
  }

  /** ?debug overlay: frame rate and renderer cost. */
  updateDebugHud(dt) {
    if (!this.debugEl) {
      this.debugEl = document.createElement('div');
      this.debugEl.style.cssText = 'position:fixed;right:6px;bottom:6px;font:11px monospace;color:#9f9;background:rgba(0,0,0,.6);padding:4px 6px;z-index:60;pointer-events:none';
      document.body.appendChild(this.debugEl);
      this._fps = 60;
    }
    this._fps = this._fps * 0.95 + (1 / Math.max(dt, 1e-3)) * 0.05;
    const info = this.renderer.gl.info;
    this.debugEl.textContent = `${this._fps.toFixed(0)} fps · ${info.render.calls} calls · ${(info.render.triangles / 1000).toFixed(1)}k tris · ${info.programs?.length ?? 0} programs`;
  }

  /** Hook set by main.js: show game over and return to title. */
  async gameOver() {
    if (this.onGameOver) await this.onGameOver();
  }

  /** Fade out, swap scene, fade in. */
  async transition(scene, params, { out = 0.35, in: inn = 0.45, color = '#000' } = {}) {
    this._transitioning = true;
    await this.fadeOut(out, color);
    await this.setScene(scene, params);
    this._transitioning = false;
    await this.fadeIn(inn);
  }

  // ---- timing helpers -------------------------------------------------------

  /** Resolve after `seconds` of game time. */
  wait(seconds) {
    return new Promise((resolve) => {
      let t = 0;
      this.tasks.add((dt) => {
        t += dt;
        if (t >= seconds) { resolve(); return true; }
        return false;
      });
    });
  }

  /** Run fn(t in 0..1) over `duration`, resolving at the end. */
  tween(duration, fn, ease = (t) => t) {
    return new Promise((resolve) => {
      let t = 0;
      fn(0);
      this.tasks.add((dt) => {
        t += dt;
        const k = Math.min(1, t / Math.max(1e-4, duration));
        fn(ease(k));
        if (k >= 1) { resolve(); return true; }
        return false;
      });
    });
  }

  // ---- screen fades -------------------------------------------------------

  fadeOut(seconds = 0.4, color = '#000') {
    this.faderEl.style.background = color;
    return this._fade(1, seconds);
  }

  fadeIn(seconds = 0.4) { return this._fade(0, seconds); }

  _fade(target, seconds) {
    const el = this.faderEl;
    const from = parseFloat(el.style.opacity || '0');
    return this.tween(seconds, (t) => { el.style.opacity = String(from + (target - from) * t); });
  }
}
