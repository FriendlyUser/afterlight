// Shared setup for the Chapter 11 smoke tests (not a test itself).
import { FieldScene } from '../src/world/FieldScene.js';
import { registerMaps, MAPS } from '../src/data/maps/index.js';

const KIT = {
  wren: { weapon: 'edrins_blade', body: 'wanderers_mantle', head: 'wanderers_hat' },
  ilse: { weapon: 'mercy_staff', body: 'keepers_raiment', head: 'keepers_crown' },
  bram: { weapon: 'aldous_oath', body: 'dawnguard_regalia', head: 'crown_of_dawn' },
  sable: { weapon: 'lysa_ribbon', body: 'keepers_raiment', head: 'keepers_crown' },
  pip: { weapon: 'pips_luck', body: 'wanderers_mantle', head: 'wanderers_hat' },
  corvin: { weapon: 'halcyon_star', body: 'wanderers_mantle', head: 'wanderers_hat' },
};

/** Six companions, strong enough that auto-battle never loses, aboard the Halcyon. */
export async function setupAct3(game, h, flags = {}) {
  const st = game.state;
  for (const id of Object.keys(KIT)) {
    const c = st.joinParty(id);
    c.sealed = false;
    Object.assign(c.equipment, KIT[id]);
    c.setLevel(99);
  }
  st.gold = 50000;
  Object.assign(st.flags, { sundered: true, act3: true, p_woke: true }, flags);
  // Chapter 12's entry map may not exist yet; give the hand-off somewhere to land.
  if (!MAPS.evernoon_gate) registerMaps([{ ...MAPS.halcyon_deck, id: 'evernoon_gate', name: 'Evernoon (stub)', onEnter: null, npcs: [] }]);
  game.start(new FieldScene(game), { mapId: 'halcyon_deck', x: 12, y: 8, dir: 'down' });
  game.fadeIn(0.1);
  await game.wait(0.5);
  await h.idle();
}

/** Run a map inspect point as if the player examined it. */
export async function inspect(game, h, x, y) {
  const f = game.scene;
  const d = (f.map.inspect || []).find((i) => i.x === x && i.y === y && (!i.cond || i.cond(game.state)));
  if (!d) throw new Error(`No inspect at ${x},${y} on ${f.mapId}`);
  await f.runScript(d.run || ((s) => s.narrate(d.text)));
  await h.idle();
}

export const shards = (game) => game.state.inventory.count('sun_shard');
