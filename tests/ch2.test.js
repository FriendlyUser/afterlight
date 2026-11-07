// Smoke test, Chapter 2 part one: Port Gale (arrival, stealth, inn), side quests,
// the Gale Coast Road and the Whisperwold up to the Hollow Mother.
// Run: tools/test.sh ch2 900000
import { PORT } from '../src/story/ch2_port.js';
import { WOLD } from '../src/story/ch2_wold.js';

/** Fresh state as Chapter 1 leaves it: four party members, Crests awake. */
export async function setupChapter2(game, h, level = 10) {
  await h.newGame();
  const st = game.state;
  for (const id of ['ilse', 'bram', 'sable']) st.joinParty(id);
  for (const c of st.allMembers()) { c.setLevel(level); c.sealed = false; c.fullHeal(); }
  Object.assign(st.flags, { p_woke: true, kindled: true, ch1_named: true, ch1_departed: true, ch1_crossed: true });
  st.inventory.add('cassian_letter', 1);
  st.inventory.add('edrins_compass', 1);
  st.inventory.add('hi_tonic', 10);
  st.chapter = 2;
}

/** Run a story function as if the player examined something. */
export async function poke(game, h, fn) {
  await game.scene.runScript(fn);
  await h.idle();
}

export async function run(game, h) {
  await setupChapter2(game, h);
  const f = h.flags;

  // --- Port Gale: arrival, the search, the Salt & Lantern
  await h.goto('port_gale', 10, 20, 'up');
  h.expect(f().c2_arrived && game.scene.actors.has('pg_g1'), 'arrival scene, soldiers posted');
  await h.stepOn(17, 17);
  h.expect(game.state.vars.c2_caught === 1 && !f().c2_stealth_done, 'spotted on the quay, fought, sent back');
  await h.stepOn(18, 8);
  h.expect(f().c2_stealth_done && game.scene.mapId === 'c2_pg_inn', 'hidden by Mags at the Salt & Lantern');

  // --- Port Gale side quests
  await h.goto('port_gale', 30, 15, 'up');
  h.expect(!game.scene.actors.has('pg_g1') && game.scene.actors.has('bettany'), 'town at peace after the search');
  await h.talk('osric');
  h.expect(f().c2_osric_story, 'Osric remembers Edrin and Ysolde');
  await h.talk('bettany');
  await poke(game, h, (s) => PORT.catSpot(s));
  await h.talk('bettany');
  h.expect(f().c2_cat_done && game.state.inventory.count('antidote_charm') > 0, 'Admiral Whiskers returned');
  await h.goto('c2_pg_odile', 4, 5, 'up');
  await h.talk('odile');
  h.expect(f().c2_odile_asked, 'Odile asks after her brother');

  // --- The Gale Coast Road
  await h.goto('c2_gale_road', 1, 14, 'right');
  h.expect(f().c2_road_enter, 'coast road banter');
  await h.stepOn(34, 12);
  h.expect(f().c2_cp_seen, 'checkpoint on the bridge');
  await h.talk('hesketh');
  h.expect(f().c2_hermit_met && f()['blocker:c2_gale_road:goat_rocks'], 'Hesketh opens the goat path');
  await poke(game, h, (s) => PORT.cairn(s));
  h.expect(game.state.inventory.count('c2_marits_ring') === 1, 'Marit\'s ring recovered');

  // --- The Whisperwold
  await h.goto('c2_wold_outer', 1, 20, 'right');
  h.expect(f().c2_wold_enter, 'the trees begin to whisper');
  await h.stepOn(9, 20);
  await h.talk('merry');
  await h.talk('merry');
  await h.talk('merry');
  h.expect(f().c2_merry_found && game.state.inventory.count('c2_merry_acorn') === 1, 'hide and seek: found Merry three times');
  await poke(game, h, (s) => WOLD.joryTree(s));
  await poke(game, h, (s) => WOLD.edrinTree(s));
  await poke(game, h, (s) => WOLD.lysaTree(s));
  await poke(game, h, (s) => WOLD.thorns(s));
  await poke(game, h, (s) => WOLD.merryGrave(s));
  h.expect(f().c2_jory_heard && f().c2_edrin_heard && f().c2_lysa_heard && f()['blocker:c2_wold_outer:thorns'], 'voices heard, thorns parted');

  await h.goto('c2_wold_heart', 1, 33, 'right');
  await poke(game, h, (s) => WOLD.riddle(s));
  await poke(game, h, (s) => WOLD.stone(s, 'grave'));
  h.expect(!f().c2_roots_open && (game.state.vars.c2_stones || []).length === 0, 'wrong stone: shriek, sequence reset');
  for (const which of ['cradle', 'wedding', 'grave']) await poke(game, h, (s) => WOLD.stone(s, which));
  h.expect(f().c2_roots_open, 'Listening Stones answered in the order of a life');
  await h.stepOn(30, 8);
  h.expect(f().c2_mother_done && f().c2_merry_done, 'Hollow Mother defeated, Merry goes home');
  h.expect(game.state.inventory.count('regen_bangle') === 1, 'Merry\'s bangle');

  // --- The lamp in the window
  await h.goto('c2_pg_odile', 4, 5, 'up');
  await h.talk('odile');
  h.expect(f().c2_odile_done, 'Odile blows out the lamp');
  h.log(`party lv ${game.state.leader().level}, gold ${game.state.gold}`);
}
