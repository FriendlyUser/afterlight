// Smoke test, Chapter 10 part 2: Lysa's room, Sister Mercy, Cassian, Sable's name, the escape, hand-off to ch11.
import { MAPS, registerMaps } from '../src/data/maps/index.js';
import { contentReady } from '../src/data/content/index.js';
import { startAt, stamp } from './c9c10_helpers.js';
import { GEAR7, RUIN5 } from './c9c10_gear.js';

const FLAGS = { c9_done: true, c10_landed: true, c10_lift_cleared: true, c10_halls: true, c10_clock_west: true, c10_clock_east: true,
  c10_clock_gallery: true, 'blocker:c10_spire_halls:dais_seal': true, c10_warden_done: true, c10_evernoon: true };

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  if (!MAPS.halcyon_deck) registerMaps([{ ...MAPS.c9_halcyon_flight, id: 'halcyon_deck', onEnter: null }]);
  await startAt(game, 'c10_evernoon', 35, 11, { flags: FLAGS, party: RUIN5, level: 60, gear: GEAR7 });
  await h.goto('c10_lorne_house', 5, 7, 'up');
  await h.idle();
  stamp(game, h, 'mercy');
  h.expect(h.flags().c10_mercy_done, 'Sister Mercy defeated');
  h.expect(h.flags().c10_named && st.party.includes('sable'), 'Sable chooses her name and rejoins');
  h.expect(st.characters.sable.lookId === 'sable' && st.characters.sable.level >= 52, 'Sable look and level');
  h.expect(st.unlockedCrests.has('gloamweaver'), 'Gloamweaver learned');
  h.expect(h.flags().c10_escape && game.scene.mapId === 'c10_evernoon', 'escape begins');
  await h.stepOn(22, 36);
  h.expect(h.flags().c10_gate_fight, 'faceless guards at the gate');
  await h.goto('c10_spire_halls', 20, 5, 'down');
  h.expect(h.flags()['blocker:c10_spire_halls:balcony_door'], 'balcony door blown open');
  await h.stepOn(29, 7);
  h.expect(h.flags().c10_corridor, 'corridor fight');
  stamp(game, h, 'corridor');
  await h.stepOn(36, 8);
  await h.idle();
  h.expect(h.flags().c10_done && h.flags().act3, 'What the Noon Forgot defeated; act3 set');
  h.expect(st.chapter === 11 && game.scene.mapId === 'halcyon_deck', 'chapter 11 card and hand-off to the Halcyon deck');
  h.log(`party: ${st.party.join(',')}`);
}
