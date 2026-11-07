// Chapter 11 smoke test, part 1: the opening aboard the Halcyon, then Saltglass,
// Frosthollow and Mirefen, and the deck scenes they unlock (kite letter, compass,
// Cassian's visit). Run: tools/test.sh ch11 900000
import { setupAct3, inspect, shards } from './ch11_setup.js';

export async function run(game, h) {
  await setupAct3(game, h);
  h.expect(h.flags().c11_open && h.flags().act3, 'opening played aboard the Halcyon');
  h.expect(game.state.party.length === 6, 'all six aboard');

  // ---- Saltglass: bells in the sun's order, then the Blind Choir
  await h.goto('c11_saltglass', 19, 40, 'up');
  await h.stepOn(20, 38);
  await inspect(game, h, 25, 21);
  await inspect(game, h, 20, 18);
  await inspect(game, h, 15, 21);
  h.expect(h.flags().c11_sg_bells && h.flags()['blocker:c11_saltglass:glass_wall'], 'bell puzzle opens the glass wall');
  await inspect(game, h, 2, 18);
  h.expect(game.state.inventory.count('c11_star_fragment') === 1, 'starfall fragment found');
  await h.stepOn(20, 8);
  h.expect(h.flags().c11_shard_salt && shards(game) === 1, 'Blind Choir defeated, first Shard');
  h.expect(game.scene.mapId === 'halcyon_deck', 'back aboard');
  h.expect(h.flags().c11_scrap_open, 'kite letter arrived (Pip\'s Rite unlocked)');

  // ---- Frosthollow: two braziers, the golem, the Frozen Penitence
  await h.goto('c11_frosthollow', 19, 40, 'up');
  await h.stepOn(20, 38);
  await inspect(game, h, 4, 27);
  await inspect(game, h, 33, 14);
  h.expect(h.flags()['blocker:c11_frosthollow:ice_a'] && h.flags()['blocker:c11_frosthollow:ice_b'], 'both ice walls melted');
  await h.stepOn(22, 7);
  h.expect(h.flags().c11_shard_frost && h.flags().c11_vigil_offer, 'Frozen Penitence defeated');
  h.expect(h.flags().c11_reef_open, 'compass scene (Wren\'s Rite unlocked)');

  // ---- Mirefen: the censer burns the rot; the Mire Mother
  await h.goto('c11_mirefen', 19, 40, 'up');
  await h.stepOn(20, 38);
  await inspect(game, h, 6, 29);
  h.expect(game.state.inventory.count('c11_osk_censer') === 1, 'Osk\'s censer');
  await inspect(game, h, 18, 19);
  await inspect(game, h, 19, 10);
  h.expect(h.flags()['blocker:c11_mirefen:rot_b'], 'rot-blooms burned');
  await h.stepOn(21, 6);
  h.expect(h.flags().c11_shard_mire && h.flags().c11_ilse_offer, 'Mire Mother defeated');
  h.expect(h.flags().c11_cassian_visit && h.flags().c11_grand_open, 'Cassian\'s visit at three Shards');
  h.log(`shards ${shards(game)} lv ${game.state.leader().level}`);
}
