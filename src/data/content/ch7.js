// Content pack: Chapter 7 — "The Mender of Ash" (Lv 38–43, gear tier 6).
// Ruined Aurenne, the Ember Ward, and the Drowned Undercroft.

import { ITEMS } from '../items.js';
import { ruinedAurenne, emberWard, lastBell } from '../maps/ch7_aurenne.js';
import { drownedUndercroft, drownedChoir } from '../maps/ch7_undercroft.js';

// ---------------------------------------------------------------- key items
Object.assign(ITEMS, {
  c7_water: { name: 'Ward Water', kind: 'key', desc: 'A bucket from the rationed well, for the Ember Ward.', icon: '✪' },
  c7_sunsalt: { name: 'Sunsalt Phials', kind: 'key', desc: 'The Choir\'s remedy for Gloam-rot. Each phial glows like a coal kept under ash.', icon: '✪' },
  c7_tags: { name: 'Three Tin Tags', kind: 'key', desc: 'DORAN. MAGS. LITTLE COBB. The third sunsalt team.', icon: '✪' },
  c7_doll: { name: 'Captain Buttons', kind: 'key', desc: 'A rag doll with one button eye. Very brave.', icon: '✪' },
  c7_seeds: { name: 'Dawnmoss Seeds', kind: 'key', desc: 'Gold-green spores in a Choir apothecary tin. They will grow in anything.', icon: '✪' },
  c7_bell_clapper: { name: 'Bell Clapper', kind: 'key', desc: 'The clapper of the Bellwrights\' Tenor. Heavy as a promise, dented from the fall.', icon: '✪' },
  c7_letters: { name: 'Dead Letters', kind: 'key', desc: 'Three letters from Petra\'s bag, posted the day before the world ended.', icon: '✪' },
  c7_cassian_letter: { name: 'A Letter for Wren', kind: 'key', desc: '"My dear restless heart — I have kept a place for you." Choir seal, broken.', icon: '✪' },
});

const SKIN = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };
const ROT = '#c4b0cc'; // skin touched by Gloam-rot

const looks = {
  // Named NPCs whose first name doubles as their portrait key.
  sorrel: { id: 'sorrel', skin: SKIN.tan, hair: { style: 'braid', color: '#8a8a88' }, outfit: { style: 'vest', main: '#5a4a3a', accent: '#a83a3a', trim: '#3a2a20', pants: '#3a3030', boots: '#2a2020' }, acc: ['bandana'], weapon: 'spear' },
  noll: { id: 'noll', skin: SKIN.brown, hair: { style: 'short', color: '#2a2018' }, outfit: { style: 'coat', main: '#e0d8c8', accent: '#a83a3a', trim: '#6a5a4a', pants: '#4a4048' }, build: 'child' },
  fenna: { id: 'fenna', skin: SKIN.warm, hair: { style: 'ponytail', color: '#c8602a' }, outfit: { style: 'coat', main: '#a8682a', accent: '#e8d8b0', trim: '#4a3020', pants: '#3a3030' }, acc: ['scarf', 'glasses'] },
  osric: { id: 'osric', skin: SKIN.fair, hair: { style: 'bald', color: '#d8d4d0' }, outfit: { style: 'robe', main: '#6a5040', accent: '#c8a050', trim: '#3a2a20' }, acc: ['beard'] },
  petra: { id: 'petra', skin: SKIN.fair, hair: { style: 'bob', color: '#a83a2a' }, outfit: { style: 'coat', main: '#2a4a7a', accent: '#e0c050', trim: '#c9a24a', pants: '#2a2a3a' }, acc: ['hat_wide'] },
  hollis: { id: 'hollis', skin: SKIN.tan, hair: { style: 'messy', color: '#d8d4d0' }, outfit: { style: 'vest', main: '#4a6a3a', accent: '#c8b888', trim: '#3a2a20', pants: '#4a3a2a' }, acc: ['hat_wide', 'beard'] },
  aurel: { id: 'aurel', skin: ROT, hair: { style: 'long', color: '#e8e4dc' }, outfit: { style: 'robe', main: '#c8c0b0', accent: '#a89060', trim: '#8a7a5a' }, acc: ['glasses'] },
  // Townsfolk and patients.
  c7_hobb: { id: 'c7_hobb', skin: SKIN.tan, hair: { style: 'short', color: '#5a3a2a' }, outfit: { style: 'vest', main: '#6a5a3a', accent: '#d8c8a8', trim: '#3a2a20', pants: '#3a3a30' }, acc: ['beard'], build: 'large' },
  c7_gant: { id: 'c7_gant', skin: SKIN.warm, hair: { style: 'bun', color: '#9a9490' }, outfit: { style: 'dress', main: '#7a4a3a', accent: '#d8c8a8', trim: '#4a3a2a' }, acc: ['scarf'] },
  c7_dimmy: { id: 'c7_dimmy', skin: SKIN.fair, hair: { style: 'messy', color: '#c8a050' }, outfit: { style: 'rags', main: '#6a6a7a', accent: '#a89880', pants: '#4a4048' }, build: 'child' },
  c7_fell: { id: 'c7_fell', skin: SKIN.pale, hair: { style: 'short', color: '#6a4a2a' }, outfit: { style: 'rags', main: '#8a8070', accent: '#c8c0a8', pants: '#4a4040' } },
  c7_toll: { id: 'c7_toll', skin: SKIN.deep, hair: { style: 'bun', color: '#e8e4dc' }, outfit: { style: 'robe', main: '#5a3a5a', accent: '#d8b860', trim: '#3a2a3a' }, acc: ['scarf'] },
  c7_orderly: { id: 'c7_orderly', skin: SKIN.brown, hair: { style: 'ponytail', color: '#2a2018' }, outfit: { style: 'coat', main: '#e0d8c8', accent: '#a83a3a', trim: '#6a5a4a', pants: '#4a4048' } },
  c7_patient: { id: 'c7_patient', skin: ROT, hair: { style: 'messy', color: '#5a4a3a' }, outfit: { style: 'rags', main: '#c8c0b8', accent: '#8a7a9a', pants: '#6a6070' } },
  c7_patient_b: { id: 'c7_patient_b', skin: ROT, hair: { style: 'long', color: '#c8c4c0' }, outfit: { style: 'dress', main: '#b8b0b8', accent: '#8a7a9a', trim: '#6a6070' } },
  c7_pell: { id: 'c7_pell', skin: ROT, hair: { style: 'spiky', color: '#6a4a2a' }, outfit: { style: 'tunic', main: '#c8c0b8', accent: '#3f6fa8', pants: '#5a5060' }, acc: ['headband'], build: 'child' },
  c7_bette: { id: 'c7_bette', skin: SKIN.fair, hair: { style: 'twintails', color: '#3a2a1a' }, outfit: { style: 'dress', main: '#c8a8b8', accent: '#e8e0d8', trim: '#8a6a7a' }, build: 'child' },
  c7_marguerite: { id: 'c7_marguerite', skin: SKIN.warm, hair: { style: 'bun', color: '#6a3a2a' }, outfit: { style: 'dress', main: '#3a4a5a', accent: '#e8dcc0', trim: '#c9a24a' } },
  // The Drowned Choir.
  c7_drowned: { id: 'c7_drowned', skin: '#8aa4a8', hair: { style: 'long', color: '#c8d0d0' }, eyes: '#e0f8ff', outfit: { style: 'robe', main: '#5a6a78', accent: '#a8c0c8', trim: '#c9a24a' }, acc: ['hood'] },
  c7_precentor: { id: 'c7_precentor', skin: '#7a9498', hair: { style: 'long', color: '#e0e8e8' }, eyes: '#e0f8ff', outfit: { style: 'priest', main: '#4a5a68', accent: '#c9a24a', trim: '#a8c0c8' }, acc: ['circlet'], build: 'tall', weapon: 'staff' },
};

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
  // ---- Undercroft, floor 1 (Lv 38–41)
  E('c7_rotgnawer', 'Rotgnawer', 38, { type: 'hound', color: '#5a4a5a', accent: '#b080c0', eye: '#e080ff', seed: 71 }, {
    stats: { hp: 0.85, spd: 1.3 }, weak: ['fire', 'light'], resist: { dark: 0.5 }, poise: 2,
    skills: [['e_bite', 3], ['e_poison', 1], ['attack', 1]], drops: [['antidote', 0.3], ['gloam_dust', 0.3]], steal: ['panacea', 'gloam_dust'],
    desc: 'Undercroft rats that ate what the rot left behind, and caught it. Their bite carries it on.',
  }),
  E('c7_rot_bloom', 'Rot Bloom', 39, { type: 'plant', color: '#7a4a8a', accent: '#e0a0ff', seed: 72 }, {
    stats: { hp: 1.15, mag: 1.15, spd: 0.8 }, weak: ['fire', 'slash'], resist: { blunt: 0.5, dark: -1 }, poise: 3,
    skills: [['e_spore', 2], ['e_poison', 1], ['e_drain', 2]], drops: [['panacea', 0.2], ['gloam_dust', 0.4]], steal: ['panacea', 'magic_fruit'],
    desc: 'Gloam-rot, given time and darkness and nothing else to do, learns to flower.',
  }),
  E('c7_drowned_acolyte', 'Drowned Acolyte', 39, { type: 'humanoid', look: 'c7_drowned' }, {
    stats: { hp: 1.0, mag: 1.2, res: 1.2 }, weak: ['bolt', 'light'], resist: { ice: 0.3, dark: 0.5 }, poise: 3,
    skills: [['e_spit', 2], ['e_silence', 1], ['e_drain', 1]], drops: [['hi_ether', 0.15], ['echo_herb', 0.3]], steal: ['hi_ether', 'bell_earring'],
    desc: 'An acolyte of the Under-Choir. It drowned singing. It is still singing.',
  }),
  E('c7_knell_wisp', 'Knell Wisp', 39, { type: 'wisp', color: '#c8b070', eye: '#fff4c0', seed: 73 }, {
    stats: { hp: 0.7, mag: 1.3, def: 2.2, res: 0.7, evade: 10 }, weak: ['blunt', 'wind'], resist: { slash: 0.4, pierce: 0.4, light: 0.5 }, poise: 2,
    skills: [['e_spark', 2], ['e_wail', 1], ['e_sleep', 1]], drops: [['hi_ether', 0.2]], steal: ['hi_ether', 'wake_charm'],
    desc: 'The last note of a bell that broke mid-toll. It drifts, still ringing, looking for the rest of itself.',
  }),
  E('c7_ossuary_warden', 'Ossuary Warden', 40, { type: 'skeleton', color: '#d8d0bc', accent: '#7a8a9a', eye: '#a0e0ff', seed: 74 }, {
    stats: { hp: 1.2, def: 1.3 }, weak: ['blunt', 'light', 'fire'], resist: { pierce: 0.5, dark: 0, ice: 0.7 }, immune: ['poison', 'sleep'], poise: 3,
    skills: [['e_slash', 3], ['e_stun', 1], ['e_shell', 1]], drops: [['hi_tonic', 0.3]], steal: ['mega_tonic', 'ashen_helm'],
    desc: 'Aurenne\'s honored dead were buried with their swords. Some of them never put the swords down.',
  }),
  E('c7_unfinished', 'The Unfinished', 41, { type: 'horror', color: '#5a4a7a', accent: '#e0c0d0', eye: '#ffe0f0', size: 1.5, seed: 75 }, {
    stats: { hp: 1.5, str: 1.15 }, weak: ['light', 'fire'], resist: { dark: 0, slash: 0.8 }, poise: 4,
    skills: [['e_claw', 2], ['e_darkwave', 1], ['e_wail', 1]], drops: [['gloam_shard', 0.15], ['gloam_dust', 0.6]], steal: ['gloam_shard', 'spirit_fruit'],
    desc: 'One of Sister Mercy\'s Remembrances, never finished. It is trying very hard to remember a face. Any face.',
  }),
  // ---- Cistern of Bells, floor 2 (Lv 40–43)
  E('c7_cistern_eel', 'Cistern Eel', 40, { type: 'serpent', color: '#2a4a5a', accent: '#a0d8e0', eye: '#f0f080', seed: 76 }, {
    stats: { hp: 1.1, mag: 1.1 }, weak: ['bolt', 'slash'], resist: { ice: 0.5 }, poise: 3,
    skills: [['e_constrict', 2], ['e_spit', 2], ['e_bite', 1]], drops: [['hi_tonic', 0.3]], steal: ['mega_tonic', 'frost_ring'],
    desc: 'They came up the drains when the sea fell into the sky. They are not going back.',
  }),
  E('c7_bellshell', 'Bellshell Crab', 41, { type: 'crab', color: '#8a6a3a', accent: '#d8b860', eye: '#202020', seed: 77 }, {
    stats: { hp: 1.1, def: 1.8, res: 0.8, spd: 0.75 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5, pierce: 0.6 }, poise: 4,
    skills: [['attack', 3], ['e_shell', 1], ['e_crush', 1]], drops: [['guard_fruit', 0.05], ['hi_tonic', 0.3]], steal: ['mega_tonic', 'guard_fruit'],
    desc: 'It wears a handbell for a shell. When it is angry, which is always, it rings.',
  }),
  E('c7_drowned_cantor', 'Drowned Cantor', 42, { type: 'humanoid', look: 'c7_drowned' }, {
    stats: { hp: 1.1, mag: 1.25, res: 1.3 }, weak: ['bolt', 'slash'], resist: { ice: 0.3, dark: 0.5 }, poise: 3,
    skills: [['e_lament', 2], ['e_healall', 1], ['e_dark', 2]], drops: [['hi_ether', 0.25]], steal: ['hi_ether', 'focus_pendant'],
    desc: 'A cantor of the Under-Choir. Its voice holds the others together, the way a nail holds a coffin.',
  }),
  // ---- Bosses
  E('c7_chorister', 'Drowned Chorister', 40, { type: 'humanoid', look: 'c7_drowned' }, {
    stats: { hp: 0.6, mag: 0.85, res: 1.0 }, weak: ['blunt', 'bolt'], resist: { ice: 0.3, dark: 0.5 }, poise: 2,
    skills: [['e_spit', 3], ['e_silence', 1], ['e_sleep', 1]], drops: [['hi_ether', 0.3]], steal: ['hi_ether', 'echo_herb'],
    desc: 'One voice in the Drowned Choir. Alone, it is only a drowned child. Together, they are a hymn.',
  }),
  E('c7_precentor', 'Drowned Precentor', 43, { type: 'humanoid', look: 'c7_precentor', size: 2 }, {
    boss: true, stats: { hp: 3.2, mag: 0.8, res: 1.0, exp: 9, gold: 8, cp: 4 }, weak: ['slash', 'bolt', 'light'], resist: { ice: 0, dark: 0.5 }, poise: 7,
    ai: 'c7_precentor', summons: ['c7_chorister'], drops: [['phoenix_charm', 1]], steal: ['x_ether', 'hi_ether'],
    desc: 'The Under-Choir\'s Precentor. He was told to hold the note until noon. He is a very obedient man.',
  }),
  E('c7_old_clapper', 'Old Clapper', 45, { type: 'drake', color: '#8a3a2a', accent: '#c8a050', eye: '#ffd060', size: 3, seed: 78 }, {
    boss: true, stats: { hp: 3.6, str: 0.8, mag: 0.72, def: 1.1, exp: 7, gold: 9, cp: 4 }, weak: ['ice', 'pierce'], resist: { fire: 0.2, blunt: 0.7 }, poise: 7,
    ai: 'c7_old_clapper', drops: [['power_fruit', 1]], steal: ['mega_tonic', 'ember_ring'],
    desc: 'A rust-red wyrm that nested in the Reliquary and swallowed a bell whole. It tolls when it breathes.',
  }),
];

// Act II parties are small (Wren and Ilse alone here), so regular foes sit well
// below the raw level curve; bosses carry explicit multipliers above.
const TUNE = { hp: 0.6, str: 0.72, mag: 0.72 };
for (const e of enemies) {
  if (e.boss) continue;
  e.stats = e.stats || {};
  for (const [k, f] of Object.entries(TUNE)) e.stats[k] = Math.round((e.stats[k] ?? 1) * f * 100) / 100;
}

/**
 * @param {string[]} list
 * @param {Partial<import('../../types/data').TroopDef>} [opts]
 * @returns {import('../../types/data').TroopDef}
 */
const T = (list, opts = {}) => ({ enemies: list, ...opts });
/** @type {Record<string, import('../../types/data').TroopDef>} */
const troops = {
  c7_rats: T(['c7_rotgnawer', 'c7_rotgnawer', 'c7_rotgnawer']),
  c7_rat_bloom: T(['c7_rotgnawer', 'c7_rot_bloom', 'c7_rotgnawer']),
  c7_acolytes: T(['c7_drowned_acolyte', 'c7_drowned_acolyte']),
  c7_wisps: T(['c7_knell_wisp', 'c7_knell_wisp', 'c7_rotgnawer']),
  c7_bones: T(['c7_ossuary_warden', 'c7_ossuary_warden']),
  c7_bones_wisp: T(['c7_ossuary_warden', 'c7_knell_wisp', 'c7_ossuary_warden']),
  c7_lab: T(['c7_unfinished', 'c7_rot_bloom']),
  c7_eels: T(['c7_cistern_eel', 'c7_cistern_eel']),
  c7_crabs: T(['c7_bellshell', 'c7_cistern_eel']),
  c7_cantor: T(['c7_drowned_acolyte', 'c7_drowned_cantor', 'c7_drowned_acolyte']),
  c7_deep_mix: T(['c7_knell_wisp', 'c7_bellshell', 'c7_drowned_acolyte']),
  c7_boss_choir: T(['c7_chorister', 'c7_precentor', 'c7_chorister'], { boss: true, music: 'boss', canFlee: false }),
  c7_boss_clapper: T(['c7_old_clapper'], { boss: true, music: 'boss', canFlee: false }),
};

const bossAI = {
  /** The Held Note: kill a chorister before it lands, or eat the Vespersong. */
  c7_precentor(c) {
    const choir = c.allies.filter((a) => a.def.id === 'c7_chorister');
    if (c.m.holding) {
      c.m.holding = false;
      if (choir.length >= 2) { c.say('The Held Note breaks over you — the Dawnsong, sung backward!'); return c.use('e_vesper'); }
      c.say('The harmony falters. The Precentor\'s note cracks into a wail.');
      return c.use('e_lament');
    }
    if (c.hpPct < 0.5 && c.once('flood')) { c.say('"Louder. LOUDER. Let the water carry it!" The cistern surges.'); return c.use('e_tidal'); }
    if (c.hpPct < 0.25 && c.once('noon')) { c.say('"Hold it... hold it until noon..."'); return c.use('e_stillness'); }
    if (choir.length < 2 && c.turn % 3 === 0) {
      c.say('The Precentor lifts his baton. A drowned voice answers from the water.');
      return c.use('e_summon');
    }
    if (choir.length >= 2 && c.turn % 4 === 2) {
      c.m.holding = true;
      c.say('The choristers hold one swelling note. Silence one of them — quickly!');
      return c.use('e_shell');
    }
    if (c.hpPct < 0.5) return c.pick([['e_tidal', 1], ['e_drain', 2], ['e_dark', 2], ['e_silence', 1]]);
    return c.pick([['e_dark', 3], ['e_drain', 1], ['e_silence', 1], ['attack', 1]]);
  },

  /** Tolls (charges) every third turn, then breathes fire. */
  c7_old_clapper(c) {
    if (c.m.tolling) { c.m.tolling = false; c.say('_BONNNG._ The sound comes out as fire.'); return c.use('e_firebreath'); }
    if (c.hpPct < 0.4 && c.once('rage')) { c.say('Old Clapper thrashes. Rust and bell-metal rain from the ceiling!'); return c.use('e_quake'); }
    if (c.turn % 3 === 0) { c.m.tolling = true; c.say('Deep in Old Clapper\'s belly, something begins to toll. Brace yourselves!'); return c.use('e_charge'); }
    return c.pick([['e_bite', 3], ['e_claw', 2], ['e_wail', 1]]);
  },
};

/** @type {import('../../types/data').ContentPack} */
export default {
  maps: [ruinedAurenne, emberWard, lastBell, drownedUndercroft, drownedChoir],
  enemies,
  troops,
  looks,
  bossAI,
  shops: {},
  worldNodes: [
    { id: 'c7_ruined_aurenne', name: 'Ruins of Aurenne', region: 'The City of Bells', act: 2, x: 512, y: 438,
      mapId: 'ruined_aurenne', tx: 20, ty: 38, dir: 'up', unlock: 'c7_arrived', desc: 'The City of Bells, silent and drifting. Ilse\'s Ember Ward keeps its people breathing.' },
  ],
};
