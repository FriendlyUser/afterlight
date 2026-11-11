// A character standing in the field: billboard sprite with walk cycle,
// blob shadow, tile collision and scripted movement helpers.

import * as THREE from 'three';
import { getCharacterSheet, FIELD_W, FIELD_H } from '../render/SpriteFactory.js';
import { getMountSheet } from '../render/MountFactory.js';
import { getMonsterFieldSheet } from '../render/MonsterFactory.js';
import { PX_PER_UNIT } from '../render/PropFactory.js';
import { makeSpriteMaterial, makeDepthMaterial } from './MapBuilder.js';
import { damp, dirFromVector } from '../core/util.js';

const WALK_SEQ = [1, 0, 2, 0];
const WALK_STRIDE = 3.6 / 7.5; // tiles per walk frame
let shadowTex = null;

function blobShadowTexture() {
  if (shadowTex) return shadowTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 32;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(16, 16, 2, 16, 16, 15);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  shadowTex = new THREE.CanvasTexture(cv);
  return shadowTex;
}

export class Actor {
  /**
   * @param {object} look  sprite look descriptor
   * @param {object} opts  { x, y (tile coords), dir, id, name, speed }
   */
  constructor(look, opts = {}) {
    this.id = opts.id || look.id || 'actor';
    this.name = opts.name || '';
    this.look = look;
    // A look of kind 'mount' is Kindle the Emberhart (carrying look.rider, if any); one
    // of kind 'monster' is a creature's battle sprite standing in the field (a hunt mark).
    /** @type {any} */
    this.sheet = look.kind === 'mount' ? getMountSheet(look.rider)
      : look.kind === 'monster' ? getMonsterFieldSheet(look.sprite) : getCharacterSheet(look);
    this.walkSeq = this.sheet.walkSeq || WALK_SEQ;
    this.stride = this.sheet.stride || WALK_STRIDE;
    this.x = (opts.x ?? 0) + 0.5;
    this.z = (opts.y ?? 0) + 0.5;
    this.elev = 0;
    this.dir = opts.dir || 'down';
    this.speed = opts.speed || 3.6;
    this.radius = 0.28;
    this.moving = false;
    this.animT = 0;
    this.solid = opts.solid !== false;
    this.visible = true;
    this.bobOffset = 0;
    this.lockFacing = false;
    // Field NPCs (FieldScene.spawnActor): their map definition, post and wander timer.
    /** @type {any} */
    this.def = null;
    /** @type {{ x: number, y: number } | null} */
    this.home = null;
    this.wanderT = 0;

    const w = (this.sheet.w || FIELD_W) / PX_PER_UNIT, h = (this.sheet.h || FIELD_H) / PX_PER_UNIT;
    this.geometry = new THREE.PlaneGeometry(w, h);
    this.geometry.translate(0, h / 2 - 1.5 / PX_PER_UNIT, 0);
    this.material = makeSpriteMaterial(this.sheet.texture, this.sheet.glow ? { glowMap: this.sheet.glow, glow: 0.9 } : {});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.customDepthMaterial = makeDepthMaterial(this.sheet.texture);
    this.mesh.rotation.x = -0.22;
    this.mesh.userData.actor = this;

    const big = look.kind === 'mount' || look.kind === 'monster';
    const sh = new THREE.Mesh(
      new THREE.PlaneGeometry(big ? 1.7 : 0.9, big ? 0.8 : 0.5),
      new THREE.MeshBasicMaterial({ map: blobShadowTexture(), transparent: true, depthWrite: false }),
    );
    sh.rotation.x = -Math.PI / 2;
    sh.renderOrder = 1;
    this.shadow = sh;

    this.root = new THREE.Group();
    this.root.add(this.mesh, sh);
    this.setFrame(this.dir, 0);
  }

  get tileX() { return Math.floor(this.x); }
  get tileY() { return Math.floor(this.z); }

  setFrame(dir, frame) {
    const r = this.sheet.fieldFrame(dir, frame);
    const uv = this.geometry.attributes.uv;
    uv.setXY(0, r.u0, r.v1); uv.setXY(1, r.u1, r.v1);
    uv.setXY(2, r.u0, r.v0); uv.setXY(3, r.u1, r.v0);
    uv.needsUpdate = true;
  }

  face(dir) { this.dir = dir; this.setFrame(dir, 0); }

  faceToward(other) {
    this.face(dirFromVector(other.x - this.x, other.z - this.z, this.dir));
  }

  placeAt(tx, ty, grid) {
    this.x = tx + 0.5;
    this.z = ty + 0.5;
    if (grid) this.elev = grid.surface(tx, ty);
    this.syncMesh();
  }

  /**
   * Try to move by (dx, dz) in tile units with collision.
   * blockers: other actors to collide with.
   */
  tryMove(dx, dz, grid, blockers = []) {
    const r = this.radius;
    const fx = this.tileX, fy = this.tileY;
    const ok = (nx, nz) => {
      for (const [cx, cz] of [[nx - r, nz - r], [nx + r, nz - r], [nx - r, nz + r], [nx + r, nz + r]]) {
        const tx = Math.floor(cx), ty = Math.floor(cz);
        if ((tx !== fx || ty !== fy) && !grid.canStep(fx, fy, tx, ty)) return false;
        if (tx === fx && ty === fy && !grid.walkable(tx, ty) && grid.inside(tx, ty)) {
          // Allow leaving a tile we are already stuck on.
        }
      }
      for (const b of blockers) {
        if (b === this || !b.solid || !b.visible) continue;
        const ddx = nx - b.x, ddz = nz - b.z;
        if (ddx * ddx + ddz * ddz < (r + b.radius) ** 2) {
          // allow moving away
          const cur = (this.x - b.x) ** 2 + (this.z - b.z) ** 2;
          if (ddx * ddx + ddz * ddz < cur) return false;
        }
      }
      return true;
    };
    let moved = false;
    if (dx && ok(this.x + dx, this.z)) { this.x += dx; moved = true; }
    if (dz && ok(this.x, this.z + dz)) { this.z += dz; moved = true; }
    return moved;
  }

  update(dt, grid) {
    if (this.moving) {
      this.animT += (dt * this.speed) / this.stride;
      this.setFrame(this.dir, this.walkSeq[Math.floor(this.animT) % this.walkSeq.length]);
    } else if (this.animT !== 0) {
      this.animT = 0;
      this.setFrame(this.dir, 0);
    }
    if (grid) this.elev = damp(this.elev, grid.surface(this.tileX, this.tileY), 14, dt);
    this.syncMesh();
  }

  syncMesh() {
    this.root.position.set(this.x, this.elev, this.z);
    this.mesh.position.y = this.bobOffset;
    this.shadow.position.y = 0.02;
    this.root.visible = this.visible;
  }

  /** Scripted walk along a list of tile waypoints. Resolves when done. */
  walkPath(game, points, grid, speed = this.speed) {
    return new Promise((resolve) => {
      let i = 0;
      this.moving = true;
      game.tasks.add((dt) => {
        if (i >= points.length) { this.moving = false; this.setFrame(this.dir, 0); resolve(); return true; }
        const [tx, ty] = points[i];
        const gx = tx + 0.5, gz = ty + 0.5;
        const dx = gx - this.x, dz = gz - this.z;
        const dist = Math.hypot(dx, dz);
        const step = speed * dt;
        if (!this.lockFacing) this.dir = dirFromVector(dx, dz, this.dir);
        if (dist <= step) { this.x = gx; this.z = gz; i++; } else { this.x += (dx / dist) * step; this.z += (dz / dist) * step; }
        this.update(0, null);
        if (grid) this.elev = damp(this.elev, grid.surface(this.tileX, this.tileY), 14, dt);
        this.animT += (dt * speed) / this.stride;
        this.setFrame(this.dir, this.walkSeq[Math.floor(this.animT) % this.walkSeq.length]);
        this.syncMesh();
        return false;
      });
    });
  }

  /**
   * Fade into shadow (k: 0 = normal, 1 = gone), e.g. stepping through a dark doorway.
   * The sprite normally uses a hard alpha cutoff; while fading it blends instead.
   */
  setFade(k) {
    const m = this.material;
    m.color.setScalar(1 - 0.7 * k);
    m.opacity = 1 - k;
    m.transparent = k > 0;
    m.alphaTest = k > 0 ? 0.02 : 0.5;
    this.shadow.material.opacity = 1 - k;
  }

  /**
   * Passing through a doorway: draw over the wall, whose plane would otherwise
   * slice the (backward-leaning) sprite as it steps through.
   */
  setInDoorway(on) {
    this.material.depthTest = !on;
    this.mesh.renderOrder = on ? 5 : 0;
  }

  /** Small hop (emotes, surprise). */
  hop(game, height = 0.35, duration = 0.28) {
    return game.tween(duration, (t) => { this.bobOffset = Math.sin(t * Math.PI) * height; this.syncMesh(); });
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
