// Active skills (party + enemies).
//
// kind:    phys (STR vs DEF) | mag (MAG vs RES) | hybrid (avg) | heal | support | special
// target:  enemy | enemies | random | ally | allies | self | ko | allyAny
// elem:    weapon | slash | pierce | blunt | fire | ice | bolt | wind | light | dark | none
// power:   100 = a plain attack. hits: number of hits (random target spreads them).
// status:  [[statusId, chance]] applied to targets. selfStatus: statuses on the user.
// buffs/debuffs: { str, mag, def, res, spd, eva } stage changes on targets; selfBuffs on user.
// cure:    list of status ids or 'bad'. revive: fraction of max HP. drain: fraction of damage healed.
// delay:   multiplier on the user's next turn wait (0.5 quick, 1.5 slow).
// special: name of a custom handler in battle/Specials.js.
// anim:    visual effect id (see battle/Effects.js).

/** @type {Record<string, import('../types/data').SkillDef>} */
export const SKILLS = {
  // ------------------------------------------------------------ basics
  attack: { name: 'Attack', kind: 'phys', target: 'enemy', power: 100, elem: 'weapon', anim: 'weapon', desc: 'A basic strike with your weapon.' },
  guard: { name: 'Guard', kind: 'support', target: 'self', special: 'guard', delay: 0.6, anim: 'buff', desc: 'Halve damage until your next turn. Acts sooner.' },

  // ------------------------------------------------------------ Vanguard
  cleave: { name: 'Cleave', kind: 'phys', target: 'enemies', power: 70, mp: 6, elem: 'weapon', anim: 'slash', desc: 'Sweep every foe with your weapon.' },
  rally: { name: 'Rally', kind: 'support', target: 'allies', mp: 8, buffs: { str: 1 }, anim: 'buff', desc: 'Party Strength up.' },
  sunder: { name: 'Sunder', kind: 'phys', target: 'enemy', power: 150, mp: 10, elem: 'weapon', debuffs: { def: -1 }, anim: 'slash', desc: 'Heavy blow that cracks armor (DEF down).' },
  whirlwind: { name: 'Whirlwind', kind: 'phys', target: 'enemies', power: 120, mp: 16, elem: 'weapon', anim: 'slash', desc: 'A spinning strike against all foes.' },
  valiant_charge: { name: 'Valiant Charge', kind: 'phys', target: 'enemy', power: 260, mp: 22, elem: 'weapon', delay: 1.35, anim: 'slash', desc: 'A devastating charge. Slower recovery.' },
  ardent_blade: { name: 'Ardent Blade', kind: 'phys', target: 'enemy', power: 400, mp: 34, elem: 'weapon', ignoreDef: 0.5, anim: 'slash', desc: 'Burning resolve: ignores half of defense.' },

  // ------------------------------------------------------------ Warden
  provoke: { name: 'Provoke', kind: 'support', target: 'self', mp: 4, selfStatus: ['taunt'], selfBuffs: { def: 1 }, anim: 'buff', desc: 'Draw enemy attacks for 3 turns. DEF up.' },
  shield_bash: { name: 'Shield Bash', kind: 'phys', target: 'enemy', power: 110, mp: 8, elem: 'blunt', status: [['stun', 0.25]], anim: 'blunt', desc: 'Blunt strike that may stun.' },
  bulwark_stance: { name: 'Bulwark Stance', kind: 'support', target: 'self', mp: 10, selfBuffs: { def: 2, res: 2 }, delay: 0.6, anim: 'buff', desc: 'Greatly raise own DEF and RES.' },
  guardian_wall: { name: 'Guardian Wall', kind: 'support', target: 'allies', mp: 18, status: [['protect', 1]], anim: 'buff', desc: 'Grant Protect to the whole party.' },
  retribution: { name: 'Retribution', kind: 'phys', target: 'enemy', power: 100, mp: 14, elem: 'weapon', special: 'revenge', anim: 'slash', desc: 'Stronger the more HP you have lost.' },

  // ------------------------------------------------------------ Ranger
  aimed_shot: { name: 'Aimed Shot', kind: 'phys', target: 'enemy', power: 130, mp: 5, elem: 'pierce', crit: 0.3, anim: 'arrow', desc: 'A careful shot with high critical rate.' },
  scan: { name: 'Scan', kind: 'support', target: 'enemy', mp: 2, special: 'scan', delay: 0.5, anim: 'status', desc: 'Reveal a foe\'s weaknesses and HP.' },
  arrow_rain: { name: 'Arrow Rain', kind: 'phys', target: 'random', power: 55, hits: 4, mp: 12, elem: 'pierce', anim: 'arrow', desc: 'Four arrows on random foes.' },
  venom_arrow: { name: 'Venom Arrow', kind: 'phys', target: 'enemy', power: 100, mp: 8, elem: 'pierce', status: [['poison', 0.6]], anim: 'arrow', desc: 'Poisoned shot.' },
  hunters_mark: { name: 'Hunter\'s Mark', kind: 'support', target: 'enemy', mp: 10, debuffs: { def: -2 }, status: [['marked', 1]], anim: 'debuff', desc: 'Mark a foe: DEF down sharply, crits more likely.' },
  galeshot: { name: 'Galeshot', kind: 'phys', target: 'enemies', power: 140, mp: 22, elem: 'wind', anim: 'wind', desc: 'A shot riding a gale through all foes.' },
  deadeye: { name: 'Deadeye', kind: 'phys', target: 'enemy', power: 380, mp: 30, elem: 'pierce', crit: 1, anim: 'arrow', desc: 'Never misses. Always critical.' },

  // ------------------------------------------------------------ Rogue
  steal: { name: 'Steal', kind: 'special', target: 'enemy', special: 'steal', anim: 'steal', desc: 'Lift an item from a foe.' },
  quickstrike: { name: 'Quickstrike', kind: 'phys', target: 'enemy', power: 90, mp: 4, elem: 'pierce', delay: 0.5, anim: 'thrust', desc: 'A jab that lets you act again sooner.' },
  mug: { name: 'Mug', kind: 'phys', target: 'enemy', power: 120, mp: 8, elem: 'weapon', special: 'steal', anim: 'steal', desc: 'Attack and steal at once.' },
  smoke_bomb: { name: 'Smoke Bomb', kind: 'special', target: 'allies', mp: 6, special: 'escape', anim: 'status', desc: 'Guaranteed escape from non-boss battles.' },
  eviscerate: { name: 'Eviscerate', kind: 'phys', target: 'enemy', power: 110, hits: 2, mp: 14, elem: 'weapon', anim: 'slash', desc: 'Two vicious cuts.' },
  shadowstep: { name: 'Shadowstep', kind: 'phys', target: 'enemy', power: 220, mp: 18, elem: 'pierce', delay: 0.4, selfBuffs: { eva: 1 }, anim: 'thrust', desc: 'Strike from the shadows; act again quickly.' },

  // ------------------------------------------------------------ Mender
  mend: { name: 'Mend', kind: 'heal', target: 'ally', power: 110, mp: 4, anim: 'heal', desc: 'Restore HP to one ally.' },
  purify: { name: 'Purify', kind: 'heal', target: 'ally', power: 0, mp: 4, cure: 'bad', anim: 'heal', desc: 'Cure ailments.' },
  mend_all: { name: 'Mend All', kind: 'heal', target: 'allies', power: 70, mp: 10, anim: 'heal', desc: 'Restore HP to the party.' },
  rekindle: { name: 'Rekindle', kind: 'heal', target: 'ko', power: 0, mp: 14, revive: 0.3, anim: 'revive', desc: 'Revive a fallen ally with 30% HP.' },
  aegis: { name: 'Aegis', kind: 'support', target: 'ally', mp: 6, status: [['protect', 1], ['shell', 1]], anim: 'buff', desc: 'Protect and Shell one ally.' },
  mend_ii: { name: 'Mend II', kind: 'heal', target: 'ally', power: 240, mp: 12, anim: 'heal', desc: 'Restore a lot of HP to one ally.' },
  renewal: { name: 'Renewal', kind: 'heal', target: 'allies', power: 180, mp: 26, status: [['regen', 1]], anim: 'heal', desc: 'Heal and Regen the party.' },
  second_dawn: { name: 'Second Dawn', kind: 'heal', target: 'allies', power: 120, mp: 40, revive: 0.5, anim: 'revive', desc: 'Revive all fallen allies at 50% and heal the rest.' },

  // ------------------------------------------------------------ Arcanist
  ember: { name: 'Ember', kind: 'mag', target: 'enemy', power: 110, mp: 5, elem: 'fire', status: [['burn', 0.1]], anim: 'fire', desc: 'Fire damage.' },
  frost: { name: 'Frost', kind: 'mag', target: 'enemy', power: 110, mp: 5, elem: 'ice', anim: 'ice', desc: 'Ice damage.' },
  spark: { name: 'Spark', kind: 'mag', target: 'enemy', power: 110, mp: 5, elem: 'bolt', anim: 'bolt', desc: 'Lightning damage.' },
  flame_wave: { name: 'Flame Wave', kind: 'mag', target: 'enemies', power: 90, mp: 14, elem: 'fire', anim: 'fire', desc: 'Fire on all foes.' },
  blizzard: { name: 'Blizzard', kind: 'mag', target: 'enemies', power: 90, mp: 14, elem: 'ice', anim: 'ice', desc: 'Ice on all foes.' },
  thunderstorm: { name: 'Thunderstorm', kind: 'mag', target: 'enemies', power: 90, mp: 14, elem: 'bolt', anim: 'bolt', desc: 'Lightning on all foes.' },
  arcane_burst: { name: 'Arcane Burst', kind: 'mag', target: 'enemy', power: 300, mp: 30, elem: 'none', anim: 'burst', desc: 'Raw, unaligned force.' },
  meteor: { name: 'Meteor', kind: 'mag', target: 'enemies', power: 230, mp: 48, elem: 'fire', anim: 'meteor', desc: 'Call down burning stars.' },

  // ------------------------------------------------------------ Pugilist
  flurry: { name: 'Flurry', kind: 'phys', target: 'enemy', power: 45, hits: 3, mp: 5, elem: 'blunt', anim: 'blunt', desc: 'Three rapid blows.' },
  focus: { name: 'Focus', kind: 'heal', target: 'self', power: 0, mp: 6, special: 'focus', cure: 'bad', anim: 'heal', desc: 'Recover 30% HP and shake off ailments.' },
  palm_strike: { name: 'Palm Strike', kind: 'phys', target: 'enemy', power: 160, mp: 10, elem: 'blunt', ignoreDef: 0.5, anim: 'blunt', desc: 'Strike through armor.' },
  tremor: { name: 'Tremor', kind: 'phys', target: 'enemies', power: 110, mp: 14, elem: 'blunt', anim: 'quake', desc: 'Shake the ground under all foes.' },
  hundred_fists: { name: 'Hundred Fists', kind: 'phys', target: 'random', power: 50, hits: 6, mp: 22, elem: 'blunt', anim: 'blunt', desc: 'Six blows at random foes.' },
  dragon_fang: { name: 'Dragon Fang', kind: 'phys', target: 'enemy', power: 420, mp: 32, elem: 'blunt', anim: 'blunt', desc: 'The final form.' },

  // ------------------------------------------------------------ Cantor
  ballad_valor: { name: 'Ballad of Valor', kind: 'support', target: 'allies', mp: 6, buffs: { str: 1 }, anim: 'song', desc: 'Party STR up.' },
  lullaby: { name: 'Lullaby', kind: 'support', target: 'enemies', mp: 8, status: [['sleep', 0.5]], anim: 'song', desc: 'May put all foes to sleep.' },
  hymn_ward: { name: 'Hymn of Warding', kind: 'support', target: 'allies', mp: 8, buffs: { def: 1, res: 1 }, anim: 'song', desc: 'Party DEF and RES up.' },
  tempo: { name: 'Tempo', kind: 'support', target: 'allies', mp: 12, buffs: { spd: 1 }, anim: 'song', desc: 'Party SPD up.' },
  dirge: { name: 'Dirge', kind: 'support', target: 'enemies', mp: 10, debuffs: { str: -1, mag: -1 }, anim: 'song', desc: 'Foes\' STR and MAG down.' },
  dawnsong: { name: 'Dawnsong', kind: 'heal', target: 'allies', power: 90, mp: 16, status: [['regen', 1]], anim: 'song', desc: 'The Keepers\' hymn. Heal and Regen.' },
  requiem: { name: 'Requiem', kind: 'mag', target: 'enemies', power: 160, mp: 24, elem: 'dark', status: [['silence', 0.3]], anim: 'dark', desc: 'Dark song that may silence.' },
  anthem: { name: 'Anthem', kind: 'support', target: 'allies', mp: 30, buffs: { str: 1, mag: 1, def: 1, res: 1, spd: 1 }, anim: 'song', desc: 'All party stats up.' },

  // ------------------------------------------------------------ Dawnknight
  holy_blade: { name: 'Holy Blade', kind: 'hybrid', target: 'enemy', power: 170, mp: 12, elem: 'light', anim: 'light', desc: 'Light-forged strike.' },
  lay_hands: { name: 'Lay on Hands', kind: 'heal', target: 'ally', power: 200, mp: 10, stat: 'hybrid', anim: 'heal', desc: 'Heal using both STR and MAG.' },
  sanctuary: { name: 'Sanctuary', kind: 'support', target: 'allies', mp: 22, status: [['protect', 1], ['shell', 1]], anim: 'buff', desc: 'Protect and Shell the party.' },
  judgment: { name: 'Judgment', kind: 'hybrid', target: 'enemies', power: 160, mp: 26, elem: 'light', anim: 'light', desc: 'Light on all foes.' },
  radiant_charge: { name: 'Radiant Charge', kind: 'hybrid', target: 'enemy', power: 320, mp: 30, elem: 'light', anim: 'light', desc: 'A blazing charge.' },
  dawnbreaker: { name: 'Dawnbreaker', kind: 'hybrid', target: 'enemy', power: 520, mp: 46, elem: 'light', special: 'partyHeal15', anim: 'light', desc: 'Split the dark; heals the party a little.' },

  // ------------------------------------------------------------ Runeblade
  flame_edge: { name: 'Flame Edge', kind: 'hybrid', target: 'enemy', power: 150, mp: 8, elem: 'fire', anim: 'fire', desc: 'Fire-runed strike.' },
  frost_edge: { name: 'Frost Edge', kind: 'hybrid', target: 'enemy', power: 150, mp: 8, elem: 'ice', anim: 'ice', desc: 'Ice-runed strike.' },
  volt_edge: { name: 'Volt Edge', kind: 'hybrid', target: 'enemy', power: 150, mp: 8, elem: 'bolt', anim: 'bolt', desc: 'Lightning-runed strike.' },
  gale_edge: { name: 'Gale Edge', kind: 'hybrid', target: 'enemy', power: 150, mp: 8, elem: 'wind', anim: 'wind', desc: 'Wind-runed strike.' },
  prismatic_arc: { name: 'Prismatic Arc', kind: 'hybrid', target: 'random', power: 70, hits: 4, mp: 18, elem: 'prism', anim: 'burst', desc: 'Four strikes of random elements.' },
  shadow_edge: { name: 'Shadow Edge', kind: 'hybrid', target: 'enemy', power: 200, mp: 16, elem: 'dark', drain: 0.3, anim: 'dark', desc: 'Dark strike that drains life.' },
  sevenfold_edge: { name: 'Sevenfold Edge', kind: 'hybrid', target: 'random', power: 65, hits: 7, mp: 40, elem: 'prism', anim: 'burst', desc: 'Seven strikes, every element.' },

  // ------------------------------------------------------------ Nightblade
  silent_cut: { name: 'Silent Cut', kind: 'phys', target: 'enemy', power: 140, mp: 8, elem: 'pierce', status: [['silence', 0.4]], anim: 'slash', desc: 'May silence.' },
  mirage: { name: 'Mirage', kind: 'support', target: 'self', mp: 10, selfStatus: ['veil'], delay: 0.6, anim: 'buff', desc: 'Dodge the next two attacks.' },
  deathmark: { name: 'Deathmark', kind: 'phys', target: 'enemy', power: 160, mp: 16, elem: 'pierce', status: [['doom', 0.25]], anim: 'dark', desc: 'May inflict Doom.' },
  shuriken_storm: { name: 'Shuriken Storm', kind: 'phys', target: 'enemies', power: 120, mp: 16, elem: 'pierce', anim: 'thrust', desc: 'Blades on every foe.' },
  nightfall: { name: 'Nightfall', kind: 'hybrid', target: 'enemies', power: 180, mp: 24, elem: 'dark', status: [['blind', 0.4]], anim: 'dark', desc: 'Dark on all foes; may blind.' },
  thousand_cuts: { name: 'Thousand Cuts', kind: 'phys', target: 'random', power: 60, hits: 8, mp: 36, elem: 'slash', anim: 'slash', desc: 'Eight cuts across the field.' },

  // ------------------------------------------------------------ Sage
  gust: { name: 'Gust', kind: 'mag', target: 'enemy', power: 120, mp: 6, elem: 'wind', anim: 'wind', desc: 'Wind damage.' },
  holy: { name: 'Holy', kind: 'mag', target: 'enemy', power: 220, mp: 18, elem: 'light', anim: 'light', desc: 'Light damage.' },
  mend_iii: { name: 'Mend III', kind: 'heal', target: 'ally', power: 420, mp: 22, anim: 'heal', desc: 'Restore vast HP to one ally.' },
  dispel: { name: 'Dispel', kind: 'support', target: 'enemy', mp: 10, special: 'dispel', anim: 'debuff', desc: 'Strip a foe\'s buffs.' },
  tornado: { name: 'Tornado', kind: 'mag', target: 'enemies', power: 160, mp: 26, elem: 'wind', anim: 'wind', desc: 'Wind on all foes.' },
  reraise: { name: 'Reraise', kind: 'support', target: 'ally', mp: 30, status: [['reraise', 1]], anim: 'buff', desc: 'Auto-revive once when felled.' },
  starlight: { name: 'Starlight', kind: 'mag', target: 'enemies', power: 300, mp: 60, elem: 'light', anim: 'light', desc: 'Light on all foes.' },

  // ------------------------------------------------------------ Beastcaller
  call_hawk: { name: 'Call: Hawk', kind: 'mag', target: 'enemy', power: 140, mp: 10, elem: 'wind', status: [['blind', 0.3]], summon: true, anim: 'summon', desc: 'A hawk spirit dives. May blind.' },
  call_tortoise: { name: 'Call: Tortoise', kind: 'support', target: 'allies', mp: 14, status: [['protect', 1]], summon: true, anim: 'summon', desc: 'Protect the party.' },
  call_wolf: { name: 'Call: Wolf', kind: 'phys', target: 'enemies', power: 130, mp: 18, elem: 'slash', summon: true, anim: 'summon', desc: 'A wolf pack tears through all foes.' },
  call_stag: { name: 'Call: Stag', kind: 'heal', target: 'allies', power: 150, mp: 20, cure: 'bad', summon: true, anim: 'summon', desc: 'Heal and cure the party.' },
  call_serpent: { name: 'Call: Serpent', kind: 'mag', target: 'enemies', power: 180, mp: 28, elem: 'ice', status: [['slow', 0.3]], summon: true, anim: 'summon', desc: 'Ice on all foes; may Slow.' },
  call_bear: { name: 'Call: Bear', kind: 'phys', target: 'enemy', power: 400, mp: 30, elem: 'blunt', summon: true, anim: 'summon', desc: 'A crushing blow.' },
  call_phoenix: { name: 'Call: Phoenix', kind: 'mag', target: 'enemies', power: 260, mp: 64, elem: 'fire', special: 'phoenix', summon: true, anim: 'summon', desc: 'Fire on all foes; revives the fallen.' },

  // ------------------------------------------------------------ Alchemist
  acid_flask: { name: 'Acid Flask', kind: 'support', target: 'enemy', mp: 6, debuffs: { def: -2, res: -1 }, anim: 'flask', desc: 'Corrode armor.' },
  fire_flask: { name: 'Fire Flask', kind: 'mag', target: 'enemies', power: 120, mp: 10, elem: 'fire', stat: 'item', anim: 'flask', desc: 'Burning flasks on all foes.' },
  elixir_mist: { name: 'Elixir Mist', kind: 'heal', target: 'allies', power: 0, mp: 16, special: 'mist', anim: 'heal', desc: 'Restore 25% HP and 10% MP to the party.' },
  alchemize: { name: 'Alchemize', kind: 'special', target: 'enemy', mp: 8, special: 'alchemize', anim: 'steal', desc: 'Turn a foe\'s essence into gold.' },
  panacea: { name: 'Panacea', kind: 'heal', target: 'allies', power: 40, mp: 18, cure: 'bad', status: [['regen', 1]], anim: 'heal', desc: 'Cure all ailments; Regen.' },
  philosophers_bomb: { name: 'Philosopher\'s Bomb', kind: 'mag', target: 'enemies', power: 260, mp: 34, elem: 'none', stat: 'item', anim: 'burst', desc: 'Unaligned blast on all foes.' },

  // ------------------------------------------------------------ Skylancer
  jump: { name: 'Jump', kind: 'phys', target: 'enemy', power: 220, mp: 10, elem: 'pierce', special: 'jump', anim: 'jump', desc: 'Leap out of reach; land next turn.' },
  lance_sweep: { name: 'Lance Sweep', kind: 'phys', target: 'enemies', power: 110, mp: 12, elem: 'pierce', anim: 'thrust', desc: 'A wide sweep.' },
  high_jump: { name: 'High Jump', kind: 'phys', target: 'enemy', power: 340, mp: 18, elem: 'pierce', special: 'jump', anim: 'jump', desc: 'A higher, harder Jump.' },
  gale_lance: { name: 'Gale Lance', kind: 'phys', target: 'enemy', power: 220, mp: 16, elem: 'wind', anim: 'wind', desc: 'A lance riding the wind.' },
  skewer: { name: 'Skewer', kind: 'phys', target: 'enemy', power: 280, mp: 20, elem: 'pierce', debuffs: { def: -2 }, anim: 'thrust', desc: 'Pierce through; DEF down.' },
  skyfall: { name: 'Skyfall', kind: 'phys', target: 'enemies', power: 560, mp: 40, elem: 'pierce', special: 'jump', anim: 'jump', desc: 'Jump, then fall on every foe.' },

  // ------------------------------------------------------------ Timewright
  haste: { name: 'Haste', kind: 'support', target: 'ally', mp: 10, status: [['haste', 1]], anim: 'buff', desc: 'Ally acts more often.' },
  slow: { name: 'Slow', kind: 'support', target: 'enemy', mp: 8, status: [['slow', 0.8]], anim: 'debuff', desc: 'Foe acts less often.' },
  stasis: { name: 'Stasis', kind: 'support', target: 'enemy', mp: 14, special: 'delay', anim: 'debuff', desc: 'Push a foe far back in the turn order.' },
  regen: { name: 'Regen', kind: 'support', target: 'ally', mp: 8, status: [['regen', 1]], anim: 'buff', desc: 'Gradual healing.' },
  hastega: { name: 'Hastega', kind: 'support', target: 'allies', mp: 30, status: [['haste', 1]], anim: 'buff', desc: 'Haste the party.' },
  gravity: { name: 'Gravity', kind: 'special', target: 'enemy', mp: 18, special: 'gravity', elem: 'dark', anim: 'dark', desc: 'Remove 25% of a foe\'s current HP.' },
  quicken: { name: 'Quicken', kind: 'support', target: 'ally', mp: 24, special: 'quicken', anim: 'buff', desc: 'An ally acts immediately.' },
  event_horizon: { name: 'Event Horizon', kind: 'mag', target: 'enemies', power: 240, mp: 50, elem: 'dark', status: [['slow', 0.5]], anim: 'dark', desc: 'Dark on all foes; may Slow.' },

  // ------------------------------------------------------------ Duskdancer
  blade_dance: { name: 'Blade Dance', kind: 'phys', target: 'random', power: 60, hits: 4, mp: 8, elem: 'weapon', anim: 'slash', desc: 'Four strikes on random foes.' },
  allure: { name: 'Allure', kind: 'support', target: 'enemy', mp: 10, status: [['charm', 0.45]], anim: 'status', desc: 'A foe may attack its allies.' },
  healing_waltz: { name: 'Healing Waltz', kind: 'heal', target: 'allies', power: 110, mp: 14, anim: 'heal', desc: 'Heal the party.' },
  mesmerize: { name: 'Mesmerize', kind: 'support', target: 'enemy', mp: 12, debuffs: { str: -2, mag: -2 }, anim: 'debuff', desc: 'Foe STR and MAG down sharply.' },
  twilight_tango: { name: 'Twilight Tango', kind: 'mag', target: 'enemies', power: 150, mp: 20, elem: 'dark', status: [['sleep', 0.2]], anim: 'dark', desc: 'Dark on all foes; may sleep.' },
  rejuvenate: { name: 'Rejuvenate', kind: 'special', target: 'ally', mp: 0, special: 'mpGift', anim: 'heal', desc: 'Restore 25 MP to an ally.' },
  grand_finale: { name: 'Grand Finale', kind: 'heal', target: 'allies', power: 0, mp: 60, special: 'finale', buffs: { str: 1, mag: 1, def: 1, res: 1, spd: 1 }, anim: 'song', desc: 'Heal 50% and raise all stats.' },

  // ------------------------------------------------------------ Berserker
  rampage: { name: 'Rampage', kind: 'phys', target: 'random', power: 90, hits: 3, mp: 6, elem: 'weapon', anim: 'slash', desc: 'Three wild blows.' },
  blood_price: { name: 'Blood Price', kind: 'phys', target: 'enemy', power: 260, hpCost: 0.2, elem: 'weapon', anim: 'slash', desc: 'Pay 20% HP for a terrible blow.' },
  war_cry: { name: 'War Cry', kind: 'support', target: 'self', mp: 6, selfBuffs: { str: 2, def: -1 }, delay: 0.6, anim: 'buff', desc: 'STR way up, DEF down.' },
  earthsplitter: { name: 'Earthsplitter', kind: 'phys', target: 'enemies', power: 190, mp: 20, elem: 'blunt', anim: 'quake', desc: 'Split the ground under all foes.' },
  frenzy: { name: 'Frenzy', kind: 'support', target: 'self', mp: 10, selfStatus: ['berserk'], selfBuffs: { str: 3 }, anim: 'buff', desc: 'Berserk; STR maximized.' },
  ragnarok: { name: 'Ragnarok', kind: 'phys', target: 'enemies', power: 380, hpCost: 0.3, mp: 30, elem: 'weapon', anim: 'quake', desc: 'Pay 30% HP to break the world.' },

  // ------------------------------------------------------------ Lanternkeeper
  beacon: { name: 'Beacon', kind: 'mag', target: 'enemies', power: 240, mp: 20, elem: 'light', special: 'scanAll', anim: 'light', desc: 'Light on all foes; reveals weaknesses.' },
  guiding_light: { name: 'Guiding Light', kind: 'heal', target: 'allies', power: 200, mp: 22, cure: 'bad', anim: 'heal', desc: 'Heal and cure the party.' },
  tidesong: { name: 'Tidesong', kind: 'mag', target: 'enemies', power: 280, mp: 30, elem: 'ice', anim: 'ice', desc: 'The sea remembers. Ice on all foes.' },
  lighthouse: { name: 'Lighthouse', kind: 'support', target: 'allies', mp: 36, status: [['protect', 1], ['shell', 1], ['regen', 1]], anim: 'buff', desc: 'Protect, Shell and Regen the party.' },
  sunrise: { name: 'Sunrise', kind: 'heal', target: 'allies', power: 0, mp: 60, revive: 0.6, special: 'heal60', anim: 'revive', desc: 'Revive and restore all allies to 60%.' },
  first_light: { name: 'First Light', kind: 'mag', target: 'enemy', power: 900, mp: 70, elem: 'light', anim: 'light', desc: 'The first light after the last night.' },

  // ------------------------------------------------------------ Gloamweaver
  umbra: { name: 'Umbra', kind: 'mag', target: 'enemy', power: 140, mp: 6, elem: 'dark', anim: 'dark', desc: 'Dark damage.' },
  hex: { name: 'Hex', kind: 'support', target: 'enemy', mp: 8, special: 'hex', anim: 'status', desc: 'Inflict a random ailment.' },
  siphon: { name: 'Siphon', kind: 'mag', target: 'enemy', power: 120, mp: 10, elem: 'dark', drain: 0.5, anim: 'dark', desc: 'Drain life.' },
  nightshade: { name: 'Nightshade', kind: 'mag', target: 'enemies', power: 150, mp: 18, elem: 'dark', status: [['poison', 0.4]], anim: 'dark', desc: 'Dark on all foes; may poison.' },
  doom: { name: 'Doom', kind: 'support', target: 'enemy', mp: 20, status: [['doom', 0.6]], anim: 'dark', desc: 'A foe falls in three turns.' },
  unmake: { name: 'Unmake', kind: 'mag', target: 'enemy', power: 380, mp: 30, elem: 'dark', special: 'dispel', anim: 'dark', desc: 'Unravel a foe and its protections.' },
  oblivion: { name: 'Oblivion', kind: 'mag', target: 'enemies', power: 420, mp: 58, elem: 'dark', anim: 'dark', desc: 'Return them to the Gloam.' },

  // ------------------------------------------------------------ Starseer
  comet: { name: 'Comet', kind: 'mag', target: 'enemy', power: 160, mp: 10, elem: 'light', anim: 'meteor', desc: 'A small star, falling.' },
  foresight: { name: 'Foresight', kind: 'support', target: 'allies', mp: 14, buffs: { eva: 2 }, status: [['marked_self', 1]], anim: 'buff', desc: 'Party evasion up sharply.' },
  constellation: { name: 'Constellation', kind: 'mag', target: 'random', power: 80, hits: 5, mp: 24, elem: 'prism', anim: 'burst', desc: 'Five stars of random elements.' },
  astral_veil: { name: 'Astral Veil', kind: 'support', target: 'allies', mp: 14, buffs: { res: 2 }, anim: 'buff', desc: 'Party RES up sharply.' },
  eclipse: { name: 'Eclipse', kind: 'mag', target: 'enemies', power: 260, mp: 32, elem: 'dark', anim: 'dark', desc: 'Dark on all foes.' },
  supernova: { name: 'Supernova', kind: 'mag', target: 'enemies', power: 400, mp: 50, elem: 'fire', anim: 'meteor', desc: 'A dying star.' },

  // ------------------------------------------------------------ Gambler
  loaded_dice: { name: 'Loaded Dice', kind: 'special', target: 'enemy', mp: 4, special: 'dice', anim: 'shot', desc: 'Roll 2d6. Damage scales with the roll and your level.' },
  wild_card: { name: 'Wild Card', kind: 'special', target: 'self', mp: 10, special: 'wildcard', anim: 'burst', desc: 'Draw a card. Anything can happen.' },
  all_in: { name: 'All In', kind: 'phys', target: 'enemy', power: 520, mp: 20, elem: 'pierce', acc: 0.5, anim: 'shot', desc: '50% chance to land a massive shot.' },
  coin_barrage: { name: 'Coin Barrage', kind: 'special', target: 'enemies', mp: 6, special: 'coins', anim: 'shot', desc: 'Throw 2% of your gold. Damage = gold thrown.' },
  double_down: { name: 'Double Down', kind: 'support', target: 'self', mp: 24, selfStatus: ['doubled'], delay: 0.4, anim: 'buff', desc: 'Your next skill hits twice.' },
  royal_flush: { name: 'Royal Flush', kind: 'phys', target: 'random', power: 130, hits: 5, mp: 40, elem: 'pierce', crit: 1, anim: 'shot', desc: 'Five critical shots.' },

  // ------------------------------------------------------------ Sunforged
  solar_flare: { name: 'Solar Flare', kind: 'hybrid', target: 'enemies', power: 300, mp: 32, elem: 'fire', anim: 'fire', desc: 'Fire on all foes.' },
  forge_strike: { name: 'Forge Strike', kind: 'phys', target: 'enemy', power: 600, mp: 30, elem: 'weapon', anim: 'slash', desc: 'Steel, struck on a sun.' },
  sun_aegis: { name: 'Sun Aegis', kind: 'support', target: 'allies', mp: 44, status: [['protect', 1], ['shell', 1], ['regen', 1], ['haste', 1]], anim: 'buff', desc: 'Protect, Shell, Regen, Haste: everyone.' },
  helios: { name: 'Helios', kind: 'hybrid', target: 'enemies', power: 500, mp: 56, elem: 'fire', anim: 'meteor', desc: 'The noon sun, falling.' },
  corona: { name: 'Corona', kind: 'hybrid', target: 'enemy', power: 900, mp: 60, elem: 'light', anim: 'light', desc: 'A ring of killing light.' },

  // ------------------------------------------------------------ Afterlight
  afterglow_strike: { name: 'Afterglow Strike', kind: 'hybrid', target: 'enemy', power: 200, mp: 20, elem: 'light', special: 'afterglowScale', anim: 'light', desc: 'Stronger with more Afterglow.' },
  new_dawn: { name: 'New Dawn', kind: 'heal', target: 'allies', power: 0, mp: 80, revive: 1, special: 'fullHeal', anim: 'revive', desc: 'Revive and fully heal the party.' },
  twilight_requiem: { name: 'Twilight Requiem', kind: 'hybrid', target: 'enemies', power: 700, mp: 70, elem: 'prism', anim: 'burst', desc: 'Light and dark together.' },
  kindle: { name: 'Kindle', kind: 'special', target: 'self', mp: 30, special: 'kindle', delay: 0.5, anim: 'buff', desc: 'Afterglow +100.' },
  eternal_moment: { name: 'Eternal Moment', kind: 'special', target: 'enemies', mp: 60, special: 'delayAll', anim: 'dark', desc: 'All foes lose their next turn.' },
  afterlight: { name: 'Afterlight', kind: 'hybrid', target: 'enemy', power: 1500, mp: 90, elem: 'prism', special: 'allWeak', anim: 'light', desc: 'Everything you have become, at once.' },

  // ------------------------------------------------------------ Lost Callings (struck from the Choir's rolls)
  // Tidecaller — the sea-folk's calling: the tide gives and takes.
  riptide: { name: 'Riptide', kind: 'mag', target: 'enemy', power: 130, mp: 6, elem: 'ice', status: [['slow', 0.25]], anim: 'ice', desc: 'A pulling current that may drag the foe to a Slow.' },
  ebb_tide: { name: 'Ebb Tide', kind: 'heal', target: 'allies', power: 70, mp: 10, status: [['regen', 1]], anim: 'heal', desc: 'The tide goes out gently: a small heal and Regen for the party.' },
  undertow: { name: 'Undertow', kind: 'mag', target: 'enemies', power: 120, mp: 14, elem: 'ice', debuffs: { spd: -1 }, anim: 'ice', desc: 'Drag every foe down into cold water: SPD down.' },
  spring_tide: { name: 'Spring Tide', kind: 'heal', target: 'allies', power: 150, mp: 20, cure: ['poison', 'burn'], anim: 'heal', desc: 'High water washes the party clean: heal, and cure Poison and Burn.' },
  maelstrom: { name: 'Maelstrom', kind: 'mag', target: 'enemies', power: 200, mp: 28, elem: 'ice', status: [['slow', 0.3]], anim: 'ice', desc: 'A whirlpool opens under every foe; may Slow.' },
  drowning_deep: { name: 'Drowning Deep', kind: 'mag', target: 'enemy', power: 380, mp: 30, elem: 'ice', drain: 0.2, anim: 'ice', desc: 'Pull one foe to the bottom of a sea that is no longer there; drink 20% of the harm.' },
  the_sea_returns: { name: 'The Sea Returns', kind: 'mag', target: 'enemies', power: 300, mp: 52, elem: 'ice', special: 'partyHeal15', anim: 'ice', desc: 'For one moment the sea comes home: ice on every foe, and the party is healed a little.' },
  // Bellwright — Aurenne's bell-founders: sound that steadies friends and staggers foes.
  toll: { name: 'Toll', kind: 'phys', target: 'enemy', power: 120, mp: 6, elem: 'blunt', status: [['stun', 0.2]], anim: 'blunt', desc: 'Ring the foe like a bell; may stun.' },
  peal: { name: 'Peal', kind: 'support', target: 'allies', mp: 10, buffs: { def: 1, res: 1 }, anim: 'song', desc: 'A clear peal steadies the party: DEF and RES up.' },
  discord: { name: 'Discord', kind: 'mag', target: 'enemies', power: 110, mp: 14, elem: 'none', status: [['silence', 0.3]], anim: 'song', desc: 'Two bells struck a semitone apart; may silence every foe.' },
  knell: { name: 'Knell', kind: 'phys', target: 'enemy', power: 200, mp: 18, elem: 'blunt', special: 'delay', anim: 'blunt', desc: 'A death-knell blow that knocks the foe\'s turn back.' },
  carillon: { name: 'Carillon', kind: 'phys', target: 'random', power: 60, hits: 5, mp: 24, elem: 'blunt', status: [['stun', 0.1]], anim: 'blunt', desc: 'Every bell in the tower at once, at random foes; each may stun.' },
  great_bell: { name: 'Great Bell', kind: 'phys', target: 'enemy', power: 380, mp: 32, elem: 'blunt', ignoreDef: 0.3, status: [['stun', 0.3]], anim: 'quake', desc: 'Bring a bell\'s whole weight down: pierces 30% of DEF and may stun.' },
  bell_of_ending: { name: 'Bell of Ending', kind: 'mag', target: 'enemies', power: 320, mp: 60, elem: 'none', special: 'delayAll', anim: 'song', desc: 'The great bell of Aurenne, rung once: unaligned on every foe, and all their turns are pushed back.' },
  // Kitewright — the first wing-builders: wind, line and clever powder.
  kite_strike: { name: 'Kite Strike', kind: 'phys', target: 'enemy', power: 120, mp: 4, elem: 'wind', delay: 0.8, anim: 'thrust', desc: 'Swing in on a kite-line; quick to recover.' },
  flash_powder: { name: 'Flash Powder', kind: 'mag', stat: 'item', target: 'enemies', power: 90, mp: 8, elem: 'none', status: [['blind', 0.4]], anim: 'flask', desc: 'A pinch of flash-powder; may blind every foe (item power).' },
  tether: { name: 'Tether', kind: 'support', target: 'enemy', mp: 10, debuffs: { spd: -1, eva: -2 }, status: [['marked', 1]], anim: 'debuff', desc: 'Hook a line on a foe: SPD and evasion down, and it is Marked.' },
  gale_bomb_toss: { name: 'Gale Bomb', kind: 'mag', stat: 'item', target: 'enemies', power: 170, mp: 18, elem: 'wind', anim: 'wind', desc: 'A bottled gale on every foe (item power).' },
  glider_drop: { name: 'Glider Drop', kind: 'phys', target: 'enemy', power: 300, mp: 20, elem: 'pierce', special: 'jump', anim: 'jump', desc: 'Glide up out of reach, then drop on one foe.' },
  chain_lightning: { name: 'Chain Lightning', kind: 'mag', stat: 'item', target: 'random', power: 110, hits: 4, mp: 28, elem: 'bolt', anim: 'bolt', desc: 'A scrap capacitor, uncorked: four bolts at random foes (item power).' },
  skyfleet: { name: 'Skyfleet', kind: 'phys', target: 'enemies', power: 360, mp: 46, elem: 'wind', anim: 'wind', desc: 'A hundred kites at once, every line a blade.' },
  // Mnemonist — keepers of memory: remember the healthy, make the strong forget.
  recall: { name: 'Recall', kind: 'heal', target: 'ally', power: 140, mp: 8, cure: 'bad', anim: 'heal', desc: 'Help an ally remember being well: heal and cure every ailment.' },
  forget: { name: 'Forget', kind: 'mag', target: 'enemy', power: 100, mp: 8, elem: 'dark', special: 'dispel', anim: 'debuff', desc: 'Make a foe forget its blessings: strips its buffs.' },
  echo_of_fire: { name: 'Echo of Fire', kind: 'mag', target: 'enemies', power: 160, mp: 16, elem: 'fire', anim: 'fire', desc: 'The memory of a burning street, on every foe.' },
  echo_of_frost: { name: 'Echo of Frost', kind: 'mag', target: 'enemies', power: 180, mp: 20, elem: 'ice', status: [['slow', 0.25]], anim: 'ice', desc: 'The memory of a winter that would not end; may Slow.' },
  lost_hour: { name: 'Lost Hour', kind: 'mag', target: 'enemy', power: 140, mp: 22, elem: 'dark', status: [['sleep', 0.3]], special: 'delay', anim: 'dark', desc: 'Steal an hour from a foe: its turn is pushed back, and it may fall asleep.' },
  echo_of_the_sun: { name: 'Echo of the Sun', kind: 'mag', target: 'enemies', power: 300, mp: 40, elem: 'light', anim: 'light', desc: 'The memory of the Hearthsun at noon, on every foe.' },
  total_recall: { name: 'Total Recall', kind: 'heal', target: 'allies', power: 200, mp: 56, revive: 0.5, cure: 'bad', anim: 'revive', desc: 'Everyone remembers who they were: revive at 50%, heal and cure the party.' },

  // ------------------------------------------------------------ Mastery Arts
  // Two per Crest, unlocked by its Ascension stars (★1 and ★3; data/crests.js MASTERY).
  // Each is that Crest's signature, a step past its rank-10 Art.
  // Vanguard
  banner_of_dawn: { name: 'Banner of Dawn', kind: 'support', target: 'allies', mp: 20, buffs: { str: 1, def: 1 }, selfStatus: ['taunt'], anim: 'buff', desc: 'Raise the banner: party STR and DEF up, and every foe looks at you.' },
  vanguards_oath: { name: 'Vanguard\'s Oath', kind: 'phys', target: 'enemies', power: 260, mp: 42, elem: 'weapon', ignoreDef: 0.3, debuffs: { def: -1 }, anim: 'slash', desc: 'Cut through the whole line: pierces 30% of DEF and cracks every foe\'s armor.' },
  // Warden
  shieldbreaker: { name: 'Shieldbreaker', kind: 'phys', target: 'enemy', power: 260, mp: 18, elem: 'blunt', status: [['stun', 0.35]], debuffs: { def: -1 }, anim: 'blunt', desc: 'A shield-rim blow that dents armor and may stun.' },
  bastion: { name: 'Bastion', kind: 'support', target: 'allies', mp: 40, status: [['protect', 1], ['shell', 1], ['regen', 1]], anim: 'buff', desc: 'Become the wall: Protect, Shell and Regen for the whole party.' },
  // Ranger
  hawkeye_volley: { name: 'Hawkeye Volley', kind: 'phys', target: 'random', power: 75, hits: 5, mp: 20, elem: 'pierce', crit: 0.15, anim: 'arrow', desc: 'Five arrows loosed at random foes, each with a keen eye for the gaps.' },
  heartseeker: { name: 'Heartseeker', kind: 'phys', target: 'enemy', power: 460, mp: 38, elem: 'pierce', crit: 1, status: [['marked', 1]], anim: 'arrow', desc: 'The shot a hunter waits a lifetime for: never misses, always critical, and marks the prey.' },
  // Rogue
  cutpurse_flurry: { name: 'Cutpurse Flurry', kind: 'phys', target: 'enemy', power: 70, hits: 3, mp: 14, elem: 'weapon', delay: 0.7, special: 'steal', anim: 'steal', desc: 'Three quick cuts and a lifted purse — then you\'re already moving again.' },
  vanishing_act: { name: 'Vanishing Act', kind: 'phys', target: 'enemy', power: 340, mp: 30, elem: 'pierce', delay: 0.4, selfStatus: ['veil'], anim: 'thrust', desc: 'Strike and vanish: Veil turns aside the next blows, and you act again almost at once.' },
  // Mender
  choirs_grace: { name: 'Choir\'s Grace', kind: 'heal', target: 'allies', power: 200, mp: 34, cure: 'bad', anim: 'heal', desc: 'The old Choir\'s blessing: heal the party and lift every ailment.' },
  dawn_chorus: { name: 'Dawn Chorus', kind: 'heal', target: 'allies', power: 220, mp: 60, revive: 0.5, status: [['regen', 1]], anim: 'revive', desc: 'Raise the fallen at half strength, heal everyone, and leave Regen behind.' },
  // Arcanist
  prism_storm: { name: 'Prism Storm', kind: 'mag', target: 'enemies', power: 170, mp: 30, elem: 'prism', anim: 'burst', desc: 'Every element at once: each foe is struck by one of them, and weaknesses are found first.' },
  cataclysm: { name: 'Cataclysm', kind: 'mag', target: 'enemies', power: 320, mp: 64, elem: 'none', anim: 'meteor', desc: 'Raw, unaligned ruin on every foe. Nothing resists it.' },
  // Pugilist
  iron_body: { name: 'Iron Body', kind: 'support', target: 'self', mp: 12, selfBuffs: { def: 2, str: 1 }, selfStatus: ['regen'], delay: 0.5, anim: 'buff', desc: 'Breathe, harden, endure: DEF up sharply, STR up, Regen — and act again soon.' },
  heaven_palm: { name: 'Heaven-Splitting Palm', kind: 'phys', target: 'enemy', power: 520, mp: 40, elem: 'blunt', ignoreDef: 0.3, status: [['stun', 0.3]], anim: 'quake', desc: 'One open palm with the whole body behind it: pierces 30% of DEF and may stun.' },
  // Cantor
  lantern_hymn: { name: 'Lantern Hymn', kind: 'support', target: 'allies', mp: 26, status: [['regen', 1]], buffs: { mag: 1, res: 1 }, anim: 'song', desc: 'The hymn the Keepers sang at dusk: Regen, MAG and RES up for the party.' },
  encore: { name: 'Encore', kind: 'support', target: 'allies', mp: 44, status: [['haste', 1]], buffs: { str: 1, spd: 1 }, anim: 'song', desc: 'Once more, faster: Haste, STR and SPD up for the whole party.' },
  // Dawnknight
  oathlight: { name: 'Oathlight', kind: 'hybrid', target: 'enemy', power: 280, mp: 24, elem: 'light', drain: 0.4, anim: 'light', desc: 'A light-forged strike that mends you for 40% of the harm it does.' },
  noon_vow: { name: 'Noon Vow', kind: 'hybrid', target: 'enemies', power: 340, mp: 58, elem: 'light', status: [['blind', 0.3]], special: 'partyHeal15', anim: 'light', desc: 'Light on every foe (may blind), and the party is healed a little.' },
  // Runeblade
  rune_cascade: { name: 'Rune Cascade', kind: 'hybrid', target: 'enemies', power: 160, mp: 28, elem: 'prism', anim: 'burst', desc: 'Runes flare down the blade and out: every foe struck by an element, weaknesses first.' },
  truename_edge: { name: 'Truename Edge', kind: 'hybrid', target: 'enemy', power: 480, mp: 50, elem: 'prism', special: 'allWeak', anim: 'slash', desc: 'Carve the foe\'s true name: always lands as a weakness, breaking its Poise.' },
  // Nightblade
  shadow_bind: { name: 'Shadow Bind', kind: 'phys', target: 'enemy', power: 200, mp: 18, elem: 'dark', status: [['slow', 0.6], ['blind', 0.3]], delay: 0.6, anim: 'dark', desc: 'Pin the foe\'s shadow: may Slow and blind; you act again soon.' },
  moonless: { name: 'Moonless', kind: 'phys', target: 'enemies', power: 260, mp: 46, elem: 'dark', crit: 0.25, status: [['doom', 0.15]], anim: 'dark', desc: 'A night with no moon in it: dark cuts on every foe, keen to crit, and a chance of Doom.' },
  // Sage
  equilibrium: { name: 'Equilibrium', kind: 'heal', target: 'allies', power: 150, mp: 30, buffs: { mag: 1, res: 1 }, anim: 'heal', desc: 'Both halves of the art in balance: heal the party, MAG and RES up.' },
  grand_arcanum: { name: 'Grand Arcanum', kind: 'mag', target: 'enemies', power: 340, mp: 66, elem: 'none', ignoreDef: 0.25, anim: 'burst', desc: 'Everything a lifetime of study can say at once: unaligned, pierces 25% of RES.' },
  // Beastcaller
  call_emberhart: { name: 'Call: Emberhart', kind: 'heal', target: 'allies', power: 150, mp: 34, cure: 'bad', status: [['regen', 1]], summon: true, anim: 'summon', desc: 'A hart of Lantern-light steps out of the air: heals, cures and leaves Regen.' },
  call_leviathan: { name: 'Call: Leviathan', kind: 'mag', target: 'enemies', power: 340, mp: 62, elem: 'ice', status: [['slow', 0.35]], summon: true, anim: 'summon', desc: 'The old sea remembers its king: a crushing tide on every foe; may Slow.' },
  // Alchemist
  volatile_mix: { name: 'Volatile Mix', kind: 'mag', stat: 'item', target: 'enemies', power: 190, mp: 24, elem: 'fire', status: [['burn', 0.4]], anim: 'flask', desc: 'Shake well. Throw. Run. Fire on every foe that may Burn (scales with item power).' },
  elixir_rain: { name: 'Elixir Rain', kind: 'heal', target: 'allies', power: 250, mp: 50, revive: 0.3, cure: 'bad', anim: 'revive', desc: 'The good stuff, all of it, from above: revive at 30%, heal and cure everyone.' },
  // Skylancer
  dragon_dive: { name: 'Dragon Dive', kind: 'phys', target: 'enemy', power: 380, mp: 22, elem: 'pierce', special: 'jump', debuffs: { def: -1 }, anim: 'jump', desc: 'Jump out of reach, then dive like a dragon on one foe: DEF down.' },
  starfall_lance: { name: 'Starfall Lance', kind: 'phys', target: 'enemies', power: 640, mp: 54, elem: 'pierce', ignoreDef: 0.25, special: 'jump', anim: 'jump', desc: 'Leap past the clouds and come down on every foe like a falling star; pierces 25% of DEF.' },
  // Timewright
  rewind: { name: 'Rewind', kind: 'heal', target: 'ally', power: 260, mp: 30, cure: 'bad', special: 'quicken', anim: 'heal', desc: 'Turn back an ally\'s last moments: heal, cure, and they act at once.' },
  time_stop: { name: 'Time Stop', kind: 'mag', target: 'enemies', power: 200, mp: 64, elem: 'dark', special: 'delayAll', anim: 'dark', desc: 'Hold the moment still: dark on every foe, and all their turns are pushed back.' },
  // Duskdancer
  evening_waltz: { name: 'Evening Waltz', kind: 'heal', target: 'allies', power: 140, mp: 28, buffs: { eva: 1, spd: 1 }, anim: 'heal', desc: 'A slow turn in the dusk: heal the party, evasion and SPD up.' },
  last_dance: { name: 'Last Dance', kind: 'phys', target: 'random', power: 85, hits: 6, mp: 44, elem: 'weapon', status: [['charm', 0.15]], anim: 'slash', desc: 'Six cuts woven into one dance across the field; each may charm.' },
  // Berserker
  bloodrage: { name: 'Bloodrage', kind: 'support', target: 'self', mp: 6, hpCost: 0.15, selfBuffs: { str: 2, spd: 1 }, selfStatus: ['haste'], delay: 0.5, anim: 'buff', desc: 'Pay 15% HP: STR up sharply, SPD up, Haste — and go again soon.' },
  world_breaker: { name: 'World Breaker', kind: 'phys', target: 'enemies', power: 460, mp: 36, hpCost: 0.25, elem: 'weapon', ignoreDef: 0.25, delay: 1.3, anim: 'quake', desc: 'Pay 25% HP and bring the sky down on every foe; pierces 25% of DEF. Slow to recover.' },
  // Lanternkeeper
  lanterns_embrace: { name: 'Lantern\'s Embrace', kind: 'heal', target: 'allies', power: 200, mp: 44, status: [['regen', 1], ['shell', 1]], anim: 'heal', desc: 'The light that kept the ships home: heal the party, Regen and Shell.' },
  true_dawnsong: { name: 'The True Dawnsong', kind: 'mag', target: 'enemies', power: 480, mp: 80, elem: 'light', special: 'partyHeal15', anim: 'song', desc: 'The song that brought the sun back every morning: light on every foe, and the party is healed a little.' },
  // Gloamweaver
  veil_of_night: { name: 'Veil of Night', kind: 'mag', target: 'enemies', power: 200, mp: 34, elem: 'dark', status: [['blind', 0.4]], drain: 0.25, anim: 'dark', desc: 'Draw the dark over every foe: may blind, and you drink 25% of the harm.' },
  the_unwritten: { name: 'The Unwritten', kind: 'mag', target: 'enemy', power: 620, mp: 66, elem: 'dark', status: [['doom', 0.25]], special: 'dispel', anim: 'dark', desc: 'Unwrite a foe: strips its protections, may Doom it, and cuts very deep.' },
  // Starseer
  fortune_read: { name: 'Fortune Read', kind: 'support', target: 'allies', mp: 40, status: [['veil', 1]], buffs: { eva: 1 }, anim: 'buff', desc: 'Read the stars for everyone: each ally gets a Veil against the next blows, and evasion up.' },
  starfall_requiem: { name: 'Starfall Requiem', kind: 'mag', target: 'random', power: 85, hits: 8, mp: 64, elem: 'light', anim: 'meteor', desc: 'Eight drowned stars fall back up and then down again, on random foes.' },
  // Gambler
  ace_in_the_hole: { name: 'Ace in the Hole', kind: 'phys', target: 'enemy', power: 260, mp: 16, elem: 'pierce', crit: 0.5, delay: 0.6, anim: 'shot', desc: 'The card up the sleeve: +50% crit, and you act again soon.' },
  house_always_loses: { name: 'The House Always Loses', kind: 'phys', target: 'random', power: 120, hits: 6, mp: 54, elem: 'pierce', crit: 0.4, anim: 'shot', desc: 'Corvin\'s creed in six shots at random foes, each +40% crit.' },
  // Sunforged
  solar_wake: { name: 'Solar Wake', kind: 'hybrid', target: 'enemies', power: 300, mp: 40, elem: 'fire', status: [['burn', 0.3]], anim: 'fire', desc: 'Walk through them like noon through a frost: fire on every foe; may Burn.' },
  hearthsuns_wrath: { name: 'Hearthsun\'s Wrath', kind: 'hybrid', target: 'enemies', power: 620, mp: 72, elem: 'fire', ignoreDef: 0.25, anim: 'meteor', desc: 'A shard of the broken sun, unbroken for a moment: fire on every foe; pierces 25% of defenses.' },
  // Afterlight
  remembered_sun: { name: 'Remembered Sun', kind: 'heal', target: 'allies', power: 260, mp: 70, revive: 0.5, buffs: { str: 1, mag: 1 }, anim: 'revive', desc: 'Everyone remembers the same morning: revive at 50%, heal the party, STR and MAG up.' },
  unending_dawn: { name: 'Unending Dawn', kind: 'hybrid', target: 'enemies', power: 900, mp: 99, elem: 'prism', special: 'allWeak', anim: 'light', desc: 'A dawn that does not stop: every element on every foe, each landing as a weakness.' },
  // Tidecaller
  rogue_wave: { name: 'Rogue Wave', kind: 'heal', target: 'allies', power: 220, mp: 46, revive: 0.25, status: [['regen', 1]], anim: 'revive', desc: 'A wave out of nowhere lifts everyone: revive at 25%, heal, Regen.' },
  abyssal_tide: { name: 'Abyssal Tide', kind: 'mag', target: 'enemies', power: 380, mp: 70, elem: 'ice', status: [['slow', 0.5]], anim: 'ice', desc: 'The tide from the bottom of the abyss: ice on every foe; may Slow.' },
  // Bellwright
  harmonize: { name: 'Harmonize', kind: 'heal', target: 'allies', power: 160, mp: 36, buffs: { str: 1, mag: 1 }, anim: 'song', desc: 'Bring the party\'s hearts into tune: heal, STR and MAG up.' },
  unrung_bell: { name: 'The Unrung Bell', kind: 'phys', target: 'enemies', power: 420, mp: 66, elem: 'blunt', status: [['stun', 0.4]], anim: 'quake', desc: 'The bell no founder dared ring: every foe staggered, and may be stunned.' },
  // Kitewright
  stormkite: { name: 'Stormkite', kind: 'mag', stat: 'item', target: 'enemies', power: 220, mp: 38, elem: 'bolt', status: [['stun', 0.25]], anim: 'bolt', desc: 'Fly a kite into the storm and let it down on every foe; may stun (item power).' },
  first_wings: { name: 'First Wings', kind: 'phys', target: 'enemies', power: 520, mp: 62, elem: 'wind', ignoreDef: 0.2, delay: 0.6, anim: 'wind', desc: 'What the first Kitewrights flew: wind on every foe, pierces 20% of DEF, and you are moving again soon.' },
  // Mnemonist
  palimpsest: { name: 'Palimpsest', kind: 'mag', target: 'enemies', power: 260, mp: 44, elem: 'prism', anim: 'burst', desc: 'Every memory written over every other: an element on every foe, weaknesses first.' },
  the_long_remembering: { name: 'The Long Remembering', kind: 'mag', target: 'enemy', power: 700, mp: 72, elem: 'dark', drain: 0.3, special: 'dispel', anim: 'dark', desc: 'Make one foe remember everything at once: strips its buffs, and you drink 30% of the harm.' },

  // ------------------------------------------------------------ Link Arts (cost Afterglow; see data/links.js)
  link_tidebound: { name: 'Tidebound Vow', kind: 'hybrid', target: 'enemies', power: 260, elem: 'light', anim: 'light', desc: 'Wren & Ilse.' },
  link_shieldwall: { name: 'Shieldwall Charge', kind: 'phys', target: 'enemy', power: 420, elem: 'blunt', status: [['stun', 0.6]], anim: 'blunt', desc: 'Wren & Bram.' },
  link_gloamlight: { name: 'Gloamlight', kind: 'mag', target: 'enemies', power: 300, elem: 'prism', anim: 'burst', desc: 'Wren & Sable.' },
  link_slingshot: { name: 'Big Brother Toss', kind: 'phys', target: 'enemy', power: 380, hits: 2, elem: 'pierce', anim: 'jump', desc: 'Bram & Pip.' },
  link_mercy: { name: 'Field Surgery', kind: 'heal', target: 'allies', power: 260, revive: 0.5, cure: 'bad', anim: 'revive', desc: 'Ilse & Pip.' },
  link_broadside: { name: 'Broadside', kind: 'phys', target: 'random', power: 120, hits: 8, elem: 'pierce', anim: 'shot', desc: 'Corvin & Pip.' },
  link_vigil: { name: 'Last Vigil', kind: 'support', target: 'allies', status: [['protect', 1], ['shell', 1], ['regen', 1]], buffs: { def: 2, res: 2 }, anim: 'buff', desc: 'Bram & Ilse.' },
  link_eclipse: { name: 'Eclipse Waltz', kind: 'mag', target: 'enemies', power: 340, elem: 'dark', status: [['sleep', 0.4]], anim: 'dark', desc: 'Sable & Corvin.' },
  link_dawnbreak: { name: 'Dawnbreak', kind: 'hybrid', target: 'enemies', power: 620, elem: 'light', anim: 'meteor', desc: 'Wren, Ilse & Bram.' },
  link_afterlight: { name: 'Six Lights', kind: 'hybrid', target: 'enemies', power: 980, elem: 'prism', special: 'allWeak', anim: 'meteor', desc: 'The whole party.' },
  surge_strike: { name: 'Surge', kind: 'hybrid', target: 'enemy', power: 300, elem: 'weapon', anim: 'burst', desc: 'Pour Afterglow into a single blow.' },

  // ------------------------------------------------------------ Enemy skills
  e_bite: { name: 'Bite', kind: 'phys', target: 'enemy', power: 110, elem: 'pierce', anim: 'bite' },
  e_claw: { name: 'Claw', kind: 'phys', target: 'enemy', power: 105, elem: 'slash', anim: 'claw' },
  e_tackle: { name: 'Tackle', kind: 'phys', target: 'enemy', power: 100, elem: 'blunt', anim: 'blunt' },
  e_slam: { name: 'Slam', kind: 'phys', target: 'enemy', power: 150, elem: 'blunt', delay: 1.3, anim: 'blunt' },
  e_sting: { name: 'Sting', kind: 'phys', target: 'enemy', power: 80, elem: 'pierce', status: [['poison', 0.4]], anim: 'thrust' },
  e_spit: { name: 'Brine Spit', kind: 'mag', target: 'enemy', power: 90, elem: 'ice', anim: 'ice' },
  e_howl: { name: 'Howl', kind: 'support', target: 'self', selfBuffs: { str: 1 }, anim: 'buff' },
  e_peck: { name: 'Peck', kind: 'phys', target: 'enemy', power: 70, hits: 2, elem: 'pierce', anim: 'bite' },
  e_gust: { name: 'Gust', kind: 'mag', target: 'enemy', power: 100, elem: 'wind', anim: 'wind' },
  e_spore: { name: 'Spore Cloud', kind: 'support', target: 'enemies', status: [['sleep', 0.3], ['poison', 0.2]], anim: 'status' },
  e_ember: { name: 'Ember', kind: 'mag', target: 'enemy', power: 110, elem: 'fire', anim: 'fire' },
  e_firebreath: { name: 'Fire Breath', kind: 'mag', target: 'enemies', power: 90, elem: 'fire', anim: 'fire' },
  e_frost: { name: 'Frost', kind: 'mag', target: 'enemy', power: 110, elem: 'ice', anim: 'ice' },
  e_icebreath: { name: 'Frost Breath', kind: 'mag', target: 'enemies', power: 90, elem: 'ice', anim: 'ice' },
  e_spark: { name: 'Spark', kind: 'mag', target: 'enemy', power: 110, elem: 'bolt', anim: 'bolt' },
  e_thunder: { name: 'Thunderclap', kind: 'mag', target: 'enemies', power: 95, elem: 'bolt', anim: 'bolt' },
  e_dark: { name: 'Gloam Bolt', kind: 'mag', target: 'enemy', power: 120, elem: 'dark', anim: 'dark' },
  e_darkwave: { name: 'Gloam Wave', kind: 'mag', target: 'enemies', power: 95, elem: 'dark', anim: 'dark' },
  e_drain: { name: 'Life Drain', kind: 'mag', target: 'enemy', power: 100, elem: 'dark', drain: 0.6, anim: 'dark' },
  e_heal: { name: 'Mend', kind: 'heal', target: 'allyAny', power: 120, anim: 'heal' },
  e_healall: { name: 'Mend All', kind: 'heal', target: 'allies', power: 80, anim: 'heal' },
  e_buff: { name: 'Battle Cry', kind: 'support', target: 'allies', buffs: { str: 1 }, anim: 'buff' },
  e_shell: { name: 'Harden', kind: 'support', target: 'self', selfBuffs: { def: 2 }, anim: 'buff' },
  e_poison: { name: 'Toxic Mist', kind: 'support', target: 'enemies', status: [['poison', 0.5]], anim: 'status' },
  e_blind: { name: 'Ink', kind: 'support', target: 'enemy', status: [['blind', 0.7]], anim: 'status' },
  e_silence: { name: 'Hush', kind: 'support', target: 'enemy', status: [['silence', 0.6]], anim: 'status' },
  e_sleep: { name: 'Lull', kind: 'support', target: 'enemies', status: [['sleep', 0.35]], anim: 'song' },
  e_stun: { name: 'Concuss', kind: 'phys', target: 'enemy', power: 90, elem: 'blunt', status: [['stun', 0.5]], anim: 'blunt' },
  e_sweep: { name: 'Sweep', kind: 'phys', target: 'enemies', power: 80, elem: 'slash', anim: 'slash' },
  e_rampage: { name: 'Rampage', kind: 'phys', target: 'random', power: 70, hits: 3, elem: 'blunt', anim: 'blunt' },
  e_cleave: { name: 'Cleave', kind: 'phys', target: 'enemies', power: 95, elem: 'slash', anim: 'slash' },
  e_crush: { name: 'Crush', kind: 'phys', target: 'enemy', power: 210, elem: 'blunt', delay: 1.4, anim: 'quake' },
  e_quake: { name: 'Quake', kind: 'phys', target: 'enemies', power: 120, elem: 'blunt', anim: 'quake' },
  e_charge: { name: 'Charging...', kind: 'support', target: 'self', special: 'charge', anim: 'buff' },
  e_steal: { name: 'Pilfer', kind: 'special', target: 'enemy', special: 'enemySteal', anim: 'steal' },
  e_arrow: { name: 'Arrow', kind: 'phys', target: 'enemy', power: 105, elem: 'pierce', anim: 'arrow' },
  e_volley: { name: 'Volley', kind: 'phys', target: 'random', power: 60, hits: 3, elem: 'pierce', anim: 'arrow' },
  e_spear: { name: 'Thrust', kind: 'phys', target: 'enemy', power: 115, elem: 'pierce', anim: 'thrust' },
  e_slash: { name: 'Slash', kind: 'phys', target: 'enemy', power: 110, elem: 'slash', anim: 'slash' },
  e_holy: { name: 'Judgement', kind: 'mag', target: 'enemy', power: 140, elem: 'light', anim: 'light' },
  e_holyall: { name: 'Choir of Light', kind: 'mag', target: 'enemies', power: 110, elem: 'light', anim: 'light' },
  e_doom: { name: 'Toll of Ending', kind: 'support', target: 'enemy', status: [['doom', 0.5]], anim: 'dark' },
  e_gravity: { name: 'Gravity', kind: 'special', target: 'enemy', special: 'gravity', elem: 'dark', anim: 'dark' },
  e_tidal: { name: 'Tidal Crash', kind: 'mag', target: 'enemies', power: 120, elem: 'ice', anim: 'ice' },
  e_constrict: { name: 'Constrict', kind: 'phys', target: 'enemy', power: 130, elem: 'blunt', status: [['stun', 0.3]], anim: 'blunt' },
  e_wail: { name: 'Wail', kind: 'support', target: 'enemies', debuffs: { str: -1, def: -1 }, anim: 'song' },
  e_mpdrain: { name: 'Mind Leech', kind: 'special', target: 'enemy', special: 'mpDrain', anim: 'dark' },
  e_selfdestruct: { name: 'Burst', kind: 'special', target: 'enemies', special: 'selfDestruct', elem: 'fire', anim: 'burst' },
  e_summon: { name: 'Call for Help', kind: 'special', target: 'self', special: 'summon', anim: 'summon' },
  e_bigbreath: { name: 'Sunfire', kind: 'mag', target: 'enemies', power: 180, elem: 'fire', anim: 'meteor' },
  e_vesper: { name: 'Vespersong', kind: 'mag', target: 'enemies', power: 200, elem: 'light', status: [['slow', 0.4]], anim: 'song' },
  e_stillness: { name: 'Stillness', kind: 'special', target: 'enemies', special: 'delayAll', anim: 'dark' },
  e_noon: { name: 'High Noon', kind: 'mag', target: 'enemies', power: 260, elem: 'light', anim: 'meteor' },
  e_lament: { name: 'Lament', kind: 'mag', target: 'enemies', power: 150, elem: 'dark', status: [['silence', 0.3]], anim: 'song' },
};

export function skill(id) {
  const s = SKILLS[id];
  if (!s) throw new Error(`Unknown skill ${id}`);
  return s;
}
