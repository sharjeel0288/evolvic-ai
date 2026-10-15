"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";

type Tag = "h1" | "h2" | "h3" | "div";

/**
 * Char-level masked reveal (original: yPercent 120 + rotate 6 + blur 8, stagger .018, expo.out).
 * `manual` renders the same .w > i structure without animating so a GSAP timeline can drive it (pinned scenes).
 * Screen readers get the full string via aria-label.
 */
export default function SplitHeading({
  text, as = "h2", className = "", delay = 0, animateOnMount = false, id, manual = false,
}: { id?: string; text: string; as?: Tag; className?: string; delay?: number; animateOnMount?: boolean; manual?: boolean }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (manual || reduce) {
    const T = as as ElementType;
    return (
      <T id={id} className={className} aria-label={text}>
        {words.map((w, i) => (
          <span key={i} aria-hidden className="w">{[...w].map((c, k) => <i key={k}>{c}</i>)}{i < words.length - 1 ? " " : null}</span>
        ))}
      </T>
    );
  }
  const M = motion[as] as ElementType;
  const trigger = animateOnMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.01, margin: "0px 0px -8% 0px" } };
  return (
    <M id={id} className={className} aria-label={text} initial="hide" {...trigger}
      variants={{ show: { transition: { staggerChildren: 0.018, delayChildren: delay } } }}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="w">
          {[...w].map((c, k) => (
            <motion.i key={k} variants={{ hide: { y: "120%", rotate: 6 }, show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } } }}>{c}</motion.i>
          ))}
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </M>
  );
}
