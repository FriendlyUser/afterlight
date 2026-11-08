// Enemy roster. Stats derive from level via the curves in enemyStats();
// `stats` holds per-enemy multipliers. Sprites are painted by MonsterFactory.
//
// weak:   damage types that deal +30% and chip Poise (revealed when hit)
// resist: { elem: multiplier }  (0.5 half, 0 immune, -1 absorb)
// poise:  hits-to-Break shield
// skills: [[skillId, weight], ...] for the default AI; `ai` names a script in battle/AI.js
// drops:  [[itemId, chance]]  steal: [itemId (common), itemId (rare)]

// Normal enemies get extra HP so ordinary fights last 2–3 rounds; boss HP is
// authored directly via stats.hp (typically 8–20× the base curve).
const NORMAL_HP_MULT = 1.9;
const DAMAGE_MULT = 1.2;

export function enemyStats(def) {
  const L = def.level;
  const m = def.stats || {};
  const hp = (30 + 10 * L + 0.5 * L * L) * (m.hp ?? 1) * (def.boss ? 1 : NORMAL_HP_MULT);
  const str = (10 + 3.2 * L + 0.02 * L * L) * 1.35 * DAMAGE_MULT * (m.str ?? 1);
  const mag = (10 + 3.0 * L + 0.02 * L * L) * 1.3 * DAMAGE_MULT * (m.mag ?? 1);
  const dfn = (6 + 1.6 * L + 0.01 * L * L) * (m.def ?? 1);
  const res = (6 + 1.6 * L + 0.01 * L * L) * (m.res ?? 1);
  const spd = (8 + 0.55 * L) * (m.spd ?? 1);
  return {
    hp: Math.round(hp), mp: 999,
    atk: Math.round(str), str: Math.round(str), matk: Math.round(mag), mag: Math.round(mag),
    def: Math.round(dfn), res: Math.round(res), spd: Math.round(spd * 10) / 10,
    lck: Math.round(8 + 0.5 * L), crit: 5, evade: m.evade ?? 3,
    exp: Math.round((6 + 3 * L + 0.3 * L * L) * (m.exp ?? 1)),
    gold: Math.round((4 + 2 * L + 0.1 * L * L) * (m.gold ?? 1)),
    cp: Math.round((1 + Math.floor(L / 8)) * (m.cp ?? 1)),
  };
}

/**
 * An enemy definition (see EnemyDef); `opts` holds everything past the basics.
 * @param {string} id
 * @param {string} name
 * @param {number} level
 * @param {import('../types/data').EnemyDef['sprite']} sprite
 * @param {Partial<import('../types/data').EnemyDef>} [opts]
 * @returns {import('../types/data').EnemyDef}
 */
const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, poise: 2, skills: [['attack', 1]], drops: [], ...opts });

/** @type {import('../types/data').EnemyDef[]} */
const LIST = [
  // ================================================================ ACT I — Lanternfall
  E('brine_jelly', 'Brine Jelly', 1, { type: 'slime', color: '#4ab0c0', eye: '#203040' }, {
    stats: { hp: 0.9, def: 0.8 }, weak: ['fire', 'bolt'], resist: { ice: 0.5 }, poise: 2,
    skills: [['attack', 3], ['e_spit', 1]], drops: [['tonic', 0.15], ['sea_glass', 0.3]], steal: ['tonic', 'sea_glass'],
    desc: 'A jelly of seawater and spite. Wobbles indignantly.',
  }),
  E('sand_crab', 'Sand Crab', 2, { type: 'crab', color: '#c86a4a', eye: '#202020' }, {
    stats: { hp: 1.0, def: 1.5, spd: 0.8 }, weak: ['blunt', 'bolt'], resist: { slash: 0.7 }, poise: 3,
    skills: [['attack', 3], ['e_shell', 1]], drops: [['tonic', 0.2]], steal: ['tonic', 'antidote'],
    desc: 'Pinches first. Asks questions never.',
  }),
  E('gull_harrier', 'Gull Harrier', 2, { type: 'bird', color: '#d8dce0', accent: '#8a9098', eye: '#e0a020' }, {
    stats: { hp: 0.8, spd: 1.3, def: 0.7 }, weak: ['pierce', 'wind'], poise: 2,
    skills: [['attack', 2], ['e_peck', 2]], drops: [['tonic', 0.1]], steal: ['tonic', 'eye_drops'],
    desc: 'Lanternfall\'s gulls have always been bold. These have gotten worse.',
  }),
  E('cave_bat', 'Tide Bat', 2, { type: 'bat', color: '#5a4a6a', eye: '#ff6040' }, {
    stats: { hp: 0.75, spd: 1.35, evade: 10 }, weak: ['pierce', 'light'], poise: 2,
    skills: [['attack', 3], ['e_bite', 2], ['e_drain', 1]], drops: [['eye_drops', 0.15]], steal: ['eye_drops', 'tonic'],
    desc: 'Nests where the tide caves never dry.',
  }),
  E('tide_eel', 'Tide Eel', 3, { type: 'serpent', color: '#3a7a6a', accent: '#a0e0c0', eye: '#f0f060', seed: 3 }, {
    stats: { hp: 1.1, mag: 1.2 }, weak: ['bolt', 'slash'], resist: { ice: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_spit', 2], ['e_constrict', 1]], drops: [['tonic', 0.2], ['sea_glass', 0.3]], steal: ['antidote', 'sea_charm'],
    desc: 'Slick, quick, and hungry.',
  }),
  E('drowned_hound', 'The Drowned Hound', 5, { type: 'hound', color: '#2a3a4a', accent: '#8a6aff', eye: '#b07aff', size: 2 }, {
    boss: true, stats: { hp: 9, str: 1.15, mag: 1.2, exp: 8, gold: 6, cp: 4 }, weak: ['slash', 'light', 'fire'], resist: { dark: 0.3, ice: 0.5 }, poise: 5,
    ai: 'drowned_hound', summons: ['gloam_pup'], drops: [['ember_feather', 1]], steal: ['tonic', 'hi_tonic'],
    desc: 'A dog that drowned long ago, remembered wrong by the Gloam. It is still looking for its master.',
  }),
  E('gloam_pup', 'Gloam Pup', 4, { type: 'hound', color: '#3a3050', accent: '#8a6aff', eye: '#b07aff' }, {
    stats: { hp: 0.8 }, weak: ['slash', 'light'], resist: { dark: 0.5 }, poise: 2,
    skills: [['e_bite', 3], ['e_howl', 1]], drops: [['gloam_dust', 0.3]], steal: ['tonic', 'gloam_dust'],
    desc: 'Born from the Drowned Hound\'s shadow.',
  }),
  E('brinefang', 'Brinefang', 7, { type: 'serpent', color: '#2a6a8a', accent: '#e0f0ff', eye: '#ffe060', size: 3, seed: 7 }, {
    boss: true, stats: { hp: 11, mag: 1.2, exp: 8, gold: 8, cp: 4 }, weak: ['bolt', 'pierce'], resist: { ice: 0, fire: 0.5 }, poise: 6,
    ai: 'brinefang', drops: [['hi_tonic', 1], ['sea_charm', 1]], steal: ['hi_tonic', 'sea_charm'],
    desc: 'Sailors\' stories said it guarded the strait. Sailors\' stories were right.',
  }),

  // ================================================================ ACT I — Gale Coast & Whisperwold
  E('wold_wolf', 'Wold Wolf', 6, { type: 'hound', color: '#6a6a72', accent: '#c8c8d0', eye: '#ffe060' }, {
    stats: { hp: 1.0, spd: 1.2 }, weak: ['fire', 'slash'], poise: 3,
    skills: [['e_bite', 3], ['e_howl', 1], ['attack', 1]], drops: [['wolf_pelt', 0.35], ['tonic', 0.15]], steal: ['tonic', 'wolf_pelt'],
    desc: 'Runs in threes. Always threes.',
  }),
  E('thornling', 'Thornling', 6, { type: 'plant', color: '#d06080', accent: '#f0e060', seed: 2 }, {
    stats: { hp: 1.1, mag: 1.2, spd: 0.8 }, weak: ['fire', 'slash'], resist: { ice: 0.5, blunt: 0.7 }, poise: 3,
    skills: [['e_sting', 2], ['e_spore', 1], ['attack', 1]], drops: [['antidote', 0.3]], steal: ['antidote', 'echo_herb'],
    desc: 'A flower that learned to bite.',
  }),
  E('sporecap', 'Sporecap', 7, { type: 'mushroom', color: '#b8603a', accent: '#f0e0c0' }, {
    stats: { hp: 1.2, def: 1.2, spd: 0.7 }, weak: ['fire', 'wind'], poise: 3,
    skills: [['attack', 2], ['e_spore', 2]], drops: [['echo_herb', 0.25]], steal: ['smelling_salts', 'echo_herb'],
    desc: 'Don\'t breathe near it. Don\'t breathe at all, ideally.',
  }),
  E('wold_beetle', 'Bark Beetle', 7, { type: 'insect', color: '#4a6a3a', accent: '#a0c060', seed: 4 }, {
    stats: { hp: 1.0, def: 1.8, res: 0.7 }, weak: ['fire', 'blunt'], resist: { slash: 0.5, pierce: 0.7 }, poise: 4,
    skills: [['attack', 3], ['e_shell', 1]], drops: [['tonic', 0.2]], steal: ['tonic', 'copper_ring'],
    desc: 'Its shell turns aside swords. Not hammers.',
  }),
  E('whisper_wisp', 'Whisper Wisp', 8, { type: 'wisp', color: '#a0d0ff', eye: '#ffffff' }, {
    stats: { hp: 0.7, mag: 1.3, def: 2, res: 0.6, evade: 10 }, weak: ['dark', 'wind'], resist: { slash: 0.5, pierce: 0.5, blunt: 0.5 }, poise: 2,
    skills: [['e_spark', 2], ['e_silence', 1], ['e_frost', 1]], drops: [['ether', 0.2]], steal: ['ether', 'ether'],
    desc: 'The Whisperwold speaks with the voices of the dead. Sometimes they come out to say hello.',
  }),
  E('bandit', 'Highway Bandit', 8, { type: 'humanoid', look: 'bandit', size: 1 }, {
    stats: { hp: 1.1 }, weak: ['blunt', 'bolt'], poise: 3,
    skills: [['attack', 3], ['e_steal', 1], ['e_slash', 1]], drops: [['tonic', 0.3], ['smoke_ball', 0.1]], steal: ['tonic', 'iron_dagger'],
    desc: 'Red Tam\'s crew. Mostly hungry, partly mean.',
  }),
  E('bandit_archer', 'Bandit Archer', 8, { type: 'humanoid', look: { id: 'bandit_archer', skin: '#d9a57c', hair: { style: 'ponytail', color: '#3a2a1a' }, outfit: { style: 'vest', main: '#4a5a3a', accent: '#8a3a2a', trim: '#3a2a1a', pants: '#3a3a30' }, acc: ['bandana'], weapon: 'bow' }, size: 1 }, {
    stats: { hp: 0.9, spd: 1.1 }, weak: ['slash', 'fire'], poise: 2,
    skills: [['e_arrow', 3], ['e_volley', 1]], drops: [['eye_drops', 0.2]], steal: ['eye_drops', 'hunters_bow'],
    desc: 'Good aim. Bad life choices.',
  }),
  E('red_tam', 'Red Tam', 11, { type: 'humanoid', look: 'red_tam', size: 2 }, {
    boss: true, stats: { hp: 10, str: 1.2, exp: 7, gold: 10, cp: 4 }, weak: ['pierce', 'ice'], poise: 6,
    ai: 'red_tam', drops: [['power_band', 1]], steal: ['hi_tonic', 'iron_axe'],
    desc: 'Highwayman. Claims he once beat a Dawnguard knight. The knight claims otherwise.',
  }),
  E('field_boar', 'Thistle Boar', 9, { type: 'boar', color: '#7a5a3a', accent: '#c8b090' }, {
    stats: { hp: 1.3, str: 1.15, spd: 0.85 }, weak: ['pierce', 'fire'], poise: 3,
    skills: [['e_tackle', 3], ['e_slam', 1]], drops: [['tonic', 0.3]], steal: ['tonic', 'vigor_seed'],
    desc: 'Eats the thistles. And the fences. And the farmers, if they let it.',
  }),
  E('scarecrow', 'Hollow Scarecrow', 10, { type: 'golem', color: '#c8a050', accent: '#ff8040', eye: '#ff8040', seed: 5 }, {
    stats: { hp: 1.2, mag: 1.1 }, weak: ['fire', 'slash'], resist: { pierce: 0.5, dark: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_ember', 1], ['e_wail', 1]], drops: [['burn_salve', 0.3]], steal: ['burn_salve', 'ether'],
    desc: 'Someone stuffed it with Gloam dust instead of straw.',
  }),
  E('murder_crow', 'Murder Crow', 9, { type: 'bird', color: '#2a2a34', accent: '#5a5a6a', eye: '#ff4040', seed: 9 }, {
    stats: { hp: 0.8, spd: 1.4 }, weak: ['pierce', 'light'], poise: 2,
    skills: [['e_peck', 3], ['e_blind', 1]], drops: [['eye_drops', 0.3]], steal: ['eye_drops', 'tonic'],
    desc: 'Count them. There are always more than you counted.',
  }),

  // ================================================================ ACT I — Aurenne Undercroft
  E('sewer_rat', 'Undercroft Rat', 12, { type: 'hound', color: '#6a6060', accent: '#c09090', eye: '#ff4040', seed: 12 }, {
    stats: { hp: 0.8, spd: 1.3 }, weak: ['fire', 'pierce'], poise: 2,
    skills: [['e_bite', 3], ['e_sting', 1]], drops: [['antidote', 0.3]], steal: ['antidote', 'tonic'],
    desc: 'The size of a dog. The manners of a rat.',
  }),
  E('bone_soldier', 'Bone Soldier', 13, { type: 'skeleton', color: '#e8e0cc', accent: '#9aa4b4', eye: '#ff5040' }, {
    stats: { hp: 1.2, def: 1.2 }, weak: ['blunt', 'light', 'fire'], resist: { pierce: 0.5, dark: 0, ice: 0.7 }, immune: ['poison', 'sleep'], poise: 3,
    skills: [['e_slash', 3], ['e_stun', 1]], drops: [['tonic', 0.2]], steal: ['hi_tonic', 'iron_sword'],
    desc: 'Aurenne buries its dead under its streets. The dead have noticed.',
  }),
  E('gloam_wraith', 'Gloam Wraith', 14, { type: 'ghost', color: '#6a5a9a', eye: '#ff80ff' }, {
    stats: { hp: 0.6, mag: 1.3, def: 1.3, res: 0.8, evade: 8 }, weak: ['light', 'fire', 'blunt'], resist: { slash: 0.6, pierce: 0.6, dark: 0 }, poise: 3,
    skills: [['e_dark', 2], ['e_drain', 1], ['e_sleep', 1]], drops: [['ether', 0.2], ['gloam_dust', 0.4]], steal: ['ether', 'gloam_dust'],
    desc: 'A memory of someone. It no longer remembers whom.',
  }),
  E('gloam_ooze', 'Gloam Ooze', 13, { type: 'slime', color: '#4a3a6a', eye: '#c080ff', seed: 13 }, {
    stats: { hp: 1.1, def: 0.6, res: 1.3 }, weak: ['fire', 'light', 'slash'], resist: { dark: -1, blunt: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_poison', 1], ['e_mpdrain', 1]], drops: [['gloam_dust', 0.5]], steal: ['gloam_dust', 'ether'],
    desc: 'What the Undercroft drains into.',
  }),
  E('cultist', 'Vesper Acolyte', 14, { type: 'humanoid', look: 'cultist', size: 1 }, {
    stats: { hp: 1.0, mag: 1.3 }, weak: ['slash', 'light'], resist: { dark: 0.5 }, poise: 3,
    skills: [['e_dark', 2], ['e_heal', 1], ['e_silence', 1]], drops: [['ether', 0.3]], steal: ['ether', 'bell_earring'],
    desc: 'Sister Mercy\'s faithful. They sing when they fight.',
  }),
  E('sister_mercy', 'Sister Mercy', 16, { type: 'humanoid', look: 'mercy', size: 2 }, {
    boss: true, stats: { hp: 10, mag: 1.2, res: 1.2, exp: 7, gold: 8, cp: 4 }, weak: ['slash', 'light'], resist: { dark: 0.3 }, poise: 7,
    ai: 'sister_mercy', summons: ['gloam_beast'], drops: [['bell_earring', 1]], steal: ['hi_ether', 'bell_earring'],
    desc: 'She believes she is saving them. That is what makes her dangerous.',
  }),
  E('gloam_beast', 'Gloam Beast', 15, { type: 'horror', color: '#3a2a5a', eye: '#ff60c0', size: 1.5, seed: 15 }, {
    stats: { hp: 1.6, str: 1.1 }, weak: ['light'], resist: { dark: 0 }, poise: 4,
    skills: [['e_claw', 2], ['e_darkwave', 1]], drops: [['gloam_dust', 0.6]], steal: ['gloam_dust', 'gloam_shard'],
    desc: 'It used to be a person. Mercy made it into this.',
  }),
];

export const ENEMIES = Object.fromEntries(LIST.map((e) => [e.id, e]));

export function registerEnemies(list) {
  for (const e of list) ENEMIES[e.id] = { poise: 2, skills: [['attack', 1]], drops: [], ...e };
}
