// DOM overlay UI. Widgets live on a focus stack; only the top widget receives
// input. High-level helpers (dialogue, choice, banner, toast) return Promises
// so scripts can simply `await` them.

import { getPortrait } from '../render/SpriteFactory.js';

export function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/** Escape and apply light markup: *gold*, _italic_, {red|text}. */
export function richText(str) {
  const esc = String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(/\*(.+?)\*/g, '<span class="hl">$1</span>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/\{(\w+)\|(.+?)\}/g, '<span class="c-$1">$2</span>');
}

export class UI {
  constructor(root, game) {
    this.root = root;
    this.game = game;
    this.stack = [];
    this.layers = {
      hud: el('div', 'layer hud'),
      world: el('div', 'layer world'),
      menus: el('div', 'layer menus'),
      dialog: el('div', 'layer dialog'),
      top: el('div', 'layer top'),
    };
    Object.values(this.layers).forEach((l) => root.appendChild(l));
    this.lookups = { look: () => null };
  }

  /** Apply user-facing display settings (text size). */
  applySettings(settings) {
    document.documentElement.style.setProperty('--text-scale', String([1, 1.15, 1.3][settings.textSize || 0]));
  }

  /** Resolve a speaker name to a look for portraits. */
  setLookResolver(fn) { this.lookups.look = fn; }

  get blocking() { return this.stack.some((w) => w.blocking !== false); }

  push(widget, layer = 'menus') {
    this.stack.push(widget);
    if (widget.el && !widget.el.parentNode) this.layers[layer].appendChild(widget.el);
    widget.onPush?.();
    return widget;
  }

  remove(widget) {
    const i = this.stack.indexOf(widget);
    if (i >= 0) this.stack.splice(i, 1);
    widget.el?.remove();
    widget.onRemove?.();
  }

  top() { return this.stack[this.stack.length - 1]; }

  /** Returns true when a widget consumed this frame's input. */
  update(dt, input) {
    for (const w of this.stack) w.update?.(dt);
    const t = this.top();
    if (t && t.handleInput) {
      t.handleInput(input);
      return t.blocking !== false;
    }
    return false;
  }

  sfx(id) { this.game.audio?.sfx(id); }

  // ---------------------------------------------------------------------
  // Dialogue
  // ---------------------------------------------------------------------

  dialogue(speaker, text, opts = {}) {
    return new Promise((resolve) => {
      const w = new DialogueBox(this, speaker, text, opts, resolve);
      this.push(w, 'dialog');
    });
  }

  choice(options, opts = {}) {
    return new Promise((resolve) => {
      const w = new ChoiceBox(this, options, opts, resolve);
      this.push(w, 'dialog');
    });
  }

  // ---------------------------------------------------------------------
  // Non-blocking notices
  // ---------------------------------------------------------------------

  banner(title, subtitle = '') {
    const b = el('div', 'area-banner', `<div class="area-title">${title}</div>${subtitle ? `<div class="area-sub">${subtitle}</div>` : ''}`);
    this.layers.hud.appendChild(b);
    requestAnimationFrame(() => b.classList.add('show'));
    setTimeout(() => b.classList.remove('show'), 2600);
    setTimeout(() => b.remove(), 3600);
  }

  toast(html, ms = 2200) {
    let host = this.layers.top.querySelector('.toasts');
    if (!host) { host = el('div', 'toasts'); this.layers.top.appendChild(host); }
    const t = el('div', 'toast', html);
    host.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => t.classList.remove('show'), ms);
    setTimeout(() => t.remove(), ms + 500);
  }

  /** Full-screen centered card (chapter titles etc.). Resolves after hold. */
  async card(title, subtitle = '', hold = 3, line = '') {
    const c = el('div', 'chapter-card', `<div class="cc-sub">${subtitle}</div><div class="cc-title">${title}</div><div class="cc-rule"></div>${line ? `<div class="cc-line">${line}</div>` : ''}`);
    this.layers.top.appendChild(c);
    await this.game.wait(0.05);
    c.classList.add('show');
    await this.game.wait(hold);
    c.classList.remove('show');
    await this.game.wait(1.0);
    c.remove();
  }

  /** Simple "press confirm" popup message. */
  message(html) {
    return new Promise((resolve) => {
      const box = el('div', 'panel message-box', `<div class="msg-body">${html}</div><div class="msg-hint">▼</div>`);
      const w = {
        el: box,
        handleInput: (input) => {
          if (input.pressed('confirm') || input.pressed('cancel')) {
            input.consumeAll();
            this.sfx('confirm');
            this.remove(w);
            resolve();
          }
        },
      };
      this.push(w, 'dialog');
    });
  }
}

// ---------------------------------------------------------------------------

const CHARS_PER_SEC = 55;

class DialogueBox {
  constructor(ui, speaker, text, opts, resolve) {
    this.ui = ui;
    this.resolve = resolve;
    this.opts = opts;
    this.el = el('div', `dialogue-box ${opts.style || ''}`);
    const look = speaker ? ui.lookups.look(speaker) : null;
    if (look && opts.portrait !== false) {
      const p = el('div', 'portrait');
      p.appendChild(getPortrait(look, 4));
      this.el.appendChild(p);
      this.el.classList.add('has-portrait');
    }
    if (speaker) this.el.appendChild(el('div', 'nameplate', speaker));
    this.textEl = el('div', 'dlg-text');
    this.el.appendChild(this.textEl);
    this.hint = el('div', 'dlg-hint', '▼');
    this.el.appendChild(this.hint);

    // Pre-render rich text, then reveal characters progressively.
    this.textEl.innerHTML = richText(text);
    this.chars = [];
    this.wrapChars(this.textEl);
    this.shown = 0;
    this.acc = 0;
    this.done = false;
    this.pause = 0;
    this.blipT = 0;
  }

  wrapChars(node) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const ch of child.textContent) {
          const s = document.createElement('span');
          s.textContent = ch;
          s.className = 'ch';
          frag.appendChild(s);
          this.chars.push(s);
        }
        child.replaceWith(frag);
      } else {
        this.wrapChars(child);
      }
    }
  }

  update(dt) {
    if (this.done) return;
    if (this.pause > 0) { this.pause -= dt * this.ui.game.speedFactor; return; }
    const ts = this.ui.game.state?.settings?.textSpeed ?? 1;
    if (ts >= 3) { this.finish(); return; }
    this.acc += dt * this.ui.game.speedFactor * CHARS_PER_SEC * (this.opts.speed || 1) * [0.6, 1, 1.8][ts];
    while (this.acc >= 1 && this.shown < this.chars.length) {
      this.acc -= 1;
      const c = this.chars[this.shown++];
      c.classList.add('on');
      const t = c.textContent;
      if ('.!?'.includes(t)) { this.pause = 0.18; this.acc = 0; break; }
      if (t === ',' || t === '—') { this.pause = 0.08; this.acc = 0; break; }
      this.blipT -= 1;
      if (this.blipT <= 0 && t.trim()) { this.ui.sfx('blip'); this.blipT = 3; }
    }
    if (this.shown >= this.chars.length) this.finish();
  }

  finish() {
    this.done = true;
    for (const c of this.chars) c.classList.add('on');
    this.hint.classList.add('show');
    if (this.opts.auto) setTimeout(() => this.close(), this.opts.auto * 1000);
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.ui.remove(this);
    this.resolve();
  }

  handleInput(input) {
    if (input.pressed('confirm') || input.pressed('cancel')) {
      input.consumeAll();
      if (!this.done) this.finish();
      else { this.ui.sfx('confirm'); this.close(); }
    }
  }
}

class ChoiceBox {
  constructor(ui, options, opts, resolve) {
    this.ui = ui;
    this.options = options;
    this.resolve = resolve;
    this.opts = opts;
    this.index = opts.default || 0;
    this.el = el('div', 'panel choice-box');
    if (opts.prompt) this.el.appendChild(el('div', 'choice-prompt', richText(opts.prompt)));
    this.items = options.map((o, i) => {
      const it = el('div', 'choice-item', richText(o));
      this.el.appendChild(it);
      return it;
    });
    this.refresh();
  }

  refresh() { this.items.forEach((it, i) => it.classList.toggle('sel', i === this.index)); }

  handleInput(input) {
    if (input.repeat('up')) { this.index = (this.index + this.items.length - 1) % this.items.length; this.ui.sfx('cursor'); this.refresh(); }
    if (input.repeat('down')) { this.index = (this.index + 1) % this.items.length; this.ui.sfx('cursor'); this.refresh(); }
    if (input.pressed('confirm')) { input.consumeAll(); this.ui.sfx('confirm'); this.ui.remove(this); this.resolve(this.index); }
    else if (input.pressed('cancel') && this.opts.cancel !== undefined) {
      input.consumeAll(); this.ui.sfx('cancel'); this.ui.remove(this); this.resolve(this.opts.cancel);
    }
  }
}
