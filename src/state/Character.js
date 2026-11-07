// A party member's persistent progression: level, crests, supports, gear.

import { CHARACTERS } from '../data/characters.js';
import { CRESTS, CREST_RANK_CP, MAX_RANK } from '../data/crests.js';
import { PASSIVES } from '../data/passives.js';
import { EQUIPMENT, WEAPON_TYPES } from '../data/equipment.js';
import { LOOKS } from '../data/looks.js';

export const MAX_LEVEL = 99;
export const SLOTS = ['weapon', 'offhand', 'head', 'body', 'accessory1', 'accessory2'];
const STAT_KEYS = ['hp', 'mp', 'str', 'mag', 'def', 'res', 'spd', 'lck'];

/** Raw stat curve by level, before character/crest multipliers. */
export function statCurve(stat, level) {
  const n = level - 1;
  switch (stat) {
    case 'hp': return 120 + 28 * n + 0.42 * n * n;
    case 'mp': return 30 + 3.2 * n + 0.02 * n * n;
    case 'spd': return 10 + 0.55 * n;
    case 'lck': return 8 + 0.5 * n;
    default: return 12 + 1.6 * n + 0.012 * n * n;
  }
}

export function expToNext(level) {
  return Math.round(20 + 12 * level + 1.5 * level * level + 0.012 * level ** 3);
}

export class Character {
  constructor(id, data = null) {
    const def = CHARACTERS[id];
    this.id = id;
    this.def = def;
    this.name = def.name;
    this.level = def.startLevel || 1;
    this.exp = 0;
    this.crest = def.startCrest;
    this.secondary = null;
    this.crests = { [def.startCrest]: 0 }; // crestId -> CP
    this.passives = [];
    this.equipment = { weapon: null, offhand: null, head: null, body: null, accessory1: null, accessory2: null };
    for (const [slot, item] of Object.entries(def.equip || {})) this.equipment[slot] = item;
    this.boosts = {};
    this.lookId = def.look;
    this.sealed = false; // true until the character's Crest is awakened (story)
    if (data) Object.assign(this, data);
    const s = this.stats();
    this.hp = data?.hp ?? s.hp;
    this.mp = data?.mp ?? s.mp;
  }

  get look() { return LOOKS[this.lookId] || LOOKS[this.def.look]; }

  /**
   * Battle sprite: the character's own look, dressed in their primary Crest's
   * costume (unless it is their signature Crest) and holding their weapon.
   */
  battleLook() {
    const base = this.look;
    const w = EQUIPMENT[this.equipment.weapon];
    const sprite = w ? WEAPON_TYPES[w.wtype]?.sprite : 'fist';
    const shield = !!this.equipment.offhand;
    const costume = this.crest !== this.def.startCrest ? CRESTS[this.crest].costume : null;
    if (!costume && base.weapon === sprite && !!base.shield === shield) return base;
    const look = { ...base, id: `${base.id}_${this.crest}_${sprite}_${shield ? 's' : ''}`, weapon: sprite, shield };
    if (costume) {
      const { acc = [], capeColor, style, ...colors } = costume;
      look.outfit = { ...base.outfit, ...colors, style: style || base.outfit.style };
      // Keep signature head/neck pieces unless the costume brings its own headwear.
      const headwear = ['hat_wizard', 'hat_wide', 'helmet', 'hood', 'circlet', 'headband', 'bandana', 'crown'];
      const keep = (base.acc || []).filter((a) => !(acc.some((x) => headwear.includes(x)) && headwear.includes(a)) && a !== 'cape');
      look.acc = [...new Set([...keep, ...acc])];
      if (capeColor) look.capeColor = capeColor;
    }
    return look;
  }

  // ------------------------------------------------------------------ crests

  rankOf(crestId) {
    const cp = this.crests[crestId];
    if (cp === undefined) return 0;
    let r = 1;
    for (let i = 1; i < CREST_RANK_CP.length; i++) if (cp >= CREST_RANK_CP[i]) r = i + 1;
    return Math.min(MAX_RANK, r);
  }

  /** CP progress toward next rank: { cp, need, rank } */
  rankProgress(crestId) {
    const rank = this.rankOf(crestId);
    const cp = this.crests[crestId] || 0;
    if (rank >= MAX_RANK) return { rank, cp, need: 0, frac: 1 };
    const lo = CREST_RANK_CP[rank - 1], hi = CREST_RANK_CP[rank];
    return { rank, cp, need: hi - cp, frac: (cp - lo) / (hi - lo) };
  }

  /** Can this character take up the crest right now? (global unlock checked by caller) */
  meetsRequirements(crestId) {
    const req = CRESTS[crestId].requires;
    if (!req) return true;
    return Object.entries(req).every(([c, r]) => this.rankOf(c) >= r);
  }

  learnCrest(crestId) {
    if (this.crests[crestId] === undefined) this.crests[crestId] = 0;
  }

  setCrest(crestId) {
    this.learnCrest(crestId);
    this.crest = crestId;
    if (this.secondary === crestId) this.secondary = null;
  }

  setSecondary(crestId) {
    this.secondary = crestId === this.crest ? null : crestId;
  }

  /** Unlocks (skills/passives) learned from a crest. */
  unlocksOf(crestId) {
    const rank = this.rankOf(crestId);
    return CRESTS[crestId].ranks.slice(0, rank);
  }

  /** Active skills usable in battle: primary crest + secondary crest. */
  skillLists() {
    if (this.sealed) return [];
    const lists = [];
    for (const c of [this.crest, this.secondary]) {
      if (!c) continue;
      const skills = this.unlocksOf(c).filter((u) => u.skill).map((u) => u.skill);
      lists.push({ crest: c, skills });
    }
    return lists;
  }

  /** Every passive learned on any crest. */
  learnedPassives() {
    const set = new Set();
    for (const c of Object.keys(this.crests)) for (const u of this.unlocksOf(c)) if (u.passive) set.add(u.passive);
    return [...set];
  }

  supportBudget() { return Math.min(14, 3 + Math.floor(this.level / 8)); }

  supportUsed() { return this.passives.reduce((s, p) => s + (PASSIVES[p]?.cost || 0), 0); }

  togglePassive(id) {
    const i = this.passives.indexOf(id);
    if (i >= 0) { this.passives.splice(i, 1); return true; }
    if (this.supportUsed() + PASSIVES[id].cost > this.supportBudget()) return false;
    this.passives.push(id);
    return true;
  }

  /** Gain CP. Returns list of { crest, rank, unlock } for new ranks reached. */
  gainCp(crestId, amount) {
    if (!crestId) return [];
    const before = this.rankOf(crestId);
    this.crests[crestId] = Math.min(CREST_RANK_CP[MAX_RANK - 1], (this.crests[crestId] || 0) + amount);
    const after = this.rankOf(crestId);
    const out = [];
    for (let r = before + 1; r <= after; r++) out.push({ crest: crestId, rank: r, unlock: CRESTS[crestId].ranks[r - 1] });
    return out;
  }

  // ------------------------------------------------------------------ equipment

  canEquip(itemId, crestId = this.crest) {
    const it = EQUIPMENT[itemId];
    if (!it) return false;
    const crest = CRESTS[crestId];
    if (it.slot === 'weapon') return crest.weapons.includes(it.wtype);
    if (it.slot === 'offhand') return crest.shield;
    if (it.slot === 'body' || it.slot === 'head') return crest.armor.includes(it.armor);
    return true;
  }

  slotAccepts(slot, itemId) {
    const it = EQUIPMENT[itemId];
    if (!it) return false;
    if (slot.startsWith('accessory')) return it.slot === 'accessory';
    return it.slot === slot;
  }

  /** Remove gear the current crest can no longer use. Returns removed ids. */
  validateEquipment() {
    const removed = [];
    for (const slot of SLOTS) {
      const id = this.equipment[slot];
      if (id && !this.canEquip(id)) { removed.push(id); this.equipment[slot] = null; }
    }
    return removed;
  }

  equippedItems() { return SLOTS.map((s) => EQUIPMENT[this.equipment[s]]).filter(Boolean); }

  // ------------------------------------------------------------------ derived stats

  /** All modifiers from passives + gear: { mods, flags:Set, immune:Set, resist:{}, autoStatus:[] } */
  modifiers() {
    const mods = {};
    const flags = new Set();
    const immune = new Set();
    const resist = {};
    const autoStatus = [];
    const addSrc = (src) => {
      if (!src) return;
      for (const [k, v] of Object.entries(src.mods || {})) mods[k] = (mods[k] || 0) + v;
      (src.flags || []).forEach((f) => flags.add(f));
      (src.immune || []).forEach((f) => immune.add(f));
      for (const [k, v] of Object.entries(src.resist || {})) resist[k] = Math.min(resist[k] ?? 1, v);
      (src.autoStatus || []).forEach((s) => autoStatus.push(s));
    };
    for (const p of this.passives) addSrc(PASSIVES[p]);
    for (const it of this.equippedItems()) addSrc(it);
    if (this.id === 'sable') immune.add('doom');
    return { mods, flags, immune, resist, autoStatus };
  }

  /** Crests mastered to max rank; each grants +1% to every stat permanently. */
  masteredCount() { return Object.keys(this.crests).filter((c) => this.rankOf(c) >= MAX_RANK).length; }

  stats() {
    const crest = CRESTS[this.crest];
    const { mods } = this.modifiers();
    const mastery = 1 + this.masteredCount() / 100;
    const gear = this.equippedItems();
    const flat = (k) => gear.reduce((s, it) => s + (it[k] || 0), 0);
    const out = {};
    for (const k of STAT_KEYS) {
      const pct = mods[`${k}Pct`] || 0;
      const v = statCurve(k, this.level) * (this.def.mult[k] || 1) * (crest.stats[k] || 1) * (1 + pct / 100) * mastery;
      out[k] = Math.floor(v + (this.boosts[k] || 0));
    }
    out.str += flat('str');
    out.mag += flat('mag');
    out.def += flat('def');
    out.res += flat('res');
    out.spd += flat('spd');
    out.lck += flat('lck');
    out.hp = Math.min(9999, out.hp + flat('hp'));
    out.mp = Math.min(999, out.mp + flat('mp'));
    out.atk = out.str + flat('atk');
    out.matk = out.mag;
    out.crit = 4 + Math.floor(out.lck / 8) + (mods.crit || 0);
    out.evade = 3 + Math.floor(out.spd / 12) + (mods.evade || 0);
    const w = EQUIPMENT[this.equipment.weapon];
    out.weaponElem = w ? (w.elem || WEAPON_TYPES[w.wtype].elem) : 'blunt';
    out.weaponType = w ? w.wtype : 'fist';
    return out;
  }

  get maxHp() { return this.stats().hp; }
  get maxMp() { return this.stats().mp; }
  get alive() { return this.hp > 0; }

  clampVitals() {
    const s = this.stats();
    this.hp = Math.min(this.hp, s.hp);
    this.mp = Math.min(this.mp, s.mp);
  }

  fullHeal() {
    const s = this.stats();
    this.hp = s.hp;
    this.mp = s.mp;
  }

  // ------------------------------------------------------------------ experience

  /** Returns number of levels gained. */
  gainExp(amount) {
    if (this.level >= MAX_LEVEL) return 0;
    this.exp += amount;
    let gained = 0;
    while (this.level < MAX_LEVEL && this.exp >= expToNext(this.level)) {
      const before = this.stats();
      this.exp -= expToNext(this.level);
      this.level++;
      gained++;
      const after = this.stats();
      this.hp += after.hp - before.hp;
      this.mp += after.mp - before.mp;
    }
    return gained;
  }

  /** Set level directly (story joins); keeps HP/MP full. */
  setLevel(level) {
    this.level = Math.max(this.level, Math.min(MAX_LEVEL, level));
    this.exp = 0;
    this.fullHeal();
  }

  serialize() {
    const { id, level, exp, hp, mp, crest, secondary, crests, passives, equipment, boosts, lookId, sealed } = this;
    return { id, level, exp, hp, mp, crest, secondary, crests, passives, equipment, boosts, lookId, sealed };
  }

  static deserialize(data) { return new Character(data.id, data); }
}
