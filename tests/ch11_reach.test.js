// Chapter 11 map sanity: from each map's arrival tile, every chest, NPC, inspect
// point, exit and trigger must be reachable on the real collision grid
// (with all puzzle blockers cleared). Run: tools/test.sh ch11_reach 300000
import { setupAct3 } from './ch11_setup.js';

const MAPS = [
  ['halcyon_deck', 12, 8], ['c11_halcyon_hold', 11, 9],
  ['c11_saltglass', 19, 40], ['c11_frosthollow', 19, 40], ['c11_mirefen', 19, 40], ['c11_thornwood', 19, 40],
  ['c11_skyreach', 19, 40], ['c11_grand_nave', 19, 40], ['c11_grand_gallery', 10, 14],
  ['c11_lf_ruins', 23, 33], ['c11_lf_home', 4, 7], ['c11_lf_lantern', 7, 11],
  ['c11_reef', 17, 34], ['c11_infirmary', 9, 12], ['c11_vigil', 12, 31], ['c11_scrapfall', 16, 30],
  ['c11_stormwall', 14, 22], ['c11_rift', 14, 28], ['c11_orrery', 12, 22],
];
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export async function run(game, h) {
  await setupAct3(game, h, { c11_open: true });
  const problems = [];
  for (const [id, x, y] of MAPS) {
    await game.scene.goto(id, x, y, 'down', { skipEnterScript: true });
    await game.wait(0.3);
    await h.idle();
    const f = game.scene;
    for (const b of f.map.blockers || []) f.clearBlocker(b.id);
    const g = f.grid;
    if (!g.walkable(x, y)) problems.push(`${id}: arrival ${x},${y} not walkable`);
    const seen = new Set([`${x},${y}`]);
    const queue = [[x, y]];
    while (queue.length) {
      const [cx, cy] = queue.shift();
      for (const [dx, dy] of N4) {
        const nx = cx + dx, ny = cy + dy, k = `${nx},${ny}`;
        if (seen.has(k) || !g.canStep(cx, cy, nx, ny)) continue;
        seen.add(k);
        queue.push([nx, ny]);
      }
    }
    const near = (px, py) => seen.has(`${px},${py}`) || N4.some(([dx, dy]) => seen.has(`${px + dx},${py + dy}`));
    const inRect = (r) => { for (let j = r.y; j < r.y + (r.h || 1); j++) for (let i = r.x; i < r.x + (r.w || 1); i++) if (seen.has(`${i},${j}`)) return true; return false; };
    for (const c of f.map.chests || []) if (!near(c.x, c.y)) problems.push(`${id}: chest ${c.id}`);
    for (const n of f.map.npcs || []) if (!near(n.x, n.y)) problems.push(`${id}: npc ${n.id}`);
    for (const i of f.map.inspect || []) if (!near(i.x, i.y)) problems.push(`${id}: inspect ${i.x},${i.y}`);
    for (const e of f.map.exits || []) if (!inRect(e)) problems.push(`${id}: exit ${e.x},${e.y}`);
    for (const t of f.map.triggers || []) if (!inRect(t)) problems.push(`${id}: trigger ${t.id}`);
    h.log(`${id} ok-ish (${seen.size} tiles)`);
  }
  if (problems.length) throw new Error(`Unreachable: ${problems.join('; ')}`);
}
