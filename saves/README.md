# Save points

Save files at chapter starts and on arriving in each area, made by playing the story
tests (`tools/make_saves.sh`; rerun it after story changes). They use default settings
(Normal difficulty).

**Open one directly:** with the dev server running (`python3 -m http.server 8765` in the
project root), go to `http://localhost:8765/?load=saves/<file>`, for example
`http://localhost:8765/?load=saves/ch05_01_lf_sunset.json`.

**Or import it:** in the game, Load (or Save) → pick a slot → press **F** → Import, and
choose the file. Then load that slot.

The party, items and flags are what the story tests set up and played through, so they
match a real playthrough closely but not exactly (side quests done along the way may differ).
Levels are capped at the top of each chapter's intended range (plus two).

## Chapter 0: The Eve of Kindling

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch00_01_lf_wren_house.json](ch00_01_lf_wren_house.json) | Halloway House | Arrived | Wren (Lv 1) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [ch00_02_lanternfall.json](ch00_02_lanternfall.json) | Lanternfall | Arrived | Wren (Lv 1) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [ch00_03_lf_tidecaves.json](ch00_03_lf_tidecaves.json) | The Tide Caves | Arrived | Wren, Ilse (Lv 1) | Search the Tide Caves (east road) for Nana's brooch. |

## Chapter 1: The Kindling

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch01_01_lanternfall.json](ch01_01_lanternfall.json) | Lanternfall | Chapter start | Wren, Ilse, Bram (Lv 5) | Check on the girl at Nana Brisa's house. |
| [ch01_02_lf_lantern.json](ch01_02_lf_lantern.json) | The Lantern of Lanternfall | Arrived | Wren, Ilse, Bram, Sable (Lv 5) | Rest in your bed at home. It has been a very long day. |

## Chapter 2: The Wider World

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch02_01_port_gale.json](ch02_01_port_gale.json) | Port Gale | Arrived | Wren, Ilse, Bram, Sable (Lv 10) | Sneak through Port Gale to an inn. Stay out of the soldiers' sight — try the alley west of the pier. |
| [ch02_02_c2_gale_road.json](ch02_02_c2_gale_road.json) | The Gale Coast Road | Arrived | Wren, Ilse, Bram, Sable (Lv 10) | Follow the Gale Coast Road east toward the Whisperwold. |
| [ch02_03_c2_wold_outer.json](ch02_03_c2_wold_outer.json) | The Whisperwold | Arrived | Wren, Ilse, Bram, Sable (Lv 10) | Find a way through the Whisperwold. (Mags said: don't answer the trees.) |
| [ch02_04_c2_wold_heart.json](ch02_04_c2_wold_heart.json) | The Hollow | Arrived | Wren, Ilse, Bram, Sable (Lv 10) | Find a way through the Whisperwold. (Mags said: don't answer the trees.) |
| [ch02_05_c2_pg_odile.json](ch02_05_c2_pg_odile.json) | Odile's Cottage | End of test segment | Wren, Ilse, Bram, Sable (Lv 12) | Leave the Whisperwold by the eastern path. Thistledown lies beyond. |
| [ch02_06_thistledown.json](ch02_06_thistledown.json) | Thistledown | Arrived | Wren, Ilse, Bram, Sable (Lv 11) | Visit the Crestless Sage in the cottage on the hill, north-east of Thistledown's green. |
| [ch02_07_c2_td_fields.json](ch02_07_c2_td_fields.json) | The East Fields | Arrived | Wren, Ilse, Bram, Sable (Lv 11) | Take the Sage's herb path (behind the hedge at the east end of the fields) up to Red Tam's quarry. |
| [ch02_08_c2_quarry.json](ch02_08_c2_quarry.json) | The Old Quarry | Arrived | Wren, Ilse, Bram, Sable (Lv 13) | Take the Sage's herb path (behind the hedge at the east end of the fields) up to Red Tam's quarry. |

## Chapter 3: City of Bells

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch03_01_aurenne.json](ch03_01_aurenne.json) | Aurenne | Arrived | Wren, Ilse, Bram, Sable (Lv 12) | Catch the boy who stole Dad's compass! He ran into the Bell Market (west). |
| [ch03_02_c3_rooftops.json](ch03_02_c3_rooftops.json) | The Rooftops | Arrived | Wren, Ilse, Bram, Sable (Lv 12) | Chase the thief across the rooftops (east). |
| [ch03_03_c3_cathedral.json](ch03_03_c3_cathedral.json) | The Cathedral of Dawn | Arrived | Wren, Ilse, Bram, Sable (Lv 12) | Deliver Cassian's letter at the Cathedral of Dawn (Cathedral Square, north). |
| [ch03_04_c3_dream.json](ch03_04_c3_dream.json) | Aurenne | Arrived | Wren, Ilse, Bram, Sable (Lv 12) | Evening falls on Aurenne. Rest at the Ringing Bell (Bell Market) — the Choir is paying. |
| [ch03_05_c3_uc_sewers.json](ch03_05_c3_uc_sewers.json) | The Undercroft: Sewers | Arrived | Wren, Ilse, Bram, Sable (Lv 12) | Descend into the Undercroft and find the missing children. |
| [ch03_06_c3_uc_ossuary.json](ch03_06_c3_uc_ossuary.json) | The Undercroft: Ossuary | Arrived | Wren, Ilse, Bram, Sable (Lv 12) | The sluice gate is open. Press on east, deeper into the Undercroft. |
| [ch03_07_c3_uc_lab.json](ch03_07_c3_uc_lab.json) | The Undercroft: Laboratory | Arrived | Wren, Ilse, Bram, Sable (Lv 15) | Find Nell and the missing — and whoever is doing this. |

## Chapter 4: The Pilgrim Road

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch04_01_sunscar_road.json](ch04_01_sunscar_road.json) | The Pilgrim Road | Arrived | Wren, Ilse, Bram, Sable (Lv 24) | Follow the Pilgrim Road east across the Sunscar to Saltglass. |
| [ch04_02_c4a_dunes.json](ch04_02_c4a_dunes.json) | The Sunscar | Arrived | Wren, Ilse, Bram, Sable (Lv 24) | Follow the Pilgrim Road east across the Sunscar to Saltglass. |
| [ch04_03_c4a_halcyon.json](ch04_03_c4a_halcyon.json) | Wreck of the Halcyon | Arrived | Wren, Ilse, Bram, Sable (Lv 24) | Cross the Sunscar east to Saltglass. |
| [ch04_04_c4a_saltglass.json](ch04_04_c4a_saltglass.json) | Saltglass | Arrived | Wren, Ilse, Bram, Sable (Lv 24) | Find Keeper Tamsin in the Saltglass Lantern (north plaza). |
| [ch04_05_c4a_sg_lantern.json](ch04_05_c4a_sg_lantern.json) | The Saltglass Lantern | Arrived | Wren, Ilse, Bram, Sable (Lv 24) | Ask Caravan Master Oyelaran (north-east yard) for passage north to the Greyspine. |
| [ch04_06_c4a_sg_inn.json](ch04_06_c4a_sg_inn.json) | The Cool Well | End of test segment | Wren, Ilse, Bram, Sable (Lv 24) | Ask Caravan Master Oyelaran (north-east yard) for passage north to the Greyspine. |
| [ch04_07_c4a_glass_caverns.json](ch04_07_c4a_glass_caverns.json) | The Glass Caverns | Arrived | Wren, Ilse, Bram, Sable (Lv 24) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [ch04_08_c4a_glass_nest.json](ch04_08_c4a_glass_nest.json) | The Queen's Nest | Arrived | Wren, Ilse, Bram, Sable (Lv 24) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [ch04_09_c4a_greyspine_pass.json](ch04_09_c4a_greyspine_pass.json) | Greyspine Pass | Arrived | Wren, Ilse, Bram, Sable (Lv 25) | Climb the Greyspine Pass to Frosthollow monastery. |
| [ch04_10_c4a_frosthollow.json](ch04_10_c4a_frosthollow.json) | Frosthollow | Arrived | Wren, Ilse, Bram, Sable (Lv 31) | Find Brother Halvard in the Hall of Echoes (top of the steps). |
| [ch04_11_c4a_fh_hall.json](ch04_11_c4a_fh_hall.json) | The Hall of Echoes | Arrived | Wren, Ilse, Bram, Sable (Lv 31) | Explore Frosthollow. When you're ready, rest at the guesthouse — talk to Brother Tolle. |
| [ch04_12_c4a_frost_caves.json](ch04_12_c4a_frost_caves.json) | The Bell Stair | Arrived | Wren, Ilse, Bram, Sable (Lv 30) | Escape down the Bell Stair (north-east cliff, behind the guesthouse) with the children. |
| [ch04_13_mirefen_road.json](ch04_13_mirefen_road.json) | The Fenward Causeway | Arrived | Wren, Ilse, Bram, Sable (Lv 32) | Follow the causeway east to Mirefen and find its Keeper, Mother Osk. |
| [ch04_14_c4b_mirefen.json](ch04_14_c4b_mirefen.json) | Mirefen | Arrived | Wren, Ilse, Bram, Sable (Lv 30) | Go to Mother Osk in the Mirefen Lantern, north-east of the village. |
| [ch04_15_c4b_drownmere.json](ch04_15_c4b_drownmere.json) | The Drownmere | Arrived | Wren, Ilse, Bram, Sable (Lv 30) | In the Drownmere (south jetty): gather Lanternmoss at the Sunken Shrine (west) and a Weepcap Lily in the Root Grotto (east). |
| [ch04_16_c4b_mirefen_inn.json](ch04_16_c4b_mirefen_inn.json) | The Leaning Heron | End of test segment | Wren, Ilse, Bram, Sable (Lv 31) | Find Elowen, the oldest Keeper, at the heart of the Thornwood in Verdance. (Leave Mirefen by the north path.) |
| [ch04_17_c4b_verdance.json](ch04_17_c4b_verdance.json) | Rootholm | Arrived | Wren, Ilse, Bram, Sable (Lv 33) | Enter the Thornwood (north of Rootholm) and find Elowen — and Rootholm's three lost children. |
| [ch04_18_c4b_thornwood.json](ch04_18_c4b_thornwood.json) | The Thornwood | Arrived | Wren, Ilse, Bram, Sable (Lv 33) | Enter the Thornwood (north of Rootholm) and find Elowen — and Rootholm's three lost children. |
| [ch04_19_c4b_heartwood.json](ch04_19_c4b_heartwood.json) | The Heartwood | Arrived | Wren, Ilse, Bram, Sable (Lv 34) | Morning in the Heartwood. Speak with Elowen before you go. |
| [ch04_20_c4b_stormfoot.json](ch04_20_c4b_stormfoot.json) | Stormfoot | Arrived | Wren, Ilse, Bram, Sable (Lv 35) | Take three Storm Cores from the lightning-struck crags around Stormfoot (west, north-east, south-east), then bring them to Corvin at the Halcyon. |
| [ch04_21_c4b_skyreach.json](ch04_21_c4b_skyreach.json) | Skyreach | Arrived | Wren, Ilse, Bram, Sable (Lv 35) | Go to Ardent Vasha at the Lantern, on the northern terrace of Skyreach. |
| [ch04_22_c4b_sky_lantern.json](ch04_22_c4b_sky_lantern.json) | The Skyreach Lantern | Arrived | Wren, Ilse, Bram, Sable (Lv 35) | Take the Keel Lift (east edge of Skyreach) down into the Undercradle. Charge the three lift-pylons, then face the Thunderhead. |
| [ch04_23_c4b_undercradle.json](ch04_23_c4b_undercradle.json) | The Undercradle | Arrived | Wren, Ilse, Bram, Sable (Lv 35) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |

## Chapter 5: The Last Sunset

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch05_01_lf_sunset.json](ch05_01_lf_sunset.json) | Lanternfall | Chapter start | Wren, Ilse, Bram, Sable (Lv 37) | Find a way up to the Lantern. Look in on Nana Brisa and the village first. |
| [ch05_02_c5_tidecaves.json](ch05_02_c5_tidecaves.json) | The Tide Caves | Arrived | Wren, Ilse, Bram, Sable (Lv 37) | Go through the Tide Caves (east road) and find the bottom of the Keeper's Stair. |
| [ch05_03_c5_keepers_stair.json](ch05_03_c5_keepers_stair.json) | The Keeper's Stair | Arrived | Wren, Ilse, Bram, Sable (Lv 37) | Climb the Keeper's Stair to the Lantern. |

## Chapter 6: Afterlight

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch06_01_shard_hermitage.json](ch06_01_shard_hermitage.json) | Fennick's Hut | Chapter start | Wren (Lv 41) | Step outside Fennick's hut. |
| [ch06_02_c6_hermit_shard.json](ch06_02_c6_hermit_shard.json) | Fennick's Shard | Arrived | Wren (Lv 41) | Look around Fennick's shard. Fennick is waiting at the cairns on the rise to the east. |
| [ch06_03_c6_drift.json](ch06_03_c6_drift.json) | The Drift | Arrived | Wren (Lv 41) | Cross the Drift to Keelhaven, in the east. |
| [ch06_04_c6_keelhaven.json](ch06_04_c6_keelhaven.json) | Keelhaven | Arrived | Wren (Lv 41) | Find a way east across the Shattered Sea toward Aurenne. Warden Hale runs Keelhaven (the big hull, north side). |
| [ch06_05_c6_shattered_sea.json](ch06_05_c6_shattered_sea.json) | The Shattered Sea | Arrived | Wren (Lv 41) | Turn the salvagers' winches on the north spoke (the Chainyard) and the south spoke (the wreck of the Gilded Psalm). |

## Chapter 7: The Mender of Ash

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch07_01_ruined_aurenne.json](ch07_01_ruined_aurenne.json) | Ruins of Aurenne | Arrived | Wren (Lv 45) | Find Ilse at the Ember Ward (the old Bellwrights' Hall, east side of the ruins). |
| [ch07_02_ch7_drowned_undercroft.json](ch07_02_ch7_drowned_undercroft.json) | The Drowned Undercroft | Arrived | Wren, Ilse (Lv 45) | Descend into the Drowned Undercroft and find the Choir's sunsalt stores. |
| [ch07_03_ch7_drowned_choir.json](ch07_03_ch7_drowned_choir.json) | The Cistern of Bells | Arrived | Wren, Ilse (Lv 45) | Descend the stair below the chapel to find the source of the singing. |

## Chapter 8: Children of the Wreck

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch08_01_kiteholm.json](ch08_01_kiteholm.json) | Kiteholm | Arrived | Wren, Ilse (Lv 49) | Find Bram at the Rusty Anchor (the tavern on Kiteholm's west side). |
| [ch08_02_c8_underhang.json](ch08_02_c8_underhang.json) | The Underhang | Arrived | Wren, Ilse (Lv 49) | Follow Pip down the Underhang — the ladder at Kiteholm's south edge. |
| [ch08_03_c8_vigil_wreck.json](ch08_03_c8_vigil_wreck.json) | Wreck of the Vigil | Arrived | Wren, Ilse, Pip (Lv 49) | Descend to the wreck of the Vigil and find Wick and Moth. |

## Chapter 9: The Halcyon

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch09_01_corvins_roost.json](ch09_01_corvins_roost.json) | Corvin's Roost | Arrived | Wren, Ilse, Bram, Pip (Lv 52) |  |
| [ch09_02_c9_boneyard.json](ch09_02_c9_boneyard.json) | The Boneyard | Arrived | Wren, Ilse, Bram, Pip (Lv 52) |  |
| [ch09_03_c9_benediction.json](ch09_03_c9_benediction.json) | Wreck of the Benediction | Arrived | Wren, Ilse, Bram, Pip (Lv 52) |  |
| [ch09_04_c9_cinderdeep.json](ch09_04_c9_cinderdeep.json) | The Cinderdeep | Arrived | Wren, Ilse, Bram, Pip (Lv 52) |  |

## Chapter 10: Lysa

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch10_01_c10_lorne_house.json](ch10_01_c10_lorne_house.json) | The Keeper's House | Arrived | Wren, Ilse, Bram, Pip (Lv 58) |  |
| [ch10_02_noon_spire.json](ch10_02_noon_spire.json) | The Noon Spire | Arrived | Wren, Ilse, Bram, Pip (Lv 58) |  |
| [ch10_03_c10_spire_halls.json](ch10_03_c10_spire_halls.json) | The Spire Halls | Arrived | Wren, Ilse, Bram, Pip (Lv 58) |  |
| [ch10_04_c10_evernoon.json](ch10_04_c10_evernoon.json) | Evernoon | Arrived | Wren, Ilse, Bram, Pip (Lv 58) |  |

## Chapter 11: Seven Wounds

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch11_01_halcyon_deck.json](ch11_01_halcyon_deck.json) | The Halcyon | Chapter start | Wren, Ilse, Bram, Sable (Lv 72) | Recover the Sun Shards (0/7): Saltglass, Frosthollow, Mirefen, Thornwood, Skyreach. Set a course with Corvin at the helm. |
| [ch11_02_c11_saltglass.json](ch11_02_c11_saltglass.json) | Saltglass | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Recover the Sun Shards (0/7): Saltglass, Frosthollow, Mirefen, Thornwood, Skyreach. Set a course with Corvin at the helm. |
| [ch11_03_c11_frosthollow.json](ch11_03_c11_frosthollow.json) | Frosthollow | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Recover the Sun Shards (1/7): Frosthollow, Mirefen, Thornwood, Skyreach. Set a course with Corvin at the helm. |
| [ch11_04_c11_mirefen.json](ch11_04_c11_mirefen.json) | Mirefen | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Recover the Sun Shards (2/7): Mirefen, Thornwood, Skyreach. Set a course with Corvin at the helm. |
| [ch11_05_c11_thornwood.json](ch11_05_c11_thornwood.json) | Thornwood | Arrived | Wren, Ilse, Bram, Sable (Lv 72) |  |
| [ch11_06_c11_skyreach.json](ch11_06_c11_skyreach.json) | Skyreach | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Recover the Sun Shards (4/7): Skyreach, the Grand Lantern. Set a course with Corvin at the helm. |
| [ch11_07_c11_grand_nave.json](ch11_07_c11_grand_nave.json) | The Grand Lantern | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Recover the Sun Shards (5/7): the Grand Lantern. Set a course with Corvin at the helm. |
| [ch11_08_c11_lf_ruins.json](ch11_08_c11_lf_ruins.json) | Lanternfall | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Walk through Lanternfall. The memories here are blocking the way to the Lantern. |
| [ch11_09_c11_reef.json](ch11_09_c11_reef.json) | The Drowned Reef | Arrived | Wren, Ilse, Bram, Sable (Lv 72) |  |
| [ch11_10_c11_scrapfall.json](ch11_10_c11_scrapfall.json) | Scrapfall | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Recover the Sun Shards (5/7): the Grand Lantern. Set a course with Corvin at the helm. |
| [ch11_11_c11_vigil.json](ch11_11_c11_vigil.json) | The Vigil Hall | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Recover the Sun Shards (5/7): the Grand Lantern. Set a course with Corvin at the helm. |
| [ch11_12_c11_stormwall.json](ch11_12_c11_stormwall.json) | The Eye of the Stormwall | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Reach Captain Hal's cabin at the Kingfisher's stern. |
| [ch11_13_c11_rift.json](ch11_13_c11_rift.json) | The Gloam Rift | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Follow the echoes to the bottom of the Gloam Rift. |
| [ch11_14_c11_orrery.json](ch11_14_c11_orrery.json) | The Orrery | Arrived | Wren, Ilse, Bram, Sable (Lv 72) | Recover the Sun Shards (5/7): the Grand Lantern. Set a course with Corvin at the helm. |

## Chapter 12: Evernoon

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [ch12_01_evernoon_gate.json](ch12_01_evernoon_gate.json) | The Gate of Evernoon | Arrived | Wren, Ilse, Bram, Sable (Lv 80) | Cross the shard to the golden gate of Evernoon. |
| [ch12_02_c12_streets.json](ch12_02_c12_streets.json) | Evernoon | Arrived | Wren, Ilse, Bram, Sable (Lv 80) | Head up the avenue to the cathedral steps. |
| [ch12_03_c12_memory.json](ch12_03_c12_memory.json) | The Night of the Spill | Arrived | Wren, Ilse, Bram, Sable (Lv 81) | Follow young Cassian north to the Grand Lantern plaza. |
| [ch12_04_c12_stair.json](ch12_04_c12_stair.json) | The Noon Stair | Arrived | Wren, Ilse, Bram, Sable (Lv 82) | Ring the bells in the west and east galleries to open the stair. |

## Post-game

| File | Where | When | Party | Objective |
|---|---|---|---|---|
| [pg_01_abyss_gate.json](pg_01_abyss_gate.json) | The Abyss Gate | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_02_abyss_1.json](pg_02_abyss_1.json) | The Gloam Abyss · B1 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_03_abyss_2.json](pg_03_abyss_2.json) | The Gloam Abyss · B2 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_04_abyss_3.json](pg_04_abyss_3.json) | The Gloam Abyss · B3 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_05_abyss_4.json](pg_05_abyss_4.json) | The Gloam Abyss · B4 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_06_abyss_5.json](pg_06_abyss_5.json) | The Gloam Abyss · B5 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_07_abyss_6.json](pg_07_abyss_6.json) | The Gloam Abyss · B6 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_08_abyss_7.json](pg_08_abyss_7.json) | The Gloam Abyss · B7 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_09_abyss_8.json](pg_09_abyss_8.json) | The Gloam Abyss · B8 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_10_abyss_9.json](pg_10_abyss_9.json) | The Gloam Abyss · B9 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_11_abyss_10.json](pg_11_abyss_10.json) | The Gloam Abyss · B10 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_12_abyss_11.json](pg_12_abyss_11.json) | The Gloam Abyss · B11 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_13_abyss_12.json](pg_13_abyss_12.json) | The Gloam Abyss · B12 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_14_abyss_13.json](pg_14_abyss_13.json) | The Gloam Abyss · B13 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_15_abyss_14.json](pg_15_abyss_14.json) | The Gloam Abyss · B14 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_16_abyss_15.json](pg_16_abyss_15.json) | The Gloam Abyss · B15 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_17_abyss_16.json](pg_17_abyss_16.json) | The Gloam Abyss · B16 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_18_abyss_17.json](pg_18_abyss_17.json) | The Gloam Abyss · B17 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_19_abyss_18.json](pg_19_abyss_18.json) | The Gloam Abyss · B18 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_20_abyss_19.json](pg_20_abyss_19.json) | The Gloam Abyss · B19 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_21_abyss_20.json](pg_21_abyss_20.json) | The Gloam Abyss · B20 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_22_abyss_21.json](pg_22_abyss_21.json) | The Gloam Abyss · B21 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_23_abyss_22.json](pg_23_abyss_22.json) | The Gloam Abyss · B22 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_24_abyss_23.json](pg_24_abyss_23.json) | The Gloam Abyss · B23 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_25_abyss_24.json](pg_25_abyss_24.json) | The Gloam Abyss · B24 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_26_abyss_25.json](pg_26_abyss_25.json) | The Gloam Abyss · B25 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_27_abyss_26.json](pg_27_abyss_26.json) | The Gloam Abyss · B26 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_28_abyss_27.json](pg_28_abyss_27.json) | The Gloam Abyss · B27 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_29_abyss_28.json](pg_29_abyss_28.json) | The Gloam Abyss · B28 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_30_abyss_29.json](pg_30_abyss_29.json) | The Gloam Abyss · B29 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
| [pg_31_abyss_30.json](pg_31_abyss_30.json) | The Gloam Abyss · B30 | Arrived | Wren, Ilse, Bram, Sable (Lv 99) | Fetch Fisher Tobias's mended net from Nana Brisa's house. |
