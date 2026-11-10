// Everything that persists in a save file: party, inventory, flags, location.

import { Character } from './Character.js';
import { ITEMS } from '../data/items.js';
import { EQUIPMENT } from '../data/equipment.js';
import { CRESTS } from '../data/crests.js';
import { LOOKS } from '../data/looks.js';

export const SAVE_VERSION = 1;
export const ACTIVE_PARTY_SIZE = 4;

export class Inventory {
  constructor(entries = {}) { this.items = new Map(Object.entries(entries)); }

  count(id) { return this.items.get(id) || 0; }

  add(id, n = 1) {
    if (!ITEMS[id] && !EQUIPMENT[id]) console.warn('Unknown item', id);
    this.items.set(id, Math.min(99, this.count(id) + n));
  }

  remove(id, n = 1) {
    const c = this.count(id) - n;
    if (c <= 0) this.items.delete(id); else this.items.set(id, c);
  }

  itemDef(id) { return ITEMS[id] || EQUIPMENT[id]; }
  itemName(id) { return this.itemDef(id)?.name || id; }

  /**
   * Entries filtered by predicate on the def: [[id, count, def], ...]
   * @param {(def: any) => boolean} [pred]
   */
  list(pred = () => true) {
    return [...this.items.entries()]
      .map(([id, n]) => [id, n, this.itemDef(id)])
      .filter(([, , d]) => d && pred(d));
  }

  serialize() { return Object.fromEntries(this.items); }
}

export class GameState {
  constructor() {
    this.characters = {};
    this.party = [];
    this.inventory = new Inventory();
    this.gold = 0;
    /** @type {Record<string, any>} story flags: flag name -> value (usually true) */
    this.flags = {};
    /** @type {Record<string, any>} story variables (objective, quests, journal, counters…) */
    this.vars = {};
    this.chapter = 0;
    this.playtime = 0;
    this.location = { mapId: null, x: 0, y: 0, dir: 'down', name: '' };
    this.unlockedCrests = new Set();
    this.bestiary = {};
    this.stats = { battles: 0, steps: 0, escapes: 0 };
    this.settings = { autoRun: false, musicVolume: 0.6, sfxVolume: 0.7, textSpeed: 1, battleSpeed: 0, difficulty: 1, encounters: 0, reduceEffects: false, hideMinimap: false, hideQuestGuide: false, hideSideQuests: false, autosave: true, voiceVolume: 0.8, autoAdvance: false, fastMode: false, fastSpeed: 3, keys: null };
    this.musicOverride = null;
    this.lastBannerMap = null;
  }

  // ------------------------------------------------------------------ party

  addCharacter(id) {
    if (!this.characters[id]) this.characters[id] = new Character(id);
    return this.characters[id];
  }

  joinParty(id) {
    const c = this.addCharacter(id);
    if (!this.party.includes(id)) this.party.push(id);
    // A newcomer's basic Crest becomes available to everyone; legendary ones
    // (Sable's Gloamweaver) stay theirs until the story shares them.
    if (CRESTS[c.crest]?.tier === 1) this.unlockCrest(c.crest);
    return c;
  }

  leaveParty(id) { this.party = this.party.filter((p) => p !== id); }

  /** Characters in battle order: first ACTIVE_PARTY_SIZE are active. */
  activeMembers() { return this.party.slice(0, ACTIVE_PARTY_SIZE).map((id) => this.characters[id]); }
  reserveMembers() { return this.party.slice(ACTIVE_PARTY_SIZE).map((id) => this.characters[id]); }
  allMembers() { return this.party.map((id) => this.characters[id]); }

  leader() { return this.characters[this.party[0]]; }

  leaderLook() {
    const l = this.leader();
    return l ? l.look : LOOKS.wren;
  }

  healParty() { for (const c of this.allMembers()) c.fullHeal(); }

  // ------------------------------------------------------------------ crests

  unlockCrest(id) {
    if (!CRESTS[id]) return;
    this.unlockedCrests.add(id);
  }

  crestName(id) { return CRESTS[id]?.name || id; }

  /** Crests a character may currently switch to. */
  crestsAvailableTo(ch) {
    // "One Crest, one life" — until the Crestless Sage teaches otherwise (Chapter 2).
    if (!this.flags.crestArtLearned) return Object.keys(ch.crests);
    return Object.keys(CRESTS).filter((id) => {
      const c = CRESTS[id];
      if (c.tier === 2) return this.flags.crestArtLearned && ch.meetsRequirements(id);
      if (id === 'gloamweaver' && ch.id === 'sable') return true;
      return this.unlockedCrests.has(id) || ch.crests[id] !== undefined;
    });
  }

  // ------------------------------------------------------------------ misc

  encounterMultiplier() {
    let pct = 0;
    for (const c of this.activeMembers()) pct += c.modifiers().mods.encounter || 0;
    const setting = [1, 0.5, 0][this.settings.encounters || 0];
    return Math.max(0, (1 + pct / 100) * setting);
  }

  setLocation(mapId, x, y, dir, name) {
    this.location = { mapId, x, y, dir, name: name || this.location.name };
  }

  tickPlaytime(dt) { this.playtime += dt; }

  // ------------------------------------------------------------------ persistence

  serialize() {
    return {
      version: SAVE_VERSION,
      characters: Object.fromEntries(Object.entries(this.characters).map(([k, c]) => [k, c.serialize()])),
      party: this.party,
      inventory: this.inventory.serialize(),
      gold: this.gold,
      flags: this.flags,
      vars: this.vars,
      chapter: this.chapter,
      playtime: this.playtime,
      location: this.location,
      unlockedCrests: [...this.unlockedCrests],
      bestiary: this.bestiary,
      stats: this.stats,
      settings: this.settings,
      musicOverride: this.musicOverride,
    };
  }

  static deserialize(data) {
    const s = new GameState();
    for (const [k, c] of Object.entries(data.characters)) s.characters[k] = Character.deserialize(c);
    s.party = data.party;
    s.inventory = new Inventory(data.inventory);
    s.gold = data.gold;
    s.flags = data.flags || {};
    s.vars = data.vars || {};
    s.chapter = data.chapter || 0;
    s.playtime = data.playtime || 0;
    s.location = data.location;
    s.unlockedCrests = new Set(data.unlockedCrests || []);
    s.bestiary = data.bestiary || {};
    s.stats = { ...s.stats, ...(data.stats || {}) };
    s.settings = { ...s.settings, ...(data.settings || {}) };
    s.musicOverride = data.musicOverride || null;
    return s;
  }
}

// ---------------------------------------------------------------------------
// Save slots (localStorage)
// ---------------------------------------------------------------------------

const SLOT_KEY = (n) => `afterlight.save.${n}`;
export const SAVE_SLOTS = 6;
export const AUTO_SLOT = 'auto';
/** Rotating autosaves, newest written by Autosaver (world/Autosave.js); 'auto' is the pre-rotation slot. */
export const AUTO_SLOTS = ['auto', 'auto2', 'auto3'];
/** Seconds of play an autosave is kept up to date in place before the next one rotates to a new slot. */
export const AUTO_ROTATE = 600;
const SAVE_FILE_FORMAT = 'afterlight-save'; // marks exported save files
const MAX_SAVE_FILE = 5_000_000; // characters; real saves are a few dozen KB

export const SaveStore = {
  write(slot, state) {
    const data = state.serialize();
    const summary = {
      chapter: state.chapter, playtime: state.playtime, location: state.location.name,
      leader: state.party[0], level: state.leader()?.level || 1, party: state.party.slice(0, 4), savedAt: Date.now(),
    };
    try {
      localStorage.setItem(SLOT_KEY(slot), JSON.stringify({ summary, data }));
      return true;
    } catch (e) {
      console.error('Save failed', e);
      return false;
    }
  },
  read(slot) {
    try {
      const raw = localStorage.getItem(SLOT_KEY(slot));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  summaries() {
    return Array.from({ length: SAVE_SLOTS }, (_, i) => this.read(i)?.summary || null);
  },
  /** The autosaves that exist, newest first: [{ slot, summary }]. */
  autos() {
    return AUTO_SLOTS.map((slot) => ({ slot, summary: this.read(slot)?.summary })).filter((a) => a.summary).sort((a, b) => b.summary.savedAt - a.summary.savedAt);
  },
  /**
   * Write an autosave. The newest is kept up to date in place for AUTO_ROTATE seconds of
   * play; after that (or after loading an older game) the next one goes to a free slot or
   * over the oldest. Returns the slot written, or null.
   */
  writeAuto(state) {
    const autos = this.autos();
    const newest = autos[0];
    const ahead = newest ? state.playtime - (newest.summary.playtime || 0) : -1;
    const slot = newest && ahead >= 0 && ahead < AUTO_ROTATE ? newest.slot : AUTO_SLOTS.find((s) => !this.read(s)) ?? autos[autos.length - 1].slot;
    return this.write(slot, state) ? slot : null;
  },
  /** Most recent save including the autosave; -1 if none. */
  latestSlot() {
    /** @type {number | string} */
    let best = -1;
    let t = -1;
    this.summaries().forEach((s, i) => { if (s && s.savedAt > t) { t = s.savedAt; best = i; } });
    const auto = this.autos()[0];
    if (auto && auto.summary.savedAt > t) best = auto.slot;
    return best;
  },
  remove(slot) { try { localStorage.removeItem(SLOT_KEY(slot)); } catch { /* ignore */ } },

  /** A slot as a portable save file (JSON text), or null if the slot is empty. */
  exportFile(slot) {
    const rec = this.read(slot);
    if (!rec) return null;
    return JSON.stringify({ format: SAVE_FILE_FORMAT, version: SAVE_VERSION, exportedAt: new Date().toISOString(), ...rec });
  },

  /**
   * Store a save file's contents in `slot`. Throws an Error with a player-facing
   * message if the text isn't an intact Afterlight save; the slot is untouched then.
   */
  importFile(slot, text) {
    if (text.length > MAX_SAVE_FILE) throw new Error('That file is far too large to be a save.');
    let rec;
    try { rec = JSON.parse(text); } catch { throw new Error('That file is not a save file.'); }
    if (rec?.format !== SAVE_FILE_FORMAT || !rec.data || !rec.summary) throw new Error('That file is not an Afterlight save.');
    if ((rec.data.version || 1) > SAVE_VERSION) throw new Error('That save is from a newer version of the game.');
    try { GameState.deserialize(rec.data); } catch { throw new Error('That save file is damaged.'); }
    try {
      localStorage.setItem(SLOT_KEY(slot), JSON.stringify({ summary: rec.summary, data: rec.data }));
    } catch {
      throw new Error('The browser refused to store the save (storage full or blocked).');
    }
  },
};
