// Content pack: wilds — more kinds of creature and more shapes of fight.
//
// New species fill the thinnest rosters (Lanternfall's shore had three kinds of foe;
// Fennick's Shard two), and each brings a way of fighting the old ones lacked, for
// EnemyMind (battle/EnemyMind.js) to play: a healer to put down first, a pack leader
// that Marks its prey, a thief that runs with your gold, a guardian that shields the
// hurt, a sprite that hastens its friends.
//
// New formations vary how many come at once: swarms of four or five small things,
// a leader with its pack, and mixed groups built around the new roles. They join the
// maps' encounter tables through `encounters` (applied after every pack has loaded).

/**
 * An enemy definition (see EnemyDef).
 * @param {string} id
 * @param {string} name
 * @param {number} level
 * @param {number | string} chapter  its Compendium section
 * @param {import('../../types/data').EnemyDef['sprite']} sprite
 * @param {Partial<import('../../types/data').EnemyDef>} [opts]
 * @returns {import('../../types/data').EnemyDef}
 */
const E = (id, name, level, chapter, sprite, opts = {}) => ({ id, name, level, chapter, sprite, ...opts });

/** @type {import('../../types/data').EnemyDef[]} */
const enemies = [
  // ------------------------------------------------ Chapter 1 — Lanternfall shore & Tide Caves
  E('sand_flea', 'Sand Flea', 1, 1, { type: 'insect', color: '#d8c090', accent: '#8a6a40', eye: '#202020', seed: 101 }, {
    stats: { hp: 0.45, def: 0.7, spd: 1.3, exp: 0.5, gold: 0.5 }, weak: ['fire', 'blunt'], poise: 1,
    skills: [['attack', 3], ['e_bite', 1]], drops: [['tonic', 0.08]], steal: ['tonic', 'sea_glass'],
    desc: 'One is a nuisance. There is never one.',
  }),
  E('kelp_lasher', 'Kelp Lasher', 2, 1, { type: 'plant', color: '#4a7a3a', accent: '#c0d060', seed: 102 }, {
    stats: { hp: 1.1, mag: 0.9, spd: 0.85 }, weak: ['fire', 'slash'], resist: { ice: 0.5 }, poise: 2,
    skills: [['attack', 2], ['e_sting', 2], ['e_tangle', 1]], drops: [['antidote', 0.2], ['sea_glass', 0.2]], steal: ['antidote', 'tonic'],
    desc: 'Every spring the kelp beds wash up on Lanternfall\'s shore. This spring, some of the kelp walked.',
  }),
  E('glowcap', 'Glowcap', 3, 1, { type: 'mushroom', color: '#3a8a8a', accent: '#a0fff0', eye: '#e0fff8', seed: 103 }, {
    stats: { hp: 0.7, mag: 0.9, spd: 0.8 }, weak: ['fire', 'wind'], poise: 2,
    skills: [['e_glow', 2], ['e_spore', 1], ['attack', 1]], drops: [['echo_herb', 0.15], ['tonic', 0.15]], steal: ['tonic', 'echo_herb'],
    desc: 'Its glow soothes everything that lives in the caves, so they keep coming back. Put it out first.',
  }),
  E('lantern_angler', 'Lantern Angler', 3, 1, { type: 'angler', color: '#2a4a5a', accent: '#ffd070', eye: '#ffe060', seed: 104 }, {
    stats: { hp: 1.1, str: 1.05 }, weak: ['bolt', 'pierce'], resist: { ice: 0.5 }, poise: 3,
    skills: [['e_bite', 3], ['e_blind', 1], ['attack', 1]], drops: [['sea_glass', 0.3], ['tonic', 0.2]], steal: ['tonic', 'sea_charm'],
    desc: 'Fishermen lost in the dark follow its light, thinking it is a boat. It is not a boat.',
  }),

  // ------------------------------------------------ Chapter 2 — the Gale Coast, Whisperwold, Thistledown
  E('c2_wold_alpha', 'Wold Alpha', 8, 2, { type: 'hound', color: '#8a8a94', accent: '#e8e8f0', eye: '#ffb030', size: 1.5, seed: 105 }, {
    stats: { hp: 1.5, str: 1.1, spd: 1.15, exp: 1.6, gold: 1.4, cp: 1.5 }, weak: ['fire', 'slash'], poise: 4,
    skills: [['e_bite', 3], ['e_mark', 2], ['e_rally', 1]], traits: ['pack', 'enrage'],
    drops: [['wolf_pelt', 0.6], ['tonic', 0.3]], steal: ['tonic', 'vigor_seed'],
    desc: 'Wold wolves run in threes because the fourth is always watching. When it marks you, the others come.',
  }),
  E('c2_harvest_spider', 'Harvest Spider', 9, 2, { type: 'spider', color: '#c8a050', accent: '#6a4a20', eye: '#ff4020', seed: 106 }, {
    stats: { hp: 0.95, spd: 1.1 }, weak: ['fire', 'slash'], poise: 2,
    skills: [['e_web', 2], ['e_sting', 2], ['attack', 1]], drops: [['antidote', 0.3]], steal: ['antidote', 'eye_drops'],
    desc: 'It spins between the wheat rows and waits for the harvest. Lately it has stopped waiting.',
  }),
  E('c2_thistle_sprite', 'Thistle Sprite', 10, 2, { type: 'wisp', color: '#e090d0', eye: '#ffffff', seed: 107 }, {
    stats: { hp: 0.7, mag: 1.15, spd: 1.3, evade: 10 }, weak: ['dark', 'fire'], resist: { pierce: 0.6 }, poise: 2,
    skills: [['e_quicken', 2], ['e_gust', 2], ['e_heal', 1]], drops: [['ether', 0.15], ['echo_herb', 0.2]], steal: ['echo_herb', 'ether'],
    desc: 'A thistledown seed that caught a little Gloam and a great many opinions. It hurries its friends along.',
  }),
  E('c2_cutpurse', 'Road Cutpurse', 7, 2, {
    type: 'humanoid', size: 1,
    look: { id: 'cutpurse', skin: '#e0b090', hair: { style: 'messy', color: '#5a3a2a' }, outfit: { style: 'vest', main: '#5a4a6a', accent: '#c8a050', trim: '#3a2a3a', pants: '#3a3440' }, acc: ['hood'], weapon: 'dagger' },
  }, {
    stats: { hp: 0.9, spd: 1.4, evade: 8 }, weak: ['blunt', 'bolt'], poise: 2,
    skills: [['e_steal', 3], ['attack', 2], ['e_slash', 1]], traits: ['thief'],
    drops: [['smoke_ball', 0.15], ['tonic', 0.2]], steal: ['tonic', 'iron_dagger'],
    desc: 'Quick hands and quicker feet. Fell it before it runs and you get your purse back.',
  }),

  // ------------------------------------------------ Chapter 3 — Aurenne
  E('c3_chimney_imp', 'Chimney Imp', 13, 3, { type: 'elemental', color: '#3a3030', accent: '#ff8030', eye: '#ffd060', seed: 108 }, {
    stats: { hp: 0.8, mag: 1.2, spd: 1.2 }, weak: ['ice', 'wind'], resist: { fire: -1, dark: 0.5 }, poise: 2,
    skills: [['e_ember', 2], ['e_soot', 1], ['e_firebreath', 1]], drops: [['burn_salve', 0.3]], steal: ['burn_salve', 'ether'],
    desc: 'Aurenne lights a thousand hearths a night. Something has been nesting in the flues.',
  }),
  E('c3_weathercock', 'Brass Weathercock', 12, 3, { type: 'bird', color: '#c8a040', accent: '#8a6020', eye: '#202020', seed: 109 }, {
    stats: { hp: 0.9, def: 1.4, spd: 1.25 }, weak: ['bolt', 'blunt'], resist: { pierce: 0.6, wind: 0.5 }, poise: 3,
    skills: [['e_peck', 2], ['e_gust', 2], ['e_quicken', 1]], drops: [['eye_drops', 0.2], ['tonic', 0.2]], steal: ['tonic', 'eye_drops'],
    desc: 'It points wherever the wind is about to go. Then it goes there first.',
  }),

  // ------------------------------------------------ Chapter 4 — the Wreck of the Halcyon
  E('c4a_brass_scarab', 'Brass Scarab', 16, 4, { type: 'insect', color: '#b08a40', accent: '#ffe0a0', eye: '#40c0ff', seed: 110 }, {
    stats: { hp: 1.1, def: 1.8, res: 0.9, spd: 0.9 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5, pierce: 0.6, fire: 0.7 }, poise: 4,
    skills: [['e_tackle', 2], ['e_bulwark', 2], ['e_shell', 1]], traits: ['guardian'],
    drops: [['hi_tonic', 0.12], ['saltglass', 0.2]], steal: ['tonic', 'saltglass'],
    desc: 'It lived in the Halcyon\'s engines and guards the wreck the way a dog guards a bone. It throws its shell over anything hurt.',
  }),

  // ------------------------------------------------ Chapter 5 — Lanternfall at sunset
  E('c5_ember_gull', 'Emberwing Gull', 33, 5, { type: 'bird', color: '#e07040', accent: '#ffd080', eye: '#202020', seed: 111 }, {
    stats: { hp: 0.85, mag: 1.1, spd: 1.35 }, weak: ['ice', 'pierce'], resist: { fire: 0.5 }, poise: 2,
    skills: [['e_peck', 2], ['e_ember', 2], ['e_mark', 1]], traits: ['pack'],
    drops: [['eye_drops', 0.3]], steal: ['eye_drops', 'swift_fruit'],
    desc: 'Lanternfall\'s gulls in the last week. Their wings smoulder, and they have stopped being afraid of anything.',
  }),
  E('c5_lamp_wisp', 'Gutter-Lamp Wisp', 33, 5, { type: 'wisp', color: '#ffd070', eye: '#ffffff', seed: 112 }, {
    stats: { hp: 0.7, mag: 1.15, def: 1.8, res: 0.7, evade: 8 }, weak: ['dark', 'wind'], resist: { slash: 0.5, pierce: 0.5, blunt: 0.6, light: 0 }, poise: 2,
    skills: [['e_heal', 2], ['e_spark', 2], ['e_cleanse', 1]], drops: [['hi_ether', 0.12]], steal: ['ether', 'hi_ether'],
    desc: 'The last lamps of Lanternfall burn too bright and too long. Some of them have wandered off.',
  }),

  // ------------------------------------------------ Chapter 6 — the Drift
  E('c6_ash_mote', 'Ash Mote', 34, 6, { type: 'wisp', color: '#8a8088', eye: '#ff9a5a', seed: 113 }, {
    stats: { hp: 0.4, mag: 0.8, spd: 1.3, exp: 0.6 }, weak: ['ice', 'wind'], resist: { fire: 0, dark: 0.5 }, poise: 1,
    skills: [['e_ember', 2], ['e_selfdestruct', 1]], drops: [['burn_salve', 0.2]], steal: ['burn_salve', 'hi_tonic'],
    desc: 'A cinder that kept burning after the fire around it went out. It goes out angry.',
  }),

  // ------------------------------------------------ Chapter 11 — the Seven Wounds
  E('c11_rime_warden', 'Rime Warden', 59, 11, { type: 'golem', color: '#a8c8e0', accent: '#e8f4ff', eye: '#4aa0ff', size: 1.5, seed: 114 }, {
    stats: { hp: 1.4, def: 2, res: 1.2, spd: 0.75, exp: 1.3 }, weak: ['fire', 'blunt'], resist: { ice: 0, pierce: 0.6 }, poise: 5,
    skills: [['e_bulwark', 2], ['e_icebreath', 1], ['e_crush', 1], ['attack', 1]], traits: ['guardian'],
    drops: [['frost_lily', 0.3], ['mega_tonic', 0.08]], steal: ['frost_lily', 'frost_ring'],
    desc: 'The monks of Frosthollow built it to keep the pass. It keeps the monks now, what is left of them.',
  }),
  E('c11_coral_polyp', 'Brinecoral Polyp', 64, 11, { type: 'plant', color: '#e07080', accent: '#ffd0d8', seed: 115 }, {
    stats: { hp: 1.1, mag: 1.15, spd: 0.8 }, weak: ['fire', 'blunt'], resist: { ice: 0.5, slash: 0.7 }, poise: 3,
    skills: [['e_heal', 2], ['e_cleanse', 1], ['e_spit', 2]], drops: [['sea_glass', 0.5], ['hi_ether', 0.2]], steal: ['x_ether', 'sea_charm'],
    desc: 'The reef grows over everything that drowns here, and mends the other drowned things too.',
  }),
  E('c11_lamplighter', 'Vigil Lamplighter', 61, 11, { type: 'ghost', color: '#e0c080', eye: '#fff0a0', seed: 116 }, {
    stats: { hp: 0.9, mag: 1.2, def: 1.6, evade: 6 }, weak: ['dark', 'blunt'], resist: { light: 0, pierce: 0.6, slash: 0.6 }, poise: 3,
    skills: [['e_holy', 2], ['e_quicken', 1], ['e_heal', 1]], drops: [['ember_feather', 0.15]], steal: ['ember_feather', 'hi_ether'],
    desc: 'Somebody has to keep the vigil lamps lit. Nobody told it the vigil is over.',
  }),
  E('c11_rift_maw', 'Rift Maw', 65, 11, { type: 'horror', color: '#2a1a3a', accent: '#ff60a0', eye: '#ffe0ff', size: 1.5, seed: 117 }, {
    stats: { hp: 1.5, str: 1.2, mag: 1.15, exp: 1.3 }, weak: ['light'], resist: { dark: -1 }, poise: 4,
    skills: [['e_drain', 2], ['e_darkwave', 1], ['e_bite', 2]], traits: ['enrage'],
    drops: [['gloam_shard', 0.2], ['gloam_dust', 0.5]], steal: ['gloam_shard', 'dusk_ring'],
    desc: 'The Rift opens. Sometimes the Rift has teeth.',
  }),
  E('c11_hollow_orderly', 'Hollow Orderly', 61, 11, { type: 'skeleton', color: '#e0dcd0', accent: '#a0b0a0', eye: '#80ff80', seed: 118 }, {
    stats: { hp: 1.0, mag: 1.1, def: 1.2 }, weak: ['light', 'fire', 'blunt'], resist: { dark: 0, pierce: 0.5 }, immune: ['poison', 'sleep'], poise: 3,
    skills: [['e_heal', 2], ['e_stun', 2], ['e_sleep', 1]], drops: [['panacea', 0.15], ['tonic_mist', 0.1]], steal: ['panacea', 'wake_charm'],
    desc: 'It still makes its rounds and still tends the sick. Whatever it gives them, they don\'t get better.',
  }),

  // ------------------------------------------------ Side paths
  E('side_lantern_urchin', 'Lantern Urchin', 17, 'side', { type: 'slime', color: '#d0a0f0', eye: '#ffffff', seed: 119 }, {
    stats: { hp: 0.9, def: 1.4, res: 1.2 }, weak: ['blunt', 'bolt'], resist: { pierce: 0.5 }, poise: 3,
    skills: [['e_spark', 2], ['e_shell', 1], ['e_cleanse', 1]], drops: [['sea_glass', 0.4]], steal: ['eye_drops', 'sea_glass'],
    desc: 'Its spines light up when something comes close. Then it lights up too.',
  }),
  E('side_topiary_hound', 'Topiary Hound', 59, 'side', { type: 'hound', color: '#4a8a4a', accent: '#a0d080', eye: '#ffe060', seed: 120 }, {
    stats: { hp: 1.0, str: 1.15, spd: 1.2 }, weak: ['fire', 'slash'], resist: { ice: 0.5 }, poise: 3,
    skills: [['e_bite', 3], ['e_mark', 1], ['attack', 1]], traits: ['pack'],
    drops: [['panacea', 0.15]], steal: ['panacea', 'hi_ether'],
    desc: 'The garden remembers dogs. It remembers them a little wrong.',
  }),
];

const T = (list, opts = {}) => ({ enemies: list, ...opts });
const n = (id, k) => Array(k).fill(id);

/** @type {Record<string, import('../../types/data').TroopDef>} */
const troops = {
  // Chapter 1
  lf_fleas5: T(n('sand_flea', 5)),
  lf_kelp2: T(['kelp_lasher', 'kelp_lasher']),
  lf_kelp_mix: T(['kelp_lasher', 'brine_jelly', 'sand_flea']),
  tc_fleas4: T(n('sand_flea', 4)),
  tc_glowcap: T(['cave_bat', 'glowcap']),
  tc_angler: T(['lantern_angler', 'brine_jelly']),
  tc_angler_cap: T(['brine_jelly', 'glowcap', 'brine_jelly']),
  // Chapter 2
  c2_alpha_pack: T(['wold_wolf', 'wold_wolf', 'c2_wold_alpha', 'wold_wolf']),
  c2_cutpurses: T(['c2_cutpurse', 'c2_cutpurse']),
  c2_kites4: T(n('c2_cliff_kite', 4)),
  c2_spiders: T(['c2_harvest_spider', 'c2_harvest_spider']),
  c2_sprite_boars: T(['field_boar', 'c2_thistle_sprite', 'field_boar']),
  c2_crows4: T(n('murder_crow', 4)),
  c2_field_thieves: T(['bandit', 'c2_cutpurse', 'c2_harvest_spider']),
  c2_wold_sprites: T(['thornling', 'c2_thistle_sprite', 'thornling']),
  // Chapter 3
  c3_imps: T(['c3_chimney_imp', 'c3_chimney_imp']),
  c3_vane_rooks: T(['c3_belfry_rook', 'c3_weathercock', 'c3_belfry_rook']),
  c3_rats5: T(n('sewer_rat', 5)),
  c3_bone_company: T(['bone_soldier', 'c3_bone_archer', 'bone_soldier', 'c3_bone_archer']),
  // Chapter 4
  c4a_scarabs: T(['c4a_brass_scarab', 'c4a_wyrmling', 'c4a_brass_scarab']),
  c4a_scarab_vultures: T(['c4a_bone_vulture', 'c4a_brass_scarab', 'c4a_bone_vulture']),
  c4a_wyrm4: T(n('c4a_wyrmling', 4)),
  c4a_scorpions4: T(n('c4a_dune_scorpion', 4)),
  c4b_leeches4: T(n('c4b_bog_leech', 4)),
  c4b_briars4: T(n('c4b_briarling', 4)),
  // Chapter 5
  c5_gulls: T(n('c5_ember_gull', 3)),
  c5_lamp_mix: T(['c5_dusk_jelly', 'c5_lamp_wisp', 'c5_gloam_crab']),
  c5_lamp_wraiths: T(['c5_lamp_wisp', 'c5_tide_wraith', 'c5_lamp_wisp']),
  // Act II
  c6_motes5: T(n('c6_ash_mote', 5)),
  c6_mote_wraith: T(['c6_ash_mote', 'c6_ash_wraith', 'c6_ash_mote']),
  c6_motes4: T(n('c6_ash_mote', 4)),
  c7_gnawers5: T(n('c7_rotgnawer', 5)),
  c8_shrikes4: T(n('c8_gale_shrike', 4)),
  c9_flare_bats4: T(n('c9_flare_bat', 4)),
  c11_fh_warden: T(['c11_snow_stalker', 'c11_rime_warden', 'c11_rime_monk']),
  c11_rf_polyp: T(['c11_abyss_crab', 'c11_coral_polyp', 'c11_wreck_eel']),
  c11_vg_lamps: T(['c11_lamplighter', 'c11_squire_shade']),
  c11_rift_maw: T(['c11_rift_maw', 'c11_forgotten']),
  c11_inf_orderly: T(['c11_hollow_orderly', 'c11_fever_wraith', 'c11_hollow_orderly']),
  // Side paths
  side_obs_urchins: T(['side_lantern_urchin', 'side_tide_lurker']),
  side_garden_hounds: T(['side_topiary_hound', 'side_topiary_hound', 'side_thorn_maw']),
};

/**
 * New rows for existing encounter tables: [troopId, weight].
 * @type {Record<string, Array<[string, number]>>}
 */
const encounters = {
  lanternfall: [['lf_fleas5', 2], ['lf_kelp2', 2], ['lf_kelp_mix', 2]],
  lf_tidecaves: [['tc_fleas4', 1], ['tc_glowcap', 2], ['tc_angler', 2], ['tc_angler_cap', 1]],
  c2_gale_road: [['c2_alpha_pack', 1], ['c2_cutpurses', 1], ['c2_kites4', 1]],
  c2_wold_outer: [['c2_alpha_pack', 1], ['c2_wold_sprites', 2]],
  c2_td_fields: [['c2_spiders', 2], ['c2_sprite_boars', 2], ['c2_crows4', 1], ['c2_field_thieves', 1]],
  c3_rooftops: [['c3_imps', 2], ['c3_vane_rooks', 2]],
  c3_uc_sewers: [['c3_rats5', 1]],
  c3_uc_ossuary: [['c3_bone_company', 1]],
  c4a_halcyon: [['c4a_scarabs', 2], ['c4a_scarab_vultures', 1], ['c4a_wyrm4', 1]],
  c4a_dunes: [['c4a_scorpions4', 1]],
  c4b_drownmere: [['c4b_leeches4', 1]],
  c4b_thornwood: [['c4b_briars4', 1]],
  lf_sunset: [['c5_gulls', 2], ['c5_lamp_mix', 2]],
  c5_tidecaves: [['c5_lamp_wraiths', 1]],
  c6_hermit_shard: [['c6_motes5', 2], ['c6_mote_wraith', 2]],
  c6_drift: [['c6_motes4', 1]],
  ch7_drowned_undercroft: [['c7_gnawers5', 1]],
  c8_underhang: [['c8_shrikes4', 1]],
  c9_cinderdeep: [['c9_flare_bats4', 1]],
  c11_frosthollow: [['c11_fh_warden', 2]],
  c11_reef: [['c11_rf_polyp', 2]],
  c11_vigil: [['c11_vg_lamps', 1]],
  c11_rift: [['c11_rift_maw', 2]],
  c11_infirmary: [['c11_inf_orderly', 1]],
  side_obs_shore: [['side_obs_urchins', 2]],
  side_garden_gate: [['side_garden_hounds', 2]],
};

/** @type {import('../../types/data').ContentPack} */
export default { enemies, troops, encounters };
