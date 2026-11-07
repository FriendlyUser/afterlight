// Fast Mode: T toggles it, the game clock and walking speed scale by the chosen
// factor, the badge shows while it's on, and the UI clock is left alone.
// Run: SIM=240 tools/test.sh fast_mode 120000
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  game.autoConfirm = false;
  const st = game.state;
  st.joinParty('wren');
  await game.start(new FieldScene(game), { mapId: 'port_gale', x: 10, y: 19, dir: 'up', skipEnterScript: true });
  await h.wait(1);
  const field = game.scene;
  const realWait = (ms) => new Promise((r) => setTimeout(r, ms)); // real (virtual) time, not game time
  const press = async (action) => { game.input.edges.add(action); await realWait(100); };
  const badge = () => document.querySelector('.fast-badge');

  // The longest open east–west stretch on the map, so walking is never blocked.
  // (Needs > 5 tiles: 0.4 s at ×3 walking speed.)
  const g = field.grid;
  let lane = { len: 0 };
  for (let y = 0; y < g.h; y++) {
    for (let x = 0, run = 0; x < g.w; x++) {
      run = g.walkable(x, y) && (run === 0 || g.canStep(x - 1, y, x, y)) ? run + 1 : 0;
      if (run > lane.len) lane = { len: run, x, y };
    }
  }

  /** Game seconds and tiles walked (holding left) over 400 ms of real time. */
  const sample = async () => {
    field.player.placeAt(lane.x - 3, lane.y, field.grid); // a few tiles in from any edge exit
    const t0 = game.time, x0 = field.player.x;
    game.input.held.add('left');
    await realWait(400);
    game.input.held.delete('left');
    return { clock: game.time - t0, walked: Math.abs(field.player.x - x0) };
  };

  const normal = await sample();
  await press('fast');
  h.expect(st.settings.fastMode && game.speedFactor === 3, 'T turns Fast Mode on (×3 by default)');
  h.expect(badge()?.style.display !== 'none' && badge().textContent.includes('×3'), 'the badge shows ▶▶ ×3');
  const fast = await sample();
  h.expect(fast.clock > normal.clock * 2.5, `game clock ×3 (${normal.clock.toFixed(2)}s → ${fast.clock.toFixed(2)}s per 0.4 s)`);
  h.expect(fast.walked > normal.walked * 2, `walking covers more ground (${normal.walked.toFixed(1)} → ${fast.walked.toFixed(1)} tiles)`);

  st.settings.fastSpeed = 2;
  game.applySettings(st.settings);
  h.expect(game.speedFactor === 2 && badge().textContent.includes('×2'), 'Fast Mode Speed setting changes the factor');

  await press('fast');
  h.expect(!st.settings.fastMode && game.speedFactor === 1 && badge().style.display === 'none', 'T turns it off and hides the badge');
  st.settings.fastSpeed = 3;
}
