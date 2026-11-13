// Tutorials and the battle choices (ui/Tutorial.js, data/tutorials.js, BattleScene's
// auto-battle and skip): every card names a Guide entry that exists; a card shows once,
// waits out a skip, and stays away with Settings → Tutorials off; queued cards (new gear)
// show once the player is free; the first battle shows the Battle card; Settings →
// Auto-Battle starts fights on auto; Settings → Skip Random Battles plays them out at
// once, with the results and rewards as usual.
// Run: SIM=240 tools/test.sh tutorials 600000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { TUTORIALS } from '../src/data/tutorials.js';
import { GUIDE } from '../src/ui/menu/screens.js';
import { showTutorial, tutorialSeen } from '../src/ui/Tutorial.js';

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  game.allowTutorials = true;
  const seen = (id) => tutorialSeen(st, id);
  const guideNames = new Set(GUIDE.map(([t]) => t));

  // 1. Every card points at a real Guide entry.
  const missing = Object.entries(TUTORIALS).filter(([, t]) => !guideNames.has(t.guide)).map(([id]) => id);
  h.expect(!missing.length, `every tutorial names a Guide entry (${Object.keys(TUTORIALS).length} cards; missing: ${missing.join(', ') || 'none'})`);
  h.expect(['Auto-Battle & Skipping', 'Formation', 'Travel', 'Tutorials'].every((n) => guideNames.has(n)), 'the Guide covers auto-battle and skipping, formation, travel and tutorials');

  for (const id of ['wren', 'ilse', 'bram']) st.joinParty(id).setLevel(20);
  Object.assign(st.flags, { p_woke: true, kindled: true });
  await game.start(new FieldScene(game), { mapId: 'lanternfall', x: 16, y: 13, dir: 'down', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.wait(0.5);
  const f = game.scene;

  // 2. Once per save; never during a skip; not with the setting off.
  let shownTop = false;
  await f.runScript(async (s) => {
    const p = s.tutorial('poise');
    shownTop = !!game.ui.top()?.isTutorial;
    await p;
  });
  h.expect(shownTop && seen('poise'), 'a card shows, and is remembered');
  h.expect(await showTutorial(game, 'poise') === false, 'and doesn\'t show twice');
  game.skipping = true;
  h.expect(await showTutorial(game, 'afterglow') === false && !seen('afterglow') && game.pendingTutorials.includes('afterglow'), 'during a skip it waits in the queue');
  game.skipping = false;
  await h.wait(1.0);
  await h.idle();
  h.expect(seen('afterglow'), 'and shows once the player is free');
  st.settings.tutorials = false;
  h.expect(await showTutorial(game, 'formation') === false && !seen('formation'), 'Settings → Tutorials off: no cards');
  st.settings.tutorials = true;

  // 3. New gear queues the Equipment card for the next calm moment.
  await f.runScript((s) => s.give('iron_sword', 1, true));
  await h.wait(1.0);
  await h.idle();
  h.expect(seen('equipment'), 'new gear: the Equipment card, once the player is free');

  // 4. The first battle the player fights by hand (a random one, as the field starts
  // them): the Battle card before the first command.
  game.autoBattle = false;
  let r = null;
  await f.runScript(async (s) => { r = await s.battle('lf_jelly2', { random: true }); });
  await h.idle();
  h.expect(r === 'win' && seen('battle'), 'the first battle shows the Battle card');
  await h.wait(1.0);
  await h.idle();
  h.expect(seen('encounters'), 'and the Random Battles card waits for the field');

  // 5. Settings → Auto-Battle: random battles start on auto.
  st.settings.autoBattle = 1;
  let auto = null;
  const watchAuto = () => { game.tasks.add(() => { if (game.scene?.isBattle) { auto = game.scene.autoToggle; return true; } return false; }); };
  watchAuto();
  await f.runScript(async (s) => { r = await s.battle('lf_jelly2', { random: true }); });
  await h.idle();
  h.expect(r === 'win' && auto === true, 'Auto-Battle (random battles): the fight starts on auto');
  st.settings.autoBattle = 0;

  // 6. Settings → Skip Random Battles: played out at once, the results and rewards as usual.
  st.settings.skipBattles = true;
  let skipped = false, battleTime = 0;
  game.tasks.add((dt) => { if (game.scene?.isBattle) { battleTime += dt; if (game.skipping) skipped = true; } return !!r && game.scene === f; });
  const gold = st.gold;
  const real = performance.now();
  r = null;
  await f.runScript(async (s) => { r = await s.battle('lf_jelly2', { random: true }); });
  await h.idle();
  h.expect(r === 'win' && skipped && !game.skipping, `Skip Random Battles: the fight plays out behind the veil (${battleTime.toFixed(1)} game-s in ${((performance.now() - real) / 1000).toFixed(1)} s), then stops skipping`);
  h.expect(st.gold > gold, 'and the rewards still come in');
  st.settings.skipBattles = false;
  game.autoBattle = true;
}
