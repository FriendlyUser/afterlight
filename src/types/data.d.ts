// Shapes of the game's data: maps, enemies, troops, skills, items, equipment,
// Crests, story scripts and quest targets. Type-checking only (`npm run typecheck`);
// nothing here exists at runtime. Data modules opt in with JSDoc, e.g.
//   /** @type {import('../../types/data').MapDef} */
//   export const lfStore = { ... };
// Optional fields mirror what the engine reads; a misspelled field is an error.

import type { ScriptContext } from '../script/ScriptContext.js';
import type { GameState } from '../state/GameState.js';

// ---------------------------------------------------------------- scripting

/** A story step: an async function handed the script context (`s.say(...)`). */
export type Script = (s: ScriptContext, ...args: any[]) => any;
/** A condition on the game state (`(st) => st.flags.x`). */
export type Cond = (st: GameState) => boolean;
/** A value, or a function of the game state that picks it. */
export type Dyn<T> = T | ((st: GameState) => T);
/** An object of story steps: `export const PRO = { async brooch(s) { … } }`. */
export type StoryScripts = Record<string, Script>;

/** A facing. Any string type-checks (generated layouts store plain strings); editors suggest the four. */
// ---------------------------------------------------------------- dialogue lines

/**
 * A condition on a line: a function of the game state, or data — 'flag', '!flag',
 * 'party:bram', 'item:tonic>=2', 'quest:c2_cat=done', 'var:c2_scare>=3', 'gold>=100',
 * 'chapter>=3', 'level>=10', joined with & and |; or { all }, { any }, { not }.
 * See src/script/Lines.js.
 */
export type LineCond = boolean | string | Cond | LineCond[] | { all: LineCond[] } | { any: LineCond[] } | { not: LineCond };

/** How a line is shown. */
export interface LineOpts {
  style?: 'narration' | 'thought' | 'system' | (string & {});
  /** Typing speed multiplier for this line. */
  speed?: number;
  portrait?: boolean;
  /** Close by itself after this many seconds. */
  auto?: number;
  /** Voice id to play instead of the one derived from speaker + text. */
  voice?: string;
}

/** Flags to set: 'flag', ['a', 'b'] or { flag: value }. */
export type LineSet = string | string[] | Record<string, any>;

/** One entry of a line script: a line, a conditional block, a branch, a choice… */
export interface LineNode extends LineOpts {
  /** The line (or lines) to say. */
  text?: string | string[];
  /** Narration, whoever is speaking around it. */
  narrate?: string | string[];
  /** Who says it (default: the speaker of the enclosing call or block). */
  by?: string | null;
  if?: LineCond;
  unless?: LineCond;
  /** A block of lines sharing this node's condition, speaker and options. */
  lines?: LineSpec;
  /** Branches: the first whose condition holds plays; one without a condition is the fallback. */
  pick?: LineNode[];
  /** A choice: the prompt (or true for none)… */
  ask?: string | true;
  /** …its options (those whose condition fails are hidden)… */
  options?: LineOption[];
  /** …and the key its picked index is returned under. */
  id?: string;
  set?: LineSet;
  run?: Script;
}

export interface LineOption {
  text: string;
  if?: LineCond;
  unless?: LineCond;
  set?: LineSet;
  run?: Script;
  lines?: LineSpec;
}

/** What s.say / s.narrate / s.talk and an NPC's `talk` accept. Falsy entries are skipped. */
export type LineSpec = string | number | boolean | null | undefined | LineNode | LineSpec[];

export type Dir = 'up' | 'down' | 'left' | 'right' | (string & {});

// ---------------------------------------------------------------- maps

export interface NpcDef {
  id: string;
  name: string;
  /** A LOOKS id, or an inline look. */
  look: string | Record<string, any>;
  x: number;
  y: number;
  dir?: Dir;
  /** Lines to say (the line language: conditions, branches, `by`), or a script; `run` takes over the whole interaction. */
  talk?: LineSpec | Script;
  run?: Script;
  cond?: Cond;
  /** Interaction hint shown over them ("Shop"). */
  hint?: string;
  /** Wander radius in tiles. */
  wander?: number;
  noTurn?: boolean;
  speed?: number;
}

export interface ExitDef {
  x: number;
  y: number;
  w?: number;
  h?: number;
  /** A map id, or '@world' for the world map. */
  to: string;
  tx?: number;
  ty?: number;
  dir?: Dir;
  cond?: Cond;
  /** Runs when the exit is walked into while `cond` is false. */
  blocked?: Script;
  /** Keep the player's offset along this axis (wide edge exits). */
  keepOffset?: 'x' | 'y';
}

export interface TriggerDef {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  run: Script;
  cond?: Cond;
  /** Fire once per save (default) or every time it's entered. */
  once?: boolean;
}

export interface InspectDef {
  x: number;
  y: number;
  text?: string | string[];
  run?: Script;
  hint?: string;
  cond?: Cond;
}

export interface ChestDef {
  id: string;
  x: number;
  y: number;
  item?: string;
  count?: number;
  gold?: number;
}

export interface DoorDef {
  /** Door column within the building (default: the middle). */
  dx?: number;
  to?: string;
  tx?: number;
  ty?: number;
  dir?: Dir;
  locked?: boolean;
  lockedText?: string;
  unlockFlag?: string;
}

export interface BuildingDef {
  x: number;
  y: number;
  w: number;
  /** Depth in tiles. */
  d: number;
  h?: number;
  roofH?: number;
  wall?: string;
  roof?: string;
  windows?: number[];
  door?: DoorDef;
}

export interface StructureDef {
  type: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  color?: string;
  tex?: string;
  lit?: boolean;
  doorTo?: string;
  tx?: number;
  ty?: number;
  dir?: Dir;
  unlockFlag?: string;
  lockedText?: string;
}

export interface BlockerDef {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  prop: string;
  cond?: Cond;
}

export interface SignDef {
  x: number;
  y: number;
  text: string;
}

export interface EncounterDef {
  /** Encounter frequency (1 = normal). */
  rate: number;
  /** [troopId, weight] */
  troops: Array<[string, number]>;
  bg?: string;
  /** Only on these ground characters. */
  onTiles?: string;
  cond?: Cond;
}

export interface MapDef {
  id: string;
  name: string;
  region?: string;
  // Layout (src/data/maps/layouts/*.js, generated by tools/maps/*.py)
  w?: number;
  h?: number;
  ground: string[];
  height?: string[];
  props?: string[];
  legend?: Record<string, any>;
  stairs?: any[];
  spots?: Record<string, number[]>;
  buildings?: BuildingDef[];
  structures?: StructureDef[];
  // Look & sound
  mood?: Dyn<string>;
  music?: Dyn<string | null>;
  particles?: Dyn<string | null | undefined>;
  backdrop?: string | Record<string, any>;
  battleBg?: string;
  battleMood?: string;
  camera?: { dist?: number; pitch?: number; fov?: number; lookHeight?: number };
  focusBand?: number;
  lightShafts?: any;
  windows?: boolean;
  treeType?: string;
  scatter?: { types: string[]; density: number; seed: number };
  // Gameplay
  npcs?: NpcDef[];
  exits?: ExitDef[];
  triggers?: TriggerDef[];
  inspect?: InspectDef[];
  chests?: ChestDef[];
  blockers?: BlockerDef[];
  signs?: SignDef[];
  encounters?: EncounterDef;
  onEnter?: Script;
  // Flags
  noBanner?: boolean;
  noTravel?: boolean;
  noMenu?: boolean;
  noSave?: boolean;
  noMinimap?: boolean;
  /** A dream: no followers. */
  solo?: boolean;
  // Generated Abyss floors
  floor?: number;
  feat?: any;
}

// ---------------------------------------------------------------- battle

export interface EnemyDef {
  id: string;
  name: string;
  level: number;
  sprite: { type: string; [paint: string]: any };
  /** Multipliers on the level curve (hp, str, mag, def, res, spd, exp, gold, cp) and flat evade. */
  stats?: Partial<Record<'hp' | 'str' | 'mag' | 'def' | 'res' | 'spd' | 'exp' | 'gold' | 'cp' | 'evade', number>>;
  poise?: number;
  /** [skillId, weight] for the default AI. */
  skills?: Array<[string, number]>;
  /** A scripted boss AI in battle/AI.js. */
  ai?: string;
  weak?: string[];
  resist?: Record<string, number>;
  immune?: string[];
  /** [itemId, chance] */
  drops?: Array<[string, number]>;
  /** [common, rare] */
  steal?: string[];
  summons?: string[];
  boss?: boolean;
  attackElem?: string;
  attackAnim?: string;
  desc?: string;
}

export interface TroopDef {
  enemies: string[];
  boss?: boolean;
  canFlee?: boolean;
  music?: string;
  bg?: string;
  mood?: string;
  intro?: string;
}

export interface SkillDef {
  name: string;
  kind: string;
  target: string;
  anim: string;
  desc?: string;
  mp?: number;
  hpCost?: number;
  power?: number;
  hits?: number;
  elem?: string;
  stat?: string;
  acc?: number;
  crit?: number;
  ignoreDef?: number;
  drain?: number;
  delay?: number;
  status?: Array<[string, number] | string | any>;
  selfStatus?: any[];
  buffs?: Record<string, any>;
  debuffs?: Record<string, any>;
  selfBuffs?: Record<string, any>;
  cure?: string | string[];
  revive?: number;
  summon?: boolean;
  special?: string;
}

// ---------------------------------------------------------------- items & gear

export interface ItemDef {
  name: string;
  kind: string;
  desc: string;
  icon: string;
  price?: number;
  sell?: number;
  battle?: boolean;
  field?: boolean;
  /** A fish (the angler's log). */
  fish?: boolean;
  /** A Crest tome: the Crest it teaches. */
  crest?: string;
  use?: {
    target: string;
    heal?: number;
    healPct?: number;
    mp?: number;
    mpPct?: number;
    revive?: number;
    cure?: string | string[];
    damage?: number;
    elem?: string;
    status?: any[];
    boost?: Record<string, number>;
    cp?: number;
    special?: string;
  };
}

export interface EquipDef {
  id?: string;
  name: string;
  slot: string;
  tier?: number;
  price?: number;
  desc: string;
  wtype?: string;
  armor?: string;
  atk?: number;
  mag?: number;
  def?: number;
  res?: number;
  spd?: number;
  str?: number;
  lck?: number;
  elem?: string;
  mods?: Record<string, number>;
  flags?: string[];
  immune?: string[];
  resist?: Record<string, number>;
  autoStatus?: string[];
}

export interface PassiveDef {
  name: string;
  cost: number;
  desc: string;
  mods?: Record<string, number>;
  flags?: string[];
  immune?: string[];
  resist?: Record<string, number>;
  autoStatus?: string[];
}

export interface CrestDef {
  name: string;
  tier: number;
  icon: string;
  color: string;
  desc: string;
  stats: Record<string, number>;
  weapons: string[];
  armor: string[];
  shield: boolean;
  ranks: Array<{ skill?: string; passive?: string }>;
  /** Battle outfit, attached from COSTUMES. */
  costume?: Record<string, any>;
  requires?: Record<string, number>;
  unlock?: string;
  /** Mastery Legacy, attached from LEGACIES. */
  legacy?: CrestLegacy;
  /** Lost Callings (Tier IV): where to start looking, shown until it's found. */
  rumour?: string;
  /** Mastery Arts, attached from MASTERY: learned at these Ascension stars. */
  mastery?: Array<{ skill: string; stars: number }>;
}

/** What a mastered Crest leaves in the character: a permanent passive-like bonus. */
export interface CrestLegacy {
  desc: string;
  mods?: Record<string, number>;
  resist?: Record<string, number>;
  immune?: string[];
}

export interface CharacterDef {
  name: string;
  title: string;
  age: number;
  look: string;
  /** Growth multipliers on the stat curve (hp, mp, str, mag, def, res, spd, lck). */
  mult: Record<string, number>;
  startCrest: string;
  startLevel: number;
  personal: { name: string; desc: string };
  equip: Record<string, string>;
  bio: string;
}

export interface ShopDef {
  name: string;
  items: string[];
}

export interface WorldNode {
  id: string;
  name: string;
  region?: string;
  act?: number;
  /** Position on the 1000×750 world map. */
  x: number;
  y: number;
  mapId: string;
  tx: number;
  ty: number;
  dir?: Dir;
  /** A flag, or a test on the game state. */
  unlock?: string | Cond;
  desc?: string;
}

/** A chapter's content (src/data/content/*.js). */
export interface ContentPack {
  maps?: MapDef[];
  enemies?: EnemyDef[];
  troops?: Record<string, TroopDef>;
  looks?: Record<string, any>;
  bossAI?: Record<string, any>;
  shops?: Record<string, ShopDef>;
  worldNodes?: WorldNode[];
}

// ---------------------------------------------------------------- quest guide

/** Where an objective is carried out (src/data/objectives). */
export interface ObjectiveTarget {
  map: string;
  x?: number;
  y?: number;
  npc?: string;
  /** Hidden once this flag (or every flag in the list) is set. */
  unless?: string | string[];
  /** Shown only once this flag (or every flag in the list) is set. */
  after?: string | string[];
}

export interface ObjectiveEntry {
  /** Matches the start of the objective text. */
  text: string;
  at: ObjectiveTarget | ObjectiveTarget[] | null;
}

/** Blue side-quest marker targets (src/data/objectives/side.js). */
export interface SideQuestEntry {
  /** The quest id passed to s.quest(). */
  quest: string;
  /** Matches the start of the quest's current description; omit for any step. */
  step?: string;
  at: ObjectiveTarget | ObjectiveTarget[] | null;
}
