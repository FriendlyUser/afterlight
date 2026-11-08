// Builds the small diorama a battle takes place on, from a background preset
// (see Backgrounds.js), using the same map builder as the field.

import * as THREE from 'three';
import { buildMap, makeSpriteMaterial, makeDepthMaterial } from '../world/MapBuilder.js';
import { RNG } from '../core/util.js';

const W = 28, H = 16;

/** Returns { animated, lightSources } and adds the stage to `scene`. */
export function buildBattleStage(scene, bg) {
  const rng = new RNG(bg.seed || 7);
  const ground = [], height = [], props = [];
  for (let y = 0; y < H; y++) {
    let g = '', h = '', p = '';
    for (let x = 0; x < W; x++) {
      const back = y < 4;
      const front = y >= H - 2;
      let ch = back ? (bg.back || bg.ground) : bg.ground;
      if (front && bg.front) ch = bg.front;
      if (!back && !front && bg.patch && rng.next() < 0.08) ch = bg.patch;
      g += ch;
      h += back ? String(bg.backHeight ?? 2) : '0';
      let prop = ' ';
      if (back && bg.props?.length && rng.next() < (bg.density ?? 0.35)) prop = rng.pick(bg.props);
      else if (!back && !front && bg.decor?.length && rng.next() < 0.06 && (x < 8 || x > 21 || y > 12)) prop = rng.pick(bg.decor);
      p += prop;
    }
    ground.push(g); height.push(h); props.push(p);
  }
  const built = buildMap({ ground, height, props, treeType: bg.treeType }, { windows: true });
  built.group.position.set(-W / 2, 0, -H / 2 - 1);
  scene.add(built.group);
  if (bg.backdrop === 'ocean') {
    const geo = new THREE.PlaneGeometry(300, 300);
    geo.rotateX(-Math.PI / 2);
    const sea = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: '#2a6a9a' }));
    sea.position.y = -0.2;
    scene.add(sea);
  }
  return { animated: built.animated, lightSources: built.lightSources };
}

/** Where party member i stands: a diagonal wide enough that nobody hides behind the next. */
export function partySlot(i) {
  return new THREE.Vector3(2.9 + i * 0.85, 0, -2.6 + i * 0.95);
}

/** Where the i-th biggest of n foes stands (the biggest take the front/central slots). */
export function enemySlot(i, n, big) {
  if (n === 1) return new THREE.Vector3(big ? -3.4 : -3, 0, -1.2);
  const rows = [[-2.6, -2.0], [-5.0, -1.4], [-3.6, 0.3], [-6.6, 0.2], [-1.6, 0.6]];
  const slot = rows[i % rows.length];
  return new THREE.Vector3(slot[0] + (big ? -0.8 : 0), 0, slot[1]);
}

/** A battler: its sprite on an upright plane standing on its feet (emissive, for hit flashes). */
export function battlerMesh(texture, w, h) {
  const geo = new THREE.PlaneGeometry(w, h);
  geo.translate(0, h / 2 - 0.05, 0);
  const mat = makeSpriteMaterial(texture);
  mat.emissive = new THREE.Color('#ffffff');
  mat.emissiveIntensity = 0;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.customDepthMaterial = makeDepthMaterial(texture);
  mesh.rotation.x = -0.08;
  return mesh;
}

/** Show `pose` from a character sheet on a battler mesh. */
export function setBattlePose(mesh, sheet, pose) {
  const r = sheet.battleFrame(pose);
  const uv = mesh.geometry.attributes.uv;
  uv.setXY(0, r.u0, r.v1); uv.setXY(1, r.u1, r.v1);
  uv.setXY(2, r.u0, r.v0); uv.setXY(3, r.u1, r.v0);
  uv.needsUpdate = true;
}
