// Smoke test: Chapter 3 "City of Bells", from the South Gate to the Pilgrim Road.
// Run: tools/test.sh ch3 900000
import { MAPS, registerMaps } from '../src/data/maps/index.js';
import { contentReady } from '../src/data/content/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { startNewGame } from '../src/story/newGame.js';

/** A party as Chapter 2 leaves it: four members, Lv 12, tier-2 gear, Crest Arts learned. */
export function ch3Start(game, level = 12) {
  const st = game.state;
  startNewGame(st);
  for (const id of ['ilse', 'bram', 'sable']) st.joinParty(id);
  const gear = {
    wren: { weapon: 'iron_sword', body: 'leather_jerkin', head: 'leather_hat' },
    ilse: { weapon: 'oak_staff', body: 'acolyte_robe', head: 'acolyte_hood' },
    bram: { weapon: 'iron_sword', offhand: 'iron_shield', body: 'iron_mail', head: 'iron_helm' },
    sable: { weapon: 'copper_rod', body: 'acolyte_robe', head: 'acolyte_hood' },
  };
  for (const c of st.allMembers()) {
    Object.assign(c.equipment, gear[c.id]);
    c.sealed = false;
    c.setLevel(level);
  }
  Object.assign(st.flags, { p_woke: true, kindled: true, ch1_departed: true, crestArtLearned: true });
  st.inventory.add('edrins_compass');
  st.inventory.add('cassian_letter');
  st.inventory.add('hi_tonic', 6);
  st.inventory.add('ether', 4);
  st.gold = 1500;
  st.chapter = 3;
}

export function setLevels(game, level) {
  for (const c of game.state.allMembers()) if (c.level < level) c.setLevel(level);
}

/** Live view of game.state.flags (a lost-and-retried battle replaces the flags object). */
export function liveFlags(game) {
  return new Proxy({}, {
    get: (_, k) => game.state.flags[k],
    set: (_, k, v) => { game.state.flags[k] = v; return true; },
  });
}

export function helpers(game, h) {
  return {
    /** Run the inspect point at (x, y) with the leader standing at (px, py) facing it. */
    async inspect(x, y, px, py) {
      const f = game.scene;
      f.player.placeAt(px, py, f.grid);
      f.player.face(px < x ? 'right' : px > x ? 'left' : py < y ? 'down' : 'up');
      f.lastTile = `${px},${py}`;
      const i = (f.map.inspect || []).find((e) => e.x === x && e.y === y && (!e.cond || e.cond(game.state)));
      if (!i) throw new Error(`No inspect at ${x},${y} on ${f.mapId}`);
      await f.runScript(i.run || ((s) => s.narrate(i.text)));
      await h.idle();
    },
    at: () => [game.scene.mapId, game.scene.player.tileX, game.scene.player.tileY],
  };
}

export async function run(game, h) {
  await contentReady;
  if (!MAPS.sunscar_road) {
    registerMaps([{ id: 'sunscar_road', name: 'Stub', ground: Array(30).fill('.'.repeat(30)), props: [] }]);
  }
  const t = helpers(game, h);
  ch3Start(game);
  game.start(new FieldScene(game), { mapId: 'aurenne', x: 20, y: 38, dir: 'up' });
  game.fadeIn(0.1);
  await h.idle();
  const F = liveFlags(game);

  // Arrival: the compass is stolen.
  h.expect(F.c3_arrived && F.c3_thief, 'arrived in Aurenne; thief scene');
  h.expect(!game.state.inventory.count('edrins_compass'), 'compass stolen');
  await h.stepOn(12, 36);
  h.expect(F.c3_chase, 'thief climbed onto the roofs');

  // The rooftop chase.
  await t.inspect(9, 34, 9, 35);
  h.expect(game.scene.mapId === 'c3_rooftops' && F.c3_roof_intro, 'climbed to the rooftops');
  await t.inspect(10, 12, 9, 12);
  h.expect(t.at()[1] === 12 && t.at()[2] === 12, `leapt the first street (at ${t.at()})`);
  await h.idle();
  h.expect(F.c3_roof_t1, 'Pip taunts and runs');
  await h.stepOn(16, 12);
  await h.stepOn(23, 12);
  await h.stepOn(35, 12);
  h.expect(F.c3_pip_joined && game.state.party.includes('pip'), 'Pip cornered and joined');
  h.expect(game.state.characters.pip.sealed && game.state.inventory.count('edrins_compass') === 1, 'Pip sealed; compass returned');
  h.expect(game.scene.mapId === 'aurenne', 'back in the market');

  // The Cathedral: Mercy, the letter, Cassian.
  await h.goto('c3_cathedral', 11, 19, 'up');
  await h.stepOn(11, 15);
  h.expect(F.c3_mercy_met, 'met Sister Mercy in the nave');
  await h.talk('imre');
  await h.idle();
  h.expect(F.c3_summoned && F.c3_met, 'letter delivered; Cassian offers the Page');
  h.expect(F.c3_dusk_talk, 'dusk talk on the steps');

  // Night: Sable's dream; morning: Nell is gone.
  await h.goto('c3_inn', 7, 9, 'up');
  await h.talk('marta');
  await h.idle();
  h.expect(game.scene.mapId === 'c3_dream', 'dreaming');
  await h.stepOn(13, 10);
  await h.idle();
  h.expect(F.c3_dream_done && F.c3_morning, 'dream and morning scenes');
  h.expect(game.state.characters.wren.lookId === 'wren', 'Wren\'s look restored after the dream');

  // Low Town: Old Mag, the almshouse keys, the grate.
  await h.goto('aurenne', 27, 36, 'up');
  await h.talk('mag');
  h.expect(F.c3_mag, 'Old Mag\'s lead');
  await h.goto('c3_almshouse', 6, 8, 'up');
  await h.talk('constance');
  h.expect(F.c3_key && game.state.inventory.count('undercroft_key'), 'Pip lifted the Undercroft key');
  await h.goto('aurenne', 37, 32, 'down');
  await t.inspect(44, 30, 43, 30);
  h.expect(F.c3_uc_open, 'grate opened');
  await h.stepOn(47, 29);
  h.expect(game.scene.mapId === 'c3_uc_sewers' && F.c3_uc_entered, 'into the sewers');

  // B1: two valves raise the sluice.
  await t.inspect(19, 2, 19, 3);
  await t.inspect(25, 23, 25, 24);
  h.expect(F.c3_sluice && game.scene.grid.walkable(31, 12), 'sluice gate raised');
  await t.inspect(27, 10, 27, 11);
  h.expect(game.scene.grid.walkable(27, 10), 'Bram smashed the cracked wall');
  await h.stepOn(43, 12);
  h.expect(game.scene.mapId === 'c3_uc_ossuary', 'down to the ossuary');

  // B2: the Carillon Wight.
  setLevels(game, 14);
  await t.inspect(16, 2, 16, 3);
  h.expect(F.c3_niche_seen, 'Lysa\'s niche');
  await h.stepOn(28, 16);
  h.expect(F.c3_wight_down && game.state.inventory.count('c3_bell_hammer'), 'Carillon Wight defeated; hammer found');
  await h.stepOn(45, 29);
  h.expect(game.scene.mapId === 'c3_uc_lab' && F.c3_lab_entered, 'into the laboratory');

  // B3: Sister Mercy.
  setLevels(game, 15);
  await h.stepOn(22, 23);
  await h.idle();
  h.expect(F.c3_mercy_down, 'Sister Mercy defeated; the captives freed');
  h.expect(game.scene.mapId === 'aurenne' && F.c3_condemned, 'Cassian condemns Mercy publicly');

  // The tuning forks, and the road south.
  await h.goto('c3_study', 6, 8, 'up');
  await h.idle();
  h.expect(F.c3_forks && game.state.inventory.count('tuning_fork'), 'received the tuning forks');
  h.expect(F.c3_forks_talk, 'party talk on the steps');
  await h.stepOn(20, 45);
  await h.idle();
  h.expect(F.c3_done && game.state.chapter === 4, 'chapter 4 card');
  h.expect(game.scene.mapId === 'sunscar_road', 'handed off to the Pilgrim Road');
  h.log(`party: ${game.state.party.join(',')} lv ${game.state.party.map((id) => game.state.characters[id].level).join('/')}`);
}
