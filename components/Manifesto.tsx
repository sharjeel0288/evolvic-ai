"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { home } from "@/lib/content";
import { fx } from "@/lib/fx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Original manifesto(): pinned 220%, words light up one by one, camera eases in, cursor flashlight over the type. */
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const words = home.manifesto.h.split(" ");
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".wd", { opacity: 0.18 }); gsap.set(".mf-l", { opacity: 0, y: 30 });
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=130%", pin: true, scrub: 1.2, anticipatePin: 1 } })
        .fromTo(".mf-wrap", { scale: 1.08 }, { scale: 1, duration: 0.8, ease: "power2.out" }, 0)
        .to(".wd", { opacity: 1, stagger: 0.12, duration: 0.5, ease: "none" }, 0)
        .to(".mf-l", { opacity: 1, y: 0, duration: 0.8 }, ">-.2")
        .to(fx.state, { z: () => fx.base * 0.8, duration: 2 }, 0)
        .to({}, { duration: 0.01 }, 3);
    });
  }, { scope: ref });
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--fx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--fy", `${e.clientY - r.top}px`);
  };
  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center justify-center px-site py-[12vh] text-center" aria-label="Manifesto"
      data-scene data-shape="2" data-x="0" data-name="Manifesto">
      <div className="mf-wrap flash scrim relative mx-auto max-w-5xl" onPointerMove={move} onPointerLeave={(e) => e.currentTarget.style.setProperty("--fx", "-999px")}>
        <h2 className="!text-[clamp(30px,4.6vw,80px)]" aria-label={home.manifesto.h}>
          <span aria-hidden>{words.map((w, i) => <span key={i} className="wd mr-[.25em] inline-block">{w}</span>)}</span>
        </h2>
        <p className="mf-l lead mx-auto mt-10">{home.manifesto.d}</p>
      </div>
    </section>
  );
}
