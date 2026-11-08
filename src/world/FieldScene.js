// Exploration scene: builds a map diorama, moves the party leader, runs NPCs,
// triggers, exits, chests, random encounters and event scripts.

import * as THREE from 'three';
import { keyCap } from '../core/Input.js';
import { buildMap, windUniform, makeSpriteMaterial, glowMaskFor } from './MapBuilder.js';
import { applyMood } from '../render/Moods.js';
import { ParticleSystem } from '../render/Particles.js';
import { getPropSprite } from '../render/PropFactory.js';
import { Actor } from './Actor.js';
import { ScriptContext } from '../script/ScriptContext.js';
import { getMap } from '../data/maps/index.js';
import { LOOKS } from '../data/looks.js';
import { damp, dirFromVector, DIRS, easeInOutSine, easeOutCubic, weightedPick } from '../core/util.js';
import { el } from '../ui/UI.js';
import { Autosaver, storySnapshot } from './Autosave.js';
import { FieldAtmosphere } from './FieldAtmosphere.js';
import { Followers } from './Followers.js';
import { Minimap } from './Minimap.js';
import { QuestMarkers } from './QuestMarkers.js';
import { attuneNear } from './Waystones.js';
import { MOUNT, hasMount, rideable, mountLook } from '../data/mount.js';

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

  async enter({ mapId, x, y, dir = 'down', skipEnterScript = false, via = null }) {
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


    // Player (still riding Kindle if they rode in and may ride here; data/mount.js)
    ({ x, y } = this.arrivalTile(x, y));
    this.actors.clear();
    this.riding = !!this.state.vars.riding && hasMount(this.state) && rideable(map);
    this.state.vars.riding = this.riding;
    this.player = new Actor(this.playerLook(), { x, y, dir, id: 'player' });
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
    if (this.riding) this.dangerEl.style.display = 'none';
    this.hintEl = el('div', 'interact-hint');
    this.hintEl.style.display = 'none';
    this.hud.appendChild(this.hintEl);
    this.minimap = new Minimap(this);
    this.quest = new QuestMarkers(this);
    this.resetEncounterCounter();

    this.state.setLocation(mapId, x, y, dir, map.name);
    this.resumeMusic();
    if (map.name && !map.noBanner && this.state.lastBannerMap !== mapId) {
      this.state.lastBannerMap = mapId;
      setTimeout(() => game.ui.banner(map.name, map.region || ''), 400);
    }

    this.pendingScript = !skipEnterScript && map.onEnter ? map.onEnter : null;
    if (via) this.playEntrance(x, y, dir);
    this.time = 0;
    game.autosaver ??= new Autosaver(game);
    game.autosaver.request('arrival'); // written once any arrival scene has played
  }

  /**
   * Where the player appears: (x, y), unless that's off the map, in which case the
   * nearest walkable tile that isn't an exit (a bad door target must never strand the
   * player outside, or bounce them straight back out).
   * tests/validate.test.js reports such targets so they get fixed in the data.
   */
  arrivalTile(x, y) {
    const g = this.grid;
    if (g.inside(x, y)) return { x, y };
    console.warn(`${this.mapId}: arrival (${x},${y}) is off the ${g.w}x${g.h} map`);
    const cx = Math.max(0, Math.min(g.w - 1, x)), cy = Math.max(0, Math.min(g.h - 1, y));
    const onExit = (tx, ty) => (this.map.exits || []).some((e) => tx >= e.x && tx < e.x + (e.w || 1) && ty >= e.y && ty < e.y + (e.h || 1));
    for (let r = 0; r < Math.max(g.w, g.h); r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) === r && g.walkable(cx + dx, cy + dy) && !onExit(cx + dx, cy + dy)) return { x: cx + dx, y: cy + dy };
        }
      }
    }
    return { x: cx, y: cy };
  }

  exit() {
    this.hud?.remove();
    this.particles?.dispose(this.scene);
    this.scene.traverse((o) => {
      const m = /** @type {THREE.Mesh} */ (o);
      if (m.geometry) m.geometry.dispose();
      if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach((mat) => mat.dispose());
    });
  }

  /** Called when returning from a pushed scene (battle, menu). */
  resume() {
    this.game.renderer.setGrade(this.env.mood.grade);
    this.game.renderer.setFocus(0.46, this.map.focusBand ?? 0.12);
    this.resumeMusic();
    this.hud.style.display = '';
    this.quest.refresh(); // the objective or Settings may have changed
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
    this.game.autosaver?.update(dt, this);
    this.quest.update(dt);
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
    // The area map (world/Minimap.js): the party waits while it's open.
    if (this.minimap.large) {
      p.moving = false;
      if (input.pressed('map') || input.pressed('cancel') || input.pressed('confirm') || input.pressed('menu')) { input.consumeAll(); this.minimap.toggleLarge(false); }
      return;
    }
    if (input.pressed('map')) {
      input.consume('map');
      if (!this.minimap.toggleLarge(true)) { this.game.audio?.sfx('buzzer'); this.game.ui.toast('There\'s no map of this place.', 1800); }
      p.moving = false;
      return;
    }
    const ax = input.axis();
    if (ax.x || ax.y) {
      const speed = this.riding ? MOUNT.speed : input.down('run') || this.state.settings.autoRun ? RUN_SPEED : WALK_SPEED;
      p.speed = speed;
      p.dir = dirFromVector(ax.x, ax.y, p.dir);
      p.moving = p.tryMove(ax.x * speed * dt, ax.y * speed * dt, this.grid, [...this.actors.values()]);
      if (!p.moving) p.setFrame(p.dir, 0);
      if (this.tryDoor(ax)) return;
    } else {
      p.moving = false;
    }
    if (!(ax.y < 0)) this.doorBumped = false;

    const tileKey = `${p.tileX},${p.tileY}`;
    if (tileKey !== this.lastTile) {
      this.lastTile = tileKey;
      this.onTileEnter(p.tileX, p.tileY);
      if (this.busy) return;
    }

    if (p.moving && p.speed > 5) {
      this.dustT = (this.dustT || 0) - dt;
      if (this.dustT <= 0) {
        this.dustT = this.riding ? 0.07 : 0.12;
        this.particles.burst({ x: p.x, y: p.elev + 0.05, z: p.z + 0.1, count: 2, colors: ['#d8ccb8', '#b8ac98'], speed: 0.6, up: 0.6, gravity: 1.5, life: 0.45, size: 0.35, additive: false, alpha: 0.6 });
        // Kindle sheds embers at a gallop.
        if (this.riding && Math.random() < 0.5) this.particles.burst({ x: p.x, y: p.elev + 1.1, z: p.z, count: 1, colors: ['#ffb24a', '#ffd77a'], speed: 0.4, up: 0.8, gravity: -0.3, life: 0.7, size: 0.22 });
      }
    }
    if (this.riding && p.moving) {
      const beat = Math.floor(p.animT);
      if (beat !== this.hoofBeat) { this.hoofBeat = beat; if (beat % 2 === 0) this.game.audio?.sfx('hoof'); }
    }
    if (input.pressed('ride')) { input.consume('ride'); this.toggleRide(); return; }
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
    const p = this.replacePlayer();
    this.game.audio?.sfx('cursor');
    this.particles.burst({ x: p.x, y: p.elev + 0.8, z: p.z + 0.2, colors: ['#ffffff', '#ffe8a0'], count: 10, speed: 1.2, gravity: 0, life: 0.4 });
  }

  /** The leader's field look: on foot, or riding Kindle. */
  playerLook() {
    const look = this.state.leaderLook();
    return this.riding ? mountLook(look) : look;
  }

  /** Rebuild the player actor in place (leader changed, mounted, dismounted). */
  replacePlayer() {
    const old = this.player;
    const p = new Actor(this.playerLook(), { x: old.tileX, y: old.tileY, dir: old.dir, id: 'player' });
    p.x = old.x; p.z = old.z; p.elev = old.elev;
    p.face(old.dir);
    this.scene.remove(old.root);
    old.dispose();
    this.scene.add(p.root);
    this.player = p;
    p.syncMesh();
    return p;
  }

  // =====================================================================
  // Riding Kindle (data/mount.js)
  // =====================================================================

  /** The Ride key: call Kindle, or get down. */
  toggleRide() {
    if (this.riding) { this.setRiding(false); return; }
    if (!hasMount(this.state)) return;
    if (!rideable(this.map)) {
      this.game.audio?.sfx('buzzer');
      this.game.ui.toast(`${MOUNT.name} won't come here — only on open roads and in the wilds.`, 2600);
      return;
    }
    this.setRiding(true);
  }

  /** Mount or dismount. `quick`: no call, just get down (a scene is starting). */
  setRiding(on, { quick = false } = {}) {
    if (on === this.riding) return;
    this.riding = on;
    this.state.vars.riding = on;
    const p = this.replacePlayer();
    this.dangerEl.style.display = on ? 'none' : '';
    if (on) this.resetEncounterCounter();
    else this.followers.regroup();
    if (quick) return;
    this.game.audio?.sfx(on ? 'hart' : 'cursor');
    this.particles.burst({ x: p.x, y: p.elev + 0.9, z: p.z + 0.2, colors: on ? ['#ffb24a', '#ffd77a', '#fff2c0'] : ['#ffffff', '#ffe8a0'], count: on ? 22 : 10, speed: 1.6, up: 1, gravity: 0, life: 0.6 });
    p.hop(this.game, on ? 0.3 : 0.2, 0.26);
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
    const f = this.frontTile();
    // Facing a counter (a table), talk reaches the shopkeeper standing behind it.
    const reach = this.grid.isCounter(f.x, f.y) ? 2.6 : 1.55;
    let best = null, bestD = reach + 0.05;
    for (const a of this.actors.values()) {
      if (!a.visible || !a.def || (!a.def.talk && !a.def.run)) continue;
      const dx = a.x - p.x, dz = a.z - p.z;
      const dist = Math.hypot(dx, dz);
      if (dist > reach) continue;
      const dot = (dx * d.x + dz * d.y) / (dist || 1);
      if (dot < 0.55) continue;
      if (dist < bestD) { bestD = dist; best = { kind: 'npc', actor: a }; }
    }
    if (best) return best;
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
    if (this.riding) this.setRiding(false, { quick: true });
    switch (t.kind) {
      case 'npc': return this.talkTo(t.actor);
      case 'chest': return this.openChest(t.chest);
      case 'save': return this.runScript(async (s) => {
        this.attune(this.player.tileX, this.player.tileY);
        s.sfx('save');
        s.heal();
        await s.system('The Hearthstone\'s warmth restores you.');
        await s.saveMenu();
      });
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
    if (tag?.door) { this.enterDoor(tag.door, x, y); return; }
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
        this.walkOn(0.35);
        this.goto(e.to, tx, ty, e.dir || this.player.dir, { via: 'exit' });
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
    this.attune(x, y);
    this.stepEncounter();
  }

  /** Passing a route or dungeon Hearthstone makes it a fast-travel point (world/Waystones.js). */
  attune(x, y) {
    if (attuneNear(this, x, y)) this.game.ui.toast(`<span class="hl">Hearthstone attuned</span> — travel back to ${this.map.name} from the world map (Menu → Travel).`, 3600);
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
    if (!enc || this.state.flags.noEncounters || this.riding) return; // the Gloam's things scatter from Kindle's light
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

  /** Run a story step. A scene that lasts past its first frame puts a rider back on foot (keepMount: no). */
  async runScript(fn, { keepMount = false } = {}) {
    if (!fn) return;
    this.busy = true;
    this.player.moving = false;
    this.hintEl.style.display = 'none';
    const ctx = new ScriptContext(this.game, this);
    const before = storySnapshot(this.state);
    try {
      const run = fn(ctx);
      if (this.riding && !keepMount) this.dismountIfScene(run);
      await run;
    } catch (err) {
      console.error('Script error:', err);
    } finally {
      this.busy = false;
      this.game.autosaver?.noteScript(before, storySnapshot(this.state)); // saved once the player is free
      if (this.game.scene === this) { this.refreshNpcs(); this.quest.refresh(); }
    }
  }

  /** Get down if `run` is still going next frame (an onEnter that only checks a flag is not a scene). */
  dismountIfScene(run) {
    let done = false;
    Promise.resolve(run).then(() => { done = true; }, () => { done = true; });
    this.game.tasks.add(() => {
      if (!done && this.riding && this.game.scene === this) this.setRiding(false, { quick: true });
      return true;
    });
  }

  /**
   * Change map with a fade. opts: { via: 'door' | 'exit' (the player walks in on
   * arrival), faded (the screen is already black), sfx (false for none), color }.
   */
  async goto(mapId, x, y, dir = 'down', opts = {}) {
    this.busy = true;
    if (opts.sfx !== false) this.game.audio?.sfx(opts.sfx || 'step_exit');
    const next = new FieldScene(this.game);
    const params = { mapId, x, y, dir, skipEnterScript: opts.skipEnterScript, via: opts.via };
    await this.game.transition(next, params, { color: opts.color || '#000', out: opts.faded ? 0 : 0.35 });
  }

  // =====================================================================
  // Doors and arrivals
  // =====================================================================

  /** Walking up into a door tile from the front opens it (door tiles are solid). */
  tryDoor(ax) {
    const p = this.player;
    if (!(ax.y < 0) || p.dir !== 'up' || this.doorBumped) return false;
    const x = p.tileX, y = p.tileY - 1;
    const door = this.grid.tags.get(`${x},${y}`)?.door;
    if (!door || (!door.to && !door.locked)) return false; // a painted-on door: just a wall
    if (p.z - (y + 1) > p.radius + 0.08) return false; // not up against it yet
    this.doorBumped = true; // a locked door speaks once per push
    this.enterDoor(door, x, y);
    return true;
  }

  /**
   * Go through the door at tile (x, y): it swings open, the player steps into the
   * doorway and fades into its shadow as the screen fades, then the next map.
   */
  enterDoor(d, x, y) {
    if (d.locked && !(d.unlockFlag && this.state.flags[d.unlockFlag])) {
      this.runScript(async (s) => { s.sfx('cursor'); await s.say(null, d.lockedText || 'The door is locked.', { style: 'system', portrait: false }); });
      return;
    }
    if (!d.to) return;
    const p = this.player;
    const door = this.built.doors.get(`${x},${y}`);
    const game = this.game;
    this.busy = true;
    p.moving = false;
    p.face('up');
    (async () => {
      game.audio?.sfx('door');
      if (door) await game.tween(0.22, (k) => door.setOpen(k), easeOutCubic);
      const from = { x: p.x, z: p.z }, to = { x: x + 0.5, z: y + 0.8 }; // just past the threshold
      p.speed = WALK_SPEED;
      p.moving = true;
      p.setInDoorway(true);
      const fade = game.fadeOut(0.4);
      await game.tween(0.4, (k) => {
        p.x = from.x + (to.x - from.x) * k;
        p.z = from.z + (to.z - from.z) * k;
        p.setFade(Math.min(1, k * 1.3));
      });
      await fade;
      p.moving = false;
      await this.goto(d.to, d.tx, d.ty, d.dir || 'up', { via: 'door', faded: true, sfx: false });
    })();
  }

  /** Keep walking the way the player is facing for `seconds` (leaving by a map exit). */
  walkOn(seconds) {
    const p = this.player, d = DIRS[p.dir];
    const dist = Math.min(0.9, (p.speed || WALK_SPEED) * seconds);
    const x0 = p.x, z0 = p.z;
    p.moving = true;
    this.game.tween(seconds, (k) => { p.x = x0 + d.x * dist * k; p.z = z0 + d.y * dist * k; });
  }

  /**
   * Arriving by a door or exit, the player walks in from where they came while the
   * screen fades in: out of a building's door (which then swings shut behind them),
   * or one step in from the exit tile behind them.
   */
  playEntrance(x, y, dir) {
    const d = DIRS[dir];
    const bx = x - d.x, by = y - d.y; // the tile the player came from
    const fromDoor = this.grid.tags.get(`${bx},${by}`)?.door;
    const fromExit = (this.map.exits || []).some((e) => bx >= e.x && bx < e.x + (e.w || 1) && by >= e.y && by < e.y + (e.h || 1));
    if (!fromDoor && !(fromExit && this.grid.walkable(bx, by))) return;
    const door = fromDoor && this.built.doors.get(`${bx},${by}`);
    const p = this.player;
    const from = fromDoor ? { x: bx + 0.5, z: by + 0.8 } : { x: bx + 0.5, z: by + 0.5 };
    p.x = from.x;
    p.z = from.z;
    p.syncMesh();
    if (fromDoor) { p.setFade(1); p.setInDoorway(true); }
    door?.setOpen(1);
    this.followers.hold();
    this.camFocus.set(p.x, p.elev + this.camCfg.lookHeight, p.z);
    this.updateCamera(1, true);
    this.runScript(async () => {
      const game = this.game;
      p.speed = this.riding ? MOUNT.speed * 0.6 : WALK_SPEED;
      p.moving = true;
      await game.tween(0.42, (k) => {
        p.x = from.x + (x + 0.5 - from.x) * k;
        p.z = from.z + (y + 0.5 - from.z) * k;
        if (fromDoor) p.setFade(1 - Math.min(1, k * 1.4));
      }, easeInOutSine);
      p.moving = false;
      p.setFade(0);
      p.setInDoorway(false);
      p.placeAt(x, y, this.grid);
      p.face(dir);
      this.followers.reveal(game);
      if (door) {
        game.audio?.sfx('door_close');
        game.tween(0.3, (k) => door.setOpen(1 - k), easeInOutSine); // shuts behind them; control returns now
      }
    }, { keepMount: true });
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
    this.hintEl.innerHTML = `${keyCap('confirm')} ${label}`;
    this.hintEl.style.left = `${(v.x * 0.5 + 0.5) * window.innerWidth}px`;
    this.hintEl.style.top = `${(-v.y * 0.5 + 0.5) * window.innerHeight}px`;
  }

  render(time) {
    this.game.renderer.render(this.scene, this.camera, time);
  }
}

