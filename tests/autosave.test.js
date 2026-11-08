// Autosave (world/Autosave.js, three rotating slots): arriving in an area saves once
// the player is in control; story beats save, spaced out; a new chapter saves at once;
// the timer saves every few minutes; nothing saves on noSave maps or with Settings →
// Autosave off; the newest autosave is kept up to date and older ones rotate; the
// Save / Load screens list them (load yes, save over no); Continue picks the newest.
// Run: SIM=240 tools/test.sh autosave 600000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { SaveStore, AUTO_SLOTS, AUTO_ROTATE } from '../src/state/GameState.js';
import { AUTOSAVE_GAP, AUTOSAVE_INTERVAL } from '../src/world/Autosave.js';
import { SaveScreen } from '../src/ui/menu/SaveScreen.js';

export async function run(game, h) {
  await contentReady;
  game.allowAutosave = true; // headless tests skip autosaves unless they ask
  const st = game.state;
  st.joinParty('wren').setLevel(10);
  Object.assign(st.flags, { p_woke: true, kindled: true, c2_stealth_done: true });
  for (const s of AUTO_SLOTS) SaveStore.remove(s);
  const auto = () => game.autosaver;
  const field = () => /** @type {FieldScene} */ (game.scene);
  const story = (fn) => field().runScript(async (s) => fn(s));

  // 1. Arrival saves once the player is in control.
  await game.start(new FieldScene(game), { mapId: 'port_gale', x: 24, y: 9, dir: 'down', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.wait(0.6);
  h.expect(auto().count === 1 && auto().last.reason === 'arrival' && SaveStore.read('auto')?.summary.location === 'Port Gale', 'arriving in Port Gale autosaves');

  // 2. A story beat right after: spaced out, then saved.
  await story((s) => s.objective('Find the harbourmaster.', true));
  await h.wait(0.5);
  h.expect(auto().count === 1 && auto().pending === 'story', 'a story beat waits out the gap');
  auto().since = AUTOSAVE_GAP;
  await h.wait(0.3);
  h.expect(auto().count === 2 && auto().last.reason === 'story', 'then saves');

  // 3. A new chapter saves at once; talking that changes nothing doesn't.
  await story((s) => s.wait(0.1));
  await h.wait(0.3);
  h.expect(auto().count === 2 && !auto().pending, 'a scene that changed nothing asks for no save');
  await story(() => { st.chapter = 3; });
  await h.wait(0.3);
  h.expect(auto().count === 3 && auto().last.reason === 'chapter', 'a new chapter saves at once');

  // 4. The timer.
  auto().timer = AUTOSAVE_INTERVAL - 0.05;
  auto().since = AUTOSAVE_GAP;
  await h.wait(0.4);
  h.expect(auto().count === 4 && auto().last.reason === 'time', 'every few minutes of play');

  // 5. Not with a menu open, not on noSave maps, not with the setting off.
  auto().request('chapter');
  game.ui.push({ el: document.createElement('div'), handleInput() {} }, 'menus');
  await h.wait(0.3);
  h.expect(auto().count === 4 && auto().pending === 'chapter', 'not while a menu is open');
  game.ui.remove(game.ui.top());
  await h.wait(0.3);
  h.expect(auto().count === 5, 'saved once the menu closes');
  st.settings.autosave = false;
  auto().request('chapter');
  await h.wait(0.3);
  h.expect(auto().count === 5, 'Settings → Autosave off: no autosave');
  st.settings.autosave = true;
  await field().goto('pg_hiding_place', 10, 10, 'down', { skipEnterScript: true });
  await h.wait(0.6);
  h.expect(auto().count === 5, 'no autosave on a noSave map');

  // 6. Rotation: kept up to date in place, then rotated through all three, oldest replaced.
  await field().goto('port_gale', 24, 9, 'down', { skipEnterScript: true });
  await h.wait(0.6);
  h.expect(SaveStore.autos().length === 1, `one autosave kept up to date in place (${SaveStore.autos().map((a) => a.slot)})`);
  const used = [];
  for (let i = 0; i < 3; i++) {
    st.playtime += AUTO_ROTATE + 1;
    auto().request('chapter');
    await h.wait(0.3);
    used.push(auto().last.slot);
  }
  h.expect(SaveStore.autos().length === 3 && new Set(used).size === 3, `rotates through the three autosave slots (${used.join(', ')})`);
  h.expect(SaveStore.autos()[0].slot === used[2], 'newest first');

  // 7. Save / Load screens and Continue.
  const save = new SaveScreen(game.menus, 'save');
  const rows = save.list.items.filter((it) => it.auto);
  h.expect(rows.length === 3 && rows[0].label === 'A1' && rows.every((r) => r.disabled), 'the Save screen lists A1–A3 (not to be saved over)');
  const load = new SaveScreen(game.menus, 'load');
  h.expect(load.list.items.filter((it) => it.auto && !it.disabled).length === 3, 'the Load screen offers all three');
  SaveStore.write(0, st);
  h.expect(SaveStore.latestSlot() === 0, 'a newer manual save is what Continue loads');
  st.playtime += 5;
  auto().request('chapter');
  await h.wait(0.3);
  h.expect(SaveStore.latestSlot() === auto().last.slot, 'and a newer autosave after it');
  game.allowAutosave = false;
}
