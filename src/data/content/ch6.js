// Content pack: ch6 — "Afterlight" (Act II begins; Lv 34–39, gear tier 5).
// Wren alone: Fennick's shard, the Drift, Keelhaven, the Shattered Sea.
// Every encounter here is tuned for a single character.
import { ITEMS } from '../items.js';
import { EQUIPMENT, gearOfTier } from '../equipment.js';
import { CH6_MAPS } from '../maps/ch6_shards.js';

// ------------------------------------------------------------------ items
const key = (name, desc) => ({ name, kind: 'key', desc, icon: '✉' });
Object.assign(ITEMS, {
  c6_maela_soup: {
    name: 'Maela\'s Soup', kind: 'consumable', price: 0, sell: 10, icon: '◒', battle: true, field: true,
    desc: 'Ash-potato. It is always ash-potato. Restores 700 HP and cures Poison and Burn.',
    use: { target: 'ally', heal: 700, cure: ['poison', 'burn'] },
  },
  c6_letter_jory: key('Letter: "To Mama"', 'Water-stained. "To Mama, at Port Gale. From Jory." For the Lost Wall in Keelhaven.'),
  c6_letter_aldo: key('Letter: "To Aldo"', 'Folded small, in a careful round hand. "To Aldo Brannock." For the Lost Wall in Keelhaven.'),
  c6_letter_teo: key('Letter: "To Teo"', 'Choir paper, sealed with candle-wax. "To my brother Teo, in Kiteholm." For the Lost Wall in Keelhaven.'),
  c6_letter_sun: key('Letter: "Dear Sun"', 'A child\'s writing, in crayon. "DEAR SUN." For the Lost Wall in Keelhaven.'),
  c6_sunward_atlas: { name: 'The Sunward Atlas', kind: 'key', icon: '✪', desc: 'Cassian\'s gift, swollen with damp. "For Wren, who asks the best questions. — C." You don\'t know why you kept it.' },
  c6_choir_silk: { name: 'Choir Silk', kind: 'key', icon: '✪', desc: 'White silk from the Gilded Psalm\'s banner, with a gold sunburst. For Pell\'s kite.' },
  c6_glass_core: { name: 'Glassback\'s Core', kind: 'key', icon: '✪', desc: 'A fist-sized heart of living glass, still warm. Proof for Warden Hale\'s bounty.' },
  c6_lidless_eye: { name: 'The Lidless Eye', kind: 'key', icon: '✪', desc: 'A cold violet orb. Do not look at it. It is looking at you. Proof for Warden Hale\'s bounty.' },
});
EQUIPMENT.c6_fennicks_coat = {
  id: 'c6_fennicks_coat', name: 'Fennick\'s Sailcloth Coat', slot: 'body', armor: 'light', tier: 5, price: 0,
  def: 44, res: 32, mods: { evade: 4, hpPct: 8 },
  desc: 'Three old sails and a Dawnguard cloak, terribly stitched. Light armor. Max HP +8%. It keeps the ash off.',
};

// ------------------------------------------------------------------ enemies (solo-tuned)
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
  E('c6_ash_wraith', 'Ash Wraith', 35, { type: 'ghost', color: '#9a9098', eye: '#ff9a5a', seed: 61 }, {
    stats: { hp: 0.45, str: 0.5, mag: 0.72, def: 1.8, res: 0.8, evade: 6, exp: 1.2 }, weak: ['light', 'wind'],
    resist: { slash: 0.6, pierce: 0.6, dark: 0 }, poise: 2,
    skills: [['e_dark', 3], ['e_drain', 1], ['e_blind', 1]], drops: [['hi_ether', 0.12], ['gloam_dust', 0.4]], steal: ['ether', 'gloam_dust'],
    desc: 'Ash that remembers being a person. It drifts toward warmth, and does not understand why the warm things scream.',
  }),
  E('c6_cinder_moth', 'Cinder Moth', 34, { type: 'insect', color: '#c8603a', accent: '#ffd080', seed: 62 }, {
    stats: { hp: 0.4, str: 0.5, mag: 0.7, spd: 1.2, exp: 1.1 }, weak: ['ice', 'wind'], resist: { fire: 0 }, poise: 2,
    skills: [['e_ember', 3], ['attack', 1], ['e_spore', 0.5]], drops: [['burn_salve', 0.3]], steal: ['burn_salve', 'hi_tonic'],
    desc: 'Born in the embers that rained down after the sun broke. It is always flying toward the nearest fire, including yours.',
  }),
  E('c6_gloam_hound', 'Gloam Hound', 35, { type: 'hound', color: '#2a2040', accent: '#a080ff', eye: '#d0a0ff', seed: 63 }, {
    stats: { hp: 0.5, str: 0.68, spd: 1.25, exp: 1.2 }, weak: ['light', 'fire'], resist: { dark: 0.5 }, poise: 2,
    skills: [['e_bite', 3], ['e_howl', 1], ['attack', 1]], drops: [['gloam_dust', 0.4], ['hi_tonic', 0.15]], steal: ['hi_tonic', 'gloam_dust'],
    desc: 'The Gloam came up through the cracks in the world, and some of it came up hungry, and shaped like dogs.',
  }),
  E('c6_hollow_sailor', 'Hollow Sailor', 36, { type: 'skeleton', color: '#d0c8b0', accent: '#5a6a8a', eye: '#a0e0ff', seed: 64 }, {
    stats: { hp: 0.55, str: 0.7, def: 1.1, spd: 0.9, exp: 1.2 }, weak: ['light', 'blunt'], resist: { pierce: 0.5, dark: 0.3 },
    immune: ['poison', 'sleep'], poise: 3,
    skills: [['e_slash', 3], ['e_stun', 1]], drops: [['hi_tonic', 0.25]], steal: ['hi_tonic', 'sea_charm'],
    desc: 'Still at its post on a ship that has no sea. It will defend the deck until the end of the world. Which is a problem, now.',
  }),
  E('c6_shard_golem', 'Shard Golem', 36, { type: 'golem', color: '#a8c8d8', accent: '#e8f8ff', eye: '#ffffff', seed: 65 }, {
    stats: { hp: 0.95, str: 0.8, def: 1.6, res: 0.8, spd: 0.7, exp: 1.6, gold: 1.4 }, weak: ['blunt', 'bolt'],
    resist: { slash: 0.5, pierce: 0.5 }, poise: 4,
    skills: [['e_slam', 2], ['attack', 3], ['e_shell', 1]], drops: [['guard_fruit', 0.08], ['mega_tonic', 0.1]], steal: ['hi_tonic', 'guard_fruit'],
    desc: 'When the sea fell upward it left glass behind — miles of it — and some of the glass got up and walked.',
  }),
  E('c6_glass_crawler', 'Glasscrawler', 36, { type: 'spider', color: '#8ab0c0', accent: '#e0f0ff', eye: '#ff6080', seed: 66 }, {
    stats: { hp: 0.5, str: 0.65, spd: 1.1, exp: 1.2 }, weak: ['blunt', 'fire'], resist: { slash: 0.7 }, poise: 2,
    skills: [['e_bite', 2], ['e_sting', 2]], drops: [['antidote', 0.3]], steal: ['antidote', 'hi_tonic'],
    desc: 'It spins its webs between floating islands. Nobody knows what it catches up there. Nobody wants to.',
  }),
  E('c6_skybrine_eel', 'Skybrine Eel', 37, { type: 'serpent', color: '#4a8aa0', accent: '#e0f8ff', eye: '#ffe060', seed: 67 }, {
    stats: { hp: 0.55, str: 0.6, mag: 0.72, spd: 1.1, exp: 1.3 }, weak: ['bolt', 'pierce'], resist: { ice: 0.5 }, poise: 2,
    skills: [['e_spit', 2], ['e_constrict', 1], ['e_bite', 2]], drops: [['hi_ether', 0.15]], steal: ['hi_ether', 'sea_charm'],
    desc: 'A sea eel, swimming through the air as if it never noticed the water leave. Perhaps it hasn\'t.',
  }),
  E('c6_ember_wisp', 'Sun-Ember Wisp', 37, { type: 'wisp', color: '#ffb040', eye: '#fff8d0', seed: 68 }, {
    stats: { hp: 0.35, mag: 0.75, def: 1.6, res: 0.7, spd: 1.2, evade: 10, exp: 1.3 }, weak: ['ice', 'dark'],
    resist: { fire: 0, light: 0.5, slash: 0.6, pierce: 0.6 }, poise: 2,
    skills: [['e_ember', 3], ['e_firebreath', 1]], drops: [['sun_ember', 0.35]], steal: ['burn_salve', 'sun_ember'],
    desc: 'A fleck of the broken sun, still burning a year later. It is warm. Nothing else in the world is warm anymore.',
  }),
  E('c6_abyss_eye', 'Abyss Eye', 38, { type: 'eye', color: '#5a3a7a', accent: '#c080ff', eye: '#ffe0ff', seed: 69 }, {
    stats: { hp: 0.5, mag: 0.7, res: 1.2, spd: 0.95, exp: 1.4 }, weak: ['light', 'pierce'], resist: { dark: 0 }, poise: 2,
    skills: [['e_dark', 3], ['e_silence', 1], ['e_mpdrain', 1]], drops: [['eye_drops', 0.3], ['gloam_dust', 0.4]], steal: ['ether', 'gloam_dust'],
    desc: 'The abyss under the islands is not empty. Sometimes it looks up.',
  }),
  E('c6_wreck_mimic', 'Wreck Mimic', 38, { type: 'mimic', color: '#7a5a3a', accent: '#d8b860', eye: '#ff4040', seed: 70 }, {
    stats: { hp: 0.8, str: 0.8, def: 1.3, exp: 2.5, gold: 4 }, weak: ['bolt', 'fire'], poise: 4,
    skills: [['e_bite', 3], ['e_steal', 1], ['e_crush', 1]], drops: [['elixir', 0.3], ['x_tonic', 0.4]], steal: ['mega_tonic', 'thiefs_glove'],
    desc: 'A sea-chest from some drowned rich man\'s cabin. It has learned that people will walk straight up to a sea-chest.',
  }),
  E('c6_fennick', 'Old Fennick', 34, { type: 'humanoid', look: 'fennick', size: 1 }, {
    boss: true, stats: { hp: 2.6, str: 0.55, def: 1.2, exp: 3, gold: 0, cp: 3 }, weak: ['slash', 'bolt'], poise: 5,
    ai: 'c6_fennick', drops: [], steal: ['hi_tonic', 'hi_tonic'],
    desc: 'Edrin Halloway\'s fishing partner. The light said Vanguard. He said "fish." The light didn\'t argue.',
  }),
  E('c6_ashmaw', 'The Ashmaw', 36, { type: 'hound', color: '#6a6268', accent: '#ff8a4a', eye: '#ffb060', size: 2, seed: 71 }, {
    boss: true, stats: { hp: 2.7, str: 0.78, spd: 1.05, exp: 5, gold: 5, cp: 4 }, weak: ['ice', 'light', 'wind'],
    resist: { fire: 0.3, dark: 0.5 }, poise: 6, ai: 'c6_ashmaw', summons: ['c6_gloam_hound'],
    drops: [['hi_ether', 1]], steal: ['hi_tonic', 'vigor_seed'],
    desc: 'A hound of packed ash the size of a cart. It has been eating Fennick\'s chickens all winter.',
  }),
  E('c6_glassback', 'Glassback', 38, { type: 'golem', color: '#c8e8f0', accent: '#ffffff', eye: '#80ffff', size: 2, seed: 72 }, {
    boss: true, stats: { hp: 3.4, str: 0.82, def: 1.7, res: 0.9, spd: 0.75, exp: 6, gold: 6, cp: 4 }, weak: ['blunt', 'bolt'],
    resist: { slash: 0.5, pierce: 0.5, light: 0 }, poise: 7, ai: 'c6_glassback', drops: [['guard_fruit', 1]], steal: ['mega_tonic', 'guard_fruit'],
    desc: 'The biggest thing the glass ever made. It is so clear you can see the sky through it — bent, and broken, and beautiful.',
  }),
  E('c6_lidless', 'The Lidless', 38, { type: 'eye', color: '#2a1440', accent: '#ff60c0', eye: '#ffffff', size: 3, seed: 73 }, {
    boss: true, stats: { hp: 3.0, mag: 0.78, res: 1.3, exp: 6, gold: 6, cp: 4 }, weak: ['light', 'pierce'],
    resist: { dark: -1 }, poise: 6, ai: 'c6_lidless', summons: ['c6_abyss_eye'], drops: [['spirit_fruit', 1]], steal: ['hi_ether', 'spirit_fruit'],
    desc: 'It has no lid. It has never blinked. It has seen everything that has fallen past its perch for a year.',
  }),
  E('c6_brinefang', 'Brinefang, Unmoored', 39, { type: 'serpent', color: '#c8d8e0', accent: '#8a6aff', eye: '#d080ff', size: 4, seed: 7 }, {
    boss: true, stats: { hp: 4.6, str: 0.78, mag: 0.82, def: 1.1, exp: 10, gold: 9, cp: 6 }, weak: ['bolt', 'pierce', 'light'],
    resist: { ice: 0, dark: 0.5 }, poise: 8, ai: 'c6_brinefang', summons: ['c6_brine_wisp'],
    drops: [['dawn_plume', 1]], steal: ['mega_tonic', 'sea_charm'],
    desc: 'The serpent of the strait, still swimming the sea that isn\'t there. The Gloam got into it on the way up. It has a scar on its jaw shaped like a Dawnguard shield.',
  }),
  E('c6_brine_wisp', 'Brine Wisp', 37, { type: 'wisp', color: '#80c0e0', eye: '#ffffff', seed: 74 }, {
    stats: { hp: 0.35, mag: 0.6, spd: 1.1 }, weak: ['bolt', 'fire'], resist: { ice: 0 }, poise: 2,
    skills: [['e_spit', 3], ['e_frost', 1]], drops: [['hi_ether', 0.2]], steal: ['ether', 'ether'],
    desc: 'A skin of old brine, shed by the Unmoored. It swims on without it.',
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
  c6_shard_wraith: T(['c6_ash_wraith']),
  c6_shard_moths: T(['c6_cinder_moth', 'c6_cinder_moth']),
  c6_shard_mix: T(['c6_ash_wraith', 'c6_cinder_moth']),
  c6_drift_hound: T(['c6_gloam_hound']),
  c6_drift_hounds: T(['c6_gloam_hound', 'c6_gloam_hound']),
  c6_drift_sailor: T(['c6_hollow_sailor']),
  c6_drift_mix: T(['c6_ash_wraith', 'c6_gloam_hound']),
  c6_drift_moths: T(['c6_cinder_moth', 'c6_hollow_sailor']),
  c6_drift_golem: T(['c6_shard_golem']),
  c6_sea_golem: T(['c6_shard_golem']),
  c6_sea_crawlers: T(['c6_glass_crawler', 'c6_glass_crawler']),
  c6_sea_eel: T(['c6_skybrine_eel', 'c6_cinder_moth']),
  c6_sea_wisps: T(['c6_ember_wisp', 'c6_ember_wisp']),
  c6_sea_eye: T(['c6_abyss_eye', 'c6_glass_crawler']),
  c6_sea_sailors: T(['c6_hollow_sailor', 'c6_skybrine_eel']),
  c6_sea_mimic: T(['c6_wreck_mimic']),
  c6_sea_winch_a: T(['c6_shard_golem', 'c6_glass_crawler'], { canFlee: false }),
  c6_sea_winch_b: T(['c6_hollow_sailor', 'c6_hollow_sailor'], { canFlee: false }),
  c6_spar_fennick: T(['c6_fennick'], { boss: true, music: 'battle', canFlee: false }),
  c6_boss_ashmaw: T(['c6_ashmaw'], { boss: true, music: 'boss', canFlee: false, bg: 'ruin' }),
  c6_bounty_glassback: T(['c6_glassback'], { boss: true, music: 'boss', canFlee: false, bg: 'ruin' }),
  c6_bounty_lidless: T(['c6_lidless'], { boss: true, music: 'boss', canFlee: false, bg: 'gloam' }),
  c6_boss_brinefang: T(['c6_brinefang'], { boss: true, music: 'boss', canFlee: false, bg: 'sky' }),
};

// ------------------------------------------------------------------ boss AI
const bossAI = {
  c6_fennick(c) {
    if (c.m.big) { c.m.big = false; c.say('"Here it comes — GUARD, girl!"'); return c.use('e_crush'); }
    if (c.turn === 1) { c.say('"Let\'s see what\'s left in that arm."'); return c.use('e_spear'); }
    if (c.turn % 3 === 0) {
      c.m.big = true;
      c.say('Fennick plants his feet and draws his harpoon back. "Watch my shoulders. When they drop like this — that\'s your cue."');
      return c.use('e_charge');
    }
    if (c.hpPct < 0.5 && c.once('tired')) { c.say('"Hff. I used to be faster. Your father was faster still."'); return c.use('e_heal'); }
    return c.pick([['e_spear', 3], ['attack', 2], ['e_stun', 1]]);
  },
  c6_ashmaw(c) {
    if (c.m.pounce) { c.m.pounce = false; c.say('The Ashmaw pounces!'); return c.use('e_crush'); }
    if (c.hpPct < 0.5 && c.once('pack')) { c.say('The Ashmaw howls. The ash on the bridge pulls itself up into a smaller hound.'); return c.use('e_summon'); }
    if (c.turn % 4 === 3) { c.m.pounce = true; c.say('The Ashmaw crouches low, ash streaming off its back like smoke...'); return c.use('e_charge'); }
    return c.pick([['e_bite', 3], ['e_claw', 2], ['e_howl', 1], ['e_darkwave', 1]]);
  },
  c6_glassback(c) {
    if (c.m.slam) { c.m.slam = false; c.say('Glassback brings its whole weight down on the quarry floor!'); return c.use('e_quake'); }
    if (c.hpPct < 0.5 && c.once('harden')) { c.say('Its glass hide clouds over and thickens.'); return c.use('e_shell'); }
    if (c.turn % 3 === 2) { c.m.slam = true; c.say('Glassback rears up. Light splinters through its body...'); return c.use('e_charge'); }
    return c.pick([['e_slam', 2], ['attack', 3], ['e_crush', 1]]);
  },
  c6_lidless(c) {
    if (c.m.gaze) { c.m.gaze = false; c.say('The Lidless looks at you. All of it looks at you.'); return c.use('e_darkwave'); }
    if (c.hpPct < 0.5 && c.once('blink')) { c.say('It blinks — it has no lid, and it blinks — and now there are more eyes.'); return c.use('e_summon'); }
    if (c.turn % 3 === 0) { c.m.gaze = true; c.say('The Lidless opens wider... and wider...'); return c.use('e_charge'); }
    return c.pick([['e_dark', 3], ['e_blind', 1], ['e_silence', 1], ['e_mpdrain', 1]]);
  },
  c6_brinefang(c) {
    if (c.m.tide) { c.m.tide = false; c.say('Brinefang brings the hanging sea crashing down!'); return c.use('e_tidal'); }
    if (c.m.skyfall) { c.m.skyfall = false; c.say('SKYFALL.'); return c.use('e_bigbreath'); }
    if (c.hpPct < 0.6 && c.once('shed')) { c.say('Brinefang sheds a skin of brine — and the skin gets up and swims.'); return c.use('e_summon'); }
    if (c.hpPct < 0.3 && c.once('skyfall')) {
      c.m.skyfall = true;
      c.say('Brinefang climbs into the broken sky — higher — higher — and turns, and falls toward you...');
      return c.use('e_charge');
    }
    if (c.turn % 4 === 3) { c.m.tide = true; c.say('Brinefang draws the upside-down sea into its throat...'); return c.use('e_charge'); }
    return c.pick([['e_bite', 3], ['e_constrict', 2], ['e_spit', 2], ['e_shell', c.hpPct < 0.5 ? 1 : 0.2]]);
  },
};

// ------------------------------------------------------------------ looks
const looks = {
  c6_sentry: {
    id: 'c6_sentry', skin: '#d9a57c', hair: { style: 'short', color: '#4a3a2a' },
    outfit: { style: 'vest', main: '#5a5048', accent: '#a8988a', trim: '#3a2a20', pants: '#3a3430' }, acc: ['scarf'], weapon: 'spear',
  },
  linnet: {
    id: 'linnet', skin: '#e9c09a', hair: { style: 'twintails', color: '#e8c060' }, eyes: '#4a6a8a',
    outfit: { style: 'coat', main: '#6a8ab0', accent: '#f0e0c0', trim: '#c9a24a', pants: '#3a3a4a' }, acc: ['scarf', 'glasses'],
  },
  hale: {
    id: 'hale', skin: '#b07a52', hair: { style: 'short', color: '#c8c8c8' },
    outfit: { style: 'coat', main: '#2f4a6a', accent: '#d8ccb0', trim: '#c9a24a', pants: '#2a2a30' }, acc: ['beard'], build: 'large',
  },
  ottilie: {
    id: 'ottilie', skin: '#f2cba5', hair: { style: 'bun', color: '#6a4a2a' },
    outfit: { style: 'robe', main: '#c8c0b0', accent: '#a83a3a', trim: '#8a7a6a' },
  },
  orla: {
    id: 'orla', skin: '#7a4e34', hair: { style: 'braid', color: '#d8d4d0' },
    outfit: { style: 'dress', main: '#5a6a8a', accent: '#e8dcc0', trim: '#8a6a3a' }, acc: ['glasses'],
  },
  gus: {
    id: 'gus', skin: '#d9a57c', hair: { style: 'bald', color: '#8a6a4a' },
    outfit: { style: 'vest', main: '#7a5a3a', accent: '#c8b090', trim: '#4a3a2a', pants: '#4a4a3a' }, acc: ['beard', 'bandana'], build: 'large',
  },
  cinder: {
    id: 'cinder', skin: '#c8b8b0', hair: { style: 'messy', color: '#5a5a5a' },
    outfit: { style: 'robe', main: '#5a5050', accent: '#9a8a80', trim: '#3a3030' }, acc: ['hood'],
  },
  gannet: {
    id: 'gannet', skin: '#b07a52', hair: { style: 'long', color: '#e8e4dc' },
    outfit: { style: 'cloak', main: '#4a2a4a', accent: '#d8b860', trim: '#8a4a6a' }, acc: ['hood'],
  },
};

/** @type {Record<string, import('../../types/data').ShopDef>} */
const shops = {
  c6_salvage: {
    name: 'Gus\'s Salvage & Sundries',
    items: ['hi_tonic', 'mega_tonic', 'hi_ether', 'panacea', 'antidote', 'eye_drops', 'echo_herb', 'ember_feather', 'tonic_mist', 'bedroll',
      'fire_bomb', 'frost_bomb', 'bolt_bomb', 'holy_water', 'dusk_ring', 'quiet_bell', 'ashen_blade', 'ashen_coat',
      ...gearOfTier(5, (e) => e.slot === 'weapon'), ...gearOfTier(5, (e) => e.slot !== 'weapon' && e.slot !== 'accessory')],
  },
};

/** @type {import('../../types/data').WorldNode[]} */
const worldNodes = [
  { id: 'c6_shard', name: 'Fennick\'s Shard', region: 'The Drift', act: 2, x: 110, y: 505, mapId: 'c6_hermit_shard', tx: 14, ty: 10, dir: 'down',
    unlock: 'c6_left_shard', desc: 'A broken piece of Lanternfall\'s north cliffs. An old man, a burnt soup, two cairns.' },
  { id: 'c6_keelhaven', name: 'Keelhaven', region: 'The Shattered Sea', act: 2, x: 250, y: 480, mapId: 'c6_keelhaven', tx: 3, ty: 16, dir: 'right',
    unlock: 'c6_keelhaven', desc: 'A refugee town built from upturned boats. Six hundred people, one soup kettle.' },
  { id: 'c6_strait', name: 'The Strait That Was', region: 'The Shattered Sea', act: 2, x: 380, y: 455, mapId: 'c6_shattered_sea', tx: 62, ty: 21, dir: 'right',
    unlock: 'c6_brinefang', desc: 'The old strait between Lanternfall and the mainland. No water in it now — only wreckage and the long drop.' },
];

/** @type {import('../../types/data').ContentPack} */
export default { maps: CH6_MAPS, enemies, troops, looks, bossAI, shops, worldNodes };
