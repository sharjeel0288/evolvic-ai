"use client";
import { useEffect, useRef } from "react";

/** Zero-padded counter that counts up once when scrolled into view (static for reduced motion). */
export default function CountUp({ to, pad = 2, className = "" }: { to: number; pad?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => String(n).padStart(pad, "0");
  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = fmt(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), D = 900;
      const step = (t: number) => { const k = Math.min(1, (t - t0) / D); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  return <span ref={ref} className={className}>{fmt(to)}</span>;
}
