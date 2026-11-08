// Side-quest marker targets (blue), part 2 of 4 — see side.js for the format.
//
// "Find several things, then go back": the quest-giver shows once every part's flag is
// set (after: [...]). The lilies are any three of four, which no flag list can say, so
// Agathe is listed with no flag: blue markers only show on the map you're on, so she's
// marked when you're back in Frosthollow and the lilies while you're out on the pass.

/** @type {import('../../types/data').SideQuestEntry[]} */
export default [
  // ------------------------------------------------------------------ Chapter 4a — the Sunscar & Saltglass (ch4a.js)
  // Each singing pillar gives a shard when struck (c4a_res_a/b/c); the third also opens
  // the Queen's door, which is the only flag set once all three are in hand.
  { quest: 'c4a_lift_glass', at: [
    { map: 'c4a_glass_caverns', x: 12, y: 4, unless: 'c4a_res_a' },
    { map: 'c4a_glass_caverns', x: 10, y: 32, unless: 'c4a_res_b' },
    { map: 'c4a_glass_caverns', x: 43, y: 4, unless: 'c4a_res_c' },
    { map: 'c4a_halcyon', x: 18, y: 9, after: 'blocker:c4a_glass_caverns:queen_door' }, // the lift-glass housing
  ] },
  // Talking to Sarn (or his sentry) starts the fight; Idris pays.
  { quest: 'c4a_sarn', at: [
    { map: 'c4a_dunes', npc: 'sarn', unless: 'c4a_sarn_dead' },
    { map: 'c4a_saltglass', npc: 'idris', after: 'c4a_sarn_dead' },
  ] },
  // The Queen's door opens once all three singing pillars ring; she waits in the nest
  // (the 'queen' trigger); Oyelaran pays.
  { quest: 'c4a_queen', at: [
    { map: 'c4a_glass_caverns', x: 12, y: 4, unless: 'c4a_res_a' },
    { map: 'c4a_glass_caverns', x: 10, y: 32, unless: 'c4a_res_b' },
    { map: 'c4a_glass_caverns', x: 43, y: 4, unless: 'c4a_res_c' },
    { map: 'c4a_glass_nest', x: 17, y: 13, after: 'blocker:c4a_glass_caverns:queen_door', unless: 'c4a_queen_dead' },
    { map: 'c4a_saltglass', npc: 'oyelaran', after: 'c4a_queen_dead' },
  ] },
  { quest: 'c4a_debt', at: { map: 'c4a_sg_inn', npc: 'ines' } },
  // The humming wall Jorah is sealed behind; once he's free, entering Asha's house plays the reunion.
  { quest: 'c4a_jorah', at: [
    { map: 'c4a_glass_caverns', x: 34, y: 31, unless: 'c4a_jorah_freed' },
    { map: 'c4a_sg_house', npc: 'asha', after: 'c4a_jorah_freed' },
  ] },

  // ------------------------------------------------------------------ Chapter 4a — the Greyspine (ch4a_mountain.js)
  // Four lilies grow on the pass (three are needed); Agathe takes them (see the note at the top).
  { quest: 'c4a_lilies', at: [
    { map: 'c4a_greyspine_pass', x: 5, y: 44, unless: 'c4a_lily_0' },
    { map: 'c4a_greyspine_pass', x: 37, y: 31, unless: 'c4a_lily_1' },
    { map: 'c4a_greyspine_pass', x: 7, y: 16, unless: 'c4a_lily_2' },
    { map: 'c4a_greyspine_pass', x: 33, y: 6, unless: 'c4a_lily_3' },
    { map: 'c4a_frosthollow', npc: 'agathe' },
  ] },
  // The 'den' trigger on the pass's middle terrace; Ivo pays.
  { quest: 'c4a_whitefang', at: [
    { map: 'c4a_greyspine_pass', x: 34, y: 24, unless: 'c4a_whitefang_dead' },
    { map: 'c4a_frosthollow', npc: 'ivo', after: 'c4a_whitefang_dead' },
  ] },
  // Five hiders (Linnea and Yrsa only turn up once Halvard has been met); Ebba rewards.
  { quest: 'c4a_hide', at: [
    { map: 'c4a_frosthollow', npc: 'tomas', unless: 'c4a_found_tomas' },
    { map: 'c4a_frosthollow', npc: 'lars', unless: 'c4a_found_lars' },
    { map: 'c4a_frosthollow', npc: 'oskar', unless: 'c4a_found_oskar' },
    { map: 'c4a_fh_guest', npc: 'linnea', after: 'c4a_halvard_met', unless: 'c4a_found_linnea' },
    { map: 'c4a_fh_hall', npc: 'yrsa', after: 'c4a_halvard_met', unless: 'c4a_found_yrsa' },
    { map: 'c4a_frosthollow', npc: 'ebba', after: ['c4a_found_tomas', 'c4a_found_lars', 'c4a_found_oskar', 'c4a_found_linnea', 'c4a_found_yrsa'] },
  ] },

  // ------------------------------------------------------------------ Chapter 4b — Mirefen, Skyreach, Verdance
  // The ring in the Drowned Chapel; Widow Pell.
  { quest: 'c4b_q_pell', at: [
    { map: 'c4b_drownmere', x: 13, y: 5, unless: 'c4b_pell_ring' },
    { map: 'c4b_mirefen', npc: 'pell', after: 'c4b_pell_ring' },
  ] },
  // Aram's glider wreck under the isle; Kesi.
  { quest: 'c4b_q_kesi', at: [
    { map: 'c4b_undercradle', x: 14, y: 26, unless: 'c4b_glider' },
    { map: 'c4b_skyreach', npc: 'kesi', after: 'c4b_glider' },
  ] },
  // The three children in the Thornwood; Elder Bracken rewards (see the note at the top).
  { quest: 'c4b_q_saplings', at: [
    { map: 'c4b_thornwood', npc: 'wick', unless: 'c4b_wick' },
    { map: 'c4b_thornwood', npc: 'bryony', unless: 'c4b_bryony' },
    { map: 'c4b_thornwood', npc: 'tamsel', unless: 'c4b_tamsel' },
    { map: 'c4b_verdance', npc: 'bracken', after: ['c4b_wick', 'c4b_bryony', 'c4b_tamsel'] },
  ] },

  // ------------------------------------------------------------------ Chapter 5 — Lanternfall (ch5.js)
  // Sea lavender: Ysolde's garden (flags c5_lavender_picked) or the tide-cave pool (no flag).
  { quest: 'c5_tea', at: [
    { map: 'lf_sunset', x: 14, y: 12, unless: 'c5_lavender_picked' },
    { map: 'c5_tidecaves', x: 19, y: 24, unless: 'c5_lavender_picked' },
    { map: 'c5_nana_house', npc: 'nana', after: 'c5_lavender_picked' },
  ] },

  // ------------------------------------------------------------------ Act I bounties (side.js) — the Hunters' Lodge
  // Hunt: the lair trigger's centre (data/content/side.js, lair()). Slain: Adelind keeps the board.
  { quest: 'side_b_bristleback', step: 'Hunt ', at: { map: 'side_moor', x: 19, y: 6 } },
  { quest: 'side_b_bristleback', step: 'Bristleback is slain', at: { map: 'side_lodge_hall', npc: 'adelind' } },
  { quest: 'side_b_lanternjaw', step: 'Hunt ', at: { map: 'side_moor', x: 12, y: 24 } },
  { quest: 'side_b_lanternjaw', step: 'Lanternjaw is slain', at: { map: 'side_lodge_hall', npc: 'adelind' } },
  { quest: 'side_b_gravelgut', step: 'Hunt ', at: { map: 'side_moor', x: 42, y: 7 } },
  { quest: 'side_b_gravelgut', step: 'Gravelgut is slain', at: { map: 'side_lodge_hall', npc: 'adelind' } },
  { quest: 'side_b_pinch', step: 'Hunt ', at: { map: 'side_obs_shore', x: 31, y: 17 } },
  { quest: 'side_b_pinch', step: 'The Pinch is slain', at: { map: 'side_lodge_hall', npc: 'adelind' } },
  { quest: 'side_b_mange', step: 'Hunt ', at: { map: 'side_ash_bailey', x: 35, y: 18 } },
  { quest: 'side_b_mange', step: 'Mange is slain', at: { map: 'side_lodge_hall', npc: 'adelind' } },
  // The 'bane' trigger at the back of the Hollow.
  { quest: 'side_hollow', at: { map: 'side_bane_hollow', x: 15, y: 12 } },
];
