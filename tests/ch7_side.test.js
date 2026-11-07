// Smoke test: Chapter 7 side quests — the Last Bell, Dead Letters, Captain Buttons,
// the Blind Archivist, Flowers for the Fallen, Three Tin Tags and the Old Clapper bounty.
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  const st = game.state;
  for (const id of ['wren', 'ilse']) st.joinParty(id).setLevel(52);
  st.characters.wren.lookId = 'wren_ruin';
  st.characters.ilse.lookId = 'ilse_ruin';
  Object.assign(st.flags, { kindled: true, sundered: true, c7_arrived: true, c7_met_ilse: true, c7_q_rounds: true, c7_water_done: true, c7_ilse_joined: true, c7_stair_open: true });
  const scene = () => game.scene;
  const inspect = async (x, y) => {
    const d = scene().map.inspect.find((i) => i.x === x && i.y === y && (!i.cond || i.cond(st)));
    await scene().runScript(d.run || ((s) => s.narrate(d.text)));
    await h.idle();
  };
  const chest = async (id) => { await scene().openChest(scene().chests.find((c) => c.def.id === id)); await h.idle(); };

  game.start(new FieldScene(game), { mapId: 'ruined_aurenne', x: 20, y: 30, dir: 'up' });
  game.fadeIn(0.1);
  await h.idle();

  await h.talk('osric');
  await h.talk('petra');
  await h.talk('sorrel');
  await h.talk('hollis');
  await inspect(23, 6);
  await h.talk('petra');
  h.expect(h.flags().c7_letters_done && st.inventory.count('c7_cassian_letter') === 1, 'Dead Letters: a letter for Wren');
  await h.talk('hollis');
  h.expect(st.inventory.count('c7_doll') === 1, 'Hollis had Captain Buttons');
  await h.talk('sorrel');
  h.expect(h.flags().c7_q_bounty_on, 'bounty posted');

  await h.goto('c7_ember_ward', 9, 10, 'up');
  await h.talk('bette');
  await h.talk('aurel');
  h.expect(h.flags().c7_doll_done && h.flags().c7_aurel_done, 'Ward rounds done');

  await h.goto('ch7_drowned_undercroft', 23, 30, 'up');
  await inspect(13, 27);
  await chest('lab2');
  await h.stepOn(38, 7);
  h.expect(h.flags().c7_clapper_dead, 'Old Clapper slain');
  await h.goto('ch7_drowned_choir', 9, 14, 'up');
  await chest('clapper');

  await h.goto('ruined_aurenne', 20, 30, 'up');
  await h.talk('sorrel');
  await h.talk('sorrel');
  h.expect(h.flags().c7_tags_returned && h.flags().c7_bounty_paid, 'tags returned and bounty paid');
  await h.talk('osric');
  h.expect(h.flags().c7_bell_rung, 'the last bell rang');
  await h.talk('hollis');
  h.expect(h.flags().c7_seeds_done, 'dawnmoss planted');
  const done = Object.values(st.vars.quests || {}).filter((q) => q.status === 'done').length;
  h.expect(done === 7, `all 7 ch7 side quests complete (${done})`);
}
