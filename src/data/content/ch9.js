// Content pack: ch9 — "The Halcyon" (Lv 46–50, gear tier 7). See docs/AUTHORING.md.
// Corvin's Roost, the Boneyard, the wreck of the Benediction, the Cinderdeep.

import { ITEMS } from '../items.js';
import { EQUIPMENT, gearOfTier } from '../equipment.js';
import { roost, lastCall, ledgerHouse } from '../maps/ch9_roost.js';
import { boneyard, benediction, benedictionCabin, cinderdeep, halcyonFlight } from '../maps/ch9_dungeons.js';

// ------------------------------------------------------------------ items
ITEMS.c9_lift_key = { name: 'Boneyard Lift Key', kind: 'key', desc: 'Mags\'s key to the lift down to the Boneyard. Greasy, and proud of it.', icon: '✪' };
ITEMS.c9_permit = { name: 'Odessa\'s Mining Permit', kind: 'key', desc: 'Stamped in violet ink: ADMIT BEARERS. DO NOT DIE ON MY PROPERTY.', icon: '✪' };
ITEMS.c9_pilgrim_clock = { name: 'Pilgrim\'s Clock', kind: 'key', desc: 'A brass carriage clock from the Benediction. It stopped at seven minutes past the end of the world.', icon: '✪' };
const accessory = (id, def) => { EQUIPMENT[id] = { id, slot: 'accessory', tier: 0, price: 0, ...def }; };
accessory('c9_gamblers_ace', { name: 'Gambler\'s Ace', lck: 12, mods: { crit: 8 }, desc: 'LCK +12, crit +8%. Ferro swears it isn\'t marked.' });
accessory('c9_mags_goggles', { name: 'Mags\'s Goggles', spd: 4, immune: ['blind'], desc: 'SPD +4, immune to Blind. Too big. You\'ll grow.' });

// ------------------------------------------------------------------ looks
const SK = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };
const look = (id, skin, hair, outfit, extra = {}) => ({ id, skin, hair, outfit, ...extra });
const looks = {
  odessa: look('odessa', SK.brown, { style: 'long', color: '#e8e4e0' },
    { style: 'coat', main: '#3a2440', accent: '#e8d8b0', trim: '#d4a83a', pants: '#2a2030', boots: '#1a1418' },
    { eyes: '#c8a040', acc: ['hat_wide', 'feather'], build: 'tall' }),
  mags: look('mags', SK.tan, { style: 'bun', color: '#b8b0a8' },
    { style: 'vest', main: '#6a4a2a', accent: '#c8b898', trim: '#3a2a1a', pants: '#4a4038', boots: '#3a2a20' },
    { acc: ['glasses', 'scarf'] }),
  severine: look('severine', SK.fair, { style: 'short', color: '#d8c890' },
    { style: 'armor', main: '#c8ccd4', metal: '#e0e4ec', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' },
    { eyes: '#4a6a8a', acc: ['eyepatch', 'cape'], capeColor: '#8a2a2a', weapon: 'spear', build: 'tall' }),
  c9_bailiff: look('c9_bailiff', SK.fair, { style: 'short', color: '#2a2a2a' },
    { style: 'coat', main: '#2a2a30', accent: '#a83a3a', trim: '#c9a24a', pants: '#1a1a20' },
    { acc: ['hat_wide'], build: 'large', weapon: 'fist' }),
  c9_sky_marine: look('c9_sky_marine', SK.tan, { style: 'short', color: '#4a3a2a' },
    { style: 'armor', main: '#8a94a8', metal: '#b8c4d4', accent: '#c03a3a', trim: '#d7a83a', pants: '#2a3040' },
    { acc: ['helmet'], weapon: 'gun' }),
  c9_scavenger: look('c9_scavenger', SK.warm, { style: 'messy', color: '#6a4a2a' },
    { style: 'rags', main: '#6a5a4a', accent: '#a88a5a', pants: '#3a3028' },
    { acc: ['glasses', 'bandana'], weapon: 'spear' }),
  c9_tuck: look('c9_tuck', SK.deep, { style: 'bald', color: '#000' },
    { style: 'vest', main: '#7a3a2a', accent: '#e8dcc0', trim: '#3a2a1a', pants: '#3a3030' }, { acc: ['beard'], build: 'large' }),
  c9_ruddock: look('c9_ruddock', SK.tan, { style: 'messy', color: '#d8d4d0' },
    { style: 'coat', main: '#3a4a5a', accent: '#c8b898', trim: '#6a5a4a', pants: '#3a3a40' }, { acc: ['hat_wide', 'beard'] }),
  c9_penny: look('c9_penny', SK.brown, { style: 'bob', color: '#2a1a14' },
    { style: 'dress', main: '#5a6a8a', accent: '#efe4cc', trim: '#c9a24a' }, { acc: ['glasses'] }),
  c9_ferro: look('c9_ferro', SK.warm, { style: 'short', color: '#a8a4a0' },
    { style: 'coat', main: '#2a4a3a', accent: '#e8dcc0', trim: '#c9a24a', pants: '#2a2a2a' }, { acc: ['eyepatch', 'beard'] }),
  c9_ox: look('c9_ox', SK.deep, { style: 'bald', color: '#000' },
    { style: 'rags', main: '#5a4a3a', accent: '#8a7a5a', pants: '#3a3028' }, { build: 'large' }),
  c9_wick: look('c9_wick', SK.fair, { style: 'messy', color: '#8a6a4a' },
    { style: 'robe', main: '#4a5a6a', accent: '#d8ccb0', trim: '#8a6a3a' }, { acc: ['glasses'] }),
  c9_gemma: look('c9_gemma', SK.tan, { style: 'ponytail', color: '#3a2a1a' },
    { style: 'coat', main: '#5a2a2a', accent: '#e8dcc0', trim: '#c9a24a', pants: '#2a2a30' }, { acc: ['bandana'] }),
  c9_amsel: look('c9_amsel', SK.pale, { style: 'short', color: '#6a5a4a' },
    { style: 'robe', main: '#a89a80', accent: '#d8ccb0', trim: '#6a5a40' }, { acc: ['hood'] }),
  c9_hesper: look('c9_hesper', SK.warm, { style: 'bun', color: '#e0dcd8' },
    { style: 'dress', main: '#3a3a4a', accent: '#a8a0c0', trim: '#5a5a6a' }, { acc: ['scarf'] }),
  c9_lonnie: look('c9_lonnie', SK.fair, { style: 'messy', color: '#c8a050' },
    { style: 'rags', main: '#7a6a4a', accent: '#a89878', pants: '#4a4030' }),
  c9_miner: look('c9_miner', SK.tan, { style: 'short', color: '#3a2a1a' },
    { style: 'vest', main: '#5a4030', accent: '#a08060', trim: '#3a2a1a', pants: '#3a3028' }, { acc: ['headband'] }),
  c9_miner_f: look('c9_miner_f', SK.brown, { style: 'ponytail', color: '#1a1410' },
    { style: 'vest', main: '#4a3a3a', accent: '#a08060', trim: '#3a2a1a', pants: '#3a3028' }, { acc: ['headband'] }),
  c9_kid_a: look('c9_kid_a', SK.warm, { style: 'messy', color: '#c0642e' },
    { style: 'tunic', main: '#4a7a6a', accent: '#e8dcc0', trim: '#6a4a2a', pants: '#4a3a2c' }, { build: 'child' }),
  c9_kid_b: look('c9_kid_b', SK.brown, { style: 'twintails', color: '#2a1a14' },
    { style: 'dress', main: '#a85a5a', accent: '#f0e0c8', trim: '#6a4a2a' }, { build: 'child' }),
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
/** @type {import('../../types/data').EnemyDef[]} */
const enemies = [
  // --- the Roost's collectors
  E('c9_bailiff', 'Ledger Bailiff', 45, { type: 'humanoid', look: 'c9_bailiff' }, {
    stats: { hp: 1.1, str: 1.05 }, weak: ['bolt', 'slash'], poise: 3,
    skills: [['attack', 3], ['e_stun', 1], ['e_steal', 1]], drops: [['hi_tonic', 0.3]], steal: ['hi_tonic', 'hi_ether'],
    desc: 'Odessa\'s debt collectors. They are polite right up to the moment they are not.',
  }),
  E('c9_debt_hound', 'Collection Hound', 45, { type: 'hound', color: '#4a3a3a', accent: '#c9a24a', eye: '#ffd060', seed: 91 }, {
    stats: { hp: 0.9, spd: 1.25 }, weak: ['fire', 'pierce'], poise: 2,
    skills: [['e_bite', 3], ['e_howl', 1]], drops: [['tonic', 0.3]], steal: ['hi_tonic', 'mega_tonic'],
    desc: 'Trained to find anyone who owes the Ledger money. It is never bored.',
  }),

  // --- the Boneyard
  E('c9_rustback', 'Rustback Rat', 46, { type: 'hound', color: '#8a5a3a', accent: '#c87a4a', eye: '#ff5030', seed: 46 }, {
    stats: { hp: 0.9, spd: 1.25 }, weak: ['fire', 'pierce'], poise: 2,
    skills: [['e_bite', 3], ['e_sting', 1]], drops: [['antidote', 0.3], ['scrap_gear', 0.3]], steal: ['hi_tonic', 'scrap_gear'],
    desc: 'Rats that learned to eat rust. Their bite turns your blood a funny colour.',
  }),
  E('c9_scrap_golem', 'Scrap Golem', 47, { type: 'golem', color: '#7a6a5a', accent: '#c8a050', eye: '#ffb040', seed: 47 }, {
    stats: { hp: 1.4, def: 1.5, spd: 0.75 }, weak: ['bolt', 'blunt'], resist: { slash: 0.6, pierce: 0.6 }, poise: 4,
    skills: [['attack', 2], ['e_slam', 2], ['e_shell', 1]], drops: [['scrap_gear', 0.5], ['mega_tonic', 0.1]], steal: ['scrap_gear', 'guard_fruit'],
    desc: 'Hull plate, rivets and a grudge. The Foreman builds them out of whatever falls.',
  }),
  E('c9_cogwisp', 'Cogwisp', 46, { type: 'wisp', color: '#ffe080', eye: '#ffffff', seed: 48 }, {
    stats: { hp: 0.7, mag: 1.3, def: 2, res: 0.7, evade: 10 }, weak: ['ice', 'wind'], resist: { bolt: -1, slash: 0.5, pierce: 0.5, blunt: 0.5 }, poise: 2,
    skills: [['e_spark', 3], ['e_thunder', 1], ['e_mpdrain', 1]], drops: [['hi_ether', 0.15]], steal: ['hi_ether', 'bolt_bomb'],
    desc: 'The last spark of a dead engine, still looking for something to turn.',
  }),
  E('c9_wreck_crow', 'Wreck Crow', 46, { type: 'bird', color: '#3a3a44', accent: '#8a7a5a', eye: '#ffd040', seed: 49 }, {
    stats: { hp: 0.8, spd: 1.4 }, weak: ['pierce', 'bolt'], poise: 2,
    skills: [['e_peck', 3], ['e_blind', 1], ['e_steal', 1]], drops: [['eye_drops', 0.3]], steal: ['eye_drops', 'sun_goggles'],
    desc: 'Collects shiny things from the wrecks. Considers your eyes shiny.',
  }),
  E('c9_scavenger', 'Boneyard Picker', 47, { type: 'humanoid', look: 'c9_scavenger' }, {
    stats: { hp: 1.0, spd: 1.1 }, weak: ['slash', 'bolt'], poise: 3,
    skills: [['e_spear', 2], ['e_ember', 1], ['e_steal', 1]], drops: [['hi_tonic', 0.2], ['fire_bomb', 0.15]], steal: ['fire_bomb', 'scrap_gear'],
    desc: 'Scrappers who went too deep and decided the wrecks belonged to them now.',
  }),
  E('c9_rivet_drone', 'Rivet Drone', 46, { type: 'insect', color: '#a87a4a', accent: '#ffd060', eye: '#ff4020', seed: 50 }, {
    stats: { hp: 0.6, spd: 1.3 }, weak: ['bolt', 'wind'], resist: { pierce: 0.6 }, poise: 2,
    skills: [['e_sting', 2], ['e_spark', 1]], drops: [['scrap_gear', 0.4]], steal: ['scrap_gear', 'hi_ether'],
    desc: 'A rivet gun that learned to fly. The Foreman bolts them together in a hurry.',
  }),
  E('c9_foreman', 'The Foreman', 48, { type: 'golem', color: '#8a5a3a', accent: '#ff9a40', eye: '#ffd060', size: 3, seed: 51 }, {
    boss: true, stats: { hp: 14, str: 1.2, def: 1.3, mag: 1.1, exp: 8, gold: 8, cp: 4 }, weak: ['bolt', 'blunt'], resist: { pierce: 0.5, slash: 0.7, fire: 0.5 }, poise: 8,
    ai: 'c9_foreman', summons: ['c9_rivet_drone'], drops: [['power_fruit', 1]], steal: ['mega_tonic', 'guard_fruit'],
    desc: 'Something in the Boneyard wanted to fly again, and built itself out of every ship that couldn\'t.',
  }),
  E('c9_mimic', 'Gilded Strongbox', 50, { type: 'mimic', color: '#c9a24a', accent: '#6a3a2a', eye: '#ff3030' }, {
    stats: { hp: 3, str: 1.25, def: 1.4, exp: 4, gold: 6, cp: 2 }, weak: ['ice', 'pierce'], resist: { fire: 0.5 }, poise: 5,
    skills: [['e_bite', 3], ['e_crush', 1], ['e_steal', 1]], drops: [['thiefs_glove', 1]], steal: ['mega_tonic', 'x_tonic'],
    desc: 'The Gilded Gull\'s strongbox. It has been hungry for a very long time.',
  }),

  // --- the Benediction
  E('c9_hollow_pilgrim', 'Hollow Pilgrim', 47, { type: 'ghost', color: '#a8b0c8', eye: '#ffe080', seed: 52 }, {
    stats: { hp: 1.0, mag: 1.1, def: 1.6, res: 0.8, evade: 6 }, weak: ['light', 'fire'], resist: { slash: 0.6, pierce: 0.6, blunt: 0.7, dark: 0 }, poise: 3,
    skills: [['e_dark', 2], ['e_wail', 1], ['e_sleep', 1]], drops: [['gloam_dust', 0.4], ['ether', 0.2]], steal: ['holy_water', 'hi_ether'],
    desc: 'They were flying in to hear the Vespersong. They are still singing along.',
  }),
  E('c9_squall_harpy', 'Squall Harpy', 48, { type: 'bird', color: '#6a7a90', accent: '#c8d8f0', eye: '#80f0ff', size: 1.5, seed: 53 }, {
    stats: { hp: 0.9, spd: 1.35 }, weak: ['pierce', 'ice'], resist: { wind: 0.5 }, poise: 3,
    skills: [['e_gust', 2], ['e_peck', 2], ['e_thunder', 0.5]], drops: [['gale_bomb', 0.2]], steal: ['gale_bomb', 'feather_cape'],
    desc: 'Rides the Squall the way gulls rode the sea. Screams like it, too.',
  }),
  E('c9_rigging_spider', 'Rigging Spider', 48, { type: 'spider', color: '#4a4a5a', accent: '#a0b0c0', eye: '#ff6060', seed: 54 }, {
    stats: { hp: 1.1, def: 1.2 }, weak: ['fire', 'slash'], poise: 3,
    skills: [['e_bite', 2], ['e_poison', 1], ['e_constrict', 1]], drops: [['antidote', 0.4]], steal: ['antidote', 'panacea'],
    desc: 'Spins its webs in the shrouds. Most of what it catches is lightning.',
  }),
  E('c9_stormjelly', 'Stormjelly', 47, { type: 'slime', color: '#8ab0e0', eye: '#ffffff', seed: 55 }, {
    stats: { hp: 1.2, res: 1.3 }, weak: ['wind', 'pierce'], resist: { bolt: -1, ice: 0.5 }, poise: 3,
    skills: [['e_spark', 2], ['e_thunder', 1], ['e_shell', 1]], drops: [['bolt_bomb', 0.2]], steal: ['bolt_bomb', 'storm_ring'],
    desc: 'A jelly of rainwater that drifts through the Squall, swallowing lightning.',
  }),
  E('c9_choir_templar', 'Drowned Templar', 49, { type: 'knight', color: '#c8ccd8', accent: '#d7a83a', weapon: 'sword', seed: 56 }, {
    stats: { hp: 1.3, str: 1.1, def: 1.4 }, weak: ['bolt', 'dark'], resist: { light: 0.3 }, poise: 4,
    skills: [['e_slash', 2], ['e_holy', 1], ['e_shell', 1]], drops: [['hi_tonic', 0.3]], steal: ['holy_water', 'mega_tonic'],
    desc: 'The galleon\'s Choir guard. It still stands its watch, a year after the watch ended.',
  }),
  E('c9_squallmaw', 'Squallmaw', 49, { type: 'drake', color: '#4a5a7a', accent: '#c8e8ff', eye: '#a0ffff', size: 3, seed: 57 }, {
    boss: true, stats: { hp: 15, mag: 1.25, spd: 1.1, exp: 8, gold: 8, cp: 4 }, weak: ['ice', 'pierce'], resist: { bolt: -1, wind: 0.5, fire: 0.7 }, poise: 8,
    ai: 'c9_squallmaw', drops: [['swift_fruit', 1]], steal: ['gale_bomb', 'feather_cape'],
    desc: 'A storm drake that nested in the Benediction\'s mainsail and fed on a year of lightning and hymns.',
  }),

  // --- the Cinderdeep
  E('c9_cinder_mole', 'Cinder Mole', 48, { type: 'boar', color: '#6a3a2a', accent: '#ffa060', seed: 58 }, {
    stats: { hp: 1.3, def: 1.2 }, weak: ['ice', 'pierce'], resist: { fire: 0.5 }, poise: 3,
    skills: [['e_tackle', 2], ['e_quake', 1], ['e_ember', 1]], drops: [['burn_salve', 0.4], ['sun_ember', 0.05]], steal: ['burn_salve', 'sun_ember'],
    desc: 'Burrows through rock that has gone soft with heat. Smells of toast.',
  }),
  E('c9_sunslag', 'Sunslag', 49, { type: 'slime', color: '#ff8a30', eye: '#fff0a0', seed: 59 }, {
    stats: { hp: 1.3, def: 0.8, res: 1.2 }, weak: ['ice', 'wind'], resist: { fire: -1, blunt: 0.5 }, poise: 3,
    skills: [['e_ember', 2], ['e_firebreath', 1], ['e_selfdestruct', 0.2]], drops: [['sun_ember', 0.1]], steal: ['fire_bomb', 'sun_ember'],
    desc: 'Molten rock with a sun-ember for a heart. It does not like to be cooled.',
  }),
  E('c9_flare_bat', 'Flare Bat', 48, { type: 'bat', color: '#a84a2a', eye: '#ffe060', seed: 60 }, {
    stats: { hp: 0.8, spd: 1.4, evade: 12 }, weak: ['ice', 'pierce'], resist: { fire: 0.5 }, poise: 2,
    skills: [['e_bite', 2], ['e_drain', 1], ['e_ember', 1]], drops: [['ether', 0.3]], steal: ['hi_ether', 'burn_salve'],
    desc: 'Its wings glow from inside. In the Cinderdeep, the lights that move are never lanterns.',
  }),
  E('c9_ember_golem', 'Ember Golem', 50, { type: 'golem', color: '#5a3a2a', accent: '#ff7a30', eye: '#ffe080', seed: 61 }, {
    stats: { hp: 1.5, def: 1.6, spd: 0.7 }, weak: ['ice', 'blunt'], resist: { fire: 0, slash: 0.6, pierce: 0.6 }, poise: 5,
    skills: [['e_slam', 2], ['e_firebreath', 1], ['e_shell', 1]], drops: [['sun_ember', 0.2], ['mega_tonic', 0.1]], steal: ['sun_ember', 'ember_ring'],
    desc: 'Slag that cooled in the shape of a miner. It still swings a pick.',
  }),
  E('c9_shard_salamander', 'Shard Salamander', 49, { type: 'serpent', color: '#ffb060', accent: '#fff0c0', eye: '#ff3020', seed: 62 }, {
    stats: { hp: 1.1, mag: 1.2 }, weak: ['ice', 'bolt'], resist: { fire: 0.3 }, poise: 3,
    skills: [['e_bite', 2], ['e_firebreath', 1], ['e_constrict', 1]], drops: [['burn_salve', 0.3]], steal: ['fire_bomb', 'magic_fruit'],
    desc: 'Lives in the lava seams. Comes out to sun itself on the sun.',
  }),
  E('c9_sunworm', 'The Sunworm', 50, { type: 'serpent', color: '#ffc060', accent: '#fff8e0', eye: '#ff4020', size: 4, seed: 63 }, {
    boss: true, stats: { hp: 16, str: 1.15, mag: 1.2, exp: 9, gold: 8, cp: 4 }, weak: ['ice', 'pierce'], resist: { fire: -1, blunt: 0.7 }, poise: 9,
    ai: 'c9_sunworm', summons: ['c9_sunslag'], drops: [['magic_fruit', 1], ['sun_ember', 1]], steal: ['mega_tonic', 'ember_heart'],
    desc: 'A worm that found a piece of the broken sun and decided to live inside it.',
  }),

  // --- the Long Bell
  E('c9_sky_marine', 'Dawnguard Marine', 49, { type: 'humanoid', look: 'c9_sky_marine' }, {
    stats: { hp: 1.1, def: 1.2 }, weak: ['dark', 'bolt'], resist: { light: 0.5 }, poise: 3,
    skills: [['e_spear', 2], ['e_volley', 1], ['e_buff', 1]], drops: [['hi_tonic', 0.3]], steal: ['hi_ether', 'mega_tonic'],
    desc: 'The Choir\'s sky marines. They were the Dawnguard once. Some of them still believe it.',
  }),
  E('c9_severine', 'Knight-Captain Severine', 50, { type: 'humanoid', look: 'severine', size: 2 }, {
    boss: true, stats: { hp: 13, str: 1.3, def: 1.3, spd: 1.1, exp: 9, gold: 10, cp: 4 }, weak: ['dark', 'bolt'], resist: { light: 0.3, pierce: 0.7 }, poise: 8,
    ai: 'c9_severine', summons: ['c9_sky_marine'], drops: [['sunshard_lance', 1]], steal: ['mega_tonic', 'dawn_plume'],
    desc: 'Knight-Captain of the Steadfast. She lost an eye in the battle Corvin ran from, and has never once forgiven him.',
  }),
];

// ------------------------------------------------------------------ troops
/**
 * @param {string[]} list
 * @param {Partial<import('../../types/data').TroopDef>} [opts]
 * @returns {import('../../types/data').TroopDef}
 */
const T = (list, opts = {}) => ({ enemies: list, ...opts });
const BOSS = { boss: true, music: 'boss', canFlee: false };
/** @type {Record<string, import('../../types/data').TroopDef>} */
const troops = {
  c9_bailiffs: T(['c9_bailiff', 'c9_debt_hound', 'c9_bailiff'], { canFlee: false }),
  c9_by_rats: T(['c9_rustback', 'c9_rustback', 'c9_rustback']),
  c9_by_golem: T(['c9_scrap_golem', 'c9_cogwisp']),
  c9_by_crows: T(['c9_wreck_crow', 'c9_wreck_crow', 'c9_rustback']),
  c9_by_pickers: T(['c9_scavenger', 'c9_cogwisp', 'c9_scavenger']),
  c9_by_mix: T(['c9_scrap_golem', 'c9_rustback', 'c9_wreck_crow']),
  c9_mimic: T(['c9_mimic'], { canFlee: false }),
  c9_boss_foreman: T(['c9_foreman'], { ...BOSS, bg: 'ruin' }),
  c9_bn_pilgrims: T(['c9_hollow_pilgrim', 'c9_hollow_pilgrim', 'c9_hollow_pilgrim']),
  c9_bn_harpies: T(['c9_squall_harpy', 'c9_squall_harpy']),
  c9_bn_spiders: T(['c9_rigging_spider', 'c9_stormjelly', 'c9_rigging_spider']),
  c9_bn_jelly: T(['c9_stormjelly', 'c9_squall_harpy', 'c9_stormjelly']),
  c9_bn_templar: T(['c9_choir_templar', 'c9_hollow_pilgrim']),
  c9_choir_fore: T(['c9_hollow_pilgrim', 'c9_choir_templar', 'c9_hollow_pilgrim'], { canFlee: false, music: 'boss' }),
  c9_choir_hold: T(['c9_choir_templar', 'c9_hollow_pilgrim', 'c9_choir_templar'], { canFlee: false, music: 'boss' }),
  c9_boss_squallmaw: T(['c9_squallmaw'], { ...BOSS, bg: 'deck', mood: 'storm' }),
  c9_cd_moles: T(['c9_cinder_mole', 'c9_cinder_mole']),
  c9_cd_slag: T(['c9_sunslag', 'c9_flare_bat', 'c9_sunslag']),
  c9_cd_bats: T(['c9_flare_bat', 'c9_flare_bat', 'c9_flare_bat']),
  c9_cd_golem: T(['c9_ember_golem', 'c9_shard_salamander']),
  c9_cd_mix: T(['c9_cinder_mole', 'c9_shard_salamander', 'c9_flare_bat']),
  c9_boss_sunworm: T(['c9_sunworm'], { ...BOSS, bg: 'cave' }),
  c9_boss_severine: T(['c9_sky_marine', 'c9_severine', 'c9_sky_marine'], { ...BOSS, bg: 'ruin' }),
};

// ------------------------------------------------------------------ boss AI
const bossAI = {
  /** Crane arm and slag; every 4th turn it stokes its furnace (telegraph) and empties it next turn. */
  c9_foreman(c) {
    if (c.m.stoked) { c.m.stoked = false; c.say('The Foreman empties its furnace across the yard!'); return c.use('e_bigbreath'); }
    if (c.hpPct < 0.5 && c.once('overclock')) {
      c.say('Gears shriek. The Foreman overclocks — its plating glows red-hot!');
      c.self.addStatus('haste');
      return c.use('e_howl');
    }
    if (c.turn % 4 === 0) { c.m.stoked = true; c.say('The Foreman\'s furnace roars white-hot...'); return c.use('e_charge'); }
    if (c.allies.length < 2 && c.turn > 1 && c.rnd() < 0.35) { c.say('The Foreman bolts together a Rivet Drone from loose scrap!'); return c.use('e_summon'); }
    return c.pick([['e_crush', 2], ['e_slam', 2], ['e_quake', c.hpPct < 0.5 ? 2 : 1], ['e_gravity', 0.6]]);
  },
  /** Charges lightning every 4th turn; below half it rides the storm and its weakness shifts from ice to wind. */
  c9_squallmaw(c) {
    if (c.m.charged) { c.m.charged = false; c.say('THUNDERHEAD! Lightning walks the whole deck!'); return c.use('e_thunder'); }
    if (c.hpPct < 0.5 && c.once('eye')) {
      c.say('Squallmaw tears into the eye of the storm. Frost slides off its crackling hide — but the wind tears at its wings!');
      c.self.weak.delete('ice');
      c.self.resist.ice = 0.5;
      delete c.self.resist.wind;
      c.self.weak.add('wind');
      c.self.revealed.delete('ice');
      return c.use('e_howl');
    }
    if (c.turn % 4 === 2) { c.m.charged = true; c.say('Squallmaw drinks the lightning. The deck begins to hum...'); return c.use('e_charge'); }
    return c.pick([['e_bite', 2], ['e_claw', 2], ['e_gust', c.hpPct < 0.5 ? 2.5 : 1.5], ['e_spark', 1.5]]);
  },
  /** Light-bloom telegraphs; below half it swallows the heart-ember: haste, ice no longer works, wind does. */
  c9_sunworm(c) {
    if (c.m.bloom) { c.m.bloom = false; c.say('The Sunworm opens its throat — the light pours out!'); return c.use('e_bigbreath'); }
    if (c.hpPct < 0.5 && c.once('heart')) {
      c.say('The Sunworm swallows the heart-ember. Its scales blaze white — ice hisses away to steam! But the glare cracks its armour along the seams...');
      c.self.weak.delete('ice');
      c.self.resist.ice = 0.5;
      c.self.weak.add('wind');
      c.self.revealed.delete('ice');
      c.self.addStatus('haste');
      return c.use('e_firebreath');
    }
    if (c.turn % 5 === 3) { c.m.bloom = true; c.say('Light gathers behind the Sunworm\'s scales, brighter and brighter...'); return c.use('e_charge'); }
    if (c.allies.length < 2 && c.turn > 2 && c.rnd() < 0.25) { c.say('Slag bubbles up from the floor and takes shape!'); return c.use('e_summon'); }
    return c.pick([['e_bite', 2], ['e_constrict', 2], ['e_firebreath', 1.5], ['e_quake', 1]]);
  },
  /** Formation fighter: sets her lance (telegraph) for a sweeping charge; calls marines at 60% and 30%. */
  c9_severine(c) {
    if (c.m.lance) { c.m.lance = false; c.say('"Dawnguard — BREAK THEM!" Severine drives her lance through the whole line!'); return c.use('lance_sweep'); }
    if (c.hpPct < 0.6 && c.once('call1')) { c.say('"Marines! To me!"'); return c.use('e_summon'); }
    if (c.hpPct < 0.3 && c.once('call2')) { c.say('"I said TO ME!"'); return c.use('e_summon'); }
    if (c.turn % 4 === 0) { c.m.lance = true; c.say('Severine sets her lance and plants her feet...'); return c.use('e_charge'); }
    if (c.hpPct < 0.5 && c.rnd() < 0.3) return c.use('e_holyall');
    return c.pick([['e_spear', 3], ['skewer', 1.5], ['e_stun', 1], ['e_holy', 1]]);
  },
};

// ------------------------------------------------------------------ shops & world
/** @type {Record<string, import('../../types/data').ShopDef>} */
const shops = {
  c9_exchange: {
    name: 'The Ledger Exchange',
    items: ['mega_tonic', 'hi_ether', 'panacea', 'ember_feather', 'dawn_plume', 'tonic_mist', 'smoke_ball', 'fire_bomb', 'frost_bomb',
      'bolt_bomb', 'gale_bomb', 'holy_water', 'bedroll', 'ember_ring', 'frost_ring', 'storm_ring', 'dusk_ring',
      ...gearOfTier(7, (e) => e.slot !== 'accessory')],
  },
};

/** @type {import('../../types/data').WorldNode[]} */
const worldNodes = [
  { id: 'c9_roost', name: 'Corvin\'s Roost', region: 'The Sunscar Rift', act: 2, x: 640, y: 600, mapId: 'corvins_roost', tx: 14, ty: 34, dir: 'up', unlock: 'c9_arrived', desc: 'A smugglers\' canyon in a fallen mountain. The Halcyon\'s grave — or her cradle.' },
  { id: 'c9_boneyard', name: 'The Boneyard', region: 'The Sunscar Rift', act: 2, x: 612, y: 640, mapId: 'c9_boneyard', tx: 4, ty: 31, dir: 'up', unlock: 'c9_boneyard_open', desc: 'Where the airships fell when the sky broke.' },
  { id: 'c9_benediction', name: 'Wreck of the Benediction', region: 'The Squall', act: 2, x: 735, y: 520, mapId: 'c9_benediction', tx: 22, ty: 39, dir: 'up', unlock: 'c9_bn_arrived', desc: 'A pilgrim galleon pinned in a storm that would not end.' },
  { id: 'c9_cinderdeep', name: 'The Cinderdeep', region: 'The Fallen Shard', act: 2, x: 690, y: 690, mapId: 'c9_cinderdeep', tx: 3, ty: 37, dir: 'up', unlock: 'c9_cinderdeep_open', desc: 'Odessa\'s sun-ember mine. The only warm place left in the world.' },
];

/** @type {import('../../types/data').ContentPack} */
export default {
  maps: [roost, lastCall, ledgerHouse, boneyard, benediction, benedictionCabin, cinderdeep, halcyonFlight],
  enemies, troops, looks, bossAI, shops, worldNodes,
};
