// Lanternfall interiors: Halloway house, Nana Brisa's, the Gull's Rest, Marlow's, Tobias's shack.
import WREN from './layouts/lf_wren_house.js';
import NANA from './layouts/lf_nana_house.js';
import INN from './layouts/lf_inn.js';
import STORE from './layouts/lf_store.js';
import TOBIAS from './layouts/lf_tobias.js';
import { PRO } from '../../story/prologue.js';
import { CH1 } from '../../story/ch1.js';

const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'town' };
const out = (x, y, tx, ty, w = 2) => ({ x, y, w, to: 'lanternfall', tx, ty, dir: 'down' });

/** @type {import('../../types/data').MapDef} */
export const lfWrenHouse = {
  ...WREN, ...interior,
  id: 'lf_wren_house', name: 'Halloway House',
  music: (st) => (st.flags.lfNight ? null : 'lanternfall'),
  mood: (st) => (st.flags.lfNight ? 'night' : st.flags.lfDusk || st.flags.p_brooch_done ? 'interior' : 'interior'),
  npcs: [
    { id: 'ysolde', name: 'Ysolde', look: 'ysolde', x: 6, y: 5, dir: 'left', cond: (st) => !st.flags.lfNight && !st.flags.kindled, run: (s) => PRO.ysoldeTalk(s) },
  ],
  inspect: [
    { x: 7, y: 2, text: 'Your father\'s books. Sea charts, star charts, a novel about a pirate queen with the last chapter torn out.' },
    { x: 8, y: 2, text: 'A shelf of your own books. Every one has washed ashore at some point. Most of them are still a little salty.' },
    { x: 1, y: 2, text: 'Your bed. Unmade, obviously.' },
    { x: 4, y: 4, text: 'Two plates. There have been two plates for seven years.' },
  ],
  exits: [out(4, 8, 16, 12)],
  onEnter: async (s) => {
    await PRO.opening(s);
    if (s.flag('p_brooch_done') && !s.flag('p_dinner')) await PRO.supper(s);
  },
};

/** @type {import('../../types/data').MapDef} */
export const lfNanaHouse = {
  ...NANA, ...interior,
  id: 'lf_nana_house', name: 'Nana Brisa\'s House',
  npcs: [
    { id: 'nana', name: 'Nana Brisa', look: 'nana_brisa', x: 4, y: 3, dir: 'down', run: (s) => PRO.nanaFirst(s) },
    { id: 'ilse', name: 'Ilse', look: 'ilse', x: 6, y: 4, dir: 'left', cond: (st) => !st.flags.p_brooch_quest,
      talk: ['Nana\'s been up since four, stewing kelp for tomorrow. The whole house smells like a tide pool.'] },
  ],
  inspect: [
    { x: 1, y: 2, text: 'Jars of dried herbs, labeled in Ilse\'s tiny, exact handwriting. One just says: DO NOT. LET WREN. TOUCH.' },
    { x: 5, y: 3, text: 'A cauldron of something green. It smells, generously, like the sea.' },
  ],
  exits: [out(4, 7, 24, 12)],
  onEnter: async (s) => { await CH1.namingSable(s); },
};

/** @type {import('../../types/data').MapDef} */
export const lfInn = {
  ...INN, ...interior,
  id: 'lf_inn', name: 'The Gull\'s Rest',
  npcs: [
    { id: 'keeper', name: 'Innkeeper Rosa', look: 'villager_40', x: 6, y: 3, dir: 'down', hint: 'Rest',
      run: async (s) => { await s.say('Innkeeper Rosa', 'A bed and a bowl of chowder, love? Ten gold.'); await s.inn(10, 'the Gull\'s Rest'); } },
    { id: 'bram_inn', name: 'Bram', look: 'bram', x: 10, y: 6, dir: 'left', cond: (st) => !st.flags.p_storm_done,
      talk: (s) => s.say('Bram', ['—and THEN I said, "Not today, Gloam-beast!" and I— oh! Wren. Ilse. Hello.', 'I was just telling these children about my many heroic deeds. All true. Mostly true. True in spirit.', 'Big day tomorrow! Don\'t worry about the Kindling. The light\'s never wrong. Mine said Warden and look at me. ...Don\'t look too closely.']) },
    { id: 'kidA', name: 'Child', look: 'villager_45', x: 9, y: 7, dir: 'right', cond: (st) => !st.flags.p_storm_done,
      talk: ['Bram says he fought a Gloam-beast with a spoon!'] },
    { id: 'sailorB', name: 'Sailor', look: 'villager_47', x: 2, y: 6, dir: 'right',
      talk: ['Came in from Port Gale last week. Mainland\'s jumpy. Talk of shadows in the Whisperwold. Lights going out in villages.', 'Folk say the Lanterns are getting tired. Like old men.'] },
  ],
  exits: [out(5, 9, 31, 15)],
};

/** @type {import('../../types/data').MapDef} */
export const lfStore = {
  ...STORE, ...interior,
  id: 'lf_store', name: 'Marlow\'s Goods',
  npcs: [
    { id: 'marlow', name: 'Marlow', look: 'villager_51', x: 4, y: 2, dir: 'down', hint: 'Shop',
      run: async (s) => { await s.say('Marlow', 'Tonics, charms, a sword or two. Kindling special: everything\'s the same price as always.'); await s.shop('lf_store'); } },
  ],
  exits: [out(4, 6, 10, 16)],
};

/** @type {import('../../types/data').MapDef} */
export const lfTobias = {
  ...TOBIAS, ...interior,
  id: 'lf_tobias', name: 'Tobias\'s Shack',
  inspect: [{ x: 5, y: 3, text: 'A crate of salted fish and a note: "MAELA — DON\'T." Below it, in different handwriting: "I DID."' }],
  chests: [{ id: 'tobias_chest', x: 1, y: 3, item: 'tonic', count: 2 }],
  exits: [out(3, 5, 37, 21)],
};
