// Chapter 4a — the Pilgrim Road, the open Sunscar, and the wreck of the Halcyon.
import ROAD from './layouts/sunscar_road.js';
import DUNES from './layouts/c4a_dunes.js';
import HALCYON from './layouts/c4a_halcyon.js';
import { C4A } from '../../story/ch4a.js';

const desert = { mood: 'desert', music: 'desert', battleBg: 'desert', particles: 'dust_sand' };
const sarnAlive = (st) => !st.flags.c4a_sarn_dead;

/** @type {import('../../types/data').MapDef} */
export const sunscarRoad = {
  ...ROAD, ...desert,
  id: 'sunscar_road', name: 'The Pilgrim Road', region: 'Edge of the Sunscar',
  encounters: {
    rate: 0.7, bg: 'desert', onTiles: 'sgq',
    troops: [['c4a_road_vultures', 3], ['c4a_road_scorp', 3], ['c4a_road_wyrmlings', 2], ['c4a_road_raiders', 1]],
  },
  signs: [{ x: 2, y: 18, text: 'THE PILGRIM ROAD — east to Saltglass.\nCarry water. Carry more water than that.' }],
  npcs: [
    { id: 'ysmay', name: 'Ysmay', look: 'c4a_ysmay', x: 28, y: 21, dir: 'down', hint: 'Shop', run: (s) => C4A.ysmay(s) },
    { id: 'fen', name: 'Pilgrim Fen', look: 'c4a_pilgrim', x: 19, y: 17, dir: 'right', wander: 2,
      talk: ['Walking to Saltglass to hear the blind Keeper. They say she can name your Crest before the Lantern does.', 'They say she told the Hierophant something once that made him leave in the middle of the night.', 'I\'d like to know what. I\'d like to know anything, really. That\'s why I walk.'] },
    { id: 'guard', name: 'Caravan Guard', look: 'c4a_raider', x: 33, y: 22, dir: 'left',
      talk: ['Ysmay\'s water is the last sweet water for thirty leagues. After that it\'s the oasis, or the town, or you drink sand.', 'Mind the glass flats. Folk see things out there. Then they walk toward them.'] },
  ],
  chests: [
    { id: 'c4a_road_1', x: 2, y: 9, item: 'hi_tonic', count: 2 },
    { id: 'c4a_road_2', x: 12, y: 4, item: 'silversteel_kris' },
    { id: 'c4a_road_3', x: 38, y: 22, item: 'ether', count: 2 },
  ],
  inspect: [
    { x: 17, y: 19, text: ['A Choir milestone: AURENNE — 40 LEAGUES. SALTGLASS — 30.', 'Below, older letters someone tried to chisel away: "...WHERE THE LIGHT GOES, WE GO."'] },
    { x: 21, y: 15, hint: 'Pilgrim\'s Arch', run: (s) => C4A.arch(s) },
    { x: 24, y: 15, hint: 'Pilgrim\'s Arch', run: (s) => C4A.arch(s) },
    { x: 9, y: 24, text: 'A pilgrims\' cairn. Every stone has a name scratched on it. Some of the names are very small, like children wrote them.' },
  ],
  exits: [
    { x: 41, y: 14, h: 2, to: 'c4a_dunes', tx: 1, ty: 21, dir: 'right' },
    { x: 0, y: 19, h: 2, to: '@world' },
  ],
  onEnter: (s) => C4A.roadOpening(s),
};

/** @type {import('../../types/data').MapDef} */
export const dunes = {
  ...DUNES, ...desert,
  id: 'c4a_dunes', name: 'The Sunscar', region: 'Sunscar Desert',
  encounters: {
    rate: 1, bg: 'desert', onTiles: 'sg',
    troops: [['c4a_dune_scorp2', 3], ['c4a_dune_wisps', 2], ['c4a_dune_mix', 3], ['c4a_dune_raiders', 2], ['c4a_dune_wyrm3', 2], ['c4a_dune_mirage', 2], ['c4a_dune_mirage2', 1]],
  },
  npcs: [
    { id: 'sef', name: 'Old Sef', look: 'c4a_sef', x: 16, y: 28, dir: 'left', run: (s) => C4A.sef(s) },
    { id: 'sentry', name: 'Raider Sentry', look: 'c4a_raider', x: 46, y: 33, dir: 'left', cond: sarnAlive, run: (s) => C4A.sentry(s) },
    { id: 'sarn', name: 'Sarn the Jackal', look: 'c4a_sarn', x: 53, y: 35, dir: 'down', cond: sarnAlive, run: (s) => C4A.sarn(s) },
    { id: 'raider2', name: 'Dune Raider', look: 'c4a_raider_slinger', x: 50, y: 34, dir: 'right', cond: sarnAlive,
      talk: ['Sarn says we\'re not thieves. We\'re a toll road with knives.'] },
  ],
  chests: [
    { id: 'c4a_dune_1', x: 11, y: 10, item: 'silversteel_saber' },
    { id: 'c4a_dune_2', x: 53, y: 12, item: 'silk_robe' },
    { id: 'c4a_dune_3', x: 5, y: 31, item: 'hi_tonic', count: 3 },
    { id: 'c4a_dune_4', x: 33, y: 13, item: 'silver_circlet' },
    { id: 'c4a_dune_5', x: 56, y: 9, item: 'gale_bomb', count: 2 },
    { id: 'c4a_dune_6', x: 57, y: 37, item: 'silversteel_carbine' },
    { id: 'c4a_dune_7', x: 16, y: 41, item: 'vigor_seed' },
  ],
  inspect: [
    { x: 31, y: 8, hint: 'Skull', run: (s) => C4A.skull(s) },
    { x: 32, y: 8, hint: 'Skull', run: (s) => C4A.skull(s) },
    { x: 20, y: 9, text: 'The ribs of a giant wyrm arch out of the sand like the frame of a ship nobody finished building.' },
    { x: 23, y: 18, text: ['A weathered statue of a Keeper, holding a lamp above her head. The wind has worn away her face.', 'Someone has left a cup of water at her feet. It is still cool.'] },
    { x: 12, y: 29, hint: 'Water', run: (s) => C4A.oasis(s) },
  ],
  triggers: [
    { id: 'smoke', x: 30, y: 16, w: 8, h: 11, cond: (st) => !st.flags.c4a_corvin_joined, run: (s) => C4A.smoke(s) },
    { id: 'mirage_wren', x: 26, y: 26, w: 12, h: 10, cond: (st) => st.flags.c4a_corvin_joined, run: (s) => C4A.mirageWren(s) },
    { id: 'mirage_sable', x: 41, y: 19, w: 7, h: 5, cond: (st) => st.flags.c4a_corvin_joined, run: (s) => C4A.mirageSable(s) },
  ],
  exits: [
    { x: 0, y: 20, h: 3, to: 'sunscar_road', tx: 40, ty: 15, dir: 'left' },
    { x: 39, y: 0, w: 6, to: 'c4a_halcyon', tx: 18, ty: 28, dir: 'up' },
    { x: 61, y: 25, h: 3, to: 'c4a_saltglass', tx: 2, ty: 19, dir: 'right', cond: (st) => st.flags.c4a_corvin_joined,
      blocked: async (s) => {
        await s.say('Wren', 'Saltglass is east... but that smoke in the north. Someone could be hurt out there.');
        await s.step('player', -1, 0);
      } },
  ],
};

/** @type {import('../../types/data').MapDef} */
export const halcyon = {
  ...HALCYON, ...desert,
  id: 'c4a_halcyon', name: 'Wreck of the Halcyon', region: 'Sunscar Desert',
  music: (st) => (st.flags.c4a_corvin_joined ? 'desert' : 'tension'),
  encounters: { rate: 0.6, bg: 'desert', onTiles: 's', cond: (st) => st.flags.c4a_corvin_joined, troops: [['c4a_dune_wyrm3', 2], ['c4a_road_vultures', 2], ['c4a_dune_scorp2', 1]] },
  chests: [
    { id: 'c4a_hal_1', x: 10, y: 17, item: 'silversteel_shield' },
    { id: 'c4a_hal_2', x: 28, y: 17, item: 'hi_tonic', count: 2 },
    { id: 'c4a_hal_3', x: 10, y: 11, item: 'hi_ether' },
  ],
  inspect: [
    { x: 18, y: 9, hint: 'Lift-glass housing', run: (s) => C4A.liftHousing(s) },
    { x: 15, y: 10, text: 'The mainmast. Someone has carved a tally into it — dozens of little marks — and, at the top, a single word: STAY.' },
    { x: 22, y: 10, text: 'The foremast, splintered halfway up. A torn sail flaps from it like a flag of surrender. Or a very tired wave.' },
    { x: 12, y: 12, text: 'Cargo crates stamped with a dozen different port seals. Half of them are empty. The other half are labeled "DEFINITELY NOT CONTRABAND".' },
  ],
  exits: [{ x: 16, y: 29, w: 5, to: 'c4a_dunes', tx: 41, ty: 1, dir: 'down' }],
  onEnter: (s) => C4A.halcyonWreck(s),
};

export const DESERT_MAPS = [sunscarRoad, dunes, halcyon];
