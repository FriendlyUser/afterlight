// Kindle the Emberhart (data/mount.js, story/mount.js): the ride list is sound; Hesk in
// Thistledown points to the Hollow; meeting Kindle there (a fight, then a bond) gives the
// mount and the key item; riding is faster with no random encounters and the party rides
// along; the Ride key toggles; riding stops in towns and carries across route exits;
// talking puts you on foot; the world map shows the ride; after the Sundering Kindle
// finds Wren on the Drift even if she never went looking.
// Run: SIM=240 tools/test.sh mount 600000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { WorldMapScene } from '../src/world/WorldMapScene.js';
import { getMap } from '../src/data/maps/index.js';
import { ITEMS } from '../src/data/items.js';
import { MOUNT, RIDE_MAPS, hasMount } from '../src/data/mount.js';

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  const press = async (action) => { game.input.edges.add(action); await h.wait(0.25); };
  const until = async (cond, sec, what) => {
    for (let t = 0; !cond(); t += 0.1) {
      if (t > sec) throw new Error(`Timed out waiting for ${what}`);
      await h.wait(0.1);
    }
  };
  const field = () => /** @type {FieldScene} */ (game.scene);

  // 1. Data: every ride map is a real outdoor map.
  for (const id of RIDE_MAPS) {
    const m = getMap(id);
    if (!m) throw new Error(`ride map ${id} does not exist`);
    if (m.solo || m.mood === 'interior') throw new Error(`ride map ${id} is a dream or an interior`);
  }
  h.expect(ITEMS[MOUNT.item]?.kind === 'key', `${RIDE_MAPS.size} ride maps; Kindle's Ember is a key item`);

  // 2. Hesk in Thistledown tells of the Emberhart; the Ride key does nothing yet.
  for (const id of ['wren', 'ilse', 'bram', 'sable']) st.joinParty(id).setLevel(14);
  Object.assign(st.flags, { kindled: true, c2_wold_enter: true, c2_mother_done: true, c2_td_arrived: true, c2_stealth_done: true, crestArtLearned: true });
  await game.start(new FieldScene(game), { mapId: 'thistledown', x: 5, y: 18, dir: 'down', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.idle();
  await h.talk('hesk');
  h.expect(st.vars.quests?.mount_kindle?.status === 'active', 'Hesk tells of a burning hart in the Hollow');
  await press('ride');
  h.expect(!field().riding, 'no mount yet: the Ride key does nothing');

  // 3. The Hollow: a fight, then Kindle.
  await h.goto('c2_wold_heart', 30, 9, 'right');
  h.expect(field().actors.has('kindle'), 'the Emberhart waits by the Mother\'s tree');
  await h.talk('kindle');
  h.expect(hasMount(st) && st.inventory.count(MOUNT.item) === 1 && st.vars.quests.mount_kindle.status === 'done', 'Kindle bonds with Wren: mount, key item, quest done');
  let f = field();
  h.expect(f.riding && f.player.look.kind === 'mount' && !f.actors.has('kindle'), 'Wren rides out of the scene');
  await h.wait(0.3);
  h.expect(f.followers.list.length && f.followers.list.every((x) => !x.actor.visible), 'the party rides along (no followers on foot)');

  // 4. Faster than running; no random encounters.
  game.input.padHeld.add('right');
  await h.wait(0.3);
  const speed = f.player.speed;
  game.input.padHeld.delete('right');
  await h.wait(0.2);
  h.expect(speed === MOUNT.speed, `riding speed ${speed} (running is 6.4)`);
  f.stepsLeft = 0.5;
  f.stepEncounter();
  h.expect(!f.busy && f.stepsLeft === 0.5, 'no random encounters while riding');

  // 5. The Ride key gets down and calls Kindle again.
  await press('ride');
  h.expect(!f.riding && f.player.look.kind !== 'mount' && !st.vars.riding, 'Ride again: on foot');
  await h.wait(0.5);
  h.expect(f.followers.list.some((x) => x.actor.visible), 'the party walks behind again');
  await press('ride');
  h.expect(f.riding && st.vars.riding, 'Ride: back on Kindle');

  // 6. Towns put you on foot; route exits keep you riding.
  await h.goto('thistledown', 2, 18, 'right');
  h.expect(!field().riding && !st.vars.riding, 'entering Thistledown: on foot');
  await press('ride');
  h.expect(!field().riding, 'Kindle won\'t come into town');
  await h.goto('c2_wold_heart', 2, 33, 'right');
  h.expect(!field().riding, 'back in the Hollow, still on foot until called');
  await press('ride');
  h.expect(field().riding, 'called in the Hollow');
  await h.goto('c2_wold_outer', 49, 9, 'left');
  f = field();
  h.expect(f.riding && f.player.look.kind === 'mount', 'riding carries across a route exit');

  // 7. Talking or inspecting puts you on foot.
  f.player.placeAt(14, 5, f.grid);
  f.player.face('up');
  f.interact();
  await h.idle();
  h.expect(!field().riding, 'inspecting something: on foot');

  // 8. The world map: Kindle carries you to the destination.
  game.autoConfirm = false;
  await h.goto('thistledown', 23, 18, 'down');
  field().openWorldMap();
  await until(() => game.scene instanceof WorldMapScene, 3, 'the world map');
  await h.wait(0.3);
  const wm = /** @type {WorldMapScene} */ (game.scene);
  wm.index = wm.nodes.findIndex((n) => n.id === 'port_gale');
  wm.refresh();
  await press('confirm');
  await until(() => !!document.querySelector('.wm-rider'), 2, 'Kindle on the world map');
  h.expect(true, 'Kindle rides across the world map');
  await until(() => game.scene instanceof FieldScene && game.scene.mapId === 'port_gale', 6, 'arrival in Port Gale');
  game.autoConfirm = true;
  await h.idle();

  // 9. After the Sundering, Kindle finds Wren on the Drift — even if she never met it.
  delete st.flags[MOUNT.flag];
  st.inventory.remove(MOUNT.item, 1);
  st.vars.objective = null; // the Act I objective has no way there from the Drift
  Object.assign(st.flags, { sundered: true, c6_drift_in: true });
  h.expect(!getMap('c2_wold_heart').npcs.find((n) => n.id === 'kindle').cond(st), 'no hart in the Hollow after the Sundering');
  await h.goto('c6_drift', 44, 14, 'right');
  await h.stepOn(46, 14);
  h.expect(hasMount(st) && st.flags.kindle_drift && st.inventory.count(MOUNT.item) === 1, 'on the Drift, Kindle finds Wren');
  h.expect(field().riding && !field().actors.has('kindle'), 'and she rides on');
}
