// The opening movie's screenplay (staged by scenes/OpeningScene.js; the shot format is
// documented there). It plays after New Game and when the title screen sits idle.
//
//   Cold open → Lanternfall → the cast → the Kindling and its Crests → the wider world →
//   battles → the sun stops and breaks → one year later → Evernoon → AFTERLIGHT.
//
// It shows the premise (the end of the world is on the box) and the cast, and keeps the
// story's turns (who breaks the sun, Sable's face, the Penitent's) for the game itself.

import { CRESTS } from '../data/crests.js';

const ROLL = ['vanguard', 'mender', 'arcanist', 'warden', 'rogue', 'ranger', 'cantor', 'pugilist', 'runeblade', 'nightblade', 'dawnknight', 'timewright'];
const ROLL_EVERY = 0.22;

/** A cast-roll card shot: one character on their home ground, the card on the left. */
function castShot(id, stage, look, [x, y], card, extra = {}) {
  const side = extra.side ?? -1; // camera swings in from this side
  return {
    id, dur: 2.4, stage, cut: 'white', cutDur: 0.25,
    cast: [{ look, x, y, dir: extra.dir || 'down', to: extra.to, speed: extra.speed }],
    cam: { at: [[x - 1.3, y + 0.1], [x - 1.1, y + 0.1]], dist: [6.6, 5.4], pitch: [0.22, 0.18], yaw: [0.3 * side, 0.17 * side], lift: 1 },
    text: [{ kind: 'card', at: 0.15, look, ...card }],
    ...extra.shot,
  };
}

/** A world-montage shot: a quick drifting look over a region. */
function placeShot(id, map, mood, from, to, name, sub, cam = {}) {
  return {
    id, dur: 1.35, stage: { map, mood }, cut: 'white', cutDur: 0.22, ease: 'linear',
    cam: { at: [from, to], dist: 18, pitch: 0.4, yaw: [-0.12, 0.08], lift: 1.5, ...cam },
    text: [{ kind: 'tag', at: 0.05, fade: 0.2, name, sub }],
  };
}

const LF_MORNING = { map: 'lanternfall', mood: 'morning' };
const BATTLE_CAM = { at: [0, -0.6], lift: 1, dist: [12.6, 10.6], pitch: [0.3, 0.26], yaw: [0.2, 0.03], fov: 33 };
const hit = (at, who, target, sfx, extra = {}) => ({ at, sfx, beat: { who, pose: 'attack', lunge: target, hit: target, ...extra } });
const cast = (at, who, target, sfx, burst) => ({ at, sfx, beat: { who, pose: 'cast', hit: target, burst } });

export const OPENING = [
  // ---------------------------------------------------------------- cold open
  {
    id: 'cold', dur: 3.4, stage: {},
    cues: [{ at: 0.1, music: 'title', fadeIn: 2.5 }],
    text: [{ kind: 'line', at: 0.5, until: 3.1, text: '_The world ended on the day I came of age._', fade: 0.7 }],
  },
  {
    id: 'lf_dawn', dur: 4.2, stage: LF_MORNING, cut: 'black', cutDur: 1.4,
    cam: { at: [[15, 20], [9, 6]], dist: [30, 22], pitch: [0.17, 0.3], yaw: [0.32, 0.08], lift: [1, 4] },
    text: [{ kind: 'tag', at: 1.0, name: 'Lanternfall', sub: 'The westernmost isle of Solmere' }],
  },
  {
    id: 'lf_pier', dur: 3.4, stage: LF_MORNING, cut: 'black', cutDur: 0.6,
    cast: [{ look: 'wren', x: 23, y: 30, dir: 'down' }],
    cam: { at: [23, 30], dist: [8.5, 6.4], pitch: [0.2, 0.16], yaw: [-0.25, -0.06], lift: 1.1 },
    text: [{ kind: 'line', at: 0.5, until: 3.1, text: 'Tomorrow, the light tells me who I am.', by: 'Wren' }],
  },

  // ---------------------------------------------------------------- the cast
  castShot('cast_wren', LF_MORNING, 'wren', [23, 16],
    { name: 'Wren Halloway', title: 'The Keeper\'s restless daughter', crest: 'Sixteen tomorrow' },
    { shot: { cutDur: 0.5, music: 'opening' } }),
  castShot('cast_ilse', LF_MORNING, 'ilse', [26, 12],
    { name: 'Ilse Marrow', title: 'Her best friend. Plans everything.', crest: 'The herbalist\'s apprentice' }, { side: 1 }),
  castShot('cast_bram', LF_MORNING, 'bram', [23, 25],
    { name: 'Bram Kestrel', title: 'A squire who is sure he is a coward.', crest: 'Of the Dawnguard' }, { side: 1 }),
  castShot('cast_sable', { map: 'lanternfall', mood: 'night' }, 'sable', [33, 24],
    { name: 'Sable', title: 'The girl the sea gave back.', crest: 'Name unknown' }, { side: 1, shot: { cut: 'black', cutDur: 0.5 } }),
  castShot('cast_pip', { map: 'c3_rooftops', mood: 'day' }, 'pip', [13, 10],
    { name: 'Pip', title: 'Best pickpocket in Aurenne. Ask anyone.', crest: 'Eleven and three-quarters' },
    { dir: 'right', to: [19, 10], speed: 2.4, shot: { cam: { at: [[12.6, 10.1], [17.2, 10.1]], dist: [6.8, 6], pitch: 0.2, yaw: [-0.2, -0.12], lift: 1 } } }),
  castShot('cast_corvin', { map: 'c4a_halcyon', mood: 'desert' }, 'corvin', [19, 12],
    { name: 'Corvin Ashe', title: 'Sky-pirate. Gambler. Charming coward.', crest: 'Captain of the Halcyon' }, { side: 1 }),
  {
    ...castShot('cassian', { map: 'c3_cathedral', mood: 'temple' }, 'cassian', [11, 5],
      { name: 'Cassian Lorne', title: 'The kindest man in the world.', crest: 'The Hierophant' }),
    dur: 3.4, cut: 'black', cutDur: 0.6,
    text: [
      { kind: 'card', at: 0.15, look: 'cassian', name: 'Cassian Lorne', title: 'The kindest man in the world.', crest: 'The Hierophant' },
      { kind: 'line', at: 1.3, until: 3.2, text: '“Every child wants the good days never to end.”' },
    ],
  },

  // ---------------------------------------------------------------- the Kindling
  {
    id: 'kindling', dur: 3.8, stage: { map: 'lf_lantern', mood: 'temple' }, cut: 'white', cutDur: 0.5,
    cast: [{ x: 7, y: 6, dir: 'down', costumes: ROLL.map((crest) => ({ char: 'wren', crest })), every: ROLL_EVERY, from: 0.2 }],
    cam: { at: [7, 6], dist: [6.2, 4.6], pitch: [0.2, 0.15], yaw: [0.08, -0.04], lift: 1 },
    cues: [{ at: 0.2, sfx: 'holy' }, { at: 2.85, sfx: 'song' }],
    text: [
      { kind: 'crests', at: 0.2, until: 2.85, every: ROLL_EVERY, names: ROLL.map((id) => CRESTS[id].name) },
      { kind: 'line', at: 2.75, until: 3.7, text: '_One Crest, one life_ — or so they say.', fade: 0.25 },
    ],
  },

  // ---------------------------------------------------------------- the world
  placeShot('w_port', 'port_gale', 'day', [19, 13], [24, 12], 'Port Gale', 'The Gale Coast'),
  placeShot('w_wold', 'c2_wold_heart', 'forest', [20, 15], [23, 13], 'The Whisperwold', 'Where the trees remember'),
  placeShot('w_aurenne', 'aurenne', 'day', [17, 11], [21, 10], 'Aurenne', 'The City of Bells', { lift: 3, dist: 20, pitch: 0.55, yaw: [-0.1, 0.05] }),
  placeShot('w_sunscar', 'c4a_dunes', 'desert', [21, 22], [25, 21], 'The Sunscar', 'Dunes of glass'),
  placeShot('w_frost', 'c4a_frosthollow', 'snow', [22, 11], [25, 9], 'Frosthollow', 'The Greyspine Mountains', { lift: 2.5 }),
  placeShot('w_sky', 'c4b_skyreach', 'day', [23, 12], [26, 10], 'Skyreach', 'An island above the storm', { lift: 2.5 }),

  // ---------------------------------------------------------------- battles
  {
    id: 'b_brinefang', dur: 2.8, stage: { battle: 'deck' }, cut: 'white', cutDur: 0.3,
    cast: { party: [{ char: 'wren' }, { char: 'ilse' }, { char: 'bram' }, { char: 'sable' }], foes: ['brinefang'] },
    cam: { ...BATTLE_CAM, lift: 1.4, dist: [13.6, 11.6] },
    cues: [
      hit(0.3, 'p0', 'f0', 'slash'),
      cast(0.85, 'p3', 'f0', 'dark', ['#b080ff', '#6040c0']),
      hit(1.4, 'p2', 'f0', 'break'),
      { at: 1.4, flash: '#ffffff', dur: 0.25 },
      { at: 2.0, sfx: 'heal', beat: { who: 'p1', pose: 'cast' } },
    ],
    text: [{ kind: 'pop', at: 1.42, until: 2.5, text: 'BREAK!' }],
  },
  {
    id: 'b_wyrm', dur: 2.8, stage: { battle: 'desert' }, cut: 'white', cutDur: 0.3,
    cast: { party: [{ char: 'pip' }, { char: 'corvin' }, { char: 'wren' }, { char: 'bram' }], foes: ['c4a_wyrm_queen'] },
    cam: { ...BATTLE_CAM, lift: 1.8, dist: [15.6, 13.4], yaw: [-0.16, -0.02] },
    cues: [
      hit(0.3, 'p0', 'f0', 'slash'),
      { at: 0.75, sfx: 'gun', beat: { who: 'p1', pose: 'attack', hit: 'f0' } },
      { at: 1.35, beat: { who: 'p2', pose: 'attack', lunge: 'f0' } },
      hit(1.45, 'p3', 'f0', 'burst', { burst: ['#ffe8a0', '#ffffff', '#ffb040'] }),
      { at: 1.45, flash: '#ffe6b0', dur: 0.4 },
    ],
    text: [{ kind: 'pop', at: 1.45, until: 2.5, text: 'LINK ART', tone: 'gold' }],
  },

  // ---------------------------------------------------------------- the last sunset
  {
    id: 'sunset', dur: 3.4, stage: { map: 'lanternfall', mood: 'dusk' }, cut: 'black', cutDur: 0.8,
    sky: 'sun', sunY: 7,
    cam: { at: [10, 5], lift: 5, dist: [34, 31], pitch: [0.1, 0.12], yaw: [0.36, 0.32] },
    cues: [{ at: 0, stopMusic: 1.4 }, { at: 2.3, sfx: 'rumble' }, { at: 2.5, shake: [0.25, 0.9] }],
    text: [{ kind: 'line', at: 0.4, until: 2.7, text: 'Then, one sunset, the sun stopped.' }],
  },
  {
    id: 'sundering', dur: 3.0, stage: { map: 'lanternfall', mood: 'ruin' }, cut: 'white', cutDur: 0.9,
    sky: 'split', sunY: 7,
    cam: { at: [10, 5], lift: 5, dist: 31, pitch: 0.12, yaw: 0.32 },
    cues: [{ at: 0, sfx: 'burst' }, { at: 0.1, sfx: 'quake' }, { at: 0, shake: [0.6, 1.5] }],
    text: [{ kind: 'line', at: 0.5, until: 2.7, text: '—and broke into seven pieces.' }],
  },
  {
    id: 'year', dur: 2.0, stage: {}, cut: 'black', cutDur: 0.6,
    text: [{ kind: 'big', at: 0.2, until: 1.8, text: 'One year later' }],
  },

  // ---------------------------------------------------------------- after the end
  {
    id: 'a_shards', dur: 2.6, stage: { map: 'c6_shattered_sea', mood: 'ruin' }, cut: 'black', cutDur: 0.5,
    music: 'opening',
    cast: [{ look: 'wren_ruin', x: 24, y: 21, dir: 'up' }],
    cam: { at: [24, 21], dist: [7, 15], pitch: [0.18, 0.34], yaw: [0.25, 0.1], lift: 1 },
    text: [{ kind: 'tag', at: 0.3, name: 'The Shattered Sea', sub: 'What was left of the world' }],
  },
  {
    id: 'a_ilse', dur: 2.1, stage: { map: 'c7_ember_ward', mood: 'interior' }, cut: 'white', cutDur: 0.3,
    cast: [{ look: 'ilse_ruin', x: 10, y: 7, dir: 'down' }],
    cam: { at: [[10, 7.2], [10.3, 7.2]], dist: [7.4, 6.2], pitch: [0.3, 0.26], yaw: [-0.16, -0.06], lift: 1 },
    text: [{ kind: 'tag', at: 0.1, name: 'Ilse', sub: 'The Mender of Ash' }],
  },
  {
    id: 'a_kiteholm', dur: 2.1, stage: { map: 'kiteholm', mood: 'ruin' }, cut: 'white', cutDur: 0.3,
    cast: [{ look: 'pip_ruin', x: 20, y: 19, dir: 'down' }, { look: 'bram_ruin', x: 23, y: 19, dir: 'down' }],
    cam: { at: [[21.3, 19.3], [21.8, 19.3]], dist: [8.4, 7], pitch: 0.24, yaw: [0.16, 0.06], lift: 1 },
    text: [{ kind: 'tag', at: 0.1, name: 'Kiteholm', sub: 'Children of the wreck' }],
  },
  {
    id: 'b_penitent', dur: 2.6, stage: { battle: 'ruin' }, cut: 'white', cutDur: 0.3,
    cast: { party: ['wren_ruin', 'ilse_ruin', 'bram_ruin', 'pip_ruin'].map((look) => ({ char: look.split('_')[0], look })), foes: ['c8_penitent'] },
    cam: BATTLE_CAM,
    cues: [
      { at: 0.25, sfx: 'buff', beat: { who: 'p2', pose: 'guard' } },
      hit(0.8, 'p0', 'f0', 'slash'),
      hit(1.3, 'p3', 'f0', 'slash'),
      { at: 1.3, sfx: 'surge', flash: '#ffd8a0', dur: 0.3 },
    ],
    text: [{ kind: 'pop', at: 1.32, until: 2.4, text: 'SURGE', tone: 'gold' }],
  },
  {
    id: 'a_halcyon', dur: 2.1, stage: { map: 'c9_halcyon_flight', mood: 'ruin' }, cut: 'white', cutDur: 0.3,
    cast: [{ look: 'corvin', x: 10, y: 8, dir: 'down' }, { look: 'wren_ruin', x: 13, y: 8, dir: 'down' }],
    cam: { at: [[10.5, 8.4], [12.5, 8.4]], dist: [9, 8], pitch: 0.24, yaw: [-0.1, 0.1], lift: 1 },
    text: [{ kind: 'tag', at: 0.1, name: 'The Halcyon', sub: 'Wings, again' }],
  },
  {
    id: 'a_evernoon', dur: 3.2, stage: { map: 'c10_evernoon', mood: 'evernoon_battle' }, cut: 'white', cutDur: 0.6,
    cast: [{ look: 'cassian', x: 23, y: 19, dir: 'down' }, { look: 'sable_lysa', x: 22, y: 20, dir: 'down' }],
    cam: { at: [22.5, 19.6], dist: [8, 6.2], pitch: 0.2, yaw: [0.06, -0.04], lift: 1 },
    text: [{ kind: 'line', at: 0.4, until: 3.0, text: '“Stay. Here, the good days never end.”', by: 'Cassian' }],
  },

  // ---------------------------------------------------------------- AFTERLIGHT
  {
    id: 'finale', dur: 6.8, stage: { map: 'c11_lf_ruins', mood: 'ruin' }, cut: 'black', cutDur: 0.8, outro: 1.6,
    cast: [
      { look: 'pip_ruin', x: 19, y: 30, dir: 'up' }, { look: 'ilse_ruin', x: 20, y: 30, dir: 'up' },
      { look: 'wren_ruin', x: 21, y: 30, dir: 'up' }, { look: 'bram_ruin', x: 22, y: 30, dir: 'up' },
      { look: 'corvin', x: 23, y: 30, dir: 'up' }, { look: 'sable', x: 24, y: 30, dir: 'up' },
    ],
    cam: { at: [21.5, 29], lift: [1.2, 4], dist: [8, 15], pitch: [0.1, 0.18], yaw: 0 },
    cues: [{ at: 3.3, sfx: 'holy' }, { at: 4.4, stopMusic: 2.6 }],
    text: [
      { kind: 'line', at: 0.5, until: 3.0, text: '_This is what we built after._' },
      { kind: 'logo', at: 3.2, pre: 'A coming-of-age at the end of the world' },
    ],
  },
];
