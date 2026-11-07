// Screenshot helper for the ch7/ch8 maps (not a story test). Usage:
// tools/shot.sh "index.html?test=c78_view&vmap=kiteholm&vx=10&vy=20&vflags=c8_arrived&vparty=ilse&dtmax=0.5" out.png 12000
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  const p = new URLSearchParams(location.search);
  if (!p.get('vmap')) { h.log('viewer only: pass vmap=<id> to take a screenshot'); return; }
  const st = game.state;
  st.joinParty('wren');
  for (const id of (p.get('vparty') || '').split(',').filter(Boolean)) st.joinParty(id);
  for (const c of st.allMembers()) c.setLevel(40);
  st.characters.wren.lookId = 'wren_ruin';
  for (const f of (p.get('vflags') || '').split(',').filter(Boolean)) st.flags[f] = true;
  game.autoConfirm = !p.has('vhold');
  game.start(new FieldScene(game), { mapId: p.get('vmap'), x: +p.get('vx'), y: +p.get('vy'), dir: p.get('vdir') || 'down' });
  game.fadeIn(0.2);
  await h.wait(+(p.get('vwait') || 600));
}
