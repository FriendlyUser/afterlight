// Chapter 11 smoke test, part 4: the six Character Rites and the Starseer.
// Run: tools/test.sh ch11d 900000
import { setupAct3, inspect } from './ch11_setup.js';
import { RITES } from '../src/story/ch11_rites.js';

export async function run(game, h) {
  const shards = Object.fromEntries(['salt', 'frost', 'mire', 'thorn', 'sky'].map((k) => [`c11_shard_${k}`, true]));
  await setupAct3(game, h, {
    c11_open: true, ...shards, c11_cassian_visit: true, c11_grand_open: true, c11_reef_open: true, c11_scrap_open: true,
    c11_vigil_open: true, c11_ilse_rite_open: true, c11_storm_open: true, c11_rift_open: true,
  });
  game.state.inventory.add('sun_shard', 5);
  const owns = (id) => game.state.inventory.count(id) > 0 || game.state.allMembers().some((c) => Object.values(c.equipment).includes(id));

  // ---- Wren: the Drowned Reef, then Nell's forge
  await h.goto('c11_reef', 17, 34, 'up');
  await h.stepOn(18, 30);
  await inspect(game, h, 15, 6);
  h.expect(owns('c11_edrins_cutlass') && owns('c11_handlamp'), 'Gull\'s Return found; the Undertow beaten');
  await h.goto('c11_halcyon_hold', 20, 5, 'up');
  await h.talk('nell');
  h.expect(h.flags().c11_rite_wren_done && owns('edrins_blade'), 'Edrin\'s Blade reforged');

  // ---- Pip: Scrapfall, Tilly, the Rook Queen; the kite; the Lucky Shiv
  await h.goto('c11_scrapfall', 16, 30, 'up');
  await h.stepOn(17, 27);
  await h.stepOn(17, 9);
  h.expect(h.flags().c11_scrap_found && owns('c11_tilly_knife'), 'Tilly found');
  h.expect(game.scene.mapId === 'halcyon_deck' && !h.flags().c11_pip_kite, 'kite flown off the stern');
  await h.goto('c11_halcyon_hold', 20, 5, 'up');
  await h.talk('nell');
  h.expect(h.flags().c11_rite_pip_done && owns('pips_luck'), 'Pip\'s Lucky Shiv');

  // ---- Bram: the Vigil Hall
  await h.goto('c11_vigil', 12, 31, 'up');
  await h.stepOn(12, 27);
  await inspect(game, h, 13, 10);
  h.expect(h.flags().c11_rite_bram_done && owns('aldous_oath'), 'Sir Bram Kestrel');

  // ---- Ilse: the Drowned Infirmary
  await h.goto('c11_infirmary', 9, 12, 'up');
  await inspect(game, h, 9, 3);
  h.expect(h.flags().c11_rite_ilse_done && owns('mercy_staff'), 'Staff of Small Mercies');

  // ---- Corvin: through the Stormwall to the Kingfisher
  await h.goto('halcyon_deck', 12, 8, 'down');
  await game.scene.runScript((s) => RITES.stormwallStart(s));
  await h.idle();
  h.expect(game.scene.mapId === 'c11_stormwall' && !h.flags().c11_storm_now, 'Squall King beaten; into the eye');
  await h.stepOn(21, 13);
  await inspect(game, h, 5, 10);
  h.expect(h.flags().c11_rite_corvin_done && owns('halcyon_star'), 'Halcyon Star');

  // ---- Sable: the Gloam Rift
  await h.goto('c11_rift', 14, 28, 'up');
  await h.stepOn(8, 20);
  await h.stepOn(15, 7);
  h.expect(h.flags().c11_rite_sable_done && owns('lysa_ribbon'), 'Lysa\'s Ribbon');

  // ---- Starseer: seven fragments, the crest, the Fallen Star
  game.state.inventory.add('c11_star_fragment', 7);
  await h.goto('c11_orrery', 12, 22, 'up');
  await h.talk('ottoline');
  h.expect(game.state.unlockedCrests.has('starseer') && owns('ribbon'), 'Starseer Crest learned');
  await inspect(game, h, 13, 7);
  h.expect(h.flags().c11_fallen_star, 'the Fallen Star');
}
