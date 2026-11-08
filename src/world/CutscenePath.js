// Cutscene walking that goes around people. Scripts move actors along waypoints
// (s.move / s.step); walked straight, an NPC would pass through the party standing in
// its way. Each leg is kept exactly as written when nobody is in the way. Otherwise:
//  - the walker routes around everyone standing there (the player, followers and other
//    actors) over walkable ground (A*, eight directions, no corner-cutting), and the
//    route is straightened wherever a straight line is clear;
//  - an NPC whose last waypoint is someone's tile stops on the nearest free tile beside
//    it (the player keeps its exact destination: scripts walk it onto doors and triggers);
//  - if there's no way around, the leg is walked as written.

const CLEAR = 0.42; // how close (tiles) a walker may pass another body's centre
const STEP = 0.2; // sampling step along a straight leg (tiles)

/** Bodies standing on the map that `walker` must not walk through: [{ x, z }]. */
function bodies(field, walker) {
  const out = [];
  const add = (a) => { if (a && a !== walker && a.visible) out.push({ x: a.x, z: a.z }); };
  add(field.player);
  for (const a of field.actors.values()) add(a);
  for (const f of field.followers?.list || []) add(f.actor);
  return out;
}

/** Distance from point p to segment a–b (all { x, z }). */
function segDist(p, a, b) {
  const dx = b.x - a.x, dz = b.z - a.z;
  const len2 = dx * dx + dz * dz;
  const t = len2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / len2)) : 0;
  return Math.hypot(a.x + dx * t - p.x, a.z + dz * t - p.z);
}

/** Does the straight leg a → b pass through someone? (Ignores anyone already at a.) */
function bumps(a, b, others) {
  return others.some((o) => Math.hypot(o.x - a.x, o.z - a.z) > CLEAR && segDist(o, a, b) < CLEAR);
}

/** Is the straight leg a → b clear of people and of unwalkable tiles (for smoothing)? */
function clearLine(grid, a, b, others) {
  if (bumps(a, b, others)) return false;
  const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / STEP));
  let px = Math.floor(a.x), pz = Math.floor(a.z);
  for (let i = 1; i <= n; i++) {
    const tx = Math.floor(a.x + ((b.x - a.x) * i) / n), tz = Math.floor(a.z + ((b.z - a.z) * i) / n);
    if (tx === px && tz === pz) continue;
    if (!grid.canStep(px, pz, tx, tz)) return false;
    px = tx; pz = tz;
  }
  return true;
}

/** A* over walkable tiles from (sx, sz) to (gx, gz), avoiding `blocked` tile keys. Returns [[x, y], …] or null. */
function astar(grid, sx, sz, gx, gz, blocked) {
  const key = (x, z) => z * grid.w + x;
  const goal = key(gx, gz);
  const open = [[0, sx, sz]];
  const g = new Map([[key(sx, sz), 0]]);
  const from = new Map();
  const h = (x, z) => Math.hypot(gx - x, gz - z);
  let guard = 0;
  while (open.length && guard++ < 6000) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i][0] < open[bi][0]) bi = i;
    const [, x, z] = open.splice(bi, 1)[0];
    const k = key(x, z);
    if (k === goal) {
      const path = [[x, z]];
      let c = k;
      while (from.has(c)) { c = from.get(c); path.unshift([c % grid.w, Math.floor(c / grid.w)]); }
      return path;
    }
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dz) continue;
        const nx = x + dx, nz = z + dz, nk = key(nx, nz);
        if (!grid.inside(nx, nz) || !grid.canStep(x, z, nx, nz)) continue;
        if (blocked.has(nk) && nk !== goal) continue;
        // No cutting a corner past a wall or a person.
        if (dx && dz && (!grid.canStep(x, z, nx, z) || !grid.canStep(x, z, x, nz) || blocked.has(key(nx, z)) || blocked.has(key(x, nz)))) continue;
        const ng = g.get(k) + (dx && dz ? Math.SQRT2 : 1);
        if (ng >= (g.get(nk) ?? Infinity)) continue;
        g.set(nk, ng);
        from.set(nk, k);
        open.push([ng + h(nx, nz), nx, nz]);
      }
    }
  }
  return null;
}

/**
 * Re-plan a script's waypoints for `walker` so it goes around people.
 * @param {any} field FieldScene
 * @param {any} walker Actor
 * @param {Array<[number, number]>} points tile waypoints
 * @returns {Array<[number, number]>}
 */
export function routeAround(field, walker, points) {
  const grid = field.grid;
  const others = bodies(field, walker);
  if (!grid || !others.length || !points.length) return points;
  const occupied = (tx, ty) => others.some((o) => Math.floor(o.x) === tx && Math.floor(o.z) === ty);
  const blocked = new Set(others.map((o) => Math.floor(o.z) * grid.w + Math.floor(o.x)));
  const out = [];
  let at = { x: walker.x, z: walker.z };
  points.forEach(([tx, ty], i) => {
    // The last stop is someone's tile: an NPC stands beside them instead.
    if (i === points.length - 1 && walker !== field.player && occupied(tx, ty)) {
      const near = [[0, 1], [1, 0], [-1, 0], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
        .map(([dx, dy]) => [tx + dx, ty + dy])
        .filter(([x, y]) => grid.walkable(x, y) && !occupied(x, y))
        .sort((p, q) => Math.hypot(p[0] + 0.5 - at.x, p[1] + 0.5 - at.z) - Math.hypot(q[0] + 0.5 - at.x, q[1] + 0.5 - at.z))[0];
      if (near) [tx, ty] = near;
    }
    const to = { x: tx + 0.5, z: ty + 0.5 };
    if (!bumps(at, to, others)) { out.push([tx, ty]); at = to; return; }
    const path = grid.walkable(tx, ty) ? astar(grid, Math.floor(at.x), Math.floor(at.z), tx, ty, blocked) : null;
    if (!path) { out.push([tx, ty]); at = to; return; } // no way around: as written
    // Straighten: from each point, jump to the farthest one in clear sight.
    let cur = at, j = 1;
    while (j < path.length) {
      let far = j;
      for (let m = path.length - 1; m > j; m--) {
        if (clearLine(grid, cur, { x: path[m][0] + 0.5, z: path[m][1] + 0.5 }, others)) { far = m; break; }
      }
      out.push(path[far]);
      cur = { x: path[far][0] + 0.5, z: path[far][1] + 0.5 };
      j = far + 1;
    }
    at = to;
  });
  return out;
}
