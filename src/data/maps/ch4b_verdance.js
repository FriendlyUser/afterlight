// Chapter 4b — Verdance: Rootholm, the Thornwood (the Tangle) and the Heartwood grove.
// Story beats live in src/story/ch4b_verdance.js.
import ROOT from './layouts/c4b_verdance.js';
import TANGLE from './layouts/c4b_thornwood.js';
import HEART from './layouts/c4b_heartwood.js';
import { C4V } from '../../story/ch4b_verdance.js';

const at = (L, k) => ({ x: L.spots[k][0], y: L.spots[k][1] });
const f = (name) => (st) => !!st.flags[name];
const nf = (name) => (st) => !st.flags[name];
const FOREST_BACKDROP = { plane: '#1e3020', y: -0.2 };

// =====================================================================
// Rootholm
// =====================================================================
const rootholm = {
  ...ROOT, backdrop: FOREST_BACKDROP,
  id: 'c4b_verdance', name: 'Rootholm', region: 'Verdance',
  mood: 'forest', music: 'forest', battleBg: 'verdance', treeType: 'tree', particles: 'leaves',
  encounters: {
    rate: 1, bg: 'verdance', onTiles: '"',
    troops: [['c4b_vd_briars', 3], ['c4b_vd_boars', 2], ['c4b_vd_moths', 2], ['c4b_vd_mix', 2]],
  },
  signs: [{ x: 20, y: 5, text: 'THE THORNWOOD.\nKeeper\'s grove beyond. Walk softly; the trees are listening.\n_(Underneath, newer, in charcoal: CLOSED. THORNS. DO NOT.)_' }],
  npcs: [
    { id: 'bracken', name: 'Elder Bracken', look: 'c4b_bracken', ...at(ROOT, 'elder'), dir: 'down', run: (s) => C4V.bracken(s) },
    { id: 'fern', name: 'Fern', look: 'c4b_fern', ...at(ROOT, 'fern'), dir: 'down', hint: 'Shop',
      run: async (s) => { await s.say('Fern', 'Forage, fletching, and things that fix you. Mostly the first two. Have a look.'); await s.shop('c4b_rootholm'); } },
    { id: 'ama', name: 'Ama', look: 'villager_22', ...at(ROOT, 'innkeep'), dir: 'down', hint: 'Rest',
      run: async (s) => { await s.say('Ama', 'The Hollow Log. Hollow log, soft moss, warm stew. Seventy gold, and I\'ll even let you choose which log.'); await s.inn(70, 'the Hollow Log'); } },
    { id: 'holm', name: 'Old Holm', look: 'villager_17', ...at(ROOT, 'gatekeeper'), dir: 'down', run: (s) => C4V.holm(s) },
    { id: 'hazel', name: 'Hazel', look: 'villager_30', ...at(ROOT, 'mother1'), dir: 'down', run: (s) => C4V.parent(s, 'hazel') },
    { id: 'juniper', name: 'Juniper', look: 'villager_38', ...at(ROOT, 'mother2'), dir: 'down', run: (s) => C4V.parent(s, 'juniper') },
    { id: 'rowan', name: 'Rowan', look: 'villager_25', ...at(ROOT, 'father3'), dir: 'right', run: (s) => C4V.parent(s, 'rowan') },
    { id: 'aspen', name: 'Aspen', look: 'villager_11', ...at(ROOT, 'woodcutter'), dir: 'left',
      talk: ['The soldiers came a month back. Fifty of them, white and gold, the Hierophant\'s sun on every shield.', 'The big one with the beard didn\'t even go in. Sat on my woodpile eating our apples while his men carried the Keeper\'s light out in a box.', 'Didn\'t pay for the apples, either.'] },
    { id: 'linden', name: 'Linden', look: 'villager_44', ...at(ROOT, 'poet'), dir: 'right',
      talk: (s) => s.say('Linden', s.flag('c4b_elowen_done')
        ? ['You\'ve seen her? Truly? Is she — is she very old?', 'Of course she is. I only meant — is she very _kind_? I always imagined she was.']
        : ['I\'m writing an epic about Keeper Elowen. Nobody in Rootholm has seen her in thirty years.', 'Some say she is four hundred years old. Some say she has turned into a tree. I have rhymed both possibilities, just in case.']) },
    { id: 'willa', name: 'Willa', look: 'villager_50', ...at(ROOT, 'tree_front'), dir: 'up', run: (s) => C4V.willa(s) },
    { id: 'wick_h', name: 'Wick', look: 'c4b_sapling', ...at(ROOT, 'child'), dir: 'down', wander: 1, cond: f('c4b_wick'),
      talk: ['I\'m not allowed in the Tangle any more. Or near the Tangle. Or near anyone who\'s been near the Tangle.', 'Mum\'s very thorough.'] },
    { id: 'bryony_h', name: 'Bryony', look: 'c4b_sapling2', x: 22, y: 21, dir: 'up', cond: f('c4b_bryony'),
      talk: ['I tied a ribbon for Gran on the Memory Tree. A yellow one. She liked yellow.', 'The pretty lights in the forest weren\'t her. Ilse said. Ilse says it\'s all right to miss her anyway.'] },
    { id: 'tamsel_h', name: 'Tamsel', look: 'villager_9', x: 25, y: 13, dir: 'down', cond: f('c4b_tamsel'),
      talk: ['When I\'m sixteen I\'m going to be a Warden like the big one. Or a Rogue like the small one.', 'He said I could be both. He said that\'s allowed now. Is that allowed now?'] },
  ],
  chests: [
    { id: 'brook', ...at(ROOT, 'c_brook'), item: 'starsteel_recurve' },
    { id: 'grove', ...at(ROOT, 'c_grove'), item: 'spirit_fruit' },
    { id: 'north', ...at(ROOT, 'c_north'), gold: 1500 },
  ],
  inspect: [
    { ...at(ROOT, 'tree'), hint: 'The Memory Tree', run: (s) => C4V.memoryTree(s) },
    { x: 23, y: 16, hint: 'The Memory Tree', run: (s) => C4V.memoryTree(s) },
    { x: 29, y: 18, text: 'Fern\'s crates: bundles of arrows fletched with jay feathers, jars of honey, a sign reading NO HAGGLING, and under it, smaller: (a little haggling).' },
  ],
  exits: [
    { x: 0, y: 26, h: 3, to: '@world' },
    { x: 22, y: 0, w: 3, to: 'c4b_thornwood', tx: 24, ty: 44, dir: 'up', cond: f('c4b_verdance_arrived') },
  ],
  onEnter: (s) => C4V.arrival(s),
};

// =====================================================================
// The Thornwood — the Tangle
// =====================================================================
const T = TANGLE.spots;
const thornwood = {
  ...TANGLE, backdrop: FOREST_BACKDROP,
  id: 'c4b_thornwood', name: 'The Thornwood', region: 'Verdance',
  mood: 'forest', music: 'forest', battleBg: 'verdance', treeType: 'tree', particles: 'gloam',
  camera: { dist: 18, pitch: 0.72 },
  encounters: {
    rate: 1.1, bg: 'verdance', onTiles: 'o,',
    troops: [['c4b_tw_mantis', 3], ['c4b_tw_weavers', 2], ['c4b_tw_root', 2], ['c4b_tw_lights', 2], ['c4b_tw_mix', 3], ['c4b_vd_moths', 1]],
  },
  npcs: [
    { id: 'wick', name: 'Wick', look: 'c4b_sapling', ...at(TANGLE, 'wick'), dir: 'down', cond: nf('c4b_wick'), run: (s) => C4V.wick(s) },
    { id: 'bryony', name: 'Bryony', look: 'c4b_sapling2', ...at(TANGLE, 'bryony'), dir: 'down', cond: nf('c4b_bryony'), run: (s) => C4V.bryony(s) },
    { id: 'tamsel', name: 'Tamsel', look: 'villager_9', ...at(TANGLE, 'tamsel'), dir: 'down', cond: nf('c4b_tamsel'), run: (s) => C4V.tamsel(s) },
  ],
  chests: [
    { id: 'glade1', x: T.c_glade1[0], y: T.c_glade1[1], item: 'hi_tonic', count: 3 },
    { id: 'west', x: T.c_west[0], y: T.c_west[1], item: 'starsteel_claymore' },
    { id: 'east', x: T.c_east[0], y: T.c_east[1], item: 'hi_ether', count: 2 },
    { id: 'bryony', x: T.c_bryony[0], y: T.c_bryony[1], item: 'starglass_rod' },
    { id: 'glade2', x: T.c_glade2[0], y: T.c_glade2[1], item: 'star_atlas' },
    { id: 'tamsel', x: T.c_tamsel[0], y: T.c_tamsel[1], item: 'crest_tome' },
    { id: 'save', x: T.c_save[0], y: T.c_save[1], item: 'ember_feather', count: 2 },
  ],
  blockers: [
    { id: 'thornA', x: T.thornA[0], y: T.thornA[1], w: 3, prop: 'crystal_gloam' },
    { id: 'thornB', x: T.thornB[0], y: T.thornB[1], h: 3, prop: 'crystal_gloam' },
    { id: 'thornC', x: T.thornC[0], y: T.thornC[1], w: 3, prop: 'crystal_gloam' },
  ],
  inspect: [
    { x: T.thornA[0] + 1, y: T.thornA[1], hint: 'Thorns', cond: nf('blocker:c4b_thornwood:thornA'), run: (s) => C4V.thorns(s, 'thornA') },
    { x: T.thornB[0], y: T.thornB[1] + 1, hint: 'Thorns', cond: nf('blocker:c4b_thornwood:thornB'), run: (s) => C4V.thorns(s, 'thornB') },
    { x: T.thornC[0] + 1, y: T.thornC[1], hint: 'Thorns', cond: nf('blocker:c4b_thornwood:thornC'), run: (s) => C4V.thorns(s, 'thornC') },
    { x: 24, y: 26, text: 'A statue of a Keeper, so old that her face has worn smooth. Somebody — recently — has put a crown of daisies on her head.' },
  ],
  exits: [
    { x: 22, y: 45, w: 5, to: 'c4b_verdance', tx: 23, ty: 2, dir: 'down' },
    { x: 23, y: 0, w: 3, to: 'c4b_heartwood', tx: 16, ty: 23, dir: 'up', cond: f('c4b_hollowbark_beaten') },
  ],
  triggers: [
    { id: 'enter', x: 22, y: 40, w: 5, h: 3, run: (s) => C4V.tangleEnter(s) },
    { id: 'warden', x: 20, y: 8, w: 9, h: 2, once: false, cond: nf('c4b_hollowbark_beaten'), run: (s) => C4V.hollowbark(s) },
  ],
};

// =====================================================================
// The Heartwood — Elowen's grove
// =====================================================================
const heartwood = {
  ...HEART, backdrop: FOREST_BACKDROP,
  id: 'c4b_heartwood', name: 'The Heartwood', region: 'Verdance',
  mood: (st) => (st.flags.c4b_heart_night && !st.flags.c4b_elowen_done ? 'night' : 'forest'),
  music: (st) => (st.flags.c4b_heart_night && !st.flags.c4b_elowen_done ? 'sad' : 'forest'),
  battleBg: 'verdance', treeType: 'tree', particles: 'fireflies', camera: { dist: 17, pitch: 0.7 },
  npcs: [
    { id: 'elowen', name: 'Elowen', look: 'elowen', ...at(HEART, 'elowen'), dir: 'down', cond: f('c4b_elowen_story'), run: (s) => C4V.elowen(s) },
  ],
  chests: [{ id: 'garden', x: 24, y: 12, item: 'wisdom_seed', count: 2 }],
  inspect: [
    { x: 16, y: 8, hint: 'The Lantern', run: async (s) => s.narrate(['The Lantern of Thornwood. Roots have climbed it to the gallery; blossom grows inside the lamp-glass.', 'The cradle at its heart is empty. A bird has started a nest in it.']) },
  ],
  exits: [
    { x: 14, y: 25, w: 4, to: 'c4b_thornwood', tx: 24, ty: 2, dir: 'down' },
    { x: 0, y: 15, h: 2, to: '@world', cond: f('c4b_elowen_farewell'),
      blocked: async (s) => { await s.narrate('The trees here grow too close to pass. For now.'); await s.step('player', 1, 0); } },
  ],
  onEnter: (s) => C4V.heartEnter(s),
};

export const VERDANCE_MAPS = [rootholm, thornwood, heartwood];
