// The corner of the screen during a scene: how to move the text along, how to skip the
// scene, and whether it is running fast (>>). Also the hold-to-skip itself: holding
// Menu for a second starts a skip (Game.startSkip), which fast-forwards the scene behind
// a black curtain until it ends or needs the player.

import { el } from './UI.js';
import { keyCap } from '../core/Input.js';

const HOLD = 1.0; // seconds of holding Menu to skip
const SHOW_AFTER = 0.8; // seconds into a scene before the hints fade in
const CURTAIN_IN = 0.2, CURTAIN_OUT = 0.3;

export class SceneHints {
  constructor(game) {
    this.game = game;
    this.el = el('div', 'scene-hints');
    this.curtain = el('div', 'skip-curtain');
    const app = document.getElementById('app');
    app?.append(this.curtain, this.el);
    this.hold = 0; // seconds Menu has been held
    this.sceneT = 0; // seconds this scene has been running
    this.cover = 0; // curtain opacity
    this.key = '';
  }

  /** The field scene whose script is running (or about to), if any. */
  scene() {
    const g = this.game, sc = g.scene;
    if (!sc || g.sceneStack?.length || typeof sc.runScript !== 'function') return null;
    return sc.busy || sc.pendingScript ? sc : null;
  }

  /** Per frame, on the UI clock (Fast Mode doesn't shorten the hold). */
  update(dt) {
    const g = this.game;
    const sc = this.scene();
    const top = g.ui?.top();
    const reading = !top || top.isDialogue || top.isMessage; // nothing else is asking for input
    this.sceneT = sc ? this.sceneT + dt : 0;

    // Hold Menu to skip.
    const canSkip = !!sc && reading && !g.skipping && !sc.noSkip;
    if (canSkip && g.input.down('menu')) {
      this.hold += dt;
      if (this.hold >= HOLD) { this.hold = 0; g.startSkip(); }
    } else {
      this.hold = 0;
    }

    // The curtain: down quickly when a skip starts, up when it is over.
    const target = g.skipping ? 1 : 0;
    if (this.cover !== target) {
      const step = dt / (target ? CURTAIN_IN : CURTAIN_OUT);
      this.cover = target ? Math.min(1, this.cover + step) : Math.max(0, this.cover - step);
      this.curtain.style.opacity = String(this.cover);
    }

    const s = g.state?.settings || {};
    const show = !s.hideSceneHints && (g.skipping || (sc && reading && (this.sceneT > SHOW_AFTER || this.hold > 0)));
    this.el.classList.toggle('show', !!show);
    if (g.fastBadge) g.fastBadge.style.visibility = show ? 'hidden' : ''; // the hints carry the >> while they are up
    if (!show) return;
    const fast = s.fastMode ? s.fastSpeed || 3 : 0;
    const pct = Math.round(Math.min(1, this.hold / HOLD) * 100);
    const key = `${g.skipping}|${fast}|${pct}|${!!sc?.noSkip}|${!!top?.isDialogue}`;
    if (key === this.key) return;
    this.key = key;
    if (g.skipping) {
      this.el.innerHTML = '<span class="sh-item sh-skipping"><b>&gt;&gt;&gt;</b> Skipping</span>';
      return;
    }
    const line = top?.isDialogue ? `<span class="sh-item">${keyCap('confirm')} Next</span><span class="sh-item">${keyCap('up')} Backlog</span>` : '';
    const speed = `<span class="sh-item sh-fast ${fast ? 'on' : ''}">${keyCap('fast')} ${fast ? `<b>&gt;&gt;</b> ×${fast}` : 'Fast'}</span>`;
    const skip = sc?.noSkip
      ? '<span class="sh-item sh-skip off">This scene can\'t be skipped</span>'
      : `<span class="sh-item sh-skip"><i style="width:${pct}%"></i><span>Hold ${keyCap('menu')} Skip scene</span></span>`;
    this.el.innerHTML = line + speed + skip;
  }
}
