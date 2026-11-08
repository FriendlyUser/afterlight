// Keyboard + gamepad input mapped to abstract actions.
// pressed(a): edge this frame. down(a): held. repeat(a): edge + auto-repeat (menus).
// Keyboard bindings are remappable (Settings → Controls) and stored in settings.keys,
// so they travel with save files; the gamepad uses the standard layout below.

/** Remappable actions, in the order the Controls screen lists them. */
export const ACTIONS = [
  { id: 'up', label: 'Move up' },
  { id: 'down', label: 'Move down' },
  { id: 'left', label: 'Move left' },
  { id: 'right', label: 'Move right' },
  { id: 'confirm', label: 'Confirm · talk' },
  { id: 'cancel', label: 'Cancel · back' },
  { id: 'menu', label: 'Open menu' },
  { id: 'run', label: 'Run (hold)' },
  { id: 'pageLeft', label: 'Previous · Surge down' },
  { id: 'pageRight', label: 'Next · Surge up' },
  { id: 'info', label: 'Auto-battle · optimize · export' },
  { id: 'fast', label: 'Fast Mode' },
  { id: 'ride', label: 'Ride Kindle' },
  { id: 'map', label: 'Area map' },
];

export const MAX_KEYS_PER_ACTION = 3;

export const DEFAULT_BINDINGS = {
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  confirm: ['KeyZ', 'Enter', 'Space'],
  cancel: ['KeyX', 'Backspace'],
  menu: ['KeyC', 'Tab'],
  run: ['ShiftLeft', 'ShiftRight'],
  pageLeft: ['KeyQ'],
  pageRight: ['KeyE'],
  info: ['KeyF'],
  fast: ['KeyT'],
  ride: ['KeyR'],
  map: ['KeyM'],
};

/** Escape always cancels and opens the menu, whatever else is bound, so no remap can lock a player out. */
const FIXED_KEYS = { Escape: ['cancel', 'menu'] };

/** Actions that must always keep at least one key. */
export const ESSENTIAL = new Set(['up', 'down', 'left', 'right', 'confirm']);

/** Keys browsers keep for themselves or that make poor game keys; never bound. */
const RESERVED = new Set(['Escape', 'Delete', 'MetaLeft', 'MetaRight', 'ContextMenu', 'F5', 'F11', 'F12']);

/** Key codes we accept in a binding: letters, digits, arrows, numpad, named keys. */
export const bindableKey = (code) => typeof code === 'string' && /^[A-Za-z0-9]{1,24}$/.test(code) && !RESERVED.has(code);

/**
 * A complete, valid bindings object from anything (settings from an old or edited
 * save): unknown actions dropped, bad codes removed, missing actions defaulted.
 */
export function normalizeBindings(raw) {
  const out = {};
  for (const { id } of ACTIONS) {
    const keys = Array.isArray(raw?.[id]) ? [...new Set(raw[id].filter(bindableKey))].slice(0, MAX_KEYS_PER_ACTION) : null;
    out[id] = keys && (keys.length || !ESSENTIAL.has(id)) ? keys : [...DEFAULT_BINDINGS[id]];
  }
  return out;
}

const KEY_NAMES = {
  ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Space: 'Space', Enter: 'Enter',
  Backspace: 'Bksp', Tab: 'Tab', Escape: 'Esc', ShiftLeft: 'L-Shift', ShiftRight: 'R-Shift',
  ControlLeft: 'L-Ctrl', ControlRight: 'R-Ctrl', AltLeft: 'L-Alt', AltRight: 'R-Alt', CapsLock: 'Caps',
  Backquote: '`', Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']', Backslash: '\\',
  Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/', PageUp: 'PgUp', PageDown: 'PgDn',
};

/** Short display name for a key code: KeyZ → Z, Digit1 → 1, Numpad4 → Num 4, ArrowUp → ↑. */
export function keyName(code) {
  if (KEY_NAMES[code]) return KEY_NAMES[code];
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit\d$/.test(code)) return code.slice(5);
  if (code.startsWith('Numpad')) return `Num ${code.slice(6)}`;
  return code;
}

let active = normalizeBindings(DEFAULT_BINDINGS);

/** The keys currently bound to an action (display names), for on-screen hints. */
export function keysFor(action) { return active[action].map(keyName); }

/** Hint markup for an action's first key, e.g. <span class="key">Z</span>. */
export function keyCap(action) { return `<span class="key">${keysFor(action)[0] ?? '?'}</span>`; }

const PAD_BUTTONS = { 0: 'confirm', 1: 'cancel', 2: 'run', 3: 'menu', 9: 'menu', 4: 'pageLeft', 5: 'pageRight', 12: 'up', 13: 'down', 14: 'left', 15: 'right', 8: 'info', 10: 'fast', 7: 'ride', 6: 'map' };

const REPEAT_DELAY = 0.32;
const REPEAT_RATE = 0.075;

export class Input {
  constructor() {
    this.held = new Set();
    this.edges = new Set();
    this.padHeld = new Set();
    this.holdTime = new Map();
    this.repeatFired = new Set();
    this.listeners = [];
    this.lastDevice = 'keyboard';

    this.setBindings(DEFAULT_BINDINGS);
    window.addEventListener('keydown', (e) => {
      if (this.capture && !e.repeat) {
        // Controls screen is waiting for a key: hand it over instead of acting on it.
        e.preventDefault();
        const done = this.capture;
        this.capture = null;
        done(e.code);
        return;
      }
      const acts = this.keymap[e.code];
      if (!acts) return;
      if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace'].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      this.lastDevice = 'keyboard';
      for (const a of acts) { this.held.add(a); this.edges.add(a); }
      this.listeners.forEach((fn) => fn());
    });
    window.addEventListener('keyup', (e) => {
      const acts = this.keymap[e.code];
      if (!acts) return;
      for (const a of acts) this.held.delete(a);
    });
    window.addEventListener('blur', () => this.held.clear());
  }

  /** Use these keyboard bindings ({ action: [codes] }; invalid parts are repaired). */
  setBindings(bindings) {
    active = normalizeBindings(bindings);
    this.keymap = {};
    for (const [action, codes] of Object.entries(active)) for (const code of codes) (this.keymap[code] ||= []).push(action);
    for (const [code, actions] of Object.entries(FIXED_KEYS)) this.keymap[code] = [...new Set([...(this.keymap[code] || []), ...actions])];
    this.held.clear();
  }

  /** The current bindings (a copy). */
  get bindings() { return normalizeBindings(active); }

  /** Deliver the next key press to `fn(code)` instead of the game (key remapping). */
  captureKey(fn) { this.capture = fn; }

  /** Called once per frame before game logic. */
  update(dt) {
    this.pollGamepad();
    this.repeatFired.clear();
    for (const a of ['up', 'down', 'left', 'right', 'pageLeft', 'pageRight']) {
      if (this.down(a)) {
        const t = (this.holdTime.get(a) || 0) + dt;
        const prev = this.holdTime.get(a) || 0;
        this.holdTime.set(a, t);
        if (t > REPEAT_DELAY) {
          const n0 = Math.floor((prev - REPEAT_DELAY) / REPEAT_RATE);
          const n1 = Math.floor((t - REPEAT_DELAY) / REPEAT_RATE);
          if (n1 > n0 || prev <= REPEAT_DELAY) this.repeatFired.add(a);
        }
      } else {
        this.holdTime.delete(a);
      }
    }
  }

  /** Called at the end of the frame. */
  endFrame() { this.edges.clear(); }

  pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = pads && Array.from(pads).find((p) => p && p.connected);
    if (!pad) return;
    const now = new Set();
    pad.buttons.forEach((b, i) => { if (b.pressed && PAD_BUTTONS[i]) now.add(PAD_BUTTONS[i]); });
    const [ax, ay] = [pad.axes[0] || 0, pad.axes[1] || 0];
    if (ax < -0.45) now.add('left');
    if (ax > 0.45) now.add('right');
    if (ay < -0.45) now.add('up');
    if (ay > 0.45) now.add('down');
    for (const a of now) if (!this.padHeld.has(a)) { this.edges.add(a); this.lastDevice = 'gamepad'; }
    this.padHeld = now;
    this.analog = { x: Math.abs(ax) > 0.2 ? ax : 0, y: Math.abs(ay) > 0.2 ? ay : 0 };
  }

  down(a) { return this.held.has(a) || this.padHeld.has(a); }
  pressed(a) { return this.edges.has(a); }
  repeat(a) { return this.edges.has(a) || this.repeatFired.has(a); }

  /** Consume an edge so nothing else this frame sees it. */
  consume(a) { this.edges.delete(a); }
  consumeAll() { this.edges.clear(); }

  /** Movement vector from held directions (and analog stick). */
  axis() {
    let x = 0, y = 0;
    if (this.down('left')) x -= 1;
    if (this.down('right')) x += 1;
    if (this.down('up')) y -= 1;
    if (this.down('down')) y += 1;
    if (this.analog && (this.analog.x || this.analog.y)) { x = this.analog.x; y = this.analog.y; }
    const len = Math.hypot(x, y);
    return len > 1 ? { x: x / len, y: y / len } : { x, y };
  }

  onAny(fn) { this.listeners.push(fn); }
}
