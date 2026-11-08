// Side-quest markers in play, and the area map: an active optional quest puts blue gems
// over its targets on this map (and over the door of a building that holds one), the
// objective's gems stay gold, the world map floats a blue diamond over the stop, the
// Journal says where, and Settings → Side Quest Markers hides them. The Map key opens
// the area map (exits named), the party waits, and Map closes it.
// Run: SIM=240 tools/test.sh side_markers 300000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { WorldMapScene } from '../src/world/WorldMapScene.js';
import { JournalScreen } from '../src/ui/menu/screens.js';

export async function run(game, h) {
  await contentReady;
  game.autoConfirm = false;
  const st = game.state;
  const press = async (action) => { game.input.edges.add(action); await h.wait(0.25); };
  const field = () => /** @type {FieldScene} */ (game.scene);
  const sideSpots = () => field().quest.spots.filter((s) => s.side);
  for (const id of ['wren', 'ilse', 'bram', 'sable']) st.joinParty(id).setLevel(14);
  Object.assign(st.flags, { kindled: true, c2_wold_enter: true, c2_td_arrived: true, c2_stealth_done: true, c2_mother_done: true, crestArtLearned: true });
  st.vars.quests = { c2_scarecrows: { id: 'c2_scarecrows', title: 'The Hollow Harvest', desc: 'Farmer Dunstan\'s scarecrows have come alive', status: 'active' } };
  st.vars.objective = 'Return to Thistledown.';

  // 1. The East Fields: blue gems over the two live scarecrows (the third waits for both).
  await game.start(new FieldScene(game), { mapId: 'c2_td_fields', x: 4, y: 16, dir: 'right', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.wait(0.6);
  let spots = sideSpots();
  h.expect(spots.length === 2 && spots.every((s) => s.actor && ['sc1', 'sc2'].includes(s.actor.def.id)), `two blue gems over the live scarecrows (${spots.map((s) => s.actor?.def.id).join()})`);
  h.expect(field().quest.spots.some((s) => !s.side), 'the objective\'s way out stays gold');
  st.flags.c2_scare_1 = true;
  st.flags.c2_scare_2 = true;
  field().quest.refresh();
  spots = sideSpots();
  h.expect(spots.length === 1 && spots[0].actor?.def.id === 'sc3', 'Old Strawman is marked once the other two are down');

  // 2. Settings → Side Quest Markers off hides them.
  st.settings.hideSideQuests = true;
  field().quest.refresh();
  h.expect(sideSpots().length === 0, 'Side Quest Markers off: no blue gems');
  st.settings.hideSideQuests = false;

  // 3. A target inside a building: the blue gem sits over its door in town.
  st.vars.quests.c4a_debt = { id: 'c4a_debt', title: 'Corvin\'s Debts', desc: 'Velvet Ines, in the Cool Well inn, wants the 600 gold Corvin owes her.', status: 'active' };
  Object.assign(st.flags, { c4a_saltglass_arrived: true });
  await field().goto('c4a_saltglass', 3, 20, 'right', { skipEnterScript: true });
  await h.wait(0.8);
  spots = sideSpots();
  h.expect(spots.length >= 1 && spots.every((s) => !s.actor), `a blue gem over the inn's door (${spots.map((s) => `${s.x},${s.z}`).join(' ')})`);

  // 4. The world map: a blue diamond over each stop with a side quest; the panel names them.
  field().openWorldMap();
  for (let t = 0; t < 30 && !(game.scene instanceof WorldMapScene); t++) await h.wait(0.1);
  await h.wait(0.3);
  const wm = /** @type {WorldMapScene} */ (game.scene);
  const td = wm.nodes.findIndex((n) => n.id === 'thistledown');
  h.expect(wm.markerEls[td].classList.contains('sidequest'), 'Thistledown carries a blue side-quest diamond');
  wm.index = td;
  wm.refresh();
  h.expect(wm.info.innerHTML.includes('The Hollow Harvest'), 'the panel lists The Hollow Harvest');
  await press('cancel');
  for (let t = 0; t < 30 && !(game.scene instanceof FieldScene); t++) await h.wait(0.1);
  await h.wait(0.5);

  // 5. The Journal says where each active quest leads.
  const jn = new JournalScreen(game.menus);
  h.expect(jn.el.innerHTML.includes('◆ Thistledown') && jn.el.innerHTML.includes('◆ Saltglass'), 'the Journal names Thistledown and Saltglass');

  // 6. The area map: Map opens it (exit names drawn), the party waits, Map closes it.
  const f = field();
  await press('map');
  h.expect(f.minimap.large && f.minimap.el.classList.contains('large') && f.minimap.scale >= 6, `Map opens the area map (scale ${f.minimap.scale})`);
  const x0 = f.player.x;
  game.input.padHeld.add('right');
  await h.wait(0.4);
  game.input.padHeld.delete('right');
  h.expect(f.player.x === x0, 'the party waits while it is open');
  await press('map');
  h.expect(!f.minimap.large && f.minimap.scale < 6, 'Map closes it');
  f.minimap.expand.click();
  await h.wait(0.2);
  h.expect(f.minimap.large, 'the ⤢ button opens it too');
  await press('cancel');
  h.expect(!f.minimap.large, 'Cancel closes it');
  game.autoConfirm = true;
}
