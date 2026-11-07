// Quest-marker targets (see ./index.js).
// Act II: ch4b (Mirefen, Verdance, the Stormcrown), ch5 (the Last Sunset),
// ch6 (Afterlight), ch7 (the Mender of Ash), ch8 (Children of the Wreck).
export default [
  // ------------------------------------------------------------------ ch4b: Mirefen
  { text: 'Follow the causeway east to Mirefen and find its Keeper, Mother Osk.', at: { map: 'c4b_mirefen' } },
  { text: 'Go to Mother Osk in the Mirefen Lantern, north-east of the village.', at: { map: 'c4b_osk_lantern' } },
  { text: 'In the Drownmere (south jetty): gather Lanternmoss at the Sunken Shrine (west) and a Weepcap Lily in the Root Grotto (east).', at: [
    { map: 'c4b_drownmere', x: 8, y: 14, unless: 'c4b_got_moss' },
    { map: 'c4b_drownmere', x: 47, y: 15, unless: 'c4b_got_lily' },
  ] },
  // The rot-wood blocker (inspect to burn it), then Mawmire's trigger at the black pool.
  { text: 'Burn through the rot-wood north of the shrine island and find the source of the rot in the black pool.', at: [
    { map: 'c4b_drownmere', x: 27, y: 20, unless: 'blocker:c4b_drownmere:rotwall' },
    { map: 'c4b_drownmere', x: 27, y: 9 },
  ] },
  { text: 'Hurry back to Mother Osk in the Mirefen Lantern.', at: { map: 'c4b_osk_lantern' } },
  { text: 'Find Elowen, the oldest Keeper, at the heart of the Thornwood in Verdance.', at: { map: 'c4b_verdance' } },

  // ------------------------------------------------------------------ ch4b: Verdance
  // The three lost children, and Hollowbark's trigger in the glade before the Heartwood.
  { text: 'Enter the Thornwood (north of Rootholm) and find Elowen — and Rootholm\'s three lost children.', at: [
    { map: 'c4b_thornwood', npc: 'wick', unless: 'c4b_wick' },
    { map: 'c4b_thornwood', npc: 'bryony', unless: 'c4b_bryony' },
    { map: 'c4b_thornwood', npc: 'tamsel', unless: 'c4b_tamsel' },
    { map: 'c4b_thornwood', x: 24, y: 8 },
  ] },
  // Can be set after Hollowbark falls (last child found late): then the Heartwood is next.
  { text: 'All three children are on their way home. Push on through the Thornwood to Elowen\'s grove.', at: [
    { map: 'c4b_thornwood', x: 24, y: 8, unless: 'c4b_hollowbark_beaten' },
    { map: 'c4b_heartwood' },
  ] },
  { text: 'Go north into the Heartwood and meet Elowen.', at: { map: 'c4b_heartwood' } },
  { text: 'Morning in the Heartwood. Speak with Elowen before you go.', at: { map: 'c4b_heartwood', npc: 'elowen' } },
  { text: 'Travel to Stormfoot, at the base of the Stormcrown, where the Halcyon waits.', at: { map: 'c4b_stormfoot' } },

  // ------------------------------------------------------------------ ch4b: the Stormcrown
  { text: 'Take three Storm Cores from the lightning-struck crags around Stormfoot', at: [
    { map: 'c4b_stormfoot', x: 7, y: 11, unless: 'c4b_core1' },
    { map: 'c4b_stormfoot', x: 39, y: 10, unless: 'c4b_core2' },
    { map: 'c4b_stormfoot', x: 39, y: 27, unless: 'c4b_core3' },
  ] },
  { text: 'You have three Storm Cores. Bring them to Corvin at the Halcyon.', at: { map: 'c4b_stormfoot', npc: 'corvin_f' } },
  { text: 'Go to Ardent Vasha at the Lantern, on the northern terrace of Skyreach.', at: { map: 'c4b_sky_lantern' } },
  { text: 'Take the Keel Lift (east edge of Skyreach) down into the Undercradle. Charge the three lift-pylons', at: [
    { map: 'c4b_undercradle', x: 6, y: 15, unless: 'c4b_pylon_w' },
    { map: 'c4b_undercradle', x: 44, y: 15, unless: 'c4b_pylon_e' },
    { map: 'c4b_undercradle', x: 10, y: 28, unless: 'c4b_pylon_s' },
  ] },
  { text: 'All three pylons are charged. Take the central bridge down and face the Thunderhead.', at: { map: 'c4b_undercradle', x: 25, y: 37 } },
  { text: 'Return to Ardent Vasha at the Skyreach Lantern.', at: { map: 'c4b_sky_lantern' } },
  { text: 'When you are ready, find Corvin on the Skyreach docks and fly home to Lanternfall.', at: { map: 'c4b_skyreach', npc: 'corvin_d' } },
  // Set on the Halcyon's deck just before the teleport; lf_sunset's onEnter replaces it.
  { text: 'Get home to Lanternfall.', at: { map: 'lf_sunset' } },

  // ------------------------------------------------------------------ ch5: the Last Sunset
  // Nana's house, or straight up the hill road to the soldiers' trigger (which sends you to Tobias).
  { text: 'Find a way up to the Lantern. Look in on Nana Brisa and the village first.', at: [
    { map: 'c5_nana_house', npc: 'nana' },
    { map: 'lf_sunset', x: 31, y: 9 },
  ] },
  // Re-set by Nana's reunion even after the soldiers turned you back; then no marker.
  { text: 'Find a way up to the Lantern. (Optional: bring Nana Brisa a sprig of sea lavender.)', at: { map: 'lf_sunset', x: 31, y: 9, unless: 'c5_soldiers' } },
  { text: 'Ask Fisher Tobias (down at the docks) for another way up to the Lantern.', at: { map: 'lf_sunset', npc: 'tobias' } },
  { text: 'Go through the Tide Caves (east road) and find the bottom of the Keeper\'s Stair.', at: { map: 'c5_tidecaves' } },
  { text: 'Find the sealed bottom of the Keeper\'s Stair at the back of the Tide Caves.', at: { map: 'c5_tidecaves', x: 37, y: 25 } },
  // The lamp-puzzle gate (its riddle), then the top of the stair; stepping out onto the
  // bluff plays the next scene. Targeting lf_sunset itself would route up the guarded hill road.
  { text: 'Climb the Keeper\'s Stair to the Lantern.', at: [
    { map: 'c5_keepers_stair', x: 17, y: 14, unless: 'c5_gate_open' },
    { map: 'c5_keepers_stair', x: 17, y: 1 },
  ] },
  { text: 'Enter the Lantern.', at: { map: 'lf_sunset', x: 8, y: 5 } },
  { text: 'RUN. Get down the hill road to Tobias\'s boat at the docks!', at: { map: 'lf_sunset', x: 23, y: 27 } },
  { text: 'Get to Tobias\'s boat at the end of the dock!', at: { map: 'lf_sunset', x: 23, y: 27 } },

  // ------------------------------------------------------------------ ch6: Afterlight
  { text: 'Step outside Fennick\'s hut.', at: { map: 'c6_hermit_shard' } },
  { text: 'Look around Fennick\'s shard. Fennick is waiting at the cairns on the rise to the east.', at: { map: 'c6_hermit_shard', npc: 'fennick' } },
  { text: 'Meet Fennick at the training ring south of the hut.', at: { map: 'c6_hermit_shard', npc: 'fennick_r' } },
  { text: 'Cross the Drift east to Keelhaven.', at: { map: 'c6_keelhaven' } },
  { text: 'Cross the Drift to Keelhaven, in the east.', at: { map: 'c6_keelhaven' } },
  { text: 'Find a way east across the Shattered Sea toward Aurenne. Warden Hale runs Keelhaven', at: { map: 'c6_keel_hall', npc: 'hale' } },
  { text: 'Go east into the Shattered Sea. Turn the salvagers\' winches on the north and south spokes', at: [
    { map: 'c6_shattered_sea', x: 29, y: 4, unless: 'c6_winch_a' },
    { map: 'c6_shattered_sea', x: 28, y: 36, unless: 'c6_winch_b' },
  ] },
  { text: 'Turn the salvagers\' winches on the north spoke (the Chainyard) and the south spoke', at: [
    { map: 'c6_shattered_sea', x: 29, y: 4, unless: 'c6_winch_a' },
    { map: 'c6_shattered_sea', x: 28, y: 36, unless: 'c6_winch_b' },
  ] },
  // The Unmoored's arena trigger, east across the strait bridge.
  { text: 'Both winches are turned. Cross the strait bridge east of the hub.', at: { map: 'c6_shattered_sea', x: 55, y: 20 } },
  { text: 'Cross the last bridge east, toward Aurenne.', at: { map: 'c6_shattered_sea', x: 70, y: 20 } },

  // ------------------------------------------------------------------ ch7: the Mender of Ash
  { text: 'Find the Ember Ward in the ruins of Aurenne.', at: { map: 'c7_ember_ward' } },
  { text: 'Find Ilse at the Ember Ward (the old Bellwrights\' Hall, east side of the ruins).', at: { map: 'c7_ember_ward' } },
  { text: 'Fetch water for the Ember Ward from the well in Ash Square.', at: { map: 'ruined_aurenne', x: 20, y: 19 } },
  { text: 'Bring the water back to Noll at the Ember Ward.', at: { map: 'c7_ember_ward', npc: 'noll' } },
  { text: 'Go to the Undercroft gate in the Bellfounders\' Quarter (west side of the ruins).', at: { map: 'ruined_aurenne', x: 7, y: 23 } },
  // The Nave's sluice gate is raised by the two wheels (west and east wings).
  { text: 'Descend into the Drowned Undercroft and find the Choir\'s sunsalt stores.', at: [
    { map: 'ch7_drowned_undercroft', x: 4, y: 16, unless: 'c7_wheel_w' },
    { map: 'ch7_drowned_undercroft', x: 43, y: 16, unless: 'c7_wheel_e' },
  ] },
  { text: 'Turn the second sluice wheel to raise the Nave gate.', at: [
    { map: 'ch7_drowned_undercroft', x: 4, y: 16, unless: 'c7_wheel_w' },
    { map: 'ch7_drowned_undercroft', x: 43, y: 16, unless: 'c7_wheel_e' },
  ] },
  { text: 'The Nave gate is open. Go north through the Nave.', at: { map: 'ch7_drowned_undercroft', x: 23, y: 11 } },
  { text: 'Descend the stair below the chapel to find the source of the singing.', at: { map: 'ch7_drowned_choir' } },
  { text: 'Follow the singing to the Choir Loft at the north end of the cistern.', at: { map: 'ch7_drowned_choir', x: 20, y: 9 } },
  { text: 'Open the Apothecary Vault east of the Choir Loft.', at: { map: 'ch7_drowned_choir', x: 30, y: 5 } },
  { text: 'Bring the sunsalt back to the Ember Ward.', at: { map: 'c7_ember_ward' } },
  { text: 'When you are ready, ask Fenna the scrap-trader in Ash Square for passage to Kiteholm.', at: { map: 'ruined_aurenne', npc: 'fenna' } },
  // Saves from before the bounty became a Journal side quest can still hold this objective.
  { text: 'Old Clapper is slain. Tell Sorrel at the gate.', at: { map: 'ruined_aurenne', npc: 'sorrel', unless: 'c7_bounty_paid' } },

  // ------------------------------------------------------------------ ch8: Children of the Wreck
  // Set just before the teleport to Kiteholm; its onEnter replaces it at once with the Rusty Anchor.
  { text: 'Explore Kiteholm and look for Pip and Bram.', at: null },
  { text: 'Find Bram at the Rusty Anchor (the tavern on Kiteholm\'s west side).', at: { map: 'c8_rusty_anchor' } },
  { text: 'Go to the Kite Nest (the red-roofed house by the market) and talk to Pip.', at: { map: 'c8_kite_nest' } },
  { text: 'Follow Pip down the Underhang — the ladder at Kiteholm\'s south edge.', at: { map: 'c8_underhang', x: 30, y: 16 } },
  // The brig key is on the captain's desk.
  { text: 'Descend to the wreck of the Vigil and find Wick and Moth.', at: { map: 'c8_vigil_wreck', x: 20, y: 4 } },
  { text: 'Open the brig (south of the gun deck) with the Brig Key.', at: [
    { map: 'c8_vigil_wreck', x: 20, y: 19, unless: 'c8_brig_open' },
    { map: 'c8_vigil_wreck', x: 20, y: 21 },
  ] },
  { text: 'Silence the lullaby at the forecastle (the bow of the Vigil).', at: { map: 'c8_vigil_wreck', x: 36, y: 15 } },
  { text: 'Warn Baron Dask at the Baron\'s Hall (the north terrace).', at: { map: 'c8_baron_hall' } },
  { text: 'Prepare Kiteholm for the raid. When ready, talk to Pip at the Kite Nest', at: { map: 'c8_kite_nest', npc: 'pip' } },
  { text: 'Pip wants to see you at the Kite Cliffs (east of the Nest) when he\'s on his feet.', at: { map: 'kiteholm', x: 42, y: 14 } },
  { text: 'Take the Baron\'s skiff from the south-west dock to Corvin\'s Roost when you are ready.', at: { map: 'kiteholm', npc: 'rook' } },
  // Set just before the teleport; the Roost's onEnter replaces it.
  { text: 'Find Corvin Ashe at Corvin\'s Roost.', at: { map: 'corvins_roost' } },
];
