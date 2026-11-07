// Smoke test: the Evernoon ending — accept Cassian's offer, live the day before the Kindling
// forever, "THE END?", and back to the title.
import { startCh12, answer } from './ch12_helpers.js';

export async function run(game, h) {
  const F = h.flags;
  await startCh12(game, h, 'c12_stair', 17, 4, 'up', { c12_stair_enter: true, c12_camp: true, c12_camp_rested: true, c12_hierophant_down: true, c12_king_down: true });
  game.state.vars.c12_looks = Object.fromEntries(game.state.allMembers().map((c) => [c.id, c.lookId]));
  answer(game, 0, 0);                    // "Stay." — "Stay. Forever."
  let title = false;
  const back = game.returnToTitle;
  game.returnToTitle = async () => { title = true; };
  await h.goto('c12_dream_house', 2, 3, 'down');
  for (let i = 0; i < 6 && !title; i++) await h.idle();
  game.returnToTitle = back;
  h.expect(F().c12_choice_made && F().c12_evernoon_ending, 'Wren stayed');
  h.expect(F().c12_evernoon_seen, 'the day repeats');
  h.expect(!F().gameClear, 'no game clear on the Evernoon ending');
  h.expect(title, 'returned to the title');
}
