// Save screen Export / Import (F on a slot). The browser's file picker can't be
// driven headlessly, so this covers the menu, the exported file, and the refusal
// path when no keyboard/mouse action allows opening a picker (it must not hang).
// Run: SIM=240 tools/test.sh save_files 120000
import { FieldScene } from '../src/world/FieldScene.js';
import { SaveStore } from '../src/state/GameState.js';

export async function run(game, h) {
  game.autoConfirm = false;
  const st = game.state;
  st.joinParty('wren');
  st.flags.p_woke = true;
  await game.start(new FieldScene(game), { mapId: 'port_gale', x: 10, y: 19, dir: 'down', skipEnterScript: true }); // no arrival scene: its dialogue would take the input
  await h.wait(1);
  SaveStore.write(0, st);

  const press = async (action) => { game.input.edges.add(action); await h.wait(0.3); };
  const shown = (text) => document.getElementById('ui').textContent.includes(text);

  game.menus.openLoad();
  await h.wait(0.5);
  await press('info');
  h.expect(shown('Export to file') && shown('Import from file'), 'F opens Export / Import for the slot');

  // Export: capture the file handed to the download link.
  let exported = null;
  const createObjectURL = URL.createObjectURL;
  URL.createObjectURL = (blob) => { blob.text().then((t) => { exported = t; }); return createObjectURL.call(URL, blob); };
  await press('confirm');
  await h.wait(0.5);
  URL.createObjectURL = createObjectURL;
  h.expect(exported && JSON.parse(exported).format === 'afterlight-save' && JSON.parse(exported).data.party[0] === 'wren', 'export downloads a save file');
  h.expect(shown('Exported slot 1'), 'export confirms with a toast');

  // Import without a user gesture: refused with a hint, and the screen stays usable.
  await press('info');
  await press('down');
  await press('confirm');
  await h.wait(0.3);
  h.expect(shown('Use the keyboard or mouse'), 'import without a gesture is refused gracefully');
  await press('info');
  h.expect(shown('Export to file'), 'the save screen still responds afterwards');
  SaveStore.remove(0);
}
