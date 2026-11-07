// Layout sanity for Chapters 5–6: every NPC, chest, exit and trigger sits on (or
// next to) a tile reachable from the map's entry. Blockers count as open (they
// are cleared by story events). Run: tools/test.sh ch56_layout 60000
import { MAPS } from '../src/data/maps/index.js';
import { buildMap } from '../src/world/MapBuilder.js';
import { contentReady } from '../src/data/content/index.js';

const ENTRIES = {
  lf_sunset: [[23, 30], [12, 3]],
  c5_wren_house: [[4, 7]], c5_nana_house: [[4, 6]], c5_inn: [[5, 8]], c5_store: [[4, 5]], c5_tobias: [[3, 4]],
  c5_tidecaves: [[1, 16]], c5_keepers_stair: [[17, 40]], ch5_lantern: [[7, 11]],
  shard_hermitage: [[5, 5]], c6_hermit_shard: [[14, 9]], c6_drift: [[1, 13]], c6_keelhaven: [[2, 16]],
  c6_keel_inn: [[6, 8]], c6_keel_hall: [[6, 7]], c6_shattered_sea: [[1, 20]],
};

export async function run(game, h) {
  await contentReady;
  const errors = [];
  const grids = {};
  const gridOf = (id) => (grids[id] = grids[id] || buildMap(MAPS[id]).grid);
  for (const [id, entries] of Object.entries(ENTRIES)) {
    const map = MAPS[id];
    if (!map) { errors.push(`missing map ${id}`); continue; }
    const grid = buildMap(map).grid;
    for (const c of map.chests || []) grid.block(c.x, c.y);
    const seen = new Set();
    const queue = [];
    for (const [x, y] of entries) {
      if (!grid.walkable(x, y)) errors.push(`${id}: entry (${x},${y}) not walkable`);
      queue.push([x, y]); seen.add(`${x},${y}`);
    }
    for (const b of map.blockers || []) for (let y = b.y; y < b.y + (b.h || 1); y++) for (let x = b.x; x < b.x + (b.w || 1); x++) grid.block(x, y, 0);
    while (queue.length) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
        if (seen.has(k) || !grid.canStep(x, y, nx, ny)) continue;
        seen.add(k); queue.push([nx, ny]);
      }
    }
    const reach = (x, y) => seen.has(`${x},${y}`);
    const near = (x, y) => [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => reach(x + dx, y + dy));
    for (const n of map.npcs || []) if (!near(n.x, n.y)) errors.push(`${id}: npc ${n.id} at (${n.x},${n.y}) unreachable`);
    for (const c of map.chests || []) if (!near(c.x, c.y)) errors.push(`${id}: chest ${c.id} at (${c.x},${c.y}) unreachable`);
    for (const e of map.exits || []) {
      let ok = false;
      for (let y = e.y; y < e.y + (e.h || 1); y++) for (let x = e.x; x < e.x + (e.w || 1); x++) if (reach(x, y)) ok = true;
      if (!ok) errors.push(`${id}: exit to ${e.to} at (${e.x},${e.y}) unreachable`);
      const dest = MAPS[e.to];
      if (dest && e.to in ENTRIES) {
        if (!gridOf(e.to).walkable(e.tx, e.ty)) errors.push(`${id}: exit lands on blocked (${e.tx},${e.ty}) in ${e.to}`);
      }
    }
    for (const t of map.triggers || []) {
      let ok = false;
      for (let y = t.y; y < t.y + (t.h || 1); y++) for (let x = t.x; x < t.x + (t.w || 1); x++) if (reach(x, y)) ok = true;
      if (!ok) errors.push(`${id}: trigger ${t.id} unreachable`);
    }
    for (const i of map.inspect || []) if (!near(i.x, i.y)) errors.push(`${id}: inspect (${i.x},${i.y}) unreachable`);
    h.log(`${id}: ${seen.size} reachable tiles`);
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    throw new Error(`${errors.length} layout errors: ${errors.slice(0, 6).join(' | ')}`);
  }
}
