// The Bellring — Aurenne's colosseum (Act I). Layout: tools/maps/bc_bellring.py;
// cups and prizes: story/colosseum.js; fighters: data/content/colosseum.js.

import L from './layouts/bc_bellring.js';
import { BELLRING } from '../../story/colosseum.js';

const fan = (id, look, x, y, lines) => ({ id, name: 'Spectator', look, x, y, dir: 'down', talk: lines });

/** @type {import('../../types/data').MapDef} */
export const bellring = {
  ...L,
  id: 'bc_bellring', name: 'The Bellring', region: 'Aurenne\'s colosseum',
  mood: 'day', music: 'aurenne', battleBg: 'colosseum', particles: 'pollen',
  camera: { dist: 20, pitch: 0.68 },
  signs: [{ x: 10, y: 25, text: 'THE BELLRING — CUPS TODAY\nCOPPER · SILVER · GOLD · SUNSTEEL\nChampion: VALKA THE UNDEFEATED (41–0)\nThe management patches all contenders. The management is not liable for pride.' }],
  npcs: [
    { id: 'ottavio', name: 'Ottavio Brass', look: 'ottavio', x: 13, y: 21, dir: 'down', hint: 'Cups', run: (s) => BELLRING.ottavio(s) },
    { id: 'bc_clerk', name: 'Prize Clerk', look: 'bc_clerk', x: 21, y: 21, dir: 'down', hint: 'Prizes', run: (s) => BELLRING.clerk(s) },
    fan('bc_fan1', 'villager_9', 7, 5, ['I\'ve seen Valka fight forty-one times.', 'I\'ve lost money forty-one times. I keep betting against her. It\'s a principle now.']),
    fan('bc_fan2', 'villager_22', 25, 5, ['When the bell rings, the whole city stops. Even the Cathedral bells wait for ours.', 'Don\'t tell the Choir I said that.']),
    fan('bc_fan3', 'villager_31', 3, 11, ['The Iron Bull was cast from a cracked bell. If you hit it right, it still rings.', 'Nobody has hit it right.']),
    fan('bc_fan4', 'villager_47', 28, 11, ['Kell the Net and Kell the Fist are brothers. Kell the Third sells the pies.', 'The pies are the most dangerous thing here.']),
    { id: 'bc_medic', name: 'Arena Medic', look: 'villager_12', x: 6, y: 25, dir: 'right',
      talk: ['Between rounds we give you back a quarter of your strength. Any more and Mr. Brass says it isn\'t sport.', 'Lose a cup and we patch everything. Free. It\'s the only free thing in Aurenne.'] },
  ],
  exits: [{ x: 12, y: 29, w: 8, to: '@world' }],
};
