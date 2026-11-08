// Side-quest dead ends, fixed: Merry's hide-and-seek finishes even when the Hollow
// Mother falls first (found again: goodbye where she hid; a save already found three
// times: goodbye at her grave; never met: she isn't there), and Warden Hale pays the
// Act II bounties after the Unmoored is dead.
// Run: SIM=240 tools/test.sh story_fixes 300000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';

export async function run(game, h) {
  await contentReady;
  const st = game.state;
  for (const id of ['wren', 'ilse', 'bram', 'sable']) st.joinParty(id).setLevel(12);
  const field = () => /** @type {FieldScene} */ (game.scene);
  const merryQuest = (desc) => { st.vars.quests = { ...(st.vars.quests || {}), c2_merry: { id: 'c2_merry', title: 'Hide and Seek', desc, status: 'active' } }; };
  const reset = () => {
    for (const f of ['c2_merry_met', 'c2_merry_found', 'c2_merry_done']) delete st.flags[f];
    delete st.vars.c2_merry;
    st.inventory.remove('c2_merry_acorn', 9);
    st.inventory.remove('regen_bangle', 9);
  };

  // 1. Met once, the Mother falls, Merry found again: goodbye where she hid.
  Object.assign(st.flags, { kindled: true, c2_wold_enter: true, c2_mother_done: true, c2_merry_met: true });
  st.vars.c2_merry = 1;
  merryQuest('A little girl named Merry is hiding somewhere in the Whisperwold. She wants to be found.');
  await game.start(new FieldScene(game), { mapId: 'c2_wold_outer', x: 12, y: 9, dir: 'up', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.idle();
  h.expect(field().actors.has('merry'), 'Merry still hides after the Mother falls');
  await h.talk('merry');
  h.expect(st.flags.c2_merry_done && st.vars.quests.c2_merry.status === 'done', 'found again: she says goodbye, quest done');
  h.expect(st.inventory.count('c2_merry_acorn') === 1 && st.inventory.count('regen_bangle') === 1, 'with the acorn and her bracelet');
  h.expect(!field().actors.has('merry'), 'and she is gone');

  // 2. Never met before the Mother fell: no Merry.
  reset();
  delete st.vars.quests.c2_merry;
  await h.goto('c2_wold_outer', 12, 9, 'up');
  h.expect(!field().actors.has('merry'), 'never met: she went up with the other voices');

  // 3. A save already stuck (found three times after the Mother fell): goodbye at her grave.
  reset();
  Object.assign(st.flags, { c2_merry_met: true, c2_merry_found: true });
  st.vars.c2_merry = 3;
  st.inventory.add('c2_merry_acorn', 1);
  merryQuest('Merry gave you her acorn: the key to her "secret place", past the thorns south-east of the Ring of Stones.');
  st.flags['blocker:c2_wold_outer:thorns'] = true;
  await h.goto('c2_wold_outer', 48, 31, 'up');
  const f = field();
  f.player.face('up');
  f.interact();
  await h.idle();
  h.expect(st.flags.c2_merry_done && st.vars.quests.c2_merry.status === 'done' && st.inventory.count('regen_bangle') === 1, 'at her grave she comes to say goodbye');

  // 4. Hale pays a bounty brought back after the Unmoored is dead.
  Object.assign(st.flags, { sundered: true, c6_keelhaven: true, c6_hale: true, c6_brinefang: true, c6_glassback: true });
  st.inventory.add('c6_glass_core', 1);
  st.vars.quests.c6_bounty_glass = { id: 'c6_bounty_glass', title: 'Bounty: Glassback', desc: 'A golem of living glass…', status: 'active' };
  const gold = st.gold;
  await h.goto('c6_keel_hall', 6, 6, 'up');
  await h.talk('hale');
  h.expect(st.vars.quests.c6_bounty_glass.status === 'done' && st.gold === gold + 1500 && !st.inventory.count('c6_glass_core'), 'Hale pays for Glassback after the Unmoored');
}
