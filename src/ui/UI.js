// DOM overlay UI. Widgets live on a focus stack; only the top widget receives
// input. High-level helpers (dialogue, choice, banner, toast) return Promises
// so scripts can simply `await` them.

import { getPortrait } from '../render/SpriteFactory.js';
import { blipFor } from '../data/voices.js';
import { keyCap } from '../core/Input.js';

export function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/** Timing tags inside a line: {wait=0.4} {speed=0.5} {shake=0.3} {sfx=bell}. */
const CONTROL_TAG = /\{(wait|speed|spd|shake|sfx)(?:=([^}]*))?\}/g;
const CUE = '\uE000'; // stands in for a tag while the text is marked up

/** A line without its timing tags (history, menus). */
export const plainText = (str) => String(str).replace(CONTROL_TAG, '');

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
    /** @type {Array<{ speaker: string | null, text: string, style?: string }>} the last lines shown (the backlog) */
    this.history = [];
  }

  /** Apply user-facing display settings (text size). */
  applySettings(settings) {
    document.documentElement.style.setProperty('--text-scale', String([1, 1.15, 1.3][settings.textSize || 0]));
  }

  /** Resolve a speaker name to a look for portraits. */
  setLookResolver(fn) { this.lookups.look = fn; }

  get blocking() { return this.stack.some((w) => w.blocking !== false); }

  push(widget, layer = 'menus') {
    // Anything that asks the player something ends a skip: choices, menus, shops, fishing.
    if (this.game.skipping && widget.blocking !== false && !widget.isDialogue && !widget.isMessage) this.game.stopSkip('input');
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

  /**
   * Show one line and resolve when the player moves on. opts: style, speed, portrait,
   * auto (seconds), voice (a voice-line id: plays if the voice pack has it).
   */
  dialogue(speaker, text, opts = {}) {
    this.history.push({ speaker, text: plainText(text), style: opts.style });
    if (this.history.length > HISTORY_LINES) this.history.splice(0, this.history.length - HISTORY_LINES);
    if (this.game.skipping) return Promise.resolve(); // a skipped scene: the line is in the backlog
    return new Promise((resolve) => {
      const w = new DialogueBox(this, speaker, text, opts, resolve);
      this.push(w, 'dialog');
    });
  }

  /** The backlog: the last lines of dialogue, scrollable. Resolves when closed. */
  backlog() {
    return new Promise((resolve) => this.push(new Backlog(this, resolve), 'top'));
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

  /** Simple "press confirm" popup message ("Obtained …"). In a skipped scene it becomes a toast. */
  message(html) {
    if (this.game.skipping) { this.toast(richText(html), 3200); return Promise.resolve(); }
    return new Promise((resolve) => {
      const box = el('div', 'panel message-box', `<div class="msg-body">${html}</div><div class="msg-hint">▼</div>`);
      const w = {
        el: box,
        isMessage: true,
        close: () => { this.remove(w); resolve(); },
        handleInput: (input) => {
          if (input.pressed('confirm') || input.pressed('cancel')) {
            input.consumeAll();
            this.sfx('confirm');
            w.close();
          }
        },
      };
      this.push(w, 'dialog');
    });
  }
}

// ---------------------------------------------------------------------------

const CHARS_PER_SEC = 55;
const HISTORY_LINES = 100;
/** Auto-advance: how long a finished line stays up, by its length. */
const autoDelay = (chars) => Math.min(4, Math.max(1.2, chars * 0.05));
const SPOKEN = /[\p{L}\p{N}]/u; // characters that make a sound when typed

class DialogueBox {
  constructor(ui, speaker, text, opts, resolve) {
    this.ui = ui;
    this.resolve = resolve;
    this.opts = opts;
    this.isDialogue = true;
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

    // Lift the timing tags out, mark the text up, then reveal it character by character.
    const tags = [];
    const marked = String(text).replace(CONTROL_TAG, (_, kind, value) => { tags.push({ kind: kind === 'spd' ? 'speed' : kind, value }); return CUE; });
    this.textEl.innerHTML = richText(marked);
    this.chars = [];
    this.cues = new Map(); // character index -> tags to run just before it appears
    this.wrapChars(this.textEl, tags);
    this.shown = 0;
    this.acc = 0;
    this.done = false;
    this.pause = 0;
    this.rate = 1; // {speed=…}
    this.blipT = 0;
    this.idle = 0; // seconds since the line finished (auto-advance)
    this.blip = blipFor(speaker, opts.style);
    // A recorded line, when the voice pack has one: it replaces the typing blips.
    this.voice = (opts.voice && ui.game.voiceLines?.play(opts.voice)) || null;
  }

  wrapChars(node, tags) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const ch of child.textContent) {
          if (ch === CUE) {
            const at = this.chars.length;
            if (!this.cues.has(at)) this.cues.set(at, []);
            this.cues.get(at).push(tags.shift());
            continue;
          }
          const s = document.createElement('span');
          s.textContent = ch;
          s.className = 'ch';
          frag.appendChild(s);
          this.chars.push(s);
        }
        child.replaceWith(frag);
      } else {
        this.wrapChars(child, tags);
      }
    }
  }

  /** Run the tags waiting at the next character; true if one of them paused the line. */
  runCues() {
    const cues = this.cues.get(this.shown);
    if (!cues) return false;
    this.cues.delete(this.shown);
    const game = this.ui.game;
    for (const { kind, value } of cues) {
      if (kind === 'wait') this.pause = Number(value) || 0.4;
      else if (kind === 'speed') this.rate = Number(value) || 1;
      else if (kind === 'shake') game.scene?.shake?.(Number(value) || 0.2, 0.35);
      else if (kind === 'sfx') this.ui.sfx(value);
    }
    return this.pause > 0;
  }

  update(dt) {
    const game = this.ui.game;
    if (this.done) { this.autoAdvance(dt); return; }
    if (this.pause > 0) { this.pause -= dt * game.speedFactor; return; }
    const ts = game.state?.settings?.textSpeed ?? 1;
    if (ts >= 3) { this.finish(); return; }
    this.acc += dt * game.speedFactor * CHARS_PER_SEC * (this.opts.speed || 1) * this.rate * [0.6, 1, 1.8][ts];
    while (this.acc >= 1 && this.shown < this.chars.length) {
      if (this.runCues()) { this.acc = 0; return; }
      this.acc -= 1;
      const c = this.chars[this.shown++];
      c.classList.add('on');
      const t = c.textContent;
      if ('.!?'.includes(t)) { this.pause = 0.18; this.acc = 0; break; }
      if (t === ',' || t === '—') { this.pause = 0.08; this.acc = 0; break; }
      this.blipT -= 1;
      if (this.blipT <= 0 && SPOKEN.test(t) && !this.voice) { game.audio?.blip(this.blip, this.shown); this.blipT = this.blip.every || 3; }
    }
    if (this.shown >= this.chars.length) {
      if (this.runCues()) return; // a tag at the very end, e.g. a closing {wait=1}
      this.finish();
    }
  }

  finish() {
    this.done = true;
    for (const c of this.chars) c.classList.add('on');
    this.hint.classList.add('show');
    if (this.opts.auto) setTimeout(() => this.close(), this.opts.auto * 1000);
  }

  /**
   * Settings → Auto-Advance: move on by itself once the line has been up long enough
   * to read (and its recording, if any, has finished). Tips wait for a key.
   */
  autoAdvance(dt) {
    const game = this.ui.game;
    if (!game.state?.settings?.autoAdvance || this.opts.style === 'system' || this.ui.top() !== this) return;
    if (this.voice && !this.voice.done) { this.idle = 0; return; }
    this.idle += dt * game.speedFactor;
    if (this.idle >= (this.voice ? 0.45 : autoDelay(this.chars.length))) this.close();
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.voice?.stop();
    this.ui.remove(this);
    this.resolve();
  }

  handleInput(input) {
    if (input.pressed('confirm') || input.pressed('cancel')) {
      input.consumeAll();
      if (!this.done) this.finish();
      else { this.ui.sfx('confirm'); this.close(); }
    } else if (input.pressed('up') && this.ui.history.length > 1) {
      input.consumeAll();
      this.ui.sfx('cursor');
      this.ui.backlog();
    }
  }
}

/** The backlog: recent dialogue, newest at the bottom. Up / Down scroll; any button closes. */
class Backlog {
  constructor(ui, resolve) {
    this.ui = ui;
    this.resolve = resolve;
    this.el = el('div', 'backlog');
    const rows = ui.history.map((h) => `<div class="bl-row ${h.style || ''}">${h.speaker ? `<span class="bl-who">${h.speaker}</span>` : ''}<span class="bl-text">${richText(h.text)}</span></div>`).join('');
    this.el.innerHTML = `<div class="panel bl-panel"><div class="bl-title">Backlog</div><div class="bl-list">${rows}</div><div class="bl-hint">${keyCap('up')}${keyCap('down')} Scroll · ${keyCap('cancel')} Close</div></div>`;
    this.list = this.el.querySelector('.bl-list');
  }

  onPush() { this.list.scrollTop = this.list.scrollHeight; }

  handleInput(input) {
    const step = this.list.clientHeight * 0.3;
    if (input.repeat('up')) this.list.scrollTop -= step;
    if (input.repeat('down')) this.list.scrollTop += step;
    if (input.pressed('cancel') || input.pressed('confirm') || input.pressed('menu')) {
      input.consumeAll();
      this.ui.sfx('cancel');
      this.ui.remove(this);
      this.resolve();
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
