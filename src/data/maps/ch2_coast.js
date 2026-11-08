// Chapter 2 — the Gale Coast Road: clifftops, the dark Gull Light, the hermit's camp,
// the cove under the cliffs, and Thorne's Own holding the bridge.
import L from './layouts/c2_gale_road.js';
import { PORT } from '../../story/ch2_port.js';

const guarded = (st) => !st.flags.c2_tam_done;

/** @type {import('../../types/data').MapDef} */
export const galeRoad = {
  ...L,
  id: 'c2_gale_road', name: 'The Gale Coast Road', region: 'The Gale Coast',
  mood: 'day', music: 'field', backdrop: 'ocean', battleBg: 'road',
  treeType: 'pine', particles: 'leaves',
  encounters: {
    rate: 1, bg: 'road',
    troops: [['gw_wolf2', 3], ['c2_kites', 3], ['c2_coast_mix', 2], ['c2_coast_wolves', 2], ['c2_jellies', 1], ['c2_shell_pair', 1], ['gw_thorn', 1]],
  },
  signs: [
    { x: 9, y: 15, text: '← PORT GALE · WHISPERWOLD →\nThe Gale Coast Road. Mind the cliffs. Mind the wind. Mind the cliffs in the wind.' },
    { x: 44, y: 10, text: 'THE WHISPERWOLD — 1 mile.\nTravelers are advised not to answer the trees.\nBy order of the Thistledown Reeve.' },
  ],
  npcs: [
    { id: 'hesketh', name: 'Hesketh', look: 'hesketh', x: 28, y: 9, dir: 'left', run: (s) => PORT.hermit(s) },
    { id: 'cp_harrow', name: 'Harrow', look: 'harrow', x: 39, y: 12, dir: 'left', cond: guarded },
    { id: 'cp_g1', name: 'Thorne\'s Own', look: 'vesper_soldier', x: 37, y: 11, dir: 'left', cond: guarded },
    { id: 'cp_g2', name: 'Thorne\'s Own', look: 'vesper_soldier', x: 37, y: 12, dir: 'left', cond: guarded },
    { id: 'cp_g3', name: 'Thorne\'s Own', look: 'vesper_soldier', x: 37, y: 13, dir: 'left', cond: guarded },
    { id: 'cp_g4', name: 'Thorne\'s Own', look: 'vesper_soldier', x: 41, y: 12, dir: 'right', cond: guarded },
  ],
  chests: [
    { id: 'gr_shield', x: 8, y: 7, item: 'iron_shield' },
    { id: 'gr_feather', x: 3, y: 23, item: 'ember_feather', count: 2 },
    { id: 'gr_nook', x: 56, y: 23, item: 'hi_tonic', count: 2 },
    { id: 'gr_gold', x: 55, y: 17, gold: 180 },
  ],
  blockers: [
    { id: 'goat_rocks', x: 29, y: 19, w: 2, h: 1, prop: 'rock' },
  ],
  inspect: [
    { x: 14, y: 23, hint: 'Cairn', run: (s) => PORT.cairn(s) },
    { x: 19, y: 23, text: 'A cairn of sea-smoothed stones. A gull feather has been tucked between two of them, carefully.' },
    { x: 24, y: 23, text: 'A cairn of sea-smoothed stones, stacked with care. Someone built this to last.' },
    { x: 13, y: 20, hint: 'The Gull Light', run: (s) => PORT.gullLight(s) },
    { x: 29, y: 19, text: 'A rockfall chokes the top of an old goat path down the cliff. Far below, the cove glitters.', cond: (st) => !st.flags['blocker:c2_gale_road:goat_rocks'] },
  ],
  exits: [
    { x: 0, y: 13, h: 3, to: 'port_gale', tx: 46, ty: 10, dir: 'left' },
    { x: 59, y: 10, h: 3, to: 'c2_wold_outer', tx: 1, ty: 20, dir: 'right' },
  ],
  triggers: [
    { id: 'cp_west', x: 34, y: 10, w: 1, h: 5, once: false, cond: guarded, run: (s) => PORT.checkpoint(s, -1) },
    { id: 'cp_east', x: 43, y: 10, w: 1, h: 5, once: false, cond: guarded, run: (s) => PORT.checkpoint(s, 1) },
  ],
  onEnter: (s) => PORT.roadEnter(s),
};
