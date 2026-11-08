// Side-quest marker targets (blue), part 1 of 4 — see side.js for the format.

/** @type {import('../../types/data').SideQuestEntry[]} */
export default [
  // ------------------------------------------------------------------ Prologue (Lanternfall)
  // The 'brooch' trigger by the pool at the back of the Tide Caves; then back to Nana
  // (arriving home from the caves plays Cassian's arrival first, by itself).
  { quest: 'p_brooch', at: [
    { map: 'lf_tidecaves', x: 36, y: 23, unless: 'p_brooch_got' },
    { map: 'lf_nana_house', npc: 'nana', after: 'p_brooch_got' },
  ] },

  // ------------------------------------------------------------------ Chapter 2 — Port Gale & the Gale Coast Road
  // The barrel in the alley west of the inn (catSpot).
  { quest: 'c2_cat', step: 'Bettany\'s ginger tom', at: { map: 'port_gale', x: 8, y: 12 } },
  { quest: 'c2_cat', step: 'Found him behind the barrels.', at: { map: 'port_gale', npc: 'bettany' } },
  // Jory's tree by the black pond in the outer wood; hearing him rewrites the desc
  // (questNote in ch2_wold.js), and the message goes back to Odile.
  { quest: 'c2_lamp', step: 'Odile has kept a lamp lit', at: [
    { map: 'c2_wold_outer', x: 11, y: 31, unless: 'c2_jory_heard' },
    { map: 'c2_pg_odile', npc: 'odile', after: 'c2_jory_heard' },
  ] },
  { quest: 'c2_lamp', step: 'Jory\'s voice spoke by the black pond', at: { map: 'c2_pg_odile', npc: 'odile' } },
  // The third cairn on the cove (the one PORT.cairn runs on); finding the ring finishes it.
  { quest: 'c2_cairn', at: { map: 'c2_gale_road', x: 14, y: 23 } },

  // ------------------------------------------------------------------ Chapter 2 — the Whisperwold
  // Merry hides at three spots in turn (vars.c2_merry); the marker follows her.
  { quest: 'c2_merry', step: 'A little girl named Merry', at: { map: 'c2_wold_outer', npc: 'merry', unless: 'c2_merry_found' } },
  // The acorn opens the thorns; her "secret place" (the grave) is behind them.
  { quest: 'c2_merry', step: 'Merry gave you her acorn', at: [
    { map: 'c2_wold_outer', x: 39, y: 27, unless: 'blocker:c2_wold_outer:thorns' },
    { map: 'c2_wold_outer', x: 48, y: 30, after: 'blocker:c2_wold_outer:thorns' },
  ] },
  // She says goodbye after the Hollow Mother falls (the 'mother' trigger) — or, if the
  // Mother fell first, at her grave.
  { quest: 'c2_merry', step: 'Merry\'s secret place is her own grave', at: [
    { map: 'c2_wold_heart', x: 34, y: 8, unless: 'c2_mother_done' },
    { map: 'c2_wold_outer', x: 48, y: 30, after: 'c2_mother_done' },
  ] },

  // ------------------------------------------------------------------ Chapter 2 — Thistledown
  // Old Strawman won't fight until two are down; the second (sc2) is usually the last of those.
  { quest: 'c2_scarecrows', step: 'Farmer Dunstan\'s scarecrows', at: [
    { map: 'c2_td_fields', npc: 'sc1', unless: 'c2_scare_1' },
    { map: 'c2_td_fields', npc: 'sc2', unless: 'c2_scare_2' },
    { map: 'c2_td_fields', npc: 'sc3', after: ['c2_scare_1', 'c2_scare_2'], unless: 'c2_scare_3' },
  ] },
  { quest: 'c2_scarecrows', step: 'All three scarecrows are down.', at: { map: 'c2_td_fields', npc: 'dunstan' } },
  // Hesk's tip: Kindle waits by the Mother's tree (until the Sundering; after it, Kindle
  // finds Wren on the Drift — the 'kindle' trigger on the wreck's east isle).
  { quest: 'mount_kindle', at: [
    { map: 'c2_wold_heart', npc: 'kindle', unless: 'sundered' },
    { map: 'c6_drift', x: 47, y: 14, after: 'sundered', unless: 'mount_kindle' },
  ] },

  // ------------------------------------------------------------------ Chapter 3 — Aurenne
  // The Carillon Wight's trigger in the old foundry drops Gloria; then up to Tolliver.
  { quest: 'c3_gloria', step: 'Old Tolliver\'s bronze bell-hammer', at: [
    { map: 'c3_uc_ossuary', x: 28, y: 16, unless: 'c3_wight_down' },
    { map: 'c3_tolliver', npc: 'tolliver', after: 'c3_wight_down' },
  ] },
  { quest: 'c3_gloria', step: 'A bronze bell-hammer named GLORIA', at: { map: 'c3_tolliver', npc: 'tolliver' } },
  // Misfiled shelf and restricted alcove (archives), the last tomb (ossuary), Mercy's
  // ledger (laboratory). Quill counts pages in the bag, so he shows once the deepest
  // page (the lab's) is found.
  { quest: 'c3_chronicle', at: [
    { map: 'c3_archives', x: 3, y: 8, unless: 'c3_page_a' },
    { map: 'c3_archives', x: 12, y: 2, unless: 'c3_page_b' },
    { map: 'c3_uc_ossuary', x: 24, y: 4, unless: 'c3_page_c' },
    { map: 'c3_uc_lab', x: 6, y: 13, unless: 'c3_page_d' },
    { map: 'c3_archives', npc: 'quill', after: ['c3_page_a', 'c3_page_b', 'c3_page_c', 'c3_page_d'] },
  ] },
  // Up the crates by the warehouse, the cat on the thatch, then back to Venn House.
  { quest: 'c3_pounce', at: [
    { map: 'c3_rooftops', npc: 'pounce', unless: 'c3_cat_found' },
    { map: 'aurenne', x: 9, y: 34, unless: 'c3_cat_found' },
    { map: 'c3_venn', npc: 'orsolya', after: 'c3_cat_found' },
  ] },
  // Rowan is in Mercy's laboratory cells; looking in on him is the next step. Once Mercy
  // is down (either step), Hettie at the Bell Market finishes it.
  { quest: 'c3_rowan', step: 'Hettie\'s husband Rowan', at: [
    { map: 'c3_uc_lab', npc: 'cap_rowan', unless: 'c3_mercy_down' },
    { map: 'aurenne', npc: 'hettie', after: 'c3_mercy_down' },
  ] },
  // Sister Mercy's trigger before the crucible.
  { quest: 'c3_rowan', step: 'Rowan is alive, locked in a Gloam-sealed cell', at: [
    { map: 'c3_uc_lab', x: 23, y: 23, unless: 'c3_mercy_down' },
    { map: 'aurenne', npc: 'hettie', after: 'c3_mercy_down' },
  ] },
  { quest: 'c3_posy', at: { map: 'aurenne', npc: 'posy' } },

  // ------------------------------------------------------------------ The Bellring
  // Ottavio, while a cup is open: each cup opens with its story flag (and the one before
  // it won), so he shows while any story-unlocked cup is still unwon.
  { quest: 'bc_cups', at: [
    { map: 'bc_bellring', npc: 'ottavio', unless: 'bc_copper' },
    { map: 'bc_bellring', npc: 'ottavio', after: 'c4a_corvin_joined', unless: 'bc_silver' },
    { map: 'bc_bellring', npc: 'ottavio', after: 'c4b_mirefen_arrived', unless: 'bc_gold' },
    { map: 'bc_bellring', npc: 'ottavio', after: 'c4b_elowen_farewell', unless: 'bc_sunsteel' },
  ] },
];
