// Crest Mastery and Ascension: CP past rank 10 fills five stars (and stops at the fifth);
// mastering leaves a Legacy that holds whatever Crest is worn; stars raise the primary
// Crest's stats and its Arts' power wherever they are used; fully Ascended Crests add
// Support Points (up to three); battle rewards report stars and Legacies; overflow CP
// survives a save; the Crest and Status screens show stars and Legacies.
// Run: SIM=240 tools/test.sh crest_ascension 120000
import { GameState } from '../src/state/GameState.js';
import { Character } from '../src/state/Character.js';
import { BattleSystem } from '../src/battle/BattleSystem.js';
import { CRESTS, CREST_ORDER, ASCEND_CP, CP_CAP, MAX_RANK, MAX_STARS, STAR_STATS, STAR_ARTS } from '../src/data/crests.js';
import { RNG } from '../src/core/util.js';
import { contentReady } from '../src/data/content/index.js';
import { CrestScreen } from '../src/ui/menu/CrestScreen.js';
import { StatusScreen } from '../src/ui/menu/screens.js';
import { ArtsScreen } from '../src/ui/menu/ArtsScreen.js';

const MASTERED = 800;

/** One hit of `skill` from Wren on the first foe, with a fixed RNG. */
function hit(setupWren, skill) {
  const st = new GameState();
  const wren = st.joinParty('wren');
  wren.setLevel(30);
  setupWren(wren);
  wren.fullHeal();
  const rng = new RNG(7);
  const sys = new BattleSystem({ state: st, troopId: 'gw_wolves', rnd: () => rng.next() });
  sys.start();
  const user = sys.party[0];
  user.mp = 999;
  const ev = sys.act(user, { kind: 'skill', id: skill, targets: [sys.enemies[0]] });
  return ev.filter((e) => e.t === 'damage').reduce((s, e) => s + e.amount, 0);
}

export async function run(game, h) {
  await contentReady;

  // 1. Data: every Crest has a Legacy with a description and an effect.
  for (const id of CREST_ORDER) {
    const l = CRESTS[id].legacy;
    if (!l || !l.desc || !(l.mods || l.resist)) throw new Error(`${id}: no Legacy`);
  }
  h.expect(ASCEND_CP[0] > MASTERED && ASCEND_CP.every((v, i) => !i || v > ASCEND_CP[i - 1]), 'Ascension thresholds climb past mastery');

  // 2. CP past rank 10 fills stars; milestones report rank 10's Legacy, then each star.
  const ch = new Character('wren');
  let got = ch.gainCp('vanguard', 790);
  h.expect(ch.rankOf('vanguard') === 9 && ch.starsOf('vanguard') === 0, 'rank 9 below mastery');
  const two = ASCEND_CP[1] + 10;
  got = ch.gainCp('vanguard', two - 790);
  h.expect(got.some((m) => m.rank === MAX_RANK && m.legacy === CRESTS.vanguard.legacy), 'rank 10 reports the Legacy');
  h.expect(got.filter((m) => m.star).map((m) => m.star).join() === '1,2', `two stars at ${two} CP (${JSON.stringify(got.map((m) => m.star || m.rank))})`);
  h.expect(ch.ascendProgress('vanguard').need === ASCEND_CP[2] - two, 'progress counts toward the third star');
  got = ch.gainCp('vanguard', 99999);
  h.expect(ch.crests.vanguard === CP_CAP && ch.starsOf('vanguard') === MAX_STARS && got.length === 3, 'CP stops at the fifth star');
  h.expect(ch.gainCp('vanguard', 50).length === 0 && ch.ascendProgress('vanguard').need === 0, 'nothing more past five stars');

  // 3. Legacy holds whatever Crest is worn; stars only count for the primary.
  const a = new Character('wren'), b = new Character('wren');
  for (const c of [a, b]) { c.setLevel(40); c.learnCrest('mender'); }
  b.crests.vanguard = MASTERED;
  b.setCrest('mender');
  a.setCrest('mender');
  h.expect(b.modifiers().mods.strPct === 5 && !a.modifiers().mods.strPct, 'the Vanguard Legacy (STR +5%) holds while wearing Mender');
  const plain = b.stats().str;
  b.crests.vanguard = CP_CAP;
  h.expect(b.stats().str === plain, 'stars on a crest that is not primary leave stats alone');
  b.setCrest('vanguard');
  const s5 = b.stats();
  b.crests.vanguard = MASTERED;
  const s0 = b.stats();
  const ratio = s5.hp / s0.hp, want = 1 + (STAR_STATS * MAX_STARS) / 100;
  h.expect(Math.abs(ratio - want) < 0.01, `five stars as primary: stats +${STAR_STATS * MAX_STARS}% (hp ${s0.hp} → ${s5.hp})`);
  h.expect(b.masteredCount() === 1 && b.legacies().join() === 'vanguard', 'one mastered Crest, one Legacy');

  // 4. Arts of an Ascended Crest hit harder even from the secondary slot.
  const base = hit((w) => { w.crests.vanguard = MASTERED; w.setCrest('mender'); w.learnCrest('vanguard'); w.setSecondary('vanguard'); }, 'cleave');
  const asc = hit((w) => { w.crests.vanguard = CP_CAP; w.setCrest('mender'); w.learnCrest('vanguard'); w.setSecondary('vanguard'); }, 'cleave');
  const r = asc / base, arts = 1 + (STAR_ARTS * MAX_STARS) / 100;
  h.expect(base > 0 && Math.abs(r - arts) < 0.03, `Cleave from a 5★ secondary Vanguard: +${STAR_ARTS * MAX_STARS}% (${base} → ${asc})`);
  h.expect(new Character('wren').artPower().cleave === undefined, 'no Art bonus without stars');

  // 5. Fully Ascended Crests add Support Points, up to three.
  const sp = new Character('wren');
  sp.setLevel(40);
  const budget = sp.supportBudget();
  for (const [i, id] of ['vanguard', 'warden', 'ranger', 'rogue'].entries()) {
    sp.crests[id] = CP_CAP;
    h.expect(sp.supportBudget() === budget + Math.min(3, i + 1), `${i + 1} fully Ascended → +${Math.min(3, i + 1)} Support`);
  }

  // 6. Battle rewards report a star; overflow CP survives a save round trip.
  {
    const st = new GameState();
    const w = st.joinParty('wren');
    w.setLevel(30);
    w.crests.vanguard = ASCEND_CP[0] - 1;
    const rng = new RNG(3);
    const sys = new BattleSystem({ state: st, troopId: 'gw_wolves', rnd: () => rng.next() });
    sys.start();
    for (const e of sys.enemies) e.damage(e.hp);
    const res = sys.applyRewards().results.find((x) => x.ch === w);
    h.expect(res.ranks.some((m) => m.crest === 'vanguard' && m.star === 1), `a won battle reports ★1 (${JSON.stringify(res.ranks)})`);
    const back = Character.deserialize(JSON.parse(JSON.stringify(w.serialize())));
    h.expect(back.crests.vanguard === w.crests.vanguard && back.starsOf('vanguard') === 1, 'overflow CP and stars survive a save');
  }

  // 6b. Mastery Arts: ★1 and ★3 teach the Crest's two signature Arts, usable from either slot.
  {
    const m = new Character('wren');
    m.setLevel(50);
    m.crests.vanguard = MASTERED;
    h.expect(!m.skillLists()[0].skills.includes('banner_of_dawn'), 'no Mastery Art at mastery alone');
    const got = m.gainCp('vanguard', ASCEND_CP[0] - MASTERED);
    h.expect(got.some((x) => x.star === 1 && x.unlock?.skill === 'banner_of_dawn'), '★1 reports Banner of Dawn');
    h.expect(m.skillLists()[0].skills.includes('banner_of_dawn') && !m.skillLists()[0].skills.includes('vanguards_oath'), '★1: Banner of Dawn usable; the ★3 Art not yet');
    m.crests.vanguard = ASCEND_CP[2];
    h.expect(m.skillLists()[0].skills.includes('vanguards_oath'), '★3: Vanguard\'s Oath usable');
    h.expect(m.artPower().vanguards_oath === 1 + (STAR_ARTS * 3) / 100, 'Mastery Arts get the star power bonus too');
    m.learnCrest('mender');
    m.setCrest('mender');
    m.setSecondary('vanguard');
    h.expect(m.skillLists()[1].skills.includes('vanguards_oath'), 'and from the secondary slot');
    // In battle, Vanguard's Oath hits every foe and cracks their armor.
    const st = new GameState();
    const w = st.joinParty('wren');
    w.setLevel(50);
    w.crests.vanguard = ASCEND_CP[2];
    const rng = new RNG(5);
    const sys = new BattleSystem({ state: st, troopId: 'gw_wolves', rnd: () => rng.next() });
    sys.start();
    sys.party[0].mp = 999;
    const ev = sys.act(sys.party[0], { kind: 'skill', id: 'vanguards_oath', targets: sys.enemies });
    const hit = new Set(ev.filter((x) => x.t === 'damage').map((x) => x.target));
    h.expect(hit.size === sys.enemies.length && sys.enemies.every((x) => !x.alive || (x.stages.def?.v || 0) < 0), `Vanguard's Oath hits all ${sys.enemies.length} foes and cuts DEF`);
  }

  // 7. The Crest and Status screens show stars and Legacies.
  const st = game.state;
  const wren = st.joinParty('wren');
  wren.setLevel(30);
  st.flags.crestArtLearned = true;
  wren.crests.vanguard = ASCEND_CP[1] + 10;
  const cs = new CrestScreen(game.menus, 0);
  cs.list.index = cs.list.items.findIndex((e) => e.id === 'vanguard');
  cs.renderDetail();
  const row = cs.list.el.innerHTML;
  h.expect(row.includes('★★☆☆☆'), 'the Crest list shows two stars on Vanguard');
  h.expect(cs.detail.innerHTML.includes('Legacy') && cs.detail.innerHTML.includes('STR +5%') && cs.detail.innerHTML.includes('CP to ★3'), 'the detail shows the Legacy and progress to ★3');
  h.expect(cs.detail.innerHTML.includes('Mastery Arts') && cs.detail.innerHTML.includes('Banner of Dawn') && cs.detail.innerHTML.includes('Vanguard\'s Oath'), 'the Crest screen lists both Mastery Arts');
  const cleave = Math.round(70 * (1 + (STAR_ARTS * 2) / 100)); // two stars on Vanguard
  h.expect(cs.detail.innerHTML.includes(`Physical · All foes · Power ${cleave} · Weapon element · 6 MP`), `rank Arts show their details (Cleave, power ${cleave} with two stars)`);
  const as = new ArtsScreen(game.menus, 0);
  const names = as.list.items.map((x) => x.id);
  h.expect(names.includes('banner_of_dawn') && names.includes('vanguards_oath'), 'the Arts screen lists Mastery Arts');
  as.list.index = names.indexOf('vanguards_oath');
  as.renderDetail();
  h.expect(as.detail.innerHTML.includes('Unlocks at Vanguard ★3') && as.detail.innerHTML.includes('Pierces 30% of DEF'), 'a locked Mastery Art shows when it unlocks and what it does');
  as.list.index = names.indexOf('banner_of_dawn');
  as.renderDetail();
  h.expect(as.detail.innerHTML.includes('Usable in battle') && as.detail.innerHTML.includes('Party STR ▲1, DEF ▲1'), 'a learned one is usable, with its effects');
  const ss = new StatusScreen(game.menus, 0);
  h.expect(ss.el.innerHTML.includes('Legacies') && ss.el.innerHTML.includes('★★☆☆☆'), 'the Status screen lists stars and Legacies');
}
