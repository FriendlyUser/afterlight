// The Android app (Capacitor): what the web game needs from the shell around it.
// Nothing here runs in a browser tab, and the Capacitor packages are only imported
// inside the app, so the unbundled game never asks for them.

import { isNative, touchFirst } from './Device.js';

/**
 * Wire the device's back button and the app going to the background.
 * @param {import('../core/Game.js').Game} game
 */
export async function initNative(game) {
  // Music must not keep playing from a pocket. Browsers on phones need this too.
  if (touchFirst) {
    document.addEventListener('visibilitychange', () => {
      const ctx = game.audio?.ctx;
      if (!ctx) return;
      if (document.hidden) ctx.suspend?.();
      else ctx.resume?.();
      if (document.hidden) game.input.releaseAll();
    });
  }
  if (!isNative()) return;
  document.documentElement.classList.add('native');
  try {
    const { App } = await import('@capacitor/app');
    // Back is Escape: it cancels, and in the field it opens the menu. On the title
    // screen's first menu there is nothing to go back to, so it leaves the app.
    App.addListener('backButton', () => {
      const scene = /** @type {any} */ (game.scene);
      if (scene?.isTitle && game.ui.top() === scene.widget && !scene.picker && !scene.busy) App.minimizeApp();
      else game.input.tap('cancel', 'menu');
    });
  } catch (e) {
    console.warn(`Native shell: ${e?.message || e}`);
  }
}
