"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fx } from "@/lib/fx";

/**
 * Route transition (original go()): the new page zooms in from .94 while the camera springs back from a dive.
 * Transform is cleared on completion so GSAP pins (position:fixed) are not trapped, then triggers re-measure.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!fx.introDone) return;
    fx.state.z = 1.2;
    const t = setTimeout(() => { fx.state.z = fx.base; }, 60);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "50% 0" }}
      onAnimationComplete={() => { if (ref.current) ref.current.style.transform = "none"; ScrollTrigger.refresh(); }}>
      {children}
    </motion.div>
  );
}
