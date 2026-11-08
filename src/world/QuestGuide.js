// Quest guide: turns the current objective into where to go next. The objective's
// targets come from src/data/objectives; this finds the way to the nearest one
// across the maps that are open right now — exits, building doors, the world map
// (an @world exit, or Menu → Travel) — and says what to head for on this map.

import { MAPS } from '../data/maps/index.js';
import { openNodes } from '../data/worldmap.js';
import { objectiveTargets } from '../data/objectives/index.js';

/** The world map, as a stop on a route. */
export const WORLD = '@world';

/** Opening the world map from the menu, against 1 for each exit walked through. */
const MENU_TRAVEL_COST = 4;

/** The objective's targets that apply now: done parts (unless) dropped, later steps (after) not yet shown. */
export function activeTargets(st) {
  return objectiveTargets(st.vars.objective).filter((t) => !(t.unless && st.flags[t.unless]) && !(t.after && !st.flags[t.after]));
}

/**
 * A step on a route: a way out of a map (exit, door, @world exit), opening the world
 * map from the menu ('travel'), or a world-map stop ('node').
 * @typedef {object} Way
 * @property {string} to  a map id, or WORLD
 * @property {'exit' | 'door' | 'world' | 'travel' | 'node'} kind
 * @property {number} [x]
 * @property {number} [y]
 * @property {number} [w]
 * @property {number} [h]
 * @property {number} [cost]  route cost (default 1)
 * @property {import('../types/data').WorldNode} [node]
 */

/**
 * Ways out of a map that are open right now.
 * @param {import('../types/data').MapDef} map
 * @returns {Way[]}
 */
function waysOut(map, st) {
  /** @type {Way[]} */
  const out = [];
  for (const e of map.exits || []) {
    if (e.cond && !e.cond(st)) continue;
    const world = e.to === '@world';
    out.push({ to: world ? WORLD : e.to, kind: world ? 'world' : 'exit', x: e.x, y: e.y, w: e.w || 1, h: e.h || 1 });
  }
  for (const b of map.buildings || []) {
    const d = b.door;
    if (!d?.to || (d.locked && !(d.unlockFlag && st.flags[d.unlockFlag]))) continue;
    out.push({ to: d.to, kind: 'door', x: b.x + (d.dx ?? Math.floor(b.w / 2)), y: b.y + b.d - 1, w: 1, h: 1 });
  }
  for (const s of map.structures || []) {
    if (!s.doorTo || (s.unlockFlag && !st.flags[s.unlockFlag])) continue;
    out.push({ to: s.doorTo, kind: 'door', x: s.x, y: s.y + 1, w: 1, h: 1 });
  }
  return out;
}

const canMenuTravel = (map, st) => !map.noTravel && !st.flags.noTravel;

/**
 * The way from `from` (a map id, or WORLD) to the nearest target map.
 * Returns null when no target can be reached, else
 *   { goals }          — targets on this very map
 *   { hop, node, to }  — hop: the first way out to take ({ kind: 'exit'|'door'|'world'|'travel'|'node', … });
 *                        node: the world-map stop on the route, if it crosses the world map.
 */
export function route(from, targets, st) {
  const goals = new Set(targets.map((t) => t.map));
  if (goals.has(from)) return { goals: targets.filter((t) => t.map === from) };
  const nodes = openNodes(st);
  const dist = new Map([[from, 0]]);
  const via = new Map(); // map -> { hop, node }: how the best route to it started, and its world stop
  const queue = [[0, from]];
  while (queue.length) {
    queue.sort((a, b) => a[0] - b[0]);
    const [d, id] = queue.shift();
    if (d > dist.get(id)) continue;
    if (goals.has(id)) return { ...via.get(id), to: id };
    /** @type {Way[]} */
    let edges;
    if (id === WORLD) edges = nodes.map((n) => ({ to: n.mapId, kind: 'node', node: n }));
    else {
      const map = MAPS[id];
      if (!map) continue;
      edges = waysOut(map, st);
      if (nodes.length && canMenuTravel(map, st)) edges.push({ to: WORLD, kind: 'travel', cost: MENU_TRAVEL_COST });
    }
    for (const e of edges) {
      if (e.to !== WORLD && !MAPS[e.to]) continue;
      const nd = d + (e.cost ?? 1);
      if (nd >= (dist.get(e.to) ?? Infinity)) continue;
      dist.set(e.to, nd);
      const prev = via.get(id);
      via.set(e.to, { hop: prev?.hop ?? e, node: e.node ?? prev?.node ?? null });
      queue.push([nd, e.to]);
    }
  }
  return null;
}

/** Centre tile of a way out (an exit strip's middle, a door's tile). */
export function hopTile(hop) {
  return { x: hop.x + Math.floor((hop.w - 1) / 2), y: hop.y + Math.floor((hop.h - 1) / 2) };
}
