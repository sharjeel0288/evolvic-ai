"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { home } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** CSS loop + original scroll-scrubbed drift (xPercent tied to scroll), skewed by scroll velocity. */
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(".mq-in", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1.2 } });
    });
  }, { scope: ref });
  const row = [...home.marquee, ...home.marquee];
  return (
    <div ref={ref} className="relative -rotate-2 overflow-hidden border-y border-white/5 bg-[#0b0d12] py-6" aria-label={home.marquee.join(", ")} role="region">
      <div className="mq-in"><div className="marquee [transform:skewX(calc(var(--vel,0)*-6deg))]" aria-hidden>
        {row.map((t, i) => (
          <span key={i} className="display flex items-center whitespace-nowrap px-6 text-[clamp(28px,4vw,64px)]">
            <span className={i % 2 ? "text-transparent [-webkit-text-stroke:1px_rgba(238,240,244,.6)]" : ""}>{t}</span>
            <span className="ml-12 text-cyan">✦</span>
          </span>
        ))}
      </div></div>
    </div>
  );
}
