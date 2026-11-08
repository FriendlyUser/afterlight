// Globals the game reads or adds beyond the standard DOM (type-checking only).
interface Window {
  /** Older Safari's prefixed Web Audio constructor. */
  webkitAudioContext?: typeof AudioContext;
  /** Debug handle to the running game (main.js). */
  afterlight?: unknown;
}
