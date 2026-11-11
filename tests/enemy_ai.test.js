// Foes' judgement (battle/EnemyMind.js), straight through BattleSystem: healers heal the
// most hurt ally and not the unhurt; nobody re-inflicts an ailment already on its target
// or tries one again on someone shown immune; a pack piles onto a Marked party member;
// whole-party moves are saved for when there's a party to hit; a thief steals, runs,
// and gives the gold back if it's felled first; a fled foe leaves no rewards; and Story
// difficulty judges less sharply than Normal, and a level-1 critter less sharply than
// a level-30 beast.
// Run: SIM=240 tools/test.sh enemy_ai 120000
import { GameState } from '../src/state/GameState.js';
import { BattleSystem } from '../src/battle/BattleSystem.js';
import { chooseEnemyAction } from '../src/battle/AI.js';
import { JUDGEMENT, situation, judgementOf } from '../src/battle/EnemyMind.js';
import { RNG } from '../src/core/util.js';
import { contentReady } from '../src/data/content/index.js';

function setup(troop, { level = 20, difficulty = 1, seed = 7 } = {}) {
  const st = new GameState();
  st.settings.difficulty = difficulty;
  for (const id of ['wren', 'ilse', 'bram', 'sable']) st.joinParty(id).setLevel(level);
  st.gold = 1000;
  const rng = new RNG(seed);
  const sys = new BattleSystem({ state: st, troopId: troop, rnd: () => rng.next() });
  sys.start();
  return { st, sys };
}

/** What `foe` chooses over n fresh decisions (memory reset each time). */
function tally(sys, foe, n = 200) {
  const ids = {}, targets = new Map();
  for (let i = 0; i < n; i++) {
    foe.memory = {};
    const a = chooseEnemyAction(sys, foe);
    ids[a.id] = (ids[a.id] || 0) + 1;
    const t = a.targets?.[0];
    if (t) targets.set(t, (targets.get(t) || 0) + 1);
  }
  return { ids, targets, n };
}

export async function run(game, h) {
  await contentReady;

  // 1. A healer heals the most hurt of its allies, and never heals the unhurt.
  {
    const { sys } = setup('tc_glowcap', { level: 3 });
    const cap = sys.enemies.find((e) => e.def.id === 'glowcap');
    let t = tally(sys, cap);
    h.expect(!t.ids.e_glow, `nobody hurt: the Glowcap doesn't heal (${JSON.stringify(t.ids)})`);
    const bat = sys.enemies.find((e) => e.def.id === 'cave_bat');
    bat.hp = Math.round(bat.maxHp * 0.2);
    t = tally(sys, cap);
    h.expect(t.ids.e_glow > t.n * 0.5, `a bat at 20%: the Glowcap mostly heals (${JSON.stringify(t.ids)})`);
    const healed = [...t.targets.entries()].filter(([b]) => b.isEnemy);
    h.expect(healed.length && healed.every(([b]) => b === bat), 'and always the hurt bat');
  }

  // 2. No re-inflicting: silenced casters don't get Hushed again; learned immunity sticks.
  {
    const { sys } = setup('gw_wisp', { level: 8 });
    const wisp = sys.enemies[0];
    let t = tally(sys, wisp);
    h.expect(t.ids.e_silence > 0, 'a Whisper Wisp does use Hush');
    for (const p of sys.party) p.addStatus('silence', 4);
    t = tally(sys, wisp);
    h.expect(!t.ids.e_silence, `with everyone silenced it stops Hushing (${JSON.stringify(t.ids)})`);
    for (const p of sys.party) p.removeStatus('silence');
    // Ilse turns out to be immune: once the foes have seen it, she's no longer a target.
    const ilse = sys.party.find((p) => p.id === 'ilse');
    ilse.immune.add('silence');
    sys.resolver.tryStatus(wisp, ilse, 'silence', 1, []);
    let picked = 0;
    for (let i = 0; i < 200; i++) {
      wisp.memory = {};
      const a = chooseEnemyAction(sys, wisp);
      if (a.id === 'e_silence' && a.targets[0] === ilse) picked++;
    }
    h.expect(picked === 0, 'after it bounced off Ilse once, nobody tries to Hush her again');
  }

  // 3. A pack piles onto a Marked party member.
  {
    const { sys } = setup('c2_alpha_pack', { level: 9 });
    const bram = sys.party.find((p) => p.id === 'bram');
    bram.addStatus('marked', 4);
    const wolves = sys.enemies.filter((e) => e.def.id === 'wold_wolf');
    let onBram = 0, n = 0;
    for (const w of wolves) {
      const t = tally(sys, w, 100);
      for (const [b, k] of t.targets) { if (b.isParty) { n += k; if (b === bram) onBram += k; } }
    }
    h.expect(onBram / n > 0.4, `the wolves go for Marked Bram (${Math.round((100 * onBram) / n)}% of their attacks; 25% would be chance)`);
  }

  // 4. Whole-party moves want a whole party to hit.
  {
    const { sys } = setup('gw_bandits', { level: 8 });
    const foe = sys.enemies[0];
    foe.def = { ...foe.def, skills: [['e_firebreath', 1], ['e_ember', 1]] };
    foe.level = 30; // a foe sharp enough to judge fully
    const all = tally(sys, foe, 400).ids.e_firebreath || 0;
    for (const p of sys.party.slice(1)) { p.hp = 0; p.alive = false; }
    const one = tally(sys, foe, 400).ids.e_firebreath || 0;
    h.expect(all > one * 1.25, `Fire Breath with four to hit: ${all}/400; with one: ${one}/400`);
  }

  // 5. A thief steals, runs, and gives it back if felled first. A fled foe leaves nothing.
  {
    const { st, sys } = setup('c2_cutpurses', { level: 7 });
    const [a, b] = sys.enemies;
    const gold0 = st.gold;
    sys.act(a, { kind: 'skill', id: 'e_steal', targets: [sys.party[0]] });
    sys.act(b, { kind: 'skill', id: 'e_steal', targets: [sys.party[0]] });
    const took = a.memory.pilfered;
    h.expect(took > 0 && st.gold === gold0 - took - b.memory.pilfered, `two cutpurses pinch ${took} + ${b.memory.pilfered} gold`);
    let fled = false;
    for (let i = 0; i < 40 && !fled; i++) { const act = chooseEnemyAction(sys, b); if (act.id === 'e_flee') { sys.act(b, act); fled = true; } }
    h.expect(fled && !b.alive && b.fled, 'one of them runs for it');
    const before = st.gold;
    const ev = [];
    sys.resolver.applyDamage(a, a.hp + 10, ev);
    h.expect(!a.alive && st.gold === before + took && ev.some((e) => e.t === 'text' && /Recovered/.test(e.text)), 'the other is felled and drops what it took');
    h.expect(sys.outcome() === 'win', 'with one felled and one fled, the battle is won');
    const r = sys.applyRewards();
    const solo = sys.enemies[0].base.exp;
    h.expect(r.exp === solo, `rewards count only the felled one (${r.exp} EXP)`);
  }

  // 6. Story difficulty judges less sharply than Normal, Hard most sharply: the share a
  // heal gets of the Glowcap's choices with a bat at 30% (its weights, bent by judgement).
  {
    const { sys } = setup('tc_glowcap', { level: 3 });
    const cap = sys.enemies.find((e) => e.def.id === 'glowcap');
    const bat = sys.enemies.find((e) => e.def.id === 'cave_bat');
    bat.hp = Math.round(bat.maxHp * 0.3);
    const share = (j) => {
      const w = cap.def.skills.map(([id, base]) => [id, base * Math.max(0, situation(sys, cap, id)) ** j]);
      const total = w.reduce((s, [, x]) => s + x, 0);
      return w.find(([id]) => id === 'e_glow')[1] / total;
    };
    const [story, normal, hard] = JUDGEMENT.map(share);
    h.expect(story < normal && normal < hard, `heal share: Story ${Math.round(story * 100)}%, Normal ${Math.round(normal * 100)}%, Hard ${Math.round(hard * 100)}%`);
    const dim = judgementOf(sys, cap), sharp = judgementOf(sys, { level: 30 });
    h.expect(dim < sharp && sharp === JUDGEMENT[1], `a level-${cap.level} Glowcap judges at ${dim.toFixed(2)}, a level-30 foe at ${sharp.toFixed(2)}`);
  }
}
