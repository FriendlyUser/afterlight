// On-screen controls for phones and tablets.
//
// A D-pad under the left thumb, the action buttons under the right, shoulder buttons
// above each, and a small tray for the things a keyboard has spare keys for. They
// press the same actions the keyboard does (Input.touchPress), so every screen works
// without knowing about touch. They appear with the first touch and step aside when a
// key or a gamepad is used.

import { setHintDevice, TOUCH_NAMES } from '../core/Input.js';
import { touchFirst } from '../platform/Device.js';

const BUTTONS = [
  { action: 'confirm', cls: 'tc-a', title: 'Confirm · talk' },
  { action: 'cancel', cls: 'tc-b', title: 'Cancel · back' },
  { action: 'menu', cls: 'tc-menu', title: 'Menu · hold to skip a scene' },
  { action: 'info', cls: 'tc-y', title: 'Auto-battle · optimize' },
  { action: 'pageLeft', cls: 'tc-l', title: 'Previous · Surge down' },
  { action: 'pageRight', cls: 'tc-r', title: 'Next · Surge up' },
];

/** The tray: actions used a few times an hour, behind one button so they cost no screen. */
const TRAY = [
  { action: 'fast', label: '» Fast' },
  { action: 'map', label: 'Map' },
  { action: 'ride', label: 'Ride' },
  { setting: 'autoRun', label: 'Run' },
];

const DEAD_ZONE = 0.22; // of the pad's radius

/** Keep getting a finger's moves after it slides off the control. */
function capture(el, pointerId) {
  try { el.setPointerCapture(pointerId); } catch { /* the pointer is already gone: nothing to hold on to */ }
}
const DIRECTIONS = ['up', 'down', 'left', 'right'];

export class TouchControls {
  /** @param {import('../core/Game.js').Game} game */
  constructor(game) {
    this.game = game;
    this.input = game.input;
    this.shown = false;
    this.padPointer = null;
    this.padDirs = new Set();

    const root = this.root = document.createElement('div');
    root.className = 'touch-controls';
    root.innerHTML = `
      <div class="tc-pad"><i class="tc-up">▲</i><i class="tc-down">▼</i><i class="tc-left">◀</i><i class="tc-right">▶</i><b></b></div>
      ${BUTTONS.map((b) => `<div class="tc-btn ${b.cls}" data-action="${b.action}" title="${b.title}">${TOUCH_NAMES[b.action]}</div>`).join('')}
      <div class="tc-btn tc-more" title="More">⋯</div>
      <div class="tc-tray">${TRAY.map((t, i) => `<div class="tc-pill" data-tray="${i}">${t.label}</div>`).join('')}</div>`;
    document.getElementById('app')?.appendChild(root);

    this.pad = /** @type {HTMLElement} */ (root.querySelector('.tc-pad'));
    this.nub = /** @type {HTMLElement} */ (root.querySelector('.tc-pad b'));
    this.tray = /** @type {HTMLElement} */ (root.querySelector('.tc-tray'));
    this.bindPad();
    for (const b of root.querySelectorAll('.tc-btn[data-action]')) this.bindButton(/** @type {HTMLElement} */ (b));
    this.bindTray();

    // Any touch anywhere means fingers are the device in use; a tap on the game itself
    // advances the dialogue, the way every phone game does.
    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch' && !this.shown) return;
      if (e.pointerType === 'touch') this.input.lastDevice = 'touch';
      if (/** @type {HTMLElement} */ (e.target).closest?.('.touch-controls > *')) return;
      this.closeTray();
      const top = /** @type {any} */ (game.ui.top());
      if (top?.isDialogue || top?.isMessage) this.input.tap('confirm');
    });
    // A long press must not open the browser's menu or select text under the thumb.
    window.addEventListener('contextmenu', (e) => { if (this.shown) e.preventDefault(); });

    if (touchFirst) this.input.lastDevice = 'touch';
    this.update();
  }

  /** Once a frame: show for touch, hide for keys or a gamepad, and light the toggles. */
  update() {
    const want = this.input.lastDevice === 'touch';
    if (want !== this.shown) {
      this.shown = want;
      this.root.classList.toggle('on', want);
      document.documentElement.classList.toggle('touch', want); // lets the HUD move out from under the thumbs
      setHintDevice(want ? 'touch' : 'keyboard');
      if (!want) { this.releasePad(); this.closeTray(); }
    }
    if (!want) return;
    // Over a menu the buttons go faint, so the screen underneath stays readable.
    const top = /** @type {any} */ (this.game.ui.top());
    this.root.classList.toggle('in-menu', !!top && !top.isDialogue && !top.isMessage);
    const s = this.game.state?.settings;
    if (!s) return;
    this.tray.children[0]?.classList.toggle('lit', !!s.fastMode);
    this.tray.children[3]?.classList.toggle('lit', !!s.autoRun);
  }

  // ------------------------------------------------------------------ D-pad

  bindPad() {
    const pad = this.pad;
    pad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.padPointer !== null) return;
      this.padPointer = e.pointerId;
      capture(pad, e.pointerId);
      this.movePad(e);
    });
    pad.addEventListener('pointermove', (e) => { if (e.pointerId === this.padPointer) this.movePad(e); });
    const end = (e) => { if (e.pointerId === this.padPointer) this.releasePad(); };
    pad.addEventListener('pointerup', end);
    pad.addEventListener('pointercancel', end);
    pad.addEventListener('lostpointercapture', end);
  }

  movePad(e) {
    const r = this.pad.getBoundingClientRect();
    const radius = r.width / 2;
    let dx = (e.clientX - (r.left + radius)) / radius;
    let dy = (e.clientY - (r.top + radius)) / radius;
    const len = Math.hypot(dx, dy);
    const dirs = new Set();
    if (len > DEAD_ZONE) {
      // Walking takes diagonals; a menu takes one direction at a time, or a thumb a
      // little off the vertical would change tabs while it scrolled a list.
      const eightWay = !this.game.ui.top();
      const ax = Math.abs(dx), ay = Math.abs(dy);
      const lean = eightWay ? 0.42 : 1; // how far off an axis still counts as that axis
      if (ax >= ay * lean) dirs.add(dx < 0 ? 'left' : 'right');
      if (ay >= ax * lean) dirs.add(dy < 0 ? 'up' : 'down');
      if (!eightWay && dirs.size > 1) dirs.delete(ax > ay ? (dy < 0 ? 'up' : 'down') : (dx < 0 ? 'left' : 'right'));
    }
    for (const d of DIRECTIONS) {
      if (dirs.has(d) && !this.padDirs.has(d)) this.input.touchPress(d);
      if (!dirs.has(d) && this.padDirs.has(d)) this.input.touchRelease(d);
      this.pad.classList.toggle(`go-${d}`, dirs.has(d));
    }
    this.padDirs = dirs;
    this.input.lastDevice = 'touch';
    if (len > 1) { dx /= len; dy /= len; }
    this.nub.style.transform = `translate(${(dx * radius * 0.42).toFixed(1)}px, ${(dy * radius * 0.42).toFixed(1)}px)`;
  }

  releasePad() {
    for (const d of this.padDirs) this.input.touchRelease(d);
    for (const d of DIRECTIONS) this.pad.classList.remove(`go-${d}`);
    this.padDirs = new Set();
    this.padPointer = null;
    this.nub.style.transform = '';
  }

  // ------------------------------------------------------------------ buttons

  bindButton(b) {
    const action = b.dataset.action;
    let pointer = null;
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (pointer !== null) return;
      pointer = e.pointerId;
      capture(b, e.pointerId);
      b.classList.add('on');
      this.closeTray();
      this.input.touchPress(action);
    });
    const end = (e) => {
      if (e.pointerId !== pointer) return;
      pointer = null;
      b.classList.remove('on');
      this.input.touchRelease(action);
    };
    b.addEventListener('pointerup', end);
    b.addEventListener('pointercancel', end);
    b.addEventListener('lostpointercapture', end);
  }

  bindTray() {
    const more = /** @type {HTMLElement} */ (this.root.querySelector('.tc-more'));
    more.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.input.lastDevice = 'touch';
      this.tray.classList.toggle('open');
      more.classList.toggle('on', this.tray.classList.contains('open'));
    });
    for (const pill of this.tray.children) {
      pill.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.input.lastDevice = 'touch';
        const item = TRAY[Number(/** @type {HTMLElement} */ (pill).dataset.tray)];
        if (item.action) {
          this.input.tap(item.action);
        } else {
          // A finger can't hold Run and steer and press A: on touch, Run is a switch.
          const s = this.game.state.settings;
          s[item.setting] = !s[item.setting];
          this.game.audio?.sfx('cursor');
        }
        if (item.action !== 'fast') this.closeTray();
      });
    }
  }

  closeTray() {
    this.tray.classList.remove('open');
    this.root.querySelector('.tc-more')?.classList.remove('on');
  }
}
