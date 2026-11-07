// Quest markers: the objective leads to a door, then to a person inside; a far
// spot gets an edge arrow; done parts and the setting hide markers; the world map
// marks the stop on the way. Uses its own objectives, so story data can change.
// Run: SIM=240 tools/test.sh quest_markers 120000
import { FieldScene } from '../src/world/FieldScene.js';
import { WorldMapScene } from '../src/world/WorldMapScene.js';
import { WORLD, route } from '../src/world/QuestGuide.js';
import { OBJECTIVE_TARGETS } from '../src/data/objectives/index.js';
import { contentReady } from '../src/data/content/index.js';
import { WORLD_NODES, openNodes } from '../src/data/worldmap.js';

export async function run(game, h) {
  await contentReady;
  game.autoConfirm = false;
  const st = game.state;
  st.joinParty('wren');
  OBJECTIVE_TARGETS.push(
    { text: 'TEST: buy a tonic', at: { map: 'lf_store', npc: 'marlow' } },
    { text: 'TEST: two spots', at: [{ map: 'lanternfall', x: 40, y: 30, unless: 'test_a' }, { map: 'lanternfall', x: 12, y: 18, unless: 'test_b' }] },
  );
  const field = () => game.scene;
  const spot = () => field().quest.spots[0];

  st.vars.objective = 'TEST: buy a tonic';
  await game.start(new FieldScene(game), { mapId: 'lanternfall', x: 10, y: 19, dir: 'up', skipEnterScript: true });
  await h.wait(0.3);
  h.expect(spot()?.tile?.x === 10 && spot().tile.y === 15, `the marker sits on the store's door (${JSON.stringify(spot()?.tile)})`);
  const tracker = document.querySelector('.quest-tracker');
  h.expect(tracker?.style.display !== 'none' && tracker.textContent.includes('buy a tonic'), 'the objective shows in the corner');
  h.expect(field().quest.group.visible, 'the gem is drawn');

  await field().goto('lf_store', 4, 5, 'up');
  await h.wait(1);
  h.expect(spot()?.actor?.def?.id === 'marlow', 'inside, the marker follows Marlow');

  st.vars.objective = 'TEST: two spots';
  await game.start(new FieldScene(game), { mapId: 'lanternfall', x: 10, y: 19, dir: 'up', skipEnterScript: true });
  await h.wait(0.3);
  h.expect(field().quest.spots.length === 2, 'both parts are marked');
  field().player.placeAt(10, 19, field().grid);
  st.flags.test_b = true; // the near part is done: only the far one is left
  field().quest.refresh();
  await h.wait(0.2);
  const arrow = document.querySelector('.quest-arrow');
  h.expect(field().quest.spots.length === 1 && spot().tile.x === 40, 'a finished part drops its marker');
  h.expect(arrow.style.display !== 'none', 'an arrow at the screen edge points to the far marker');

  st.settings.hideQuestGuide = true;
  field().quest.refresh();
  await h.wait(0.1);
  h.expect(!field().quest.group.visible && tracker.style.display === 'none' && arrow.style.display === 'none', 'Quest Guide off hides everything');
  st.settings.hideQuestGuide = false;

  // The world map marks the stop toward a target that's only reachable by travel.
  const node = WORLD_NODES.find((n) => (n.act || 1) === 1 && typeof n.unlock === 'string' && n.mapId !== 'lanternfall');
  st.flags[node.unlock] = true;
  h.expect(openNodes(st).includes(node), `${node.name} is open on the world map`);
  OBJECTIVE_TARGETS.push({ text: 'TEST: travel', at: { map: node.mapId } });
  st.vars.objective = 'TEST: travel';
  h.expect(route(WORLD, [{ map: node.mapId }], st)?.node === node, `the route from the world map goes via ${node.name}`);
  const wm = new WorldMapScene(game);
  wm.enter();
  const marked = [...document.querySelectorAll('.wm-node.quest')].map((m) => m.textContent);
  wm.exit();
  h.expect(marked.length === 1 && marked[0].includes(node.name), `the world map marks ${node.name} (${marked.join(', ')})`);

  OBJECTIVE_TARGETS.splice(OBJECTIVE_TARGETS.findIndex((e) => e.text.startsWith('TEST:')));
}
