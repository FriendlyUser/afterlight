// On-screen touch controls (phones, the Android app): they appear with the first touch,
// the D-pad walks and steers menus, the buttons press the same actions the keys do, a
// tap advances dialogue, the tray toggles Run and Fast Mode, and a key hides them again.
// Run: SIM=240 tools/test.sh touch 200000
import { keyCap } from '../src/core/Input.js';
import { layoutWidth } from '../src/platform/Device.js';

export async function run(game, h) {
  const input = game.input;
  const real = (ms) => new Promise((res) => setTimeout(res, ms));
  const until = async (cond, ms = 12000) => { for (let t = 0; t < ms && !cond(); t += 50) await real(50); return cond(); };
  const root = document.querySelector('.touch-controls');
  const at = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.width / 2 }; };
  const fire = (el, type, x, y, id = 7) => el.dispatchEvent(new PointerEvent(type, { pointerId: id, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, cancelable: true }));
  const press = async (el, ms = 120, id = 7) => { const c = at(el); fire(el, 'pointerdown', c.x, c.y, id); await real(ms); fire(el, 'pointerup', c.x, c.y, id); await real(80); };
  const btn = (action) => root.querySelector(`[data-action="${action}"]`);

  // A phone 20:9 gets a 1600 x 720 layout; anything squarer keeps the UI clear of the thumbs.
  h.expect(layoutWidth(2400 / 1080) === 1600 && layoutWidth(16 / 9) === 1500 && layoutWidth(4 / 3) === 1500 && layoutWidth(21 / 9) === 1680,
    'layout widths: 20:9 → 1600, 16:9 and 4:3 → 1500, 21:9 → 1680');

  await h.newGame();
  game.autoConfirm = false;
  h.expect(!!root && !root.classList.contains('on') && keyCap('confirm').includes('>Z<'), 'on a desktop the controls stay hidden and hints name keys');

  // ---------------------------------------------------------------- first touch
  fire(document.getElementById('view'), 'pointerdown', 640, 300);
  await real(120);
  h.expect(root.classList.contains('on') && keyCap('confirm').includes('>A<') && keyCap('menu').includes('☰'), 'the first touch shows the controls and hints name the buttons');

  // ---------------------------------------------------------------- D-pad in the field
  const field = game.scene;
  const pad = root.querySelector('.tc-pad');
  const c = at(pad);
  const x0 = field.player.x, z0 = field.player.z;
  fire(pad, 'pointerdown', c.x + c.r * 0.7, c.y);
  await real(60);
  h.expect(input.down('right') && !input.down('up') && !input.down('down') && pad.classList.contains('go-right'), 'pushing the pad right holds Right');
  fire(pad, 'pointermove', c.x + c.r * 0.6, c.y - c.r * 0.6);
  await real(60);
  h.expect(input.down('right') && input.down('up'), 'walking takes diagonals');
  fire(pad, 'pointermove', c.x, c.y + c.r * 0.7);
  await real(60);
  h.expect(input.down('down') && !input.down('right') && !input.down('up'), 'sliding the thumb changes direction without lifting');
  await real(500);
  fire(pad, 'pointerup', c.x, c.y + c.r * 0.7);
  await real(60);
  h.expect(!['up', 'down', 'left', 'right'].some((d) => input.down(d)), 'lifting the thumb lets go');
  h.expect(Math.hypot(field.player.x - x0, field.player.z - z0) > 0.15, `the player walked (${Math.hypot(field.player.x - x0, field.player.z - z0).toFixed(2)} tiles)`);
  fire(pad, 'pointerdown', c.x + c.r * 0.05, c.y - c.r * 0.05);
  await real(60);
  h.expect(!['up', 'down', 'left', 'right'].some((d) => input.down(d)), 'the middle of the pad is a dead zone');
  fire(pad, 'pointerup', c.x, c.y);

  // ---------------------------------------------------------------- A, and a tap, advance dialogue
  let done = false;
  field.runScript((s) => s.say('Ilse', ['One.', 'Two.', 'Three.'])).then(() => { done = true; });
  await until(() => game.ui.top()?.isDialogue);
  const text = () => document.querySelector('.dlg-text')?.textContent || '';
  for (let i = 0; i < 4 && !text().startsWith('Two'); i++) await press(btn('confirm'));
  h.expect(text().startsWith('Two'), `A advances the dialogue (${text()})`);
  // In a menu or a dialogue the pad gives one direction at a time.
  fire(pad, 'pointerdown', c.x + c.r * 0.6, c.y - c.r * 0.5);
  await real(60);
  h.expect(input.down('right') && !input.down('up'), 'with a box open, a diagonal thumb is one direction');
  fire(pad, 'pointerup', c.x, c.y);
  await real(60);
  if (document.querySelector('.backlog, .bl-panel')) await press(btn('cancel'));
  for (let i = 0; i < 4 && !text().startsWith('Three'); i++) { fire(document.getElementById('view'), 'pointerdown', 700, 200); await real(200); }
  h.expect(text().startsWith('Three'), `a tap on the screen advances it too (${text()})`);
  for (let i = 0; i < 4 && !done; i++) await press(btn('confirm'));
  h.expect(await until(() => done, 3000), 'and the scene ends');

  // ---------------------------------------------------------------- B and the menu button
  await press(btn('menu'));
  h.expect(await until(() => !!game.ui.top(), 3000), 'the menu button opens the menu');
  for (let i = 0; i < 4 && game.ui.top(); i++) await press(btn('cancel'));
  h.expect(!game.ui.top(), 'B closes it');

  // ---------------------------------------------------------------- the tray
  const s = game.state.settings;
  const tray = root.querySelector('.tc-tray');
  const pills = [...tray.children];
  const tap = async (el) => { const p = at(el); fire(el, 'pointerdown', p.x, p.y); await real(120); };
  h.expect(!tray.classList.contains('open'), 'the tray starts closed');
  await tap(root.querySelector('.tc-more'));
  h.expect(tray.classList.contains('open'), '⋯ opens the tray');
  const run0 = !!s.autoRun;
  await tap(pills[3]);
  h.expect(!!s.autoRun === !run0 && !tray.classList.contains('open'), 'Run is a switch on touch (Settings → Auto-run), and the tray closes');
  await tap(root.querySelector('.tc-more'));
  const fast0 = !!s.fastMode;
  await tap(pills[0]);
  h.expect(!!s.fastMode === !fast0 && pills[0].classList.contains('lit') === !fast0, 'Fast toggles Fast Mode and lights up');
  await tap(pills[0]);
  h.expect(!!s.fastMode === fast0, '…and back');
  s.autoRun = run0;

  // ---------------------------------------------------------------- hold ☰ to skip a scene
  done = false;
  field.runScript((sc) => sc.say('Ilse', ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'])).then(() => { done = true; });
  await until(() => game.ui.top()?.isDialogue);
  await real(300);
  const m = at(btn('menu'));
  fire(btn('menu'), 'pointerdown', m.x, m.y);
  await real(1250);
  fire(btn('menu'), 'pointerup', m.x, m.y);
  h.expect(await until(() => done && !game.skipping, 6000), 'holding ☰ for a second skips the scene');

  // ---------------------------------------------------------------- a key puts them away
  window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft', bubbles: true }));
  window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft', bubbles: true }));
  await real(150);
  h.expect(!root.classList.contains('on') && keyCap('confirm').includes('>Z<'), 'pressing a key hides the controls and hints name keys again');
  game.autoConfirm = true;
}
