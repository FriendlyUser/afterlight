// Content pack: the Lost Callings (Act II, Lv 45–56). Four Crests struck from the
// Choir's rolls long ago, each remembered at a slab of crest-glass its guardian still
// keeps (story/lost.js runs the quests; the Crests are in data/crests.js, Tier IV).
// The people who remember them and the guardians are prefixed lc_.

const SKIN = { fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };

const looks = {
  lc_wend: { id: 'lc_wend', skin: SKIN.tan, hair: { style: 'bun', color: '#e8e4dc' }, outfit: { style: 'coat', main: '#3a5a6a', accent: '#d8d0c0', trim: '#c9a24a', pants: '#2a3a44' }, acc: ['scarf'] },
  lc_hask: { id: 'lc_hask', skin: SKIN.warm, hair: { style: 'bald', color: '#000' }, outfit: { style: 'vest', main: '#6a4a2a', accent: '#c8a050', pants: '#3a2a20' }, acc: ['beard'], build: 'large' },
  lc_ada: { id: 'lc_ada', skin: SKIN.brown, hair: { style: 'braid', color: '#b8b0a8' }, outfit: { style: 'vest', main: '#a87a3a', accent: '#e8dcc0', trim: '#5a8ac8', pants: '#3a3a4a' }, acc: ['glasses'] },
  lc_gardener: { id: 'lc_gardener', skin: '#e8e0f0', hair: { style: 'long', color: '#f0eef8' }, outfit: { style: 'robe', main: '#e8e4f0', accent: '#a090c0', trim: '#c8c0e0' }, acc: ['hood'], build: 'tall' },
};

const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, ...opts });

const enemies = [
  E('lc_drowned_cantor', 'The Drowned Cantor', 46, { type: 'ghost', color: '#4a8a9a', accent: '#e0f0f0', eye: '#a0ffff', size: 2, seed: 401 }, {
    boss: true, stats: { hp: 7.5, str: 1.2, mag: 1.8, res: 1.3, spd: 1.35, exp: 6, gold: 6, cp: 4 }, weak: ['bolt', 'light'], resist: { ice: 0.3, dark: 0.5 }, poise: 8,
    ai: 'lc_cantor', drops: [['x_ether', 1]], steal: ['hi_ether', 'sea_charm'],
    desc: 'A Tidecaller who sang the boats home for forty years, and went down with the last one. She still keeps the crest-glass. She still sings.',
  }),
  E('lc_bronze_abbot', 'The Bronze Abbot', 45, { type: 'bell', color: '#b08040', accent: '#5a3a1a', eye: '#ffe080', size: 2, seed: 402 }, {
    boss: true, stats: { hp: 15, str: 2.1, def: 1.4, spd: 1.3, exp: 6, gold: 6, cp: 4 }, weak: ['bolt', 'ice'], resist: { slash: 0.6, blunt: 0.8, fire: 0.5 }, poise: 9,
    ai: 'lc_abbot', drops: [['guard_fruit', 1]], steal: ['mega_tonic', 'guard_fruit'],
    desc: 'The bell the founders were made to melt down, poured instead into a guardian and walled up with their calling. It has been waiting to be rung.',
  }),
  E('lc_scrap_colossus', 'The Scrap Colossus', 50, { type: 'golem', color: '#8a6040', accent: '#5a8ac8', eye: '#ffb040', size: 2, seed: 403 }, {
    boss: true, stats: { hp: 16, str: 2.5, def: 1.3, spd: 1.55, exp: 6, gold: 8, cp: 4 }, weak: ['bolt'], resist: { fire: 0.5, pierce: 0.7 }, poise: 9,
    ai: 'lc_colossus', drops: [['swift_fruit', 1]], steal: ['mega_tonic', 'scrap_gear'],
    desc: 'The first Kitewrights built it to lift their workshop into the sky. It never flew. It has guarded what they left ever since, out of loyalty or spite.',
  }),
  E('lc_forgetting', 'The Forgetting', 56, { type: 'horror', color: '#d8d0e8', accent: '#6a5a8a', eye: '#2a1a3a', size: 2, seed: 404 }, {
    boss: true, stats: { hp: 10, mag: 2.05, res: 1.3, spd: 1.5, exp: 6, gold: 6, cp: 4 }, weak: ['light', 'fire'], resist: { dark: 0 }, poise: 10,
    ai: 'lc_forgetting', drops: [['magic_fruit', 1]], steal: ['x_ether', 'magic_fruit'],
    desc: 'What the Choir set to guard the last Mnemonist\'s grave: an appetite for memory. It eats names first.',
  }),
];

const FINAL = { boss: true, music: 'boss', canFlee: false };
const troops = {
  lc_tidecaller: { enemies: ['lc_drowned_cantor'], ...FINAL },
  lc_bellwright: { enemies: ['lc_bronze_abbot'], ...FINAL },
  lc_kitewright: { enemies: ['lc_scrap_colossus'], ...FINAL },
  lc_mnemonist: { enemies: ['lc_forgetting'], ...FINAL },
};

const bossAI = {
  /** Sings a Tidal Hymn every third turn (telegraphed); a lullaby when hurt. */
  lc_cantor(c) {
    if (c.m.hymn) { c.m.hymn = false; c.say('The Drowned Cantor\'s hymn breaks over you like a wave!'); return c.use('e_tidal'); }
    if (c.hpPct < 0.5 && c.once('lullaby')) { c.say('She hums the song mothers sang on the docks. Your eyes grow heavy...'); return c.use('e_sleep'); }
    if (c.turn % 3 === 0) { c.m.hymn = true; c.say('The Drowned Cantor draws a breath that sounds like the tide going out... Guard!'); return c.use('e_charge'); }
    return c.pick([['e_tidal', 2], ['e_icebreath', 2], ['e_drain', 2], ['e_spit', 1]]);
  },

  /** Tolls every fourth turn (telegraphed); hushes the party; hardens at half. */
  lc_abbot(c) {
    if (c.m.toll) { c.m.toll = false; c.say('BONG. The floor of the foundry jumps.'); return c.use('e_quake'); }
    if (c.hpPct < 0.5 && c.once('harden')) { c.say('The Abbot\'s bronze rings, and goes still and hard.'); return c.use('e_shell'); }
    if (c.turn % 4 === 2) { c.m.toll = true; c.say('The Bronze Abbot swings back, back, back on its yoke... Guard!'); return c.use('e_charge'); }
    return c.pick([['e_crush', 2], ['e_slam', 2], ['e_quake', 2], ['e_stun', 1], ['e_silence', 1]]);
  },

  /** Overcharges every third turn (telegraphed lightning); rampages when hurt. */
  lc_colossus(c) {
    if (c.m.charge) { c.m.charge = false; c.say('The Colossus vents its whole boiler over you!'); return c.use('e_bigbreath'); }
    if (c.hpPct < 0.5 && c.once('rage')) { c.say('Plates fall away. What is left of it moves faster.'); return c.use('e_buff', [c.self]); }
    if (c.turn % 3 === 0) { c.m.charge = true; c.say('The Scrap Colossus whines higher and higher, steam screaming from every seam... Guard!'); return c.use('e_charge'); }
    if (c.hpPct < 0.5) return c.pick([['e_rampage', 3], ['e_crush', 2], ['e_thunder', 2]]);
    return c.pick([['e_crush', 3], ['e_slam', 2], ['e_thunder', 2], ['e_volley', 1]]);
  },

  /** Stills time once, eats MP, and every third turn a telegraphed Lament. */
  lc_forgetting(c) {
    if (c.m.lament) { c.m.lament = false; c.say('The Forgetting opens, and every name you know goes quiet for a moment.'); return c.use('e_lament'); }
    if (c.hpPct < 0.6 && c.once('stillness')) { c.say('Somewhere a clock forgets how to tick.'); return c.use('e_stillness'); }
    if (c.turn % 3 === 0) { c.m.lament = true; c.say('The Forgetting turns toward you, and you cannot remember why you came... Guard!'); return c.use('e_charge'); }
    return c.pick([['e_lament', 2], ['e_darkwave', 2], ['e_drain', 2], ['e_mpdrain', 1], ['e_blind', 1]]);
  },
};

export default {
  maps: [],
  enemies,
  troops,
  looks,
  bossAI,
  shops: {},
  worldNodes: [],
};
