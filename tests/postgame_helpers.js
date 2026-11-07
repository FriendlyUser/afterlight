// Shared set-up for the post-game smoke tests.
import { ENEMIES } from '../src/data/enemies.js';
import { contentReady } from '../src/data/content/index.js';

export const BOSSES = ['pg_unremembered', 'pg_rime_sovereign', 'pg_first_dark', 'pg_lysa_echo', 'pg_ar_hound', 'pg_ar_brinefang', 'pg_ar_tam',
  'pg_ar_mercy', 'pg_ar_wyrm', 'pg_ar_penitent', 'pg_ar_garrick', 'pg_ar_choir', 'pg_ar_noonking', 'pg_ar_hollow_wren',
  'pg_ar_hollow_ilse', 'pg_ar_hollow_bram', 'pg_ar_hollow_sable'];

/** New game → all six at Lv 99, Act III, no random encounters. */
export async function setupParty(game, h) {
  await contentReady;
  await h.newGame();
  const st = game.state;
  for (const id of ['ilse', 'bram', 'sable', 'pip', 'corvin']) st.joinParty(id);
  for (const c of st.allMembers()) c.setLevel(99);
  Object.assign(st.flags, { sundered: true, act3: true, noEncounters: true });
  return st;
}

/** Keep the story fights short: this is a smoke test, not a balance test. */
export function shrinkBosses() {
  for (const id of BOSSES) ENEMIES[id].stats = { ...ENEMIES[id].stats, hp: 0.04 };
  for (const id of ['pg_ar_pup', 'pg_ossuary_legionary', 'pg_hoarlight', 'pg_before_shard', 'pg_festival_lantern']) ENEMIES[id].stats = { ...ENEMIES[id].stats, hp: 0.05 };
}
