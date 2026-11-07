// Equipment. Tiered gear is generated from name tables so balance lives in one
// place; unique gear is listed explicitly afterwards.
//
// slot:  weapon | offhand | head | body | accessory
// wtype: weapon type (crest proficiency)    armor: heavy | light | robe
// atk/mag/def/res/spd/lck/hp/mp: flat bonuses. elem: weapon damage type override.
// mods/flags/immune/resist: same meaning as passives.

const TIER_PRICE = [0, 60, 220, 600, 1400, 3200, 6800, 13000, 24000];
const TIER_POWER = [0, 8, 16, 26, 38, 54, 74, 100, 135];

export const WEAPON_TYPES = {
  sword: { name: 'Sword', elem: 'slash', atk: 1.0, mag: 0, sprite: 'sword' },
  greatsword: { name: 'Greatsword', elem: 'slash', atk: 1.28, mag: 0, spd: -2, sprite: 'greatsword' },
  spear: { name: 'Spear', elem: 'pierce', atk: 1.08, mag: 0, sprite: 'spear' },
  axe: { name: 'Axe', elem: 'slash', atk: 1.2, mag: 0, crit: 5, sprite: 'axe' },
  dagger: { name: 'Dagger', elem: 'pierce', atk: 0.82, mag: 0, crit: 10, spd: 2, sprite: 'dagger' },
  bow: { name: 'Bow', elem: 'pierce', atk: 0.98, mag: 0, sprite: 'bow' },
  staff: { name: 'Staff', elem: 'blunt', atk: 0.62, mag: 0.75, sprite: 'staff' },
  rod: { name: 'Rod', elem: 'blunt', atk: 0.4, mag: 1.0, sprite: 'rod' },
  fist: { name: 'Knuckles', elem: 'blunt', atk: 0.92, mag: 0, sprite: 'fist' },
  instrument: { name: 'Instrument', elem: 'blunt', atk: 0.55, mag: 0.7, sprite: 'lute' },
  tome: { name: 'Tome', elem: 'blunt', atk: 0.45, mag: 0.9, sprite: 'tome' },
  gun: { name: 'Gun', elem: 'pierce', atk: 1.05, mag: 0, sprite: 'gun' },
};

const WEAPON_NAMES = {
  sword: ['Driftwood Blade', 'Iron Sword', 'Steel Longsword', 'Silversteel Saber', 'Starsteel Sword', 'Ashen Blade', 'Sunshard Sword', 'Dawnforged Blade'],
  greatsword: ['Woodcutter\'s Blade', 'Iron Claymore', 'Steel Greatsword', 'Silversteel Zweihander', 'Starsteel Claymore', 'Ruinbreaker', 'Sunshard Greatsword', 'Worldcleaver'],
  spear: ['Fishing Spear', 'Iron Spear', 'Steel Pike', 'Silversteel Lance', 'Starsteel Partisan', 'Ashen Halberd', 'Sunshard Lance', 'Skypiercer'],
  axe: ['Hatchet', 'Iron Axe', 'Steel Battleaxe', 'Silversteel Axe', 'Starsteel Cleaver', 'Ashen Labrys', 'Sunshard Axe', 'Mountainfall'],
  dagger: ['Fillet Knife', 'Iron Dagger', 'Steel Dirk', 'Silversteel Kris', 'Starsteel Stiletto', 'Ashen Fang', 'Sunshard Dagger', 'Last Whisper'],
  bow: ['Shortbow', 'Hunter\'s Bow', 'Longbow', 'Silversteel Bow', 'Starsteel Recurve', 'Ashwood Bow', 'Sunshard Bow', 'Horizon'],
  staff: ['Walking Stick', 'Oak Staff', 'Choir Staff', 'Silver Staff', 'Starwood Staff', 'Ashen Staff', 'Sunshard Staff', 'Keeper\'s Crook'],
  rod: ['Willow Wand', 'Copper Rod', 'Ember Rod', 'Silver Rod', 'Starglass Rod', 'Gloam Rod', 'Sunshard Rod', 'Rod of Dusk'],
  fist: ['Leather Wraps', 'Iron Knuckles', 'Steel Cestus', 'Silversteel Claws', 'Starsteel Gauntlets', 'Ashen Fists', 'Sunshard Knuckles', 'Godhand'],
  instrument: ['Reed Flute', 'Lute', 'Silver Harp', 'Choir Lyre', 'Starstring Lute', 'Ashen Violin', 'Sunshard Harp', 'Dawnsong Lyre'],
  tome: ['Primer', 'Book of Tides', 'Choir Codex', 'Silver Grimoire', 'Star Atlas', 'Book of Ash', 'Sun Codex', 'The Last Chronicle'],
  gun: ['Flintlock', 'Iron Pistol', 'Steel Revolver', 'Silversteel Carbine', 'Starsteel Repeater', 'Ashen Hand-Cannon', 'Sunshard Pistol', 'Last Word'],
};

const ARMOR_NAMES = {
  body: {
    heavy: ['Padded Mail', 'Iron Mail', 'Steel Plate', 'Silversteel Plate', 'Starsteel Plate', 'Ashen Armor', 'Sunshard Plate', 'Dawnguard Regalia'],
    light: ['Fisher\'s Vest', 'Leather Jerkin', 'Brigandine', 'Silver Mail Shirt', 'Starweave Coat', 'Ashen Coat', 'Sunshard Vest', 'Wanderer\'s Mantle'],
    robe: ['Linen Robe', 'Acolyte Robe', 'Choir Vestment', 'Silk Robe', 'Starweave Robe', 'Ashen Robe', 'Sunshard Robe', 'Keeper\'s Raiment'],
  },
  head: {
    heavy: ['Leather Helm', 'Iron Helm', 'Steel Helm', 'Silversteel Helm', 'Starsteel Helm', 'Ashen Helm', 'Sunshard Helm', 'Crown of Dawn'],
    light: ['Cloth Cap', 'Leather Hat', 'Scout Hood', 'Silver Bandana', 'Starweave Hood', 'Ashen Hood', 'Sunshard Circlet', 'Wanderer\'s Hat'],
    robe: ['Straw Hat', 'Acolyte Hood', 'Choir Mitre', 'Silver Circlet', 'Star Diadem', 'Ashen Veil', 'Sunshard Tiara', 'Keeper\'s Crown'],
  },
  offhand: ['Buckler', 'Iron Shield', 'Steel Kite', 'Silversteel Shield', 'Starsteel Aegis', 'Ashen Bulwark', 'Sunshard Shield', 'Wall of Dawn'],
};

export const EQUIPMENT = {};

function add(id, def) { EQUIPMENT[id] = { id, ...def }; }
const slug = (s) => s.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

for (const [wtype, names] of Object.entries(WEAPON_NAMES)) {
  const t = WEAPON_TYPES[wtype];
  names.forEach((name, i) => {
    const tier = i + 1;
    const p = TIER_POWER[tier];
    add(slug(name), {
      name, slot: 'weapon', wtype, tier, price: TIER_PRICE[tier],
      atk: Math.round(p * t.atk + 2), mag: Math.round(p * t.mag), spd: t.spd || 0,
      mods: t.crit ? { crit: t.crit } : undefined,
      desc: `${t.name}. Tier ${tier}.`,
    });
  });
}

for (const [weight, names] of Object.entries(ARMOR_NAMES.body)) {
  names.forEach((name, i) => {
    const tier = i + 1;
    const p = TIER_POWER[tier];
    const def = weight === 'heavy' ? p * 1.0 : weight === 'light' ? p * 0.7 : p * 0.45;
    const res = weight === 'heavy' ? p * 0.35 : weight === 'light' ? p * 0.5 : p * 0.85;
    add(slug(name), {
      name, slot: 'body', armor: weight, tier, price: Math.round(TIER_PRICE[tier] * 0.9),
      def: Math.round(def + 2), res: Math.round(res + 1), mag: weight === 'robe' ? Math.round(p * 0.2) : 0,
      mods: weight === 'light' ? { evade: 2 + Math.floor(tier / 3) } : undefined,
      desc: `${weight === 'heavy' ? 'Heavy armor' : weight === 'light' ? 'Light armor' : 'Robe'}. Tier ${tier}.`,
    });
  });
}

for (const [weight, names] of Object.entries(ARMOR_NAMES.head)) {
  names.forEach((name, i) => {
    const tier = i + 1;
    const p = TIER_POWER[tier];
    add(slug(name), {
      name, slot: 'head', armor: weight, tier, price: Math.round(TIER_PRICE[tier] * 0.6),
      def: Math.round(p * (weight === 'heavy' ? 0.5 : weight === 'light' ? 0.35 : 0.2) + 1),
      res: Math.round(p * (weight === 'robe' ? 0.5 : 0.25) + 1),
      mag: weight === 'robe' ? Math.round(p * 0.15) : 0,
      desc: `Headgear. Tier ${tier}.`,
    });
  });
}

ARMOR_NAMES.offhand.forEach((name, i) => {
  const tier = i + 1;
  const p = TIER_POWER[tier];
  add(slug(name), {
    name, slot: 'offhand', armor: 'shield', tier, price: Math.round(TIER_PRICE[tier] * 0.7),
    def: Math.round(p * 0.45 + 1), res: Math.round(p * 0.25), mods: { evade: 3 + tier },
    desc: `Shield. Raises evasion. Tier ${tier}.`,
  });
});

// ------------------------------------------------------------------ accessories
const ACCESSORIES = {
  copper_ring: { name: 'Copper Ring', price: 120, def: 3, desc: 'DEF +3.' },
  sea_charm: { name: 'Sea Charm', price: 200, res: 5, desc: 'RES +5. Smells of salt.' },
  power_band: { name: 'Power Band', price: 500, str: 6, desc: 'STR +6.' },
  sage_ring: { name: 'Sage Ring', price: 500, mag: 6, desc: 'MAG +6.' },
  swift_boots: { name: 'Swift Boots', price: 900, spd: 5, desc: 'SPD +5.' },
  vigor_bangle: { name: 'Vigor Bangle', price: 800, mods: { hpPct: 10 }, desc: 'Max HP +10%.' },
  focus_pendant: { name: 'Focus Pendant', price: 800, mods: { mpPct: 15 }, desc: 'Max MP +15%.' },
  antidote_charm: { name: 'Gull Feather', price: 300, immune: ['poison'], desc: 'Immune to Poison.' },
  sun_goggles: { name: 'Sun Goggles', price: 400, immune: ['blind'], desc: 'Immune to Blind.' },
  bell_earring: { name: 'Bell Earring', price: 600, immune: ['silence'], desc: 'Immune to Silence.' },
  wake_charm: { name: 'Rooster Charm', price: 600, immune: ['sleep'], desc: 'Immune to Sleep.' },
  star_pendant: { name: 'Star Pendant', price: 0, immune: ['doom'], desc: 'Immune to Doom.' },
  ribbon: { name: 'Ribbon', price: 0, immune: ['poison', 'burn', 'sleep', 'silence', 'blind', 'stun', 'slow', 'charm', 'doom'], desc: 'Immune to all ailments.' },
  ember_ring: { name: 'Ember Ring', price: 1200, resist: { fire: 0.5 }, desc: 'Halves fire damage.' },
  frost_ring: { name: 'Frost Ring', price: 1200, resist: { ice: 0.5 }, desc: 'Halves ice damage.' },
  storm_ring: { name: 'Storm Ring', price: 1200, resist: { bolt: 0.5 }, desc: 'Halves lightning damage.' },
  dusk_ring: { name: 'Dusk Ring', price: 2400, resist: { dark: 0.5 }, desc: 'Halves dark damage.' },
  lucky_coin: { name: 'Lucky Coin', price: 0, lck: 15, mods: { goldPct: 20 }, desc: 'LCK +15, gold +20%.' },
  hunters_eye: { name: 'Hunter\'s Eye', price: 2000, mods: { crit: 12 }, desc: 'Critical rate +12%.' },
  feather_cape: { name: 'Feather Cape', price: 2200, mods: { evade: 10 }, desc: 'Evasion +10%.' },
  quiet_bell: { name: 'Quiet Bell', price: 1500, mods: { encounter: -50 }, desc: 'Halves random encounters.' },
  lure_bell: { name: 'Lure Bell', price: 1500, mods: { encounter: 100 }, desc: 'Doubles random encounters.' },
  scholars_monocle: { name: 'Scholar\'s Monocle', price: 0, mods: { expPct: 30 }, desc: 'EXP +30%.' },
  crest_brooch: { name: 'Crest Brooch', price: 0, mods: { cpPct: 50 }, desc: 'CP +50%.' },
  thiefs_glove: { name: 'Thief\'s Glove', price: 0, mods: { dropPct: 100 }, desc: 'Steal and drop rates up.' },
  ember_heart: { name: 'Ember Heart', price: 0, mods: { afterglow: 30 }, desc: 'Afterglow gain +30%.' },
  regen_bangle: { name: 'Mossy Bangle', price: 0, autoStatus: ['regen'], desc: 'Start battles with Regen.' },
  haste_anklet: { name: 'Quicksilver Anklet', price: 0, autoStatus: ['haste'], desc: 'Start battles with Haste.' },
  phoenix_charm: { name: 'Phoenix Charm', price: 0, autoStatus: ['reraise'], desc: 'Start battles with Reraise.' },
  breakers_gem: { name: 'Breaker\'s Gem', price: 0, flags: ['breakLimit'], desc: 'Damage can exceed 9,999.' },
  champions_belt: { name: 'Champion\'s Belt', price: 0, str: 25, def: 25, desc: 'STR +25, DEF +25.' },
  archmage_ring: { name: 'Archmage Ring', price: 0, mag: 25, res: 25, desc: 'MAG +25, RES +25.' },
  ysoldes_locket: { name: 'Ysolde\'s Locket', price: 0, mods: { hpPct: 15, mpPct: 15 }, immune: ['doom'], desc: 'HP/MP +15%. A tiny painting of three people inside.' },
};
for (const [id, a] of Object.entries(ACCESSORIES)) add(id, { slot: 'accessory', tier: 0, ...a });

// ------------------------------------------------------------------ unique / ultimate weapons
const UNIQUE = {
  edrins_blade: { name: 'Edrin\'s Blade', slot: 'weapon', wtype: 'sword', atk: 190, spd: 6, mods: { crit: 10, afterglow: 20 }, desc: 'Wren\'s father\'s sword, reforged. Ultimate.' },
  mercy_staff: { name: 'Staff of Small Mercies', slot: 'weapon', wtype: 'staff', atk: 90, mag: 170, mods: { healPct: 30 }, desc: 'Ilse\'s ultimate. Every scratch matters.' },
  aldous_oath: { name: 'Aldous\'s Oath', slot: 'weapon', wtype: 'greatsword', atk: 215, def: 30, desc: 'Bram\'s ultimate. Heavy as a promise.' },
  lysa_ribbon: { name: 'Lysa\'s Ribbon', slot: 'weapon', wtype: 'rod', atk: 60, mag: 200, mods: { mpCost: -20 }, desc: 'Sable\'s ultimate. She chose to keep it.' },
  pips_luck: { name: 'Pip\'s Lucky Shiv', slot: 'weapon', wtype: 'dagger', atk: 170, spd: 12, lck: 30, mods: { crit: 25 }, desc: 'Pip\'s ultimate. Stolen from the best.' },
  halcyon_star: { name: 'Halcyon Star', slot: 'weapon', wtype: 'gun', atk: 200, lck: 20, mods: { crit: 15 }, desc: 'Corvin\'s ultimate. Named for the ship. And someone else.' },
};
for (const [id, u] of Object.entries(UNIQUE)) add(id, { tier: 9, price: 0, ...u });

/** All tiered equipment of a slot at a given tier (for shops/drops). */
export function gearOfTier(tier, filter = () => true) {
  return Object.values(EQUIPMENT).filter((e) => e.tier === tier && filter(e)).map((e) => e.id);
}

export function equipName(id) { return EQUIPMENT[id]?.name || id; }
