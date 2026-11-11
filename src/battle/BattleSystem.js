// Turn-order and rules engine for one battle. No rendering here: the scene
// asks for the next actor, feeds it an action, and presents the events.
//
// Timeline: every battler has an Action Value (AV). The lowest AV acts next;
// everyone's AV drops by that amount. Acting resets AV to baseAV × delay.

import { Battler } from './Battler.js';
import { ActionResolver, AFTERGLOW_MAX } from './Actions.js';
import { chooseEnemyAction } from './AI.js';
import { ENEMIES } from '../data/enemies.js';
import { TROOPS } from '../data/troops.js';
import { SKILLS } from '../data/skills.js';
import { STATUSES } from '../data/statuses.js';
import { ITEMS } from '../data/items.js';
import { DIFFICULTIES, DEFAULT_DIFFICULTY } from '../data/difficulty.js';

export class BattleSystem {
  constructor({ state, troopId, random = false, rnd = Math.random }) {
    this.state = state;
    this.inventory = state.inventory;
    this.rnd = rnd;
    const troop = TROOPS[troopId];
    if (!troop) throw new Error(`Unknown troop ${troopId}`);
    this.troop = troop;
    this.boss = !!troop.boss;
    this.random = random;
    this.party = state.activeMembers().map((ch, i) => new Battler('party', ch, i));
    this.enemies = troop.enemies.map((id, i) => this.makeEnemy(id, i)).filter(Boolean);
    this.afterglow = 0;
    this.turn = 0;
    this.fled = false;
    this.bonusGold = 0;
    this.goldStolen = 0;
    this.pendingCounters = [];
    this.textQueue = [];
    this.defeated = [];
    this.resolver = new ActionResolver(this);
  }

  makeEnemy(id, index) {
    const def = ENEMIES[id];
    if (!def) { console.warn('Unknown enemy', id); return null; }
    const b = new Battler('enemy', { ...def, id }, index);
    const d = DIFFICULTIES[this.state.settings.difficulty ?? DEFAULT_DIFFICULTY] || DIFFICULTIES[DEFAULT_DIFFICULTY];
    b.maxHp = b.hp = Math.max(1, Math.round(b.maxHp * d.hp));
    b.base = { ...b.base, atk: b.base.atk * d.dmg, matk: b.base.matk * d.dmg };
    return b;
  }

  spawnEnemy(id) {
    const b = this.makeEnemy(id, this.enemies.length);
    if (!b) return null;
    b.av = b.baseAV() * 0.6;
    this.enemies.push(b);
    return b;
  }

  get all() { return [...this.party, ...this.enemies]; }
  get living() { return this.all.filter((b) => b.alive); }

  // ------------------------------------------------------------------ start

  /** Roll initiative. Returns 'preemptive' | 'ambush' | null. */
  start() {
    let opening = null;
    const firstStrike = this.party.some((p) => p.flags.has('firstStrike'));
    if (this.random && !this.boss) {
      const r = this.rnd();
      if (r < (firstStrike ? 0.2 : 0.08)) opening = 'preemptive';
      else if (r > (firstStrike ? 0.99 : 0.95)) opening = 'ambush';
    }
    for (const b of this.all) {
      b.av = b.baseAV() * (0.35 + this.rnd() * 0.65);
      if (b.isParty && b.flags.has('firstStrike')) b.av *= 0.4;
      if (opening === 'preemptive' && b.isEnemy) b.av += b.baseAV();
      if (opening === 'ambush' && b.isParty) b.av += b.baseAV();
    }
    for (const e of this.enemies) this.noteSeen(e);
    return opening;
  }

  // ------------------------------------------------------------------ timeline

  nextActor() {
    const living = this.living;
    if (!living.length) return null;
    let next = living[0];
    for (const b of living) if (b.av < next.av) next = b;
    const dt = Math.max(0, next.av);
    for (const b of living) b.av -= dt;
    return next;
  }

  /** Predicted upcoming turns (for the timeline UI). */
  previewOrder(count = 8) { return this.forecast(count); }

  /**
   * The turns to come. With `actor`, the turns after the one `actor` is taking now,
   * supposing it costs `delay` (see actionDelay) — what the timeline shows while a
   * command is being chosen. `shift` adds Action Value to others first: a foe pushed
   * back by Stasis (+), an ally Quickened to act at once (-Infinity).
   * @param {number} [count]
   * @param {import('./Battler.js').Battler | null} [actor]
   * @param {number} [delay]
   * @param {Map<import('./Battler.js').Battler, number> | null} [shift]
   * @returns {import('./Battler.js').Battler[]}
   */
  forecast(count = 8, actor = null, delay = 1, shift = null) {
    const sim = this.living.map((b) => ({ b, av: b === actor ? b.baseAV() * delay : Math.max(0, b.av + (shift?.get(b) || 0)) }));
    const out = [];
    if (!sim.length) return out;
    for (let i = 0; i < count; i++) {
      let n = sim[0];
      for (const s of sim) if (s.av < n.av) n = s;
      out.push(n.b);
      const dt = n.av;
      for (const s of sim) s.av -= dt;
      n.av = n.b.baseAV();
    }
    return out;
  }

  /**
   * How long until `actor` acts again after `action`, as a multiple of its base wait:
   * quick Arts < 1 < heavy Arts; Guard 0.6, items 0.85, a swap 0.5.
   */
  actionDelay(actor, action) {
    let delay = 1;
    if (action) {
      if (action.kind === 'skill' || action.kind === 'link') delay = SKILLS[action.id]?.delay ?? 1;
      if (action.kind === 'item') delay = actor.flags?.has('quickItems') ? 0.5 : 0.85;
      if (action.kind === 'skill' && actor.flags?.has('quickCast')) {
        const k = SKILLS[action.id]?.kind;
        if (k === 'mag' || k === 'heal') delay *= 0.8;
      }
      if (action.id === 'guard') delay = 0.6;
      if (action.kind === 'swap') delay = 0.5;
    }
    if (actor.hasStatus('airborne')) delay = 0.9;
    return delay;
  }

  // ------------------------------------------------------------------ turns

  /**
   * Start-of-turn effects. Returns { events, skip, auto } where `auto` is an
   * action the actor performs without a command (jump landing, berserk...).
   */
  beginTurn(actor) {
    this.turn++;
    const ev = [];
    let skip = false;
    let auto = null;

    if (actor.isEnemy && actor.broken) {
      actor.broken = false;
      actor.poise = actor.maxPoise;
      ev.push({ t: 'recover', target: actor });
      skip = true;
    }
    actor.removeStatus('guard');

    // Damage/heal over time
    if (actor.hasStatus('poison')) this.resolver.applyDamage(actor, Math.max(1, Math.round(actor.maxHp * (actor.isEnemy && actor.def.boss ? 0.03 : 0.08))), ev, { elem: 'poison', dot: true });
    if (actor.alive && actor.hasStatus('burn')) this.resolver.applyDamage(actor, Math.max(1, Math.round(actor.maxHp * (actor.isEnemy && actor.def.boss ? 0.025 : 0.06))), ev, { elem: 'fire', dot: true });
    if (actor.alive && actor.hasStatus('regen')) {
      const h = actor.heal(Math.round(actor.maxHp * 0.08));
      if (h) ev.push({ t: 'heal', target: actor, amount: h });
    }
    if (actor.alive && actor.hasStatus('doom')) {
      const st = actor.statuses.get('doom');
      st.count = (st.count ?? 3) - 1;
      ev.push({ t: 'text', text: `${actor.name}'s doom: ${Math.max(0, st.count)}` });
      if (st.count <= 0) { actor.damage(actor.hp); ev.push({ t: 'damage', target: actor, amount: 0, ko: true, silent: true }); this.resolver.onKo(actor, ev); }
    }
    if (actor.isParty && actor.alive && actor.flags.has('vigil')) {
      for (const p of this.party) if (p.alive) { const h = p.heal(Math.round(p.maxHp * 0.03)); if (h) ev.push({ t: 'heal', target: p, amount: h }); }
    }
    if (!actor.alive) return { events: ev, skip: true };

    if (actor.hasStatus('sleep') || actor.hasStatus('stun')) {
      ev.push({ t: 'text', text: `${actor.name} ${actor.hasStatus('sleep') ? 'is fast asleep' : 'is stunned'}.` });
      actor.removeStatus('stun');
      skip = true;
    }
    if (actor.pendingJump) {
      auto = actor.pendingJump;
      actor.pendingJump = null;
      actor.removeStatus('airborne');
      ev.push({ t: 'jump', user: actor, up: false });
    } else if (actor.isParty && (actor.hasStatus('berserk') || actor.hasStatus('charm'))) {
      const foes = actor.hasStatus('charm') ? this.party.filter((p) => p.alive && p !== actor) : this.enemies.filter((e) => e.alive);
      if (foes.length) auto = { kind: 'skill', id: 'attack', targets: [foes[Math.floor(this.rnd() * foes.length)]] };
    }
    if (actor.isParty) this.resolver.gainAfterglow(actor, 2, ev);
    return { events: ev, skip, auto };
  }

  /** Perform an action. Returns events. */
  act(actor, action) {
    actor.acting = true;
    if (action.kind === 'link') {
      this.afterglow -= action.cost;
      if (action.partners) for (const p of action.partners) p.av += p.baseAV() * 0.5;
    }
    if (action.surge) this.afterglow -= 100 * action.surge;
    this.afterglow = Math.max(0, Math.min(AFTERGLOW_MAX, this.afterglow));
    if (action.kind === 'swap') {
      const nb = this.swap(actor, action.ch);
      return [{ t: 'swap', out: actor, in: nb }];
    }
    if (actor.isEnemy && action.kind === 'skill') this.noteMove(actor, action.id);
    const ev = action.kind === 'flee' ? this.tryFlee() : this.resolver.execute(actor, action);
    // Counters triggered during the action
    while (this.pendingCounters.length) {
      const { from, to } = this.pendingCounters.shift();
      if (!from.alive || !to.alive) continue;
      ev.push({ t: 'text', text: `${from.name} counters!` });
      ev.push(...this.resolver.execute(from, { kind: 'skill', id: 'attack', targets: [to], counter: true }));
    }
    for (const text of this.textQueue.splice(0)) ev.unshift({ t: 'text', text });
    return ev;
  }

  /** Reserve characters who can be swapped in. */
  reserves() {
    const active = new Set(this.party.map((b) => b.ch));
    return this.state.allMembers().filter((c) => !active.has(c) && c.hp > 0);
  }

  /** Swap a reserve character into `actor`'s slot. Returns the new battler. */
  swap(actor, ch) {
    const i = this.party.indexOf(actor);
    if (i < 0) return null;
    actor.commit();
    const nb = new Battler('party', ch, actor.index);
    nb.av = nb.baseAV() * 0.5;
    this.party[i] = nb;
    // Keep battle order in the persistent party too.
    const p = this.state.party;
    const a = p.indexOf(actor.ch.id), b = p.indexOf(ch.id);
    if (a >= 0 && b >= 0) [p[a], p[b]] = [p[b], p[a]];
    return nb;
  }

  /** Enemy AI decision (pre-action text is queued and emitted with the action). */
  enemyAction(actor) { return chooseEnemyAction(this, actor); }

  queueText(text) { this.textQueue.push(text); }

  endTurn(actor, action) {
    actor.av = actor.baseAV() * this.actionDelay(actor, action);
    const expired = actor.tickDurations();
    actor.acting = false;
    return expired.filter((id) => STATUSES[id]).map((id) => ({ t: 'status', target: actor, id, on: false }));
  }

  tryFlee() {
    if (this.boss || this.troop.canFlee === false) return [{ t: 'text', text: 'You can\'t run from this fight!' }];
    const ps = this.party.filter((p) => p.alive).reduce((s, p) => s + p.spd, 0);
    const es = this.enemies.filter((e) => e.alive).reduce((s, e) => s + e.spd, 0) || 1;
    const chance = Math.min(0.95, 0.45 + 0.25 * (ps / es - 1) + (this.fleeAttempts || 0) * 0.15);
    this.fleeAttempts = (this.fleeAttempts || 0) + 1;
    if (this.rnd() < chance) { this.fled = true; return [{ t: 'flee' }]; }
    return [{ t: 'text', text: 'Couldn\'t get away!' }];
  }

  outcome() {
    if (this.fled) return 'flee';
    if (!this.enemies.some((e) => e.alive)) return 'win';
    if (!this.party.some((p) => p.alive)) return 'lose';
    return null;
  }

  // ------------------------------------------------------------------ bestiary

  // Records (data/monsterInfo.js reads them for the Compendium): seen and felled counts,
  // and what the party has learned — weaknesses struck, resistances and immunities
  // met, moves seen used.

  noteSeen(e) {
    const b = this.state.bestiary;
    const id = e.def.id;
    b[id] = b[id] || { seen: 0, defeated: 0, weak: [] };
    b[id].seen++;
    for (const w of b[id].weak) if (e.weak.has(w)) e.revealed.add(w);
  }

  /** Add `value` to record list `key` of foe e (once). */
  noteIn(e, key, value) {
    const rec = e.isEnemy && this.state.bestiary[e.def.id];
    if (!rec) return;
    const list = (rec[key] ||= []);
    if (!list.includes(value)) list.push(value);
  }

  noteWeakness(e, elem) { this.noteIn(e, 'weak', elem); }
  noteResist(e, elem) { if (elem && elem !== 'none' && e.resist?.[elem] !== undefined) this.noteIn(e, 'res', elem); }
  noteImmune(e, status) { this.noteIn(e, 'imm', status); }
  noteMove(e, id) { if (id !== 'e_charge' && id !== 'e_flee') this.noteIn(e, 'moves', id); }

  /** A Scan reads everything about the foe into the record. */
  noteScan(e) {
    for (const w of e.weak) this.noteWeakness(e, w);
    for (const elem of Object.keys(e.resist || {})) this.noteIn(e, 'res', elem);
    for (const st of e.immune || []) this.noteImmune(e, st);
  }

  noteDefeat(e) {
    const rec = this.state.bestiary[e.def.id];
    if (rec) rec.defeated++;
    this.defeated.push(e);
  }

  // ------------------------------------------------------------------ rewards

  /** Compute and apply rewards. Returns a summary for the victory screen. */
  applyRewards() {
    let exp = 0, gold = this.bonusGold, cp = 0;
    const items = [];
    const living = this.party.filter((p) => p.alive);
    const dropBonus = Math.max(0, ...this.party.map((p) => p.mods?.dropPct || 0)) / 100;
    for (const e of this.enemies) {
      if (e.fled) continue;
      const s = e.base;
      exp += s.exp;
      gold += s.gold;
      cp += s.cp;
      for (const [id, chance] of e.def.drops || []) {
        if (this.rnd() < chance * (1 + dropBonus)) items.push(id);
      }
    }
    const pct = (key) => Math.max(0, ...this.party.map((p) => p.mods?.[key] || 0));
    gold = Math.round(gold * (1 + pct('goldPct') / 100));
    this.state.gold += gold;
    for (const id of items) this.inventory.add(id, 1);

    const results = [];
    const members = this.state.allMembers();
    for (const ch of members) {
      const battler = this.party.find((p) => p.ch === ch);
      const active = !!battler;
      const alive = battler ? battler.alive : true;
      const m = ch.modifiers().mods;
      const share = active ? (alive ? 1 : 0.5) : 0.5;
      const e = Math.round(exp * share * (1 + (m.expPct || 0) / 100));
      const c = Math.round(cp * share * (1 + (m.cpPct || 0) / 100));
      const before = ch.level;
      const statsFrom = ch.stats(), supportFrom = ch.supportBudget();
      const levels = ch.gainExp(e);
      const ranks = [...ch.gainCp(ch.crest, c), ...(ch.secondary ? ch.gainCp(ch.secondary, Math.round(c / 2)) : [])];
      results.push({ ch, exp: e, cp: c, levelFrom: before, levels, ranks, active, statsFrom, supportFrom });
    }
    this.state.stats.battles++;
    return { exp, gold, cp, items, results, stolen: this.goldStolen };
  }

  /** Persist HP/MP to characters. Fallen members revive with 1 HP after victory. */
  commit(outcome) {
    for (const b of this.party) {
      b.commit();
      if (outcome === 'win' && !b.alive) b.ch.hp = 1;
    }
  }

  // ------------------------------------------------------------------ helpers for UI

  usableItems() {
    return this.inventory.list((d) => d.kind === 'consumable' && d.battle).map(([id, n]) => ({ id, n, def: ITEMS[id] }));
  }
}
