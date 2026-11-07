// Prologue balance on Normal, with the party the story really gives you: Wren and
// Ilse at level 1 with starting gear and no Arts (their Crests are sealed until the
// Kindling), 4 Tonics. tests/balance.test.js fights every troop with a full,
// Crest-ranked party at the troops' level, which hides how hard this stretch is.
//
// 1. Each Tide Caves encounter, fresh, at level 1.
// 2. The whole prologue as one run, HP, Tonics and EXP carrying over: two random
//    cave fights, the Hearthstone (heal + the chests' Tonics), two more, the eel at
//    the brooch, supper at home (heal), then at night the Gloam pups and — Bram
//    joining — the Drowned Hound; then Chapter 1: Sable joins, a night's rest, the
//    Kindling wakes Wren's and Ilse's Crests, and Brinefang attacks the boat.
//    Between fights a player tops up anyone under 40% with a Tonic.
// Run: tools/test.sh prologue_balance 300000   (EXTRA='n=300&diff=0' to vary)
import { contentReady } from '../src/data/content/index.js';
import { MAPS } from '../src/data/maps/index.js';
import { GameState } from '../src/state/GameState.js';
import { BattleSystem } from '../src/battle/BattleSystem.js';
import { RNG, weightedPick } from '../src/core/util.js';
import { autoAction } from '../src/battle/AutoPlay.js';

/** The party as the prologue hands it over. */
function prologueParty(diff) {
  const st = new GameState();
  for (const id of ['wren', 'ilse']) st.joinParty(id).sealed = true;
  st.inventory.add('tonic', 4);
  st.inventory.add('antidote', 1);
  st.settings.difficulty = diff;
  return st;
}

/** Auto-play one fight on `st`, keeping its results (HP, EXP, items used). */
function fight(st, troopId, rng) {
  const sys = new BattleSystem({ state: st, troopId, rnd: () => rng.next() });
  sys.start();
  for (let i = 0; i < 400 && !sys.outcome(); i++) {
    const a = sys.nextActor();
    const t = sys.beginTurn(a);
    if (sys.outcome()) break;
    if (t.skip || !a.alive) { sys.endTurn(a, null); continue; }
    const action = t.auto || (a.isParty ? autoAction(sys, a) : sys.enemyAction(a));
    sys.act(a, action);
    sys.endTurn(a, action);
  }
  const out = sys.outcome() || 'timeout';
  if (out === 'win') sys.applyRewards();
  sys.commit(out);
  return out;
}

/** Between fights: a Tonic for anyone below 40% HP. */
function topUp(st) {
  for (const ch of st.activeMembers()) {
    if (ch.hp < ch.stats().hp * 0.4 && st.inventory.count('tonic')) {
      st.inventory.remove('tonic', 1);
      ch.hp = Math.min(ch.stats().hp, ch.hp + 150);
    }
  }
}

/** The prologue start to finish. Returns the stage it was lost at, or 'clear'. */
function prologueRun(seed, diff) {
  const rng = new RNG(seed);
  const st = prologueParty(diff);
  const caves = MAPS.lf_tidecaves.encounters.troops;
  const random = () => weightedPick(caves, () => rng.next());
  const stages = [
    ['cave 1', random], ['cave 2', random],
    ['hearthstone'],
    ['cave 3', random], ['cave 4', random],
    ['brooch eel', () => 'tc_eel'],
    ['supper'],
    ['gloam pups', () => 'pups2'],
    ['bram joins'],
    ['drowned hound', () => 'boss_drowned_hound'],
    ['kindling'],
    ['brinefang', () => 'boss_brinefang'],
  ];
  for (const [name, troop] of stages) {
    if (name === 'hearthstone') { st.healParty(); st.inventory.add('tonic', 3); st.inventory.add('ember_feather', 1); continue; }
    if (name === 'supper') { st.healParty(); continue; }
    if (name === 'bram joins') { st.joinParty('bram'); continue; }
    if (name === 'kindling') { st.joinParty('sable'); st.healParty(); st.characters.wren.sealed = st.characters.ilse.sealed = false; continue; }
    if (fight(st, troop(), rng) !== 'win') return { lost: name, level: st.characters.wren.level };
    topUp(st);
  }
  return { lost: null, level: st.characters.wren.level };
}

export async function run(game, h) {
  await contentReady;
  const q = new URLSearchParams(location.search);
  const N = Number(q.get('n')) || 200;
  const diff = q.has('diff') ? Number(q.get('diff')) : 1;
  const lines = [`difficulty ${['Story', 'Normal', 'Hard'][diff]}, ${N} runs each`];

  // 1. Each cave encounter at level 1, full HP.
  const fresh = {};
  for (const [troop] of MAPS.lf_tidecaves.encounters.troops) {
    let wins = 0, hpLeft = 0, tonics = 0;
    for (let k = 0; k < N; k++) {
      const st = prologueParty(diff);
      if (fight(st, troop, new RNG(11 + k * 7)) === 'win') wins++;
      hpLeft += st.activeMembers().reduce((a, c) => a + Math.max(0, c.hp) / c.stats().hp, 0) / 2;
      tonics += 4 - st.inventory.count('tonic');
    }
    fresh[troop] = wins / N;
    lines.push(`L1 ${troop}: win ${Math.round(100 * fresh[troop])}%, HP left ${Math.round(100 * hpLeft / N)}%, Tonics used ${(tonics / N).toFixed(1)}`);
  }

  // 2. The prologue as one run.
  const lost = {};
  let clear = 0, levels = 0;
  for (let k = 0; k < N; k++) {
    const r = prologueRun(1000 + k * 31, diff);
    if (r.lost) lost[r.lost] = (lost[r.lost] || 0) + 1; else { clear++; levels += r.level; }
  }
  lines.push(`prologue cleared ${Math.round(100 * clear / N)}% (Wren ends L${(levels / Math.max(1, clear)).toFixed(1)}); lost at: ${Object.entries(lost).map(([s, n]) => `${s} ${Math.round(100 * n / N)}%`).join(', ') || 'nowhere'}`);
  console.error(lines.join('\n'));
  h.log(lines.slice(-1)[0]);

  if (diff === 1) {
    const worst = Object.entries(fresh).sort((a, b) => a[1] - b[1])[0];
    h.expect(worst[1] >= 0.9, `every Tide Caves encounter is winnable at level 1 (worst: ${worst[0]} ${Math.round(100 * worst[1])}%)`);
    h.expect(clear / N >= 0.85, `a level-1 party clears the prologue in one go (${Math.round(100 * clear / N)}%)`);
  }
}
