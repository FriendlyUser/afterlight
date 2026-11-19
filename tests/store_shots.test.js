// Not a test: sets up one Google Play screenshot and holds it there, so that
// tools/android/store-shots.sh can take the picture. ?test=store_shots&shot=<name>
import { GameState, SaveStore } from '../src/state/GameState.js';
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  const shot = new URLSearchParams(location.search).get('shot');
  // A headless browser draws only a few frames in the time it is given, so the game's
  // clock is turned by hand here: pump(2) is two seconds of play, however long it takes.
  const pump = async (seconds) => {
    for (let t = 0; t < seconds; t += 0.05) { game.tick(0.05); await new Promise((res) => setTimeout(res, 0)); }
  };
  const until = async (cond, seconds = 60) => { for (let t = 0; t < seconds && !cond(); t += 0.25) await pump(0.25); return cond(); };
  game.autoConfirm = false;
  game.autoBattle = false;

  /** Open one of the playtest saves (saves/) in its field, as a player would find it. */
  const load = async (file) => {
    const rec = SaveStore.parseFile(await (await fetch(`saves/${file}.json`)).text());
    Object.assign(game.state, GameState.deserialize(rec.data));
    game.state.settings.difficulty = 1;
    game.applySettings();
    const loc = game.state.location;
    await game.start(new FieldScene(game), { mapId: loc.mapId, x: loc.x, y: loc.y, dir: loc.dir });
    game.fadeIn(0.3);
    await pump(2.5);
    return game.scene;
  };

  const SHOTS = {
    /** The feature graphic: the title screen's scene and logo, without its menu. */
    async feature() {
      const { TitleScene } = await import('../src/scenes/TitleScene.js');
      await game.start(new TitleScene(game));
      await until(() => !!document.querySelector('.ts-menu'));
      await pump(4); // the fade from black, and the camera's first drift
      for (const sel of ['.ts-menu', '.ts-foot', '.ts-diff', '.touch-controls']) document.querySelectorAll(sel).forEach((e) => { /** @type {HTMLElement} */ (e).style.visibility = 'hidden'; });
      const logo = /** @type {HTMLElement} */ (document.querySelector('.ts-logo'));
      if (logo) logo.style.top = '18vh';
    },
    /** A conversation: Ilse's plan on the pier at Port Gale (her line from that scene). */
    async dialogue() {
      const field = await load('ch02_01_port_gale');
      field.runScript((s) => s.say('Ilse', 'It smells like _the plan_. Three things. One: they\'re watching the quay and the main street. Two: nobody\'s watching that alley by the chandler\'s, west of here. Three: if they see her, we run.'));
      await until(() => game.ui.top()?.isDialogue);
      await pump(8); // long enough for the whole line to type out
    },
    /** A battle, waiting on the player's command. */
    async battle() {
      const field = await load('ch04_02_c4a_dunes');
      field.runScript((s) => s.battle('c4a_dune_mix', { bg: 'desert' }));
      if (!(await until(() => !!document.querySelector('.cmd-surge'), 60))) throw new Error('the battle never reached a command');
      await pump(1.5);
    },
    async worldmap() {
      const field = await load('ch04_13_mirefen_road');
      field.openWorldMap();
      await pump(3);
    },
    async crests() {
      await load('ch06_04_c6_keelhaven');
      game.ui.layers.hud.style.visibility = 'hidden'; // as when the screen is opened from the menu
      game.menus.screen('crests', 0).open();
      await pump(1.5);
    },
    async menu() {
      const field = await load('ch06_04_c6_keelhaven');
      game.menus.openMain(field);
      await pump(1.5);
    },
  };
  if (!SHOTS[shot]) throw new Error(`No such shot: ${shot} (have ${Object.keys(SHOTS).join(', ')})`);
  await SHOTS[shot]();
  await pump(0.5);
  h.log(`holding ${shot}`);
}
