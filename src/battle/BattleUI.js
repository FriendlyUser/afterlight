// DOM battle HUD: party status, turn timeline, Afterglow gauge, enemy tags,
// command menus (with Surge), target selection, popups and victory screen.

import { el, richText } from '../ui/UI.js';
import { keyCap } from '../core/Input.js';
import { SKILLS } from '../data/skills.js';
import { CRESTS, MAX_RANK, starText } from '../data/crests.js';
import { artSummaryHtml } from '../data/artInfo.js';
import { STATUSES } from '../data/statuses.js';
import { LINKS } from '../data/links.js';
import { PASSIVES } from '../data/passives.js';
import { ITEMS } from '../data/items.js';
import { getPortrait } from '../render/SpriteFactory.js';
import { AFTERGLOW_MAX, turnShifts } from './Actions.js';

export const ELEM_ICONS = {
  slash: ['⚔', '#e8e0d0'], pierce: ['➶', '#e8e0d0'], blunt: ['⚒', '#e8e0d0'],
  fire: ['✹', '#ff7a4a'], ice: ['❄', '#8ad8ff'], bolt: ['ϟ', '#ffe060'], wind: ['≋', '#8af0a0'],
  light: ['☀', '#ffe8a0'], dark: ['☾', '#c090ff'],
};
const ELEM_ORDER = ['slash', 'pierce', 'blunt', 'fire', 'ice', 'bolt', 'wind', 'light', 'dark'];
const STAGE_NAMES = { str: 'STR', mag: 'MAG', def: 'DEF', res: 'RES', spd: 'SPD', eva: 'EVA' };

/** Stats shown on the level-up screen. */
const LEVEL_STATS = [['hp', 'HP'], ['mp', 'MP'], ['str', 'STR'], ['mag', 'MAG'], ['def', 'DEF'], ['res', 'RES'], ['spd', 'SPD'], ['lck', 'LCK']];

export class BattleUI {
  constructor(scene) {
    this.scene = scene;
    this.game = scene.game;
    this.ui = scene.game.ui;
    this.root = el('div', 'battle-ui');
    this.ui.layers.hud.appendChild(this.root);

    this.timeline = el('div', 'b-timeline');
    this.msg = el('div', 'b-msg');
    this.banner = el('div', 'b-skill-banner');
    this.partyPanel = el('div', 'b-party panel');
    this.glow = el('div', 'b-afterglow');
    this.tags = el('div', 'b-tags');
    this.pops = el('div', 'b-pops');
    this.root.append(this.tags, this.pops, this.timeline, this.msg, this.banner, this.partyPanel, this.glow);
    this.rows = new Map();
    this.enemyTags = new Map();
  }

  dispose() { this.root.remove(); }

  // ------------------------------------------------------------------ party panel

  buildParty(party) {
    this.partyPanel.innerHTML = '';
    this.rows.clear();
    for (const b of party) {
      const row = el('div', 'b-row');
      const portrait = el('div', 'b-portrait');
      portrait.appendChild(getPortrait(b.ch.look, 2));
      row.append(portrait, el('div', 'b-name', b.name), el('div', 'b-crest', CRESTS[b.ch.crest].name));
      const hp = el('div', 'b-bar hp', '<i></i><span></span>');
      const mp = el('div', 'b-bar mp', '<i></i><span></span>');
      const st = el('div', 'b-status');
      row.append(hp, mp, st);
      this.partyPanel.appendChild(row);
      this.rows.set(b, { row, hp, mp, st });
    }
    this.refreshParty();
  }

  replaceMember(oldB, newB) {
    const r = this.rows.get(oldB);
    if (!r) return;
    this.rows.delete(oldB);
    r.row.querySelector('.b-portrait').innerHTML = '';
    r.row.querySelector('.b-portrait').appendChild(getPortrait(newB.ch.look, 2));
    r.row.querySelector('.b-name').textContent = newB.name;
    r.row.querySelector('.b-crest').textContent = CRESTS[newB.ch.crest].name;
    this.rows.set(newB, r);
    this.refreshParty();
  }

  refreshParty() {
    for (const [b, r] of this.rows) {
      const hpPct = b.hp / b.maxHp;
      r.hp.querySelector('i').style.width = `${hpPct * 100}%`;
      r.hp.querySelector('span').textContent = `${b.hp} / ${b.maxHp}`;
      r.hp.classList.toggle('low', hpPct < 0.5);
      r.hp.classList.toggle('crit', hpPct < 0.25);
      r.mp.querySelector('i').style.width = `${(b.mp / b.maxMp) * 100}%`;
      r.mp.querySelector('span').textContent = `${b.mp}`;
      r.row.classList.toggle('ko', !b.alive);
      r.st.innerHTML = this.statusIcons(b);
    }
    this.refreshGlow();
  }

  statusIcons(b) {
    let html = '';
    for (const id of b.statuses.keys()) {
      const s = STATUSES[id];
      if (s) html += `<span class="st" style="color:${s.color}" title="${s.name}">${s.icon}</span>`;
    }
    for (const [k, s] of Object.entries(b.stages)) html += `<span class="st ${s.v > 0 ? 'up' : 'down'}">${STAGE_NAMES[k]}${s.v > 0 ? '▲' : '▼'}</span>`;
    return html;
  }

  setActive(b) {
    for (const [x, r] of this.rows) r.row.classList.toggle('active', x === b);
  }

  refreshGlow() {
    const v = this.scene.sys.afterglow;
    let html = '<div class="ag-label">AFTERGLOW</div><div class="ag-segs">';
    for (let i = 0; i < 3; i++) {
      const f = Math.max(0, Math.min(1, (v - i * 100) / 100));
      html += `<div class="ag-seg ${f >= 1 ? 'full' : ''}"><i style="width:${f * 100}%"></i></div>`;
    }
    html += '</div>';
    this.glow.innerHTML = html;
  }

  // ------------------------------------------------------------------ timeline

  /**
   * The turn order: who is acting now, then the turns that follow. While a command
   * is being chosen, `action` previews it: the actor's next turn is marked where
   * that command would put it (quick Arts sooner, heavy ones later), and `shift`
   * (Actions.turnShifts) shows foes pushed back or an ally pulled forward.
   * @param {import('./Battler.js').Battler | null} current
   * @param {object | null} [action]
   * @param {Map<import('./Battler.js').Battler, number> | null} [shift]
   */
  refreshTimeline(current, action = null, shift = null) {
    const sys = this.scene.sys;
    const SHOWN = 7;
    const order = sys.forecast(current ? SHOWN + 8 : SHOWN + 1, current, current ? sys.actionDelay(current, action) : 1, shift);
    const key = `${current?.index}${current?.side}|${action?.kind}:${action?.id}|${order.map((b) => `${b.side}${b.index}`).join(',')}|${shift ? [...shift.keys()].map((b) => b.index).join('.') : ''}`;
    if (key === this.timelineKey) return; // nothing moved: keep the DOM (and its transitions)
    this.timelineKey = key;
    this.timeline.innerHTML = '';
    const chip = (b, cls) => {
      const d = el('div', `tl-item ${b.isParty ? 'ally' : 'foe'} ${cls}`);
      if (b.isParty) d.appendChild(getPortrait(b.ch.look, 1));
      else d.appendChild(el('span', 'tl-foe', `${b.name[0]}${this.scene.enemyLetter(b)}`));
      this.timeline.appendChild(d);
    };
    if (current) chip(current, 'now');
    const nextAt = action && current ? order.indexOf(current) : -1; // where this command lands the actor
    const seen = new Set();
    order.slice(0, current ? SHOWN : SHOWN + 1).forEach((b, i) => {
      const moved = shift?.has(b) && !seen.has(b) ? (shift.get(b) > 0 ? 'pushed' : 'pulled') : '';
      seen.add(b);
      chip(b, `${i === nextAt ? 'next' : ''} ${moved}`);
    });
    if (nextAt >= SHOWN) {
      // The actor's next turn is further off than the bar shows.
      this.timeline.appendChild(el('div', 'tl-gap', '···'));
      chip(current, 'next');
    }
  }

  // ------------------------------------------------------------------ enemy tags

  buildEnemyTag(b) {
    const tag = el('div', 'b-etag');
    this.tags.appendChild(tag);
    this.enemyTags.set(b, tag);
    this.refreshEnemyTag(b);
  }

  refreshEnemyTag(b) {
    const tag = this.enemyTags.get(b);
    if (!tag) return;
    if (!b.alive) { tag.style.display = 'none'; return; }
    const autoScan = this.scene.sys.party.some((p) => p.flags.has('autoScan'));
    const known = b.scanned || autoScan;
    const shield = `<span class="poise ${b.broken ? 'broken' : ''}">${b.broken ? 'BREAK' : `<b>${b.poise}</b>`}</span>`;
    let weak = '';
    const elems = ELEM_ORDER.filter((e) => b.weak.has(e));
    for (const e of elems) {
      const shown = b.revealed.has(e) || known;
      weak += shown ? `<span class="wk" style="color:${ELEM_ICONS[e][1]}">${ELEM_ICONS[e][0]}</span>` : '<span class="wk unk">?</span>';
    }
    const hp = known ? `<div class="etag-hp"><i style="width:${(b.hp / b.maxHp) * 100}%"></i></div>` : '';
    const st = b.statuses.size || Object.keys(b.stages).length ? `<div class="etag-st">${this.statusIcons(b)}</div>` : '';
    const letter = this.scene.enemyLetter(b);
    tag.innerHTML = `<div class="etag-name">${b.name}${letter ? ` ${letter}` : ''}</div><div class="etag-row">${shield}${weak}</div>${hp}${st}`;
    tag.style.display = '';
  }

  /** Called each frame with projected screen positions. */
  positionTags(project) {
    for (const [b, tag] of this.enemyTags) {
      if (!b.alive) continue;
      const p = project(b, 'foot');
      tag.style.left = `${p.x}px`;
      tag.style.top = `${p.y + 6}px`;
    }
  }

  // ------------------------------------------------------------------ messages & popups

  showBanner(text) {
    this.banner.textContent = text;
    this.banner.classList.remove('show');
    void this.banner.offsetWidth;
    this.banner.classList.add('show');
  }

  hideBanner() { this.banner.classList.remove('show'); }

  async message(text, sec = 1.0) {
    this.msg.innerHTML = richText(text);
    this.msg.classList.add('show');
    await this.game.wait(sec);
    this.msg.classList.remove('show');
  }

  popup(screen, text, cls = '') {
    const p = el('div', `b-pop ${cls}`, text);
    p.style.left = `${screen.x + (Math.random() - 0.5) * 24}px`;
    p.style.top = `${screen.y}px`;
    this.pops.appendChild(p);
    setTimeout(() => p.remove(), 1400);
  }

  bigText(screen, text, cls) {
    const p = el('div', `b-big ${cls}`, text);
    p.style.left = `${screen.x}px`;
    p.style.top = `${screen.y}px`;
    this.pops.appendChild(p);
    setTimeout(() => p.remove(), 1600);
  }

  stageText(key, delta) { return `${STAGE_NAMES[key]} ${delta > 0 ? '▲'.repeat(delta) : '▼'.repeat(-delta)}`; }

  // ------------------------------------------------------------------ command input

  /** Resolve to an action for the active party member. */
  chooseAction(actor) {
    return new Promise((resolve) => {
      const w = new CommandMenu(this, actor, resolve);
      this.ui.push(w, 'menus');
    });
  }

  // ------------------------------------------------------------------ victory

  showVictory(summary) {
    this.root.classList.add('results'); // the fight is over: hide timeline, gauge and Auto chrome
    return new Promise((resolve) => {
      const box = el('div', 'panel victory');
      let html = '<div class="v-title">Victory</div>';
      html += `<div class="v-totals"><span>EXP <b>${summary.exp}</b></span><span>Gold <b>${summary.gold}</b></span><span>CP <b>${summary.cp}</b></span></div>`;
      if (summary.items.length) {
        const counts = {};
        for (const id of summary.items) counts[id] = (counts[id] || 0) + 1;
        html += `<div class="v-items">${Object.entries(counts).map(([id, n]) => `<span>${this.game.state.inventory.itemName(id)}${n > 1 ? ` ×${n}` : ''}</span>`).join('')}</div>`;
      }
      html += '<div class="v-members">';
      for (const r of summary.results) {
        const ch = r.ch;
        const prog = ch.rankProgress(ch.crest);
        // Past mastery the bar tracks the next Ascension star.
        const asc = prog.rank >= MAX_RANK ? ch.ascendProgress(ch.crest) : null;
        const standing = asc ? `<span class="v-stars">${starText(asc.stars)}</span>` : `R${prog.rank}`;
        html += `<div class="v-mem ${r.active ? '' : 'reserve'}"><div class="v-name">${ch.name}</div>
          <div class="v-lv">Lv ${ch.level}${r.levels ? ` <span class="v-up">LEVEL UP!</span>` : ''}</div>
          <div class="v-crest">${CRESTS[ch.crest].name} ${standing} <span class="v-cpbar"><i style="width:${(asc || prog).frac * 100}%"></i></span></div>`;
        for (const k of r.ranks) {
          const name = CRESTS[k.crest].name;
          if (k.star) {
            html += `<div class="v-learn">${name} ascends: <b>★${k.star}</b>${k.unlock ? ` — Mastery Art <b>${SKILLS[k.unlock.skill].name}</b>` : ''}</div>`;
            continue;
          }
          const u = k.unlock;
          const nm = u.skill ? SKILLS[u.skill].name : PASSIVES[u.passive].name;
          html += `<div class="v-learn">${name} rank ${k.rank}: learned <b>${nm}</b></div>`;
          if (k.legacy) html += `<div class="v-learn">${name} mastered — Legacy: <b>${k.legacy.desc}</b></div>`;
        }
        html += '</div>';
      }
      html += '</div><div class="v-hint">▼</div>';
      box.innerHTML = html;
      const w = {
        el: box,
        handleInput: (input) => {
          if (input.pressed('confirm') || input.pressed('cancel')) {
            input.consumeAll();
            this.ui.remove(w);
            resolve();
          }
        },
      };
      this.ui.push(w, 'menus');
    });
  }

  // ------------------------------------------------------------------ level up

  /**
   * The level-up screen: old → new level, every stat's gain, and new Support Points.
   * Resolves at once when nobody levelled.
   */
  showLevelUps(summary) {
    const ups = summary.results.filter((r) => r.levels > 0);
    if (!ups.length) return Promise.resolve();
    return new Promise((resolve) => {
      const box = el('div', 'panel levelup');
      box.appendChild(el('div', 'lu-title', 'Level Up!'));
      const row = el('div', 'lu-cards');
      for (const r of ups) {
        const ch = r.ch, now = ch.stats();
        const card = el('div', 'lu-card');
        const head = el('div', 'lu-head');
        head.appendChild(getPortrait(ch.look, 3));
        head.appendChild(el('div', 'lu-who', `<div class="lu-name">${ch.name}</div><div class="lu-lv">Lv <b>${r.levelFrom}</b> → <b class="up">${ch.level}</b>${r.levels > 1 ? ` <span class="lu-n">+${r.levels}</span>` : ''}</div>`));
        card.appendChild(head);
        let rows = '';
        for (const [k, label] of LEVEL_STATS) {
          const a = r.statsFrom?.[k] ?? now[k], b = now[k], d = b - a;
          rows += `<div class="lu-stat"><span class="k">${label}</span><span class="a">${a}</span><span class="arrow">→</span><span class="b ${d > 0 ? 'up' : ''}">${b}</span><span class="d">${d > 0 ? `+${d}` : ''}</span></div>`;
        }
        card.appendChild(el('div', 'lu-stats', rows));
        const sp = ch.supportBudget();
        if (r.supportFrom !== undefined && sp > r.supportFrom) card.appendChild(el('div', 'lu-extra', `Support Points ${r.supportFrom} → <b>${sp}</b>`));
        row.appendChild(card);
      }
      box.appendChild(row);
      box.appendChild(el('div', 'v-hint', '▼'));
      this.game.audio?.sfx('levelup');
      const w = {
        el: box,
        handleInput: (input) => {
          if (input.pressed('confirm') || input.pressed('cancel')) {
            input.consumeAll();
            this.ui.remove(w);
            resolve();
          }
        },
      };
      this.ui.push(w, 'menus');
    });
  }
}

// =====================================================================
// Command menu with nested lists and target selection
// =====================================================================

class CommandMenu {
  constructor(bui, actor, resolve) {
    this.bui = bui;
    this.scene = bui.scene;
    this.sys = bui.scene.sys;
    this.actor = actor;
    this.resolve = resolve;
    this.surge = 0;
    this.el = el('div', 'b-cmd');
    this.stack = [];
    this.openRoot();
  }

  get ui() { return this.bui.ui; }

  // ---------------------------------------------------------------- lists

  rootEntries() {
    const a = this.actor;
    /** @type {Array<{ label: string, kind: string, [field: string]: any }>} */
    const entries = [{ label: 'Attack', kind: 'skill', id: 'attack' }];
    for (const { crest, skills } of a.ch.skillLists()) {
      entries.push({ label: `${CRESTS[crest].name}`, kind: 'list', crest, skills, icon: CRESTS[crest].icon });
    }
    entries.push({ label: 'Items', kind: 'items' });
    const links = this.availableLinks();
    if (links.length) entries.push({ label: 'Link Arts', kind: 'links', links });
    entries.push({ label: 'Guard', kind: 'skill', id: 'guard' });
    if (this.sys.reserves().length) entries.push({ label: 'Swap', kind: 'swap' });
    if (!this.sys.boss) entries.push({ label: 'Flee', kind: 'flee' });
    entries.push({ label: 'Auto', kind: 'auto' });
    entries.push({ label: 'Skip', kind: 'skip' });
    return entries;
  }

  availableLinks() {
    const active = this.sys.party.filter((p) => p.alive && !p.hasStatus('sleep') && !p.hasStatus('stun'));
    const ids = new Set(active.map((p) => p.id));
    return LINKS.filter((l) => l.members.includes(this.actor.id) && l.members.every((m) => ids.has(m))
      && (!l.requiresFlag || this.scene.game.state.flags[l.requiresFlag]));
  }

  openRoot() {
    this.stack = [{ title: this.actor.name, entries: this.rootEntries(), index: this.lastRootIndex || 0, root: true }];
    this.render();
  }

  pushList(title, entries) {
    this.stack.push({ title, entries, index: 0 });
    this.render();
  }

  get top() { return this.stack[this.stack.length - 1]; }

  skillEntry(id) {
    const s = SKILLS[id];
    const cost = this.sys.resolver.mpCost(this.actor, s);
    const silenced = this.actor.hasStatus('silence') && (s.kind === 'mag' || s.kind === 'heal' || s.kind === 'hybrid');
    const disabled = cost > this.actor.mp || silenced;
    return { label: s.name, kind: 'skill', id, cost, disabled, desc: s.desc, detail: artSummaryHtml(s, { mp: cost, powerMult: this.actor.artPower?.[id] || 1 }) };
  }

  render() {
    const t = this.top;
    const surgeOk = this.sys.afterglow >= 100;
    let html = `<div class="cmd-title">${t.title}</div><div class="cmd-list">`;
    t.entries.forEach((e, i) => {
      const right = e.cost !== undefined && e.cost > 0 ? `<span class="cost">${e.cost} MP</span>` : e.count !== undefined ? `<span class="cost">×${e.count}</span>` : e.ag ? `<span class="cost ag">${e.ag}</span>` : e.kind === 'list' ? '<span class="cost">▸</span>' : '';
      html += `<div class="cmd-item ${i === t.index ? 'sel' : ''} ${e.disabled ? 'off' : ''}">${e.icon ? `<span class="ci">${e.icon}</span>` : ''}${e.label}${right}</div>`;
    });
    html += '</div>';
    const cur = t.entries[t.index];
    if (cur?.desc) html += `<div class="cmd-desc">${richText(cur.desc)}${cur.detail || ''}</div>`;
    html += `<div class="cmd-surge ${surgeOk ? '' : 'off'}">${keyCap('pageLeft')}${keyCap('pageRight')} Surge ${'◆'.repeat(this.surge)}${'◇'.repeat(Math.max(0, 3 - this.surge))}</div>`;
    this.el.innerHTML = html;
    this.bui.refreshTimeline(this.actor, this.entryAction(cur));
  }

  /** The action a menu entry stands for (for the turn-order preview), or null for a sub-menu. */
  entryAction(e) {
    if (!e || e.disabled) return null;
    if (e.kind === 'skill' || e.kind === 'item' || e.kind === 'link') return { kind: e.kind, id: e.id };
    if (e.kind === 'swap' || e.kind === 'swapTo') return { kind: 'swap' };
    return null;
  }

  // ---------------------------------------------------------------- input

  handleInput(input) {
    const t = this.top;
    if (input.pressed('info')) {
      input.consume('info');
      this.scene.setAuto(true);
      this.ui.remove(this);
      this.resolve(this.scene.autoAction(this.actor));
      return;
    }
    if (input.repeat('up')) { t.index = (t.index + t.entries.length - 1) % t.entries.length; this.ui.sfx('cursor'); this.render(); }
    if (input.repeat('down')) { t.index = (t.index + 1) % t.entries.length; this.ui.sfx('cursor'); this.render(); }
    if (input.pressed('pageRight')) { this.changeSurge(1); }
    if (input.pressed('pageLeft')) { this.changeSurge(-1); }
    if (input.pressed('confirm')) { input.consumeAll(); this.choose(t.entries[t.index]); }
    else if (input.pressed('cancel')) {
      input.consumeAll();
      if (this.stack.length > 1) { this.stack.pop(); this.ui.sfx('cancel'); this.render(); }
    }
  }

  changeSurge(d) {
    const max = Math.min(3, Math.floor(this.sys.afterglow / 100));
    const next = Math.max(0, Math.min(max, this.surge + d));
    if (next !== this.surge) { this.surge = next; this.ui.sfx(d > 0 ? 'surge' : 'cancel'); this.render(); }
  }

  choose(e) {
    if (!e) return;
    if (e.disabled) { this.ui.sfx('buzzer'); return; }
    this.ui.sfx('confirm');
    if (this.stack.length === 1) this.lastRootIndex = this.top.index;
    switch (e.kind) {
      case 'list':
        this.pushList(e.label, e.skills.map((id) => this.skillEntry(id)));
        return;
      case 'items': {
        const items = this.sys.usableItems();
        if (!items.length) { this.ui.sfx('buzzer'); return; }
        this.pushList('Items', items.map(({ id, n, def }) => ({ label: def.name, kind: 'item', id, count: n, desc: def.desc })));
        return;
      }
      case 'links':
        this.pushList('Link Arts', e.links.map((l) => ({
          label: SKILLS[l.id].name, kind: 'link', id: l.id, link: l, ag: `${l.cost / 100}◆`,
          disabled: this.sys.afterglow < l.cost, desc: `${l.desc} (${l.members.map((m) => this.scene.game.state.characters[m].name).join(' + ')})`,
        })));
        return;
      case 'flee':
        this.finish({ kind: 'flee' });
        return;
      case 'auto': // the party fights on its own from here (BattleScene.setAuto)
      case 'skip': // ...and the fight plays out at once (BattleScene.startQuickSkip)
        this.finish({ kind: e.kind });
        return;
      case 'swap':
        this.pushList('Swap in', this.sys.reserves().map((ch) => ({
          label: ch.name, kind: 'swapTo', ch, desc: `Lv ${ch.level} · ${CRESTS[ch.crest].name} · HP ${ch.hp}/${ch.maxHp}`,
        })));
        return;
      case 'swapTo':
        this.finish({ kind: 'swap', ch: e.ch });
        return;
      case 'skill':
        if (e.id === 'guard') { this.finish({ kind: 'skill', id: 'guard', targets: [this.actor] }); return; }
        this.selectTarget(SKILLS[e.id].target, (targets) => this.finish({ kind: 'skill', id: e.id, targets, surge: this.surge }), this.entryAction(e));
        return;
      case 'item':
        this.selectTarget(ITEMS[e.id].use.target, (targets) => this.finish({ kind: 'item', id: e.id, targets }), this.entryAction(e));
        return;
      case 'link': {
        const partners = this.sys.party.filter((p) => e.link.members.includes(p.id) && p !== this.actor);
        this.selectTarget(SKILLS[e.id].target, (targets) => this.finish({ kind: 'link', id: e.id, targets, cost: e.link.cost, partners }), this.entryAction(e));
        return;
      }
      default:
    }
  }

  selectTarget(targetType, done, action = null) {
    const sel = new TargetSelector(this, targetType, done, action);
    this.ui.push(sel, 'menus');
  }

  finish(action) {
    if (action.kind !== 'skill' || action.id === 'attack' || action.id === 'guard') {
      // Surge also applies to basic attacks
    }
    if (action.kind === 'skill' && this.surge) action.surge = this.surge;
    this.ui.remove(this);
    this.resolve(action);
  }
}

class TargetSelector {
  constructor(menu, type, done, action = null) {
    this.menu = menu;
    this.scene = menu.scene;
    this.sys = menu.sys;
    this.type = type;
    this.done = done;
    this.action = action; // what is being aimed (for the turn-order preview)
    this.el = el('div', 'b-target');
    const actor = menu.actor;
    const foes = this.sys.enemies.filter((e) => e.alive && !e.hasStatus('airborne'));
    const allies = this.sys.party;
    switch (type) {
      case 'enemy': case 'random': this.options = foes; this.group = type === 'random'; break;
      case 'enemies': this.options = foes; this.group = true; break;
      case 'ally': case 'allyAny': this.options = allies.filter((p) => p.alive); break;
      case 'ko': this.options = allies.filter((p) => !p.alive); break;
      case 'allies': this.options = allies; this.group = true; break;
      case 'self': this.options = [actor]; break;
      default: this.options = foes;
    }
    this.index = 0;
    if (type === 'ally' || type === 'allyAny') {
      // default to the most wounded ally
      let best = 0;
      this.options.forEach((p, i) => { if (p.hp / p.maxHp < this.options[best].hp / this.options[best].maxHp) best = i; });
      this.index = best;
    }
    if (!this.options.length) { this.menu.ui.sfx('buzzer'); setTimeout(() => this.cancel(), 0); }
    this.render();
  }

  get ui() { return this.menu.ui; }

  current() { return this.group ? this.options : [this.options[this.index]]; }

  render() {
    this.scene.highlight(this.current());
    const t = this.options[this.index];
    if (!t) return;
    const label = this.group ? (this.type === 'allies' ? 'All allies' : 'All foes') : t.name;
    this.el.innerHTML = `<div class="tgt-name">${label}</div>`;
    if (this.action) {
      const skill = this.action.kind === 'item' ? null : SKILLS[this.action.id];
      this.menu.bui.refreshTimeline(this.menu.actor, this.action, turnShifts(this.sys, this.menu.actor, skill, this.current()));
    }
  }

  handleInput(input) {
    if (!this.group) {
      if (input.repeat('left') || input.repeat('up')) { this.index = (this.index + this.options.length - 1) % this.options.length; this.ui.sfx('cursor'); this.render(); }
      if (input.repeat('right') || input.repeat('down')) { this.index = (this.index + 1) % this.options.length; this.ui.sfx('cursor'); this.render(); }
    }
    if (input.pressed('confirm')) {
      input.consumeAll();
      this.ui.sfx('confirm');
      this.scene.highlight([]);
      this.ui.remove(this);
      this.done(this.current());
    } else if (input.pressed('cancel')) {
      input.consumeAll();
      this.cancel();
    }
  }

  cancel() {
    this.ui.sfx('cancel');
    this.scene.highlight([]);
    this.ui.remove(this);
  }
}

export { AFTERGLOW_MAX };
