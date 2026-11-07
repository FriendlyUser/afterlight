// Settings → Controls: remap keys with real keyboard events, conflicts move keys,
// essential actions can't be left keyless, Delete clears, Esc stays fixed, hints
// follow the bindings, and Reset restores the defaults.
// Run: SIM=240 tools/test.sh controls 120000
import { ControlsScreen } from '../src/ui/menu/ControlsScreen.js';
import { ACTIONS, DEFAULT_BINDINGS } from '../src/core/Input.js';
import { KEYS } from '../src/ui/menu/common.js';
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  game.autoConfirm = false;
  const input = game.input;
  const st = game.state;
  const tick = () => new Promise((r) => setTimeout(r, 120));
  const key = async (code) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code }));
    await tick();
    window.dispatchEvent(new KeyboardEvent('keyup', { code }));
    await tick();
  };
  const row = (id) => ACTIONS.findIndex((a) => a.id === id);
  st.joinParty('wren');
  await game.start(new FieldScene(game), { mapId: 'port_gale', x: 10, y: 19, dir: 'up', skipEnterScript: true }); // runs the game loop
  await tick();
  const screen = new ControlsScreen(game.menus);
  screen.open();
  await tick();

  /** Select the cell for `action`, slot `col`, start listening, then press `code`. */
  const bind = async (action, col, code) => {
    screen.row = row(action);
    screen.col = col;
    screen.build();
    await key(input.bindings.confirm[0]); // start listening
    await key(code);
  };

  await bind('confirm', 0, 'KeyL');
  h.expect(input.bindings.confirm[0] === 'KeyL' && st.settings.keys.confirm[0] === 'KeyL', 'a key is bound and stored in settings');
  h.expect(KEYS.ok.includes('>L<'), 'menu hints show the new key');
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyL' }));
  h.expect(input.pressed('confirm'), 'the new key confirms');
  window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyL' }));
  await tick(); // …which also confirmed on the Controls screen: it's now waiting for a key
  await key('Escape');
  h.expect(!screen.listening && input.bindings.confirm[0] === 'KeyL', 'Esc cancels waiting for a key, changing nothing');

  await bind('run', 2, 'KeyT');
  h.expect(input.bindings.run.includes('KeyT') && !input.bindings.fast.includes('KeyT'), 'binding a used key moves it from its old action');

  st.settings.keys = { ...input.bindings, up: ['ArrowUp'] };
  game.applySettings();
  await bind('down', 2, 'ArrowUp');
  h.expect(input.bindings.up.includes('ArrowUp') && !input.bindings.down.includes('ArrowUp'), "an essential action's only key can't be taken");

  await bind('info', 0, 'Delete');
  h.expect(!input.bindings.info.includes('KeyF'), 'Delete clears a slot');

  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
  h.expect(input.pressed('cancel') && input.pressed('menu'), 'Esc always cancels and opens the menu');
  await tick();
  window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Escape' }));
  h.expect(!document.querySelector('.controls-screen'), 'Esc leaves the Controls screen');

  const again = new ControlsScreen(game.menus);
  again.open();
  await tick();
  again.row = ACTIONS.length; // Reset to defaults
  again.build();
  await key(input.bindings.confirm[0]);
  h.expect(JSON.stringify(input.bindings) === JSON.stringify(DEFAULT_BINDINGS), 'Reset restores the default keys');
  again.close();
}
