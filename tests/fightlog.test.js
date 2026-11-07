// Turn-by-turn log of one simulated fight, for tuning a single troop.
// Run: EXTRA='troop=<id>&lv=<party level>&seed=<n>&party=a,b,c,d' tools/test.sh fightlog 200000
// Uses the balance simulator's party and the shared auto-play; prints each action,
// the damage it dealt, and party HP after it.
import { contentReady } from '../src/data/content/index.js';
import { TROOPS } from '../src/data/troops.js';
import { ENEMIES } from '../src/data/enemies.js';
import { SKILLS } from '../src/data/skills.js';
import { BattleSystem } from '../src/battle/BattleSystem.js';
import { RNG } from '../src/core/util.js';
import { autoAction } from '../src/battle/AutoPlay.js';
import { makeParty } from './balance.test.js';

export async function run(game, h) {
  await contentReady;
  const p = new URLSearchParams(location.search);
  const troopId = p.get('troop');
  const t = TROOPS[troopId];
  if (!t) { h.log(`fightlog: pass troop=<id> (unknown '${troopId}')`); return; }
  const lv = Number(p.get('lv')) || Math.round(t.enemies.reduce((s, e) => s + (ENEMIES[e]?.level || 1), 0) / t.enemies.length);
  const rng = new RNG(Number(p.get('seed')) || 100);
  const sys = new BattleSystem({ state: makeParty(lv, p.get('party')?.split(',')), troopId, rnd: () => rng.next() });
  sys.start();
  const lines = [`${troopId} vs party L${lv}: ${sys.party.map((b) => `${b.id} ${b.maxHp}hp`).join(', ')}`];
  const hpLine = () => `${sys.party.map((b) => `${b.id}:${Math.max(0, b.hp)}`).join(' ')} || ${sys.enemies.filter((e) => e.alive).map((e) => `${e.def.id}:${e.hp}`).join(' ')}`;
  for (let i = 0; i < 300 && !sys.outcome(); i++) {
    const a = sys.nextActor();
    const turn = sys.beginTurn(a);
    if (sys.outcome()) break;
    if (turn.skip || !a.alive) { sys.endTurn(a, null); continue; }
    const action = turn.auto || (a.isParty ? autoAction(sys, a) : sys.enemyAction(a));
    const ev = sys.act(a, action) || [];
    const dealt = (Array.isArray(ev) ? ev : ev.events || []).filter((e) => e.t === 'damage' && e.amount).map((e) => `${e.target.id || e.target.def?.id}-${e.amount}`);
    lines.push(`${a.isParty ? a.id : a.def.id} ${SKILLS[action.id]?.name || action.id}${a.hasStatus?.('charging') ? ' (charging)' : ''} → ${dealt.join(' ') || '-'} | ${hpLine()}`);
    sys.endTurn(a, action);
  }
  lines.push(`outcome: ${sys.outcome() || 'timeout'}`);
  console.error(lines.join('\n'));
  h.log(`fightlog ${troopId}: ${sys.outcome() || 'timeout'}`);
}
