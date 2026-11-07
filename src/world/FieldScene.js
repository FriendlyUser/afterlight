// Exploration scene: builds a map diorama, moves the party leader, runs NPCs,
// triggers, exits, chests, random encounters and event scripts.

import * as THREE from 'three';
import { buildMap, windUniform, makeSpriteMaterial, glowMaskFor } from './MapBuilder.js';
import { applyMood } from '../render/Moods.js';
import { ParticleSystem } from '../render/Particles.js';
import { getPropSprite } from '../render/PropFactory.js';
import { Actor } from './Actor.js';
import { ScriptContext } from '../script/ScriptContext.js';
import { getMap } from '../data/maps/index.js';
import { LOOKS } from '../data/looks.js';
import { damp, dirFromVector, DIRS, weightedPick } from '../core/util.js';
import { el } from '../ui/UI.js';
import { SaveStore, AUTO_SLOT } from '../state/GameState.js';
import { FieldAtmosphere } from './FieldAtmosphere.js';
import { Followers } from './Followers.js';
import { Minimap } from './Minimap.js';

const CAM = { fov: 30, dist: 20, pitch: 0.68, lookHeight: 0.7 };
const WALK_SPEED = 3.9;
const RUN_SPEED = 6.4;

export class FieldScene {
  constructor(game) {
    this.game = game;
    this.actors = new Map();
    this.busy = false;
    this.camShake = 0;
  }

  get state() { return this.game.state; }

  // =====================================================================
  // Lifecycle
  // =====================================================================

  async enter({ mapId, x, y, dir = 'down', skipEnterScript = false }) {
    const game = this.game;
    const map = getMap(mapId);
    this.map = map;
    this.mapId = mapId;
    this.scene = new THREE.Scene();
    const cam = { ...CAM, ...(map.camera || {}) };
    this.camCfg = cam;
    this.camDist = cam.dist;
    this.camera = new THREE.PerspectiveCamera(cam.fov, 1, 0.5, 400);
    const pick = (v, fallback) => (typeof v === 'function' ? v(this.state) : v) ?? fallback;
    this.moodId = game.debugMood || pick(map.mood, 'day');
    this.musicId = pick(map.music, null);
    this.env = applyMood(this.scene, this.moodId, game.renderer, cam.dist);
    game.renderer.setFocus(0.46, map.focusBand ?? 0.12);

    this.built = buildMap(map, { windows: map.windows ?? this.env.mood.windows });
    this.scene.add(this.built.group);
    this.grid = this.built.grid;
    this.animated = [...this.built.animated];

    this.particles = new ParticleSystem(this.scene);
    const particles = typeof map.particles === 'function' ? map.particles(this.state) : map.particles;
    this.particles.setAmbient(particles === undefined ? this.env.mood.particles : particles);


    // Player
    this.actors.clear();
    const look = this.state.leaderLook();
    this.player = new Actor(look, { x, y, dir, id: 'player' });
    this.player.placeAt(x, y, this.grid);
    this.player.face(dir);
    this.scene.add(this.player.root);
    this.lastTile = `${x},${y}`;
    this.atmos = new FieldAtmosphere(this);
    this.atmos.build(map);

    this.spawnNpcs();
    this.spawnChests();
    this.spawnBlockers();
    this.followers = new Followers(this);
    this.followers.sync();

    // Camera snap
    this.camTarget = null;
    this.camFocus = new THREE.Vector3(this.player.x, this.player.elev + cam.lookHeight, this.player.z);
    this.updateCamera(1, true);

    // HUD
    this.hud = el('div', 'field-hud');
    game.ui.layers.hud.appendChild(this.hud);
    this.dangerEl = el('div', 'danger');
    if (map.encounters) this.hud.appendChild(this.dangerEl);
    this.hintEl = el('div', 'interact-hint');
    this.hintEl.style.display = 'none';
    this.hud.appendChild(this.hintEl);
    this.minimap = new Minimap(this);
    this.resetEncounterCounter();

    this.state.setLocation(mapId, x, y, dir, map.name);
    this.resumeMusic();
    if (map.name && !map.noBanner && this.state.lastBannerMap !== mapId) {
      this.state.lastBannerMap = mapId;
      setTimeout(() => game.ui.banner(map.name, map.region || ''), 400);
    }

    this.pendingScript = !skipEnterScript && map.onEnter ? map.onEnter : null;
    this.time = 0;
    this.autosave();
  }

  /** Autosave on arrival (skipped in test mode and before the story starts). */
  autosave() {
    if (this.game.autoConfirm || !this.state.flags.p_woke) return;
    SaveStore.write(AUTO_SLOT, this.state);
  }

  exit() {
    this.hud?.remove();
    this.particles?.dispose(this.scene);
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    });
  }

  /** Called when returning from a pushed scene (battle, menu). */
  resume() {
    this.game.renderer.setGrade(this.env.mood.grade);
    this.game.renderer.setFocus(0.46, this.map.focusBand ?? 0.12);
    this.resumeMusic();
    this.hud.style.display = '';
  }

  pause() { this.hud.style.display = 'none'; }

  resumeHud() { this.hud.style.display = ''; }

  resumeMusic() {
    const music = this.state.musicOverride || this.musicId;
    if (music) this.game.audio?.playMusic(music);
  }

  // =====================================================================
  // World setup helpers
  // =====================================================================

  spawnNpcs() {
    for (const def of this.map.npcs || []) {
      if (def.cond && !def.cond(this.state)) continue;
      this.spawnActor(def);
    }
  }

  /** Re-evaluate NPC `cond`s: spawn newly-true ones, remove newly-false ones. */
  refreshNpcs() {
    for (const def of this.map.npcs || []) {
      const want = !def.cond || def.cond(this.state);
      const has = this.actors.has(def.id);
      if (want && !has) this.spawnActor(def);
      else if (!want && has && this.actors.get(def.id).def === def) this.removeActor(def.id);
    }
  }

  spawnActor(def) {
    const look = typeof def.look === 'string' ? LOOKS[def.look] : def.look;
    if (!look) { console.warn('Missing look for', def.id, def.look); return null; }
    const a = new Actor(look, { id: def.id, name: def.name, x: def.x, y: def.y, dir: def.dir || 'down', speed: def.speed || 2.2 });
    a.placeAt(def.x, def.y, this.grid);
    a.face(def.dir || 'down');
    a.def = def;
    a.home = { x: def.x, y: def.y };
    a.wanderT = 1 + Math.random() * 3;
    this.scene.add(a.root);
    this.actors.set(def.id, a);
    return a;
  }

  removeActor(id) {
    const a = this.actors.get(id);
    if (!a) return;
    this.scene.remove(a.root);
    a.dispose();
    this.actors.delete(id);
  }

  spawnChests() {
    this.chests = [];
    for (const c of this.map.chests || []) {
      const opened = this.state.flags[this.chestFlag(c)];
      const spr = getPropSprite(opened ? 'chest_open' : 'chest', 0);
      const geo = new THREE.PlaneGeometry(spr.width, spr.height);
      geo.translate(0, spr.height / 2, 0);
      const mesh = new THREE.Mesh(geo, makeSpriteMaterial(spr.texture, { glow: opened ? 0 : 0.35, glowMap: glowMaskFor(spr.canvas) }));
      mesh.position.set(c.x + 0.5, this.grid.surface(c.x, c.y), c.y + 0.5);
      mesh.rotation.x = -0.15;
      mesh.castShadow = true;
      this.scene.add(mesh);
      this.grid.block(c.x, c.y);
      this.chests.push({ def: c, mesh, opened: !!opened });
    }
  }

  /** Map blockers: rubble/gates that block tiles until a script clears them. */
  spawnBlockers() {
    this.blockers = new Map();
    for (const b of this.map.blockers || []) {
      if (this.state.flags[this.blockerFlag(b.id)]) continue;
      if (b.cond && !b.cond(this.state)) continue;
      const meshes = [];
      for (let y = b.y; y < b.y + (b.h || 1); y++) {
        for (let x = b.x; x < b.x + (b.w || 1); x++) {
          this.grid.block(x, y);
          const spr = getPropSprite(b.prop || 'rock', (x * 7 + y) % 4);
          const geo = new THREE.PlaneGeometry(spr.width, spr.height);
          geo.translate(0, spr.height / 2, 0);
          const mesh = new THREE.Mesh(geo, makeSpriteMaterial(spr.texture));
          mesh.position.set(x + 0.5, this.grid.surface(x, y), y + 0.5);
          mesh.rotation.x = -0.12;
          mesh.castShadow = true;
          this.scene.add(mesh);
          meshes.push(mesh);
        }
      }
      this.blockers.set(b.id, { def: b, meshes });
    }
  }

  blockerFlag(id) { return `blocker:${this.mapId}:${id}`; }

  /** Remove a blocker permanently (with a little dust). */
  clearBlocker(id) {
    const rec = this.blockers?.get(id);
    this.state.flags[this.blockerFlag(id)] = true;
    if (!rec) return;
    const b = rec.def;
    for (let y = b.y; y < b.y + (b.h || 1); y++) for (let x = b.x; x < b.x + (b.w || 1); x++) this.grid.block(x, y, 0);
    for (const m of rec.meshes) {
      this.particles.burst({ x: m.position.x, y: m.position.y + 0.4, z: m.position.z + 0.3, colors: ['#d8c8b0', '#a89880'], count: 14, speed: 2, up: 1, gravity: 4, additive: false });
      this.scene.remove(m);
    }
    this.blockers.delete(id);
  }

  async openWorldMap() {
    const { WorldMapScene } = await import('./WorldMapScene.js');
    this.busy = true;
    const dest = await this.game.pushScene(new WorldMapScene(this.game), {});
    this.busy = false;
    if (dest) await this.goto(dest.mapId, dest.tx, dest.ty, dest.dir || 'down');
  }

  chestFlag(c) { return `chest:${this.mapId}:${c.id ?? `${c.x},${c.y}`}`; }

  // =====================================================================
  // Update
  // =====================================================================

  update(dt, inputEnabled) {
    this.time += dt;
    windUniform.value = this.time;
    const input = this.game.input;

    if (this.pendingScript && !this.busy) {
      const fn = this.pendingScript;
      this.pendingScript = null;
      this.runScript(fn);
    }

    if (inputEnabled && !this.busy) this.handlePlayerInput(dt, input);
    else if (!this.busy) this.player.moving = false;

    for (const a of this.actors.values()) {
      if (!this.busy) this.updateWander(a, dt);
      a.update(dt, this.grid);
    }
    this.player.update(dt, this.grid);
    this.followers.update(dt);
    this.minimap.update();

    this.updateCamera(dt);
    this.updateOcclusion();
    this.updateHint();
    this.particles.focus.set(this.player.x, this.player.elev, this.player.z);
    this.atmos.update(dt, this.time);
    this.particles.update(dt, this.camera);
    for (const fn of this.animated) fn(this.time);
    // Sun follows the player so the shadow map stays sharp.
    const sun = this.env.sun;
    sun.target.position.set(this.player.x, 0, this.player.z);
    sun.position.copy(sun.target.position).add(this.env.sunOffset);
  }

  handlePlayerInput(dt, input) {
    const p = this.player;
    const ax = input.axis();
    if (ax.x || ax.y) {
      const speed = input.down('run') || this.state.settings.autoRun ? RUN_SPEED : WALK_SPEED;
      p.speed = speed;
      p.dir = dirFromVector(ax.x, ax.y, p.dir);
      p.moving = p.tryMove(ax.x * speed * dt, ax.y * speed * dt, this.grid, [...this.actors.values()]);
      if (!p.moving) p.setFrame(p.dir, 0);
    } else {
      p.moving = false;
    }

    const tileKey = `${p.tileX},${p.tileY}`;
    if (tileKey !== this.lastTile) {
      this.lastTile = tileKey;
      this.onTileEnter(p.tileX, p.tileY);
      if (this.busy) return;
    }

    if (p.moving && p.speed > 5) {
      this.dustT = (this.dustT || 0) - dt;
      if (this.dustT <= 0) {
        this.dustT = 0.12;
        this.particles.burst({ x: p.x, y: p.elev + 0.05, z: p.z + 0.1, count: 2, colors: ['#d8ccb8', '#b8ac98'], speed: 0.6, up: 0.6, gravity: 1.5, life: 0.45, size: 0.35, additive: false, alpha: 0.6 });
      }
    }
    if (input.pressed('pageRight') || input.pressed('pageLeft')) this.cycleLeader(input.pressed('pageRight') ? 1 : -1);
    if (input.pressed('confirm')) { input.consume('confirm'); this.interact(); }
    else if (input.pressed('menu')) {
      input.consumeAll();
      if (!this.map.noMenu) this.game.menus.openMain(this);
    }
  }

  /** Swap which party member is shown walking (Q/E). */
  cycleLeader(dir) {
    const party = this.state.party;
    if (party.length < 2) return;
    if (dir > 0) party.push(party.shift()); else party.unshift(party.pop());
    const old = this.player;
    const p = new Actor(this.state.leaderLook(), { x: old.tileX, y: old.tileY, dir: old.dir, id: 'player' });
    p.x = old.x; p.z = old.z; p.elev = old.elev;
    p.face(old.dir);
    this.scene.remove(old.root);
    old.dispose();
    this.scene.add(p.root);
    this.player = p;
    p.syncMesh();
    this.game.audio?.sfx('cursor');
    this.particles.burst({ x: p.x, y: p.elev + 0.8, z: p.z + 0.2, colors: ['#ffffff', '#ffe8a0'], count: 10, speed: 1.2, gravity: 0, life: 0.4 });
  }

  updateWander(a, dt) {
    const def = a.def;
    if (!def || !def.wander || a.scripted) return;
    if (a.walking) return;
    a.wanderT -= dt;
    if (a.wanderT > 0) return;
    a.wanderT = 2 + Math.random() * 4;
    const dirs = Object.entries(DIRS);
    const [dname, d] = dirs[Math.floor(Math.random() * dirs.length)];
    const tx = a.tileX + d.x, ty = a.tileY + d.y;
    if (Math.abs(tx - a.home.x) > def.wander || Math.abs(ty - a.home.y) > def.wander) { a.face(dname); return; }
    if (!this.grid.canStep(a.tileX, a.tileY, tx, ty)) { a.face(dname); return; }
    if (this.isOccupied(tx, ty, a)) return;
    a.walking = true;
    a.walkPath(this.game, [[tx, ty]], this.grid, 1.8).then(() => { a.walking = false; });
  }

  isOccupied(tx, ty, except) {
    const p = this.player;
    if (except !== p && Math.floor(p.x) === tx && Math.floor(p.z) === ty) return true;
    for (const b of this.actors.values()) if (b !== except && b.visible && b.tileX === tx && b.tileY === ty) return true;
    return false;
  }

  // =====================================================================
  // Interaction & triggers
  // =====================================================================

  frontTile() {
    const d = DIRS[this.player.dir];
    return { x: Math.floor(this.player.x + d.x * 0.75), y: Math.floor(this.player.z + d.y * 0.75) };
  }

  /** Whatever the player would interact with right now (for hints and confirm). */
  findTarget() {
    const p = this.player;
    const d = DIRS[p.dir];
    let best = null, bestD = 1.6;
    for (const a of this.actors.values()) {
      if (!a.visible || !a.def || (!a.def.talk && !a.def.run)) continue;
      const dx = a.x - p.x, dz = a.z - p.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 1.55) continue;
      const dot = (dx * d.x + dz * d.y) / (dist || 1);
      if (dot < 0.55) continue;
      if (dist < bestD) { bestD = dist; best = { kind: 'npc', actor: a }; }
    }
    if (best) return best;
    const f = this.frontTile();
    const chest = this.chests.find((c) => c.def.x === f.x && c.def.y === f.y && !c.opened);
    if (chest) return { kind: 'chest', chest };
    const inter = this.built.interactables.find((i) => i.x === f.x && i.y === f.y);
    if (inter) return { kind: inter.kind, data: inter };
    const insp = (this.map.inspect || []).find((i) => i.x === f.x && i.y === f.y && (!i.cond || i.cond(this.state)));
    if (insp) return { kind: 'inspect', data: insp };
    return null;
  }

  interact() {
    const t = this.findTarget();
    if (!t) return;
    switch (t.kind) {
      case 'npc': return this.talkTo(t.actor);
      case 'chest': return this.openChest(t.chest);
      case 'save': return this.runScript(async (s) => { s.sfx('save'); s.heal(); await s.system('The Hearthstone\'s warmth restores you.'); await s.saveMenu(); });
      case 'sign': return this.runScript(async (s) => s.say(null, t.data.text, { style: 'system', portrait: false }));
      case 'inspect': return this.runScript(async (s) => {
        if (t.data.run) await t.data.run(s);
        else await s.narrate(t.data.text);
      });
      default: return null;
    }
  }

  talkTo(a) {
    const def = a.def;
    const prevDir = a.dir;
    return this.runScript(async (s) => {
      if (!def.noTurn) a.faceToward(this.player);
      if (def.run) await def.run(s, a);
      else if (typeof def.talk === 'function') await def.talk(s, a);
      else await s.say(def.name, def.talk);
      if (!def.noTurn && def.wander === undefined) a.face(prevDir);
    });
  }

  openChest(c) {
    return this.runScript(async (s) => {
      c.opened = true;
      this.state.flags[this.chestFlag(c.def)] = true;
      const spr = getPropSprite('chest_open', 0);
      c.mesh.material.map = spr.texture;
      c.mesh.material.emissiveIntensity = 0;
      c.mesh.material.needsUpdate = true;
      s.sfx('chest');
      this.particles.burst({ x: c.def.x + 0.5, y: this.grid.surface(c.def.x, c.def.y) + 0.6, z: c.def.y + 0.6, colors: ['#ffe8a0', '#ffffff'], count: 16, speed: 2, up: 1.5, gravity: 2 });
      if (c.def.gold) await s.gold(c.def.gold);
      if (c.def.item) await s.give(c.def.item, c.def.count || 1);
    });
  }

  onTileEnter(x, y) {
    // Doors (buildings / structures)
    const tag = this.grid.tags.get(`${x},${y}`);
    if (tag?.door) {
      const d = tag.door;
      if (d.locked && !(d.unlockFlag && this.state.flags[d.unlockFlag])) {
        this.runScript(async (s) => { await s.say(null, d.lockedText || 'The door is locked.', { style: 'system', portrait: false }); await s.step('player', 0, 1); });
        return;
      }
      if (d.to) { this.goto(d.to, d.tx, d.ty, d.dir || 'up'); return; }
    }
    // Exits
    for (const e of this.map.exits || []) {
      if (x >= e.x && x < e.x + (e.w || 1) && y >= e.y && y < e.y + (e.h || 1)) {
        if (e.cond && !e.cond(this.state)) {
          if (e.blocked) this.runScript(e.blocked);
          continue;
        }
        if (e.to === '@world') { this.openWorldMap(); return; }
        const tx = e.tx + (e.keepOffset === 'x' ? x - e.x : 0);
        const ty = e.ty + (e.keepOffset === 'y' ? y - e.y : 0);
        this.goto(e.to, tx, ty, e.dir || this.player.dir);
        return;
      }
    }
    // Triggers
    for (const t of this.map.triggers || []) {
      if (x < t.x || x >= t.x + (t.w || 1) || y < t.y || y >= t.y + (t.h || 1)) continue;
      const key = `trig:${this.mapId}:${t.id ?? `${t.x},${t.y}`}`;
      if (t.once !== false && this.state.flags[key]) continue;
      if (t.cond && !t.cond(this.state)) continue;
      if (t.once !== false) this.state.flags[key] = true;
      this.runScript(t.run);
      return;
    }
    this.state.setLocation(this.mapId, x, y, this.player.dir, this.map.name);
    this.stepEncounter();
  }

  // =====================================================================
  // Encounters
  // =====================================================================

  resetEncounterCounter() {
    const rate = this.map.encounters?.rate ?? 1;
    const mult = this.state.encounterMultiplier();
    this.stepsLeft = mult <= 0 ? Infinity : (14 + Math.random() * 22) / Math.max(0.05, rate * mult);
    this.stepsMax = this.stepsLeft;
    this.updateDanger();
  }

  updateDanger() {
    if (!this.map.encounters) return;
    const r = this.stepsLeft / this.stepsMax;
    this.dangerEl.className = `danger ${r < 0.3 ? 'high' : r < 0.6 ? 'mid' : ''}`;
  }

  stepEncounter() {
    const enc = this.map.encounters;
    if (!enc || this.state.flags.noEncounters) return;
    if (enc.cond && !enc.cond(this.state)) return;
    const chars = enc.onTiles;
    if (chars && !chars.includes(this.grid.char(this.player.tileX, this.player.tileY))) return;
    this.stepsLeft -= this.player.speed > 5 ? 1.25 : 1;
    this.updateDanger();
    if (this.stepsLeft > 0) return;
    const troop = weightedPick(enc.troops);
    this.resetEncounterCounter();
    this.runScript(async (s) => { await s.battle(troop, { bg: enc.bg || this.map.battleBg, random: true }); });
  }

  async startBattle(troopId, opts = {}) {
    const { BattleScene } = await import('../battle/BattleScene.js');
    this.player.moving = false;
    this.game.audio?.sfx('encounter');
    const startDist = this.camDist;
    await Promise.all([
      this.game.tween(0.45, (t) => { this.camDist = startDist * (1 - 0.35 * t); this.game.renderer.setFlash(t * 0.85, '#ffffff'); }, (t) => t * t),
    ]);
    this.camDist = startDist;
    this.game.renderer.setFlash(0);
    const battle = new BattleScene(this.game);
    const result = await this.game.pushScene(battle, {
      troopId, bg: opts.bg || this.map.battleBg || 'grass', mood: opts.mood || this.map.battleMood || this.moodId,
      canFlee: opts.canFlee ?? !!opts.random, music: opts.music, boss: opts.boss, loseOk: opts.loseOk,
    });
    if (result === 'lose' && !opts.loseOk) {
      await this.game.gameOver();
      return 'lose';
    }
    return result;
  }

  // =====================================================================
  // Scripts
  // =====================================================================

  async runScript(fn) {
    if (!fn) return;
    this.busy = true;
    this.player.moving = false;
    this.hintEl.style.display = 'none';
    const ctx = new ScriptContext(this.game, this);
    try {
      await fn(ctx);
    } catch (err) {
      console.error('Script error:', err);
    } finally {
      this.busy = false;
      if (this.game.scene === this) this.refreshNpcs();
    }
  }

  async goto(mapId, x, y, dir = 'down', opts = {}) {
    this.busy = true;
    this.game.audio?.sfx(opts.sfx || 'step_exit');
    const next = new FieldScene(this.game);
    await this.game.transition(next, { mapId, x, y, dir, skipEnterScript: opts.skipEnterScript }, { color: opts.color || '#000' });
  }

  emote(id, symbol = '!', sec = 1) {
    const a = id === 'player' ? this.player : this.actors.get(id);
    if (!a) return Promise.resolve();
    const e = el('div', 'emote', symbol);
    this.game.ui.layers.hud.appendChild(e);
    const v = new THREE.Vector3();
    const place = () => {
      v.set(a.x, a.elev + 1.85, a.z).project(this.camera);
      e.style.left = `${(v.x * 0.5 + 0.5) * window.innerWidth}px`;
      e.style.top = `${(-v.y * 0.5 + 0.5) * window.innerHeight}px`;
    };
    place();
    this.game.audio?.sfx(symbol === '!' ? 'surprise' : 'blip');
    return this.game.tween(sec, () => place()).then(() => e.remove());
  }

  // =====================================================================
  // Camera
  // =====================================================================

  updateCamera(dt, snap = false) {
    const c = this.camCfg;
    const target = this.camTarget || new THREE.Vector3(this.player.x, this.player.elev + c.lookHeight, this.player.z);
    if (snap) this.camFocus.copy(target);
    else {
      this.camFocus.x = damp(this.camFocus.x, target.x, 6, dt);
      this.camFocus.y = damp(this.camFocus.y, target.y, 4, dt);
      this.camFocus.z = damp(this.camFocus.z, target.z, 6, dt);
    }
    const dist = this.camDist;
    const off = new THREE.Vector3(0, Math.sin(c.pitch) * dist, Math.cos(c.pitch) * dist);
    this.camera.position.copy(this.camFocus).add(off);
    if (this.camShake > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.camShake;
      this.camera.position.y += (Math.random() - 0.5) * this.camShake;
    }
    this.camera.lookAt(this.camFocus);
  }

  panCamera(x, z, sec) {
    const from = this.camFocus.clone();
    const to = new THREE.Vector3(x, this.grid.surface(Math.floor(x), Math.floor(z)) + this.camCfg.lookHeight, z);
    this.camTarget = from.clone();
    return this.game.tween(sec, (t) => { this.camTarget.lerpVectors(from, to, t); }, (t) => t * t * (3 - 2 * t));
  }

  async followPlayer(sec = 0.8) {
    if (!this.camTarget) return;
    const p = this.player;
    await this.panCamera(p.x, p.z, sec);
    this.camTarget = null;
  }

  zoomCamera(dist, sec) {
    const from = this.camDist;
    return this.game.tween(sec, (t) => { this.camDist = from + (dist - from) * t; }, (t) => t * t * (3 - 2 * t));
  }

  shake(intensity, sec) {
    this.game.audio?.sfx('rumble');
    const amt = intensity * (this.game.shakeScale ?? 1);
    return this.game.tween(sec, (t) => { this.camShake = amt * (1 - t); }).then(() => { this.camShake = 0; });
  }

  // =====================================================================
  // Presentation helpers
  // =====================================================================

  updateOcclusion() {
    const p = this.player;
    for (const m of this.built.fadeables) {
      if (!m.userData.box) m.userData.box = new THREE.Box3().setFromObject(m);
      const b = m.userData.box;
      const inFront = b.max.z > p.z + 0.4 && b.min.z < p.z + 6;
      const overX = p.x > b.min.x - 0.2 && p.x < b.max.x + 0.2;
      const tallEnough = b.max.y - p.elev > (b.min.z - p.z) * 0.85;
      const hide = inFront && overX && tallEnough && b.min.z > p.z - 0.2;
      const mat = m.material;
      const target = hide ? 0.35 : 1;
      if (mat.opacity !== target) {
        mat.transparent = true;
        mat.opacity = damp(mat.opacity, target, 10, 1 / 60);
        if (Math.abs(mat.opacity - target) < 0.02) mat.opacity = target;
        mat.depthWrite = mat.opacity > 0.95;
        mat.needsUpdate = true;
      }
    }
  }

  updateHint() {
    if (this.busy) { this.hintEl.style.display = 'none'; return; }
    const t = this.findTarget();
    if (!t) { this.hintEl.style.display = 'none'; return; }
    let label = 'Examine', pos;
    if (t.kind === 'npc') { label = t.actor.def.hint || 'Talk'; pos = [t.actor.x, t.actor.elev + 1.9, t.actor.z]; }
    else if (t.kind === 'chest') { label = 'Open'; pos = [t.chest.def.x + 0.5, this.grid.surface(t.chest.def.x, t.chest.def.y) + 1.1, t.chest.def.y + 0.5]; }
    else { const d = t.data; label = t.kind === 'save' ? 'Rest & Save' : t.kind === 'sign' ? 'Read' : (d.hint || 'Examine'); pos = [d.x + 0.5, this.grid.surface(d.x, d.y) + 1.4, d.y + 0.5]; }
    const v = new THREE.Vector3(...pos).project(this.camera);
    this.hintEl.style.display = '';
    this.hintEl.innerHTML = `<span class="key">Z</span> ${label}`;
    this.hintEl.style.left = `${(v.x * 0.5 + 0.5) * window.innerWidth}px`;
    this.hintEl.style.top = `${(-v.y * 0.5 + 0.5) * window.innerHeight}px`;
  }

  render(time) {
    this.game.renderer.render(this.scene, this.camera, time);
  }
}

