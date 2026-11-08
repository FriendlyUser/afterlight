// Readable details for an Art, built from its data (data/skills.js) so every Art —
// rank, Mastery or Link — explains itself the same way in the Crest and Arts screens
// and the battle menu: what kind of Art, whom it hits, how hard, at what cost, and
// every rider (statuses, stat stages, cures, drain, piercing, speed, specials).

import { STATUSES } from './statuses.js';

const KIND = { phys: 'Physical', mag: 'Magic', hybrid: 'Hybrid', heal: 'Healing', support: 'Support', special: 'Special' };
const TARGET = {
  enemy: 'One foe', enemies: 'All foes', random: 'Random foes', ally: 'One ally', allies: 'All allies',
  self: 'Self', ko: 'One fallen ally', allyAny: 'Any ally',
};
const ELEM = {
  weapon: 'Weapon element', prism: 'Every element', none: 'Unaligned', slash: 'Slash', pierce: 'Pierce', blunt: 'Blunt',
  fire: 'Fire', ice: 'Ice', bolt: 'Bolt', wind: 'Wind', light: 'Light', dark: 'Dark',
};
const STAT = { str: 'STR', mag: 'MAG', def: 'DEF', res: 'RES', spd: 'SPD', eva: 'Evasion' };
const SPECIAL = {
  jump: 'Leaps out of reach and lands on the next turn',
  steal: 'Steals an item',
  scan: 'Reveals a foe\'s HP and weaknesses',
  scanAll: 'Reveals every foe\'s HP and weaknesses',
  quicken: 'The target acts at once',
  delay: 'Pushes the target\'s turn back',
  delayAll: 'Pushes back every foe\'s turn (half as far for bosses)',
  partyHeal15: 'Heals the party 15%',
  heal60: 'Restores everyone to at least 60% HP',
  finale: 'Heals the party 50%',
  fullHeal: 'Fully heals and cures the party',
  allWeak: 'Always lands as a weakness (breaks Poise)',
  dispel: 'Strips the target\'s buffs',
  revenge: 'Stronger the more HP you have lost',
  afterglowScale: 'Stronger the fuller the Afterglow gauge',
  gravity: 'Cuts a quarter of current HP (8% against bosses)',
  mpGift: 'Restores 25 MP',
  mist: 'Heals the party 25% and restores 10% MP',
  phoenix: 'Revives the fallen',
  focus: 'Heals 30% HP and cures ailments',
  guard: 'Halves damage until your next turn',
  alchemize: 'Turns a foe into gold',
  hex: 'A random curse',
  kindle: 'Fills the Afterglow gauge',
};

const pct = (v) => `${Math.round(v * 100)}%`;
const stages = (o, sign) => Object.entries(o).map(([k, v]) => `${STAT[k] || k.toUpperCase()} ${sign > 0 ? '▲' : '▼'}${Math.abs(v)}`).join(', ');

/**
 * @param {import('./../types/data').SkillDef} s
 * @param {{ mp?: number, powerMult?: number }} [opts]  the user's actual MP cost; star power multiplier
 * @returns {{ line: string, effects: string[] }}
 */
export function artDetails(s, opts = {}) {
  const parts = [];
  const kind = s.stat === 'item' ? 'Item' : KIND[s.kind] || s.kind;
  parts.push(kind, TARGET[s.target] || s.target);
  const mult = opts.powerMult || 1;
  if (s.power) {
    const p = Math.round(s.power * mult);
    const label = s.kind === 'heal' ? 'Heal' : 'Power';
    parts.push(`${label} ${p}${s.hits > 1 ? ` × ${s.hits}` : ''}`);
  }
  if (s.elem && s.power && s.kind !== 'heal') parts.push(ELEM[s.elem] || s.elem);
  const mp = opts.mp ?? s.mp;
  if (mp) parts.push(`${mp} MP`);

  const fx = [];
  if (s.hpCost) fx.push(`Costs ${pct(s.hpCost)} of max HP`);
  if (s.target === 'random' && s.hits > 1) fx.push(`${s.hits} hits, each at a random foe`);
  for (const [id, chance] of s.status || []) {
    const st = STATUSES[id];
    if (!st) continue;
    fx.push(st.bad ? `${chance >= 1 ? 'Inflicts' : `${pct(chance)} chance of`} ${st.name}${st.desc ? ` (${st.desc.replace(/\.$/, '')})` : ''}` : `Grants ${st.name}${st.desc ? ` (${st.desc.replace(/\.$/, '')})` : ''}`);
  }
  for (const id of s.selfStatus || []) if (STATUSES[id]) fx.push(`You gain ${STATUSES[id].name}`);
  const onAllies = ['ally', 'allies', 'allyAny', 'self'].includes(s.target);
  if (s.buffs && Object.keys(s.buffs).length) fx.push(`${onAllies && s.target !== 'self' ? (s.target === 'allies' ? 'Party ' : 'Ally ') : ''}${stages(s.buffs, 1)}`);
  if (s.debuffs && Object.keys(s.debuffs).length) fx.push(`Foe ${stages(s.debuffs, -1)}`);
  if (s.selfBuffs && Object.keys(s.selfBuffs).length) fx.push(`Your ${stages(s.selfBuffs, 1)}`);
  if (s.cure === 'bad') fx.push('Cures every ailment');
  else if (Array.isArray(s.cure) && s.cure.length) fx.push(`Cures ${s.cure.map((c) => STATUSES[c]?.name || c).join(', ')}`);
  if (s.revive) fx.push(`Revives the fallen at ${pct(s.revive)} HP`);
  if (s.drain) fx.push(`Heals you for ${pct(s.drain)} of the damage`);
  if (s.ignoreDef) fx.push(`Pierces ${pct(s.ignoreDef)} of ${s.kind === 'mag' ? 'RES' : s.kind === 'hybrid' ? 'DEF and RES' : 'DEF'}`);
  if (s.crit >= 1) fx.push('Never misses; always critical');
  else if (s.crit) fx.push(`+${pct(s.crit)} critical chance`);
  if (s.acc && s.acc < 1) fx.push(`${pct(s.acc)} accuracy`);
  if (s.delay && s.delay < 1) fx.push('Quick: your next turn comes sooner');
  else if (s.delay && s.delay > 1) fx.push('Heavy: your next turn comes later');
  if (s.special && SPECIAL[s.special]) fx.push(SPECIAL[s.special]);
  if (s.summon) fx.push('A summon (Beast Bond: +30%)');
  if (mult > 1) fx.push(`Ascension: +${Math.round((mult - 1) * 100)}% power`);
  return { line: parts.join(' · '), effects: fx };
}

/** One-line HTML for compact places (the battle menu): the line, then effects. */
export function artSummaryHtml(s, opts = {}) {
  const d = artDetails(s, opts);
  return `<div class="art-line">${d.line}</div>${d.effects.length ? `<div class="art-fx">${d.effects.join(' · ')}</div>` : ''}`;
}
