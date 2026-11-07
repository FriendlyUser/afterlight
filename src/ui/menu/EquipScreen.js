// Equipment: pick a slot, pick an item, preview stat changes. 'F' optimizes.

import { el } from '../UI.js';
import { keyCap } from '../../core/Input.js';
import { ListView, header, KEYS, statDiffHtml, portraitEl } from './common.js';
import { MemberScreen } from './CrestScreen.js';
import { EQUIPMENT, WEAPON_TYPES } from '../../data/equipment.js';
import { SLOTS } from '../../state/Character.js';
import { CRESTS } from '../../data/crests.js';

const SLOT_NAMES = { weapon: 'Weapon', offhand: 'Shield', head: 'Head', body: 'Body', accessory1: 'Accessory', accessory2: 'Accessory' };

export class EquipScreen extends MemberScreen {
  constructor(menus, memberIndex) {
    super(menus, 'equip-screen', memberIndex);
    this.mode = 'slots';
    this.build();
  }

  build() {
    const ch = this.ch;
    this.el.innerHTML = header(`Equipment — ${ch.name}`, `${KEYS.nav} ${KEYS.ok} ${KEYS.back} ${KEYS.swap} ${keyCap('info')} Optimize`);
    const body = el('div', 'eq-body');
    const left = el('div', 'eq-left panel');
    const who = el('div', 'eq-who');
    who.appendChild(portraitEl(ch.look, 2));
    who.appendChild(el('div', '', `<div class="pc-name">${ch.name}</div><div class="dim">${CRESTS[ch.crest].name}</div>`));
    left.appendChild(who);
    const prev = this.slotList?.index || 0;
    this.slotList = new ListView({
      items: SLOTS.map((s) => ({ slot: s, id: ch.equipment[s] })),
      pageSize: 6,
      render: (it) => `<span class="es">${SLOT_NAMES[it.slot]}</span><span class="ei">${it.id ? EQUIPMENT[it.id].name : '<span class="dim">—</span>'}</span>`,
    });
    this.slotList.index = prev;
    this.slotList.refresh();
    left.appendChild(this.slotList.el);
    this.itemPanel = el('div', 'eq-items panel');
    this.statPanel = el('div', 'eq-stats panel');
    body.append(left, this.itemPanel, this.statPanel);
    this.el.appendChild(body);
    if (this.mode === 'items') this.openItems(true); else this.renderPanels();
  }

  candidates(slot) {
    const ch = this.ch;
    const list = this.state.inventory.list((d) => d.slot && ch.slotAccepts(slot, d.id) && ch.canEquip(d.id))
      .map(([id, n]) => ({ id, n, def: EQUIPMENT[id] }));
    list.sort((a, b) => (b.def.tier || 0) - (a.def.tier || 0) || (b.def.atk || 0) + (b.def.def || 0) - (a.def.atk || 0) - (a.def.def || 0));
    return [{ id: null, label: 'Remove' }, ...list];
  }

  renderPanels(preview) {
    const ch = this.ch;
    const before = ch.stats();
    let after = null;
    if (preview !== undefined) {
      const slot = this.slotList.current.slot;
      const old = ch.equipment[slot];
      ch.equipment[slot] = preview;
      after = ch.stats();
      ch.equipment[slot] = old;
    }
    this.statPanel.innerHTML = `<div class="sd-title">Stats</div>${statDiffHtml(before, after)}`;
    if (this.mode === 'slots') {
      const cur = this.slotList.current;
      const d = cur?.id ? EQUIPMENT[cur.id] : null;
      this.itemPanel.innerHTML = d ? this.itemDesc(d) : '<div class="dim">Choose a slot.</div>';
    }
  }

  itemDesc(d) {
    const bits = [];
    if (d.wtype) bits.push(WEAPON_TYPES[d.wtype].name);
    if (d.armor) bits.push(d.armor);
    if (d.tier) bits.push(`Tier ${d.tier}`);
    return `<div class="cd-name">${d.name}</div><div class="cd-tier">${bits.join(' · ')}</div><div class="cd-desc">${d.desc || ''}</div>`;
  }

  openItems(keep = false) {
    this.mode = 'items';
    const slot = this.slotList.current.slot;
    const prev = keep ? this.itemList?.index || 0 : 0;
    this.itemList = new ListView({
      items: this.candidates(slot),
      pageSize: 11,
      render: (it) => it.id ? `<span class="ei">${it.def.name}</span><span class="cnt">×${it.n}</span>` : '<span class="dim">— Remove —</span>',
    });
    this.itemList.index = Math.min(prev, this.itemList.items.length - 1);
    this.itemList.refresh();
    this.itemPanel.innerHTML = `<div class="sd-title">${SLOT_NAMES[slot]}</div>`;
    this.itemPanel.appendChild(this.itemList.el);
    this.itemDescEl = el('div', 'eq-desc');
    this.itemPanel.appendChild(this.itemDescEl);
    this.previewCurrent();
  }

  previewCurrent() {
    const it = this.itemList.current;
    this.itemDescEl.innerHTML = it?.def ? this.itemDesc(it.def) : '';
    this.renderPanels(it ? it.id : undefined);
  }

  equip(slot, id) {
    const ch = this.ch;
    const old = ch.equipment[slot];
    if (old === id) return;
    if (old) this.state.inventory.add(old, 1);
    if (id) this.state.inventory.remove(id, 1);
    ch.equipment[slot] = id;
    ch.clampVitals();
  }

  /** Equip the highest-scoring item for each slot. */
  optimize() {
    const ch = this.ch;
    const score = (d) => (d ? (d.atk || 0) * 1.2 + (d.mag || 0) * (ch.def.mult.mag > 1 ? 1.2 : 0.6) + (d.def || 0) + (d.res || 0) * 0.8 + (d.spd || 0) * 2 : -1);
    for (const slot of SLOTS) {
      if (slot.startsWith('accessory')) continue;
      const cands = this.candidates(slot).filter((c) => c.id);
      const best = cands.sort((a, b) => score(b.def) - score(a.def))[0];
      if (best && score(best.def) > score(EQUIPMENT[ch.equipment[slot]])) this.equip(slot, best.id);
    }
  }

  handleInput(input) {
    if (this.mode === 'slots') {
      if (this.switchMember(input)) return;
      if (input.pressed('info')) { this.optimize(); this.sfx('confirm'); this.build(); return; }
      const r = this.slotList.handle(input, (s) => this.sfx(s));
      if (r === 'move') this.renderPanels();
      if (r === 'cancel') { this.sfx('cancel'); this.close(); return; }
      if (r === 'confirm') { this.sfx('confirm'); this.openItems(); }
      return;
    }
    const r = this.itemList.handle(input, (s) => this.sfx(s));
    if (r === 'move') this.previewCurrent();
    if (r === 'cancel') { this.sfx('cancel'); this.mode = 'slots'; this.build(); return; }
    if (r === 'confirm') {
      this.equip(this.slotList.current.slot, this.itemList.current.id);
      this.sfx('confirm');
      this.mode = 'slots';
      this.build();
    }
  }
}
