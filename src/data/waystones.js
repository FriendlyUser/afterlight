// Hearthstones on routes and in dungeons that become fast-travel points once the party
// has been near them (see world/Waystones.js). Each is listed under the world-map
// destination it hangs off (map id → node id), and that destination's act and unlock
// rules apply to it. Order here is the order the world map lists them.
//
// Left out on purpose: Lanternfall before the Sundering (only the story brings you home),
// the Last Sunset maps, the Noon Spire and Evernoon (one-way chapters), and the
// generated Abyss floors (the Abyss Gate has its own descent).
export const WAYSTONES = {
  // ---- Act I
  c2_wold_heart: 'whisperwold',
  c2_quarry: 'thistledown',
  c3_uc_ossuary: 'aurenne',
  c3_uc_lab: 'aurenne',
  sunscar_road: 'saltglass',
  c4a_dunes: 'saltglass',
  c4a_glass_nest: 'saltglass',
  c4a_greyspine_pass: 'frosthollow',
  c4a_frost_caves: 'frosthollow',
  mirefen_road: 'mirefen',
  c4b_drownmere: 'mirefen',
  c4b_heartwood: 'thornwood',
  side_moor: 'side_lodge',
  side_obs_galleries: 'side_observatory',
  side_ash_keep: 'side_ashwatch',
  side_ash_tower: 'side_ashwatch',
  // ---- Acts II and III
  c8_vigil_wreck: 'c8_kiteholm',
  c11_rift: 'c11_thornwood',
  side_ashen_reach: 'side_ruin_lodge',
  side_bell_nave: 'side_bell',
  side_garden_maze: 'side_garden',
};
