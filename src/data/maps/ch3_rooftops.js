// The rooftop chase above the Bell Market, and Sable's dream (Chapter 3).
import ROOFS from './layouts/c3_rooftops.js';
import DREAM from './layouts/c3_dream.js';
import { CH3 } from '../../story/ch3.js';
import { SIDE } from '../../story/ch3_side.js';
import { streetLeaps } from '../../story/ch3_fx.js';

const chasing = (st) => st.flags.c3_chase && !st.flags.c3_pip_joined;

export const c3Rooftops = {
  ...ROOFS,
  id: 'c3_rooftops', name: 'The Rooftops', region: 'Above the Bell Market',
  legend: {
    1: { top: 'roof_red', side: 'wall_plaster' },
    2: { top: 'roof_slate', side: 'wall_stone' },
    3: { top: 'roof_blue', side: 'wall_timber' },
    4: { top: 'roof_green', side: 'wall_brick' },
    5: { top: 'roof_thatch', side: 'wall_wood' },
  },
  mood: 'day',
  music: (st) => (chasing(st) ? 'tension' : 'aurenne'),
  backdrop: { plane: '#3e3a36', y: -1 },
  battleBg: 'town',
  particles: 'leaves',
  encounters: { rate: 0.5, bg: 'town', cond: (st) => st.flags.c3_roof_t1,
    troops: [['c3_rooks', 3], ['c3_rook_gargoyle', 2], ['c3_gargoyles', 1]] },
  npcs: [
    { id: 'pip_b', name: '???', look: 'pip', x: 20, y: 11, dir: 'left', cond: (st) => st.flags.c3_roof_intro && !st.flags.c3_roof_t1 },
    { id: 'pip_nook', name: 'Pip', look: 'pip', x: 39, y: 7, dir: 'down', cond: (st) => st.flags.c3_roof_t1 && !st.flags.c3_pip_joined, run: (s) => CH3.cornered(s) },
    { id: 'pounce', name: 'Sir Pounce', look: 'c3_cat', x: 29, y: 2, dir: 'left', cond: (st) => st.flags.c3_pip_joined && !st.flags.c3_cat_found, run: (s) => SIDE.findCat(s) },
  ],
  chests: [
    { id: 'c3_rf_a', x: 1, y: 8, item: 'ether', count: 2 },
    { id: 'c3_rf_b', x: 12, y: 5, item: 'hi_tonic', count: 2 },
    { id: 'c3_rf_e', x: 30, y: 1, item: 'power_fruit' },
    { id: 'c3_rf_f', x: 33, y: 22, item: 'steel_dirk' },
    { id: 'c3_rf_stash', x: 41, y: 8, item: 'lucky_coin' },
  ],
  inspect: [
    ...streetLeaps('x', 10, 11, 8, 16),
    ...streetLeaps('x', 21, 22, 9, 16),
    ...streetLeaps('x', 32, 33, 9, 16),
    ...streetLeaps('y', 4, 4, 13, 20),
    ...streetLeaps('y', 18, 18, 23, 31),
    { x: 41, y: 6, run: async (s) => {
      await s.narrate('Charcoal drawings on the bell tower wall: four stick-children wearing crowns. Under them, in careful letters: *THE GUTTER CORT · PIP · NELL · TUCK · WICK.* Two of the crowns have been rubbed out and drawn back in, darker.');
      if (s.state.party.includes('pip')) await s.say('Pip', '...Don\'t look at that. That\'s private property. Of the Court.');
    } },
    { x: 42, y: 9, text: 'From up here you can see the whole City of Bells: the Cathedral, the Grand Lantern, and far off to the south, the brown thread of the Pilgrim Road.' },
  ],
  exits: [
    { x: 1, y: 14, h: 3, to: 'aurenne', tx: 9, ty: 35, dir: 'down', cond: (st) => st.flags.c3_pip_joined,
      blocked: async (s) => { await s.say('Wren', 'No time — he\'s getting away!'); await s.step('player', 1, 0); } },
  ],
  triggers: [
    { id: 'taunt', x: 12, y: 6, w: 3, h: 12, once: false, cond: (st) => st.flags.c3_roof_intro && !st.flags.c3_roof_t1, run: (s) => CH3.roofTaunt(s) },
    { id: 'rooks', x: 16, y: 5, w: 2, h: 13, cond: chasing, run: (s) => CH3.roofRooks(s) },
    { id: 'hole', x: 23, y: 9, w: 3, h: 9, cond: chasing, run: (s) => CH3.roofHole(s) },
    { id: 'corner', x: 34, y: 9, w: 4, h: 9, once: false, cond: (st) => st.flags.c3_roof_t1 && !st.flags.c3_pip_joined, run: (s) => CH3.cornered(s) },
  ],
  onEnter: (s) => CH3.roofIntro(s),
};

const festival = (id, look, x, y, line) => ({ id, name: 'Festival-goer', look, x, y, dir: 'down', cond: (st) => !st.flags.c3_dream_done,
  talk: (s) => s.say('???', line, { portrait: false }) });

export const c3Dream = {
  ...DREAM,
  id: 'c3_dream', name: 'Aurenne', region: 'Forty Summers Ago',
  solo: true, // a dream: the leader walks it alone (no followers)
  mood: 'evernoon', music: 'evernoon', particles: 'motes_gold', noMenu: true, battleBg: 'evernoon',
  npcs: [
    { id: 'boy', name: 'Boy', look: 'cassian_young', x: 13, y: 8, dir: 'up', cond: (st) => !st.flags.c3_dream_done, run: (s) => CH3.dreamClimax(s) },
    festival('fest1', 'villager_50', 5, 10, 'The bells will ring at noon! And at noon tomorrow! And the noon after that!'),
    festival('fest2', 'villager_51', 20, 11, 'What a summer, eh? Feels like it\'ll never end.'),
    festival('fest3', 'villager_52', 8, 14, 'Lysa! Your brother\'s looking for you. He\'s _always_ looking for you.'),
    festival('fest4', 'villager_53', 18, 15, 'Hush — the Keeper\'s going up. Watch the gallery. It\'s the best part.'),
  ],
  triggers: [
    { id: 'climax', x: 9, y: 9, w: 9, h: 2, once: false, cond: (st) => !st.flags.c3_dream_done, run: (s) => CH3.dreamClimax(s) },
  ],
  onEnter: (s) => CH3.dreamOpen(s),
};
