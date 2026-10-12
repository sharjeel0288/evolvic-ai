"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

/** Magnetic CTA link. */
export default function Button({ href, children, primary = false, className = "", dataC }: { href: string; children: ReactNode; primary?: boolean; className?: string; dataC?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 }), sy = useSpring(y, { stiffness: 220, damping: 16 });
  const move = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  return (
    <motion.span style={{ x: sx, y: sy }} className="inline-block" onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}>
      <Link href={href} data-c={dataC} className={`btn ${primary ? "p" : ""} ${className}`}>
        {children}
        <span aria-hidden>→</span>
      </Link>
    </motion.span>
  );
}
