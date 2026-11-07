// Frame grabber (not a story test): enter a map, optionally start a battle, wait,
// then draw one frame and put it in the DOM for tools/frame.sh to save. Headless
// screenshots can't see the WebGL canvas mid-battle; reading it right after a
// render can. URL params: map, x, y, dir, party=a,b, lv, flags=a,b, battle, bg, wait.
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  const p = new URLSearchParams(location.search);
  if (!p.get('map')) { h.log('frame: pass map=<id>'); return; }
  game.autoBattle = false;
  game.autoConfirm = false;
  const st = game.state;
  for (const id of ['wren', ...(p.get('party') || '').split(',').filter(Boolean)]) st.joinParty(id);
  if (p.get('lv')) for (const c of st.allMembers()) c.setLevel(+p.get('lv'));
  for (const fl of (p.get('flags') || '').split(',').filter(Boolean)) st.flags[fl] = true;
  const field = new FieldScene(game);
  await game.start(field, { mapId: p.get('map'), x: +(p.get('x') || 10), y: +(p.get('y') || 10), dir: p.get('dir') || 'down', skipEnterScript: !p.has('script') });
  game.fadeIn(0.1);
  if (p.get('battle')) field.runScript((s) => s.battle(p.get('battle'), { bg: p.get('bg') || undefined }));
  await h.wait(+(p.get('wait') || 4));
  game.scene.render(game.time);
  const c = document.createElement('canvas');
  c.width = game.canvas.width;
  c.height = game.canvas.height;
  c.getContext('2d').drawImage(game.canvas, 0, 0);
  const pre = document.createElement('pre');
  pre.id = 'frame';
  pre.textContent = c.toDataURL('image/jpeg', 0.9);
  document.body.appendChild(pre);
  h.log(`frame ${game.scene.constructor.name}`);
}
