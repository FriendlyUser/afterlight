// Chapter 3 boss scripts (registered through the ch3 content pack).
// Both bosses telegraph their big hit with e_charge one turn ahead (see CHARGE_POWER).

import { SKILLS } from '../data/skills.js';

SKILLS.c3_communion = {
  name: 'Communion', kind: 'support', target: 'self', selfBuffs: { mag: 1, spd: 1 }, anim: 'dark',
  desc: 'She drinks the dark, and it drinks her back.',
};

/** If a charge was declared last turn, release it. */
function release(c, skill) {
  if (!c.m.charging) return null;
  c.m.charging = false;
  return c.use(skill);
}

function telegraph(c, text) {
  c.m.charging = true;
  c.say(text);
  return c.use('e_charge');
}

export const CH3_BOSS_AI = {
  /** The Carillon Wight: knells on a 4-beat (3-beat once the bell cracks). */
  c3_wight(c) {
    const knell = release(c, 'c3_knell');
    if (knell) return knell;
    const cracked = c.m.cracked;
    if (c.hpPct < 0.5 && c.once('crack')) {
      c.m.cracked = true;
      c.say('The great bell splits with a sound like a scream. The Wight tears the clapper free!');
      return c.use('e_buff');
    }
    if (c.hpPct < 0.75 && c.allies.length === 0 && c.once('bones')) {
      c.say('The foundry floor shifts. Old bones answer the bell.');
      return c.use('e_summon');
    }
    const beat = cracked ? 3 : 4;
    if (c.turn % beat === beat - 1) return telegraph(c, 'The Wight raises its hammer toward the great bell...');
    return c.pick(cracked
      ? [['c3_hammer', 2], ['e_rampage', 2], ['c3_toll', 1]]
      : [['c3_hammer', 2], ['attack', 2], ['c3_toll', 1]]);
  },

  /** Sister Mercy: tends her creations, then drinks the Gloam. */
  c3_mercy(c) {
    const song = release(c, 'c3_vespers');
    if (song) return song;
    if (c.turn === 1) {
      c.say('"Hush, now. Let me sing you something."');
      return c.use('c3_vespers');
    }
    if (c.hpPct < 0.5 && c.once('communion')) {
      c.say('Mercy uncorks a vial of darkness and drinks. Her shadow stands up behind her.');
      return c.use('c3_communion');
    }
    if (c.hpPct < 0.25 && c.once('lullaby')) {
      c.say('"Hush now. Sleep. When you wake, it will be noon forever."');
      return c.use('e_sleep');
    }
    const hurt = c.allies.filter((a) => a.hp < a.maxHp * 0.45).length;
    if (hurt && c.rnd() < 0.5 && c.once(`hymn${Math.floor(c.turn / 3)}`)) {
      c.say('"There, there. It only hurts until it doesn\'t."');
      return c.use('c3_hymn');
    }
    if (c.allies.length < 1 && c.turn > 2 && c.once(`vessel${Math.floor(c.turn / 6)}`)) {
      c.say('"Rise, child. Your suffering is not yet over."');
      return c.use('e_summon');
    }
    if (c.turn % 4 === 3) return telegraph(c, 'Mercy draws a long breath. The air goes still, as if waiting for noon...');
    return c.m.communion
      ? c.pick([['c3_unmaking', 3], ['c3_vespers', 2], ['e_dark', 1]])
      : c.pick([['e_dark', 3], ['c3_vespers', 1], ['e_silence', 1], ['e_drain', 1]]);
  },
};
