"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { fx } from "@/lib/fx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Original phero(): on load chars fly in from 2.4× + blur; pinned 130% on scroll the whole block
 * zooms past the viewer (1.8×, blur) while the camera dives into the particles. Ken-Burns image plate.
 */
export default function PageHero({ eyebrow, title, lead, img, shape = 0 }: { eyebrow: string; title: string; lead: string; img: string; shape?: number }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const run = () => gsap.timeline()
        .from(".ph-h .w i", { yPercent: 110, opacity: 0, stagger: 0.012, duration: 1.2, ease: "expo.out" })
        .from(".ph-in", { y: 40, opacity: 0, stagger: 0.12, duration: 1, ease: "expo.out" }, 0.3)
        .from(".ph-plate", { scale: 1.3, opacity: 0, duration: 1.8, ease: "expo.out" }, 0);
      if (fx.introDone) run(); else window.addEventListener("evq:intro", run, { once: true });
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=130%", pin: true, scrub: 1.2, anticipatePin: 1 } })
        .to(".ph-copy", { scale: 1.2, opacity: 0, y: -40, duration: 0.6, ease: "power3.in" }, 0.35)
        .to(".ph-plate", { scale: 1.25, opacity: 0.2, duration: 1 }, 0)
        .to(fx.state, { z: () => fx.base * 0.5, duration: 0.9, ease: "power2.in" }, 0)
        .to(fx.state, { z: () => fx.base, duration: 0.3 }, 0.9);
      return () => window.removeEventListener("evq:intro", run);
    });
  }, { scope: ref });
  return (
    <section ref={ref} className="relative isolate flex h-[100svh] items-end overflow-hidden px-site pb-[12vh]" data-scene data-shape={String(shape)} data-x="1.9" data-name={eyebrow}>
      <div className="ph-plate plate-mask absolute inset-0 -z-10" aria-hidden>
        <Image src={img} alt="" fill priority sizes="100vw" className="kb object-cover opacity-30 mix-blend-screen" />
      </div>
      <div className="ph-copy scrim relative max-w-5xl origin-bottom-left">
        <p className="ph-in mono mb-6 flex items-center gap-3"><span className="led" />{eyebrow}</p>
        <h1 className="ph-h !text-[clamp(34px,5.2vw,84px)]" aria-label={title}>
          {title.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
        </h1>
        <p className="ph-in lead mt-8">{lead}</p>
      </div>
    </section>
  );
}
