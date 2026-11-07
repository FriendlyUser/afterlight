// Smoke test: Chapter 5 "The Last Sunset" end to end — homecoming, Nana's tea,
// the soldiers, the Tide Caves boss, the lamp puzzle, the Lantern, the Vespersong,
// the escape run and the Sundering hand-off into Chapter 6.
// Run: tools/test.sh ch5 900000
import { MAPS } from '../src/data/maps/index.js';
import { CH5 } from '../src/story/ch5.js';

const GEAR = {
  wren: { weapon: 'starsteel_sword', body: 'starsteel_plate', head: 'starsteel_helm' },
  ilse: { weapon: 'starwood_staff', body: 'starweave_robe', head: 'star_diadem' },
  bram: { weapon: 'starsteel_sword', offhand: 'starsteel_aegis', body: 'starsteel_plate', head: 'starsteel_helm' },
  sable: { weapon: 'starglass_rod', body: 'starweave_robe', head: 'star_diadem' },
  pip: { weapon: 'starsteel_stiletto', body: 'starweave_coat', head: 'starweave_hood' },
  corvin: { weapon: 'starsteel_repeater', body: 'starweave_coat', head: 'starweave_hood' },
};

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
  for (const id of ['ilse', 'bram', 'sable', 'pip', 'corvin']) st.joinParty(id);
  for (const c of st.allMembers()) {
    c.sealed = false;
    Object.assign(c.equipment, GEAR[c.id]);
    c.setLevel(60);
  }
  Object.assign(st.flags, { kindled: true, crestArtLearned: true });

  await go('lf_sunset', 23, 30, 'up');
  h.expect(h.flags().c5_arrived && h.flags().c5_homes, 'homecoming scene');

  await go('c5_nana_house', 4, 6, 'up');
  await h.talk('nana');
  h.expect(h.flags().c5_nana, 'Nana reunion + tea quest');
  await game.scene.runScript((s) => s.give('sea_lavender', 1, true));
  await h.talk('nana');
  h.expect(h.flags().c5_tea_done && st.inventory.count('c5_kindling_tea') === 3, 'Kindling tea scene');

  await go('c5_wren_house', 4, 7, 'up');
  await inspect(4, 4);
  h.expect(h.flags().c5_letter, 'Ysolde\'s letter read');

  await go('lf_sunset', 29, 10, 'up');
  await step(29, 9);
  h.expect(h.flags().c5_soldiers, 'turned back by the soldiers');
  await h.talk('tobias');
  h.expect(h.flags().c5_stair_known, 'Tobias tells of the Keeper\'s Stair');

  await go('c5_tidecaves', 1, 16, 'right');
  await step(2, 16);
  h.expect(h.flags().c5_caves, 'enter the Gloam-touched caves');
  await step(37, 24);
  h.expect(h.flags().c5_tidemourner, 'Tidemourner defeated, crystal broken');

  await go('c5_keepers_stair', 17, 40, 'up');
  await step(17, 39);
  for (const [x, y] of [[21, 15], [14, 15], [11, 15]]) await inspect(x, y);
  h.expect(h.flags().c5_gate_open, 'lamp puzzle (wave, stone, star) opens the gate');

  await go('lf_sunset', 12, 3, 'down');
  h.expect(h.flags().c5_bluff, 'arrive on the bluff');
  await step(8, 5);
  h.expect(h.flags().c5_lantern && h.flags().c5_gave, 'Garrick fought, the Dawnstone given');
  h.expect(h.flags().c5_sunset && h.flags().c5_sundering && h.flags().c5_aftermath, 'the Vespersong and Ysolde\'s choice');
  h.expect(st.inventory.count('ysolde_lantern') >= 1, 'Ysolde\'s lamp received');

  await step(24, 4);
  await step(26, 12);
  await step(23, 20);
  h.expect(h.flags()['trig:lf_sunset:c5_run_hill'] && h.flags()['trig:lf_sunset:c5_run_square'], 'escape run fights');
  await step(23, 25);
  await idle();
  h.expect(h.flags().sundered, 'the Sundering');
  h.expect(st.party.length === 1 && st.party[0] === 'wren', `party is Wren alone (${st.party.join(',')})`);
  h.expect(st.characters.wren.lookId === 'wren_ruin', 'Wren in her post-Sundering look');
  h.expect(game.scene.mapId === 'shard_hermitage' && h.flags().c6_woke, `handed off to Chapter 6 (${game.scene.mapId})`);
  h.expect(!!MAPS.lf_sunset && typeof CH5.dock === 'function', 'module sanity');
}
