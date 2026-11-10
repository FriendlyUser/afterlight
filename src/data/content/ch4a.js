// Content pack: ch4a — Chapter 4 "The Pilgrim Road", first half.
// The Sunscar Desert (Saltglass, Keeper Tamsin, Corvin, Pip's Kindling) and the
// Greyspine Mountains (Frosthollow, Brother Halvard, Garrick's ambush).
// Hands off to ch4b at mirefen_road.

import { ITEMS } from '../items.js';
import { SKILLS } from '../skills.js';
import { DESERT_MAPS } from '../maps/ch4a_desert.js';
import { SALTGLASS_MAPS } from '../maps/ch4a_saltglass.js';
import { GREYSPINE_MAPS } from '../maps/ch4a_greyspine.js';

// ------------------------------------------------------------------ key items
ITEMS.c4a_singing_glass = { name: 'Singing Saltglass', kind: 'key', desc: 'Lift-glass from the Glass Caverns. It hums when you hold it to the sun — and when you hold it near the tuning forks.', icon: '✪' };
ITEMS.c4a_halvard_score = { name: 'Halvard\'s Score', kind: 'key', desc: 'The Dawnsong in Brother Halvard\'s cramped hand. One note is circled twice. Beside it: REFLECTION?', icon: '✪' };
ITEMS.c4a_stair_key = { name: 'Bell Stair Key', kind: 'key', desc: 'An iron key, warm from Halvard\'s hand.', icon: '✪' };

// ------------------------------------------------------------------ enemy skills
// Follow-ups to e_charge are written as their own heavy skills (the charge is the telegraph).
Object.assign(SKILLS, {
  c4a_sandblast: { name: 'Sand Blast', kind: 'phys', target: 'enemies', power: 65, elem: 'wind', status: [['blind', 0.25]], anim: 'wind' },
  c4a_glare: { name: 'Glare', kind: 'support', target: 'enemies', status: [['blind', 0.35]], anim: 'light' },
  c4a_siren: { name: 'Siren Song', kind: 'support', target: 'enemies', status: [['sleep', 0.3], ['charm', 0.1]], anim: 'song' },
  c4a_erupt: { name: 'Erupt', kind: 'phys', target: 'enemies', power: 145, elem: 'blunt', anim: 'quake' },
  c4a_glass_storm: { name: 'Glass Storm', kind: 'phys', target: 'enemies', power: 105, elem: 'pierce', status: [['blind', 0.2]], anim: 'wind' },
  c4a_queen_song: { name: 'Song of Breaking', kind: 'mag', target: 'enemies', power: 95, elem: 'wind', debuffs: { def: -1 }, anim: 'song' },
  c4a_avalanche: { name: 'Avalanche', kind: 'phys', target: 'enemies', power: 140, elem: 'ice', anim: 'quake' },
  c4a_iron_line: { name: 'Hold the Line', kind: 'support', target: 'allies', buffs: { def: 1, str: 1 }, anim: 'buff' },
  c4a_sweep: { name: 'Execution Sweep', kind: 'phys', target: 'enemies', power: 100, elem: 'slash', anim: 'slash' },
  c4a_verdict: { name: 'Thorne\'s Verdict', kind: 'phys', target: 'enemy', power: 330, elem: 'slash', delay: 1.2, anim: 'slash' },
  c4a_shieldwall: { name: 'Shield Wall', kind: 'support', target: 'self', selfBuffs: { def: 2, res: 1 }, anim: 'buff' },
});

// ------------------------------------------------------------------ looks
const SK = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };
const look = (id, o) => ({ id, ...o });
const desertFolk = (id, skin, hair, style, main, acc = ['scarf'], extra = {}) =>
  look(id, { skin, hair, outfit: { style, main, accent: '#efe2c4', trim: '#b5803a', pants: '#6a5038', boots: '#4a3020' }, acc, ...extra });
const monk = (id, skin, hair, main, acc = [], extra = {}) =>
  look(id, { skin, hair, outfit: { style: 'robe', main, accent: '#e8eef4', trim: '#9aa8c0' }, acc, ...extra });
const novice = (id, skin, hair, main) => monk(id, skin, hair, main, ['scarf'], { build: 'child' });

const LOOKS = {
  // Sunscar
  c4a_raider: look('c4a_raider', { skin: SK.tan, hair: { style: 'short', color: '#2a2018' }, outfit: { style: 'vest', main: '#b08a5a', accent: '#7a3a2a', trim: '#4a3020', pants: '#5a4a38', boots: '#3a2a1a' }, acc: ['scarf', 'bandana'], weapon: 'sword' }),
  c4a_raider_slinger: look('c4a_raider_slinger', { skin: SK.brown, hair: { style: 'ponytail', color: '#1a1410' }, outfit: { style: 'vest', main: '#8a6a40', accent: '#c8a060', trim: '#4a3020', pants: '#5a4a38' }, acc: ['scarf'], weapon: 'bow' }),
  c4a_sarn: look('c4a_sarn', { skin: SK.brown, hair: { style: 'spiky', color: '#1a1410' }, outfit: { style: 'coat', main: '#6a4a2a', accent: '#d8b878', trim: '#c9a24a', pants: '#3a2a1a' }, acc: ['scarf', 'beard'], weapon: 'axe', build: 'large' }),
  c4a_oyelaran: look('c4a_oyelaran', { skin: SK.deep, hair: { style: 'short', color: '#d8d4d0' }, outfit: { style: 'coat', main: '#2a5a7a', accent: '#e8d8b0', trim: '#c9a24a', pants: '#3a3a40' }, acc: ['hat_wide', 'beard'], build: 'tall' }),
  c4a_idris: look('c4a_idris', { skin: SK.brown, hair: { style: 'short', color: '#2a2018' }, outfit: { style: 'armor', main: '#a08a60', metal: '#c8b080', accent: '#3a6a8a', trim: '#c9a24a', pants: '#4a3a2a' }, acc: ['scarf', 'helmet'], weapon: 'spear' }),
  c4a_nim: desertFolk('c4a_nim', SK.brown, { style: 'braid', color: '#1a1410' }, 'dress', '#d87a3a', ['ribbon'], { build: 'child' }),
  c4a_asha: desertFolk('c4a_asha', SK.brown, { style: 'long', color: '#1a1410' }, 'dress', '#3a8a8a'),
  c4a_jorah: desertFolk('c4a_jorah', SK.brown, { style: 'messy', color: '#2a2018' }, 'rags', '#8a7a5a', ['scarf', 'beard']),
  c4a_ruel: desertFolk('c4a_ruel', SK.tan, { style: 'bald', color: '#3a2a1a' }, 'vest', '#5a4a4a', ['glasses', 'beard'], { build: 'large' }),
  c4a_ines: look('c4a_ines', { skin: SK.fair, hair: { style: 'long', color: '#2a1a2a' }, outfit: { style: 'coat', main: '#5a2a5a', accent: '#e8d0e0', trim: '#c9a24a', pants: '#2a2030' }, acc: ['hat_wide', 'ribbon'] }),
  c4a_ysmay: desertFolk('c4a_ysmay', SK.deep, { style: 'bun', color: '#d8d4d0' }, 'robe', '#5a7a9a', ['hood']),
  c4a_sef: desertFolk('c4a_sef', SK.tan, { style: 'long', color: '#e8e4dc' }, 'rags', '#a89870', ['beard']),
  c4a_marisol: look('c4a_marisol', { skin: SK.warm, hair: { style: 'bob', color: '#3a2a1a' }, outfit: { style: 'robe', main: '#e8d8b0', accent: '#c8a060', trim: '#8a4a2a' } }),
  c4a_faroukh: desertFolk('c4a_faroukh', SK.tan, { style: 'short', color: '#2a2018' }, 'vest', '#7a3a5a', ['hat_wide']),
  c4a_dima: desertFolk('c4a_dima', SK.deep, { style: 'short', color: '#d8d4d0' }, 'robe', '#3a6a8a', ['beard']),
  c4a_zeyneb: desertFolk('c4a_zeyneb', SK.brown, { style: 'bun', color: '#e8e4dc' }, 'dress', '#7a4a6a', ['hood']),
  c4a_teo: desertFolk('c4a_teo', SK.warm, { style: 'messy', color: '#5a3a2a' }, 'tunic', '#4a7a5a', ['headband']),
  c4a_hesper: desertFolk('c4a_hesper', SK.warm, { style: 'braid', color: '#5a3a2a' }, 'dress', '#6a6a8a', ['hat_wide']),
  c4a_yusra: desertFolk('c4a_yusra', SK.tan, { style: 'ponytail', color: '#2a1a10' }, 'dress', '#a84a3a', ['scarf']),
  c4a_pilgrim: desertFolk('c4a_pilgrim', SK.fair, { style: 'short', color: '#6a4a2a' }, 'robe', '#8a8070', ['hood']),
  c4a_kid_a: desertFolk('c4a_kid_a', SK.brown, { style: 'spiky', color: '#1a1410' }, 'tunic', '#c8a040', [], { build: 'child' }),
  c4a_kid_b: desertFolk('c4a_kid_b', SK.tan, { style: 'twintails', color: '#3a2010' }, 'dress', '#4a8ab0', [], { build: 'child' }),
  // Vespers
  c4a_arbalist: look('c4a_arbalist', { skin: SK.fair, hair: { style: 'short', color: '#4a3a2a' }, outfit: { style: 'armor', main: '#777', metal: '#7a8494', accent: '#2a2a40', trim: '#c0c0d0', pants: '#2a2a30' }, acc: ['helmet'], weapon: 'bow' }),
  c4a_vesper_guard: look('c4a_vesper_guard', { skin: SK.tan, hair: { style: 'short', color: '#2a2a2a' }, outfit: { style: 'armor', main: '#4a4a58', metal: '#5a6270', accent: '#2a2a40', trim: '#c0c0d0', pants: '#2a2a30' }, acc: ['helmet', 'cape'], capeColor: '#3a3a50', weapon: 'spear', shield: true }),
  // Greyspine
  c4a_tolle: monk('c4a_tolle', SK.fair, { style: 'messy', color: '#c0642e' }, '#6a7a9a', ['glasses']),
  c4a_agathe: monk('c4a_agathe', SK.pale, { style: 'bun', color: '#e8e4dc' }, '#e8e8f0', ['hood']),
  c4a_ansel: monk('c4a_ansel', SK.warm, { style: 'bald', color: '#8a6a4a' }, '#7a5a3a', ['beard'], { build: 'large' }),
  c4a_ivo: look('c4a_ivo', { skin: SK.tan, hair: { style: 'messy', color: '#6a4a2a' }, outfit: { style: 'coat', main: '#6a5a4a', accent: '#d8ccb0', trim: '#5a4a3a', pants: '#4a4a3a' }, acc: ['scarf', 'beard'] }),
  c4a_rhoswen: monk('c4a_rhoswen', SK.fair, { style: 'long', color: '#d8d4d0' }, '#4a5a7a', ['hood']),
  c4a_quill: monk('c4a_quill', SK.brown, { style: 'short', color: '#2a2a2a' }, '#5a6a8a', ['glasses']),
  c4a_wenna: monk('c4a_wenna', SK.warm, { style: 'ponytail', color: '#e3c25a' }, '#7a8ab0', ['scarf']),
  c4a_davit: look('c4a_davit', { skin: SK.fair, hair: { style: 'short', color: '#8a6a4a' }, outfit: { style: 'coat', main: '#3a5a4a', accent: '#d8ccb0', trim: '#5a4a3a', pants: '#3a3a3a' }, acc: ['hat_wide', 'scarf'] }),
  c4a_monk: monk('c4a_monk', SK.tan, { style: 'short', color: '#4a3a2a' }, '#5a6a8a'),
  c4a_ebba: novice('c4a_ebba', SK.fair, { style: 'braid', color: '#e3c25a' }, '#8a9ac0'),
  c4a_tomas: novice('c4a_tomas', SK.tan, { style: 'messy', color: '#3a2a1a' }, '#6a7a9a'),
  c4a_linnea: novice('c4a_linnea', SK.pale, { style: 'twintails', color: '#d8a060' }, '#9a8ab0'),
  c4a_lars: novice('c4a_lars', SK.pale, { style: 'short', color: '#d8a060' }, '#9a8ab0'),
  c4a_yrsa: novice('c4a_yrsa', SK.brown, { style: 'bob', color: '#1a1410' }, '#b0a0c0'),
  c4a_oskar: novice('c4a_oskar', SK.warm, { style: 'spiky', color: '#6a3a1a' }, '#5a6a8a'),
};

// ------------------------------------------------------------------ enemies
/**
 * An enemy definition (see EnemyDef); `opts` holds everything past the basics.
 * @param {string} id
 * @param {string} name
 * @param {number} level
 * @param {import('../../types/data').EnemyDef['sprite']} sprite
 * @param {Partial<import('../../types/data').EnemyDef>} [opts]
 * @returns {import('../../types/data').EnemyDef}
 */
const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, ...opts });

const ENEMIES = [
  // --- The Sunscar (Lv 16–20)
  E('c4a_dune_scorpion', 'Dune Scorpion', 17, { type: 'scorpion', color: '#c8a050', accent: '#7a4a20', eye: '#ff4040' }, {
    stats: { hp: 1.05, str: 1.1, def: 1.35, spd: 0.9 }, weak: ['ice', 'blunt'], resist: { fire: 0.5, slash: 0.8 }, poise: 3,
    skills: [['attack', 3], ['e_sting', 2], ['e_shell', 1]], drops: [['antidote', 0.3], ['saltglass', 0.15]], steal: ['antidote', 'hi_tonic'],
    desc: 'The color of the dunes at noon. You find out it is there when it finds out you are.',
  }),
  E('c4a_wyrmling', 'Wyrmling', 16, { type: 'serpent', color: '#d8b070', accent: '#fff0c8', eye: '#202020', seed: 21 }, {
    stats: { hp: 0.9, spd: 1.15 }, weak: ['ice', 'pierce'], resist: { fire: 0.5 }, poise: 2,
    skills: [['e_bite', 3], ['e_tackle', 1], ['c4a_sandblast', 1]], drops: [['tonic', 0.3]], steal: ['tonic', 'saltglass'],
    desc: 'A sand wyrm hatchling: the length of a man and all appetite. Its mother is never far.',
  }),
  E('c4a_sun_wisp', 'Sun Wisp', 17, { type: 'wisp', color: '#ffd070', eye: '#ffffff', seed: 17 }, {
    stats: { hp: 0.7, mag: 1.3, def: 2, res: 0.7, evade: 10 }, weak: ['ice', 'dark'], resist: { fire: -1, slash: 0.5, pierce: 0.5, light: 0.5 }, poise: 2,
    skills: [['e_ember', 3], ['c4a_glare', 1]], drops: [['ether', 0.2]], steal: ['ether', 'burn_salve'],
    desc: 'A shimmer of heat that decided to stay. Drinks fire. Fears the dark.',
  }),
  E('c4a_bone_vulture', 'Bone Vulture', 16, { type: 'bird', color: '#6a4a3a', accent: '#e8d8c0', eye: '#ff6040', seed: 16 }, {
    stats: { hp: 0.85, spd: 1.35 }, weak: ['pierce', 'wind'], poise: 2,
    skills: [['e_peck', 3], ['e_gust', 1]], drops: [['eye_drops', 0.2]], steal: ['eye_drops', 'tonic'],
    desc: 'It is patient. In the Sunscar, patience always eats.',
  }),
  E('c4a_raider', 'Dune Raider', 17, { type: 'humanoid', look: 'c4a_raider' }, {
    stats: { hp: 1.1 }, weak: ['blunt', 'ice'], poise: 3,
    skills: [['attack', 3], ['e_slash', 2], ['e_steal', 1]], drops: [['hi_tonic', 0.15], ['smoke_ball', 0.15]], steal: ['tonic', 'silversteel_kris'],
    desc: 'Takes your water first. Then your boots. Then, if you complain, you.',
  }),
  E('c4a_raider_slinger', 'Raider Slinger', 17, { type: 'humanoid', look: 'c4a_raider_slinger' }, {
    stats: { hp: 0.9, spd: 1.1 }, weak: ['slash', 'wind'], poise: 2,
    skills: [['e_arrow', 3], ['e_volley', 1], ['c4a_sandblast', 1]], drops: [['eye_drops', 0.25]], steal: ['eye_drops', 'sun_goggles'],
    desc: 'Throws sand, stones and insults, all with remarkable accuracy.',
  }),
  E('c4a_mirage', 'Mirage', 18, { type: 'ghost', color: '#a8d8f0', eye: '#ffffff', seed: 18 }, {
    stats: { hp: 0.8, mag: 1.2, def: 2.2, res: 0.8, evade: 15 }, weak: ['light', 'wind'], resist: { slash: 0.3, pierce: 0.3, blunt: 0.5, fire: 0.5 }, poise: 2,
    skills: [['e_dark', 2], ['c4a_glare', 1], ['e_sleep', 1], ['e_mpdrain', 1]], drops: [['ether', 0.25]], steal: ['ether', 'hi_ether'],
    desc: 'It wears the shape of what you want most. Up close it is only heat and hunger.',
  }),
  E('c4a_sandmaw', 'Sandmaw', 18, { type: 'serpent', color: '#c89a5a', accent: '#f8e8c0', eye: '#ff3020', size: 3, seed: 22 }, {
    boss: true, stats: { hp: 9, str: 1.15, exp: 7, gold: 7, cp: 4 }, weak: ['ice', 'pierce'], resist: { fire: 0.5, wind: 0.5 }, poise: 6,
    ai: 'c4a_sandmaw', summons: ['c4a_wyrmling'], drops: [['hi_tonic', 1], ['saltglass', 1]], steal: ['hi_tonic', 'vigor_seed'],
    desc: 'A sand wyrm in its prime: forty feet of hunger that swims the dunes like open sea.',
  }),
  E('c4a_jackal_sarn', 'Sarn the Jackal', 20, { type: 'humanoid', look: 'c4a_sarn', size: 2 }, {
    boss: true, stats: { hp: 8, str: 1.2, spd: 1.15, exp: 6, gold: 10, cp: 3 }, weak: ['blunt', 'ice'], poise: 6,
    ai: 'c4a_sarn', summons: ['c4a_raider'], drops: [['power_band', 1]], steal: ['hi_tonic', 'silversteel_axe'],
    desc: 'Raider-king of the southern dunes. Laughs like a jackal. Fights like three of them.',
  }),

  // --- The Glass Caverns (Lv 19–21)
  E('c4a_glass_scorpion', 'Glassback', 19, { type: 'scorpion', color: '#a8e0e8', accent: '#4a8a9a', eye: '#ff60a0', seed: 19 }, {
    stats: { hp: 1.1, str: 1.15, def: 1.6, res: 0.8 }, weak: ['blunt', 'bolt'], resist: { slash: 0.5, pierce: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_sting', 2], ['e_shell', 1]], drops: [['saltglass', 0.35], ['antidote', 0.2]], steal: ['saltglass', 'hi_tonic'],
    desc: 'Its shell is saltglass. It chimes when it walks, which is the only mercy it offers.',
  }),
  E('c4a_prism_bat', 'Prism Bat', 19, { type: 'bat', color: '#c8a8f0', eye: '#80ffff', seed: 19 }, {
    stats: { hp: 0.75, spd: 1.45, evade: 12 }, weak: ['pierce', 'bolt'], poise: 2,
    skills: [['e_bite', 2], ['e_drain', 2], ['c4a_glare', 1]], drops: [['eye_drops', 0.25]], steal: ['eye_drops', 'ether'],
    desc: 'Wings thin enough to throw rainbows. It throws them in your eyes.',
  }),
  E('c4a_glass_golem', 'Saltglass Golem', 20, { type: 'golem', color: '#d8f0f0', accent: '#80c8d8', eye: '#ffffff', seed: 20 }, {
    stats: { hp: 1.5, str: 1.2, def: 1.7, res: 0.7, spd: 0.75 }, weak: ['blunt', 'bolt'], resist: { slash: 0.5, pierce: 0.5, fire: 0.5 }, poise: 4,
    skills: [['e_slam', 2], ['attack', 2], ['e_shell', 1]], drops: [['saltglass', 0.6], ['guard_fruit', 0.03]], steal: ['saltglass', 'guard_fruit'],
    desc: 'The caverns grow them like geodes. Nobody knows what wakes them. Something does.',
  }),
  E('c4a_glass_crawler', 'Glass Crawler', 20, { type: 'spider', color: '#e0d8c0', accent: '#a0e0f0', eye: '#ff4060', seed: 20 }, {
    stats: { hp: 1.0, spd: 1.15 }, weak: ['fire', 'blunt'], resist: { pierce: 0.5 }, poise: 3,
    skills: [['e_bite', 2], ['e_poison', 1], ['e_sting', 1]], drops: [['antidote', 0.3]], steal: ['antidote', 'panacea'],
    desc: 'Spins its webs from molten sand. They set like glass, and so do you.',
  }),
  E('c4a_brood_wyrm', 'Brood Wyrm', 20, { type: 'serpent', color: '#e0c890', accent: '#a0e0f0', eye: '#202020', seed: 23 }, {
    stats: { hp: 1.0, str: 1.05, spd: 1.1 }, weak: ['ice', 'pierce'], resist: { fire: 0.5 }, poise: 3,
    skills: [['e_bite', 3], ['c4a_sandblast', 1], ['e_constrict', 1]], drops: [['hi_tonic', 0.2]], steal: ['hi_tonic', 'saltglass'],
    desc: 'The Queen\'s children. Half-grown and wholly furious.',
  }),
  E('c4a_wyrm_queen', 'The Sand Wyrm Queen', 21, { type: 'serpent', color: '#e8d8a8', accent: '#80e0f0', eye: '#ff2060', size: 4, seed: 24 }, {
    boss: true, stats: { hp: 8, str: 1.15, mag: 1.15, def: 1.2, exp: 9, gold: 9, cp: 4 }, weak: ['ice', 'blunt'], resist: { fire: 0.3, slash: 0.7, wind: 0.5 }, poise: 8,
    ai: 'c4a_wyrm_queen', summons: ['c4a_brood_wyrm'], drops: [['starglass_rod', 1], ['vigor_seed', 1]], steal: ['hi_ether', 'magic_fruit'],
    desc: 'She has eaten caravans whole. Her scales are saltglass; her song is the sound of the desert breaking.',
  }),

  // --- The Greyspine (Lv 21–24)
  E('c4a_frost_wolf', 'Frost Wolf', 21, { type: 'hound', color: '#d8e0e8', accent: '#8aa0b8', eye: '#60c0ff', seed: 21 }, {
    stats: { hp: 1.0, spd: 1.25 }, weak: ['fire', 'slash'], resist: { ice: 0.3 }, poise: 3,
    skills: [['e_bite', 3], ['e_howl', 1], ['e_frost', 1]], drops: [['wolf_pelt', 0.4], ['hi_tonic', 0.1]], steal: ['wolf_pelt', 'hi_tonic'],
    desc: 'Hunts in the white. Its coat is snow; its breath is the cold that comes after.',
  }),
  E('c4a_crag_harpy', 'Crag Harpy', 22, { type: 'bird', color: '#8a7a9a', accent: '#e8d0e0', eye: '#ffe040', size: 1.5, seed: 31 }, {
    stats: { hp: 0.95, mag: 1.15, spd: 1.3 }, weak: ['pierce', 'bolt'], resist: { wind: 0.3 }, poise: 3,
    skills: [['e_peck', 2], ['e_gust', 2], ['c4a_siren', 1]], drops: [['echo_herb', 0.3]], steal: ['echo_herb', 'hi_ether'],
    desc: 'They sing travelers to sleep in the snow. The snow does the rest.',
  }),
  E('c4a_rime_elemental', 'Rime Elemental', 22, { type: 'elemental', color: '#a8d8ff', accent: '#ffffff', eye: '#e0f8ff', seed: 22 }, {
    stats: { hp: 1.0, mag: 1.35, def: 1.4, res: 1.2 }, weak: ['fire', 'blunt'], resist: { ice: -1, pierce: 0.5 }, poise: 3,
    skills: [['e_frost', 3], ['e_icebreath', 1], ['e_shell', 1]], drops: [['ether', 0.3], ['frost_lily', 0.15]], steal: ['ether', 'frost_ring'],
    desc: 'A winter that learned to walk. It does not hate you. It only wishes you were still.',
  }),
  E('c4a_drift_ogre', 'Snowdrift Ogre', 23, { type: 'golem', color: '#eef2f8', accent: '#8a9ab0', eye: '#3060c0', size: 1.5, seed: 33 }, {
    stats: { hp: 1.6, str: 1.25, def: 1.1, spd: 0.75 }, weak: ['fire', 'pierce'], resist: { ice: 0.3 }, poise: 4,
    skills: [['e_slam', 2], ['e_crush', 1], ['attack', 2]], drops: [['hi_tonic', 0.3], ['power_fruit', 0.03]], steal: ['hi_tonic', 'power_fruit'],
    desc: 'Sleeps under the snow for months. Wakes up hungry and offended.',
  }),
  E('c4a_whitefang', 'Whitefang', 24, { type: 'hound', color: '#f4f8ff', accent: '#6a8ab0', eye: '#ff4040', size: 2, seed: 24 }, {
    boss: true, stats: { hp: 9, str: 1.2, spd: 1.25, exp: 7, gold: 6, cp: 4 }, weak: ['fire', 'slash'], resist: { ice: 0 }, poise: 6,
    ai: 'c4a_whitefang', summons: ['c4a_frost_wolf'], drops: [['feather_cape', 1]], steal: ['hi_tonic', 'swift_fruit'],
    desc: 'Old as the monastery, the monks say. Every squire who ever kept the Vigil has heard it howl.',
  }),
  E('c4a_frost_bat', 'Icicle Bat', 22, { type: 'bat', color: '#a8c8e8', eye: '#ffffff', seed: 27 }, {
    stats: { hp: 0.75, spd: 1.45, evade: 12 }, weak: ['fire', 'pierce'], resist: { ice: 0.3 }, poise: 2,
    skills: [['e_bite', 2], ['e_drain', 1], ['e_frost', 1]], drops: [['eye_drops', 0.2]], steal: ['ether', 'hi_tonic'],
    desc: 'Hangs from the ceiling like an icicle. Falls like one too, but with teeth.',
  }),

  // --- The Vespers (Lv 23–25)
  E('c4a_vesper_soldier', 'Vesper Soldier', 23, { type: 'humanoid', look: 'vesper_soldier' }, {
    stats: { hp: 1.2, str: 1.1, def: 1.2 }, weak: ['bolt', 'blunt'], poise: 3,
    skills: [['e_spear', 3], ['attack', 1], ['e_buff', 1]], drops: [['hi_tonic', 0.25]], steal: ['hi_tonic', 'silversteel_lance'],
    desc: 'Gray cloaks over Dawnguard steel. They used to guard the dawn. Now they guard something else.',
  }),
  E('c4a_vesper_arbalist', 'Vesper Arbalist', 23, { type: 'humanoid', look: 'c4a_arbalist' }, {
    stats: { hp: 0.95, spd: 1.1 }, weak: ['slash', 'bolt'], poise: 2,
    skills: [['e_arrow', 3], ['e_volley', 1]], drops: [['eye_drops', 0.2]], steal: ['ether', 'silversteel_bow'],
    desc: 'Crossbows wound with Choir prayers. The bolts still hurt.',
  }),
  E('c4a_vesper_cantor', 'Vesper Cantor', 23, { type: 'humanoid', look: 'cultist' }, {
    stats: { hp: 0.95, mag: 1.3 }, weak: ['slash', 'light'], resist: { dark: 0.5 }, poise: 2,
    skills: [['e_dark', 2], ['e_heal', 1], ['e_silence', 1], ['e_lament', 1]], drops: [['hi_ether', 0.15]], steal: ['ether', 'bell_earring'],
    desc: 'They hum the same few notes over and over. After a while, you catch yourself humming them too.',
  }),
  E('c4a_vesper_guard', 'Thorne\'s Guard', 24, { type: 'humanoid', look: 'c4a_vesper_guard' }, {
    stats: { hp: 1.4, str: 1.15, def: 1.4 }, weak: ['bolt', 'blunt'], poise: 4,
    skills: [['e_spear', 3], ['c4a_shieldwall', 1]], drops: [['hi_tonic', 0.4]], steal: ['hi_tonic', 'silversteel_shield'],
    desc: 'Garrick\'s chosen. They do not speak. They do not retreat.',
  }),
  E('c4a_garrick', 'Lord-Commander Garrick', 25, { type: 'humanoid', look: 'garrick', size: 2 }, {
    boss: true, stats: { hp: 13, str: 1.3, def: 1.3, res: 1.1, exp: 10, gold: 9, cp: 5 }, weak: ['bolt', 'pierce'], resist: { dark: 0.5, slash: 0.8 }, poise: 9,
    ai: 'c4a_garrick', summons: ['c4a_vesper_guard'], drops: [['starsteel_claymore', 1], ['guard_fruit', 1]], steal: ['hi_ether', 'starsteel_helm'],
    desc: 'Lord-Commander of the Dawnguard and the Hierophant\'s sword. Nobody has ever asked him to explain himself.',
  }),
];

// ------------------------------------------------------------------ troops
/**
 * @param {string[]} enemies
 * @param {Partial<import('../../types/data').TroopDef>} [opts]
 * @returns {import('../../types/data').TroopDef}
 */
const T = (enemies, opts = {}) => ({ enemies, ...opts });
const BOSS = { boss: true, music: 'boss', canFlee: false };
const TROOPS = {
  // Pilgrim Road & the Sunscar
  c4a_road_vultures: T(['c4a_bone_vulture', 'c4a_bone_vulture']),
  c4a_road_scorp: T(['c4a_dune_scorpion', 'c4a_wyrmling']),
  c4a_road_wyrmlings: T(['c4a_wyrmling', 'c4a_wyrmling']),
  c4a_road_raiders: T(['c4a_raider', 'c4a_raider_slinger']),
  c4a_dune_scorp2: T(['c4a_dune_scorpion', 'c4a_dune_scorpion']),
  c4a_dune_wisps: T(['c4a_sun_wisp', 'c4a_sun_wisp', 'c4a_bone_vulture']),
  c4a_dune_mix: T(['c4a_wyrmling', 'c4a_sun_wisp', 'c4a_dune_scorpion']),
  c4a_dune_raiders: T(['c4a_raider', 'c4a_raider', 'c4a_raider_slinger']),
  c4a_dune_wyrm3: T(['c4a_wyrmling', 'c4a_wyrmling', 'c4a_wyrmling']),
  c4a_dune_mirage: T(['c4a_mirage', 'c4a_sun_wisp']),
  c4a_dune_mirage2: T(['c4a_mirage', 'c4a_mirage']),
  boss_c4a_sandmaw: T(['c4a_sandmaw'], { ...BOSS, bg: 'desert' }),
  boss_c4a_sarn: T(['c4a_raider', 'c4a_jackal_sarn', 'c4a_raider_slinger'], { ...BOSS, bg: 'desert' }),
  // Glass Caverns
  c4a_gc_scorp: T(['c4a_glass_scorpion', 'c4a_glass_scorpion']),
  c4a_gc_bats: T(['c4a_prism_bat', 'c4a_prism_bat', 'c4a_prism_bat']),
  c4a_gc_golem: T(['c4a_glass_golem', 'c4a_prism_bat']),
  c4a_gc_crawl: T(['c4a_glass_crawler', 'c4a_glass_scorpion']),
  c4a_gc_brood: T(['c4a_brood_wyrm', 'c4a_brood_wyrm']),
  c4a_gc_mix: T(['c4a_glass_crawler', 'c4a_prism_bat', 'c4a_brood_wyrm']),
  boss_c4a_queen: T(['c4a_brood_wyrm', 'c4a_wyrm_queen'], { ...BOSS, bg: 'cave' }),
  // Greyspine Pass
  c4a_gp_wolves: T(['c4a_frost_wolf', 'c4a_frost_wolf', 'c4a_frost_wolf']),
  c4a_gp_wolf2: T(['c4a_frost_wolf', 'c4a_frost_wolf']),
  c4a_gp_harpy: T(['c4a_crag_harpy', 'c4a_crag_harpy']),
  c4a_gp_rime: T(['c4a_rime_elemental', 'c4a_frost_wolf']),
  c4a_gp_ogre: T(['c4a_drift_ogre']),
  c4a_gp_mix: T(['c4a_crag_harpy', 'c4a_rime_elemental', 'c4a_frost_wolf']),
  c4a_gp_avalanche: T(['c4a_drift_ogre', 'c4a_rime_elemental'], { bg: 'snow' }),
  boss_c4a_whitefang: T(['c4a_frost_wolf', 'c4a_whitefang'], { ...BOSS, bg: 'snow' }),
  // The Bell Stair & the Vespers
  c4a_fc_bats: T(['c4a_frost_bat', 'c4a_frost_bat', 'c4a_frost_bat']),
  c4a_fc_rime: T(['c4a_rime_elemental', 'c4a_frost_bat']),
  c4a_fc_squad: T(['c4a_vesper_soldier', 'c4a_vesper_arbalist']),
  c4a_fc_cantor: T(['c4a_vesper_soldier', 'c4a_vesper_cantor', 'c4a_vesper_soldier']),
  c4a_fh_gate: T(['c4a_vesper_soldier', 'c4a_vesper_soldier'], { music: 'battle', canFlee: false, bg: 'snow' }),
  c4a_fc_ambush: T(['c4a_vesper_arbalist', 'c4a_vesper_soldier', 'c4a_vesper_cantor'], { music: 'battle', canFlee: false, bg: 'cave' }),
  boss_c4a_garrick: T(['c4a_vesper_guard', 'c4a_garrick', 'c4a_vesper_guard'], { ...BOSS, bg: 'snow', mood: 'night' }),
};

// ------------------------------------------------------------------ boss AI
const bossAI = {
  /** Sandmaw: dives every fourth turn and erupts the next; calls a wyrmling at half HP. */
  c4a_sandmaw(c) {
    if (c.m.dived) { c.m.dived = false; c.say('The sand ERUPTS beneath your feet!'); return c.use('c4a_erupt'); }
    if (c.hpPct < 0.5 && c.once('brood')) { c.say('Sandmaw shrieks. Something small and hungry answers from under the dunes!'); return c.use('e_summon'); }
    if (c.turn % 4 === 3) { c.m.dived = true; c.say('Sandmaw dives beneath the sand... the dune begins to tremble.'); return c.use('e_charge'); }
    return c.pick([['e_bite', 3], ['c4a_sandblast', 2], ['e_constrict', c.hpPct < 0.5 ? 2 : 1]]);
  },

  /** Sarn: sand in the eyes every third turn, calls his lads when hurt. */
  c4a_sarn(c) {
    if (c.hpPct < 0.5 && c.once('lads')) { c.say('"Ha! Lads — fresh meat, fresh water! GET IN HERE!"'); return c.use('e_summon'); }
    if (c.turn % 3 === 0) { c.say('Sarn kicks up a wall of sand!'); return c.use('c4a_sandblast'); }
    return c.pick([['e_slash', 3], ['e_steal', 1], ['e_rampage', c.hpPct < 0.5 ? 2 : 0.5], ['attack', 1]]);
  },

  /**
   * The Sand Wyrm Queen — three phases.
   * I: bites and the Song of Breaking (DEF down). II (<60%): burrows (telegraphed) and erupts.
   * III (<30%): the walls shatter — Glass Storm joins her rotation. Calls brood whenever she is alone.
   */
  c4a_wyrm_queen(c) {
    if (c.m.burrowed) { c.m.burrowed = false; c.say('The Queen bursts up through the glass floor!'); return c.use('c4a_erupt'); }
    if (c.hpPct < 0.3 && c.once('storm')) { c.say('The Queen SHRIEKS. The cavern walls crack — and the glass comes down like rain!'); return c.use('c4a_glass_storm'); }
    const brood = c.allies.filter((a) => a.def.id === 'c4a_brood_wyrm').length;
    if (!brood && c.turn > 2 && c.once(`brood${Math.floor(c.turn / 5)}`)) { c.say('The Queen calls, and the walls answer with small hungry voices.'); return c.use('e_summon'); }
    if (c.hpPct < 0.6 && c.turn % 4 === 0) { c.m.burrowed = true; c.say('The Queen sinks into the sand. The glass floor starts to hum...'); return c.use('e_charge'); }
    if (c.turn % 5 === 2) { c.say('The Queen sings. Your armor sings back — and cracks.'); return c.use('c4a_queen_song'); }
    return c.pick([['e_bite', 3], ['c4a_sandblast', 2], ['e_constrict', 1], ['c4a_glass_storm', c.hpPct < 0.3 ? 2 : 0]]);
  },

  /** Whitefang: howls (telegraph), then the mountain answers with an avalanche. */
  c4a_whitefang(c) {
    if (c.m.howled) { c.m.howled = false; c.say('The mountain answers Whitefang\'s howl!'); return c.use('c4a_avalanche'); }
    if (c.hpPct < 0.5 && c.once('pack')) { c.say('Somewhere above, the pack answers.'); return c.use('e_summon'); }
    if (c.turn % 4 === 2) { c.m.howled = true; c.say('Whitefang throws back its head and HOWLS. Snow shivers on the slopes above...'); return c.use('e_charge'); }
    return c.pick([['e_bite', 3], ['e_claw', 2], ['e_frost', 1], ['e_howl', 1]]);
  },

  /**
   * Lord-Commander Garrick Thorne.
   * I: commands — Hold the Line on his first turn and every fifth, Execution Sweep, singles out Bram.
   * II (<60%): "Enough." Calls a fresh guard once, then every third turn raises his blade (telegraph)
   *    and brings down Thorne's Verdict on whoever he marked — Bram if he can.
   * III (<25%): Iron discipline — braces once, then fights like a man with nothing left to prove.
   */
  c4a_garrick(c) {
    const bram = c.partyAlive.find((p) => p.id === 'bram');
    if (c.m.verdict) {
      c.m.verdict = false;
      const mark = c.m.mark && c.m.mark.alive ? c.m.mark : null;
      c.say(mark && mark.id === 'bram' ? '"Kneel, Kestrel."' : '"Judgement."');
      return c.use('c4a_verdict', mark ? [mark] : undefined);
    }
    if (c.turn === 1) { c.say('"Form up. Shields high. This will not take long."'); return c.use('c4a_iron_line'); }
    if (c.hpPct < 0.25 && c.once('iron')) { c.say('Garrick wipes blood from his mouth and laughs. "Good. GOOD. Again."'); return c.use('c4a_shieldwall'); }
    if (c.hpPct < 0.6) {
      if (c.once('phase2')) { c.say('"Enough." Garrick plants his greatsword in the snow. "Guard! To me!"'); return c.use('e_summon'); }
      if (c.turn % 3 === 0) {
        c.m.verdict = true;
        c.m.mark = bram || c.partyAlive[Math.floor(c.rnd() * c.partyAlive.length)];
        c.say(`Garrick raises his greatsword high and fixes his eyes on ${c.m.mark.name}...`);
        return c.use('e_charge');
      }
      return c.pick([['c4a_sweep', 2], ['e_cleave', 1], ['attack', 2], ['e_rampage', c.hpPct < 0.25 ? 2 : 0.5]]);
    }
    if (c.turn % 5 === 0) return c.use('c4a_iron_line');
    if (bram && c.rnd() < 0.35) {
      if (c.once('taunt')) c.say('"Still shaking, Kestrel? Aldous would be so proud."');
      return c.use('e_slash', [bram]);
    }
    return c.pick([['c4a_sweep', 2], ['attack', 3], ['e_stun', 1]]);
  },
};

// ------------------------------------------------------------------ world map
/** @type {import('../../types/data').WorldNode[]} */
const worldNodes = [
  { id: 'saltglass', name: 'Saltglass', region: 'Sunscar Desert', act: 1, x: 600, y: 640, mapId: 'c4a_saltglass', tx: 3, ty: 20, dir: 'right',
    unlock: 'c4a_saltglass_arrived', desc: 'A town of glass and wind around the blind Keeper\'s Lantern. The caravans gather here.' },
  { id: 'frosthollow', name: 'Frosthollow', region: 'Greyspine Mountains', act: 1, x: 560, y: 180, mapId: 'c4a_frosthollow', tx: 21, ty: 33, dir: 'up',
    unlock: 'c4a_frosthollow_arrived', desc: 'The snow monastery, where the oldest Dawnsong is carved in ice.' },
];

/** @type {import('../../types/data').ContentPack} */
export default {
  maps: [...DESERT_MAPS, ...SALTGLASS_MAPS, ...GREYSPINE_MAPS],
  enemies: ENEMIES,
  troops: TROOPS,
  looks: LOOKS,
  bossAI,
  shops: {
    c4a_waystation: { name: 'Ysmay\'s Water & Sundries', items: ['tonic', 'hi_tonic', 'ether', 'antidote', 'eye_drops', 'burn_salve', 'ember_feather', 'smoke_ball', 'sun_goggles'] },
  },
  worldNodes,
};
