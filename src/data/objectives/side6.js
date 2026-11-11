// Side-quest marker targets (blue), part 6 — the Hunter's Ledger (story/hunt.js): every
// mark standing in the field right now, and Greer Thackery whenever she has something
// to pay out (or, after the Sundering, until the party has found her in Keelhaven).

import { MARKS, markAt, owed, greerHere } from '../hunt.js';

/** @type {import('../../types/data').ObjectiveTarget[]} */
const marks = Object.entries(MARKS).flatMap(([id, m]) => ['home', 'after']
  .filter((where) => m[where])
  .map((where) => ({ map: m[where].map, x: m[where].x, y: m[where].y, when: (st) => markAt(st, id) === where })));

/** @type {import('../../types/data').SideQuestEntry[]} */
export default [
  {
    quest: 'hunt',
    at: [
      { map: 'aurenne', npc: 'greer', when: (st) => greerHere(st) === 'aurenne' && owed(st) },
      { map: 'c6_keelhaven', npc: 'greer', when: (st) => greerHere(st) === 'c6_keelhaven' && (!st.flags.hunt_keelhaven || owed(st)) },
      ...marks,
    ],
  },
];
