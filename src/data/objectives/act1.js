// Quest-marker targets (see ./index.js).
/** @type {import('../../types/data').ObjectiveEntry[]} */
const ENTRIES = [
  // ------------------------------------------------------------------ New game & Prologue (Lanternfall)
  // Set by startNewGame; the house's onEnter plays the opening, which replaces it at once.
  { text: 'Get up. Tomorrow is the Kindling — today there are chores.', at: { map: 'lf_wren_house' } },
  { text: 'Fetch Fisher Tobias\'s mended net from Nana Brisa\'s house.', at: { map: 'lf_nana_house', npc: 'nana' } },
  { text: 'Give the net to Fisher Tobias by the beach, then search the Tide Caves (east road) for Nana\'s brooch.', at: { map: 'lanternfall', npc: 'tobias' } },
  // The 'brooch' trigger by the pool at the back of the caves.
  { text: 'Search the Tide Caves (east road) for Nana\'s brooch.', at: { map: 'lf_tidecaves', x: 36, y: 23 } },
  // Arriving from the caves plays the scene (onEnter); the 'dock_cassian' trigger covers the rest.
  { text: 'Hurry back to Lanternfall\'s docks!', at: { map: 'lanternfall', x: 23, y: 22 } },
  { text: 'Return the brooch to Nana Brisa.', at: { map: 'lf_nana_house', npc: 'nana' } },
  { text: 'Go home for supper.', at: { map: 'lf_wren_house' } },
  // The 'rocks' trigger on the southeast beach.
  { text: 'Someone is on the black rocks (southeast beach). Go!', at: { map: 'lanternfall', x: 38, y: 24 } },
  { text: 'Check on the girl at Nana Brisa\'s house.', at: { map: 'lf_nana_house' } },

  // ------------------------------------------------------------------ Chapter 1 (Lanternfall)
  { text: 'The Kindling begins at noon. Go to the Lantern on the northwest bluff.', at: { map: 'lf_lantern' } },
  // After the Kindling: rest in the bed at home (it brings the night and the voices), then
  // the Lantern. The first two are earlier wordings, kept for saves that hold them.
  { text: 'Rest at home. Something tells you to come back to the Lantern tonight...', at: { map: 'lf_wren_house', x: 1, y: 2 } },
  { text: 'Home at last. It has been a very long day — rest in your bed.', at: { map: 'lf_wren_house', x: 1, y: 2 } }, // earlier wording
  { text: 'Rest in your bed at home. It has been a very long day.', at: { map: 'lf_wren_house', x: 1, y: 2 } },
  { text: 'Voices from the Lantern', at: { map: 'lf_lantern' } },
  // The 'depart' trigger on the dock (Tobias is spawned by the scene).
  { text: 'Leave for the mainland at dawn. Tobias will sail you from the docks.', at: { map: 'lanternfall', x: 23, y: 28 } }, // legacy
  { text: 'Leave for the mainland. Tobias will sail you from the docks.', at: { map: 'lanternfall', x: 23, y: 28 } },
  // Set just before the teleport; Port Gale's onEnter (arrival) replaces it.
  { text: 'Explore Port Gale, then take the Whisperwold road toward Aurenne.', at: { map: 'port_gale' } },

  // ------------------------------------------------------------------ Chapter 2 — Port Gale & the Gale Coast Road
  // The kitchen-door trigger in the alley west of the inn (Mags pulls you in).
  { text: 'Sneak through Port Gale to an inn. Stay out of the soldiers\' sight — try the alley west of the pier.', at: { map: 'port_gale', x: 18, y: 6 } },
  { text: 'Explore Port Gale, then take the coast road east toward the Whisperwold.', at: { map: 'c2_gale_road' } },
  // Legacy: saves from before these side-quest steps moved to the Journal.
  { text: 'Return the Admiral to Bettany at the fish market.', at: { map: 'port_gale', npc: 'bettany', unless: 'c2_cat_done' } },
  // Heading for the Whisperwold exit takes you over the bridge, where the checkpoint trigger fires.
  { text: 'Follow the Gale Coast Road east toward the Whisperwold.', at: { map: 'c2_wold_outer' } },
  { text: 'Thorne\'s Own hold the bridge. Find another way across the gorge — someone is camped on the cliffs nearby.', at: { map: 'c2_gale_road', npc: 'hesketh' } },
  // The goat path comes back up east of the gorge; entering the wood is the next beat.
  { text: 'Take the goat path down the cliff, cross the cove under the bridge, and climb back up to the road.', at: { map: 'c2_wold_outer' } },

  // ------------------------------------------------------------------ Chapter 2 — the Whisperwold
  // The riddle stone just inside the Hollow sets the next objective.
  { text: 'Find a way through the Whisperwold. (Mags said: don\'t answer the trees.)', at: { map: 'c2_wold_heart', x: 9, y: 31 } },
  // Cradle, wedding, grave (answered in that order; progress lives in vars, not flags).
  { text: 'Find the three Listening Stones and answer them in the order of a life.', at: [
    { map: 'c2_wold_heart', x: 36, y: 19 },
    { map: 'c2_wold_heart', x: 9, y: 12 },
    { map: 'c2_wold_heart', x: 9, y: 24 },
  ] },
  { text: 'The roots have parted. Go deeper into the Hollow.', at: { map: 'c2_wold_heart', x: 34, y: 8 } },
  { text: 'Leave the Whisperwold by the eastern path. Thistledown lies beyond.', at: { map: 'thistledown' } },

  // ------------------------------------------------------------------ Chapter 2 — Thistledown & Red Tam
  { text: 'Visit the Crestless Sage in the cottage on the hill, north-east of Thistledown\'s green.', at: { map: 'c2_sage_house', npc: 'bethan' } },
  // Red Tam's trigger at the top of the quarry (the herb path leads to the quarry exit around the picket).
  { text: 'Take the Sage\'s herb path (behind the hedge at the east end of the fields) up to Red Tam\'s quarry.', at: { map: 'c2_quarry', x: 28, y: 7 } },
  // Legacy: saves from before this side-quest step moved to the Journal.
  { text: 'Tell Farmer Dunstan his fields are safe.', at: { map: 'c2_td_fields', npc: 'dunstan', unless: 'c2_scare_done' } },
  { text: 'Return to Thistledown.', at: { map: 'thistledown' } },
  { text: 'The Aurenne road is open. When you\'re ready, leave by the far east end of the fields.', at: { map: 'c2_td_fields', x: 54, y: 15 } },
  // Set just before the teleport; Aurenne's onEnter (arrival) replaces it.
  { text: 'Reach the Cathedral of Dawn in Aurenne and deliver Cassian\'s letter.', at: { map: 'aurenne' } },

  // ------------------------------------------------------------------ Chapter 3 — Aurenne
  { text: 'Catch the boy who stole Dad\'s compass! He ran into the Bell Market (west).', at: { map: 'aurenne', npc: 'pip_thief' } },
  // The crate stack (inspect) is the only way up to the rooftops.
  { text: 'Climb the crates behind the market (by the brick warehouse) and chase the thief across the rooftops!', at: { map: 'aurenne', x: 9, y: 34 } },
  // The 'corner' trigger under St. Aurel's bell tower.
  { text: 'Chase the thief across the rooftops (east).', at: { map: 'c3_rooftops', x: 35, y: 13 } },
  // Sister Mercy's trigger across the nave.
  { text: 'Deliver Cassian\'s letter at the Cathedral of Dawn (Cathedral Square, north).', at: { map: 'c3_cathedral', x: 11, y: 14 } },
  { text: 'Give Cassian\'s letter to the acolyte by the altar.', at: { map: 'c3_cathedral', npc: 'imre' } },
  { text: 'Evening falls on Aurenne. Rest at the Ringing Bell (Bell Market) — the Choir is paying.', at: { map: 'c3_inn', npc: 'marta' } },
  { text: 'Find out what happened to Nell. Ask Old Mag in Low Town (south-east, by the river).', at: { map: 'aurenne', npc: 'mag' } },
  { text: 'The Undercroft grate behind the almshouse is locked. Sister Constance at the almshouse keeps the keys.', at: { map: 'c3_almshouse', npc: 'constance' } },
  { text: 'Open the old Undercroft grate behind the almshouse (east end of Low Town).', at: { map: 'aurenne', x: 44, y: 29 } },

  // ------------------------------------------------------------------ Chapter 3 — the Undercroft
  // The sluice gate blocks the way east; inspecting it (or turning a valve) sets the next objective.
  { text: 'Descend into the Undercroft and find the missing children.', at: { map: 'c3_uc_sewers', x: 31, y: 12 } },
  { text: 'Find the two valve wheels (north and south passages) to raise the sluice gate.', at: [
    { map: 'c3_uc_sewers', x: 19, y: 2, unless: 'c3_valve_a' },
    { map: 'c3_uc_sewers', x: 25, y: 23, unless: 'c3_valve_b' },
  ] },
  { text: 'Turn the second valve wheel to raise the sluice gate.', at: [
    { map: 'c3_uc_sewers', x: 19, y: 2, unless: 'c3_valve_a' },
    { map: 'c3_uc_sewers', x: 25, y: 23, unless: 'c3_valve_b' },
  ] },
  // The Carillon Wight's trigger in the old foundry.
  { text: 'The sluice gate is open. Press on east, deeper into the Undercroft.', at: { map: 'c3_uc_ossuary', x: 28, y: 16 } },
  { text: 'Press on toward the stair at the far end of the ossuary.', at: { map: 'c3_uc_lab' } },
  // Sister Mercy's trigger before the crucible.
  { text: 'Find Nell and the missing — and whoever is doing this.', at: { map: 'c3_uc_lab', x: 23, y: 23 } },
  { text: 'Cassian has asked for you in his study (Cathedral of Dawn, back-left door).', at: { map: 'c3_study' } },
  // The 'departure' trigger at the South Gate.
  { text: 'The Pilgrim Road leads south to Saltglass. Leave Aurenne by the South Gate when you\'re ready.', at: { map: 'aurenne', x: 20, y: 45 } },
  // Set just before the teleport; the road's onEnter (roadOpening) replaces it.
  { text: 'Follow the Pilgrim Road south across the Sunscar to Saltglass, and Keeper Tamsin.', at: { map: 'sunscar_road' } },

  // ------------------------------------------------------------------ Chapter 4 — the Sunscar & Saltglass
  // The way into Saltglass stays shut until Corvin joins; the smoke trigger in the dunes comes first.
  { text: 'Follow the Pilgrim Road east across the Sunscar to Saltglass.', at: { map: 'c4a_dunes', x: 33, y: 21 } },
  { text: 'Investigate the smoke beyond the northern canyon.', at: { map: 'c4a_halcyon' } },
  { text: 'Cross the Sunscar east to Saltglass.', at: { map: 'c4a_saltglass' } },
  { text: 'Find Keeper Tamsin in the Saltglass Lantern (north plaza).', at: { map: 'c4a_sg_lantern' } },
  // His caravan is the only way north (scripted teleport to the Greyspine Pass).
  { text: 'Ask Caravan Master Oyelaran (north-east yard) for passage north to the Greyspine.', at: { map: 'c4a_saltglass', npc: 'oyelaran' } },

  // ------------------------------------------------------------------ Chapter 4 — the Greyspine
  { text: 'Climb the Greyspine Pass to Frosthollow monastery.', at: { map: 'c4a_frosthollow' } },
  { text: 'Find Brother Halvard in the Hall of Echoes (top of the steps).', at: { map: 'c4a_fh_hall' } },
  { text: 'Explore Frosthollow. When you\'re ready, rest at the guesthouse — talk to Brother Tolle.', at: { map: 'c4a_fh_guest', npc: 'tolle' } },
  // Stepping out of the guesthouse plays the scene at the gate (Frosthollow's onEnter).
  { text: 'Go outside and find Brother Halvard.', at: { map: 'c4a_frosthollow' } },
  // Through the Bell Stair caves to the ledge, whose onEnter plays the finale.
  { text: 'Escape down the Bell Stair (north-east cliff, behind the guesthouse) with the children.', at: { map: 'c4a_bell_ledge' } },
  // Set just before the teleport; the causeway's onEnter (Chapter 4b) replaces it.
  { text: 'Warn the remaining Keepers. Take the eastern road down to Mirefen and find Mother Osk.', at: { map: 'mirefen_road' } },
];

export default ENTRIES;
