// Content pack: Chapter 3 — "City of Bells" (Aurenne, the rooftops, the Undercroft).
// Enemy Lv 12–16, gear tier 3. Story scripts live in src/story/ch3*.js.

import { ITEMS } from '../items.js';
import { EQUIPMENT } from '../equipment.js';
import { SKILLS } from '../skills.js';
import aurenne from '../maps/ch3_aurenne.js';
import { c3Inn, c3Shop, c3Cathedral, c3Study, c3Archives, c3Tolliver, c3Venn, c3Almshouse } from '../maps/ch3_interiors.js';
import { c3Rooftops, c3Dream } from '../maps/ch3_rooftops.js';
import { c3Sewers, c3Ossuary, c3Lab } from '../maps/ch3_undercroft.js';
import { CH3_BOSS_AI } from '../../story/ch3_battle.js';

// ------------------------------------------------------------------ items & unique gear
Object.assign(ITEMS, {
  c3_bell_hammer: { name: 'Tolliver\'s Hammer', kind: 'key', desc: 'A bronze bell-hammer worn smooth by forty years of noons. Its name, scratched on the handle, is GLORIA.', icon: '✪' },
  c3_chronicle_page: { name: 'Chronicle Page', kind: 'key', desc: 'A loose page from the Chronicle of the Long Night. Someone has inked over certain words. Thoroughly.', icon: '✪' },
  c3_sir_pounce: { name: 'Sir Pounce', kind: 'key', desc: 'A large ginger cat, currently being carried by Sable. He is tolerating this.', icon: '✪' },
});

const accessory = (id, def) => { EQUIPMENT[id] = { id, slot: 'accessory', tier: 0, price: 0, ...def }; };
accessory('c3_earplugs', { name: 'Ringer\'s Earplugs', immune: ['sleep', 'silence'], desc: 'Immune to Sleep and Silence. Beeswax, forty years of bells, and a little spite.' });
accessory('c3_venn_signet', { name: 'Venn Signet', def: 5, res: 5, mods: { hpPct: 5 }, desc: 'DEF +5, RES +5, HP +5%. Sir Aldous Venn\'s ring. Too big for any finger but his.' });
accessory('c3_aurel_bell', { name: 'Bell of St. Aurel', res: 5, mods: { afterglow: 15 }, desc: 'RES +5, Afterglow gain +15%. A handbell from the first carillon of Aurenne. It rings true.' });

// ------------------------------------------------------------------ enemy & boss skills
Object.assign(SKILLS, {
  c3_knell: { name: 'Death Knell', kind: 'mag', target: 'enemies', power: 105, elem: 'blunt', status: [['stun', 0.3]], anim: 'quake', desc: 'The great bell tolls through bone.' },
  c3_toll: { name: 'Toll', kind: 'mag', target: 'enemy', power: 120, elem: 'blunt', status: [['silence', 0.35]], anim: 'song', desc: 'A single deafening note.' },
  c3_hammer: { name: 'Bell-Hammer', kind: 'phys', target: 'enemy', power: 165, elem: 'blunt', delay: 1.3, anim: 'blunt', desc: 'A blow meant for bronze.' },
  c3_vespers: { name: 'Broken Vespers', kind: 'mag', target: 'enemies', power: 105, elem: 'light', status: [['slow', 0.3]], anim: 'song', desc: 'The Dawnsong, sung backwards.' },
  c3_hymn: { name: 'Hymn of Small Mercies', kind: 'heal', target: 'allies', power: 70, anim: 'heal', desc: 'A lullaby that closes wounds.' },
  c3_unmaking: { name: 'Unmaking', kind: 'mag', target: 'enemy', power: 150, elem: 'dark', drain: 0.5, anim: 'dark', desc: 'The Gloam pulls at the edges of you.' },
});

// ------------------------------------------------------------------ looks
const SKIN = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };
const looks = {
  tolliver: { id: 'tolliver', skin: SKIN.fair, hair: { style: 'bald', color: '#d8d4d0' }, outfit: { style: 'vest', main: '#5a4a6a', accent: '#d8c8a8', trim: '#b08a3a', pants: '#3a3a40' }, acc: ['beard'] },
  quill: { id: 'quill', skin: SKIN.warm, hair: { style: 'bald', color: '#8a7a6a' }, outfit: { style: 'robe', main: '#7a6a4a', accent: '#e8dcc0', trim: '#c9a24a' }, acc: ['glasses'], weapon: 'tome' },
  orsolya: { id: 'orsolya', skin: SKIN.fair, hair: { style: 'bun', color: '#c8c4c8' }, eyes: '#4a5a7a', outfit: { style: 'dress', main: '#2a3a5a', accent: '#d8d0c0', trim: '#a8a8b8' }, acc: ['glasses'], build: 'tall' },
  hettie: { id: 'hettie', skin: SKIN.warm, hair: { style: 'bun', color: '#8a5a2a' }, outfit: { style: 'dress', main: '#a86a4a', accent: '#f4ecdc', trim: '#6a4a2a' }, blush: true },
  rowan: { id: 'rowan', skin: SKIN.tan, hair: { style: 'short', color: '#6a4a2a' }, outfit: { style: 'tunic', main: '#c8b898', accent: '#a83a2a', trim: '#6a4a2a', pants: '#4a3a2a' }, acc: ['scarf', 'beard'] },
  marta: { id: 'marta', skin: SKIN.fair, hair: { style: 'braid', color: '#b0502a' }, outfit: { style: 'vest', main: '#6a3a3a', accent: '#f0e4cc', trim: '#c9a24a', pants: '#4a3a3a' }, build: 'large' },
  oswin: { id: 'oswin', skin: SKIN.tan, hair: { style: 'short', color: '#3a3030' }, outfit: { style: 'vest', main: '#4a4a52', accent: '#c8b898', trim: '#b08a3a', pants: '#3a3030' }, acc: ['beard', 'glasses'], build: 'large' },
  ambrose: { id: 'ambrose', skin: SKIN.brown, hair: { style: 'short', color: '#c8c4c0' }, outfit: { style: 'coat', main: '#e8e4dc', accent: '#4a7a6a', trim: '#4a7a6a', pants: '#3a3a40' }, acc: ['glasses'], build: 'tall' },
  constance: { id: 'constance', skin: SKIN.pale, hair: { style: 'long', color: '#5a4a3a' }, outfit: { style: 'priest', main: '#7a7a82', accent: '#d8d8e0', trim: '#a83a4a' }, acc: ['hood'] },
  c3_grey_sister: { id: 'c3_grey_sister', skin: SKIN.fair, hair: { style: 'long', color: '#3a3030' }, outfit: { style: 'priest', main: '#6a6a74', accent: '#c8c8d0', trim: '#a83a4a' }, acc: ['hood'], weapon: 'lute' },
  imre: { id: 'imre', skin: SKIN.tan, hair: { style: 'short', color: '#2a2a30' }, outfit: { style: 'robe', main: '#e8e0cc', accent: '#c9a24a', trim: '#c9a24a' }, weapon: 'tome' },
  hollis: { id: 'hollis', skin: SKIN.fair, hair: { style: 'short', color: '#c0642e' }, outfit: { style: 'armor', main: '#888', metal: '#a9b3c2', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' }, weapon: 'spear' },
  lark: { id: 'lark', skin: SKIN.warm, hair: { style: 'ponytail', color: '#e3c25a' }, outfit: { style: 'coat', main: '#4a6a8a', accent: '#f0e0b0', trim: '#c9a24a', pants: '#3a3040' }, acc: ['hat_wide', 'feather'], weapon: 'lute' },
  posy: { id: 'posy', skin: SKIN.fair, hair: { style: 'twintails', color: '#c0642e' }, outfit: { style: 'dress', main: '#d87a9a', accent: '#f8f0e0', trim: '#6a9a4a' }, build: 'child', blush: true },
  nell: { id: 'nell', skin: SKIN.warm, hair: { style: 'bob', color: '#2a2018' }, outfit: { style: 'rags', main: '#7a8a6a', accent: '#a86a4a', pants: '#4a4a3a' }, build: 'child' },
  tuck: { id: 'tuck', skin: SKIN.deep, hair: { style: 'short', color: '#1a1410' }, outfit: { style: 'rags', main: '#6a5a4a', accent: '#8a8a6a', pants: '#3a3a30' }, build: 'child' },
  wick: { id: 'wick', skin: SKIN.pale, hair: { style: 'messy', color: '#e8d080' }, outfit: { style: 'rags', main: '#4a4a52', accent: '#7a6a5a', pants: '#3a3a3a' }, acc: ['headband'], build: 'child' },
  c3_mag: { id: 'c3_mag', skin: SKIN.tan, hair: { style: 'long', color: '#d8d4d0' }, outfit: { style: 'rags', main: '#5a5048', accent: '#7a6a5a', pants: '#3a3430' }, acc: ['hood'] },
  c3_crier: { id: 'c3_crier', skin: SKIN.fair, hair: { style: 'short', color: '#8a4a2a' }, outfit: { style: 'coat', main: '#a83a3a', accent: '#f0e0b0', trim: '#d7a83a', pants: '#2a2a30' }, acc: ['hat_wide'], build: 'large' },
  c3_cat: { id: 'c3_cat', skin: '#d8883a', hair: { style: 'none', color: '#d8883a' }, eyes: '#80c040', outfit: { style: 'rags', main: '#d8883a', accent: '#f4d8a8', pants: '#d8883a', boots: '#f4d8a8' }, acc: ['horns'], build: 'child' },
};

// ------------------------------------------------------------------ enemies
const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, ...opts });
const enemies = [
  // Rooftops
  E('c3_belfry_rook', 'Belfry Rook', 12, { type: 'bird', color: '#34343e', accent: '#7a7a90', eye: '#ffd040', seed: 31 }, {
    stats: { hp: 0.75, spd: 1.35, evade: 8 }, weak: ['pierce', 'wind'], poise: 2,
    skills: [['e_peck', 3], ['attack', 1], ['e_blind', 1]], drops: [['eye_drops', 0.3], ['tonic', 0.2]], steal: ['eye_drops', 'tonic'],
    desc: 'The rooks of St. Aurel\'s have heard the bells every hour of their lives. It has not improved their mood.',
  }),
  E('c3_gargoyle', 'Gutter Gargoyle', 13, { type: 'golem', color: '#7a7a82', accent: '#4a4a54', eye: '#60d0ff', seed: 32 }, {
    stats: { hp: 1.2, def: 1.8, res: 0.8, spd: 0.75 }, weak: ['blunt', 'bolt'], resist: { slash: 0.5, pierce: 0.5 }, poise: 4,
    skills: [['attack', 2], ['e_slam', 2], ['e_shell', 1]], drops: [['hi_tonic', 0.15]], steal: ['tonic', 'hi_tonic'],
    desc: 'Carved to spit rainwater off the roofs. Something down in the drains taught it to spit other things.',
  }),
  // Sewers
  E('c3_drain_crab', 'Drain Crab', 12, { type: 'crab', color: '#6a7a52', accent: '#a8b878', eye: '#f0e060', seed: 33 }, {
    stats: { hp: 1.0, def: 1.5, spd: 0.85 }, weak: ['bolt', 'blunt'], resist: { slash: 0.6 }, poise: 3,
    skills: [['attack', 3], ['e_shell', 1], ['e_spit', 1]], drops: [['antidote', 0.3]], steal: ['antidote', 'tonic'],
    desc: 'Grew fat on what the city flushes away. Is not grateful.',
  }),
  E('c3_bloat_leech', 'Bloat Leech', 13, { type: 'serpent', color: '#5a4038', accent: '#b07070', eye: '#ffe0a0', seed: 34 }, {
    stats: { hp: 1.15, mag: 1.1, spd: 0.9 }, weak: ['fire', 'slash'], resist: { blunt: 0.6 }, poise: 3,
    skills: [['e_drain', 2], ['e_constrict', 1], ['attack', 1]], drops: [['antidote', 0.25], ['tonic', 0.2]], steal: ['tonic', 'vigor_seed'],
    desc: 'It drinks until it is round, then keeps drinking out of habit.',
  }),
  E('c3_tallow_moth', 'Tallow Moth', 13, { type: 'insect', color: '#d8c8a0', accent: '#f0a040', eye: '#402010', seed: 35 }, {
    stats: { hp: 0.7, mag: 1.2, spd: 1.2, evade: 12 }, weak: ['wind', 'fire'], poise: 2,
    skills: [['e_spore', 2], ['e_blind', 1], ['attack', 1]], drops: [['eye_drops', 0.3], ['echo_herb', 0.2]], steal: ['eye_drops', 'smelling_salts'],
    desc: 'Lives on the Choir\'s candle-ends. Its dust smells like a cathedral and puts you to sleep like a sermon.',
  }),
  // Ossuary
  E('c3_charnel_hound', 'Charnel Hound', 14, { type: 'hound', color: '#c8c0a8', accent: '#6a5a4a', eye: '#ff6040', seed: 36 }, {
    stats: { hp: 1.0, str: 1.1, spd: 1.15 }, weak: ['light', 'blunt'], resist: { dark: 0.5, pierce: 0.7 }, poise: 3,
    skills: [['e_bite', 3], ['e_howl', 1]], drops: [['tonic', 0.3]], steal: ['tonic', 'hi_tonic'],
    desc: 'All bone and appetite. It still wags, which is worse.',
  }),
  E('c3_bone_archer', 'Bone Archer', 14, { type: 'skeleton', color: '#d8d0b8', accent: '#7a6a5a', eye: '#ff5040', seed: 37 }, {
    stats: { hp: 0.95, spd: 1.05 }, weak: ['blunt', 'light'], resist: { pierce: 0.5, dark: 0 }, immune: ['poison', 'sleep'], poise: 3,
    skills: [['e_arrow', 3], ['e_volley', 1]], drops: [['eye_drops', 0.2]], steal: ['ether', 'longbow'],
    desc: 'Aurenne\'s old city watch. Still guarding the gate. The gate is gone.',
  }),
  E('c3_votive_wisp', 'Votive Wisp', 14, { type: 'wisp', color: '#ffb050', eye: '#fff0c0', seed: 38 }, {
    stats: { hp: 0.7, mag: 1.3, def: 2.2, res: 0.7, evade: 10 }, weak: ['ice', 'wind'], resist: { fire: 0, slash: 0.5, pierce: 0.5, blunt: 0.6 }, poise: 2,
    skills: [['e_ember', 3], ['e_firebreath', 1]], drops: [['ether', 0.2], ['burn_salve', 0.3]], steal: ['ether', 'burn_salve'],
    desc: 'A candle lit for the dead, forty years ago. Nobody blew it out.',
  }),
  // Laboratory
  E('c3_cantor', 'Vesper Cantor', 15, { type: 'humanoid', look: 'c3_grey_sister', size: 1 }, {
    stats: { hp: 1.0, mag: 1.25, res: 1.2 }, weak: ['slash', 'bolt'], resist: { dark: 0.5, light: 0.5 }, poise: 3,
    skills: [['e_dark', 2], ['e_sleep', 1], ['e_heal', 1], ['e_buff', 1]], drops: [['ether', 0.3], ['echo_herb', 0.2]], steal: ['ether', 'wake_charm'],
    desc: 'A Sister of Small Mercies. She sings the Dawnsong. Something is wrong with the way she sings it.',
  }),
  E('c3_failed_vessel', 'Failed Vessel', 15, { type: 'horror', color: '#4a3a5a', accent: '#a07a9a', eye: '#ffd0f0', seed: 39 }, {
    stats: { hp: 1.3, str: 1.1 }, weak: ['light', 'fire'], resist: { dark: 0 }, poise: 3,
    skills: [['e_claw', 2], ['e_drain', 1], ['e_wail', 1]], drops: [['gloam_dust', 0.6]], steal: ['gloam_dust', 'hi_tonic'],
    desc: 'Mercy gave it a memory to hold. It dropped it.',
  }),
  E('c3_gloam_hulk', 'Gloam Hulk', 16, { type: 'horror', color: '#2a2040', accent: '#6a4a9a', eye: '#ff4080', size: 1.5, seed: 40 }, {
    stats: { hp: 2.0, str: 1.2, def: 1.2, spd: 0.8 }, weak: ['light'], resist: { dark: 0, blunt: 0.7 }, poise: 5,
    skills: [['e_claw', 2], ['e_crush', 1], ['e_quake', 1]], drops: [['gloam_shard', 0.3], ['gloam_dust', 0.6]], steal: ['gloam_dust', 'gloam_shard'],
    desc: 'Several people, once. Mercy\'s notes call it "an economy of scale."',
  }),
  // Dawnguard Hall sparring partners (optional, Bram)
  E('c3_squire', 'Dawnguard Squire', 14, { type: 'humanoid', look: 'hollis', size: 1 }, {
    stats: { hp: 1.3, def: 1.2 }, weak: ['bolt', 'pierce'], poise: 4,
    skills: [['e_slash', 3], ['e_stun', 1], ['e_shell', 1], ['e_buff', 1]], drops: [['hi_tonic', 0.3]], steal: ['tonic', 'steel_helm'],
    desc: 'Wooden rules, first to yield. Nobody has ever told a squire that wooden swords still hurt.',
  }),
  // Bosses
  E('c3_carillon_wight', 'The Carillon Wight', 15, { type: 'skeleton', color: '#c8b890', accent: '#b08a3a', eye: '#ffd060', size: 3, seed: 41 }, {
    boss: true, stats: { hp: 10, str: 1.15, mag: 1.1, def: 1.2, exp: 7, gold: 8, cp: 4 }, weak: ['blunt', 'light'], resist: { pierce: 0.5, slash: 0.8, dark: 0 },
    immune: ['poison', 'sleep'], poise: 6, ai: 'c3_wight', summons: ['bone_soldier'],
    drops: [['hi_tonic', 1], ['power_fruit', 1]], steal: ['hi_tonic', 'guard_fruit'],
    desc: 'The bell-founders of old Aurenne were buried beside their furnace. One of them got up to finish a job.',
  }),
  E('c3_mercy', 'Sister Mercy', 16, { type: 'humanoid', look: 'mercy', size: 2 }, {
    boss: true, stats: { hp: 9, mag: 1.25, res: 1.3, spd: 1.05, exp: 10, gold: 9, cp: 5 }, weak: ['slash', 'light'], resist: { dark: 0.3 },
    poise: 7, ai: 'c3_mercy', summons: ['c3_failed_vessel'],
    drops: [['bell_earring', 1], ['ember_feather', 1]], steal: ['hi_ether', 'focus_pendant'],
    desc: 'She believes she is saving them. That is what makes her dangerous.',
  }),
];

const T = (list, opts = {}) => ({ enemies: list, ...opts });
const troops = {
  c3_rooks: T(['c3_belfry_rook', 'c3_belfry_rook', 'c3_belfry_rook']),
  c3_rook_gargoyle: T(['c3_belfry_rook', 'c3_gargoyle', 'c3_belfry_rook']),
  c3_gargoyles: T(['c3_gargoyle', 'c3_gargoyle']),
  c3_crabs: T(['c3_drain_crab', 'c3_drain_crab']),
  c3_drain: T(['c3_drain_crab', 'c3_bloat_leech']),
  c3_leeches: T(['c3_bloat_leech', 'c3_bloat_leech', 'sewer_rat']),
  c3_moths: T(['c3_tallow_moth', 'c3_tallow_moth', 'c3_tallow_moth']),
  c3_sewer_mix: T(['sewer_rat', 'c3_tallow_moth', 'gloam_ooze']),
  c3_hounds: T(['c3_charnel_hound', 'c3_charnel_hound']),
  c3_archers: T(['bone_soldier', 'c3_bone_archer', 'c3_bone_archer']),
  c3_votives: T(['c3_votive_wisp', 'c3_votive_wisp', 'gloam_wraith']),
  c3_ossuary_mix: T(['c3_charnel_hound', 'bone_soldier', 'c3_votive_wisp']),
  c3_cantors: T(['c3_cantor', 'cultist']),
  c3_vessels: T(['c3_failed_vessel', 'c3_cantor', 'c3_failed_vessel']),
  c3_hulk: T(['c3_gloam_hulk']),
  c3_lab_mix: T(['gloam_beast', 'c3_cantor']),
  c3_spar: T(['c3_squire', 'c3_squire'], { canFlee: false, bg: 'town' }),
  c3_boss_wight: T(['c3_carillon_wight'], { boss: true, music: 'boss', canFlee: false, bg: 'undercroft' }),
  c3_boss_mercy: T(['c3_failed_vessel', 'c3_mercy'], { boss: true, music: 'boss', canFlee: false, bg: 'gloam' }),
};

export default {
  maps: [aurenne, c3Inn, c3Shop, c3Cathedral, c3Study, c3Archives, c3Tolliver, c3Venn, c3Almshouse,
    c3Rooftops, c3Dream, c3Sewers, c3Ossuary, c3Lab],
  enemies,
  troops,
  looks,
  bossAI: CH3_BOSS_AI,
  shops: {},
  worldNodes: [
    { id: 'aurenne', name: 'Aurenne', region: 'The Heartland', act: 1, x: 520, y: 420, mapId: 'aurenne', tx: 20, ty: 38, dir: 'up',
      unlock: 'c3_arrived', desc: 'The City of Bells. Seat of the Choir, home of the Grand Lantern.' },
  ],
};
