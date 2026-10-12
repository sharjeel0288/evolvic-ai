"use client";
import { useRef, type ReactNode, type ComponentProps } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Port of the original stack(): a pinned scene whose steps "zoom through" —
 * outgoing step shrinks to .82 + blur(14), incoming step flies in from 1.7× + blur(18), its chars rise.
 * Reduced motion / small screens: steps simply stack vertically.
 */
export default function ZoomStack({
  steps, span = 85, onStep, className = "", children, ...data
}: { steps: ReactNode[]; span?: number; onStep?: (n: number) => void; className?: string; children?: ReactNode } & Omit<ComponentProps<"section">, "children">) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      const it = gsap.utils.toArray<HTMLElement>(".zs-step", ref.current), k = it.length;
      let last = -1;
      gsap.set(it, { autoAlpha: 0, position: "absolute" }); gsap.set(it[0], { autoAlpha: 1 });
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, scrollTrigger: {
        trigger: ref.current, start: "top top", end: `+=${k * span}%`, pin: true, scrub: 1.2, anticipatePin: 1,
        onUpdate: (s) => { const n = Math.min(k - 1, Math.floor(s.progress * k + 0.2)); if (n !== last) { last = n; onStep?.(n); } },
      } });
      for (let i = 1; i < k; i++) {
        tl.to(it[i - 1], { autoAlpha: 0, scale: 0.92, duration: 0.4 }, i - 0.45)
          .fromTo(it[i], { autoAlpha: 0, scale: 1.25 }, { autoAlpha: 1, scale: 1, duration: 0.55 }, i - 0.3);
        const c = it[i].querySelectorAll(".w i");
        if (c.length) tl.fromTo(c, { yPercent: 110 }, { yPercent: 0, stagger: 0.008, duration: 0.5 }, i - 0.2);
      }
      tl.to({}, { duration: 0.01 }, k - 0.01);
    });
  }, { scope: ref });
  return (
    <section ref={ref} className={`relative px-site py-24 md:flex md:h-[100svh] md:items-center md:py-0 ${className}`} {...data}>
      {children}
      <div className="relative w-full md:h-[70vh]">
        {steps.map((s, i) => <div key={i} className="zs-step inset-0 mb-16 flex items-center md:mb-0">{s}</div>)}
      </div>
    </section>
  );
}
