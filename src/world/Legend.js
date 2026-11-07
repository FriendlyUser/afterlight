// Shared ASCII legend for map authoring. See docs/MAPS.md.
//
// Ground layer chars -> terrain definition:
//   top:   atlas texture for the walkable surface
//   side:  atlas texture for cliff/side faces
//   wall:  solid block raised `raise` half-units above the tile height
//   water: water tile (deep '~' blocks, shallow 'w' is walkable)
//   void:  nothing rendered, not walkable (sky / abyss)

export const HEIGHT_STEP = 0.5; // world units per height level

export const GROUND = {
  '.': { top: 'grass', side: 'cliff_grass' },
  ',': { top: 'grass_dark', side: 'cliff_grass' },
  '"': { top: 'grass_dark', side: 'cliff_grass', tall: true },
  'k': { top: 'grass_autumn', side: 'cliff_grass' },
  'q': { top: 'grass_dead', side: 'cliff_rock' },
  ':': { top: 'path', side: 'cliff_grass' },
  'd': { top: 'dirt', side: 'cliff_grass' },
  ';': { top: 'cobble', side: 'wall_stone' },
  '_': { top: 'stone', side: 'wall_stone' },
  'M': { top: 'marble', side: 'wall_marble' },
  '=': { top: 'wood', side: 'wall_wood' },
  '+': { top: 'wood_dark', side: 'wall_wood' },
  's': { top: 'sand', side: 'cliff_sand' },
  '*': { top: 'snow', side: 'cliff_snow' },
  'm': { top: 'mud', side: 'cliff_grass' },
  'c': { top: 'cave', side: 'cliff_cave' },
  'r': { top: 'ruin', side: 'wall_ruin' },
  'g': { top: 'glass', side: 'cliff_sand' },
  'a': { top: 'ash', side: 'cliff_rock' },
  'i': { top: 'ice', side: 'wall_ice' },
  'o': { top: 'moss', side: 'cliff_rock' },
  'x': { top: 'carpet', side: 'wall_wood' },
  'X': { top: 'carpet_blue', side: 'wall_wood' },
  'u': { top: 'gloam', side: 'wall_gloam' },
  'l': { top: 'lava', side: 'cliff_rock', solid: true, glow: 1.2 },
  '~': { water: true, bottom: 'sand' },
  'w': { water: true, shallow: true, bottom: 'sand' },
  'p': { water: true, shallow: true, bottom: 'mud', murky: true },
  '#': { wall: true, top: 'cliff_rock', side: 'cliff_rock', raise: 4 },
  'C': { wall: true, top: 'cliff_cave', side: 'cliff_cave', raise: 5 },
  'B': { wall: true, top: 'wood_dark', side: 'wall_brick', raise: 5 },
  'W': { wall: true, top: 'wood_dark', side: 'wall_wood', raise: 5 },
  'S': { wall: true, top: 'stone', side: 'wall_stone', raise: 5 },
  'P': { wall: true, top: 'wood_dark', side: 'wall_plaster', raise: 5 },
  'T': { wall: true, top: 'wood_dark', side: 'wall_timber', raise: 5 },
  'R': { wall: true, top: 'ruin', side: 'wall_ruin', raise: 4 },
  'I': { wall: true, top: 'snow', side: 'wall_ice', raise: 4 },
  'U': { wall: true, top: 'gloam', side: 'wall_gloam', raise: 5 },
  'K': { wall: true, top: 'marble', side: 'wall_marble', raise: 6 },
  ' ': { void: true },
  'v': { void: true },
};

// Props layer chars -> PropFactory types. 'T' resolves to map.treeType.
export const PROP_CHARS = {
  'T': 'tree', 'P': 'pine', 'Y': 'palm', 'D': 'tree_dead', 'K': 'tree_cherry', 'Z': 'tree_crystal',
  'b': 'bush', 'B': 'bush_flower', 'R': 'rock', 'o': 'rock_small', 'f': 'flowers', 'g': 'grass_tuft',
  'n': 'reeds', 'm': 'mushroom', 'G': 'mushroom_glow', 'A': 'stalagmite', '*': 'crystal', '%': 'crystal_gloam',
  'L': 'lamp', '^': 'torch', 'F': 'fence', 'O': 'barrel', 'C': 'crate', 'k': 'sack', 'h': 'haybale',
  'W': 'well', 't': 'tombstone', 'S': 'statue', '|': 'pillar', '!': 'pillar_broken', 'c': 'cactus',
  'x': 'bones', 'd': 'debris', 'E': 'bed', 'H': 'bookshelf', '=': 'table', 'j': 'chair', 'u': 'cauldron',
  'a': 'anvil', 'q': 'banner', 'Q': 'fountain', '@': 'campfire', '$': 'save', 's': 'sign', 'V': 'boat',
  'N': 'bell',
};

// Small decorative props rendered with instancing and no collision.
export const DECOR_TYPES = new Set(['flowers', 'grass_tuft', 'rock_small', 'reeds', 'mushroom', 'mushroom_glow', 'bones', 'debris']);
