"use client";
import { useEffect, useRef } from "react";

/**
 * Lightweight 2D particle network (nodes + proximity links), reusable per section.
 * requestAnimationFrame loop, DPR-aware, paused offscreen (IntersectionObserver) and when the tab is hidden,
 * mouse-reactive (repel + link to cursor). Renders a single static frame under prefers-reduced-motion.
 */
export default function ParticleNetwork({
  density = 0.00009, color = "92,225,230", accent = "142,123,255", linkDist = 130, className = "", interactive = true,
}: { density?: number; color?: string; accent?: string; linkDist?: number; className?: string; interactive?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = false;
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: boolean };
    let ps: P[] = [];
    const m = { x: -9999, y: -9999 };
    const resize = () => {
      const r = cv.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(110, Math.round(w * h * density));
      ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.4, a: Math.random() < 0.12 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const L2 = linkDist * linkDist;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        if (!reduce) {
          const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
          if (d2 < 14000) { const f = (1 - d2 / 14000) * 0.6; p.vx += (dx / Math.sqrt(d2 + 1)) * f; p.vy += (dy / Math.sqrt(d2 + 1)) * f; }
          p.vx *= 0.96; p.vy *= 0.96; p.vx += (Math.random() - 0.5) * 0.03; p.vy += (Math.random() - 0.5) * 0.03;
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x += w; if (p.x > w) p.x -= w; if (p.y < 0) p.y += h; if (p.y > h) p.y -= h;
        }
        for (let k = i + 1; k < ps.length; k++) {
          const q = ps[k], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
          if (d2 < L2) { ctx.strokeStyle = `rgba(${color},${(1 - d2 / L2) * 0.28})`; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
        const mdx = p.x - m.x, mdy = p.y - m.y, md2 = mdx * mdx + mdy * mdy;
        if (md2 < L2 * 1.6) { ctx.strokeStyle = `rgba(${accent},${(1 - md2 / (L2 * 1.6)) * 0.5})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(m.x, m.y); ctx.stroke(); }
        ctx.fillStyle = p.a ? `rgba(${accent},.95)` : `rgba(${color},.85)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.a ? p.r * 1.8 : p.r, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };
    let lastT = 0;
    const loop = (now: number) => { if (now - lastT >= 33) { lastT = now; draw(); } raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0; };
    const start = () => { if (!raf && !reduce) raf = requestAnimationFrame(loop); };
    resize(); draw();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { rootMargin: "100px" });
    io.observe(cv);
    const ro = new ResizeObserver(() => { resize(); draw(); }); ro.observe(cv);
    const onMove = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
    const onLeave = () => { m.x = m.y = -9999; };
    if (interactive) { window.addEventListener("pointermove", onMove, { passive: true }); document.addEventListener("pointerleave", onLeave); }
    const vis = () => { if (!document.hidden && visible) start(); };
    document.addEventListener("visibilitychange", vis);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); document.removeEventListener("visibilitychange", vis); };
  }, [density, color, accent, linkDist, interactive]);
  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
