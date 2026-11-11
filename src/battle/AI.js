// Enemy decision making. Ordinary turns are weighed by EnemyMind (weighted skills
// bent by circumstance, judged targets, a few reflexes); bosses use named scripts
// with phases and telegraphs, and their open picks are judged the same way.

import { SKILLS } from '../data/skills.js';
import { judge, targetsFor, reflex, notePackTarget, judgementOf } from './EnemyMind.js';

function action(sys, self, id, rnd, targets) {
  return { kind: 'skill', id, targets: targets || targetsFor(sys, self, id) };
}

/** Context object handed to boss scripts. */
function makeCtx(sys, self) {
  const rnd = sys.rnd;
  const m = self.memory;
  const onceKeys = new Set();
  return {
    sys, self, rnd, m, onceKeys,
    turn: m.turn,
    hpPct: self.hp / self.maxHp,
    partyAlive: sys.party.filter((p) => p.alive),
    allies: sys.enemies.filter((e) => e.alive && e !== self),
    use: (id, targets) => action(sys, self, id, rnd, targets),
    pick: (list) => judge(sys, self, list, judgementOf(sys, self) * 0.8),
    once: (key) => { if (m[key]) return false; m[key] = true; onceKeys.add(key); return true; },
    say: (text) => sys.queueText(text),
  };
}

/** A wind-up move: the e_charge telegraph, or a tell that marks the user 'windup'. */
export function isTell(id) {
  return id === 'e_charge' || !!SKILLS[id]?.selfStatus?.includes('windup');
}

/**
 * The memory keys a boss script set up on its wind-up turn (its "release the big
 * move next turn" flags), with their previous values — so a Break can undo them.
 * Keys claimed with c.once() are phase markers and are left alone.
 */
function tellKeys(before, after, onceKeys) {
  const keys = {};
  for (const k of Object.keys(after)) if (k !== 'turn' && !onceKeys.has(k) && after[k] !== before[k]) keys[k] = before[k];
  return keys;
}

/** Breaking a winding-up foe interrupts the telegraphed move. Returns true if it did. */
export function interruptTell(foe) {
  const had = foe.hasStatus('charging') || foe.hasStatus('windup');
  if (!had) return false;
  foe.removeStatus('charging');
  foe.removeStatus('windup');
  for (const [k, v] of Object.entries(foe.tell || {})) { if (v === undefined) delete foe.memory[k]; else foe.memory[k] = v; }
  foe.tell = null;
  return true;
}

export function chooseEnemyAction(sys, self) {
  const rnd = sys.rnd;
  self.memory.turn = (self.memory.turn || 0) + 1;

  if (self.hasStatus('charm')) {
    const own = sys.enemies.filter((e) => e.alive && e !== self);
    if (own.length) return { kind: 'skill', id: 'attack', targets: [own[Math.floor(rnd() * own.length)]], charmed: true };
  }
  if (self.hasStatus('berserk')) return action(sys, self, 'attack', rnd);

  const script = BOSS_AI[self.def.ai];
  if (script) {
    const before = { ...self.memory };
    const ctx = makeCtx(sys, self);
    const a = script(ctx);
    if (a && isTell(a.id)) self.tell = tellKeys(before, self.memory, ctx.onceKeys);
    if (a) return a;
  }

  const r = reflex(sys, self);
  if (r) {
    if (r.id === 'e_enrage') sys.queueText(`${self.name} flies into a rage!`);
    return r;
  }
  const a = judge(sys, self, self.def.skills || [['attack', 1]]);
  notePackTarget(sys, self, a);
  return a;
}

// ---------------------------------------------------------------------------
// Boss scripts: (ctx) => action | null (null falls back to default skills)
// ---------------------------------------------------------------------------

export const BOSS_AI = {
  drowned_hound(c) {
    if (c.hpPct < 0.55 && c.once('pups')) {
      c.say('The Drowned Hound howls. Shadows tear loose from its fur!');
      return c.use('e_summon');
    }
    if (c.turn % 4 === 0) return c.use('e_darkwave');
    return c.pick([['e_bite', 3], ['e_claw', 2], ['e_drain', 1], ['e_howl', c.hpPct < 0.5 ? 1 : 0.3]]);
  },
  brinefang(c) {
    if (c.m.charging) { c.m.charging = false; return c.use('e_tidal'); }
    if (c.turn % 4 === 3) { c.m.charging = true; c.say('Brinefang draws the sea into its throat...'); return c.use('e_charge'); }
    return c.pick([['e_bite', 3], ['e_constrict', 2], ['e_spit', 2]]);
  },
  red_tam(c) {
    if (c.hpPct < 0.5 && c.once('rage')) { c.say('"You little— Lads, GET THEM!"'); return c.use('e_buff'); }
    if (c.turn % 3 === 0) return c.use('e_cleave');
    return c.pick([['attack', 3], ['e_rampage', c.hpPct < 0.5 ? 2 : 0.5], ['e_stun', 1]]);
  },
  sister_mercy(c) {
    const beast = c.allies.find((a) => a.def.id === 'gloam_beast');
    if (!beast && c.turn > 1 && c.once(`summon${Math.floor(c.turn / 4)}`)) {
      c.say('"Rise, child. Your suffering is not yet over."');
      return c.use('e_summon');
    }
    if (beast && beast.hp < beast.maxHp * 0.5 && c.rnd() < 0.5) return c.use('e_heal', [beast]);
    if (c.hpPct < 0.4 && c.once('lament')) { c.say('"Hush now. Sleep. When you wake, it will be noon forever."'); return c.use('e_sleep'); }
    return c.pick([['e_lament', 2], ['e_dark', 3], ['e_silence', 1], ['e_drain', 1]]);
  },
};

export function registerBossAI(map) { Object.assign(BOSS_AI, map); }
