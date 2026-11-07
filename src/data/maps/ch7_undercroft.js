// Chapter 7 — the Drowned Undercroft (floor 1) and the Cistern of Bells (floor 2).
import F1 from './layouts/ch7_drowned_undercroft.js';
import F2 from './layouts/ch7_drowned_choir.js';
import { CH7 } from '../../story/ch7.js';

const dungeon = { mood: 'cave', music: 'cave', battleBg: 'undercroft', particles: 'dust', camera: { dist: 19, pitch: 0.74 } };

export const drownedUndercroft = {
  ...F1, ...dungeon,
  id: 'ch7_drowned_undercroft', name: 'The Drowned Undercroft', region: 'Beneath Aurenne',
  encounters: {
    rate: 1, onTiles: '_w=',
    troops: [['c7_rats', 3], ['c7_rat_bloom', 2], ['c7_acolytes', 2], ['c7_wisps', 2], ['c7_bones', 2], ['c7_bones_wisp', 1], ['c7_lab', 1]],
  },
  chests: [
    { id: 'hall', x: 28, y: 35, item: 'hi_ether', count: 2 },
    { id: 'oss1', x: 4, y: 27, item: 'ashen_hood' },
    { id: 'oss2', x: 12, y: 16, item: 'mega_tonic', count: 2 },
    { id: 'secret', x: 6, y: 31, item: 'ashen_blade' },
    { id: 'arch1', x: 13, y: 4, item: 'ashen_veil' },
    { id: 'arch2', x: 5, y: 10, item: 'wisdom_seed' },
    { id: 'lab1', x: 44, y: 26, item: 'panacea', count: 3 },
    { id: 'lab2', x: 33, y: 19, item: 'c7_seeds' },
    { id: 'rel1', x: 43, y: 9, gold: 2400 },
    { id: 'rel2', x: 34, y: 8, item: 'ashen_robe' },
  ],
  blockers: [
    { id: 'c7_sluice', x: 22, y: 12, w: 4, h: 1, prop: 'fence' },
    { id: 'c7_cracked_wall', x: 6, y: 29, prop: 'pillar_broken' },
  ],
  inspect: [
    { x: 4, y: 16, hint: 'Sluice wheel', run: (s) => CH7.wheel(s, 'w') },
    { x: 43, y: 16, hint: 'Sluice wheel', run: (s) => CH7.wheel(s, 'e') },
    ...[22, 23, 24, 25].map((x) => ({ x, y: 12, hint: 'Sluice gate', cond: (st) => !st.flags.c7_gate_open, run: (s) => CH7.gateCheck(s) })),
    { x: 6, y: 29, hint: 'Cracked wall', cond: (st) => !st.flags.c7_secret_open, run: (s) => CH7.secretWall(s) },
    { x: 13, y: 27, hint: 'Alcove', run: (s) => CH7.ucTags(s) },
    { x: 35, y: 17, hint: 'Ledger', run: (s) => CH7.labNotes(s, 0) },
    { x: 40, y: 20, hint: 'Notes', run: (s) => CH7.labNotes(s, 1) },
    { x: 35, y: 24, hint: 'Letter', run: (s) => CH7.labNotes(s, 2) },
    { x: 40, y: 27, text: 'Cages. Small ones — child-sized. Every door hangs open. Whatever was inside left, or was let out, or was used.' },
    { x: 4, y: 3, text: 'A drowned order of service, the ink run to violet: "VESPERS EVE. The Under-Choir shall descend to the Cistern and hold the Reflected Note until the Precentor\'s signal. Do not stop for any reason. — By order of the Hierophant."' },
    { x: 13, y: 3, text: 'Hymnals, swollen fat with water. One has fallen open to a page where somebody has written in the margin, very small: _I don\'t want to sing this one._' },
    { x: 36, y: 7, text: 'A reliquary statue of a Keeper holding up a lantern. Something large has rubbed against it so often that one side is polished to a shine.' },
    { x: 26, y: 5, text: 'A little statue of Saint Aurel, patron of tuners, still dry. Someone left a candle stub at her feet. It is not very old.' },
    { x: 19, y: 30, text: 'A pillar carved with a high-water mark from two hundred years ago. The water today is three hands higher.' },
  ],
  exits: [
    { x: 22, y: 39, w: 3, to: 'ruined_aurenne', tx: 7, ty: 20, dir: 'down' },
    { x: 23, y: 4, w: 2, to: 'ch7_drowned_choir', tx: 20, ty: 32, dir: 'up' },
  ],
  triggers: [
    { id: 'c7_uc_entry', x: 22, y: 35, w: 3, h: 2, run: (s) => CH7.ucEntry(s) },
    { id: 'c7_uc_guard', x: 22, y: 25, w: 4, h: 1, run: (s) => CH7.ucGuard(s) },
    { id: 'c7_uc_lab', x: 33, y: 23, w: 2, h: 2, run: (s) => CH7.ucLab(s) },
    { id: 'c7_uc_chapel', x: 22, y: 11, w: 4, h: 1, cond: (st) => st.flags.c7_gate_open, run: (s) => CH7.chapel(s) },
    { id: 'c7_uc_lair', x: 35, y: 5, w: 8, h: 4, once: false, cond: (st) => st.flags.c7_q_bounty_on && !st.flags.c7_clapper_dead, run: (s) => CH7.oldClapper(s) },
  ],
};

export const drownedChoir = {
  ...F2, ...dungeon,
  id: 'ch7_drowned_choir', name: 'The Cistern of Bells', region: 'Beneath Aurenne',
  scatter: { types: ['debris', 'bones', 'rock_small'], density: 0.04, seed: 19 },
  mood: 'gloam',
  music: (st) => (st.flags.c7_choir_done ? 'cave' : 'gloam'),
  particles: 'gloam',
  encounters: {
    rate: 1, onTiles: '_', cond: (st) => !st.flags.c7_choir_done,
    troops: [['c7_eels', 3], ['c7_crabs', 2], ['c7_cantor', 2], ['c7_deep_mix', 2], ['c7_acolytes', 1]],
  },
  chests: [
    { id: 'cache1', x: 3, y: 14, item: 'ember_feather', count: 3 },
    { id: 'cache2', x: 6, y: 11, item: 'power_fruit' },
    { id: 'clapper', x: 9, y: 13, item: 'c7_bell_clapper' },
    { id: 'spur', x: 10, y: 27, gold: 1800 },
    { id: 'vestry1', x: 36, y: 26, item: 'ashen_staff' },
    { id: 'vestry2', x: 29, y: 25, item: 'tonic_mist', count: 2 },
    { id: 'vault1', x: 30, y: 6, item: 'dawn_plume' },
    { id: 'vault2', x: 35, y: 6, item: 'ashen_coat' },
  ],
  blockers: [{ id: 'c7_vault_grate', x: 29, y: 4, w: 1, h: 3, prop: 'fence' }],
  inspect: [
    { x: 7, y: 29, text: 'A great bronze bell, sunk to its shoulder. Its rim is engraved: _I CALL THE LIVING. I MOURN THE DEAD. I BREAK THE LIGHTNING._ It has done none of these things in a year.' },
    { x: 35, y: 25, text: 'Vestry shelves. Choir robes hang in rows, dripping. There are exactly as many empty hooks as there are singers in the Loft.' },
    { x: 4, y: 12, text: 'A bellwright\'s anvil, carried all the way down here for repairs. The tools are laid out neatly, as if the smith only stepped away.' },
  ],
  exits: [{ x: 17, y: 35, w: 7, to: 'ch7_drowned_undercroft', tx: 23, ty: 7, dir: 'down' }],
  triggers: [
    { id: 'c7_cis_arrive', x: 17, y: 30, w: 7, h: 4, run: (s) => CH7.cisternArrive(s) },
    { id: 'c7_cis_boss', x: 18, y: 8, w: 5, h: 2, once: false, cond: (st) => !st.flags.c7_choir_done, run: (s) => CH7.choirBoss(s) },
    { id: 'c7_cis_vault', x: 30, y: 4, w: 2, h: 3, once: false, cond: (st) => st.flags.c7_choir_done && !st.flags.c7_sunsalt, run: (s) => CH7.vault(s) },
  ],
};
