"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "./Button";
import Video from "./Video";
import ParticleNetwork from "./ParticleNetwork";
import { fx } from "@/lib/fx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Original cta(): pinned 220%, camera plunges into the field, headline chars drop in from 2× scale, copy + buttons follow. */
export default function VideoCta({ title, copy, primary, secondary, id = "cta-h" }: { title: string; copy: string; primary: string; secondary?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=120%", pin: true, scrub: 1.2, anticipatePin: 1 } })
        .fromTo(".cta-frame", { clipPath: "inset(12% 10% round 32px)", scale: 1.15 }, { clipPath: "inset(3% 3% round 32px)", scale: 1, duration: 1, ease: "power2.out" }, 0)
        .to(fx.state, { z: () => fx.base * 0.42, duration: 2, ease: "power2.in" }, 0)
        .fromTo(".cta-h .w i", { yPercent: 110 }, { yPercent: 0, stagger: 0.012, duration: 0.8 }, 0.2)
        .fromTo(".cta-in", { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.6 }, 0.9)
        .to(fx.state, { z: () => fx.base, duration: 0.4 }, 2)
        .to({}, { duration: 0.01 }, 2.4);
    });
  }, { scope: ref });
  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center justify-center overflow-x-clip px-site py-[14vh] text-center" aria-labelledby={id}
      data-scene data-shape="0" data-x="0" data-name="Let's talk">
      <div className="cta-frame scan absolute inset-0 -z-10 overflow-hidden rounded-[32px] [clip-path:inset(3%_3%_round_32px)]" aria-hidden>
        <Video name="cta-loop" className="kb absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen" autoPlay loop preload="none" />
        <ParticleNetwork className="opacity-30" density={0.00004} color="142,123,255" accent="92,225,230" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,8,12,.7),rgba(7,8,12,.95)_75%)]" />
      </div>
      <div className="scrim relative">
        <h2 id={id} className="cta-h mx-auto max-w-5xl" aria-label={title}>
          {title.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
        </h2>
        <p className="cta-in lead mx-auto mt-6">{copy}</p>
        <div className="cta-in mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact" primary dataC="BUILD">{primary}</Button>
          {secondary && <Button href="/contact#form">{secondary}</Button>}
        </div>
      </div>
    </section>
  );
}
