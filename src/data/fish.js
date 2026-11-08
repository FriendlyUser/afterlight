// Fish for the fishing minigame. Each region has a table; rarity sets the
// difficulty (zone size / marker speed) and weight. Caught fish are items
// (materials) that sell well and count toward Fisher Tobias's log.

import { ITEMS } from './items.js';

export const FISH = {
  // Westmost Sea / Lanternfall
  sand_dab: { name: 'Sand Dab', region: 'sea', rarity: 1, sell: 12, desc: 'Flat, patient, delicious.' },
  gale_herring: { name: 'Gale Herring', region: 'sea', rarity: 1, sell: 15, desc: 'Silver as a coin, twice as common.' },
  lantern_cod: { name: 'Lanternfall Cod', region: 'sea', rarity: 2, sell: 40, desc: 'Tobias swears they swim toward the Lantern\'s light.' },
  ghost_ray: { name: 'Ghost Ray', region: 'sea', rarity: 3, sell: 120, desc: 'Pale and nearly see-through. Bad luck to eat, good luck to sell.' },
  brinefang_fry: { name: 'Brinefang Fry', region: 'sea', rarity: 4, sell: 400, desc: 'A baby sea serpent. It bit you. You let it.' },
  // Rivers & lakes (Whisperwold, Thistledown, Aurenne canals)
  wold_trout: { name: 'Wold Trout', region: 'river', rarity: 1, sell: 18, desc: 'Speckled like forest light.' },
  bell_carp: { name: 'Bell Carp', region: 'river', rarity: 2, sell: 45, desc: 'Aurenne\'s canal carp. They gather when the bells ring.' },
  whisper_pike: { name: 'Whisper Pike', region: 'river', rarity: 3, sell: 150, desc: 'Fishermen say it hums lullabies under the ice.' },
  // Desert oases & saltglass pools
  glass_minnow: { name: 'Glass Minnow', region: 'oasis', rarity: 1, sell: 30, desc: 'You can see its heart beating.' },
  sun_koi: { name: 'Sun Koi', region: 'oasis', rarity: 3, sell: 220, desc: 'Gold scales that stay warm long after dark.' },
  // Swamp
  mire_eel: { name: 'Mire Eel', region: 'swamp', rarity: 1, sell: 35, desc: 'Slippery. Smells like the bog. Mirefen loves them.' },
  bog_lantern: { name: 'Bog Lanternfish', region: 'swamp', rarity: 3, sell: 260, desc: 'Its lure glows the same color as a Lantern.' },
  // Snow & ice holes
  frost_char: { name: 'Frost Char', region: 'ice', rarity: 2, sell: 90, desc: 'Caught through the ice at Frosthollow. Monks bless the first of the season.' },
  // After the Sundering: the abyss between shards
  ash_skate: { name: 'Ash Skate', region: 'void', rarity: 2, sell: 180, desc: 'Swims through falling ash as if it were water. Maybe it is now.' },
  memory_carp: { name: 'Memory Carp', region: 'void', rarity: 3, sell: 500, desc: 'When you hold it, you remember something that never happened to you.' },
  sunshard_marlin: { name: 'Sunshard Marlin', region: 'void', rarity: 4, sell: 1500, desc: 'It swallowed a sliver of the broken sun. It glows. It is furious.' },
};

// Register fish as sellable materials.
for (const [id, f] of Object.entries(FISH)) {
  ITEMS[id] = { name: f.name, kind: 'material', sell: f.sell, desc: `${f.desc} (Fish)`, icon: '≈', fish: true };
}

/** Pick a fish for a region (rarer fish weighted lower). */
export function rollFish(region, rnd = Math.random) {
  const pool = Object.entries(FISH).filter(([, f]) => f.region === region);
  if (!pool.length) return null;
  const weights = pool.map(([id, f]) => /** @type {[string, number]} */ ([id, [0, 50, 26, 9, 2][f.rarity]]));
  const total = weights.reduce((s, [, w]) => s + w, 0);
  let r = rnd() * total;
  for (const [id, w] of weights) if ((r -= w) <= 0) return id;
  return weights[0][0];
}
