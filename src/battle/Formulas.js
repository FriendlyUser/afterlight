// Pure battle math: hit, crit, damage and healing.

export const DAMAGE_CAP = 9999;
export const PRISM = ['fire', 'ice', 'bolt', 'wind', 'light', 'dark'];

/** Resolve a skill's element for a given user. */
export function resolveElement(skill, user, target, rnd = Math.random) {
  let e = skill.elem || 'none';
  if (e === 'weapon') e = user.isParty ? (user.base.weaponElem || 'blunt') : (user.def.attackElem || 'blunt');
  if (e === 'prism') {
    const weakOnes = PRISM.filter((x) => target?.weak?.has(x));
    e = weakOnes.length && rnd() < 0.5 ? weakOnes[Math.floor(rnd() * weakOnes.length)] : PRISM[Math.floor(rnd() * PRISM.length)];
  }
  return e;
}

/** Offensive/defensive stats for a skill kind. */
function attackStats(skill, user, target) {
  switch (skill.stat || skill.kind) {
    case 'mag': return [user.matk, target.mdef];
    case 'hybrid': return [(user.atk + user.matk) / 2, (target.pdef + target.mdef) / 2];
    case 'item': {
      const a = (user.atk + user.matk) / 2 * (1 + (user.mods?.itemPct || 0) / 100);
      return [a, target.mdef];
    }
    default: return [user.atk, target.pdef];
  }
}

export function isPhysical(skill) { return skill.kind === 'phys'; }
export function isMagical(skill) { return skill.kind === 'mag' || skill.kind === 'hybrid'; }

/**
 * Compute one hit of damage. Returns
 * { amount, miss, crit, elem, weak, resisted, absorbed, immune }
 */
export function computeDamage(user, target, skill, { power, surge = 0, rnd = Math.random, forceWeak = false } = {}) {
  const elem = resolveElement(skill, user, target, rnd);
  const out = { amount: 0, miss: false, crit: false, elem, weak: false, resisted: false, absorbed: false, immune: false };

  // Accuracy (physical only)
  if (isPhysical(skill)) {
    let hit = (skill.acc ?? 0.97) - target.evade / 100;
    if (user.hasStatus('blind')) hit -= 0.5;
    if (skill.crit >= 1) hit = 1;
    if (rnd() > Math.max(0.05, hit)) { out.miss = true; return out; }
  } else if (skill.acc && rnd() > skill.acc) {
    out.miss = true;
    return out;
  }

  let [A, D] = attackStats(skill, user, target);
  if (skill.ignoreDef) D *= 1 - skill.ignoreDef;
  A = Math.max(1, A);
  D = Math.max(0, D);
  const p = (power ?? skill.power ?? 100) / 100;
  let dmg = p * A * ((2 * A) / (A + D));
  dmg *= 0.92 + rnd() * 0.16;

  // Critical
  const critChance = (user.crit + (skill.crit || 0) * 100 + (target.hasStatus('marked') ? 25 : 0)) / 100;
  if (isPhysical(skill) || skill.kind === 'hybrid') {
    if (skill.crit >= 1 || rnd() < critChance) { out.crit = true; dmg *= 1.5; }
  }

  // Element
  let em = target.elementMultiplier(elem);
  if (forceWeak && !target.weak.has(elem)) em = Math.max(em, 1) * 1.3;
  if (target.weak.has(elem) || forceWeak) out.weak = true;
  if (em < 0) { out.absorbed = true; }
  else if (em === 0) { out.immune = true; return out; }
  else if (em < 1 && !out.weak) out.resisted = true;
  dmg *= Math.abs(em);

  // State modifiers
  if (target.broken) dmg *= 1.5;
  if (target.hasStatus('guard')) dmg *= target.flags.has('sentinel') ? 0.25 : 0.5;
  if (isPhysical(skill) && target.hasStatus('protect')) dmg *= 0.67;
  if (isMagical(skill) && target.hasStatus('shell')) dmg *= 0.67;
  if (surge) dmg *= 1 + 0.5 * surge;
  if (user.isParty) {
    const wt = user.base.weaponType;
    if (user.flags.has('bareKnuckle') && wt === 'fist') dmg *= 1.3;
    if (user.flags.has('spearMaster') && wt === 'spear') dmg *= 1.2;
    if (skill.summon && user.flags.has('beastBond')) dmg *= 1.3;
  }

  const cap = user.flags?.has('breakLimit') ? 99999 : DAMAGE_CAP;
  out.amount = Math.max(1, Math.min(cap, Math.round(dmg)));
  return out;
}

/** Healing amount for a heal-kind skill (power 100 = baseline). */
export function computeHeal(user, target, power) {
  const m = user.isParty ? user.matk : user.matk * 0.8;
  const stat = m * 2.5 + 10 + user.level * 3;
  let h = (power / 100) * stat * (0.95 + Math.random() * 0.1);
  h *= 1 + (user.mods?.healPct || 0) / 100;
  if (user.id === 'ilse' && target.hp < target.maxHp * 0.3) h *= 1.5;
  return Math.round(h);
}
