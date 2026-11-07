// Balance simulator: fights every troop with a level- and tier-appropriate
// auto-playing party (main Crest ranked by level; from L20 a secondary Crest and
// a filled Support budget) using the pure battle logic (no rendering), then reports
// win rate, length and HP attrition. Run: tools/test.sh balance 120000
// (EXTRA='only=<regex>&n=<runs>&party=a,b,c,d&lvadj=<±levels>' narrows and varies the run).
import { contentReady } from '../src/data/content/index.js';
import { TROOPS } from '../src/data/troops.js';
import { ENEMIES } from '../src/data/enemies.js';
import { EQUIPMENT } from '../src/data/equipment.js';
import { kitCharacter } from './party_kit.js';
import { GameState } from '../src/state/GameState.js';
import { BattleSystem } from '../src/battle/BattleSystem.js';
import { RNG } from '../src/core/util.js';
import { autoAction } from '../src/battle/AutoPlay.js';

const TIER_BY_LEVEL = [[0, 1], [7, 2], [12, 3], [17, 4], [26, 5], [38, 6], [47, 7], [56, 8]];
export const tierFor = (lv) => TIER_BY_LEVEL.filter(([l]) => lv >= l).pop()[1];

function rosterFor(level) {
  const ids = ['wren', 'ilse', 'bram', 'sable', 'pip', 'corvin'];
  if (level < 12) return ids.slice(0, 4);
  return ids.slice(0, 4);
}

export function bestGear(ch, tier) {
  const pick = (slot, pred) => Object.values(EQUIPMENT).filter((e) => e.slot === slot && e.tier === tier && pred(e) && ch.canEquip(e.id))
    .sort((a, b) => (b.atk || 0) + (b.mag || 0) + (b.def || 0) - (a.atk || 0) - (a.mag || 0) - (a.def || 0))[0];
  const magic = ['mender', 'arcanist', 'gloamweaver', 'cantor'].includes(ch.crest);
  const w = pick('weapon', (e) => (magic ? (e.mag || 0) > 0 : true));
  if (w) ch.equipment.weapon = w.id;
  for (const slot of ['body', 'head']) { const a = pick(slot, () => true); if (a) ch.equipment[slot] = a.id; }
  const sh = pick('offhand', () => true);
  if (sh) ch.equipment.offhand = sh.id;
}

export function makeParty(level, roster = rosterFor(level)) {
  const st = new GameState();
  for (const id of roster) {
    const ch = st.joinParty(id);
    ch.setLevel(level);
    kitCharacter(ch, level);
    bestGear(ch, tierFor(level));
    ch.fullHeal();
  }
  st.inventory.add('tonic', 5);
  return st;
}

/** One auto-played fight; `tweak(state)` may adjust the party first. */
export function simulate(troopId, level, seed, roster, tweak) {
  const st = makeParty(level, roster);
  tweak?.(st);
  const rng = new RNG(seed);
  const sys = new BattleSystem({ state: st, troopId, rnd: () => rng.next() });
  sys.start();
  let partyTurns = 0;
  for (let i = 0; i < 400 && !sys.outcome(); i++) {
    const a = sys.nextActor();
    const turn = sys.beginTurn(a);
    if (sys.outcome()) break;
    if (turn.skip || !a.alive) { sys.endTurn(a, null); continue; }
    const action = turn.auto || (a.isParty ? autoAction(sys, a) : sys.enemyAction(a));
    if (a.isParty) partyTurns++;
    sys.act(a, action);
    sys.endTurn(a, action);
  }
  const hpPct = sys.party.reduce((s, p) => s + Math.max(0, p.hp) / p.maxHp, 0) / sys.party.length;
  return { outcome: sys.outcome() || 'timeout', rounds: partyTurns / sys.party.length, hpPct };
}

export async function run(game, h) {
  await contentReady;
  const rows = [];
  const q = new URLSearchParams(location.search);
  const only = q.get('only'); // e.g. EXTRA='only=side_boss'
  const roster = q.get('party')?.split(','); // e.g. party=wren,ilse,bram,pip
  const lvAdj = Number(q.get('lvadj')) || 0; // party level relative to the troop's
  for (const [id, t] of Object.entries(TROOPS)) {
    if (only && !new RegExp(only).test(id)) continue;
    const lv = Math.round(t.enemies.reduce((s, e) => s + (ENEMIES[e]?.level || 1), 0) / t.enemies.length);
    const partyLv = t.boss ? lv : Math.max(1, lv);
    let wins = 0, rounds = 0, hp = 0;
    const N = Number(new URLSearchParams(location.search).get('n')) || (t.boss ? 6 : 4);
    for (let k = 0; k < N; k++) {
      const r = simulate(id, partyLv + lvAdj, 100 + k * 17, roster);
      if (r.outcome === 'win') wins++;
      rounds += r.rounds; hp += r.hpPct;
    }
    rows.push({ id, lv: partyLv, boss: !!t.boss, win: wins / N, rounds: rounds / N, hp: hp / N });
  }
  rows.sort((a, b) => a.win - b.win || b.rounds - a.rounds);
  const fmt = (r) => `${r.id}${r.boss ? '*' : ''} L${r.lv} win${Math.round(r.win * 100)}% r${r.rounds.toFixed(1)} hp${Math.round(r.hp * 100)}`;
  console.error(`BALANCE (worst first):\n${rows.map(fmt).join('\n')}`);
  h.log(`troops ${rows.length}; normal avg rounds ${(rows.filter((r) => !r.boss).reduce((s, r) => s + r.rounds, 0) / Math.max(1, rows.filter((r) => !r.boss).length)).toFixed(1)}`);
}
