// The Lantern hall, the Tide Caves and the strait crossing.
import LANTERN from './layouts/lf_lantern.js';
import CAVES from './layouts/lf_tidecaves.js';
import SEA from './layouts/sea_crossing.js';
import { PRO } from '../../story/prologue.js';
import { CH1 } from '../../story/ch1.js';

/** @type {import('../../types/data').MapDef} */
export const lfLantern = {
  ...LANTERN,
  id: 'lf_lantern', name: 'The Lantern of Lanternfall', mood: 'temple', music: 'kindling',
  camera: { dist: 17, pitch: 0.72 }, noBanner: false, particles: 'motes_gold',
  inspect: [
    { x: 7, y: 3, hint: 'The Lamp', run: async (s) => s.narrate(['The great lamp of Lanternfall. Inside the glass, something like a small sun sleeps in a bed of brass.', 'The Dawnstone. Warm as a hand.']) },
  ],
  exits: [{ x: 6, y: 12, w: 3, to: 'lanternfall', tx: 8, ty: 6, dir: 'down' }],
  onEnter: async (s) => {
    if (s.flag('ch1_named') && !s.flag('kindled')) await CH1.kindling(s);
    else if (s.flag('ch1_evening') && !s.flag('ch1_overheard')) await CH1.overhear(s);
  },
};

/** @type {import('../../types/data').MapDef} */
export const lfTideCaves = {
  ...CAVES,
  id: 'lf_tidecaves', name: 'The Tide Caves', region: 'Lanternfall', mood: 'cave', music: 'cave', noTravel: true,
  scatter: { types: ['rock_small', 'mushroom_glow'], density: 0.04, seed: 79 },
  battleBg: 'tidecave',
  encounters: { rate: 1.1, troops: [['tc_bats', 3], ['tc_eel', 1], ['tc_jelly3', 2], ['tc_mix', 2], ['lf_jelly_crab', 2]] },
  chests: [
    { id: 'c1', x: 4, y: 26, item: 'ember_feather' },
    { id: 'c2', x: 12, y: 6, gold: 80 },
    { id: 'c3', x: 28, y: 21, item: 'tonic', count: 3 },
    { id: 'c4', x: 40, y: 9, item: 'copper_ring' },
  ],
  triggers: [
    { id: 'brooch', x: 34, y: 22, w: 5, h: 4, once: false, cond: (st) => !st.flags.p_brooch_got, run: (s) => PRO.brooch(s) },
    { id: 'entry_talk', x: 2, y: 14, w: 2, h: 5, run: async (s) => {
      await s.say('Ilse', 'It smells like low tide and bad decisions.');
      await s.say('Wren', 'It smells like *adventure*.');
      await s.say('Ilse', 'That\'s what I said.');
      // The first place monsters roam: how to stay alive in a dungeon.
      await s.system('Tip — Monsters roam the caves, and HP doesn\'t recover between battles. Use *Tonics* from the menu, and rest at the golden *Hearthstone* deeper in. If a fight turns against you, *Flee* (each try is likelier to work). Entering a new area autosaves.');
    } },
  ],
  inspect: [{ x: 39, y: 27, text: 'A violet crystal, half-sunk in the rock. It is cold enough to hurt. You get the feeling it is listening.', cond: (st) => st.flags.p_brooch_got }],
  exits: [{ x: 0, y: 15, h: 3, to: 'lanternfall', tx: 43, ty: 16, dir: 'left' }],
};

/** @type {import('../../types/data').MapDef} */
export const seaCrossing = {
  ...SEA,
  id: 'sea_crossing', name: 'The Strait', region: 'Westmost Sea', mood: 'day', music: 'sea', backdrop: 'ocean', noTravel: true,
  camera: { dist: 16, pitch: 0.7 }, noMenu: false, battleBg: 'deck',
  npcs: [
    { id: 'tobias_b', name: 'Fisher Tobias', look: 'tobias', x: 16, y: 7, dir: 'left', talk: ['Keep your weight low. She bucks in a swell.'] },
  ],
  onEnter: (s) => CH1.crossing(s),
};
