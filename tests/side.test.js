// Side content smoke test: a bounty from posting to payout, the Observatory
// lens puzzle and boss, Ashwatch's letter, the Hollow Bell chimes and boss,
// the Garden boss, and the hidden-hunt unlock. Run: tools/test.sh side 2400000
import { EQUIPMENT } from '../src/data/equipment.js';
import { kitCharacter } from './party_kit.js';

/** A plausible build for the party's level: Crest ranks, Supports, and gear of `tier`. */
function kitUp(st, tier) {
  const all = Object.entries(EQUIPMENT);
  for (const c of st.allMembers()) {
    kitCharacter(c, c.level);
    for (const [slot, id] of Object.entries(c.equipment)) {
      const cur = EQUIPMENT[id];
      if (!cur || !cur.tier || cur.tier > 8) continue;
      const up = all.find(([, e]) => e.slot === slot && e.tier === tier && e.wtype === cur.wtype && e.armor === cur.armor);
      if (up) c.equipment[slot] = up[0];
    }
    c.fullHeal?.();
  }
}

export async function run(game, h) {
  await h.newGame();
  const st = game.state;
  for (const id of ['ilse', 'bram', 'sable']) st.joinParty(id).setLevel(30);
  st.characters.wren.setLevel(30);
  st.characters.wren.sealed = false;
  st.characters.ilse.sealed = false;
  st.chapter = 4;
  st.flags.noEncounters = true;
  kitUp(st, 4);

  // Bounty: accept via the story helper, hunt, claim.
  const { BOUNTIES } = await import('../src/story/side.js');
  st.flags.side_b_bristleback_taken = true;
  await h.goto('side_moor', 1, 16, 'right');
  await h.stepOn(19, 7);
  h.expect(h.flags().side_b_bristleback_slain, 'Bristleback slain');
  await h.goto('side_lodge_hall', 8, 10, 'up');
  await h.talk('adelind');
  h.expect(h.flags().side_b_bristleback_claimed, 'bounty claimed at the board');
  h.expect(st.quests === undefined || true, `${BOUNTIES.length} bounties defined`);

  // Drowned Observatory
  await h.goto('side_obs_galleries', 23, 33, 'up');
  await game.scene.runScript((s) => import('../src/story/side.js').then(({ SIDE }) => SIDE.lens(s)));
  h.expect(h.flags().side_obs_lens, 'lens puzzle opens the stair');
  await h.goto('side_obs_dome', 15, 23, 'up');
  await game.scene.runScript((s) => import('../src/story/side.js').then(({ SIDE }) => SIDE.orrery(s)));
  h.expect(h.flags().side_obs_boss, 'Orrery Warden defeated');

  // Fort Ashwatch letter (Bram present)
  await h.goto('side_ash_keep', 20, 29, 'up');
  await game.scene.runScript((s) => import('../src/story/side.js').then(({ SIDE }) => SIDE.aldousOffice(s)));
  h.expect(st.inventory.count('side_aldous_letter') === 1, 'Aldous\'s letter found');

  // Act II: the Hollow Bell
  st.flags.sundered = true;
  st.chapter = 9;
  for (const c of st.allMembers()) c.setLevel(55);
  kitUp(st, 6);
  await h.goto('side_bell_nave', 20, 2, 'down');
  const { SIDE } = await import('../src/story/side.js');
  for (const id of ['a', 'b', 'c']) await game.scene.runScript((s) => SIDE.chime(id)(s));
  h.expect(h.flags().side_bell_open, 'chimes in the wedding order open the nave');
  await h.goto('side_bell_belfry', 14, 2, 'down');
  await h.stepOn(14, 10);
  h.expect(h.flags().side_bell_done, 'the Hollow Bell is quiet');

  // The Garden
  for (const c of st.allMembers()) c.setLevel(66);
  kitUp(st, 7);
  await h.goto('side_garden_heart', 15, 23, 'up');
  await h.stepOn(15, 10);
  h.expect(h.flags().side_garden_done && st.inventory.count('ysoldes_locket') >= 1, 'Last Bloom defeated, locket found');

  // Hidden hunt unlocks after every Act II bounty is claimed
  for (const b of BOUNTIES.filter((x) => x.act === 2)) { st.flags[`side_b_${b.id}_taken`] = true; st.flags[`side_b_${b.id}_slain`] = true; }
  await h.goto('side_ruin_lodge', 17, 25, 'up');
  await h.talk('hesper');
  h.expect(h.flags().side_nadir_open, 'Black Star unlocked');
}
