// Chapter 2 — Red Tam's hideout: the old quarry above the East Fields.
import L from './layouts/c2_quarry.js';
import { THISTLE } from '../../story/ch2_thistle.js';

const tamHere = (st) => !st.flags.c2_tam_done;

/** @type {import('../../types/data').MapDef} */
export const quarry = {
  ...L,
  id: 'c2_quarry', name: 'The Old Quarry', region: 'Red Tam\'s Hideout',
  mood: (st) => (st.flags.c2_tam_done ? 'dusk' : 'day'),
  music: (st) => (st.flags.c2_tam_done ? 'field' : 'tension'),
  battleBg: 'road', particles: 'dust_sand', camera: { dist: 21, pitch: 0.72 },
  encounters: {
    rate: 0.9, bg: 'road', cond: tamHere,
    troops: [['c2_quarry_dogs', 2], ['gw_bandits', 2], ['c2_quarry_gang', 1], ['c2_bruiser_dog', 2], ['c2_rubble', 2], ['c2_rubble_mix', 1]],
  },
  npcs: [
    { id: 'nib', name: 'Nib', look: 'bandit', x: 22, y: 33, dir: 'right', cond: (st) => !st.flags.c2_yard_fought },
    { id: 'gorse', name: 'Gorse', look: 'bandit', x: 24, y: 33, dir: 'left', cond: (st) => !st.flags.c2_yard_fought },
    { id: 'hollis', name: 'Big Hollis', look: 'c2_bruiser', x: 17, y: 19, dir: 'down', cond: (st) => !st.flags.c2_gate_open, run: (s) => THISTLE.gate(s) },
    { id: 'hollis2', name: 'Bandit', look: 'bandit', x: 18, y: 19, dir: 'down', cond: (st) => !st.flags.c2_gate_open, run: (s) => THISTLE.gate(s) },
    { id: 'red_tam', name: 'Red Tam', look: 'red_tam', x: 23, y: 5, dir: 'right', cond: tamHere },
    { id: 'tam_b1', name: 'Bandit', look: 'bandit', x: 21, y: 4, dir: 'right', cond: tamHere },
    { id: 'tam_b2', name: 'Bandit Archer', look: 'bandit', x: 21, y: 6, dir: 'right', cond: tamHere },
  ],
  chests: [
    { id: 'qy_pit', x: 3, y: 32, item: 'iron_mail' },
    { id: 'qy_ledge', x: 41, y: 23, item: 'hi_tonic', count: 2 },
    { id: 'qy_stores', x: 4, y: 12, item: 'power_band' },
    { id: 'qy_rack', x: 29, y: 15, item: 'iron_claymore' },
    { id: 'qy_hoard1', x: 37, y: 4, item: 'steel_longsword' },
    { id: 'qy_hoard2', x: 37, y: 6, gold: 500 },
  ],
  inspect: [
    { x: 31, y: 32, text: 'Pinned to the tent flap, in big careful letters: PASSWORD THIS WEEK — "THE RED SKY SLEEPS." DO NOT WRITE THIS DOWN. — T.', },
    { x: 3, y: 28, text: 'A seam of violet crystal runs through the quarry wall like a vein. It is cold enough to hurt, and it is breathing. Someone has been chipping it out by the cartload.' },
    { x: 7, y: 28, text: 'Sacks of glittering violet dust, stenciled: GENUINE SCARECROW STUFFING — 2 SILVER — KEEPS CROWS OFF FOREVER.' },
    { x: 14, y: 32, text: 'A tent full of stolen flour sacks, three hats, and a very confused mule.' },
  ],
  exits: [{ x: 21, y: 41, w: 5, to: 'c2_td_fields', tx: 44, ty: 3, dir: 'down' }],
  triggers: [
    { id: 'yard', x: 19, y: 36, w: 9, h: 2, cond: (st) => !st.flags.c2_yard_fought, run: (s) => THISTLE.yard(s) },
    { id: 'tam', x: 28, y: 7, w: 2, h: 1, once: false, cond: tamHere, run: (s) => THISTLE.tam(s) },
  ],
};
