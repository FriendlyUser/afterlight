// Field quest markers: a gold gem floating over where the objective leads on this
// map — the spot, the person, or the exit/door that heads toward it — an arrow at
// the screen edge while it's out of view, the same spots on the minimap (which
// reads `spots`), and the objective itself in the corner. Settings → Quest Guide
// turns it all off (settings.hideQuestGuide). Refreshed on arrival and after
// every script: objectives, and the flags that open new ways, change there.

import * as THREE from 'three';
import { el, richText } from '../ui/UI.js';
import { activeTargets, hopTile, route } from './QuestGuide.js';

let glowTex = null;

function glowTexture() {
  if (glowTex) return glowTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const g = cv.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 31);
  grad.addColorStop(0, 'rgba(255, 236, 170, 0.95)');
  grad.addColorStop(0.35, 'rgba(255, 200, 100, 0.4)');
  grad.addColorStop(1, 'rgba(255, 190, 90, 0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  glowTex = new THREE.CanvasTexture(cv);
  return glowTex;
}

export class QuestMarkers {
  constructor(field) {
    this.field = field;
    this.group = new THREE.Group();
    field.scene.add(this.group);
    this.spots = []; // { x, z, y, actor?, mesh } in world units (tile centre = +0.5)
    this.tracker = el('div', 'quest-tracker');
    this.arrow = el('div', 'quest-arrow');
    field.hud.append(this.tracker, this.arrow);
    // Drawn over everything (no depth test), so a roof or tree never hides the way.
    this.gemGeo = new THREE.OctahedronGeometry(0.24, 0).scale(1, 1.6, 1);
    this.gemMat = new THREE.MeshLambertMaterial({ color: '#ffbf2e', emissive: '#a05e00', flatShading: true, transparent: true, depthTest: false, depthWrite: false });
    this.glowMat = new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, opacity: 0.6, depthTest: false, depthWrite: false });
    this.time = 0;
    this.refresh();
  }

  get on() { return !this.field.state.settings.hideQuestGuide; }

  /** Work out the markers again from the current objective and open ways. */
  refresh() {
    const f = this.field, st = f.state;
    this.group.clear();
    this.spots = [];
    const text = st.vars.objective;
    let note = '';
    if (this.on && text) {
      const targets = activeTargets(st);
      const r = route(f.mapId, targets, st);
      // Reported (tests collect these) once the player is free to look for the way.
      this.miss = targets.length && !r ? `Quest guide: no open way from ${f.mapId} to ${[...new Set(targets.map((t) => t.map))].join(' / ')} for "${text}"` : null;
      if (r?.goals) for (const t of r.goals) this.addGoal(t);
      else if (r?.hop.kind === 'travel') note = `Travel to <b>${r.node?.name || 'your destination'}</b> on the world map (Menu → Travel).`;
      else if (r?.hop) {
        this.addHop(r.hop);
        if (r.node && r.hop.kind === 'world') note = `Out to the world map, then on to <b>${r.node.name}</b>.`;
      }
    }
    this.tracker.innerHTML = this.on && text ? `<div class="qt-head">Objective</div><div class="qt-text">${richText(text)}</div>${note ? `<div class="qt-note">${note}</div>` : ''}` : '';
    this.update(0);
  }

  /** A target on this map: a person (followed) or a tile. A bare map target needs no marker. */
  addGoal(t) {
    const actor = t.npc ? this.field.actors.get(t.npc) : null;
    if (actor?.visible) this.addSpot({ actor, x: actor.x, z: actor.z, lift: 2.15 });
    else if (t.x !== undefined) this.addSpot({ x: t.x + 0.5, z: t.y + 0.5, lift: 1.45, tile: t });
  }

  /** The exit or door that leads on toward the target. */
  addHop(hop) {
    const { x, y } = hopTile(hop);
    if (hop.kind === 'door') this.addSpot({ x: x + 0.5, z: y + 1.15, lift: 1.75, tile: { x, y } }); // over the door, in front of the wall
    else this.addSpot({ x: x + 0.5, z: y + 0.5, lift: 1.25, tile: { x, y } });
  }

  addSpot(s) {
    const g = this.field.grid;
    const tx = s.tile?.x ?? Math.floor(s.x), ty = s.tile?.y ?? Math.floor(s.z);
    s.base = g.inside(tx, ty) ? g.surface(tx, ty) : 0;
    s.mesh = new THREE.Group();
    const gem = new THREE.Mesh(this.gemGeo, this.gemMat);
    const glow = new THREE.Sprite(this.glowMat);
    glow.scale.setScalar(1.15);
    glow.renderOrder = 20;
    gem.renderOrder = 21;
    s.mesh.add(glow, gem);
    s.gem = gem;
    this.group.add(s.mesh);
    this.spots.push(s);
  }

  update(dt) {
    this.time += dt;
    const f = this.field;
    if (this.miss && dt > 0 && !f.busy && !f.pendingScript) { console.warn(this.miss); this.miss = null; } // a real frame with the player in control
    const show = this.on && !f.busy && this.spots.length > 0;
    this.group.visible = show;
    this.tracker.style.display = this.on && !f.busy && this.tracker.innerHTML ? '' : 'none';
    if (!show) { this.arrow.style.display = 'none'; return; }
    const bob = Math.sin(this.time * 2.6) * 0.1;
    for (const s of this.spots) {
      if (s.actor) { s.x = s.actor.x; s.z = s.actor.z; s.base = s.actor.elev; }
      s.mesh.position.set(s.x, s.base + s.lift + bob, s.z);
      s.gem.rotation.y = this.time * 1.8;
    }
    this.pointArrow();
  }

  /** While the nearest marker is off screen, an arrow at the edge points to it. */
  pointArrow() {
    const f = this.field, p = f.player;
    const near = this.spots.reduce((a, b) => (Math.hypot(b.x - p.x, b.z - p.z) < Math.hypot(a.x - p.x, a.z - p.z) ? b : a));
    const v = near.mesh.position.clone().project(f.camera);
    const behind = v.z > 1;
    if (!behind && Math.abs(v.x) < 0.92 && Math.abs(v.y) < 0.86) { this.arrow.style.display = 'none'; return; }
    let dx = behind ? -v.x : v.x, dy = behind ? -v.y : v.y;
    const k = 0.88 / Math.max(Math.abs(dx), Math.abs(dy), 1e-3);
    dx *= k; dy *= k;
    const angle = Math.atan2(-dy, dx); // screen space: y grows downward
    this.arrow.style.display = '';
    this.arrow.style.left = `${(dx * 0.5 + 0.5) * 100}%`;
    this.arrow.style.top = `${(-dy * 0.5 + 0.5) * 100}%`;
    this.arrow.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
  }

  dispose() {
    this.gemGeo.dispose();
    this.gemMat.dispose();
    this.glowMat.dispose();
  }
}
