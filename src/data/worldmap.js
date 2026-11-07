// World map travel nodes. Packs push entries:
// { id, name, region, act: 1|2|3, x, y (0..1000 map coords), mapId, tx, ty, dir, unlock: flag, desc }
// Lanternfall is reachable only by sea in Act I (the story brings you home in Chapter 5).
export const WORLD_NODES = [];

/** Can the party travel to this node now? unlock: undefined | 'flag' | (state) => bool */
export function nodeUnlocked(n, st) {
  if (!n.unlock) return true;
  return typeof n.unlock === 'function' ? !!n.unlock(st) : !!st.flags[n.unlock];
}

/** The world map's nodes the party can travel to right now (this act's, unlocked). */
export function openNodes(st) {
  const act = st.flags.sundered ? 2 : 1;
  return WORLD_NODES.filter((n) => (n.act || 1) === act && nodeUnlocked(n, st));
}
