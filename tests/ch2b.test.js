// Smoke test, Chapter 2 part two: Thistledown, the Crestless Sage, the Hollow Harvest,
// Red Tam's quarry and the hand-off to Chapter 3.
// Run: tools/test.sh ch2b 900000
import { MAPS } from '../src/data/maps/index.js';
import { CRESTS } from '../src/data/crests.js';
import { setupChapter2 } from './ch2.test.js';

export async function run(game, h) {
  await setupChapter2(game, h, 11);
  const f = h.flags;
  Object.assign(game.state.flags, { c2_arrived: true, c2_stealth_done: true, c2_wold_enter: true, c2_mother_done: true });

  // --- Thistledown & the Crestless Sage
  await h.goto('thistledown', 1, 18, 'right');
  h.expect(f().c2_td_arrived, 'arrival in Thistledown');
  await h.goto('c2_sage_house', 4, 7, 'up');
  await h.talk('bethan');
  h.expect(f().crestArtLearned && f().c2_sage_done, 'the Sage teaches the Braided Calling');
  h.expect(game.state.unlockedCrests.has('cantor'), 'Cantor Crest unlocked');
  const wren = game.state.characters.wren;
  h.expect(game.state.crestsAvailableTo(wren).includes('cantor'), 'Wren can switch to Cantor');
  h.expect(Object.keys(CRESTS).some((id) => CRESTS[id].tier === 2), 'Braided Crests exist to unlock');

  // --- The Hollow Harvest
  await h.goto('c2_td_fields', 10, 12, 'up');
  h.expect(!game.scene.blockers.has('hedge'), 'herb path hedge pulled back');
  await h.talk('dunstan');
  await h.talk('sc3');
  h.expect(!f().c2_scare_3, 'Old Strawman waits for the others');
  await h.talk('sc1');
  await h.talk('sc2');
  await h.talk('sc3');
  h.expect(f().c2_scare_1 && f().c2_scare_2 && f().c2_scare_3, 'three scarecrows put down');
  await h.talk('dunstan');
  h.expect(f().c2_scare_done && game.state.inventory.count('c2_pell_horseshoe') === 1, 'farmer rewards the party');

  // --- Red Tam's quarry
  await h.goto('c2_quarry', 23, 39, 'up');
  await h.stepOn(23, 36);
  h.expect(f().c2_yard_fought && f().c2_password_known, 'overheard the password, fought the yard');
  await h.talk('hollis');
  h.expect(f().c2_gate_open, 'past the gate');
  await h.stepOn(28, 7);
  h.expect(f().c2_tam_done && game.state.inventory.count('c2_thorne_writ') === 1, 'Red Tam defeated, writ recovered');
  h.expect(game.scene.mapId === 'thistledown' && f().c2_td_party, 'celebration in Thistledown');

  // --- The road to the City of Bells
  if (!MAPS.aurenne) {
    // Chapter 3 is authored in parallel; stand in a scrap of its entry map so the hand-off can run.
    MAPS.aurenne = { ...MAPS.c2_pg_odile, id: 'aurenne', name: 'Aurenne (placeholder)', ground: Array(40).fill('.'.repeat(40)), height: Array(40).fill('1'.repeat(40)), props: Array(40).fill(' '.repeat(40)), npcs: [], inspect: [], exits: [], onEnter: null, w: 40, h: 40 };
  }
  await h.goto('c2_td_fields', 52, 15, 'right');
  h.expect(!game.scene.blockers.has('barricade'), 'barricade gone');
  await h.stepOn(54, 15);
  h.expect(f().c2_done && game.state.chapter === 3, 'chapter card 3');
  h.expect(game.scene.mapId === 'aurenne' && game.state.location.x === 20 && game.state.location.y === 38, 'handed off to aurenne (20,38)');
  h.log(`party lv ${game.state.leader().level}, gold ${game.state.gold}`);
}
