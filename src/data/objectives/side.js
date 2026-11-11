// Side-quest markers (blue): where each optional quest in the Journal (s.quest(id, title,
// desc)) is carried out, step by step. The main objective's markers are gold (index.js).
//
// Entry: { quest, step?, at }
//   quest  the quest id given to s.quest()
//   step   optional: matches the start of the quest's current description (the text
//          passed to s.quest when that step was set); the longest matching entry wins,
//          and an entry without `step` covers any step not matched by another
//   at     a target, a list of targets, or null (no marker — e.g. "explore anywhere").
//          Targets are the same as objectives': { map }, { map, x, y }, { map, npc },
//          with unless: 'flag' (hidden once set) and after: 'flag' (shown once set);
//          either may be a list, meaning every flag in it (e.g. a giver shown only
//          once all three parts are found: after: ['part_a', 'part_b', 'part_c']).
// tests/side_quests.test.js checks every quest step the story sets has an entry, and
// every target names a real map, tile and NPC.
//
// Split into files by act so they stay readable: side1 (prologue to Aurenne, the
// Bellring, Kindle), side2 (the Pilgrim Road, Act I bounties), side3 (Act II to
// Kiteholm), side4 (Corvin's Roost to the post-game, Act II bounties), side5 (the Lost
// Callings), side6 (the Hunter's Ledger).

import side1 from './side1.js';
import side2 from './side2.js';
import side3 from './side3.js';
import side4 from './side4.js';
import side5 from './side5.js';
import side6 from './side6.js';

/** @type {import('../../types/data').SideQuestEntry[]} */
export const SIDE_TARGETS = [...side1, ...side2, ...side3, ...side4, ...side5, ...side6];

/**
 * The entry for a quest at its current step (desc), or null when there is none.
 * @param {string} id
 * @param {string} [desc]
 */
export function sideQuestEntry(id, desc = '') {
  let best = null;
  for (const e of SIDE_TARGETS) {
    if (e.quest !== id) continue;
    if (e.step && !desc.startsWith(e.step)) continue;
    if (!best || (e.step?.length || 0) > (best.step?.length || 0)) best = e;
  }
  return best;
}

/**
 * Targets for a quest at its current step ([] when none).
 * @param {string} id
 * @param {string} [desc]
 * @returns {import('../../types/data').ObjectiveTarget[]}
 */
export function sideQuestTargets(id, desc = '') {
  const e = sideQuestEntry(id, desc);
  if (!e?.at) return [];
  return Array.isArray(e.at) ? e.at : [e.at];
}
