// Sprite "looks" — descriptors painted by SpriteFactory.
// Fields: skin, hair{style,color}, eyes, outfit{style,main,accent,trim,pants,boots,metal},
// acc[] (scarf, cape, hood, helmet, hat_wide, hat_wizard, circlet, headband, bandana,
// beard, glasses, eyepatch, feather, ribbon, crown, horns), build (adult|child|large|tall),
// weapon (sword, greatsword, dagger, spear, axe, staff, rod, bow, fist, lute, tome, gun), shield, blush.

const SKIN = { pale: '#f4ddd0', fair: '#f2cba5', warm: '#e9c09a', tan: '#d9a57c', brown: '#b07a52', deep: '#7a4e34' };

export const LOOKS = {
  // ------------------------------------------------------------ main cast
  wren: {
    id: 'wren', skin: SKIN.fair, hair: { style: 'ponytail', color: '#c0642e' }, eyes: '#2f6b4f',
    outfit: { style: 'tunic', main: '#3f6fa8', accent: '#efe2c4', trim: '#b5803a', pants: '#4a3a2c', boots: '#5a3a24' },
    acc: ['scarf'], weapon: 'sword',
  },
  wren_ruin: {
    id: 'wren_ruin', skin: SKIN.fair, hair: { style: 'messy', color: '#c0642e' }, eyes: '#2f6b4f',
    outfit: { style: 'coat', main: '#4a4a5e', accent: '#d8c8a8', trim: '#b5803a', pants: '#3a3030', boots: '#3a2a20' },
    acc: ['scarf', 'cape'], capeColor: '#7a3a2a', weapon: 'sword',
  },
  ilse: {
    id: 'ilse', skin: SKIN.warm, hair: { style: 'bob', color: '#2f2a3a' }, eyes: '#6a4a8a',
    outfit: { style: 'dress', main: '#6f9a6a', accent: '#f3ead2', trim: '#8a5a3a' }, weapon: 'staff', blush: true,
  },
  ilse_ruin: {
    id: 'ilse_ruin', skin: SKIN.warm, hair: { style: 'bun', color: '#2f2a3a' }, eyes: '#6a4a8a',
    outfit: { style: 'coat', main: '#e8e0d0', accent: '#a83a3a', trim: '#6a5a4a', pants: '#4a4048' }, acc: ['glasses'], weapon: 'staff',
  },
  bram: {
    id: 'bram', skin: SKIN.tan, hair: { style: 'spiky', color: '#e3c25a' },
    outfit: { style: 'armor', main: '#888', metal: '#a9b3c2', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' },
    acc: ['cape'], capeColor: '#a83232', weapon: 'sword', shield: true, build: 'large',
  },
  bram_ruin: {
    id: 'bram_ruin', skin: SKIN.tan, hair: { style: 'messy', color: '#c8a84a' },
    outfit: { style: 'vest', main: '#5a4a3a', accent: '#a89a88', trim: '#3a2a20', pants: '#3a3a4a' },
    acc: ['beard'], weapon: 'greatsword', build: 'large',
  },
  sable: {
    id: 'sable', skin: SKIN.pale, hair: { style: 'long', color: '#1a1824' }, eyes: '#b03a5a',
    outfit: { style: 'robe', main: '#2a2638', accent: '#c8c0d8', trim: '#7a6aa8' }, weapon: 'rod', orb: '#b07aff',
  },
  sable_lysa: {
    id: 'sable_lysa', skin: SKIN.pale, hair: { style: 'long', color: '#1a1824' }, eyes: '#b03a5a',
    outfit: { style: 'dress', main: '#f4ecd8', accent: '#e0c070', trim: '#c9a24a' }, acc: ['ribbon'], weapon: 'rod',
  },
  pip: {
    id: 'pip', skin: SKIN.brown, hair: { style: 'messy', color: '#3a2a1a' }, eyes: '#4a3a2a',
    outfit: { style: 'rags', main: '#8a6a3a', accent: '#4a6a3a', pants: '#5a4a3a' }, acc: ['bandana'], build: 'child', weapon: 'dagger',
  },
  pip_ruin: {
    id: 'pip_ruin', skin: SKIN.brown, hair: { style: 'spiky', color: '#3a2a1a' }, eyes: '#4a3a2a',
    outfit: { style: 'vest', main: '#3a4a5a', accent: '#c8b898', pants: '#4a3a2a' }, acc: ['scarf', 'eyepatch'], build: 'child', weapon: 'dagger',
  },
  corvin: {
    id: 'corvin', skin: SKIN.warm, hair: { style: 'short', color: '#3a3030' },
    outfit: { style: 'coat', main: '#5a2a2a', accent: '#e8dcc0', trim: '#c9a24a', pants: '#2a2a30' }, acc: ['hat_wide', 'beard'], weapon: 'gun',
  },
  cassian: {
    id: 'cassian', skin: SKIN.fair, hair: { style: 'long', color: '#d8d4cc' }, eyes: '#6a8ab0',
    outfit: { style: 'priest', main: '#efe8d8', accent: '#d0b060', trim: '#c9a24a' }, acc: ['circlet'], build: 'tall', weapon: 'staff',
  },
  cassian_young: {
    id: 'cassian_young', skin: SKIN.fair, hair: { style: 'short', color: '#a89070' }, eyes: '#6a8ab0',
    outfit: { style: 'tunic', main: '#6a8ab0', accent: '#f0e8d8', trim: '#c9a24a' }, build: 'child',
  },
  lysa: {
    id: 'lysa', skin: SKIN.pale, hair: { style: 'long', color: '#1a1824' }, eyes: '#b03a5a',
    outfit: { style: 'dress', main: '#f4ecd8', accent: '#e0c070', trim: '#c9a24a' }, acc: ['ribbon'], build: 'child',
  },
  ysolde: {
    id: 'ysolde', skin: SKIN.fair, hair: { style: 'braid', color: '#8a4a2a' }, eyes: '#2f6b4f',
    outfit: { style: 'robe', main: '#2f4a6a', accent: '#e8dcc0', trim: '#d9b04a' }, acc: ['circlet'], weapon: 'staff', build: 'tall',
  },

  // ------------------------------------------------------------ antagonists
  mercy: {
    id: 'mercy', skin: SKIN.pale, hair: { style: 'long', color: '#e8e0d0' }, eyes: '#8a2a3a',
    outfit: { style: 'priest', main: '#2a2a34', accent: '#a83a4a', trim: '#c0c0d0' }, acc: ['hood'], weapon: 'lute',
  },
  garrick: {
    id: 'garrick', skin: SKIN.tan, hair: { style: 'short', color: '#3a3a3a' },
    outfit: { style: 'armor', main: '#555', metal: '#5a6270', accent: '#2a2a3a', trim: '#c9a24a', pants: '#2a2a30' },
    acc: ['cape', 'beard'], capeColor: '#2a2a40', weapon: 'greatsword', build: 'large',
  },
  penitent: {
    id: 'penitent', skin: '#9a9aa8', hair: { style: 'none', color: '#000' },
    outfit: { style: 'armor', main: '#222', metal: '#2a2a34', accent: '#6a3aa8', trim: '#8a6ac8', pants: '#1a1a20' },
    acc: ['helmet', 'cape'], capeColor: '#1a1424', weapon: 'greatsword', build: 'large',
  },
  vesper_soldier: {
    id: 'vesper_soldier', skin: SKIN.fair, hair: { style: 'short', color: '#4a3a2a' },
    outfit: { style: 'armor', main: '#777', metal: '#7a8494', accent: '#2a2a40', trim: '#c0c0d0', pants: '#2a2a30' },
    acc: ['helmet'], weapon: 'spear',
  },
  dawnguard: {
    id: 'dawnguard', skin: SKIN.tan, hair: { style: 'short', color: '#4a3a2a' },
    outfit: { style: 'armor', main: '#888', metal: '#a9b3c2', accent: '#c03a3a', trim: '#d7a83a', pants: '#3a3a4a' },
    acc: ['helmet'], weapon: 'spear',
  },
  acolyte: {
    id: 'acolyte', skin: SKIN.fair, hair: { style: 'short', color: '#6a4a2a' },
    outfit: { style: 'robe', main: '#e8e0cc', accent: '#c9a24a', trim: '#c9a24a' }, weapon: 'tome',
  },

  // ------------------------------------------------------------ Lanternfall townsfolk
  tobias: {
    id: 'tobias', skin: SKIN.tan, hair: { style: 'bald', color: '#c8c8c8' },
    outfit: { style: 'vest', main: '#3a5a7a', accent: '#d8ccb0', trim: '#5a4a3a', pants: '#4a4a5a' }, acc: ['beard', 'hat_wide'],
  },
  nana_brisa: {
    id: 'nana_brisa', skin: SKIN.warm, hair: { style: 'bun', color: '#d8d4d0' },
    outfit: { style: 'dress', main: '#7a5a8a', accent: '#e8dcc8', trim: '#5a4a3a' }, acc: ['glasses'],
  },
  fennick: {
    id: 'fennick', skin: SKIN.tan, hair: { style: 'messy', color: '#d8d4d0' },
    outfit: { style: 'rags', main: '#6a6a5a', accent: '#8a7a5a', pants: '#4a4a3a' }, acc: ['beard'],
  },
  sage: {
    id: 'sage', skin: SKIN.brown, hair: { style: 'long', color: '#e8e4dc' },
    outfit: { style: 'robe', main: '#4a6a5a', accent: '#d8b860', trim: '#c97a3a' }, acc: ['hat_wizard'], weapon: 'staff',
  },
  tamsin: {
    id: 'tamsin', skin: SKIN.deep, hair: { style: 'long', color: '#e8e4dc' },
    outfit: { style: 'robe', main: '#c8a060', accent: '#f0e8d0', trim: '#8a4a2a' }, acc: ['hood'],
  },
  halvard: {
    id: 'halvard', skin: SKIN.fair, hair: { style: 'bald', color: '#c8a888' },
    outfit: { style: 'robe', main: '#5a6a8a', accent: '#e8eef4', trim: '#c9a24a' }, acc: ['beard'],
  },
  osk: {
    id: 'osk', skin: SKIN.tan, hair: { style: 'bun', color: '#5a6a4a' },
    outfit: { style: 'robe', main: '#4a5a3a', accent: '#c8b878', trim: '#8a6a3a' }, acc: ['hood'],
  },
  elowen: {
    id: 'elowen', skin: '#e0d8b8', hair: { style: 'long', color: '#7aa85a' }, eyes: '#c8a040',
    outfit: { style: 'dress', main: '#3a6a3a', accent: '#e8d8a0', trim: '#c8a040' }, acc: ['circlet'], build: 'tall',
  },
  vasha: {
    id: 'vasha', skin: SKIN.brown, hair: { style: 'ponytail', color: '#e8e8f0' },
    outfit: { style: 'coat', main: '#3a5a8a', accent: '#e8e0d0', trim: '#e0c050', pants: '#2a3040' }, acc: ['feather'], weapon: 'spear',
  },
  red_tam: {
    id: 'red_tam', skin: SKIN.tan, hair: { style: 'spiky', color: '#c03a2a' },
    outfit: { style: 'vest', main: '#6a2a2a', accent: '#c8b898', trim: '#3a2a1a', pants: '#3a3030' }, acc: ['eyepatch'], weapon: 'axe', build: 'large',
  },
  bandit: {
    id: 'bandit', skin: SKIN.tan, hair: { style: 'short', color: '#3a2a1a' },
    outfit: { style: 'vest', main: '#5a4a3a', accent: '#8a3a2a', trim: '#3a2a1a', pants: '#3a3a30' }, acc: ['bandana'], weapon: 'dagger',
  },
  cultist: {
    id: 'cultist', skin: SKIN.pale, hair: { style: 'short', color: '#2a2a2a' },
    outfit: { style: 'robe', main: '#3a2a4a', accent: '#a07ad0', trim: '#a07ad0' }, acc: ['hood'], weapon: 'rod',
  },
};

// ------------------------------------------------------------ generic townsfolk
// Deterministic variety: villager(seed) produces a plausible commoner.
const HAIR_STYLES = ['short', 'long', 'ponytail', 'bob', 'bun', 'messy', 'braid', 'spiky'];
const HAIR_COLORS = ['#3a2a1a', '#6a4a2a', '#2a2a30', '#c0642e', '#e3c25a', '#8a6a4a', '#d8d4d0', '#5a3a2a'];
const OUTFITS = ['tunic', 'dress', 'vest', 'coat', 'robe'];
const MAINS = ['#6a7a4a', '#8a5a3a', '#4a6a8a', '#8a4a5a', '#5a5a6a', '#a8884a', '#4a7a6a', '#7a5a8a'];
const SKINS = Object.values(SKIN);

export function villagerLook(seed, overrides = {}) {
  let s = seed * 9301 + 49297;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const pick = (a) => a[Math.floor(r() * a.length)];
  const old = r() < 0.2;
  const look = {
    id: `villager_${seed}`,
    skin: pick(SKINS),
    hair: { style: pick(HAIR_STYLES), color: old ? '#d8d4d0' : pick(HAIR_COLORS) },
    outfit: { style: pick(OUTFITS), main: pick(MAINS), accent: '#e8dcc0', trim: '#6a4a2a', pants: '#4a3a2a' },
    acc: r() < 0.25 ? [pick(['scarf', 'hat_wide', 'bandana', 'glasses', 'beard', 'headband'])] : [],
    build: r() < 0.15 ? 'child' : r() < 0.12 ? 'large' : 'adult',
    ...overrides,
  };
  look.id = overrides.id || `villager_${seed}_${look.build}`;
  return look;
}

// Pre-register a pool so maps can say look: 'villager_12'.
for (let i = 0; i < 64; i++) {
  const v = villagerLook(i + 1);
  LOOKS[`villager_${i + 1}`] = { ...v, id: `villager_${i + 1}` };
}
