// Map registry. Each map module default-exports a map definition
// (layout spread + gameplay). See docs/MAPS.md.

import lanternfall from './lanternfall.js';
import { lfWrenHouse, lfNanaHouse, lfInn, lfStore, lfTobias } from './lanternfall_interiors.js';
import { lfLantern, lfTideCaves, seaCrossing } from './lf_dungeons.js';

const MAPS = {};
export function registerMaps(list) {
  for (const m of list) {
    if (MAPS[m.id]) console.warn(`Duplicate map id ${m.id}`);
    MAPS[m.id] = m;
  }
}

registerMaps([lanternfall, lfWrenHouse, lfNanaHouse, lfInn, lfStore, lfTobias, lfLantern, lfTideCaves, seaCrossing]);

export { MAPS };

export function getMap(id) {
  const m = MAPS[id];
  if (!m) throw new Error(`Unknown map '${id}'`);
  return m;
}

export function allMaps() { return MAPS; }
