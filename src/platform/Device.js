// What the game is running on, and making the page fit it.
//
// The UI is laid out in CSS pixels for a desktop window (1280 x 720 or larger). A phone held
// sideways is about 900 x 400, so on touch-first devices the page asks for a wider
// layout viewport and lets the browser scale it down to the screen: every panel keeps
// its desktop proportions and nothing else in the game has to know.

const params = new URLSearchParams(location.search);

/** Inside the Android (or iOS) app built with Capacitor, rather than a browser tab. */
export const isNative = () => !!(/** @type {any} */ (window).Capacitor?.isNativePlatform?.());

const coarse = () => !!window.matchMedia?.('(pointer: coarse)').matches && navigator.maxTouchPoints > 0;

/**
 * A phone or tablet: the main pointer is a finger. `?touch=1` forces it on a desktop
 * (store screenshots, tests) and `?touch=0` forces it off.
 */
export const touchFirst = params.get('touch') === '1' || (params.get('touch') !== '0' && (isNative() || coarse()));

export const MIN_WIDTH = 1500; // wide enough that the thumb controls sit clear of the centred dialogue box
export const MIN_HEIGHT = 720;

let scaled = false;

/** The layout width that gives this aspect ratio at least MIN_WIDTH x MIN_HEIGHT. */
export function layoutWidth(aspect) {
  return Math.max(MIN_WIDTH, Math.ceil((MIN_HEIGHT * aspect) / 8) * 8);
}

/**
 * On touch-first devices, size the layout viewport so the UI fits (see the top of the
 * file), and keep it right when the device turns or the window changes shape.
 */
export function fitViewport() {
  if (!touchFirst || !(isNative() || coarse())) return;
  const meta = document.querySelector('meta[name="viewport"]');
  if (!meta) return;
  let current = 0;
  const apply = () => {
    const w = window.innerWidth, h = window.innerHeight;
    if (!w || !h) return;
    // Width and height scale together, so their ratio is the screen's whatever the zoom.
    const width = layoutWidth(w / h);
    // A few pixels of rounding must not start a loop of resizes.
    if (Math.abs(width - current) <= 12) return;
    current = width;
    scaled = true;
    meta.setAttribute('content', `width=${width}, user-scalable=no`);
  };
  apply();
  window.addEventListener('resize', apply);
  window.screen?.orientation?.addEventListener?.('change', () => setTimeout(apply, 80));
}

/**
 * Canvas pixels per CSS pixel. On a scaled page devicePixelRatio no longer says how
 * many screen pixels a CSS pixel covers, so work it out from the screen, and stop at
 * 1080 rows: a phone GPU pays for every extra one.
 */
export function renderScale() {
  const dpr = window.devicePixelRatio || 1;
  if (!scaled) return Math.min(dpr, 2);
  const shortSide = Math.min(window.screen?.width || 0, window.screen?.height || 0) * dpr;
  const rows = Math.min(shortSide || 1080, 1080);
  return Math.max(1, Math.min(2, rows / (window.innerHeight || MIN_HEIGHT)));
}
