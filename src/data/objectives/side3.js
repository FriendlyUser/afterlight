// Side-quest marker targets (blue), part 3 of 4 — see side.js for the format.
// Act II to Kiteholm: ch6 (Afterlight), ch7 (the Mender of Ash), ch8 (Children of the
// Wreck), ch9 and ch9_side (Corvin's Roost's errands).
//
// Where a quest's parts leave no single "all done" flag, the giver is shown `after` the
// part most likely to be finished last, so the marker is always there at the end. Where
// progress is only an item in the bag (Choir silk, Scrap Gears), every spot is listed.

/** @type {import('../../types/data').SideQuestEntry[]} */
export default [
  // ------------------------------------------------------------------ ch6: Keelhaven bounties
  // Glassback's trigger in the glass quarry (north-west), then Warden Hale for the bounty.
  { quest: 'c6_bounty_glass', at: [
    { map: 'c6_shattered_sea', x: 6, y: 6, unless: 'c6_glassback' },
    { map: 'c6_keel_hall', npc: 'hale', after: 'c6_glassback' },
  ] },
  // The Lidless's perch on the gloam shard north of the Last Hearth, then Hale.
  { quest: 'c6_bounty_lidless', at: [
    { map: 'c6_shattered_sea', x: 46, y: 5, unless: 'c6_lidless' },
    { map: 'c6_keel_hall', npc: 'hale', after: 'c6_lidless' },
  ] },

  // ------------------------------------------------------------------ ch6: Pell's Kite
  // The Psalm's banner (inspect: gives c6_choir_silk), then Pell. Holding the silk sets
  // no flag, so both stay marked until the kite flies.
  { quest: 'c6_pell_kite', at: [
    { map: 'c6_shattered_sea', x: 17, y: 38 },
    { map: 'c6_keelhaven', npc: 'pell' },
  ] },

  // ------------------------------------------------------------------ ch6: the Lost Wall
  // Four letters in chests (two in the Drift, two in the Shattered Sea). Each goes to Orla
  // once found — except Bett's letter to Aldo, which goes to Brother Cinder at his pulpit.
  // Orla writes her own letter on the next talk after all four are delivered; if Aldo's
  // was the last, that's the `after: 'c6_letter_aldo_done'` entry.
  { quest: 'c6_letters', at: [
    { map: 'c6_drift', x: 38, y: 13, unless: 'chest:c6_drift:c6_dr2' },
    { map: 'c6_drift', x: 31, y: 27, unless: 'chest:c6_drift:c6_dr4' },
    { map: 'c6_shattered_sea', x: 22, y: 6, unless: 'chest:c6_shattered_sea:c6_ss1' },
    { map: 'c6_shattered_sea', x: 31, y: 35, unless: 'chest:c6_shattered_sea:c6_ss3' },
    { map: 'c6_keelhaven', npc: 'orla', after: 'chest:c6_drift:c6_dr2', unless: 'c6_letter_jory_done' },
    { map: 'c6_keelhaven', npc: 'orla', after: 'chest:c6_shattered_sea:c6_ss1', unless: 'c6_letter_sun_done' },
    { map: 'c6_keelhaven', npc: 'orla', after: 'chest:c6_shattered_sea:c6_ss3', unless: 'c6_letter_teo_done' },
    { map: 'c6_keelhaven', npc: 'cinder', after: 'chest:c6_drift:c6_dr4', unless: 'c6_letter_aldo_done' },
    { map: 'c6_keelhaven', npc: 'orla', after: 'c6_letter_aldo_done' },
  ] },

  // ------------------------------------------------------------------ ch7: the Ember Ward
  // Hollis in the garden has the doll (c7_doll_found when he hands it over); then Bette.
  { quest: 'c7_q_doll', at: [
    { map: 'ruined_aurenne', npc: 'hollis', unless: 'c7_doll_found' },
    { map: 'c7_ember_ward', npc: 'bette', after: 'c7_doll_found' },
  ] },
  { quest: 'c7_q_aurel', at: { map: 'c7_ember_ward', npc: 'aurel' } },

  // ------------------------------------------------------------------ ch7: Aurenne errands
  // Picked up from the Ossuary alcove; Sorrel at the gate takes them.
  { quest: 'c7_q_tags', at: { map: 'ruined_aurenne', npc: 'sorrel' } },
  // The dawnmoss is the lab chest in the Undercroft; then back to Hollis.
  { quest: 'c7_q_seeds', at: [
    { map: 'ch7_drowned_undercroft', x: 33, y: 19, unless: 'chest:ch7_drowned_undercroft:lab2' },
    { map: 'ruined_aurenne', npc: 'hollis', after: 'chest:ch7_drowned_undercroft:lab2' },
  ] },
  // The clapper is a chest in the Cistern of Bells (floor 2); then Osric.
  { quest: 'c7_q_bell', at: [
    { map: 'ch7_drowned_choir', x: 9, y: 13, unless: 'chest:ch7_drowned_choir:clapper' },
    { map: 'ruined_aurenne', npc: 'osric', after: 'chest:ch7_drowned_choir:clapper' },
  ] },
  // Sorrel, Hollis and the foot of the Grand Lantern (inspect); Petra once they're all
  // delivered (no single flag: shown after the Lantern's, the out-of-the-way one).
  { quest: 'c7_q_letters', at: [
    { map: 'ruined_aurenne', npc: 'sorrel', unless: 'c7_letter_sorrel' },
    { map: 'ruined_aurenne', npc: 'hollis', unless: 'c7_letter_hollis' },
    { map: 'ruined_aurenne', x: 23, y: 6, unless: 'c7_letter_lantern' },
    { map: 'ruined_aurenne', npc: 'petra', after: ['c7_letter_sorrel', 'c7_letter_hollis', 'c7_letter_lantern'] },
  ] },
  // Old Clapper's lair trigger in the Reliquary (north-east of floor 1), then Sorrel.
  { quest: 'c7_q_bounty', step: 'Something that tolls like a bell', at: { map: 'ch7_drowned_undercroft', x: 39, y: 6 } },
  { quest: 'c7_q_bounty', step: 'Old Clapper is slain', at: { map: 'ruined_aurenne', npc: 'sorrel' } },

  // ------------------------------------------------------------------ ch8: Kiteholm
  // The five hiders (all on Kiteholm), then Tansy in the Kite Nest, who keeps count.
  { quest: 'c8_q_hide', at: [
    { map: 'kiteholm', npc: 'burr', unless: 'c8_found_burr' },
    { map: 'kiteholm', npc: 'fig', unless: 'c8_found_fig' },
    { map: 'kiteholm', npc: 'nettle', unless: 'c8_found_nettle' },
    { map: 'kiteholm', npc: 'pim', unless: 'c8_found_pim' },
    { map: 'kiteholm', npc: 'sprocket', unless: 'c8_found_sprocket' },
    { map: 'c8_kite_nest', npc: 'tansy' },
  ] },
  { quest: 'c8_q_debt', at: { map: 'c8_baron_hall', npc: 'dask' } },
  // Gears are only counted in the bag: the two gear chests in the Vigil (2 + 1), and
  // Quill. Scrap golems drop them too.
  { quest: 'c8_q_quill', at: [
    { map: 'c8_vigil_wreck', x: 12, y: 12, unless: 'chest:c8_vigil_wreck:b' },
    { map: 'c8_vigil_wreck', x: 26, y: 27, unless: 'chest:c8_vigil_wreck:h' },
    { map: 'kiteholm', npc: 'quill' },
  ] },
  // Found the kite (in the Underhang): Wick, back in the Kite Nest once the Kites are saved.
  { quest: 'c8_q_kite', step: 'A blue kite with a painted grin', at: { map: 'c8_kite_nest', npc: 'wick' } },
  // Wick asked first: the shrike nest on the Underhang's western ledge (inspect).
  { quest: 'c8_q_kite', step: 'The gale-shrikes of the Underhang', at: { map: 'c8_underhang', x: 8, y: 21 } },
  { quest: 'c8_q_arena', at: { map: 'c8_scrap_arena', npc: 'ratchet' } },

  // ------------------------------------------------------------------ ch9: the Cinderdeep
  { quest: 'c9_q_miners', at: [
    { map: 'c9_cinderdeep', npc: 'miner_dagny', unless: 'c9_miner_dagny' },
    { map: 'c9_cinderdeep', npc: 'miner_hobb', unless: 'c9_miner_hobb' },
    { map: 'c9_cinderdeep', npc: 'miner_ines', unless: 'c9_miner_ines' },
    { map: 'c9_ledger_house', npc: 'odessa', after: 'c9_q_miners_saved' },
  ] },

  // ------------------------------------------------------------------ ch9: Corvin's Roost
  { quest: 'c9_q_ferro', at: { map: 'c9_last_call', npc: 'ferro' } },
  // The carriage clock on the Benediction captain's shelf (inspect), then Ox.
  { quest: 'c9_q_clock', at: [
    { map: 'c9_benediction_cabin', x: 6, y: 2, unless: 'c9_got_clock' },
    { map: 'corvins_roost', npc: 'ox', after: 'c9_got_clock' },
  ] },
  // Pay Bailiff Tamm; then Lonnie, out of the stocks (lonnie_free).
  { quest: 'c9_q_lonnie', at: [
    { map: 'corvins_roost', npc: 'tamm', unless: 'c9_lonnie_free' },
    { map: 'corvins_roost', npc: 'lonnie_free', after: 'c9_lonnie_free' },
  ] },
  // The three vantage points (inspects), then Wick — shown after the Cinderdeep's, the
  // last of the three the story opens.
  { quest: 'c9_q_charts', at: [
    { map: 'c9_boneyard', x: 12, y: 3, unless: 'c9_chart_boneyard' },
    { map: 'c9_benediction', x: 5, y: 12, unless: 'c9_chart_benediction' },
    { map: 'c9_cinderdeep', x: 44, y: 19, unless: 'c9_chart_cinderdeep' },
    { map: 'corvins_roost', npc: 'wick', after: ['c9_chart_boneyard', 'c9_chart_benediction', 'c9_chart_cinderdeep'] },
  ] },
  // Set and finished in the same talk with Fen or Dory.
  { quest: 'c9_q_kids', at: { map: 'corvins_roost', npc: 'fen' } },
];
