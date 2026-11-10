// Content pack: Chapter 8 — "Children of the Wreck" (Lv 42–47, gear tier 6).
// Kiteholm, the Underhang, the wreck of the Vigil, and the Penitent.

import { ITEMS } from '../items.js';
import { EQUIPMENT } from '../equipment.js';
import { kiteholm, rustyAnchor, kiteNest, baronHall, scrapArena } from '../maps/ch8_kiteholm.js';
import { underhang, vigilWreck } from '../maps/ch8_underhang.js';

// ---------------------------------------------------------------- items & unique gear
Object.assign(ITEMS, {
  c8_brig_key: { name: 'Brig Key', kind: 'key', desc: 'An iron key from the Vigil\'s captain\'s chair, stamped BRIG.', icon: '✪' },
  c8_orders: { name: 'Vesper Orders', kind: 'key', desc: '"Children remember the best days best. Evernoon has need of them." Signed with a weeping mask.', icon: '✪' },
  c8_wick_kite: { name: 'Wick\'s Kite', kind: 'key', desc: 'A patched blue kite with a painted grin, rescued from a shrike nest.', icon: '✪' },
});
const gear = (id, def) => { EQUIPMENT[id] = { id, price: 0, ...def }; };
gear('c8_kite_tail', { name: 'Kite-Tail Ribbon', slot: 'accessory', tier: 0, spd: 4, mods: { evade: 6 }, desc: 'SPD +4, evasion +6%. The tail of the first kite Pip ever built. Lucky. That\'s science.' });
gear('c8_old_shield', { name: 'Bram\'s Old Shield', slot: 'offhand', armor: 'shield', tier: 6, def: 40, res: 22, mods: { evade: 9, hpPct: 5 }, desc: 'Max HP +5%. Dented Dawnguard steel, redeemed from the Baron. Heavy as an apology.' });
gear('c8_venn_signet', { name: 'Venn\'s Signet', slot: 'accessory', tier: 0, def: 12, res: 8, mods: { hpPct: 8 }, desc: 'DEF +12, RES +8, max HP +8%. Sir Aldous Venn\'s ring, left behind when the armor emptied. "Good lad."' });

const SKIN = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };
const kid = (id, skin, hair, hairColor, main, acc = []) => ({ id, skin, hair: { style: hair, color: hairColor }, outfit: { style: 'rags', main, accent: '#c8b898', pants: '#4a3a2a' }, acc, build: 'child' });

const looks = {
  // Named NPCs (first name = portrait key).
  tansy: { id: 'tansy', skin: SKIN.tan, hair: { style: 'bob', color: '#c84a2a' }, outfit: { style: 'vest', main: '#c8702a', accent: '#e8d8b0', pants: '#4a3a2a' }, acc: ['glasses', 'scarf'], build: 'child' },
  wick: kid('wick', SKIN.fair, 'messy', '#e3c25a', '#3a6aa8', ['bandana']),
  moth: kid('moth', SKIN.deep, 'twintails', '#2a2018', '#8a6a9a', ['scarf']),
  dask: { id: 'dask', skin: SKIN.warm, hair: { style: 'short', color: '#3a2a2a' }, outfit: { style: 'coat', main: '#5a2a5a', accent: '#e0c050', trim: '#c9a24a', pants: '#2a2030' }, acc: ['hat_wide', 'beard', 'glasses'], build: 'large' },
  ratchet: { id: 'ratchet', skin: SKIN.brown, hair: { style: 'long', color: '#e8e4dc' }, outfit: { style: 'coat', main: '#a82a2a', accent: '#e8d8b0', trim: '#c9a24a', pants: '#2a2020' }, acc: ['hat_wide', 'eyepatch'], build: 'tall' },
  quill: { id: 'quill', skin: SKIN.tan, hair: { style: 'messy', color: '#d8d4d0' }, outfit: { style: 'vest', main: '#6a5a3a', accent: '#c8b888', trim: '#3a2a20', pants: '#4a4048' }, acc: ['glasses', 'beard'] },
  // Townsfolk.
  c8_brindle: { id: 'c8_brindle', skin: SKIN.fair, hair: { style: 'bun', color: '#9a9490' }, outfit: { style: 'dress', main: '#4a5a6a', accent: '#d8c8a8', trim: '#3a2a20' }, acc: ['scarf', 'glasses'] },
  c8_grudge: { id: 'c8_grudge', skin: SKIN.tan, hair: { style: 'bald', color: '#3a2a2a' }, outfit: { style: 'vest', main: '#3a3a3a', accent: '#a89880', trim: '#2a2020', pants: '#3a3030' }, acc: ['beard'], build: 'large' },
  c8_thug: { id: 'c8_thug', skin: SKIN.tan, hair: { style: 'short', color: '#2a2018' }, outfit: { style: 'vest', main: '#5a2a5a', accent: '#a89880', trim: '#c9a24a', pants: '#2a2030' }, acc: ['bandana'], weapon: 'axe', build: 'large' },
  c8_kite_a: kid('c8_kite_a', SKIN.brown, 'spiky', '#2a2018', '#a8682a', ['scarf']),
  c8_kite_b: kid('c8_kite_b', SKIN.fair, 'short', '#c0642e', '#4a6a3a', ['bandana']),
  c8_kite_c: kid('c8_kite_c', SKIN.warm, 'braid', '#3a2a1a', '#a83a4a'),
  c8_kite_d: kid('c8_kite_d', SKIN.tan, 'ponytail', '#6a4a2a', '#3a5a7a', ['glasses']),
  c8_kite_e: kid('c8_kite_e', SKIN.pale, 'messy', '#d8d4d0', '#6a6a7a', ['headband']),
  // Vespers and the dead.
  c8_raider: { id: 'c8_raider', skin: SKIN.fair, hair: { style: 'short', color: '#2a2a2a' }, outfit: { style: 'armor', main: '#3a3a44', metal: '#4a4a58', accent: '#6a3aa8', trim: '#8a6ac8', pants: '#1a1a20' }, acc: ['helmet', 'cape'], capeColor: '#2a1a3a', weapon: 'spear' },
  c8_cantor: { id: 'c8_cantor', skin: SKIN.pale, hair: { style: 'long', color: '#e8e0d0' }, outfit: { style: 'robe', main: '#2a2238', accent: '#e8e0d0', trim: '#8a6ac8' }, acc: ['hood'], weapon: 'lute' },
  c8_hollow: { id: 'c8_hollow', skin: '#8a8a98', hair: { style: 'none', color: '#000' }, eyes: '#000000', outfit: { style: 'armor', main: '#3a3a40', metal: '#5a5a66', accent: '#2a2a40', trim: '#6a6a78', pants: '#1a1a20' }, acc: ['helmet'], weapon: 'sword' },
  c8_aldous: { id: 'c8_aldous', skin: '#a8a4b0', hair: { style: 'short', color: '#9a9690' }, eyes: '#000000', outfit: { style: 'armor', main: '#222', metal: '#2a2a34', accent: '#6a3aa8', trim: '#8a6ac8', pants: '#1a1a20' }, acc: ['beard', 'cape'], capeColor: '#1a1424', weapon: 'greatsword', build: 'large' },
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
  // ---- The Underhang (Lv 42–44)
  E('c8_gale_shrike', 'Gale Shrike', 42, { type: 'bird', color: '#8a7a9a', accent: '#e0d0f0', eye: '#ffd060', seed: 81 }, {
    stats: { hp: 0.8, spd: 1.4, evade: 8 }, weak: ['pierce', 'bolt'], resist: { wind: 0.3 }, poise: 2,
    skills: [['e_peck', 3], ['e_gust', 2], ['e_steal', 1]], drops: [['hi_tonic', 0.3]], steal: ['hi_ether', 'feather_cape'],
    desc: 'They nest under the shards and steal anything shiny, blue, or belonging to Wick.',
  }),
  E('c8_shard_crawler', 'Shard Crawler', 43, { type: 'spider', color: '#4a4a3a', accent: '#c8a050', eye: '#ff6040', seed: 82 }, {
    stats: { hp: 1.1, str: 1.1, def: 1.3 }, weak: ['fire', 'blunt'], resist: { pierce: 0.5 }, poise: 3,
    skills: [['e_bite', 2], ['e_poison', 1], ['e_sting', 2]], drops: [['panacea', 0.25]], steal: ['panacea', 'antidote_charm'],
    desc: 'It lives upside-down on the underside of the world and does not understand why you are falling over.',
  }),
  E('c8_scrap_golem', 'Scrap Golem', 43, { type: 'golem', color: '#7a6a5a', accent: '#c8a050', eye: '#ffa040', seed: 83 }, {
    stats: { hp: 1.4, def: 1.6, spd: 0.7 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5, pierce: 0.5, fire: 0.7 }, poise: 4,
    skills: [['e_slam', 2], ['e_tackle', 2], ['e_shell', 1]], drops: [['scrap_gear', 0.55]], steal: ['scrap_gear', 'power_band'],
    desc: 'Salvage that wandered off on its own. Its belly is full of airship cogs. Nobody knows why. Gaffer Quill has theories.',
  }),
  E('c8_sky_eel', 'Wind Eel', 44, { type: 'serpent', color: '#5a7a9a', accent: '#e0f0ff', eye: '#ffffff', seed: 84 }, {
    stats: { hp: 1.1, mag: 1.2, spd: 1.2 }, weak: ['bolt', 'pierce'], resist: { wind: 0, ice: 0.5 }, poise: 3,
    skills: [['e_constrict', 2], ['e_gust', 2], ['e_icebreath', 1]], drops: [['hi_ether', 0.25]], steal: ['hi_ether', 'storm_ring'],
    desc: 'When the sea fell into the sky, some of the eels decided the sky was just more sea.',
  }),
  // ---- The Vigil and the raiders (Lv 43–46)
  E('c8_raider', 'Vesper Raider', 43, { type: 'humanoid', look: 'c8_raider' }, {
    stats: { hp: 1.1, str: 1.1 }, weak: ['fire', 'slash'], resist: { dark: 0.5 }, poise: 3,
    skills: [['e_spear', 3], ['e_slash', 1], ['e_steal', 1]], drops: [['mega_tonic', 0.15], ['hi_tonic', 0.3]], steal: ['mega_tonic', 'swift_boots'],
    desc: 'A Vesper soldier. Living, for now. He believes he is collecting the children for their own good. So did every kidnapper ever.',
  }),
  E('c8_cantor', 'Vesper Cantor', 44, { type: 'humanoid', look: 'c8_cantor' }, {
    stats: { hp: 0.95, mag: 1.3, res: 1.3 }, weak: ['slash', 'light'], resist: { dark: 0.5 }, poise: 3,
    skills: [['e_heal', 2], ['e_lament', 1], ['e_sleep', 1], ['e_silence', 1]], drops: [['hi_ether', 0.3]], steal: ['hi_ether', 'wake_charm'],
    desc: 'They sing the lullabies. They mean every word.',
  }),
  E('c8_hollow_squire', 'Hollow Squire', 45, { type: 'knight', color: '#3a3a40', accent: '#6a3aa8', weapon: 'sword', seed: 85 }, {
    stats: { hp: 1.3, str: 1.15, def: 1.3 }, weak: ['light', 'fire'], resist: { dark: 0, ice: 0.7 }, immune: ['poison', 'sleep', 'charm'], poise: 4,
    skills: [['e_slash', 3], ['e_cleave', 1], ['e_shell', 1]], drops: [['ember_feather', 0.15], ['gloam_dust', 0.5]], steal: ['mega_tonic', 'ashen_helm'],
    desc: 'Armor with a dead man in it — or the memory of one. Evernoon lends them out. They remember their own swords.',
  }),
  E('c8_lull_wisp', 'Lullaby Wisp', 44, { type: 'wisp', color: '#e0c0f0', eye: '#ffffff', seed: 86 }, {
    stats: { hp: 0.7, mag: 1.3, def: 2.2, res: 0.7, evade: 10 }, weak: ['dark', 'wind'], resist: { slash: 0.4, pierce: 0.4, light: 0 }, poise: 2,
    skills: [['e_sleep', 2], ['e_spark', 2], ['e_heal', 1]], drops: [['hi_ether', 0.25]], steal: ['hi_ether', 'wake_charm'],
    desc: 'A stray note from the Lullaby Engine, still humming. It would very much like you to lie down.',
  }),
  // ---- Bosses
  E('c8_lullaby_engine', 'The Lullaby Engine', 45, { type: 'golem', color: '#a8884a', accent: '#e0c0f0', eye: '#e0a0ff', size: 3, seed: 87 }, {
    boss: true, stats: { hp: 4.2, str: 0.85, mag: 0.85, def: 1.15, exp: 7, gold: 8, cp: 4 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5, pierce: 0.5, dark: 0.5 }, immune: ['sleep', 'poison'], poise: 7,
    ai: 'c8_lullaby_engine', summons: ['c8_lull_wisp'], drops: [['wake_charm', 1]], steal: ['x_ether', 'scrap_gear'],
    desc: 'A music box the size of a chapel. It keeps children dreaming their best day, forever. The pins on its drum are tiny teeth.',
  }),
  E('c8_penitent', 'The Penitent', 47, { type: 'humanoid', look: 'penitent', size: 2 }, {
    boss: true, stats: { hp: 4.8, str: 0.92, def: 1.05, res: 1.0, exp: 9, gold: 9, cp: 5 }, weak: ['light', 'blunt'], resist: { dark: 0.3, slash: 0.8 }, immune: ['poison', 'sleep', 'charm', 'doom'], poise: 9,
    ai: 'c8_penitent', summons: ['c8_hollow_squire'], drops: [['dawn_plume', 1]], steal: ['x_tonic', 'champions_belt'],
    desc: 'A knight in black armor and a weeping mask, who holds his blade high in the old Venn Guard. Under the mask is a face Bram knows.',
  }),
  // ---- The Scrap Arena
  E('c8_rustjaw', 'Rustjaw', 44, { type: 'boar', color: '#8a4a2a', accent: '#c8a050', eye: '#ffd060', size: 2, seed: 88 }, {
    stats: { hp: 4, str: 1.2, def: 1.2, exp: 3, gold: 3 }, weak: ['pierce', 'ice'], resist: { blunt: 0.6 }, poise: 6,
    skills: [['e_tackle', 3], ['e_rampage', 1], ['e_howl', 1]], drops: [['power_fruit', 0.5]], steal: ['mega_tonic', 'power_band'],
    desc: 'A war-boar with an iron jaw bolted on. It was a gift. It has not forgiven anyone.',
  }),
  E('c8_cog', 'Cog', 46, { type: 'golem', color: '#a8a8b0', accent: '#e0c050', eye: '#60d0ff', seed: 89 }, {
    stats: { hp: 2.4, def: 1.6, spd: 0.9, exp: 2, gold: 2 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5, pierce: 0.5 }, poise: 5,
    skills: [['e_slam', 2], ['e_shell', 1], ['e_heal', 1]], drops: [['scrap_gear', 1]], steal: ['scrap_gear', 'guard_fruit'],
    desc: 'The left twin. Says nothing. Hits hard. Fixes Sprocket.',
  }),
  E('c8_sprocket', 'Sprocket', 46, { type: 'golem', color: '#b0a890', accent: '#ff6040', eye: '#ff8040', seed: 90 }, {
    stats: { hp: 2.2, str: 1.2, spd: 1.1, exp: 2, gold: 2 }, weak: ['bolt', 'ice'], resist: { slash: 0.5, fire: 0 }, poise: 5,
    skills: [['e_ember', 2], ['e_firebreath', 1], ['e_tackle', 2]], drops: [['scrap_gear', 1]], steal: ['scrap_gear', 'ember_ring'],
    desc: 'The right twin. Not to be confused with the Kite. The Kite is much scarier.',
  }),
  E('c8_iron_moll', 'Iron Moll', 47, { type: 'humanoid', look: 'dawnguard', size: 1.5 }, {
    stats: { hp: 4.5, str: 1.3, def: 1.4, spd: 1.1, exp: 4, gold: 5 }, weak: ['bolt', 'pierce'], resist: { slash: 0.6, blunt: 0.6 }, poise: 7,
    skills: [['e_slash', 2], ['e_cleave', 2], ['e_buff', 1], ['e_stun', 1]], drops: [['champions_belt', 0.05]], steal: ['x_tonic', 'guard_fruit'],
    desc: 'Former Dawnguard sergeant. "Same job, better hours." Still salutes her opponents before she flattens them.',
  }),
  E('c8_gale_roc', 'The Gale Roc', 50, { type: 'bird', color: '#d8d0c0', accent: '#a83a2a', eye: '#ffd060', size: 3, seed: 91 }, {
    boss: true, stats: { hp: 6.5, str: 0.95, mag: 0.95, spd: 1.15, exp: 8, gold: 10, cp: 4 }, weak: ['pierce', 'bolt', 'ice'], resist: { wind: 0 }, poise: 8,
    ai: 'c8_gale_roc', summons: ['c8_gale_shrike'], drops: [['swift_fruit', 1]], steal: ['x_ether', 'feather_cape'],
    desc: 'Undefeated champion of the Scrap Arena. It was a chick when the world ended. It has been growing ever since, out of spite.',
  }),
];

// Act II parties are small (three until Bram's return), so regular foes sit
// below the raw level curve; bosses carry explicit multipliers above.
const TUNE = { hp: 0.7, str: 0.8, mag: 0.8 };
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
const BOSS = { boss: true, music: 'boss', canFlee: false };
/** @type {Record<string, import('../../types/data').TroopDef>} */
const troops = {
  c8_shrikes: T(['c8_gale_shrike', 'c8_gale_shrike', 'c8_gale_shrike']),
  c8_crawlers: T(['c8_shard_crawler', 'c8_shard_crawler']),
  c8_shrike_crawler: T(['c8_gale_shrike', 'c8_shard_crawler', 'c8_gale_shrike']),
  c8_golems: T(['c8_scrap_golem', 'c8_scrap_golem']),
  c8_sky_eels: T(['c8_sky_eel', 'c8_sky_eel']),
  c8_shrike_rescue: T(['c8_gale_shrike', 'c8_gale_shrike', 'c8_gale_shrike'], { canFlee: false }),
  c8_raiders: T(['c8_raider', 'c8_raider', 'c8_cantor']),
  c8_hollow_pair: T(['c8_hollow_squire', 'c8_hollow_squire']),
  c8_wisp_mix: T(['c8_lull_wisp', 'c8_raider', 'c8_lull_wisp']),
  c8_raider_mix: T(['c8_raider', 'c8_hollow_squire', 'c8_scrap_golem']),
  c8_raid_a: T(['c8_raider', 'c8_cantor', 'c8_raider'], { canFlee: false }),
  c8_raid_b: T(['c8_hollow_squire', 'c8_raider', 'c8_hollow_squire'], { canFlee: false }),
  c8_boss_engine: T(['c8_cantor', 'c8_lullaby_engine'], BOSS),
  c8_boss_penitent: T(['c8_penitent'], BOSS),
  c8_arena_rustjaw: T(['c8_scrap_golem', 'c8_rustjaw', 'c8_scrap_golem'], { canFlee: false }),
  c8_arena_twins: T(['c8_cog', 'c8_sprocket'], { canFlee: false }),
  c8_arena_moll: T(['c8_raider', 'c8_iron_moll', 'c8_raider'], { canFlee: false }),
  c8_arena_roc: T(['c8_gale_roc'], BOSS),
};

const bossAI = {
  /** Plays a lullaby every third turn; calls stray notes when wounded. */
  c8_lullaby_engine(c) {
    if (c.m.winding) { c.m.winding = false; c.say('The drum turns. A lullaby pours out of every pipe at once.'); return c.use('e_sleep'); }
    if (c.hpPct < 0.5 && c.once('shriek')) { c.say('Gears shriek. The Engine lurches and thrashes its brass arms!'); return c.use('e_rampage'); }
    if (c.hpPct < 0.7 && c.allies.length < 2 && c.turn % 4 === 1) { c.say('A stray note shakes loose from the pipes and drifts into the air.'); return c.use('e_summon'); }
    if (c.turn % 3 === 0) { c.m.winding = true; c.say('The Engine\'s key begins to wind... _tick... tick... tick..._'); return c.use('e_shell'); }
    return c.pick([['e_slam', 3], ['e_stun', 2], ['e_quake', 1]]);
  },

  /** The Venn Guard: a telegraphed falling stroke every fourth turn; the mask cracks at 60%. */
  c8_penitent(c) {
    if (c.m.falling) { c.m.falling = false; c.say('The Venn Guard falls — one perfect, merciless stroke.'); return c.use('e_crush'); }
    if (c.hpPct < 0.6 && c.once('mask')) { c.say('A crack runs down the weeping mask. "Squires. To me." Empty armor answers.'); return c.use('e_summon'); }
    if (c.hpPct < 0.3 && c.once('trial')) { c.say('"STAND, SQUIRE. THIS IS YOUR TRIAL."'); return c.use('e_buff', [c.self]); }
    if (c.turn % 4 === 0) {
      c.m.falling = true;
      c.say('The Penitent lifts his blade high over his shoulder — the Venn Guard. Someone is about to be cut in half. Guard!');
      return c.use('e_charge');
    }
    if (c.hpPct < 0.6) return c.pick([['e_cleave', 2], ['e_darkwave', 2], ['e_drain', 1], ['e_slash', 2]]);
    return c.pick([['e_slash', 3], ['e_cleave', 1], ['e_stun', 1], ['attack', 1]]);
  },

  /** Gale Roc: dives (charge) then a gale over everyone; calls shrikes. */
  c8_gale_roc(c) {
    if (c.m.diving) { c.m.diving = false; c.say('The Gale Roc folds its wings and comes down like a falling bell!'); return c.use('e_quake'); }
    if (c.hpPct < 0.5 && c.allies.length < 2 && c.once('flock')) { c.say('The Roc screams. Shrikes pour in from the rafters!'); return c.use('e_summon'); }
    if (c.turn % 3 === 0) { c.m.diving = true; c.say('The Gale Roc climbs toward the arena roof...'); return c.use('e_charge'); }
    return c.pick([['e_gust', 3], ['e_peck', 2], ['e_icebreath', 1], ['e_howl', 1]]);
  },
};

/** @type {import('../../types/data').ContentPack} */
export default {
  maps: [kiteholm, rustyAnchor, kiteNest, baronHall, scrapArena, underhang, vigilWreck],
  enemies,
  troops,
  looks,
  bossAI,
  shops: {},
  worldNodes: [
    { id: 'c8_kiteholm', name: 'Kiteholm', region: 'The Windward Shards', act: 2, x: 390, y: 300,
      mapId: 'kiteholm', tx: 4, ty: 20, dir: 'right', unlock: 'c8_arrived', desc: 'A shanty town of kites and scrap on a windy cliff-shard. Pip\'s Kites keep watch.' },
  ],
};
