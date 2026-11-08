// Shared fishing content: the angler who trades rewards for species caught.
import { FISH } from '../data/fish.js';

/** @type {Array<[number, string, number, string]>} species needed, item, count, line */
const REWARDS = [
  [3, 'hi_tonic', 3, 'Not bad! Here — a few tonics for your trouble.'],
  [6, 'lucky_coin', 1, 'Six kinds! Take my lucky coin. It never once brought me luck, but it might like you better.'],
  [9, 'swift_fruit', 2, 'Nine! You\'ve got the hands for it. These fruits came all the way from the Sunscar.'],
  [12, 'crest_brooch', 1, 'Twelve species. My old guild brooch — the Crests in it still turn.'],
  [16, 'ribbon', 1, 'Every fish in the world. Every one. I... take this. You\'ve earned something that matters.'],
];

/** Talk script for an angler NPC: s.run(anglerTalk) or npc run: (s) => anglerTalk(s, 'Angler Mabry'). */
export async function anglerTalk(s, name = 'Angler Mabry') {
  const log = s.state.vars.fishLog || {};
  const species = Object.keys(log).length;
  const claimed = s.state.vars.fishRewards || 0;
  if (!s.has('fishing_rod')) {
    await s.say(name, ['A Halloway without a rod? Shameful. Take my spare.', 'Look for ripples by docks, piers and pools — face the water and press *Z*.']);
    await s.give('fishing_rod');
    return;
  }
  await s.say(name, `You've landed *${species}* of the ${Object.keys(FISH).length} kinds of fish I know.`);
  let given = claimed;
  for (let i = claimed; i < REWARDS.length; i++) {
    const [need, item, n, line] = REWARDS[i];
    if (species < need) break;
    await s.say(name, line);
    await s.give(item, n);
    given = i + 1;
  }
  s.state.vars.fishRewards = given;
  if (given < REWARDS.length) await s.say(name, `Bring me ${REWARDS[given][0]} kinds and I'll make it worth your while.`);
}
