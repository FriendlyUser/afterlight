// Consumables, materials and key items. Equipment lives in equipment.js.
// use: { target, heal, healPct, mp, mpPct, revive, cure, damage, elem, status, boost }

/** @type {Record<string, import('../types/data').ItemDef>} */
export const ITEMS = {
  // ---------------------------------------------------------------- recovery
  tonic: { name: 'Tonic', kind: 'consumable', price: 30, desc: 'Restores 150 HP.', use: { target: 'ally', heal: 150 }, battle: true, field: true, icon: '⚗' },
  hi_tonic: { name: 'Hi-Tonic', kind: 'consumable', price: 140, desc: 'Restores 600 HP.', use: { target: 'ally', heal: 600 }, battle: true, field: true, icon: '⚗' },
  mega_tonic: { name: 'Mega Tonic', kind: 'consumable', price: 600, desc: 'Restores 2,000 HP.', use: { target: 'ally', heal: 2000 }, battle: true, field: true, icon: '⚗' },
  x_tonic: { name: 'X-Tonic', kind: 'consumable', price: 2000, desc: 'Restores all HP.', use: { target: 'ally', healPct: 100 }, battle: true, field: true, icon: '⚗' },
  tonic_mist: { name: 'Tonic Mist', kind: 'consumable', price: 400, desc: 'Restores 400 HP to the party.', use: { target: 'allies', heal: 400 }, battle: true, field: true, icon: '☁' },
  ether: { name: 'Ether', kind: 'consumable', price: 120, desc: 'Restores 40 MP.', use: { target: 'ally', mp: 40 }, battle: true, field: true, icon: '✧' },
  hi_ether: { name: 'Hi-Ether', kind: 'consumable', price: 450, desc: 'Restores 150 MP.', use: { target: 'ally', mp: 150 }, battle: true, field: true, icon: '✧' },
  x_ether: { name: 'X-Ether', kind: 'consumable', price: 1500, desc: 'Restores all MP.', use: { target: 'ally', mpPct: 100 }, battle: true, field: true, icon: '✧' },
  elixir: { name: 'Elixir', kind: 'consumable', price: 0, sell: 1500, desc: 'Fully restores HP and MP.', use: { target: 'ally', healPct: 100, mpPct: 100 }, battle: true, field: true, icon: '✦' },
  megalixir: { name: 'Megalixir', kind: 'consumable', price: 0, sell: 5000, desc: 'Fully restores the party.', use: { target: 'allies', healPct: 100, mpPct: 100 }, battle: true, field: true, icon: '✦' },
  ember_feather: { name: 'Ember Feather', kind: 'consumable', price: 300, desc: 'Revives a fallen ally with 25% HP.', use: { target: 'ko', revive: 0.25 }, battle: true, field: true, icon: '❦' },
  dawn_plume: { name: 'Dawn Plume', kind: 'consumable', price: 2500, desc: 'Revives a fallen ally with full HP.', use: { target: 'ko', revive: 1 }, battle: true, field: true, icon: '❦' },
  antidote: { name: 'Antidote', kind: 'consumable', price: 20, desc: 'Cures Poison.', use: { target: 'ally', cure: ['poison'] }, battle: true, field: true, icon: '✚' },
  eye_drops: { name: 'Eye Drops', kind: 'consumable', price: 20, desc: 'Cures Blind.', use: { target: 'ally', cure: ['blind'] }, battle: true, field: true, icon: '✚' },
  echo_herb: { name: 'Echo Herb', kind: 'consumable', price: 30, desc: 'Cures Silence.', use: { target: 'ally', cure: ['silence'] }, battle: true, field: true, icon: '✚' },
  smelling_salts: { name: 'Smelling Salts', kind: 'consumable', price: 30, desc: 'Cures Sleep, Stun and Charm.', use: { target: 'ally', cure: ['sleep', 'stun', 'charm'] }, battle: true, field: false, icon: '✚' },
  burn_salve: { name: 'Burn Salve', kind: 'consumable', price: 25, desc: 'Cures Burn.', use: { target: 'ally', cure: ['burn'] }, battle: true, field: true, icon: '✚' },
  panacea: { name: 'Panacea', kind: 'consumable', price: 200, desc: 'Cures all ailments.', use: { target: 'ally', cure: 'bad' }, battle: true, field: true, icon: '✚' },
  bedroll: { name: 'Bedroll', kind: 'consumable', price: 250, desc: 'Field only: fully restores the party.', use: { target: 'allies', healPct: 100, mpPct: 100 }, battle: false, field: true, icon: '⛺' },

  // ---------------------------------------------------------------- battle items
  smoke_ball: { name: 'Smoke Ball', kind: 'consumable', price: 60, desc: 'Escape from a non-boss battle.', use: { target: 'self', special: 'escape' }, battle: true, field: false, icon: '●' },
  flash_powder: { name: 'Flash Powder', kind: 'consumable', price: 80, desc: 'May blind all foes.', use: { target: 'enemies', status: [['blind', 0.6]] }, battle: true, field: false, icon: '✺' },
  fire_bomb: { name: 'Fire Bomb', kind: 'consumable', price: 120, desc: '200 fire damage to all foes.', use: { target: 'enemies', damage: 200, elem: 'fire' }, battle: true, field: false, icon: '✹' },
  frost_bomb: { name: 'Frost Bomb', kind: 'consumable', price: 120, desc: '200 ice damage to all foes.', use: { target: 'enemies', damage: 200, elem: 'ice' }, battle: true, field: false, icon: '✹' },
  bolt_bomb: { name: 'Bolt Bomb', kind: 'consumable', price: 120, desc: '200 lightning damage to all foes.', use: { target: 'enemies', damage: 200, elem: 'bolt' }, battle: true, field: false, icon: '✹' },
  gale_bomb: { name: 'Gale Bomb', kind: 'consumable', price: 120, desc: '200 wind damage to all foes.', use: { target: 'enemies', damage: 200, elem: 'wind' }, battle: true, field: false, icon: '✹' },
  holy_water: { name: 'Holy Water', kind: 'consumable', price: 160, desc: '400 light damage to one foe.', use: { target: 'enemy', damage: 400, elem: 'light' }, battle: true, field: false, icon: '✹' },
  gloam_shard: { name: 'Gloam Shard', kind: 'consumable', price: 0, sell: 200, desc: '600 dark damage to all foes.', use: { target: 'enemies', damage: 600, elem: 'dark' }, battle: true, field: false, icon: '✹' },
  starfall_bomb: { name: 'Starfall Bomb', kind: 'consumable', price: 0, sell: 800, desc: '2,500 damage to all foes.', use: { target: 'enemies', damage: 2500, elem: 'none' }, battle: true, field: false, icon: '✹' },
  afterglow_vial: { name: 'Afterglow Vial', kind: 'consumable', price: 0, sell: 500, desc: 'Afterglow +100.', use: { target: 'self', special: 'kindle' }, battle: true, field: false, icon: '❂' },

  // ---------------------------------------------------------------- permanent boosts
  vigor_seed: { name: 'Vigor Seed', kind: 'consumable', price: 0, sell: 300, desc: 'Permanently raises max HP by 50.', use: { target: 'ally', boost: { hp: 50 } }, battle: false, field: true, icon: '❧' },
  wisdom_seed: { name: 'Wisdom Seed', kind: 'consumable', price: 0, sell: 300, desc: 'Permanently raises max MP by 10.', use: { target: 'ally', boost: { mp: 10 } }, battle: false, field: true, icon: '❧' },
  power_fruit: { name: 'Power Fruit', kind: 'consumable', price: 0, sell: 300, desc: 'Permanently raises STR by 3.', use: { target: 'ally', boost: { str: 3 } }, battle: false, field: true, icon: '❧' },
  magic_fruit: { name: 'Magic Fruit', kind: 'consumable', price: 0, sell: 300, desc: 'Permanently raises MAG by 3.', use: { target: 'ally', boost: { mag: 3 } }, battle: false, field: true, icon: '❧' },
  guard_fruit: { name: 'Guard Fruit', kind: 'consumable', price: 0, sell: 300, desc: 'Permanently raises DEF by 3.', use: { target: 'ally', boost: { def: 3 } }, battle: false, field: true, icon: '❧' },
  spirit_fruit: { name: 'Spirit Fruit', kind: 'consumable', price: 0, sell: 300, desc: 'Permanently raises RES by 3.', use: { target: 'ally', boost: { res: 3 } }, battle: false, field: true, icon: '❧' },
  swift_fruit: { name: 'Swift Fruit', kind: 'consumable', price: 0, sell: 300, desc: 'Permanently raises SPD by 2.', use: { target: 'ally', boost: { spd: 2 } }, battle: false, field: true, icon: '❧' },
  crest_tome: { name: 'Crest Tome', kind: 'consumable', price: 0, sell: 500, desc: 'Grants 50 CP to the primary Crest.', use: { target: 'ally', cp: 50 }, battle: false, field: true, icon: '❖' },

  // ---------------------------------------------------------------- crest stones (unlock base crests)
  stone_ranger: { name: 'Crest Stone: Ranger', kind: 'crest', crest: 'ranger', price: 600, desc: 'Unlocks the Ranger Crest for the whole party.', icon: '◆' },
  stone_rogue: { name: 'Crest Stone: Rogue', kind: 'crest', crest: 'rogue', price: 600, desc: 'Unlocks the Rogue Crest.', icon: '◆' },
  stone_arcanist: { name: 'Crest Stone: Arcanist', kind: 'crest', crest: 'arcanist', price: 600, desc: 'Unlocks the Arcanist Crest.', icon: '◆' },
  stone_pugilist: { name: 'Crest Stone: Pugilist', kind: 'crest', crest: 'pugilist', price: 600, desc: 'Unlocks the Pugilist Crest.', icon: '◆' },
  stone_cantor: { name: 'Crest Stone: Cantor', kind: 'crest', crest: 'cantor', price: 600, desc: 'Unlocks the Cantor Crest.', icon: '◆' },
  stone_warden: { name: 'Crest Stone: Warden', kind: 'crest', crest: 'warden', price: 600, desc: 'Unlocks the Warden Crest.', icon: '◆' },
  stone_mender: { name: 'Crest Stone: Mender', kind: 'crest', crest: 'mender', price: 600, desc: 'Unlocks the Mender Crest.', icon: '◆' },
  stone_vanguard: { name: 'Crest Stone: Vanguard', kind: 'crest', crest: 'vanguard', price: 600, desc: 'Unlocks the Vanguard Crest.', icon: '◆' },

  // ---------------------------------------------------------------- materials (sell / quests)
  sea_glass: { name: 'Sea Glass', kind: 'material', sell: 15, desc: 'Smooth green glass from the tide caves.', icon: '◇' },
  wolf_pelt: { name: 'Wolf Pelt', kind: 'material', sell: 30, desc: 'Thick and warm.', icon: '◇' },
  gloam_dust: { name: 'Gloam Dust', kind: 'material', sell: 60, desc: 'Cold, faintly whispering dust.', icon: '◇' },
  saltglass: { name: 'Saltglass', kind: 'material', sell: 80, desc: 'Desert glass that hums in sunlight.', icon: '◇' },
  frost_lily: { name: 'Frost Lily', kind: 'material', sell: 90, desc: 'Blooms only in snow.', icon: '◇' },
  mire_pearl: { name: 'Mire Pearl', kind: 'material', sell: 120, desc: 'Grown in swamp clams.', icon: '◇' },
  sun_ember: { name: 'Sun Ember', kind: 'material', sell: 400, desc: 'A sliver of the broken sun. Warm forever.', icon: '◇' },
  scrap_gear: { name: 'Scrap Gear', kind: 'material', sell: 40, desc: 'Airship-grade cog.', icon: '◇' },

  // ---------------------------------------------------------------- key items
  kindle_ember: { name: 'Kindle\'s Ember', kind: 'key', desc: 'A coal from an Emberhart\'s antler, warm as a hand. On open roads and in the wilds, press Ride to call Kindle.', icon: '✪' },
  edrins_compass: { name: 'Edrin\'s Compass', kind: 'key', desc: 'Your father\'s compass. The needle points west, always west.', icon: '✪' },
  nana_brooch: { name: 'Nana Brisa\'s Brooch', kind: 'key', desc: 'A silver gull with a chipped wing.', icon: '✪' },
  fishing_net: { name: 'Mended Net', kind: 'key', desc: 'Fisher Tobias\'s net, freshly mended.', icon: '✪' },
  sea_lavender: { name: 'Sea Lavender', kind: 'key', desc: 'For Nana Brisa\'s tea.', icon: '✪' },
  cassian_letter: { name: 'Cassian\'s Letter', kind: 'key', desc: 'Sealed with the Choir\'s sunburst.', icon: '✪' },
  tuning_fork: { name: 'Tuning Forks', kind: 'key', desc: 'Silver forks for the Keepers. They hum a note you almost recognize.', icon: '✪' },
  dawnstone: { name: 'The Dawnstone', kind: 'key', desc: 'The heart of Lanternfall\'s light. Warm as a hand.', icon: '✪' },
  ysolde_lantern: { name: 'Ysolde\'s Lantern', kind: 'key', desc: 'A small brass lantern. It will not go out.', icon: '✪' },
  sun_shard: { name: 'Sun Shard', kind: 'key', desc: 'A piece of the shattered Hearthsun.', icon: '✪' },
  airship_part: { name: 'Halcyon Part', kind: 'key', desc: 'A part for Corvin\'s airship.', icon: '✪' },
  fishing_rod: { name: 'Fishing Rod', kind: 'key', desc: 'Driftwood rod, gull-feather fly. Face water at a fishing spot and press Z.', icon: '✪' },
  undercroft_key: { name: 'Undercroft Key', kind: 'key', desc: 'Iron key stamped with a bell.', icon: '✪' },
};
