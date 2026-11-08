// The API object handed to every event script: `async (s) => { await s.say(...) }`.
// It wraps the game, the active field scene and the persistent state so story
// content reads like a screenplay.

import { routeAround } from '../world/CutscenePath.js';
import { LOOKS } from '../data/looks.js';
import { playFishing } from '../ui/Fishing.js';

export class ScriptContext {
  constructor(game, field) {
    this.game = game;
    this.field = field;
  }

  get state() { return this.game.state; }
  get ui() { return this.game.ui; }

  // ------------------------------------------------------------------ dialogue

  /** say('Wren', 'Hello') or say('Wren', ['line 1', 'line 2']) */
  async say(speaker, lines, opts = {}) {
    const list = Array.isArray(lines) ? lines : [lines];
    for (const line of list) await this.ui.dialogue(this.name(speaker), this.fill(line), opts);
  }

  /** Narration without a speaker. */
  async narrate(lines, opts = {}) {
    const list = Array.isArray(lines) ? lines : [lines];
    for (const line of list) await this.ui.dialogue(null, this.fill(line), { style: 'narration', portrait: false, ...opts });
  }

  async think(speaker, lines) { return this.say(speaker, lines, { style: 'thought' }); }

  async system(text) { return this.ui.dialogue(null, this.fill(text), { style: 'system', portrait: false }); }

  /** Returns the chosen index. */
  async choice(options, opts = {}) { return this.ui.choice(options.map((o) => this.fill(o)), opts); }

  /** Yes/No helper. Returns boolean. */
  async confirm(prompt, yes = 'Yes', no = 'No') {
    return (await this.ui.choice([yes, no], { prompt, cancel: 1 })) === 0;
  }

  name(speaker) {
    if (!speaker) return null;
    const ch = this.state?.characters?.[speaker.toLowerCase?.()];
    return ch ? ch.name : speaker;
  }

  /** Template substitutions like {gold}. */
  fill(text) {
    return String(text).replace(/\{gold\}/g, () => this.state.gold);
  }

  // ------------------------------------------------------------------ timing / fx

  wait(sec) { return this.game.wait(sec); }
  fadeOut(sec = 0.6, color = '#000') { return this.game.fadeOut(sec, color); }
  fadeIn(sec = 0.6) { return this.game.fadeIn(sec); }
  async flash(color = '#ffffff', sec = 0.35) {
    const r = this.game.renderer;
    await this.game.tween(sec, (t) => r.setFlash(1 - t, color));
    r.setFlash(0);
  }
  shake(intensity = 0.25, sec = 0.5) { return this.field.shake(intensity, sec); }
  card(title, subtitle, hold) { return this.ui.card(title, subtitle, hold); }
  banner(title, sub) { this.ui.banner(title, sub); }
  toast(html) { this.ui.toast(html); }
  music(id, opts) { this.game.audio?.playMusic(id, opts); }
  stopMusic(fade = 1) { this.game.audio?.stopMusic(fade); }
  sfx(id) { this.game.audio?.sfx(id); }
  async chapter(n, title) {
    this.state.chapter = n;
    await this.ui.card(title, n === 0 ? 'Prologue' : `Chapter ${n}`, 3.2);
  }

  // ------------------------------------------------------------------ actors

  actor(id) {
    if (id === 'player') return this.field.player;
    const a = this.field.actors.get(id);
    if (!a) console.warn(`Script: unknown actor '${id}'`);
    return a;
  }

  /** Spawn a temporary actor. look: LOOKS key or descriptor. */
  spawn(id, look, x, y, dir = 'down', opts = {}) {
    const desc = typeof look === 'string' ? LOOKS[look] : look;
    return this.field.spawnActor({ id, look: desc, x, y, dir, ...opts });
  }

  remove(id) { this.field.removeActor(id); }
  /** Re-check NPC spawn conditions now (also happens automatically when a scene ends). */
  refreshNpcs() { this.field.refreshNpcs(); }
  show(id, v = true) { const a = this.actor(id); if (a) { a.visible = v; a.syncMesh(); } }

  /**
   * Walk along waypoints: move('ilse', [[5,6],[5,8]]). Resolves on arrival. Legs that
   * would pass through someone go around them instead (world/CutscenePath.js).
   */
  move(id, points, speed) {
    const a = this.actor(id);
    if (!a) return Promise.resolve();
    return a.walkPath(this.game, routeAround(this.field, a, points), this.field.grid, speed);
  }

  /** Move relative in tiles: step('player', 0, -2) */
  step(id, dx, dy, speed) {
    const a = this.actor(id);
    if (!a) return Promise.resolve();
    return this.move(id, [[a.tileX + dx, a.tileY + dy]], speed);
  }

  face(id, dir) {
    const a = this.actor(id);
    if (!a) return;
    if (typeof dir === 'string' && ['up', 'down', 'left', 'right'].includes(dir)) a.face(dir);
    else { const t = this.actor(dir); if (t) a.faceToward(t); }
  }

  hop(id) { const a = this.actor(id); return a ? a.hop(this.game) : Promise.resolve(); }
  emote(id, symbol = '!', sec = 1.0) { return this.field.emote(id, symbol, sec); }

  /** Teleport an actor within the current map. */
  place(id, x, y, dir) {
    const a = this.actor(id);
    if (!a) return;
    a.placeAt(x, y, this.field.grid);
    if (dir) a.face(dir);
  }

  // ------------------------------------------------------------------ camera

  /** Pan camera to tile (x,y) over sec seconds. */
  pan(x, y, sec = 1) { return this.field.panCamera(x + 0.5, y + 0.5, sec); }
  follow(sec = 0.8) { return this.field.followPlayer(sec); }
  zoom(dist, sec = 1) { return this.field.zoomCamera(dist, sec); }

  // ------------------------------------------------------------------ world/state

  flag(name) { return !!this.state.flags[name]; }
  setFlag(name, value = true) { this.state.flags[name] = value; }
  get vars() { return this.state.vars; }

  async give(itemId, count = 1, quiet = false) {
    this.state.inventory.add(itemId, count);
    if (!quiet) {
      this.sfx('item');
      await this.ui.message(`Obtained *${this.state.inventory.itemName(itemId)}*${count > 1 ? ` ×${count}` : ''}.`);
    }
  }

  async take(itemId, count = 1) { this.state.inventory.remove(itemId, count); }
  has(itemId, count = 1) { return this.state.inventory.count(itemId) >= count; }

  async gold(amount, quiet = false) {
    this.state.gold = Math.max(0, this.state.gold + amount);
    if (!quiet && amount > 0) { this.sfx('item'); await this.ui.message(`Received *${amount}* gold.`); }
  }

  async join(charId, quiet = false) {
    this.state.joinParty(charId);
    if (!quiet) {
      this.sfx('join');
      await this.ui.message(`*${this.state.characters[charId].name}* joined the party!`);
    }
  }

  leave(charId) { this.state.leaveParty(charId); }

  async learnCrest(crestId, quiet = false) {
    this.state.unlockCrest(crestId);
    if (!quiet) { this.sfx('join'); await this.ui.message(`New Crest available: *${this.state.crestName(crestId)}*`); }
  }

  heal() { this.state.healParty(); }

  /** Remove a map blocker (see map.blockers) permanently. */
  clearBlocker(id) { this.field.clearBlocker(id); this.sfx('rumble'); }

  /**
   * Fishing spot: s.fish('sea'|'river'|'oasis'|'swamp'|'ice'|'void').
   * Needs the Fishing Rod. Returns the fish id caught or null.
   */
  async fish(region) {
    if (!this.has('fishing_rod')) { await this.system('The water ripples. If only you had a rod...'); return null; }
    return playFishing(this.game, region);
  }

  /** Open the world map for fast travel. */
  worldMap() { return this.field.openWorldMap(); }

  /** Set the current objective (shown in the Journal) with a toast. */
  objective(text, quiet = false) {
    this.state.vars.objective = text;
    if (!quiet) this.ui.toast(`<span class="hl">Objective</span> — ${text}`, 3200);
  }

  /**
   * Track a side quest in the Journal: s.quest('c2_lost_net', 'The Lost Net', 'Find...')
   * then s.quest('c2_lost_net', null, null, 'done') when finished. Calling it again
   * while active updates the description ("Quest updated").
   */
  quest(id, title, desc, status = 'active') {
    const q = (this.state.vars.quests = this.state.vars.quests || {});
    const prev = q[id];
    q[id] = { id, title: title || prev?.title || id, desc: desc ?? prev?.desc ?? '', status };
    const label = status === 'done' ? 'Quest complete' : prev ? 'Quest updated' : 'New quest';
    this.ui.toast(`<span class="hl">${label}</span> — ${q[id].title}`, 2800);
  }

  /** Append a line to the story-so-far journal. */
  journal(text) {
    this.state.vars.journal = this.state.vars.journal || [];
    this.state.vars.journal.push(text);
  }

  /** Awaken a character's Crest (unlocks their Arts in battle). */
  awaken(charId) {
    const ch = this.state.characters[charId];
    if (ch) ch.sealed = false;
  }

  /** Switch a character's sprite look (e.g. post-timeskip outfits). */
  setLook(charId, lookId) {
    const ch = this.state.characters[charId];
    if (ch) ch.lookId = lookId;
  }

  // ------------------------------------------------------------------ flow

  /** Change map. Resolves after the new map has faded in. */
  teleport(mapId, x, y, dir = 'down', opts = {}) { return this.field.goto(mapId, x, y, dir, opts); }

  /** Start a battle. Resolves to 'win' | 'lose' | 'flee'. */
  battle(troopId, opts = {}) { return this.field.startBattle(troopId, opts); }

  shop(shopId) { return this.game.menus.openShop(shopId); }

  async inn(price = 20, innName = 'the inn') {
    const ok = await this.confirm(`Rest at ${innName} for ${price} gold? (You have ${this.state.gold})`);
    if (!ok) return false;
    if (this.state.gold < price) { await this.say(null, "You don't have enough gold."); return false; }
    this.state.gold -= price;
    await this.fadeOut(0.8);
    this.music('inn', { once: true });
    this.heal();
    await this.wait(2.2);
    await this.fadeIn(0.8);
    this.field.resumeMusic();
    await this.system('The party is fully rested.');
    return true;
  }

  saveMenu() { return this.game.menus.openSave(); }

  /** Run a shared/named event from the events registry. */
  run(fn) { return fn(this); }
}
