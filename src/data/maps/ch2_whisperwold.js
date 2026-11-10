// Chapter 2 — the Whisperwold: the Murmuring Path (outer wood) and the Hollow (heart).
import OUTER from './layouts/c2_wold_outer.js';
import HEART from './layouts/c2_wold_heart.js';
import { WOLD, MERRY_SPOTS, merryDef } from '../../story/ch2_wold.js';
import { KINDLE } from '../../story/mount.js';
import { HART_LOOK, hasMount } from '../mount.js';

/** @type {Partial<import('../../types/data').MapDef>} shared by the maps below */
const forest = {
  mood: 'forest', music: 'forest', battleBg: 'wold', treeType: 'tree_autumn', particles: 'fireflies', region: 'The Whisperwold',
  backdrop: { plane: '#122016', y: -0.3 },
};
// Merry hides at spot k until found three times; if the Mother falls before anyone met
// her, she went up with the other voices and isn't there to meet.
const merryAt = (k) => (st) => (st.vars.c2_merry || 0) === k && !st.flags.c2_merry_found && !(st.flags.c2_mother_done && !st.flags.c2_merry_met);
const voice = (id, x, y, w, h, key) => ({ id, x, y, w, h, run: (s) => WOLD.passing(s, key) });

/** @type {import('../../types/data').MapDef} */
export const woldOuter = {
  ...OUTER, ...forest,
  id: 'c2_wold_outer', name: 'The Whisperwold',
  encounters: {
    rate: 1.1, bg: 'wold',
    troops: [['gw_wolves', 2], ['gw_spore', 2], ['gw_beetle', 2], ['gw_wisp', 2], ['c2_moths', 3], ['c2_saplings', 2], ['gw_thorn', 1]],
  },
  npcs: MERRY_SPOTS.map((_, k) => ({ ...merryDef(k), cond: merryAt(k) })),
  chests: [
    { id: 'wo_cradle', x: 17, y: 6, item: 'book_of_tides' },
    { id: 'wo_hollow', x: 21, y: 30, item: 'hi_tonic', count: 2 },
    { id: 'wo_overlook', x: 36, y: 7, item: 'ether', count: 3 },
    { id: 'wo_ring', x: 34, y: 19, item: 'vigor_seed' },
    { id: 'wo_grove1', x: 45, y: 31, item: 'ember_rod' },
    { id: 'wo_grove2', x: 45, y: 33, item: 'magic_fruit' },
  ],
  blockers: [{ id: 'thorns', x: 39, y: 27, w: 1, h: 2, prop: 'bush' }],
  inspect: [
    { x: 14, y: 4, hint: 'Listen', run: (s) => WOLD.cradleTree(s) },
    { x: 11, y: 31, hint: 'Listen', run: (s) => WOLD.joryTree(s) },
    { x: 41, y: 7, hint: 'Listen', run: (s) => WOLD.edrinTree(s) },
    { x: 47, y: 8, hint: 'Listen', run: (s) => WOLD.lysaTree(s) },
    { x: 20, y: 34, hint: 'Listen', run: (s) => WOLD.cantorTree(s) },
    { x: 29, y: 20, hint: 'Listen', run: (s) => WOLD.grandmotherTree(s) },
    { x: 39, y: 27, hint: 'Thorns', run: (s) => WOLD.thorns(s), cond: (st) => !st.flags['blocker:c2_wold_outer:thorns'] },
    { x: 39, y: 28, hint: 'Thorns', run: (s) => WOLD.thorns(s), cond: (st) => !st.flags['blocker:c2_wold_outer:thorns'] },
    { x: 48, y: 30, hint: 'Gravestone', run: (s) => WOLD.merryGrave(s) },
    { x: 26, y: 17, text: 'A standing stone, carved with spirals worn almost smooth. Moss has grown into the shape of a hand.' },
  ],
  exits: [
    { x: 0, y: 19, h: 3, to: 'c2_gale_road', tx: 58, ty: 11, dir: 'left' },
    { x: 51, y: 8, h: 3, to: 'c2_wold_heart', tx: 1, ty: 33, dir: 'right' },
  ],
  triggers: [
    voice('v_kettle', 9, 19, 2, 3, 'kettle'),
    voice('v_father', 15, 13, 3, 2, 'father'),
    voice('v_morning', 22, 19, 2, 3, 'morning'),
    voice('v_line', 34, 13, 3, 3, 'line'),
    voice('v_boats', 16, 25, 3, 2, 'boats'),
  ],
  onEnter: (s) => WOLD.enter(s),
};

/** @type {import('../../types/data').MapDef} */
export const woldHeart = {
  ...HEART, ...forest,
  id: 'c2_wold_heart', name: 'The Hollow',
  mood: (st) => (st.flags.c2_mother_done ? 'forest' : 'swamp'),
  music: (st) => (st.flags.c2_mother_done ? 'forest' : 'gloam'),
  particles: (st) => (st.flags.c2_mother_done ? 'fireflies' : 'gloam'),
  encounters: {
    rate: 1.0, bg: 'wold', cond: (st) => !st.flags.c2_mother_done,
    troops: [['c2_shades', 2], ['c2_shade_pair', 1], ['c2_moth_wisp', 2], ['c2_wold_mix', 2], ['gw_mix', 2], ['c2_saplings', 1]],
  },
  chests: [
    { id: 'wh_west', x: 3, y: 21, item: 'acolyte_robe' },
    { id: 'wh_north', x: 31, y: 2, item: 'power_fruit' },
    { id: 'wh_south', x: 25, y: 35, item: 'oak_staff' },
    { id: 'wh_hearth', x: 24, y: 6, item: 'ether', count: 2 },
  ],
  // Kindle the Emberhart waits by the Mother's tree once the dark has gone out of it.
  npcs: [
    { id: 'kindle', name: 'Emberhart', look: HART_LOOK, x: 33, y: 9, dir: 'left', hint: 'The hart', noTurn: true,
      cond: (st) => !!st.flags.c2_mother_done && !hasMount(st) && !st.flags.sundered, run: (s) => KINDLE.hollow(s) },
  ],
  blockers: [
    { id: 'roots', x: 21, y: 13, w: 3, h: 1, prop: 'tree_dead' },
    { id: 'exit_roots', x: 40, y: 6, w: 1, h: 3, prop: 'tree_dead' },
  ],
  inspect: [
    { x: 9, y: 31, hint: 'Read', run: (s) => WOLD.riddle(s) },
    { x: 36, y: 19, hint: 'Listen', run: (s) => WOLD.stone(s, 'cradle') },
    { x: 9, y: 12, hint: 'Listen', run: (s) => WOLD.stone(s, 'wedding') },
    { x: 9, y: 24, hint: 'Listen', run: (s) => WOLD.stone(s, 'grave') },
    { x: 22, y: 13, text: 'A wall of roots, twisted together like clasped hands. Behind it, violet light pulses slowly, like breathing.', cond: (st) => !st.flags.c2_roots_open },
    { x: 35, y: 6, hint: 'The Mother', cond: (st) => !!st.flags.c2_mother_done,
      run: async (s) => s.narrate('An old tree with a split trunk, hollow and quiet. Fireflies drift in and out of it as if they are visiting.') },
  ],
  exits: [
    { x: 0, y: 32, h: 3, to: 'c2_wold_outer', tx: 50, ty: 9, dir: 'left' },
    { x: 43, y: 6, h: 3, to: 'thistledown', tx: 1, ty: 18, dir: 'right' },
  ],
  triggers: [
    { id: 'mother', x: 29, y: 6, w: 11, h: 6, once: false, cond: (st) => !st.flags.c2_mother_done, run: (s) => WOLD.mother(s) },
  ],
};
