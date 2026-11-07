// Shared helpers for Chapter 4b scenes.
//
// The field only shows the party leader. For cutscenes we stand the rest of the cast
// up as temporary actors; whoever leads the party is played by the 'player' actor, so
// scenes stay correct even if the player has reordered the party.

/**
 * stage(s, { wren: [x, y, dir], ilse: [...], ... }) -> { wren: actorId, ilse: actorId, ... }
 * Characters not in the party are skipped (their id maps to null, which every
 * actor call ignores).
 */
export function stage(s, positions) {
  const party = s.state.party;
  const lead = party[0];
  const ids = {};
  for (const [who, [x, y, dir = 'down']] of Object.entries(positions)) {
    if (!party.includes(who)) { ids[who] = null; continue; }
    if (who === lead) {
      s.place('player', x, y, dir);
      ids[who] = 'player';
    } else {
      const look = s.state.characters[who]?.lookId || who;
      s.spawn(`c4b_${who}`, look, x, y, dir);
      ids[who] = `c4b_${who}`;
    }
  }
  return ids;
}

/** Remove the stand-ins created by stage(); optionally park the player. */
export function unstage(s, ids, park) {
  for (const id of Object.values(ids)) if (id && id !== 'player') s.remove(id);
  if (park) s.place('player', ...park);
}

/** Walk several actors at once and wait for all of them. */
export function moveAll(s, moves, speed) {
  return Promise.all(moves.filter(([id]) => id).map(([id, pts]) => s.move(id, pts, speed)));
}

export const inParty = (s, id) => s.state.party.includes(id);
