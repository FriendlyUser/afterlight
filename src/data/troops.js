// Enemy formations. `enemies` lists enemy ids (left to right, back to front).
// Options: boss, music, canFlee, bg, intro (text shown at start), mood.

const T = (enemies, opts = {}) => ({ enemies, ...opts });

export const TROOPS = {
  // ------------------------------------------------ Lanternfall shore & tide caves
  lf_jelly2: T(['brine_jelly', 'brine_jelly']),
  lf_jelly_crab: T(['brine_jelly', 'sand_crab']),
  lf_crab2: T(['sand_crab', 'sand_crab']),
  lf_gulls: T(['gull_harrier', 'gull_harrier', 'gull_harrier']),
  lf_gull_jelly: T(['gull_harrier', 'brine_jelly']),
  tc_bats: T(['cave_bat', 'cave_bat']),
  tc_eel: T(['tide_eel', 'brine_jelly']),
  tc_mix: T(['cave_bat', 'tide_eel', 'sand_crab']),
  tc_jelly3: T(['brine_jelly', 'brine_jelly', 'brine_jelly']),
  boss_drowned_hound: T(['drowned_hound'], { boss: true, music: 'boss', canFlee: false }),
  boss_brinefang: T(['brinefang'], { boss: true, music: 'boss', canFlee: false }),
  pups2: T(['gloam_pup', 'gloam_pup']),

  // ------------------------------------------------ Gale coast / Whisperwold
  gw_wolves: T(['wold_wolf', 'wold_wolf', 'wold_wolf']),
  gw_wolf2: T(['wold_wolf', 'wold_wolf']),
  gw_thorn: T(['thornling', 'thornling']),
  gw_spore: T(['sporecap', 'thornling']),
  gw_beetle: T(['wold_beetle', 'wold_wolf']),
  gw_wisp: T(['whisper_wisp', 'whisper_wisp']),
  gw_mix: T(['wold_beetle', 'whisper_wisp', 'sporecap']),
  gw_bandits: T(['bandit', 'bandit_archer']),
  gw_bandits3: T(['bandit', 'bandit', 'bandit_archer']),
  boss_red_tam: T(['bandit', 'red_tam', 'bandit_archer'], { boss: true, music: 'boss', canFlee: false }),

  // ------------------------------------------------ Thistledown fields
  td_boars: T(['field_boar', 'field_boar']),
  td_crows: T(['murder_crow', 'murder_crow', 'murder_crow']),
  td_scare: T(['scarecrow', 'murder_crow']),
  td_mix: T(['field_boar', 'scarecrow']),

  // ------------------------------------------------ Aurenne Undercroft
  uc_rats: T(['sewer_rat', 'sewer_rat', 'sewer_rat']),
  uc_bones: T(['bone_soldier', 'bone_soldier']),
  uc_wraith: T(['gloam_wraith', 'gloam_ooze']),
  uc_ooze: T(['gloam_ooze', 'gloam_ooze']),
  uc_cult: T(['cultist', 'bone_soldier', 'cultist']),
  uc_mix: T(['sewer_rat', 'gloam_wraith', 'bone_soldier']),
  boss_mercy: T(['gloam_beast', 'sister_mercy'], { boss: true, music: 'boss', canFlee: false }),
};

export function registerTroops(map) { Object.assign(TROOPS, map); }
