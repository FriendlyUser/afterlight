// Shared setup for the Chapter 4b smoke tests: a party as ch4a hands it over —
// its gear, and Crest ranks, a secondary Crest and Supports for its level like a real
// playthrough (tests/party_kit.js), so its boss fights aren't a coin toss.
import { kitCharacter } from './party_kit.js';

const GEAR = {
  wren: { weapon: 'starsteel_sword', body: 'starweave_coat', head: 'starweave_hood' },
  ilse: { weapon: 'starwood_staff', body: 'starweave_robe', head: 'star_diadem' },
  bram: { weapon: 'starsteel_sword', offhand: 'starsteel_aegis', body: 'starsteel_plate', head: 'starsteel_helm' },
  sable: { weapon: 'starglass_rod', body: 'starweave_robe', head: 'star_diadem' },
  pip: { weapon: 'starsteel_stiletto', body: 'starweave_coat', head: 'starweave_hood' },
  corvin: { weapon: 'starsteel_repeater', body: 'starweave_coat', head: 'starweave_hood' },
};

export async function setupParty(game, h, level, flags = {}) {
  await h.newGame();
  const st = game.state;
  for (const id of ['ilse', 'bram', 'sable', 'pip', 'corvin']) st.joinParty(id);
  for (const id of st.party) {
    const c = st.characters[id];
    c.sealed = false;
    Object.assign(c.equipment, GEAR[id]);
    c.setLevel(level);
    kitCharacter(c, level);
    c.fullHeal();
  }
  st.gold = 20000;
  st.inventory.add('tuning_fork', 1);
  st.inventory.add('hi_tonic', 20);
  st.inventory.add('ember_feather', 10);
  Object.assign(st.flags, { kindled: true, crestArtLearned: true, ...flags });
  st.chapter = 4;
}

/** Face a tile from a neighbouring tile and press confirm (inspect points, pylons...). */
export async function inspect(game, h, fromX, fromY, dir) {
  const f = game.scene;
  f.player.placeAt(fromX, fromY, f.grid);
  f.player.face(dir);
  f.interact();
  await h.wait(0.3);
  await h.idle(900);
}

export const mapId = (game) => game.scene?.mapId;

/** Harness calls with a long idle timeout: chapter 4b chains scenes, battles and teleports. */
export function patient(game, h, timeout = 900) {
  return {
    async goto(map, x, y, dir = 'down') { await game.scene.goto(map, x, y, dir); await h.wait(0.3); await h.idle(timeout); },
    async talk(id) {
      const a = game.scene.actors.get(id);
      if (!a) throw new Error(`No actor ${id} on ${game.scene.mapId}`);
      await game.scene.talkTo(a);
      await h.wait(0.3);
      await h.idle(timeout);
    },
    async stepOn(x, y) {
      const f = game.scene;
      f.player.placeAt(x, y, f.grid);
      f.lastTile = '';
      f.onTileEnter(x, y);
      await h.wait(0.3);
      await h.idle(timeout);
    },
  };
}
