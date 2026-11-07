// Initial state for a fresh playthrough. Returns the FieldScene entry params.

export function startNewGame(state) {
  const wren = state.joinParty('wren');
  wren.sealed = true; // Crests awaken at the Kindling (Chapter 2)
  state.gold = 120;
  state.inventory.add('tonic', 4);
  state.inventory.add('antidote', 1);
  state.chapter = 0;
  state.vars.objective = 'Get up. Tomorrow is the Kindling — today there are chores.';
  state.vars.journal = [];
  return { mapId: 'lf_wren_house', x: 3, y: 3, dir: 'down' };
}

/**
 * New Game+: a fresh story that keeps everyone's levels, Crest mastery, gear,
 * gold and (non-key) items from a cleared save.
 */
export function startNewGamePlus(state, cleared) {
  const start = startNewGame(state);
  for (const [id, ch] of Object.entries(cleared.characters)) {
    ch.lookId = ch.def.look;
    ch.sealed = false;
    state.characters[id] = ch;
  }
  state.party = ['wren'];
  state.gold = cleared.gold;
  for (const [id, n] of cleared.inventory.list((d) => d.kind !== 'key')) {
    state.inventory.items.set(id, Math.max(n, state.inventory.count(id)));
  }
  for (const c of cleared.unlockedCrests) state.unlockCrest(c);
  state.flags.ngPlus = true;
  state.flags.crestArtLearned = true;
  state.bestiary = cleared.bestiary;
  state.vars.fishLog = cleared.vars.fishLog || {};
  state.healParty();
  return start;
}
