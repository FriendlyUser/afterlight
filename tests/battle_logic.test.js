// Exercises every special battle mechanic through BattleSystem directly.
// Run: tools/test.sh battle_logic 30000
import { GameState } from '../src/state/GameState.js';
import { BattleSystem } from '../src/battle/BattleSystem.js';
import { SKILLS } from '../src/data/skills.js';
import { RNG } from '../src/core/util.js';
import { contentReady } from '../src/data/content/index.js';

function setup(troop = 'gw_wolves', level = 30) {
  const st = new GameState();
  for (const id of ['wren', 'ilse', 'bram', 'sable', 'pip', 'corvin']) st.joinParty(id).setLevel(level);
  st.gold = 5000;
  for (const it of ['tonic', 'fire_bomb', 'ember_feather', 'smoke_ball', 'afterglow_vial', 'panacea']) st.inventory.add(it, 3);
  const rng = new RNG(42);
  const sys = new BattleSystem({ state: st, troopId: troop, rnd: () => rng.next() });
  sys.start();
  return { st, sys };
}

export async function run(game, h) {
  const errors = [];
  const tryAct = (sys, user, action, label) => {
    try {
      const ev = sys.act(user, action);
      sys.endTurn(user, action);
      return ev;
    } catch (e) {
      errors.push(`${label}: ${e.stack || e}`);
      return [];
    }
  };

  // Every skill in the game, used by Wren on a fresh battle.
  for (const id of Object.keys(SKILLS)) {
    const { sys } = setup();
    const user = sys.party[0];
    user.mp = 999;
    const s = SKILLS[id];
    const foe = sys.enemies[0];
    let targets = [foe];
    if (['ally', 'allyAny', 'self', 'allies'].includes(s.target)) targets = [sys.party[1]];
    if (s.target === 'ko') { sys.party[1].damage(99999); targets = [sys.party[1]]; }
    sys.afterglow = 300;
    tryAct(sys, user, { kind: id.startsWith('link_') ? 'link' : 'skill', id, targets, cost: 100, partners: [sys.party[1]] }, `skill ${id}`);
    if (s.special === 'jump') {
      const t = sys.beginTurn(user);
      if (!t.auto) errors.push(`jump ${id}: no landing action`);
      else tryAct(sys, user, t.auto, `jump landing ${id}`);
    }
  }
  h.log(`all ${Object.keys(SKILLS).length} skills executed`);

  // Surge multiplies damage
  {
    const a = setup(); const b = setup();
    const d0 = a.sys.act(a.sys.party[0], { kind: 'skill', id: 'attack', targets: [a.sys.enemies[0]] }).find((e) => e.t === 'damage')?.amount || 0;
    b.sys.afterglow = 300;
    const d3 = b.sys.act(b.sys.party[0], { kind: 'skill', id: 'attack', targets: [b.sys.enemies[0]], surge: 3 }).find((e) => e.t === 'damage')?.amount || 0;
    h.expect(d3 > d0 * 1.8, `surge x3 boosts damage (${d0} → ${d3})`);
    h.expect(b.sys.afterglow < 60, `surge spends afterglow (left ${b.sys.afterglow})`);
  }
  // Self-applied statuses survive the turn they are gained (Guard, charge telegraphs)
  {
    const { sys } = setup();
    const u = sys.party[0];
    sys.act(u, { kind: 'skill', id: 'guard', targets: [u] });
    sys.endTurn(u, { kind: 'skill', id: 'guard' });
    h.expect(u.hasStatus('guard'), 'guard lasts until the next turn');
    const foe = sys.enemies[0];
    sys.act(foe, { kind: 'skill', id: 'e_charge', targets: [foe] });
    sys.endTurn(foe, { kind: 'skill', id: 'e_charge' });
    h.expect(foe.hasStatus('charging'), 'charge telegraph persists to the next action');
  }
  // Breaking a winding-up boss interrupts the telegraphed move
  {
    await contentReady;
    const { sys } = setup('side_b_bristleback', 14);
    const boss = sys.enemies.find((e) => e.def.ai === 'side_bristleback');
    boss.memory.turn = 2; // its next turn (3) is a wind-up
    const tell = sys.enemyAction(boss);
    sys.act(boss, tell);
    sys.endTurn(boss, tell);
    h.expect(tell.id === 'e_charge' && boss.memory.charged && boss.hasStatus('charging'), 'boss winds up');
    boss.poise = 1;
    const ev = [];
    sys.resolver.poiseHit(sys.party[0], boss, 1, ev);
    h.expect(boss.broken && !boss.hasStatus('charging') && !boss.memory.charged && ev.some((e) => e.t === 'interrupt'), 'break interrupts the charged blow');
  }
  // Items
  {
    const { sys, st } = setup();
    const u = sys.party[0];
    tryAct(sys, u, { kind: 'item', id: 'fire_bomb' }, 'fire bomb');
    sys.party[2].damage(99999);
    tryAct(sys, u, { kind: 'item', id: 'ember_feather', targets: [sys.party[2]] }, 'feather');
    h.expect(sys.party[2].alive, 'ember feather revives');
    h.expect(st.inventory.count('fire_bomb') === 2, 'items are consumed');
  }
  // Swap
  {
    const { sys } = setup();
    const out = sys.party[1];
    const ev = tryAct(sys, out, { kind: 'swap', ch: sys.reserves()[0] }, 'swap');
    h.expect(ev[0]?.t === 'swap' && sys.party[1] !== out, 'swap replaces the battler');
  }
  // Break
  {
    const { sys } = setup('pups2', 10);
    const foe = sys.enemies[0];
    for (let i = 0; i < 4 && !foe.broken && foe.alive; i++) sys.act(sys.party[0], { kind: 'skill', id: 'attack', targets: [foe] });
    h.expect(foe.broken || !foe.alive, 'weakness hits break a foe');
  }
  // Enemy AI for every boss script runs a few turns
  {
    const { BOSS_AI } = await import('../src/battle/AI.js');
    const { ENEMIES } = await import('../src/data/enemies.js');
    const { TROOPS } = await import('../src/data/troops.js');
    for (const [tid, t] of Object.entries(TROOPS)) {
      if (!t.boss) continue;
      const { sys } = setup(tid, 40);
      for (let i = 0; i < 12 && !sys.outcome(); i++) {
        const a = sys.nextActor();
        const turn = sys.beginTurn(a);
        if (turn.skip || !a.alive) { sys.endTurn(a, null); continue; }
        const action = turn.auto || (a.isParty ? { kind: 'skill', id: 'guard', targets: [a] } : sys.enemyAction(a));
        tryAct(sys, a, action, `boss ${tid} turn ${i}`);
      }
    }
    h.log(`boss AIs ok (${Object.keys(BOSS_AI).length} scripts, ${Object.keys(ENEMIES).length} enemies)`);
  }
  if (errors.length) {
    console.error(errors.slice(0, 30).join('\n'));
    throw new Error(`${errors.length} battle errors`);
  }
}
