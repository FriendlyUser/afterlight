// Content pack: post-game (Lv 75–99).
//   The Abyss Gate — hub with Orrin the Underkeeper (completion Tally + milestone rewards).
//   The Gloam Abyss — 30 generated stairs (see maps/postgame_abyss_gen.js); wardens on B10/B20,
//     the First Dark on B30 (unlocks the Sunforged and Afterlight Crests, Breaker's Gem).
//   The Echo Colosseum — ten ranked memory-fights with prizes.
//   The Hiding Place — Lysa's Echo, found by following her chalk marks through the Abyss.
// Access: Act III (`act3`) opens the Gate and B1–B10; the ending (`gameClear`) opens the rest.

import { ITEMS } from '../items.js';
import { ENEMY_LIST, TROOPS, BOSS_AI } from './postgame_battle.js';
import { LOOK_DEFS, SHOP_DEFS } from './postgame_items.js';
import { ABYSS_MAPS } from '../maps/postgame_abyss.js';
import { abyssGate, echoArena, hidingPlace } from '../maps/postgame_gate.js';

ITEMS.pg_tobbs_letter = { name: 'Blue Envelope', kind: 'key', desc: 'Water-stained, still sealed. "To Da, from Mara." It landed on the third stair of the Abyss.', icon: '✪' };

/** @type {import('../../types/data').ContentPack} */
export default {
  maps: [abyssGate, echoArena, hidingPlace, ...ABYSS_MAPS],
  enemies: ENEMY_LIST,
  troops: TROOPS,
  looks: LOOK_DEFS,
  bossAI: BOSS_AI,
  shops: SHOP_DEFS,
  worldNodes: [
    {
      id: 'pg_abyss_gate', name: 'The Abyss Gate', region: 'The Nadir Light', act: 2, x: 210, y: 660,
      mapId: 'abyss_gate', tx: 21, ty: 31, dir: 'up', unlock: 'act3',
      desc: 'An eighth Lantern on the lip of the deepest rift, shining down. Thirty stairs below, something without edges sleeps.',
    },
  ],
};
