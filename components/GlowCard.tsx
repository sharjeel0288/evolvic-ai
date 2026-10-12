"use client";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

/** Neumorphic card with cursor spotlight + 3D tilt. */
export default function GlowCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5), py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 150, damping: 18 });
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty("--mx", `${fx * 100}%`);
    e.currentTarget.style.setProperty("--my", `${fy * 100}%`);
    if (!reduce) { px.set(fx); py.set(fy); }
  };
  return (
    <motion.div onMouseMove={onMove} onMouseLeave={() => { px.set(0.5); py.set(0.5); }}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`nm ${className}`}>
      <span aria-hidden className="sheen" />
      {children}
    </motion.div>
  );
}
