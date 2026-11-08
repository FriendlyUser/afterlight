// Hearthstone fast travel. Walking within reach of a listed Hearthstone (data/waystones.js)
// attunes it: the party's tile becomes its arrival point, and the world map offers it
// under its destination. Records live in state.vars.waystones, so they save with the game.

import { WAYSTONES } from '../data/waystones.js';
import { getMap } from '../data/maps/index.js';

const REACH = 2; // tiles (Chebyshev) from the stone

/** Attune the Hearthstone near the party on this field's map. Returns true when newly attuned. */
export function attuneNear(field, x, y) {
  if (!WAYSTONES[field.mapId]) return false;
  const st = field.state;
  const rec = (st.vars.waystones ||= {});
  if (rec[field.mapId]) return false;
  const near = field.built.interactables.some((i) => i.kind === 'save' && Math.max(Math.abs(i.x - x), Math.abs(i.y - y)) <= REACH);
  if (!near) return false;
  rec[field.mapId] = { x, y, dir: field.player.dir };
  return true;
}

/** The attuned Hearthstones under a world-map node: [{ mapId, name, tx, ty, dir }]. */
export function waystonesAt(node, st) {
  const rec = st.vars.waystones || {};
  return Object.entries(WAYSTONES)
    .filter(([mapId, nodeId]) => nodeId === node.id && rec[mapId])
    .map(([mapId]) => ({ mapId, name: getMap(mapId)?.name || mapId, tx: rec[mapId].x, ty: rec[mapId].y, dir: rec[mapId].dir || 'down' }));
}

/** The node a map hangs off, for marking "you are here" from inside a dungeon. */
export const waystoneNode = (mapId) => WAYSTONES[mapId] || null;
