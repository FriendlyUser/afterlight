// A plausible player build for a given level, shared by the balance simulator and
// the mid-story smoke tests: main Crest ranked by level and, from level 20, a
// secondary Crest and a filled Support budget (most expensive Supports first).
import { CREST_RANK_CP } from '../src/data/crests.js';
import { PASSIVES } from '../src/data/passives.js';

export const crestRankFor = (level) => Math.min(10, 1 + Math.floor(level / 6));

export function kitCharacter(ch, level) {
  const rank = crestRankFor(level);
  ch.crests[ch.crest] = Math.max(ch.crests[ch.crest] || 0, CREST_RANK_CP[rank - 1]);
  if (level < 20) return;
  if (!ch.secondary) {
    const second = ch.crest === 'mender' ? 'arcanist' : 'mender';
    ch.learnCrest(second);
    ch.crests[second] = Math.max(ch.crests[second] || 0, CREST_RANK_CP[Math.max(0, rank - 4)]);
    ch.setSecondary(second);
  }
  const cost = (p) => PASSIVES[p]?.cost || 0;
  for (const p of ch.learnedPassives().sort((a, b) => cost(b) - cost(a))) if (!ch.passives.includes(p)) ch.togglePassive(p);
}
