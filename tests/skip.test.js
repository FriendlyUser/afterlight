// Hold-to-skip and the corner hints: a skipped scene ends in the same state as a
// watched one (it fast-forwards the same script), stops at a choice and at a battle,
// can be refused by a scene, and the hints show how — with >> when things run fast.
// Run: SIM=240 tools/test.sh skip 600000
import { GameState } from '../src/state/GameState.js';

export async function run(game, h) {
  const st = game.state;
  const ui = game.ui;
  const real = (ms) => new Promise((res) => setTimeout(res, ms));
  const until = async (cond, ms = 15000) => { for (let t = 0; t < ms && !cond(); t += 50) await real(50); return cond(); };
  const hints = () => document.querySelector('.scene-hints');
  const hintText = () => hints().textContent;
  const shown = () => hints().classList.contains('show');
  const curtain = () => Number(document.querySelector('.skip-curtain').style.opacity || 0);
  const fader = () => Number(document.getElementById('fader').style.opacity || 0);
  /** What a scene is allowed to change, in a form that compares. */
  const story = () => JSON.stringify({
    flags: st.flags, vars: st.vars, party: st.party, items: st.inventory.serialize(), gold: st.gold,
    chapter: st.chapter, location: st.location, crests: [...st.unlockedCrests].sort(),
  });
  const restore = async (snap, map, x, y, dir) => {
    Object.assign(game.state, GameState.deserialize(JSON.parse(snap)));
    game.applySettings();
    await h.goto(map, x, y, dir);
  };
  const hold = async (ms) => { game.input.held.add('menu'); await real(ms); game.input.held.delete('menu'); };
  const idle = () => !game.scene.busy && !game.scene.pendingScript && !game._transitioning && !game.sceneStack?.length;
  /** Start `begin()` by hand (no auto-confirm), wait for its first line, hold Menu, wait for the skip to end. */
  let skips = 0;
  const startSkip = game.startSkip.bind(game);
  game.startSkip = () => { skips++; startSkip(); };
  const skipScene = async (begin) => {
    game.autoConfirm = false;
    const before = skips;
    begin();
    await until(() => ui.top()?.isDialogue);
    await real(300);
    const t0 = performance.now();
    await hold(1150);
    const started = skips === before + 1;
    await until(() => !game.skipping);
    const seconds = (performance.now() - t0 - 1000) / 1000;
    game.autoConfirm = true;
    return { started, seconds };
  };

  await h.newGame();
  st.settings.fastMode = false;

  // ---------------------------------------------------------------- 1. dialogue, an item, a join, a quest
  await h.goto('lanternfall', 16, 12);
  await h.goto('lf_nana_house', 4, 6, 'up');
  const beforeNana = JSON.stringify(st.serialize());
  await h.talk('nana');
  const watchedNana = story();
  h.expect(st.flags.p_brooch_quest && st.inventory.count('fishing_net') === 1, 'watched: Nana gives the net and Ilse joins');

  await restore(beforeNana, 'lf_nana_house', 4, 6, 'up');
  h.expect(!st.flags.p_brooch_quest && st.party.length === 1, 'state restored to before the scene');
  let field = game.scene;
  game.autoConfirm = false;
  let done = false;
  field.talkTo(field.actors.get('nana')).then(() => { done = true; });
  await until(() => ui.top()?.isDialogue);
  await real(1100);
  h.expect(shown() && hintText().includes('Next') && hintText().includes('Backlog') && hintText().includes('Skip scene') && hintText().includes('Fast'),
    `the corner hints appear during a scene (${hintText()})`);
  st.settings.fastMode = true;
  game.applySettings();
  await real(120);
  h.expect(hintText().includes('>>') && hintText().includes('×3'), `Fast Mode shows as >> ×3 in the hints (${hintText()})`);
  await hold(650);
  h.expect(!game.skipping && !done && ui.top()?.isDialogue, 'Fast Mode does not shorten the hold: 0.65 s is not enough');
  st.settings.fastMode = false;
  game.applySettings();
  await real(100); // the key is up for a few frames
  await hold(800);
  await real(100);
  h.expect(!game.skipping && !done && ui.top()?.isDialogue && curtain() === 0, 'letting go before a second does nothing');
  const lines = ui.history.length;
  const t0 = performance.now();
  await hold(1150);
  h.expect(game.skipping || done, 'holding Menu for a second starts the skip');
  await until(() => done && !game.skipping);
  h.expect(done && story() === watchedNana, `the skipped scene ends in the same state as the watched one (${((performance.now() - t0 - 1000) / 1000).toFixed(2)} s)`);
  h.expect(ui.history.length > lines + 5, `skipped lines go to the backlog (${ui.history.length - lines} more)`);
  h.expect(document.querySelector('.toasts')?.textContent.includes(st.inventory.itemName('fishing_net')), 'items granted during a skip are shown as toasts');
  await real(500);
  h.expect(idle() && curtain() === 0 && fader() === 0 && game.scene.camTarget === null && !shown(), 'afterwards: free to move, screen clear, camera on the player, hints gone');
  game.autoConfirm = true;

  // ---------------------------------------------------------------- 2. a long scene that ends on another map
  st.joinParty('bram');
  st.joinParty('sable');
  st.flags.ch1_named = true;
  await h.goto('lanternfall', 8, 6);
  const beforeKindling = JSON.stringify(st.serialize());
  await h.goto('lf_lantern', 7, 11, 'up');
  await h.idle();
  h.expect(st.flags.kindled && game.scene.mapId === 'lf_wren_house', 'watched: the Kindling ends at home');
  const watchedKindling = story();

  await restore(beforeKindling, 'lanternfall', 8, 6);
  const k = await skipScene(() => { game.scene.goto('lf_lantern', 7, 11, 'up'); });
  await until(idle);
  h.expect(k.started && game.scene.mapId === 'lf_wren_house', `the skip carries across the teleport to the end of the scene (${game.scene.mapId})`);
  h.expect(story() === watchedKindling, 'the skipped Kindling ends in the same state as the watched one');
  h.expect(k.seconds < 2.5, `the skip took ${k.seconds.toFixed(2)} s`);
  await real(500);
  h.expect(curtain() === 0 && fader() === 0 && game.scene.camTarget === null, 'screen clear and camera home after the long skip');
  h.log(`longest skip ${k.seconds.toFixed(2)} s`);

  // ---------------------------------------------------------------- 3. a scene with a battle in the middle
  await h.goto('lf_tidecaves', 1, 16, 'right');
  field = game.scene;
  const b = await skipScene(() => { field.player.placeAt(36, 24, field.grid); field.lastTile = ''; field.onTileEnter(36, 24); });
  await until(() => game.scene.constructor.name === 'BattleScene', 6000);
  h.expect(b.started && game.scene.constructor.name === 'BattleScene' && !game.skipping,
    `a skip stops at the scene's battle (started ${b.started}, scene ${game.scene.constructor.name}, skipping ${game.skipping}, busy ${game.scene.busy}, top ${ui.top()?.constructor?.name}, got ${st.flags.p_brooch_got})`);
  await real(400);
  h.expect(curtain() === 0, 'the curtain lifts for the battle');
  await h.idle();
  h.expect(st.flags.p_brooch_got, 'the battle is fought and the scene finishes normally');

  // ---------------------------------------------------------------- 4. choices, and scenes that refuse
  field = game.scene;
  let picked = null;
  const c = await skipScene(() => {
    field.runScript(async (s) => {
      await s.say('Ilse', ['One.', 'Two.', 'Three.']);
      picked = await s.choice(['Yes', 'No']);
      await s.say('Ilse', 'After.');
    });
  });
  h.expect(c.started && document.querySelectorAll('.choice-item').length === 2 && !game.skipping && picked === null, 'a skip stops at a choice and waits for the player');
  await h.idle();

  game.autoConfirm = false;
  done = false;
  field.runScript(async (s) => { s.noSkip(); await s.say('Ilse', ['Listen to this one.', 'All of it.']); }).then(() => { done = true; });
  await until(() => ui.top()?.isDialogue);
  await real(1000);
  h.expect(hintText().includes('can\'t be skipped'), `a scene can refuse (${hintText()})`);
  await hold(1300);
  h.expect(!game.skipping && !done, 's.noSkip() makes the hold do nothing');
  game.autoConfirm = true;
  await until(() => done);
  h.expect(field.noSkip === false, 'the refusal ends with the scene');

  // ---------------------------------------------------------------- 5. the setting
  st.settings.hideSceneHints = true;
  game.autoConfirm = false;
  done = false;
  field.runScript((s) => s.say('Ilse', 'No hints now.')).then(() => { done = true; });
  await until(() => ui.top()?.isDialogue);
  await real(1100);
  h.expect(!shown(), 'Settings → Scene Hints: Off hides them');
  await hold(1150);
  await until(() => done);
  h.expect(done, '…and holding Menu still skips');
  st.settings.hideSceneHints = false;
  game.autoConfirm = true;
}
