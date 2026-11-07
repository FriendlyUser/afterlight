// Smoke test, Chapter 10 part 1: layouts, the shard, the supply lift, the clocks, the Hour-Warden, Evernoon.
import { contentReady } from '../src/data/content/index.js';
import { startAt, inspect, sanityAll, stamp } from './c9c10_helpers.js';
import { GEAR7, RUIN5 } from './c9c10_gear.js';

export async function run(game, h) {
  await contentReady;
  await startAt(game, 'c10_lorne_house', 5, 7, { flags: { c9_done: true }, party: RUIN5, level: 60, gear: GEAR7 });
  await sanityAll(game, h, [['noon_spire', 15, 40], ['c10_spire_halls', 20, 37], ['c10_evernoon', 23, 41], ['c10_lorne_house', 5, 7]]);
  await h.goto('noon_spire', 15, 40, 'up');
  h.expect(h.flags().c10_landed, 'landing on the shard');
  await h.stepOn(27, 7);
  h.expect(h.flags().c10_lift_cleared, 'lift guards beaten');
  stamp(game, h, 'lift');
  await h.goto('c10_spire_halls', 20, 37, 'up');
  h.expect(h.flags().c10_halls, 'halls arrival');
  await inspect(game, h, 6, 28);
  await inspect(game, h, 35, 28);
  await inspect(game, h, 7, 10);
  h.expect(h.flags()['blocker:c10_spire_halls:dais_seal'], 'three clocks stopped, dais open');
  stamp(game, h, 'clocks');
  await h.stepOn(21, 11);
  h.expect(h.flags().c10_warden_done, 'Hour-Warden defeated');
  stamp(game, h, 'warden');
  await h.goto('c10_evernoon', 23, 41, 'up');
  h.expect(h.flags().c10_evernoon, 'Evernoon arrival');
  for (let i = 0; i < 3; i++) await h.talk('hollis');
  await h.talk('squire');
  await h.talk('bess');
  await h.talk('tomas');
  await h.talk('bess');
  h.expect(h.flags().c10_q_lemon_done, 'the lemonade arrives');
  await h.talk('lover_m');
  await h.talk('lover_m');
  h.expect(h.flags().c10_q_ask_done, 'the question is asked');
  stamp(game, h, 'evernoon');
}
