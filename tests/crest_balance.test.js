// Crest viability: Wren takes each Crest in turn as her primary (ranked for the
// level, best gear it can use) and the auto-played party fights a fixed set of
// mid/late bosses. Crests that lag far behind the rest need a look.
// Run: tools/test.sh crest_balance 900000   (EXTRA='n=<runs>' to change samples)
import { contentReady } from '../src/data/content/index.js';
import { CRESTS, CREST_RANK_CP } from '../src/data/crests.js';
import { simulate, bestGear, tierFor } from './balance.test.js';
import { crestRankFor } from './party_kit.js';

const FIGHTS = [['c7_boss_choir', 42], ['c8_boss_penitent', 47], ['side_boss_bell', 48], ['c9_boss_severine', 50], ['c10_boss_warden', 54], ['c11_boss_mother', 60]];

export async function run(game, h) {
  await contentReady;
  const n = Number(new URLSearchParams(location.search).get('n')) || 6;
  const rows = [];
  for (const id of Object.keys(CRESTS)) {
    let wins = 0, rounds = 0, total = 0;
    for (const [troop, lv] of FIGHTS) {
      const asCrest = (st) => {
        const wren = st.characters.wren;
        wren.learnCrest(id);
        wren.crests[id] = CREST_RANK_CP[crestRankFor(lv) - 1];
        wren.setCrest(id);
        bestGear(wren, tierFor(lv));
        wren.fullHeal();
      };
      for (let k = 0; k < n; k++) {
        const r = simulate(troop, lv, 300 + k * 13, undefined, asCrest);
        total++;
        if (r.outcome === 'win') wins++;
        rounds += r.rounds;
      }
    }
    rows.push({ id, tier: CRESTS[id].tier, win: wins / total, rounds: rounds / total });
  }
  rows.sort((a, b) => a.win - b.win || b.rounds - a.rounds);
  console.error(`CRESTS (Wren's primary; worst first):\n${rows.map((r) => `${r.id} T${r.tier} win${Math.round(r.win * 100)}% r${r.rounds.toFixed(1)}`).join('\n')}`);
  h.log(`crests ${rows.length}`);
}
