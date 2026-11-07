// Smoke test: Chapter 8 side quests — Hide and Seek, Bram's Debt, the Kite-Wright,
// Wick's Kite and the first rank of the Scrap Arena.
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  const st = game.state;
  for (const id of ['wren', 'ilse', 'pip']) st.joinParty(id).setLevel(55);
  Object.assign(st.flags, { kindled: true, sundered: true, c8_arrived: true, c8_met_bram: true, c8_underhang_open: true, c8_kids_saved: true });
  st.gold = 5000;
  st.inventory.add('scrap_gear', 3);
  st.inventory.add('c8_wick_kite', 1);

  game.start(new FieldScene(game), { mapId: 'c8_kite_nest', x: 7, y: 8, dir: 'up' });
  game.fadeIn(0.1);
  await h.idle();
  await h.talk('tansy');
  h.expect(h.flags().c8_hide_on, 'hide and seek begins');
  await h.talk('wick');
  h.expect(h.flags().c8_wick_done, 'Wick has his kite back');

  await h.goto('kiteholm', 22, 19, 'down');
  for (const id of ['burr', 'fig', 'nettle', 'pim', 'sprocket']) await h.talk(id);
  await h.talk('quill');
  h.expect(h.flags().c8_quill_done, 'the Kite-Wright has his cogs');
  await h.goto('c8_kite_nest', 7, 8, 'up');
  await h.talk('tansy');
  h.expect(st.inventory.count('c8_kite_tail') === 1, 'Kite-Tail Ribbon');

  await h.goto('c8_baron_hall', 7, 8, 'up');
  await h.talk('dask');
  h.expect(h.flags().c8_debt_paid && st.inventory.count('c8_old_shield') === 1, 'Bram\'s shield redeemed');

  await h.goto('c8_scrap_arena', 10, 15, 'up');
  await h.talk('ratchet');
  h.expect(h.flags().c8_arena1, 'Arena rank I won');
}
