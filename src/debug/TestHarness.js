// Headless test harness. Load the game with ?test=<name>&sim=10 to run
// tests/<name>.test.js. Dialogue auto-advances, battles auto-play, and
// progress/errors are written to document.title and #errlog for tools/test.sh.

import { FieldScene } from '../world/FieldScene.js';
import { startNewGame } from '../story/newGame.js';
import { ScriptContext } from '../script/ScriptContext.js';
import { GameState, SaveStore } from '../state/GameState.js';

export async function runTest(game, name) {
  game.autoBattle = true;
  game.autoConfirm = true;
  game.testing = true; // e.g. no tutorial cards unless a test asks (ui/Tutorial.js)
  const log = (m) => { document.title = `${document.title.slice(-600)} | ${m}`; };
  const h = {
    log,
    wait: (s) => game.wait(s),
    /** Start a fresh game state and enter its first map. */
    async newGame() {
      const start = startNewGame(game.state);
      game.start(new FieldScene(game), start);
      game.fadeIn(0.1);
      await game.wait(0.5);
      await h.idle();
    },
    /** Wait until no script is running in the field. */
    async idle(timeout = 900) {
      let t = 0;
      await game.wait(0.3);
      while ((game.scene?.busy || game.scene?.pendingScript || game.sceneStack?.length || game._transitioning) && t < timeout) { await game.wait(0.25); t += 0.25; }
      if (t >= timeout) {
        const sc = game.scene;
        const ui = game.ui.top();
        const dlg = document.querySelector('.dlg-text')?.textContent?.slice(0, 90);
        const battle = sc?.sys ? ` battle=${sc.params?.troopId} turn=${sc.sys.turn} party=${sc.sys.party.map((b) => `${b.id}:${b.hp}`).join(',')} foes=${sc.sys.enemies.map((b) => `${b.def.id}:${b.hp}`).join(',')}` : '';
        throw new Error(`Timed out waiting for idle — scene=${sc?.constructor?.name} map=${sc?.mapId ?? '-'} busy=${sc?.busy} stack=${game.sceneStack?.length} ui=${ui?.constructor?.name ?? (ui ? 'widget' : 'none')}${dlg ? ` text="${dlg}"` : ''}${battle}`);
      }
    },
    async goto(mapId, x, y, dir = 'down') {
      await game.scene.goto(mapId, x, y, dir);
      await game.wait(0.3);
      await h.idle();
    },
    /** Walk the player onto a tile (teleport next to it, then step) to fire triggers. */
    async stepOn(x, y) {
      const f = game.scene;
      f.player.placeAt(x, y, f.grid);
      f.lastTile = '';
      f.onTileEnter(x, y);
      await game.wait(0.3);
      await h.idle();
    },
    /** Talk to an NPC by id. */
    async talk(id) {
      const f = game.scene;
      const a = f.actors.get(id);
      if (!a) throw new Error(`No actor ${id} on ${f.mapId}`);
      await f.talkTo(a);
      await h.idle();
    },
    flags: () => game.state.flags,
    expect(cond, msg) { if (!cond) throw new Error(`Expectation failed: ${msg}`); log(`ok: ${msg}`); },
  };
  // Story smoke tests check flow, not balance (tests/balance.test.js does that), and
  // auto-battle can't use Link Arts, Surge, Swap or items — so they run on Easy.
  // ?testdiff=1 runs them on Normal instead.
  const diff = new URLSearchParams(location.search).get('testdiff');
  game.state.settings.difficulty = diff === null ? 0 : Number(diff);
  // Objectives the story set during this run whose marker found no open way there
  // (see QuestMarkers): reported, not fatal. Ones a test inherited by jumping ahead
  // in the story are ignored.
  const questMisses = new Set();
  const setObjectives = new Set();
  const objective = ScriptContext.prototype.objective;
  ScriptContext.prototype.objective = function (text, ...rest) { setObjectives.add(text); return objective.call(this, text, ...rest); };
  const warn = console.warn.bind(console);
  console.warn = (...args) => {
    const m = String(args[0]).match(/^Quest guide: .* for "(.*)"$/);
    if (m && setObjectives.has(m[1])) questMisses.add(m[0]);
    warn(...args);
  };
  const points = new URLSearchParams(location.search).has('savepoints') ? recordSavePoints(game, name) : null;
  try {
    const mod = await import(`../../tests/${name}.test.js`);
    log(`start ${name}`);
    await mod.run(game, h);
    if (questMisses.size) { log(`quest-guide misses ${questMisses.size}`); console.error([...questMisses].join('\n')); }
    points?.finish();
    log('PASS');
  } catch (e) {
    console.error(e);
    log(`FAIL ${e.message}`);
  }
  points?.write();
}

/**
 * ?savepoints (tools/make_saves.sh): let the game autosave as it would for a player, and
 * keep a save file for each new chapter, for the first arrival in each outdoor area,
 * and for where the test ends — exported files with default settings (Normal
 * difficulty, not the tests' Easy), written into the page as <pre id="savepoints">.
 */
function recordSavePoints(game, test) {
  game.allowAutosave = true;
  // Autosave waits for the prologue's first scene (p_woke); tests that start mid-story
  // skip it, as no real save past that scene would. (A new game clears it again.)
  game.state.flags.p_woke = true;
  const out = [];
  const maps = new Set();
  const keep = (slot, reason) => {
    const st = game.state;
    const rec = JSON.parse(SaveStore.exportFile(slot));
    rec.data.settings = { ...new GameState().settings };
    rec.point = { test, reason, chapter: st.chapter, map: st.location?.mapId, place: st.location?.name, objective: st.vars.objective || '' };
    out.push(rec);
  };
  game.onAutosave = (slot, reason) => {
    const field = game.scene;
    const map = game.state.location?.mapId;
    if (reason === 'chapter') { maps.add(map); keep(slot, reason); return; }
    if (reason !== 'arrival' || maps.has(map) || field?.map?.mood === 'interior' || field?.map?.noSave) return;
    maps.add(map);
    keep(slot, reason);
  };
  return {
    /** The state the test leaves behind, if the player is free to move in it. */
    finish() {
      const field = game.scene;
      if (!field?.map || field.busy || field.pendingScript || field.map.noSave) return;
      if (SaveStore.write('savepoint_end', game.state)) keep('savepoint_end', 'end');
    },
    write() {
      game.onAutosave = null;
      const pre = document.createElement('pre');
      pre.id = 'savepoints';
      pre.textContent = JSON.stringify(out);
      document.body.appendChild(pre);
    },
  };
}
