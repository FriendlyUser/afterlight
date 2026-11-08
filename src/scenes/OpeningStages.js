// Sets for the opening movie: a map diorama (the field without its player, HUD or
// scripts), a battle stage, or plain black. Each set holds the cast for the
// current shot and knows how to turn a shot's (x, y) marks into world points.

import * as THREE from 'three';
import { buildMap, windUniform } from '../world/MapBuilder.js';
import { FieldAtmosphere } from '../world/FieldAtmosphere.js';
import { Actor } from '../world/Actor.js';
import { applyMood, MOODS } from '../render/Moods.js';
import { ParticleSystem } from '../render/Particles.js';
import { getCharacterSheet, BATTLE_W, BATTLE_H } from '../render/SpriteFactory.js';
import { getMonsterSprite } from '../render/MonsterFactory.js';
import { PX_PER_UNIT } from '../render/PropFactory.js';
import { buildBattleStage, partySlot, enemySlot, battlerMesh, setBattlePose } from '../battle/BattleStage.js';
import { BATTLE_BACKGROUNDS } from '../battle/Backgrounds.js';
import { getMap } from '../data/maps/index.js';
import { LOOKS } from '../data/looks.js';
import { ENEMIES } from '../data/enemies.js';
import { Character } from '../state/Character.js';

/** Stage cache key for a shot's `stage` spec: shots on the same set reuse it. */
export function stageKey(spec) {
  if (spec.battle) return `battle:${spec.battle}`;
  if (spec.map) return `map:${spec.map}:${spec.mood}`;
  return 'void';
}

/**
 * What OpeningScene drives, whichever set a shot builds.
 * @typedef {object} Stage
 * @property {string} key
 * @property {THREE.Scene} scene
 * @property {(...args: any[]) => THREE.Vector3} point
 * @property {(renderer: any) => void} apply
 * @property {(...args: any[]) => void} cast
 * @property {() => void} clearCast
 * @property {(...args: any[]) => void} update
 * @property {() => void} dispose
 * @property {(beat: any) => void} [beat]
 * @property {any} [atmos]
 */

/** @returns {Stage} */
export function makeStage(game, camera, spec) {
  if (spec.battle) return new BattleSet(game, camera, spec);
  if (spec.map) return new MapSet(game, camera, spec);
  return new VoidSet();
}

/** A look by LOOKS id, or a character in a Crest's costume: { char: 'wren', crest: 'mender' }. */
export function resolveLook(spec) {
  if (typeof spec === 'string') return LOOKS[spec];
  const ch = new Character(spec.char);
  if (spec.look) ch.lookId = spec.look;
  if (spec.crest) ch.setCrest(spec.crest);
  return ch.battleLook();
}

function disposeScene(scene) {
  scene.traverse((o) => {
    o.geometry?.dispose();
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
  });
  scene.background?.dispose?.();
}

// ---------------------------------------------------------------------------

class VoidSet {
  constructor() {
    this.key = 'void';
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#000');
  }

  point() { return new THREE.Vector3(); }
  apply(renderer) { renderer.setGrade({}); }
  cast() {}
  clearCast() {}
  update() {}
  dispose() {}
}

/** A map lit by a mood. Implements the slice of FieldScene that FieldAtmosphere reads. */
class MapSet {
  constructor(game, camera, { map: mapId, mood }) {
    const map = getMap(mapId);
    if (!map) throw new Error(`Opening: unknown map ${mapId}`);
    this.key = stageKey({ map: mapId, mood });
    this.game = game;
    this.camera = camera;
    this.moodId = mood;
    this.scene = new THREE.Scene();
    this.env = applyMood(this.scene, mood, game.renderer, 18);
    this.built = buildMap(map, { windows: map.windows ?? this.env.mood.windows });
    this.scene.add(this.built.group);
    this.grid = this.built.grid;
    this.animated = [...this.built.animated];
    this.particles = new ParticleSystem(this.scene);
    this.particles.setAmbient(this.env.mood.particles);
    this.actors = new Map();
    // Stand-in for the party leader: the light pool and the party light follow the camera's focus.
    this.player = { x: 0, z: 0, elev: 0, material: { userData: { glowSet: true } } };
    this.atmos = new FieldAtmosphere(/** @type {any} */ (this)); // this set stands in for a FieldScene
    this.atmos.build(map);
  }

  get state() { return this.game.state; }

  point(x, y, lift = 0) {
    const tx = Math.floor(x), ty = Math.floor(y);
    const ground = this.grid.inside(tx, ty) ? this.grid.surface(tx, ty) : 0;
    return new THREE.Vector3(x + 0.5, ground + lift, y + 0.5);
  }

  apply(renderer) { renderer.setGrade(this.env.mood.grade); }

  /**
   * Put a shot's actors on the map: [{ id, look, x, y, dir, to: [x, y], speed, costumes, every }].
   * `to` walks there during the shot; `costumes` cycles a list of looks every `every` seconds.
   */
  cast(actors = []) {
    for (const spec of actors) {
      const looks = (spec.costumes || [spec.look]).map(resolveLook);
      /** @type {Actor & { spec?: any, from?: { x: number, z: number }, sheets?: any[] }} a cast member with its shot direction */
      const a = new Actor(looks[0], { id: spec.id, x: spec.x, y: spec.y, dir: spec.dir || 'down', speed: spec.speed || 2.2 });
      a.placeAt(spec.x, spec.y, this.grid);
      a.face(spec.dir || 'down');
      a.spec = spec;
      a.from = { x: a.x, z: a.z };
      a.sheets = looks.map(getCharacterSheet);
      this.scene.add(a.root);
      this.actors.set(spec.id || `a${this.actors.size}`, a);
    }
  }

  clearCast() {
    for (const a of this.actors.values()) {
      this.scene.remove(a.root);
      a.dispose();
      a.mesh.customDepthMaterial.dispose();
      a.shadow.geometry.dispose();
      a.shadow.material.dispose();
    }
    this.actors.clear();
  }

  /** Swap an actor's costume (Crest montage): new sheet, same frame. */
  wear(a, i) {
    const sheet = a.sheets[Math.min(i, a.sheets.length - 1)];
    if (a.sheet === sheet) return;
    a.sheet = sheet;
    a.material.map = sheet.texture;
    if (a.material.emissiveMap) a.material.emissiveMap = sheet.texture; // dark moods' sprite glow
    a.mesh.customDepthMaterial.map = sheet.texture;
    a.setFrame(a.dir, 0);
  }

  update(dt, time, t, focus) {
    windUniform.value = time;
    for (const fn of this.animated) fn(time);
    for (const a of this.actors.values()) this.animateActor(a, dt, t);
    Object.assign(this.player, { x: focus.x, z: focus.z, elev: focus.y });
    this.atmos.update(dt, time);
    this.particles.focus.copy(focus);
    this.particles.update(dt, this.camera);
    this.env.sun.target.position.copy(focus);
    this.env.sun.position.copy(focus).add(this.env.sunOffset);
  }

  animateActor(a, dt, t) {
    const s = a.spec;
    if (s.costumes) this.wear(a, Math.floor(Math.max(0, t - (s.from ?? 0)) / s.every));
    if (s.to) {
      const [tx, ty] = s.to;
      const dx = tx + 0.5 - a.from.x, dz = ty + 0.5 - a.from.z;
      const len = Math.hypot(dx, dz);
      const k = Math.min(1, (t * a.speed) / Math.max(1e-3, len));
      a.x = a.from.x + dx * k;
      a.z = a.from.z + dz * k;
      a.moving = k < 1;
      if (a.moving && s.faceWalk !== false) a.dir = Math.abs(dx) > Math.abs(dz) ? (dx > 0 ? 'right' : 'left') : (dz > 0 ? 'down' : 'up');
      if (!a.moving && s.dir) a.dir = s.dir;
    }
    a.update(dt, this.grid);
  }

  dispose() {
    this.clearCast();
    this.particles.dispose(this.scene);
    disposeScene(this.scene);
  }
}

/** A battle background with party and foes in their battle slots. */
class BattleSet {
  constructor(game, camera, { battle: bgId }) {
    const bg = BATTLE_BACKGROUNDS[bgId];
    if (!bg) throw new Error(`Opening: unknown battle background ${bgId}`);
    this.key = stageKey({ battle: bgId });
    this.game = game;
    this.camera = camera;
    this.scene = new THREE.Scene();
    const base = bg.mood || 'day';
    this.env = applyMood(this.scene, MOODS[`${base}_battle`] ? `${base}_battle` : base, game.renderer, 12);
    this.animated = buildBattleStage(this.scene, bg).animated;
    const key = new THREE.DirectionalLight('#fff4e8', 1.1);
    key.position.set(2, 6, 12);
    this.scene.add(key, new THREE.HemisphereLight('#ffffff', '#404050', 0.45));
    this.particles = new ParticleSystem(this.scene);
    this.particles.setAmbient(bg.particles ?? this.env.mood.particles);
    this.particles.area = { w: 20, d: 10 };
    this.sprites = [];
  }

  point(x, y, lift = 0) { return new THREE.Vector3(x, lift, y); }

  apply(renderer) { renderer.setGrade(this.env.mood.grade); }

  /** cast({ party: [look specs], foes: [enemy ids] }) → sprites addressed as p0.. and f0.. */
  cast({ party = [], foes = [] } = {}) {
    party.forEach((spec, i) => {
      const sheet = getCharacterSheet(resolveLook(spec));
      const mesh = battlerMesh(sheet.texture, BATTLE_W / PX_PER_UNIT, BATTLE_H / PX_PER_UNIT);
      this.addSprite(`p${i}`, mesh, partySlot(i), sheet, BATTLE_H / PX_PER_UNIT);
      setBattlePose(mesh, sheet, 'ready');
    });
    const sizes = foes.map((id) => ENEMIES[id].sprite.size || 1);
    const bySize = foes.map((_, i) => i).sort((a, b) => sizes[b] - sizes[a]);
    foes.forEach((id, i) => {
      const spr = getMonsterSprite(ENEMIES[id].sprite);
      const mesh = battlerMesh(spr.texture, spr.width, spr.height);
      this.addSprite(`f${i}`, mesh, enemySlot(bySize.indexOf(i), foes.length, sizes[i] >= 2), null, spr.height);
    });
  }

  addSprite(id, mesh, pos, sheet, h) {
    mesh.position.copy(pos);
    this.scene.add(mesh);
    this.sprites.push({ id, mesh, sheet, h, base: pos.clone(), pose: 'ready', poseT: 0, lunge: null, flashT: 0, shakeT: 0, seed: this.sprites.length * 1.7 });
  }

  sprite(id) { return this.sprites.find((s) => s.id === id); }

  clearCast() {
    for (const s of this.sprites) { this.scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); }
    this.sprites = [];
  }

  /** A battle beat: { who, pose, lunge: target, hit: target, burst: [colors] }. */
  beat(b) {
    const s = this.sprite(b.who);
    if (s?.sheet && b.pose) { setBattlePose(s.mesh, s.sheet, b.pose); s.pose = b.pose; s.poseT = b.hold ?? 0.55; }
    const target = this.sprite(b.lunge);
    if (s && target) s.lunge = { to: target.base.clone().lerp(s.base, 0.55), t: 0 };
    const hit = this.sprite(b.hit);
    if (hit) {
      hit.flashT = 0.22;
      hit.shakeT = 0.3;
      if (hit.sheet) { setBattlePose(hit.mesh, hit.sheet, 'hurt'); hit.poseT = 0.4; }
      const p = hit.base.clone();
      this.particles.burst({ x: p.x, y: p.y + hit.h * 0.5, z: p.z + 0.3, count: 22, colors: b.burst || ['#fff4d0', '#ffc070'], speed: 4, up: 1, gravity: 3, life: 0.6, size: 0.35 });
    }
  }

  update(dt, time, t, focus) {
    windUniform.value = time;
    for (const fn of this.animated) fn(time);
    for (const s of this.sprites) {
      const m = s.mesh;
      m.position.copy(s.base);
      m.position.y += Math.sin(time * 2.2 + s.seed) * 0.015;
      if (s.lunge) {
        s.lunge.t += dt;
        const k = Math.sin(Math.min(1, s.lunge.t / 0.36) * Math.PI);
        m.position.lerp(s.lunge.to, k);
        if (s.lunge.t > 0.36) s.lunge = null;
      }
      if (s.shakeT > 0) { s.shakeT -= dt; m.position.x += Math.sin(time * 70) * 0.06 * (s.shakeT / 0.3); }
      s.flashT = Math.max(0, s.flashT - dt);
      m.material.emissiveIntensity = s.flashT > 0 ? 0.9 : 0;
      if (s.poseT > 0 && (s.poseT -= dt) <= 0 && s.sheet) setBattlePose(m, s.sheet, 'ready');
    }
    this.particles.focus.copy(focus);
    this.particles.update(dt, this.camera);
  }

  dispose() {
    this.clearCast();
    this.particles.dispose(this.scene);
    disposeScene(this.scene);
  }
}
