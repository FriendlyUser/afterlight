// Vite production build for the web (itch.io, GitHub Pages, any static host).
// The game itself needs no build step: during development it runs as plain ES
// modules from any static server (see README), and the headless tests use that
// unbundled source. This config only bundles and minifies it for release.
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { readdirSync, readFileSync } from 'node:fs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

/** The fonts are OFL-licensed: ship their license texts next to them in dist/fonts/. */
const fontLicenses = {
  name: 'afterlight-font-licenses',
  generateBundle() {
    for (const name of readdirSync(here('./fonts/')).filter((f) => f.startsWith('OFL'))) {
      this.emitFile({ type: 'asset', fileName: `fonts/${name}`, source: readFileSync(here(`./fonts/${name}`)) });
    }
  },
};

/** index.html carries an import map for the unbundled game; the bundle resolves `three` itself. */
const dropImportMap = {
  name: 'afterlight-drop-importmap',
  transformIndexHtml: (html) => html.replace(/\s*<script type="importmap">[\s\S]*?<\/script>/, ''),
};

export default defineConfig({
  base: './', // relative URLs, so dist/ works from any sub-folder
  resolve: {
    // The same vendored three.js (r170) the unbundled game uses via its import map.
    alias: [
      { find: /^three\/addons\/(.*)$/, replacement: `${here('./vendor/three/addons/')}$1` },
      { find: /^three$/, replacement: here('./vendor/three/three.module.js') },
    ],
  },
  plugins: [dropImportMap, fontLicenses],
  build: {
    outDir: 'dist',
    target: 'es2022',
    rollupOptions: {
      output: {
        // three.js in its own chunk: it changes far less often than the game, so it
        // stays cached across releases. Each content pack is already its own chunk.
        manualChunks: (id) => (id.includes('/vendor/three/') ? 'three' : undefined),
      },
    },
    chunkSizeWarningLimit: 700, // three.js alone is ~650 kB minified
  },
  server: {
    port: 8766,
    // tools/npm.sh runs Windows npm on the WSL share, where native watching fails.
    watch: process.env.AFTERLIGHT_POLL ? { usePolling: true, interval: 300 } : undefined,
  },
});
