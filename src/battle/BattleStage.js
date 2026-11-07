// Builds the small diorama a battle takes place on, from a background preset
// (see Backgrounds.js), using the same map builder as the field.

import * as THREE from 'three';
import { buildMap } from '../world/MapBuilder.js';
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
