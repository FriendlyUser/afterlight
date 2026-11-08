// A combatant in battle — wraps a party Character or an enemy definition and
// tracks transient state: HP/MP, statuses, stat stages, turn timing, poise.

import { STATUSES } from '../data/statuses.js';
import { enemyStats } from '../data/enemies.js';

export const STAGE_KEYS = ['str', 'mag', 'def', 'res', 'spd', 'eva'];
const STAGE_TURNS = 4;

export class Battler {
  constructor(side, src, index) {
    this.side = side;
    this.index = index;
    this.statuses = new Map(); // id -> { turns, charges }
    this.stages = {}; // key -> { v, turns }
    this.acting = false; // mid-turn: statuses applied now skip this turn's tick
    this.av = 0;
    this.revealed = new Set();
    this.flagsUsed = new Set(); // once-per-battle triggers
    this.alive = true;
    this.lastAction = null;

    if (side === 'party') {
      const ch = src;
      this.ch = ch;
      this.id = ch.id;
      this.name = ch.name;
      const s = ch.stats();
      const m = ch.modifiers();
      this.base = s;
      this.mods = m.mods;
      this.flags = m.flags;
      this.immune = m.immune;
      this.resist = m.resist;
      this.weak = new Set();
      this.maxHp = s.hp;
      this.maxMp = s.mp;
      this.hp = Math.min(ch.hp, s.hp);
      this.mp = Math.min(ch.mp, s.mp);
      this.alive = this.hp > 0;
      for (const st of m.autoStatus) this.addStatus(st);
      if (ch.id === 'wren') this.flags.add('resolve');
      if (ch.id === 'bram') this.flags.add('bulwark');
    } else {
      const def = src;
      this.def = def;
      this.id = `${def.id}#${index}`;
      this.name = def.name;
      const s = enemyStats(def);
      this.base = s;
      this.mods = {};
      this.flags = new Set(def.flags || []);
      this.immune = new Set(def.immune || []);
      this.resist = { ...(def.resist || {}) };
      this.weak = new Set(def.weak || []);
      this.maxHp = s.hp;
      this.maxMp = 999;
      this.hp = s.hp;
      this.mp = 999;
      this.maxPoise = def.poise ?? 2;
      this.poise = this.maxPoise;
      this.broken = false;
      this.level = def.level;
      this.phase = 0;
      this.memory = {}; // AI scratchpad
    }
  }

  get isParty() { return this.side === 'party'; }
  get isEnemy() { return this.side === 'enemy'; }
  get level() { return this._level ?? this.ch?.level ?? 1; }
  set level(v) { this._level = v; }

  // ------------------------------------------------------------------ stats

  stageMult(key) {
    const v = this.stages[key]?.v || 0;
    if (key === 'spd') return v >= 0 ? 1 + 0.12 * v : 1 / (1 + 0.12 * -v);
    if (key === 'eva') return v * 6; // additive evade %
    return v >= 0 ? 1 + 0.15 * v : 1 / (1 + 0.15 * -v);
  }

  get atk() {
    let a = this.base.atk * this.stageMult('str');
    if (this.flags.has('lastStand') && this.hp < this.maxHp * 0.25) a *= 1.5;
    if (this.hasStatus('berserk')) a *= 1.3;
    return a;
  }
  get matk() { return (this.base.matk ?? this.base.mag) * this.stageMult('mag'); }
  get pdef() { return this.base.def * this.stageMult('def') * (this.hasStatus('burn') ? 0.85 : 1); }
  get mdef() { return this.base.res * this.stageMult('res'); }
  get spd() {
    let s = this.base.spd * this.stageMult('spd');
    if (this.hasStatus('haste')) s *= 1.5;
    if (this.hasStatus('slow')) s *= 0.6;
    return Math.max(1, s);
  }
  get evade() { return (this.base.evade || 0) + this.stageMult('eva'); }
  get crit() { return (this.base.crit || 5) + (this.hasStatus('marked_self') ? 15 : 0); }
  get lck() { return this.base.lck || 10; }

  /** Turn wait for a full action (lower is faster). */
  baseAV() { return 10000 / this.spd; }

  // ------------------------------------------------------------------ statuses

  hasStatus(id) { return this.statuses.has(id); }

  /** Returns true if newly applied. */
  addStatus(id, turns) {
    if (this.immune.has(id)) return false;
    const def = STATUSES[id];
    if (!def) return false;
    if (id === 'haste') this.statuses.delete('slow');
    if (id === 'slow') this.statuses.delete('haste');
    const fresh = !this.statuses.has(id);
    // Effects gained during the bearer's own turn must survive that turn's tick.
    this.statuses.set(id, { turns: turns ?? def.turns, charges: def.charges || 0, skipTick: !!this.acting });
    return fresh;
  }

  removeStatus(id) { return this.statuses.delete(id); }

  cureBad() {
    const removed = [];
    for (const id of [...this.statuses.keys()]) if (STATUSES[id].bad) { this.statuses.delete(id); removed.push(id); }
    return removed;
  }

  addStage(key, delta, turns = STAGE_TURNS) {
    const cur = this.stages[key]?.v || 0;
    const v = Math.max(-3, Math.min(3, cur + delta));
    if (v === 0) delete this.stages[key];
    else this.stages[key] = { v, turns, skipTick: !!this.acting };
    return v - cur;
  }

  clearBuffs() {
    let any = false;
    for (const k of Object.keys(this.stages)) if (this.stages[k].v > 0) { delete this.stages[k]; any = true; }
    for (const id of ['haste', 'regen', 'protect', 'shell', 'reraise', 'veil']) if (this.statuses.delete(id)) any = true;
    return any;
  }

  /** Decrement durations at the end of this battler's turn. Returns expired status ids. */
  tickDurations() {
    const expired = [];
    for (const [id, st] of this.statuses) {
      if (st.skipTick) { st.skipTick = false; continue; }
      if (!st.turns) continue;
      st.turns -= 1;
      if (st.turns <= 0) { this.statuses.delete(id); expired.push(id); }
    }
    for (const [k, s] of Object.entries(this.stages)) {
      if (s.skipTick) { s.skipTick = false; continue; }
      s.turns -= 1;
      if (s.turns <= 0) delete this.stages[k];
    }
    return expired;
  }

  // ------------------------------------------------------------------ vitals

  damage(n) {
    this.hp = Math.max(0, this.hp - n);
    if (this.hp <= 0) this.alive = false;
  }

  heal(n) {
    if (!this.alive) return 0;
    const before = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + n);
    return this.hp - before;
  }

  revive(frac) {
    this.alive = true;
    this.hp = Math.max(1, Math.floor(this.maxHp * frac));
    this.statuses.clear();
    this.stages = {};
  }

  /** Write HP/MP back to the persistent character after battle. */
  commit() {
    if (!this.ch) return;
    this.ch.hp = this.alive ? Math.max(1, this.hp) : 0;
    this.ch.mp = this.mp;
  }

  elementMultiplier(elem) {
    if (!elem || elem === 'none') return 1;
    let m = 1;
    if (this.weak.has(elem)) m *= 1.3;
    if (this.resist[elem] !== undefined) m *= this.resist[elem];
    return m;
  }
}
