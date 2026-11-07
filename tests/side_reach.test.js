// Side-content map sanity: from each arrival tile, every chest, NPC, inspect
// point, exit and trigger must be reachable on the real collision grid (puzzle
// blockers cleared), and chests/NPCs must not sit in walls or the void.
// Run: tools/test.sh side_reach 400000
const MAPS = [
  ['side_lodge', 17, 26], ['side_lodge_hall', 8, 10], ['side_moor', 1, 16], ['side_bane_hollow', 1, 11],
  ['side_obs_shore', 20, 30], ['side_obs_galleries', 23, 33], ['side_obs_dome', 15, 23],
  ['side_ash_bailey', 22, 34], ['side_ash_keep', 20, 29], ['side_ash_tower', 13, 19],
  ['side_ruin_lodge', 17, 25], ['side_ashen_reach', 1, 19],
  ['side_bell_top', 15, 22], ['side_bell_nave', 20, 2], ['side_bell_belfry', 14, 2],
  ['side_garden_gate', 20, 28], ['side_garden_maze', 21, 33], ['side_garden_heart', 15, 23], ['side_nadir', 15, 24],
];
const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export async function run(game, h) {
  await h.newGame();
  game.state.flags.noEncounters = true;
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
    const solidGround = (px, py) => { const d = g.def(px, py); return d.wall || d.void || (d.water && !d.shallow); };
    const inRect = (r) => { for (let j = r.y; j < r.y + (r.h || 1); j++) for (let i = r.x; i < r.x + (r.w || 1); i++) if (seen.has(`${i},${j}`)) return true; return false; };
    for (const c of f.map.chests || []) if (!near(c.x, c.y) || solidGround(c.x, c.y)) problems.push(`${id}: chest ${c.id}@${c.x},${c.y}`);
    for (const n of f.map.npcs || []) if (!near(n.x, n.y) || solidGround(n.x, n.y)) problems.push(`${id}: npc ${n.id}@${n.x},${n.y}`);
    for (const i of f.map.inspect || []) if (!near(i.x, i.y)) problems.push(`${id}: inspect ${i.x},${i.y}`);
    for (const e of f.map.exits || []) if (!inRect(e)) problems.push(`${id}: exit ${e.x},${e.y}`);
    for (const t of f.map.triggers || []) if (!inRect(t)) problems.push(`${id}: trigger ${t.id}`);
    h.log(`${id} (${seen.size})`);
  }
  if (problems.length) throw new Error(`Unreachable: ${problems.join('; ')}`);
}
