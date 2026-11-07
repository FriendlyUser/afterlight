// Smoke test: Chapter 8 "Children of the Wreck" main story, Kiteholm → the Vigil → the raid → the kite.
import { FieldScene } from '../src/world/FieldScene.js';
import { MAPS } from '../src/data/maps/index.js';
import { kitCharacter } from './party_kit.js';

// Act II tier-6 kit (as in c78_balance): Wren's blade and Ilse's staff are in the
// Undercroft (ch7), Pip's fang in the Underhang chest on the way to the Vigil.
// With starter gear and rank-1 Crests the party can't out-damage the Lullaby
// Engine's wisps (~45 a hit against a ~500 Mend) and the fight never ends.
const KIT = {
  wren: { weapon: 'ashen_blade', body: 'ashen_armor', head: 'ashen_helm' },
  ilse: { weapon: 'ashen_staff', body: 'ashen_robe', head: 'ashen_veil' },
  pip: { weapon: 'ashen_fang', body: 'ashen_coat', head: 'ashen_hood' },
  bram: { weapon: 'starsteel_sword', offhand: 'ashen_bulwark', body: 'ashen_armor', head: 'ashen_helm' },
};

export async function run(game, h) {
  const st = game.state;
  const lv = Number(new URLSearchParams(location.search).get('lv')) || 52;
  // State at the end of Chapter 7: Wren and Ilse, with a plausible build (tests/party_kit.js).
  const fit = (ch) => { ch.setLevel(lv); kitCharacter(ch, lv); Object.assign(ch.equipment, KIT[ch.id]); ch.fullHeal(); };
  for (const id of ['wren', 'ilse']) fit(st.joinParty(id));
  for (const id of ['pip', 'bram']) fit(st.addCharacter(id));
  st.characters.wren.lookId = 'wren_ruin';
  st.characters.ilse.lookId = 'ilse_ruin';
  Object.assign(st.flags, { kindled: true, crestArtLearned: true, sundered: true, c7_done: true });
  st.gold = 5000;
  const scene = () => game.scene;
  const inspect = async (x, y) => {
    const d = scene().map.inspect.find((i) => i.x === x && i.y === y && (!i.cond || i.cond(st)));
    if (!d) throw new Error(`No inspect at ${x},${y} on ${scene().mapId}`);
    await scene().runScript(d.run || ((s) => s.narrate(d.text)));
    await h.idle();
  };

  game.start(new FieldScene(game), { mapId: 'kiteholm', x: 4, y: 20, dir: 'right' });
  game.fadeIn(0.1);
  await h.idle();
  h.expect(h.flags().c8_arrived && st.characters.pip.lookId === 'pip_ruin', 'arrived; met Pip');

  await h.goto('c8_rusty_anchor', 6, 8, 'up');
  h.expect(h.flags().c8_met_bram, 'found Bram at the Anchor');
  await h.goto('c8_kite_nest', 7, 9, 'up');
  h.expect(h.flags().c8_underhang_open, 'Tansy: Pip went down alone');

  await h.goto('kiteholm', 23, 37, 'down');
  await h.stepOn(23, 39);
  h.expect(scene().mapId === 'c8_underhang', 'down the Underhang');
  await h.stepOn(20, 3);
  await h.stepOn(30, 16);
  h.expect(h.flags().c8_pip_found && st.party.includes('pip'), 'Pip rejoined');
  await h.stepOn(17, 43);
  h.expect(scene().mapId === 'c8_vigil_wreck', 'into the Vigil');

  await h.stepOn(3, 14);
  await inspect(20, 4);
  h.expect(st.inventory.count('c8_brig_key') === 1, 'found the brig key');
  await inspect(20, 19);
  await h.stepOn(20, 21);
  h.expect(h.flags().c8_brig_seen, 'found the sleeping children');
  await h.stepOn(36, 15);
  h.expect(h.flags().c8_engine_done, 'silenced the Lullaby Engine');
  await h.idle();
  h.expect(h.flags().c8_back && scene().mapId === 'c8_kite_nest', 'home with Wick and Moth');

  await h.goto('c8_baron_hall', 7, 9, 'up');
  h.expect(h.flags().c8_warned, 'warned the Baron');
  await h.goto('c8_kite_nest', 7, 9, 'up');
  await h.talk('pip');
  await h.idle();
  h.expect(h.flags().c8_raid_done, 'the Penitent fell');
  h.expect(st.party.includes('bram') && !st.party.includes('pip'), 'Bram fought; Pip is down');
  h.expect(h.flags().c8_aftermath && scene().mapId === 'c8_kite_nest', 'aftermath in the Nest');
  h.expect(st.inventory.count('c8_venn_signet') === 1, 'Venn\'s Signet');

  await h.goto('kiteholm', 39, 14, 'right');
  await h.stepOn(41, 14);
  h.expect(h.flags().c8_quiet && st.party.includes('pip'), 'Pip flew his kite and rejoined');
  h.log(`party ${st.party.join(',')}`);

  if (MAPS.corvins_roost) {
    await h.goto('kiteholm', 10, 33, 'down');
    await h.talk('rook');
    await h.idle();
    h.expect(h.flags().c8_done && scene().mapId === 'corvins_roost', 'left for Corvin\'s Roost');
  } else {
    h.log('corvins_roost not registered yet: skipped the handoff');
  }
}
