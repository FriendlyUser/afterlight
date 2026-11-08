// Content pack: Chapter 12 — "Evernoon" (final dungeon, final bosses, endings, epilogue).
// Lv 70–80, gear tier 8. Story scripts live in src/story/ch12.js and src/story/ch12_finale.js;
// maps in src/data/maps/ch12_evernoon.js and src/data/maps/ch12_epilogue.js.

import { ITEMS } from '../items.js';
import { EQUIPMENT } from '../equipment.js';
import { SKILLS } from '../skills.js';
import { MOODS } from '../../render/Moods.js';
import { LOOKS } from '../looks.js';
import { C12_DUNGEON_MAPS } from '../maps/ch12_evernoon.js';
import { C12_EPILOGUE_MAPS } from '../maps/ch12_epilogue.js';

// ---------------------------------------------------------------- items & unique gear
Object.assign(ITEMS, {
  c12_first_atlas: { name: 'The Sunward Atlas (1st Ed.)', kind: 'key', icon: '✪',
    desc: 'The same atlas Cassian gave you — new, here. On the flyleaf, in a boy\'s careful hand: "For Lysa, who wants to know where the sun goes."' },
  c12_mothers_token: { name: 'Tin Sun Token', kind: 'key', icon: '✪',
    desc: 'A cheap festival token, stamped with a sunburst. Someone has scratched "COME HOME SAFE — MUM" on the back.' },
  c12_festival_ribbon: { name: 'Festival Ribbon', kind: 'key', icon: '✪',
    desc: 'A length of gold ribbon from the haberdasher\'s stall. It has never once frayed.' },
});

const ACCESSORY = (id, def) => { EQUIPMENT[id] = { id, slot: 'accessory', tier: 0, price: 0, ...def }; };
ACCESSORY('c12_squire_badge', { name: 'Squire\'s Tin Badge', str: 14, def: 14, immune: ['stun', 'slow'],
  desc: 'STR/DEF +14. Immune to Stun and Slow. He said he had a spare. He didn\'t.' });
ACCESSORY('c12_sunburst', { name: 'Hierophant\'s Sunburst', mag: 22, res: 22, immune: ['silence'],
  desc: 'MAG/RES +22. Immune to Silence. Warm, still, from his hands.' });
ACCESSORY('c12_broken_halo', { name: 'Broken Halo', mods: { hpPct: 12, mpPct: 12 }, resist: { light: 0.5, fire: 0.5 },
  desc: 'HP/MP +12%. Halves light and fire damage. A crown of a single afternoon.' });
ACCESSORY('c12_stopped_hand', { name: 'The Stopped Hand', spd: 10, mods: { crit: 15 }, immune: ['slow', 'stun', 'doom'],
  desc: 'SPD +10, crit +15%. Immune to Slow, Stun and Doom. A clock hand that will never turn again.' });

// ---------------------------------------------------------------- skills used by this chapter's foes
Object.assign(SKILLS, {
  c12_hymn: { name: 'Hymn of Long Light', kind: 'mag', target: 'enemies', power: 115, elem: 'light', status: [['slow', 0.25]], anim: 'song' },
  c12_mercy: { name: 'Gentle Mercy', kind: 'heal', target: 'allyAny', power: 140, anim: 'heal' },
  c12_verse: { name: 'The First Verse', kind: 'mag', target: 'enemies', power: 210, elem: 'light', status: [['slow', 0.5]], anim: 'song' },
  c12_seven_wounds: { name: 'Seven Wounds', kind: 'mag', target: 'random', power: 72, hits: 7, elem: 'fire', anim: 'meteor' },
  c12_crown: { name: 'Solar Crown', kind: 'support', target: 'self', selfBuffs: { mag: 2, res: 1 }, anim: 'buff' },
  c12_zenith: { name: 'Zenith', kind: 'mag', target: 'enemies', power: 270, elem: 'fire', anim: 'meteor' },
  c12_tick: { name: 'Tick', kind: 'phys', target: 'enemy', power: 140, elem: 'pierce', anim: 'thrust' },
  c12_tock: { name: 'Tock', kind: 'phys', target: 'enemies', power: 90, elem: 'blunt', anim: 'quake' },
  c12_twelve: { name: 'Noon Strikes Twelve', kind: 'mag', target: 'random', power: 40, hits: 12, elem: 'light', anim: 'light' },
  c12_rewind: { name: 'Rewind', kind: 'support', target: 'self', special: 'partyHeal15', anim: 'buff' },
  c12_last_noon: { name: 'Noon Forever', kind: 'mag', target: 'enemies', power: 175, elem: 'light', anim: 'meteor', desc: 'The clock-sun strikes noon, and means it.' },
  c12_forever: { name: 'Forever', kind: 'mag', target: 'enemies', power: 115, elem: 'dark', status: [['sleep', 0.25]], anim: 'song' },
  c12_hourglass: { name: 'Hourglass', kind: 'support', target: 'enemies', debuffs: { spd: -1 }, status: [['slow', 0.45]], anim: 'status' },
  c12_swallow: { name: 'Swallow the Light', kind: 'mag', target: 'enemy', power: 230, elem: 'dark', drain: 0.5, anim: 'dark' },
  c12_updraft: { name: 'Updraft', kind: 'mag', target: 'enemies', power: 105, elem: 'wind', anim: 'wind' },
  c12_toll: { name: 'Toll of the First Bell', kind: 'mag', target: 'enemies', power: 125, elem: 'blunt', status: [['stun', 0.2]], anim: 'quake' },
  c12_dance: { name: 'Endless Dance', kind: 'phys', target: 'random', power: 70, hits: 4, elem: 'slash', anim: 'slash' },
});

// ---------------------------------------------------------------- the new dawn (epilogue sky)
MOODS.c12_newdawn = {
  // A smaller, stranger dawn: teal overhead, rose at the horizon, never quite gold.
  sky: ['#3f6f92', '#f2b8a4'], fog: ['#ecc8bc', 24, 72],
  hemi: ['#fff0f2', '#4a5a6a', 1.3], sun: ['#ffdcc8', 2.3, [-8, 12, 6]],
  windows: false, particles: 'pollen',
  grade: { saturation: 1.08, contrast: 1.03, tint: '#fff2f0', shadowTint: '#d8e2ff', bloom: 0.62, bloomThreshold: 0.8, vignette: 0.3, exposure: 1.06 },
};

// ---------------------------------------------------------------- looks
const SKIN = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34', faded: '#e4dcec' };
const looks = {
  // Evernoon Remembrances (named)
  c12_mott: { id: 'c12_mott', skin: SKIN.faded, hair: { style: 'bald', color: '#e8e4f0' }, outfit: { style: 'coat', main: '#7a6a8a', accent: '#d8d0c0', trim: '#b8a070', pants: '#4a4050' }, acc: ['hat_wide', 'beard'] },
  c12_bettany: { id: 'c12_bettany', skin: SKIN.warm, hair: { style: 'ponytail', color: '#e3c25a' }, outfit: { style: 'dress', main: '#e8c840', accent: '#fff8e0', trim: '#c08030' }, blush: true },
  c12_sel: { id: 'c12_sel', skin: SKIN.tan, hair: { style: 'short', color: '#2a2a30' }, outfit: { style: 'vest', main: '#2a5a3a', accent: '#e8dcc0', trim: '#c9a24a', pants: '#2a2a30' }, acc: ['hat_wide'] },
  c12_tomas: { id: 'c12_tomas', skin: SKIN.fair, hair: { style: 'messy', color: '#8a5a2a' }, outfit: { style: 'tunic', main: '#4a7ac8', accent: '#f0e8d8', pants: '#5a4a3a' }, build: 'child' },
  c12_fen: { id: 'c12_fen', skin: SKIN.pale, hair: { style: 'twintails', color: '#c0642e' }, outfit: { style: 'dress', main: '#c86a8a', accent: '#fff0f0', trim: '#8a3a5a' }, build: 'child', blush: true },
  c12_dawe: { id: 'c12_dawe', skin: SKIN.pale, hair: { style: 'bun', color: '#c0642e' }, outfit: { style: 'dress', main: '#8a5a7a', accent: '#f0e0d0', trim: '#5a3a4a' } },
  c12_hollin: { id: 'c12_hollin', skin: SKIN.warm, hair: { style: 'bun', color: '#e0dcd8' }, outfit: { style: 'robe', main: '#6a7a8a', accent: '#f0ece0', trim: '#4a5a6a' }, acc: ['glasses'] },
  c12_aldous_young: { id: 'c12_aldous_young', skin: SKIN.tan, hair: { style: 'short', color: '#6a4a2a' }, outfit: { style: 'armor', main: '#888', metal: '#a9b3c2', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' }, weapon: 'spear', blush: true },
  c12_sergeant: { id: 'c12_sergeant', skin: SKIN.brown, hair: { style: 'short', color: '#3a3030' }, outfit: { style: 'armor', main: '#888', metal: '#a9b3c2', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' }, acc: ['helmet', 'beard'], weapon: 'spear', build: 'large' },
  c12_dancer_a: { id: 'c12_dancer_a', skin: SKIN.fair, hair: { style: 'long', color: '#e3c25a' }, outfit: { style: 'dress', main: '#fff4e0', accent: '#e0b040', trim: '#e07a8a' }, acc: ['ribbon'] },
  c12_dancer_b: { id: 'c12_dancer_b', skin: SKIN.brown, hair: { style: 'braid', color: '#2a2a30' }, outfit: { style: 'dress', main: '#e07a8a', accent: '#fff4e0', trim: '#e0b040' }, acc: ['feather'] },
  c12_dancer_c: { id: 'c12_dancer_c', skin: SKIN.tan, hair: { style: 'short', color: '#5a3a2a' }, outfit: { style: 'tunic', main: '#4ab0c0', accent: '#fff4e0', trim: '#e0b040', pants: '#f0e8d8' }, acc: ['headband'] },
  c12_herald: { id: 'c12_herald', skin: SKIN.fair, hair: { style: 'short', color: '#d8d4d0' }, outfit: { style: 'coat', main: '#c03a3a', accent: '#f0d070', trim: '#f0d070', pants: '#2a2a30' }, acc: ['hat_wide'] },
  c12_aurel: { id: 'c12_aurel', skin: SKIN.fair, hair: { style: 'long', color: '#8a8478' }, eyes: '#6a8ab0', outfit: { style: 'robe', main: '#2a3a5a', accent: '#e8dcc0', trim: '#c9a24a' }, acc: ['beard'], build: 'tall', weapon: 'staff' },
  // Enemy looks
  c12_reveler: { id: 'c12_reveler', skin: '#ece4f4', hair: { style: 'none', color: '#000' }, eyes: '#2a1a3a', outfit: { style: 'coat', main: '#d8b060', accent: '#6a3aa8', trim: '#f0e0b0', pants: '#3a2a4a' }, acc: ['hat_wide'], weapon: 'dagger' },
  c12_lanternbearer: { id: 'c12_lanternbearer', skin: SKIN.faded, hair: { style: 'long', color: '#f0e8d0' }, eyes: '#ffd070', outfit: { style: 'robe', main: '#fff4dc', accent: '#e0b040', trim: '#e0b040' }, acc: ['hood'], weapon: 'staff' },
  c12_choir_shade: { id: 'c12_choir_shade', skin: '#b8a8d0', hair: { style: 'short', color: '#3a2a4a' }, eyes: '#ffffff', outfit: { style: 'robe', main: '#3a2a5a', accent: '#d0b060', trim: '#d0b060' }, acc: ['hood'], weapon: 'tome' },
  // Epilogue — two summers after
  c12_wren_after: { id: 'c12_wren_after', skin: SKIN.fair, hair: { style: 'ponytail', color: '#c0642e' }, eyes: '#2f6b4f', outfit: { style: 'coat', main: '#3f6fa8', accent: '#efe2c4', trim: '#b5803a', pants: '#4a3a2c', boots: '#5a3a24' }, acc: ['scarf', 'cape'], capeColor: '#2f4a6a', weapon: 'sword', build: 'tall' },
  c12_ilse_after: { id: 'c12_ilse_after', skin: SKIN.warm, hair: { style: 'bob', color: '#2f2a3a' }, eyes: '#6a4a8a', outfit: { style: 'coat', main: '#f0ece0', accent: '#5a8a6a', trim: '#6a5a4a', pants: '#4a4048' }, acc: ['glasses'], weapon: 'staff', blush: true },
  c12_bram_after: { id: 'c12_bram_after', skin: SKIN.tan, hair: { style: 'short', color: '#e3c25a' }, outfit: { style: 'vest', main: '#a83232', accent: '#e8dcc0', trim: '#d7a83a', pants: '#3a3a4a' }, acc: ['beard'], weapon: 'greatsword', build: 'large' },
  c12_sable_after: { id: 'c12_sable_after', skin: SKIN.pale, hair: { style: 'braid', color: '#1a1824' }, eyes: '#b03a5a', outfit: { style: 'coat', main: '#2a2638', accent: '#e0c070', trim: '#7a6aa8', pants: '#3a3448' }, acc: ['ribbon'], weapon: 'rod', build: 'tall' },
  c12_pip_after: { id: 'c12_pip_after', skin: SKIN.brown, hair: { style: 'messy', color: '#3a2a1a' }, eyes: '#4a3a2a', outfit: { style: 'tunic', main: '#c87a3a', accent: '#f0e8d8', pants: '#5a4a3a' }, acc: ['bandana'], build: 'child', weapon: 'dagger' },
  c12_corvin_after: { id: 'c12_corvin_after', skin: SKIN.warm, hair: { style: 'short', color: '#5a5050' }, outfit: { style: 'coat', main: '#5a2a2a', accent: '#e8dcc0', trim: '#c9a24a', pants: '#2a2a30' }, acc: ['hat_wide', 'beard', 'glasses'], weapon: 'gun' },
  c12_kid_a: { id: 'c12_kid_a', skin: SKIN.deep, hair: { style: 'spiky', color: '#2a2a30' }, outfit: { style: 'tunic', main: '#5aa86a', accent: '#f0e8d8', pants: '#4a3a2a' }, build: 'child' },
  c12_kid_b: { id: 'c12_kid_b', skin: SKIN.fair, hair: { style: 'twintails', color: '#e3c25a' }, outfit: { style: 'dress', main: '#4a7ac8', accent: '#fff4e0' }, build: 'child' },
  c12_kid_c: { id: 'c12_kid_c', skin: SKIN.tan, hair: { style: 'bob', color: '#6a4a2a' }, outfit: { style: 'vest', main: '#a85ac8', accent: '#f0e8d8', pants: '#3a3a4a' }, build: 'child' },
  c12_kid_d: { id: 'c12_kid_d', skin: SKIN.warm, hair: { style: 'short', color: '#c0642e' }, outfit: { style: 'rags', main: '#8a6a3a', accent: '#4a6a3a', pants: '#5a4a3a' }, build: 'child', acc: ['scarf'] },
};

// Portrait aliases: the dialogue portrait is looked up by the speaker's first name.
Object.assign(looks, {
  cass: { ...LOOKS.cassian_young, id: 'cass' },
  aurel: { ...looks.c12_aurel, id: 'aurel' },
  mott: { ...looks.c12_mott, id: 'mott' },
  hollin: { ...looks.c12_hollin, id: 'hollin' },
});

// ---------------------------------------------------------------- enemies
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
  // ---------- The Gate (Lv 70–71)
  E('c12_dusk_hound', 'Dusk Hound', 70, { type: 'hound', color: '#4a3a6a', accent: '#ffd070', eye: '#ffd070', seed: 12 }, {
    stats: { hp: 1.0, spd: 1.25 }, weak: ['light', 'fire'], resist: { dark: 0.5 }, poise: 3,
    skills: [['e_bite', 3], ['e_darkwave', 1], ['e_howl', 1]], drops: [['gloam_dust', 0.5], ['mega_tonic', 0.12]], steal: ['mega_tonic', 'gloam_shard'],
    desc: 'The Drowned Hound had a litter. Forty years in the Gloam, and they grew up.',
  }),
  E('c12_hollow_reveler', 'Hollow Reveler', 70, { type: 'humanoid', look: 'c12_reveler' }, {
    stats: { hp: 1.05, mag: 1.15 }, weak: ['slash', 'light'], resist: { dark: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_drain', 1], ['e_sleep', 1], ['e_steal', 1]], drops: [['hi_ether', 0.2], ['smoke_ball', 0.2]], steal: ['hi_ether', 'lucky_coin'],
    desc: 'A festival-goer who wandered too far from the party. Its smile is painted on. So is its face.',
  }),
  E('c12_shard_golem', 'Shardglass Golem', 71, { type: 'golem', color: '#e0b050', accent: '#fff0c0', eye: '#ff8040', seed: 21 }, {
    stats: { hp: 1.5, def: 1.6, spd: 0.7 }, weak: ['blunt', 'ice'], resist: { fire: 0.3, light: 0.5, slash: 0.7 }, poise: 5,
    skills: [['attack', 2], ['e_slam', 2], ['e_quake', 1], ['e_shell', 1]], drops: [['sun_ember', 0.25], ['guard_fruit', 0.04]], steal: ['sun_ember', 'guard_fruit'],
    desc: 'Rubble from the broken sun, still warm, still trying to be something.',
  }),
  E('c12_lament_wisp', 'Lament Wisp', 70, { type: 'wisp', color: '#c090ff', eye: '#ffffff', seed: 7 }, {
    stats: { hp: 0.7, mag: 1.3, def: 2, res: 0.7, evade: 10 }, weak: ['wind', 'light'], resist: { slash: 0.5, pierce: 0.5, blunt: 0.5, dark: 0 }, poise: 2,
    skills: [['e_lament', 1], ['e_dark', 2], ['e_silence', 1], ['e_mpdrain', 1]], drops: [['hi_ether', 0.25], ['gloam_dust', 0.3]], steal: ['hi_ether', 'echo_herb'],
    desc: 'It is singing a song someone forgot the words to.',
  }),
  // ---------- The festival streets (Lv 72–74)
  E('c12_lanternbearer', 'Festival Lanternbearer', 72, { type: 'humanoid', look: 'c12_lanternbearer' }, {
    stats: { hp: 1.0, mag: 1.3, res: 1.3 }, weak: ['dark', 'slash'], resist: { light: 0 }, poise: 3,
    skills: [['e_holy', 2], ['e_heal', 1], ['e_holyall', 1], ['attack', 1]], drops: [['hi_ether', 0.2], ['holy_water', 0.3]], steal: ['holy_water', 'x_ether'],
    desc: 'Its paper lantern has been lit for forty years and has never burned down.',
  }),
  E('c12_confetti_sprite', 'Confetti Sprite', 72, { type: 'wisp', color: '#ff90c0', accent: '#90e0ff', eye: '#ffffff', seed: 3 }, {
    stats: { hp: 0.7, mag: 1.2, spd: 1.4, evade: 12 }, weak: ['wind', 'dark'], resist: { light: 0.5 }, poise: 2,
    skills: [['e_spark', 2], ['e_sleep', 1], ['e_blind', 1]], drops: [['panacea', 0.25]], steal: ['panacea', 'swift_fruit'],
    desc: 'Bright paper, endlessly falling. It has been falling since before you were born.',
  }),
  E('c12_noon_sentinel', 'Noon Sentinel', 73, { type: 'knight', color: '#f0e8d8', accent: '#d0a040', weapon: 'spear', seed: 5 }, {
    stats: { hp: 1.4, str: 1.1, def: 1.5 }, weak: ['bolt', 'blunt'], resist: { light: 0.5, slash: 0.7, pierce: 0.7 }, poise: 5,
    skills: [['e_spear', 3], ['e_sweep', 1], ['e_stun', 1]], drops: [['mega_tonic', 0.2], ['x_tonic', 0.06]], steal: ['mega_tonic', 'power_fruit'],
    desc: 'A Dawnguard as a twelve-year-old remembered them: tall, shining, and never once afraid.',
  }),
  E('c12_carousel_drake', 'Carousel Drake', 73, { type: 'drake', color: '#f0a0c0', accent: '#a0e0f0', eye: '#ffe060', seed: 8 }, {
    stats: { hp: 1.3, str: 1.1 }, weak: ['pierce', 'ice'], resist: { fire: 0.5 }, poise: 4,
    skills: [['e_firebreath', 1], ['e_claw', 2], ['e_tackle', 2]], drops: [['mega_tonic', 0.2], ['power_fruit', 0.05]], steal: ['mega_tonic', 'ember_ring'],
    desc: 'A painted carousel beast. It goes round and round. It has never once stopped.',
  }),
  E('c12_gift_mimic', 'Birthday Mimic', 74, { type: 'mimic', color: '#e05050', accent: '#ffe080', eye: '#ffffff', seed: 4 }, {
    stats: { hp: 1.2, str: 1.3, def: 1.3, gold: 5, exp: 1.5 }, weak: ['fire', 'pierce'], poise: 4,
    skills: [['e_bite', 3], ['e_crush', 1], ['e_mpdrain', 1]], drops: [['x_ether', 0.35], ['swift_fruit', 0.25]], steal: ['x_tonic', 'elixir'],
    desc: 'A present nobody ever opened. It resents that.',
  }),
  // ---------- Sundial guardians (mini-bosses, Lv 73)
  E('c12_hour_kite', 'Kite Over Aurenne', 73, { type: 'bird', color: '#e05a5a', accent: '#ffe080', eye: '#202020', size: 2, seed: 31 }, {
    boss: true, stats: { hp: 6, spd: 1.25, mag: 1.2, exp: 4, gold: 4, cp: 3 }, weak: ['pierce', 'bolt'], resist: { wind: 0 }, poise: 6,
    ai: 'c12_kite', drops: [['swift_fruit', 1]], steal: ['x_ether', 'feather_cape'],
    desc: 'The kite a boy flew on the last good afternoon. In the memory, it never comes down.',
  }),
  E('c12_hour_bell', 'The First Bell', 73, { type: 'bell', color: '#c8a050', accent: '#7a4a2a', eye: '#fff0a0', size: 2, seed: 33 }, {
    boss: true, stats: { hp: 7, def: 1.4, mag: 1.2, spd: 0.85, exp: 4, gold: 4, cp: 3 }, weak: ['blunt', 'ice'], resist: { fire: 0.5, slash: 0.7 }, poise: 7,
    ai: 'c12_bell', drops: [['magic_fruit', 1]], steal: ['x_ether', 'bell_earring'],
    desc: 'The bell that should have rung one o\'clock. It has been holding its breath ever since.',
  }),
  E('c12_hour_parade', 'The Painted Procession', 73, { type: 'knight', color: '#f0c0d0', accent: '#e0c050', weapon: 'spear', size: 2, seed: 35 }, {
    boss: true, stats: { hp: 6, str: 1.2, spd: 1.1, exp: 4, gold: 4, cp: 3 }, weak: ['fire', 'slash'], resist: { light: 0.5 }, poise: 6,
    ai: 'c12_parade', summons: ['c12_confetti_sprite'], drops: [['power_fruit', 1]], steal: ['x_tonic', 'haste_anklet'],
    desc: 'The festival\'s leading dancer, painted in noon. She has been mid-twirl for forty years and she is very tired.',
  }),
  // ---------- The night of the spill (Lv 74–75)
  E('c12_forgotten', 'The Forgotten', 74, { type: 'ghost', color: '#5a4a7a', eye: '#ffffff', seed: 14 }, {
    stats: { hp: 0.95, mag: 1.3, def: 2.2, res: 0.9, evade: 8 }, weak: ['light', 'fire'], resist: { slash: 0.4, pierce: 0.4, blunt: 0.6, dark: 0 }, poise: 3,
    skills: [['e_drain', 2], ['e_dark', 2], ['e_wail', 1]], drops: [['gloam_dust', 0.5], ['hi_ether', 0.2]], steal: ['hi_ether', 'dusk_ring'],
    desc: 'Someone nobody remembers anymore. It is trying very hard to remember itself.',
  }),
  E('c12_gloam_tide', 'Gloam Tide', 75, { type: 'slime', color: '#3a2060', eye: '#ff80d0', size: 1.5, seed: 16 }, {
    stats: { hp: 1.6, def: 0.7, res: 1.4 }, weak: ['light', 'bolt'], resist: { dark: -1, blunt: 0.5 }, poise: 4,
    skills: [['e_darkwave', 1], ['attack', 2], ['e_poison', 1]], drops: [['gloam_shard', 0.15], ['gloam_dust', 0.5]], steal: ['gloam_dust', 'gloam_shard'],
    desc: 'The night the Lantern failed, the dark came up through the gutters like floodwater.',
  }),
  E('c12_watcher', 'Watcher in the Spill', 75, { type: 'eye', color: '#2a1a4a', accent: '#ff60c0', eye: '#ffe060', seed: 18 }, {
    stats: { hp: 1.0, mag: 1.25, spd: 1.2 }, weak: ['pierce', 'light'], resist: { dark: 0.3 }, poise: 3,
    skills: [['e_gravity', 1], ['e_blind', 1], ['e_dark', 2]], drops: [['eye_drops', 0.3], ['hi_ether', 0.2]], steal: ['hi_ether', 'sun_goggles'],
    desc: 'The feeling of being looked at from the dark, given a shape.',
  }),
  E('c12_spill_hound', 'Hound of the Spill', 74, { type: 'hound', color: '#2a2040', accent: '#8a6aff', eye: '#b07aff', seed: 9 }, {
    stats: { hp: 0.9, spd: 1.3 }, weak: ['slash', 'light'], resist: { dark: 0.5 }, poise: 3,
    skills: [['e_bite', 3], ['e_howl', 1]], drops: [['gloam_dust', 0.4]], steal: ['mega_tonic', 'gloam_dust'],
    desc: 'It came up out of the gutters with the others. It is looking for a girl.',
  }),
  E('c12_hungry_dark', 'The Hungry Dark', 75, { type: 'horror', color: '#1a1030', accent: '#6a3aa8', eye: '#ff60c0', size: 3, seed: 40 }, {
    boss: true, stats: { hp: 11, mag: 1.3, str: 1.15, exp: 7, gold: 7, cp: 4 }, weak: ['light', 'fire'], resist: { dark: 0, ice: 0.5 }, poise: 7,
    ai: 'c12_hungry_dark', summons: ['c12_spill_hound'], drops: [['ember_heart', 1]], steal: ['megalixir', 'dusk_ring'],
    desc: 'The Gloam, the one night it came into Aurenne. It took one child. It has been hungry ever since.',
  }),
  // ---------- The Noon Stair (Lv 76–77)
  E('c12_choir_seraph', 'Choir Seraph', 76, { type: 'angel', color: '#fff0d0', accent: '#d0a040', eye: '#80c0ff', seed: 22 }, {
    stats: { hp: 1.1, mag: 1.3, res: 1.4 }, weak: ['dark', 'pierce'], resist: { light: 0 }, poise: 4,
    skills: [['e_holyall', 1], ['e_holy', 2], ['e_healall', 1]], drops: [['hi_ether', 0.3], ['wisdom_seed', 0.06]], steal: ['x_ether', 'spirit_fruit'],
    desc: 'It sings Cassian\'s hymns. It does not know any others.',
  }),
  E('c12_sun_knight', 'Sunforged Knight', 77, { type: 'knight', color: '#e0a040', accent: '#fff0c0', weapon: 'greatsword', seed: 24 }, {
    stats: { hp: 1.5, str: 1.25, def: 1.4, spd: 0.9 }, weak: ['ice', 'bolt'], resist: { fire: 0.3, light: 0.5 }, poise: 6,
    skills: [['e_cleave', 2], ['e_crush', 1], ['e_slash', 2]], drops: [['x_tonic', 0.12], ['guard_fruit', 0.06]], steal: ['x_tonic', 'champions_belt'],
    desc: 'Plate forged from noon. Inside, nobody — only the idea of someone who would never let you get hurt.',
  }),
  E('c12_hour_watcher', 'Hour Watcher', 76, { type: 'eye', color: '#d0b060', accent: '#5a3a8a', eye: '#ffffff', seed: 4 }, {
    stats: { hp: 0.95, mag: 1.2, spd: 1.3 }, weak: ['bolt', 'blunt'], resist: { light: 0.5 }, poise: 3,
    skills: [['e_stillness', 0.5], ['e_gravity', 1], ['e_spark', 2]], drops: [['swift_fruit', 0.06], ['hi_ether', 0.25]], steal: ['x_ether', 'swift_boots'],
    desc: 'Tick. Tick. Tick. It is counting something. It will not say what.',
  }),
  // ---------- The Noon Throne (final battles)
  E('c12_hierophant', 'Cassian, the Hierophant', 76, { type: 'humanoid', look: 'cassian', size: 2 }, {
    boss: true, stats: { hp: 14, mag: 1.4, res: 1.4, def: 1.1, spd: 1.1, exp: 10, gold: 10, cp: 6 }, weak: ['dark', 'slash'], resist: { light: 0 }, poise: 8,
    ai: 'c12_hierophant', summons: ['c12_choir_shade'], drops: [['c12_sunburst', 1]], steal: ['megalixir', 'c12_sunburst'],
    desc: 'He has never once raised his voice. He is not raising it now.',
  }),
  E('c12_choir_shade', 'Choir Shade', 74, { type: 'humanoid', look: 'c12_choir_shade' }, {
    stats: { hp: 0.8, mag: 1.2 }, weak: ['dark', 'slash'], resist: { light: 0 }, poise: 2,
    skills: [['e_heal', 2], ['e_holy', 1], ['e_silence', 1]], drops: [['hi_ether', 0.3]], steal: ['hi_ether', 'x_ether'],
    desc: 'Acolytes he remembers. They remember nothing but the hymns.',
  }),
  E('c12_noon_king', 'The Noon King', 78, { type: 'angel', color: '#fff4c0', accent: '#c080ff', eye: '#ff4060', size: 4, seed: 50 }, {
    boss: true, stats: { hp: 16, mag: 1.45, str: 1.2, res: 1.3, def: 1.2, exp: 10, gold: 10, cp: 6 }, weak: ['dark', 'ice'], resist: { light: 0.25, fire: 0.5 }, poise: 9,
    ai: 'c12_noon_king', summons: ['c12_shard_mote'], drops: [['c12_broken_halo', 1]], steal: ['megalixir', 'c12_broken_halo'],
    desc: 'Cassian and the broken sun, sung into one shape. The king of a single afternoon.',
  }),
  E('c12_shard_mote', 'Sun Shard', 76, { type: 'elemental', color: '#ffd070', accent: '#fff8e0', eye: '#ffffff', seed: 51 }, {
    stats: { hp: 0.9, mag: 1.2 }, weak: ['dark', 'ice'], resist: { fire: 0, light: 0 }, poise: 2,
    skills: [['e_ember', 2], ['e_holy', 1]], drops: [['sun_ember', 0.5]], steal: ['sun_ember', 'x_ether'],
    desc: 'One of the seven pieces. It circles the King like a moth around a— well.',
  }),
  E('c12_vesper', 'Vesper, the Unending Moment', 80, { type: 'eye', color: '#f0d890', accent: '#6a3aa8', eye: '#ffffff', size: 4, seed: 80 }, {
    boss: true, stats: { hp: 12, mag: 1.4, str: 1.3, res: 1.3, def: 1.3, spd: 1.15, exp: 12, gold: 12, cp: 8 }, weak: ['bolt', 'blunt'], resist: { light: 0.5, dark: 0.5 }, poise: 10,
    ai: 'c12_vesper', summons: ['c12_hour_hand', 'c12_minute_hand'], drops: [['c12_stopped_hand', 1], ['megalixir', 1]], steal: ['megalixir', 'c12_stopped_hand'],
    desc: 'The Vespersong, grown a face. A clock that ate the sun. It does not want anything except for this to never end.',
  }),
  E('c12_hour_hand', 'Hour Hand', 78, { type: 'knight', color: '#d8b060', accent: '#3a2a5a', weapon: 'greatsword', seed: 81 }, {
    stats: { hp: 1.6, str: 1.3, def: 1.4, spd: 0.7 }, weak: ['bolt', 'ice'], resist: { light: 0.5 }, poise: 5,
    skills: [['e_crush', 2], ['e_cleave', 1]], drops: [['x_tonic', 0.2]], steal: ['x_tonic', 'power_fruit'],
    desc: 'Slow. Inevitable. It has been coming toward you since the moment you were born.',
  }),
  E('c12_minute_hand', 'Minute Hand', 78, { type: 'knight', color: '#a080e0', accent: '#f0e0a0', weapon: 'spear', seed: 82 }, {
    stats: { hp: 0.9, str: 1.1, spd: 1.4 }, weak: ['wind', 'pierce'], resist: { dark: 0.5 }, poise: 3,
    skills: [['e_spear', 2], ['e_sweep', 0.5], ['attack', 1]], drops: [['x_ether', 0.2]], steal: ['x_ether', 'swift_fruit'],
    desc: 'Quick. Restless. Never where it was a moment ago.',
  }),
];

// ---------------------------------------------------------------- troops
/**
 * @param {string[]} list
 * @param {Partial<import('../../types/data').TroopDef>} [opts]
 * @returns {import('../../types/data').TroopDef}
 */
const T = (list, opts = {}) => ({ enemies: list, ...opts });
const FINAL = { boss: true, music: 'finalboss', canFlee: false };
/** @type {Record<string, import('../../types/data').TroopDef>} */
const troops = {
  c12g_hounds: T(['c12_dusk_hound', 'c12_dusk_hound']),
  c12g_revel: T(['c12_hollow_reveler', 'c12_lament_wisp', 'c12_hollow_reveler']),
  c12g_golem: T(['c12_shard_golem', 'c12_dusk_hound']),
  c12g_wisps: T(['c12_lament_wisp', 'c12_dusk_hound', 'c12_lament_wisp']),
  c12g_mix: T(['c12_hollow_reveler', 'c12_shard_golem']),
  c12s_lanterns: T(['c12_lanternbearer', 'c12_confetti_sprite', 'c12_lanternbearer']),
  c12s_sentinels: T(['c12_noon_sentinel', 'c12_lanternbearer']),
  c12s_carousel: T(['c12_carousel_drake', 'c12_confetti_sprite']),
  c12s_confetti: T(['c12_confetti_sprite', 'c12_confetti_sprite', 'c12_confetti_sprite']),
  c12s_mix: T(['c12_noon_sentinel', 'c12_carousel_drake']),
  c12s_mimic: T(['c12_gift_mimic']),
  c12_boss_kite: T(['c12_hour_kite'], { boss: true, music: 'boss', canFlee: false, bg: 'evernoon' }),
  c12_boss_bell: T(['c12_hour_bell'], { boss: true, music: 'boss', canFlee: false, bg: 'evernoon' }),
  c12_boss_parade: T(['c12_confetti_sprite', 'c12_hour_parade', 'c12_confetti_sprite'], { boss: true, music: 'boss', canFlee: false, bg: 'evernoon' }),
  c12m_forgotten: T(['c12_forgotten', 'c12_forgotten']),
  c12m_tide: T(['c12_gloam_tide', 'c12_watcher']),
  c12m_mix: T(['c12_forgotten', 'c12_gloam_tide', 'c12_watcher']),
  c12m_hounds: T(['c12_spill_hound', 'c12_spill_hound', 'c12_forgotten']),
  c12_boss_hungry: T(['c12_spill_hound', 'c12_hungry_dark', 'c12_spill_hound'], { boss: true, music: 'boss', canFlee: false, bg: 'gloam' }),
  c12t_seraph: T(['c12_choir_seraph', 'c12_hour_watcher']),
  c12t_knights: T(['c12_sun_knight', 'c12_sun_knight']),
  c12t_mix: T(['c12_sun_knight', 'c12_choir_seraph', 'c12_hour_watcher']),
  c12t_watchers: T(['c12_hour_watcher', 'c12_choir_seraph', 'c12_hour_watcher']),
  c12_sentry_w: T(['c12_sun_knight', 'c12_choir_seraph', 'c12_sun_knight'], { canFlee: false, music: 'boss', bg: 'evernoon' }),
  c12_sentry_e: T(['c12_choir_seraph', 'c12_sun_knight', 'c12_hour_watcher'], { canFlee: false, music: 'boss', bg: 'evernoon' }),
  c12_boss_hierophant: T(['c12_choir_shade', 'c12_hierophant', 'c12_choir_shade'], { ...FINAL, bg: 'evernoon' }),
  c12_boss_noon_king: T(['c12_shard_mote', 'c12_noon_king', 'c12_shard_mote'], { ...FINAL, bg: 'evernoon' }),
  c12_boss_vesper: T(['c12_hour_hand', 'c12_vesper', 'c12_minute_hand'], { ...FINAL, bg: 'gloam' }),
};

// ---------------------------------------------------------------- boss AI
const ALL_ELEMS = ['slash', 'pierce', 'blunt', 'fire', 'ice', 'bolt', 'wind', 'light', 'dark'];
const mostHurt = (c) => c.sys.party.filter((p) => p.alive).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];

/** Swap a boss's weaknesses mid-fight (and hide the old reveals). */
function shiftWeakness(self, weak) {
  self.weak = new Set(weak);
  self.revealed.clear();
}

const bossAI = {
  c12_kite(c) {
    if (c.m.gust) { c.m.gust = false; return c.use('c12_updraft'); }
    if (c.hpPct < 0.5 && c.once('dive')) { c.say('The string snaps taut. The kite stoops like a hawk!'); return c.use('e_howl'); }
    if (c.turn % 4 === 2) { c.m.gust = true; c.say('The kite climbs into air that has not moved in forty years...'); return c.use('e_charge'); }
    return c.pick([['e_peck', 3], ['e_gust', 2], ['e_tackle', 1]]);
  },
  c12_bell(c) {
    if (c.m.toll) { c.m.toll = false; return c.use('c12_toll'); }
    if (c.hpPct < 0.4 && c.once('hush')) { c.say('"Hush," says the Bell, in a voice like an empty cathedral.'); return c.use('e_silence'); }
    if (c.turn % 3 === 0) { c.m.toll = true; c.say('The First Bell swings back... and back... and back...'); return c.use('e_charge'); }
    return c.pick([['e_slam', 2], ['e_wail', 1], ['e_quake', 1]]);
  },
  c12_parade(c) {
    if (c.allies.length === 0 && c.turn > 1 && c.once(`confetti${Math.floor(c.turn / 4)}`)) {
      c.say('Confetti swirls into the shape of a dancer!');
      return c.use('e_summon');
    }
    if (c.turn % 4 === 0) { c.say('"And one-two-three, and one-two-three, and—"'); return c.use('c12_dance'); }
    return c.pick([['e_spear', 2], ['e_sweep', 2], ['e_buff', 1]]);
  },
  c12_hungry_dark(c) {
    if (c.turn === 1) c.say('The dark opens. It has been hungry for a very long time.');
    if (c.m.swallow) { c.m.swallow = false; return c.use('c12_swallow', [mostHurt(c)].filter(Boolean)); }
    if (c.hpPct < 0.6 && c.once('pups')) { c.say('Shadows peel off the Hungry Dark and run on four legs!'); return c.use('e_summon'); }
    if (c.hpPct < 0.3 && c.once('pups2')) return c.use('e_summon');
    if (c.turn % 4 === 3) { c.m.swallow = true; c.say('The Hungry Dark opens wider. It wants whoever is weakest.'); return c.use('e_charge'); }
    return c.pick([['e_darkwave', 2], ['e_drain', 2], ['e_claw', 2], ['e_blind', 1]]);
  },
  c12_hierophant(c) {
    if (c.turn === 1) c.say('"I don\'t want to hurt you, Wren. I never have. Please — let me show you."');
    if (c.m.verse) { c.m.verse = false; return c.use('c12_verse'); }
    if (c.allies.length === 0 && c.turn > 2 && c.once(`shades${Math.floor(c.turn / 5)}`)) {
      c.say('"Sing with me, children. Just once more."');
      return c.use('e_summon');
    }
    if (c.hpPct < 0.5 && c.once('stillness')) {
      c.say('Cassian hums the first bar of the Vespersong. The air forgets how to move.');
      return c.use('e_stillness');
    }
    if (c.hpPct < 0.35 && c.once('mercy')) {
      const hurt = mostHurt(c);
      if (hurt) { c.say(`"Forgive me, ${hurt.name}. You were never supposed to hurt."`); return c.use('c12_mercy', [hurt]); }
    }
    if (c.turn % 4 === 0) {
      c.m.verse = true;
      c.say('Cassian lifts his hands. The first verse of the Vespersong gathers in the air...');
      return c.use('e_charge');
    }
    return c.pick([['e_holy', 3], ['c12_hymn', 2], ['e_lament', 1], ['e_silence', 1], ['e_heal', c.allies.length ? 0.6 : 0]]);
  },
  c12_noon_king(c) {
    if (c.turn === 1) c.say('"Look at it, Wren. The sun, whole — for as long as I can hold it."');
    if (c.m.zenith) { c.m.zenith = false; return c.use('c12_zenith'); }
    if (c.hpPct < 0.66 && c.once('crown')) { c.say('The seven shards blaze into a crown of noon.'); return c.use('c12_crown'); }
    if (c.hpPct < 0.33 && c.once('eclipse')) {
      c.self.weak.add('light');
      delete c.self.resist.light;
      c.say('The shards are tearing loose! Light can reach the man inside the sun!');
      return c.use('e_summon');
    }
    if (c.allies.length < 2 && c.turn % 5 === 2) { c.say('A shard tears free and circles the King.'); return c.use('e_summon'); }
    if (c.turn % 4 === 0) {
      c.m.zenith = true;
      c.say('The King lifts the broken sun to its highest point...');
      return c.use('e_charge');
    }
    return c.pick([['c12_seven_wounds', 2], ['e_holy', 2], ['e_bigbreath', 1], ['e_gravity', 1], ['e_firebreath', 1]]);
  },
  c12_vesper(c) {
    const v = c.self, m = c.m;
    if (!m.phase) { m.phase = 1; m.baseResist = { ...v.resist }; }
    // The clock face is shielded while both hands still turn.
    const hands = c.allies.filter((a) => a.def.id === 'c12_hour_hand' || a.def.id === 'c12_minute_hand');
    const guarded = hands.length >= 2;
    if (guarded !== m.guarded) {
      m.guarded = guarded;
      v.resist = { ...m.baseResist };
      if (guarded) for (const e of ALL_ELEMS) v.resist[e] = (m.baseResist[e] ?? 1) * 0.5;
      c.say(guarded ? 'The Hour and Minute Hands cross before Vesper\'s face. It is shielded!' : 'A hand falls still. Vesper\'s face is open!');
    }
    if (m.charged) {
      const big = m.charged;
      m.charged = null;
      return c.use(big);
    }
    // Phase II — Unwound: the clock runs backwards; its weaknesses turn with it.
    if (m.phase === 1 && c.hpPct < 0.7) {
      m.phase = 2;
      v.name = 'Vesper, Unwound';
      shiftWeakness(v, ['dark', 'wind']);
      c.say('Vesper\'s hands spin backwards. Every clock in Evernoon begins to unwind — its weaknesses turn with it!');
      return c.use(hands.length < 2 ? 'e_summon' : 'e_stillness');
    }
    // Phase III — the Unending Moment: it tries to make this second last forever.
    if (m.phase === 2 && c.hpPct < 0.35) {
      m.phase = 3;
      v.name = 'Vesper, the Last Second';
      shiftWeakness(v, ['light', 'fire']);
      v.maxPoise = 12;
      if (!v.broken) v.poise = v.maxPoise;
      c.say('"STAY," says every clock at once. Vesper rewinds itself — but dawn-colored cracks are showing through!');
      return c.use('c12_rewind');
    }
    if (m.phase === 3 && c.hpPct < 0.15 && c.once('toll')) {
      c.say('The last toll sounds. Someone\'s time is running out.');
      return c.use('e_doom');
    }
    if (m.phase >= 2 && hands.length === 0 && c.turn % 5 === 0) { c.say('A hand reassembles itself out of the ticking.'); return c.use('e_summon'); }
    const every = 4;
    if (c.turn % every === 0) {
      m.charged = m.phase === 1 ? 'c12_twelve' : m.phase === 2 ? 'c12_forever' : 'c12_last_noon';
      c.say(m.phase === 1 ? 'Both hands creep toward XII...' : m.phase === 2 ? 'Vesper begins to hum a lullaby. Stay. Stay. Stay...' : 'The clock-sun swells. It is about to strike noon forever...');
      return c.use('e_charge');
    }
    if (m.phase === 1) return c.pick([['c12_tick', 3], ['c12_tock', 2], ['e_gravity', 1], ['c12_hourglass', 1]]);
    if (m.phase === 2) return c.pick([['c12_tick', 2], ['e_lament', 2], ['c12_hourglass', 1], ['e_stillness', 1], ['e_darkwave', 1]]);
    return c.pick([['c12_tock', 2], ['e_vesper', 1], ['c12_tick', 2], ['e_gravity', 1]]);
  },
};

// ---------------------------------------------------------------- shops & world node
/** @type {Record<string, import('../../types/data').ShopDef>} */
const shops = {
  c12_mott: { name: 'Mott\'s Last Pack', items: ['mega_tonic', 'x_tonic', 'tonic_mist', 'hi_ether', 'x_ether', 'ember_feather', 'dawn_plume', 'panacea', 'gale_bomb', 'holy_water', 'smoke_ball'] },
  c12_bettany: { name: 'Bettany\'s Stall', items: ['dawnforged_blade', 'worldcleaver', 'skypiercer', 'last_whisper', 'horizon', 'keepers_crook', 'rod_of_dusk', 'last_word',
    'dawnguard_regalia', 'wanderers_mantle', 'keepers_raiment', 'crown_of_dawn', 'wanderers_hat', 'keepers_crown', 'wall_of_dawn'] },
};

/** @type {import('../../types/data').WorldNode[]} */
const worldNodes = [
  { id: 'c12_evernoon', name: 'Evernoon', region: 'The Noon Spire', act: 2, x: 520, y: 380, mapId: 'evernoon_gate', tx: 20, ty: 40, dir: 'up', unlock: 'gameClear',
    desc: 'Where Cassian\'s frozen afternoon stood. Only a quiet morning now, and two names on a stone.' },
];

/** @type {import('../../types/data').ContentPack} */
export default {
  maps: [...C12_DUNGEON_MAPS, ...C12_EPILOGUE_MAPS],
  enemies, troops, looks, bossAI, shops, worldNodes,
};
