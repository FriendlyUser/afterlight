// Smoke test: the Chapter 12 finale, true ending — Cassian, the Noon King, the choice
// (refused), Vesper, the Afterlight, the epilogue, the credits and the post-game handoff.
import { startCh12, answer } from './ch12_helpers.js';

const BEFORE_THRONE = {
  c12_arrived: true, c12_gate_open: true, c12_streets_enter: true, c12_dials_known: true, c12_procession_moved: true,
  c12_mem_enter: true, c12_mem_lost: true, c12_mem_done: true, c12_stair_enter: true, c12_bell_w: true, c12_bell_e: true,
  c12_camp: true, c12_camp_rested: true, c12_q_kite_done: true,
};

export async function run(game, h) {
  const F = h.flags;
  await startCh12(game, h, 'c12_throne', 15, 26, 'up', BEFORE_THRONE);
  game.state.inventory.add('c12_first_atlas', 1);
  const looksBefore = game.state.allMembers().map((c) => c.lookId).join(',');
  h.expect(F().c12_throne_enter, 'throne intro');
  game.menus.openSave = async () => {};
  answer(game, 0, 1, 0);                 // tempted once, then "...No.", then "Continue aboard the Halcyon"
  await h.stepOn(15, 14);
  h.expect(F().c12_hierophant_down && F().c12_king_down, 'Hierophant and Noon King defeated');
  // Hops: dream house -> throne (Vesper, Afterlight) -> throne (farewell) -> square -> ward -> shore -> credits.
  for (let i = 0; i < 12 && !F().gameClear; i++) await h.idle();
  h.expect(F().c12_refused && !F().c12_evernoon_ending, 'Wren refused the Evernoon');
  h.expect(F().c12_vesper_down && F().c12_afterlight && F().c12_farewell, 'Vesper falls; the Afterlight rises; Cassian lets go');
  h.expect(F().c12_atlas_returned, 'Lysa\'s atlas returned');
  h.expect(F().c12_epi_square && F().c12_epi_ward && F().c12_epi_shore, 'epilogue vignettes');
  h.expect(F().gameClear, 'gameClear set');
  h.expect(game.state.inventory.count('sun_shard') === 0, 'the Shards became the new sun');
  h.expect(game.state.allMembers().map((c) => c.lookId).join(',') === looksBefore, 'party looks restored for the post-game');
  await h.idle();
  h.log(`ended on ${game.scene?.mapId || 'title'} (${game.state.location.mapId})`);
}
