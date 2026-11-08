// Chapter 12 — the choice and the epilogue.
//   c12_dream_house / c12_dream_village : Cassian's offer (Lanternfall, the day before the Kindling),
//     built on the Act I Lanternfall layouts so the dream is literally home.
//   c12_epi_square / c12_epi_ward / c12_epi_shore : two summers after the Afterlight.
import LANTERNFALL from './layouts/lanternfall.js';
import WREN_HOUSE from './layouts/lf_wren_house.js';
import SQUARE from './layouts/c12_epi_square.js';
import WARD from './layouts/c12_epi_ward.js';
import SHORE from './layouts/c12_epi_shore.js';
import { C12F } from '../../story/ch12_finale.js';

const scripted = { noMenu: true, noSave: true };
const dreamDoor = (b) => (b.door ? { ...b, door: { ...b.door, locked: true, lockedText: 'The door is painted shut. Everything here is.' } } : b);

/** @type {import('../../types/data').MapDef} */
const dreamHouse = {
  ...WREN_HOUSE, ...scripted,
  id: 'c12_dream_house', name: 'Halloway House', noBanner: true,
  solo: true, // a dream: the leader walks it alone (no followers)
  mood: 'evernoon', music: 'lanternfall', camera: { dist: 15, pitch: 0.75 }, particles: 'motes_gold', battleBg: 'town',
  inspect: [
    { x: 4, y: 4, text: 'Two plates. Two cups. A third chair, pushed in, that nobody has sat in for seven years.' },
    { x: 7, y: 2, text: 'Your father\'s books. Sea charts. Star charts. A novel about a pirate queen with the last chapter torn out.' },
  ],
  onEnter: (s) => C12F.dream(s),
};

/** @type {import('../../types/data').MapDef} */
const dreamVillage = {
  ...LANTERNFALL, ...scripted,
  id: 'c12_dream_village', name: 'Lanternfall', region: 'The Day Before, Forever',
  solo: true, // a dream: the leader walks it alone (no followers)
  buildings: LANTERNFALL.buildings.map(dreamDoor),
  structures: LANTERNFALL.structures.map((st) => ({ ...st, doorTo: undefined })),
  mood: 'evernoon', music: 'lanternfall', backdrop: 'ocean', battleBg: 'beach', particles: 'motes_gold',
  onEnter: (s) => C12F.evernoonEnding(s),
};

/** @type {import('../../types/data').MapDef} */
const square = {
  ...SQUARE, ...scripted,
  id: 'c12_epi_square', name: 'Aurenne', region: 'Two Summers After',
  mood: 'c12_newdawn', music: 'afterlight', battleBg: 'town', treeType: 'tree_cherry',
  onEnter: (s) => C12F.epiSquare(s),
};

/** @type {import('../../types/data').MapDef} */
const ward = {
  ...WARD, ...scripted,
  id: 'c12_epi_ward', name: 'The Ember Hospital', noBanner: true,
  mood: 'interior', music: 'afterlight', camera: { dist: 15, pitch: 0.75 }, particles: 'dust', battleBg: 'town',
  onEnter: (s) => C12F.epiWard(s),
};

/** @type {import('../../types/data').MapDef} */
const shore = {
  ...SHORE, ...scripted,
  id: 'c12_epi_shore', name: 'Lanternfall', region: 'The Westmost Isle',
  mood: 'c12_newdawn', music: 'lanternfall', backdrop: 'ocean', battleBg: 'beach',
  onEnter: (s) => C12F.epiShore(s),
};

export const C12_EPILOGUE_MAPS = [dreamHouse, dreamVillage, square, ward, shore];
