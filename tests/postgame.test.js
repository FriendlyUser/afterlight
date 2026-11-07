// Smoke test (1/2): the post-game up to B20. Drives every boss script through
// its phases headlessly, checks every generated Abyss floor is connected, then
// plays the Gate, the B10/B20 wardens and the Lantern-lift.
// Part 2 is postgame_finale.test.js.
import { TROOPS } from '../src/data/troops.js';
import { BattleSystem } from '../src/battle/BattleSystem.js';
import { ABYSS_LAYOUTS, FLOORS } from '../src/data/maps/postgame_abyss_gen.js';
import { PG } from '../src/story/postgame.js';
import { BOSSES, setupParty, shrinkBosses } from './postgame_helpers.js';

/** Tiles reachable from the player on the live collision grid. */
function reachable(f) {
  const g = f.grid;
  const start = `${f.player.tileX},${f.player.tileY}`;
  const seen = new Set([start]);
  const q = [[f.player.tileX, f.player.tileY]];
  while (q.length) {
    const [x, y] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = `${x + dx},${y + dy}`;
      if (!seen.has(k) && g.canStep(x, y, x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); }
    }
  }
  return seen;
}
const touches = (seen, [x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => seen.has(`${x + dx},${y + dy}`));

/** Run every boss script through a long fight in a headless BattleSystem. */
function exerciseBossAI(game, h) {
  for (const id of BOSSES) {
    const troopId = Object.keys(TROOPS).find((t) => TROOPS[t].enemies.includes(id));
    const sys = new BattleSystem({ state: game.state, troopId, rnd: Math.random });
    sys.start();
    const boss = sys.enemies.find((e) => e.def.id === id);
    for (let turn = 0; turn < 40; turn++) {
      boss.hp = Math.max(1, Math.round(boss.maxHp * (1 - turn / 40)));
      for (const p of sys.party) { p.alive = true; p.hp = p.maxHp; }
      const action = sys.enemyAction(boss);
      if (!action) throw new Error(`${id}: no action on turn ${turn}`);
      sys.act(boss, action);
      sys.endTurn(boss, action);
      boss.alive = true;
    }
  }
  h.log(`boss AIs ok (${BOSSES.length})`);
}

export async function run(game, h) {
  const st = await setupParty(game, h);
  exerciseBossAI(game, h);
  shrinkBosses();

  // ------------------------------------------------------------ the Gate
  await h.goto('abyss_gate', 21, 31, 'up');
  h.expect(h.flags().pg_arrived, 'Gate arrival scene');
  await h.talk('tobb');
  await h.talk('quill');
  await h.talk('nils');
  await h.talk('wick');
  await game.scene.runScript((s) => PG.chalkGate(s));
  await h.idle();
  h.expect(h.flags().pg_chalk_gate, 'chalk wall starts Hide and Seek');

  // ------------------------------------------------------------ every floor is whole
  for (let n = 1; n <= FLOORS; n++) {
    const S = ABYSS_LAYOUTS[n].spots;
    await h.goto(`abyss_${n}`, S.entry[0], S.entry[1]);
    const f = game.scene;
    const seen = reachable(f);
    const need = [['up stair', S.upstair, true], ['chests', null], ['hearth', S.hearth], ['lift', S.lift], ['chalk', S.chalk, true]];
    if (n < FLOORS) need.push(['down stair front', S.exitFront, true]);
    else need.push(['chamber', [18, 12], true], ['lift spot', S.liftArrive, true]);
    for (const [what, at, onTile] of need) {
      if (what === 'chests') {
        for (const c of f.map.chests) if (!touches(seen, [c.x, c.y])) throw new Error(`B${n}: chest ${c.id} unreachable`);
        continue;
      }
      if (!at) continue;
      const ok = onTile ? seen.has(`${at[0]},${at[1]}`) || touches(seen, at) : touches(seen, at);
      if (!ok) throw new Error(`B${n}: ${what} unreachable at ${at}`);
    }
    if (n < FLOORS && n !== 10 && n !== 20 && !f.grid.canStep(S.exitFront[0], S.exitFront[1], S.downstair[0], S.downstair[1] + 1)) throw new Error(`B${n}: stairwell blocked`);
  }
  h.expect(st.vars.pg_deepest === FLOORS, 'all 30 floors load and connect');

  // ------------------------------------------------------------ B10 before the ending
  const S10 = ABYSS_LAYOUTS[10].spots;
  await h.goto('abyss_10', S10.liftArrive[0], S10.liftArrive[1]);
  await h.stepOn(S10.exitFront[0], S10.exitFront[1] + 1);
  h.expect(h.flags().pg_boss_10, 'Unremembered Knight defeated');
  await h.goto('abyss_10', S10.liftArrive[0], S10.liftArrive[1]);
  h.expect(game.scene.blockers.has('seal'), 'B10 stays sealed before gameClear');
  st.flags.gameClear = true;
  await h.goto('abyss_10', S10.liftArrive[0], S10.liftArrive[1]);
  h.expect(!game.scene.blockers.has('seal'), 'B10 seal lifts after gameClear');

  // ------------------------------------------------------------ the lift
  await game.scene.runScript((s) => PG.liftUp(s, 10));
  await h.idle();
  h.expect(game.scene.mapId === 'abyss_gate', 'lift up to the Gate');
  await game.scene.runScript((s) => PG.liftDown(s));
  await h.idle();
  h.expect(game.scene.mapId === 'abyss_10', 'lift down to B10');

  // ------------------------------------------------------------ B20
  const S20 = ABYSS_LAYOUTS[20].spots;
  await h.goto('abyss_20', S20.liftArrive[0], S20.liftArrive[1]);
  await h.stepOn(S20.exitFront[0], S20.exitFront[1] + 1);
  h.expect(h.flags().pg_boss_20 && st.inventory.count('pg_first_crown') === 1, 'Rime Sovereign defeated');
}
