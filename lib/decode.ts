import { gsap } from "gsap";

const GL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&/<>";

/** Scramble/decode text effect from the original design. */
export function decode(el: HTMLElement, txt?: string) {
  const t = txt ?? el.dataset.t ?? el.textContent ?? "";
  el.dataset.t = t;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = t; return; }
  const o = { p: 0 };
  const prev = (el as HTMLElement & { _d?: gsap.core.Tween })._d; prev?.kill();
  (el as HTMLElement & { _d?: gsap.core.Tween })._d = gsap.to(o, {
    p: 1, duration: 0.9, ease: "none",
    onUpdate: () => { el.textContent = [...t].map((c, i) => (c === " " ? " " : i < o.p * t.length ? c : GL[(Math.random() * GL.length) | 0])).join(""); },
    onComplete: () => { el.textContent = t; },
  });
}
