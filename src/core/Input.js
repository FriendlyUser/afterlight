// Keyboard + gamepad input mapped to abstract actions.
// pressed(a): edge this frame. down(a): held. repeat(a): edge + auto-repeat (menus).

const KEYS = {
  ArrowUp: ['up'], KeyW: ['up'],
  ArrowDown: ['down'], KeyS: ['down'],
  ArrowLeft: ['left'], KeyA: ['left'],
  ArrowRight: ['right'], KeyD: ['right'],
  KeyZ: ['confirm'], Enter: ['confirm'], Space: ['confirm'], KeyJ: ['confirm'],
  KeyX: ['cancel'], Backspace: ['cancel'], KeyK: ['cancel'],
  Escape: ['cancel', 'menu'], KeyC: ['menu'], Tab: ['menu'],
  ShiftLeft: ['run'], ShiftRight: ['run'],
  KeyQ: ['pageLeft'], KeyE: ['pageRight'],
  KeyF: ['info'], KeyM: ['map'], KeyT: ['fast'],
};

const PAD_BUTTONS = { 0: 'confirm', 1: 'cancel', 2: 'run', 3: 'menu', 9: 'menu', 4: 'pageLeft', 5: 'pageRight', 12: 'up', 13: 'down', 14: 'left', 15: 'right', 8: 'info', 10: 'fast' };

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

    window.addEventListener('keydown', (e) => {
      const acts = KEYS[e.code];
      if (!acts) return;
      if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace'].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      this.lastDevice = 'keyboard';
      for (const a of acts) { this.held.add(a); this.edges.add(a); }
      this.listeners.forEach((fn) => fn());
    });
    window.addEventListener('keyup', (e) => {
      const acts = KEYS[e.code];
      if (!acts) return;
      for (const a of acts) this.held.delete(a);
    });
    window.addEventListener('blur', () => this.held.clear());
  }

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
