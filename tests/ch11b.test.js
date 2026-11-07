// Chapter 11 smoke test, part 2: Thornwood, Skyreach and the Grand Lantern
// (Brask, the lever, Garrick and Bram's duel), then the six-Shard scene.
// Run: tools/test.sh ch11b 900000
import { setupAct3, inspect, shards } from './ch11_setup.js';

export async function run(game, h) {
  await setupAct3(game, h, {
    c11_open: true, c11_shard_salt: true, c11_shard_frost: true, c11_shard_mire: true,
    c11_cassian_visit: true, c11_grand_open: true, c11_reef_open: true, c11_scrap_open: true,
  });
  game.state.inventory.add('sun_shard', 3);

  // ---- Thornwood: Elowen's Ember burns the thorns; the Withered Bloom
  await h.goto('c11_thornwood', 19, 40, 'up');
  await h.stepOn(20, 37);
  await inspect(game, h, 7, 28);
  await inspect(game, h, 19, 17);
  await inspect(game, h, 26, 18);
  h.expect(h.flags()['blocker:c11_thornwood:thorn_a'] && h.flags()['blocker:c11_thornwood:thorn_b'], 'thorn walls burned');
  await h.stepOn(31, 28);
  await h.stepOn(20, 8);
  h.expect(h.flags().c11_shard_thorn && h.flags().c11_rift_open, 'Withered Bloom defeated, the Rift opens');

  // ---- Skyreach: three lightning rods, the Storm Herald
  await h.goto('c11_skyreach', 19, 40, 'up');
  await h.stepOn(20, 38);
  await inspect(game, h, 7, 29);
  await inspect(game, h, 33, 29);
  await inspect(game, h, 6, 14);
  h.expect(h.flags()['blocker:c11_skyreach:ward'], 'storm-ward down');
  await h.stepOn(20, 7);
  h.expect(h.flags().c11_shard_sky && h.flags().c11_storm_open, 'Storm Herald defeated');

  // ---- The Grand Lantern: Brask, the seal, the lever, Garrick and the duel
  await h.goto('c11_grand_nave', 19, 40, 'up');
  await h.stepOn(20, 36);
  await h.goto('c11_grand_nave', 11, 12, 'left');
  await h.talk('brask');
  h.expect(h.flags().c11_gl_brask && game.state.inventory.count('c11_seal') === 1, 'Brask beaten, seal taken');
  await inspect(game, h, 23, 8);
  h.expect(h.flags().c11_portcullis, 'portcullis open');
  await h.goto('c11_grand_gallery', 10, 14, 'up');
  h.expect(h.flags().c11_shard_grand, 'Garrick defeated, Bram\'s duel won');
  h.expect(game.state.party.length === 6, 'party restored after the duel');
  h.expect(h.flags().c11_lf_open, 'six Shards: going home');
  h.log(`shards ${shards(game)}`);
}
