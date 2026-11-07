// Smoke test, Chapter 9 part 3: the Cinderdeep, the Long Bell, the Halcyon flies, hand-off to ch10.
import { MAPS, registerMaps } from '../src/data/maps/index.js';
import { contentReady } from '../src/data/content/index.js';
import { startAt, inspect, stamp } from './c9c10_helpers.js';
import { GEAR7, RUIN5 } from './c9c10_gear.js';

const FLAGS = { c9_arrived: true, c9_met_corvin: true, c9_flask: true, c9_met_mags: true, c9_boneyard_open: true, c9_part_coil: true,
  c9_corvin_joined: true, c9_benediction_open: true, c9_bn_arrived: true, c9_part_sail: true, c9_permit: true, c9_cinderdeep_open: true };

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  if (!MAPS.noon_spire) registerMaps([{ ...MAPS.corvins_roost, id: 'noon_spire', onEnter: null, npcs: [] }]);
  await startAt(game, 'c9_cinderdeep', 3, 37, { flags: FLAGS, party: RUIN5, level: 58, gear: GEAR7, items: { airship_part: 2 } });
  await h.stepOn(3, 36);
  await inspect(game, h, 3, 11);
  await inspect(game, h, 41, 33);
  h.expect(h.flags()['blocker:c9_cinderdeep:slag_a'] && h.flags()['blocker:c9_cinderdeep:slag_b'], 'both valves open');
  for (const id of ['miner_dagny', 'miner_hobb', 'miner_ines']) await h.talk(id);
  h.expect(h.flags().c9_q_miners_saved, 'all three miners rescued');
  await h.stepOn(18, 6);
  h.expect(h.flags().c9_part_heart && st.inventory.count('airship_part') === 3, 'Sunworm defeated, part 3');
  stamp(game, h, 'sunworm');
  await h.goto('c9_ledger_house', 5, 7, 'up');
  await h.talk('odessa');
  h.expect(h.flags().c9_q_miners_done, 'miners rewarded');
  await h.goto('corvins_roost', 25, 17, 'up');
  await h.stepOn(26, 14);
  await h.idle();
  stamp(game, h, 'long bell');
  h.expect(h.flags().c9_long_bell && st.unlockedCrests.has('gambler'), 'Severine defeated; Gambler learned');
  h.expect(h.flags().c9_done && st.chapter === 10, 'Halcyon flies, chapter 10 card');
  h.expect(game.scene.mapId === 'noon_spire', 'handed off to the Noon Spire');
}
