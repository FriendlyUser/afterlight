// Autosave: the game keeps three rotating autosaves (state/GameState.js AUTO_SLOTS)
// so there is always a recent one and a couple of older ones to fall back on.
//
// A save is requested on arriving in an area, when the chapter changes, after a story
// beat (the objective changes, a quest finishes, a battle is won) and every few minutes
// of play — and written only once the player is back in control in the field (no scene
// running, no menu open), never on maps marked noSave (dreams, the finale), and not when
// Settings → Autosave is off. Story beats are spaced out; arrivals and new chapters
// always save. A small "Autosaved" mark shows in the corner.

import { el } from '../ui/UI.js';
import { SaveStore } from '../state/GameState.js';

/** Seconds of field play between timed autosaves. */
export const AUTOSAVE_INTERVAL = 300;
/** Seconds between autosaves for story beats and the timer (arrivals and chapters don't wait). */
export const AUTOSAVE_GAP = 45;
const PRIORITY = { time: 1, story: 2, arrival: 3, chapter: 4 };

/** What a script changed that's worth an autosave. */
export function storySnapshot(st) {
  const quests = Object.values(st.vars.quests || {});
  return {
    chapter: st.chapter,
    key: [st.vars.objective || '', quests.filter((q) => q.status === 'done').length, quests.length, st.stats?.battles || 0].join('|'),
  };
}

export class Autosaver {
  constructor(game) {
    this.game = game;
    this.pending = null; // the most important reason asked for since the last save
    this.since = Infinity; // seconds since the last autosave
    this.timer = 0; // seconds of field play toward the next timed autosave
    this.count = 0; // autosaves written this session
    /** @type {{ slot: string, reason: string } | null} */
    this.last = null;
  }

  /** Ask for an autosave: 'arrival' | 'chapter' | 'story' | 'time'. */
  request(reason) {
    if (!this.pending || PRIORITY[reason] > PRIORITY[this.pending]) this.pending = reason;
  }

  /** Compare a script's before/after snapshots and ask for a save if it mattered. */
  noteScript(before, after) {
    if (after.chapter !== before.chapter) this.request('chapter');
    else if (after.key !== before.key) this.request('story');
  }

  /** May the game autosave here at all? */
  allowed(field) {
    const g = this.game, st = g.state;
    if (st.settings.autosave === false || !st.flags.p_woke || field.map.noSave) return false;
    return !g.autoConfirm || g.allowAutosave; // headless tests opt in
  }

  /** Per field frame: count the timer, and write a pending save once the player is free. */
  update(dt, field) {
    this.since += dt;
    this.timer += dt;
    if (this.timer >= AUTOSAVE_INTERVAL) { this.timer = 0; this.request('time'); }
    if (!this.pending) return;
    if (field.busy || field.pendingScript || this.game.scene !== field || this.game.ui.top?.()) return;
    const urgent = this.pending === 'arrival' || this.pending === 'chapter';
    if (!urgent && this.since < AUTOSAVE_GAP) return;
    const reason = this.pending;
    this.pending = null;
    if (!this.allowed(field)) return;
    const slot = SaveStore.writeAuto(this.game.state);
    if (!slot) return;
    this.since = 0;
    this.timer = 0;
    this.count++;
    this.last = { slot, reason };
    this.show();
  }

  /** The corner mark. */
  show() {
    const layer = this.game.ui.layers?.hud;
    if (!layer) return;
    this.mark?.remove();
    this.mark = el('div', 'autosave-mark', '<i>✦</i> Autosaved');
    layer.appendChild(this.mark);
    const mark = this.mark;
    setTimeout(() => mark.classList.add('out'), 1600);
    setTimeout(() => mark.remove(), 2400);
  }
}
