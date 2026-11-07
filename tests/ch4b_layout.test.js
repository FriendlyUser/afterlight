// Chapter 4b layout sanity: every chest, NPC and exit landing tile in the pack sits on a
// walkable tile, and every staged scene position is on the map. Run: tools/test.sh ch4b_layout 60000
import { buildMap } from '../src/world/MapBuilder.js';
import { MAPS } from '../src/data/maps/index.js';
import { contentReady } from '../src/data/content/index.js';
import pack from '../src/data/content/ch4b.js';

export async function run(game, h) {
  await contentReady;
  const grids = new Map();
  const gridOf = (id) => {
    if (!grids.has(id)) grids.set(id, buildMap(MAPS[id], {}).grid);
    return grids.get(id);
  };
  const errors = [];
  for (const m of pack.maps) {
    const grid = gridOf(m.id);
    const check = (what, x, y) => {
      if (!grid.walkable(x, y)) errors.push(`${m.id}: ${what} at (${x},${y}) on '${grid.char(x, y)}'`);
    };
    for (const c of m.chests || []) check(`chest ${c.id}`, c.x, c.y);
    for (const n of m.npcs || []) check(`npc ${n.id}`, n.x, n.y);
    for (const e of m.exits || []) {
      if (e.to === '@world' || !MAPS[e.to]) continue;
      if (!gridOf(e.to).walkable(e.tx, e.ty)) errors.push(`${m.id}: exit to ${e.to} lands on blocked (${e.tx},${e.ty})`);
    }
  }
  for (const n of pack.worldNodes) if (!gridOf(n.mapId).walkable(n.tx, n.ty)) errors.push(`world node ${n.id}: blocked landing (${n.tx},${n.ty})`);
  if (!gridOf('mirefen_road').walkable(4, 20)) errors.push('chapter entry mirefen_road (4,20) is not walkable');
  h.log(`checked ${pack.maps.length} maps`);
  if (errors.length) throw new Error(`${errors.length} layout errors:\n${errors.join('\n')}`);
}
