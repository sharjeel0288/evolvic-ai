"use client";
import { useRef, type ReactNode, type ComponentProps } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Port of the original stack(): a pinned scene whose steps "zoom through" —
 * outgoing step shrinks to .82 + blur(14), incoming step flies in from 1.7× + blur(18), its chars rise.
 * Runs on every screen size (shorter pins on phones); only reduced motion stacks the steps.
 */
export default function ZoomStack({
  steps, span = 85, onStep, className = "", children, ...data
}: { steps: ReactNode[]; span?: number; onStep?: (n: number) => void; className?: string; children?: ReactNode } & Omit<ComponentProps<"section">, "children">) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ d: "(prefers-reduced-motion: no-preference) and (min-width: 768px)", m: "(prefers-reduced-motion: no-preference) and (max-width: 767px)" }, (ctx) => {
      const mob = !!ctx.conditions?.m;
      const it = gsap.utils.toArray<HTMLElement>(".zs-step", ref.current), k = it.length;
      let last = -1;
      gsap.set(it, { autoAlpha: 0, position: "absolute" }); gsap.set(it[0], { autoAlpha: 1 });
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, scrollTrigger: {
        trigger: ref.current, start: "top top", end: `+=${k * span * (mob ? 0.72 : 1)}%`, pin: true, scrub: 1.2, anticipatePin: 1,
        onUpdate: (s) => { if (!s.isActive) return; /* a fast jump past the pin must not override the next scene's shape */ const n = Math.min(k - 1, Math.floor(s.progress * k + 0.2)); if (n !== last) { last = n; onStep?.(n); } },
      } });
      for (let i = 1; i < k; i++) {
        tl.to(it[i - 1], { autoAlpha: 0, scale: 0.92, duration: 0.4 }, i - 0.45)
          .fromTo(it[i], { autoAlpha: 0, scale: 1.25 }, { autoAlpha: 1, scale: 1, duration: 0.55 }, i - 0.3);
        const c = it[i].querySelectorAll(".w i");
        if (c.length) tl.fromTo(c, { yPercent: 110 }, { yPercent: 0, stagger: 0.008, duration: 0.5 }, i - 0.2);
        // media synced to the step: split clip-reveal from the centre + settle zoom, then slow drift while the step holds
        const img = it[i].querySelector(".zs-img"), pic = img?.querySelector("img");
        if (img) tl.fromTo(img, { clipPath: "inset(0% 50% 0% 50% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 0.55, ease: "expo.inOut" }, i - 0.28);
        if (pic) tl.fromTo(pic, { scale: 1.35 }, { scale: 1.04, duration: 0.7, ease: "power3.out" }, i - 0.28).to(pic, { scale: 1, yPercent: -3, duration: 0.5, ease: "none" }, i + 0.42);
        const sw = it[i].querySelector(".zs-sweep");
        if (sw) tl.fromTo(sw, { xPercent: -120 }, { xPercent: 220, duration: 0.5, ease: "power2.inOut" }, i - 0.05);
      }
      tl.to({}, { duration: 0.01 }, k - 0.01);
    });
  }, { scope: ref });
  return (
    <section ref={ref} className={`relative flex h-[100svh] items-center overflow-x-clip px-site motion-reduce:block motion-reduce:h-auto motion-reduce:py-24 ${className}`} {...data}>
      {children}
      <div className="relative h-[80svh] w-full md:h-[70vh] motion-reduce:h-auto">
        {steps.map((s, i) => <div key={i} className="zs-step inset-0 flex items-center motion-reduce:mb-16">{s}</div>)}
      </div>
    </section>
  );
}
