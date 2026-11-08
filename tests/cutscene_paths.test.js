// Cutscene walking goes around people (world/CutscenePath.js): an NPC sent through
// the player walks around them (and the party behind); one sent onto the player's tile
// stops beside it; a leg with nobody in the way is walked exactly as written; the
// player keeps its exact destination even when someone stands there.
// Run: SIM=240 tools/test.sh cutscene_paths 300000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { routeAround } from '../src/world/CutscenePath.js';

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  for (const id of ['wren', 'ilse', 'bram']) st.joinParty(id).setLevel(10);
  Object.assign(st.flags, { kindled: true });
  await game.start(new FieldScene(game), { mapId: 'thistledown', x: 2, y: 18, dir: 'right', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.wait(0.5);
  const f = game.scene;
  const g = f.grid;

  // An open stretch: 11 × 5 walkable tiles on one level, nobody standing in it.
  let area = null;
  for (let y = 2; y < g.h - 3 && !area; y++) {
    for (let x = 1; x < g.w - 12 && !area; x++) {
      let ok = true;
      for (let j = -2; j <= 2 && ok; j++) for (let i = 0; i <= 10 && ok; i++) ok = g.walkable(x + i, y + j) && g.level(x + i, y + j) === g.level(x, y) && ![...f.actors.values()].some((a) => a.tileX === x + i && a.tileY === y + j);
      if (ok) area = { x, y };
    }
  }
  if (!area) throw new Error('no open stretch on the map');
  const { x: X, y: Y } = area;
  h.log(`open stretch at ${X},${Y}`);
  f.player.placeAt(X + 5, Y, g);
  f.player.face('right');
  f.followers.regroup();
  await h.wait(0.3);

  const run = (fn) => f.runScript(fn);
  const trackMin = (id) => {
    let min = Infinity, done = false;
    game.tasks.add(() => {
      const a = f.actors.get(id);
      if (a) min = Math.min(min, Math.hypot(a.x - f.player.x, a.z - f.player.z));
      return done;
    });
    return { get min() { return min; }, stop() { done = true; } };
  };

  // 1. Through the player: goes around, arrives.
  await run(async (s) => {
    s.spawn('walker', 'villager_9', X, Y, 'right');
    const t = trackMin('walker');
    await s.move('walker', [[X + 10, Y]]);
    t.stop();
    const w = f.actors.get('walker');
    h.expect(t.min > 0.45, `walks around the player (closest ${t.min.toFixed(2)} tiles)`);
    h.expect(w.tileX === X + 10 && w.tileY === Y, 'and arrives where it was sent');
  });

  // 2. Onto the player's tile: stops beside them.
  await run(async (s) => {
    await s.move('walker', [[X + 5, Y]]);
    const w = f.actors.get('walker');
    const d = Math.hypot(w.x - f.player.x, w.z - f.player.z);
    h.expect(d > 0.9 && d < 1.6, `sent onto the player, it stops beside them (${d.toFixed(2)} tiles away)`);
    s.remove('walker');
  });

  // 3. Nobody in the way: exactly as written. 4. The player keeps its destination.
  const npc = f.spawnActor({ id: 'stander', look: 'villager_9', x: X + 8, y: Y + 2, dir: 'down' });
  const straight = routeAround(f, npc, [[X + 8, Y - 2], [X + 2, Y - 2]]);
  h.expect(JSON.stringify(straight) === JSON.stringify([[X + 8, Y - 2], [X + 2, Y - 2]]), 'a clear walk is left exactly as written');
  const mine = routeAround(f, f.player, [[X + 8, Y + 2]]);
  h.expect(mine.length && mine[mine.length - 1].join() === `${X + 8},${Y + 2}`, 'the player still ends exactly where the script says');
  f.removeActor('stander');
}
