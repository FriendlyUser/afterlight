// Content pack: ch4b — Chapter 4 "The Pilgrim Road", second half.
// Mirefen (the fens), Verdance (Thornwood) and the Stormcrown (Skyreach).
// Enemy Lv 23–33, gear tier 5. Story scripts live in src/story/ch4b*.js.

import { ITEMS } from '../items.js';
import { EQUIPMENT, gearOfTier } from '../equipment.js';
import { SKILLS } from '../skills.js';
import { MIREFEN_MAPS } from '../maps/ch4b_mirefen.js';
import { VERDANCE_MAPS } from '../maps/ch4b_verdance.js';
import { STORMCROWN_MAPS } from '../maps/ch4b_stormcrown.js';

// ------------------------------------------------------------------ key items & unique gear
Object.assign(ITEMS, {
  c4b_lanternmoss: { name: 'Lanternmoss', kind: 'key', desc: 'Moss that grew where a shrine-lamp burned for two hundred years. Still faintly warm. Glows when crushed.', icon: '✪' },
  c4b_weepcap: { name: 'Weepcap Lily', kind: 'key', desc: 'A white bog-lily that has never seen the sun. It weeps a clear sap that smells of rain.', icon: '✪' },
  c4b_rot_gall: { name: 'Rot-Gall', kind: 'key', desc: 'The black heart of Mawmire. The sickness, made solid. Ilse handles it with tongs.', icon: '✪' },
  c4b_pell_ring: { name: 'Tarnished Ring', kind: 'key', desc: 'A plain copper wedding ring, found in the Drowned Chapel. Engraved: _T. — always the long way home._', icon: '✪' },
  c4b_clover_crown: { name: 'Clover Crown', kind: 'key', desc: 'A crown of clover, pressed flat and brown forty years ago. Lysa Lorne made it for Elowen. Sable keeps it now.', icon: '✪' },
  c4b_storm_core: { name: 'Storm Core', kind: 'key', desc: 'A fist of saltglass that has swallowed a lightning strike. It buzzes against your teeth.', icon: '✪' },
  c4b_aram_log: { name: 'Aram\'s Logbook', kind: 'key', desc: 'A sky-pilot\'s waterlogged logbook, found in the Undercradle. The last page is addressed to someone called Kesi.', icon: '✪' },
});

const accessory = (id, def) => { EQUIPMENT[id] = { id, slot: 'accessory', tier: 0, price: 0, ...def }; };
accessory('c4b_mire_charm', { name: 'Osk\'s Reed Knot', immune: ['poison', 'blind'], res: 4, desc: 'Immune to Poison and Blind. RES +4. Mirefen reed and silver wire; smells of peat smoke.' });
accessory('c4b_pilot_goggles', { name: 'Pilot\'s Goggles', immune: ['blind'], spd: 4, mods: { evade: 4 }, desc: 'Immune to Blind. SPD +4, evasion +4%. Aram\'s spare pair; the strap still smells of wind.' });

// ------------------------------------------------------------------ boss skills
Object.assign(SKILLS, {
  c4b_black_bile: { name: 'Black Bile', kind: 'mag', target: 'enemies', power: 120, elem: 'dark', status: [['poison', 0.5]], anim: 'dark', desc: 'A flood of rot-water.' },
  c4b_engulf: { name: 'Engulf', kind: 'phys', target: 'enemy', power: 170, elem: 'blunt', status: [['stun', 0.4]], anim: 'bite' },
  c4b_rootquake: { name: 'Root Quake', kind: 'phys', target: 'enemies', power: 105, elem: 'blunt', anim: 'quake' },
  c4b_thornstorm: { name: 'Thornstorm', kind: 'phys', target: 'enemies', power: 135, elem: 'pierce', status: [['poison', 0.3]], anim: 'claw' },
  c4b_deep_drink: { name: 'Deep Drink', kind: 'heal', target: 'self', power: 260, anim: 'heal' },
  c4b_lance_charge: { name: 'Lance of the Dawn', kind: 'phys', target: 'enemy', power: 190, elem: 'pierce', anim: 'thrust' },
  c4b_stormfall: { name: 'Stormfall', kind: 'mag', target: 'enemies', power: 125, elem: 'bolt', status: [['stun', 0.25]], anim: 'bolt' },
  c4b_downdraft: { name: 'Downdraft', kind: 'mag', target: 'enemy', power: 150, elem: 'wind', anim: 'wind' },
  c4b_eye_open: { name: 'The Eye Opens', kind: 'support', target: 'self', selfBuffs: { mag: 2, spd: 1 }, anim: 'buff' },
});

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
  // ---------------------------------------------------------- Mirefen road & the Drownmere (23–28)
  E('c4b_bog_leech', 'Bog Leech', 23, { type: 'serpent', color: '#4a5a3a', accent: '#a04a4a', eye: '#ffd040', seed: 23 }, {
    stats: { hp: 1.0 }, weak: ['fire', 'slash'], resist: { ice: 0.5 }, poise: 3,
    skills: [['e_bite', 2], ['e_drain', 2], ['e_constrict', 1]], drops: [['hi_tonic', 0.15], ['mire_pearl', 0.1]], steal: ['antidote', 'hi_tonic'],
    desc: 'Fat with other people\'s blood. Thin with its own patience.',
  }),
  E('c4b_rot_toad', 'Rot Toad', 24, { type: 'slime', color: '#6a7a3a', eye: '#ff8030', seed: 24 }, {
    stats: { hp: 1.2, def: 1.1, spd: 0.9 }, weak: ['pierce', 'ice'], resist: { dark: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_spit', 1], ['e_poison', 1]], drops: [['antidote', 0.3], ['panacea', 0.05]], steal: ['antidote', 'mire_pearl'],
    desc: 'Mirefen children used to race the toads. Nobody races these.',
  }),
  E('c4b_mire_wisp', 'Will-o\'-Mire', 24, { type: 'wisp', color: '#c8ff8a', eye: '#ffffff', seed: 2 }, {
    stats: { hp: 0.7, mag: 1.3, def: 2, res: 0.7, evade: 10 }, weak: ['wind', 'light'], resist: { slash: 0.5, pierce: 0.5, blunt: 0.5 }, poise: 2,
    skills: [['e_ember', 2], ['e_blind', 1], ['e_sleep', 1]], drops: [['ether', 0.2], ['hi_ether', 0.05]], steal: ['ether', 'hi_ether'],
    desc: 'Swamp-light. Follow it and you will find exactly what it wants you to find.',
  }),
  E('c4b_marsh_crawler', 'Marsh Crawler', 25, { type: 'crab', color: '#5a6a5a', accent: '#c8b878', eye: '#202020', seed: 25 }, {
    stats: { hp: 1.1, def: 1.7, res: 0.8, spd: 0.85 }, weak: ['blunt', 'bolt'], resist: { slash: 0.5, pierce: 0.7 }, poise: 4,
    skills: [['attack', 3], ['e_shell', 1], ['e_constrict', 1]], drops: [['hi_tonic', 0.2], ['mire_pearl', 0.2]], steal: ['hi_tonic', 'guard_fruit'],
    desc: 'Mud on the outside. Mud on the inside. A shell like a church door in between.',
  }),
  E('c4b_rotcap', 'Rotcap', 25, { type: 'mushroom', color: '#7a5a8a', accent: '#c8e070' }, {
    stats: { hp: 1.2, mag: 1.1, spd: 0.7 }, weak: ['fire', 'wind'], poise: 3,
    skills: [['attack', 1], ['e_spore', 2], ['e_poison', 1]], drops: [['echo_herb', 0.2], ['panacea', 0.08]], steal: ['smelling_salts', 'panacea'],
    desc: 'The Gloam-rot, grown a body. Its spores are the sickness in the village.',
  }),
  E('c4b_drowned', 'The Drowned', 26, { type: 'skeleton', color: '#8aa098', accent: '#3a5a5a', eye: '#80ffc0', seed: 26 }, {
    stats: { hp: 1.2, def: 1.1 }, weak: ['light', 'blunt', 'fire'], resist: { pierce: 0.5, ice: 0.5, dark: 0 }, immune: ['poison', 'sleep'], poise: 3,
    skills: [['e_slash', 2], ['e_constrict', 1], ['e_drain', 1]], drops: [['hi_tonic', 0.2]], steal: ['hi_tonic', 'ember_feather'],
    desc: 'Mirefen buries its dead in the water. Since the light went out, the water has been giving them back.',
  }),
  E('c4b_bog_lurker', 'Bog Lurker', 27, { type: 'serpent', color: '#3a4a2a', accent: '#8a9a5a', eye: '#ff4040', size: 1.5, seed: 27 }, {
    stats: { hp: 1.5, str: 1.15 }, weak: ['bolt', 'slash'], resist: { ice: 0.5 }, poise: 4,
    skills: [['e_bite', 2], ['e_constrict', 2], ['e_tidal', 0.5]], drops: [['hi_tonic', 0.3], ['mire_pearl', 0.3]], steal: ['hi_tonic', 'vigor_seed'],
    desc: 'The ferrymen call it "the log that moves." They do not call it anything to its face.',
  }),
  E('c4b_rot_polyp', 'Rot Polyp', 26, { type: 'slime', color: '#5a3a5a', eye: '#d0ff60', seed: 31 }, {
    stats: { hp: 0.8 }, weak: ['fire', 'light'], resist: { dark: 0.5 }, poise: 2,
    skills: [['e_poison', 1], ['e_drain', 1], ['attack', 1]], drops: [['gloam_dust', 0.4]], steal: ['antidote', 'gloam_dust'],
    desc: 'A bud of Mawmire. It wants to grow up to be just like its mother.',
  }),
  E('c4b_mawmire', 'Mawmire', 28, { type: 'horror', color: '#3a4a2a', eye: '#d0ff60', size: 3, seed: 28 }, {
    boss: true, stats: { hp: 12, str: 1.1, mag: 1.2, exp: 8, gold: 8, cp: 4 }, weak: ['fire', 'light'], resist: { dark: 0.3, ice: 0.5 }, immune: ['poison'], poise: 7,
    ai: 'c4b_mawmire', summons: ['c4b_rot_polyp'], drops: [['dusk_ring', 1]], steal: ['hi_tonic', 'mire_pearl'],
    desc: 'Where the Lantern\'s light used to touch the water, something grew in the dark to fill the space. It is mostly mouth.',
  }),
  E('c4b_dg_trooper', 'Dawnguard Trooper', 24, { type: 'humanoid', look: 'dawnguard', size: 1 }, {
    stats: { hp: 1.2, def: 1.2 }, weak: ['bolt', 'blunt'], poise: 3,
    skills: [['e_spear', 2], ['e_stun', 1], ['e_buff', 0.5]], drops: [['hi_tonic', 0.3]], steal: ['hi_tonic', 'starsteel_partisan'],
    desc: 'The Dawnguard swore to guard the light. These ones are guarding the Lord-Commander\'s temper.',
  }),
  E('c4b_dg_crossbow', 'Dawnguard Crossbow', 24, { type: 'humanoid', look: 'c4b_dg_crossbow', size: 1 }, {
    stats: { hp: 1.0, spd: 1.1 }, weak: ['slash', 'bolt'], poise: 2,
    skills: [['e_arrow', 2], ['e_volley', 1]], drops: [['eye_drops', 0.3]], steal: ['eye_drops', 'starsteel_recurve'],
    desc: 'Trained to hit a sparrow at sixty paces. Has never once been asked why.',
  }),

  // ---------------------------------------------------------- Verdance & the Thornwood (27–31)
  E('c4b_briarling', 'Briarling', 27, { type: 'plant', color: '#3a6a3a', accent: '#c03a5a', seed: 6 }, {
    stats: { hp: 1.0, mag: 1.1 }, weak: ['fire', 'slash'], resist: { ice: 0.5, blunt: 0.7 }, poise: 3,
    skills: [['e_sting', 2], ['e_spore', 1], ['e_drain', 1]], drops: [['antidote', 0.3], ['echo_herb', 0.2]], steal: ['echo_herb', 'magic_fruit'],
    desc: 'The Thornwood\'s youngest guardians. They have forgotten what they were guarding.',
  }),
  E('c4b_mossback', 'Mossback Boar', 28, { type: 'boar', color: '#4a5a3a', accent: '#8ab84a' }, {
    stats: { hp: 1.4, str: 1.15, spd: 0.85 }, weak: ['pierce', 'fire'], poise: 4,
    skills: [['e_tackle', 2], ['e_slam', 1]], drops: [['hi_tonic', 0.3]], steal: ['hi_tonic', 'vigor_seed'],
    desc: 'So old that moss grows on it. So angry that nothing else does.',
  }),
  E('c4b_lost_light', 'Lost Lantern', 28, { type: 'wisp', color: '#ffe0a0', eye: '#ffffff', seed: 8 }, {
    stats: { hp: 0.8, mag: 1.25, def: 2, res: 1.2, evade: 8 }, weak: ['dark', 'wind'], resist: { light: 0, slash: 0.5, pierce: 0.5 }, poise: 2,
    skills: [['e_holy', 1], ['e_spark', 2], ['e_heal', 1]], drops: [['ether', 0.3], ['hi_ether', 0.1]], steal: ['ether', 'hi_ether'],
    desc: 'A spark of the Thornwood\'s Lantern, left behind when its stone was taken. It is looking for the way home.',
  }),
  E('c4b_bark_mantis', 'Bark Mantis', 29, { type: 'insect', color: '#6a5a3a', accent: '#a8c060', seed: 29 }, {
    stats: { hp: 1.0, str: 1.25, spd: 1.2 }, weak: ['fire', 'blunt'], resist: { slash: 0.5 }, poise: 3,
    skills: [['e_slash', 2], ['e_sweep', 1], ['e_claw', 1]], drops: [['hi_tonic', 0.2]], steal: ['hi_tonic', 'hunters_eye'],
    desc: 'It prays. You do not want to know to what.',
  }),
  E('c4b_gloam_moth', 'Gloam Moth', 28, { type: 'bat', color: '#5a4a7a', accent: '#c8a0ff', eye: '#ffe060', seed: 28 }, {
    stats: { hp: 0.8, mag: 1.1, spd: 1.4, evade: 12 }, weak: ['wind', 'pierce', 'light'], resist: { dark: 0.5 }, poise: 2,
    skills: [['e_dark', 2], ['e_sleep', 1], ['e_blind', 1]], drops: [['eye_drops', 0.3], ['gloam_dust', 0.3]], steal: ['eye_drops', 'gloam_dust'],
    desc: 'Drawn to light. There is none left in the Thornwood, so it has started making do with you.',
  }),
  E('c4b_thornweaver', 'Thornweaver', 29, { type: 'spider', color: '#3a3a2a', accent: '#a03a3a', seed: 9 }, {
    stats: { hp: 1.1, str: 1.1 }, weak: ['fire', 'light'], poise: 3,
    skills: [['e_bite', 2], ['e_poison', 1], ['e_stun', 1]], drops: [['antidote', 0.3], ['panacea', 0.1]], steal: ['antidote', 'panacea'],
    desc: 'Weaves its webs from thorns. Silk has never occurred to it.',
  }),
  E('c4b_rootlurker', 'Rootlurker', 30, { type: 'treant', color: '#4a3a2a', accent: '#6a8a3a', eye: '#ffb040', size: 1.5, seed: 30 }, {
    stats: { hp: 1.6, str: 1.15, def: 1.3, spd: 0.75 }, weak: ['fire', 'slash'], resist: { blunt: 0.5, ice: 0.5 }, poise: 4,
    skills: [['e_slam', 2], ['e_constrict', 1], ['e_quake', 0.5]], drops: [['hi_tonic', 0.3]], steal: ['hi_tonic', 'guard_fruit'],
    desc: 'A root that got tired of being underneath things.',
  }),
  E('c4b_hollowbark', 'Hollowbark', 31, { type: 'treant', color: '#5a4a30', accent: '#7ab84a', eye: '#ffd040', size: 3, seed: 31 }, {
    boss: true, stats: { hp: 13, str: 1.2, def: 1.2, exp: 8, gold: 8, cp: 4 }, weak: ['fire', 'slash'], resist: { blunt: 0.5, ice: 0.7 }, poise: 8,
    ai: 'c4b_hollowbark', summons: ['c4b_briarling'], drops: [['power_fruit', 1]], steal: ['hi_ether', 'guard_fruit'],
    desc: 'Warden of the Thornwood for six hundred years. Its Keeper\'s light went out, and it has been fighting the dark ever since — and everything else that moves.',
  }),

  // ---------------------------------------------------------- The Stormcrown & the Undercradle (30–33)
  E('c4b_stormcell', 'Storm Cell', 30, { type: 'storm', color: '#6a8ab0', accent: '#f0f080', eye: '#ffffff', seed: 30 }, {
    stats: { hp: 0.9, mag: 1.3, def: 1.6, res: 0.8 }, weak: ['ice', 'blunt'], resist: { bolt: -1, wind: 0.5 }, poise: 3,
    skills: [['e_spark', 2], ['e_thunder', 1], ['e_selfdestruct', 0.3]], drops: [['ether', 0.3]], steal: ['ether', 'bolt_bomb'],
    desc: 'A thundercloud the size of a dog, and about as loyal.',
  }),
  E('c4b_gale_harpy', 'Gale Harpy', 31, { type: 'bird', color: '#8a9ab8', accent: '#e0e0f0', eye: '#ffd040', size: 1.5, seed: 31 }, {
    stats: { hp: 1.0, spd: 1.35 }, weak: ['pierce', 'bolt'], resist: { wind: 0.3 }, poise: 3,
    skills: [['e_peck', 2], ['e_gust', 2], ['e_blind', 0.5]], drops: [['hi_tonic', 0.2]], steal: ['hi_tonic', 'swift_fruit'],
    desc: 'Rides the Stormcrown\'s updrafts and screams at airships out of professional habit.',
  }),
  E('c4b_crag_golem', 'Crag Golem', 31, { type: 'golem', color: '#6a6a78', accent: '#a0c0ff', eye: '#a0e0ff', seed: 7 }, {
    stats: { hp: 1.6, def: 1.6, res: 0.7, spd: 0.7 }, weak: ['blunt', 'ice'], resist: { slash: 0.5, pierce: 0.5, fire: 0.5 }, poise: 5,
    skills: [['e_slam', 2], ['e_quake', 1], ['e_shell', 1]], drops: [['hi_tonic', 0.3]], steal: ['hi_tonic', 'guard_fruit'],
    desc: 'Lightning hit this rock so many times it got up to complain.',
  }),
  E('c4b_cloud_eel', 'Cloud Eel', 31, { type: 'serpent', color: '#b8c8e0', accent: '#f0f0ff', eye: '#4080ff', seed: 32 }, {
    stats: { hp: 1.2, mag: 1.2, spd: 1.1 }, weak: ['fire', 'pierce'], resist: { wind: 0.5, ice: 0.5 }, poise: 3,
    skills: [['e_constrict', 2], ['e_spark', 1], ['e_gust', 1]], drops: [['ether', 0.25]], steal: ['ether', 'hi_ether'],
    desc: 'It swims through cloud the way fish swim through water, and it is just as surprised to see you.',
  }),
  E('c4b_storm_drake', 'Storm Drake', 32, { type: 'drake', color: '#3a4a6a', accent: '#f0e060', eye: '#ffffff', size: 1.5, seed: 33 }, {
    stats: { hp: 1.5, str: 1.15, mag: 1.15 }, weak: ['ice', 'pierce'], resist: { bolt: 0, wind: 0.5 }, poise: 4,
    skills: [['e_bite', 2], ['e_thunder', 1], ['e_claw', 1]], drops: [['hi_tonic', 0.3], ['hi_ether', 0.1]], steal: ['hi_ether', 'storm_ring'],
    desc: 'Born in the Stormcrown, raised on lightning, and fond of airships the way cats are fond of birds.',
  }),
  E('c4b_keel_sentinel', 'Keel Sentinel', 32, { type: 'eye', color: '#c0a060', accent: '#40c0ff', eye: '#40c0ff', seed: 34 }, {
    stats: { hp: 1.1, mag: 1.3, def: 1.4 }, weak: ['blunt', 'dark'], resist: { light: 0.5, bolt: 0.5 }, poise: 4,
    skills: [['e_spark', 2], ['e_holy', 1], ['e_gravity', 0.5]], drops: [['hi_ether', 0.15]], steal: ['ether', 'hi_ether'],
    desc: 'A watchman of brass and saltglass, set under Skyreach by its first Keepers. It has been watching for so long it forgot who it was watching for.',
  }),
  E('c4b_dg_lancer', 'Dawnguard Lancer', 30, { type: 'humanoid', look: 'dawnguard', size: 1 }, {
    stats: { hp: 1.3, str: 1.1, def: 1.2 }, weak: ['bolt', 'blunt'], poise: 3,
    skills: [['e_spear', 2], ['e_sweep', 1]], drops: [['hi_tonic', 0.3]], steal: ['hi_tonic', 'starsteel_helm'],
    desc: 'Garrick\'s chosen. They polish their armor twice a day and their consciences never.',
  }),
  E('c4b_corder', 'Captain Corder', 32, { type: 'humanoid', look: 'c4b_corder', size: 1.5 }, {
    boss: true, stats: { hp: 7, str: 1.2, def: 1.25, exp: 6, gold: 7, cp: 3 }, weak: ['bolt', 'blunt'], resist: { pierce: 0.7 }, poise: 6,
    ai: 'c4b_corder', drops: [['hunters_eye', 1]], steal: ['hi_tonic', 'starsteel_aegis'],
    desc: 'Captain of the Lord-Commander\'s Sunspears. Was in Bram\'s squire class. Has never let him forget it.',
  }),
  E('c4b_thunderhead', 'The Thunderhead', 33, { type: 'storm', color: '#2a3a5a', accent: '#f0f080', eye: '#ffffff', size: 4, seed: 35 }, {
    boss: true, stats: { hp: 14, mag: 1.3, res: 1.1, exp: 10, gold: 9, cp: 4 }, weak: ['ice', 'light'], resist: { bolt: -1, wind: 0 }, poise: 9,
    ai: 'c4b_thunderhead', summons: ['c4b_stormcell'], drops: [['ember_heart', 1]], steal: ['hi_ether', 'storm_ring'],
    desc: 'The Stormcrown\'s eye. For three hundred years Skyreach\'s Lantern held it down beneath the isle. The Lantern went dark, and the storm remembered it was alive.',
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
  // Mirefen road
  c4b_mr_leeches: T(['c4b_bog_leech', 'c4b_bog_leech']),
  c4b_mr_toads: T(['c4b_rot_toad', 'c4b_rot_toad', 'c4b_rot_toad']),
  c4b_mr_wisp_toad: T(['c4b_mire_wisp', 'c4b_rot_toad']),
  c4b_mr_crawler: T(['c4b_marsh_crawler', 'c4b_bog_leech']),
  c4b_mr_rotcaps: T(['c4b_rotcap', 'c4b_mire_wisp', 'c4b_rotcap']),
  c4b_dg_patrol: T(['c4b_dg_trooper', 'c4b_dg_crossbow', 'c4b_dg_trooper'], { canFlee: false }),
  // Drownmere
  c4b_dm_drowned: T(['c4b_drowned', 'c4b_drowned']),
  c4b_dm_lurker: T(['c4b_bog_lurker', 'c4b_bog_leech']),
  c4b_dm_mix: T(['c4b_drowned', 'c4b_mire_wisp', 'c4b_rotcap']),
  c4b_dm_crawlers: T(['c4b_marsh_crawler', 'c4b_marsh_crawler']),
  c4b_dm_toads: T(['c4b_rot_toad', 'c4b_mire_wisp', 'c4b_rot_toad']),
  c4b_dm_grotto: T(['c4b_rotcap', 'c4b_rotcap', 'c4b_drowned']),
  c4b_boss_mawmire: T(['c4b_rot_polyp', 'c4b_mawmire', 'c4b_rot_polyp'], { ...BOSS, bg: 'swamp' }),
  // Verdance & Thornwood
  c4b_vd_briars: T(['c4b_briarling', 'c4b_briarling']),
  c4b_vd_boars: T(['c4b_mossback', 'c4b_mossback']),
  c4b_vd_moths: T(['c4b_gloam_moth', 'c4b_gloam_moth', 'c4b_gloam_moth']),
  c4b_vd_mix: T(['c4b_briarling', 'c4b_mossback', 'c4b_lost_light']),
  c4b_tw_mantis: T(['c4b_bark_mantis', 'c4b_bark_mantis']),
  c4b_tw_weavers: T(['c4b_thornweaver', 'c4b_gloam_moth', 'c4b_thornweaver']),
  c4b_tw_root: T(['c4b_rootlurker', 'c4b_briarling']),
  c4b_tw_lights: T(['c4b_lost_light', 'c4b_gloam_moth', 'c4b_lost_light']),
  c4b_tw_mix: T(['c4b_bark_mantis', 'c4b_thornweaver', 'c4b_lost_light']),
  c4b_boss_hollowbark: T(['c4b_briarling', 'c4b_hollowbark', 'c4b_briarling'], { ...BOSS, bg: 'verdance' }),
  // Stormfoot, the flight, the Undercradle
  c4b_sf_harpies: T(['c4b_gale_harpy', 'c4b_gale_harpy']),
  c4b_sf_golem: T(['c4b_crag_golem', 'c4b_stormcell']),
  c4b_sf_cells: T(['c4b_stormcell', 'c4b_stormcell', 'c4b_stormcell']),
  c4b_sf_eels: T(['c4b_cloud_eel', 'c4b_gale_harpy']),
  c4b_sf_core: T(['c4b_stormcell', 'c4b_crag_golem', 'c4b_stormcell'], { canFlee: false }),
  c4b_boss_corder: T(['c4b_dg_lancer', 'c4b_corder', 'c4b_dg_lancer'], { ...BOSS, bg: 'road' }),
  c4b_flight_drakes: T(['c4b_storm_drake', 'c4b_gale_harpy', 'c4b_storm_drake'], { canFlee: false, music: 'boss', bg: 'sky' }),
  c4b_uc_drake: T(['c4b_storm_drake', 'c4b_gale_harpy']),
  c4b_uc_sentinels: T(['c4b_keel_sentinel', 'c4b_keel_sentinel']),
  c4b_uc_mix: T(['c4b_cloud_eel', 'c4b_keel_sentinel', 'c4b_stormcell']),
  c4b_uc_golems: T(['c4b_crag_golem', 'c4b_crag_golem']),
  c4b_uc_pylon: T(['c4b_keel_sentinel', 'c4b_storm_drake', 'c4b_keel_sentinel'], { canFlee: false }),
  c4b_boss_thunderhead: T(['c4b_stormcell', 'c4b_thunderhead', 'c4b_stormcell'], { ...BOSS, bg: 'sky' }),
};

// ------------------------------------------------------------------ boss AI
const BOSS_AI = {
  /** Mawmire: polyp-spawner with a telegraphed flood; submerges and hardens at half health. */
  c4b_mawmire(c) {
    if (c.m.flood) { c.m.flood = false; return c.use('c4b_black_bile'); }
    if (c.hpPct < 0.5 && c.once('submerge')) {
      c.say('Mawmire sinks into the black water. The bog itself seems to harden around it.');
      return c.use('e_shell');
    }
    const polyps = c.allies.filter((a) => a.def.id === 'c4b_rot_polyp').length;
    if (polyps === 0 && c.turn > 2 && c.once(`bud${Math.floor(c.turn / 4)}`)) {
      c.say('Mawmire\'s flank splits like rotten fruit. Something small and wet climbs out.');
      return c.use('e_summon');
    }
    if (c.turn % 4 === 0) {
      c.m.flood = true;
      c.say('Mawmire drinks the bog. Its belly swells black. _Brace!_');
      return c.use('e_charge');
    }
    if (c.hpPct < 0.5) return c.pick([['c4b_engulf', 2], ['e_drain', 2], ['e_poison', 1], ['e_bite', 1]]);
    return c.pick([['e_bite', 3], ['c4b_engulf', 1], ['e_poison', 1], ['e_drain', 1]]);
  },

  /** Hollowbark: root quakes on a rhythm, briar reinforcements, one deep drink, a telegraphed thornstorm. */
  c4b_hollowbark(c) {
    if (c.m.storm) { c.m.storm = false; return c.use('c4b_thornstorm'); }
    if (c.turn === 1) { c.say('The Warden does not see you. It sees only the dark it has been fighting for a year.'); }
    if (c.hpPct < 0.6 && c.once('briars')) {
      c.say('Hollowbark drives its roots into the earth. Briars claw up out of the soil!');
      return c.use('e_summon');
    }
    if (c.hpPct < 0.45 && c.once('drink')) {
      c.say('Hollowbark drinks from the deep roots. Old sap closes its wounds.');
      return c.use('c4b_deep_drink');
    }
    if (c.hpPct < 0.35 && c.once('splinter')) {
      c.m.storm = true;
      c.say('Hollowbark\'s bark splits open, bristling with thorns as long as swords...');
      return c.use('e_charge');
    }
    if (c.turn % 3 === 0) return c.use('c4b_rootquake');
    return c.pick([['e_slam', 3], ['e_constrict', 2], ['e_spore', 1]]);
  },

  /** Captain Corder: rallies his lancers, then levels his lance at Bram. */
  c4b_corder(c) {
    const bram = c.sys.party.find((p) => p.alive && p.id === 'bram');
    if (c.m.lance) {
      c.m.lance = false;
      return c.use('c4b_lance_charge', bram ? [bram] : undefined);
    }
    if (c.turn === 1) { c.say('"Sunspears! Shields together!"'); return c.use('e_buff'); }
    if (c.turn % 3 === 0) {
      c.m.lance = true;
      c.say(bram ? '"Remember this, Kestrel? Stand still. You\'re good at that."' : 'Corder levels his lance...');
      return c.use('e_charge');
    }
    if (c.hpPct < 0.5 && c.once('shell')) { c.say('"Hold the line! For the Lord-Commander!"'); return c.use('e_shell'); }
    return c.pick([['e_spear', 3], ['e_sweep', 2], ['e_stun', 1]]);
  },

  /** The Thunderhead: the eye of the storm. The pressure drop telegraphs Stormfall. */
  c4b_thunderhead(c) {
    if (c.m.fall) { c.m.fall = false; return c.use('c4b_stormfall'); }
    if (c.hpPct < 0.7 && c.once('cells')) {
      c.say('The Thunderhead tears loose pieces of itself. They crackle into shape.');
      return c.use('e_summon');
    }
    if (c.hpPct < 0.4 && c.once('eye')) {
      c.say('The clouds peel back. At the heart of the storm, an eye opens — and looks at you.');
      return c.use('c4b_eye_open');
    }
    if (c.turn % 4 === 0) {
      c.m.fall = true;
      c.say('The wind falls silent. Your ears pop. The pressure is dropping...');
      return c.use('e_charge');
    }
    if (c.hpPct < 0.4) return c.pick([['e_thunder', 2], ['c4b_downdraft', 2], ['e_spark', 1]]);
    return c.pick([['e_spark', 3], ['c4b_downdraft', 1], ['e_gust', 2], ['e_thunder', 1]]);
  },
};

// ------------------------------------------------------------------ looks
const SKIN = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };
const LOOKS = {
  c4b_hesk: { id: 'c4b_hesk', skin: SKIN.warm, hair: { style: 'messy', color: '#5a3a2a' }, eyes: '#4a6a3a',
    outfit: { style: 'robe', main: '#5a6a3a', accent: '#c8b878', trim: '#8a6a3a' } },
  c4b_vey: { id: 'c4b_vey', skin: SKIN.fair, hair: { style: 'short', color: '#8a8a88' },
    outfit: { style: 'coat', main: '#3a3a44', accent: '#e8e0d0', trim: '#6a5a4a', pants: '#2a2a30' }, acc: ['glasses'], build: 'tall' },
  c4b_nettie: { id: 'c4b_nettie', skin: SKIN.tan, hair: { style: 'twintails', color: '#6a4a2a' },
    outfit: { style: 'dress', main: '#c8b898', accent: '#e8dcc0', trim: '#8a6a4a' }, build: 'child', blush: true },
  c4b_dace: { id: 'c4b_dace', skin: SKIN.fair, hair: { style: 'short', color: '#c8a050' },
    outfit: { style: 'armor', main: '#777', metal: '#8a94a4', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' } },
  c4b_lisette: { id: 'c4b_lisette', skin: SKIN.fair, hair: { style: 'bun', color: '#c0642e' },
    outfit: { style: 'priest', main: '#efe8d8', accent: '#d0b060', trim: '#c9a24a' }, weapon: 'tome' },
  c4b_pell: { id: 'c4b_pell', skin: SKIN.warm, hair: { style: 'bun', color: '#b8b4b0' },
    outfit: { style: 'dress', main: '#3a3a4a', accent: '#8a8a9a', trim: '#2a2a30' }, acc: ['hood'] },
  c4b_gaspar: { id: 'c4b_gaspar', skin: SKIN.brown, hair: { style: 'bald', color: '#c8c8c8' },
    outfit: { style: 'vest', main: '#5a5a3a', accent: '#a89a78', trim: '#3a2a20', pants: '#3a3a30' }, acc: ['beard', 'hat_wide'] },
  c4b_rusk: { id: 'c4b_rusk', skin: SKIN.tan, hair: { style: 'short', color: '#3a2a1a' },
    outfit: { style: 'vest', main: '#6a4a3a', accent: '#e8dcc0', trim: '#3a2a1a', pants: '#4a3a2a' }, acc: ['beard'], build: 'large' },
  c4b_tiller: { id: 'c4b_tiller', skin: SKIN.deep, hair: { style: 'braid', color: '#2a2a30' },
    outfit: { style: 'tunic', main: '#7a6a3a', accent: '#d8c8a0', trim: '#5a3a2a', pants: '#3a3a30' }, acc: ['scarf'] },
  c4b_bracken: { id: 'c4b_bracken', skin: '#c8a888', hair: { style: 'long', color: '#d8d4d0' },
    outfit: { style: 'robe', main: '#4a5a2a', accent: '#c8b070', trim: '#6a4a2a' }, acc: ['beard'], weapon: 'staff' },
  c4b_fern: { id: 'c4b_fern', skin: SKIN.warm, hair: { style: 'ponytail', color: '#8ab84a' },
    outfit: { style: 'vest', main: '#3a6a3a', accent: '#e8dcc0', trim: '#6a4a2a', pants: '#4a3a2a' }, acc: ['headband'] },
  c4b_sapling: { id: 'c4b_sapling', skin: SKIN.tan, hair: { style: 'messy', color: '#6a8a3a' },
    outfit: { style: 'tunic', main: '#5a7a3a', accent: '#e8dcc0', trim: '#4a3a2a', pants: '#4a3a2a' }, build: 'child' },
  c4b_sapling2: { id: 'c4b_sapling2', skin: SKIN.fair, hair: { style: 'braid', color: '#c8a050' },
    outfit: { style: 'dress', main: '#8a6a3a', accent: '#f0e8d0', trim: '#5a7a3a' }, acc: ['ribbon'], build: 'child' },
  c4b_ilka: { id: 'c4b_ilka', skin: SKIN.deep, hair: { style: 'bun', color: '#e8e4dc' },
    outfit: { style: 'vest', main: '#5a4a3a', accent: '#c8a050', trim: '#3a2a20', pants: '#3a3a40' }, acc: ['glasses', 'bandana'], weapon: 'axe' },
  c4b_skyfolk: { id: 'c4b_skyfolk', skin: SKIN.brown, hair: { style: 'ponytail', color: '#e8e8f0' },
    outfit: { style: 'coat', main: '#3a5a8a', accent: '#e8e0d0', trim: '#e0c050', pants: '#2a3040' }, acc: ['feather'] },
  c4b_skyfolk2: { id: 'c4b_skyfolk2', skin: SKIN.tan, hair: { style: 'short', color: '#3a3030' },
    outfit: { style: 'vest', main: '#6a8ab0', accent: '#f0e8d8', trim: '#c9a24a', pants: '#3a3a4a' }, acc: ['scarf'] },
  c4b_kesi: { id: 'c4b_kesi', skin: SKIN.brown, hair: { style: 'twintails', color: '#2a2a30' },
    outfit: { style: 'coat', main: '#c87a4a', accent: '#f0e8d0', trim: '#e0c050', pants: '#3a3a4a' }, acc: ['scarf'], build: 'child' },
  c4b_joss: { id: 'c4b_joss', skin: SKIN.fair, hair: { style: 'messy', color: '#c0642e' },
    outfit: { style: 'coat', main: '#6a5a8a', accent: '#d8c8a8', trim: '#c9a24a', pants: '#3a3030' }, acc: ['hat_wide', 'scarf'] },
  c4b_corder: { id: 'c4b_corder', skin: SKIN.fair, hair: { style: 'short', color: '#e3c25a' },
    outfit: { style: 'armor', main: '#999', metal: '#c8ccd8', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' },
    acc: ['cape'], capeColor: '#c03a3a', weapon: 'spear', shield: true },
  c4b_dg_crossbow: { id: 'c4b_dg_crossbow', skin: SKIN.tan, hair: { style: 'short', color: '#3a2a1a' },
    outfit: { style: 'armor', main: '#888', metal: '#a9b3c2', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' }, acc: ['helmet'], weapon: 'bow' },
};

// ------------------------------------------------------------------ shops
const t5 = (pred) => gearOfTier(5, pred);
const SHOPS = {
  c4b_rootholm: {
    name: 'Fern\'s Forage & Fletching',
    items: ['hi_tonic', 'hi_ether', 'panacea', 'echo_herb', 'ember_feather', 'tonic_mist', 'fire_bomb', 'vigor_bangle', 'focus_pendant', 'sage_ring',
      ...t5((e) => ['bow', 'staff', 'rod', 'instrument', 'tome'].includes(e.wtype) || e.armor === 'light' || e.armor === 'robe')],
  },
  c4b_skyreach: {
    name: 'The Windward Exchange',
    items: ['hi_tonic', 'mega_tonic', 'hi_ether', 'panacea', 'ember_feather', 'tonic_mist', 'bolt_bomb', 'gale_bomb', 'frost_bomb',
      'storm_ring', 'feather_cape', 'swift_boots', 'sun_goggles',
      ...t5((e) => ['gun', 'dagger', 'spear', 'sword', 'greatsword', 'axe', 'fist'].includes(e.wtype) || e.armor === 'heavy' || e.armor === 'shield')],
  },
};

// ------------------------------------------------------------------ world nodes
const WORLD = [
  { id: 'mirefen', name: 'Mirefen', region: 'The Fens', act: 1, x: 760, y: 560, mapId: 'c4b_mirefen', tx: 21, ty: 17, dir: 'down', unlock: 'c4b_mirefen_arrived',
    desc: 'A stilt village over the fens. Mother Osk keeps its Lantern — kept it.' },
  { id: 'thornwood', name: 'Thornwood', region: 'Verdance', act: 1, x: 820, y: 320, mapId: 'c4b_verdance', tx: 6, ty: 27, dir: 'right', unlock: 'c4b_osk_saved',
    desc: 'The oldest forest in Solmere, and Rootholm at its edge. Elowen, the oldest Keeper, lives at its heart.' },
  { id: 'stormfoot', name: 'Stormfoot', region: 'The Stormcrown', act: 1, x: 655, y: 175, mapId: 'c4b_stormfoot', tx: 5, ty: 28, dir: 'right', unlock: 'c4b_elowen_farewell',
    desc: 'The rain-lashed foot of the Stormcrown, where the Halcyon waits on her cradle.' },
  { id: 'skyreach', name: 'Skyreach', region: 'Above the Stormcrown', act: 1, x: 700, y: 120, mapId: 'c4b_skyreach', tx: 25, ty: 19, dir: 'down', unlock: 'c4b_six_of_seven',
    desc: 'A floating isle of airship folk, riding the storm. Ardent Vasha keeps its Lantern.' },
];

/** @type {import('../../types/data').ContentPack} */
export default {
  maps: [...MIREFEN_MAPS, ...VERDANCE_MAPS, ...STORMCROWN_MAPS],
  enemies: ENEMIES,
  troops: TROOPS,
  looks: LOOKS,
  bossAI: BOSS_AI,
  shops: SHOPS,
  worldNodes: WORLD,
};
