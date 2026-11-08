// The Lost Callings (story/lost.js): four Tier IV Crests, each remembered through an
// optional quest. Data is sound; the people who remember them appear when their
// chapter comes; the Crest screen shows rumours of the unknown ones; each quest runs
// giver → crest-glass → guardian → the Crest, which can then be worn; a lost fight
// heals and leaves the glass waiting.
// Run: SIM=240 tools/test.sh lost_crests 1200000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { CRESTS } from '../src/data/crests.js';
import { SKILLS } from '../src/data/skills.js';
import { PASSIVES } from '../src/data/passives.js';
import { TROOPS } from '../src/data/troops.js';
import { getMap } from '../src/data/maps/index.js';
import { CrestScreen } from '../src/ui/menu/CrestScreen.js';
import { LOST } from '../src/story/lost.js';
import { kitCharacter } from './party_kit.js';
import { bestGear, tierFor } from './balance.test.js';

// crest → [giver map, giver id, chapter, shrine map, shrine x, y, party level (a few over
// the guardian's, so a hard optional fight doesn't make the test flaky)]
const QUESTS = {
  tidecaller: ['c6_keelhaven', 'lc_wend', 8, 'c6_shattered_sea', 66, 24, 50],
  bellwright: ['ruined_aurenne', 'lc_hask', 8, 'ch7_drowned_undercroft', 44, 4, 49],
  kitewright: ['kiteholm', 'lc_ada', 9, 'c8_underhang', 17, 39, 54],
  mnemonist: ['side_garden_gate', 'lc_gardener', 9, 'side_garden_maze', 37, 10, 60],
};

export async function run(game, h) {
  await contentReady;
  const st = game.state;

  // 1. Data: four Lost Callings with full rank lists, rumours, Mastery Arts, guardians.
  const lost = Object.keys(CRESTS).filter((id) => CRESTS[id].tier === 4);
  h.expect(lost.sort().join() === Object.keys(QUESTS).sort().join(), `four Lost Callings (${lost.join(', ')})`);
  for (const id of lost) {
    const c = CRESTS[id];
    if (c.unlock !== 'lost' || !c.rumour || !c.costume || !c.legacy || c.mastery?.length !== 2 || !LOST[id]) throw new Error(`${id}: incomplete`);
    if (c.ranks.length !== 10 || c.ranks.some((u) => (u.skill && !SKILLS[u.skill]?.desc) || (u.passive && !PASSIVES[u.passive]))) throw new Error(`${id}: bad ranks`);
    if (!TROOPS[`lc_${id}`]) throw new Error(`${id}: no guardian troop`);
  }
  h.expect(true, 'each has ranks, a rumour, costume, Legacy, Mastery Arts and a guardian');

  // 2. The people who remember them appear with their chapter.
  for (const [id, [map, npc, chapter]] of Object.entries(QUESTS)) {
    const def = getMap(map).npcs.find((n) => n.id === npc);
    st.chapter = chapter - 1;
    const before = def.cond(st);
    st.chapter = chapter;
    h.expect(!before && def.cond(st), `${LOST[id].giver} appears from chapter ${chapter}`);
  }

  // 3. The Crest screen rumours the unknown ones.
  for (const id of ['wren', 'ilse', 'bram', 'sable']) st.joinParty(id);
  Object.assign(st.flags, { crestArtLearned: true, sundered: true, c6_keelhaven: true, c7_arrived: true, c8_arrived: true });
  st.chapter = 9;
  const cs = new CrestScreen(game.menus, 0);
  const rows = cs.list.items.filter((e) => e.c.tier === 4);
  h.expect(rows.length === 4 && rows.every((r) => cs.list.renderItem(r).includes('??? (Lost Crest)')), 'four "??? (Lost Crest)" rows on the Crest screen');
  cs.list.index = cs.list.items.indexOf(rows[0]);
  cs.renderDetail();
  h.expect(cs.detail.innerHTML.includes('Rumour') && cs.detail.innerHTML.includes(rows[0].c.rumour), 'with a rumour of where to look');

  // 4. Each quest: talk, go to the glass, beat the guardian, wear the Crest.
  let first = true;
  for (const [id, [map, npc, , shrineMap, sx, sy, lv]] of Object.entries(QUESTS)) {
    for (const cid of ['wren', 'ilse', 'bram', 'sable']) {
      const ch = st.characters[cid];
      ch.setLevel(lv);
      kitCharacter(ch, lv);
      bestGear(ch, tierFor(lv));
      ch.fullHeal();
    }
    if (first) await game.start(new FieldScene(game), { mapId: map, x: 3, y: 3, dir: 'down', skipEnterScript: true });
    else await game.scene.goto(map, 3, 3, 'down', { skipEnterScript: true });
    game.fadeIn(0.1);
    await h.wait(0.6);
    await h.idle();
    await h.talk(npc);
    h.expect(st.vars.quests?.[`lost_${id}`]?.status === 'active', `${LOST[id].giver} sets the quest`);
    await game.scene.goto(shrineMap, 3, 3, 'down', { skipEnterScript: true });
    await h.wait(0.6);
    await h.idle();
    const f = game.scene;
    const side = [[-1, 0, 'right'], [1, 0, 'left'], [0, 1, 'up'], [0, -1, 'down']].find(([dx, dy]) => f.grid.walkable(sx + dx, sy + dy));
    if (!side) throw new Error(`${id}: no tile beside the crest-glass at ${sx},${sy}`);
    // The first trial is lost (the battle reports a loss, so it can't be won by luck):
    // healed, nothing learned, the glass waits.
    const realBattle = f.startBattle;
    if (first) {
      for (const cid of ['wren', 'ilse', 'bram', 'sable']) st.characters[cid].hp = 1;
      f.startBattle = async () => 'lose';
    }
    f.player.placeAt(sx + side[0], sy + side[1], f.grid);
    f.player.face(side[2]);
    f.interact();
    await h.idle();
    if (first) {
      f.startBattle = realBattle;
      h.expect(!st.flags[`lost_${id}`] && st.activeMembers().every((c) => c.hp === c.stats().hp), 'a lost trial heals the party and leaves the glass waiting');
      for (const cid of ['wren', 'ilse', 'bram', 'sable']) st.characters[cid].fullHeal();
      f.interact();
      await h.idle();
      first = false;
    }
    h.expect(st.flags[`lost_${id}`] && st.vars.quests[`lost_${id}`].status === 'done', `${CRESTS[id].name}: the guardian falls, the quest is done`);
    h.expect(st.crestsAvailableTo(st.characters.ilse).includes(id), `${CRESTS[id].name} is now available to the party`);
    const ilse = st.characters.ilse;
    const was = ilse.crest;
    ilse.setCrest(id);
    const firstArt = CRESTS[id].ranks[0].skill;
    h.expect(ilse.crest === id && ilse.rankOf(id) === 1 && ilse.skillLists()[0].skills.includes(firstArt), `Ilse takes up the ${CRESTS[id].name} at rank 1, with ${SKILLS[firstArt].name}`);
    ilse.gainCp(id, 40);
    h.expect(ilse.rankOf(id) === 3, 'and ranks it up with CP like any Crest');
    ilse.setCrest(was);
  }
}
