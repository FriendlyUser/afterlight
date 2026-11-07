// Chapter 4b smoke test, part 3: the Stormcrown — Stormfoot, Corder, the flight, Skyreach, Vasha.
// Part 4 (tests/ch4b_sky2.test.js): the Undercradle, the aftermath and the handoff to Chapter 5.
import { setupParty, patient, inspect, mapId } from './ch4b_common.js';

export async function run(game, h) {
  await setupParty(game, h, 36, {
    c4b_arrived: true, c4b_mirefen_arrived: true, c4b_osk_saved: true, c4b_elowen_done: true, c4b_elowen_farewell: true,
  });
  const F = h.flags;
  const H = patient(game, h);

  await H.goto('c4b_stormfoot', 5, 28, 'right');
  h.expect(F().c4b_foot_arrived, 'Stormfoot arrival');
  await H.talk('joss');
  await inspect(game, h, 7, 12, 'up');
  await inspect(game, h, 39, 11, 'up');
  await inspect(game, h, 39, 28, 'up');
  h.expect(F().c4b_core1 && F().c4b_core2 && F().c4b_core3, 'three storm cores');
  await H.goto('c4b_stormfoot', 22, 14, 'up');
  await H.talk('corvin_f');
  h.expect(F().c4b_corder_beaten && F().c4b_flight_done && F().c4b_sky_arrived, 'Corder, the flight, the crash');
  h.expect(mapId(game) === 'c4b_skyreach', 'landed on Skyreach');

  await H.talk('kesi');
  await H.talk('kites');
  await H.goto('c4b_sky_lantern', 7, 10, 'up');
  h.expect(F().c4b_vasha_met, 'Vasha: six of seven');
}
