// The Compendium and the Hunter's Ledger (data/monsterInfo.js, data/hunt.js, story/hunt.js,
// ui/menu/CompendiumScreen.js): the menu hides the book until Greer gives it on
// Aurenne's canal bridge; battles record what the party learns; the book shows "???"
// gaps, sections and studied tactics; a mark stands in the field, fights and falls;
// Greer pays for marks, titles and kinds; after the Sundering she is in Keelhaven with
// five more marks and the survivors of the old ones; ten marks finish the Ledger.
// Run: SIM=240 tools/test.sh hunt 900000
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { BattleSystem } from '../src/battle/BattleSystem.js';
import { GameState } from '../src/state/GameState.js';
import { RNG } from '../src/core/util.js';
import { MainMenu } from '../src/ui/menu/MainMenu.js';
import { CompendiumScreen } from '../src/ui/menu/CompendiumScreen.js';
import { ENEMIES } from '../src/data/enemies.js';
import { getMap } from '../src/data/maps/index.js';
import { bookOrder, completion, knowledge, sectionOf, tacticsOf, kindsDefeated } from '../src/data/monsterInfo.js';
import { MARKS, MARK_IDS, markAt } from '../src/data/hunt.js';
import { sideQuestTargets } from '../src/data/objectives/side.js';
import { kitCharacter } from './party_kit.js';
import { bestGear, tierFor } from './balance.test.js';

export async function run(game, h) {
  await contentReady;
  const st = game.state;

  // 1. Data: every creature is in the book once, numbered, in a section; marks are sound.
  const book = bookOrder();
  h.expect(book.length === Object.keys(ENEMIES).length && new Set(book.map((e) => e.no)).size === book.length, `${book.length} creatures, each numbered once`);
  h.expect(sectionOf(ENEMIES.brine_jelly) === 1 && sectionOf(ENEMIES.c4b_bog_leech) === 4 && sectionOf(ENEMIES.hm_widow) === 'marks' && sectionOf(ENEMIES.pg_first_dark) === 'postgame', 'sections by chapter, marks and the Abyss');
  for (const [id, m] of Object.entries(MARKS)) {
    for (const where of ['home', 'after']) {
      const s = m[where];
      if (!s) continue;
      const map = getMap(s.map);
      if (!map.npcs.some((n) => n.id === `mark_${id}`)) throw new Error(`${id}: not on ${s.map}`);
    }
    if (!ENEMIES[m.enemy]?.mark) throw new Error(`${id}: no mark enemy`);
  }
  h.expect(MARK_IDS.length === 10, 'ten marks, each on its map (and the Act I ones again after the Sundering)');
  h.expect(tacticsOf(ENEMIES.glowcap).some((t) => /Heals/.test(t)) && tacticsOf(ENEMIES.c2_wold_alpha).some((t) => /pack/.test(t)) && tacticsOf(ENEMIES.c2_cutpurse).some((t) => /Steals/.test(t)), 'tactics read off the kit: healer, pack, thief');

  // 2. Battles write in the book: weakness struck, resistance met, immunity, moves.
  {
    const gs = new GameState();
    for (const id of ['wren', 'ilse']) gs.joinParty(id).setLevel(20);
    const rng = new RNG(3);
    const sys = new BattleSystem({ state: gs, troopId: 'uc_bones', rnd: () => rng.next() });
    sys.start();
    const bone = sys.enemies[0];
    sys.act(sys.party[0], { kind: 'skill', id: 'e_dark', targets: [bone] }); // dark: immune (0)
    sys.resolver.tryStatus(sys.party[1], bone, 'poison', 1, []);
    sys.act(bone, { kind: 'skill', id: 'e_slash', targets: [sys.party[0]] });
    sys.noteWeakness(bone, 'blunt');
    const r = gs.bestiary.bone_soldier;
    h.expect(r.seen === 2 && r.res.includes('dark') && r.imm.includes('poison') && r.moves.includes('e_slash') && r.weak.includes('blunt'), `a Bone Soldier's record: ${JSON.stringify(r)}`);
  }

  // 3. The book is hidden until Greer gives it on the bridge.
  for (const id of ['wren', 'ilse', 'bram', 'sable']) {
    const ch = st.joinParty(id);
    ch.setLevel(45); kitCharacter(ch, 45); bestGear(ch, tierFor(45)); ch.fullHeal();
  }
  Object.assign(st.flags, { kindled: true, crestArtLearned: true, c3_arrived: true, c3_pip_joined: true });
  st.chapter = 3;
  st.bestiary = { brine_jelly: { seen: 5, defeated: 5, weak: ['fire'] }, sand_crab: { seen: 2, defeated: 1, weak: [] }, wold_wolf: { seen: 1, defeated: 0, weak: [] } };
  await game.start(new FieldScene(game), { mapId: 'aurenne', x: 20, y: 36, dir: 'down', skipEnterScript: true });
  game.fadeIn(0.1);
  await h.wait(0.6);
  await h.idle();
  const menuHas = () => new MainMenu(game.menus, game.scene).cmdList.items.some((c) => c.id === 'bestiary');
  h.expect(!menuHas(), 'no Compendium in the menu yet');
  await h.stepOn(20, 39);
  h.expect(st.flags.compendium && st.flags.hunt_met && st.inventory.count('hm_compendium') === 1 && st.vars.quests.hunt?.status === 'active', 'Greer gives the Compendium and the Ledger on the bridge');
  h.expect(menuHas() && game.scene.actors.has('greer'), 'the Compendium is in the menu, and Greer stays by the bridge');
  const greerT = sideQuestTargets('hunt').filter((t) => !t.when || t.when(st));
  h.expect(greerT.length === 5 && greerT.every((t) => t.x !== undefined), `five Act I marks marked blue (${greerT.map((t) => t.map).join(', ')})`);

  // 4. The screen: sections met so far, "???" gaps, studied tactics only after enough kills.
  const cs = new CompendiumScreen(game.menus);
  h.expect(cs.sections.length === 2 && cs.sections[0].id === 1, `sections with anything met: ${cs.sections.map((s) => s.name).join(', ')}`);
  const ch1 = cs.sections[0];
  h.expect(ch1.entries.some((e) => cs.row(e).includes('???')) && cs.row(ch1.entries.find((e) => e.id === 'brine_jelly')).includes('Brine Jelly'), 'unmet creatures are "???", met ones are named');
  cs.list.index = cs.list.items.findIndex((e) => e.id === 'brine_jelly');
  cs.renderDetail();
  h.expect(cs.detail.innerHTML.includes('Tactics') && cs.detail.innerHTML.includes('cp-tactics') && !cs.detail.innerHTML.includes('Fell 3'), 'five Brine Jellies felled: its tactics are written in');
  cs.list.index = cs.list.items.findIndex((e) => e.id === 'sand_crab');
  cs.renderDetail();
  h.expect(cs.detail.innerHTML.includes('Fell 3 of them'), 'one Sand Crab felled: not yet');
  h.expect(knowledge(st, ENEMIES.wold_wolf) === 1 && completion(st).all.defeated === 2, 'a Wold Wolf seen but not felled');
  const tab = cs.tab;
  cs.handleInput({ pressed: (k) => k === 'pageRight', consume() {}, repeat: () => false });
  h.expect(cs.tab !== tab && cs.sections[cs.tab].id === 2, 'Q/E turns to the next section');

  // 5. A mark in the field: Old Gnarlhide, hunted.
  await game.scene.goto('c2_td_fields', 3, 16, 'right', { skipEnterScript: true });
  await h.wait(0.6);
  await h.idle();
  const f = game.scene;
  const g = f.actors.get('mark_gnarlhide');
  h.expect(g && g.look.kind === 'monster', 'Old Gnarlhide stands in the East Fields as a beast, not a person');
  await h.talk('mark_gnarlhide');
  h.expect(st.flags.hm_gnarlhide && !f.actors.has('mark_gnarlhide') && st.bestiary.hm_gnarlhide?.defeated === 1, 'hunted: the mark falls and goes in the book');

  // 6. Greer pays; three marks make a Tracker; kinds felled pay too.
  await game.scene.goto('aurenne', 17, 39, 'up', { skipEnterScript: true });
  await h.wait(0.6);
  await h.idle();
  let gold = st.gold;
  await h.talk('greer');
  h.expect(st.flags.hm_gnarlhide_paid && st.gold === gold + MARKS.gnarlhide.reward.gold, `Greer pays ${MARKS.gnarlhide.reward.gold} gold for Old Gnarlhide`);
  Object.assign(st.flags, { hm_widow: true, hm_knot: true });
  for (const id of Object.keys(ENEMIES).slice(0, 30)) st.bestiary[id] = { seen: 1, defeated: 1, weak: [] };
  await h.talk('greer');
  h.expect(st.flags.hm_rank_1 && st.inventory.count('hm_hunters_charm') === 1, 'three marks: a Tracker, with a Hunter\'s Charm');
  h.expect(kindsDefeated(st) >= 25 && st.flags.hm_kinds_25, 'twenty-five kinds felled: paid for the ink');

  // 7. The Sundering: Greer in Keelhaven, five more marks, the old ones moved.
  st.flags.sundered = true;
  st.chapter = 6;
  h.expect(markAt(st, 'glasseye') === null && markAt(st, 'cinderjaw') === null, 'until the party finds Greer again, nothing is posted');
  await game.scene.goto('c6_keelhaven', 21, 16, 'up', { skipEnterScript: true });
  await h.wait(0.6);
  await h.idle();
  await h.talk('greer');
  h.expect(st.flags.hunt_keelhaven && st.vars.quests.hunt.desc.startsWith('Greer Thackery survived'), 'Greer survived, and the Ledger reopens in Keelhaven');
  h.expect(markAt(st, 'glasseye') === 'after' && markAt(st, 'cinderjaw') === 'home' && markAt(st, 'gnarlhide') === null, 'Glasseye came through the Sundering; Cinderjaw is posted; Gnarlhide stays felled');
  h.expect(getMap('c11_saltglass').npcs.find((n) => n.id === 'mark_glasseye').cond(st) && !getMap('c4a_dunes').npcs.find((n) => n.id === 'mark_glasseye').cond(st), 'Glasseye now stands in the Saltglass, not the Sunscar');

  // 8. All ten: the Ledger is done, with Greer's horn.
  for (const id of MARK_IDS) st.flags[`hm_${id}`] = true;
  await h.talk('greer');
  h.expect(st.flags.hm_rank_3 && st.inventory.count('hm_huntmasters_horn') === 1 && st.vars.quests.hunt.status === 'done', 'ten marks: Huntmasters, the horn, and the Ledger complete');
  h.expect(sideQuestTargets('hunt').filter((t) => !t.when || t.when(st)).length === 0, 'and no blue markers left');
}
