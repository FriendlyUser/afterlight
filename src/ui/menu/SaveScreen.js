// Save / Load slot picker. F on a slot exports it to a file or imports one, so saves
// can be backed up or moved between browsers, computers and the hosted game.

import { el } from '../UI.js';
import { Screen, ListView, header, KEYS } from './common.js';
import { SaveStore, SAVE_SLOTS, AUTO_SLOT } from '../../state/GameState.js';
import { formatTime } from '../../core/util.js';
import { LOOKS } from '../../data/looks.js';
import { getPortrait } from '../../render/SpriteFactory.js';
import { downloadText, pickTextFile, canPickFile } from '../files.js';

export class SaveScreen extends Screen {
  /** mode: 'save' | 'load' */
  constructor(menus, mode) {
    super(menus, 'save-screen');
    this.mode = mode;
    this.build();
  }

  build() {
    this.el.innerHTML = header(this.mode === 'save' ? 'Save Game' : 'Load Game', `${KEYS.nav} ${KEYS.ok} <span class="key">F</span> Export / Import ${KEYS.back}`);
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
    if (input.pressed('info')) {
      input.consume('info');
      this.busy = true;
      await this.fileMenu(this.list.current);
      this.busy = false;
      return;
    }
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

  /** Export the slot to a file, or import a file into it (numbered slots only). */
  async fileMenu(it) {
    const name = it.slot === AUTO_SLOT ? 'the autosave' : `slot ${it.slot + 1}`;
    const options = [];
    if (it.s) options.push({ id: 'export', label: 'Export to file' });
    if (it.slot !== AUTO_SLOT) options.push({ id: 'import', label: 'Import from file' });
    if (!options.length) { this.sfx('buzzer'); return; }
    const pick = await this.game.ui.choice([...options.map((o) => o.label), 'Cancel'], { prompt: `Save file for ${name}`, cancel: options.length });
    const action = options[pick]?.id;
    if (action === 'export') this.exportSlot(it);
    if (action === 'import') await this.importSlot(it);
  }

  exportSlot(it) {
    const s = it.s;
    const where = (s.location || 'save').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const label = it.slot === AUTO_SLOT ? 'autosave' : `slot${it.slot + 1}`;
    downloadText(`afterlight-${label}-${where}-${new Date(s.savedAt).toISOString().slice(0, 10)}.json`, SaveStore.exportFile(it.slot));
    this.sfx('confirm');
    this.game.ui.toast(`Exported ${it.slot === AUTO_SLOT ? 'the autosave' : `slot ${it.slot + 1}`} to your downloads.`);
  }

  async importSlot(it) {
    if (!canPickFile()) { this.sfx('buzzer'); this.game.ui.toast('Use the keyboard or mouse to choose a file.'); return; }
    if (it.s) {
      const ok = await this.game.ui.choice(['Replace it', 'Cancel'], { prompt: `Slot ${it.slot + 1} already has a save. Replace it?`, cancel: 1 });
      if (ok !== 0) return;
    }
    const text = await pickTextFile();
    if (text === null) return;
    try {
      SaveStore.importFile(it.slot, text);
    } catch (e) {
      this.sfx('buzzer');
      this.game.ui.toast(e.message);
      return;
    }
    this.sfx('save');
    this.game.ui.toast(`Imported into slot ${it.slot + 1}.`);
    this.build();
  }
}
