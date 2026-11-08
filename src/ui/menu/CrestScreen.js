// Crest (class) management and Support (passive) loadouts.

import { el, richText } from '../UI.js';
import { keyCap } from '../../core/Input.js';
import { Screen, ListView, header, KEYS, portraitEl } from './common.js';
import { CRESTS, CREST_ORDER, MAX_RANK, MAX_STARS, STAR_STATS, STAR_ARTS, starText } from '../../data/crests.js';
import { SKILLS } from '../../data/skills.js';
import { PASSIVES } from '../../data/passives.js';
import { WEAPON_TYPES } from '../../data/equipment.js';
import { getCharacterSheet, BATTLE_W, BATTLE_H } from '../../render/SpriteFactory.js';

const STAT_NAMES = { hp: 'HP', mp: 'MP', str: 'STR', mag: 'MAG', def: 'DEF', res: 'RES', spd: 'SPD', lck: 'LCK' };
const TIER_NAMES = { 1: 'Calling', 2: 'Braided Calling', 3: 'Legend' };

/** Base class for screens that work on one party member with Q/E switching. */
class MemberScreen extends Screen {
  constructor(menus, cls, memberIndex) {
    super(menus, cls);
    this.memberIndex = memberIndex || 0;
  }

  get ch() { return this.state.allMembers()[this.memberIndex]; }

  /** Draw the screen (each subclass draws its own). */
  build() {}

  switchMember(input) {
    const n = this.state.party.length;
    if (input.pressed('pageRight')) { this.memberIndex = (this.memberIndex + 1) % n; this.sfx('cursor'); this.onMemberChange(); return true; }
    if (input.pressed('pageLeft')) { this.memberIndex = (this.memberIndex + n - 1) % n; this.sfx('cursor'); this.onMemberChange(); return true; }
    return false;
  }

  onMemberChange() { this.build(); }
}

export class CrestScreen extends MemberScreen {
  constructor(menus, memberIndex) {
    super(menus, 'crest-screen', memberIndex);
    this.build();
  }

  entries() {
    const ch = this.ch;
    const avail = new Set(this.state.crestsAvailableTo(ch));
    return CREST_ORDER.map((id) => {
      const c = CRESTS[id];
      const known = avail.has(id);
      const showReq = c.tier === 2 && this.state.flags.crestArtLearned;
      const visible = known || showReq || (c.tier === 1 && this.state.flags.crestArtLearned);
      return { id, c, known, visible, rank: ch.rankOf(id) };
    }).filter((e) => e.visible || e.rank > 0);
  }

  build() {
    const ch = this.ch;
    this.el.innerHTML = header(`Crests — ${ch.name}`, `${KEYS.nav} ${KEYS.ok} ${KEYS.back} ${KEYS.swap}`);
    const body = el('div', 'cs-body');
    const left = el('div', 'cs-left panel');
    const items = this.entries();
    const prevId = this.list?.current?.id;
    this.list = new ListView({
      items,
      pageSize: 14,
      render: (e) => {
        const tag = ch.crest === e.id ? '<span class="tag p">PRIMARY</span>' : ch.secondary === e.id ? '<span class="tag s">SECOND</span>' : '';
        // Mastered crests show their Ascension stars in place of the rank pips.
        const pips = e.rank >= MAX_RANK ? `<span class="pips stars">${starText(ch.starsOf(e.id))}</span>`
          : e.rank ? `<span class="pips">${'◆'.repeat(e.rank)}${'◇'.repeat(MAX_RANK - e.rank)}</span>` : '';
        return `<span class="ci" style="color:${e.c.color}">${e.c.icon}</span><span class="cn ${e.known ? '' : 'locked'}">${e.known ? e.c.name : e.c.tier === 1 ? '??? (Crest Stone)' : e.c.name}</span>${tag}${pips}`;
      },
    });
    if (prevId) this.list.index = Math.max(0, items.findIndex((e) => e.id === prevId));
    this.list.refresh();
    left.appendChild(this.list.el);
    if (!this.state.flags.crestArtLearned) {
      left.appendChild(el('div', 'cs-lock dim', '<em>One Crest, one life.</em> No one you know has ever changed theirs.'));
    }
    this.detail = el('div', 'cs-detail panel');
    const who = el('div', 'cs-who panel');
    who.appendChild(portraitEl(ch.look, 3));
    who.appendChild(el('div', 'cs-who-text', `<div class="pc-name">${ch.name}</div><div>Lv ${ch.level}</div>
      <div class="dim">Primary: <b style="color:${CRESTS[ch.crest].color}">${CRESTS[ch.crest].name}</b></div>
      <div class="dim">Secondary: <b>${ch.secondary ? CRESTS[ch.secondary].name : '—'}</b></div>`));
    this.preview = document.createElement('canvas');
    this.preview.width = BATTLE_W;
    this.preview.height = BATTLE_H;
    this.preview.className = 'cs-preview';
    who.appendChild(this.preview);
    body.append(left, this.detail, who);
    this.el.appendChild(body);
    this.renderDetail();
  }

  /** Draw the character in the highlighted Crest's battle costume. */
  renderPreview(crestId) {
    const ch = this.ch;
    const fake = Object.assign(Object.create(Object.getPrototypeOf(ch)), ch, { crest: crestId });
    const sheet = getCharacterSheet(fake.battleLook());
    const ctx = this.preview.getContext('2d');
    ctx.clearRect(0, 0, BATTLE_W, BATTLE_H);
    ctx.drawImage(sheet.canvas, 0, 128, BATTLE_W, BATTLE_H, 0, 0, BATTLE_W, BATTLE_H);
  }

  renderDetail() {
    const e = this.list.current;
    if (!e) { this.detail.innerHTML = ''; return; }
    const ch = this.ch;
    const c = e.c;
    if (e.known) this.renderPreview(e.id);
    const prog = e.rank ? ch.rankProgress(e.id) : null;
    let html = `<div class="cd-name" style="color:${c.color}">${c.icon} ${c.name}</div><div class="cd-tier">${TIER_NAMES[c.tier]}</div>`;
    html += `<div class="cd-desc">${c.desc}</div>`;
    if (c.requires) {
      html += '<div class="cd-req">Requires: ' + Object.entries(c.requires).map(([r, n]) => {
        const have = ch.rankOf(r);
        return `<span class="${have >= n ? 'ok' : 'no'}">${CRESTS[r].name} R${n} (${have})</span>`;
      }).join(' · ') + '</div>';
    }
    html += '<div class="cd-stats">';
    for (const [k, v] of Object.entries(c.stats)) {
      const pct = Math.round((v - 1) * 100);
      html += `<div class="cd-stat"><span>${STAT_NAMES[k]}</span><div class="cd-statbar"><i class="${pct >= 0 ? 'up' : 'down'}" style="width:${Math.min(100, Math.abs(pct) * 2.5)}%"></i></div><span class="${pct > 0 ? 'up' : pct < 0 ? 'down' : ''}">${pct > 0 ? '+' : ''}${pct}%</span></div>`;
    }
    html += '</div>';
    html += `<div class="cd-gear">Weapons: ${c.weapons.map((w) => WEAPON_TYPES[w].name).join(', ')}<br>Armor: ${c.armor.join(', ')}${c.shield ? ', shields' : ''}</div>`;
    if (prog && prog.need) html += `<div class="cd-prog">Rank ${prog.rank} — ${prog.need} CP to next<div class="mbar exp"><i style="width:${prog.frac * 100}%"></i></div></div>`;
    else if (prog) {
      const asc = ch.ascendProgress(e.id);
      html += `<div class="cd-prog">MASTERED · Ascension <span class="cd-stars">${starText(asc.stars)}</span>${asc.need ? ` — ${asc.need} CP to ★${asc.stars + 1}` : ''}<div class="mbar exp asc"><i style="width:${asc.frac * 100}%"></i></div></div>`;
    }
    if (c.legacy) {
      const have = e.rank >= MAX_RANK;
      html += `<div class="cd-legacy ${have ? 'have' : ''}"><span class="k">Legacy</span> ${c.legacy.desc} <span class="dim">${have ? '— yours, whatever you wear' : '— on mastery, whatever you wear'}</span></div>`;
      if (have) {
        const stars = ch.starsOf(e.id);
        html += `<div class="cd-legacy asc dim">Each ★: all stats +${STAR_STATS}% as Primary, this Crest's Arts +${STAR_ARTS}%; ${MAX_STARS}★ adds a Support Point.${stars ? ` Now: stats +${stars * STAR_STATS}%, Arts +${stars * STAR_ARTS}%.` : ''}</div>`;
      }
    }
    html += '<div class="cd-ranks">';
    c.ranks.forEach((u, i) => {
      const learned = e.rank > i;
      const name = u.skill ? SKILLS[u.skill].name : PASSIVES[u.passive].name;
      const kind = u.skill ? 'Art' : 'Support';
      const desc = u.skill ? SKILLS[u.skill].desc : PASSIVES[u.passive].desc;
      const mp = u.skill && SKILLS[u.skill].mp ? `${SKILLS[u.skill].mp} MP` : '';
      html += `<div class="cd-rank ${learned ? 'learned' : ''}"><span class="r">R${i + 1}</span><span class="k">${kind}</span><span class="n">${learned || e.known ? name : '???'}</span><span class="mp">${mp}</span><div class="d">${learned || e.known ? richText(desc || '') : ''}</div></div>`;
    });
    html += '</div>';
    this.detail.innerHTML = html;
  }

  async handleInput(input) {
    if (this.busy) return;
    if (this.switchMember(input)) return;
    const r = this.list.handle(input, (s) => this.sfx(s));
    if (r === 'move') this.renderDetail();
    if (r === 'cancel') { this.sfx('cancel'); this.close(); return; }
    if (r !== 'confirm') return;
    const e = this.list.current;
    const ch = this.ch;
    if (!e.known) { this.sfx('buzzer'); return; }
    this.sfx('confirm');
    this.busy = true;
    const opts = ['Set as Primary', 'Set as Secondary', 'Cancel'];
    const pick = await this.game.ui.choice(opts, { prompt: `${CRESTS[e.id].name}`, cancel: 2 });
    this.busy = false;
    if (pick === 0) {
      if (ch.crest === e.id) return;
      ch.setCrest(e.id);
      const removed = ch.validateEquipment();
      for (const id of removed) this.state.inventory.add(id, 1);
      ch.clampVitals();
      this.sfx('join');
      if (removed.length) this.game.ui.toast(`Unequipped: ${removed.map((id) => this.state.inventory.itemName(id)).join(', ')}`);
    } else if (pick === 1) {
      if (ch.crest === e.id) { this.sfx('buzzer'); return; }
      ch.setSecondary(ch.secondary === e.id ? null : e.id);
      this.sfx('buff');
    }
    this.build();
  }
}

export class SupportScreen extends MemberScreen {
  constructor(menus, memberIndex) {
    super(menus, 'support-screen', memberIndex);
    this.build();
  }

  build() {
    const ch = this.ch;
    const learned = ch.learnedPassives();
    const sourceOf = (pid) => Object.keys(ch.crests).find((c) => CRESTS[c].ranks.some((u) => u.passive === pid));
    this.el.innerHTML = header(`Supports — ${ch.name}`, `${KEYS.nav} ${keyCap('confirm')} Equip/Remove ${KEYS.back} ${KEYS.swap}`);
    const body = el('div', 'sp-body');
    const left = el('div', 'sp-left panel');
    const used = ch.supportUsed(), budget = ch.supportBudget();
    left.appendChild(el('div', 'sp-budget', `Support Points <b>${used}</b> / ${budget}<div class="sp-pips">${'●'.repeat(used)}${'○'.repeat(Math.max(0, budget - used))}</div>`));
    const prev = this.list?.index || 0;
    this.list = new ListView({
      items: learned.map((id) => ({ id, p: PASSIVES[id], on: ch.passives.includes(id), src: sourceOf(id) })),
      pageSize: 13,
      empty: 'No supports learned yet. Rank up Crests to learn them.',
      render: (it) => `<span class="chk">${it.on ? '◆' : '◇'}</span><span class="pn">${it.p.name}</span><span class="pc">${'●'.repeat(it.p.cost)}</span>`,
    });
    this.list.index = Math.min(prev, Math.max(0, learned.length - 1));
    this.list.refresh();
    left.appendChild(this.list.el);
    this.detail = el('div', 'sp-detail panel');
    body.append(left, this.detail);
    this.el.appendChild(body);
    this.renderDetail();
  }

  renderDetail() {
    const it = this.list.current;
    if (!it) { this.detail.innerHTML = '<div class="dim">Supports are passive abilities learned from Crest ranks. Any learned Support can be equipped, whatever your current Crest.</div>'; return; }
    this.detail.innerHTML = `<div class="cd-name">${it.p.name}</div><div class="cd-tier">Cost ${it.p.cost} · from ${it.src ? CRESTS[it.src].name : '—'}</div><div class="cd-desc">${it.p.desc}</div>
      <div class="dim" style="margin-top:18px">Supports are passive abilities learned from Crest ranks. Any learned Support can be equipped, whatever your current Crest.</div>`;
  }

  handleInput(input) {
    if (this.switchMember(input)) return;
    const r = this.list.handle(input, (s) => this.sfx(s));
    if (r === 'move') this.renderDetail();
    if (r === 'cancel') { this.sfx('cancel'); this.close(); return; }
    if (r === 'confirm' && this.list.current) {
      const ok = this.ch.togglePassive(this.list.current.id);
      this.sfx(ok ? 'confirm' : 'buzzer');
      if (!ok) this.game.ui.toast('Not enough Support Points.');
      this.ch.clampVitals();
      this.build();
    }
  }
}

export { MemberScreen };
