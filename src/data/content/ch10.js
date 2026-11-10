// Content pack: ch10 — "Lysa" (Lv 50–56, gear tier 7). See docs/AUTHORING.md.
// The Noon Spire, its halls of stopped clocks, and Evernoon itself.

import { ITEMS } from '../items.js';
import { noonSpire, spireHalls } from '../maps/ch10_spire.js';
import { evernoon, lorneHouse } from '../maps/ch10_evernoon.js';

ITEMS.c10_lemonade = { name: 'Lemonade (with mint)', kind: 'key', desc: 'Tomas\'s lemonade, for Bess. It has been on its way for forty years.', icon: '✪' };

// ------------------------------------------------------------------ looks
const SK = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };
const PORCELAIN = '#f8f0e6';
const look = (id, skin, hair, outfit, extra = {}) => ({ id, skin, hair, outfit, ...extra });
/** Evernoon's townsfolk: porcelain skin, festival colours, eyes like buttons. */
const puppet = (id, hair, outfit, extra = {}) => look(id, PORCELAIN, hair, outfit, { eyes: '#1a1a20', blush: true, ...extra });

const looks = {
  mercy_noon: look('mercy_noon', SK.pale, { style: 'long', color: '#f0ece4' },
    { style: 'priest', main: '#f4ecd8', accent: '#a83a4a', trim: '#d4a83a' }, { eyes: '#8a2a3a', acc: ['hood'], weapon: 'lute' }),
  c10_keeper_lorne: look('c10_keeper_lorne', SK.fair, { style: 'short', color: '#8a7a6a' },
    { style: 'robe', main: '#2f4a6a', accent: '#e8dcc0', trim: '#d9b04a' }, { eyes: '#6a8ab0', acc: ['beard', 'circlet'], build: 'tall', weapon: 'staff' }),
  c10_edrin: look('c10_edrin', SK.fair, { style: 'messy', color: '#c0642e' },
    { style: 'vest', main: '#3a5a7a', accent: '#e8dcc0', trim: '#8a5a3a', pants: '#4a3a2c' }, { eyes: '#2f6b4f', acc: ['beard'] }),
  c10_ana: look('c10_ana', SK.warm, { style: 'bob', color: '#2f2a3a' },
    { style: 'dress', main: '#6f9a6a', accent: '#f3ead2', trim: '#8a5a3a' }, { eyes: '#6a4a8a', blush: true }),
  c10_aldous: look('c10_aldous', SK.tan, { style: 'short', color: '#b8b0a0' },
    { style: 'armor', main: '#888', metal: '#a9b3c2', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' },
    { acc: ['beard', 'cape'], capeColor: '#a83232', build: 'large', weapon: 'sword' }),
  c10_pip_mam: look('c10_pip_mam', SK.brown, { style: 'bun', color: '#2a1a10' },
    { style: 'dress', main: '#8a6a4a', accent: '#e0d0b0', trim: '#5a4a3a' }, { eyes: '#4a3a2a', acc: ['scarf'] }),
  c10_hal: look('c10_hal', SK.warm, { style: 'ponytail', color: '#a8502a' },
    { style: 'armor', main: '#8a94a8', metal: '#c0c8d8', accent: '#c03a3a', trim: '#d7a83a', pants: '#2a3040' },
    { acc: ['cape'], capeColor: '#5a2a2a', weapon: 'gun' }),
  c10_baker: puppet('c10_baker', { style: 'bun', color: '#c8a050' }, { style: 'dress', main: '#f0d8c0', accent: '#ffffff', trim: '#c08060' }),
  c10_bandleader: puppet('c10_bandleader', { style: 'short', color: '#3a2a1a' }, { style: 'coat', main: '#c03a3a', accent: '#f0e0a0', trim: '#d7a83a', pants: '#2a2a40' }, { acc: ['hat_wide', 'beard'], weapon: 'lute' }),
  c10_musician: puppet('c10_musician', { style: 'ponytail', color: '#6a4a2a' }, { style: 'coat', main: '#c03a3a', accent: '#f0e0a0', trim: '#d7a83a', pants: '#2a2a40' }, { weapon: 'lute' }),
  c10_fortune: puppet('c10_fortune', { style: 'long', color: '#2a2a2a' }, { style: 'robe', main: '#5a3a7a', accent: '#e0c070', trim: '#c9a24a' }, { acc: ['hood'], eyes: '#c080ff' }),
  c10_bess: puppet('c10_bess', { style: 'bun', color: '#e0dcd8' }, { style: 'dress', main: '#a8b8d8', accent: '#ffffff', trim: '#8a8aa8' }, { acc: ['glasses'] }),
  c10_tomas: puppet('c10_tomas', { style: 'bald', color: '#000' }, { style: 'vest', main: '#e0d0a0', accent: '#ffffff', trim: '#8a6a4a', pants: '#6a5a4a' }, { acc: ['beard', 'hat_wide'] }),
  c10_lover_m: puppet('c10_lover_m', { style: 'short', color: '#4a3a2a' }, { style: 'coat', main: '#4a6a9a', accent: '#f0e8d8', trim: '#c9a24a', pants: '#3a3a4a' }),
  c10_lover_f: puppet('c10_lover_f', { style: 'braid', color: '#c87a4a' }, { style: 'dress', main: '#f0b0c0', accent: '#ffffff', trim: '#d07080' }, { acc: ['ribbon'] }),
  c10_kite_boy: puppet('c10_kite_boy', { style: 'messy', color: '#c8a050' }, { style: 'tunic', main: '#80b0e0', accent: '#ffffff', trim: '#c9a24a', pants: '#6a5a4a' }, { build: 'child' }),
  c10_kite_mother: puppet('c10_kite_mother', { style: 'long', color: '#c8a050' }, { style: 'dress', main: '#e0c080', accent: '#ffffff', trim: '#c9a24a' }, { acc: ['hat_wide'] }),
  c10_child_a: puppet('c10_child_a', { style: 'twintails', color: '#3a2a1a' }, { style: 'dress', main: '#f0e080', accent: '#ffffff', trim: '#c9a24a' }, { build: 'child' }),
  c10_child_b: puppet('c10_child_b', { style: 'spiky', color: '#6a4a2a' }, { style: 'tunic', main: '#a0d0a0', accent: '#ffffff', trim: '#6a8a4a', pants: '#5a4a3a' }, { build: 'child' }),
  c10_squire: puppet('c10_squire', { style: 'messy', color: '#6a4a2a' }, { style: 'tunic', main: '#a83232', accent: '#e8dcc0', trim: '#d7a83a', pants: '#3a3a4a' }, { weapon: 'sword' }),
  c10_mrs_lorne: puppet('c10_mrs_lorne', { style: 'bun', color: '#1a1824' }, { style: 'dress', main: '#c8b0d8', accent: '#f4ecd8', trim: '#c9a24a' }, { eyes: '#b03a5a' }),
  c10_fest_guard: puppet('c10_fest_guard', { style: 'short', color: '#4a3a2a' }, { style: 'armor', main: '#e8e0c8', metal: '#f0e8d0', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' }, { acc: ['helmet'], weapon: 'spear' }),
  c10_old_acolyte: puppet('c10_old_acolyte', { style: 'short', color: '#6a4a2a' }, { style: 'robe', main: '#e8e0cc', accent: '#c9a24a', trim: '#c9a24a' }, { weapon: 'tome' }),
  c10_townsman: puppet('c10_townsman', { style: 'short', color: '#8a6a4a' }, { style: 'vest', main: '#f0c070', accent: '#ffffff', trim: '#a07040', pants: '#5a4a3a' }, { acc: ['hat_wide'] }),
  c10_foe_puppet: puppet('c10_foe_puppet', { style: 'long', color: '#2a2a2a' }, { style: 'dress', main: '#f0e0c0', accent: '#ffffff', trim: '#d7a83a' }, { weapon: 'dagger' }),
  c10_dancer: puppet('c10_dancer', { style: 'braid', color: '#e3c25a' }, { style: 'dress', main: '#ff9ab0', accent: '#ffffff', trim: '#ffd060' }, { acc: ['ribbon'] }),
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
  // --- the shard
  E('c10_shardling', 'Shardling', 51, { type: 'elemental', color: '#ffe8a0', accent: '#fff8e0', eye: '#ff9a30', seed: 101 }, {
    stats: { hp: 1.2, def: 1.4, mag: 1.15 }, weak: ['dark', 'blunt'], resist: { light: -1, fire: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_holy', 1], ['e_ember', 1]], drops: [['sun_ember', 0.1], ['hi_ether', 0.15]], steal: ['holy_water', 'sun_ember'],
    desc: 'A splinter of the broken sun that learned to walk. It is warm, and it is not kind.',
  }),
  E('c10_noonhound', 'Noonhound', 51, { type: 'hound', color: '#f0e0b0', accent: '#ffffff', eye: '#ffb030', seed: 102 }, {
    stats: { hp: 1.0, spd: 1.3 }, weak: ['dark', 'ice'], resist: { light: 0.5 }, poise: 3,
    skills: [['e_bite', 3], ['e_howl', 1], ['e_holy', 0.5]], drops: [['mega_tonic', 0.1]], steal: ['hi_tonic', 'mega_tonic'],
    desc: 'The Choir\'s hounds, bred in the Spire\'s light. They cast no shadow at all.',
  }),
  E('c10_glare', 'Glare', 52, { type: 'eye', color: '#fff0c0', accent: '#ffb040', eye: '#ffffff', seed: 103 }, {
    stats: { hp: 0.9, mag: 1.3, evade: 8 }, weak: ['dark', 'pierce'], resist: { light: 0 }, poise: 2,
    skills: [['e_blind', 2], ['e_holy', 2], ['e_silence', 1]], drops: [['eye_drops', 0.4]], steal: ['eye_drops', 'sun_goggles'],
    desc: 'An eye of noon, floating. Looking at it is like looking at the sun, which nobody has done for a year.',
  }),
  E('c10_vesper_lancer', 'Vesper Lancer', 52, { type: 'humanoid', look: 'vesper_soldier' }, {
    stats: { hp: 1.1, str: 1.1, def: 1.2 }, weak: ['dark', 'bolt'], resist: { light: 0.5 }, poise: 3,
    skills: [['e_spear', 2], ['e_buff', 1], ['e_volley', 1]], drops: [['hi_tonic', 0.3]], steal: ['mega_tonic', 'hi_ether'],
    desc: 'The Spire\'s guard. They have been promised the best day of their lives, as soon as their shift ends.',
  }),
  E('c10_choir_seraph', 'Choir Seraph', 52, { type: 'angel', color: '#f8f0e0', accent: '#e0c070', eye: '#ffd060', seed: 104 }, {
    stats: { hp: 1.0, mag: 1.2, res: 1.3 }, weak: ['dark', 'wind'], resist: { light: 0 }, poise: 3,
    skills: [['e_holy', 2], ['e_heal', 1], ['e_holyall', 1]], drops: [['hi_ether', 0.2]], steal: ['holy_water', 'dawn_plume'],
    desc: 'A hymn given wings. It heals whatever stands between it and you.',
  }),
  E('c10_lift_warden', 'Vesper Lift-Warden', 53, { type: 'humanoid', look: 'vesper_soldier', size: 1.5 }, {
    stats: { hp: 3.5, str: 1.2, def: 1.3, exp: 3, gold: 4, cp: 2 }, weak: ['dark', 'bolt'], resist: { light: 0.5 }, poise: 5,
    skills: [['e_spear', 2], ['e_stun', 1], ['e_buff', 1]], drops: [['x_tonic', 1]], steal: ['mega_tonic', 'haste_anklet'],
    desc: 'Keeper of the Spire\'s back door. He has turned away four hundred pilgrims and remembers every face.',
  }),

  // --- the halls
  E('c10_hour_knight', 'Hour Knight', 53, { type: 'knight', color: '#e8dcb8', accent: '#c9a24a', weapon: 'greatsword', seed: 105 }, {
    stats: { hp: 1.4, str: 1.1, def: 1.5, spd: 0.85 }, weak: ['bolt', 'dark'], resist: { light: 0.5, slash: 0.7 }, poise: 5,
    skills: [['e_slash', 2], ['e_stun', 1], ['e_stillness', 0.3]], drops: [['mega_tonic', 0.15]], steal: ['hi_ether', 'sunshard_helm'],
    desc: 'Armor wound like a clock. It stops when it is struck — and so, for a moment, do you.',
  }),
  E('c10_stillwisp', 'Stillwisp', 52, { type: 'wisp', color: '#e8f0ff', eye: '#a0c0ff', seed: 106 }, {
    stats: { hp: 0.8, mag: 1.3, def: 2, res: 0.8, evade: 10 }, weak: ['fire', 'wind'], resist: { slash: 0.5, pierce: 0.5, blunt: 0.5 }, poise: 2,
    skills: [['e_frost', 2], ['e_sleep', 1], ['e_mpdrain', 1]], drops: [['hi_ether', 0.2]], steal: ['x_ether', 'hi_ether'],
    desc: 'A moment that never ended, drifting. Cold as an afternoon that will not let you go home.',
  }),
  E('c10_memory_moth', 'Memory Moth', 52, { type: 'insect', color: '#f0e8d0', accent: '#d0a0ff', eye: '#ffffff', seed: 107 }, {
    stats: { hp: 0.9, spd: 1.3 }, weak: ['fire', 'wind'], poise: 2,
    skills: [['e_bite', 2], ['e_spore', 1], ['e_drain', 1]], drops: [['panacea', 0.2]], steal: ['panacea', 'magic_fruit'],
    desc: 'They eat memories the way other moths eat coats. The Spire is a feast.',
  }),
  E('c10_vesper_cantor', 'Vesper Cantor', 53, { type: 'humanoid', look: 'acolyte' }, {
    stats: { hp: 1.0, mag: 1.3 }, weak: ['dark', 'slash'], resist: { light: 0.5 }, poise: 3,
    skills: [['e_holy', 2], ['e_heal', 1], ['e_silence', 1], ['e_vesper', 0.4]], drops: [['hi_ether', 0.3]], steal: ['hi_ether', 'bell_earring'],
    desc: 'They practice the Vespersong in shifts. Somebody, somewhere in the Spire, is always singing it.',
  }),
  E('c10_hour_warden', 'The Hour-Warden', 53, { type: 'angel', color: '#ffe8a0', accent: '#ffffff', eye: '#ffffff', size: 3, seed: 108 }, {
    boss: true, stats: { hp: 15, mag: 1.25, str: 1.1, def: 1.2, exp: 8, gold: 8, cp: 4 }, weak: ['dark', 'bolt'], resist: { light: -1, pierce: 0.7 }, poise: 8,
    ai: 'c10_hour_warden', drops: [['spirit_fruit', 1]], steal: ['x_ether', 'haste_anklet'],
    desc: 'The Spire\'s keeper of hours. It has only ever counted to twelve, and it has done so for forty years.',
  }),

  // --- Evernoon
  E('c10_festival_puppet', 'Festival Puppet', 54, { type: 'humanoid', look: 'c10_foe_puppet' }, {
    stats: { hp: 1.1, str: 1.1 }, weak: ['fire', 'slash'], resist: { light: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_wail', 1], ['allure', 0.6]], drops: [['mega_tonic', 0.15]], steal: ['hi_tonic', 'x_tonic'],
    desc: '"Lovely day for it!" it says, and smiles, and smiles, and comes for your throat.',
  }),
  E('c10_paper_lantern', 'Paper Lantern', 54, { type: 'wisp', color: '#ffb060', eye: '#fff0c0', seed: 109 }, {
    stats: { hp: 0.9, mag: 1.3, def: 1.4 }, weak: ['wind', 'ice'], resist: { fire: -1 }, poise: 2,
    skills: [['e_ember', 2], ['e_firebreath', 1]], drops: [['fire_bomb', 0.3]], steal: ['fire_bomb', 'ember_ring'],
    desc: 'A festival lantern that drifted loose. The candle inside has burned for forty years and never got any shorter.',
  }),
  E('c10_gilded_hound', 'Gilded Hound', 54, { type: 'hound', color: '#e0c060', accent: '#fff0c0', eye: '#ffffff', seed: 110 }, {
    stats: { hp: 1.1, spd: 1.3, str: 1.1 }, weak: ['dark', 'ice'], resist: { light: 0.5 }, poise: 3,
    skills: [['e_bite', 3], ['e_howl', 1]], drops: [['mega_tonic', 0.15]], steal: ['mega_tonic', 'swift_fruit'],
    desc: 'Somebody\'s dog, remembered as a very good dog. Remembered a little too hard.',
  }),
  E('c10_noon_guard', 'Festival Guard', 55, { type: 'knight', color: '#f0e8d0', accent: '#c03a3a', weapon: 'spear', seed: 111 }, {
    stats: { hp: 1.3, str: 1.15, def: 1.4 }, weak: ['dark', 'bolt'], resist: { light: 0.3 }, poise: 4,
    skills: [['e_spear', 2], ['e_holy', 1], ['e_shell', 1]], drops: [['hi_tonic', 0.3]], steal: ['mega_tonic', 'sunshard_shield'],
    desc: '"Welcome to the Festival of the Long Light. Enjoy the day." Forever.',
  }),
  E('c10_dancer', 'Maypole Dancer', 54, { type: 'humanoid', look: 'c10_dancer' }, {
    stats: { hp: 1.0, spd: 1.3 }, weak: ['pierce', 'dark'], poise: 3,
    skills: [['e_sweep', 2], ['allure', 1], ['e_sleep', 0.5]], drops: [['panacea', 0.3]], steal: ['panacea', 'ribbon'],
    desc: 'She has been dancing round the maypole since before your parents were born. She would love you to join in.',
  }),
  E('c10_choir_dead', 'Choir of the Dead', 54, { type: 'ghost', color: '#fff0d0', eye: '#ffd060', seed: 112 }, {
    stats: { hp: 0.9, mag: 1.2, def: 2, res: 0.9, evade: 6 }, weak: ['fire', 'dark'], resist: { light: -1, slash: 0.5, pierce: 0.5 }, poise: 2,
    skills: [['e_heal', 2], ['e_wail', 1], ['e_holy', 1]], drops: [['hi_ether', 0.3]], steal: ['holy_water', 'hi_ether'],
    desc: 'Mercy\'s congregation. They sing for her because she promised them they would never have to stop.',
  }),
  E('c10_mercy', 'Sister Mercy', 56, { type: 'humanoid', look: 'mercy_noon', size: 2 }, {
    boss: true, stats: { hp: 13, mag: 1.3, res: 1.3, spd: 1.1, exp: 9, gold: 9, cp: 5 }, weak: ['slash', 'dark'], resist: { light: 0 }, immune: ['sleep', 'doom'], poise: 9,
    ai: 'c10_mercy', summons: ['c10_choir_dead'], drops: [['archmage_ring', 1]], steal: ['x_ether', 'bell_earring'],
    desc: 'Evernoon\'s warden. She believes that a day which never ends cannot hurt anyone. She has never once been told no and believed it.',
  }),

  // --- the escape
  E('c10_unravelling', 'Unravelling', 55, { type: 'horror', color: '#3a2a5a', accent: '#f0e0c0', eye: '#ff80d0', seed: 113 }, {
    stats: { hp: 1.3, str: 1.1, mag: 1.1 }, weak: ['light', 'fire'], resist: { dark: 0.5 }, poise: 4,
    skills: [['e_claw', 2], ['e_darkwave', 1], ['e_drain', 1]], drops: [['gloam_shard', 0.2]], steal: ['gloam_shard', 'x_tonic'],
    desc: 'Where Evernoon comes apart, the Gloam comes in. It wears whatever it finds.',
  }),
  E('c10_frayed_puppet', 'Frayed Puppet', 55, { type: 'humanoid', look: 'c10_foe_puppet' }, {
    stats: { hp: 1.0, str: 1.15, spd: 1.1 }, weak: ['fire', 'light'], resist: { dark: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_wail', 1], ['e_drain', 1]], drops: [['mega_tonic', 0.2]], steal: ['x_tonic', 'gloam_shard'],
    desc: 'Its strings are cut. Its sentence is unfinished. It is very, very angry about both.',
  }),
  E('c10_forgot', 'What the Noon Forgot', 55, { type: 'horror', color: '#f0e8d8', accent: '#b080ff', eye: '#ff60c0', size: 3, seed: 114 }, {
    boss: true, stats: { hp: 12, mag: 1.25, str: 1.15, exp: 9, gold: 8, cp: 5 }, weak: ['dark', 'fire'], resist: { light: -1, blunt: 0.7 }, poise: 9,
    ai: 'c10_forgot', summons: ['c10_frayed_puppet'], drops: [['champions_belt', 1]], steal: ['megalixir', 'star_pendant'],
    desc: 'Every sentence Evernoon never finished, knotted together into something that wants, very badly, to be heard.',
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
  c10_ns_shards: T(['c10_shardling', 'c10_noonhound', 'c10_shardling']),
  c10_ns_hounds: T(['c10_noonhound', 'c10_noonhound', 'c10_noonhound']),
  c10_ns_glare: T(['c10_glare', 'c10_shardling']),
  c10_ns_lancers: T(['c10_vesper_lancer', 'c10_choir_seraph', 'c10_vesper_lancer']),
  c10_ns_mix: T(['c10_noonhound', 'c10_glare', 'c10_vesper_lancer']),
  c10_lift_guards: T(['c10_vesper_lancer', 'c10_lift_warden', 'c10_choir_seraph'], { canFlee: false, music: 'boss' }),
  c10_sh_knights: T(['c10_hour_knight', 'c10_stillwisp']),
  c10_sh_moths: T(['c10_memory_moth', 'c10_memory_moth', 'c10_memory_moth']),
  c10_sh_cantors: T(['c10_vesper_cantor', 'c10_hour_knight', 'c10_vesper_cantor']),
  c10_sh_mix: T(['c10_stillwisp', 'c10_memory_moth', 'c10_hour_knight']),
  c10_boss_warden: T(['c10_hour_warden'], { ...BOSS, bg: 'temple' }),
  c10_ev_puppets: T(['c10_festival_puppet', 'c10_festival_puppet', 'c10_festival_puppet']),
  c10_ev_lanterns: T(['c10_paper_lantern', 'c10_gilded_hound', 'c10_paper_lantern']),
  c10_ev_guards: T(['c10_noon_guard', 'c10_festival_puppet']),
  c10_ev_dancers: T(['c10_dancer', 'c10_festival_puppet', 'c10_dancer']),
  c10_ev_mix: T(['c10_gilded_hound', 'c10_paper_lantern', 'c10_noon_guard']),
  c10_boss_mercy: T(['c10_choir_dead', 'c10_mercy'], { ...BOSS, bg: 'evernoon' }),
  c10_esc_unravel: T(['c10_unravelling', 'c10_frayed_puppet'], { bg: 'gloam' }),
  c10_esc_unravel3: T(['c10_unravelling', 'c10_unravelling', 'c10_frayed_puppet'], { bg: 'gloam' }),
  c10_esc_guards: T(['c10_noon_guard', 'c10_frayed_puppet', 'c10_noon_guard'], { bg: 'gloam', canFlee: false, music: 'boss' }),
  c10_esc_corridor: T(['c10_frayed_puppet', 'c10_unravelling', 'c10_frayed_puppet'], { bg: 'gloam', canFlee: false, music: 'boss' }),
  c10_boss_forgot: T(['c10_forgot'], { ...BOSS, bg: 'gloam' }),
};

// ------------------------------------------------------------------ boss AI
const HOURS = ['TWELVE', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE'];
const FRAGMENTS = ['"Lovely day for—"', '"Any moment n—"', '"Ask me—"', '"And-a-one, and-a-two, and-a—"', '"Look how high it g—"', '"Have you seen my Lys—"'];

const bossAI = {
  /** Counts the hours aloud; at TWELVE it strikes High Noon. Breaking it resets the count. Faster below 40%. */
  c10_hour_warden(c) {
    c.m.hour = c.m.hour || 0;
    if (c.self.broken && c.m.hour > 0) {
      c.m.hour = 0;
      c.say('The Warden\'s clock-face cracks — its hands spin all the way back!');
    }
    c.m.hour += c.hpPct < 0.4 ? 4 : 3;
    if (c.m.hour >= 12) {
      c.m.hour = 0;
      c.say('TWELVE. The Hour-Warden strikes noon.');
      return c.use('e_noon');
    }
    c.say(`The Hour-Warden's hand moves. It is ${HOURS[c.m.hour]} o'clock.`);
    if (c.hpPct < 0.4 && c.once('still')) { c.say('Time thickens like honey around you.'); return c.use('e_stillness'); }
    return c.pick([['e_holy', 2], ['e_slash', 2], ['e_gravity', 0.7], ['e_silence', 0.6]]);
  },
  /** Choir summons; a lullaby that warns of the noon bells; below half she sings the Vespersong and tolls Doom. */
  c10_mercy(c) {
    const choir = c.allies.filter((a) => a.def.id === 'c10_choir_dead');
    if (c.m.bells) { c.m.bells = false; c.say('"NOON." Every bell in Evernoon rings at once.'); return c.use('e_noon'); }
    if (choir.length < 1 && (c.turn === 1 || (c.turn % 4 === 1 && c.rnd() < 0.8))) { c.say('"Sing with me, children."'); return c.use('e_summon'); }
    if (c.hpPct < 0.5 && c.once('aria')) {
      c.say('Mercy lets down her hood. "You will not take her. You will not take ANY of them." She sings the Vespersong.');
      c.self.addStatus('regen');
      return c.use('e_vesper');
    }
    if (c.hpPct < 0.45 && c.once('toll')) { c.say('A single soft bell begins to toll, counting someone down...'); return c.use('e_doom'); }
    if (c.hpPct < 0.25 && c.once('still')) { c.say('"Hush. Be still. Be still forever."'); return c.use('e_stillness'); }
    if (c.turn % 5 === 0) { c.m.bells = true; c.say('"Rest now." A lullaby — and under it, the bells of Evernoon begin to swing...'); return c.use('e_sleep'); }
    if (choir.some((a) => a.hp < a.maxHp * 0.5) && c.rnd() < 0.3) return c.use('e_healall');
    return c.pick([['e_lament', 2], ['e_holy', 2], ['e_dark', 1.5], ['e_silence', 1], ['e_drain', 1]]);
  },
  /** Gathers an unfinished sentence (telegraph) and finishes it the next turn; below half, light starts to hurt it. */
  c10_forgot(c) {
    if (c.m.sentence) { c.m.sentence = false; c.say('"—IT!" A hundred mouths finish the sentence at once.'); return c.use('e_lament'); }
    if (c.hpPct < 0.5 && c.once('forget')) {
      c.say('It begins to forget its own shape. Light pours through the gaps — light no longer heals it!');
      delete c.self.resist.light;
      c.self.weak.add('light');
      return c.use('e_summon');
    }
    if (c.turn % 4 === 2) {
      c.m.sentence = true;
      c.say(`${FRAGMENTS[Math.floor(c.rnd() * FRAGMENTS.length)]} — it is gathering the rest of the sentence...`);
      return c.use('e_charge');
    }
    if (c.allies.length < 1 && c.rnd() < 0.3) { c.say('A puppet tears loose from its body and staggers forward!'); return c.use('e_summon'); }
    return c.pick([['e_claw', 2], ['e_wail', 1], ['e_drain', 1.5], ['e_doom', 0.4], ['e_darkwave', 1.5]]);
  },
};

/** @type {import('../../types/data').ContentPack} */
export default {
  maps: [noonSpire, spireHalls, evernoon, lorneHouse],
  enemies, troops, looks, bossAI, shops: {}, worldNodes: [],
};
