// Smoke test (2/2): Lysa's chalk trail, the First Dark, the Hiding Place, the
// Echo Colosseum, Tobb's letter, Quill's charts and Orrin's Tally.
import { ABYSS_LAYOUTS } from '../src/data/maps/postgame_abyss_gen.js';
import { PG } from '../src/story/postgame.js';
import { setupParty, shrinkBosses } from './postgame_helpers.js';

export async function run(game, h) {
  const st = await setupParty(game, h);
  shrinkBosses();
  Object.assign(st.flags, { gameClear: true, pg_arrived: true, pg_boss_10: true, pg_boss_20: true });
  st.vars.pg_deepest = 30;

  // ------------------------------------------------------------ chalk trail
  for (const n of [6, 13, 21, 27]) {
    const S = ABYSS_LAYOUTS[n].spots;
    await h.goto(`abyss_${n}`, S.entry[0], S.entry[1]);
    await game.scene.runScript((s) => PG.chalk(s, n));
    await h.idle();
  }
  h.expect([6, 13, 21, 27].every((n) => h.flags()[`pg_chalk_${n}`]), 'all four chalk marks');

  // ------------------------------------------------------------ the First Dark
  await h.goto('abyss_30', 18, 17, 'up');
  await h.stepOn(18, 15);
  h.expect(h.flags().pg_first_dark, 'the First Dark given an edge');
  h.expect(st.unlockedCrests.has('sunforged') && st.unlockedCrests.has('afterlight'), 'Sunforged and Afterlight Crests unlocked');
  h.expect(st.inventory.count('breakers_gem') === 1, 'Breaker\'s Gem received');
  await h.goto('abyss_30', ABYSS_LAYOUTS[30].spots.liftArrive[0], ABYSS_LAYOUTS[30].spots.liftArrive[1], 'up');
  h.expect(game.scene.blockers?.has('lift'), `lift waits on B30 (blockers: ${[...(game.scene.blockers?.keys() || [])].join(',')})`);

  // ------------------------------------------------------------ the Hiding Place
  await h.goto('abyss_gate', 5, 22, 'up');
  await game.scene.runScript((s) => PG.chalkGate(s));
  await h.idle();
  h.expect(game.scene.mapId === 'pg_hiding_place', 'chalk door opens');
  st.vars.pg_lysa_spot = 'fountain';
  await game.scene.runScript((s) => PG.hideSpot(s, 'well'));
  await h.idle();
  await game.scene.runScript((s) => PG.hideSpot(s, 'fountain'));
  await h.idle();
  h.expect(h.flags().pg_lysa_done && st.inventory.count('pg_chalk_stub') === 1, 'Lysa found, fought and sent home');

  // ------------------------------------------------------------ the Colosseum
  await h.goto('pg_arena', 14, 23, 'up');
  await h.talk('dace');
  h.expect(st.vars.pg_arena === 1 && st.inventory.count('regen_bangle') === 1, 'Colosseum rank I');
  st.vars.pg_arena = 9;
  await game.scene.runScript((s) => PG.bout(s, 10));
  await h.idle();
  h.expect(st.vars.pg_arena === 10 && st.inventory.count('pg_echo_laurel') === 1, 'Colosseum rank X (Mirror Match)');

  // ------------------------------------------------------------ Tobb, Quill, the Tally
  await h.goto('abyss_gate', 17, 9, 'up');
  st.inventory.add('pg_tobbs_letter');
  await h.talk('tobb');
  h.expect(h.flags().pg_tobb_done, 'Tobb\'s letter returned');
  await h.talk('quill');
  h.expect(h.flags().pg_quill_30, 'Quill pays for the bottom');
  st.characters.wren.crests.vanguard = 800;
  await h.talk('orrin');
  h.expect(h.flags().pg_tc_1, 'Tally rewards a Crest mastery');
  h.log(`bestiary ${Object.keys(st.bestiary).length}, lv ${st.leader().level}`);
}
