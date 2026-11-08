// Hearthstone fast travel: the waystone list is sound; walking past a listed Hearthstone
// attunes it; the world map then offers it as an arrival point under its destination;
// destinations without one travel straight there; other acts' stones stay hidden; and
// attunements survive a save.
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { WorldMapScene } from '../src/world/WorldMapScene.js';
import { WAYSTONES } from '../src/data/waystones.js';
import { WORLD_NODES, openNodes } from '../src/data/worldmap.js';
import { getMap } from '../src/data/maps/index.js';
import { GameState } from '../src/state/GameState.js';
import { waystonesAt } from '../src/world/Waystones.js';

const stoneOf = (map) => {
  for (let y = 0; y < (map.props || []).length; y++) {
    const x = map.props[y].indexOf('$');
    if (x >= 0) return { x, y };
  }
  return null;
};

export async function run(game, h) {
  await contentReady;
  game.autoConfirm = false; // its presses would pick world-map destinations
  const st = game.state;
  const press = async (action) => { game.input.edges.add(action); await h.wait(0.2); };
  const until = async (cond, sec, what) => {
    for (let t = 0; !cond(); t += 0.1) {
      if (t > sec) throw new Error(`Timed out waiting for ${what}`);
      await h.wait(0.1);
    }
  };

  // 1. Every listed stone is a real Hearthstone under a real destination.
  for (const [mapId, nodeId] of Object.entries(WAYSTONES)) {
    const map = getMap(mapId);
    if (!map || !stoneOf(map)) throw new Error(`waystones: ${mapId} has no Hearthstone`);
    if (!WORLD_NODES.some((n) => n.id === nodeId)) throw new Error(`waystones: ${mapId} hangs off unknown node ${nodeId}`);
  }
  h.expect(true, `${Object.keys(WAYSTONES).length} waystones, each a Hearthstone under a known destination`);

  // 2. Walking past the Undercroft's Hearthstone attunes it.
  st.joinParty('wren').setLevel(20);
  Object.assign(st.flags, { kindled: true, c3_arrived: true, c2_td_arrived: true });
  const stone = stoneOf(getMap('c3_uc_ossuary'));
  await game.start(new FieldScene(game), { mapId: 'c3_uc_ossuary', x: stone.x, y: stone.y + 2, dir: 'up', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.wait(0.5);
  const grid = game.scene.grid;
  const spot = [[0, 1], [-1, 1], [1, 1], [0, 2], [-1, 0], [1, 0], [0, -1]].map(([dx, dy]) => [stone.x + dx, stone.y + dy]).find(([x, y]) => grid.walkable(x, y));
  h.expect(!!spot, `a walkable tile beside the stone at ${stone.x},${stone.y}`);
  h.expect(!st.vars.waystones?.c3_uc_ossuary, 'not attuned on arrival');
  await h.stepOn(...spot);
  const rec = st.vars.waystones?.c3_uc_ossuary;
  h.expect(rec && rec.x === spot[0] && rec.y === spot[1], 'attuned where the party stood');

  // 3. From Aurenne, the world map offers the Ossuary under Aurenne.
  await game.scene.goto('aurenne', 20, 38, 'up', { skipEnterScript: true });
  await h.wait(0.5);
  const openMap = async () => {
    game.scene.openWorldMap();
    await until(() => game.scene instanceof WorldMapScene, 3, 'the world map');
    await h.wait(0.3);
    return game.scene;
  };
  let wm = await openMap();
  const aurenne = wm.nodes.findIndex((n) => n.id === 'aurenne');
  h.expect(wm.index === aurenne && wm.markerEls[aurenne].textContent.includes('◆1'), 'Aurenne is "here" and shows one Hearthstone');
  await press('confirm');
  h.expect(wm.picker?.dests.map((d) => d.name).join() === 'Aurenne,The Undercroft: Ossuary', 'Aurenne asks where to arrive');
  await press('cancel');
  h.expect(!wm.picker, 'Cancel goes back to the map');
  await press('confirm');
  await press('down');
  await press('confirm');
  await until(() => game.scene instanceof FieldScene && game.scene.mapId === 'c3_uc_ossuary', 5, 'arrival in the Ossuary');
  await h.wait(0.5);
  const p = game.scene.player;
  h.expect(p.tileX === spot[0] && p.tileY === spot[1], 'arrived beside the Hearthstone');
  h.expect(wm.isHere(wm.nodes[aurenne]), 'inside the Ossuary, Aurenne counts as "here"');

  // 4. A destination with no attuned stone travels straight there.
  wm = await openMap();
  wm.index = wm.nodes.findIndex((n) => n.id === 'thistledown');
  wm.refresh();
  await press('confirm');
  h.expect(!wm.picker, 'no arrival choice without Hearthstones');
  await until(() => game.scene instanceof FieldScene && game.scene.mapId === 'thistledown', 5, 'arrival in Thistledown');
  h.expect(true, 'travelled straight to Thistledown');

  // 5. After the Sundering, Act I stones go with their destinations.
  st.flags.sundered = true;
  h.expect(!openNodes(st).some((n) => n.id === 'aurenne'), 'Act I Aurenne is gone after the Sundering');
  h.expect(waystonesAt(WORLD_NODES.find((n) => n.id === 'c8_kiteholm'), st).length === 0, 'no Act II stones attuned yet');
  st.flags.sundered = false;

  // 6. Attunements save with the game.
  const copy = GameState.deserialize(JSON.parse(JSON.stringify(st.serialize())));
  h.expect(copy.vars.waystones?.c3_uc_ossuary?.x === spot[0], 'attunements survive save and load');
}
