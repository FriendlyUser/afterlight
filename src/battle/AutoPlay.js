// Party auto-play: the in-game Auto-battle toggle and the balance simulator
// both choose actions here, so what the simulator measures is what players get.
//
// Priorities: brace against a telegraphed blow (unless an ally is dying) → raise
// a fallen ally → heal a badly hurt ally (Arts first; items only to save a dying
// one) → the attack with the best power × targets × known element factor,
// favouring enemy healers and known weaknesses on a winding-up foe (a Break
// interrupts it).
// (Scoring by expected damage from stats was tried and measured worse in the
// simulator: it under-spends MP on strong Arts.)

import { SKILLS } from '../data/skills.js';
import { ITEMS } from '../data/items.js';
import { resolveElement } from './Formulas.js';

const HURT = 0.45; // heal allies below this HP fraction
const BRACE = 0.75; // guard against a charging foe when below this HP fraction
const DYING = 0.25; // ...but heal first if an ally is below this
const MP_RESERVE = 0.25; // keep this much MP for heals; below it, spend only on cheap skills

/**
 * Element factor for `skill` from `actor` against `foe`, using what the party
 * would know: resistances show on the first hit; weaknesses only once revealed.
 */
function elementFactor(skill, actor, foe) {
  const elem = skill.elem === 'prism' ? null : resolveElement(skill, actor, foe);
  if (!elem || elem === 'none') return 1;
  const r = foe.resist?.[elem];
  if (r !== undefined && r <= 0) return r === 0 ? 0 : -1; // immune / absorbs: never pick
  let f = r ?? 1;
  if (foe.weak.has(elem) && foe.revealed.has(elem)) f *= 1.6;
  return f;
}

/**
 * Score of `skill` on one foe: power × hits × known element factor. A known
 * weakness on a foe that is winding up counts extra: Breaking it interrupts the blow.
 */
function value(skill, actor, foe) {
  const f = elementFactor(skill, actor, foe);
  const interrupt = f > 1 && (foe.hasStatus('charging') || foe.hasStatus('windup')) ? 1.5 : 1;
  return (skill.power || 0) * (skill.hits || 1) * Math.max(0, f) * interrupt * (isHealer(foe) ? 1.3 : 1);
}

/** Foes that heal their side are worth taking out first. */
function isHealer(foe) {
  return !foe.def.boss && (foe.def.skills || []).some(([id]) => SKILLS[id]?.kind === 'heal');
}

/** Expected value of using `id` on `target` (single) or on every foe (group). */
function score(actor, id, target, foes) {
  const s = SKILLS[id];
  if (s.target === 'enemies') return foes.reduce((sum, f) => sum + value(s, actor, f), 0);
  if (s.target === 'random') return foes.reduce((sum, f) => sum + value(s, actor, f), 0) / foes.length;
  return value(s, actor, target);
}

/** The cheapest owned battle item whose `use` passes `fits` (ranked by `size`, smallest first). */
function bestItem(sys, fits, size) {
  const owned = Object.keys(ITEMS).filter((id) => ITEMS[id].battle && ITEMS[id].use && fits(ITEMS[id].use) && sys.inventory.count(id) > 0);
  return owned.sort((a, b) => size(ITEMS[a].use) - size(ITEMS[b].use))[0] || null;
}

/** Choose an action for party battler `actor` in BattleSystem `sys`. */
export function autoAction(sys, actor) {
  const foes = sys.enemies.filter((e) => e.alive);
  const allies = sys.party.filter((p) => p.alive);
  const usable = actor.ch.skillLists().flatMap((l) => l.skills).filter((id) => {
    const s = SKILLS[id];
    return s && !s.special && sys.resolver.mpCost(actor, s) <= actor.mp;
  });

  // 1. Brace first when a foe is winding up a big blow — unless an ally is close to death.
  const hurt = allies.filter((p) => p.hp < p.maxHp * HURT).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
  const charging = foes.some((f) => f.hasStatus('charging') || f.hasStatus('windup'));
  const dying = hurt.some((p) => p.hp < p.maxHp * DYING);
  if (charging && !dying && actor.hp < actor.maxHp * BRACE) return { kind: 'skill', id: 'guard', targets: [actor] };

  // 2. Raise a fallen ally.
  const fallen = sys.party.filter((p) => !p.alive);
  if (fallen.length) {
    const raise = usable.find((id) => SKILLS[id].target === 'ko') || usable.find((id) => SKILLS[id].revive && SKILLS[id].target === 'allies');
    if (raise) return { kind: 'skill', id: raise, targets: SKILLS[raise].target === 'ko' ? [fallen[0]] : sys.party };
  }

  // 3. Heal: a group heal when two or more are hurt, else the weakest ally.
  if (hurt.length) {
    const heals = usable.filter((id) => SKILLS[id].kind === 'heal' && SKILLS[id].power);
    const group = hurt.length >= 2 && heals.find((id) => SKILLS[id].target === 'allies');
    if (group) return { kind: 'skill', id: group, targets: allies };
    const single = heals.find((id) => ['ally', 'allyAny'].includes(SKILLS[id].target));
    if (single) return { kind: 'skill', id: single, targets: [hurt[0]] };
  }

  // 3b. No Art can save a dying ally: reach for the smallest healing item that will.
  const dyingAlly = hurt.find((p) => p.hp < p.maxHp * DYING);
  if (dyingAlly) {
    const potion = bestItem(sys, (u) => u.target === 'ally' && (u.heal || u.healPct), (u) => u.healPct ? 1e9 : u.heal);
    if (potion) return { kind: 'item', id: potion, targets: [dyingAlly] };
  }
  if (fallen.length) {
    const feather = bestItem(sys, (u) => u.target === 'ko' && u.revive, (u) => u.revive);
    if (feather) return { kind: 'item', id: feather, targets: [fallen[0]] };
  }

  // (A foe is charging but someone was dying and nobody could heal: brace anyway.)
  if (charging && actor.hp < actor.maxHp * BRACE) return { kind: 'skill', id: 'guard', targets: [actor] };

  // 4. Attack: best (skill, target) pair; basic Attack is the free fallback.
  const attacks = usable.filter((id) => ['phys', 'mag', 'hybrid'].includes(SKILLS[id].kind) && !['ally', 'allies', 'self', 'allyAny'].includes(SKILLS[id].target));
  const canSpend = actor.mp > actor.maxMp * MP_RESERVE;
  let best = null;
  for (const target of foes) {
    for (const id of ['attack', ...(canSpend ? attacks : [])]) {
      const v = score(actor, id, target, foes);
      if (!best || v > best.v) best = { id, target, v };
    }
  }
  if (!best) return { kind: 'skill', id: 'guard', targets: [actor] };
  const targets = SKILLS[best.id].target === 'enemies' ? foes : [best.target];
  return { kind: 'skill', id: best.id, targets };
}
