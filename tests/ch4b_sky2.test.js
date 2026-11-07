// Chapter 4b smoke test, part 4: the Undercradle, the Thunderhead, Vasha's aftermath,
// Kesi's quest and the flight home (handoff to Chapter 5 at lf_sunset).
import { setupParty, patient, inspect, mapId } from './ch4b_common.js';
import { MAPS } from '../src/data/maps/index.js';

export async function run(game, h) {
  await setupParty(game, h, 37, {
    c4b_arrived: true, c4b_mirefen_arrived: true, c4b_osk_saved: true, c4b_elowen_done: true, c4b_elowen_farewell: true,
    c4b_foot_arrived: true, c4b_patched: true, c4b_corder_beaten: true, c4b_launched: true, c4b_flight_done: true,
    c4b_sky_arrived: true, c4b_vasha_met: true, c4b_kesi_asked: true,
  });
  const F = h.flags;
  const H = patient(game, h);

  await H.goto('c4b_undercradle', 25, 4, 'down');
  await H.stepOn(25, 6);
  await inspect(game, h, 7, 15, 'left');
  await inspect(game, h, 43, 15, 'right');
  await inspect(game, h, 11, 28, 'left');
  await inspect(game, h, 14, 27, 'up');
  h.expect(F()['blocker:c4b_undercradle:gate3'] && F().c4b_glider, 'pylons charged, glider found');
  await H.stepOn(25, 36);
  h.expect(F().c4b_thunderhead_beaten, 'Thunderhead defeated');

  await H.goto('c4b_sky_lantern', 7, 10, 'up');
  h.expect(F().c4b_six_of_seven, 'aftermath: Lanternfall is the last');
  await H.goto('c4b_skyreach', 25, 19, 'down');
  await H.talk('kesi');
  h.expect(F().c4b_kesi_done, 'Kesi\'s quest');
  await H.talk('corvin_d');
  h.expect(F().c4b_done && game.state.chapter === 5, 'flew home: Chapter 5 card');
  if (MAPS.lf_sunset) h.expect(mapId(game) === 'lf_sunset', 'handoff to lf_sunset');
  h.log(`party lv ${game.state.leader().level}`);
}
