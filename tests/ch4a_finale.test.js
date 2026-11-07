// Smoke test, Chapter 4a finale: the night at Frosthollow, the gate, the Bell Stair, Garrick,
// the bell, and the hand-off to ch4b's mirefen_road.
import { MAPS, registerMaps } from '../src/data/maps/index.js';
import { setupParty } from './ch4a.test.js';

export async function run(game, h) {
  const f = h.flags;
  await h.newGame();
  Object.assign(game.state.flags, { c4a_arrived: true, c4a_corvin_joined: true, c4a_saltglass_arrived: true, c4a_tamsin_met: true, c4a_pip_kindled: true,
    c4a_to_greyspine: true, c4a_pass_arrived: true, c4a_frosthollow_arrived: true, c4a_halvard_met: true });
  setupParty(game, ['wren', 'ilse', 'bram', 'sable', 'corvin', 'pip'], 30);
  // ch4b may not have registered its entry map yet; give the hand-off somewhere to land.
  if (!MAPS.mirefen_road) registerMaps([{ ...MAPS.sunscar_road, id: 'mirefen_road', name: 'Mirefen Road', onEnter: undefined, npcs: [], triggers: [], exits: [], chests: [], encounters: undefined }]);

  await h.goto('c4a_fh_guest', 5, 6, 'up');
  await h.talk('tolle');
  h.expect(f().c4a_night, 'night falls');
  await h.goto('c4a_frosthollow', 32, 11, 'down');
  h.expect(f().c4a_gate_done && game.state.inventory.count('c4a_halvard_score') === 1, 'gate scene; Halvard\'s Score');

  await h.goto('c4a_frost_caves', 1, 15, 'right');
  await h.stepOn(2, 15);
  await h.stepOn(20, 8);
  await h.stepOn(27, 13);
  h.expect(f()['blocker:c4a_frost_caves:rubble'], 'Bram clears the rubble');
  await h.goto('c4a_bell_ledge', 1, 13, 'right');
  await h.idle();
  h.expect(f().c4a_garrick_beaten, 'Garrick defeated');
  h.expect(f().c4a_done, 'chapter 4a complete');
  h.expect(game.state.location.mapId === 'mirefen_road', 'handed off to mirefen_road');
  h.log(`party ${game.state.party.join(',')} pip sealed=${game.state.characters.pip.sealed}`);
}
