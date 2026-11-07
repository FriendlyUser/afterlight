// Doors and Marlow's shop: walking into a door opens it and leads inside (landing
// in the room, not back out on the first step), Marlow can be spoken to across the
// counter, and leaving walks the player back out of the door, which swings shut.
// Run: SIM=240 tools/test.sh shop_counter 120000
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  game.autoConfirm = false;
  const st = game.state;
  st.joinParty('wren');
  st.joinParty('ilse');
  await game.start(new FieldScene(game), { mapId: 'lanternfall', x: 10, y: 17, dir: 'up', skipEnterScript: true });
  await h.wait(0.5);
  const tile = () => `${game.scene.mapId} (${game.scene.player.tileX},${game.scene.player.tileY})`;
  const town = game.scene;
  const door = town.built.doors.get('10,15');
  h.expect(door && !town.grid.walkable(10, 15), 'the store door is a solid, animated door');

  // Walk up the path and into the store's door.
  game.input.held.add('up');
  let opened = 0;
  for (let i = 0; i < 80 && game.scene.mapId !== 'lf_store'; i++) {
    opened = Math.max(opened, -door.panel.rotation.y);
    await h.wait(0.05);
  }
  h.expect(opened > 1, `the door swings open (${opened.toFixed(2)} rad)`);
  h.expect(game.scene.mapId === 'lf_store', `the door leads into the store (${tile()})`);
  await h.wait(1.5); // keep holding up: walk in to the counter
  game.input.held.delete('up');
  await h.wait(0.3);
  const field = game.scene;
  h.expect(field.mapId === 'lf_store' && field.player.tileY === 4, `still inside, standing at the counter (${tile()})`);
  h.expect(field.player.material.opacity === 1 && field.followers.list.every((f) => f.actor.material.opacity === 1), 'everyone is fully visible after walking in');

  const target = field.findTarget();
  h.expect(target?.kind === 'npc' && target.actor.def.id === 'marlow', 'Marlow can be talked to across the counter');
  field.player.placeAt(3, 4, field.grid);
  field.player.face('up');
  h.expect(field.findTarget()?.actor?.def.id === 'marlow', '…from either side of the counter too');

  // Leave: walk down onto the exit, come out of the door, which then closes.
  field.player.placeAt(4, 4, field.grid);
  game.input.held.add('down');
  for (let i = 0; i < 80 && game.scene.mapId !== 'lanternfall'; i++) await h.wait(0.05);
  game.input.held.delete('down');
  h.expect(game.scene.mapId === 'lanternfall', `leaving the store returns to the village (${tile()})`);
  const outside = game.scene;
  const outDoor = outside.built.doors.get('10,15');
  await h.wait(0.15);
  h.expect(-outDoor.panel.rotation.y > 0.3 && outside.player.z < 16.5, 'the player steps out of the open door');
  await h.wait(1.2);
  h.expect(outside.player.tileX === 10 && outside.player.tileY === 16 && outDoor.panel.rotation.y === 0, `…onto the doorstep, and the door shuts (${tile()})`);

  // A locked door speaks instead of opening.
  outside.grid.tags.get('10,15').door = { ...outside.grid.tags.get('10,15').door, locked: true, lockedText: 'Closed for the Kindling.' };
  outside.player.placeAt(10, 16, outside.grid);
  game.input.held.add('up');
  await h.wait(0.6);
  game.input.held.delete('up');
  h.expect(game.scene === outside && document.body.textContent.includes('Closed for the Kindling.'), 'a locked door shows its message');

  // An off-map arrival never strands the player outside the room.
  await game.start(new FieldScene(game), { mapId: 'lf_store', x: 4, y: 9, dir: 'up', skipEnterScript: true });
  const p = game.scene.player;
  h.expect(game.scene.grid.inside(p.tileX, p.tileY) && p.tileY < 6, `a bad arrival is moved inside (${tile()})`);
}
