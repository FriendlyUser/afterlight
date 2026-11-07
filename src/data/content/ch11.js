// Content pack: ch11 — "Seven Wounds" (Act III). The open-world airship chapter:
// seven Remnant dungeons, six Character Rites and the Starseer's Orrery.
// Story scripts live in src/story/ch11*.js, maps in src/data/maps/ch11_*.js.

import { ITEMS } from '../items.js';
import { SKILLS } from '../skills.js';
import { gearOfTier } from '../equipment.js';
import { HALCYON_MAPS } from '../maps/ch11_halcyon.js';
import { REMNANT_MAPS } from '../maps/ch11_remnants.js';
import { RITE_MAPS } from '../maps/ch11_rites.js';

// ------------------------------------------------------------------ items
Object.assign(ITEMS, {
  c11_star_fragment: { name: 'Starfall Fragment', kind: 'key', desc: 'A splinter of starlight that fell when the sun broke. It hums a note too high to hear.', icon: '✧' },
  c11_edrins_cutlass: { name: 'Edrin\'s Cutlass', kind: 'key', desc: 'Your father\'s cutlass, from the wreck of the Gull\'s Return. Still sharp. He oiled it every Sunday.', icon: '✪' },
  c11_handlamp: { name: 'Keeper\'s Hand-Lamp', kind: 'key', desc: 'A brass signal lamp with Lanternfall\'s sigil, found lashed to your father\'s boat with a Keeper\'s knot.', icon: '✪' },
  c11_osk_censer: { name: 'Osk\'s Censer', kind: 'key', desc: 'A dented brass censer packed with bitterleaf. Mirefen healers burned it against rot.', icon: '✪' },
  c11_ember_seed: { name: 'Elowen\'s Ember', kind: 'key', desc: 'A seed that burns without being consumed. Thorns remember fire.', icon: '✪' },
  c11_seal: { name: 'Commander\'s Seal', kind: 'key', desc: 'A Dawnguard signet. It opens the Grand Lantern\'s tower.', icon: '✪' },
  c11_kite_letter: { name: 'Kite Letter', kind: 'key', desc: 'Crayon on sailcloth, from the children of Kiteholm. Mostly capital letters.', icon: '✪' },
  c11_tilly_knife: { name: '"The Lucky Shiv"', kind: 'key', desc: 'A rusty kitchen knife. Tilly says it is the legendary Lucky Shiv. Tilly is very sure.', icon: '✪' },
  c11_hal_log: { name: 'Kingfisher Logbook', kind: 'key', desc: 'Captain Hal Merrow\'s log. The last page is addressed to someone.', icon: '✪' },
});

// ------------------------------------------------------------------ skills (enemy-only)
Object.assign(SKILLS, {
  c11_hush: { name: 'Hush of the Choir', kind: 'support', target: 'enemies', status: [['silence', 0.5]], anim: 'song' },
  c11_glass_requiem: { name: 'Requiem of Glass', kind: 'mag', target: 'enemies', power: 125, elem: 'light', status: [['silence', 0.35]], anim: 'song' },
  c11_penance: { name: 'Frozen Penance', kind: 'mag', target: 'enemies', power: 110, elem: 'ice', status: [['slow', 0.35]], anim: 'ice' },
  c11_frost_bind: { name: 'Bound in Ice', kind: 'mag', target: 'enemy', power: 90, elem: 'ice', status: [['stun', 0.65]], anim: 'ice' },
  c11_rime_shell: { name: 'Rime Shell', kind: 'support', target: 'self', selfBuffs: { def: 2, res: 1 }, anim: 'buff' },
  c11_embrace: { name: 'Mother\'s Embrace', kind: 'heal', target: 'allies', power: 110, anim: 'heal' },
  c11_rotwater: { name: 'Rotwater', kind: 'mag', target: 'enemies', power: 100, elem: 'dark', status: [['poison', 0.5]], anim: 'dark' },
  c11_wither: { name: 'Wither', kind: 'mag', target: 'enemies', power: 95, elem: 'dark', drain: 0.6, anim: 'dark' },
  c11_pollen: { name: 'Pollen of Forgetting', kind: 'support', target: 'enemies', status: [['sleep', 0.4]], debuffs: { mag: -1 }, anim: 'status' },
  c11_static: { name: 'Static Charge', kind: 'support', target: 'self', selfBuffs: { mag: 1 }, anim: 'bolt' },
  c11_stormcrown: { name: 'Stormcrown', kind: 'mag', target: 'enemies', power: 150, elem: 'bolt', status: [['stun', 0.25]], anim: 'bolt' },
  c11_execution: { name: 'Execution', kind: 'phys', target: 'enemy', power: 240, elem: 'slash', anim: 'slash' },
  c11_oathbreaker: { name: 'Oathbreaker', kind: 'phys', target: 'enemies', power: 105, elem: 'slash', debuffs: { def: -1 }, anim: 'slash' },
  c11_beacon: { name: 'Lamp-Beam', kind: 'mag', target: 'enemy', power: 140, elem: 'light', anim: 'light' },
  c11_little_bird: { name: 'Little Bird', kind: 'support', target: 'enemy', status: [['charm', 0.8]], anim: 'song' },
  c11_last_light: { name: 'Last Light', kind: 'mag', target: 'enemies', power: 150, elem: 'light', anim: 'meteor' },
  c11_vigil: { name: 'Keeper\'s Vigil', kind: 'support', target: 'self', selfBuffs: { def: 1, res: 1 }, selfStatus: ['regen'], anim: 'buff' },
  c11_bedrest: { name: 'Bed Rest', kind: 'support', target: 'enemy', status: [['sleep', 0.7]], debuffs: { str: -1 }, anim: 'status' },
  c11_triage: { name: 'Cold Triage', kind: 'mag', target: 'enemy', power: 150, elem: 'dark', anim: 'dark' },
  c11_paralysis: { name: 'Paralysis', kind: 'support', target: 'enemies', status: [['stun', 0.4]], anim: 'dark' },
  c11_shriek: { name: 'Glitter Shriek', kind: 'support', target: 'enemies', status: [['blind', 0.55]], anim: 'song' },
  c11_forget: { name: 'Forget', kind: 'support', target: 'enemy', debuffs: { str: -1, mag: -1, def: -1, res: -1 }, anim: 'dark' },
  c11_starfall: { name: 'Starfall', kind: 'mag', target: 'enemies', power: 170, elem: 'light', anim: 'meteor' },
  c11_undertow: { name: 'Undertow', kind: 'mag', target: 'enemies', power: 115, elem: 'ice', status: [['slow', 0.4]], anim: 'ice' },
});

// ------------------------------------------------------------------ looks
const L = (id, def) => [id, { id, ...def }];
const looks = Object.fromEntries([
  L('c11_mags', { skin: '#d9a57c', hair: { style: 'bun', color: '#d8d4d0' }, outfit: { style: 'coat', main: '#b0602a', accent: '#e8dcc0', trim: '#5a3a24', pants: '#3a3030' }, acc: ['glasses', 'scarf'] }),
  L('c11_nell', { skin: '#f2cba5', hair: { style: 'short', color: '#2a2a30' }, outfit: { style: 'vest', main: '#4a4a52', accent: '#c8a050', trim: '#2a2a2a', pants: '#3a3a42' }, acc: ['headband'], weapon: 'fist' }),
  L('c11_ottoline', { skin: '#b07a52', hair: { style: 'bun', color: '#e8e4dc' }, outfit: { style: 'robe', main: '#24305a', accent: '#e8d890', trim: '#c9a24a' }, acc: ['glasses', 'hat_wizard'], build: 'adult' }),
  L('c11_tilly', { skin: '#e9c09a', hair: { style: 'twintails', color: '#c0642e' }, outfit: { style: 'rags', main: '#6a7a4a', accent: '#c8b898', pants: '#5a4a3a' }, acc: ['scarf'], build: 'child', blush: true }),
  L('c11_brask', { skin: '#f2cba5', hair: { style: 'short', color: '#8a6a4a' }, outfit: { style: 'armor', main: '#777', metal: '#8a94a4', accent: '#2a2a40', trim: '#c9a24a', pants: '#2a2a30' }, acc: ['cape', 'beard'], capeColor: '#2a2a40', weapon: 'axe', build: 'large' }),
  L('c11_choir_husk', { skin: '#7a4e34', hair: { style: 'long', color: '#e8e4dc' }, outfit: { style: 'robe', main: '#c8a870', accent: '#f0e8d0', trim: '#8a6a3a' }, acc: ['hood', 'headband'] }),
  L('c11_penitence', { skin: '#c8dcec', hair: { style: 'bald', color: '#e8f0f8' }, outfit: { style: 'robe', main: '#8ab0d0', accent: '#ffffff', trim: '#a0c8e8' }, acc: ['beard'], build: 'large' }),
  L('c11_matron', { skin: '#b8b0c4', hair: { style: 'bun', color: '#1a1a24' }, outfit: { style: 'coat', main: '#4a4a5a', accent: '#8a3aaa', trim: '#2a2a3a', pants: '#2a2a34' }, acc: ['glasses'], weapon: 'staff' }),
  L('c11_ysolde_remnant', { skin: '#c8c0dc', hair: { style: 'braid', color: '#3a2a5a' }, eyes: '#ffd070', outfit: { style: 'robe', main: '#1a1a3a', accent: '#ffd070', trim: '#ffe8a0' }, acc: ['circlet', 'cape'], capeColor: '#2a1a4a', weapon: 'staff', build: 'tall' }),
  L('c11_echo_ysolde', { skin: '#c8d8f0', hair: { style: 'braid', color: '#6a7a9a' }, outfit: { style: 'robe', main: '#4a6a9a', accent: '#d8e4f4', trim: '#a0b8d8' }, acc: ['circlet'], build: 'tall' }),
  L('c11_echo_wren', { skin: '#d0e0f4', hair: { style: 'ponytail', color: '#8a9ab8' }, outfit: { style: 'tunic', main: '#6a8ab8', accent: '#e0e8f4', trim: '#a0b0c8', pants: '#5a6a8a' }, build: 'child' }),
  L('c11_echo_ilse', { skin: '#d0e0f4', hair: { style: 'bob', color: '#5a6a8a' }, outfit: { style: 'dress', main: '#7a9ab8', accent: '#e0e8f4', trim: '#a0b0c8' }, build: 'child' }),
  L('c11_gunner', { skin: '#a8b8c8', hair: { style: 'short', color: '#4a5a6a' }, outfit: { style: 'coat', main: '#3a4a6a', accent: '#a0b0c8', trim: '#c9a24a', pants: '#2a3040' }, acc: ['hat_wide'], weapon: 'gun' }),
]);

// ------------------------------------------------------------------ enemies
const E = (id, name, level, sprite, opts = {}) => ({ id, name, level, sprite, ...opts });
const enemies = [
  // ============================================ Saltglass — the Glass Steps (Lv 56–59)
  E('c11_glasswyrm', 'Glasswyrm', 57, { type: 'serpent', color: '#d8c890', accent: '#a0e0ff', eye: '#ff8040', seed: 21 }, {
    stats: { hp: 1.25, str: 1.1, def: 1.2 }, weak: ['blunt', 'ice'], resist: { fire: 0.5, pierce: 0.7 }, poise: 4,
    skills: [['e_bite', 3], ['e_constrict', 2], ['e_quake', 1]], drops: [['saltglass', 0.4], ['hi_ether', 0.1]], steal: ['mega_tonic', 'saltglass'],
    desc: 'It swims through the glass dunes the way an eel swims through weed. The dunes are in the sky now. It has not noticed.',
  }),
  E('c11_mirage', 'Mirage', 57, { type: 'wisp', color: '#ffe0a0', eye: '#ffffff', seed: 22 }, {
    stats: { hp: 0.75, mag: 1.25, def: 2, res: 0.7, evade: 14 }, weak: ['dark', 'wind'], resist: { slash: 0.5, pierce: 0.5, light: 0 }, poise: 2,
    skills: [['e_blind', 2], ['e_holy', 2], ['e_spark', 1]], drops: [['eye_drops', 0.3], ['x_ether', 0.03]], steal: ['hi_ether', 'sun_goggles'],
    desc: 'A memory of water seen by someone dying of thirst.',
  }),
  E('c11_choir_husk', 'Choir Husk', 58, { type: 'humanoid', look: 'c11_choir_husk' }, {
    stats: { hp: 1.0, mag: 1.2, res: 1.2 }, weak: ['slash', 'dark'], resist: { light: 0.3 }, poise: 3,
    skills: [['e_silence', 2], ['e_holy', 2], ['e_heal', 1]], drops: [['echo_herb', 0.4], ['hi_ether', 0.15]], steal: ['bell_earring', 'hi_ether'],
    desc: 'Blindfolded and singing one note. Tamsin\'s acolytes sang the Dawnsong with their eyes covered, so they would hear it better.',
  }),
  E('c11_scuttler', 'Glass Scuttler', 56, { type: 'scorpion', color: '#e8d8b0', accent: '#80c0e0', eye: '#ff4040', seed: 23 }, {
    stats: { hp: 1.0, def: 1.6, spd: 0.9 }, weak: ['blunt', 'bolt'], resist: { slash: 0.6 }, poise: 4,
    skills: [['e_sting', 3], ['e_shell', 1], ['attack', 1]], drops: [['antidote', 0.3], ['saltglass', 0.3]], steal: ['panacea', 'saltglass'],
    desc: 'Its shell is fused desert glass. Hit it hard enough and it rings.',
  }),
  E('c11_blind_choir', 'The Blind Choir', 59, { type: 'angel', color: '#f0e0c0', accent: '#c8a060', eye: '#ffffff', size: 3, seed: 24 }, {
    boss: true, stats: { hp: 12, mag: 1.25, res: 1.2, exp: 8, gold: 8, cp: 4 }, weak: ['blunt', 'dark'], resist: { light: 0, bolt: 0.6 }, poise: 7,
    ai: 'c11_blind_choir', summons: ['c11_choir_voice'], drops: [['bell_earring', 1], ['spirit_fruit', 1]], steal: ['x_ether', 'bell_earring'],
    desc: 'What remains of Keeper Tamsin: a choir of blindfolded voices singing so loudly they cannot hear the world end.',
  }),
  E('c11_choir_voice', 'Choir Voice', 57, { type: 'ghost', color: '#f0e8d0', eye: '#c8a060', seed: 25 }, {
    stats: { hp: 0.7, mag: 1.0, def: 1.4 }, weak: ['dark', 'blunt'], resist: { light: 0 }, poise: 2,
    skills: [['e_silence', 2], ['e_heal', 2], ['e_holy', 1]], drops: [], steal: ['echo_herb', 'hi_ether'],
    desc: 'One voice of many. It sings harmony to a song no one else can hear.',
  }),

  // ============================================ Frosthollow (Lv 58–61)
  E('c11_rime_monk', 'Rime Monk', 59, { type: 'ghost', color: '#c8e0f0', eye: '#4aa0ff', seed: 31 }, {
    stats: { hp: 1.0, mag: 1.2, def: 1.8 }, weak: ['fire', 'light'], resist: { ice: 0, slash: 0.6 }, poise: 3,
    skills: [['e_frost', 3], ['e_heal', 1], ['e_silence', 1]], drops: [['frost_lily', 0.3], ['hi_ether', 0.15]], steal: ['frost_lily', 'frost_ring'],
    desc: 'The monks of Frosthollow kept a silent vigil. Some of them are still keeping it.',
  }),
  E('c11_snow_stalker', 'Snow Stalker', 58, { type: 'hound', color: '#e8eef4', accent: '#90a8c0', eye: '#4aa0ff', seed: 32 }, {
    stats: { hp: 1.05, str: 1.15, spd: 1.2 }, weak: ['fire', 'pierce'], resist: { ice: 0.3 }, poise: 3,
    skills: [['e_bite', 3], ['e_howl', 1], ['e_icebreath', 1]], drops: [['wolf_pelt', 0.4], ['mega_tonic', 0.08]], steal: ['wolf_pelt', 'mega_tonic'],
    desc: 'It hunts by the sound of chattering teeth.',
  }),
  E('c11_glacier_golem', 'Glacier Golem', 60, { type: 'golem', color: '#a0c8e8', accent: '#e8f4ff', eye: '#4aa0ff', seed: 33 }, {
    stats: { hp: 1.6, str: 1.2, def: 1.6, spd: 0.75 }, weak: ['fire', 'blunt'], resist: { ice: -1, slash: 0.5, pierce: 0.6 }, poise: 5,
    skills: [['e_slam', 3], ['e_shell', 1], ['e_crush', 1]], drops: [['guard_fruit', 0.05], ['frost_lily', 0.5]], steal: ['frost_lily', 'guard_fruit'],
    desc: 'The avalanche that killed Brother Halvard, gathered up and given a grudge.',
  }),
  E('c11_avalanche_wraith', 'Avalanche Wraith', 59, { type: 'elemental', color: '#f0f4ff', accent: '#a0c0e0', seed: 34 }, {
    stats: { hp: 1.0, mag: 1.3 }, weak: ['fire', 'bolt'], resist: { ice: 0, wind: 0.5 }, poise: 3,
    skills: [['e_icebreath', 2], ['e_quake', 1], ['e_frost', 2]], drops: [['frost_bomb', 0.3]], steal: ['frost_bomb', 'hi_ether'],
    desc: 'A slope of snow that remembers falling.',
  }),
  E('c11_frozen_penitence', 'The Frozen Penitence', 61, { type: 'humanoid', look: 'c11_penitence', size: 3 }, {
    boss: true, stats: { hp: 13, mag: 1.25, def: 1.3, exp: 8, gold: 8, cp: 4 }, weak: ['fire', 'blunt'], resist: { ice: 0, light: 0.5 }, poise: 7,
    ai: 'c11_frozen_penitence', drops: [['frost_ring', 1], ['guard_fruit', 1]], steal: ['x_ether', 'frost_ring'],
    desc: 'Brother Halvard, kneeling in the snow, apologising to a mountain. He has been at it for a year.',
  }),

  // ============================================ Mirefen (Lv 59–62)
  E('c11_rot_leech', 'Rot Leech', 59, { type: 'serpent', color: '#5a6a3a', accent: '#c0d080', eye: '#e0ff60', seed: 41 }, {
    stats: { hp: 0.95, mag: 1.1, spd: 1.1 }, weak: ['fire', 'slash'], resist: { dark: 0.5, ice: 0.7 }, poise: 3,
    skills: [['e_drain', 3], ['e_bite', 2], ['e_poison', 1]], drops: [['antidote', 0.4], ['mire_pearl', 0.2]], steal: ['mire_pearl', 'panacea'],
    desc: 'Mirefen\'s healers used leeches. The leeches have started using the healers.',
  }),
  E('c11_bogcap', 'Bogcap', 60, { type: 'mushroom', color: '#6a7a4a', accent: '#d0c0e0', seed: 42 }, {
    stats: { hp: 1.3, def: 1.2, spd: 0.7 }, weak: ['fire', 'wind'], resist: { dark: 0.5, blunt: 0.7 }, poise: 3,
    skills: [['e_spore', 3], ['e_poison', 1], ['attack', 1]], drops: [['echo_herb', 0.3], ['panacea', 0.1]], steal: ['panacea', 'wisdom_seed'],
    desc: 'Grows on whatever stopped moving.',
  }),
  E('c11_mire_mite', 'Mire Mite', 59, { type: 'spider', color: '#4a5a3a', accent: '#a0c060', eye: '#ff6040', seed: 43 }, {
    stats: { hp: 0.9, str: 1.1, spd: 1.25 }, weak: ['fire', 'blunt'], poise: 2,
    skills: [['e_sting', 2], ['e_blind', 1], ['e_bite', 2]], drops: [['eye_drops', 0.3]], steal: ['eye_drops', 'antidote_charm'],
    desc: 'Lives in the stilts. Bites the ankles of anyone who stands still too long.',
  }),
  E('c11_stilt_lurker', 'Stilt Lurker', 61, { type: 'horror', color: '#3a4a3a', accent: '#6a8a4a', eye: '#c0ff60', size: 1.5, seed: 44 }, {
    stats: { hp: 1.5, str: 1.2 }, weak: ['light', 'fire'], resist: { dark: 0.3, ice: 0.6 }, poise: 4,
    skills: [['e_claw', 2], ['e_constrict', 2], ['e_darkwave', 1]], drops: [['mire_pearl', 0.4], ['mega_tonic', 0.1]], steal: ['mire_pearl', 'dusk_ring'],
    desc: 'It waits under the boardwalks for the rot to finish its work.',
  }),
  E('c11_mire_mother', 'The Mire Mother', 62, { type: 'horror', color: '#4a5a3a', accent: '#a08ac0', eye: '#e0ff90', size: 3, seed: 45 }, {
    boss: true, stats: { hp: 13, mag: 1.2, res: 1.2, exp: 8, gold: 8, cp: 4 }, weak: ['fire', 'light'], resist: { dark: 0.3, ice: 0.6 }, poise: 7,
    ai: 'c11_mire_mother', summons: ['c11_rot_child'], drops: [['regen_bangle', 1], ['vigor_seed', 2]], steal: ['megalixir', 'panacea'],
    desc: 'Mother Osk, who nursed her village through the rot and could not stop when they died. She is still nursing.',
  }),
  E('c11_rot_child', 'Rot Child', 58, { type: 'slime', color: '#6a7a4a', eye: '#e0ff90', seed: 46 }, {
    stats: { hp: 0.8, mag: 1.0 }, weak: ['fire', 'light'], resist: { dark: 0.5 }, poise: 2,
    skills: [['e_poison', 2], ['e_spit', 2], ['attack', 1]], drops: [], steal: ['antidote', 'panacea'],
    desc: 'It cries like a feverish child. Do not listen too closely.',
  }),

  // ============================================ Thornwood (Lv 61–64)
  E('c11_witherbark', 'Witherbark', 62, { type: 'treant', color: '#6a5040', accent: '#a08a50', eye: '#ffb040', seed: 51 }, {
    stats: { hp: 1.5, str: 1.2, def: 1.3, spd: 0.8 }, weak: ['fire', 'slash'], resist: { blunt: 0.6, ice: 0.7 }, poise: 5,
    skills: [['e_slam', 2], ['e_constrict', 2], ['e_drain', 1]], drops: [['power_fruit', 0.04], ['mega_tonic', 0.1]], steal: ['power_fruit', 'regen_bangle'],
    desc: 'An oak that was old when Aurenne was a village. It is very tired of standing.',
  }),
  E('c11_briar_hound', 'Briar Hound', 61, { type: 'hound', color: '#5a4a2a', accent: '#a0c060', eye: '#ff6040', seed: 52 }, {
    stats: { hp: 1.0, str: 1.15, spd: 1.2 }, weak: ['fire', 'blunt'], resist: { pierce: 0.6 }, poise: 3,
    skills: [['e_bite', 3], ['e_sting', 2], ['e_howl', 1]], drops: [['antidote', 0.4]], steal: ['wolf_pelt', 'swift_fruit'],
    desc: 'More thorn than dog, now. It still wags.',
  }),
  E('c11_dusk_moth', 'Dusk Moth', 62, { type: 'insect', color: '#8a6a9a', accent: '#e0c0f0', eye: '#ffe060', seed: 53 }, {
    stats: { hp: 0.9, mag: 1.2, spd: 1.2, evade: 10 }, weak: ['wind', 'pierce'], resist: { dark: 0.5 }, poise: 2,
    skills: [['e_spore', 2], ['e_mpdrain', 2], ['e_gust', 1]], drops: [['hi_ether', 0.25]], steal: ['hi_ether', 'magic_fruit'],
    desc: 'Drawn to the last light in any room. Drinks it.',
  }),
  E('c11_faded_sprite', 'Faded Sprite', 61, { type: 'wisp', color: '#d0a0c0', eye: '#ffffff', seed: 54 }, {
    stats: { hp: 0.8, mag: 1.3, def: 1.6, evade: 10 }, weak: ['dark', 'fire'], resist: { slash: 0.6, pierce: 0.6 }, poise: 2,
    skills: [['e_heal', 2], ['e_drain', 2], ['e_sleep', 1]], drops: [['ether', 0.4]], steal: ['x_ether', 'spirit_fruit'],
    desc: 'Verdance\'s fairies were said to live as long as a summer. Summer ended.',
  }),
  E('c11_withered_bloom', 'The Withered Bloom', 64, { type: 'plant', color: '#8a6a7a', accent: '#d0b060', eye: '#ffd070', size: 4, seed: 55 }, {
    boss: true, stats: { hp: 14, mag: 1.3, res: 1.2, spd: 0.9, exp: 8, gold: 8, cp: 4 }, weak: ['fire', 'slash'], resist: { dark: 0.4, ice: 0.6, blunt: 0.7 }, poise: 8,
    ai: 'c11_withered_bloom', drops: [['ember_heart', 1], ['magic_fruit', 1]], steal: ['megalixir', 'magic_fruit'],
    desc: 'Elowen, the oldest Keeper, who would not fade. She drank the forest to stay in bloom.',
  }),

  // ============================================ Skyreach (Lv 62–66)
  E('c11_squall_drake', 'Squall Drake', 64, { type: 'drake', color: '#4a6a9a', accent: '#e0f0ff', eye: '#ffe070', size: 1.5, seed: 61 }, {
    stats: { hp: 1.4, str: 1.15, mag: 1.15 }, weak: ['ice', 'pierce'], resist: { bolt: 0, wind: 0.5 }, poise: 4,
    skills: [['e_bite', 2], ['e_thunder', 2], ['e_gust', 1]], drops: [['storm_ring', 0.05], ['mega_tonic', 0.12]], steal: ['storm_ring', 'bolt_bomb'],
    desc: 'Stormcrown\'s riders flew drakes like these. The drakes kept flying.',
  }),
  E('c11_thunderhawk', 'Thunderhawk', 63, { type: 'bird', color: '#3a4a6a', accent: '#ffe070', eye: '#ffffff', seed: 62 }, {
    stats: { hp: 0.9, spd: 1.4, mag: 1.1 }, weak: ['pierce', 'ice'], resist: { bolt: 0.5 }, poise: 2,
    skills: [['e_peck', 3], ['e_spark', 2], ['e_gust', 1]], drops: [['bolt_bomb', 0.3]], steal: ['bolt_bomb', 'swift_fruit'],
    desc: 'It dives with the lightning, never before it.',
  }),
  E('c11_sky_sentinel', 'Skyreach Sentinel', 64, { type: 'knight', color: '#8a9ab0', accent: '#3a5a8a', weapon: 'spear', seed: 63 }, {
    stats: { hp: 1.4, str: 1.2, def: 1.5 }, weak: ['bolt', 'blunt'], resist: { pierce: 0.5, wind: 0.5 }, poise: 5,
    skills: [['e_spear', 3], ['e_shell', 1], ['e_cleave', 1]], drops: [['skypiercer', 0.03], ['mega_tonic', 0.1]], steal: ['x_tonic', 'skypiercer'],
    desc: 'Vasha\'s honour guard. The armour stands its watch with nothing inside.',
  }),
  E('c11_static_wisp', 'Static Wisp', 62, { type: 'wisp', color: '#a0c8ff', eye: '#ffffff', seed: 64 }, {
    stats: { hp: 0.7, mag: 1.3, def: 2, evade: 12 }, weak: ['ice', 'wind'], resist: { bolt: -1, slash: 0.5 }, poise: 2,
    skills: [['e_spark', 3], ['e_silence', 1], ['e_selfdestruct', 0.5]], drops: [['ether', 0.4]], steal: ['hi_ether', 'storm_ring'],
    desc: 'A spark that got lost on the way down and decided to stay.',
  }),
  E('c11_storm_herald', 'The Storm Herald', 66, { type: 'angel', color: '#3a5a8a', accent: '#ffe070', eye: '#ffffff', size: 3, seed: 65 }, {
    boss: true, stats: { hp: 14, mag: 1.3, spd: 1.1, exp: 9, gold: 9, cp: 4 }, weak: ['ice', 'pierce'], resist: { bolt: -1, wind: 0.5 }, poise: 8,
    ai: 'c11_storm_herald', drops: [['haste_anklet', 1], ['swift_fruit', 1]], steal: ['megalixir', 'storm_ring'],
    desc: 'Ardent Vasha, who gave the Hierophant her light because he asked so kindly. She is still announcing his coming.',
  }),

  // ============================================ The Grand Lantern (Lv 64–68)
  E('c11_vesper_knight', 'Vesper Knight', 65, { type: 'knight', color: '#c8c0b0', accent: '#c9a24a', weapon: 'sword', seed: 71 }, {
    stats: { hp: 1.4, str: 1.2, def: 1.4 }, weak: ['bolt', 'blunt'], resist: { light: 0.3, slash: 0.7 }, poise: 5,
    skills: [['e_slash', 3], ['e_cleave', 1], ['e_shell', 1]], drops: [['dawnforged_blade', 0.02], ['x_tonic', 0.05]], steal: ['mega_tonic', 'crown_of_dawn'],
    desc: 'Cassian\'s chosen. They took the Vesper oath: to hold the moment, whatever it costs.',
  }),
  E('c11_dawnguard_elite', 'Dawnguard Elite', 65, { type: 'humanoid', look: 'dawnguard' }, {
    stats: { hp: 1.2, str: 1.15, spd: 1.05 }, weak: ['pierce', 'bolt'], resist: { slash: 0.8 }, poise: 4,
    skills: [['e_spear', 3], ['e_stun', 1], ['e_buff', 1]], drops: [['mega_tonic', 0.15]], steal: ['x_tonic', 'wall_of_dawn'],
    desc: 'The last of Garrick\'s men. They stayed because he stayed.',
  }),
  E('c11_vesper_cantor', 'Vesper Cantor', 64, { type: 'humanoid', look: 'acolyte' }, {
    stats: { hp: 0.95, mag: 1.3, res: 1.3 }, weak: ['slash', 'dark'], resist: { light: 0.3 }, poise: 3,
    skills: [['e_holy', 2], ['e_healall', 1], ['e_sleep', 1]], drops: [['hi_ether', 0.3]], steal: ['x_ether', 'keepers_crown'],
    desc: 'They sing the Vespersong in rounds, to keep the moment warm.',
  }),
  E('c11_bell_golem', 'Bell Golem', 66, { type: 'golem', color: '#c8a050', accent: '#f0e0a0', eye: '#ffffff', seed: 72 }, {
    stats: { hp: 1.7, str: 1.25, def: 1.5, spd: 0.7 }, weak: ['bolt', 'blunt'], resist: { light: 0, slash: 0.5, pierce: 0.5 }, poise: 6,
    skills: [['e_slam', 2], ['e_quake', 1], ['e_doom', 1]], drops: [['power_fruit', 0.05]], steal: ['guard_fruit', 'power_fruit'],
    desc: 'A bell from the City of Bells, given legs and told to toll for the end of time.',
  }),
  E('c11_brask', 'Captain Ivo Brask', 66, { type: 'humanoid', look: 'c11_brask', size: 2 }, {
    boss: true, stats: { hp: 6, str: 1.25, def: 1.2, exp: 5, gold: 6, cp: 3 }, weak: ['pierce', 'bolt'], resist: { slash: 0.7 }, poise: 6,
    ai: 'c11_brask', summons: ['c11_dawnguard_elite'], drops: [['champions_belt', 1]], steal: ['x_tonic', 'mountainfall'],
    desc: 'Garrick\'s second. He has polished the same breastplate every morning for a year, because no one told him to stop.',
  }),
  E('c11_garrick', 'Lord-Commander Garrick', 68, { type: 'humanoid', look: 'garrick', size: 2 }, {
    boss: true, stats: { hp: 15, str: 1.35, def: 1.35, exp: 10, gold: 10, cp: 4 }, weak: ['pierce', 'bolt'], resist: { slash: 0.6, light: 0.5 }, poise: 9,
    ai: 'c11_garrick', summons: ['c11_dawnguard_elite'], drops: [['breakers_gem', 1]], steal: ['megalixir', 'worldcleaver'],
    desc: 'Head of the Dawnguard and Cassian\'s sword. He has seen the world broken, and would rather it frozen.',
  }),
  E('c11_garrick_duel', 'Garrick Thorne', 64, { type: 'humanoid', look: 'garrick', size: 2 }, {
    boss: true, stats: { hp: 5, str: 1.05, def: 1.1, exp: 3, gold: 2, cp: 2 }, weak: ['pierce', 'bolt', 'slash'], resist: {}, poise: 5,
    ai: 'c11_garrick_duel', drops: [], steal: ['x_tonic', 'x_tonic'],
    desc: 'No title now. No soldiers. Just a man with a sword, and another man with a sword.',
  }),
  E('c11_garrick_weary', 'Garrick Thorne', 60, { type: 'humanoid', look: 'garrick', size: 2 }, {
    boss: true, stats: { hp: 3.5, str: 0.9, def: 1.0, exp: 2, gold: 1, cp: 1 }, weak: ['pierce', 'bolt', 'slash'], resist: {}, poise: 3,
    ai: 'c11_garrick_duel', drops: [], steal: ['x_tonic', 'x_tonic'],
    desc: 'He is bleeding. So is Bram. Neither of them is sitting down.',
  }),

  // ============================================ Lanternfall (Lv 66–70)
  E('c11_drowned_memory', 'Drowned Memory', 67, { type: 'ghost', color: '#4a7a9a', eye: '#a0e8ff', seed: 81 }, {
    stats: { hp: 1.1, mag: 1.25, def: 1.5 }, weak: ['light', 'bolt'], resist: { dark: 0, ice: 0.3, slash: 0.6 }, poise: 3,
    skills: [['e_drain', 2], ['e_wail', 1], ['e_frost', 1]], drops: [['sea_glass', 0.6], ['x_ether', 0.05]], steal: ['x_ether', 'sea_charm'],
    desc: 'Something that happened here, once, on an ordinary day. It wants to happen again.',
  }),
  E('c11_gull_wraith', 'Gull Wraith', 66, { type: 'bird', color: '#c8c8d8', accent: '#8a6aff', eye: '#ffe060', seed: 82 }, {
    stats: { hp: 0.9, spd: 1.45 }, weak: ['pierce', 'light'], resist: { dark: 0.5 }, poise: 2,
    skills: [['e_peck', 3], ['e_gust', 1], ['e_blind', 1]], drops: [['eye_drops', 0.4]], steal: ['x_tonic', 'swift_fruit'],
    desc: 'Lanternfall\'s gulls were always bold. They are bolder dead.',
  }),
  E('c11_tidewrack', 'Tidewrack Horror', 68, { type: 'horror', color: '#2a4a5a', accent: '#8a6aff', eye: '#a0e8ff', size: 1.5, seed: 83 }, {
    stats: { hp: 1.6, str: 1.2, mag: 1.2 }, weak: ['light', 'bolt'], resist: { ice: 0, dark: 0.5 }, poise: 5,
    skills: [['e_constrict', 2], ['e_tidal', 1], ['e_darkwave', 1]], drops: [['megalixir', 0.03], ['x_tonic', 0.08]], steal: ['megalixir', 'dusk_ring'],
    desc: 'Everything the sea took from Lanternfall, wound together and come home.',
  }),
  E('c11_lamp_moth', 'Lamplit Moth', 67, { type: 'insect', color: '#f0d080', accent: '#fff4c0', eye: '#2a2a2a', seed: 84 }, {
    stats: { hp: 0.9, mag: 1.2, spd: 1.2, evade: 10 }, weak: ['wind', 'dark'], resist: { light: 0 }, poise: 2,
    skills: [['e_spore', 2], ['e_holy', 2]], drops: [['hi_ether', 0.3]], steal: ['x_ether', 'magic_fruit'],
    desc: 'It has circled the Lantern for a year. It has never once thought of leaving.',
  }),
  E('c11_rock_hound', 'Hound of the Black Rocks', 67, { type: 'hound', color: '#2a3a4a', accent: '#8a6aff', eye: '#b07aff', size: 1.5, seed: 85 }, {
    stats: { hp: 1.4, str: 1.25 }, weak: ['light', 'slash', 'fire'], resist: { dark: 0.3, ice: 0.5 }, poise: 4,
    skills: [['e_bite', 3], ['e_darkwave', 1], ['e_howl', 1]], drops: [['ember_feather', 0.3]], steal: ['dawn_plume', 'phoenix_charm'],
    desc: 'You fought it on the night Sable washed ashore. It remembers you. You were so much smaller.',
  }),
  E('c11_kept_light', 'Kept Light', 66, { type: 'wisp', color: '#ffd070', eye: '#ffffff', seed: 86 }, {
    stats: { hp: 0.7, mag: 1.1, def: 1.6 }, weak: ['dark', 'wind'], resist: { light: -1 }, poise: 2,
    skills: [['e_heal', 2], ['c11_beacon', 1]], drops: [], steal: ['x_ether', 'afterglow_vial'],
    desc: 'A little of the light she could not let go of.',
  }),
  E('c11_keepers_remnant', 'The Keeper\'s Remnant', 70, { type: 'humanoid', look: 'c11_ysolde_remnant', size: 3 }, {
    boss: true, stats: { hp: 14, mag: 1.35, res: 1.3, def: 1.2, exp: 10, gold: 8, cp: 5 }, weak: ['slash', 'wind'], resist: { light: -1, dark: 0.5, ice: 0.5 }, poise: 9,
    ai: 'c11_keepers_remnant', summons: ['c11_kept_light'], drops: [['ribbon', 1]], steal: ['megalixir', 'phoenix_charm'],
    desc: 'Ysolde Halloway, Keeper of Lanternfall, still holding the last light so her daughter can reach the boat.',
  }),

  // ============================================ Rite: the Drowned Reef (Wren, Lv 64–67)
  E('c11_abyss_crab', 'Abyss Crab', 64, { type: 'crab', color: '#4a3a6a', accent: '#c0a0ff', eye: '#ffe060', seed: 91 }, {
    stats: { hp: 1.2, def: 1.8, spd: 0.8 }, weak: ['blunt', 'bolt'], resist: { slash: 0.5, ice: 0.5 }, poise: 4,
    skills: [['attack', 2], ['e_shell', 1], ['e_crush', 1]], drops: [['sea_glass', 0.6]], steal: ['x_tonic', 'guard_fruit'],
    desc: 'It walked the sea floor its whole life. The floor is in the sky now. It keeps walking.',
  }),
  E('c11_sky_jelly', 'Sky Jelly', 65, { type: 'slime', color: '#6ab0d0', eye: '#203040', seed: 92 }, {
    stats: { hp: 1.0, mag: 1.2, def: 0.8, res: 1.4 }, weak: ['bolt', 'fire'], resist: { ice: 0, blunt: 0.6 }, poise: 2,
    skills: [['e_spit', 2], ['e_stun', 1], ['e_mpdrain', 1]], drops: [['hi_ether', 0.3]], steal: ['x_ether', 'sea_charm'],
    desc: 'It drifts above the reef, pulsing like a slow heart.',
  }),
  E('c11_wreck_eel', 'Wreck Eel', 65, { type: 'serpent', color: '#3a6a5a', accent: '#a0e0c0', eye: '#f0f060', seed: 93 }, {
    stats: { hp: 1.2, str: 1.15, mag: 1.15 }, weak: ['bolt', 'slash'], resist: { ice: 0.3 }, poise: 3,
    skills: [['e_bite', 2], ['e_constrict', 2], ['e_tidal', 1]], drops: [['mega_tonic', 0.15]], steal: ['mega_tonic', 'power_fruit'],
    desc: 'It nests in the ribs of drowned ships.',
  }),
  E('c11_undertow', 'The Undertow', 67, { type: 'serpent', color: '#1a3a5a', accent: '#8ac0ff', eye: '#ffffff', size: 4, seed: 94 }, {
    boss: true, stats: { hp: 14, str: 1.2, mag: 1.3, exp: 9, gold: 9, cp: 4 }, weak: ['bolt', 'slash'], resist: { ice: 0, fire: 0.5 }, poise: 8,
    ai: 'c11_undertow', drops: [['power_fruit', 2]], steal: ['megalixir', 'sea_charm'],
    desc: 'The storm that took Edrin Halloway, remembered by the sea that it happened in.',
  }),

  // ============================================ Rite: the Drowned Infirmary (Ilse, Lv 61–63)
  E('c11_fever_wraith', 'Fever Wraith', 61, { type: 'ghost', color: '#c8b0a0', eye: '#ff6040', seed: 101 }, {
    stats: { hp: 0.95, mag: 1.25, def: 1.8 }, weak: ['light', 'ice'], resist: { fire: 0, slash: 0.6 }, poise: 3,
    skills: [['e_ember', 2], ['e_sleep', 1], ['e_drain', 1]], drops: [['burn_salve', 0.4]], steal: ['panacea', 'wake_charm'],
    desc: 'A fever that broke, a year too late.',
  }),
  E('c11_linen_shroud', 'Linen Shroud', 62, { type: 'ghost', color: '#e8e4dc', eye: '#2a2a2a', seed: 102 }, {
    stats: { hp: 1.0, mag: 1.1, def: 1.6, evade: 8 }, weak: ['fire', 'slash'], resist: { blunt: 0.5, dark: 0.5 }, poise: 3,
    skills: [['e_constrict', 2], ['e_wail', 1], ['e_sleep', 1]], drops: [['tonic_mist', 0.2]], steal: ['tonic_mist', 'spirit_fruit'],
    desc: 'Clean sheets. Folded corners. Something still lying in them.',
  }),
  E('c11_matron', 'The Matron of Ash', 63, { type: 'humanoid', look: 'c11_matron', size: 2 }, {
    boss: true, stats: { hp: 11, mag: 1.3, res: 1.3, exp: 8, gold: 6, cp: 4 }, weak: ['light', 'pierce'], resist: { dark: 0.3 }, poise: 7,
    ai: 'c11_matron', summons: ['c11_fever_wraith'], drops: [['spirit_fruit', 2]], steal: ['megalixir', 'focus_pendant'],
    desc: 'Every long night on every ward, given a voice. It sounds exactly like Ilse on her worst day.',
  }),

  // ============================================ Rite: the Vigil Hall (Bram, Lv 62–64)
  E('c11_vigil_knight', 'Vigil Knight', 63, { type: 'knight', color: '#a9b3c2', accent: '#c03a3a', weapon: 'greatsword', seed: 111 }, {
    stats: { hp: 1.3, str: 1.2, def: 1.4 }, weak: ['blunt', 'bolt'], resist: { slash: 0.6, pierce: 0.7 }, poise: 5,
    skills: [['e_slash', 3], ['e_cleave', 1], ['e_stun', 1]], drops: [['guard_fruit', 0.04]], steal: ['x_tonic', 'crown_of_dawn'],
    desc: 'Every knight who ever stood the vigil here left a little of themselves in the stone. It stands up to see if you are worthy.',
  }),
  E('c11_squire_shade', 'Squire\'s Shade', 62, { type: 'ghost', color: '#a08060', eye: '#ffe060', seed: 112 }, {
    stats: { hp: 0.9, str: 1.1, spd: 1.2 }, weak: ['light', 'fire'], resist: { dark: 0.4 }, poise: 2,
    skills: [['e_wail', 2], ['attack', 2], ['e_blind', 1]], drops: [['ember_feather', 0.2]], steal: ['ember_feather', 'swift_fruit'],
    desc: 'The squires who failed the vigil. They are not angry. Only cold.',
  }),
  E('c11_dread', 'The Dread', 64, { type: 'horror', color: '#2a1a2a', accent: '#c03a3a', eye: '#ff3030', size: 4, seed: 113 }, {
    boss: true, stats: { hp: 13, str: 1.3, exp: 8, gold: 6, cp: 4 }, weak: ['light', 'blunt'], resist: { dark: 0, slash: 0.7 }, poise: 8,
    ai: 'c11_dread', drops: [['guard_fruit', 2]], steal: ['megalixir', 'champions_belt'],
    desc: 'The thing Bram saw on the night of his trial. It was never in the hall. It was in him.',
  }),

  // ============================================ Rite: Scrapfall (Pip, Lv 59–61)
  E('c11_scrap_golem', 'Scrap Golem', 60, { type: 'golem', color: '#8a6a4a', accent: '#c8a050', eye: '#ff8040', seed: 121 }, {
    stats: { hp: 1.5, str: 1.2, def: 1.5, spd: 0.75 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5, pierce: 0.6 }, poise: 5,
    skills: [['e_slam', 2], ['e_rampage', 1], ['e_shell', 1]], drops: [['scrap_gear', 0.6]], steal: ['scrap_gear', 'power_fruit'],
    desc: 'Somebody\'s stove, somebody\'s fence and somebody\'s grandmother\'s mangle, walking.',
  }),
  E('c11_junk_mimic', 'Junk Mimic', 61, { type: 'mimic', color: '#7a5a3a', accent: '#c8a050', eye: '#ff4040', seed: 122 }, {
    stats: { hp: 1.2, str: 1.3, spd: 1.1 }, weak: ['pierce', 'fire'], resist: { blunt: 0.6 }, poise: 4,
    skills: [['e_bite', 3], ['e_steal', 2]], drops: [['lucky_coin', 0.03], ['x_tonic', 0.1]], steal: ['x_tonic', 'thiefs_glove'],
    desc: 'It is a crate. It is a crate with teeth. Do not open the crate with teeth.',
  }),
  E('c11_scrap_rook', 'Scrap Rook', 59, { type: 'bird', color: '#2a2a34', accent: '#c8a050', eye: '#ffe060', seed: 123 }, {
    stats: { hp: 0.8, spd: 1.45 }, weak: ['pierce', 'wind'], poise: 2,
    skills: [['e_peck', 3], ['e_steal', 2]], drops: [['scrap_gear', 0.3]], steal: ['scrap_gear', 'swift_fruit'],
    desc: 'It steals buttons, rings, buckles and, given the chance, eyes.',
  }),
  E('c11_rook_queen', 'The Rook Queen', 61, { type: 'bird', color: '#1a1a24', accent: '#e0c050', eye: '#ff4040', size: 3, seed: 124 }, {
    boss: true, stats: { hp: 11, str: 1.2, spd: 1.2, exp: 8, gold: 10, cp: 4 }, weak: ['pierce', 'wind'], resist: { dark: 0.5 }, poise: 7,
    ai: 'c11_rook_queen', summons: ['c11_scrap_rook'], drops: [['thiefs_glove', 1]], steal: ['megalixir', 'lucky_coin'],
    desc: 'Queen of Scrapfall, the best thief in the sky. Until about five minutes ago.',
  }),

  // ============================================ Rite: the Stormwall (Corvin, Lv 64–66)
  E('c11_squall_king', 'The Squall King', 66, { type: 'drake', color: '#2a3a5a', accent: '#a0d0ff', eye: '#ffffff', size: 4, seed: 131 }, {
    boss: true, stats: { hp: 14, str: 1.2, mag: 1.3, exp: 9, gold: 9, cp: 4 }, weak: ['ice', 'pierce'], resist: { bolt: -1, wind: 0.3 }, poise: 8,
    ai: 'c11_squall_king', drops: [['storm_ring', 1], ['swift_fruit', 1]], steal: ['megalixir', 'storm_ring'],
    desc: 'The Stormwall\'s heart. It has eaten twelve airships. It would like a thirteenth.',
  }),
  E('c11_gunner', 'Kingfisher Gunner', 64, { type: 'humanoid', look: 'c11_gunner' }, {
    stats: { hp: 1.0, str: 1.2, spd: 1.1 }, weak: ['light', 'bolt'], resist: { dark: 0.4 }, poise: 3,
    skills: [['e_arrow', 3], ['e_volley', 1]], drops: [['x_tonic', 0.08]], steal: ['mega_tonic', 'last_word'],
    desc: 'The Kingfisher\'s crew never left their guns. Nobody told them the battle was over.',
  }),

  // ============================================ Rite: the Gloam Rift (Sable, Lv 64–66)
  E('c11_forgotten', 'The Forgotten', 64, { type: 'ghost', color: '#5a4a7a', eye: '#ffffff', seed: 141 }, {
    stats: { hp: 1.0, mag: 1.25, def: 1.8 }, weak: ['light', 'fire'], resist: { dark: -1, slash: 0.6 }, poise: 3,
    skills: [['e_dark', 2], ['c11_forget', 1], ['e_wail', 1]], drops: [['gloam_dust', 0.6]], steal: ['gloam_shard', 'x_ether'],
    desc: 'Someone nobody remembers anymore. It does not remember either.',
  }),
  E('c11_gloam_shade', 'Gloam Shade', 65, { type: 'horror', color: '#3a2a5a', accent: '#b07aff', eye: '#ff80ff', size: 1.5, seed: 142 }, {
    stats: { hp: 1.5, str: 1.2, mag: 1.2 }, weak: ['light'], resist: { dark: 0 }, poise: 4,
    skills: [['e_claw', 2], ['e_darkwave', 1], ['e_doom', 0.5]], drops: [['gloam_shard', 0.2]], steal: ['gloam_shard', 'dusk_ring'],
    desc: 'The Gloam, when it tries to be someone.',
  }),
  E('c11_unremembered', 'The Unremembered', 66, { type: 'horror', color: '#1a1030', accent: '#b07aff', eye: '#ffffff', size: 4, seed: 143 }, {
    boss: true, stats: { hp: 14, mag: 1.35, res: 1.2, exp: 9, gold: 6, cp: 4 }, weak: ['light', 'fire'], resist: { dark: -1, ice: 0.5 }, poise: 8,
    ai: 'c11_unremembered', summons: ['c11_forgotten'], drops: [['magic_fruit', 2]], steal: ['megalixir', 'archmage_ring'],
    desc: 'Every forgotten thing the Gloam ever kept, wanting one more thing to keep.',
  }),

  // ============================================ Starseer: the Fallen Star (optional, Lv 72)
  E('c11_fallen_star', 'The Fallen Star', 72, { type: 'elemental', color: '#fff0c0', accent: '#a0d0ff', eye: '#ffffff', size: 3, seed: 151 }, {
    boss: true, stats: { hp: 20, mag: 1.4, res: 1.3, spd: 1.1, exp: 12, gold: 12, cp: 6 }, weak: ['dark', 'ice'], resist: { light: -1, fire: 0.3 }, poise: 10,
    ai: 'c11_fallen_star', drops: [['crest_brooch', 1], ['megalixir', 1]], steal: ['megalixir', 'scholars_monocle'],
    desc: 'A star that came too close, to see what all the fuss was about.',
  }),
];

// ------------------------------------------------------------------ troops
const T = (enemies, opts = {}) => ({ enemies, ...opts });
const boss = (enemies, bg, opts = {}) => T(enemies, { boss: true, music: 'boss', canFlee: false, bg, ...opts });
const troops = {
  c11_sg_wyrms: T(['c11_glasswyrm', 'c11_glasswyrm']),
  c11_sg_choir: T(['c11_choir_husk', 'c11_mirage', 'c11_choir_husk']),
  c11_sg_scuttle: T(['c11_scuttler', 'c11_scuttler', 'c11_mirage']),
  c11_sg_mix: T(['c11_glasswyrm', 'c11_choir_husk']),
  c11_sg_bells: T(['c11_choir_husk', 'c11_choir_husk', 'c11_choir_husk', 'c11_mirage']),
  c11_boss_choir: boss(['c11_blind_choir'], 'desert'),

  c11_fh_stalkers: T(['c11_snow_stalker', 'c11_snow_stalker', 'c11_snow_stalker']),
  c11_fh_monks: T(['c11_rime_monk', 'c11_rime_monk']),
  c11_fh_wraith: T(['c11_avalanche_wraith', 'c11_snow_stalker']),
  c11_fh_mix: T(['c11_rime_monk', 'c11_avalanche_wraith', 'c11_snow_stalker']),
  c11_fh_golem: T(['c11_glacier_golem', 'c11_rime_monk'], { canFlee: false }),
  c11_boss_penitence: boss(['c11_frozen_penitence'], 'snow'),

  c11_mf_leeches: T(['c11_rot_leech', 'c11_rot_leech', 'c11_mire_mite']),
  c11_mf_caps: T(['c11_bogcap', 'c11_bogcap']),
  c11_mf_lurker: T(['c11_stilt_lurker', 'c11_rot_leech']),
  c11_mf_mix: T(['c11_mire_mite', 'c11_bogcap', 'c11_mire_mite']),
  c11_boss_mother: boss(['c11_rot_child', 'c11_mire_mother', 'c11_rot_child'], 'swamp'),

  c11_tw_bark: T(['c11_witherbark', 'c11_briar_hound']),
  c11_tw_hounds: T(['c11_briar_hound', 'c11_briar_hound', 'c11_briar_hound']),
  c11_tw_moths: T(['c11_dusk_moth', 'c11_dusk_moth', 'c11_faded_sprite']),
  c11_tw_mix: T(['c11_faded_sprite', 'c11_witherbark']),
  c11_boss_bloom: boss(['c11_withered_bloom'], 'verdance'),

  c11_sr_drakes: T(['c11_squall_drake', 'c11_thunderhawk']),
  c11_sr_hawks: T(['c11_thunderhawk', 'c11_thunderhawk', 'c11_static_wisp']),
  c11_sr_sentinel: T(['c11_sky_sentinel', 'c11_static_wisp']),
  c11_sr_mix: T(['c11_sky_sentinel', 'c11_squall_drake']),
  c11_sr_rod: T(['c11_static_wisp', 'c11_squall_drake', 'c11_static_wisp'], { canFlee: false }),
  c11_boss_herald: boss(['c11_storm_herald'], 'sky', { mood: 'storm' }),

  c11_gl_knights: T(['c11_vesper_knight', 'c11_vesper_cantor']),
  c11_gl_elites: T(['c11_dawnguard_elite', 'c11_dawnguard_elite', 'c11_vesper_cantor']),
  c11_gl_bell: T(['c11_bell_golem', 'c11_vesper_cantor']),
  c11_gl_mix: T(['c11_vesper_knight', 'c11_dawnguard_elite']),
  c11_boss_brask: boss(['c11_dawnguard_elite', 'c11_brask'], 'temple'),
  c11_boss_garrick: boss(['c11_dawnguard_elite', 'c11_garrick', 'c11_dawnguard_elite'], 'temple'),
  c11_duel_garrick: boss(['c11_garrick_duel'], 'temple', { music: 'tension' }),
  c11_duel_weary: boss(['c11_garrick_weary'], 'temple', { music: 'tension' }),

  c11_lf_memories: T(['c11_drowned_memory', 'c11_drowned_memory']),
  c11_lf_gulls: T(['c11_gull_wraith', 'c11_gull_wraith', 'c11_gull_wraith']),
  c11_lf_wrack: T(['c11_tidewrack', 'c11_drowned_memory']),
  c11_lf_moths: T(['c11_lamp_moth', 'c11_lamp_moth', 'c11_gull_wraith']),
  c11_lf_well: T(['c11_drowned_memory', 'c11_tidewrack', 'c11_drowned_memory'], { canFlee: false }),
  c11_lf_hound: T(['c11_rock_hound', 'c11_rock_hound'], { canFlee: false, music: 'boss' }),
  c11_boss_keeper: boss(['c11_keepers_remnant'], 'lantern', { music: 'finalboss', mood: 'gloam' }),

  c11_rf_crabs: T(['c11_abyss_crab', 'c11_abyss_crab']),
  c11_rf_jelly: T(['c11_sky_jelly', 'c11_sky_jelly', 'c11_wreck_eel']),
  c11_rf_mix: T(['c11_wreck_eel', 'c11_abyss_crab', 'c11_sky_jelly']),
  c11_boss_undertow: boss(['c11_undertow'], 'beach_night'),

  c11_inf_fever: T(['c11_fever_wraith', 'c11_linen_shroud']),
  c11_inf_shrouds: T(['c11_linen_shroud', 'c11_linen_shroud', 'c11_rot_leech']),
  c11_boss_matron: boss(['c11_matron'], 'undercroft'),

  c11_vg_wave1: T(['c11_squire_shade', 'c11_vigil_knight', 'c11_squire_shade'], { canFlee: false }),
  c11_vg_wave2: T(['c11_vigil_knight', 'c11_vigil_knight'], { canFlee: false }),
  c11_vg_snow: T(['c11_snow_stalker', 'c11_squire_shade']),
  c11_boss_dread: boss(['c11_dread'], 'temple'),

  c11_sf_golems: T(['c11_scrap_golem', 'c11_scrap_rook']),
  c11_sf_rooks: T(['c11_scrap_rook', 'c11_scrap_rook', 'c11_scrap_rook']),
  c11_sf_mimic: T(['c11_junk_mimic', 'c11_scrap_rook']),
  c11_boss_queen: boss(['c11_scrap_rook', 'c11_rook_queen', 'c11_scrap_rook'], 'ruin'),

  c11_boss_squall: boss(['c11_squall_king'], 'deck', { mood: 'storm' }),
  c11_sw_gunners: T(['c11_gunner', 'c11_gunner', 'c11_static_wisp'], { canFlee: false }),

  c11_rift_forgotten: T(['c11_forgotten', 'c11_forgotten', 'c11_forgotten']),
  c11_rift_shades: T(['c11_gloam_shade', 'c11_forgotten']),
  c11_boss_unremembered: boss(['c11_unremembered'], 'gloam'),

  c11_boss_star: boss(['c11_fallen_star'], 'sky', { music: 'finalboss', mood: 'night' }),
};

// ------------------------------------------------------------------ boss AI
// Each Remnant has one rule the party must learn: the Choir silences, the
// Penitence freezes the turn order, the Mother feeds her brood, the Bloom drains,
// the Herald builds a storm you can watch coming, the Keeper calls Wren home.
const findWren = (c) => c.partyAlive.find((p) => p.id === 'wren');
const bossAI = {
  c11_blind_choir(c) {
    const voices = c.allies.filter((a) => a.def.id === 'c11_choir_voice').length;
    if (c.turn === 1) { c.say('The Choir opens a hundred mouths. Other voices answer from the glass.'); return c.use('e_summon'); }
    if (c.m.charging) { c.m.charging = false; return c.use('c11_glass_requiem'); }
    if (c.hpPct < 0.5 && c.once('blindfold')) { c.say('"I can hear your heart, little thief. It is beating much too fast."'); return c.use('e_summon'); }
    if (c.turn % 5 === 0) { c.m.charging = true; c.say('The Choir draws one long breath together...'); return c.use('e_charge'); }
    if (!voices && c.turn % 3 === 0) return c.use('e_summon');
    if (voices && c.turn % 3 === 1) { c.say('"Hush now. Listen."'); return c.use('c11_hush'); }
    return c.pick([['e_holy', 3], ['e_holyall', 1], ['c11_hush', voices ? 1 : 0.3]]);
  },
  c11_frozen_penitence(c) {
    if (c.m.charging) { c.m.charging = false; return c.use('c11_penance'); }
    if (c.hpPct < 0.6 && c.once('shell')) { c.say('Frost climbs his robes like a second skin.'); return c.use('c11_rime_shell'); }
    if (c.hpPct < 0.35 && c.once('crack')) { c.say('"I should have said it the first day. Four words. _This fork is wrong._"'); c.m.charging = true; return c.use('e_charge'); }
    if (c.turn % 4 === 2) { c.say('The air goes still. Even your heartbeat waits its turn.'); return c.use('e_stillness'); }
    if (c.turn % 4 === 0) return c.use('c11_frost_bind');
    return c.pick([['c11_penance', 2], ['e_frost', 3], ['e_icebreath', 1]]);
  },
  c11_mire_mother(c) {
    const brood = c.allies.filter((a) => a.def.id === 'c11_rot_child');
    if (!brood.length) { c.say('"Where are my little ones? Come back to Mother!"'); return c.use('e_summon'); }
    const hurt = c.allies.some((a) => a.hp < a.maxHp * 0.7) || c.hpPct < 0.85;
    if (hurt && c.turn % 2 === 0) { c.say('"Hush, hush. Mother\'s here. Nobody dies in Mirefen."'); return c.use('c11_embrace'); }
    if (c.hpPct < 0.4 && c.once('feed')) { c.say('She draws her brood close, and swells.'); return c.use('e_summon'); }
    return c.pick([['c11_rotwater', 2], ['e_drain', 2], ['e_poison', 1]]);
  },
  c11_withered_bloom(c) {
    if (c.m.charging) { c.m.charging = false; return c.use('c11_wither'); }
    if (c.turn % 4 === 3) { c.m.charging = true; c.say('The petals turn toward you, slowly, like a face toward the sun.'); return c.use('e_charge'); }
    if (c.hpPct < 0.5 && c.once('pollen')) { c.say('"Sleep, children. I remember summers that lasted a hundred years."'); return c.use('c11_pollen'); }
    if (c.hpPct < 0.5 && c.turn % 3 === 0) return c.use('c11_pollen');
    return c.pick([['e_drain', 3], ['e_mpdrain', 2], ['c11_wither', 1], ['e_constrict', 1]]);
  },
  c11_storm_herald(c) {
    c.m.storm = c.m.storm || 0;
    if (c.m.storm >= 3) { c.m.storm = 0; c.say('"HEAR ME! THE NOON IS COMING!" The storm breaks over you.'); return c.use('c11_stormcrown'); }
    if (c.turn % 2 === 1) {
      c.m.storm++;
      c.say(c.m.storm === 3 ? 'The storm crowns her. Lightning hangs in the air, waiting. (3/3)' : `The Herald gathers the storm... (${c.m.storm}/3)`);
      return c.m.storm === 3 ? c.use('e_charge') : c.use('c11_static');
    }
    if (c.hpPct < 0.4 && c.once('gave')) c.say('"I gave it to him. I gave it to him. I _gave_ it—"');
    return c.pick([['e_spark', 3], ['e_thunder', 1], ['e_gust', 2]]);
  },
  c11_brask(c) {
    if (c.hpPct < 0.5 && c.once('rally')) { c.say('"Dawnguard! To me!"'); return c.use('e_summon'); }
    if (c.turn % 3 === 0) return c.use('e_cleave');
    return c.pick([['e_slash', 3], ['e_stun', 1], ['e_buff', 1]]);
  },
  c11_garrick(c) {
    if (c.m.charging) { c.m.charging = false; return c.use('c11_execution'); }
    if (c.turn === 1) { c.say('"Form up. This won\'t take long."'); return c.use('e_buff'); }
    if (c.hpPct < 0.4 && c.once('rally')) { c.say('"Dawnguard! Hold the line!"'); return c.use('e_summon'); }
    if (c.turn % 4 === 3) { c.m.charging = true; c.say('Garrick lifts his greatsword overhead and waits for an opening.'); return c.use('e_charge'); }
    if (c.turn % 3 === 0) return c.use('c11_oathbreaker');
    return c.pick([['e_slash', 3], ['e_crush', 1], ['e_stun', 1]]);
  },
  c11_garrick_duel(c) {
    if (c.m.charging) { c.m.charging = false; return c.use('e_crush'); }
    if (c.turn % 3 === 0) { c.m.charging = true; c.say('Garrick sets his feet. "Freeze, boy. You always do."'); return c.use('e_charge'); }
    return c.pick([['e_slash', 3], ['attack', 2]]);
  },
  c11_keepers_remnant(c) {
    const wren = findWren(c);
    if (c.m.charging) { c.m.charging = false; return c.use('c11_last_light'); }
    if (c.turn === 1) { c.say('"Come inside, little bird. It\'s getting dark."'); return c.use('c11_vigil'); }
    if (c.hpPct < 0.3 && c.once('hold')) { c.say('She holds the moment. She has been holding it for a year.'); return c.use('e_stillness'); }
    if (c.hpPct < 0.6 && c.once('flare')) { c.say('The Lantern flares behind her. The whole room turns gold.'); return c.use('e_summon'); }
    if (c.hpPct < 0.6 && c.turn % 4 === 0) { c.m.charging = true; c.say('The lamp gathers itself, the way it did every dusk for two hundred years...'); return c.use('e_charge'); }
    if (wren && c.turn % 5 === 3) { c.say('"Wren. Come home."'); return c.use('c11_little_bird', [wren]); }
    if (c.hpPct < 0.3) return c.pick([['e_lament', 2], ['e_tidal', 2], ['c11_beacon', 2]]);
    return c.pick([['c11_beacon', 3], ['e_tidal', 2], ['e_holyall', 1]]);
  },
  c11_undertow(c) {
    if (c.m.charging) { c.m.charging = false; return c.use('e_tidal'); }
    if (c.turn % 4 === 2) { c.m.charging = true; c.say('The sky-water draws back, the way the sea did on the night of the storm...'); return c.use('e_charge'); }
    if (c.hpPct < 0.5 && c.once('pull')) { c.say('The Undertow pulls. Everything slows.'); return c.use('c11_undertow'); }
    return c.pick([['e_constrict', 2], ['e_bite', 2], ['c11_undertow', 1], ['e_spit', 1]]);
  },
  c11_matron(c) {
    if (c.turn === 1) { c.say('"Bed rest. Doctor\'s orders. You look exhausted."'); return c.use('c11_bedrest'); }
    if (c.hpPct < 0.5 && c.once('night')) { c.say('"Night shift. Everyone up. Nobody sleeps on my ward."'); return c.use('e_summon'); }
    if (c.turn % 3 === 0) return c.use('c11_bedrest');
    return c.pick([['c11_triage', 3], ['e_drain', 1], ['e_healall', c.hpPct < 0.5 ? 1 : 0.2]]);
  },
  c11_dread(c) {
    if (c.m.charging) { c.m.charging = false; return c.use('e_crush'); }
    if (c.turn % 4 === 1) { c.say('It looks at you, and your hands stop working.'); return c.use('c11_paralysis'); }
    if (c.turn % 4 === 3) { c.m.charging = true; c.say('The Dread rises over Bram. _You will freeze again._'); return c.use('e_charge'); }
    return c.pick([['e_claw', 3], ['e_darkwave', 1], ['e_wail', 1]]);
  },
  c11_rook_queen(c) {
    const rooks = c.allies.filter((a) => a.def.id === 'c11_scrap_rook').length;
    if (rooks < 2 && c.turn % 3 === 0) { c.say('"MINE! All of it, MINE!"'); return c.use('e_summon'); }
    if (c.turn % 4 === 1) return c.use('c11_shriek');
    return c.pick([['e_peck', 3], ['e_steal', 2], ['e_gust', 1]]);
  },
  c11_squall_king(c) {
    if (c.m.charging) { c.m.charging = false; return c.use('e_thunder'); }
    if (c.turn % 3 === 2) { c.m.charging = true; c.say('The Squall King swallows the lightning. The deck hums under your feet...'); return c.use('e_charge'); }
    return c.pick([['e_bite', 2], ['e_gust', 2], ['e_spark', 2]]);
  },
  c11_unremembered(c) {
    if (c.turn === 1) { c.say('"You are made of us. Come home. Be no one again."'); return c.use('e_summon'); }
    if (c.turn % 4 === 0) return c.use('c11_forget');
    if (c.allies.length < 2 && c.turn % 3 === 0) return c.use('e_summon');
    return c.pick([['e_darkwave', 2], ['e_dark', 2], ['e_doom', 0.6]]);
  },
  c11_fallen_star(c) {
    if (c.m.charging) { c.m.charging = false; return c.use('c11_starfall'); }
    if (c.turn % 3 === 0) { c.m.charging = true; c.say('The Fallen Star burns whiter. Every shadow in the room points away from it...'); return c.use('e_charge'); }
    if (c.hpPct < 0.5 && c.once('nova')) { c.say('It flickers, and for a moment you can see right through it to the dark.'); return c.use('e_stillness'); }
    return c.pick([['e_holy', 3], ['e_holyall', 1], ['e_bigbreath', 1]]);
  },
};

// ------------------------------------------------------------------ shops & world
const SHOPS = {
  c11_drift: {
    name: 'Mags\'s Drift Market',
    items: ['mega_tonic', 'x_tonic', 'x_ether', 'panacea', 'dawn_plume', 'tonic_mist', 'bedroll', 'holy_water', 'frost_bomb', 'bolt_bomb',
      'dusk_ring', 'hunters_eye', 'feather_cape', 'swift_boots', 'vigor_bangle', 'focus_pendant',
      ...gearOfTier(8, (e) => e.slot !== 'accessory')],
  },
};

const node = (id, name, region, x, y, mapId, tx, ty, desc, unlock = 'act3', dir = 'up') =>
  ({ id, name, region, act: 2, x, y, mapId, tx, ty, dir, unlock, desc });
const worldNodes = [
  node('c11_halcyon', 'The Halcyon', 'Wherever Corvin parked her', 430, 300, 'halcyon_deck', 12, 8, 'Home, for now. It leaks.', 'act3', 'down'),
  node('c11_saltglass', 'Saltglass', 'The Sunscar Shards', 600, 650, 'c11_saltglass', 19, 40, 'The Glass Steps. A choir sings in the dead Lantern. (Danger: Lv 58)'),
  node('c11_frosthollow', 'Frosthollow', 'The Greyspine', 560, 170, 'c11_frosthollow', 19, 40, 'Brother Halvard\'s monastery, frozen to the peak. (Danger: Lv 60)'),
  node('c11_mirefen', 'Mirefen', 'The Rotting Lake', 770, 570, 'c11_mirefen', 19, 40, 'Mother Osk\'s drowned village. (Danger: Lv 61)'),
  node('c11_thornwood', 'Thornwood', 'Verdance', 830, 320, 'c11_thornwood', 19, 40, 'Elowen\'s forest, withering from the crown down. (Danger: Lv 63)'),
  node('c11_skyreach', 'Skyreach', 'Stormcrown', 700, 110, 'c11_skyreach', 19, 40, 'Ardent Vasha\'s aerie, inside a storm that never ends. (Danger: Lv 65)'),
  node('c11_grand', 'The Grand Lantern', 'Aurenne', 540, 395, 'c11_grand_nave', 19, 40, 'The Cathedral of Dawn. Garrick holds it for Cassian. (Danger: Lv 67)', 'c11_grand_open'),
  node('c11_lanternfall', 'Lanternfall', 'The Westmost Isle', 90, 520, 'c11_lf_ruins', 23, 33, 'The only Lantern in the world still burning. (Danger: Lv 69)', 'c11_lf_open'),
  node('c11_orrery', 'The Orrery', 'Adrift', 320, 150, 'c11_orrery', 12, 22, 'A brass observatory on a rock that wandered off. Someone is still home.'),
  node('c11_reef', 'The Drowned Reef', 'The Old Western Sea', 190, 610, 'c11_reef', 17, 34, 'The sea floor, risen. Every ship the sea ever took. (Danger: Lv 66)', 'c11_reef_open'),
  node('c11_scrapfall', 'Scrapfall', 'Below Kiteholm', 380, 560, 'c11_scrapfall', 16, 30, 'Where Kiteholm\'s rubbish goes. Something lives on it. (Danger: Lv 60)', 'c11_scrap_open'),
  node('c11_vigil', 'The Vigil Hall', 'The Greyspine', 470, 120, 'c11_vigil', 12, 31, 'Where Dawnguard squires stood their last night before knighthood. (Danger: Lv 63)', 'c11_vigil_open'),
];

export default {
  maps: [...HALCYON_MAPS, ...REMNANT_MAPS, ...RITE_MAPS],
  enemies, troops, looks, bossAI, shops: SHOPS, worldNodes,
};
