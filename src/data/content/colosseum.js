// Content pack: the Bellring — Aurenne's colosseum (Act I, Lv 13–35).
// Four cups of three rounds each (story/colosseum.js runs them); the map is in
// data/maps/bc_bellring.js. Fighters are prefixed bc_.

import { EQUIPMENT } from '../equipment.js';
import { bellring } from '../maps/bc_bellring.js';

// The champion's prize.
EQUIPMENT.bc_laurel = {
  id: 'bc_laurel', name: 'Bellring Laurel', slot: 'accessory', tier: 0, price: 0, str: 10, mag: 10, mods: { afterglow: 15 },
  desc: 'STR +10, MAG +10, Afterglow gain +15%. Valka wore it for nine years. It still smells faintly of victory and oil.',
};

const SKIN = { fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };

const looks = {
  ottavio: { id: 'ottavio', skin: SKIN.warm, hair: { style: 'short', color: '#2a1a14' }, outfit: { style: 'coat', main: '#a8282a', accent: '#f0d070', trim: '#e3c27a', pants: '#2a1a24' }, acc: ['hat_wide', 'beard'], build: 'large' },
  bc_clerk: { id: 'bc_clerk', skin: SKIN.fair, hair: { style: 'bun', color: '#6a4a2a' }, outfit: { style: 'vest', main: '#3a4a6a', accent: '#e8d8b0', trim: '#c9a24a', pants: '#2a2a3a' }, acc: ['glasses'] },
  bc_crier: { id: 'bc_crier', skin: SKIN.tan, hair: { style: 'messy', color: '#c0642e' }, outfit: { style: 'tunic', main: '#a8282a', accent: '#f0d070', pants: '#3a2a20' }, acc: ['feather'] },
  bc_kell_net: { id: 'bc_kell_net', skin: SKIN.brown, hair: { style: 'bald', color: '#000' }, outfit: { style: 'rags', main: '#6a5a3a', accent: '#c8a050', pants: '#3a2a20' }, acc: ['beard'], weapon: 'spear', build: 'large' },
  bc_kell_fist: { id: 'bc_kell_fist', skin: SKIN.brown, hair: { style: 'spiky', color: '#1a1410' }, outfit: { style: 'vest', main: '#8a3a2a', accent: '#c8a050', pants: '#3a2a20' }, acc: ['headband'], weapon: 'fist', build: 'large' },
  bc_squire: { id: 'bc_squire', skin: SKIN.fair, hair: { style: 'short', color: '#8a6a3a' }, outfit: { style: 'armor', main: '#7a7a84', metal: '#a9b3c0', accent: '#a8282a', pants: '#2a2a30' }, acc: ['helmet'], weapon: 'sword', shield: true },
  bc_sereno: { id: 'bc_sereno', skin: SKIN.warm, hair: { style: 'ponytail', color: '#1a1410' }, outfit: { style: 'coat', main: '#2a5a5a', accent: '#f0e0b0', trim: '#c9a24a', pants: '#1a2a2a' }, acc: ['scarf'], weapon: 'sword', build: 'tall' },
  bc_mask_dawn: { id: 'bc_mask_dawn', skin: '#f0e8d8', hair: { style: 'long', color: '#f0d890' }, outfit: { style: 'robe', main: '#f0e6c8', accent: '#e3c27a', trim: '#c9a24a' }, acc: ['hood', 'circlet'], weapon: 'staff' },
  bc_mask_dusk: { id: 'bc_mask_dusk', skin: '#3a3040', hair: { style: 'long', color: '#2a1a3a' }, outfit: { style: 'robe', main: '#2a2238', accent: '#8a6ac8', trim: '#5a3a8a' }, acc: ['hood', 'circlet'], weapon: 'staff' },
  valka: { id: 'valka', skin: SKIN.tan, hair: { style: 'braid', color: '#e8e0d0' }, outfit: { style: 'armor', main: '#c8a040', metal: '#e0c870', accent: '#a8282a', trim: '#f0d070', pants: '#3a2a20' }, acc: ['cape', 'circlet'], capeColor: '#a8282a', weapon: 'spear', build: 'tall' },
};

const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, ...opts });

const enemies = [
  // ---- Copper Cup (Lv 13–15)
  E('bc_pit_hound', 'Sand Hound', 13, { type: 'hound', color: '#c8a070', accent: '#6a4a2a', eye: '#ffe060', seed: 101 }, {
    stats: { hp: 1.1, str: 1.45, spd: 1.2 }, weak: ['fire', 'slash'], poise: 2,
    skills: [['e_bite', 3], ['e_claw', 2], ['e_howl', 1]], drops: [['tonic', 0.3]], steal: ['tonic', 'sea_charm'],
    desc: 'Bred under the east stand. They have only ever known sand, crowds and the bell, and they love all three.',
  }),
  E('bc_kell_net', 'Kell the Net', 14, { type: 'humanoid', look: 'bc_kell_net' }, {
    stats: { hp: 2.2, str: 1.45, spd: 1.05 }, weak: ['bolt', 'slash'], poise: 3,
    skills: [['e_constrict', 2], ['e_spear', 2], ['e_stun', 1]], drops: [['hi_tonic', 0.3]], steal: ['tonic', 'copper_ring'],
    desc: 'Throws a net, then apologises. The older brother. Says the net does most of the work.',
  }),
  E('bc_kell_fist', 'Kell the Fist', 14, { type: 'humanoid', look: 'bc_kell_fist' }, {
    stats: { hp: 2.4, str: 1.6 }, weak: ['ice', 'pierce'], poise: 3,
    skills: [['e_tackle', 3], ['e_rampage', 1], ['e_buff', 1]], drops: [['hi_tonic', 0.3]], steal: ['tonic', 'power_band'],
    desc: 'Does not throw a net. Does not apologise. The younger brother.',
  }),
  E('bc_grizzlemaw', 'Grizzlemaw', 15, { type: 'boar', color: '#5a3a2a', accent: '#d8c8a0', eye: '#ff6040', size: 2, seed: 102 }, {
    boss: true, stats: { hp: 10, str: 1.7, spd: 1.5, exp: 5, gold: 5, cp: 3 }, weak: ['pierce', 'fire'], resist: { blunt: 0.7 }, poise: 7,
    ai: 'bc_grizzlemaw', drops: [['power_fruit', 0.5]], steal: ['hi_tonic', 'power_band'],
    desc: 'A war-boar who has eaten three gates and, allegedly, a herald. The herald disputes this.',
  }),
  // ---- Silver Cup (Lv 20–22)
  E('bc_glass_scorpion', 'Glass Scorpion', 20, { type: 'scorpion', color: '#d8e8f0', accent: '#80c0e0', eye: '#ff4060', seed: 103 }, {
    stats: { hp: 1.1, str: 1.45, def: 1.3 }, weak: ['blunt', 'ice'], resist: { fire: 0.5 }, poise: 3,
    skills: [['e_sting', 3], ['e_claw', 2], ['e_poison', 1]], drops: [['antidote', 0.4]], steal: ['antidote', 'sun_goggles'],
    desc: 'Shipped from the Sunscar in padded crates marked FRAGILE. The crates were for the handlers.',
  }),
  E('bc_squire', 'Bellring Squire', 20, { type: 'humanoid', look: 'bc_squire' }, {
    stats: { hp: 1.3, str: 1.25, def: 1.2 }, weak: ['bolt', 'pierce'], poise: 3,
    skills: [['e_slash', 3], ['e_shell', 1]], drops: [['hi_tonic', 0.3]], steal: ['hi_tonic', 'copper_ring'],
    desc: 'Squires who failed the Dawnguard trials fight here instead. The crowd is kinder than the Lord-Commander.',
  }),
  E('bc_sereno', 'Sereno the Swift', 21, { type: 'humanoid', look: 'bc_sereno' }, {
    stats: { hp: 3.0, str: 1.4, spd: 1.45, evade: 12 }, weak: ['ice', 'blunt'], poise: 4,
    skills: [['e_slash', 3], ['e_sweep', 1], ['e_steal', 1]], drops: [['swift_fruit', 0.25]], steal: ['hi_ether', 'swift_boots'],
    desc: 'Fastest blade in the Heartland, slowest to pay his tab. He will steal your purse mid-bout and return it after, with a bow.',
  }),
  E('bc_iron_bull', 'The Iron Bull', 22, { type: 'golem', color: '#6a6a74', accent: '#c84a2a', eye: '#ff6040', size: 2, seed: 104 }, {
    boss: true, stats: { hp: 9, str: 1.7, def: 1.45, spd: 0.95, exp: 6, gold: 6, cp: 3 }, weak: ['bolt', 'blunt'], resist: { slash: 0.6, pierce: 0.6, fire: 0.8 }, poise: 8,
    ai: 'bc_iron_bull', drops: [['guard_fruit', 0.5]], steal: ['hi_ether', 'vigor_bangle'],
    desc: 'Cast in the bell foundries from a cracked bell and a bad idea. Hit it right and it still rings.',
  }),
  // ---- Gold Cup (Lv 27–29)
  E('bc_mire_lurker', 'Mire Lurker', 27, { type: 'serpent', color: '#4a6a3a', accent: '#c8d890', eye: '#ff8040', seed: 105 }, {
    stats: { hp: 1.5, str: 1.45, mag: 1.5 }, weak: ['bolt', 'fire'], resist: { ice: 0.5 }, poise: 3,
    skills: [['e_constrict', 2], ['e_spit', 2], ['e_icebreath', 1]], drops: [['hi_ether', 0.2]], steal: ['hi_tonic', 'frost_ring'],
    desc: 'Dredged from the Fens at tremendous personal risk. Ottavio paid the dredgers in tickets.',
  }),
  E('bc_mask_dawn', 'Mask of Dawn', 28, { type: 'humanoid', look: 'bc_mask_dawn' }, {
    stats: { hp: 2.4, mag: 1.6, res: 1.3 }, weak: ['dark', 'slash'], resist: { light: 0.3 }, poise: 4,
    skills: [['e_holy', 3], ['e_heal', 2], ['e_buff', 1]], drops: [['hi_ether', 0.3]], steal: ['hi_ether', 'sage_ring'],
    desc: 'She prays before every bout and after every win. She has prayed a lot.',
  }),
  E('bc_mask_dusk', 'Mask of Dusk', 28, { type: 'humanoid', look: 'bc_mask_dusk' }, {
    stats: { hp: 2.4, mag: 1.6, res: 1.3 }, weak: ['light', 'pierce'], resist: { dark: 0.3 }, poise: 4,
    skills: [['e_dark', 3], ['e_drain', 2], ['e_silence', 1]], drops: [['hi_ether', 0.3]], steal: ['hi_ether', 'bell_earring'],
    desc: 'He curses before every bout. Nobody has ever heard what he says. Nobody wants to.',
  }),
  E('bc_matron', 'The Scythe Matron', 29, { type: 'insect', color: '#7a9a3a', accent: '#e0f080', eye: '#ff2020', size: 2, seed: 106 }, {
    boss: true, stats: { hp: 12, str: 1.7, spd: 1.45, exp: 7, gold: 7, cp: 4 }, weak: ['fire', 'wind'], resist: { pierce: 0.6 }, poise: 9,
    ai: 'bc_matron', drops: [['spirit_fruit', 0.5]], steal: ['hi_ether', 'hunters_eye'],
    desc: 'Mother of a thousand, mercy for none. The Bellring keeps her eggs in a vault. Nobody volunteers for vault duty.',
  }),
  // ---- Sunsteel Cup (Lv 32–35)
  E('bc_storm_kite', 'Storm Kite', 32, { type: 'bird', color: '#7a8ab8', accent: '#f0f0ff', eye: '#ffd060', seed: 107 }, {
    stats: { hp: 1.2, str: 1.45, mag: 1.5, spd: 1.3, evade: 8 }, weak: ['pierce', 'bolt'], resist: { wind: 0.3 }, poise: 2,
    skills: [['e_peck', 3], ['e_gust', 2], ['e_spark', 1]], drops: [['hi_ether', 0.2]], steal: ['hi_tonic', 'feather_cape'],
    desc: 'They roost in the bell tower and ride its echoes. When the bell rings, they come down to see who rang it.',
  }),
  E('bc_phalanx', 'Phalanx Guard', 33, { type: 'knight', color: '#b0a070', accent: '#c84a2a', weapon: 'spear', seed: 108 }, {
    stats: { hp: 1.6, str: 1.45, def: 1.4 }, weak: ['bolt', 'blunt'], resist: { slash: 0.7, pierce: 0.7 }, poise: 4,
    skills: [['e_spear', 3], ['e_shell', 1], ['e_cleave', 1]], drops: [['mega_tonic', 0.15]], steal: ['hi_tonic', 'guard_fruit'],
    desc: 'Three shields, one wall, no gaps. They have drilled together for twenty years and still argue about who stands left.',
  }),
  E('bc_valka', 'Valka the Undefeated', 35, { type: 'humanoid', look: 'valka', size: 2 }, {
    boss: true, stats: { hp: 14, str: 1.75, def: 1.2, spd: 1.7, exp: 9, gold: 9, cp: 5 }, weak: ['ice', 'bolt'], resist: { light: 0.5, slash: 0.8 }, immune: ['charm', 'sleep'], poise: 12,
    ai: 'bc_valka', drops: [['swift_fruit', 1]], steal: ['mega_tonic', 'champions_belt'],
    desc: 'Forty-one bouts, forty-one wins. A Skylancer from the north who came to Aurenne for the Dawnguard and stayed for the crowd.',
  }),
];

const T = (list, opts = {}) => ({ enemies: list, canFlee: false, bg: 'colosseum', ...opts });
const FINAL = { boss: true, music: 'boss', canFlee: false, bg: 'colosseum' };
const troops = {
  bc_c1_hounds: T(['bc_pit_hound', 'bc_pit_hound', 'bc_pit_hound']),
  bc_c1_kells: T(['bc_kell_net', 'bc_kell_fist']),
  bc_c1_grizzlemaw: T(['bc_grizzlemaw'], FINAL),
  bc_c2_scorpions: T(['bc_glass_scorpion', 'bc_glass_scorpion', 'bc_glass_scorpion']),
  bc_c2_sereno: T(['bc_squire', 'bc_sereno', 'bc_squire']),
  bc_c2_bull: T(['bc_iron_bull'], FINAL),
  bc_c3_lurkers: T(['bc_mire_lurker', 'bc_mire_lurker']),
  bc_c3_masks: T(['bc_mask_dawn', 'bc_mask_dusk']),
  bc_c3_matron: T(['bc_matron'], FINAL),
  bc_c4_kites: T(['bc_storm_kite', 'bc_storm_kite', 'bc_storm_kite']),
  bc_c4_phalanx: T(['bc_phalanx', 'bc_phalanx', 'bc_phalanx']),
  bc_c4_valka: T(['bc_valka'], FINAL),
};

const bossAI = {
  /** Paws the sand every third turn, then charges. */
  bc_grizzlemaw(c) {
    if (c.m.charging) { c.m.charging = false; c.say('Grizzlemaw thunders across the sand!'); return c.use('e_tackle'); }
    if (c.hpPct < 0.5 && c.once('rage')) { c.say('Grizzlemaw squeals and tosses its head. The crowd loves it.'); return c.use('e_howl'); }
    if (c.turn % 3 === 0) { c.m.charging = true; c.say('Grizzlemaw paws the sand and lowers its tusks... Guard!'); return c.use('e_charge'); }
    return c.pick([['e_bite', 3], ['e_tackle', 2], ['e_rampage', 2]]);
  },

  /** A slow, heavy bell of a thing: a telegraphed crush every fourth turn; hardens when hurt. */
  bc_iron_bull(c) {
    if (c.m.crush) { c.m.crush = false; c.say('The Iron Bull brings its whole weight down — BONG.'); return c.use('e_crush'); }
    if (c.hpPct < 0.5 && c.once('harden')) { c.say('Rivets groan. The Iron Bull braces, plates grinding shut.'); return c.use('e_shell'); }
    if (c.turn % 4 === 2) { c.m.crush = true; c.say('The Iron Bull rears up on its hind legs, iron screaming... Guard!'); return c.use('e_charge'); }
    return c.pick([['e_slam', 2], ['e_tackle', 2], ['e_quake', 2]]);
  },

  /** Raises both scythes and sweeps the whole ring every third turn; frenzies when hurt. */
  bc_matron(c) {
    if (c.m.reaping) { c.m.reaping = false; c.say('The Matron sweeps both scythes through the whole ring!'); return c.use('e_cleave'); }
    if (c.hpPct < 0.4 && c.once('frenzy')) { c.say('The Matron shrieks. Her wings blur.'); return c.use('e_buff', [c.self]); }
    if (c.turn % 3 === 0) { c.m.reaping = true; c.say('The Scythe Matron raises both scythes high... Guard!'); return c.use('e_charge'); }
    return c.pick([['e_claw', 3], ['e_sting', 2], ['e_sweep', 2], ['e_poison', 1]]);
  },

  /** The champion: the Sunsteel Lance every fourth turn, a second wind at half health. */
  bc_valka(c) {
    if (c.m.lance) { c.m.lance = false; c.say('Sunsteel Lance! The whole ring rings like a struck bell.'); return c.use('e_crush'); }
    if (c.hpPct < 0.5 && c.once('second_wind')) { c.say('"Now it is a fight." Valka throws off her cape.'); return c.use('e_buff', [c.self]); }
    if (c.turn % 4 === 2) { c.m.lance = true; c.say('Valka plants her feet and draws the lance back to her ear. Guard!'); return c.use('e_charge'); }
    if (c.hpPct < 0.5) return c.pick([['e_spear', 3], ['e_cleave', 3], ['e_stun', 1]]);
    return c.pick([['e_spear', 3], ['e_sweep', 2], ['e_stun', 1]]);
  },
};

export default {
  maps: [bellring],
  enemies,
  troops,
  looks,
  bossAI,
  shops: {},
  worldNodes: [
    { id: 'bellring', name: 'The Bellring', region: 'The Heartland', act: 1, x: 565, y: 460, mapId: 'bc_bellring', tx: 15, ty: 27, dir: 'up',
      unlock: 'c3_pip_joined', desc: 'Aurenne\'s colosseum, east of the bell foundries. Four cups, one champion, and a crowd that bets on everything.' },
  ],
};
