/**
 * Shared cinematic state between the global WebGL particle field and scroll scenes.
 * Ported from the original design's `state`/`setShape`/`U` globals.
 */
type Listener = (i: number) => void;

export const fx = {
  state: { z: 7.2, gx: 0 },
  base: 7.2,
  mouse: { x: 0, y: 0 },
  chaos: { value: 0 },
  pulse: { value: -9 },
  ready: false,
  /** true while a light (paper) band fills the viewport — particle field is hidden/paused */
  light: false,
  introDone: false,
  /** active scene element (set by FxChrome) — ParticleField reads its [data-fx-text] column */
  scene: null as HTMLElement | null,
  _shape: 0,
  _listeners: new Set<Listener>(),
  setShape(i: number) {
    if (i === this._shape) return;
    this._shape = i;
    this._listeners.forEach((l) => l(i));
  },
  onShape(l: Listener) { this._listeners.add(l); return () => { this._listeners.delete(l); }; },
  setX(x: number) {
    if (typeof window === "undefined") return;
    this.state.gx = window.innerWidth / window.innerHeight < 1 ? 0 : x;
  },
};

export const SHAPES = ["Brain", "Pipeline", "Neural", "Chaos", "Order", "Wordmark", "Clusters", "Stack", "Gear", "Voice", "Chat", "Database", "Agent", "Globe", "Chart", "Document", "Handshake", "Mail"] as const;

export function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
