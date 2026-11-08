// The opening movie and the New Game flow: every shot stages in order and the movie
// ends on its own; any key skips it; Title → New Game → difficulty → opening →
// prologue; Cancel backs out of the picker; an idle title plays the movie and returns.
import { OpeningScene } from '../src/scenes/OpeningScene.js';
import { TitleScene } from '../src/scenes/TitleScene.js';
import { OPENING } from '../src/story/opening.js';
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  game.autoConfirm = false; // its confirm presses would skip the movie
  const press = async (action) => { game.input.edges.add(action); await h.wait(0.15); };
  const until = async (cond, sec, what) => {
    for (let t = 0; !cond(); t += 0.1) {
      if (t > sec) throw new Error(`Timed out after ${sec}s waiting for ${what} (scene ${game.scene?.constructor.name})`);
      await h.wait(0.1);
    }
  };

  // 1. The whole movie.
  const total = OPENING.reduce((s, shot) => s + shot.dur, 0);
  const movie = new OpeningScene(game);
  await game.start(movie);
  const t0 = game.time;
  let done = false;
  movie.done.then(() => { done = true; });
  await until(() => done, total + 10, 'the movie to end');
  const ran = game.time - t0;
  h.expect(movie.log.map((l) => l.id).join() === OPENING.map((s) => s.id).join(), `all ${OPENING.length} shots played in order`);
  h.expect(Math.abs(ran - total) < 1.5, `ran ${ran.toFixed(1)}s for ${total.toFixed(1)}s of shots`);
  const worst = movie.log.reduce((a, b) => (b.buildMs > a.buildMs ? b : a));
  h.log(`set builds: worst ${worst.id} ${worst.buildMs}ms, total ${movie.log.reduce((s, l) => s + l.buildMs, 0)}ms`);

  // 2. Skipping.
  const skipped = new OpeningScene(game);
  await game.setScene(skipped);
  await h.wait(2);
  await press('cancel');
  done = false;
  skipped.done.then(() => { done = true; });
  await until(() => done, 1.5, 'the skip');
  h.expect(skipped.index < 3, `skipped during shot ${skipped.shotId}`);

  // 3. Title → New Game → (cancel, then) Hard → opening → prologue.
  game.state.settings.difficulty = 1;
  await game.setScene(new TitleScene(game));
  await h.wait(1.6);
  const title = game.scene;
  h.expect(title.options[title.index].id === 'new', 'title opens on New Game');
  await press('confirm');
  h.expect(title.picker && title.diffIndex === 1, 'New Game asks for a difficulty, Normal first');
  await press('cancel');
  h.expect(!title.picker && title.menuEl.style.display === '', 'Cancel goes back to the title menu');
  await press('confirm');
  await press('right');
  h.expect(title.diffEl.textContent.includes('Enemy HP 130%'), 'Hard shows its numbers');
  await press('confirm');
  await until(() => game.scene instanceof OpeningScene, 3, 'the opening after New Game');
  h.expect(game.state.settings.difficulty === 2, 'New Game saved the chosen difficulty');
  await h.wait(1);
  await press('confirm');
  await until(() => game.scene instanceof FieldScene, 3, 'the prologue');
  h.expect(game.scene.mapId === 'lf_wren_house' && game.state.party[0] === 'wren', 'the prologue starts at home');

  // 4. An idle title plays the movie, and any key brings the title back.
  for (const w of [...game.ui.stack]) game.ui.remove(w); // the prologue's dialogue
  await game.setScene(new TitleScene(game));
  await until(() => game.scene instanceof OpeningScene, 50, 'the idle title to play the opening');
  await h.wait(1.5);
  await press('cancel');
  await until(() => game.scene instanceof TitleScene, 3, 'the title after the attract movie');
  h.expect(true, 'idle title plays the opening and returns');
}
