// Post-game battle content: the Gloam Abyss roster (8 bands, Lv 76–97),
// rare treasure foes, two mid-bosses, the superbosses (the First Dark, Lysa's
// Echo) and the Echo Colosseum's remembered champions. Plus the enemy skills
// and boss scripts they use.
//
// Big attacks are telegraphed by a harmless "gathering" move the turn before
// (pg_gather & friends, which show the 'windup' status) and carry their full
// power themselves, so they do not use the charge multiplier.

import { SKILLS } from '../skills.js';

// ---------------------------------------------------------------------------
// Enemy skills
// ---------------------------------------------------------------------------

// The tell marks the user 'Winding Up' (a visible warning; no power bonus).
const tell = (name) => ({ name, kind: 'support', target: 'self', selfStatus: ['windup'], anim: 'buff' });
Object.assign(SKILLS, {
  pg_gather: tell('Gathering...'),
  pg_count: tell('Counting...'),
  pg_kneel: tell('Kneeling...'),
  pg_burrow: tell('Burrowing...'),
  pg_mark: tell('Taking Aim...'),
  pg_oathbreaker: { name: 'Oathbreaker', kind: 'phys', target: 'enemies', power: 260, elem: 'slash', anim: 'slash' },
  pg_absolute_zero: { name: 'Absolute Zero', kind: 'mag', target: 'enemies', power: 280, elem: 'ice', status: [['slow', 0.5]], anim: 'ice' },
  pg_unform: { name: 'Unform', kind: 'mag', target: 'enemies', power: 120, elem: 'dark', special: 'dispel', anim: 'dark' },
  pg_lightless: { name: 'Lightless', kind: 'mag', target: 'enemy', power: 240, elem: 'dark', anim: 'dark' },
  pg_dark_before: { name: 'The Dark Before', kind: 'mag', target: 'enemies', power: 340, elem: 'none', anim: 'burst' },
  pg_unname: { name: 'Unname', kind: 'support', target: 'enemy', status: [['doom', 0.85]], anim: 'dark' },
  pg_false_dawn: { name: 'False Dawn', kind: 'mag', target: 'enemies', power: 170, elem: 'light', anim: 'light' },
  pg_every_edge: { name: 'Every Edge at Once', kind: 'phys', target: 'random', power: 70, hits: 5, elem: 'slash', anim: 'slash' },
  pg_tag: { name: 'Tag! You\'re It!', kind: 'phys', target: 'enemy', power: 170, elem: 'blunt', status: [['stun', 0.35]], anim: 'blunt' },
  pg_ring_around: { name: 'Ring Around the Lantern', kind: 'mag', target: 'enemies', power: 120, elem: 'light', status: [['sleep', 0.25]], anim: 'song' },
  pg_hopscotch: { name: 'Hopscotch', kind: 'phys', target: 'random', power: 60, hits: 4, elem: 'blunt', anim: 'blunt' },
  pg_ready_or_not: { name: 'Ready or Not', kind: 'mag', target: 'enemies', power: 320, elem: 'dark', anim: 'dark' },
  pg_hide: { name: 'Hide!', kind: 'support', target: 'self', selfStatus: ['veil'], anim: 'buff' },
  pg_stay: { name: 'Stay and Play', kind: 'support', target: 'enemy', status: [['charm', 0.6]], anim: 'status' },
  pg_forty_years: { name: 'Forty Years', kind: 'special', target: 'enemies', special: 'delayAll', anim: 'dark' },
  pg_tidal_echo: { name: 'Remembered Tide', kind: 'mag', target: 'enemies', power: 210, elem: 'ice', anim: 'ice' },
  pg_haymaker: { name: 'The Legendary Haymaker', kind: 'phys', target: 'enemy', power: 330, elem: 'blunt', status: [['stun', 0.5]], anim: 'blunt' },
  pg_hush: { name: 'Hush Now', kind: 'mag', target: 'enemies', power: 220, elem: 'dark', status: [['silence', 0.4]], anim: 'song' },
  pg_glass_storm: { name: 'Glass Storm', kind: 'phys', target: 'enemies', power: 220, elem: 'slash', anim: 'quake' },
  pg_penance: { name: 'Penance', kind: 'phys', target: 'enemies', power: 230, elem: 'slash', anim: 'slash' },
  pg_execution: { name: 'Lord-Commander\'s Verdict', kind: 'phys', target: 'enemy', power: 380, elem: 'slash', anim: 'slash' },
  pg_hollow_blade: { name: 'Hollow Blade', kind: 'phys', target: 'enemy', power: 300, elem: 'slash', anim: 'slash' },
  pg_hollow_wall: { name: 'Hollow Wall', kind: 'support', target: 'allies', status: [['protect', 1]], anim: 'buff' },
});

// ---------------------------------------------------------------------------
// Enemies
// ---------------------------------------------------------------------------

const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, poise: 3, ...opts });
const BOSS = { boss: true, immune: ['doom', 'charm'] };

export const ENEMY_LIST = [
  // ===================================================== Band 1 — Gloamdeep (B1–B4, Lv 76)
  E('pg_umbral_hound', 'Umbral Hound', 76, { type: 'hound', color: '#1c1630', accent: '#8a6aff', eye: '#d0b0ff', seed: 21 }, {
    stats: { hp: 1.0, spd: 1.2 }, weak: ['light', 'fire'], resist: { dark: 0.5 },
    skills: [['e_bite', 3], ['e_howl', 1], ['e_darkwave', 1]], drops: [['gloam_dust', 0.5], ['hi_tonic', 0.2]], steal: ['hi_tonic', 'gloam_shard'],
    desc: 'Not a hound. The rumour of one — the feeling of being followed home, given teeth.',
  }),
  E('pg_murk_ooze', 'Murk Ooze', 76, { type: 'slime', color: '#2c1c40', eye: '#ff80d0', seed: 22 }, {
    stats: { hp: 1.4, def: 0.7, res: 1.4 }, weak: ['fire', 'light'], resist: { dark: -1, blunt: 0.5 },
    skills: [['attack', 2], ['e_poison', 1], ['e_mpdrain', 1]], drops: [['gloam_shard', 0.15], ['ether', 0.3]], steal: ['ether', 'gloam_dust'],
    desc: 'Every spilled thought pools somewhere. Down here, it pools into this.',
  }),
  E('pg_forgotten', 'The Forgotten', 76, { type: 'ghost', color: '#5a5a88', eye: '#e0e0ff', seed: 23 }, {
    stats: { hp: 0.9, mag: 1.25, def: 2.2, res: 0.8, evade: 8 }, weak: ['light', 'wind'], resist: { slash: 0.4, pierce: 0.4, blunt: 0.5, dark: 0 },
    skills: [['e_drain', 2], ['e_silence', 1], ['e_dark', 2]], drops: [['echo_herb', 0.3], ['hi_ether', 0.1]], steal: ['echo_herb', 'hi_ether'],
    desc: 'Memories nobody kept. They whisper names at you, hoping one of them is theirs.',
  }),
  E('pg_gloammoth', 'Gloammoth', 76, { type: 'insect', color: '#3a2a58', accent: '#c8a8ff', eye: '#ffe0ff', seed: 24 }, {
    stats: { hp: 0.85, spd: 1.3, mag: 1.1 }, weak: ['wind', 'fire'],
    skills: [['e_gust', 2], ['e_spore', 1], ['e_blind', 1], ['attack', 1]], drops: [['eye_drops', 0.3], ['smelling_salts', 0.3]], steal: ['smelling_salts', 'eye_drops'],
    desc: 'Drawn to light. There is no light down here, so it is drawn to you.',
  }),

  // ===================================================== Band 2 — the Deep Dark (B5–B7, Lv 79)
  E('pg_dreadhound', 'Dreadhound', 79, { type: 'hound', color: '#0e0a1a', accent: '#ff5aa0', eye: '#ff90c0', size: 1.5, seed: 25 }, {
    stats: { hp: 1.25, str: 1.15, spd: 1.15 }, weak: ['light', 'slash'], resist: { dark: 0.5 }, poise: 4,
    skills: [['e_bite', 3], ['e_rampage', 1], ['e_howl', 1]], drops: [['hi_tonic', 0.3], ['gloam_dust', 0.5]], steal: ['hi_tonic', 'x_tonic'],
    desc: 'The Umbral Hound, after it caught up with someone.',
  }),
  E('pg_nightmare_weave', 'Nightmare Weave', 79, { type: 'horror', color: '#2a1a48', eye: '#ff60c0', seed: 26 }, {
    stats: { hp: 1.3, mag: 1.2 }, weak: ['light'], resist: { dark: 0 }, poise: 4,
    skills: [['e_claw', 2], ['e_darkwave', 2], ['e_sleep', 1]], drops: [['gloam_shard', 0.2]], steal: ['smelling_salts', 'gloam_shard'],
    desc: 'Every bad dream ever woken from, knotted together. It wants to finish them.',
  }),
  E('pg_eye_below', 'Eye of Below', 79, { type: 'eye', color: '#3a2a58', eye: '#ffe060', seed: 27 }, {
    stats: { hp: 0.9, mag: 1.3, evade: 6 }, weak: ['pierce', 'light'],
    skills: [['e_dark', 2], ['e_gravity', 1], ['e_stun', 1]], drops: [['eye_drops', 0.4], ['hi_ether', 0.15]], steal: ['eye_drops', 'hunters_eye'],
    desc: 'It has been looking up for a very long time, waiting for something to fall.',
  }),
  E('pg_gloam_golem', 'Gloamcrystal Golem', 79, { type: 'golem', color: '#4a2a6a', accent: '#c080ff', eye: '#ff80ff', seed: 28 }, {
    stats: { hp: 1.5, def: 1.6, spd: 0.75 }, weak: ['blunt', 'bolt'], resist: { slash: 0.5, pierce: 0.5, dark: 0.5 }, poise: 5,
    skills: [['e_crush', 2], ['e_quake', 1], ['e_shell', 1]], drops: [['gloam_shard', 0.3]], steal: ['gloam_shard', 'guard_fruit'],
    desc: 'Gloam that sat still long enough to crystallise, then got up again.',
  }),

  // ===================================================== Band 3 — the Drowned Ruins (B8–B11, Lv 82)
  E('pg_ossuary_legionary', 'Ossuary Legionary', 82, { type: 'skeleton', color: '#d8d0b8', accent: '#7a8aa0', eye: '#ff5040', seed: 31 }, {
    stats: { hp: 1.2, def: 1.25 }, weak: ['blunt', 'light', 'fire'], resist: { pierce: 0.5, dark: 0, ice: 0.7 }, immune: ['poison', 'sleep'],
    skills: [['e_slash', 3], ['e_stun', 1], ['e_cleave', 1]], drops: [['hi_tonic', 0.3]], steal: ['hi_tonic', 'silversteel_saber'],
    desc: 'A soldier of a city whose name fell out of every book at once. Still on patrol.',
  }),
  E('pg_rubble_warden', 'Rubble Warden', 82, { type: 'golem', color: '#8a7a68', accent: '#c8b090', eye: '#ffd060', seed: 32 }, {
    stats: { hp: 1.6, def: 1.7, spd: 0.7, res: 0.8 }, weak: ['ice', 'bolt'], resist: { slash: 0.5, pierce: 0.5, fire: 0.5 }, poise: 5,
    skills: [['e_slam', 2], ['e_quake', 1], ['e_shell', 1]], drops: [['guard_fruit', 0.03], ['mega_tonic', 0.2]], steal: ['mega_tonic', 'guard_fruit'],
    desc: 'A town gate that forgot it was a gate and remembered only that it was supposed to keep people out.',
  }),
  E('pg_ashen_lamplighter', 'Ashen Lamplighter', 82, { type: 'ghost', color: '#8a6858', eye: '#ffa040', seed: 33 }, {
    stats: { hp: 1.0, mag: 1.3, def: 2, res: 0.9, evade: 6 }, weak: ['ice', 'light'], resist: { fire: -1, slash: 0.5, pierce: 0.5 },
    skills: [['e_ember', 2], ['e_firebreath', 1], ['e_drain', 1]], drops: [['burn_salve', 0.4], ['hi_ether', 0.15]], steal: ['burn_salve', 'ember_ring'],
    desc: 'It still lights the lamps on its street every evening. There is no street.',
  }),
  E('pg_carrion_herald', 'Carrion Herald', 82, { type: 'bird', color: '#34303a', accent: '#a08070', eye: '#ff4040', seed: 34 }, {
    stats: { hp: 0.85, spd: 1.45 }, weak: ['pierce', 'bolt'],
    skills: [['e_peck', 3], ['e_blind', 1], ['e_gust', 1]], drops: [['eye_drops', 0.3]], steal: ['eye_drops', 'feather_cape'],
    desc: 'It carried the news of the city\'s fall to no one. It is still looking for someone to tell.',
  }),

  // ===================================================== Band 4 — the Sunken Archive (B12–B15, Lv 85)
  E('pg_faceless_saint', 'Faceless Saint', 85, { type: 'angel', color: '#c8c0b0', accent: '#8a8070', eye: '#ffffff', seed: 35 }, {
    stats: { hp: 1.2, mag: 1.3, res: 1.3 }, weak: ['blunt', 'dark'], resist: { light: -1 },
    skills: [['e_holy', 2], ['e_holyall', 1], ['e_heal', 1]], drops: [['holy_water', 0.3], ['hi_ether', 0.2]], steal: ['holy_water', 'spirit_fruit'],
    desc: 'A saint whose miracle nobody wrote down. The statue lost its face out of sheer politeness.',
  }),
  E('pg_cinder_drake', 'Cinder Drake', 85, { type: 'drake', color: '#6a3a2a', accent: '#ff8040', eye: '#ffe060', seed: 36 }, {
    stats: { hp: 1.4, str: 1.15, mag: 1.15 }, weak: ['ice', 'pierce'], resist: { fire: 0 }, poise: 5,
    skills: [['e_firebreath', 2], ['e_bite', 2], ['e_claw', 1]], drops: [['fire_bomb', 0.3], ['mega_tonic', 0.15]], steal: ['fire_bomb', 'power_fruit'],
    desc: 'It burned the archive. It does not remember why, which is the only funny thing about it.',
  }),
  E('pg_bannerless', 'Knight of No Banner', 85, { type: 'knight', color: '#4a4a52', accent: '#8a2a2a', weapon: 'sword', seed: 37 }, {
    stats: { hp: 1.3, str: 1.2, def: 1.4 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5 }, poise: 5,
    skills: [['e_slash', 3], ['e_cleave', 1], ['e_buff', 1]], drops: [['mega_tonic', 0.25]], steal: ['mega_tonic', 'ashen_armor'],
    desc: 'Sworn to a lord nobody remembers, against an enemy nobody remembers, forever.',
  }),
  E('pg_archive_creeper', 'Archive Creeper', 85, { type: 'spider', color: '#5a4a38', accent: '#c8a878', eye: '#ff4040', seed: 38 }, {
    stats: { hp: 1.1, spd: 1.2 }, weak: ['fire', 'slash'],
    skills: [['e_bite', 2], ['e_poison', 1], ['e_constrict', 1]], drops: [['antidote', 0.5], ['panacea', 0.15]], steal: ['panacea', 'magic_fruit'],
    desc: 'It spins its webs out of unread pages. You can read a sentence or two in them, if you get close. Don\'t.',
  }),

  // ===================================================== Band 5 — the First Winter (B16–B19, Lv 88)
  E('pg_rimewolf', 'Rimewolf', 88, { type: 'hound', color: '#c8d8e8', accent: '#80a8d0', eye: '#40c0ff', seed: 41 }, {
    stats: { hp: 1.0, spd: 1.25 }, weak: ['fire', 'bolt'], resist: { ice: 0 },
    skills: [['e_bite', 3], ['e_icebreath', 1], ['e_howl', 1]], drops: [['frost_bomb', 0.3], ['mega_tonic', 0.15]], steal: ['frost_bomb', 'swift_fruit'],
    desc: 'The very first winter had wolves in it. Nobody was alive to remember them. They noticed.',
  }),
  E('pg_hoarlight', 'Hoarlight', 88, { type: 'wisp', color: '#c0e8ff', eye: '#ffffff', seed: 42 }, {
    stats: { hp: 0.75, mag: 1.4, def: 2, res: 0.7, evade: 10 }, weak: ['fire', 'dark'], resist: { ice: -1, slash: 0.5, pierce: 0.5, blunt: 0.5 },
    skills: [['e_frost', 2], ['e_silence', 1], ['e_icebreath', 1]], drops: [['hi_ether', 0.3]], steal: ['hi_ether', 'frost_ring'],
    desc: 'The light off snow on a morning no one saw.',
  }),
  E('pg_glacier_sentinel', 'Glacier Sentinel', 88, { type: 'golem', color: '#a0c8e8', accent: '#e0f4ff', eye: '#40a0ff', seed: 43 }, {
    stats: { hp: 1.7, def: 1.6, spd: 0.7 }, weak: ['fire', 'blunt'], resist: { ice: -1, slash: 0.5 }, poise: 6,
    skills: [['e_crush', 2], ['e_icebreath', 1], ['e_shell', 1]], drops: [['guard_fruit', 0.04], ['mega_tonic', 0.2]], steal: ['mega_tonic', 'guard_fruit'],
    desc: 'Slow as a glacier. Exactly as slow. It is very proud of this.',
  }),
  E('pg_snowmelt_serpent', 'Snowmelt Serpent', 88, { type: 'serpent', color: '#e0f0ff', accent: '#6aa0d0', eye: '#2060c0', seed: 44 }, {
    stats: { hp: 1.3, mag: 1.2 }, weak: ['bolt', 'fire'], resist: { ice: 0.3 }, poise: 4,
    skills: [['e_constrict', 2], ['e_frost', 2], ['e_tidal', 1]], drops: [['x_tonic', 0.1]], steal: ['x_tonic', 'sea_charm'],
    desc: 'The first thaw. It has been waiting for spring since before there were seasons.',
  }),

  // ===================================================== Band 6 — the Long Winter (B20–B22, Lv 91)
  E('pg_icebound_vigil', 'Icebound Vigil', 91, { type: 'knight', color: '#a0b8d0', accent: '#e0f0ff', weapon: 'spear', seed: 45 }, {
    stats: { hp: 1.4, str: 1.2, def: 1.5 }, weak: ['fire', 'bolt'], resist: { ice: 0, slash: 0.6 }, poise: 6,
    skills: [['e_spear', 3], ['e_sweep', 1], ['e_shell', 1]], drops: [['x_tonic', 0.15]], steal: ['x_tonic', 'skypiercer'],
    desc: 'It froze at its post. It is still at its post. Some promises are just weather.',
  }),
  E('pg_longwinter_eye', 'Eye of the Long Winter', 91, { type: 'eye', color: '#d0e8ff', eye: '#4080ff', seed: 46 }, {
    stats: { hp: 1.0, mag: 1.4 }, weak: ['fire', 'pierce'], resist: { ice: 0 },
    skills: [['e_frost', 2], ['e_sleep', 1], ['e_gravity', 1]], drops: [['hi_ether', 0.3]], steal: ['hi_ether', 'wisdom_seed'],
    desc: 'Watching the snow fall. Has never once blinked. Would like to.',
  }),
  E('pg_hoarwing', 'Hoarwing', 91, { type: 'drake', color: '#d0e0f0', accent: '#4080c0', eye: '#80e0ff', seed: 47 }, {
    stats: { hp: 1.5, str: 1.15, mag: 1.2 }, weak: ['fire', 'pierce'], resist: { ice: 0 }, poise: 6,
    skills: [['e_icebreath', 2], ['e_bite', 2], ['e_gust', 1]], drops: [['frost_bomb', 0.4]], steal: ['frost_bomb', 'swift_fruit'],
    desc: 'Its wingbeats are the reason snow drifts. It is not sorry.',
  }),
  E('pg_thing_in_ice', 'The Thing in the Ice', 91, { type: 'horror', color: '#90b0d0', eye: '#ffffff', seed: 48 }, {
    stats: { hp: 1.6, str: 1.2 }, weak: ['fire', 'light'], resist: { ice: 0, dark: 0.5 }, poise: 5,
    skills: [['e_claw', 2], ['e_drain', 1], ['e_icebreath', 1]], drops: [['gloam_shard', 0.3]], steal: ['gloam_shard', 'dusk_ring'],
    desc: 'Frozen mid-reach. It thawed just enough to finish the motion.',
  }),

  // ===================================================== Band 7 — Before Edges (B23–B26, Lv 94)
  E('pg_unfinished', 'Unfinished', 94, { type: 'elemental', color: '#f0ece4', accent: '#c8c0a8', eye: '#202020', seed: 51 }, {
    stats: { hp: 1.3, mag: 1.3 }, weak: ['dark', 'slash'], resist: { light: -1 },
    skills: [['e_holy', 2], ['e_wail', 1], ['e_stun', 1]], drops: [['x_ether', 0.08]], steal: ['x_ether', 'wisdom_seed'],
    desc: 'A shape the world started, and then forgot to finish. It is trying to finish itself out of you.',
  }),
  E('pg_noonless_seraph', 'Noonless Seraph', 94, { type: 'angel', color: '#fff8e8', accent: '#e0c070', eye: '#ffd060', seed: 52 }, {
    stats: { hp: 1.2, mag: 1.4, res: 1.3 }, weak: ['dark'], resist: { light: -1 }, poise: 5,
    skills: [['e_holyall', 2], ['e_holy', 1], ['e_heal', 1], ['e_silence', 1]], drops: [['holy_water', 0.4], ['x_ether', 0.08]], steal: ['holy_water', 'spirit_fruit'],
    desc: 'Light, before anyone decided what light was for.',
  }),
  E('pg_primordial_ooze', 'Primordial Ooze', 94, { type: 'slime', color: '#f4ece0', eye: '#c0a060', seed: 53 }, {
    stats: { hp: 1.8, def: 0.6, res: 1.6 }, weak: ['fire', 'dark'], resist: { slash: 0.5, pierce: 0.5, blunt: 0.5, ice: 0.5, bolt: 0.5, wind: 0.5, light: 0.5 }, poise: 4,
    skills: [['attack', 2], ['e_mpdrain', 1], ['e_poison', 1]], drops: [['elixir', 0.08]], steal: ['elixir', 'vigor_seed'],
    desc: 'Everything was this, once. It would like everything to be this again. It is very patient.',
  }),
  E('pg_sketch_beast', 'Sketch of a Beast', 94, { type: 'boar', color: '#e8e0d0', accent: '#808080', eye: '#202020', seed: 54 }, {
    stats: { hp: 1.4, str: 1.25 }, weak: ['pierce', 'dark'], poise: 5,
    skills: [['e_tackle', 3], ['e_slam', 1], ['e_rampage', 1]], drops: [['mega_tonic', 0.3]], steal: ['mega_tonic', 'power_fruit'],
    desc: 'Four legs, roughly. A head, approximately. The idea of an animal, charging.',
  }),

  // ===================================================== Band 8 — the Threshold (B27–B29, Lv 97)
  E('pg_firstborn_hound', 'Firstborn Hound', 97, { type: 'hound', color: '#fffaf0', accent: '#ffd070', eye: '#202020', size: 1.5, seed: 55 }, {
    stats: { hp: 1.3, str: 1.2, spd: 1.3 }, weak: ['dark', 'ice'], resist: { light: 0 }, poise: 5,
    skills: [['e_bite', 3], ['e_howl', 1], ['e_rampage', 1]], drops: [['x_tonic', 0.2]], steal: ['x_tonic', 'swift_fruit'],
    desc: 'The first animal the sun ever shone on. Every hound since is a copy of a copy of it.',
  }),
  E('pg_edge_knight', 'Edge Knight', 97, { type: 'knight', color: '#f0f0f0', accent: '#202020', weapon: 'greatsword', seed: 56 }, {
    stats: { hp: 1.5, str: 1.3, def: 1.5 }, weak: ['dark', 'bolt'], resist: { slash: 0.5, light: 0.5 }, poise: 6,
    skills: [['e_cleave', 2], ['e_slash', 2], ['e_crush', 1]], drops: [['x_tonic', 0.2]], steal: ['x_tonic', 'worldcleaver'],
    desc: 'Where the light ended and the dark began, someone had to stand guard. This is the line, wearing armour.',
  }),
  E('pg_unblinking', 'The Unblinking', 97, { type: 'eye', color: '#ffffff', eye: '#000000', seed: 57 }, {
    stats: { hp: 1.1, mag: 1.5 }, weak: ['dark', 'pierce'], resist: { light: -1 },
    skills: [['e_holy', 2], ['e_gravity', 1], ['e_doom', 0.5], ['e_blind', 1]], drops: [['x_ether', 0.12]], steal: ['x_ether', 'star_pendant'],
    desc: 'The first thing that ever saw anything. It has not looked away since.',
  }),
  E('pg_first_tree', 'First Tree', 97, { type: 'treant', color: '#e8e0d0', accent: '#f0d080', eye: '#806020', seed: 58 }, {
    stats: { hp: 2.0, def: 1.3, spd: 0.7 }, weak: ['fire', 'slash'], resist: { blunt: 0.5, light: 0.5 }, poise: 6,
    skills: [['e_constrict', 2], ['e_healall', 1], ['e_spore', 1], ['e_quake', 1]], drops: [['vigor_seed', 0.1], ['elixir', 0.1]], steal: ['elixir', 'vigor_seed'],
    desc: 'Before forests, there was one tree. It was very lonely. It has not forgiven anyone for the others.',
  }),

  // ===================================================== Rare treasure foes
  E('pg_wishing_mote', 'Wishing Mote', 85, { type: 'wisp', color: '#ffe890', eye: '#ffffff', seed: 59 }, {
    stats: { hp: 0.25, def: 6, res: 0.6, spd: 1.8, evade: 40, exp: 12, gold: 3, cp: 10 }, poise: 1,
    weak: ['fire', 'ice', 'bolt'], resist: { slash: 0.1, pierce: 0.1, blunt: 0.1 },
    skills: [['attack', 1], ['e_heal', 1]], drops: [['crest_tome', 0.6], ['afterglow_vial', 0.3]], steal: ['afterglow_vial', 'crest_tome'],
    desc: 'Somebody\'s wish, still looking for them. Swords pass right through it. Spells do not.',
  }),
  E('pg_hoarder_mimic', 'Hoarder Mimic', 90, { type: 'mimic', color: '#8a6a3a', accent: '#ffd060', eye: '#ff4040', seed: 60 }, {
    stats: { hp: 2.2, str: 1.3, exp: 3, gold: 6 }, weak: ['pierce', 'bolt'], poise: 5,
    skills: [['e_bite', 3], ['e_steal', 1], ['e_crush', 1]],
    drops: [['power_fruit', 0.25], ['magic_fruit', 0.25], ['guard_fruit', 0.25], ['spirit_fruit', 0.25], ['swift_fruit', 0.15]], steal: ['x_ether', 'megalixir'],
    desc: 'It ate a treasure chest, then everything the chest\'s owner ever lost. It is mostly stomach now.',
  }),

  // ===================================================== Mid-bosses
  E('pg_unremembered', 'The Unremembered Knight', 84, { type: 'knight', color: '#3a3a46', accent: '#c8a050', weapon: 'greatsword', size: 3, seed: 61 }, {
    ...BOSS, stats: { hp: 14, str: 1.25, def: 1.3, exp: 9, gold: 8, cp: 5 }, weak: ['bolt', 'light'], resist: { slash: 0.4, pierce: 0.4, blunt: 0.4 }, poise: 8,
    ai: 'pg_unremembered', summons: ['pg_ossuary_legionary'], skills: [['e_slash', 2], ['e_cleave', 1]],
    drops: [['crest_tome', 1], ['megalixir', 1]], steal: ['x_ether', 'dawnguard_regalia'],
    desc: 'Every soldier nobody remembers ends up here. Together, they make one knight. It has a great many names and can say none of them.',
  }),
  E('pg_rime_sovereign', 'The Rime Sovereign', 92, { type: 'drake', color: '#d8ecff', accent: '#4a80c0', eye: '#80e0ff', size: 4, seed: 62 }, {
    ...BOSS, stats: { hp: 16, mag: 1.35, str: 1.2, res: 1.2, exp: 9, gold: 8, cp: 5 }, weak: ['fire', 'bolt'], resist: { ice: -1 }, poise: 9,
    ai: 'pg_rime_sovereign', summons: ['pg_hoarlight'], skills: [['e_icebreath', 2], ['e_bite', 2]],
    drops: [['megalixir', 1], ['crest_tome', 1]], steal: ['x_ether', 'frost_ring'],
    desc: 'Queen of the first winter. She ruled a kingdom of snow with no one in it, and she ruled it very well.',
  }),

  // ===================================================== Superbosses
  E('pg_first_dark', 'The First Dark', 99, { type: 'horror', color: '#08060e', accent: '#f4f0ff', eye: '#ffffff', size: 4, seed: 99 }, {
    ...BOSS, immune: ['doom', 'charm', 'sleep', 'stun', 'poison'],
    stats: { hp: 32, str: 1.35, mag: 1.4, def: 1.2, res: 1.2, spd: 1.1, exp: 14, gold: 12, cp: 8 }, weak: ['light'],
    resist: { dark: -1, slash: 0.7, pierce: 0.7, blunt: 0.7, fire: 0.7, ice: 0.7, bolt: 0.7, wind: 0.7 }, poise: 12,
    ai: 'pg_first_dark', summons: ['pg_before_shard'], skills: [['pg_lightless', 2], ['e_dark', 2]],
    desc: 'What everything was before the sun gave it edges. Not evil. Not anything. It would like you to be nothing too, very gently.',
  }),
  E('pg_before_shard', 'Shard of Before', 96, { type: 'elemental', color: '#101018', accent: '#ffffff', eye: '#ffffff', seed: 98 }, {
    stats: { hp: 3, mag: 1.3 }, weak: ['light', 'blunt'], resist: { dark: -1 }, poise: 3,
    skills: [['e_heal', 2], ['e_dark', 2], ['e_mpdrain', 1]], drops: [['gloam_shard', 0.5]], steal: ['gloam_shard', 'afterglow_vial'],
    desc: 'A piece of the First Dark that broke off to look at you more closely.',
  }),
  E('pg_lysa_echo', 'Lysa\'s Echo', 97, { type: 'humanoid', look: 'lysa', size: 2 }, {
    ...BOSS, immune: ['doom', 'charm', 'sleep'],
    stats: { hp: 26, mag: 1.35, str: 1.1, spd: 1.25, res: 1.2, exp: 12, gold: 6, cp: 8 }, weak: ['light', 'wind'], resist: { dark: -1 }, poise: 10,
    ai: 'pg_lysa', summons: ['pg_festival_lantern'], skills: [['pg_tag', 2], ['pg_hopscotch', 2]],
    desc: 'Lysa Lorne, ten years old, hiding since the night of the festival. Nobody ever found her. She is very, very good at this game.',
  }),
  E('pg_festival_lantern', 'Festival Lantern', 94, { type: 'wisp', color: '#ffd890', eye: '#ff8040', seed: 97 }, {
    stats: { hp: 1.5, mag: 1.2, evade: 6 }, weak: ['ice', 'wind'], resist: { fire: -1 },
    skills: [['e_heal', 2], ['e_ember', 2]], drops: [['afterglow_vial', 0.2]], steal: ['afterglow_vial', 'ember_ring'],
    desc: 'A paper lantern from the summer festival, forty years ago. Still lit. Still warm.',
  }),

  // ===================================================== Echo Colosseum — remembered champions
  E('pg_ar_hound', 'The Drowned Hound, Remembered', 72, { type: 'hound', color: '#1a2a3a', accent: '#60c0ff', eye: '#80e0ff', size: 2.5, seed: 81 }, {
    ...BOSS, stats: { hp: 10, str: 1.2, mag: 1.2, exp: 4, gold: 4, cp: 3 }, weak: ['slash', 'light', 'fire'], resist: { dark: 0.3, ice: 0.5 }, poise: 6,
    ai: 'pg_ar_hound', summons: ['pg_ar_pup'], skills: [['e_bite', 3], ['e_claw', 2]], drops: [['hi_ether', 1]],
    desc: 'The first monster you ever fought, the way you remember it: bigger.',
  }),
  E('pg_ar_pup', 'Remembered Pup', 70, { type: 'hound', color: '#2a3a50', accent: '#60c0ff', eye: '#80e0ff', seed: 82 }, {
    stats: { hp: 0.9 }, weak: ['slash', 'light'], resist: { dark: 0.5 }, skills: [['e_bite', 3], ['e_howl', 1]],
    desc: 'Even the shadows of the shadow got an upgrade.',
  }),
  E('pg_ar_brinefang', 'Brinefang, Twice-Told', 75, { type: 'serpent', color: '#1a4a6a', accent: '#ffe0a0', eye: '#ff6040', size: 3, seed: 83 }, {
    ...BOSS, stats: { hp: 12, mag: 1.25, exp: 4, gold: 4, cp: 3 }, weak: ['bolt', 'pierce'], resist: { ice: 0, fire: 0.5 }, poise: 7,
    ai: 'pg_ar_brinefang', skills: [['e_bite', 3], ['e_constrict', 2]], drops: [['hi_ether', 1]],
    desc: 'Every sailor who survived the strait told the story again. Each time, the serpent grew a little.',
  }),
  E('pg_ar_tam', 'Red Tam, Legend (Self-Proclaimed)', 78, { type: 'humanoid', look: 'red_tam', size: 2 }, {
    ...BOSS, stats: { hp: 11, str: 1.3, exp: 4, gold: 6, cp: 3 }, weak: ['pierce', 'ice'], poise: 7,
    ai: 'pg_ar_tam', skills: [['attack', 3], ['e_cleave', 1]], drops: [['mega_tonic', 1]],
    desc: 'Red Tam as Red Tam tells it: eight feet tall, undefeated, beloved by all. The Gloam took him at his word.',
  }),
  E('pg_ar_bandit', 'Tall-Tale Bandit', 76, { type: 'humanoid', look: 'bandit' }, {
    stats: { hp: 1.3 }, weak: ['blunt', 'bolt'], skills: [['attack', 2], ['e_steal', 1], ['e_slash', 2]], drops: [['mega_tonic', 0.2]],
    desc: 'Tam says there were forty of them. There were four. These are the forty.',
  }),
  E('pg_ar_mercy', 'Sister Mercy, as Remembered', 81, { type: 'humanoid', look: 'mercy', size: 2 }, {
    ...BOSS, stats: { hp: 12, mag: 1.35, res: 1.3, exp: 4, gold: 5, cp: 3 }, weak: ['slash', 'light'], resist: { dark: 0.3 }, poise: 7,
    ai: 'pg_ar_mercy', summons: ['pg_ar_beast'], skills: [['e_dark', 3], ['e_lament', 2]], drops: [['hi_ether', 1]],
    desc: 'Her hymns, her certainty, her gentle voice. The Gloam remembered all of it and none of the doubt.',
  }),
  E('pg_ar_beast', 'Gloam Beast, Remembered', 80, { type: 'horror', color: '#4a1a3a', eye: '#ff60a0', size: 1.5, seed: 84 }, {
    stats: { hp: 2 }, weak: ['light'], resist: { dark: 0 }, poise: 4, skills: [['e_claw', 2], ['e_darkwave', 1]],
    desc: 'It used to be a person. In the memory, it still is, a little.',
  }),
  E('pg_ar_wyrm', 'Glasswyrm Echo', 84, { type: 'serpent', color: '#d8c890', accent: '#f0f0d0', eye: '#ff6020', size: 3, seed: 85 }, {
    ...BOSS, stats: { hp: 13, str: 1.25, def: 1.3, exp: 4, gold: 5, cp: 3 }, weak: ['ice', 'bolt'], resist: { fire: 0.5 }, poise: 7,
    ai: 'pg_ar_wyrm', skills: [['e_bite', 3], ['e_sting', 1]], drops: [['mega_tonic', 1]],
    desc: 'A sand wyrm of the Sunscar, remembered by everyone who ever heard the dunes hum.',
  }),
  E('pg_ar_scorpion', 'Glass Scorpion', 82, { type: 'scorpion', color: '#c8e0e0', accent: '#80c0c0', eye: '#ff4040', seed: 86 }, {
    stats: { hp: 1.2, def: 1.4 }, weak: ['blunt', 'ice'], skills: [['e_sting', 3], ['attack', 1]], drops: [['antidote', 0.5]],
    desc: 'Clear as a window. You can see what it ate.',
  }),
  E('pg_ar_penitent', 'The Penitent, Remembered', 87, { type: 'humanoid', look: 'penitent', size: 2 }, {
    ...BOSS, stats: { hp: 15, str: 1.35, def: 1.3, exp: 5, gold: 5, cp: 3 }, weak: ['light', 'bolt'], resist: { dark: 0 }, poise: 8,
    ai: 'pg_ar_penitent', skills: [['e_slash', 3], ['e_drain', 1]], drops: [['x_ether', 1]],
    desc: 'The black knight, the hollow mask. The Gloam remembers the armour. It does not remember who was inside.',
  }),
  E('pg_ar_garrick', 'Garrick Thorne, Remembered', 90, { type: 'humanoid', look: 'garrick', size: 2 }, {
    ...BOSS, stats: { hp: 15, str: 1.4, def: 1.2, exp: 5, gold: 6, cp: 3 }, weak: ['ice', 'pierce'], poise: 8,
    ai: 'pg_ar_garrick', skills: [['e_slash', 3], ['e_cleave', 1]], drops: [['x_ether', 1]],
    desc: 'The Lord-Commander, exactly as hard as you remember. Possibly harder. Memory is not a fair judge.',
  }),
  E('pg_ar_dawnguard', 'Dawnguard Echo', 88, { type: 'humanoid', look: 'dawnguard' }, {
    stats: { hp: 1.6, def: 1.4 }, weak: ['bolt', 'dark'], skills: [['e_slash', 2], ['e_spear', 1], ['e_buff', 1]], drops: [['mega_tonic', 0.3]],
    desc: 'A soldier who followed orders. The Gloam kept the orders and lost the soldier.',
  }),
  E('pg_ar_choir', 'Echo of the Blind Choir', 93, { type: 'angel', color: '#d8d0f0', accent: '#8070c0', eye: '#ffffff', size: 2, seed: 87 }, {
    ...BOSS, stats: { hp: 6, mag: 1.3, exp: 3, gold: 3, cp: 2 }, weak: ['dark', 'blunt'], resist: { light: -1 }, poise: 5,
    ai: 'pg_ar_chorus', skills: [['e_holyall', 2], ['e_silence', 1]], drops: [['x_ether', 0.5]],
    desc: 'A Remnant\'s hymn, sung back by the dark. Every note correct. None of them meant.',
  }),
  E('pg_ar_mire', 'Echo of the Mire Mother', 93, { type: 'plant', color: '#4a6a3a', accent: '#a0c060', eye: '#ffe060', size: 2, seed: 88 }, {
    ...BOSS, stats: { hp: 6, mag: 1.25, exp: 3, gold: 3, cp: 2 }, weak: ['fire', 'wind'], resist: { ice: 0.5 }, poise: 5,
    ai: 'pg_ar_chorus', skills: [['e_drain', 2], ['e_poison', 1]], drops: [['elixir', 0.5]],
    desc: 'The swamp\'s mother, remembered as she was at the end: sick, and still feeding everyone.',
  }),
  E('pg_ar_storm', 'Echo of the Storm Herald', 93, { type: 'bird', color: '#4a5a8a', accent: '#ffe060', eye: '#ffffff', size: 2, seed: 89 }, {
    ...BOSS, stats: { hp: 6, mag: 1.25, spd: 1.15, exp: 3, gold: 3, cp: 2 }, weak: ['pierce', 'ice'], resist: { bolt: -1 }, poise: 5,
    ai: 'pg_ar_chorus', skills: [['e_thunder', 2], ['e_gust', 1]], drops: [['x_ether', 0.5]],
    desc: 'Lightning remembers where it struck. It would like to strike there again.',
  }),
  E('pg_ar_noonking', 'The Noon King, Remembered', 96, { type: 'angel', color: '#fff0b0', accent: '#ffb030', eye: '#ffffff', size: 3.5, seed: 90 }, {
    ...BOSS, stats: { hp: 22, mag: 1.4, res: 1.3, exp: 6, gold: 6, cp: 4 }, weak: ['dark', 'ice'], resist: { light: -1, fire: 0.5 }, poise: 9,
    ai: 'pg_ar_noonking', skills: [['e_holyall', 2], ['e_holy', 2]], drops: [['megalixir', 1]],
    desc: 'A frozen noon, wearing a crown. It shone so brightly you could not see the man inside it, which was the point.',
  }),
  ...['wren', 'ilse', 'bram', 'sable'].map((who) => E(`pg_ar_hollow_${who}`, `Hollow ${who[0].toUpperCase()}${who.slice(1)}`, 99, { type: 'humanoid', look: `pg_hollow_${who}`, size: 1.5 }, {
    ...BOSS, stats: { hp: 6, str: who === 'bram' ? 1.2 : 1.15, mag: who === 'sable' || who === 'ilse' ? 1.3 : 1, def: who === 'bram' ? 1.5 : 1.1, exp: 4, gold: 4, cp: 3 },
    weak: { wren: ['ice', 'pierce'], ilse: ['dark', 'slash'], bram: ['bolt', 'wind'], sable: ['light', 'blunt'] }[who],
    resist: { dark: 0.5 }, poise: 6, ai: 'pg_ar_mirror', skills: [['attack', 1]], drops: [['megalixir', 0.5]],
    desc: {
      wren: 'You, as the Gloam would keep you: sixteen, furious, and on the dock with the Dawnstone in your hand.',
      ilse: 'Ilse, as the Gloam would keep her: always tending to others, never once asking for anything.',
      bram: 'Bram, as the Gloam would keep him: frozen in the middle of his knighting trial, forever.',
      sable: 'Sable, as the Gloam would keep her: a nameless girl with someone else\'s face.',
    }[who],
  })),
];

// ---------------------------------------------------------------------------
// Troops
// ---------------------------------------------------------------------------

const T = (enemies, opts = {}) => ({ enemies, ...opts });
const BOSS_T = { boss: true, music: 'boss', canFlee: false };

export const TROOPS = {
  pg_ab1_hounds: T(['pg_umbral_hound', 'pg_umbral_hound']),
  pg_ab1_ooze: T(['pg_murk_ooze', 'pg_forgotten']),
  pg_ab1_moths: T(['pg_gloammoth', 'pg_gloammoth', 'pg_gloammoth']),
  pg_ab1_mix: T(['pg_umbral_hound', 'pg_forgotten', 'pg_gloammoth']),
  pg_ab1_pack: T(['pg_murk_ooze', 'pg_umbral_hound', 'pg_murk_ooze']),

  pg_ab2_dread: T(['pg_dreadhound', 'pg_dreadhound']),
  pg_ab2_weave: T(['pg_nightmare_weave', 'pg_eye_below']),
  pg_ab2_golem: T(['pg_gloam_golem', 'pg_eye_below']),
  pg_ab2_mix: T(['pg_dreadhound', 'pg_nightmare_weave', 'pg_eye_below']),
  pg_ab2_eyes: T(['pg_eye_below', 'pg_eye_below', 'pg_eye_below']),

  pg_ab3_legion: T(['pg_ossuary_legionary', 'pg_ossuary_legionary', 'pg_ossuary_legionary']),
  pg_ab3_warden: T(['pg_rubble_warden', 'pg_ashen_lamplighter']),
  pg_ab3_crows: T(['pg_carrion_herald', 'pg_carrion_herald']),
  pg_ab3_mix: T(['pg_ossuary_legionary', 'pg_ashen_lamplighter', 'pg_carrion_herald']),
  pg_ab3_lamps: T(['pg_ashen_lamplighter', 'pg_ashen_lamplighter']),

  pg_ab4_saints: T(['pg_faceless_saint', 'pg_bannerless']),
  pg_ab4_drake: T(['pg_cinder_drake', 'pg_archive_creeper']),
  pg_ab4_knights: T(['pg_bannerless', 'pg_bannerless']),
  pg_ab4_creepers: T(['pg_archive_creeper', 'pg_archive_creeper', 'pg_faceless_saint']),
  pg_ab4_mix: T(['pg_cinder_drake', 'pg_faceless_saint']),

  pg_ab5_wolves: T(['pg_rimewolf', 'pg_rimewolf', 'pg_rimewolf']),
  pg_ab5_lights: T(['pg_hoarlight', 'pg_hoarlight']),
  pg_ab5_sentinel: T(['pg_glacier_sentinel', 'pg_hoarlight']),
  pg_ab5_serpent: T(['pg_snowmelt_serpent', 'pg_rimewolf']),
  pg_ab5_mix: T(['pg_rimewolf', 'pg_snowmelt_serpent', 'pg_hoarlight']),

  pg_ab6_vigil: T(['pg_icebound_vigil', 'pg_icebound_vigil']),
  pg_ab6_eye: T(['pg_longwinter_eye', 'pg_thing_in_ice']),
  pg_ab6_wing: T(['pg_hoarwing', 'pg_longwinter_eye']),
  pg_ab6_thing: T(['pg_thing_in_ice', 'pg_icebound_vigil']),
  pg_ab6_mix: T(['pg_hoarwing', 'pg_icebound_vigil', 'pg_longwinter_eye']),

  pg_ab7_unfinished: T(['pg_unfinished', 'pg_unfinished']),
  pg_ab7_seraph: T(['pg_noonless_seraph', 'pg_sketch_beast']),
  pg_ab7_ooze: T(['pg_primordial_ooze', 'pg_unfinished']),
  pg_ab7_beasts: T(['pg_sketch_beast', 'pg_sketch_beast']),
  pg_ab7_mix: T(['pg_noonless_seraph', 'pg_unfinished', 'pg_primordial_ooze']),

  pg_ab8_hounds: T(['pg_firstborn_hound', 'pg_firstborn_hound']),
  pg_ab8_knight: T(['pg_edge_knight', 'pg_unblinking']),
  pg_ab8_tree: T(['pg_first_tree', 'pg_firstborn_hound']),
  pg_ab8_eyes: T(['pg_unblinking', 'pg_unblinking']),
  pg_ab8_mix: T(['pg_edge_knight', 'pg_first_tree', 'pg_unblinking']),

  pg_ab_mote: T(['pg_wishing_mote']),
  pg_ab_motes: T(['pg_wishing_mote', 'pg_wishing_mote']),
  pg_ab_mimic: T(['pg_hoarder_mimic']),

  pg_boss_unremembered: T(['pg_unremembered'], { ...BOSS_T, bg: 'ruin' }),
  pg_boss_rime: T(['pg_rime_sovereign'], { ...BOSS_T, bg: 'snow' }),
  pg_boss_first_dark: T(['pg_first_dark'], { ...BOSS_T, music: 'finalboss', bg: 'gloam' }),
  pg_boss_lysa: T(['pg_lysa_echo'], { ...BOSS_T, music: 'evernoon', bg: 'town', mood: 'night' }),

  pg_arena_1: T(['pg_ar_pup', 'pg_ar_hound', 'pg_ar_pup'], { ...BOSS_T, bg: 'beach_night' }),
  pg_arena_2: T(['pg_ar_brinefang'], { ...BOSS_T, bg: 'deck' }),
  pg_arena_3: T(['pg_ar_bandit', 'pg_ar_tam', 'pg_ar_bandit'], { ...BOSS_T, bg: 'road' }),
  pg_arena_4: T(['pg_ar_beast', 'pg_ar_mercy'], { ...BOSS_T, bg: 'undercroft' }),
  pg_arena_5: T(['pg_ar_scorpion', 'pg_ar_wyrm', 'pg_ar_scorpion'], { ...BOSS_T, bg: 'desert' }),
  pg_arena_6: T(['pg_ar_penitent'], { ...BOSS_T, bg: 'ruin' }),
  pg_arena_7: T(['pg_ar_dawnguard', 'pg_ar_garrick', 'pg_ar_dawnguard'], { ...BOSS_T, bg: 'lantern' }),
  pg_arena_8: T(['pg_ar_choir', 'pg_ar_mire', 'pg_ar_storm'], { ...BOSS_T, bg: 'temple' }),
  pg_arena_9: T(['pg_ar_noonking'], { ...BOSS_T, music: 'finalboss', bg: 'evernoon' }),
  pg_arena_10: T(['pg_ar_hollow_bram', 'pg_ar_hollow_wren', 'pg_ar_hollow_sable', 'pg_ar_hollow_ilse'], { ...BOSS_T, music: 'finalboss', bg: 'gloam' }),
};

// ---------------------------------------------------------------------------
// Boss scripts
// ---------------------------------------------------------------------------

/** Queue a telegraphed move: say what is coming, spend this turn gathering. */
function windUp(c, text, move, targets, tellSkill = 'pg_gather') {
  c.m.pending = { move, targets };
  c.say(text);
  return c.use(tellSkill);
}

/** Release a queued move, if any. */
function release(c) {
  const p = c.m.pending;
  if (!p) return null;
  c.m.pending = null;
  const targets = p.targets?.filter((t) => t.alive);
  return c.use(p.move, targets?.length ? targets : undefined);
}

/** Swap weaknesses/resistances mid-fight (keeps the revealed list honest). */
function reshape(c, weak, resist) {
  const self = c.self;
  self.weak = new Set(weak);
  self.resist = { ...resist };
  for (const e of [...self.revealed]) if (!self.weak.has(e)) self.revealed.delete(e);
}

const randomFoe = (c) => c.partyAlive[Math.floor(c.rnd() * c.partyAlive.length)];
const sturdiest = (c) => [...c.partyAlive].sort((a, b) => b.hp - a.hp)[0];
const weakest = (c) => [...c.partyAlive].sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];

const KNIGHT_STANCES = {
  iron: { weak: ['bolt', 'light'], resist: { slash: 0.4, pierce: 0.4, blunt: 0.4 }, text: 'The Knight sets its shield. (Iron Stance: steel glances off — lightning and light will not.)' },
  fury: { weak: ['slash', 'pierce', 'blunt'], resist: { bolt: 0.5, light: 0.5, fire: 0.5, ice: 0.5 }, text: 'The Knight throws its shield away and grips the greatsword in both hands. (Fury Stance: open to steel, shrugging off spells.)' },
};

// The First Dark tries on the shapes it has learned from you.
const DARK_FORMS = [
  { id: 'wolf', text: 'The First Dark pulls itself into the shape of a wolf — too many legs, too many teeth. (Fire and steel could find its edges.)', weak: ['fire', 'slash'], resist: { dark: -1 }, moves: [['e_rampage', 3], ['e_bite', 2], ['pg_every_edge', 1]] },
  { id: 'winter', text: 'The First Dark becomes a winter: long, white and silent. (Fire and lightning could crack it.)', weak: ['fire', 'bolt'], resist: { ice: -1, dark: -1 }, moves: [['e_icebreath', 3], ['e_frost', 2], ['pg_lightless', 1]] },
  { id: 'sun', text: 'The First Dark wears the shape of a sun. It is the wrong colour. (Light feeds it now — shadow and ice will cut.)', weak: ['dark', 'ice'], resist: { light: -1, fire: 0.5 }, moves: [['pg_false_dawn', 3], ['e_holy', 2]] },
  { id: 'lantern', text: 'The First Dark folds into the shape of a Lantern and sings the Dawnsong backwards. (Wind and blunt force could topple it.)', weak: ['wind', 'blunt'], resist: { dark: -1, light: 0.5 }, moves: [['e_vesper', 2], ['e_lament', 2], ['e_drain', 1]] },
];

export const BOSS_AI = {
  pg_unremembered(c) {
    const m = c.m;
    if (!m.stance) { m.stance = 'iron'; m.since = c.turn; reshape(c, KNIGHT_STANCES.iron.weak, KNIGHT_STANCES.iron.resist); }
    const queued = release(c);
    if (queued) return queued;
    if (c.hpPct < 0.5 && c.once('rally')) { c.say('"...Form up. FORM UP." Bones rise from the rubble to answer.'); return c.use('e_summon'); }
    if (c.turn - m.since >= 3) {
      m.stance = m.stance === 'iron' ? 'fury' : 'iron';
      m.since = c.turn;
      const st = KNIGHT_STANCES[m.stance];
      reshape(c, st.weak, st.resist);
      c.say(st.text);
      return c.use(m.stance === 'iron' ? 'e_shell' : 'e_buff');
    }
    if (c.turn % 5 === 4) return windUp(c, 'The Knight lifts its greatsword high. Behind it, a thousand faint soldiers lift theirs. (Guard!)', 'pg_oathbreaker');
    return m.stance === 'iron' ? c.pick([['e_slash', 3], ['e_stun', 1]]) : c.pick([['e_cleave', 2], ['e_rampage', 2], ['e_slash', 1]]);
  },

  pg_rime_sovereign(c) {
    const queued = release(c);
    if (queued) return queued;
    if (c.hpPct < 0.75 && c.once('court1')) { c.say('The Sovereign calls her court. A hoarlight drifts down from the ceiling.'); return c.use('e_summon'); }
    if (c.hpPct < 0.5 && c.once('thaw')) {
      reshape(c, ['wind', 'fire'], { ice: -1, bolt: 0.5 });
      c.say('The Sovereign sheds her crown of ice! Underneath, she is all wind and old snow. (Lightning no longer bites — try wind.)');
      return c.use('e_shell');
    }
    if (c.hpPct < 0.3 && c.once('court2')) { c.say('"MY COURT. ATTEND ME."'); return c.use('e_summon'); }
    if (c.turn % 4 === 3) return windUp(c, 'The air goes still. Frost crawls up your boots, your knees, your breath... (Absolute Zero is coming.)', 'pg_absolute_zero');
    return c.pick([['e_icebreath', 2], ['e_bite', 2], ['e_frost', 2], ['e_shell', c.hpPct < 0.5 ? 0.5 : 0]]);
  },

  pg_first_dark(c) {
    const m = c.m;
    const queued = release(c);
    if (queued) {
      if (queued.id === 'pg_dark_before') c.say('"...hush." The Dark Before.');
      return queued;
    }
    if (c.hpPct < 0.7 && c.once('shapes')) {
      m.form = 0;
      m.formTurn = c.turn;
      const f = DARK_FORMS[0];
      reshape(c, f.weak, f.resist);
      c.say('"...you have so many shapes. let me try one on."');
      c.say(f.text);
      return c.use('pg_unform');
    }
    if (c.hpPct < 0.4 && c.once('unmaking')) { c.say('"...i will unmake you gently. the way a tide unmakes a footprint." Pieces of before break away and drift toward you.'); return c.use('e_summon'); }
    if (c.hpPct < 0.2 && c.allies.length < 2 && c.once('shards2')) { c.say('More of it breaks loose. It is coming apart to reach you.'); return c.use('e_summon'); }
    if (c.hpPct < 0.12 && c.once('alone')) {
      c.say('"...it was so quiet, before you. i was never lonely. i did not even have the word."');
      return windUp(c, 'Everything goes white. The First Dark draws in all the light there is. (Guard. Shell. Now.)', 'pg_dark_before');
    }
    if (m.form !== undefined && c.turn - m.formTurn >= (c.hpPct < 0.4 ? 2 : 3)) {
      m.form = (m.form + 1) % DARK_FORMS.length;
      m.formTurn = c.turn;
      const f = DARK_FORMS[m.form];
      reshape(c, f.weak, f.resist);
      c.say(f.text);
      return c.pick(f.moves);
    }
    const cycle = c.hpPct < 0.12 ? 3 : 5;
    if (c.turn % cycle === 0) return windUp(c, 'The First Dark breathes in. The light in the room leans toward it... (Brace — the Dark Before is coming.)', 'pg_dark_before');
    if (c.hpPct < 0.4 && c.turn % 4 === 2) {
      const t = randomFoe(c);
      return windUp(c, `The First Dark turns its whole attention on ${t.name}. It is trying to forget them. (A Ribbon or Purify will save them.)`, 'pg_unname', [t]);
    }
    if (m.form === undefined) return c.pick([['pg_lightless', 3], ['pg_unform', 2], ['e_dark', 2], ['e_mpdrain', 1], ['pg_every_edge', 1]]);
    return c.pick([...DARK_FORMS[m.form].moves, ['pg_unform', 1]]);
  },

  pg_lysa(c) {
    const m = c.m;
    const queued = release(c);
    if (queued) { c.say('"...a HUNDRED! Ready or not, here I come!"'); return queued; }
    if (m.counting) {
      m.counting++;
      const words = ['"Twenty... twenty-one... no peeking!"', '"Fifty-five... fifty-six... I can hear you breathing!"', '"Ninety-eight... ninety-nine..."'];
      c.say(words[m.counting - 2]);
      if (m.counting >= 4) { m.counting = 0; m.pending = { move: 'pg_ready_or_not' }; }
      return c.use('pg_count');
    }
    if (c.hpPct < 0.15) {
      if (c.once('tired')) c.say('"I\'m tired. Is the game over? ...Did I win?"');
      return c.pick([['pg_hopscotch', 2], ['pg_tag', 1], ['pg_hide', 1]]);
    }
    if (c.hpPct < 0.6 && c.once('count')) {
      m.counting = 1;
      c.say('Lysa covers her eyes. "One... two... three..." (She is counting to a hundred. Get ready.)');
      return c.use('pg_count');
    }
    if (c.hpPct < 0.35) {
      if (c.once('dontgo')) { c.say('"Don\'t go home yet. Please? Everyone always goes home."'); return c.use('pg_forty_years'); }
      if (c.turn % 4 === 0) { const t = sturdiest(c); c.say(`"${t.name}! Stay and play with me!"`); return c.use('pg_stay', [t]); }
    }
    if (c.hpPct < 0.8 && c.once('lanterns')) { c.say('"Lanterns! Come play!" Paper lanterns from the festival drift down around her.'); return c.use('e_summon'); }
    if (c.turn % 4 === 0) { c.say('Lysa giggles and ducks behind a lantern. (Hidden: blades will miss. Spells will not.)'); return c.use('pg_hide'); }
    return c.pick([['pg_tag', 3], ['pg_ring_around', 2], ['pg_hopscotch', 2]]);
  },

  // ----------------------------------------------------------- Colosseum
  pg_ar_hound(c) {
    if (c.hpPct < 0.6 && c.once('pups')) { c.say('The Hound howls. The shadows of its shadows answer.'); return c.use('e_summon'); }
    if (c.turn % 4 === 0) return c.use('e_darkwave');
    return c.pick([['e_bite', 3], ['e_claw', 2], ['e_drain', 1]]);
  },
  pg_ar_brinefang(c) {
    const queued = release(c);
    if (queued) return queued;
    if (c.turn % 4 === 3) return windUp(c, 'Brinefang drinks the whole remembered sea... (A wave is coming.)', 'pg_tidal_echo');
    return c.pick([['e_bite', 3], ['e_constrict', 2], ['e_spit', 2]]);
  },
  pg_ar_tam(c) {
    const queued = release(c);
    if (queued) { c.say('"HAYMAKER!"'); return queued; }
    if (c.hpPct < 0.5 && c.once('rage')) { c.say('"All forty of you — GET THEM!"'); return c.use('e_buff'); }
    if (c.turn % 4 === 2) { const t = sturdiest(c); return windUp(c, `Red Tam points at ${t.name}. "You. Yes, you. You're getting the Legendary Haymaker." He cracks his knuckles. Slowly.`, 'pg_haymaker', [t]); }
    if (c.turn % 3 === 0) return c.use('e_cleave');
    return c.pick([['attack', 3], ['e_rampage', 1], ['e_stun', 1]]);
  },
  pg_ar_mercy(c) {
    const queued = release(c);
    if (queued) return queued;
    const beast = c.allies.find((a) => a.def.id === 'pg_ar_beast');
    if (!beast && c.turn > 1 && c.once(`beast${Math.floor(c.turn / 4)}`)) { c.say('"Rise, child. Your suffering is not over yet."'); return c.use('e_summon'); }
    if (beast && beast.hp < beast.maxHp * 0.5 && c.rnd() < 0.5) return c.use('e_heal', [beast]);
    if (c.turn % 5 === 4) return windUp(c, 'Sister Mercy folds her hands. "Hush now..." The whole arena goes quiet. (A hymn is coming.)', 'pg_hush');
    return c.pick([['e_lament', 2], ['e_dark', 3], ['e_silence', 1], ['e_sleep', c.hpPct < 0.4 ? 1 : 0]]);
  },
  pg_ar_wyrm(c) {
    const queued = release(c);
    if (queued) return queued;
    if (c.turn % 4 === 3) return windUp(c, 'The Glasswyrm dives into the sand. The arena floor begins to hum. (Brace yourselves.)', 'pg_glass_storm', null, 'pg_burrow');
    return c.pick([['e_bite', 3], ['e_sting', 2], ['e_quake', 1]]);
  },
  pg_ar_penitent(c) {
    const queued = release(c);
    if (queued) return queued;
    if (c.hpPct < 0.5 && c.once('crack')) { c.say('The mask cracks. Behind it there is no one at all.'); return c.use('e_howl'); }
    if (c.turn % 4 === 3) return windUp(c, 'The Penitent kneels and lowers its head, as if in prayer. (It is not praying.)', 'pg_penance', null, 'pg_kneel');
    return c.pick([['e_slash', 3], ['e_drain', 1], ['e_stun', 1]]);
  },
  pg_ar_garrick(c) {
    const queued = release(c);
    if (queued) return queued;
    if (c.hpPct < 0.5 && c.once('rally')) { c.say('"Dawnguard! Hold the line!"'); return c.use('e_buff'); }
    if (c.turn % 4 === 2) { const t = weakest(c); return windUp(c, `Garrick levels his sword at ${t.name}. "You first." (Protect them, or heal them now.)`, 'pg_execution', [t], 'pg_mark'); }
    return c.pick([['e_slash', 3], ['e_cleave', 2], ['e_stun', 1]]);
  },
  pg_ar_chorus(c) {
    const queued = release(c);
    if (queued) return queued;
    const hurt = [c.self, ...c.allies].some((a) => a.hp < a.maxHp * 0.4);
    if (hurt && c.turn - (c.m.healed || -9) >= 3) { c.m.healed = c.turn; return c.use('e_healall'); }
    // One voice at a time: never wind up while another echo is already winding up.
    if (c.turn % 5 === 4 && !c.allies.some((a) => a.hasStatus('windup'))) return windUp(c, `${c.self.name} hums the first note of the Vespersong. (Get ready.)`, 'e_vesper');
    return null;
  },
  pg_ar_noonking(c) {
    const queued = release(c);
    if (queued) return queued;
    if (c.hpPct < 0.5 && c.once('still')) { c.say('"Stay. Stay exactly as you are."'); return c.use('e_stillness'); }
    if (c.turn % 4 === 3) return windUp(c, 'The Noon King raises one hand. It becomes very, very bright. (High Noon is coming.)', 'e_noon');
    return c.pick([['e_holyall', 2], ['e_holy', 2], ['e_vesper', 1]]);
  },
  pg_ar_mirror(c) {
    const who = c.self.def.id.replace('pg_ar_hollow_', '');
    const queued = release(c);
    if (queued) return queued;
    const lines = {
      wren: '"Why did you leave the island? Why did you give him the stone? Why, why, why—"',
      ilse: '"Don\'t worry about me. Nobody ever does. That\'s fine. That\'s FINE."',
      bram: '"I can\'t move. I can\'t move. Sir Aldous, I can\'t—"',
      sable: '"Which name is mine? Tell me which name is mine."',
    };
    if (c.once('line')) c.say(lines[who]);
    if (who === 'ilse') {
      const hurt = [c.self, ...c.allies].filter((a) => a.hp < a.maxHp * 0.6).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
      if (hurt.length >= 2) return c.use('e_healall');
      if (hurt.length) return c.use('e_heal', [hurt[0]]);
      return c.pick([['e_holy', 2], ['e_silence', 1]]);
    }
    if (who === 'bram') {
      if (c.turn % 4 === 1) return c.use('pg_hollow_wall');
      return c.pick([['e_crush', 2], ['e_stun', 2], ['e_shell', 1]]);
    }
    if (who === 'sable') return c.pick([['e_darkwave', 3], ['e_doom', 1], ['e_sleep', 1], ['e_drain', 1]]);
    if (c.turn % 4 === 3) { const t = randomFoe(c); return windUp(c, `Hollow Wren raises her sword at ${t.name}, exactly the way you would.`, 'pg_hollow_blade', [t], 'pg_mark'); }
    return c.pick([['e_cleave', 2], ['e_slash', 3]]);
  },
};
