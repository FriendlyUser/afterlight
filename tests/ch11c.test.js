// Chapter 11 smoke test, part 3: Lanternfall — the three memories, the Keeper's
// Remnant, the farewell and the Lanternkeeper Crest; the eve of Evernoon; the
// hand-off to Chapter 12. Run: tools/test.sh ch11c 900000
import { setupAct3, shards } from './ch11_setup.js';

export async function run(game, h) {
  const six = Object.fromEntries(['salt', 'frost', 'mire', 'thorn', 'sky', 'grand'].map((k) => [`c11_shard_${k}`, true]));
  await setupAct3(game, h, {
    c11_open: true, ...six, c11_cassian_visit: true, c11_grand_open: true, c11_reef_open: true,
    c11_scrap_open: true, c11_lf_open: true,
  });
  game.state.inventory.add('sun_shard', 6);

  await h.goto('c11_lf_ruins', 23, 33, 'up');
  h.expect(h.flags().c11_lf_arrived && h.flags().c11_lf_mem_dock, 'arrival at the dock (first memory)');
  await h.stepOn(23, 16);
  h.expect(h.flags().c11_lf_mem_well, 'the well memory');
  await h.goto('c11_lf_home', 4, 7, 'up');
  h.expect(h.flags().c11_lf_mem_home && h.flags().c11_lf_light_open, 'home memory; the Lantern opens');
  await h.goto('c11_lf_ruins', 16, 12, 'down');
  await h.goto('c11_lf_lantern', 7, 11, 'up');
  h.expect(h.flags().c11_shard_home && shards(game) === 7, 'the Keeper\'s Remnant: seventh Shard');
  h.expect(game.state.unlockedCrests.has('lanternkeeper'), 'Lanternkeeper Crest learned');
  h.expect(game.scene.mapId === 'halcyon_deck' && h.flags().c11_eve, 'the eve of Evernoon');
  await h.talk('corvin');
  h.expect(h.flags().act3_done, 'act3_done set');
  h.expect(game.scene.mapId === 'evernoon_gate' && game.state.chapter === 12, 'hand-off to Evernoon');
}
