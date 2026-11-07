// Chapter 5 — the Gloam-touched Tide Caves, the Keeper's Stair, and the Lantern hall.
import CAVES from './layouts/lf_tidecaves.js';
import STAIR from './layouts/ch5_keepers_stair.js';
import LANTERN from './layouts/lf_lantern.js';
import { CH5 } from '../../story/ch5.js';

// The Act I caves, with a passage opened behind the grown crystal (x=38, rows 28-31).
const OPEN_X = 38;
const caveGround = CAVES.ground.map((row, y) => (y >= 28 ? row.slice(0, OPEN_X) + 'c' + row.slice(OPEN_X + 1) : row));
const caveProps = CAVES.props.map((row, y) => (y === 28 ? row.slice(0, OPEN_X) + ' ' + row.slice(OPEN_X + 1) : row));

export const c5TideCaves = {
  ...CAVES,
  ground: caveGround,
  props: caveProps,
  id: 'c5_tidecaves', name: 'The Tide Caves', region: 'Gloam-touched', mood: 'cave', music: 'gloam',
  particles: 'gloam', battleBg: 'tidecave',
  encounters: { rate: 1.0, troops: [['c5_tc_fishers', 3], ['c5_tc_wraith', 2], ['c5_tc_eels', 2], ['c5_tc_bats', 2], ['c5_tc_mix', 3]] },
  chests: [
    { id: 'c5_tc1', x: 4, y: 26, item: 'mega_tonic' },
    { id: 'c5_tc2', x: 12, y: 6, item: 'starweave_hood' },
    { id: 'c5_tc3', x: 28, y: 21, gold: 1500 },
    { id: 'c5_tc4', x: 6, y: 10, item: 'hi_ether', count: 2 },
    { id: 'c5_tc5', x: 10, y: 18, item: 'starglass_rod' },
  ],
  blockers: [{ id: 'c5_crystal', x: OPEN_X, y: 29, prop: 'crystal_gloam' }],
  inspect: [
    { x: 19, y: 24, hint: 'Tide pool', run: (s) => CH5.poolLavender(s) },
  ],
  triggers: [
    { id: 'c5_caves_in', x: 1, y: 14, w: 3, h: 5, run: (s) => CH5.cavesEnter(s) },
    { id: 'c5_crystal', x: 35, y: 23, w: 5, h: 6, once: false, cond: (st) => !st.flags.c5_tidemourner, run: (s) => CH5.crystal(s) },
  ],
  exits: [
    { x: 0, y: 15, h: 3, to: 'lf_sunset', tx: 43, ty: 16, dir: 'left' },
    { x: OPEN_X, y: 31, to: 'c5_keepers_stair', tx: 17, ty: 40, dir: 'up' },
  ],
};

const KEEPERS = {
  brenna: 'A worn grave-slab: BRENNA HALLOWAY — FIRST OF US — SHE CUT THE STAIR.',
  oda: 'ODA HALLOWAY. SHE HELD THE LIGHT THROUGH THE STORM OF THE SEVENTY BOATS, AND ALL SEVENTY CAME HOME.',
  ide: 'IDE HALLOWAY. "SHE SANG FLAT AND NEVER ONCE MISSED A DAWN." Your grandmother. You remember her hands, and her terrible singing.',
};

export const c5KeepersStair = {
  ...STAIR,
  id: 'c5_keepers_stair', name: 'The Keeper\'s Stair', region: 'Lanternfall', mood: 'cave', music: 'cave',
  battleBg: 'cave',
  encounters: { rate: 0.9, troops: [['c5_ks_mix', 3], ['c5_ks_eel_wraith', 2], ['c5_ks_crabs', 2], ['c5_ks_bats', 2]] },
  chests: [
    { id: 'c5_ks1', x: 5, y: 30, item: 'starsteel_plate' },
    { id: 'c5_ks2', x: 29, y: 27, item: 'starweave_robe' },
    { id: 'c5_ks3', x: 27, y: 19, item: 'elixir' },
    { id: 'c5_ks4', x: 27, y: 9, item: 'starsteel_partisan' },
    { id: 'c5_ks5', x: 27, y: 6, item: 'magic_fruit' },
    { id: 'c5_ks6', x: 5, y: 4, item: 'power_fruit' },
    { id: 'c5_ks7', x: 15, y: 3, gold: 2000 },
  ],
  blockers: [{ id: 'c5_gate', x: 16, y: 14, w: 3, h: 1, prop: 'fence' }],
  inspect: [
    { x: 11, y: 15, hint: 'Lamp', run: (s) => CH5.lamp(s, 'star') },
    { x: 14, y: 15, hint: 'Lamp', run: (s) => CH5.lamp(s, 'stone') },
    { x: 21, y: 15, hint: 'Lamp', run: (s) => CH5.lamp(s, 'wave') },
    { x: 17, y: 14, hint: 'Gate', run: (s) => CH5.gateWords(s) },
    { x: 29, y: 18, hint: 'Carving', run: (s) => CH5.carving(s) },
    { x: 4, y: 25, text: KEEPERS.brenna },
    { x: 6, y: 25, text: KEEPERS.oda },
    { x: 8, y: 25, text: KEEPERS.ide },
    { x: 4, y: 27, text: 'A blank slab, smoothed and ready. Nothing carved on it yet.' },
    { x: 8, y: 27, text: 'A small, newer stone, the letters cut in a careful, narrow hand you know very well: EDRIN — WHO WAS NOT A KEEPER, BUT KEPT US.' },
    { x: 6, y: 24, text: 'The first Keeper, worn faceless by four hundred years of damp. Fresh candle stubs at her feet. Someone comes down here often. Someone who comes down from the top.' },
  ],
  triggers: [{ id: 'c5_stair_in', x: 14, y: 36, w: 7, h: 5, run: (s) => CH5.stairEnter(s) }],
  exits: [
    { x: 17, y: 0, to: 'lf_sunset', tx: 12, ty: 3, dir: 'down' },
    { x: 16, y: 41, w: 3, to: 'c5_tidecaves', tx: OPEN_X, ty: 30, dir: 'up' },
  ],
};

export const ch5Lantern = {
  ...LANTERN,
  id: 'ch5_lantern', name: 'The Lantern of Lanternfall', mood: 'temple', music: null,
  camera: { dist: 17, pitch: 0.72 }, particles: 'motes_gold', battleBg: 'lantern', structures: [],
  inspect: [
    { x: 7, y: 2, text: 'The great lamp of Lanternfall. Its bed of brass is empty.', cond: (st) => st.flags.c5_gave },
  ],
  exits: [{ x: 6, y: 12, w: 3, to: 'lf_sunset', tx: 8, ty: 5, dir: 'down' }],
  onEnter: async (s) => {
    if (s.flag('c5_ready') && !s.flag('c5_lantern')) await CH5.lantern(s);
  },
};
