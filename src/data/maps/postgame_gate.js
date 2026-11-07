// The Abyss Gate (post-game hub), the Echo Colosseum and the Hiding Place.

import GATE from './layouts/postgame_gate.js';
import ARENA_L from './layouts/postgame_arena.js';
import HIDE from './layouts/postgame_hiding.js';
import { ABYSS_LAYOUTS } from './postgame_abyss_gen.js';
import { PG, HIDING_SPOTS } from '../../story/postgame.js';

const cleared = (st) => !!st.flags.gameClear;

export const abyssGate = {
  ...GATE,
  id: 'abyss_gate', name: 'The Abyss Gate', region: 'The Nadir Light',
  mood: (st) => (cleared(st) ? 'dusk' : 'ruin'),
  music: (st) => (cleared(st) ? 'afterlight' : 'ruin'),
  battleBg: 'ruin',
  camera: { dist: 20, pitch: 0.7 },
  signs: [
    { x: 18, y: 27, text: 'THE NADIR LIGHT — the Eighth Lantern.\nUnderkeeper: O. Vey.\nMind the edge. The edge does not mind you.' },
    { x: 36, y: 20, text: 'THE ECHO COLOSSEUM\nProprietor: D. Marlow, late of Kiteholm.\nFights nightly. (It is always night.)' },
  ],
  npcs: [
    { id: 'orrin', name: 'Orrin', look: 'orrin', x: 24, y: 13, dir: 'down', hint: 'Talk', run: (s) => PG.orrin(s) },
    { id: 'sorrel', name: 'Sorrel', look: 'sorrel', x: 7, y: 18, dir: 'down', hint: 'Shop', run: (s) => PG.sorrel(s) },
    { id: 'quill', name: 'Quill', look: 'quill', x: 12, y: 14, dir: 'down', run: (s) => PG.quill(s) },
    { id: 'tobb', name: 'Tobb', look: 'tobb', x: 17, y: 8, dir: 'up', run: (s) => PG.tobb(s) },
    { id: 'nils', name: 'Nils', look: 'nils', x: 19, y: 14, dir: 'down', run: (s) => PG.nils(s) },
    { id: 'wick', name: 'Wick', look: 'wick', x: 33, y: 20, wander: 1, run: (s) => PG.wick(s) },
  ],
  inspect: [
    { x: GATE.spots.chalk[0], y: GATE.spots.chalk[1], hint: 'Chalk', run: (s) => PG.chalkGate(s) },
    { x: 31, y: 8, hint: 'Lantern-lift', run: (s) => PG.liftDown(s) },
    { x: 21, y: 12, hint: 'The Nadir Light', run: (s) => s.narrate(['The great lamp turns slowly, throwing its beam not out to sea but straight down into the rift.', 'Somewhere far below, something that has never had a shape turns its face away from the light, and sleeps on.']) },
    { x: 10, y: 11, text: 'Steps cut into the cliff, going down into a dark so thick it looks wet. Someone has scratched beside them: 30 FLIGHTS. NO RAIL.' },
  ],
  exits: [
    { x: GATE.spots.descent[0], y: GATE.spots.descent[1], to: 'abyss_1', tx: ABYSS_LAYOUTS[1].spots.entry[0], ty: ABYSS_LAYOUTS[1].spots.entry[1], dir: 'down' },
    { x: 19, y: 33, w: 5, to: '@world' },
  ],
  onEnter: (s) => PG.gateEnter(s),
};

export const echoArena = {
  ...ARENA_L,
  id: 'pg_arena', name: 'The Echo Colosseum', region: 'Beneath the Abyss Gate',
  mood: 'ruin', music: 'tension', battleBg: 'ruin', particles: 'embers_soft',
  camera: { dist: 18, pitch: 0.72 },
  signs: [{ x: 13, y: 18, text: 'RANKS I–X. ONE MEMORY EACH.\nPrizes for first victories only.\nThe management is not responsible for anything you remember.' }],
  npcs: [
    { id: 'dace', name: 'Dace', look: 'dace', x: 15, y: 15, dir: 'down', hint: 'Fight', run: (s) => PG.dace(s) },
    { id: 'echo_fan1', name: 'Echo Spectator', look: 'villager_14', x: 6, y: 3, dir: 'down', talk: ['(It cheers, a beat after everyone else, for a fight that happened years ago.)'] },
    { id: 'echo_fan2', name: 'Echo Spectator', look: 'villager_27', x: 24, y: 3, dir: 'down', talk: ['(It is booing someone. You check. It is booing you. It is the memory of someone who lost money on you.)'] },
    { id: 'echo_fan3', name: 'Echo Spectator', look: 'villager_40', x: 3, y: 11, dir: 'right', talk: ['(It mouths a name, over and over. Not yours. Not anyone\'s anymore.)'] },
  ],
  exits: [{ x: 13, y: 25, w: 4, to: 'abyss_gate', tx: GATE.spots.arena_door[0], ty: GATE.spots.arena_door[1], dir: 'down' }],
};

export const hidingPlace = {
  ...HIDE,
  id: 'pg_hiding_place', name: 'The Hiding Place', region: 'Aurenne, the night of the festival',
  mood: 'night', treeType: 'tree_cherry',
  music: (st) => (st.flags.pg_lysa_done ? 'sad' : 'aurenne'),
  battleBg: 'town', noSave: true,
  camera: { dist: 18, pitch: 0.7 },
  inspect: Object.entries(HIDING_SPOTS).flatMap(([spot, h]) => h.tiles.map(([x, y]) => ({ x, y, hint: 'Search', run: (s) => PG.hideSpot(s, spot) }))),
  exits: [{ x: 15, y: 25, w: 4, to: 'abyss_gate', tx: GATE.spots.chalk[0], ty: GATE.spots.chalk[1] + 1, dir: 'down' }],
  onEnter: (s) => PG.hidingEnter(s),
};
