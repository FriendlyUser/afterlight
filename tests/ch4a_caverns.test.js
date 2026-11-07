// Smoke test, Chapter 4a part two: the Glass Caverns (pillars, Jorah, the Queen), the Halcyon's
// lift-glass, Jorah's homecoming and the caravan north.
import { C4A } from '../src/story/ch4a.js';
import { setupParty } from './ch4a.test.js';

export async function run(game, h) {
  const run = async (fn) => { game.scene.runScript(fn); await h.idle(); };
  const f = h.flags;
  await h.newGame();
  Object.assign(game.state.flags, { c4a_arrived: true, c4a_smoke_seen: true, c4a_corvin_joined: true, c4a_saltglass_arrived: true, c4a_tamsin_met: true, c4a_pip_kindled: true, c4a_jorah_taken: true });
  setupParty(game, ['wren', 'ilse', 'bram', 'sable', 'corvin', 'pip'], 24);

  await h.goto('c4a_glass_caverns', 1, 19, 'right');

  for (const k of ['a', 'b', 'c']) await run((s) => C4A.pillar(s, k));
  h.expect(game.state.inventory.count('c4a_singing_glass') === 3 && f()['blocker:c4a_glass_caverns:queen_door'], 'three pillars sing; door open');
  await run((s) => C4A.jorahWall(s));
  h.expect(f().c4a_jorah_freed, 'Jorah freed');
  await h.goto('c4a_glass_nest', 1, 14, 'right');
  await h.stepOn(17, 14);
  h.expect(f().c4a_queen_dead, 'Sand Wyrm Queen defeated');
  await h.goto('c4a_halcyon', 18, 27, 'up');
  await run((s) => C4A.liftHousing(s));
  h.expect(f().c4a_lift_done && game.state.inventory.count('haste_anklet') === 1, 'lift-glass installed');

  await h.goto('c4a_sg_house', 4, 5, 'up');
  h.expect(f().c4a_jorah_home, 'Jorah home');
  await h.goto('c4a_saltglass', 40, 9, 'up');
  await h.talk('oyelaran');
  h.expect(f().c4a_to_greyspine && game.state.location.mapId === 'c4a_greyspine_pass', 'caravan north');
  h.expect(f().c4a_pass_arrived, 'pass arrival');
  h.log(`party ${game.state.party.join(',')} lv ${game.state.leader().level} gold ${game.state.gold}`);
}
