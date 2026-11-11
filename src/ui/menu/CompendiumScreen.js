// The Compendium (menu 'bestiary'): Greer Thackery's book of every creature, one
// section per chapter plus side paths, marks, arenas and the Abyss. Entries are
// numbered in book order; a creature never met is a "???" in its place, so the gaps
// show what is still out there. data/monsterInfo.js decides what the party knows.

import { el } from '../UI.js';
import { Screen, ListView, header, KEYS } from './common.js';
import { keyCap } from '../../core/Input.js';
import { enemyStats } from '../../data/enemies.js';
import { SKILLS } from '../../data/skills.js';
import { STATUSES } from '../../data/statuses.js';
import { DIFFICULTIES, DEFAULT_DIFFICULTY } from '../../data/difficulty.js';
import { getMonsterSprite } from '../../render/MonsterFactory.js';
import { ELEM_ICONS } from '../../battle/BattleUI.js';
import { allMaps } from '../../data/maps/index.js';
import {
  SECTIONS, STUDY_DEFEATS, bookOrder, entryNo, habitatOf, recordOf, knowledge, completion, tacticsOf, rarity, familyOf,
} from '../../data/monsterInfo.js';

const elem = (e) => `<span class="cp-elem" style="color:${ELEM_ICONS[e]?.[1] || 'inherit'}">${ELEM_ICONS[e]?.[0] || ''} ${e}</span>`;
const STARS = ['', '★☆☆', '★★☆', '★★★'];

export class CompendiumScreen extends Screen {
  constructor(menus) {
    super(menus, 'bestiary-screen compendium');
    const st = this.state;
    const book = bookOrder();
    // Sections with anything in them the party has met (no spoilers for the rest).
    this.sections = SECTIONS.map((s) => ({ ...s, entries: book.filter((e) => e.section === s.id) }))
      .filter((s) => s.entries.some((e) => recordOf(st, e.id)?.seen));
    this.done = completion(st);
    const here = this.sections.findIndex((s) => s.id === st.chapter);
    this.tab = Math.max(0, here);
    this.build();
  }

  build() {
    const all = this.done.all;
    const pct = all.total ? Math.floor((100 * all.defeated) / all.total) : 0;
    this.el.innerHTML = header(`Compendium — ${all.seen} recorded · ${all.defeated} felled of ${all.total} (${pct}%)`,
      `${KEYS.nav} ${keyCap('pageLeft')}${keyCap('pageRight')} Section ${KEYS.back}`);
    const body = el('div', 'bs-body');
    const left = el('div', 'bs-left panel');
    const sec = this.sections[this.tab];
    this.secEl = el('div', 'cp-section');
    left.appendChild(this.secEl);
    this.list = new ListView({
      items: sec ? sec.entries : [], pageSize: 13, empty: 'No creatures recorded yet.',
      render: (it) => this.row(it),
    });
    left.appendChild(this.list.el);
    // Start on the first entry the party knows.
    const first = this.list.items.findIndex((e) => recordOf(this.state, e.id)?.seen);
    if (first > 0) { this.list.index = first; this.list.refresh(); }
    this.detail = el('div', 'bs-detail panel');
    body.append(left, this.detail);
    this.el.appendChild(body);
    this.renderSection();
    this.renderDetail();
  }

  renderSection() {
    const sec = this.sections[this.tab];
    if (!sec) { this.secEl.innerHTML = ''; return; }
    const c = this.done.by[sec.id] || { seen: 0, defeated: 0, total: 0 };
    const many = this.sections.length > 1;
    this.secEl.innerHTML = `<div class="cp-sec-name">${many ? '◀ ' : ''}${sec.name}${many ? ' ▶' : ''}</div>
      <div class="cp-sec-sub">${sec.sub} · ${c.defeated}/${c.total} felled${c.defeated === c.total ? ' <span class="cp-full">✔ Complete</span>' : ''}</div>`;
  }

  row(it) {
    const r = recordOf(this.state, it.id);
    const k = knowledge(this.state, it.def);
    if (!k) return `<span class="cp-no">${entryNo(it.no)}</span><span class="in dim">???</span>`;
    const tag = it.def.mark ? '<span class="cp-tag mark">MARK</span>' : it.def.boss ? '<span class="cp-tag boss">BOSS</span>' : '';
    return `<span class="cp-no">${entryNo(it.no)}</span><span class="in">${it.def.name}</span>${tag}<span class="cnt">${r.defeated ? `×${r.defeated}` : '<span class="dim">seen</span>'}</span>`;
  }

  renderDetail() {
    const it = this.list.current;
    const st = this.state;
    if (!it) { this.detail.innerHTML = ''; return; }
    const k = knowledge(st, it.def);
    if (!k) {
      this.detail.innerHTML = `<div class="cd-name">???</div><div class="cd-tier">${entryNo(it.no)}</div><div class="cd-desc dim">Not yet recorded. Something is out there that the book has no name for.</div>`;
      return;
    }
    const e = it.def;
    const r = recordOf(st, e.id);
    const s = enemyStats(e);
    const d = DIFFICULTIES[st.settings.difficulty ?? DEFAULT_DIFFICULTY] || DIFFICULTIES[DEFAULT_DIFFICULTY];
    const known = (n) => (k >= n);
    const weakKnown = (r.weak || []);
    const weakAll = e.weak || [];
    const weak = weakAll.length
      ? weakAll.map((w) => (weakKnown.includes(w) || known(3) ? elem(w) : '<span class="dim">???</span>')).join(' ')
      : 'None';
    const resEntries = Object.entries(e.resist || {});
    const resSeen = new Set(r.res || []);
    const res = resEntries.length
      ? resEntries.map(([el2, m]) => (resSeen.has(el2) || known(3) ? `${elem(el2)} ${m < 0 ? 'absorbs' : m === 0 ? 'immune' : `×${m}`}` : '<span class="dim">???</span>')).join(' · ')
      : 'None';
    const imm = (e.immune || []).length
      ? e.immune.map((x) => ((r.imm || []).includes(x) || known(3) ? STATUSES[x]?.name || x : '<span class="dim">???</span>')).join(', ')
      : 'None';
    const moveIds = [...new Set((e.skills || []).map(([id]) => id))];
    const seenMoves = new Set(r.moves || []);
    const moves = e.ai && !e.skills
      ? ((r.moves || []).map((id) => SKILLS[id]?.name).filter(Boolean).join(', ') || '<span class="dim">???</span>')
      : moveIds.map((id) => (seenMoves.has(id) || known(3) ? SKILLS[id]?.name || id : '<span class="dim">???</span>')).join(', ');
    const inv = st.inventory;
    const drops = known(2) ? ((e.drops || []).map(([id, c]) => `${inv.itemName(id)} <span class="dim">(${rarity(c)})</span>`).join(', ') || 'None') : '???';
    const steal = known(3) && e.steal?.length ? `${inv.itemName(e.steal[0])}${e.steal[1] && e.steal[1] !== e.steal[0] ? ` / ${inv.itemName(e.steal[1])} <span class="dim">(rare)</span>` : ''}` : known(3) ? 'Nothing' : '???';
    const where = habitatOf(e.id, allMaps());
    const habitat = known(2) ? (where.length ? where.join(', ') : (e.mark ? 'Wherever the Ledger says' : 'Met only once')) : '???';
    const tactics = known(3)
      ? `<ul class="cp-tactics">${tacticsOf(e).map((t) => `<li>${t}</li>`).join('')}</ul>`
      : `<div class="dim cp-tactics-locked">Fell ${e.boss || e.mark ? 'it' : `${STUDY_DEFEATS} of them`} to learn how it fights. (${r.defeated || 0}/${e.boss || e.mark ? 1 : STUDY_DEFEATS})</div>`;
    this.detail.innerHTML = `<div class="cd-name">${e.name}${e.mark ? ' <span class="cp-tag mark">MARK</span>' : e.boss ? ' <span class="cp-tag boss">BOSS</span>' : ''}</div>
      <div class="cd-tier">${entryNo(it.no)} · ${familyOf(e)} · Lv ${e.level} · <span class="cp-stars" title="seen · felled · studied">${STARS[k]}</span> · Seen ${r.seen} · Felled ${r.defeated}</div>
      <div class="cp-top"><div class="bs-art"></div><div class="cd-desc">${e.desc || ''}</div></div>
      <div class="bs-row"><b>Habitat</b> ${habitat}</div>
      <div class="bs-row"><b>HP</b> ${known(2) ? Math.round(s.hp * d.hp).toLocaleString() : '???'} · <b>Poise</b> ${e.poise ?? 2} · <b>EXP</b> ${known(2) ? s.exp : '???'} · <b>Gold</b> ${known(2) ? s.gold : '???'} · <b>CP</b> ${known(2) ? s.cp : '???'}</div>
      <div class="bs-row"><b>Weak</b> ${weak}</div>
      <div class="bs-row"><b>Resists</b> ${res}</div>
      <div class="bs-row"><b>Immune</b> ${imm}</div>
      <div class="bs-row"><b>Moves</b> ${moves}</div>
      <div class="bs-row"><b>Drops</b> ${drops} · <b>Steal</b> ${steal}</div>
      <div class="bs-row cp-tactics-head"><b>Tactics</b></div>${tactics}`;
    const art = getMonsterSprite(e.sprite).canvas;
    const img = document.createElement('canvas');
    img.width = art.width; img.height = art.height;
    img.getContext('2d').drawImage(art, 0, 0);
    const scale = Math.max(1, Math.min(3, Math.floor(150 / art.height)));
    img.style.width = `${art.width * scale}px`;
    this.detail.querySelector('.bs-art').appendChild(img);
  }

  handleInput(input) {
    const n = this.sections.length;
    if (n > 1 && (input.pressed('pageRight') || input.pressed('pageLeft'))) {
      this.tab = (this.tab + (input.pressed('pageRight') ? 1 : n - 1)) % n;
      input.consume('pageRight'); input.consume('pageLeft');
      this.sfx('cursor');
      this.build();
      return;
    }
    const r = this.list.handle(input, (s) => this.sfx(s));
    if (r === 'move') this.renderDetail();
    if (r === 'cancel' || r === 'confirm') { this.sfx('cancel'); this.close(); }
  }
}
