// The Hunter's Ledger (story/hunt.js): ten marks — named rare beasts — posted by Greer
// Thackery, bestiarist of the Aurenne Collegium. Five are posted in Act I when she
// gives the party her Compendium (Aurenne, Chapter 3); five more after the Sundering,
// when the party finds her again in Keelhaven. An Act I mark left alive when the sky
// broke turns up again in Act II (its `after` spot), so none can be missed.
//
// A mark stands in the field where it lives (content/hunt.js puts it on its map as a
// monster-look NPC); talking to it starts the fight. Greer pays for each one felled,
// gives a title and a keepsake at 3, 6 and 10, and pays for every new kind of creature
// the Compendium records (KIND_MILESTONES).

import { kindsDefeated } from './monsterInfo.js';

/**
 * @typedef {{ map: string, x: number, y: number, dir?: string }} Spot
 * @typedef {{
 *   name: string, enemy: string, act: 1 | 2, home: Spot, after?: Spot,
 *   where: string, rumour: string, approach: string, felled: string,
 *   reward: { gold: number, items: Array<[string, number]> },
 * }} Mark
 */

/** @type {Record<string, Mark>} */
export const MARKS = {
  gnarlhide: {
    name: 'Old Gnarlhide', enemy: 'hm_gnarlhide', act: 1,
    home: { map: 'c2_td_fields', x: 21, y: 22 }, after: { map: 'c6_drift', x: 19, y: 10 },
    where: 'the East Fields of Thistledown',
    rumour: 'A boar the size of a hay cart has been tearing up the East Fields outside Thistledown. The farmers call him Old Gnarlhide and leave him the south field.',
    approach: 'A boar the size of a hay cart, gray with age, rooting through the stubble. Its tusks are as long as Wren\'s arm. It lifts its head and looks straight at you.',
    felled: 'Old Gnarlhide goes down like a felled oak, and the field is quiet.',
    reward: { gold: 600, items: [['hi_tonic', 3]] },
  },
  widow: {
    name: 'The Wold Widow', enemy: 'hm_widow', act: 1,
    home: { map: 'c2_wold_heart', x: 33, y: 20 }, after: { map: 'c11_thornwood', x: 17, y: 22 },
    where: 'the heart of the Whisperwold',
    rumour: 'In the Whisperwold\'s heart there\'s a web strung between two oaks, wide as a sail. Whatever spun it is called the Widow, and her brood comes with her.',
    approach: 'A web between two oaks, wide as a sail, beaded with dew and worse. Something the color of a bruise sits at its center. It has far too many eyes, and all of them open.',
    felled: 'The Widow curls up like a burnt leaf. Her web sags and tears in the wind.',
    reward: { gold: 700, items: [['antidote', 4], ['ether', 2]] },
  },
  knot: {
    name: 'Mother Knot', enemy: 'hm_knot', act: 1,
    home: { map: 'c3_uc_sewers', x: 28, y: 12 }, after: { map: 'ch7_drowned_undercroft', x: 5, y: 16 },
    where: 'the sewers under Aurenne',
    rumour: 'The rat-catchers won\'t go into the deep sewers under Aurenne anymore. They say there\'s a rat king down there, a hundred rats knotted at the tail, and it eats its own young to heal.',
    approach: 'A heap in the dark that squeaks with a hundred voices: rats knotted tail to tail into one great shuddering thing. The middle of it has a face.',
    felled: 'Mother Knot comes apart into a hundred fleeing rats. None of them look back.',
    reward: { gold: 900, items: [['hi_tonic', 3], ['panacea', 1]] },
  },
  glasseye: {
    name: 'Glasseye', enemy: 'hm_glasseye', act: 1,
    home: { map: 'c4a_dunes', x: 29, y: 41 }, after: { map: 'c11_saltglass', x: 19, y: 21 },
    where: 'the deep dunes of the Sunscar',
    rumour: 'Pilgrims crossing the Sunscar talk of a basilisk with one eye of clear glass. Look into it and your legs turn to stone, they say. Look away and it breathes fire.',
    approach: 'A long, low drake basks on a dune of fused sand. One of its eyes is clear glass with the sun burning in it. The air around it shimmers.',
    felled: 'Glasseye\'s glass eye cracks across. Then the light goes out of it.',
    reward: { gold: 1200, items: [['hi_ether', 2], ['saltglass', 3]] },
  },
  belcher: {
    name: 'Old Belcher', enemy: 'hm_belcher', act: 1,
    home: { map: 'c4b_drownmere', x: 44, y: 20 }, after: { map: 'c11_mirefen', x: 6, y: 31 },
    where: 'the Drownmere in the Mirefen',
    rumour: 'In the Drownmere there\'s a toad as big as a cottage. The marsh-folk call him Old Belcher. He sings people to sleep, then sits on them.',
    approach: 'What looked like a mossy hillock in the bog opens two yellow eyes. It is a toad, as big as a cottage. Its throat swells like a bellows.',
    felled: 'Old Belcher deflates with one long, last croak that echoes across the whole mere.',
    reward: { gold: 1600, items: [['mega_tonic', 2], ['echo_herb', 3]] },
  },
  cinderjaw: {
    name: 'Cinderjaw', enemy: 'hm_cinderjaw', act: 2,
    home: { map: 'c6_drift', x: 30, y: 23 },
    where: 'the ash of the Drift',
    rumour: 'Out on the Drift there\'s a drake that swims through the ash like a fish through water. Salvagers call it Cinderjaw. The ash catches fire wherever it surfaces.',
    approach: 'The ash heaves and something surfaces: a drake of black slag, embers glowing between its scales. Its jaws drip fire.',
    felled: 'Cinderjaw sinks back into the ash and does not surface again. The embers go gray.',
    reward: { gold: 2400, items: [['mega_tonic', 3], ['burn_salve', 4]] },
  },
  hymnal: {
    name: 'Hymnal', enemy: 'hm_hymnal', act: 2,
    home: { map: 'ch7_drowned_choir', x: 13, y: 5 },
    where: 'the Drowned Choir under ruined Aurenne',
    rumour: 'Under the ruins of Aurenne, where the Choir used to sing, an eel as long as a nave has learned the hymns. Those who hear it stop being able to speak.',
    approach: 'In the flooded choir loft, an eel as long as the nave coils between the pews. When it opens its mouth, it sings in a choirboy\'s voice.',
    felled: 'Hymnal\'s last note breaks off in the middle. The loft is silent for the first time in a year.',
    reward: { gold: 3000, items: [['x_ether', 2], ['wake_charm', 1]] },
  },
  scrapking: {
    name: 'The Scrap King', enemy: 'hm_scrapking', act: 2,
    home: { map: 'c9_boneyard', x: 29, y: 21 },
    where: 'the Boneyard below Corvin\'s Roost',
    rumour: 'In the Boneyard under Corvin\'s Roost, the scrap has crowned itself a king: a golem that bolts drones together out of junk, then eats them to mend itself.',
    approach: 'A throne of wrecked engines, and on it a giant of scrap wearing a crown of bent rivets. Little drones buzz around it like flies. It stands up.',
    felled: 'The Scrap King comes apart bolt by bolt. The crown rolls to your feet. It\'s only a cog.',
    reward: { gold: 3600, items: [['x_tonic', 3], ['scrap_gear', 4]] },
  },
  frost: {
    name: 'Grandmother Frost', enemy: 'hm_frost', act: 2,
    home: { map: 'c11_frosthollow', x: 29, y: 26 },
    where: 'Frosthollow',
    rumour: 'The monks of Frosthollow whisper about Grandmother Frost: a white shape on the pass that sings travelers to sleep in the snow, and the wolves come for them after.',
    approach: 'A shape of falling snow in the shape of an old woman, humming. Wolves of white frost sit around her, like grandchildren listening to a story.',
    felled: 'Grandmother Frost stops humming. The snow she was made of settles, softly, over nothing.',
    reward: { gold: 4200, items: [['megalixir', 1], ['frost_lily', 3]] },
  },
  neverwake: {
    name: 'Neverwake', enemy: 'hm_neverwake', act: 2,
    home: { map: 'c11_rift', x: 8, y: 5 },
    where: 'the Gloam Rift',
    rumour: 'Deep in the Gloam Rift there\'s an eye that has never closed. Whoever it looks at falls asleep, and some of them never wake.',
    approach: 'An eye as tall as a door hangs in the dark of the Rift, unblinking. You feel very, very tired.',
    felled: 'Neverwake shuts. For the first time, perhaps ever, it sleeps.',
    reward: { gold: 5000, items: [['megalixir', 1], ['x_ether', 3]] },
  },
};

export const MARK_IDS = Object.keys(MARKS);

/** Titles and keepsakes for marks felled. */
export const RANKS = [
  { n: 3, flag: 'hm_rank_1', title: 'Tracker', items: [['hm_hunters_charm', 1]] },
  { n: 6, flag: 'hm_rank_2', title: 'Stalker', items: [['hm_stalkers_cloak', 1]] },
  { n: 10, flag: 'hm_rank_3', title: 'Huntmaster', items: [['hm_huntmasters_horn', 1]] },
];

/** Greer pays for kinds of creature felled (the Compendium's count). */
export const KIND_MILESTONES = [
  { n: 25, flag: 'hm_kinds_25', items: [['hi_tonic', 3], ['ether', 3]] },
  { n: 50, flag: 'hm_kinds_50', items: [['vigor_seed', 2]] },
  { n: 100, flag: 'hm_kinds_100', items: [['power_fruit', 1], ['magic_fruit', 1]] },
  { n: 150, flag: 'hm_kinds_150', items: [['guard_fruit', 1], ['spirit_fruit', 1], ['swift_fruit', 1]] },
  { n: 200, flag: 'hm_kinds_200', items: [['crest_tome', 3]] },
];

const f = (st, k) => !!st.flags[k];
export const felled = (st, id) => f(st, `hm_${id}`);
export const paid = (st, id) => f(st, `hm_${id}_paid`);

/** Is the mark posted (its hunt open) right now? */
export function posted(st, id) {
  if (!f(st, 'hunt_met')) return false;
  return MARKS[id].act === 1 || f(st, 'hunt_keelhaven');
}

/** Which of its spots the mark stands at now: 'home', 'after' or null (not there). */
export function markAt(st, id) {
  const m = MARKS[id];
  if (!posted(st, id) || felled(st, id)) return null;
  const sundered = f(st, 'sundered');
  if (m.act === 2) return 'home';
  if (!sundered) return 'home';
  return m.after && f(st, 'hunt_keelhaven') ? 'after' : null;
}

export const marksFelled = (st) => MARK_IDS.filter((id) => felled(st, id)).length;

/** Anything Greer has to pay out? */
export function owed(st) {
  if (MARK_IDS.some((id) => felled(st, id) && !paid(st, id))) return true;
  const n = marksFelled(st);
  if (RANKS.some((r) => n >= r.n && !f(st, r.flag))) return true;
  const kinds = kindsDefeated(st);
  return KIND_MILESTONES.some((k) => kinds >= k.n && !f(st, k.flag));
}

/** Where Greer is: Aurenne's canal bridge before the Sundering, Keelhaven after. */
export const greerHere = (st) => (f(st, 'sundered') ? 'c6_keelhaven' : 'aurenne');
