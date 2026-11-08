// Content pack: Chapter 2 — "The Wider World".
// Port Gale → the Gale Coast Road → the Whisperwold → Thistledown → Red Tam's quarry.
// Enemy Lv 6–11, gear tier 2. Story scripts live in src/story/ch2_*.js.

import { ITEMS } from '../items.js';
import { EQUIPMENT } from '../equipment.js';
import { LOOKS } from '../looks.js';
import { portGale, pgInn, pgShop, pgOdile } from '../maps/ch2_port_gale.js';
import { galeRoad } from '../maps/ch2_coast.js';
import { woldOuter, woldHeart } from '../maps/ch2_whisperwold.js';
import { thistledown, tdInn, tdShop, sageHouse, tdFields } from '../maps/ch2_thistledown.js';
import { quarry } from '../maps/ch2_quarry.js';

// ------------------------------------------------------------------ items & unique gear
ITEMS.c2_merry_acorn = { name: 'Merry\'s Acorn', kind: 'key', desc: 'A small acorn, warm as a held hand. "The key to my secret place."', icon: '✪' };
ITEMS.c2_thorne_writ = { name: 'Thorne\'s Writ', kind: 'key', desc: '"The girl is to be detained and conveyed to the Cathedral of Dawn. Unharmed." Sealed in black wax.', icon: '✪' };
EQUIPMENT.c2_marits_ring = {
  id: 'c2_marits_ring', name: 'Marit\'s Ring', slot: 'accessory', tier: 0, price: 0,
  mag: 4, res: 4, mods: { mpPct: 10 }, desc: 'MAG +4, RES +4, MP +10%. Inscribed inside: "Keep the light."',
};
EQUIPMENT.c2_pell_horseshoe = {
  id: 'c2_pell_horseshoe', name: 'Pell\'s Horseshoe', slot: 'accessory', tier: 0, price: 0,
  lck: 10, def: 4, desc: 'LCK +10, DEF +4. The third horseshoe from over the Pell farmhouse door.',
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
  // Gale Coast
  E('c2_cliff_kite', 'Cliff Kite', 7, { type: 'bird', color: '#c8b89a', accent: '#6a5a4a', eye: '#ffcc40', seed: 17 }, {
    stats: { hp: 0.85, spd: 1.35 }, weak: ['pierce', 'bolt'], resist: { wind: 0.5 }, poise: 2,
    skills: [['e_peck', 2], ['e_gust', 2], ['attack', 1]], drops: [['tonic', 0.2], ['eye_drops', 0.1]], steal: ['eye_drops', 'swift_fruit'],
    desc: 'Rides the Gale like a thrown knife. Nests in the cliffs and resents everyone below them.',
  }),
  E('c2_rockshell', 'Rockshell', 7, { type: 'crab', color: '#7a8a8a', accent: '#c8d0d0', eye: '#2a2a2a', seed: 27 }, {
    stats: { hp: 1.1, def: 1.9, res: 0.7, spd: 0.7 }, weak: ['blunt', 'bolt'], resist: { slash: 0.5, pierce: 0.6 }, poise: 4,
    skills: [['attack', 3], ['e_shell', 1], ['e_slam', 1]], drops: [['tonic', 0.25], ['sea_glass', 0.4]], steal: ['sea_glass', 'guard_fruit'],
    desc: 'A crab that took one look at the Gale and grew a boulder on its back.',
  }),
  E('c2_spume_jelly', 'Spume Jelly', 6, { type: 'slime', color: '#b8e0e8', eye: '#2a4050', seed: 6 }, {
    stats: { hp: 0.9, def: 0.8, mag: 1.1 }, weak: ['fire', 'bolt'], resist: { ice: 0.5, blunt: 0.7 }, poise: 2,
    skills: [['attack', 2], ['e_spit', 2], ['e_blind', 1]], drops: [['tonic', 0.15], ['sea_glass', 0.3]], steal: ['tonic', 'eye_drops'],
    desc: 'Sea-foam that learned to hold a grudge. Spits salt in your eyes.',
  }),
  E('c2_thorne_guard', 'Thorne\'s Own', 8, { type: 'humanoid', look: 'vesper_soldier', size: 1 }, {
    stats: { hp: 1.2, def: 1.2, str: 1.05 }, weak: ['bolt', 'blunt'], resist: { slash: 0.7 }, poise: 4,
    skills: [['e_spear', 3], ['attack', 2], ['e_stun', 1]], drops: [['tonic', 0.3], ['hi_tonic', 0.1]], steal: ['tonic', 'iron_spear'],
    desc: 'The Lord-Commander\'s personal guard. Black trim, a sun with a closed eye, and orders they will not explain.',
  }),
  // The Whisperwold
  E('c2_mourning_moth', 'Mourning Moth', 8, { type: 'insect', color: '#8a7aa8', accent: '#e0d0ff', eye: '#ffffff', seed: 8 }, {
    stats: { hp: 0.8, mag: 1.15, spd: 1.2, evade: 8 }, weak: ['fire', 'wind'], resist: { dark: 0.5 }, poise: 2,
    skills: [['attack', 2], ['e_sleep', 1], ['e_dark', 1]], drops: [['echo_herb', 0.2], ['ether', 0.08]], steal: ['smelling_salts', 'wake_charm'],
    desc: 'They drink tears. In the Whisperwold they never go thirsty.',
  }),
  E('c2_hollow_sapling', 'Hollow Sapling', 9, { type: 'treant', color: '#5a4a3a', accent: '#b07aff', eye: '#d0a0ff', seed: 9 }, {
    stats: { hp: 1.2, def: 1.2, spd: 0.8 }, weak: ['fire', 'slash'], resist: { blunt: 0.6, ice: 0.7 }, poise: 3,
    skills: [['attack', 2], ['e_constrict', 1], ['e_drain', 1]], drops: [['tonic', 0.25], ['gloam_dust', 0.2]], steal: ['tonic', 'vigor_seed'],
    desc: 'A young tree with a hollow where its heart should be. Something whispers in the hollow.',
  }),
  E('c2_lost_shade', 'Lost Shade', 10, { type: 'ghost', color: '#8aa0c8', eye: '#e0f0ff', seed: 10 }, {
    stats: { hp: 0.9, mag: 1.25, def: 2.2, res: 0.8, evade: 8 }, weak: ['light', 'fire'], resist: { slash: 0.4, pierce: 0.4, blunt: 0.5, dark: 0.5 }, poise: 3,
    skills: [['e_dark', 2], ['e_wail', 1], ['e_silence', 1]], drops: [['ether', 0.2], ['gloam_dust', 0.35]], steal: ['ether', 'echo_herb'],
    desc: 'It is saying something. It has been saying it for a hundred years. It no longer knows to whom.',
  }),
  E('c2_hollow_mother', 'The Hollow Mother', 10, { type: 'treant', color: '#3a2e2a', accent: '#b07aff', eye: '#e0b0ff', size: 3, seed: 33 }, {
    boss: true, stats: { hp: 11, str: 1.05, mag: 1.15, def: 1.1, exp: 8, gold: 6, cp: 4 },
    weak: ['fire', 'slash'], resist: { dark: 0.5, blunt: 0.6, ice: 0.7 }, poise: 6,
    ai: 'c2_hollow_mother', summons: ['c2_hollow_sapling'], drops: [['hi_tonic', 1], ['wisdom_seed', 1]], steal: ['ether', 'magic_fruit'],
    desc: 'The oldest tree in the Whisperwold. She gathered the voices of the dead into her hollow so that none of them would ever be forgotten — or ever be allowed to end.',
  }),
  // Thistledown & the quarry
  E('c2_strawman', 'Old Strawman', 11, { type: 'golem', color: '#b89048', accent: '#b07aff', eye: '#ff9040', size: 2, seed: 11 }, {
    boss: true, stats: { hp: 6, mag: 1.15, exp: 5, gold: 5, cp: 3 }, weak: ['fire', 'slash'], resist: { pierce: 0.5, dark: 0.5 }, poise: 5,
    ai: 'c2_strawman', summons: ['murder_crow'], drops: [['burn_salve', 1], ['power_fruit', 0.5]], steal: ['ether', 'power_fruit'],
    desc: 'Three generations of Pells built him. One sack of cheap purple stuffing woke him up.',
  }),
  E('c2_bandit_bruiser', 'Bandit Bruiser', 10, { type: 'humanoid', look: 'c2_bruiser', size: 1.5 }, {
    stats: { hp: 1.4, str: 1.15, spd: 0.85 }, weak: ['pierce', 'ice'], poise: 4,
    skills: [['attack', 2], ['e_slam', 1], ['e_buff', 1]], drops: [['tonic', 0.3], ['hi_tonic', 0.1]], steal: ['hi_tonic', 'iron_axe'],
    desc: 'Red Tam hires by the pound.',
  }),
  E('c2_quarry_hound', 'Tam\'s Mastiff', 9, { type: 'hound', color: '#8a4a2a', accent: '#3a2a1a', eye: '#ffb030', seed: 21 }, {
    stats: { hp: 1.0, str: 1.1, spd: 1.25 }, weak: ['fire', 'pierce'], poise: 3,
    skills: [['e_bite', 3], ['e_howl', 1]], drops: [['wolf_pelt', 0.3], ['tonic', 0.2]], steal: ['tonic', 'antidote'],
    desc: 'Answers to "Biscuit". Do not call it Biscuit.',
  }),
  E('c2_rubblekin', 'Rubblekin', 10, { type: 'golem', color: '#8a8478', accent: '#b07aff', eye: '#c080ff', seed: 31 }, {
    stats: { hp: 1.3, def: 1.7, res: 0.8, spd: 0.75 }, weak: ['blunt', 'light'], resist: { slash: 0.6, pierce: 0.5, dark: 0.5 }, poise: 4,
    skills: [['attack', 2], ['e_slam', 1], ['e_shell', 1]], drops: [['gloam_dust', 0.3]], steal: ['gloam_dust', 'guard_fruit'],
    desc: 'Quarry stone that soaked up the violet seam beneath it, and got up.',
  }),
  E('c2_sage_bethan', 'Bethan, the Crestless Sage', 10, { type: 'humanoid', look: 'sage', size: 1.5 }, {
    boss: true, stats: { hp: 7, mag: 1.2, str: 1.05, exp: 4, gold: 0, cp: 3 }, weak: ['pierce', 'bolt'], poise: 5,
    ai: 'c2_bethan', drops: [['ether', 1]], steal: ['ether', 'sage_ring'],
    desc: 'Mender, Arcanist, Ranger, Cantor, Pugilist. "Same old woman. Different tools."',
  }),
];

// ------------------------------------------------------------------ troops
/**
 * @param {string[]} list
 * @param {Partial<import('../../types/data').TroopDef>} [opts]
 * @returns {import('../../types/data').TroopDef}
 */
const T = (list, opts = {}) => ({ enemies: list, ...opts });
/** @type {Record<string, import('../../types/data').TroopDef>} */
const troops = {
  c2_thornes_pair: T(['c2_thorne_guard', 'c2_thorne_guard'], { canFlee: false, bg: 'town' }),
  c2_kites: T(['c2_cliff_kite', 'c2_cliff_kite']),
  c2_coast_mix: T(['c2_rockshell', 'c2_spume_jelly']),
  c2_jellies: T(['c2_spume_jelly', 'c2_spume_jelly', 'c2_spume_jelly']),
  c2_coast_wolves: T(['wold_wolf', 'c2_cliff_kite']),
  c2_shell_pair: T(['c2_rockshell', 'c2_rockshell']),
  c2_moths: T(['c2_mourning_moth', 'c2_mourning_moth']),
  c2_moth_wisp: T(['c2_mourning_moth', 'whisper_wisp']),
  c2_saplings: T(['c2_hollow_sapling', 'thornling']),
  c2_shades: T(['c2_lost_shade', 'whisper_wisp']),
  c2_shade_pair: T(['c2_lost_shade', 'c2_lost_shade']),
  c2_wold_mix: T(['c2_hollow_sapling', 'c2_mourning_moth', 'sporecap']),
  c2_quarry_dogs: T(['c2_quarry_hound', 'c2_quarry_hound']),
  c2_quarry_gang: T(['bandit', 'c2_bandit_bruiser', 'bandit_archer']),
  c2_bruiser_dog: T(['c2_bandit_bruiser', 'c2_quarry_hound']),
  c2_rubble: T(['c2_rubblekin', 'c2_rubblekin']),
  c2_rubble_mix: T(['c2_rubblekin', 'bandit']),
  c2_gate_crew: T(['bandit', 'c2_bandit_bruiser', 'bandit'], { canFlee: false }),
  boss_c2_hollow_mother: T(['c2_hollow_mother'], { boss: true, music: 'boss', canFlee: false, bg: 'wold' }),
  boss_c2_strawman: T(['murder_crow', 'c2_strawman', 'murder_crow'], { boss: true, music: 'boss', canFlee: false, bg: 'fields' }),
  boss_c2_bethan: T(['c2_sage_bethan'], { boss: true, music: 'battle', canFlee: false, bg: 'fields' }),
};

// ------------------------------------------------------------------ boss scripts
const BETHAN_CRESTS = ['Mender', 'Arcanist', 'Ranger', 'Cantor', 'Pugilist'];

const bossAI = {
  c2_hollow_mother(c) {
    if (c.m.charging) { c.m.charging = false; c.say('"Stay... stay... STAY."'); return c.use('e_darkwave'); }
    if (c.hpPct < 0.5 && c.once('split')) { c.say('Her bark splits wide open. A hundred voices weep at once!'); return c.use('e_wail'); }
    if (c.allies.length < 2 && c.turn % 4 === 2) { c.say('"Come back to me, little ones..."'); return c.use('e_summon'); }
    if (c.turn % 5 === 4) { c.m.charging = true; c.say('The Hollow Mother draws every voice in the wold into her branches...'); return c.use('e_charge'); }
    const hurt = c.hpPct < 0.5;
    return c.pick([['e_constrict', 3], ['e_sleep', hurt ? 1.5 : 1], ['e_drain', hurt ? 2 : 1], ['attack', 2]]);
  },
  c2_strawman(c) {
    if (c.m.charging) { c.m.charging = false; c.say('Old Strawman bursts into violet flame!'); return c.use('e_firebreath'); }
    if (!c.allies.length && c.turn > 1 && c.once(`crows${Math.floor(c.turn / 3)}`)) {
      c.say('Old Strawman flaps its sleeves. Crows pour out of its coat!');
      return c.use('e_summon');
    }
    if (c.turn % 4 === 0) { c.m.charging = true; c.say('Violet dust gathers in Old Strawman\'s stitched grin...'); return c.use('e_charge'); }
    if (c.hpPct < 0.4 && c.once('shoo')) { c.say('"SHOOOOOOO!"'); return c.use('e_wail'); }
    return c.pick([['attack', 3], ['e_ember', 2], ['e_blind', 1]]);
  },
  c2_bethan(c) {
    const phase = Math.floor((c.turn - 1) / 2) % BETHAN_CRESTS.length;
    if (c.m.phase !== phase) { c.m.phase = phase; c.say(`Bethan's Crest shifts — ${BETHAN_CRESTS[phase]}!`); }
    switch (phase) {
      case 0: return c.hpPct < 0.85 ? c.use('e_heal', [c.self]) : c.use('e_shell');
      case 1: return c.pick([['e_ember', 1], ['e_frost', 1], ['e_spark', 1]]);
      case 2: return c.pick([['e_arrow', 2], ['e_volley', 1]]);
      case 3: return c.pick([['e_sleep', 1], ['e_wail', 1]]);
      default: return c.pick([['e_rampage', 1], ['e_stun', 2]]);
    }
  },
};

// ------------------------------------------------------------------ looks (portraits match speaker first names)
const SKIN = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52' };
const looks = {
  harrow: {
    id: 'harrow', skin: SKIN.fair, hair: { style: 'short', color: '#2a2a30' }, eyes: '#4a5a6a',
    outfit: { style: 'armor', main: '#666', metal: '#6a7484', accent: '#2a2a40', trim: '#c0c0d0', pants: '#2a2a30' },
    acc: ['cape'], capeColor: '#1a1a28', weapon: 'sword',
  },
  mags: {
    id: 'mags', skin: SKIN.warm, hair: { style: 'bun', color: '#8a3a2a' },
    outfit: { style: 'vest', main: '#5a3a4a', accent: '#e8dcc0', trim: '#3a2a1a', pants: '#3a3030' }, acc: ['bandana'], build: 'large',
  },
  osric: {
    id: 'osric', skin: SKIN.tan, hair: { style: 'bald', color: '#c8c8c8' },
    outfit: { style: 'coat', main: '#4a5a6a', accent: '#d8ccb0', trim: '#3a3a3a', pants: '#3a3a4a' }, acc: ['beard', 'glasses'],
  },
  odile: {
    id: 'odile', skin: SKIN.tan, hair: { style: 'braid', color: '#d8d4d0' },
    outfit: { style: 'coat', main: '#2a4a6a', accent: '#e8dcc0', trim: '#c9a24a', pants: '#3a3a4a' }, acc: ['hat_wide'],
  },
  hesketh: {
    id: 'hesketh', skin: SKIN.tan, hair: { style: 'messy', color: '#e8e4dc' },
    outfit: { style: 'rags', main: '#5a5a4a', accent: '#8a7a5a', pants: '#4a4a3a' }, acc: ['beard', 'hat_wide'],
  },
  merry: {
    id: 'merry', skin: '#dce6f6', hair: { style: 'twintails', color: '#9ab0d8' }, eyes: '#4a6aa8',
    outfit: { style: 'dress', main: '#c8d8f0', accent: '#ffffff', trim: '#8aa0c8' }, build: 'child', blush: true,
  },
  bethan: { ...LOOKS.sage, id: 'bethan' },
  c2_reeve: {
    id: 'c2_reeve', skin: SKIN.brown, hair: { style: 'bun', color: '#5a3a2a' },
    outfit: { style: 'dress', main: '#8a6a3a', accent: '#e8dcc0', trim: '#5a3a2a' }, acc: ['glasses'], build: 'tall',
  },
  c2_fen: {
    id: 'c2_fen', skin: SKIN.tan, hair: { style: 'short', color: '#6a4a2a' },
    outfit: { style: 'vest', main: '#5a6a3a', accent: '#c8b898', trim: '#3a2a1a', pants: '#4a3a2a' }, acc: ['helmet'], weapon: 'spear',
  },
  c2_scarecrow: {
    id: 'c2_scarecrow', skin: '#c8a050', hair: { style: 'messy', color: '#d8b860' }, eyes: '#1a1a1a',
    outfit: { style: 'rags', main: '#6a5a3a', accent: '#a83a2a', pants: '#5a4a30' }, acc: ['hat_wide'],
  },
  c2_strawman: {
    id: 'c2_strawman', skin: '#b89048', hair: { style: 'messy', color: '#c8a050' }, eyes: '#b07aff',
    outfit: { style: 'coat', main: '#3a3a4a', accent: '#a83a2a', pants: '#4a3a2a' }, acc: ['hat_wide', 'scarf'], build: 'large',
  },
  c2_bruiser: {
    id: 'c2_bruiser', skin: SKIN.tan, hair: { style: 'bald', color: '#3a2a1a' },
    outfit: { style: 'vest', main: '#4a3a2a', accent: '#8a3a2a', trim: '#3a2a1a', pants: '#3a3a30' }, acc: ['beard'], weapon: 'axe', build: 'large',
  },
};

// ------------------------------------------------------------------ fast travel
/** @type {import('../../types/data').WorldNode[]} */
const worldNodes = [
  { id: 'port_gale', name: 'Port Gale', region: 'The Gale Coast', act: 1, x: 240, y: 500, mapId: 'port_gale', tx: 24, ty: 9, dir: 'down', unlock: 'c2_stealth_done', desc: 'Harbor town of the Gale Coast. Sailors, smugglers, and the Salt & Lantern.' },
  { id: 'whisperwold', name: 'The Whisperwold', region: 'The Gale Coast', act: 1, x: 330, y: 440, mapId: 'c2_wold_outer', tx: 3, ty: 20, dir: 'right', unlock: 'c2_wold_enter', desc: 'An ancient forest where the trees speak with the voices of the dead.' },
  { id: 'thistledown', name: 'Thistledown', region: 'The Heartland', act: 1, x: 420, y: 470, mapId: 'thistledown', tx: 23, ty: 18, dir: 'down', unlock: 'c2_td_arrived', desc: 'A farming village of beehives and autumn fields. Home of the Crestless Sage.' },
];

/** @type {import('../../types/data').ContentPack} */
export default {
  maps: [portGale, pgInn, pgShop, pgOdile, galeRoad, woldOuter, woldHeart, thistledown, tdInn, tdShop, sageHouse, tdFields, quarry],
  enemies,
  troops,
  looks,
  bossAI,
  shops: {},
  worldNodes,
};
