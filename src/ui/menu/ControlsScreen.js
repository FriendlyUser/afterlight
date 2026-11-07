// Settings → Controls: remap keyboard keys. Each action holds up to three keys;
// pick a cell and press the new key (Delete clears it, Esc cancels). Bindings are
// stored in settings.keys, so they are saved — and exported — with the game.
// Esc always works as Cancel / Menu, so a remap can never lock a player out.

import { el } from '../UI.js';
import { Screen, header } from './common.js';
import { ACTIONS, DEFAULT_BINDINGS, ESSENTIAL, MAX_KEYS_PER_ACTION, bindableKey, keyCap, keyName } from '../../core/Input.js';

const RESET_ROW = ACTIONS.length;

export class ControlsScreen extends Screen {
  constructor(menus) {
    super(menus, 'controls-screen');
    this.row = 0;
    this.col = 0;
    this.listening = false;
    this.build();
  }

  get bindings() { return this.game.input.bindings; }

  build() {
    const b = this.bindings;
    const hint = this.listening
      ? `Press a key for <b>${ACTIONS[this.row].label}</b> · <span class="key">Del</span> Clear · <span class="key">Esc</span> Cancel`
      : `${keyCap('up')}${keyCap('down')}${keyCap('left')}${keyCap('right')} Choose ${keyCap('confirm')} Change key <span class="key">Esc</span> Back`;
    this.el.innerHTML = header('Controls', hint);
    const box = el('div', 'ctl-list panel');
    ACTIONS.forEach((a, r) => {
      const cells = Array.from({ length: MAX_KEYS_PER_ACTION }, (_, c) => {
        const code = b[a.id][c];
        const sel = r === this.row && c === this.col;
        const text = sel && this.listening ? '…' : code ? keyName(code) : '—';
        return `<span class="ctl-key ${sel ? 'sel' : ''} ${sel && this.listening ? 'listening' : ''} ${code ? '' : 'empty'}">${text}</span>`;
      }).join('');
      box.appendChild(el('div', `ctl-row ${r === this.row ? 'cur' : ''}`, `<span class="ctl-label">${a.label}</span><span class="ctl-keys">${cells}</span>`));
    });
    box.appendChild(el('div', `ctl-row ctl-reset ${this.row === RESET_ROW ? 'cur sel' : ''}`, '<span class="ctl-label">Reset to defaults</span>'));
    box.appendChild(el('div', 'ctl-note dim', 'Esc always cancels and opens the menu. Gamepads use the standard layout.'));
    this.el.appendChild(box);
  }

  handleInput(input) {
    if (this.listening) return; // the next key goes to capture(), not to the menu
    const rows = ACTIONS.length + 1;
    if (input.repeat('up')) { this.row = (this.row + rows - 1) % rows; this.moved(); }
    if (input.repeat('down')) { this.row = (this.row + 1) % rows; this.moved(); }
    if (input.repeat('left')) { this.col = (this.col + MAX_KEYS_PER_ACTION - 1) % MAX_KEYS_PER_ACTION; this.moved(); }
    if (input.repeat('right')) { this.col = (this.col + 1) % MAX_KEYS_PER_ACTION; this.moved(); }
    if (input.pressed('confirm')) {
      input.consumeAll();
      if (this.row === RESET_ROW) return this.save(DEFAULT_BINDINGS, 'Controls reset to defaults.');
      this.listening = true;
      this.sfx('confirm');
      this.build();
      this.game.input.captureKey((code) => this.capture(code));
      return;
    }
    if (input.pressed('cancel')) { input.consumeAll(); this.sfx('cancel'); this.close(); }
  }

  moved() { this.sfx('cursor'); this.build(); }

  /** The key the player pressed while a cell was waiting. */
  capture(code) {
    this.listening = false;
    if (code === 'Escape') { this.sfx('cancel'); this.build(); return; }
    const action = ACTIONS[this.row].id;
    const b = this.bindings;
    if (code === 'Delete') {
      b[action] = b[action].filter((_, i) => i !== this.col);
      if (!b[action].length && ESSENTIAL.has(action)) return this.refuse(`${ACTIONS[this.row].label} needs at least one key.`);
      return this.save(b);
    }
    if (!bindableKey(code)) return this.refuse(`${keyName(code)} can't be bound.`);
    // A key belongs to one action: take it from wherever it was.
    for (const other of ACTIONS) {
      if (other.id === action || !b[other.id].includes(code)) continue;
      b[other.id] = b[other.id].filter((k) => k !== code);
      if (!b[other.id].length && ESSENTIAL.has(other.id)) return this.refuse(`${keyName(code)} is ${other.label}'s only key.`);
    }
    const keys = b[action].filter((k) => k !== code);
    keys.splice(Math.min(this.col, keys.length), 0, code);
    b[action] = keys.slice(0, MAX_KEYS_PER_ACTION);
    this.save(b);
  }

  save(bindings, message) {
    const s = this.state.settings;
    s.keys = structuredClone(bindings);
    this.game.applySettings(s);
    this.sfx('confirm');
    if (message) this.game.ui.toast(message);
    this.build();
  }

  refuse(message) {
    this.sfx('buzzer');
    this.game.ui.toast(message);
    this.build();
  }
}
