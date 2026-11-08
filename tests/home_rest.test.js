// Resting at home: Wren's bed restores the party's HP and MP whenever it's used
// (outside the night of the Kindling, when it moves the story on instead).
// Run: SIM=240 tools/test.sh home_rest 120000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  for (const id of ['wren', 'ilse']) st.joinParty(id).setLevel(8);
  Object.assign(st.flags, { p_woke: true, p_opening: true, p_dinner: true, kindled: true, ch1_evening: true, ch1_rested: true, ch1_voices: true, ch1_overheard: true, ch1_ready: true, ch1_dawn: true });
  await game.start(new FieldScene(game), { mapId: 'lf_wren_house', x: 1, y: 3, dir: 'up', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.idle();
  for (const c of st.activeMembers()) { c.hp = 5; c.mp = 0; }
  const f = game.scene;
  f.player.face('up');
  h.expect(f.findTarget()?.kind === 'inspect', 'the bed can be used from the foot of it');
  f.interact();
  await h.idle();
  h.expect(st.activeMembers().every((c) => c.hp === c.stats().hp && c.mp === c.stats().mp), 'resting restores HP and MP');
}
