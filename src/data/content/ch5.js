// Content pack: ch5 — "The Last Sunset" (Lv 33–35, gear tier 5).
// Lanternfall at dusk, the Gloam-touched Tide Caves, the Keeper's Stair, the
// Lantern, the Vespersong, and the escape to the boat. Ends with the Sundering.
import { ITEMS } from '../items.js';
import { gearOfTier } from '../equipment.js';
import { LOOKS } from '../looks.js';
import { lfSunset, c5WrenHouse, c5NanaHouse, c5Inn, c5Store, c5Tobias } from '../maps/ch5_lanternfall.js';
import { c5TideCaves, c5KeepersStair, ch5Lantern } from '../maps/ch5_dungeons.js';

// ------------------------------------------------------------------ items
Object.assign(ITEMS, {
  c5_kindling_tea: {
    name: 'Kindling Tea', kind: 'consumable', price: 0, sell: 120, icon: '☕', battle: true, field: true,
    desc: 'Nana Brisa\'s brew for the night before every hard thing. Restores 1,200 HP and 60 MP to the party.',
    use: { target: 'allies', heal: 1200, mp: 60 },
  },
  c5_ysolde_bread: {
    name: 'Ysolde\'s Bread', kind: 'consumable', price: 0, sell: 5, icon: '◒', battle: true, field: true,
    desc: 'Dense, a little burnt. Not as good as Nana\'s. Restores 800 HP.',
    use: { target: 'ally', heal: 800 },
  },
});

// ------------------------------------------------------------------ enemies
const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, ...opts });

const enemies = [
  E('c5_dusk_jelly', 'Duskwater Jelly', 33, { type: 'slime', color: '#7a4aa0', eye: '#ffb070', seed: 51 }, {
    stats: { hp: 0.9, def: 0.8, res: 1.2 }, weak: ['fire', 'light'], resist: { ice: 0.5, dark: 0.5 }, poise: 3,
    skills: [['attack', 2], ['e_spit', 2], ['e_mpdrain', 1]], drops: [['hi_ether', 0.1], ['gloam_dust', 0.3]], steal: ['ether', 'gloam_dust'],
    desc: 'The tide pools of Lanternfall started glowing at night a week ago. This is why.',
  }),
  E('c5_gloam_crab', 'Gloamshell Crab', 33, { type: 'crab', color: '#5a3a6a', accent: '#c080ff', eye: '#ff80c0', seed: 52 }, {
    stats: { hp: 1.1, def: 1.6, spd: 0.85 }, weak: ['blunt', 'bolt'], resist: { slash: 0.6, dark: 0.5 }, poise: 4,
    skills: [['attack', 3], ['e_shell', 1], ['e_crush', 1]], drops: [['hi_tonic', 0.2]], steal: ['hi_tonic', 'guard_fruit'],
    desc: 'Its shell has gone the color of a bruise, and it rings like crystal when struck.',
  }),
  E('c5_drowned_fisher', 'Drowned Fisher', 34, { type: 'skeleton', color: '#c8d0c0', accent: '#3a5a6a', eye: '#80e0ff', seed: 53 }, {
    stats: { hp: 1.1, str: 1.1 }, weak: ['light', 'fire', 'blunt'], resist: { ice: 0.5, dark: 0.3 }, immune: ['poison', 'sleep'], poise: 3,
    skills: [['e_slash', 2], ['e_constrict', 1], ['e_wail', 1]], drops: [['hi_tonic', 0.25]], steal: ['hi_tonic', 'sea_charm'],
    desc: 'Lanternfall has given men to the sea for four hundred years. The tide caves remember every one of them.',
  }),
  E('c5_tide_wraith', 'Tide Wraith', 34, { type: 'ghost', color: '#4a7aa0', eye: '#c0f0ff', seed: 54 }, {
    stats: { hp: 0.85, mag: 1.25, def: 2.2, res: 0.8, evade: 8 }, weak: ['light', 'bolt'],
    resist: { slash: 0.4, pierce: 0.4, blunt: 0.6, ice: 0, dark: 0.5 }, poise: 3,
    skills: [['e_frost', 2], ['e_drain', 1], ['e_sleep', 1]], drops: [['hi_ether', 0.15], ['gloam_dust', 0.4]], steal: ['ether', 'gloam_dust'],
    desc: 'A cold shape that drifts above the pools, humming a lullaby nobody has sung in a hundred years.',
  }),
  E('c5_gloam_eel', 'Gloam Eel', 34, { type: 'serpent', color: '#3a2a5a', accent: '#c080ff', eye: '#ffe060', seed: 34 }, {
    stats: { hp: 1.05, mag: 1.15, spd: 1.1 }, weak: ['bolt', 'slash'], resist: { dark: 0.5, ice: 0.5 }, poise: 3,
    skills: [['e_bite', 2], ['e_constrict', 1], ['e_dark', 2]], drops: [['hi_tonic', 0.2]], steal: ['antidote', 'hi_tonic'],
    desc: 'The eels Ilse once complained about, changed. It is hard to say they are worse. They are certainly purpler.',
  }),
  E('c5_shardwing', 'Shardwing Bat', 33, { type: 'bat', color: '#4a3a6a', accent: '#c0a0ff', eye: '#ff60a0', seed: 33 }, {
    stats: { hp: 0.75, spd: 1.45, evade: 12 }, weak: ['pierce', 'light'], poise: 2,
    skills: [['e_bite', 2], ['e_drain', 2], ['e_blind', 1]], drops: [['eye_drops', 0.3]], steal: ['eye_drops', 'swift_fruit'],
    desc: 'Its wings have grown crystal edges. It sounds like wind chimes when it dives at you.',
  }),
  E('c5_vesper_knight', 'Vesper Knight', 34, { type: 'knight', color: '#7a8494', accent: '#2a2a40', weapon: 'spear', seed: 55 }, {
    stats: { hp: 1.3, str: 1.15, def: 1.4 }, weak: ['bolt', 'blunt'], resist: { slash: 0.7, pierce: 0.7 }, poise: 4,
    skills: [['e_spear', 3], ['e_stun', 1], ['e_shell', 1]], drops: [['hi_tonic', 0.3]], steal: ['hi_tonic', 'starsteel_helm'],
    desc: 'Lord-Commander Thorne\'s own guard. They do not ask why. That is why he chose them.',
  }),
  E('c5_sunderhound', 'Sunderhound', 35, { type: 'hound', color: '#2a1830', accent: '#ff7a3a', eye: '#ffb040', seed: 35 }, {
    stats: { hp: 0.9, str: 1.1, spd: 1.25 }, weak: ['light', 'ice'], resist: { dark: 0.5, fire: 0.5 }, poise: 3,
    skills: [['e_bite', 3], ['e_howl', 1], ['e_ember', 1]], drops: [['gloam_dust', 0.4]], steal: ['hi_tonic', 'gloam_dust'],
    desc: 'The first things to come through after the sky broke. Dogs made of dusk, with embers where their eyes should be.',
  }),
  E('c5_falling_ember', 'Falling Ember', 35, { type: 'elemental', color: '#ff9a3a', accent: '#fff0a0', eye: '#ffffff', seed: 36 }, {
    stats: { hp: 0.9, mag: 1.3 }, weak: ['ice', 'dark'], resist: { fire: 0 }, poise: 3,
    skills: [['e_ember', 2], ['e_firebreath', 1]], drops: [['sun_ember', 0.5]], steal: ['burn_salve', 'sun_ember'],
    desc: 'A fleck of the broken sun. It burns because it does not know how to do anything else.',
  }),
  E('c5_tidemourner', 'The Tidemourner', 34, { type: 'horror', color: '#3a3a5a', accent: '#8ac0d0', eye: '#c0f0ff', size: 3, seed: 57 }, {
    boss: true, stats: { hp: 11, mag: 1.2, str: 1.1, exp: 8, gold: 8, cp: 4 },
    weak: ['light', 'fire', 'bolt'], resist: { ice: 0, dark: 0.3 }, poise: 7,
    ai: 'c5_tidemourner', summons: ['c5_drowned_fisher'], drops: [['dusk_ring', 1]], steal: ['mega_tonic', 'dusk_ring'],
    desc: 'Everything the sea ever took from Lanternfall, knotted together and wearing itself like a coat. It speaks in a voice you know.',
  }),
  E('c5_garrick', 'Lord-Commander Garrick', 35, { type: 'humanoid', look: 'garrick', size: 2 }, {
    boss: true, stats: { hp: 12, str: 1.3, def: 1.3, exp: 9, gold: 10, cp: 5 },
    weak: ['bolt', 'pierce'], resist: { slash: 0.7, dark: 0.5 }, poise: 8,
    ai: 'c5_garrick', drops: [['hunters_eye', 1]], steal: ['mega_tonic', 'starsteel_plate'],
    desc: 'Head of the Dawnguard and the Hierophant\'s sword. He has never once lost a duel, and has never once enjoyed winning one.',
  }),
];

// ------------------------------------------------------------------ troops
const T = (list, opts = {}) => ({ enemies: list, ...opts });
const troops = {
  c5_shore_jellies: T(['c5_dusk_jelly', 'c5_dusk_jelly', 'c5_gloam_crab']),
  c5_shore_crabs: T(['c5_gloam_crab', 'c5_gloam_crab']),
  c5_shore_mix: T(['c5_dusk_jelly', 'c5_shardwing', 'c5_dusk_jelly']),
  c5_tc_fishers: T(['c5_drowned_fisher', 'c5_drowned_fisher']),
  c5_tc_wraith: T(['c5_tide_wraith', 'c5_dusk_jelly', 'c5_tide_wraith']),
  c5_tc_eels: T(['c5_gloam_eel', 'c5_gloam_eel']),
  c5_tc_bats: T(['c5_shardwing', 'c5_shardwing', 'c5_shardwing']),
  c5_tc_mix: T(['c5_gloam_crab', 'c5_drowned_fisher', 'c5_shardwing']),
  c5_ks_mix: T(['c5_drowned_fisher', 'c5_tide_wraith', 'c5_drowned_fisher']),
  c5_ks_eel_wraith: T(['c5_gloam_eel', 'c5_tide_wraith']),
  c5_ks_crabs: T(['c5_gloam_crab', 'c5_gloam_eel', 'c5_gloam_crab']),
  c5_ks_bats: T(['c5_shardwing', 'c5_shardwing', 'c5_tide_wraith', 'c5_shardwing']),
  c5_boss_tidemourner: T(['c5_tidemourner'], { boss: true, music: 'boss', canFlee: false, bg: 'tidecave' }),
  c5_boss_garrick: T(['c5_vesper_knight', 'c5_garrick', 'c5_vesper_knight'], { boss: true, music: 'boss', canFlee: false, bg: 'lantern' }),
  c5_run_hounds: T(['c5_sunderhound', 'c5_sunderhound', 'c5_sunderhound'], { canFlee: false, bg: 'ruin' }),
  c5_run_square: T(['c5_sunderhound', 'c5_sunderhound'], { canFlee: false, bg: 'ruin' }),
  c5_run_embers: T(['c5_falling_ember', 'c5_sunderhound', 'c5_falling_ember'], { canFlee: false, bg: 'ruin' }),
};

// ------------------------------------------------------------------ boss AI
const bossAI = {
  c5_tidemourner(c) {
    if (c.m.charging) { c.m.charging = false; c.say('The Tidemourner brings the whole drowned sea down on you!'); return c.use('e_tidal'); }
    if (c.hpPct < 0.6 && c.once('call')) { c.say('"...help us... it\'s so cold... help..." Hands claw up out of the water.'); return c.use('e_summon'); }
    if (c.hpPct < 0.3 && c.once('call2')) { c.say('It calls again, in voices you almost know.'); return c.use('e_summon'); }
    if (c.turn % 4 === 3) { c.m.charging = true; c.say('The Tidemourner draws in a long, wet, rattling breath...'); return c.use('e_charge'); }
    if (c.hpPct < 0.5 && c.rnd() < 0.3) { c.say('It sings, in a man\'s voice, a song about a gull.'); return c.use('e_lament'); }
    return c.pick([['e_constrict', 2], ['e_drain', 2], ['e_frost', 2], ['e_wail', 1]]);
  },
  c5_garrick(c) {
    if (c.m.verdict) { c.m.verdict = false; c.say('"VERDICT."'); return c.use('e_crush'); }
    if (c.hpPct < 0.5 && c.once('rally')) { c.say('"Dawnguard! To me! Show these children what discipline looks like!"'); return c.use('e_buff'); }
    if (c.turn % 4 === 2) { c.m.verdict = true; c.say('Garrick lifts his greatsword high over his head. "Iron Verdict—"'); return c.use('e_charge'); }
    if (c.turn % 3 === 0) return c.use('e_cleave');
    return c.pick([['e_slash', 3], ['e_stun', 1], ['attack', 2]]);
  },
};

// ------------------------------------------------------------------ looks & shops
const looks = {
  pell: { ...LOOKS.villager_9, id: 'pell' },
  maela: { ...LOOKS.villager_36, id: 'maela' },
  toller: {
    id: 'toller', skin: '#e9c09a', hair: { style: 'short', color: '#8a6a4a' },
    outfit: { style: 'armor', main: '#888', metal: '#a9b3c2', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' }, weapon: 'spear',
  },
};

const shops = {
  c5_marlow: {
    name: 'Marlow\'s Goods',
    items: ['hi_tonic', 'mega_tonic', 'hi_ether', 'panacea', 'ember_feather', 'tonic_mist', 'holy_water', 'smoke_ball',
      ...gearOfTier(5, (e) => e.slot === 'weapon'), ...gearOfTier(5, (e) => e.slot !== 'weapon' && e.slot !== 'accessory')],
  },
};

export default {
  maps: [lfSunset, c5WrenHouse, c5NanaHouse, c5Inn, c5Store, c5Tobias, c5TideCaves, c5KeepersStair, ch5Lantern],
  enemies, troops, looks, bossAI, shops, worldNodes: [],
};
