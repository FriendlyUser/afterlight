// Quest-marker targets: where each objective (s.objective(text) in src/story) is
// carried out. Keyed by the objective's text, so saves made before markers existed
// get them too, and story scripts stay free of coordinates.
//
// Entry: { text, at } — `text` matches the start of the objective (use the fixed
// part of a template string); `at` is a target, a list of targets, or null (no
// marker, e.g. "Explore Kiteholm"). A target:
//   { map }            arriving on that map is the goal (an onEnter scene, a boss room…)
//   { map, x, y }      a tile on that map (a trigger zone's centre, a door, a lever…)
//   { map, npc }       someone to talk to (the marker follows them)
//   …, unless: 'flag'  hidden once that flag is set (multi-part objectives)
//   …, after: 'flag'   shown only once that flag is set (a later step of the same objective)
// The game finds the way there from anywhere (exits, doors, the world map); see
// src/world/QuestGuide.js. tests/objectives.test.js checks every objective resolves.

import act1 from './act1.js';
import act2 from './act2.js';
import act3 from './act3.js';

/** @type {import('../../types/data').ObjectiveEntry[]} */
export const OBJECTIVE_TARGETS = [...act1, ...act2, ...act3];

/**
 * The targets for an objective text ([] when it has none), longest matching entry wins.
 * @param {string} text
 * @returns {import('../../types/data').ObjectiveTarget[]}
 */
export function objectiveTargets(text) {
  if (!text) return [];
  let best = null;
  for (const e of OBJECTIVE_TARGETS) if (text.startsWith(e.text) && (!best || e.text.length > best.text.length)) best = e;
  if (!best?.at) return [];
  return Array.isArray(best.at) ? best.at : [best.at];
}

/** Is there an entry for this objective at all (null `at` counts)? */
export function hasObjectiveEntry(text) {
  return OBJECTIVE_TARGETS.some((e) => text.startsWith(e.text));
}
