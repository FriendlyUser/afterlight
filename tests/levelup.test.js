// The level-up screen: after a victory, everyone who gained a level gets a card with
// their old → new level and every stat's gain; nobody else does; a battle without a
// level-up shows no such screen.
// Run: SIM=240 tools/test.sh levelup 300000
import { FieldScene } from '../src/world/FieldScene.js';
import { contentReady } from '../src/data/content/index.js';
import { expToNext } from '../src/state/Character.js';

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  for (const id of ['wren', 'ilse', 'bram', 'sable']) { const c = st.joinParty(id); c.setLevel(8); c.exp = expToNext(8) - 1; }
  st.characters.wren.exp = 0; // Wren won't level
  const seen = [];
  new MutationObserver(() => { const v = document.querySelector('.levelup'); if (v && !seen.includes(v.innerHTML)) seen.push(v.innerHTML); })
    .observe(document.body, { childList: true, subtree: true });
  await game.start(new FieldScene(game), { mapId: 'c2_gale_road', x: 20, y: 16, dir: 'right', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.idle();
  const before = st.characters.ilse.stats();
  let r;
  await game.scene.runScript(async (s) => { r = await s.battle('gw_wolves'); });
  await h.idle();
  h.expect(r === 'win', 'won the fight');
  h.expect(seen.length === 1, 'one level-up screen');
  const text = seen[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  h.log(text.slice(0, 300));
  h.expect(['Ilse', 'Bram', 'Sable'].every((n) => text.includes(n)) && !text.includes('Wren'), 'a card for Ilse, Bram and Sable; none for Wren');
  h.expect((text.match(/Lv 8 → 9/g) || []).length === 3, 'each shows Lv 8 → 9');
  const after = st.characters.ilse.stats();
  h.expect(text.includes(`HP ${before.hp} → ${after.hp} +${after.hp - before.hp}`), `Ilse's HP gain (${before.hp} → ${after.hp})`);

  // No level, no screen.
  for (const c of st.allMembers()) c.exp = 0;
  seen.length = 0;
  await game.scene.runScript(async (s) => { r = await s.battle('gw_wolves'); });
  await h.idle();
  h.expect(r === 'win' && seen.length === 0, 'no level-up screen when nobody levels');
}
