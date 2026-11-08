// Field atmosphere: everything that makes a map *feel* lit — the pooled point
// lights, ocean/plane backdrops, god-ray shafts, storm lightning, the party's
// own light in dark places, sprite glow and water tinting.

import * as THREE from 'three';

const LIGHT_POOL = 8;

export class FieldAtmosphere {
  /** @param {import('./FieldScene.js').FieldScene} field */
  constructor(field) {
    this.field = field;
    this.game = field.game;
    this.scene = field.scene;
    this.mood = field.env.mood;
    this.moodId = field.moodId;
    this.extraLights = [];
  }

  /** Build everything for the current map (call once after the map is built). */
  build(map) {
    this.tintWater(this.mood.water ?? 1);
    this.addBackdrop(map);
    if (this.mood.wounds) this.addSkyWounds();
    this.addLightShafts(map);
    this.setupLightPool();
    const pl = this.mood.playerLight;
    if (pl) {
      this.playerLight = new THREE.PointLight(pl.color, pl.intensity, pl.distance, 1.5);
      this.scene.add(this.playerLight);
    }
  }

  update(dt, time) {
    this.updateLights(dt, time);
    if (this.mood.lightning) this.updateLightning(dt);
    const p = this.field.player;
    if (this.playerLight) this.playerLight.position.set(p.x, p.elev + 1.6, p.z + 0.6);
    if (this.wounds) this.placeSkyWounds(time);
    this.applySpriteGlow();
  }

  // ------------------------------------------------------------------ backdrop

  addBackdrop(map) {
    const { grid, built } = this.field;
    // backdrop may depend on story state, e.g. the sea vanishing at the Sundering
    const backdrop = typeof map.backdrop === 'function' ? map.backdrop(this.field.state) : map.backdrop;
    if (backdrop === 'ocean') {
      const geo = new THREE.PlaneGeometry(400, 400);
      geo.rotateX(-Math.PI / 2);
      geo.setAttribute('shore', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count), 1));
      const water = /** @type {any} */ (built.group.children.find((c) => /** @type {any} */ (c).material?.uniforms?.shallow));
      const mat = water ? water.material.clone() : new THREE.MeshLambertMaterial({ color: '#2a6a9a' });
      const ocean = new THREE.Mesh(geo, mat);
      ocean.position.set(grid.w / 2, -0.14, grid.h / 2);
      ocean.renderOrder = 1;
      this.scene.add(ocean);
      if (mat.uniforms) this.field.animated.push((t) => { mat.uniforms.time.value = t; });
    } else if (backdrop?.plane) {
      const geo = new THREE.PlaneGeometry(400, 400);
      geo.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: backdrop.plane }));
      mesh.position.set(grid.w / 2, backdrop.y ?? -1, grid.h / 2);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
  }

  /** Darken water shaders in dark moods (they are unlit). */
  tintWater(k) {
    if (k === 1) return;
    this.field.built.group.traverse((o) => {
      const u = /** @type {any} */ (o).material?.uniforms;
      if (!u?.deep) return;
      for (const key of ['deep', 'shallow', 'foam']) u[key].value.multiplyScalar(k);
    });
  }

  // ------------------------------------------------------------------ sky wounds

  /** After the Sundering: seven burning fragments of the sun hang in the sky. */
  addSkyWounds() {
    const tex = woundTexture();
    this.wounds = [];
    for (let i = 0; i < 7; i++) {
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      m.userData = { i, size: 5 + ((i * 37) % 5), phase: i * 1.7 };
      m.renderOrder = -1;
      this.scene.add(m);
      this.wounds.push(m);
    }
  }

  /** Keep the wounds on the far horizon above the camera's view. */
  placeSkyWounds(time) {
    const cam = this.field.camera;
    const fwd = new THREE.Vector3();
    cam.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
    for (const m of this.wounds) {
      const { i, size, phase } = m.userData;
      const spread = (i - 3) * 14 + Math.sin(i * 2.3) * 4;
      const pos = cam.position.clone().addScaledVector(fwd, 90).addScaledVector(right, spread);
      pos.y = cam.position.y + 6 + ((i * 5) % 3) * 3;
      m.position.copy(pos);
      m.quaternion.copy(cam.quaternion);
      const pulse = 1 + 0.06 * Math.sin(time * 1.3 + phase);
      m.scale.setScalar(size * pulse);
    }
  }

  // ------------------------------------------------------------------ light shafts

  /** Slanted additive light shafts (god rays) drifting over the map. */
  addLightShafts(map) {
    const want = map.lightShafts ?? ['forest', 'temple', 'evernoon'].includes(this.moodId);
    if (!want) return;
    const tex = shaftTexture();
    const { grid } = this.field;
    const color = this.moodId === 'evernoon' ? '#fff8e0' : this.moodId === 'temple' ? '#ffe0b0' : '#fff2cc';
    const count = Math.min(18, Math.round((grid.w * grid.h) / 110));
    const rnd = (i) => Math.abs((Math.sin(i * 91.7) * 43758.5) % 1);
    const shafts = [];
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: tex, color, transparent: true, opacity: 0.07 + rnd(i) * 0.09,
        blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
      });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1 + rnd(i + 3) * 1.6, 13), mat);
      m.position.set(rnd(i + 7) * grid.w, 5, rnd(i + 11) * grid.h);
      m.rotation.z = 0.42;
      m.renderOrder = 15;
      m.userData = { phase: rnd(i + 13) * 6.28, base: mat.opacity };
      this.scene.add(m);
      shafts.push(m);
    }
    this.field.animated.push((t) => {
      for (const m of shafts) m.material.opacity = m.userData.base * (0.55 + 0.45 * Math.sin(t * 0.35 + m.userData.phase));
    });
  }

  // ------------------------------------------------------------------ point lights

  /** A small pool of point lights is reassigned to the nearest light sources. */
  setupLightPool() {
    this.lightPool = [];
    for (let i = 0; i < LIGHT_POOL; i++) {
      const l = new THREE.PointLight('#ffffff', 0, 6, 1.6);
      this.scene.add(l);
      this.lightPool.push(l);
    }
    this.lightAssignT = 0;
  }

  assignLights() {
    const p = this.field.player;
    const sources = this.field.built.lightSources.concat(this.extraLights);
    const scored = sources.map((s) => ({ s, d: (s.x - p.x) ** 2 + (s.z - p.z) ** 2 - (s.priority || 0) * 100 }));
    scored.sort((a, b) => a.d - b.d);
    this.lightPool.forEach((l, i) => {
      const e = scored[i];
      if (!e) { l.intensity = 0; l.userData.src = null; return; }
      l.position.set(e.s.x, e.s.y, e.s.z);
      l.color.set(e.s.color);
      l.distance = e.s.distance || 6;
      l.userData.src = e.s;
    });
  }

  updateLights(dt, time) {
    this.lightAssignT -= dt;
    if (this.lightAssignT <= 0) { this.assignLights(); this.lightAssignT = 0.3; }
    for (const l of this.lightPool) {
      const s = l.userData.src;
      if (!s) continue;
      const f = s.flicker ? 0.82 + 0.18 * Math.sin(time * 13 + s.x * 7) * Math.sin(time * 7.3 + s.z) : 1;
      l.intensity = (s.intensity || 1) * f;
    }
  }

  // ------------------------------------------------------------------ weather & glow

  /** Storm moods: occasional lightning flash with a delayed thunder roll. */
  updateLightning(dt) {
    this.boltT = (this.boltT ?? 4 + Math.random() * 6) - dt;
    if (this.boltT > 0) return;
    this.boltT = 7 + Math.random() * 10;
    const r = this.game.renderer;
    const strength = 0.25 + Math.random() * 0.3;
    this.game.tween(0.5, (t) => r.setFlash(strength * (t < 0.15 ? 1 : (1 - t) * Math.abs(Math.sin(t * 30))), '#e8f0ff')).then(() => r.setFlash(0));
    setTimeout(() => this.game.audio?.sfx('rumble'), 300 + Math.random() * 900);
  }

  /** In dark moods, characters glow faintly so they always read clearly. */
  applySpriteGlow() {
    const k = this.mood.spriteGlow || 0;
    if (!k) return;
    for (const a of [this.field.player, ...this.field.actors.values()]) {
      const m = a.material;
      if (m.userData.glowSet) continue;
      m.emissive = new THREE.Color('#ffffff');
      m.emissiveMap = m.map;
      m.emissiveIntensity = k;
      m.userData.glowSet = true;
      m.needsUpdate = true;
    }
  }
}

let woundTex = null;
function woundTexture() {
  if (woundTex) return woundTex;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,248,220,1)');
  g.addColorStop(0.18, 'rgba(255,190,120,0.95)');
  g.addColorStop(0.45, 'rgba(255,110,60,0.45)');
  g.addColorStop(1, 'rgba(255,60,40,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  woundTex = new THREE.CanvasTexture(cv);
  return woundTex;
}

let shaftTex = null;
function shaftTexture() {
  if (shaftTex) return shaftTex;
  const cv = document.createElement('canvas');
  cv.width = 16; cv.height = 128;
  const ctx = cv.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, 'rgba(255,240,200,0)');
  g.addColorStop(0.35, 'rgba(255,236,190,0.55)');
  g.addColorStop(1, 'rgba(255,230,180,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 16, 128);
  const h = ctx.createLinearGradient(0, 0, 16, 0);
  h.addColorStop(0, 'rgba(0,0,0,1)'); h.addColorStop(0.5, 'rgba(0,0,0,0)'); h.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = h;
  ctx.fillRect(0, 0, 16, 128);
  shaftTex = new THREE.CanvasTexture(cv);
  return shaftTex;
}
