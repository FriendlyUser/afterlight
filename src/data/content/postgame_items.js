// Post-game gear, looks and the salvage shop. Unique equipment is added to the
// shared tables at module load (see docs/AUTHORING.md §8).

import { EQUIPMENT } from '../equipment.js';
import { LOOKS } from '../looks.js';

const gear = (id, def) => { EQUIPMENT[id] = { id, tier: 9, price: 0, ...def }; };
const allPct = (n) => ({ hpPct: n, mpPct: n, strPct: n, magPct: n, defPct: n, resPct: n, spdPct: n, lckPct: n });

// ------------------------------------------------------------------ accessories
gear('pg_abyss_heart', { name: 'Abyssal Heart', slot: 'accessory', resist: { dark: -1 }, mods: { hpPct: 10 }, desc: 'Absorbs dark damage. Max HP +10%. It beats slowly, out of time with yours.' });
gear('pg_rimeglass_band', { name: 'Rimeglass Band', slot: 'accessory', resist: { ice: 0, fire: 0.5 }, desc: 'Nullifies ice, halves fire. Frozen from the first winter\'s last snowflake.' });
gear('pg_noonless_veil', { name: 'Noonless Veil', slot: 'accessory', immune: ['doom', 'slow', 'stun', 'blind'], mods: { evade: 8 }, desc: 'Immune to Doom, Slow, Stun and Blind. Evasion +8%. Woven from a light that never decided to be day.' });
gear('pg_tally_lens', { name: 'Tallykeeper\'s Lens', slot: 'accessory', flags: ['autoScan'], mods: { crit: 8 }, desc: 'Always see foes\' HP and weaknesses. Critical rate +8%. Orrin\'s spare reading glass.' });
gear('pg_tally_book', { name: 'The Underkeeper\'s Tally', slot: 'accessory', mods: allPct(8), desc: 'All stats +8%. Every name you ever learned, written down and carried.' });
gear('pg_kindling_lamp', { name: 'Kindling Lamp', slot: 'accessory', mods: { cpPct: 100 }, desc: 'CP gain doubled. A pocket lamp lit at the Nadir Light, for choosing who you are next.' });
gear('pg_many_lights', { name: 'Many Lights', slot: 'accessory', mods: { ...allPct(12), afterglow: 25 }, desc: 'All stats +12%, Afterglow +25%. One Crest, one life? Not you. Not ever.' });
gear('pg_chalk_stub', { name: 'Lysa\'s Chalk', slot: 'accessory', autoStatus: ['veil'], immune: ['doom', 'charm'], mods: { evade: 10 }, desc: 'Start battles Veiled. Immune to Doom and Charm. Evasion +10%. For drawing doors, in case you ever need one.' });
gear('pg_echo_laurel', { name: 'Echo Laurel', slot: 'accessory', mods: { strPct: 15, magPct: 15, defPct: 15, resPct: 15, spdPct: 10 }, desc: 'STR, MAG, DEF and RES +15%, SPD +10%. Champion of the Echo Colosseum. You beat yourself. Literally.' });

// ------------------------------------------------------------------ unique arms and armour
gear('pg_before_blade', { name: 'Blade of Before', slot: 'weapon', wtype: 'greatsword', atk: 228, spd: -2, elem: 'light', mods: { crit: 8 }, desc: 'Greatsword. Light-aligned. Forged from an edge the First Dark never had.' });
gear('pg_unwritten', { name: 'The Unwritten', slot: 'weapon', wtype: 'tome', atk: 70, mag: 212, mods: { mpCost: -15 }, desc: 'Tome. MP costs -15%. Every page is blank until you need it.' });
gear('pg_last_lamplight', { name: 'Last Lamplight', slot: 'weapon', wtype: 'staff', atk: 110, mag: 190, mods: { healPct: 25 }, desc: 'Staff. Healing +25%. The Ashen Lamplighter\'s pole, finally put to use.' });
gear('pg_dusk_mantle', { name: 'Dusk Mantle', slot: 'body', armor: 'light', def: 96, res: 88, resist: { dark: 0.5 }, mods: { evade: 6 }, desc: 'Light armor. Halves dark damage. The color of the sky an hour after sunset.' });
gear('pg_first_crown', { name: 'Crown of the First Winter', slot: 'head', armor: 'robe', def: 40, res: 72, mag: 28, immune: ['silence'], desc: 'Robe headgear. Immune to Silence. The Rime Sovereign wore it for a kingdom of no one.' });

// ------------------------------------------------------------------ looks
const hollow = (base, id, main) => ({
  ...LOOKS[base], id, skin: '#a8a2b8', eyes: '#f0f0ff', blush: false,
  hair: { ...LOOKS[base].hair, color: '#2a2438' },
  outfit: { ...LOOKS[base].outfit, main, accent: '#8a849a', trim: '#4a4458' },
});

export const LOOK_DEFS = {
  orrin: {
    id: 'orrin', skin: '#d9a57c', hair: { style: 'bald', color: '#d8d4cc' }, eyes: '#4a6a8a',
    outfit: { style: 'robe', main: '#2a3448', accent: '#d8c8a0', trim: '#c9a24a' }, acc: ['beard', 'glasses'], weapon: 'staff', build: 'adult',
  },
  dace: {
    id: 'dace', skin: '#e9c09a', hair: { style: 'short', color: '#2a1a1a' }, eyes: '#3a2a1a',
    outfit: { style: 'coat', main: '#8a2a3a', accent: '#e8d8a0', trim: '#d9b04a', pants: '#2a2a30' }, acc: ['hat_wide', 'feather'],
  },
  sorrel: {
    id: 'sorrel', skin: '#b07a52', hair: { style: 'braid', color: '#c8a070' }, eyes: '#3a5a3a',
    outfit: { style: 'vest', main: '#5a6a4a', accent: '#c8b898', trim: '#6a4a2a', pants: '#3a3a30' }, acc: ['bandana', 'glasses'],
  },
  quill: {
    id: 'quill', skin: '#f2cba5', hair: { style: 'ponytail', color: '#6a3a2a' }, eyes: '#4a6a3a',
    outfit: { style: 'coat', main: '#4a5a6a', accent: '#e8dcc0', trim: '#8a6a3a', pants: '#3a3030' }, acc: ['scarf'], weapon: 'tome',
  },
  tobb: {
    id: 'tobb', skin: '#e9c09a', hair: { style: 'messy', color: '#a8a4a0' },
    outfit: { style: 'cloak', main: '#5a5048', accent: '#a89880', trim: '#4a4038' }, acc: ['hood'], build: 'adult',
  },
  nils: {
    id: 'nils', skin: '#f4ddd0', hair: { style: 'short', color: '#8a6a4a' }, eyes: '#5a6a8a',
    outfit: { style: 'priest', main: '#8a8478', accent: '#c8c0a8', trim: '#6a6458' },
  },
  wick: {
    id: 'wick', skin: '#7a4e34', hair: { style: 'spiky', color: '#1a1a1a' }, eyes: '#3a2a1a',
    outfit: { style: 'vest', main: '#c8783a', accent: '#e8dcc0', pants: '#4a3a2a' }, acc: ['headband'], build: 'child',
  },
  pg_knight: {
    id: 'pg_knight', skin: '#5a5a66', hair: { style: 'none', color: '#000' },
    outfit: { style: 'armor', main: '#3a3a46', metal: '#6a6a78', accent: '#c8a050', trim: '#8a7040', pants: '#2a2a30' },
    acc: ['helmet', 'cape'], capeColor: '#4a4a52', weapon: 'greatsword', build: 'large',
  },
  pg_hollow_wren: hollow('wren', 'pg_hollow_wren', '#3a3448'),
  pg_hollow_ilse: hollow('ilse', 'pg_hollow_ilse', '#3a4440'),
  pg_hollow_bram: hollow('bram', 'pg_hollow_bram', '#3a3a40'),
  pg_hollow_sable: hollow('sable', 'pg_hollow_sable', '#1a1820'),
};

// ------------------------------------------------------------------ shop
export const SHOP_DEFS = {
  pg_salvage: {
    name: 'Sorrel\'s Salvage',
    items: [
      'mega_tonic', 'x_tonic', 'tonic_mist', 'hi_ether', 'x_ether', 'dawn_plume', 'panacea', 'holy_water',
      'fire_bomb', 'frost_bomb', 'bolt_bomb', 'gale_bomb', 'smoke_ball',
      'dawnforged_blade', 'worldcleaver', 'skypiercer', 'mountainfall', 'last_whisper', 'horizon', 'keepers_crook',
      'rod_of_dusk', 'godhand', 'dawnsong_lyre', 'the_last_chronicle', 'last_word',
      'dawnguard_regalia', 'wanderers_mantle', 'keepers_raiment', 'crown_of_dawn', 'wanderers_hat', 'keepers_crown', 'wall_of_dawn',
      'dusk_ring', 'feather_cape', 'hunters_eye', 'quiet_bell', 'lure_bell',
    ],
  },
};
