// Shop inventories. Equipment tiers rise with the story.

import { gearOfTier } from './equipment.js';

const weapons = (tier) => gearOfTier(tier, (e) => e.slot === 'weapon');
const armor = (tier) => gearOfTier(tier, (e) => e.slot !== 'weapon' && e.slot !== 'accessory');

/** @type {Record<string, import('../types/data').ShopDef>} */
export const SHOPS = {
  lf_store: {
    name: 'Marlow\'s Goods',
    items: ['tonic', 'antidote', 'eye_drops', 'burn_salve', 'ember_feather', 'smoke_ball', 'copper_ring', 'sea_charm', ...weapons(1), ...armor(1)],
  },
  port_gale: {
    name: 'Harborside Outfitters',
    items: ['tonic', 'ether', 'antidote', 'eye_drops', 'echo_herb', 'ember_feather', 'smoke_ball', 'fire_bomb', 'frost_bomb', 'antidote_charm', ...weapons(2), ...armor(2)],
  },
  thistledown: {
    name: 'Thistledown Trading Post',
    items: ['tonic', 'hi_tonic', 'ether', 'antidote', 'echo_herb', 'smelling_salts', 'ember_feather', 'bolt_bomb', 'gale_bomb', 'bedroll',
      'stone_ranger', 'stone_rogue', 'stone_arcanist', 'stone_pugilist', 'stone_cantor', 'stone_warden', 'stone_mender', 'stone_vanguard',
      'power_band', 'sage_ring', ...weapons(2), ...armor(2)],
  },
  aurenne: {
    name: 'Bellwright Arms & Sundries',
    items: ['tonic', 'hi_tonic', 'ether', 'panacea', 'ember_feather', 'holy_water', 'fire_bomb', 'frost_bomb', 'bolt_bomb', 'bedroll',
      'swift_boots', 'vigor_bangle', 'focus_pendant', 'bell_earring', 'wake_charm', 'sun_goggles', ...weapons(3), ...armor(3)],
  },
  saltglass: {
    name: 'Caravan Market',
    items: ['hi_tonic', 'ether', 'hi_ether', 'panacea', 'ember_feather', 'tonic_mist', 'gale_bomb', 'ember_ring', 'frost_ring', 'storm_ring', ...weapons(4), ...armor(4)],
  },
  frosthollow: {
    name: 'Monastery Stores',
    items: ['hi_tonic', 'hi_ether', 'panacea', 'ember_feather', 'tonic_mist', 'fire_bomb', 'hunters_eye', 'feather_cape', ...weapons(4), ...armor(4)],
  },
  mirefen: {
    name: 'Stilt-Market',
    items: ['hi_tonic', 'hi_ether', 'panacea', 'antidote', 'ember_feather', 'tonic_mist', 'quiet_bell', 'lure_bell', 'dusk_ring', ...weapons(5), ...armor(5)],
  },
  ember_ward: {
    name: 'Ember Ward Supply',
    items: ['hi_tonic', 'mega_tonic', 'hi_ether', 'panacea', 'ember_feather', 'tonic_mist', 'holy_water', ...weapons(5), ...armor(5)],
  },
  kiteholm: {
    name: 'Scrap & Sundry',
    items: ['mega_tonic', 'hi_ether', 'panacea', 'ember_feather', 'dawn_plume', 'tonic_mist', 'fire_bomb', 'frost_bomb', 'bolt_bomb', 'gale_bomb', ...weapons(6), ...armor(6)],
  },
  halcyon: {
    name: 'The Halcyon\'s Hold',
    items: ['mega_tonic', 'x_tonic', 'hi_ether', 'x_ether', 'panacea', 'dawn_plume', 'tonic_mist', 'bedroll', ...weapons(7), ...armor(7)],
  },
  last_market: {
    name: 'The Last Market',
    items: ['mega_tonic', 'x_tonic', 'x_ether', 'panacea', 'dawn_plume', 'tonic_mist', 'bedroll', ...weapons(8), ...armor(8)],
  },
};
