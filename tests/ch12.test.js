// Smoke test: Chapter 12 up to the Noon Throne — the gate, the festival streets (sundials,
// procession, every side quest), the night of the spill, the Noon Stair and the last camp.
import { startCh12, inspect, answer, reachCheck } from './ch12_helpers.js';

export async function run(game, h) {
  const F = h.flags;
  await startCh12(game, h);
  h.expect(F().c12_arrived, 'arrival scene');
  reachCheck(game, h, 20, 40, ['gate_seal']);
  await h.talk('mott');
  await h.talk('anselm');
  h.expect(game.state.inventory.count('star_pendant') === 1, 'Anselm gives the Star Pendant');
  await h.stepOn(20, 9);
  h.expect(F().c12_gate_open, 'Shards open the gate');

  // ---------------------------------------------------------------- the festival streets
  await h.goto('c12_streets', 26, 43, 'up');
  h.expect(F().c12_streets_enter, 'streets intro');
  reachCheck(game, h, 26, 43);
  await h.talk('dancer3');
  h.expect(F().c12_dials_known, 'procession explains the sundials');

  // Side quests: the first watch, the kite, the cards, the knee, the ribbon, the atlas.
  await h.talk('aldous');
  await inspect(game, h, 26, 40);
  await h.talk('aldous');
  h.expect(F().c12_q_aldous_done && game.state.inventory.count('c12_squire_badge') === 1, 'The First Watch done');
  await h.talk('tomas');
  game.state.inventory.add('gale_bomb', 1);
  await h.talk('tomas');
  h.expect(F().c12_q_kite_done, 'Wind for Tomas done');
  answer(game, 1);
  await h.talk('sel');
  h.expect(F().c12_q_cards_done, 'Dead Man\'s Hand done');
  await h.talk('dawe');
  await h.talk('fen');
  await h.talk('dawe');
  h.expect(F().c12_q_knee_paid, 'Scraped Knee done');
  await h.talk('hollin');
  await h.talk('haberdasher');
  await h.talk('hollin');
  h.expect(F().c12_q_ribbon_done && game.state.inventory.count('ribbon') >= 1, 'Miss Lysa\'s Ribbon done');
  await inspect(game, h, 16, 30);
  h.expect(game.state.inventory.count('c12_first_atlas') === 1, 'first-edition atlas found');

  await inspect(game, h, 11, 30);
  await inspect(game, h, 44, 29);
  h.expect(F().c12_dial_market && F().c12_dial_garden, 'two sundials woken');
  await inspect(game, h, 8, 8);
  h.expect(F().c12_procession_moved, 'procession moves after the third sundial');
  reachCheck(game, h, 26, 43);
  await inspect(game, h, 21, 7);

  // ---------------------------------------------------------------- the night of the spill
  await h.goto('c12_memory', 22, 45, 'up');
  h.expect(F().c12_mem_enter, 'memory intro: young Cassian');
  reachCheck(game, h, 22, 45);
  await inspect(game, h, 8, 30);
  await h.talk('m_aldous');
  await h.stepOn(22, 16);
  h.expect(F().c12_mem_lost, 'the Hungry Dark falls, Lysa is lost anyway');
  await h.talk('m_cass_kneel');
  h.expect(F().c12_mem_done, 'understanding young Cassian');
  await h.talk('m_aurel');
  await h.stepOn(22, 4);
  h.expect(game.scene.mapId === 'c12_stair', 'Lantern door opens onto the Noon Stair');

  // ---------------------------------------------------------------- the Noon Stair
  await h.idle();
  h.expect(F().c12_stair_enter, 'stair intro');
  reachCheck(game, h, 18, 41, ['bell_gate']);
  await inspect(game, h, 8, 29);
  await inspect(game, h, 28, 21);
  await inspect(game, h, 3, 21);
  await inspect(game, h, 32, 21);
  h.expect(F().c12_bell_w && F().c12_bell_e && F()['blocker:c12_stair:bell_gate'], 'both bells rung, gate open');
  await h.stepOn(18, 15);
  h.expect(F().c12_camp, 'last camp');
  for (const id of ['ilse', 'bram', 'sable', 'pip', 'corvin']) await h.talk(`camp_${id}`);
  h.expect(['ilse', 'bram', 'sable', 'pip', 'corvin'].every((id) => F()[`c12_camp_${id}`]), 'everyone spoke at the fire');
  await inspect(game, h, 22, 10);
  h.expect(F().c12_camp_rested, 'rested by the fire');
  await h.stepOn(17, 1);
  h.expect(game.scene.mapId === 'c12_throne', 'up to the Noon Throne');
  h.expect(F().c12_throne_enter, 'throne intro');
  reachCheck(game, h, 15, 26);
  h.log(`party lv ${game.state.leader().level}, quests ${Object.keys(game.state.vars.quests || {}).join(',')}`);
}
