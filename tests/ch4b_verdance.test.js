// Chapter 4b smoke test, part 2: Verdance — Rootholm, the Thornwood, Elowen.
import { setupParty, patient, inspect } from './ch4b_common.js';

export async function run(game, h) {
  await setupParty(game, h, 33, { c4b_arrived: true, c4b_mirefen_arrived: true, c4b_osk_saved: true });
  const F = h.flags;
  const H = patient(game, h);

  await H.goto('c4b_verdance', 6, 27, 'right');
  h.expect(F().c4b_verdance_arrived, 'Rootholm arrival');
  await inspect(game, h, 23, 18, 'up');
  h.expect(F().c4b_ribbon, 'ribbon for Halvard');
  for (const id of ['willa', 'holm', 'hazel', 'aspen', 'linden']) await H.talk(id);

  await H.goto('c4b_thornwood', 24, 44, 'up');
  await H.stepOn(24, 41);
  await inspect(game, h, 24, 35, 'up');
  h.expect(F()['blocker:c4b_thornwood:thornA'], 'thorn wall A');
  await H.talk('wick');
  await H.talk('bryony');
  h.expect(F().c4b_wick && F().c4b_bryony, 'Wick and Bryony found');
  await inspect(game, h, 32, 24, 'right');
  h.expect(F()['blocker:c4b_thornwood:thornB'], 'thorn wall B');
  await H.talk('tamsel');
  await inspect(game, h, 24, 12, 'up');
  h.expect(F()['blocker:c4b_thornwood:thornC'], 'thorn wall C');
  await H.stepOn(24, 9);
  h.expect(F().c4b_hollowbark_beaten, 'Hollowbark calmed');

  await H.goto('c4b_heartwood', 16, 23, 'up');
  h.expect(F().c4b_elowen_story && F().c4b_camp_done && F().c4b_elowen_done, 'Elowen\'s story and the campfire');
  h.expect(game.state.inventory.count('c4b_clover_crown') === 1, 'clover crown');
  await H.talk('elowen');
  h.expect(F().c4b_elowen_farewell && F().c4b_bread, 'Elowen\'s farewell (and Tamsel\'s bread)');

  await H.goto('c4b_verdance', 20, 15, 'up');
  await H.talk('bracken');
  h.expect(F().c4b_saplings_done, 'Lost Saplings done');
  h.expect(game.state.vars.quests?.c4b_q_saplings?.status === 'done', 'quest log: saplings done');
}
