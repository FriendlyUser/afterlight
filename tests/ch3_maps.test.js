// Chapter 3 map sanity: builds every ch3 map and checks that entry points, NPCs,
// chests, inspect points, exits and triggers are on sensible, reachable tiles.
// Run: tools/test.sh ch3_maps 60000
import { MAPS } from '../src/data/maps/index.js';
import { buildMap } from '../src/world/MapBuilder.js';
import { contentReady } from '../src/data/content/index.js';

const ENTRIES = {
  aurenne: [20, 38], c3_inn: [7, 9], c3_shop: [5, 6], c3_cathedral: [11, 19], c3_study: [6, 8], c3_archives: [8, 10],
  c3_tolliver: [4, 7], c3_venn: [5, 6], c3_almshouse: [6, 8], c3_rooftops: [3, 15], c3_dream: [13, 17],
  c3_uc_sewers: [1, 12], c3_uc_ossuary: [1, 16], c3_uc_lab: [1, 5],
};

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/** BFS over walkable tiles. Blockers count as open (story clears them); rooftop leaps add jumps. */
function reach(map, grid, start) {
  const open = new Set();
  for (const b of map.blockers || []) for (let y = b.y; y < b.y + (b.h || 1); y++) for (let x = b.x; x < b.x + (b.w || 1); x++) open.add(`${x},${y}`);
  const ok = (x, y) => grid.walkable(x, y) || (open.has(`${x},${y}`) && grid.inside(x, y));
  const seen = new Set([`${start[0]},${start[1]}`]);
  const q = [start];
  const leaps = (map.inspect || []).filter((i) => i.hint === 'Leap');
  while (q.length) {
    const [x, y] = q.shift();
    const next = DIRS.map(([dx, dy]) => [x + dx, y + dy]).filter(([nx, ny]) => ok(nx, ny) &&
      (Math.abs(grid.level(nx, ny) - grid.level(x, y)) <= 1 || grid.isStairs(nx, ny) || grid.isStairs(x, y)));
    for (const l of leaps) {
      for (const [dx, dy] of DIRS) {
        if (x + dx !== l.x || y + dy !== l.y) continue;
        for (let k = 2; k <= 4; k++) { const tx = x + dx * k, ty = y + dy * k; if (grid.walkable(tx, ty) && grid.level(tx, ty) >= 5) { next.push([tx, ty]); break; } }
      }
    }
    for (const [nx, ny] of next) {
      const key = `${nx},${ny}`;
      if (seen.has(key)) continue;
      seen.add(key);
      q.push([nx, ny]);
    }
  }
  return seen;
}

export async function run(game, h) {
  await contentReady;
  const errors = [];
  for (const [id, start] of Object.entries(ENTRIES)) {
    const map = MAPS[id];
    if (!map) { errors.push(`${id}: not registered`); continue; }
    const { grid } = buildMap(map, {});
    if (!grid.walkable(...start)) errors.push(`${id}: entry ${start} not walkable`);
    const seen = reach(map, grid, start);
    const near = (x, y) => seen.has(`${x},${y}`) || DIRS.some(([dx, dy]) => seen.has(`${x + dx},${y + dy}`));
    for (const n of map.npcs || []) {
      if (!grid.walkable(n.x, n.y)) errors.push(`${id}: npc ${n.id} on blocked tile ${n.x},${n.y}`);
      if (!near(n.x, n.y) && !n.id.startsWith('cap_')) errors.push(`${id}: npc ${n.id} unreachable`);
    }
    for (const c of map.chests || []) if (!near(c.x, c.y)) errors.push(`${id}: chest ${c.id} unreachable`);
    for (const i of map.inspect || []) if (!near(i.x, i.y)) errors.push(`${id}: inspect ${i.x},${i.y} unreachable`);
    for (const e of map.exits || []) {
      let any = false;
      for (let y = e.y; y < e.y + (e.h || 1); y++) for (let x = e.x; x < e.x + (e.w || 1); x++) if (seen.has(`${x},${y}`)) any = true;
      if (!any) errors.push(`${id}: exit to ${e.to} unreachable`);
      if (e.to !== '@world' && MAPS[e.to]?.ground) {
        const target = buildMap(MAPS[e.to], {}).grid;
        if (!target.walkable(e.tx, e.ty)) errors.push(`${id}: exit to ${e.to} lands on blocked ${e.tx},${e.ty}`);
      }
    }
    for (const b of map.buildings || []) {
      if (!b.door?.to || !MAPS[b.door.to]) continue;
      const target = buildMap(MAPS[b.door.to], {}).grid;
      if (!target.walkable(b.door.tx, b.door.ty)) errors.push(`${id}: door to ${b.door.to} lands on blocked ${b.door.tx},${b.door.ty}`);
      const dx = b.x + (b.door.dx ?? Math.floor(b.w / 2));
      if (!seen.has(`${dx},${b.y + b.d}`)) errors.push(`${id}: door ${b.door.to} unreachable`);
    }
    for (const t of map.triggers || []) {
      let any = false;
      for (let y = t.y; y < t.y + (t.h || 1); y++) for (let x = t.x; x < t.x + (t.w || 1); x++) if (seen.has(`${x},${y}`)) any = true;
      if (!any) errors.push(`${id}: trigger ${t.id} unreachable`);
    }
    h.log(`${id}: ${seen.size} tiles reachable`);
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    throw new Error(`${errors.length} map problems`);
  }
}
