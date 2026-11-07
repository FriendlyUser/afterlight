// Shops: buy / sell with quantity picker and "who can equip" preview.

import { el, richText } from '../UI.js';
import { keyCap } from '../../core/Input.js';
import { Screen, ListView, header, KEYS } from './common.js';
import { SHOPS } from '../../data/shops.js';
import { ITEMS } from '../../data/items.js';
import { EQUIPMENT } from '../../data/equipment.js';
import { getPortrait } from '../../render/SpriteFactory.js';

const def = (id) => ITEMS[id] || EQUIPMENT[id];
const sellPrice = (d) => d.sell ?? Math.floor((d.price || 0) / 2);

export class ShopScreen extends Screen {
  constructor(menus, shopId) {
    super(menus, 'shop-screen');
    this.shop = SHOPS[shopId];
    this.tab = 0; // 0 buy, 1 sell
    this.qty = null;
    this.build();
  }

  items() {
    if (this.tab === 0) {
      return this.shop.items.filter((id) => def(id)).filter((id) => !(def(id).kind === 'crest' && this.state.unlockedCrests.has(def(id).crest)))
        .map((id) => ({ id, d: def(id), price: def(id).price, have: this.state.inventory.count(id) }));
    }
    return this.state.inventory.list((d) => d.kind !== 'key' && sellPrice(d) > 0)
      .map(([id, n, d]) => ({ id, d, price: sellPrice(d), have: n }));
  }

  build() {
    this.el.innerHTML = header(this.shop.name, `${KEYS.nav} ${KEYS.ok} ${KEYS.back} ${keyCap('pageLeft')}${keyCap('pageRight')} Buy/Sell`);
    this.el.appendChild(el('div', 'tabs', `<span class="${this.tab === 0 ? 'on' : ''}">Buy</span><span class="${this.tab === 1 ? 'on' : ''}">Sell</span><span class="gold">${this.state.gold.toLocaleString()} G</span>`));
    const body = el('div', 'sh-body');
    const left = el('div', 'sh-left panel');
    const prev = this.list?.index || 0;
    this.list = new ListView({
      items: this.items(), pageSize: 13, empty: 'Nothing to sell.',
      render: (it) => `<span class="in">${it.d.name}</span><span class="cnt dim">${it.have ? `own ${it.have}` : ''}</span><span class="price ${this.tab === 0 && it.price > this.state.gold ? 'no' : ''}">${it.price} G</span>`,
    });
    this.list.index = Math.min(prev, Math.max(0, this.list.items.length - 1));
    this.list.refresh();
    left.appendChild(this.list.el);
    this.detail = el('div', 'sh-detail panel');
    body.append(left, this.detail);
    this.el.appendChild(body);
    this.renderDetail();
  }

  renderDetail() {
    const it = this.list.current;
    if (!it) { this.detail.innerHTML = ''; return; }
    const d = it.d;
    let html = `<div class="cd-name">${d.name}</div><div class="cd-desc">${richText(d.desc || '')}</div>`;
    if (d.slot) {
      const bits = ['atk', 'mag', 'def', 'res', 'spd'].filter((k) => d[k]).map((k) => `${k.toUpperCase()} +${d[k]}`);
      html += `<div class="sh-stats">${bits.join(' · ')}</div><div class="sh-who">`;
      for (const ch of this.state.allMembers()) {
        const can = ch.canEquip(d.id);
        const cur = ch.equipment[d.slot === 'accessory' ? 'accessory1' : d.slot];
        const curDef = EQUIPMENT[cur];
        const delta = can ? ((d.atk || 0) + (d.def || 0) + (d.mag || 0)) - ((curDef?.atk || 0) + (curDef?.def || 0) + (curDef?.mag || 0)) : 0;
        html += `<div class="sh-mem ${can ? '' : 'no'}" data-look="${ch.id}"><span class="nm">${ch.name}</span><span class="${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}">${can ? (delta > 0 ? `▲${delta}` : delta < 0 ? `▼${-delta}` : '=') : '—'}</span></div>`;
      }
      html += '</div>';
    }
    if (this.qty !== null) html += `<div class="sh-qty">Quantity: <b>◂ ${this.qty} ▸</b> &nbsp; Total: <b>${this.qty * it.price} G</b><div class="dim">Z to confirm, X to cancel</div></div>`;
    this.detail.innerHTML = html;
    this.detail.querySelectorAll('.sh-mem').forEach((m) => {
      const ch = this.state.characters[m.dataset.look];
      if (ch) m.prepend(getPortrait(ch.look, 1));
    });
  }

  maxQty(it) {
    if (this.tab === 1) return it.have;
    if (it.d.kind === 'crest') return 1;
    return Math.max(0, Math.min(99 - it.have, Math.floor(this.state.gold / Math.max(1, it.price))));
  }

  handleInput(input) {
    const it = this.list.current;
    if (this.qty !== null) {
      const max = this.maxQty(it);
      if (input.repeat('right') || input.repeat('up')) { this.qty = Math.min(max, this.qty + 1); this.sfx('cursor'); this.renderDetail(); }
      if (input.repeat('left') || input.repeat('down')) { this.qty = Math.max(1, this.qty - 1); this.sfx('cursor'); this.renderDetail(); }
      if (input.pressed('cancel')) { input.consumeAll(); this.qty = null; this.sfx('cancel'); this.renderDetail(); }
      if (input.pressed('confirm')) { input.consumeAll(); this.transact(it, this.qty); this.qty = null; this.build(); }
      return;
    }
    if (input.pressed('pageRight') || input.pressed('pageLeft')) { this.tab = 1 - this.tab; this.list = null; this.sfx('cursor'); this.build(); return; }
    const r = this.list.handle(input, (s) => this.sfx(s));
    if (r === 'move') this.renderDetail();
    if (r === 'cancel') { this.sfx('cancel'); this.close(); return; }
    if (r === 'confirm' && it) {
      if (this.maxQty(it) < 1) { this.sfx('buzzer'); return; }
      this.sfx('confirm');
      this.qty = 1;
      this.renderDetail();
    }
  }

  transact(it, n) {
    if (this.tab === 0) {
      const cost = it.price * n;
      if (cost > this.state.gold) { this.sfx('buzzer'); return; }
      this.state.gold -= cost;
      if (it.d.kind === 'crest') {
        this.state.unlockCrest(it.d.crest);
        this.game.ui.toast(`The ${this.state.crestName(it.d.crest)} Crest is now available to everyone.`);
      } else this.state.inventory.add(it.id, n);
    } else {
      this.state.gold += it.price * n;
      this.state.inventory.remove(it.id, n);
    }
    this.sfx('item');
  }
}
