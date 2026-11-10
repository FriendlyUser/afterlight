// Ch9 dungeons: the Boneyard, the wreck of the Benediction (+ captain's cabin),
// the Cinderdeep, and the Halcyon's maiden flight.
import BONEYARD from './layouts/c9_boneyard.js';
import BENEDICTION from './layouts/c9_benediction.js';
import CABIN from './layouts/c9_benediction_cabin.js';
import CINDER from './layouts/c9_cinderdeep.js';
import FLIGHT from './layouts/c9_halcyon_flight.js';
import { CH9 } from '../../story/ch9.js';
import { CH9_SIDE } from '../../story/ch9_side.js';

const toRoost = { to: 'corvins_roost', tx: 5, ty: 19, dir: 'right' };

/** @type {import('../../types/data').MapDef} */
export const boneyard = {
  ...BONEYARD,
  id: 'c9_boneyard', name: 'The Boneyard', region: 'Beneath Corvin\'s Roost',
  mood: 'ruin', music: 'ruin', battleBg: 'ruin', particles: 'ash',
  encounters: { rate: 1, troops: [['c9_by_rats', 3], ['c9_by_golem', 2], ['c9_by_crows', 2], ['c9_by_pickers', 2], ['c9_by_mix', 2]] },
  chests: [
    { id: 'nw1', x: 2, y: 6, item: 'mega_tonic', count: 2 },
    { id: 'nw2', x: 13, y: 7, item: 'sunshard_greatsword' },
    { id: 'gulch', x: 5, y: 24, item: 'hi_ether', count: 3 },
    { id: 'yard_sw', x: 16, y: 32, gold: 3000 },
    { id: 'marigold', x: 16, y: 18, item: 'sunshard_vest' },
    { id: 'hub_s', x: 31, y: 25, item: 'dawn_plume' },
    { id: 'se1', x: 44, y: 23, item: 'sunshard_helm' },
    { id: 'se2', x: 33, y: 32, item: 'frost_bomb', count: 3 },
    { id: 'north', x: 40, y: 10, item: 'power_fruit' },
    { id: 'foreman', x: 31, y: 2, item: 'x_tonic', count: 2 },
  ],
  blockers: [
    { id: 'gate', x: 36, y: 8, w: 3, h: 1, prop: 'crate' },
    { id: 'heap', x: 18, y: 25, w: 1, h: 2, prop: 'rock' },
  ],
  inspect: [
    { x: 4, y: 4, hint: 'Winch', run: (s) => CH9.winch(s, 'nw') },
    { x: 44, y: 32, hint: 'Winch', run: (s) => CH9.winch(s, 'se') },
    { x: 16, y: 16, text: ['The Marigold. A sky-ferry. Forty seats, still bolted in, all facing the windows.', 'On one seat, a paper bag of sweets, unopened. Someone was saving them for the view.'] },
    { x: 12, y: 3, hint: 'Crane-tower', run: (s) => CH9_SIDE.vantage(s, 'boneyard', [
      'You climb the crane-tower. From the top, the Boneyard is a river of broken ships, running all the way down the canyon to the dark.',
      'Far to the north-east, three bright shards hang in a slanting line, as if someone had thrown them and they never landed.',
    ]) },
    { x: 40, y: 27, hint: 'Strongbox', run: async (s) => {
      if (s.flag('c9_mimic_done')) return s.narrate('The strongbox lies open and quiet. Whatever it was, it is only a box now.');
      await s.narrate('A gilded strongbox, half-buried beside the upturned hull of the Gilded Gull. The lock is shaped like a smile.');
      if (!(await s.confirm('Pry it open?'))) return;
      await s.narrate('The smile gets wider.');
      const r = await s.battle('c9_mimic', { bg: 'ruin' });
      if (r === 'win') s.setFlag('c9_mimic_done');
    } },
    { x: 37, y: 26, text: 'The Gilded Gull, lying on her back like a beetle. Her lift-coil housing is empty, torn open from the inside.' },
  ],
  triggers: [
    { id: 'entry', x: 2, y: 28, w: 6, h: 6, run: (s) => CH9.boneyardEntry(s) },
    { id: 'foreman', x: 31, y: 1, w: 14, h: 6, once: false, cond: (st) => !st.flags.c9_part_coil, run: (s) => CH9.foreman(s) },
  ],
  exits: [{ x: 2, y: 33, w: 2, to: 'corvins_roost', tx: 40, ty: 21, dir: 'left' }],
};

/** @type {import('../../types/data').MapDef} */
export const benediction = {
  ...BENEDICTION,
  id: 'c9_benediction', name: 'Wreck of the Benediction', region: 'The Squall',
  mood: 'dusk',
  music: (st) => (st.flags.c9_part_sail ? 'sad' : 'gloam'),
  particles: (st) => (st.flags.c9_part_sail ? 'embers_soft' : 'rain'),
  battleBg: 'deck', camera: { dist: 22, pitch: 0.72 },
  encounters: { rate: 1.1, troops: [['c9_bn_pilgrims', 3], ['c9_bn_harpies', 2], ['c9_bn_spiders', 2], ['c9_bn_jelly', 2], ['c9_bn_templar', 2]] },
  chests: [
    { id: 'fore1', x: 19, y: 8, item: 'holy_water', count: 4 },
    { id: 'fore2', x: 26, y: 6, item: 'sunshard_dagger' },
    { id: 'main', x: 28, y: 22, item: 'sunshard_robe' },
    { id: 'quarter', x: 18, y: 26, item: 'mega_tonic', count: 2 },
    { id: 'stern', x: 27, y: 29, item: 'sunshard_bow' },
    { id: 'hold1', x: 40, y: 20, gold: 4000 },
    { id: 'hold2', x: 34, y: 22, item: 'sunshard_harp' },
    { id: 'islet', x: 2, y: 13, item: 'spirit_fruit' },
    { id: 'crag', x: 11, y: 18, item: 'sunshard_shield' },
    { id: 'crag_se', x: 30, y: 31, item: 'tonic_mist', count: 2 },
  ],
  blockers: [{ id: 'ward', x: 23, y: 17, prop: 'crystal' }],
  inspect: [
    { x: 23, y: 8, hint: 'Censer', run: (s) => CH9.censer(s, 'fore') },
    { x: 38, y: 16, hint: 'Censer', run: (s) => CH9.censer(s, 'hold') },
    { x: 19, y: 21, text: ['Luggage, still strapped to the rail. A name-tag: TILDE, AGED 9, TO AURENNE. PLEASE RETURN IF LOST.', 'Nobody did.'] },
    { x: 27, y: 20, text: 'A barrel of hymnals, swollen with rain into a single block of paper. The top one is open to "Rest Ye, Dawn-Bound."' },
    { x: 23, y: 17, text: 'A ward of crystallized light hums around the mainmast. Up close you can hear it: the hymn, over and over, the same eight bars.', cond: (st) => !st.flags['blocker:c9_benediction:ward'] },
    { x: 5, y: 12, hint: 'Crow\'s nest', run: (s) => CH9_SIDE.vantage(s, 'benediction', [
      'The crow\'s nest has snapped off and rolled to this islet. You climb into it. From up here, through the rain, the shards wheel slowly around a single point of light.',
      'The point of light does not wheel. It sits in the middle of everything, perfectly still.',
    ]) },
  ],
  triggers: [
    { id: 'deck_talk', x: 18, y: 18, w: 11, h: 3, once: false, cond: (st) => !st.flags.c9_deck_talk, run: (s) => CH9.deckTalk(s) },
    { id: 'squallmaw', x: 21, y: 13, w: 5, h: 4, once: false, cond: (st) => !st.flags.c9_part_sail, run: (s) => CH9.squallmaw(s) },
  ],
  exits: [
    { x: 21, y: 41, w: 3, ...toRoost },
    { x: 23, y: 26, to: 'c9_benediction_cabin', tx: 4, ty: 6, dir: 'up' },
  ],
  onEnter: (s) => CH9.benedictionArrive(s),
};

/** @type {import('../../types/data').MapDef} */
export const benedictionCabin = {
  ...CABIN,
  id: 'c9_benediction_cabin', name: 'Captain\'s Cabin', mood: 'interior', music: 'sad',
  camera: { dist: 14, pitch: 0.75 }, noBanner: true, particles: 'dust',
  chests: [{ id: 'purse', x: 2, y: 5, gold: 2500 }],
  inspect: [
    { x: 4, y: 3, hint: 'Log', run: (s) => CH9.cabinLog(s) },
    { x: 6, y: 2, hint: 'Shelf', run: (s) => CH9_SIDE.pilgrimClock(s) },
    { x: 1, y: 2, text: 'The captain\'s bunk, made with corners you could cut bread with. Under the pillow: a pressed flower and a list of hymns, with "Rest Ye" underlined twice.' },
  ],
  exits: [{ x: 3, y: 7, w: 3, to: 'c9_benediction', tx: 23, ty: 27, dir: 'down' }],
};

/** @type {import('../../types/data').MapDef} */
export const cinderdeep = {
  ...CINDER,
  id: 'c9_cinderdeep', name: 'The Cinderdeep', region: 'The Fallen Shard',
  scatter: { types: ['rock_small', 'debris'], density: 0.05, seed: 98 },
  mood: 'cave', music: 'cave', battleBg: 'cave', particles: 'embers_soft',
  encounters: { rate: 1, troops: [['c9_cd_moles', 2], ['c9_cd_slag', 2], ['c9_cd_bats', 2], ['c9_cd_golem', 2], ['c9_cd_mix', 3]] },
  npcs: [
    { id: 'miner_dagny', name: 'Dagny', look: 'c9_miner_f', x: 20, y: 34, dir: 'up', cond: (st) => !st.flags.c9_miner_dagny, run: (s) => CH9.miner(s, 'dagny') },
    { id: 'miner_hobb', name: 'Hobb', look: 'c9_miner', x: 6, y: 5, dir: 'down', cond: (st) => !st.flags.c9_miner_hobb, run: (s) => CH9.miner(s, 'hobb') },
    { id: 'miner_ines', name: 'Ines', look: 'c9_miner_f', x: 42, y: 20, dir: 'left', cond: (st) => !st.flags.c9_miner_ines, run: (s) => CH9.miner(s, 'ines') },
  ],
  chests: [
    { id: 'head', x: 3, y: 31, item: 'mega_tonic', count: 3 },
    { id: 'shaft', x: 6, y: 22, item: 'frost_bomb', count: 4 },
    { id: 'west', x: 2, y: 13, item: 'sunshard_knuckles' },
    { id: 'nw', x: 3, y: 4, item: 'sunshard_circlet' },
    { id: 'south', x: 16, y: 33, item: 'ember_ring' },
    { id: 'cavern', x: 31, y: 20, item: 'sunshard_pistol' },
    { id: 'gallery', x: 41, y: 30, item: 'sunshard_axe' },
    { id: 'climb', x: 42, y: 11, item: 'sunshard_plate' },
    { id: 'ante', x: 31, y: 3, item: 'x_ether' },
    { id: 'heart', x: 13, y: 4, item: 'megalixir' },
  ],
  blockers: [
    { id: 'slag_a', x: 39, y: 23, w: 4, h: 1, prop: 'rock' },
    { id: 'slag_b', x: 33, y: 5, w: 1, h: 5, prop: 'rock' },
  ],
  inspect: [
    { x: 3, y: 11, hint: 'Valve', run: (s) => CH9.valve(s, 'west') },
    { x: 41, y: 33, hint: 'Valve', run: (s) => CH9.valve(s, 'se') },
    { x: 44, y: 19, hint: 'Chimney-crack', run: (s) => CH9_SIDE.vantage(s, 'cinderdeep', [
      'A crack in the rock runs all the way up through the shard. At the top, impossibly far, a sliver of sky.',
      'Through it, every so often, the shards drift past in a slow procession — and in the middle of them all, one white point that never moves at all.',
    ]) },
    { x: 18, y: 2, text: 'An ember crystal as tall as Bram. Inside it, very small, a shape like a bird with its wings spread, caught mid-flight.' },
  ],
  triggers: [
    { id: 'entry', x: 1, y: 35, w: 6, h: 5, run: (s) => CH9.cinderEntry(s) },
    { id: 'sunworm', x: 13, y: 2, w: 10, h: 7, once: false, cond: (st) => !st.flags.c9_part_heart, run: (s) => CH9.sunworm(s) },
  ],
  exits: [{ x: 1, y: 39, w: 3, ...toRoost }],
};

/** @type {import('../../types/data').MapDef} */
export const halcyonFlight = {
  ...FLIGHT,
  id: 'c9_halcyon_flight', name: 'The Halcyon', region: 'Over the Ruin',
  mood: 'ruin', music: 'afterlight', particles: 'embers_soft', noMenu: true, noSave: true,
  camera: { dist: 18, pitch: 0.62 },
  onEnter: (s) => CH9.maidenFlight(s),
};
