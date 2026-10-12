"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/** Clip-path iris reveal + scroll-scrubbed zoom-out (1.35→1) with depth parallax. Fixed aspect box → no layout shift. */
export default function ZoomImage({ src, alt, className = "", sizes = "(max-width:1024px) 100vw, 50vw" }: { src: string; alt: string; className?: string; sizes?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const clip = useTransform(scrollYProgress, [0, 0.4], ["inset(18% 14% 18% 14% round 28px)", "inset(0% 0% 0% 0% round 28px)"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.35, 1.05, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { clipPath: clip }} className={`relative overflow-hidden rounded-[28px] ${className}`}>
      <motion.div style={reduce ? undefined : { scale, y }} className="absolute -inset-[8%]">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </motion.div>
    </motion.div>
  );
}
