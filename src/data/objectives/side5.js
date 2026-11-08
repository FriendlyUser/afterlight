// Side-quest marker targets (blue), part 5 — the Lost Callings (story/lost.js): each
// quest points at its slab of crest-glass, where the guardian waits.

/** @type {import('../../types/data').SideQuestEntry[]} */
export default [
  { quest: 'lost_tidecaller', at: { map: 'c6_shattered_sea', x: 66, y: 24, unless: 'lost_tidecaller' } },
  { quest: 'lost_bellwright', at: { map: 'ch7_drowned_undercroft', x: 44, y: 4, unless: 'lost_bellwright' } },
  { quest: 'lost_kitewright', at: { map: 'c8_underhang', x: 17, y: 39, unless: 'lost_kitewright' } },
  { quest: 'lost_mnemonist', at: { map: 'side_garden_maze', x: 37, y: 10, unless: 'lost_mnemonist' } },
];
