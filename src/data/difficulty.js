// Difficulty levels: enemy HP and damage multipliers, plus the words the New Game
// picker and Settings show for each. Index = settings.difficulty.

export const DIFFICULTIES = [
  {
    name: 'Story', hp: 0.7, dmg: 0.65,
    desc: 'For the story first. Foes are frailer and hit softer, so battles stay quick and forgiving.',
  },
  {
    name: 'Normal', hp: 1, dmg: 1,
    desc: 'The intended challenge. Learn each foe\'s weaknesses, Break them, and bosses will test your build.',
  },
  {
    name: 'Hard', hp: 1.3, dmg: 1.25,
    desc: 'For veterans. Foes are tougher and hit harder; every boss demands a plan.',
  },
];

export const DEFAULT_DIFFICULTY = 1;

/** "Enemy HP 70% · damage 65%" — the numbers behind a difficulty. */
export function difficultyStats(d) {
  return `Enemy HP ${Math.round(d.hp * 100)}% · Enemy damage ${Math.round(d.dmg * 100)}%`;
}
