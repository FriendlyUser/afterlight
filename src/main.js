// Afterlight — entry point. Wires subsystems together and starts on the title.

import { Game } from './core/Game.js';
import { UI } from './ui/UI.js';
import { GameState, SaveStore } from './state/GameState.js';
import { AudioEngine } from './audio/Audio.js';
import { VoiceLines } from './audio/VoiceLines.js';
import { FieldScene } from './world/FieldScene.js';
import { LOOKS } from './data/looks.js';
import './data/fish.js'; // registers fish as items
import { contentReady } from './data/content/index.js';

const game = new Game({
  canvas: document.getElementById('view'),
  uiRoot: document.getElementById('ui'),
  fader: document.getElementById('fader'),
});

const ui = new UI(document.getElementById('ui'), game);
const audio = new AudioEngine(game);
const state = new GameState();
game.attach({ ui, audio, state });
game.voiceLines = new VoiceLines(audio); // recorded lines, if a voice pack is installed (voice/)
game.applySettings();

// Speaker name -> portrait look
ui.setLookResolver((name) => {
  const key = String(name).toLowerCase().split(' ')[0];
  const ch = Object.values(game.state.characters).find((c) => c.name === name);
  if (ch) return ch.look;
  const scene = game.scene;
  if (scene?.actors) for (const a of scene.actors.values()) if (a.name === name || a.def?.name === name) return a.look;
  return LOOKS[key] || null;
});

window.afterlight = game; // handy for debugging in the console
if (new URLSearchParams(location.search).has('trace')) {
  game.debugTrace = (m) => { document.title = `${document.title.slice(-200)} | ${m}`; };
  setInterval(() => { document.title = document.title.replace(/ \[.*?\]/, '') + ` [f${game._frame} t${game.time.toFixed(1)} tasks${game.tasks.size}]`; }, 500);
}

// Surface runtime errors on screen (and in the DOM for headless testing).
const errLog = document.createElement('pre');
errLog.id = 'errlog';
errLog.style.cssText = 'position:fixed;left:0;bottom:0;max-height:40vh;overflow:auto;margin:0;color:#ff9090;background:rgba(0,0,0,.8);font:12px monospace;z-index:99;display:none';
document.body.appendChild(errLog);
const logError = (msg) => { errLog.style.display = 'block'; errLog.textContent += `${msg}\n`; };
window.addEventListener('error', (e) => logError(`${e.message} @ ${e.filename}:${e.lineno}`));
window.addEventListener('unhandledrejection', (e) => logError(`Unhandled: ${e.reason?.stack || e.reason}`));
const origError = console.error.bind(console);
console.error = (...args) => { origError(...args); logError(args.map((a) => a?.stack || String(a)).join(' ')); };

game.returnToTitle = async () => {
  const { TitleScene } = await import('./scenes/TitleScene.js');
  game.audio?.stopMusic(1);
  await game.fadeOut(1);
  game.sceneStack = [];
  for (const w of [...game.ui.stack]) game.ui.remove(w);
  game.ui.layers.hud.innerHTML = '';
  await game.setScene(new TitleScene(game));
};
/** Load a save slot from anywhere (the defeat screen): the field it was saved in replaces whatever is running. */
game.loadSave = async (slot) => {
  const rec = SaveStore.read(slot);
  if (!rec) return game.returnToTitle();
  game.audio?.stopMusic(0.8);
  await game.fadeOut(0.8);
  game.sceneStack = [];
  for (const w of [...game.ui.stack]) game.ui.remove(w);
  game.ui.layers.hud.innerHTML = '';
  Object.assign(game.state, GameState.deserialize(rec.data));
  game.applySettings();
  const loc = game.state.location;
  await game.setScene(new FieldScene(game), { mapId: loc.mapId, x: loc.x, y: loc.y, dir: loc.dir });
  await game.fadeIn(0.8);
};
// After a defeat the player picked "Load last save" (defeatChoice, set by the battle) or the title.
game.onGameOver = () => {
  const load = game.defeatChoice === 'load';
  game.defeatChoice = null;
  return load ? game.loadSave(SaveStore.latestSlot()) : game.returnToTitle();
};

async function boot() {
  const params = new URLSearchParams(location.search);
  await contentReady; // all chapter packs registered
  const { MenuSystem } = await import('./ui/Menus.js').catch(() => ({ MenuSystem: null }));
  if (MenuSystem) game.menus = new MenuSystem(game);

  // Headless tests run against the unbundled source; a production build (Vite sets
  // import.meta.env.PROD) drops the harness and the tests it would pull in.
  if (params.has('test') && !import.meta.env?.PROD) {
    const { runTest } = await import('./debug/TestHarness.js');
    await runTest(game, params.get('test'));
    return;
  }
  if (params.has('map')) {
    // Debug: jump straight into a map with a starter party.
    state.joinParty('wren');
    for (const id of (params.get('party') || '').split(',').filter(Boolean)) state.joinParty(id);
    state.gold = 500;
    if (params.has('lv')) for (const c of state.allMembers()) c.setLevel(+params.get('lv'));
    if (params.has('flags')) for (const f of params.get('flags').split(',')) state.flags[f] = true;
    // Debug: Crest CP for every member, e.g. ?cp=vanguard:1260,mender:800 (past 800 = Ascension).
    for (const pair of (params.get('cp') || '').split(',').filter(Boolean)) {
      const [crest, n] = pair.split(':');
      for (const c of state.allMembers()) c.crests[crest] = +n;
    }
    const field = new FieldScene(game);
    await game.start(field, { mapId: params.get('map'), x: +(params.get('x') || 16), y: +(params.get('y') || 13), dir: 'down' });
    game.fadeIn(0.6);
    if (params.has('ride')) { state.flags.mount_kindle = true; field.setRiding(true, { quick: true }); } // Debug: on Kindle
    if (params.has('battle')) field.runScript((s) => s.battle(params.get('battle'), { bg: params.get('bg') || undefined }));
    if (params.has('say')) field.runScript((s) => s.say(params.get('say'), params.get('text') || 'A test line of dialogue, with *gold* and _italic_ markup.'));
    if (params.has('menu')) {
      // Debug: open a menu screen directly, e.g. ?menu=crests or ?menu=shop:aurenne or ?menu=world
      const [kind, arg] = params.get('menu').split(':');
      setTimeout(() => {
        if (kind === 'main') game.menus.openMain(field);
        else if (kind === 'shop') game.menus.openShop(arg);
        else if (kind === 'world') field.openWorldMap();
        else game.menus.screen(kind, 0).open();
      }, 600);
    }
    return;
  }
  const { TitleScene } = await import('./scenes/TitleScene.js');
  if (params.has('opening')) {
    // Debug: play the opening movie (?opening=<shot index> starts mid-way), then the title.
    const { OpeningScene } = await import('./scenes/OpeningScene.js');
    const opening = new OpeningScene(game, { from: Number(params.get('opening')) || 0 });
    await game.start(opening);
    await opening.done;
    await game.setScene(new TitleScene(game));
    return;
  }
  game.start(new TitleScene(game));
  // If anything goes wrong before the title fades in, make sure the screen is visible.
  setTimeout(() => { if (parseFloat(document.getElementById('fader').style.opacity || '1') > 0.9 && !game.scene) game.fadeIn(1); }, 4000);
}

boot().catch((e) => {
  console.error(e);
  document.body.insertAdjacentHTML('beforeend', `<pre style="position:fixed;top:0;left:0;color:#f88;z-index:99;white-space:pre-wrap">${e.stack || e}</pre>`);
});
