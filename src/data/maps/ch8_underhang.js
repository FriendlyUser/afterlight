// Chapter 8 — the Underhang and the wreck of the Vigil.
import UH from './layouts/c8_underhang.js';
import VW from './layouts/c8_vigil_wreck.js';
import { CH8 } from '../../story/ch8.js';
import { LOST_QUESTS } from '../../story/lost.js';

/** @type {import('../../types/data').MapDef} */
export const underhang = {
  ...UH,
  id: 'c8_underhang', name: 'The Underhang', region: 'Beneath Kiteholm',
  blockers: [{ id: 'lc_kitewright', x: 17, y: 39, w: 1, h: 1, prop: 'crystal' }],
  mood: 'ruin', music: 'field', particles: 'dust_sand', battleBg: 'ruin',
  backdrop: { plane: '#1a0e24', y: -16 },
  camera: { dist: 20, pitch: 0.72 },
  encounters: {
    rate: 1, onTiles: 'c=+',
    troops: [['c8_shrikes', 3], ['c8_crawlers', 2], ['c8_shrike_crawler', 2], ['c8_golems', 2], ['c8_sky_eels', 1]],
  },
  chests: [
    { id: 'a', x: 23, y: 5, item: 'hi_ether', count: 2 },
    { id: 'b', x: 3, y: 3, item: 'ashen_fang' },
    { id: 'c', x: 7, y: 9, item: 'mega_tonic', count: 2 },
    { id: 'd', x: 9, y: 19, item: 'ashen_bulwark' },
    { id: 'e', x: 24, y: 11, item: 'magic_fruit' },
    { id: 'f', x: 37, y: 22, gold: 2200 },
    { id: 'g', x: 31, y: 33, item: 'dawn_plume' },
    { id: 'h', x: 14, y: 35, item: 'tonic_mist', count: 2 },
  ],
  inspect: [
    { x: 17, y: 39, hint: 'Crest-glass', run: (s) => LOST_QUESTS.shrine(s, 'kitewright') },
    { x: 22, y: 9, hint: 'Satchel', run: (s) => CH8.scoutNiche(s) },
    { x: 8, y: 21, hint: 'Nest', run: (s) => CH8.wickKite(s) },
    { x: 20, y: 23, text: 'A rope bridge that used to go straight down to the lower shelf. The ropes have been cut — cleanly. Someone did not want company.' },
    { x: 38, y: 16, text: 'A kite-tail snagged on the rocks, faded almost white. Somebody\'s, once.' },
    { x: 15, y: 38, text: 'The split prow of a Choir galleon, driven into the rock like a nail. Gilt letters on the hull, half burned away: _VIGIL_.' },
  ],
  exits: [
    { x: 19, y: 0, w: 3, to: 'kiteholm', tx: 23, ty: 37, dir: 'up' },
    { x: 15, y: 43, w: 6, to: 'c8_vigil_wreck', tx: 1, ty: 15, dir: 'right' },
  ],
  triggers: [
    { id: 'c8_uh_entry', x: 17, y: 3, w: 7, h: 2, run: (s) => CH8.underhangEntry(s) },
    { id: 'c8_uh_pip', x: 29, y: 16, w: 3, h: 2, once: false, cond: (st) => !st.flags.c8_pip_found, run: (s) => CH8.findPip(s) },
  ],
};

/** @type {import('../../types/data').MapDef} */
export const vigilWreck = {
  ...VW,
  id: 'c8_vigil_wreck', name: 'Wreck of the Vigil', region: 'Beneath Kiteholm',
  mood: 'cave', music: (st) => (st.flags.c8_engine_done ? 'cave' : 'tension'), particles: 'dust', battleBg: 'ruin',
  camera: { dist: 18, pitch: 0.74 },
  encounters: {
    rate: 1, onTiles: '+=x', cond: (st) => !st.flags.c8_engine_done,
    troops: [['c8_raiders', 3], ['c8_hollow_pair', 2], ['c8_golems', 1], ['c8_wisp_mix', 2], ['c8_raider_mix', 2]],
  },
  chests: [
    { id: 'a', x: 3, y: 12, item: 'ashen_armor' },
    { id: 'b', x: 12, y: 12, item: 'scrap_gear', count: 2 },
    { id: 'c', x: 25, y: 7, item: 'ashen_helm' },
    { id: 'd', x: 18, y: 7, item: 'x_ether' },
    { id: 'e', x: 41, y: 26, item: 'elixir' },
    { id: 'f', x: 30, y: 26, gold: 3000 },
    { id: 'g', x: 42, y: 19, item: 'ember_feather', count: 3 },
    { id: 'h', x: 26, y: 27, item: 'scrap_gear' },
  ],
  npcs: [
    { id: 'wick_sl', name: 'Wick', look: 'wick', x: 16, y: 25, dir: 'up', cond: (st) => st.flags.c8_brig_seen && !st.flags.c8_engine_done,
      talk: (s) => s.narrate('Wick is asleep, smiling. "...five more minutes..."') },
    { id: 'moth_sl', name: 'Moth', look: 'moth', x: 20, y: 26, dir: 'up', cond: (st) => st.flags.c8_brig_seen && !st.flags.c8_engine_done,
      talk: (s) => s.narrate('Moth is asleep. Her lips move: "...so many candles..."') },
    { id: 'kid_sl', name: 'Sleeping Child', look: 'c8_kite_c', x: 24, y: 25, dir: 'up', cond: (st) => st.flags.c8_brig_seen && !st.flags.c8_engine_done,
      talk: (s) => s.narrate('A child from another shard. You don\'t know her name. In her sleep she is holding a hand that isn\'t there.') },
  ],
  blockers: [{ id: 'c8_brig_door', x: 20, y: 19, w: 2, h: 1, prop: 'fence' }],
  inspect: [
    { x: 20, y: 4, hint: 'Desk', run: (s) => CH8.captainsDesk(s) },
    { x: 21, y: 4, hint: 'Desk', run: (s) => CH8.captainsDesk(s) },
    { x: 20, y: 19, hint: 'Brig door', cond: (st) => !st.flags.c8_brig_open, run: (s) => CH8.brigDoor(s) },
    { x: 21, y: 19, hint: 'Brig door', cond: (st) => !st.flags.c8_brig_open, run: (s) => CH8.brigDoor(s) },
    { x: 7, y: 16, text: 'A breach in the hull. Through it: the underside of the world, and wind, and a long way down.' },
    { x: 16, y: 3, text: 'The captain\'s shelf. Hymnals, a logbook, and a child\'s drawing of the sun, pinned up carefully. The sun has a face. It is smiling. It is not moving.' },
    { x: 39, y: 6, text: 'Gloam crystals grown through the deck like teeth. They hum in the same key as the lullaby.' },
  ],
  exits: [{ x: 0, y: 13, w: 1, h: 4, to: 'c8_underhang', tx: 17, ty: 41, dir: 'up' }],
  triggers: [
    { id: 'c8_vw_entry', x: 3, y: 13, w: 2, h: 4, run: (s) => CH8.wreckEntry(s) },
    { id: 'c8_vw_brig', x: 20, y: 21, w: 2, h: 1, cond: (st) => st.flags.c8_brig_open, run: (s) => CH8.brig(s) },
    { id: 'c8_vw_gate', x: 35, y: 12, w: 1, h: 7, once: false, cond: (st) => !st.flags.c8_brig_seen,
      run: async (s) => {
        await s.narrate('The lullaby swells, sweet and endless, from the bow. Somewhere in this ship, children are sleeping. Find them first.');
        await s.step('player', -1, 0);
      } },
    { id: 'c8_vw_engine', x: 36, y: 12, w: 1, h: 7, once: false, cond: (st) => st.flags.c8_brig_seen && !st.flags.c8_engine_done, run: (s) => CH8.engine(s) },
  ],
};
