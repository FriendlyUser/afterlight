// Smoke test: Chapter 7 "The Mender of Ash" main story, Aurenne → Undercroft → the thaw.
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  const st = game.state;
  const lv = Number(new URLSearchParams(location.search).get('lv')) || 46;
  // Act II start state: Wren alone after the Sundering.
  const wren = st.joinParty('wren');
  wren.setLevel(lv);
  wren.lookId = 'wren_ruin';
  st.addCharacter('ilse').setLevel(lv);
  Object.assign(st.flags, { kindled: true, crestArtLearned: true, sundered: true });
  st.gold = 3000;
  const scene = () => game.scene;
  const inspect = async (x, y) => {
    const d = scene().map.inspect.find((i) => i.x === x && i.y === y && (!i.cond || i.cond(st)));
    if (!d) throw new Error(`No inspect at ${x},${y} on ${scene().mapId}`);
    await scene().runScript(d.run || ((s) => s.narrate(d.text)));
    await h.idle();
  };

  game.start(new FieldScene(game), { mapId: 'ruined_aurenne', x: 20, y: 38, dir: 'up' });
  game.fadeIn(0.1);
  await h.idle();
  h.expect(h.flags().c7_arrived, 'arrived in the ruins');

  await h.goto('c7_ember_ward', 9, 10, 'up');
  h.expect(h.flags().c7_met_ilse, 'met Ilse at the Ward');
  await h.talk('noll');
  h.expect(h.flags().c7_q_rounds, 'Noll gave the rounds');

  await h.goto('ruined_aurenne', 20, 20, 'up');
  await inspect(20, 19);
  h.expect(st.inventory.count('c7_water') === 1, 'drew water');
  await h.goto('c7_ember_ward', 9, 10, 'up');
  await h.talk('noll');
  h.expect(h.flags().c7_ilse_joined && st.party.includes('ilse'), 'Ilse joined: for the patients');
  h.expect(st.characters.ilse.lookId === 'ilse_ruin', 'Ilse wears her Act II look');

  await h.goto('ruined_aurenne', 13, 22, 'left');
  await h.stepOn(9, 22);
  h.expect(h.flags().c7_stair_open, 'Sorrel opened the Undercroft');
  await h.stepOn(7, 18);
  h.expect(scene().mapId === 'ch7_drowned_undercroft', 'descended into the Undercroft');

  await h.stepOn(23, 36);
  await inspect(4, 16);
  await inspect(43, 16);
  h.expect(h.flags().c7_gate_open, 'both sluice wheels turned');
  await inspect(35, 24);
  await h.stepOn(23, 11);
  h.expect(h.flags().c7_chapel_talk, 'chapel rest scene');
  await h.stepOn(23, 4);
  h.expect(scene().mapId === 'ch7_drowned_choir', 'reached the Cistern of Bells');

  await h.stepOn(20, 31);
  await h.stepOn(20, 9);
  h.expect(h.flags().c7_choir_done, 'defeated the Drowned Choir');
  await h.stepOn(30, 5);
  h.expect(h.flags().c7_sunsalt, 'found the sunsalt');

  await h.goto('c7_ember_ward', 9, 10, 'up');
  h.expect(h.flags().c7_returned, 'medicine delivered');
  await h.idle();
  h.expect(h.flags().c7_thaw && scene().mapId === 'ruined_aurenne', 'the thaw');
  h.log(`party ${st.party.join(',')} lv ${st.party.map((id) => st.characters[id].level).join('/')}`);

  await h.talk('fenna');
  await h.idle();
  h.expect(h.flags().c7_done && scene().mapId === 'kiteholm', 'left for Kiteholm');
}
