// How a foe weighs its options. Every enemy turn that isn't scripted (and every pick a
// boss script leaves open) goes through here: each skill the foe knows gets a score —
// its authored weight times how much sense it makes right now — and the foe picks
// among the sensible ones by weighted chance, so fights stay varied but foes stop
// doing foolish things (healing the unhurt, re-hushing the hushed, breathing fire at
// someone in fireproof armour). Then the target is chosen the same way.
//
// What a foe knows: everyone's HP, buffs and ailments (they're on show), the party's
// elemental armour (it's on show too). What it has to learn: who is immune to which
// ailment — a foe finds out by trying, and its whole side remembers (sys.aiKnown).
//
// Judgement scales with difficulty (JUDGEMENT: on Story foes mostly act on habit, on
// Hard they rarely waste a turn) and with the creature's level (judgementOf).
//
// Traits (def.traits, plus ones read off the foe's kit — see traitsOf):
//   pack     packmates pile onto one quarry (a Marked target, or whoever the pack bit first)
//   thief    pilfers gold, then tries to run with it; felling it gets the gold back
//   enrage   once badly hurt, it flies into a rage (STR up) instead of its turn
//   guardian shields hurt or Broken allies
//   coward   flees when it's the last one standing and badly hurt

import { SKILLS } from '../data/skills.js';
import { STATUSES } from '../data/statuses.js';
import { computeDamage, resolveElement } from './Formulas.js';

/** Per difficulty (Story, Normal, Hard): how strongly circumstances outweigh habit. */
export const JUDGEMENT = [0.5, 0.85, 1];

/**
 * How sharp this foe is: the difficulty's judgement, scaled by what the creature is.
 * Shore critters and cave vermin (level 1) are about half as canny as anything from
 * level 12 on, so the first hours stay gentle while later foes think.
 */
export function judgementOf(sys, self = null) {
  const base = JUDGEMENT[sys.state?.settings?.difficulty ?? 1] ?? JUDGEMENT[1];
  const lv = self?.level ?? 99;
  return base * Math.max(0.45, Math.min(1, 0.4 + lv / 20));
}

const HEAVY = (s) => (s.power || 0) * (s.hits || 1) >= 150 || (s.delay || 1) >= 1.3;

/** Traits written on the foe plus the ones its kit implies. */
export function traitsOf(def) {
  const t = new Set(def.traits || []);
  const ids = (def.skills || []).map(([id]) => id);
  if (ids.includes('e_steal')) t.add('thief');
  if (ids.includes('e_mark')) t.add('pack');
  if (def.sprite?.type === 'hound' && !def.boss) t.add('pack');
  if (ids.includes('e_bulwark')) t.add('guardian');
  return t;
}

// ---------------------------------------------------------------------------
// What the side has learned
// ---------------------------------------------------------------------------

function known(sys) {
  if (!sys.aiKnown) sys.aiKnown = { immune: new Set() };
  return sys.aiKnown;
}

/** A status attempt bounced off an immune target: the foes remember. */
export function learnImmunity(sys, target, status) {
  known(sys).immune.add(`${target.id}:${status}`);
}

const knownImmune = (sys, t, status) => known(sys).immune.has(`${t.id}:${status}`);

/** Could this status still take on t, as far as the foes know? */
function afflictable(sys, t, status) {
  return t.alive && !t.hasStatus(status) && !knownImmune(sys, t, status) && !(status === 'sleep' && t.hasStatus('stun'));
}

// ---------------------------------------------------------------------------
// Sizing up the party
// ---------------------------------------------------------------------------

const hpPct = (b) => b.hp / b.maxHp;
const livingParty = (sys) => sys.party.filter((p) => p.alive && !p.hasStatus('airborne'));
const livingFoes = (sys) => sys.enemies.filter((e) => e.alive);

/** A casting party member (silence them), as opposed to a fighter (blind them). */
const caster = (p) => p.matk > p.atk * 1.1;

/** Expected damage of one use of `skill` on `t`, steadied (no variance, no crit). */
function estimate(self, t, skill) {
  if (!skill.power) return 0;
  const r = computeDamage(self, t, skill, { rnd: () => 0.5 });
  if (r.miss || r.immune) return 0;
  return (r.absorbed ? -1 : 1) * r.amount * (skill.hits || 1);
}

/** How well an element lands on t: 0 absorbs or immune, <1 resisted, >1 weak. */
function elemFit(self, t, skill) {
  const e = resolveElement(skill, self, t, () => 0.5);
  const m = t.elementMultiplier(e);
  return m <= 0 ? 0 : m;
}

/** The pack's quarry: a Marked party member, else whoever a packmate went for. */
function quarry(sys, self) {
  const marked = livingParty(sys).find((p) => p.hasStatus('marked'));
  if (marked) return marked;
  const q = sys.aiQuarry;
  return q && q.alive && !q.hasStatus('airborne') ? q : null;
}

// ---------------------------------------------------------------------------
// Targets
// ---------------------------------------------------------------------------

function weighted(list, rnd) {
  const total = list.reduce((s, [, w]) => s + w, 0);
  if (total <= 0) return list[Math.floor(rnd() * list.length)]?.[0];
  let r = rnd() * total;
  for (const [v, w] of list) if ((r -= w) <= 0) return v;
  return list[list.length - 1][0];
}

/** Bend a situational multiplier by judgement: 1 = full sense, 0 = pure habit. */
const bend = (m, j) => (m <= 0 ? 0 : m ** j);

/** The party member a damaging or hindering skill should go for. */
export function chooseTarget(sys, self, skill, j = judgementOf(sys, self)) {
  const pool = livingParty(sys);
  if (!pool.length) return null;
  const rnd = sys.rnd;
  const taunters = pool.filter((p) => p.hasStatus('taunt'));
  if (taunters.length && rnd() < 0.85) return taunters[0];

  const statuses = (skill.status || []).map(([id]) => id);
  const damaging = (skill.power || 0) > 0;
  const traits = self.def ? traitsOf(self.def) : new Set();
  const prey = traits.has('pack') ? quarry(sys, self) : null;

  const scored = pool.map((p) => {
    let m = 1 + (1 - hpPct(p)) * 0.8; // lean toward the wounded
    if (damaging) {
      const fit = elemFit(self, p, skill);
      if (fit === 0) return [p, 0];
      m *= fit;
      const dmg = estimate(self, p, skill);
      if (dmg >= p.hp) m *= 2.2; // a finishing blow
      if (p.hasStatus('guard')) m *= 0.55;
      if (p.hasStatus('veil') && skill.kind === 'phys') m *= 0.35;
      if (skill.kind === 'phys' && p.hasStatus('protect')) m *= 0.75;
      if (skill.kind === 'mag' && p.hasStatus('shell')) m *= 0.75;
    }
    if (statuses.length && !damaging) {
      const open = statuses.filter((s) => afflictable(sys, p, s));
      if (!open.length) return [p, 0];
      if (open.includes('silence')) m *= caster(p) ? 2.2 : 0.5;
      if (open.includes('blind')) m *= caster(p) ? 0.5 : 2.2;
      if (open.includes('doom')) m *= 1 + hpPct(p);
    }
    if (skill.special === 'mpDrain') m *= 0.3 + (p.mp / Math.max(1, p.maxMp)) * (caster(p) ? 2 : 1);
    // The pack's quarry draws them by instinct, however dim the beast.
    return [p, bend(m, j) * (prey === p ? 4 : 1)];
  });
  return weighted(scored, rnd);
}

/** The ally (enemy side) a heal or a shield should go to. */
function chooseAlly(sys, self, skill) {
  const allies = livingFoes(sys);
  if (skill.target === 'ally') {
    // A shield: the Broken first, then the most hurt that isn't already shielded.
    const shield = (skill.status || []).map(([id]) => id);
    const open = allies.filter((a) => !shield.some((s) => a.hasStatus(s)));
    const pool = open.length ? open : allies;
    pool.sort((a, b) => Number(b.broken) - Number(a.broken) || hpPct(a) - hpPct(b));
    return pool[0];
  }
  allies.sort((a, b) => hpPct(a) - hpPct(b));
  return allies[0];
}

/** Targets for skill `id`, chosen with judgement. */
export function targetsFor(sys, self, id, j = judgementOf(sys, self)) {
  const s = SKILLS[id];
  switch (s.target) {
    case 'enemy': return [chooseTarget(sys, self, s, j)].filter(Boolean);
    case 'ally':
    case 'allyAny': return [chooseAlly(sys, self, s)].filter(Boolean);
    case 'self': return [self];
    default: return [];
  }
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

/** Can this foe use the skill at all right now? */
function usable(sys, self, s, id) {
  if (!s) return false;
  if (self.hasStatus('silence') && (s.kind === 'mag' || s.kind === 'heal')) return false;
  if (id === 'e_summon') return (self.def.summons || []).length > 0 && livingFoes(sys).length < 5;
  if (id === 'e_steal') return sys.state.gold > 0 && (self.memory.pilfers || 0) < 2;
  return true;
}

/**
 * How much sense skill `id` makes this turn, as a multiplier on its authored weight
 * (0 = pointless). Kept gentle: habit still matters, so foes don't turn predictable.
 */
export function situation(sys, self, id) {
  const s = SKILLS[id];
  if (!usable(sys, self, s, id)) return 0;
  const party = livingParty(sys);
  const foes = livingFoes(sys);
  const n = Math.max(1, party.length);

  if (s.kind === 'heal') {
    const cures = s.cure ? foes.filter((a) => [...a.statuses.keys()].some((k) => STATUSES[k]?.bad)).length : 0;
    if (!s.power) return cures ? 1 + cures : 0;
    const hurt = foes.filter((a) => hpPct(a) < 0.7);
    if (!hurt.length) return cures ? 1 : 0;
    const worst = Math.min(...hurt.map(hpPct));
    if (s.target === 'allies') return hurt.length >= 2 ? 1 + hurt.length * 0.9 : 0.6 + (1 - worst);
    return 1 + 3 * (1 - worst);
  }

  if (s.special === 'enemyFlee') return 0; // only ever chosen by reflex
  if (s.special === 'selfDestruct') return hpPct(self) < 0.35 ? 2.5 : 0.15;
  if (s.special === 'charge') return 1;

  if (s.kind === 'support' || (!s.power && !s.special)) {
    // Self buffs: pointless when already up.
    if (s.target === 'self') {
      const keys = Object.keys(s.selfBuffs || {});
      if (keys.length && keys.every((k) => (self.stages[k]?.v || 0) > 0)) return 0.1;
      if (s.special === 'guard') return hpPct(self) < 0.5 ? 1.5 : 0.4;
      if ((s.selfStatus || []).some((k) => self.hasStatus(k))) return 0.1;
      const hardening = keys.includes('def') || keys.includes('res');
      return hardening ? 0.6 + (1 - hpPct(self)) * 1.4 : 1;
    }
    // Ally buffs and shields.
    if (s.target === 'allies' || s.target === 'ally') {
      const buffKeys = Object.keys(s.buffs || {});
      const shield = (s.status || []).map(([k]) => k);
      const open = foes.filter((a) => (buffKeys.length && !buffKeys.every((k) => (a.stages[k]?.v || 0) > 0)) || (shield.length && !shield.every((k) => a.hasStatus(k))));
      if (!open.length) return 0.05;
      if (s.target === 'ally') {
        const need = open.some((a) => a.broken || hpPct(a) < 0.6);
        return need ? 2 : 0.5;
      }
      return 0.5 + open.length * 0.4;
    }
    // Hindering the party: only where it can still take.
    const statuses = (s.status || []).map(([k]) => k);
    const debuffs = Object.keys(s.debuffs || {});
    const open = party.filter((p) => statuses.some((k) => afflictable(sys, p, k)) || debuffs.some((k) => (p.stages[k]?.v || 0) >= 0));
    if (!open.length) return 0;
    if (s.target === 'enemy') return 1;
    if (statuses.includes('sleep') && open.length < 2) return 0.4;
    return 0.4 + (open.length / n) * 0.9;
  }

  // Damage.
  let m = 1;
  if (s.target === 'enemies') m *= 0.35 + n * 0.25; // worth more the more there are to hit
  if (s.drain) m *= 1 + (1 - hpPct(self)) * 1.5;
  // Element: how well it lands across whoever it would hit.
  const fits = party.map((p) => elemFit(self, p, s));
  const fit = s.target === 'enemy' ? Math.max(...fits, 0) : fits.reduce((a, b) => a + b, 0) / Math.max(1, fits.length);
  if (fit === 0) return 0.03;
  m *= fit;
  // A blow that would fell someone.
  if (s.target === 'enemy' && party.some((p) => estimate(self, p, s) >= p.hp)) m *= 1.6;
  // A heavy blow is worth less when everyone is guarding.
  if (HEAVY(s) && party.every((p) => p.hasStatus('guard'))) m *= 0.5;
  return m;
}

/** Choose from a weighted skill list with judgement. Returns an action. */
export function judge(sys, self, list, j = judgementOf(sys, self)) {
  const scored = list.map(([id, w]) => [id, w * bend(situation(sys, self, id), j)]).filter(([, w]) => w > 0);
  const id = scored.length ? weighted(scored, sys.rnd) : 'attack';
  return { kind: 'skill', id, targets: targetsFor(sys, self, id, j) };
}

// ---------------------------------------------------------------------------
// Reflexes: things a foe does before it weighs anything
// ---------------------------------------------------------------------------

/** Enrage, run, or nothing. */
export function reflex(sys, self) {
  const traits = traitsOf(self.def);
  const rnd = sys.rnd;
  const m = self.memory;
  if (traits.has('thief') && m.pilfered && rnd() < (hpPct(self) < 0.9 ? 0.5 : 0.3)) {
    return { kind: 'skill', id: 'e_flee', targets: [self] };
  }
  if (traits.has('coward') && livingFoes(sys).length === 1 && hpPct(self) < 0.3 && rnd() < 0.5) {
    return { kind: 'skill', id: 'e_flee', targets: [self] };
  }
  if (traits.has('enrage') && hpPct(self) < 0.4 && !m.enraged) {
    m.enraged = true;
    return { kind: 'skill', id: 'e_enrage', targets: [self] };
  }
  return null;
}

/** After a pack member picks a target, the rest of the pack follows it. */
export function notePackTarget(sys, self, action) {
  if (!traitsOf(self.def).has('pack')) return;
  const t = action?.targets?.[0];
  if (t?.isParty && SKILLS[action.id]?.power && !quarry(sys, self)) sys.aiQuarry = t;
}
