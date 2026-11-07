// Smoke test, Chapter 4a part two: the Greyspine Pass, Frosthollow, Halvard and the fork,
// and Frosthollow's side quests. (The night itself is in ch4a_finale.)
import { C4M } from '../src/story/ch4a_mountain.js';
import { setupParty } from './ch4a.test.js';

export async function run(game, h) {
  const run = async (fn) => { game.scene.runScript(fn); await h.idle(); };
  const f = h.flags;
  await h.newGame();
  Object.assign(game.state.flags, { c4a_arrived: true, c4a_corvin_joined: true, c4a_saltglass_arrived: true, c4a_tamsin_met: true, c4a_pip_kindled: true, c4a_to_greyspine: true });
  setupParty(game, ['wren', 'ilse', 'bram', 'sable', 'corvin', 'pip'], 30);

  await h.goto('c4a_greyspine_pass', 20, 55, 'up');
  h.expect(f().c4a_pass_arrived, 'pass arrival');
  await h.stepOn(18, 38);
  h.expect(f().c4a_quiet_warned, 'quiet way warning');
  await run((s) => C4M.vigil(s));
  h.expect(f().c4a_vigil_seen, 'Bram at the Vigil Stone');
  for (const i of [0, 1, 2]) await run((s) => C4M.lily(s, i));
  h.expect(game.state.inventory.count('frost_lily') >= 3, 'three frost lilies');
  await h.stepOn(33, 24);
  h.expect(f().c4a_whitefang_dead, 'Whitefang defeated');

  await h.goto('c4a_frosthollow', 21, 34, 'up');
  h.expect(f().c4a_frosthollow_arrived, 'Frosthollow arrival');
  await h.talk('agathe');
  h.expect(f().c4a_lilies_done, 'frost lilies delivered');
  await h.talk('ivo');
  h.expect(f().c4a_whitefang_paid, 'Whitefang reward');
  await h.talk('ebba');
  await h.goto('c4a_fh_hall', 8, 11, 'up');
  h.expect(f().c4a_halvard_met, 'Halvard and the Ice Score');
  await h.talk('halvard');
  h.expect(f().c4a_halvard_bram, 'Halvard tells Bram about Aldous');
  await h.talk('yrsa');
  await h.goto('c4a_fh_guest', 5, 6, 'up');
  await h.talk('linnea');
  await h.goto('c4a_frosthollow', 32, 12, 'down');
  for (const k of ['tomas', 'lars', 'oskar']) await h.talk(k);
  await h.talk('ebba');
  h.expect(f().c4a_hide_done && game.state.inventory.count('crest_brooch') === 1, 'hide-and-seek complete');

  h.log(`frost lilies ${game.state.inventory.count('frost_lily')} gold ${game.state.gold}`);
}
