// Party followers: the next three party members trail the leader along the path
// it walked (a breadcrumb trail), classic-JRPG caravan style. They are scenery
// only — no collision, never talked to.
//
// A follower steps out of view whenever its character is already on the map as
// another actor (a cutscene spawned them, or they stand around as an NPC in a
// hub), so scripts never show the same person twice. When that actor leaves,
// the follower falls back in behind the leader. Maps marked `solo` (dreams) have none.

import { Actor } from './Actor.js';
import { dirFromVector } from '../core/util.js';

const MAX_FOLLOWERS = 3;
const GAP = 1.0; // trail distance between party members (tiles)
const CRUMB = 0.08; // record a breadcrumb every this many tiles walked
const JUMP = 1.5; // the leader moved farther than this in one frame: teleport, regroup
const OVERLAP = 0.5; // closer than this to the one in front: stay hidden

export class Followers {
  constructor(field) {
    this.field = field;
    this.list = []; // { ch, actor }
    this.trail = []; // newest first: { x, z }
    this.key = '';
  }

  /** Rebuild follower actors when the party order or a look changes. */
  sync() {
    const members = this.field.map.solo ? [] : this.field.state.allMembers().slice(1, 1 + MAX_FOLLOWERS).filter((c) => c.look);
    const key = members.map((c) => `${c.id}:${c.look.id}`).join(',');
    if (key === this.key) return;
    this.key = key;
    this.dispose();
    this.list = members.map((ch) => {
      const actor = new Actor(ch.look, { id: `follower_${ch.id}`, solid: false });
      this.field.scene.add(actor.root);
      return { ch, actor };
    });
    this.regroup();
  }

  /**
   * Line everyone up behind the leader (map entry, teleports): straight back if
   * there is room, else whichever direction has the longest open run.
   */
  regroup() {
    const p = this.field.player;
    const back = { up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0] }[p.dir] || [0, 1];
    const dirs = [back, [back[1], back[0]], [-back[1], -back[0]], [-back[0], -back[1]]];
    const runs = dirs.map((d) => this.openRun(p.x, p.z, d));
    // Prefer behind, then the sides; standing in front of the leader is a last resort.
    const weight = (r, i) => r.length * (i === 3 ? 0.4 : 1);
    const best = runs.reduce((b, r, i) => (weight(r, i) > weight(b, runs.indexOf(b)) ? r : b), runs[0]);
    this.trail = [{ x: p.x, z: p.z }, ...(runs[0].length >= GAP * MAX_FOLLOWERS / CRUMB ? runs[0] : best)];
    for (const f of this.list) { f.actor.face(p.dir); f.actor.elev = p.elev; }
    this.place(0, true);
  }

  /** Breadcrumbs from (x, z) along `dir` until a wall or the caravan's length. */
  openRun(x, z, [dx, dz]) {
    const grid = this.field.grid;
    const crumbs = [];
    for (let d = CRUMB; d <= GAP * MAX_FOLLOWERS + CRUMB; d += CRUMB) {
      const nx = x + dx * d, nz = z + dz * d;
      const ownTile = Math.floor(nx) === Math.floor(x) && Math.floor(nz) === Math.floor(z);
      if (!ownTile && !grid.walkable(Math.floor(nx), Math.floor(nz))) break;
      crumbs.push({ x: nx, z: nz });
    }
    return crumbs;
  }

  /** Keep the party out of sight (the leader is walking in alone) until reveal(). */
  hold() {
    this.held = true;
    for (const f of this.list) { f.actor.visible = false; f.actor.syncMesh(); }
  }

  /** Line the party up behind the leader again and fade them in. */
  reveal(game) {
    this.held = false;
    this.regroup();
    for (const f of this.list) f.actor.setFade(1);
    return game.tween(0.3, (k) => { for (const f of this.list) f.actor.setFade(1 - k); });
  }

  /** Is this character already standing on the map as some other actor? */
  onStage(ch) {
    for (const a of this.field.actors.values()) {
      const id = a.look?.id;
      if (a.visible && id && (id === ch.look.id || id === ch.id || id.startsWith(`${ch.id}_`))) return true;
    }
    return false;
  }

  update(dt) {
    this.sync();
    if (!this.list.length) return;
    const p = this.field.player;
    const head = this.trail[0];
    const moved = Math.hypot(p.x - head.x, p.z - head.z);
    if (moved > JUMP) { this.regroup(); return; }
    if (moved >= CRUMB) {
      this.trail.unshift({ x: p.x, z: p.z });
      this.trail.length = Math.min(this.trail.length, Math.ceil((GAP * MAX_FOLLOWERS) / CRUMB) + 8);
    }
    this.place(dt, false);
  }

  /** Put follower i at distance GAP·(i+1) along the trail behind the leader. */
  place(dt, snap) {
    const p = this.field.player;
    let ahead = { x: p.x, z: p.z };
    this.list.forEach((f, i) => {
      const { x, z } = this.pointAt(GAP * (i + 1));
      // No room yet (a wall behind the leader, or a short trail): wait out of sight
      // rather than standing inside the person in front.
      const crowded = Math.hypot(x - ahead.x, z - ahead.z) < OVERLAP;
      if (!crowded) ahead = { x, z };
      const a = f.actor;
      const dx = x - a.x, dz = z - a.z;
      const stepping = !snap && Math.hypot(dx, dz) > 0.002;
      if (stepping) a.dir = dirFromVector(dx, dz, a.dir);
      a.x = x; a.z = z;
      a.moving = stepping && p.moving;
      a.speed = p.speed;
      a.visible = !this.held && !crowded && !this.onStage(f.ch);
      a.update(dt, this.field.grid);
    });
  }

  /** The point `dist` tiles back along the breadcrumb trail. */
  pointAt(dist) {
    const p = this.field.player;
    let prev = { x: p.x, z: p.z }, left = dist;
    for (const c of this.trail) {
      const seg = Math.hypot(c.x - prev.x, c.z - prev.z);
      if (seg >= left) { const t = seg ? left / seg : 0; return { x: prev.x + (c.x - prev.x) * t, z: prev.z + (c.z - prev.z) * t }; }
      left -= seg;
      prev = c;
    }
    return prev;
  }

  dispose() {
    for (const f of this.list) { this.field.scene.remove(f.actor.root); f.actor.dispose(); }
    this.list = [];
  }
}
