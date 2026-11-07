// Smoke test, Chapter 9 part 2: the Benediction, Ox's clock, Odessa's permit.
import { contentReady } from '../src/data/content/index.js';
import { startAt, inspect, stamp } from './c9c10_helpers.js';
import { GEAR7, RUIN5 } from './c9c10_gear.js';

const FLAGS = { c9_arrived: true, c9_met_corvin: true, c9_flask: true, c9_met_mags: true, c9_boneyard_open: true, c9_part_coil: true, c9_corvin_joined: true, c9_benediction_open: true };

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  await startAt(game, 'corvins_roost', 6, 18, { flags: FLAGS, party: RUIN5, level: 58, gear: GEAR7, items: { airship_part: 1 } });
  await h.talk('ruddock');
  h.expect(game.scene.mapId === 'c9_benediction' && h.flags().c9_bn_arrived, 'barge to the Benediction');
  stamp(game, h, 'barge');
  await inspect(game, h, 23, 8);
  await inspect(game, h, 38, 16);
  h.expect(h.flags()['blocker:c9_benediction:ward'], 'both censers silenced');
  stamp(game, h, 'censers');
  await h.stepOn(22, 19);
  h.expect(h.flags().c9_deck_talk, 'deck talk');
  await h.stepOn(23, 15);
  h.expect(h.flags().c9_part_sail && st.inventory.count('airship_part') === 2, 'Squallmaw defeated, part 2');
  stamp(game, h, 'squallmaw');
  await h.goto('c9_benediction_cabin', 4, 6, 'up');
  await inspect(game, h, 6, 2);
  h.expect(st.inventory.count('c9_pilgrim_clock') === 1, 'Pilgrim\'s Clock');
  await h.goto('corvins_roost', 21, 28, 'right');
  await h.talk('ox');
  await h.talk('ox');
  h.expect(h.flags().c9_q_clock_done, 'Ox fixes the clock');
  await h.goto('c9_ledger_house', 5, 7, 'up');
  await h.talk('odessa');
  await h.idle();
  h.expect(h.flags().c9_cinderdeep_open && game.scene.mapId === 'corvins_roost', 'permit and Odessa\'s private word');
  stamp(game, h, 'permit');
}
