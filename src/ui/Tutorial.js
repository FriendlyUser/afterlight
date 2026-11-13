// Tutorial cards (data/tutorials.js): the first time the player meets a system, a card
// explains it and names the Guide entry that keeps the details. Each card shows once
// per save (state.vars.tutorials), never during a skip (it waits for the next calm
// moment instead) and not at all with Settings → Tutorials off. Headless tests
// (game.testing) don't see them unless they set game.allowTutorials.
//
//   showTutorial(game, id)   show it now (scripts: s.tutorial(id)); resolves when closed
//   queueTutorial(game, id)  show it at the next calm moment: FieldScene when the player
//                            is free, BattleScene before a party command
//   flushTutorials(game)     show the next queued one, if any

import { el, richText } from './UI.js';
import { keyCap } from '../core/Input.js';
import { TUTORIALS } from '../data/tutorials.js';

export const tutorialSeen = (st, id) => !!st?.vars?.tutorials?.[id];

function suppressed(game) {
  const st = game.state;
  return !st || st.settings.tutorials === false || (game.testing && !game.allowTutorials);
}

/** Keep a card for the next calm moment. */
export function queueTutorial(game, id) {
  if (!TUTORIALS[id] || tutorialSeen(game.state, id) || suppressed(game)) return;
  const q = (game.pendingTutorials ||= []);
  if (!q.includes(id)) q.push(id);
}

/** Show a card now (once per save). Resolves true once the player closes it. */
export function showTutorial(game, id) {
  const t = TUTORIALS[id];
  if (!t || tutorialSeen(game.state, id) || suppressed(game)) return Promise.resolve(false);
  if (game.skipping) { queueTutorial(game, id); return Promise.resolve(false); }
  (game.state.vars.tutorials ||= {})[id] = true;
  game.pendingTutorials = (game.pendingTutorials || []).filter((x) => x !== id);
  return new Promise((resolve) => {
    const box = el('div', 'panel tutorial-card',
      `<div class="tut-kicker">Tutorial</div><div class="tut-title">${t.title}</div>`
      + t.text().map((p) => `<p>${richText(p).replace(/\{key:(\w+)\}/g, (_, a) => keyCap(a))}</p>`).join('')
      + `<div class="tut-foot"><span>Guide → ${t.guide}</span><span>${keyCap('confirm')} Continue</span></div>`);
    const w = {
      el: box,
      isTutorial: true,
      handleInput(input) {
        if (!input.pressed('confirm') && !input.pressed('cancel')) return;
        input.consumeAll();
        game.audio?.sfx('confirm');
        game.ui.remove(w);
        resolve(true);
      },
    };
    game.audio?.sfx('item');
    game.ui.push(w, 'dialog');
  });
}

/** Show the next queued card (of those in `only`, if given), if there is one. */
export function flushTutorials(game, only = null) {
  game.pendingTutorials = (game.pendingTutorials || []).filter((x) => !tutorialSeen(game.state, x));
  const id = game.pendingTutorials.find((x) => !only || only.has(x));
  return id ? showTutorial(game, id) : Promise.resolve(false);
}
