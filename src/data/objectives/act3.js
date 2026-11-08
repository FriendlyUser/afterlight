// Quest-marker targets (see ./index.js).
// Act III and the post-game: Chapters 9–12 (ch9, ch10, ch11*, ch12*) and postgame.js.

// Party members stand at their posts aboard the Halcyon (spawned by script, so x, y too).
const helm = { map: 'halcyon_deck', npc: 'corvin', x: 4, y: 8 };
const nell = { map: 'c11_halcyon_hold', npc: 'nell' };

// The Remnant waiting before each Lantern (gone once its Shard is taken).
const remnant = (map) => ({ map, npc: 'remnant' });

// The Gloam Abyss: B10's knight, B20's warden (the stair-front of the generated floor),
// B30's First Dark — each hidden once beaten, so the marker sits on the next one down.
const abyssDepths = [
  { map: 'abyss_10', npc: 'pg_knight', unless: 'pg_boss_10' },
  { map: 'abyss_20', x: 41, y: 5, unless: 'pg_boss_20' },
  { map: 'abyss_30', x: 18, y: 13, unless: 'pg_first_dark' },
];

// Lysa's hiding places in the festival square (postgame.js HIDING_SPOTS `at`).
const hidingPlaces = [[7, 9], [27, 9], [9, 19], [24, 18], [4, 13], [29, 15], [13, 20], [17, 13], [21, 9]]
  .map(([x, y]) => ({ map: 'pg_hiding_place', x, y, unless: 'pg_lysa_found' }));
// The chalk door at the Abyss Gate: the only way into the Hiding Place.
const chalkWall = { map: 'abyss_gate', x: 5, y: 21 };

/** @type {import('../../types/data').ObjectiveEntry[]} */
const ENTRIES = [
  // ================================================================ Chapter 9 — the Halcyon
  { text: 'Find Corvin. Someone in the Roost will know where he drinks.', at: { map: 'c9_last_call' } },
  { text: 'Talk to Mags, the Halcyon\'s engineer, aboard the grounded ship at the head of the canyon.', at: { map: 'corvins_roost', npc: 'mags' } },
  // The two crane winches open the gate to the Foreman's yard.
  {
    text: 'Take the lift on the east wall down to the Boneyard. Find a lift-coil that isn\'t cracked.',
    at: [{ map: 'c9_boneyard', x: 4, y: 4, unless: 'c9_winch_nw' }, { map: 'c9_boneyard', x: 44, y: 32, unless: 'c9_winch_se' }],
  },
  { text: 'The way to the Foreman\'s yard (north) is open.', at: { map: 'c9_boneyard', x: 37, y: 4 } },
  { text: 'Bring the lift-coil to Mags at the Halcyon.', at: { map: 'corvins_roost', x: 26, y: 14 } },
  // The Benediction's world node only opens after the first barge ride.
  { text: 'Ask Ruddock the ferryman (the Lip, west of town) to take you to the wreck of the Benediction.', at: { map: 'corvins_roost', npc: 'ruddock' } },
  {
    text: 'Silence the two hymn-censers — on the forecastle and in the spilled hold — to break the ward around the mainmast.',
    at: [{ map: 'c9_benediction', x: 23, y: 8, unless: 'c9_censer_fore' }, { map: 'c9_benediction', x: 38, y: 16, unless: 'c9_censer_hold' }],
  },
  { text: 'The ward is broken. Climb to the mainmast.', at: { map: 'c9_benediction', x: 23, y: 15 } },
  // Back at the Roost, the next beat is Odessa's permit for the Cinderdeep.
  { text: 'Take the stormsilk back to the Roost. Ruddock\'s barge waits at the south pier.', at: { map: 'c9_ledger_house', npc: 'odessa' } },
  // The two steam valves crack the slag walls on the way to the Sunworm's chamber (and to Ines).
  {
    text: 'Ride the Toll Barge to the Cinderdeep. Find the heart-ember — and Odessa\'s three missing miners.',
    at: [
      { map: 'c9_cinderdeep', x: 3, y: 11, unless: 'c9_valve_west' },
      { map: 'c9_cinderdeep', x: 41, y: 33, unless: 'c9_valve_se' },
      { map: 'c9_cinderdeep', x: 18, y: 5 },
      { map: 'c9_cinderdeep', npc: 'miner_dagny', unless: 'c9_miner_dagny' },
      { map: 'c9_cinderdeep', npc: 'miner_hobb', unless: 'c9_miner_hobb' },
      { map: 'c9_cinderdeep', npc: 'miner_ines', unless: 'c9_miner_ines' },
    ],
  },
  { text: 'Take the heart-ember back to the Halcyon. Mags is waiting.', at: { map: 'corvins_roost', x: 26, y: 14 } },
  // Set as the Halcyon carries the party to the shard.
  { text: 'Find Sable in the Noon Spire.', at: { map: 'noon_spire' } },

  // ================================================================ Chapter 10 — the Noon Spire
  { text: 'Climb the shard to the Noon Spire and find a way inside.', at: { map: 'noon_spire', x: 27, y: 6 } },
  { text: 'Ride the supply lift into the Spire.', at: { map: 'c10_spire_halls' } },
  {
    text: 'Find the three clocks that still tick (west wing, east wing, north-west gallery) and stop them at noon.',
    at: [
      { map: 'c10_spire_halls', x: 6, y: 28, unless: 'c10_clock_west' },
      { map: 'c10_spire_halls', x: 35, y: 28, unless: 'c10_clock_east' },
      { map: 'c10_spire_halls', x: 7, y: 10, unless: 'c10_clock_gallery' },
    ],
  },
  { text: 'The dais is open. Approach the Noon Gate.', at: { map: 'c10_spire_halls', x: 21, y: 9 } },
  { text: 'Pass through the Noon Gate into Evernoon.', at: { map: 'c10_evernoon' } },
  { text: 'Search Evernoon for Sable. (The Keeper\'s house stands in the north-east, beside the Lantern.)', at: { map: 'c10_lorne_house' } },
  { text: 'Follow Sable to the festival square.', at: { map: 'c10_evernoon' } },
  { text: 'Escape! Back through the Noon Gate (south) and out of the Spire before Evernoon comes apart.', at: { map: 'c10_spire_halls' } },
  { text: 'Reach the Sky Balcony on the east side of the Spire — Mags will bring the Halcyon.', at: { map: 'c10_spire_halls', x: 36, y: 8 } },
  { text: 'Find the seven Sun Shards before Cassian does.', at: { map: 'halcyon_deck' } },

  // ================================================================ Chapter 11 — the hub (mainObjective)
  { text: 'Talk to Corvin at the helm. Evernoon is waiting.', at: helm },
  { text: 'Go home to Lanternfall. The last Shard is in Mom\'s Lantern.', at: { map: 'c11_lf_ruins' } },
  { text: 'Six Shards. Return to the Halcyon.', at: { map: 'halcyon_deck' } },
  // Each Remnant's world node is open from the start of Act III (the Grand Lantern's once
  // three Shards are in); the marker sits on the Remnant before its Lantern.
  {
    text: 'Recover the Sun Shards (',
    at: [
      { ...remnant('c11_saltglass'), unless: 'c11_shard_salt' },
      { ...remnant('c11_frosthollow'), unless: 'c11_shard_frost' },
      { ...remnant('c11_mirefen'), unless: 'c11_shard_mire' },
      { ...remnant('c11_thornwood'), unless: 'c11_shard_thorn' },
      { ...remnant('c11_skyreach'), unless: 'c11_shard_sky' },
      // Garrick waits in the tower, behind the portcullis: the nave is as far as the way is open.
      { map: 'c11_grand_nave', unless: 'c11_shard_grand' },
    ],
  },
  { text: 'Enter Evernoon. Stop the Vespersong.', at: { map: 'evernoon_gate' } },

  // ================================================================ Chapter 11 — the Remnants
  // Saltglass: ring the three garden bells (morning, noon, evening) to break the glass wall.
  {
    text: 'Climb the Glass Steps to the Lantern of Saltglass.',
    at: [{ map: 'c11_saltglass', x: 25, y: 21 }, { map: 'c11_saltglass', x: 20, y: 18 }, { map: 'c11_saltglass', x: 15, y: 21 }],
  },
  { text: 'The glass wall is broken. Go up to the Lantern.', at: remnant('c11_saltglass') },
  // Frosthollow: the west brazier melts the stair to the lake, the east one the stair to the peak.
  { text: 'Climb Frosthollow\'s frozen terraces to the Lantern on the peak.', at: { map: 'c11_frosthollow', x: 4, y: 27, unless: 'c11_fh_brazier_w' } },
  { text: 'The way to the frozen lake is open. Keep climbing.', at: { map: 'c11_frosthollow', x: 33, y: 14, unless: 'c11_fh_brazier_e' } },
  { text: 'The way to the peak is open.', at: remnant('c11_frosthollow') },
  // Mirefen: Osk's Censer hangs in her herb-shed.
  { text: 'Find a way through the rot to the Lantern of Mirefen.', at: { map: 'c11_mirefen', x: 6, y: 29 } },
  {
    text: 'Burn the rot-blooms off the boardwalks with Osk\'s Censer.',
    at: [
      { map: 'c11_mirefen', x: 18, y: 19, unless: 'blocker:c11_mirefen:rot_a' },
      { map: 'c11_mirefen', x: 19, y: 10, unless: 'blocker:c11_mirefen:rot_b' },
    ],
  },
  { text: 'The Lantern of Mirefen lies ahead.', at: remnant('c11_mirefen') },
  // Thornwood: Elowen's Ember sits in the shrine; only the north wall (thorn_a) bars the Lantern.
  { text: 'Find a way through the thorns to the Lantern of Thornwood.', at: { map: 'c11_thornwood', x: 7, y: 28 } },
  {
    text: 'Burn a path through the thorn walls with Elowen\'s Ember.',
    at: [{ map: 'c11_thornwood', x: 19, y: 17, unless: 'blocker:c11_thornwood:thorn_a' }, { ...remnant('c11_thornwood'), after: 'blocker:c11_thornwood:thorn_a' }],
  },
  {
    text: 'Ground Skyreach\'s three lightning rods to drop the storm-ward.',
    at: [
      { map: 'c11_skyreach', x: 7, y: 29, unless: 'c11_sr_rod_w' },
      { map: 'c11_skyreach', x: 33, y: 29, unless: 'c11_sr_rod_e' },
      { map: 'c11_skyreach', x: 6, y: 14, unless: 'c11_sr_rod_n' },
    ],
  },
  { text: 'The storm-ward is down. Climb to the crown.', at: remnant('c11_skyreach') },
  // The Grand Lantern: Captain Brask carries the Commander's Seal for the lock-lever.
  { text: 'Find a way into the Grand Lantern\'s tower.', at: { map: 'c11_grand_nave', npc: 'brask' } },
  { text: 'Use the Commander\'s Seal on the lock-lever in the nave.', at: { map: 'c11_grand_nave', x: 23, y: 8 } },
  { text: 'Climb the Grand Lantern. Garrick is waiting at the top.', at: { map: 'c11_grand_gallery' } },
  // Lanternfall: the dock memory plays on arrival; the well (square) and home remain.
  {
    text: 'Walk through Lanternfall. The memories here are blocking the way to the Lantern.',
    at: [{ map: 'c11_lf_ruins', x: 23, y: 16, unless: 'c11_lf_mem_well' }, { map: 'c11_lf_home', unless: 'c11_lf_mem_home' }],
  },
  { text: 'The Lantern is open. Climb the bluff.', at: { map: 'c11_lf_lantern' } },

  // ================================================================ Chapter 11 — the Rites
  // (Several rite objectives are never replaced when the rite ends, hence the `unless`.)
  { text: 'Follow the compass across the Drowned Reef.', at: { map: 'c11_reef', x: 15, y: 6 } },
  { text: 'Take Edrin\'s Cutlass to Nell, below decks on the Halcyon.', at: { ...nell, unless: 'c11_rite_wren_done' } },
  { text: 'Find Tilly somewhere on Scrapfall.', at: { map: 'c11_scrapfall', npc: 'tilly' } },
  { text: 'Take Tilly home. Show Nell the Lucky Shiv.', at: { ...nell, unless: 'c11_rite_pip_done' } },
  { text: 'Kneel on the vigil stone in the Vigil Hall.', at: { map: 'c11_vigil', x: 13, y: 10 } },
  // Legacy (saves from before rites restored the main objective when they end).
  { text: 'Return to the Halcyon.', at: { map: 'halcyon_deck' } },
  { text: 'Find Osk\'s staff in the infirmary.', at: { map: 'c11_infirmary', x: 9, y: 3, unless: 'c11_rite_ilse_done' } },
  // The gunners first (Corvin won't enter the cabin before), then Hal's cabin. The Stormwall
  // has no world node: once left, only the helm ("Fly into the Stormwall") leads back.
  {
    text: 'Reach Captain Hal\'s cabin at the Kingfisher\'s stern.',
    at: [
      { map: 'c11_stormwall', x: 21, y: 13, unless: 'c11_sw_gunners' },
      { map: 'c11_stormwall', x: 5, y: 10, after: 'c11_sw_gunners', unless: 'c11_rite_corvin_done' },
      { ...helm, unless: 'c11_rite_corvin_done' },
    ],
  },
  { text: 'Follow the echoes to the bottom of the Gloam Rift.', at: { map: 'c11_rift', x: 15, y: 6, unless: 'c11_rite_sable_done' } },

  // ================================================================ Chapter 12 — Evernoon
  { text: 'Cross the shard to the golden gate of Evernoon.', at: { map: 'evernoon_gate', x: 20, y: 9 } },
  { text: 'Enter Evernoon through the golden gate.', at: { map: 'c12_streets' } },
  // The frozen procession at the foot of the cathedral steps.
  { text: 'Head up the avenue to the cathedral steps.', at: { map: 'c12_streets', npc: 'dancer3' } },
  {
    text: 'Wake the three sundials — in the market (west), the gardens (east) and the bell-tower square (north-west).',
    at: [
      { map: 'c12_streets', x: 11, y: 30, unless: 'c12_dial_market' },
      { map: 'c12_streets', x: 44, y: 29, unless: 'c12_dial_garden' },
      { map: 'c12_streets', x: 8, y: 8, unless: 'c12_dial_bell' },
    ],
  },
  {
    text: 'Wake the remaining sundials (',
    at: [
      { map: 'c12_streets', x: 11, y: 30, unless: 'c12_dial_market' },
      { map: 'c12_streets', x: 44, y: 29, unless: 'c12_dial_garden' },
      { map: 'c12_streets', x: 8, y: 8, unless: 'c12_dial_bell' },
    ],
  },
  { text: 'The procession has parted. Climb the steps and enter the cathedral.', at: { map: 'c12_memory' } },
  // Legacy (saves from before this side quest moved to the Journal).
  {
    text: 'Optional: find Squire Venn\'s token by the fountain in the south plaza.',
    at: [{ map: 'c12_streets', x: 26, y: 40, unless: 'c12_token_found' }, { map: 'c12_streets', npc: 'aldous', unless: 'c12_q_aldous_done' }],
  },
  { text: 'Follow young Cassian north to the Grand Lantern plaza.', at: { map: 'c12_memory', x: 22, y: 16 } },
  { text: 'Talk to young Cassian.', at: { map: 'c12_memory', npc: 'm_cass_kneel' } },
  { text: 'The Lantern door has opened. Climb the Grand Lantern.', at: { map: 'c12_stair' } },
  {
    text: 'Ring the bells in the west and east galleries to open the stair.',
    at: [{ map: 'c12_stair', x: 3, y: 21, unless: 'c12_bell_w' }, { map: 'c12_stair', x: 32, y: 21, unless: 'c12_bell_e' }],
  },
  { text: 'Climb to the top of the Noon Stair.', at: { map: 'c12_stair', x: 18, y: 14 } },
  {
    text: 'Ring the other bell to open the stair.',
    at: [{ map: 'c12_stair', x: 3, y: 21, unless: 'c12_bell_w' }, { map: 'c12_stair', x: 32, y: 21, unless: 'c12_bell_e' }],
  },
  // The campers (spawned by script) until each has had their say, and the fire to rest by.
  {
    text: 'Talk with everyone around the fire. When you\'re ready, rest by it.',
    at: [
      { map: 'c12_stair', x: 22, y: 10 },
      .../** @type {Array<[string, number, number]>} */ ([['ilse', 20, 9], ['bram', 24, 9], ['sable', 20, 11], ['pip', 23, 8], ['corvin', 25, 11]])
        .map(([id, x, y]) => ({ map: 'c12_stair', npc: `camp_${id}`, x, y, unless: `c12_camp_${id}` })),
    ],
  },
  { text: 'Climb to the Noon Throne.', at: { map: 'c12_throne' } },
  { text: 'Face Cassian at the Noon Throne.', at: { map: 'c12_throne', x: 15, y: 13 } },
  // After the ending: the Gloam Abyss, beneath the Nadir Light.
  {
    text: 'The Afterlight has risen. The world — and the Gloam beneath it — is still out there.',
    at: [{ map: 'abyss_gate', unless: 'pg_arrived' }, ...abyssDepths],
  },

  // ================================================================ Post-game — the Gloam Abyss
  { text: 'Descend the Gloam Abyss to the thirtieth stair.', at: abyssDepths },
  // Legacy: before the ending the Abyss is now a Journal side quest, so these two are only
  // in saves from before that change.
  { text: 'Explore the Gloam Abyss beneath the Nadir Light (the first ten stairs).', at: abyssDepths[0] },
  { text: 'The Abyss below B10 is sealed. A new kind of light is needed. (Continue the story.)', at: helm },
  { text: 'Descend deeper into the Gloam Abyss.', at: abyssDepths.slice(1) },
  { text: 'Descend to the bottom of the Gloam Abyss.', at: abyssDepths[2] },
  // The Lantern-lift on B30 (where the party is left standing), then Orrin at the Gate.
  { text: 'The First Dark sleeps. Ride the Lantern-lift home — and tell Orrin.', at: [{ map: 'abyss_30', x: 24, y: 5 }, { map: 'abyss_gate', npc: 'orrin' }] },
  { text: 'Lysa\'s chalk marks point back to the wall by the Abyss Gate.', at: chalkWall },
  { text: 'Search the festival square for Lysa. (Check the hiding places.)', at: [...hidingPlaces, { ...chalkWall, unless: 'pg_lysa_found' }] },
  { text: 'Lysa went home. Return through the chalk door.', at: { map: 'abyss_gate' } },
];

export default ENTRIES;
