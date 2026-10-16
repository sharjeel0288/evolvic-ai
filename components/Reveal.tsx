"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/**
 * Fade/rise reveal. Besides the IntersectionObserver (useInView), a scroll/resize fallback reveals the block as soon
 * as its top is above the fold. On real phones, momentum scrolls, pinned sections and late layout shifts could let a
 * tall block (e.g. the contact form) pass the observer window and stay at opacity 0 for good.
 */
export default function Reveal({ delay = 0, y = 40, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.01, margin: "0px 0px -8% 0px" });
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (seen) return;
    const el = ref.current; if (!el) return;
    let raf = 0;
    const check = () => { raf = 0; const b = el.getBoundingClientRect(); if (b.top < window.innerHeight * 0.95) setShown(true); };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    raf = requestAnimationFrame(check);
    window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    const t = window.setInterval(check, 1000);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); clearInterval(t); if (raf) cancelAnimationFrame(raf); };
  }, [seen]);
  const vis = seen || shown;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, scale: 0.96 }}
      animate={vis ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
