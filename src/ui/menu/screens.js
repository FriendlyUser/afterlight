// Items, Status, Formation, Settings, Bestiary and Journal screens.

import { el, richText } from '../UI.js';
import { ControlsScreen } from './ControlsScreen.js';
import { keyCap, keysFor } from '../../core/Input.js';
import { Screen, ListView, header, KEYS, partyCard, statDiffHtml, portraitEl } from './common.js';
import { MemberScreen } from './CrestScreen.js';
import { ITEMS } from '../../data/items.js';
import { EQUIPMENT } from '../../data/equipment.js';
import { CRESTS, MAX_RANK, starText } from '../../data/crests.js';
import { DIFFICULTIES, DEFAULT_DIFFICULTY } from '../../data/difficulty.js';
import { ENEMIES, enemyStats } from '../../data/enemies.js';
import { getMonsterSprite } from '../../render/MonsterFactory.js';
import { ELEM_ICONS } from '../../battle/BattleUI.js';
import { ACTIVE_PARTY_SIZE } from '../../state/GameState.js';
import { formatTime } from '../../core/util.js';

// =====================================================================
// Items
// =====================================================================

const TABS = [
  { id: 'consumable', label: 'Consumables', pred: (d) => d.kind === 'consumable' },
  { id: 'equipment', label: 'Equipment', pred: (d) => !!d.slot },
  { id: 'material', label: 'Materials', pred: (d) => d.kind === 'material' || d.kind === 'crest' },
  { id: 'key', label: 'Key Items', pred: (d) => d.kind === 'key' },
];

export class ItemsScreen extends Screen {
  constructor(menus) {
    super(menus, 'items-screen');
    this.tab = 0;
    this.build();
  }

  build() {
    this.el.innerHTML = header('Items', `${KEYS.nav} ${keyCap('confirm')} Use ${KEYS.back} ${keyCap('pageLeft')}${keyCap('pageRight')} Category`);
    const tabs = el('div', 'tabs', TABS.map((t, i) => `<span class="${i === this.tab ? 'on' : ''}">${t.label}</span>`).join(''));
    this.el.appendChild(tabs);
    const body = el('div', 'it-body');
    const left = el('div', 'it-left panel');
    const items = this.state.inventory.list(TABS[this.tab].pred).map(([id, n, def]) => ({ id, n, def, disabled: TABS[this.tab].id === 'consumable' && !def.field }));
    items.sort((a, b) => a.def.name.localeCompare(b.def.name));
    const prev = this.list?.index || 0;
    this.list = new ListView({
      items, pageSize: 14, empty: 'Empty.',
      render: (it) => `<span class="ii">${it.def.icon || '◇'}</span><span class="in">${it.def.name}</span><span class="cnt">×${it.n}</span>`,
    });
    this.list.index = Math.min(prev, Math.max(0, items.length - 1));
    this.list.refresh();
    left.appendChild(this.list.el);
    this.desc = el('div', 'it-desc panel');
    this.cards = el('div', 'it-cards');
    body.append(left, this.desc, this.cards);
    this.el.appendChild(body);
    this.renderDesc();
  }

  renderDesc() {
    const it = this.list.current;
    this.desc.innerHTML = it ? `<div class="cd-name">${it.def.name}</div><div class="cd-desc">${richText(it.def.desc || '')}</div>${it.def.sell || it.def.price ? `<div class="dim">Value: ${it.def.sell ?? Math.floor((it.def.price || 0) / 2)} G</div>` : ''}` : '';
    this.cards.innerHTML = '';
    this.state.allMembers().forEach((ch, i) => this.cards.appendChild(partyCard(ch, { active: i < ACTIVE_PARTY_SIZE, selected: this.picking && i === this.target })));
  }

  handleInput(input) {
    if (this.picking) return this.handlePick(input);
    if (input.pressed('pageRight')) { this.tab = (this.tab + 1) % TABS.length; this.sfx('cursor'); this.list = null; this.build(); return; }
    if (input.pressed('pageLeft')) { this.tab = (this.tab + TABS.length - 1) % TABS.length; this.sfx('cursor'); this.list = null; this.build(); return; }
    const r = this.list.handle(input, (s) => this.sfx(s));
    if (r === 'move') this.renderDesc();
    if (r === 'cancel') { this.sfx('cancel'); this.close(); return; }
    if (r === 'confirm') {
      const it = this.list.current;
      if (!it || it.disabled || TABS[this.tab].id !== 'consumable') { this.sfx('buzzer'); return; }
      this.sfx('confirm');
      if (it.def.use.target === 'allies') { this.applyItem(it, this.state.allMembers()); return; }
      this.picking = true;
      this.target = 0;
      this.renderDesc();
    }
  }

  handlePick(input) {
    const n = this.state.party.length;
    if (input.repeat('up') || input.repeat('left')) { this.target = (this.target + n - 1) % n; this.sfx('cursor'); this.renderDesc(); }
    if (input.repeat('down') || input.repeat('right')) { this.target = (this.target + 1) % n; this.sfx('cursor'); this.renderDesc(); }
    if (input.pressed('cancel')) { input.consumeAll(); this.picking = false; this.sfx('cancel'); this.renderDesc(); return; }
    if (input.pressed('confirm')) {
      input.consumeAll();
      const it = this.list.current;
      const ch = this.state.allMembers()[this.target];
      this.applyItem(it, [ch]);
      if (this.state.inventory.count(it.id) <= 0) { this.picking = false; this.build(); } else this.renderDesc();
    }
  }

  /** Field item use. Returns true if anything happened. */
  applyItem(it, targets) {
    const use = it.def.use;
    let did = false;
    for (const ch of targets) {
      const s = ch.stats();
      if (use.revive) { if (ch.hp <= 0) { ch.hp = Math.max(1, Math.floor(s.hp * use.revive)); did = true; } continue; }
      if (ch.hp <= 0 && !use.boost) continue;
      if (use.heal && ch.hp < s.hp) { ch.hp = Math.min(s.hp, ch.hp + use.heal); did = true; }
      if (use.healPct && ch.hp < s.hp) { ch.hp = Math.min(s.hp, ch.hp + Math.round(s.hp * use.healPct / 100)); did = true; }
      if (use.mp && ch.mp < s.mp) { ch.mp = Math.min(s.mp, ch.mp + use.mp); did = true; }
      if (use.mpPct && ch.mp < s.mp) { ch.mp = Math.min(s.mp, ch.mp + Math.round(s.mp * use.mpPct / 100)); did = true; }
      if (use.boost) { for (const [k, v] of Object.entries(use.boost)) ch.boosts[k] = (ch.boosts[k] || 0) + v; did = true; }
      if (use.cp) { ch.gainCp(ch.crest, use.cp); did = true; }
      if (use.cure) did = true;
    }
    if (!did) { this.sfx('buzzer'); this.game.ui.toast('It would have no effect.'); return false; }
    this.state.inventory.remove(it.id, 1);
    this.sfx('heal');
    return true;
  }
}

// =====================================================================
// Status
// =====================================================================

export class StatusScreen extends MemberScreen {
  constructor(menus, memberIndex) {
    super(menus, 'status-screen', memberIndex);
    this.build();
  }

  build() {
    const ch = this.ch;
    const s = ch.stats();
    this.el.innerHTML = header(`Status — ${ch.name}`, `${KEYS.back} ${KEYS.swap}`);
    const body = el('div', 'st-body');
    const left = el('div', 'st-left panel');
    left.appendChild(portraitEl(ch.look, 6));
    left.appendChild(el('div', 'st-id', `<div class="st-name">${ch.name}</div><div class="st-title">${ch.def.title}</div><div class="dim">Age ${ch.def.age} · Lv ${ch.level}</div><div class="st-bio">${ch.def.bio}</div>
      <div class="st-personal"><b>${ch.def.personal.name}</b> — ${ch.def.personal.desc}</div>`));
    const mid = el('div', 'st-mid panel', `<div class="sd-title">Attributes</div>${statDiffHtml(s, null)}`);
    const right = el('div', 'st-right panel');
    let html = `<div class="sd-title">Crest Mastery</div><div class="dim" style="margin-bottom:6px">Mastered: ${ch.masteredCount()} — all stats +${ch.masteredCount()}%</div>`;
    for (const id of Object.keys(ch.crests)) {
      const c = CRESTS[id];
      const r = ch.rankOf(id);
      const pips = r >= MAX_RANK ? `<span class="pips stars">${starText(ch.starsOf(id))}</span>` : `<span class="pips">${'◆'.repeat(r)}${'◇'.repeat(MAX_RANK - r)}</span>`;
      html += `<div class="st-crest"><span style="color:${c.color}">${c.icon} ${c.name}</span>${pips}</div>`;
    }
    const legacies = ch.legacies();
    if (legacies.length) {
      html += '<div class="sd-title" style="margin-top:14px">Legacies</div>';
      html += legacies.map((id) => `<div class="st-legacy"><span style="color:${CRESTS[id].color}">${CRESTS[id].icon}</span> ${CRESTS[id].legacy.desc}</div>`).join('');
    }
    html += `<div class="sd-title" style="margin-top:14px">Supports (${ch.supportUsed()}/${ch.supportBudget()})</div>`;
    html += ch.passives.length ? ch.passives.map((p) => `<div class="dim">◆ ${p}</div>`).join('') : '<div class="dim">None</div>';
    right.innerHTML = html;
    body.append(left, mid, right);
    this.el.appendChild(body);
    // replace passive ids with names
    import('../../data/passives.js').then(({ PASSIVES }) => {
      right.querySelectorAll('.dim').forEach((d) => {
        const id = d.textContent.replace('◆ ', '');
        if (PASSIVES[id]) d.textContent = `◆ ${PASSIVES[id].name}`;
      });
    });
  }

  handleInput(input) {
    if (this.switchMember(input)) return;
    if (input.pressed('cancel') || input.pressed('confirm')) { input.consumeAll(); this.sfx('cancel'); this.close(); }
  }
}

// =====================================================================
// Formation
// =====================================================================

export class FormationScreen extends Screen {
  constructor(menus) {
    super(menus, 'formation-screen');
    this.index = 0;
    this.held = -1;
    this.build();
  }

  build() {
    this.el.innerHTML = header('Formation', `${KEYS.nav} ${keyCap('confirm')} Pick / Swap ${KEYS.back} — the first ${ACTIVE_PARTY_SIZE} fight; the rest earn half EXP.`);
    const list = el('div', 'fm-list');
    this.state.allMembers().forEach((ch, i) => {
      const c = partyCard(ch, { active: i < ACTIVE_PARTY_SIZE, selected: i === this.index });
      if (i === this.held) c.classList.add('held');
      list.appendChild(c);
    });
    this.el.appendChild(list);
  }

  handleInput(input) {
    const n = this.state.party.length;
    if (input.repeat('up') || input.repeat('left')) { this.index = (this.index + n - 1) % n; this.sfx('cursor'); this.build(); }
    if (input.repeat('down') || input.repeat('right')) { this.index = (this.index + 1) % n; this.sfx('cursor'); this.build(); }
    if (input.pressed('cancel')) {
      input.consumeAll();
      if (this.held >= 0) { this.held = -1; this.build(); return; }
      this.sfx('cancel'); this.close(); return;
    }
    if (input.pressed('confirm')) {
      input.consumeAll();
      if (this.held < 0) { this.held = this.index; this.sfx('confirm'); }
      else {
        const p = this.state.party;
        [p[this.held], p[this.index]] = [p[this.index], p[this.held]];
        if (!this.state.activeMembers().some((c) => c.hp > 0)) [p[this.held], p[this.index]] = [p[this.index], p[this.held]];
        this.held = -1;
        this.sfx('confirm');
      }
      this.build();
    }
  }
}

// =====================================================================
// Settings
// =====================================================================

export class SettingsScreen extends Screen {
  constructor(menus) {
    super(menus, 'settings-screen');
    this.index = 0;
    this.build();
  }

  options() {
    const s = this.state.settings;
    return [
      { key: 'musicVolume', label: 'Music Volume', value: `${Math.round(s.musicVolume * 100)}%`, step: 0.1, min: 0, max: 1 },
      { key: 'sfxVolume', label: 'Sound Volume', value: `${Math.round(s.sfxVolume * 100)}%`, step: 0.1, min: 0, max: 1 },
      { key: 'autoRun', label: 'Always Run', value: s.autoRun ? 'On' : 'Off', toggle: true },
      { key: 'textSize', label: 'Text Size', value: ['Normal', 'Large', 'Largest'][s.textSize || 0], step: 1, min: 0, max: 2 },
      { key: 'textSpeed', label: 'Text Speed', value: ['Slow', 'Normal', 'Fast', 'Instant'][s.textSpeed] || 'Normal', step: 1, min: 0, max: 3 },
      { key: 'encounters', label: 'Encounter Rate', value: ['Normal', 'Half', 'Off (story only)'][s.encounters || 0], step: 1, min: 0, max: 2 },
      { key: 'difficulty', label: 'Difficulty', value: DIFFICULTIES[s.difficulty ?? DEFAULT_DIFFICULTY].name, step: 1, min: 0, max: DIFFICULTIES.length - 1 },
      { key: 'battleSpeed', label: 'Battle Speed', value: ['Normal', 'Fast', 'Fastest'][s.battleSpeed || 0], step: 1, min: 0, max: 2 },
      { key: 'fastMode', label: `Fast Mode (${keysFor('fast')[0] ?? '—'})`, value: s.fastMode ? 'On' : 'Off', toggle: true },
      { key: 'fastSpeed', label: 'Fast Mode Speed', value: `${s.fastSpeed || 3}×`, step: 1, min: 2, max: 4 },
      { key: 'reduceEffects', label: 'Flashes & Shake', value: s.reduceEffects ? 'Reduced' : 'Full', toggle: true },
      { key: 'hideMinimap', label: 'Minimap', value: s.hideMinimap ? 'Off' : 'On', toggle: true },
      { key: 'hideQuestGuide', label: 'Quest Guide', value: s.hideQuestGuide ? 'Off' : 'On', toggle: true },
      { key: 'controls', label: 'Controls', value: 'Remap keys', open: () => new ControlsScreen(this.menus) },
    ];
  }

  build() {
    this.el.innerHTML = header('Settings', `${keyCap('up')}${keyCap('down')} Select ${keyCap('left')}${keyCap('right')} Change ${keyCap('cancel')} Back`);
    const box = el('div', 'set-list panel');
    this.options().forEach((o, i) => box.appendChild(el('div', `set-row ${i === this.index ? 'sel' : ''}`, `<span>${o.label}</span><span class="set-v">${o.open ? `${o.value} ▸` : `◂ ${o.value} ▸`}</span>`)));
    this.el.appendChild(box);
  }

  handleInput(input) {
    const opts = this.options();
    if (input.repeat('up')) { this.index = (this.index + opts.length - 1) % opts.length; this.sfx('cursor'); this.build(); }
    if (input.repeat('down')) { this.index = (this.index + 1) % opts.length; this.sfx('cursor'); this.build(); }
    const d = input.repeat('right') ? 1 : input.repeat('left') ? -1 : 0;
    const o = opts[this.index];
    if (o.open && (d > 0 || input.pressed('confirm'))) {
      input.consumeAll();
      this.sfx('confirm');
      o.open().open().then(() => this.build());
      return;
    }
    if ((d || input.pressed('confirm')) && !o.open) {
      const s = this.state.settings;
      if (o.toggle) s[o.key] = !s[o.key];
      else s[o.key] = Math.max(o.min, Math.min(o.max, Math.round(((s[o.key] || 0) + (d || 1) * o.step) * 10) / 10));
      this.game.applySettings(s);
      this.sfx('cursor');
      input.consume('confirm');
      this.build();
    }
    if (input.pressed('cancel')) { input.consumeAll(); this.sfx('cancel'); this.close(); }
  }
}

// =====================================================================
// Bestiary
// =====================================================================

export class BestiaryScreen extends Screen {
  constructor(menus) {
    super(menus, 'bestiary-screen');
    const b = this.state.bestiary;
    this.entries = Object.keys(ENEMIES).filter((id) => b[id]).map((id) => ({ id, e: ENEMIES[id], rec: b[id] }));
    this.build();
  }

  build() {
    const total = Object.keys(ENEMIES).length;
    this.el.innerHTML = header(`Bestiary — ${this.entries.length} / ${total}`, `${KEYS.nav} ${KEYS.back}`);
    const body = el('div', 'bs-body');
    const left = el('div', 'bs-left panel');
    this.list = new ListView({
      items: this.entries, pageSize: 15, empty: 'No creatures recorded yet.',
      render: (it) => `<span class="in">${it.e.name}</span><span class="cnt">${it.rec.defeated}</span>`,
    });
    left.appendChild(this.list.el);
    this.detail = el('div', 'bs-detail panel');
    body.append(left, this.detail);
    this.el.appendChild(body);
    this.renderDetail();
  }

  renderDetail() {
    const it = this.list.current;
    if (!it) { this.detail.innerHTML = ''; return; }
    const s = enemyStats(it.e);
    const weak = it.rec.weak.map((w) => `<span style="color:${ELEM_ICONS[w]?.[1]}">${ELEM_ICONS[w]?.[0]} ${w}</span>`).join(' ') || '???';
    const drops = it.rec.defeated ? (it.e.drops || []).map(([id]) => this.state.inventory.itemName(id)).join(', ') || 'None' : '???';
    this.detail.innerHTML = `<div class="cd-name">${it.e.name}</div><div class="cd-tier">Lv ${it.e.level}${it.e.boss ? ' · Boss' : ''} · Defeated ${it.rec.defeated}</div>
      <div class="bs-art"></div>
      <div class="cd-desc">${it.e.desc || ''}</div>
      <div class="bs-row">HP ${it.rec.defeated ? s.hp : '???'} · EXP ${s.exp} · Gold ${s.gold}</div>
      <div class="bs-row">Weaknesses: ${weak}</div><div class="bs-row">Drops: ${drops}</div>`;
    const art = getMonsterSprite(it.e.sprite).canvas;
    const img = document.createElement('canvas');
    img.width = art.width; img.height = art.height;
    img.getContext('2d').drawImage(art, 0, 0);
    img.style.width = `${art.width * 3}px`;
    this.detail.querySelector('.bs-art').appendChild(img);
  }

  handleInput(input) {
    const r = this.list.handle(input, (s) => this.sfx(s));
    if (r === 'move') this.renderDetail();
    if (r === 'cancel' || r === 'confirm') { this.sfx('cancel'); this.close(); }
  }
}

// =====================================================================
// Journal: current objective and story so far
// =====================================================================

export class JournalScreen extends Screen {
  constructor(menus) {
    super(menus, 'journal-screen');
    const st = this.state;
    const log = st.vars.journal || [];
    this.el.innerHTML = header('Journal', KEYS.back);
    const box = el('div', 'jn panel');
    const quests = Object.values(st.vars.quests || {});
    const qhtml = quests.length ? quests.map((q) => `<div class="jn-q ${q.status}"><span>${q.status === 'done' ? '✔' : '◆'}</span> <b>${q.title}</b>${q.status === 'done' ? '' : ` — ${richText(q.desc || '')}`}</div>`).join('') : '<div class="dim">No side quests yet.</div>';
    box.innerHTML = `<div class="jn-obj"><div class="sd-title">Current Objective</div><div class="jn-objtext">${richText(st.vars.objective || 'Explore.')}</div></div>
      <div class="sd-title">Side Quests</div><div class="jn-quests">${qhtml}</div>
      <div class="sd-title">The Story So Far</div>
      <div class="jn-log">${log.slice().reverse().map((e) => `<p>${richText(e)}</p>`).join('') || '<p class="dim">Nothing yet.</p>'}</div>
      <div class="jn-meta">Playtime ${formatTime(st.playtime)} · Battles ${st.stats.battles}</div>`;
    this.el.appendChild(box);
  }

  handleInput(input) {
    if (input.pressed('cancel') || input.pressed('confirm')) { input.consumeAll(); this.sfx('cancel'); this.close(); }
  }
}

// =====================================================================
// Guide: in-game reference for the systems
// =====================================================================

const GUIDE = [
  ['Controls', 'Move with the arrow keys or WASD; hold *Shift* to run. *Z*/*Enter* confirms and talks, *X*/*Esc* cancels, *C* opens the menu. In battle, *Q*/*E* adjusts Surge and *F* toggles Auto-battle. *T* toggles *Fast Mode*, which runs walking, cutscenes and battles at 2–4× (set the speed in Settings). These are the default keys: remap any of them in *Settings → Controls* (Esc always cancels and opens the menu). Your keys are saved with your game, export included. Gamepads work too.'],
  ['Quest Guide', 'The *Objective* in the top-left corner says what to do next, and a gold *◆* marks where: the person or place, or the exit or door that leads toward it. When it is off screen, an arrow at the edge points the way; the minimap and the world map mark it too. Turn it off in *Settings → Quest Guide*.'],
  ['Turn Order', 'Battles flow on a timeline (top-left). Fast characters act more often. Quick Arts let you act again sooner; heavy Arts push your next turn back. Haste and Slow bend the timeline.'],
  ['Poise & Breaks', 'Every foe carries a *Poise* shield (the number under it). Hitting a *weakness* chips one point. At zero the foe *Breaks*: it loses its next turn and takes 50% more damage until it recovers. Weaknesses start hidden — experiment, or use *Scan*.'],
  ['Afterglow', 'The party shares the *Afterglow* gauge (three segments). It fills when you hit weaknesses, Break foes, land criticals and take hits. Spend it on *Surge* (Q/E before acting: up to +150% power and extra Poise damage) or on *Link Arts* — combination techniques between specific friends.'],
  ['Big Attacks', 'When a foe is *Charging* (⚡) or *Winding Up* (⚠), its next move is a big one — charged blows hit 1.5× harder. *Guard* halves damage until your next turn and acts sooner. Better still: *Break* a foe while it winds up and the attack is interrupted.'],
  ['Crests', '_One Crest, one life_ — or so they say. Your *primary* Crest sets your stats, weapons and armor, and grants its Arts. A *secondary* Crest adds its learned Arts too. Crests rank up (1–10) with CP earned in battle; each rank teaches an Art or a Support. Braided (Tier II) Crests open when two prerequisite Crests reach rank 5.'],
  ['Mastery & Ascension', 'A Crest at rank 10 is *mastered*: it leaves a *Legacy*, a small bonus that stays with you whatever Crest you wear, and every mastered Crest adds +1% to all stats. CP keeps flowing past mastery into five *Ascension stars* ★. Each star gives +1% to all stats while that Crest is primary and makes its Arts 3% stronger, wherever you use them. A fully Ascended Crest (★★★★★) adds a Support Point, up to three.'],
  ['Supports', 'Supports are passive abilities learned from any Crest rank. Once learned they belong to you, whatever Crest you wear. Equip them in *Supports* within your Support Point budget, which grows with level.'],
  ['Equipment', 'Weapons and armor depend on your primary Crest. In *Equipment*, press *F* to Optimize. Accessories fit anyone.'],
  ['Saving', 'Golden *Hearthstones* restore the party and let you save; you can also save from the menu almost anywhere, and the game autosaves whenever you enter a new area. Saves live in this browser. Press *F* on a save slot to *export* it to a file or *import* one, to keep a backup or carry your game to another computer.'],
  ['Encounters', 'The orb in the lower-left warms from green to red as a random battle approaches. Settings can halve or disable random encounters.'],
];

export class GuideScreen extends Screen {
  constructor(menus) {
    super(menus, 'guide-screen');
    this.el.innerHTML = header('Guide', `${KEYS.nav} ${KEYS.back}`);
    const body = el('div', 'bs-body');
    const left = el('div', 'bs-left panel');
    this.list = new ListView({ items: GUIDE, pageSize: 12, render: ([t]) => t });
    left.appendChild(this.list.el);
    this.detail = el('div', 'bs-detail panel');
    body.append(left, this.detail);
    this.el.appendChild(body);
    this.render();
  }

  render() {
    const [t, text] = this.list.current;
    this.detail.innerHTML = `<div class="cd-name">${t}</div><div class="cd-desc" style="font-size:20px;line-height:1.6">${richText(text)}</div>`;
  }

  handleInput(input) {
    const r = this.list.handle(input, (s) => this.sfx(s));
    if (r === 'move') this.render();
    if (r === 'cancel') { this.sfx('cancel'); this.close(); }
  }
}

export { EQUIPMENT, ITEMS };
