// Smoke test: Chapter 6 "Afterlight" end to end — waking, the cairns, Fennick's
// spar, the courier, the Ashmaw, the Drift, Keelhaven (alias, Hale, Maela, Cinder),
// the Shattered Sea winches, bounties, Brinefang and the hand-off to Chapter 7.
// Run: tools/test.sh ch6 900000

export async function run(game, h) {
  const st = game.state;
  const idle = (t = 900) => h.idle(t);
  const go = async (map, x, y, dir = 'down') => { await game.scene.goto(map, x, y, dir); await game.wait(0.3); await idle(); };
  const step = async (x, y) => {
    const f = game.scene;
    f.player.placeAt(x, y, f.grid);
    f.lastTile = '';
    f.onTileEnter(x, y);
    await game.wait(0.3);
    await idle();
  };
  const inspect = async (x, y) => {
    const i = game.scene.map.inspect.find((p) => p.x === x && p.y === y);
    await game.scene.runScript(i.run || ((s) => s.narrate(i.text)));
    await idle();
  };

  await h.newGame();
  const wren = st.characters.wren;
  wren.sealed = false;
  Object.assign(wren.equipment, { weapon: 'starsteel_sword', body: 'starsteel_plate', head: 'starsteel_helm', accessory1: 'regen_bangle' });
  wren.setLevel(85);
  wren.lookId = 'wren_ruin';
  Object.assign(st.flags, { kindled: true, crestArtLearned: true, sundered: true, c5_boarded: true });

  await go('shard_hermitage', 5, 5, 'down');
  h.expect(h.flags().c6_woke && st.inventory.count('ysolde_lantern') >= 1, 'wake in Fennick\'s hut');

  await go('c6_hermit_shard', 14, 9, 'down');
  h.expect(h.flags().c6_outside, 'the broken sky');
  await h.talk('fennick');
  h.expect(h.flags().c6_cairns && st.inventory.count('c6_fennicks_coat') === 1, 'the cairns; Fennick\'s gear');
  await h.talk('fennick_r');
  h.expect(h.flags().c6_spar && h.flags().c6_courier && st.inventory.count('regen_bangle') >= 1, 'spar, courier, Lark');
  await step(30, 12);
  h.expect(h.flags().c6_ashmaw && h.flags().c6_left_shard, 'the Ashmaw');

  await go('c6_drift', 1, 13, 'right');
  h.expect(h.flags().c6_drift_in, 'enter the Drift');
  await step(20, 3);
  h.expect(h.flags().c6_house, 'half of the Halloway house');
  await inspect(23, 1);
  h.expect(h.flags().c6_atlas, 'the Sunward Atlas choice');

  await go('c6_keelhaven', 2, 16, 'right');
  h.expect(h.flags().c6_keelhaven, 'Keelhaven gate: "Lark"');
  await h.talk('maela');
  h.expect(h.flags().c6_maela, 'Maela and Pell');
  await h.talk('pell');
  h.expect(h.flags().c6_kite, 'Pell\'s kite quest');
  await h.talk('orla');
  h.expect(h.flags().c6_orla, 'the Lost Wall');

  await go('c6_keel_hall', 6, 7, 'up');
  await h.talk('hale');
  h.expect(h.flags().c6_gate_open, 'Warden Hale opens the east gate');

  await go('c6_keelhaven', 38, 16, 'right');
  await step(41, 16);
  h.expect(h.flags().c6_cinder_scene, 'Brother Cinder; Maela claims Lark');

  await go('c6_shattered_sea', 1, 20, 'right');
  h.expect(h.flags().c6_sea_in, 'the Shattered Sea');
  await go('c6_shattered_sea', 29, 5, 'up');
  await inspect(29, 4);
  await go('c6_shattered_sea', 28, 37, 'up');
  await inspect(28, 36);
  await inspect(17, 38);
  h.expect(h.flags().c6_winch_a && h.flags().c6_winch_b, 'both winches turned');
  h.expect(st.inventory.count('c6_choir_silk') === 1, 'Choir silk for Pell');
  await go('c6_shattered_sea', 13, 5, 'left');
  await step(8, 6);
  h.expect(h.flags().c6_glassback && st.inventory.count('c6_glass_core') === 1, 'bounty: Glassback');

  await go('c6_keelhaven', 14, 15, 'up');
  await h.talk('pell');
  h.expect(h.flags().c6_kite_done, 'the kite flies north');

  await go('c6_shattered_sea', 40, 20, 'right');
  await step(44, 21);
  h.expect(h.flags().c6_hearth, 'the Last Hearth');
  await step(55, 20);
  h.expect(h.flags().c6_brinefang, 'Brinefang, Unmoored defeated');
  await step(69, 20);
  await idle();
  h.expect(h.flags().c6_done, 'the far shore');
  h.expect(st.chapter === 7 && game.scene.mapId === 'ruined_aurenne', `handed off to Chapter 7 (${game.scene.mapId})`);
}
