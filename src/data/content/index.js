// Chapter content packs. Each module default-exports a ContentPack:
//   { maps: [], enemies: [], troops: {}, looks: {}, bossAI: {}, shops: {}, worldNodes: [] }
// Packs load independently: a broken pack logs an error instead of breaking the game.

import { registerMaps } from '../maps/index.js';
import { registerEnemies } from '../enemies.js';
import { registerTroops } from '../troops.js';
import { registerBossAI } from '../../battle/AI.js';
import { LOOKS } from '../looks.js';
import { SHOPS } from '../shops.js';
import { WORLD_NODES } from '../worldmap.js';

// One loader per pack. Literal import() paths let a bundler split each pack into its
// own chunk; the game also runs unbundled straight from the source folder.
const LOADERS = {
  ch2: () => import('./ch2.js'),
  ch3: () => import('./ch3.js'),
  ch4a: () => import('./ch4a.js'),
  ch4b: () => import('./ch4b.js'),
  ch5: () => import('./ch5.js'),
  ch6: () => import('./ch6.js'),
  ch7: () => import('./ch7.js'),
  ch8: () => import('./ch8.js'),
  ch9: () => import('./ch9.js'),
  ch10: () => import('./ch10.js'),
  ch11: () => import('./ch11.js'),
  ch12: () => import('./ch12.js'),
  postgame: () => import('./postgame.js'),
  side: () => import('./side.js'),
  colosseum: () => import('./colosseum.js'),
  lost: () => import('./lost.js'),
};

export const PACK_NAMES = Object.keys(LOADERS);
export const PACKS = {};

function register(name, pack) {
  Object.assign(LOOKS, pack.looks || {});
  registerEnemies(pack.enemies || []);
  registerTroops(pack.troops || {});
  registerBossAI(pack.bossAI || {});
  Object.assign(SHOPS, pack.shops || {});
  WORLD_NODES.push(...(pack.worldNodes || []));
  registerMaps(pack.maps || []);
  PACKS[name] = pack;
}

export const contentReady = Promise.all(PACK_NAMES.map(async (name) => {
  try {
    const mod = await LOADERS[name]();
    register(name, mod.default || {});
  } catch (e) {
    console.error(`Content pack '${name}' failed to load: ${e.message}`, e);
  }
}));
