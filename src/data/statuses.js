// Status effects. `turns` = default duration in the bearer's turns (0 = until cured/battle end).
// bad: counts as an ailment (cured by Purify etc.).

export const STATUSES = {
  poison: { name: 'Poison', icon: '☠', color: '#9ae070', bad: true, turns: 0, desc: 'Loses 8% HP each turn.' },
  burn: { name: 'Burn', icon: '♨', color: '#ff9a5a', bad: true, turns: 3, desc: 'Loses 6% HP each turn; DEF down.' },
  sleep: { name: 'Sleep', icon: 'z', color: '#a0b0ff', bad: true, turns: 3, desc: 'Cannot act. Wakes when hit.' },
  silence: { name: 'Silence', icon: '∅', color: '#d0d0d0', bad: true, turns: 4, desc: 'Cannot use magic.' },
  blind: { name: 'Blind', icon: '◌', color: '#707080', bad: true, turns: 4, desc: 'Physical attacks often miss.' },
  stun: { name: 'Stun', icon: '✷', color: '#ffe060', bad: true, turns: 1, desc: 'Loses the next turn.' },
  slow: { name: 'Slow', icon: '⧖', color: '#8090c0', bad: true, turns: 4, desc: 'Acts less often.' },
  charm: { name: 'Charm', icon: '♥', color: '#ff90c0', bad: true, turns: 2, desc: 'Attacks its own side.' },
  berserk: { name: 'Berserk', icon: '!', color: '#ff5050', bad: false, turns: 4, desc: 'Attacks wildly; STR up.' },
  doom: { name: 'Doom', icon: '☽', color: '#c080ff', bad: true, turns: 0, desc: 'Falls when the count ends.' },
  haste: { name: 'Haste', icon: '»', color: '#80e0ff', bad: false, turns: 5, desc: 'Acts more often.' },
  regen: { name: 'Regen', icon: '✚', color: '#80f0a0', bad: false, turns: 5, desc: 'Regains HP each turn.' },
  protect: { name: 'Protect', icon: '⛨', color: '#a0c0ff', bad: false, turns: 5, desc: 'Takes less physical damage.' },
  shell: { name: 'Shell', icon: '◈', color: '#c0a0ff', bad: false, turns: 5, desc: 'Takes less magic damage.' },
  reraise: { name: 'Reraise', icon: '❂', color: '#ffe0a0', bad: false, turns: 0, desc: 'Revives once when felled.' },
  veil: { name: 'Veil', icon: '❖', color: '#e0e0ff', bad: false, turns: 0, charges: 2, desc: 'Evades the next attacks.' },
  taunt: { name: 'Taunt', icon: '⚑', color: '#ffb060', bad: false, turns: 3, desc: 'Draws enemy attacks.' },
  marked: { name: 'Marked', icon: '◎', color: '#ff8060', bad: true, turns: 4, desc: 'Takes more critical hits.' },
  marked_self: { name: 'Foresight', icon: '◎', color: '#80c0ff', bad: false, turns: 3, desc: 'Critical rate up.' },
  doubled: { name: 'Doubled', icon: '×2', color: '#ffd070', bad: false, turns: 0, desc: 'Next skill repeats.' },
  airborne: { name: 'Airborne', icon: '⇡', color: '#90c0f0', bad: false, turns: 0, desc: 'Out of reach.' },
  guard: { name: 'Guard', icon: '⛉', color: '#d0d0e0', bad: false, turns: 1, desc: 'Takes half damage.' },
  charging: { name: 'Charging', icon: '⚡', color: '#ffd070', bad: false, turns: 1, desc: 'Preparing something big: the next attack hits 1.5× harder. Guard!' },
  windup: { name: 'Winding Up', icon: '⚠', color: '#ff9a60', bad: false, turns: 1, desc: 'About to unleash something big next turn. Guard!' },
};

export const BAD_STATUSES = Object.keys(STATUSES).filter((k) => STATUSES[k].bad);
