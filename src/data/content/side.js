// Content pack: side — optional areas reachable by fast travel: the Hunters'
// Lodge and its bounties, the Drowned Observatory, Fort Ashwatch, the Hollow
// Bell, the Garden That Remembers, and two hidden bosses.

import { ITEMS } from '../items.js';
import { EQUIPMENT } from '../equipment.js';
import { SIDE, bountyLair, chime, flower } from '../../story/side.js';

import LODGE from '../maps/layouts/side_lodge.js';
import LODGE_HALL from '../maps/layouts/side_lodge_hall.js';
import MOOR from '../maps/layouts/side_moor.js';
import OBS_SHORE from '../maps/layouts/side_obs_shore.js';
import OBS_GALLERIES from '../maps/layouts/side_obs_galleries.js';
import OBS_DOME from '../maps/layouts/side_obs_dome.js';
import ASH_BAILEY from '../maps/layouts/side_ash_bailey.js';
import ASH_KEEP from '../maps/layouts/side_ash_keep.js';
import ASH_TOWER from '../maps/layouts/side_ash_tower.js';
import BANE from '../maps/layouts/side_bane_hollow.js';
import RUIN_LODGE from '../maps/layouts/side_ruin_lodge.js';
import ASHEN_REACH from '../maps/layouts/side_ashen_reach.js';
import BELL_TOP from '../maps/layouts/side_bell_top.js';
import BELL_NAVE from '../maps/layouts/side_bell_nave.js';
import BELL_BELFRY from '../maps/layouts/side_bell_belfry.js';
import GARDEN_GATE from '../maps/layouts/side_garden_gate.js';
import GARDEN_MAZE from '../maps/layouts/side_garden_maze.js';
import { LOST_QUESTS } from '../../story/lost.js';
import GARDEN_HEART from '../maps/layouts/side_garden_heart.js';
import NADIR from '../maps/layouts/side_nadir.js';

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

ITEMS.side_aldous_letter = { name: 'Aldous\'s Letter', kind: 'key', desc: 'Unsent. "To my squire, whoever he turns out to be."', icon: '✪' };
const acc = (id, def) => { EQUIPMENT[id] = { id, slot: 'accessory', tier: 0, price: 0, ...def }; };
acc('side_ashwatch_ring', { name: 'Ashwatch Signet', def: 12, res: 12, mods: { counter: 15 }, desc: 'A commander\'s ring. DEF/RES +12, counter 15%.' });
acc('side_harrow_fang', { name: 'Harrow\'s Fang', str: 18, mods: { crit: 12 }, desc: 'STR +18, critical +12%. The Lodge\'s founder, avenged.' });
acc('agathes_bell', { name: 'Agathe\'s Bell', autoStatus: ['veil'], mods: { evade: 5 }, desc: 'Start battles with Veil (dodge two attacks). It rings very quietly.' });
acc('black_star_shard', { name: 'Black Star Shard', mag: 30, str: 30, mods: { afterglow: 30 }, desc: 'STR/MAG +30, Afterglow +30%. Hums below hearing.' });

// ---------------------------------------------------------------------------
// Enemies
// ---------------------------------------------------------------------------

/**
 * An enemy definition (see EnemyDef); `opts` holds everything past the basics.
 * @param {string} id
 * @param {string} name
 * @param {number} level
 * @param {import('../../types/data').EnemyDef['sprite']} sprite
 * @param {Partial<import('../../types/data').EnemyDef>} [opts]
 * @returns {import('../../types/data').EnemyDef}
 */
const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, poise: 3, skills: [['attack', 1]], drops: [], ...opts });
const boss = (o) => ({ boss: true, ...o, stats: { hp: 12, exp: 8, gold: 8, cp: 4, ...(o.stats || {}) } });

const ENEMIES = [
  // Brackenmoor (Lv 12–15)
  E('side_heath_hound', 'Heath Hound', 12, { type: 'hound', color: '#8a7a5a', accent: '#c8b890' }, { weak: ['fire', 'pierce'], skills: [['e_bite', 3], ['e_howl', 1]], drops: [['wolf_pelt', 0.3]], desc: 'Moor dogs gone wild. Polite, until they are not.' }),
  E('side_moor_crow', 'Bracken Crow', 12, { type: 'bird', color: '#3a3a44', accent: '#6a6a7a', eye: '#ffcc40', seed: 4 }, { stats: { spd: 1.3, hp: 0.8 }, weak: ['pierce', 'bolt'], skills: [['e_peck', 3], ['e_blind', 1]], drops: [['eye_drops', 0.3]], desc: 'It steals buttons. Then eyes.' }),
  E('side_bog_wisp', 'Bog Light', 13, { type: 'wisp', color: '#a0f0a0', eye: '#ffffff', seed: 6 }, { stats: { mag: 1.2, def: 1.6, res: 0.7 }, weak: ['wind', 'dark'], resist: { slash: 0.6, pierce: 0.6 }, skills: [['e_spark', 2], ['e_sleep', 1]], drops: [['ether', 0.2]], desc: 'Follow it, and you will find exactly what it wants you to find.' }),
  E('side_moor_boar', 'Gorse Boar', 14, { type: 'boar', color: '#6a5040', accent: '#a08060' }, { stats: { hp: 1.2, str: 1.1 }, weak: ['pierce', 'ice'], skills: [['e_tackle', 3], ['e_slam', 1]], drops: [['tonic', 0.3]], desc: 'Bristleback\'s many, many children.' }),
  // Drowned Observatory (Lv 17–19)
  E('side_tide_lurker', 'Tide Lurker', 17, { type: 'crab', color: '#5a8a8a', eye: '#202020', seed: 8 }, { stats: { def: 1.5, spd: 0.8 }, weak: ['bolt', 'blunt'], resist: { ice: 0.5 }, skills: [['attack', 2], ['e_shell', 1]], drops: [['sea_glass', 0.4]], desc: 'Barnacled to the causeway for so long it forgot how to leave.' }),
  E('side_glass_jelly', 'Lens Jelly', 17, { type: 'slime', color: '#c0e8f0', eye: '#4060a0', seed: 9 }, { stats: { res: 1.4 }, weak: ['bolt', 'slash'], resist: { light: 0 }, skills: [['e_spit', 2], ['e_blind', 1]], drops: [['eye_drops', 0.3]], desc: 'It focuses sunlight into anyone foolish enough to look at it.' }),
  E('side_tidal_eel', 'Gallery Eel', 18, { type: 'serpent', color: '#3a6a5a', accent: '#a0e0c0', seed: 11 }, { stats: { mag: 1.2 }, weak: ['bolt', 'pierce'], resist: { ice: 0.5 }, skills: [['e_spit', 2], ['e_constrict', 1]], drops: [['hi_tonic', 0.15]], desc: 'Lives in the flooded galleries. Eats astronomers, historically.' }),
  E('side_gallery_golem', 'Brass Measurer', 19, { type: 'golem', color: '#b08a40', accent: '#ffd070', eye: '#80e0ff', seed: 12 }, { stats: { hp: 1.3, def: 1.6, res: 0.7, spd: 0.7 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5, pierce: 0.5 }, poise: 4, skills: [['attack', 2], ['e_crush', 1]], drops: [['power_fruit', 0.03]], desc: 'Built by the first Keepers to measure the sun. Still measuring.' }),
  // Fort Ashwatch (Lv 26–29)
  E('side_ash_sentinel', 'Ashwatch Sentinel', 26, { type: 'skeleton', color: '#e8e0cc', accent: '#a9b3c2', eye: '#80c0ff' }, { stats: { def: 1.3 }, weak: ['blunt', 'light'], resist: { pierce: 0.5, dark: 0 }, immune: ['poison', 'sleep'], skills: [['e_slash', 3], ['e_stun', 1]], drops: [['hi_tonic', 0.2]], desc: 'Still at their posts. Nobody relieved them.' }),
  E('side_oathless', 'Oathless Shade', 27, { type: 'ghost', color: '#7a8aa8', eye: '#ffd070', seed: 14 }, { stats: { mag: 1.3, def: 1.6 }, weak: ['light', 'fire'], resist: { slash: 0.5, pierce: 0.5, dark: 0 }, skills: [['e_dark', 2], ['e_wail', 1]], drops: [['ether', 0.3]], desc: 'A soldier who broke an oath here. It is still sorry.' }),
  E('side_barrow_hound', 'Barrow Hound', 27, { type: 'hound', color: '#3a3a40', accent: '#8a6aff', eye: '#ff6060', seed: 15 }, { stats: { spd: 1.2 }, weak: ['light', 'slash'], skills: [['e_bite', 3], ['e_drain', 1]], drops: [['gloam_dust', 0.4]], desc: 'Mange\'s pack. They guard the graves.' }),
  E('side_rust_knight', 'Rusted Dawnguard', 28, { type: 'knight', color: '#7a6050', accent: '#a83232', weapon: 'spear', size: 1, seed: 16 }, { stats: { hp: 1.3, def: 1.4 }, weak: ['bolt', 'blunt'], poise: 4, skills: [['e_spear', 3], ['e_buff', 1]], drops: [['steel_pike', 0.05]], desc: 'Empty armor that remembers the drill.' }),
  // The Ashen Reach (Lv 40–44)
  E('side_ember_harrier', 'Ember Harrier', 40, { type: 'bird', color: '#d06030', accent: '#ffc060', eye: '#ffffff', seed: 21 }, { stats: { spd: 1.3, mag: 1.1 }, weak: ['ice', 'pierce'], resist: { fire: 0 }, skills: [['e_peck', 2], ['e_ember', 2]], drops: [['burn_salve', 0.3]], desc: 'Gulls that flew too close to the broken sun.' }),
  E('side_cinder_hound', 'Cinder Hound', 41, { type: 'hound', color: '#4a3030', accent: '#ff8040', eye: '#ffd060', seed: 22 }, { stats: { str: 1.15 }, weak: ['ice', 'slash'], resist: { fire: 0.5 }, skills: [['e_bite', 3], ['e_firebreath', 1]], drops: [['gloam_dust', 0.3]], desc: 'Coal-bellied dogs of the ash wastes.' }),
  E('side_shard_crawler', 'Shard Crawler', 42, { type: 'scorpion', color: '#9fd6d6', accent: '#e8ffff', seed: 23 }, { stats: { def: 1.6, res: 0.8 }, weak: ['blunt', 'bolt'], resist: { slash: 0.5, pierce: 0.6 }, poise: 4, skills: [['e_sting', 3], ['e_shell', 1]], drops: [['saltglass', 0.4]], desc: 'Grows a shell from fallen window-glass.' }),
  E('side_ash_shade', 'Ash Shade', 43, { type: 'ghost', color: '#8a8088', eye: '#ff9a6a', seed: 24 }, { stats: { mag: 1.25, def: 1.5 }, weak: ['light', 'wind'], resist: { slash: 0.5, pierce: 0.5, dark: 0 }, skills: [['e_darkwave', 2], ['e_mpdrain', 1]], drops: [['hi_ether', 0.15]], desc: 'Ash that remembers being a person.' }),
  // The Hollow Bell (Lv 44–47)
  E('side_bell_bat', 'Belfry Bat', 44, { type: 'bat', color: '#4a3a5a', eye: '#ffe060', seed: 31 }, { stats: { spd: 1.4, hp: 0.8 }, weak: ['light', 'pierce'], skills: [['e_bite', 2], ['e_wail', 1]], drops: [['eye_drops', 0.3]], desc: 'They hang right-way-up now, which is to say, upside-down.' }),
  E('side_choir_shade', 'Choir Shade', 45, { type: 'ghost', color: '#e8e0f0', eye: '#8060c0', seed: 32 }, { stats: { mag: 1.3, def: 1.5 }, weak: ['dark', 'wind'], resist: { light: 0, slash: 0.5 }, skills: [['e_holy', 2], ['e_holyall', 1], ['e_sleep', 0.5]], drops: [['ether', 0.3]], desc: 'Still singing the wedding hymn. Still a little flat.' }),
  E('side_clapper', 'Clapper Golem', 46, { type: 'golem', color: '#8a7040', accent: '#e0c060', eye: '#ffd070', seed: 33 }, { stats: { hp: 1.4, def: 1.7, spd: 0.7 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5 }, poise: 5, skills: [['e_slam', 2], ['e_quake', 1]], drops: [['guard_fruit', 0.04]], desc: 'A bell-clapper that grew arms. It strikes on the hour.' }),
  E('side_hymn_wisp', 'Hymn Wisp', 45, { type: 'wisp', color: '#ffe8a0', eye: '#604020', seed: 34 }, { stats: { mag: 1.3, def: 1.8, res: 0.7 }, weak: ['dark', 'ice'], resist: { light: -1, slash: 0.5, pierce: 0.5 }, skills: [['e_holy', 2], ['e_heal', 1]], drops: [['hi_ether', 0.15]], desc: 'A note that refused to end.' }),
  // The Garden That Remembers (Lv 58–62)
  E('side_thorn_maw', 'Thorn Maw', 58, { type: 'plant', color: '#f0f0f0', accent: '#f0d060', seed: 41 }, { stats: { hp: 1.2, str: 1.1 }, weak: ['fire', 'slash'], resist: { ice: 0.5 }, skills: [['e_sting', 2], ['e_spore', 1]], drops: [['panacea', 0.2]], desc: 'A white flower that bites the hand that waters it.' }),
  E('side_memory_moth', 'Memory Moth', 58, { type: 'insect', color: '#d8d0e8', accent: '#ffffff', seed: 42 }, { stats: { spd: 1.3, mag: 1.2 }, weak: ['fire', 'wind'], skills: [['e_gust', 2], ['e_silence', 1]], drops: [['hi_ether', 0.2]], desc: 'It eats the last words before they can be said.' }),
  E('side_petal_wraith', 'Petal Wraith', 60, { type: 'ghost', color: '#f8f0f0', eye: '#e060a0', seed: 43 }, { stats: { mag: 1.3, def: 1.5 }, weak: ['fire', 'light'], resist: { slash: 0.5, pierce: 0.5, dark: 0 }, skills: [['e_drain', 2], ['e_doom', 0.3]], drops: [['dawn_plume', 0.05]], desc: 'Someone who did not get to say goodbye.' }),
  E('side_grave_treant', 'Mourning Oak', 61, { type: 'treant', color: '#e8e8e0', eye: '#a0a0ff', seed: 44 }, { stats: { hp: 1.5, def: 1.4, spd: 0.7 }, weak: ['fire', 'slash'], resist: { blunt: 0.5 }, poise: 5, skills: [['e_slam', 2], ['e_healall', 1]], drops: [['vigor_seed', 0.05]], desc: 'Planted over a grave a century ago. It grieves slowly.' }),

  // ---------------------------------------------------------------- bounties
  E('side_bounty_bristleback', 'Bristleback', 13, { type: 'boar', color: '#5a4030', accent: '#e0c080', size: 2, seed: 51 }, boss({ stats: { hp: 7, str: 1.2 }, weak: ['pierce', 'ice'], poise: 6, ai: 'side_bristleback', drops: [['vigor_seed', 1]], desc: 'Bounty. Ate a cart. The cart was occupied.' })),
  E('side_bounty_lanternjaw', 'Lanternjaw', 15, { type: 'angler', color: '#2a4a5a', accent: '#60c0a0', eye: '#ffe080', size: 2, seed: 52 }, boss({ stats: { hp: 7, mag: 1.25 }, weak: ['bolt', 'pierce'], resist: { ice: 0.5 }, poise: 6, ai: 'side_lanternjaw', drops: [['wisdom_seed', 1]], desc: 'Bounty. Its lure is the last light many travellers saw.' })),
  E('side_bounty_gravelgut', 'Gravelgut', 17, { type: 'golem', color: '#7a7470', accent: '#c0a060', size: 2, seed: 53 }, boss({ stats: { hp: 8, def: 1.6, spd: 0.8 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5, pierce: 0.5 }, poise: 7, ai: 'side_gravelgut', drops: [['guard_fruit', 1]], desc: 'Bounty. A cairn that got hungry.' })),
  E('side_bounty_pinch', 'The Pinch', 19, { type: 'crab', color: '#a04030', accent: '#e0a080', size: 2, seed: 54 }, boss({ stats: { hp: 8, def: 1.5 }, weak: ['bolt', 'blunt'], resist: { ice: 0.5, slash: 0.6 }, poise: 7, ai: 'side_pinch', drops: [['power_fruit', 1]], desc: 'Bounty. The toll is fingers.' })),
  E('side_bounty_mange', 'Mange', 27, { type: 'hound', color: '#4a4040', accent: '#a83232', eye: '#ff4040', size: 2, seed: 55 }, boss({ stats: { hp: 8, str: 1.2, spd: 1.2 }, weak: ['light', 'fire'], poise: 7, ai: 'side_mange', drops: [['swift_fruit', 1]], desc: 'Bounty. Still on patrol.' })),
  E('side_bounty_cinderwing', 'Cinderwing', 40, { type: 'bird', color: '#e05020', accent: '#ffe080', eye: '#ffffff', size: 2, seed: 56 }, boss({ stats: { hp: 9, mag: 1.2, spd: 1.2 }, weak: ['ice', 'wind'], resist: { fire: -1 }, poise: 7, ai: 'side_cinderwing', drops: [['magic_fruit', 1]], desc: 'Bounty. Flew through the broken sun.' })),
  E('side_bounty_glasshide', 'Glasshide', 42, { type: 'scorpion', color: '#a0d0e8', accent: '#f0c060', size: 2, seed: 57 }, boss({ stats: { hp: 9, def: 1.7 }, weak: ['blunt', 'bolt'], resist: { slash: 0.4, pierce: 0.4, light: 0 }, poise: 8, ai: 'side_glasshide', drops: [['guard_fruit', 1]], desc: 'Bounty. Saints in its back.' })),
  E('side_bounty_gravemouth', 'Gravemouth', 44, { type: 'horror', color: '#3a3040', eye: '#e0e0ff', size: 2, seed: 58 }, boss({ stats: { hp: 10, mag: 1.25 }, weak: ['light', 'fire'], resist: { dark: -1 }, poise: 8, ai: 'side_gravemouth', drops: [['spirit_fruit', 1]], desc: 'Bounty. It speaks with the voices of the buried.' })),
  E('side_bounty_choirmother', 'The Choirmother', 46, { type: 'ghost', color: '#f0e8ff', eye: '#a040a0', size: 2, seed: 59 }, boss({ stats: { hp: 10, mag: 1.3 }, weak: ['dark', 'blunt'], resist: { light: -1, slash: 0.5 }, poise: 8, ai: 'side_choirmother', drops: [['wisdom_seed', 1]], desc: 'Bounty. Still conducting.' })),
  E('side_bounty_thornmaiden', 'The Thornmaiden', 58, { type: 'plant', color: '#f0f0f0', accent: '#c02040', size: 3, seed: 60 }, boss({ stats: { hp: 11, str: 1.2 }, weak: ['fire', 'slash'], resist: { ice: 0.5, blunt: 0.6 }, poise: 8, ai: 'side_thornmaiden', drops: [['vigor_seed', 2]], desc: 'Bounty. Do not let her hold your hand.' })),

  // ---------------------------------------------------------------- dungeon bosses
  E('side_orrery_warden', 'The Orrery Warden', 20, { type: 'orrery', color: '#c0a060', accent: '#ffd070', eye: '#402010', size: 3, seed: 61 }, boss({ stats: { hp: 10, mag: 1.2 }, weak: ['bolt', 'dark'], resist: { light: 0.3, fire: 0.5 }, poise: 7, ai: 'side_orrery', drops: [['crest_tome', 1]], desc: 'Built by the first Keepers to guard what they chose never to do.' })),
  E('side_iron_duke', 'The Iron Duke', 29, { type: 'knight', color: '#8a94a4', accent: '#a83232', weapon: 'greatsword', size: 2, seed: 62 }, boss({ stats: { hp: 11, str: 1.25, def: 1.3 }, weak: ['bolt', 'blunt'], resist: { slash: 0.6, pierce: 0.6 }, poise: 8, ai: 'side_duke', drops: [['steel_greatsword', 1]], desc: 'The fort commander\'s ceremonial armor. Someone has to hold the stair.' })),
  E('side_hollow_bell', 'The Hollow Bell', 47, { type: 'bell', color: '#d0a040', eye: '#402010', size: 3, seed: 63 }, boss({ stats: { hp: 12, mag: 1.3, def: 1.3 }, weak: ['bolt', 'dark'], resist: { light: 0, blunt: 0.6 }, poise: 9, ai: 'side_bell', summons: ['side_hymn_wisp'], drops: [['crest_tome', 2]], desc: 'A bell that would not stop ringing, because stopping meant goodbye.' })),
  E('side_last_bloom', 'The Last Bloom', 62, { type: 'plant', color: '#f8f8f0', accent: '#e0c0f0', size: 4, seed: 64 }, boss({ stats: { hp: 13, mag: 1.3 }, weak: ['fire', 'wind'], resist: { ice: 0.5, dark: 0.5 }, poise: 10, ai: 'side_bloom', summons: ['side_memory_moth'], drops: [['megalixir', 1]], desc: 'It wanted to keep every last word. It kept too many.' })),
  // ---------------------------------------------------------------- hidden bosses
  E('side_bane_of_harrow', 'The Bane of Harrow', 45, { type: 'drake', color: '#2a2a30', accent: '#8a2020', eye: '#ff3030', size: 3, seed: 71 }, boss({ stats: { hp: 22, str: 1.35, def: 1.3, spd: 1.15, exp: 14, gold: 12, cp: 8 }, weak: ['light', 'pierce'], resist: { dark: 0, fire: 0.5 }, immune: ['doom', 'stun'], poise: 12, ai: 'side_bane', drops: [['megalixir', 1]], desc: 'Hidden hunt. It killed the Lodge\'s founder, and it remembers how he tasted.' })),
  E('side_black_star', 'The Black Star', 70, { type: 'eye', color: '#0a0610', accent: '#6040c0', eye: '#ffffff', size: 4, seed: 72 }, boss({ stats: { hp: 26, mag: 1.4, res: 1.3, spd: 1.1, exp: 16, gold: 14, cp: 10 }, weak: ['light'], resist: { dark: -1, fire: 0.5, ice: 0.5, bolt: 0.5, wind: 0.5 }, immune: ['doom', 'stun', 'sleep', 'charm'], poise: 14, ai: 'side_star', drops: [['megalixir', 2]], desc: 'Hidden hunt. It does not shine. It takes.' })),
];

// ---------------------------------------------------------------------------
// Troops
// ---------------------------------------------------------------------------

/**
 * @param {string[]} enemies
 * @param {Partial<import('../../types/data').TroopDef>} [opts]
 * @returns {import('../../types/data').TroopDef}
 */
const T = (enemies, opts = {}) => ({ enemies, ...opts });
const TB = (enemies) => T(enemies, { boss: true, music: 'boss', canFlee: false });

/** @type {Record<string, import('../../types/data').TroopDef>} */
const TROOPS = {
  side_moor_hounds: T(['side_heath_hound', 'side_heath_hound', 'side_heath_hound']),
  side_moor_crows: T(['side_moor_crow', 'side_moor_crow', 'side_bog_wisp']),
  side_moor_boars: T(['side_moor_boar', 'side_moor_boar']),
  side_moor_mix: T(['side_heath_hound', 'side_bog_wisp', 'side_moor_boar']),
  side_obs_crabs: T(['side_tide_lurker', 'side_tide_lurker']),
  side_obs_jelly: T(['side_glass_jelly', 'side_glass_jelly', 'side_tidal_eel']),
  side_obs_golem: T(['side_gallery_golem', 'side_glass_jelly']),
  side_obs_mix: T(['side_tidal_eel', 'side_tide_lurker', 'side_glass_jelly']),
  side_ash_bones: T(['side_ash_sentinel', 'side_ash_sentinel', 'side_oathless']),
  side_ash_hounds: T(['side_barrow_hound', 'side_barrow_hound']),
  side_ash_knight: T(['side_rust_knight', 'side_ash_sentinel']),
  side_ash_mix: T(['side_oathless', 'side_barrow_hound', 'side_rust_knight']),
  side_reach_birds: T(['side_ember_harrier', 'side_ember_harrier', 'side_ash_shade']),
  side_reach_hounds: T(['side_cinder_hound', 'side_cinder_hound']),
  side_reach_crawl: T(['side_shard_crawler', 'side_cinder_hound']),
  side_reach_mix: T(['side_ash_shade', 'side_shard_crawler', 'side_ember_harrier']),
  side_bell_bats: T(['side_bell_bat', 'side_bell_bat', 'side_bell_bat']),
  side_bell_choir: T(['side_choir_shade', 'side_choir_shade', 'side_hymn_wisp']),
  side_bell_clapper: T(['side_clapper', 'side_hymn_wisp']),
  side_garden_maws: T(['side_thorn_maw', 'side_thorn_maw', 'side_memory_moth']),
  side_garden_wraith: T(['side_petal_wraith', 'side_memory_moth']),
  side_garden_oak: T(['side_grave_treant', 'side_thorn_maw']),
  side_b_bristleback: TB(['side_moor_boar', 'side_bounty_bristleback']),
  side_b_lanternjaw: TB(['side_bounty_lanternjaw']),
  side_b_gravelgut: TB(['side_bounty_gravelgut']),
  side_b_pinch: TB(['side_tide_lurker', 'side_bounty_pinch']),
  side_b_mange: TB(['side_barrow_hound', 'side_bounty_mange', 'side_barrow_hound']),
  side_b_cinderwing: TB(['side_bounty_cinderwing', 'side_ember_harrier']),
  side_b_glasshide: TB(['side_bounty_glasshide']),
  side_b_gravemouth: TB(['side_bounty_gravemouth']),
  side_b_choirmother: TB(['side_choir_shade', 'side_bounty_choirmother', 'side_choir_shade']),
  side_b_thornmaiden: TB(['side_bounty_thornmaiden', 'side_thorn_maw']),
  side_boss_orrery: TB(['side_orrery_warden']),
  side_boss_duke: TB(['side_iron_duke']),
  side_boss_bell: TB(['side_hollow_bell']),
  side_boss_bloom: { ...TB(['side_last_bloom']), music: 'remnant' },
  side_hidden_bane: TB(['side_bane_of_harrow']),
  side_hidden_star: { ...TB(['side_black_star']), music: 'finalboss' },
};

// ---------------------------------------------------------------------------
// Boss AI — every big hit is telegraphed with e_charge the turn before.
// ---------------------------------------------------------------------------

/** Release a charged attack if one was declared. */
const released = (c, skill) => (c.m.charged ? ((c.m.charged = false), c.use(skill)) : null);
const charge = (c, text) => { c.m.charged = true; c.say(text); return c.use('e_charge'); };

const BOSS_AI = {
  side_bristleback(c) {
    return released(c, 'e_slam') || (c.turn % 3 === 0 ? charge(c, 'Bristleback paws the ground, head low...') : c.pick([['e_tackle', 3], ['e_howl', 1]]));
  },
  side_lanternjaw(c) {
    if (c.turn % 4 === 1) return c.use('e_sleep');
    return released(c, 'e_tidal') || (c.turn % 4 === 3 ? charge(c, 'The lure brightens. Something huge opens beneath it...') : c.pick([['e_spit', 2], ['e_bite', 2]]));
  },
  side_gravelgut(c) {
    if (c.hpPct < 0.5 && c.once('armor')) { c.say('Gravelgut swallows a cairn and hardens!'); return c.use('e_shell'); }
    return released(c, 'e_quake') || (c.turn % 3 === 0 ? charge(c, 'Gravelgut rears up, stones grinding...') : c.pick([['e_slam', 2], ['attack', 2]]));
  },
  side_pinch(c) {
    return released(c, 'e_crush') || (c.turn % 3 === 2 ? charge(c, 'The Pinch opens its great claw wide...') : c.pick([['e_constrict', 2], ['attack', 2], ['e_shell', 1]]));
  },
  side_mange(c) {
    if (c.hpPct < 0.5 && c.once('rally')) { c.say('Mange howls for the pack!'); return c.use('e_summon'); }
    return released(c, 'e_rampage') || (c.turn % 3 === 0 ? charge(c, 'Mange crouches, hackles up...') : c.pick([['e_bite', 3], ['e_howl', 1]]));
  },
  side_cinderwing(c) {
    return released(c, 'e_bigbreath') || (c.turn % 3 === 0 ? charge(c, 'Cinderwing climbs into the ash, burning brighter...') : c.pick([['e_ember', 2], ['e_peck', 2], ['e_gust', 1]]));
  },
  side_glasshide(c) {
    if (c.hpPct < 0.5 && c.once('shell')) { c.say('Glasshide\'s shell reflects the light!'); return c.use('e_shell'); }
    return released(c, 'e_crush') || (c.turn % 3 === 2 ? charge(c, 'Glasshide raises its glittering tail...') : c.pick([['e_sting', 3], ['e_blind', 1]]));
  },
  side_gravemouth(c) {
    if (c.turn % 4 === 1) return c.use('e_lament');
    return released(c, 'e_darkwave') || (c.turn % 4 === 3 ? charge(c, 'Gravemouth inhales. A hundred buried voices fall silent...') : c.pick([['e_drain', 2], ['e_dark', 2], ['e_poison', 1]]));
  },
  side_choirmother(c) {
    if (c.allies.length && c.allies.some((a) => a.hp < a.maxHp * 0.5)) return c.use('e_healall');
    return released(c, 'e_holyall') || (c.turn % 3 === 0 ? charge(c, 'The Choirmother raises her baton for the final verse...') : c.pick([['e_sleep', 1], ['e_holy', 2], ['e_silence', 1]]));
  },
  side_thornmaiden(c) {
    if (c.hpPct < 0.4 && c.once('bloom')) { c.say('The Thornmaiden blooms, thorns everywhere!'); return c.use('e_buff'); }
    return released(c, 'e_rampage') || (c.turn % 3 === 0 ? charge(c, 'She holds out her hand. Do not take it...') : c.pick([['e_sting', 2], ['e_drain', 2], ['e_spore', 1]]));
  },
  side_orrery(c) {
    if (c.hpPct < 0.5 && c.once('align')) { c.say('The seven brass suns align!'); return charge(c, 'Light gathers at the orrery\'s center...'); }
    return released(c, 'e_holyall') || c.pick([['e_holy', 2], ['e_spark', 2], ['e_gravity', 1]]);
  },
  side_duke(c) {
    if (c.hpPct < 0.5 && c.once('stance')) { c.say('The Iron Duke takes a two-handed stance.'); return c.use('e_buff'); }
    return released(c, 'e_crush') || (c.turn % 3 === 0 ? charge(c, 'The Duke raises his greatsword high...') : c.pick([['e_cleave', 2], ['e_slash', 2], ['e_stun', 1]]));
  },
  side_bell(c) {
    if (c.turn % 4 === 2 && c.allies.length < 2) { c.say('The bell tolls, and a note takes shape!'); return c.use('e_summon'); }
    return released(c, 'e_vesper') || (c.turn % 4 === 0 ? charge(c, 'The great bell swings back, back, back...') : c.pick([['e_lament', 2], ['e_quake', 1], ['e_holy', 1]]));
  },
  side_bloom(c) {
    if (c.turn % 5 === 2 && c.allies.length < 2) { c.say('Moths pour from the petals!'); return c.use('e_summon'); }
    if (c.hpPct < 0.35 && c.once('wither')) { c.say('The Last Bloom drinks the whole garden\'s voice!'); return c.use('e_healall'); }
    return released(c, 'e_bigbreath') || (c.turn % 3 === 0 ? charge(c, 'A thousand petal-mouths open at once...') : c.pick([['e_drain', 2], ['e_spore', 1], ['e_doom', 0.5], ['e_darkwave', 1]]));
  },
  side_bane(c) {
    if (c.hpPct < 0.6 && c.once('rage')) { c.say('The Bane of Harrow roars. Its wounds close!'); return c.use('e_buff'); }
    if (c.hpPct < 0.25 && c.once('last')) return charge(c, 'It drags itself up for one last killing lunge...');
    return released(c, 'e_rampage') || (c.turn % 3 === 0 ? charge(c, 'The Bane lowers its head. Its jaws unhinge...') : c.pick([['e_bite', 2], ['e_claw', 2], ['e_firebreath', 1], ['e_howl', 0.5]]));
  },
  side_star(c) {
    if (c.turn % 5 === 0) { c.say('The Black Star swallows the light. Time slows.'); return c.use('e_stillness'); }
    if (c.hpPct < 0.5 && c.once('collapse')) { c.say('The Black Star collapses inward — everything is pulled toward it!'); return c.use('e_gravity'); }
    return released(c, 'e_noon') || (c.turn % 4 === 2 ? charge(c, 'Every light in the sky bends toward the Black Star...') : c.pick([['e_darkwave', 2], ['e_doom', 0.5], ['e_mpdrain', 1], ['e_dark', 2]]));
  },
};

// ---------------------------------------------------------------------------
// Looks & shops
// ---------------------------------------------------------------------------

const LOOKS = {
  adelind: { id: 'adelind', skin: '#e9c09a', hair: { style: 'bun', color: '#6a4a2a' }, outfit: { style: 'vest', main: '#4a5a3a', accent: '#e8dcc0', trim: '#7a5a30', pants: '#4a3a2a' }, acc: ['glasses'] },
  hesper: { id: 'hesper', skin: '#c98e62', hair: { style: 'ponytail', color: '#2a2a30' }, outfit: { style: 'coat', main: '#5a4a3a', accent: '#a83a2a', trim: '#3a2a20', pants: '#3a3030' }, acc: ['scarf'] },
  sill: { id: 'sill', skin: '#d9a57c', hair: { style: 'bald', color: '#d8d4d0' }, outfit: { style: 'vest', main: '#3a5a7a', accent: '#d8ccb0', trim: '#5a4a3a', pants: '#4a4a5a' }, acc: ['beard', 'hat_wide'] },
  side_hunter: { id: 'side_hunter', skin: '#d9a57c', hair: { style: 'short', color: '#4a3a2a' }, outfit: { style: 'coat', main: '#5a6a3a', accent: '#c8b898', trim: '#5a3a20', pants: '#3a3a2a' }, acc: ['feather'], weapon: 'bow' },
  sexton: { id: 'sexton', skin: '#efd2b8', hair: { style: 'bald', color: '#c8c8c8' }, outfit: { style: 'robe', main: '#3a3040', accent: '#c8b8a0', trim: '#a08040' }, acc: ['beard'] },
  agathe: { id: 'agathe', skin: '#f4ddd0', hair: { style: 'braid', color: '#e0c890' }, eyes: '#6080c0', outfit: { style: 'dress', main: '#e8e0f0', accent: '#c0a0e0', trim: '#a08040' }, build: 'child', blush: true },
  white_gardener: { id: 'white_gardener', skin: '#e0d8c8', hair: { style: 'long', color: '#f4f4f0' }, outfit: { style: 'robe', main: '#f0ece0', accent: '#a0c090', trim: '#c0b080' }, acc: ['hat_wide'] },
};

/** @type {Record<string, import('../../types/data').ShopDef>} */
const SHOPS = {
  side_lodge: { name: 'Lodge Stores', items: ['tonic', 'hi_tonic', 'ether', 'ember_feather', 'antidote', 'eye_drops', 'smoke_ball', 'fire_bomb', 'frost_bomb', 'bolt_bomb', 'gale_bomb', 'bedroll', 'quiet_bell', 'lure_bell', 'stone_ranger', 'stone_rogue', 'longbow', 'hunters_bow', 'scout_hood', 'brigandine'] },
  side_ruin_lodge: { name: 'What\'s Left of the Stores', items: ['mega_tonic', 'hi_ether', 'dawn_plume', 'panacea', 'tonic_mist', 'bedroll', 'fire_bomb', 'frost_bomb', 'holy_water', 'feather_cape', 'hunters_eye', 'ashwood_bow', 'ashen_coat', 'ashen_hood'] },
};

// ---------------------------------------------------------------------------
// Maps
// ---------------------------------------------------------------------------

const toWorld = (x, y, w = 1, h = 1) => ({ x, y, w, h, to: '@world' });
const go = (x, y, to, tx, ty, dir, w = 1, h = 1) => ({ x, y, w, h, to, tx, ty, dir });
const fish = (x, y, region) => ({ x, y, hint: 'Fish', run: (s) => s.fish(region) });
const lair = (id, x, y, r = 2) => ({ id: `lair_${id}`, x: x - r, y: y - r, w: r * 2 + 1, h: r * 2 + 1, once: false, ...bountyLair(id) });
const dungeon = { noTravel: true };
/** A layout's prop rows with extra props stamped in: [[x, y, legendChar], ...]. */
const withProps = (layout, extra) => layout.props.map((row, y) => [...row].map((c, x) => extra.find(([px, py]) => px === x && py === y)?.[2] ?? c).join(''));

/** @type {import('../../types/data').MapDef[]} */
const MAPS = [
  // ---------------- Hunters' Lodge (Act I)
  {
    ...LODGE, id: 'side_lodge', name: 'The Hunters\' Lodge', region: 'Brackenmoor', mood: 'morning', music: 'town', battleBg: 'fields', treeType: 'tree_autumn',
    npcs: [
      { id: 'sill', name: 'Old Sill', look: 'sill', x: 23, y: 20, dir: 'up', run: (s) => SIDE.angler(s) },
      { id: 'hunter1', name: 'Tamsk', look: 'side_hunter', x: 8, y: 15, wander: 2, talk: ['Bounties pay better than honest work. Also, they are honest work. Mostly.', 'Brackenmoor\'s east of here. Take the gate and mind your ankles.'] },
      { id: 'hunter2', name: 'Reyna', look: 'villager_33', x: 28, y: 12, dir: 'left', talk: ['The old man built this Lodge with his hands. Harrow. Something killed him in a hollow south of the moor.', 'Adelind won\'t post it. Says we\'re not good enough. She\'s right, which is the annoying part.'] },
    ],
    inspect: [fish(23, 19, 'river'), fish(29, 23, 'river')],
    exits: [toWorld(17, 27), go(35, 16, 'side_moor', 1, 16, 'right')],
    onEnter: (s) => SIDE.lodgeArrive(s),
  },
  {
    ...LODGE_HALL, id: 'side_lodge_hall', name: 'Lodge Hall', mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, music: 'town',
    npcs: [
      { id: 'adelind', name: 'Adelind', look: 'adelind', x: 8, y: 4, dir: 'down', hint: 'Bounties', run: (s) => SIDE.adelind(s) },
      { id: 'storekeep', name: 'Lodge Stores', look: 'villager_41', x: 3, y: 5, dir: 'right', hint: 'Shop', run: async (s) => { await s.say('Lodge Stores', 'Bombs, arrows, and things that go in wounds. Buy something.'); await s.shop('side_lodge'); } },
    ],
    exits: [go(8, 11, 'side_lodge', 17, 11, 'down')],
  },
  {
    ...MOOR, id: 'side_moor', name: 'Brackenmoor', region: 'The Hunters\' Country', mood: 'day', music: 'field', battleBg: 'fields', treeType: 'tree_autumn',
    encounters: { rate: 1, bg: 'fields', troops: [['side_moor_hounds', 3], ['side_moor_crows', 2], ['side_moor_boars', 2], ['side_moor_mix', 2]] },
    inspect: [fish(9, 30, 'river'), fish(26, 18, 'river')],
    chests: [{ id: 'm1', x: 33, y: 11, item: 'hi_tonic', count: 2 }, { id: 'm2', x: 46, y: 30, gold: 400 }],
    triggers: [lair('bristleback', 19, 6), lair('lanternjaw', 12, 24), lair('gravelgut', 42, 7)],
    exits: [go(0, 16, 'side_lodge', 34, 16, 'left')],
  },
  {
    ...BANE, id: 'side_bane_hollow', name: 'Harrow\'s Hollow', region: 'Brackenmoor', mood: 'forest', music: 'tension', battleBg: 'forest', ...dungeon,
    triggers: [{ id: 'bane', x: 13, y: 11, w: 5, h: 3, once: false, cond: (st) => !st.flags.side_bane_done, run: (s) => SIDE.bane(s) }],
    exits: [toWorld(0, 11)],
  },
  // ---------------- The Drowned Observatory (Act I)
  {
    ...OBS_SHORE, id: 'side_obs_shore', name: 'The Drowned Observatory', region: 'Gale Coast', mood: 'day', music: 'sea', battleBg: 'beach', backdrop: 'ocean', ...dungeon,
    scatter: { types: ['rock_small', 'debris'], density: 0.03, seed: 74 },
    encounters: { rate: 0.9, bg: 'beach', troops: [['side_obs_crabs', 3], ['side_obs_jelly', 2], ['side_obs_mix', 2]] },
    inspect: [fish(11, 25, 'sea'), fish(30, 16, 'sea')],
    triggers: [lair('pinch', 31, 17, 1)],
    exits: [toWorld(20, 31), go(20, 4, 'side_obs_galleries', 23, 33, 'up')],
    onEnter: (s) => SIDE.observatoryArrive(s),
  },
  {
    ...OBS_GALLERIES, id: 'side_obs_galleries', name: 'The Flooded Galleries', region: 'Drowned Observatory', mood: 'cave', music: 'cave', battleBg: 'tidecave', ...dungeon,
    encounters: { rate: 1.1, bg: 'tidecave', troops: [['side_obs_jelly', 2], ['side_obs_golem', 2], ['side_obs_mix', 2]] },
    blockers: [{ id: 'obs_seal', x: 22, y: 2, prop: 'crystal' }],
    inspect: [{ x: 7, y: 20, hint: 'Lens', run: (s) => SIDE.lens(s) }],
    chests: [{ id: 'g1', x: 5, y: 8, item: 'silver_circlet' }, { id: 'g2', x: 40, y: 10, item: 'ether', count: 3 }, { id: 'g3', x: 38, y: 28, item: 'magic_fruit' }],
    exits: [go(23, 35, 'side_obs_shore', 20, 5, 'down'), go(22, 2, 'side_obs_dome', 15, 23, 'up')],
  },
  {
    ...OBS_DOME, id: 'side_obs_dome', name: 'The Dome of Measures', region: 'Drowned Observatory', mood: 'temple', music: 'cassian', ...dungeon,
    inspect: [{ x: 15, y: 11, hint: 'Orrery', run: (s) => SIDE.orrery(s) }],
    chests: [{ id: 'd1', x: 15, y: 5, item: 'sage_ring' }],
    exits: [go(15, 25, 'side_obs_galleries', 22, 3, 'down')],
  },
  // ---------------- Fort Ashwatch (Act I)
  {
    ...ASH_BAILEY, id: 'side_ash_bailey', name: 'Fort Ashwatch', region: 'The Greyspine Foothills', mood: 'dusk', music: 'tension', battleBg: 'ruin', treeType: 'tree_dead', ...dungeon,
    encounters: { rate: 1, bg: 'ruin', troops: [['side_ash_bones', 3], ['side_ash_hounds', 2], ['side_ash_mix', 2]] },
    inspect: [{ x: 9, y: 8, hint: 'Graves', run: (s) => SIDE.graves(s) }],
    chests: [{ id: 'b1', x: 4, y: 30, item: 'hi_tonic', count: 3 }, { id: 'b2', x: 40, y: 29, gold: 1200 }],
    triggers: [lair('mange', 35, 18)],
    exits: [toWorld(22, 35)],
    onEnter: (s) => SIDE.ashwatchArrive(s),
  },
  {
    ...ASH_KEEP, id: 'side_ash_keep', name: 'Ashwatch Keep', region: 'Fort Ashwatch', mood: 'interior', music: 'tension', battleBg: 'temple', ...dungeon,
    encounters: { rate: 0.8, bg: 'temple', troops: [['side_ash_knight', 3], ['side_ash_mix', 2]] },
    inspect: [{ x: 6, y: 13, hint: 'Office', run: (s) => SIDE.aldousOffice(s) }],
    chests: [{ id: 'k1', x: 36, y: 26, item: 'silversteel_plate' }, { id: 'k2', x: 3, y: 25, item: 'guard_fruit' }],
    triggers: [{ id: 'duke', x: 18, y: 2, w: 5, h: 3, once: false, cond: (st) => !st.flags.side_ash_duke, run: (s) => SIDE.ironDuke(s) }],
    exits: [go(20, 31, 'side_ash_bailey', 22, 11, 'down'), go(20, 1, 'side_ash_tower', 13, 19, 'up')],
  },
  {
    ...ASH_TOWER, id: 'side_ash_tower', name: 'The Signal Tower', region: 'Fort Ashwatch', mood: 'dusk', music: 'resolve', ...dungeon,
    inspect: [{ x: 13, y: 8, hint: 'Brazier', run: (s) => SIDE.brazier(s) }],
    exits: [go(13, 21, 'side_ash_keep', 20, 3, 'down')],
  },
  // ---------------- The Ruined Lodge & Ashen Reach (Act II)
  {
    ...RUIN_LODGE, id: 'side_ruin_lodge', name: 'The Lodge, After', region: 'A shard of Brackenmoor', mood: 'ruin', music: 'ruin', battleBg: 'ruin',
    npcs: [
      { id: 'hesper', name: 'Hesper', look: 'hesper', x: 4, y: 13, dir: 'right', hint: 'Bounties', run: (s) => SIDE.hesper(s) },
      { id: 'sill2', name: 'Old Sill', look: 'sill', x: 6, y: 17, dir: 'down', run: (s) => SIDE.angler(s) },
      { id: 'stores2', name: 'Stores', look: 'side_hunter', x: 20, y: 18, dir: 'left', hint: 'Shop', run: async (s) => { await s.say('Stores', 'Everything\'s twice the price and half the quality. That\'s the apocalypse for you.'); await s.shop('side_ruin_lodge'); } },
    ],
    inspect: [fish(3, 18, 'void')],
    exits: [toWorld(17, 26), go(34, 13, 'side_ashen_reach', 1, 19, 'right')],
  },
  {
    ...ASHEN_REACH, id: 'side_ashen_reach', name: 'The Ashen Reach', region: 'The Ruin', mood: 'ruin', music: 'ruin', battleBg: 'ruin',
    encounters: { rate: 1, bg: 'ruin', troops: [['side_reach_birds', 2], ['side_reach_hounds', 2], ['side_reach_crawl', 2], ['side_reach_mix', 2]] },
    inspect: [fish(16, 12, 'void'), fish(40, 26, 'void')],
    chests: [{ id: 'r1', x: 15, y: 6, item: 'mega_tonic', count: 2 }, { id: 'r2', x: 41, y: 25, item: 'spirit_fruit' }],
    triggers: [lair('cinderwing', 23, 6), lair('glasshide', 22, 30), lair('gravemouth', 46, 5)],
    exits: [go(0, 19, 'side_ruin_lodge', 33, 13, 'left'), toWorld(51, 19)],
  },
  // ---------------- The Hollow Bell (Act II)
  {
    ...BELL_TOP, id: 'side_bell_top', name: 'The Hollow Bell', region: 'The Abbey of Hours', mood: 'ruin', music: 'ruin', ...dungeon,
    exits: [toWorld(15, 23), go(15, 5, 'side_bell_nave', 20, 2, 'down')],
    onEnter: (s) => SIDE.bellArrive(s),
  },
  {
    ...BELL_NAVE, id: 'side_bell_nave', name: 'The Inverted Nave', region: 'The Hollow Bell', mood: 'temple', music: 'gloam', battleBg: 'temple', ...dungeon,
    encounters: { rate: 1, bg: 'temple', troops: [['side_bell_bats', 2], ['side_bell_choir', 2], ['side_bell_clapper', 2]] },
    npcs: [{ id: 'sexton', name: 'Sexton Orrin', look: 'sexton', x: 30, y: 16, dir: 'left', run: (s) => SIDE.sexton(s) }],
    blockers: [{ id: 'nave_seal_a', x: 19, y: 42, prop: 'pillar' }, { id: 'nave_seal_b', x: 20, y: 42, prop: 'pillar' }, { id: 'nave_seal_c', x: 21, y: 42, prop: 'pillar' }],
    inspect: [
      { x: 37, y: 5, hint: 'Chime', run: (s) => chime('a')(s) },
      { x: 2, y: 16, hint: 'Chime', run: (s) => chime('b')(s) },
      { x: 37, y: 27, hint: 'Chime', run: (s) => chime('c')(s) },
    ],
    chests: [{ id: 'n1', x: 4, y: 4, item: 'hi_ether', count: 2 }, { id: 'n2', x: 35, y: 38, item: 'wisdom_seed' }],
    triggers: [lair('choirmother', 10, 27)],
    exits: [go(20, 0, 'side_bell_top', 15, 6, 'down'), go(19, 43, 'side_bell_belfry', 14, 2, 'down', 3, 1)],
  },
  {
    ...BELL_BELFRY, id: 'side_bell_belfry', name: 'The Belfry', region: 'The Hollow Bell', mood: 'temple', music: 'sad', ...dungeon,
    props: withProps(BELL_BELFRY, [[14, 6, 'N']]), // the great bell Agathe rings
    npcs: [{ id: 'agathe', name: 'Agathe', look: 'agathe', x: 14, y: 8, dir: 'up', run: (s) => SIDE.agathe(s) }],
    triggers: [{ id: 'bell', x: 11, y: 9, w: 7, h: 2, once: false, cond: (st) => !st.flags.side_bell_done, run: (s) => SIDE.hollowBell(s) }],
    exits: [go(14, 0, 'side_bell_nave', 20, 41, 'up')],
  },
  // ---------------- The Garden That Remembers (Act II)
  {
    ...GARDEN_GATE, id: 'side_garden_gate', name: 'The Garden That Remembers', region: 'A cemetery shard', mood: 'ruin', music: 'sad', battleBg: 'verdance', treeType: 'tree_cherry', ...dungeon,
    npcs: [{ id: 'lc_gardener', name: 'Sexton Mabry', look: 'lc_gardener', x: 20, y: 15, dir: 'down', hint: 'Lost Crest', cond: (st) => (st.chapter || 0) >= 9, run: (s) => LOST_QUESTS.giver(s, 'mnemonist') }],
    encounters: { rate: 0.9, bg: 'verdance', troops: [['side_garden_maws', 2], ['side_garden_wraith', 2]] },
    inspect: [
      fish(29, 21, 'river'),
      { x: 14, y: 20, hint: 'Flower', run: (s) => flower('Tell Mara the bread is in the oven. Tell her it\'s her turn to burn it.')(s) },
      { x: 26, y: 24, hint: 'Flower', run: (s) => flower('It doesn\'t hurt. I promise. Go on, go — I\'ll catch up.')(s) },
      { x: 8, y: 12, hint: 'Flower', run: (s) => flower('Did the sun come up? Somebody tell me the sun came up.')(s) },
    ],
    triggers: [lair('thornmaiden', 31, 9)],
    exits: [toWorld(20, 29), go(20, 0, 'side_garden_maze', 21, 33, 'up')],
    onEnter: (s) => SIDE.gardenArrive(s),
  },
  {
    ...GARDEN_MAZE, id: 'side_garden_maze', name: 'The Hedge of Last Words', region: 'The Garden That Remembers', mood: 'ruin', music: 'sad', battleBg: 'verdance', treeType: 'tree_cherry', ...dungeon,
    blockers: [{ id: 'lc_mnemonist', x: 37, y: 10, w: 1, h: 1, prop: 'tombstone' }],
    noMinimap: true, // it's a hedge maze
    encounters: { rate: 1, bg: 'verdance', troops: [['side_garden_maws', 2], ['side_garden_wraith', 2], ['side_garden_oak', 2]] },
    npcs: [{ id: 'gardener', name: 'The White Gardener', look: 'white_gardener', x: 21, y: 16, dir: 'down', run: (s) => SIDE.gardener(s) }],
    inspect: [
    { x: 37, y: 10, hint: 'Crest-glass', run: (s) => LOST_QUESTS.shrine(s, 'mnemonist') },
      { x: 6, y: 30, hint: 'Flower', run: (s) => flower('I should have called you back. Every day, I should have called you back.')(s) },
      { x: 38, y: 8, hint: 'Flower', run: (s) => flower('The boy\'s name is Tam. Look after him. He\'s scared of the dark.')(s) },
    ],
    chests: [{ id: 'z1', x: 3, y: 3, item: 'x_tonic', count: 2 }, { id: 'z2', x: 40, y: 32, item: 'vigor_seed' }, { id: 'z3', x: 30, y: 20, item: 'sunshard_robe' }],
    exits: [go(21, 35, 'side_garden_gate', 20, 2, 'down'), go(20, 0, 'side_garden_heart', 15, 23, 'up', 3, 1)],
  },
  {
    ...GARDEN_HEART, id: 'side_garden_heart', name: 'The Heart of the Garden', region: 'The Garden That Remembers', mood: 'evernoon', music: 'sad', ...dungeon,
    triggers: [{ id: 'bloom', x: 12, y: 9, w: 7, h: 3, once: false, cond: (st) => !st.flags.side_garden_done, run: (s) => SIDE.lastBloom(s) }],
    exits: [go(15, 25, 'side_garden_maze', 21, 1, 'down')],
  },
  // ---------------- Hidden hunt II
  {
    ...NADIR, id: 'side_nadir', name: 'Under the Black Star', region: 'Above the Seven Wounds', mood: 'gloam', music: 'abyss', ...dungeon,
    triggers: [{ id: 'star', x: 12, y: 10, w: 7, h: 3, once: false, cond: (st) => !st.flags.side_star_done, run: (s) => SIDE.blackStar(s) }],
    exits: [toWorld(15, 25)],
  },
];

// ---------------------------------------------------------------------------
// World map
// ---------------------------------------------------------------------------

const ch = (n) => (st) => (st.chapter || 0) >= n;
/** @type {import('../../types/data').WorldNode[]} */
const WORLD_NODES = [
  { id: 'side_lodge', name: 'Hunters\' Lodge', region: 'Brackenmoor', act: 1, x: 365, y: 560, mapId: 'side_lodge', tx: 17, ty: 26, dir: 'up', unlock: ch(2), desc: 'Bounties for monsters too much for a village.' },
  { id: 'side_observatory', name: 'Drowned Observatory', region: 'Gale Coast', act: 1, x: 290, y: 615, mapId: 'side_obs_shore', tx: 20, ty: 30, dir: 'up', unlock: ch(3), desc: 'At low tide, a causeway rises to a dome older than the Lanterns.' },
  { id: 'side_ashwatch', name: 'Fort Ashwatch', region: 'Greyspine Foothills', act: 1, x: 455, y: 300, mapId: 'side_ash_bailey', tx: 22, ty: 34, dir: 'up', unlock: ch(4), desc: 'An abandoned Dawnguard fort. Sir Aldous\'s old command.' },
  { id: 'side_hollow', name: 'Harrow\'s Hollow', region: 'Brackenmoor', act: 1, x: 340, y: 600, mapId: 'side_bane_hollow', tx: 1, ty: 11, dir: 'right', unlock: 'side_hollow_open', desc: 'Where the Lodge\'s founder died.' },
  { id: 'side_ruin_lodge', name: 'The Lodge, After', region: 'A shard of Brackenmoor', act: 2, x: 365, y: 560, mapId: 'side_ruin_lodge', tx: 17, ty: 25, dir: 'up', unlock: ch(6), desc: 'The Hunters\' Lodge survived. Some of it.' },
  { id: 'side_bell', name: 'The Hollow Bell', region: 'The Abbey of Hours', act: 2, x: 610, y: 290, mapId: 'side_bell_top', tx: 15, ty: 22, dir: 'up', unlock: ch(7), desc: 'A bell-tower hanging upside-down under a shard. It rings on its own.' },
  { id: 'side_garden', name: 'The Garden That Remembers', region: 'A cemetery shard', act: 2, x: 760, y: 430, mapId: 'side_garden_gate', tx: 20, ty: 28, dir: 'up', unlock: ch(9), desc: 'White flowers that speak the last words of the dead.' },
  { id: 'side_nadir', name: 'The Black Star', region: 'Above the Seven Wounds', act: 2, x: 500, y: 90, mapId: 'side_nadir', tx: 15, ty: 24, dir: 'up', unlock: 'side_nadir_open', desc: 'It does not shine. It takes.' },
];

/** @type {import('../../types/data').ContentPack} */
export default { maps: MAPS, enemies: ENEMIES, troops: TROOPS, looks: LOOKS, bossAI: BOSS_AI, shops: SHOPS, worldNodes: WORLD_NODES };
