// WebGL renderer + the "2D-HD" post stack:
//   scene -> bloom -> tilt-shift DOF + grade + vignette + grain -> tone map/output

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const HD2DShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(1, 1) },
    focusY: { value: 0.46 },
    focusBand: { value: 0.12 },
    blurTop: { value: 4.0 },
    blurBottom: { value: 2.5 },
    vignette: { value: 0.4 },
    saturation: { value: 1.08 },
    contrast: { value: 1.04 },
    brightness: { value: 1.0 },
    tint: { value: new THREE.Color(1, 1, 1) },
    shadowTint: { value: new THREE.Color(0.92, 0.94, 1.08) },
    grain: { value: 0.035 },
    time: { value: 0 },
    flash: { value: 0 },
    flashColor: { value: new THREE.Color(1, 1, 1) },
    desaturate: { value: 0 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float focusY, focusBand, blurTop, blurBottom, vignette, saturation, contrast, brightness, grain, time, flash, desaturate;
    uniform vec3 tint, shadowTint, flashColor;
    varying vec2 vUv;

    float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }

    void main() {
      // --- tilt-shift: blur grows away from the focus band ---
      float d = vUv.y - focusY;
      float amount = d > 0.0
        ? smoothstep(focusBand, focusBand + 0.38, d) * blurTop
        : smoothstep(focusBand, focusBand + 0.42, -d) * blurBottom;
      vec4 col = texture2D(tDiffuse, vUv);
      if (amount > 0.05) {
        vec4 acc = col;
        float total = 1.0;
        const int TAPS = 16;
        for (int i = 0; i < TAPS; i++) {
          float a = float(i) * 2.39996;            // golden angle
          float r = sqrt((float(i) + 0.5) / float(TAPS));
          vec2 off = vec2(cos(a), sin(a)) * r * amount / resolution;
          acc += texture2D(tDiffuse, vUv + off);
          total += 1.0;
        }
        col = acc / total;
      }
      // Grade in gamma space so contrast pivots on perceptual mid-grey
      // (in linear space it would crush every dark scene to black).
      vec3 c = pow(max(col.rgb, 0.0), vec3(1.0 / 2.2));

      // --- grade ---
      float luma = dot(c, vec3(0.299, 0.587, 0.114));
      c = mix(vec3(luma), c, saturation * (1.0 - desaturate));
      c = (c - 0.5) * contrast + 0.5;
      c *= brightness * tint;
      c *= mix(shadowTint, vec3(1.0), smoothstep(0.0, 0.6, luma));

      // --- vignette ---
      vec2 p = vUv - 0.5;
      p.x *= resolution.x / resolution.y;
      float v = smoothstep(0.95, 0.25, length(p));
      c *= mix(1.0 - vignette, 1.0, v);

      // --- grain ---
      c += (rand(vUv * resolution + time) - 0.5) * grain;

      c = mix(c, flashColor, flash);
      gl_FragColor = vec4(pow(max(c, 0.0), vec3(2.2)), col.a);
    }
  `,
};

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.flashScale = 1; // accessibility: 'Reduced' flashes scale every screen flash down
    /** @type {((w: number, h: number) => void) | null} called after the canvas resizes */
    this.onResize = null;
    this.gl = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    this.gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.gl.shadowMap.enabled = true;
    this.gl.shadowMap.type = THREE.PCFSoftShadowMap;
    this.gl.toneMapping = THREE.NeutralToneMapping;
    this.gl.toneMappingExposure = 1.0;
    this.gl.outputColorSpace = THREE.SRGBColorSpace;
    this.gl.info.autoReset = false; // reset once per frame in render()

    this.composer = new EffectComposer(this.gl);
    this.renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.6, 0.82);
    this.hd2dPass = new ShaderPass(HD2DShader);
    this.outputPass = new OutputPass();
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.hd2dPass);
    this.composer.addPass(this.outputPass);

    this.u = this.hd2dPass.uniforms;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  get width() { return this.canvas.clientWidth; }
  get height() { return this.canvas.clientHeight; }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.gl.setSize(w, h, false);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.composer.setSize(w, h);
    const pr = this.gl.getPixelRatio();
    this.u.resolution.value.set(w * pr, h * pr);
    this.onResize?.(w, h);
  }

  /** Apply a mood's post settings (see Moods.js). */
  setGrade(grade = {}) {
    const g = { saturation: 1.08, contrast: 1.04, brightness: 1, tint: '#ffffff', shadowTint: '#ebeffa', vignette: 0.4, grain: 0.03, bloom: 0.55, bloomThreshold: 0.82, blurTop: 4, blurBottom: 2.5, exposure: 1, ...grade };
    this.u.saturation.value = g.saturation;
    this.u.contrast.value = g.contrast;
    this.u.brightness.value = g.brightness;
    this.u.tint.value.set(g.tint);
    this.u.shadowTint.value.set(g.shadowTint);
    this.u.vignette.value = g.vignette;
    this.u.grain.value = g.grain;
    this.u.blurTop.value = g.blurTop;
    this.u.blurBottom.value = g.blurBottom;
    this.bloomPass.strength = g.bloom;
    this.bloomPass.threshold = g.bloomThreshold;
    this.gl.toneMappingExposure = g.exposure;
  }

  setFocus(y = 0.46, band = 0.12) {
    this.u.focusY.value = y;
    this.u.focusBand.value = band;
  }

  setFlash(amount, color) {
    this.u.flash.value = amount * this.flashScale;
    if (color) this.u.flashColor.value.set(color);
  }

  render(scene, camera, time = 0) {
    camera.aspect = this.width / Math.max(1, this.height);
    camera.updateProjectionMatrix();
    this.renderPass.scene = scene;
    this.renderPass.camera = camera;
    this.u.time.value = time % 100;
    // Count the whole frame (scene + every post pass) for the ?debug overlay.
    this.gl.info.reset();
    this.composer.render();
  }
}
