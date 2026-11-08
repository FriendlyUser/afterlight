// Accumulates textured, vertex-colored quads into one BufferGeometry.

import * as THREE from 'three';

export class GeometryBuilder {
  constructor() {
    this.pos = [];
    this.norm = [];
    this.uv = [];
    this.col = [];
    this.idx = [];
  }

  get vertexCount() { return this.pos.length / 3; }

  /**
   * Quad from four corners (counter-clockwise when seen from the front):
   * p0 bottom-left, p1 bottom-right, p2 top-right, p3 top-left (texture space).
   */
  quad(p0, p1, p2, p3, uv, normal, shades = [1, 1, 1, 1], tint = [1, 1, 1]) {
    const base = this.vertexCount;
    const pts = [p0, p1, p2, p3];
    const uvs = [[uv.u0, uv.v0], [uv.u1, uv.v0], [uv.u1, uv.v1], [uv.u0, uv.v1]];
    for (let i = 0; i < 4; i++) {
      this.pos.push(pts[i][0], pts[i][1], pts[i][2]);
      this.norm.push(normal[0], normal[1], normal[2]);
      this.uv.push(uvs[i][0], uvs[i][1]);
      const s = shades[i];
      this.col.push(s * tint[0], s * tint[1], s * tint[2]);
    }
    this.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  /**
   * A large quad split into unit cells so atlas textures repeat per world unit.
   * origin: bottom-left corner; uDir/vDir: unit vectors; uLen/vLen in world units.
   * uvFor(i, j) returns the atlas rect for cell (i, j).
   * shadeFor(v0, v1) -> [bottomShade, topShade] (fractions along v).
   */
  /**
   * @param {number[]} origin
   * @param {number[]} uDir
   * @param {number[]} vDir
   * @param {number} uLen
   * @param {number} vLen
   * @param {number[]} normal
   * @param {(u: number, v: number) => any} uvFor
   * @param {(v0: number, v1: number) => number[]} [shadeFor] bottom/top shade along v
   * @param {number[]} [tint]
   */
  tiledQuad(origin, uDir, vDir, uLen, vLen, normal, uvFor, shadeFor = () => [1, 1], tint) {
    const nu = Math.max(1, Math.ceil(uLen - 1e-6));
    const nv = Math.max(1, Math.ceil(vLen - 1e-6));
    for (let j = 0; j < nv; j++) {
      const v0 = j, v1 = Math.min(vLen, j + 1);
      for (let i = 0; i < nu; i++) {
        const u0 = i, u1 = Math.min(uLen, i + 1);
        const r = uvFor(i, j);
        const fu = u1 - u0, fv = v1 - v0;
        const rect = {
          u0: r.u0, u1: r.u0 + (r.u1 - r.u0) * fu,
          v0: r.v0, v1: r.v0 + (r.v1 - r.v0) * fv,
        };
        const P = (u, v) => [
          origin[0] + uDir[0] * u + vDir[0] * v,
          origin[1] + uDir[1] * u + vDir[1] * v,
          origin[2] + uDir[2] * u + vDir[2] * v,
        ];
        const [sb, st] = shadeFor(v0 / vLen, v1 / vLen);
        this.quad(P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1), rect, normal, [sb, sb, st, st], tint);
      }
    }
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.norm, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    return g;
  }
}
