// Save / Load slot picker.

import { el } from '../UI.js';
import { Screen, ListView, header, KEYS } from './common.js';
import { SaveStore, SAVE_SLOTS, AUTO_SLOT } from '../../state/GameState.js';
import { formatTime } from '../../core/util.js';
import { LOOKS } from '../../data/looks.js';
import { getPortrait } from '../../render/SpriteFactory.js';

export class SaveScreen extends Screen {
  /** mode: 'save' | 'load' */
  constructor(menus, mode) {
    super(menus, 'save-screen');
    this.mode = mode;
    this.build();
  }

  build() {
    this.el.innerHTML = header(this.mode === 'save' ? 'Save Game' : 'Load Game', `${KEYS.nav} ${KEYS.ok} ${KEYS.back}`);
    const items = SaveStore.summaries().map((s, i) => ({ slot: i, s, label: String(i + 1), disabled: this.mode === 'load' && !s }));
    if (this.mode === 'load') {
      const auto = SaveStore.read(AUTO_SLOT)?.summary || null;
      items.unshift({ slot: AUTO_SLOT, s: auto, label: 'A', disabled: !auto });
    }
    const latest = SaveStore.latestSlot();
    const prev = this.list?.index ?? Math.max(0, items.findIndex((it) => it.slot === latest));
    this.list = new ListView({
      items,
      pageSize: SAVE_SLOTS + 1,
      render: (it) => {
        if (!it.s) return `<div class="sv-slot"><span class="sv-n">${it.label}</span><span class="dim">— ${it.slot === AUTO_SLOT ? 'No autosave' : 'Empty'} —</span></div>`;
        const s = it.s;
        const date = new Date(s.savedAt).toLocaleString();
        return `<div class="sv-slot"><span class="sv-n">${it.label}</span><span class="sv-faces" data-party="${s.party.join(',')}"></span>
          <span class="sv-info"><b>${it.slot === AUTO_SLOT ? 'Autosave · ' : ''}${s.location || '—'}</b><br><span class="dim">${s.chapter === 0 ? 'Prologue' : `Chapter ${s.chapter}`} · Lv ${s.level} · ${formatTime(s.playtime)}</span></span><span class="sv-date dim">${date}</span></div>`;
      },
    });
    this.list.index = prev;
    this.list.refresh();
    const box = el('div', 'sv-list panel');
    box.appendChild(this.list.el);
    this.el.appendChild(box);
    this.fillFaces();
  }

  fillFaces() {
    this.el.querySelectorAll('.sv-faces').forEach((f) => {
      for (const id of f.dataset.party.split(',')) {
        const look = LOOKS[id];
        if (look) f.appendChild(getPortrait(look, 1));
      }
    });
  }

  async handleInput(input) {
    if (this.busy) return;
    const r = this.list.handle(input, (s) => this.sfx(s));
    if (r === 'move') this.fillFaces();
    if (r === 'cancel') { this.sfx('cancel'); this.close(null); return; }
    if (r !== 'confirm') return;
    const it = this.list.current;
    if (this.mode === 'load') {
      if (!it.s) { this.sfx('buzzer'); return; }
      this.sfx('confirm');
      this.close(it.slot);
      return;
    }
    this.busy = true;
    if (it.s) {
      const ok = await this.game.ui.choice(['Overwrite', 'Cancel'], { prompt: `Overwrite slot ${it.slot + 1}?`, cancel: 1 });
      if (ok !== 0) { this.busy = false; return; }
    }
    const done = SaveStore.write(it.slot, this.state);
    this.sfx(done ? 'save' : 'buzzer');
    this.game.ui.toast(done ? `Saved to slot ${it.slot + 1}.` : 'Save failed.');
    this.busy = false;
    this.build();
  }
}
