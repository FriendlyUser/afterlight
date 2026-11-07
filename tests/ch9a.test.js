// Smoke test, Chapter 9 part 1: layouts, the Roost, the Last Call, the Boneyard, Corvin rejoins.
import { contentReady } from '../src/data/content/index.js';
import { startAt, inspect, sanityAll, stamp } from './c9c10_helpers.js';
import { GEAR7, RUIN4 } from './c9c10_gear.js';

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  await startAt(game, 'c9_last_call', 6, 8, { party: RUIN4, level: 58, gear: GEAR7 });
  await sanityAll(game, h, [
    ['corvins_roost', 10, 20], ['c9_last_call', 6, 8], ['c9_ledger_house', 5, 7], ['c9_boneyard', 4, 31],
    ['c9_benediction', 22, 39], ['c9_benediction_cabin', 4, 6], ['c9_cinderdeep', 3, 37],
  ]);
  await h.goto('corvins_roost', 10, 20, 'up');
  h.expect(h.flags().c9_arrived, 'arrival scene');
  await h.goto('c9_last_call', 6, 8, 'up');
  h.expect(h.flags().c9_met_corvin, 'met Corvin, beat the bailiffs, met Odessa');
  stamp(game, h, 'last call');
  await h.goto('corvins_roost', 12, 16, 'down');
  await h.stepOn(12, 17);
  h.expect(h.flags().c9_flask, 'Pip pours out the flask');
  await h.talk('mags');
  h.expect(h.flags().c9_boneyard_open, 'Mags briefing');
  await h.goto('c9_boneyard', 4, 31, 'up');
  await h.stepOn(4, 30);
  await inspect(game, h, 4, 4);
  await inspect(game, h, 44, 32);
  h.expect(h.flags()['blocker:c9_boneyard:gate'], 'both winches open the gate');
  stamp(game, h, 'winches');
  await h.stepOn(37, 4);
  h.expect(h.flags().c9_part_coil && st.inventory.count('airship_part') === 1, 'Foreman defeated, part 1');
  stamp(game, h, 'foreman');
  await h.goto('corvins_roost', 25, 17, 'up');
  await h.stepOn(26, 14);
  h.expect(st.party.includes('corvin') && st.characters.corvin.level >= 48, 'Corvin rejoins at Lv 48+');
  stamp(game, h, 'corvin');
}
