// Side-quest marker targets (blue), part 4 of 4 — see side.js for the format.
// Corvin's Roost to the post-game: ch10_side (Evernoon's stuck memories), ch11 (the Sun
// Shards), ch11_remnants / ch11_rites (the Character Rites, the Starseer), ch12 (Evernoon's
// errands), postgame.js (the Gloam Abyss), and from side.js the Act II bounties and the
// Black Star.

// Party members stand at their posts aboard the Halcyon (spawned by script, so x, y too).
const helm = { map: 'halcyon_deck', npc: 'corvin', x: 4, y: 8 };
const nell = { map: 'c11_halcyon_hold', npc: 'nell' };

// The Remnant waiting before each Lantern (gone once its Shard is taken).
const remnant = (map) => ({ map, npc: 'remnant' });

// Act II bounties (side.js BOUNTIES, act: 2): the lair trigger's centre (data/content/side.js
// `lair(id, x, y)`), then Hesper at the ruined Lodge's board, who pays out.
const hesper = { map: 'side_ruin_lodge', npc: 'hesper' };
/** @returns {import('../../types/data').SideQuestEntry[]} */
const bounty = (id, name, lair) => [
  { quest: `side_b_${id}`, step: `Hunt ${name} — `, at: lair },
  { quest: `side_b_${id}`, step: `${name} is slain.`, at: hesper },
];

// The Gloam Abyss: B10's knight, B20's warden (the stair-front of the generated floor),
// B30's First Dark. Below B10 the stair stays sealed until the ending (gameClear).
const knight10 = { map: 'abyss_10', npc: 'pg_knight', unless: 'pg_boss_10' };
const deeper = [
  { map: 'abyss_20', x: 41, y: 5, after: 'gameClear', unless: 'pg_boss_20' },
  { map: 'abyss_30', x: 18, y: 13, after: 'gameClear', unless: 'pg_first_dark' },
];

// Lysa's hiding places in the festival square (postgame.js HIDING_SPOTS `at`), and the
// chalk wall at the Abyss Gate, the only way in.
const hidingPlaces = [[7, 9], [27, 9], [9, 19], [24, 18], [4, 13], [29, 15], [13, 20], [17, 13], [21, 9]]
  .map(([x, y]) => ({ map: 'pg_hiding_place', x, y }));
const chalkWall = { map: 'abyss_gate', x: 5, y: 21 };

/** @type {import('../../types/data').SideQuestEntry[]} */
export default [
  // ------------------------------------------------------------------ ch10: Evernoon
  // Tomas (east market) hands over the lemonade, Bess (river bench) drinks it. Holding it
  // sets no flag, so both stay marked. After the escape nothing here can be finished.
  { quest: 'c10_q_lemon', at: [
    { map: 'c10_evernoon', npc: 'tomas', unless: 'c10_escape' },
    { map: 'c10_evernoon', npc: 'bess', unless: 'c10_escape' },
  ] },
  // Rafe on the river bridge (Pip, in the party, does the rest).
  { quest: 'c10_q_ask', at: { map: 'c10_evernoon', npc: 'lover_m', unless: 'c10_escape' } },

  // ------------------------------------------------------------------ ch11: the Sun Shards
  // Mirrors the main objective: the Remnant before each Lantern; the Grand Lantern once its
  // ward falls (Garrick is behind the portcullis, so the nave); Lanternfall once Wren is
  // ready — the two memories blocking the way, then the Lantern.
  { quest: 'c11_shards', at: [
    { ...remnant('c11_saltglass'), unless: 'c11_shard_salt' },
    { ...remnant('c11_frosthollow'), unless: 'c11_shard_frost' },
    { ...remnant('c11_mirefen'), unless: 'c11_shard_mire' },
    { ...remnant('c11_thornwood'), unless: 'c11_shard_thorn' },
    { ...remnant('c11_skyreach'), unless: 'c11_shard_sky' },
    { map: 'c11_grand_nave', after: 'c11_grand_open', unless: 'c11_shard_grand' },
    { map: 'c11_lf_ruins', x: 23, y: 16, after: 'c11_lf_open', unless: 'c11_lf_mem_well' },
    { map: 'c11_lf_home', after: 'c11_lf_open', unless: 'c11_lf_mem_home' },
    { map: 'c11_lf_lantern', after: 'c11_lf_light_open', unless: 'c11_shard_home' },
  ] },

  // ------------------------------------------------------------------ ch11: the Rites
  // Wren: the Gull's Return (the wreck inspect on the Drowned Reef), then Nell's forge.
  { quest: 'c11_rite_wren', step: 'Dad\'s compass is pointing', at: { map: 'c11_reef', x: 15, y: 6 } },
  { quest: 'c11_rite_wren', step: 'Found the Gull\'s Return', at: nell },
  // Pip: Tilly on Scrapfall's junk-heap, then Nell with the Lucky Shiv.
  { quest: 'c11_rite_pip', step: 'Tilly, one of the Kiteholm kids', at: { map: 'c11_scrapfall', npc: 'tilly' } },
  { quest: 'c11_rite_pip', step: 'Found Tilly, and the "Lucky Shiv"', at: nell },
  // Bram: the vigil stone in the Vigil Hall.
  { quest: 'c11_rite_bram', at: { map: 'c11_vigil', x: 13, y: 10 } },
  // Ilse: Osk's staff on its stand in the drowned infirmary (Mirefen's east island; the
  // red-corded door opens once she has asked).
  { quest: 'c11_rite_ilse', at: { map: 'c11_infirmary', x: 9, y: 3 } },
  // Corvin: ask at the helm ("Fly into the Stormwall"); in the wreck, the gunners first
  // (Corvin won't enter the cabin before), then Hal's cabin. The Stormwall has no world
  // node — once left, only the helm leads back, so it stays listed.
  { quest: 'c11_rite_corvin', step: 'The wreck of the Kingfisher', at: helm },
  { quest: 'c11_rite_corvin', step: 'Corvin flew into the Stormwall', at: [
    { map: 'c11_stormwall', x: 21, y: 13, unless: 'c11_sw_gunners' },
    { map: 'c11_stormwall', x: 5, y: 10, after: 'c11_sw_gunners' },
    helm,
  ] },
  // Sable: Lysa's room at the bottom of the Gloam Rift (through the hollow in Thornwood).
  { quest: 'c11_rite_sable', at: { map: 'c11_rift', x: 15, y: 6 } },
  // The Starseer: the seven Starfall Fragments in their crystals (takeStar sets
  // c11_star_<id>), and Ottoline, who takes them whenever you call (handing them in is
  // counted in vars, so she stays marked).
  { quest: 'c11_starseer', at: [
    { map: 'c11_saltglass', x: 2, y: 18, unless: 'c11_star_salt' },
    { map: 'c11_frosthollow', x: 9, y: 15, unless: 'c11_star_frost' },
    { map: 'c11_mirefen', x: 30, y: 31, unless: 'c11_star_mire' },
    { map: 'c11_thornwood', x: 33, y: 10, unless: 'c11_star_thorn' },
    { map: 'c11_skyreach', x: 9, y: 12, unless: 'c11_star_sky' },
    { map: 'c11_grand_nave', x: 31, y: 10, unless: 'c11_star_grand' },
    { map: 'c11_reef', x: 28, y: 24, unless: 'c11_star_reef' },
    { map: 'c11_orrery', npc: 'ottoline' },
  ] },

  // ------------------------------------------------------------------ ch12: Evernoon's errands
  // The token in the south-plaza fountain, then Squire Venn on the barracks square.
  { quest: 'c12_q_aldous', at: [
    { map: 'c12_streets', x: 26, y: 40, unless: 'c12_token_found' },
    { map: 'c12_streets', npc: 'aldous', after: 'c12_token_found' },
  ] },
  // A Gale Bomb from Mott at the gate (holding one sets no flag), then Tomas in the gardens.
  { quest: 'c12_q_kite', at: [
    { map: 'evernoon_gate', npc: 'mott' },
    { map: 'c12_streets', npc: 'tomas' },
  ] },
  { quest: 'c12_q_cards', at: { map: 'c12_streets', npc: 'sel' } },
  // Fen by the pond, then her mother, who pays (and closes the quest).
  { quest: 'c12_q_knee', at: [
    { map: 'c12_streets', npc: 'fen', unless: 'c12_q_knee_done' },
    { map: 'c12_streets', npc: 'dawe', after: 'c12_q_knee_done' },
  ] },
  // The haberdasher's stall in the market, then Hollin.
  { quest: 'c12_q_ribbon', at: [
    { map: 'c12_streets', npc: 'haberdasher', unless: 'c12_ribbon_got' },
    { map: 'c12_streets', npc: 'hollin', after: 'c12_ribbon_got' },
  ] },
  // Its owner is Cassian: Wren hands it over at the Noon Throne after the last fight.
  { quest: 'c12_q_atlas', at: { map: 'c12_throne', x: 15, y: 13 } },

  // ------------------------------------------------------------------ post-game: the Gloam Abyss
  // The B10 knight; once he falls before the ending, the sealed stair below him (examining
  // it moves the quest on); after the ending, the wardens further down.
  { quest: 'pg_abyss', step: 'Thirty stairs beneath the Nadir Light. At the bottom', at: [
    knight10,
    { map: 'abyss_10', x: 4, y: 4, after: 'pg_boss_10', unless: 'gameClear' },
    ...deeper,
  ] },
  // Sealed below B10 until the ending ("Continue the story."): nothing to mark before then.
  { quest: 'pg_abyss', step: 'Thirty stairs beneath the Nadir Light. Below B10', at: deeper },
  // The Tally is about naming monsters and mastering Crests anywhere, reported to Orrin
  // whenever you like: no one place to go.
  { quest: 'pg_tally', at: null },
  // Tobb's letter: the first chest on B3, then Tobb at the Gate.
  { quest: 'pg_tobb', at: [
    { map: 'abyss_3', x: 1, y: 18, unless: 'chest:abyss_3:c0' },
    { map: 'abyss_gate', npc: 'tobb', after: 'chest:abyss_3:c0' },
  ] },
  // Lysa's chalk marks on B6, B13, B21 and B27 (the last three below the B10 seal).
  { quest: 'pg_hideseek', step: 'Someone has been leaving chalk marks', at: [
    { map: 'abyss_6', x: 13, y: 12, unless: 'pg_chalk_6' },
    { map: 'abyss_13', x: 8, y: 8, after: 'gameClear', unless: 'pg_chalk_13' },
    { map: 'abyss_21', x: 29, y: 14, after: 'gameClear', unless: 'pg_chalk_21' },
    { map: 'abyss_27', x: 5, y: 13, after: 'gameClear', unless: 'pg_chalk_27' },
  ] },
  // The chalk door, then (once through it) the hiding places in the festival square.
  { quest: 'pg_hideseek', step: 'The last chalk mark says', at: [chalkWall, ...hidingPlaces] },
  { quest: 'pg_colosseum', at: { map: 'pg_arena', npc: 'dace' } },

  // ------------------------------------------------------------------ side.js: Act II bounties
  ...bounty('cinderwing', 'Cinderwing', { map: 'side_ashen_reach', x: 23, y: 6 }),
  ...bounty('glasshide', 'Glasshide', { map: 'side_ashen_reach', x: 22, y: 30 }),
  ...bounty('gravemouth', 'Gravemouth', { map: 'side_ashen_reach', x: 46, y: 5 }),
  ...bounty('choirmother', 'The Choirmother', { map: 'side_bell_nave', x: 10, y: 27 }),
  ...bounty('thornmaiden', 'The Thornmaiden', { map: 'side_garden_gate', x: 31, y: 9 }),
  // The Black Star: the trigger band under it.
  { quest: 'side_nadir', at: { map: 'side_nadir', x: 15, y: 11 } },
];
