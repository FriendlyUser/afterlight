// Chapter 4b smoke test, part 1: Mirefen — the causeway, the village, the Drownmere, the cure.
// Parts 2 and 3: tests/ch4b_verdance.test.js, tests/ch4b_sky.test.js.
import { setupParty, patient, inspect } from './ch4b_common.js';

export async function run(game, h) {
  await setupParty(game, h, 30);
  const F = h.flags;
  const H = patient(game, h);

  await H.goto('mirefen_road', 4, 20, 'right');
  h.expect(F().c4b_arrived, 'opening on the causeway');
  await inspect(game, h, 32, 19, 'up');
  h.expect(F().c4b_poster_read, 'wanted poster');
  await H.stepOn(31, 19);
  h.expect(F().c4b_patrol_done, 'Dawnguard patrol beaten');
  await H.talk('gaspar');

  await H.goto('c4b_mirefen', 1, 18, 'right');
  h.expect(F().c4b_mirefen_arrived, 'arrived in Mirefen');
  for (const id of ['vey', 'lisette', 'nettie', 'dace', 'sedge', 'corla', 'benet', 'wisk', 'pell']) await H.talk(id);
  h.expect(F().c4b_pell_asked && F().c4b_dace_met && F().c4b_nettie_rhyme, 'village talks (Pell quest started)');

  await H.goto('c4b_osk_lantern', 7, 10, 'up');
  h.expect(F().c4b_osk_seen && F().c4b_cure_quest, 'Osk scene, cure quest');

  await H.goto('c4b_drownmere', 27, 43, 'up');
  await H.stepOn(27, 42);
  await inspect(game, h, 27, 21, 'up');
  h.expect(!F()['blocker:c4b_drownmere:rotwall'], 'rot wall holds without ingredients');
  await inspect(game, h, 8, 15, 'up');
  h.expect(F().c4b_got_moss, 'lanternmoss');
  await inspect(game, h, 47, 14, 'down');
  h.expect(F().c4b_got_lily, 'weepcap lily');
  await inspect(game, h, 13, 6, 'up');
  h.expect(F().c4b_pell_ring, 'Pell\'s ring in the chapel');
  await inspect(game, h, 27, 21, 'up');
  h.expect(F()['blocker:c4b_drownmere:rotwall'], 'rot wall burned away');
  await H.stepOn(27, 10);
  h.expect(F().c4b_mawmire_beaten, 'Mawmire defeated');

  await H.goto('c4b_osk_lantern', 7, 10, 'up');
  h.expect(F().c4b_osk_saved, 'Osk cured');
  await H.talk('osk');

  await H.goto('c4b_mirefen', 21, 17, 'down');
  for (const id of ['pell', 'vey', 'dace', 'nettie', 'hesk_v', 'lisette']) await H.talk(id);
  h.expect(F().c4b_pell_done && F().c4b_dace_done && F().c4b_vey_gift && F().c4b_hesk_talk, 'post-cure side beats');
  h.expect(game.state.vars.quests?.c4b_q_pell?.status === 'done', 'quest log: Pell done');
  await H.goto('c4b_mirefen_inn', 6, 8, 'up');
  await H.talk('bard');
  await H.talk('rusk');
  h.log(`party lv ${game.state.leader().level}, gold ${game.state.gold}`);
}
