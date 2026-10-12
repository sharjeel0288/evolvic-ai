"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { home } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Original mosaic(): pinned accordion (horizontal ≥768px, vertical on phones) — the active panel grows (flex 1→6) and its image zooms from 1.28× to 1×. */
export default function Mosaic() {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(0);
  const cards = home.mosaic.cards;
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ d: "(prefers-reduced-motion: no-preference) and (min-width: 768px)", m: "(prefers-reduced-motion: no-preference) and (max-width: 767px)" }, (ctx) => {
      const mob = !!ctx.conditions?.m;
      const P = gsap.utils.toArray<HTMLElement>(".mp", ref.current), k = P.length;
      gsap.set(P, { flexGrow: 1 }); gsap.set(P[0], { flexGrow: 6 });
      let last = -1;
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, scrollTrigger: {
        trigger: ref.current, start: "top top", end: `+=${k * (mob ? 55 : 75)}%`, pin: true, scrub: 1.2, anticipatePin: 1,
        onUpdate: (s) => { const n = Math.min(k - 1, Math.floor(s.progress * k + 0.15)); if (n !== last) { last = n; setOn(n); } },
      } });
      tl.from(".mo-h .w i", { yPercent: 120, stagger: 0.015, duration: 0.4 }, 0);
      const I = P.map((p) => p.querySelector("img"));
      gsap.set(I, { scale: 1.28 }); gsap.set(I[0], { scale: 1 });
      for (let i = 1; i < k; i++) {
        tl.to(P[i - 1], { flexGrow: 1, duration: 0.6 }, i - 0.5).to(P[i], { flexGrow: 6, duration: 0.6 }, i - 0.5)
          .to(I[i - 1], { scale: 1.28, duration: 0.6 }, i - 0.5).fromTo(I[i], { scale: 1.28 }, { scale: 1, duration: 0.9, ease: "power2.out" }, i - 0.5);
      }
      tl.to({}, { duration: 0.01 }, k - 0.01);
    });
  }, { scope: ref });
  return (
    <section ref={ref} className="relative flex h-[100svh] flex-col justify-center gap-6 overflow-x-clip px-site pb-[6svh] pt-[96px] md:gap-8 md:pb-[8vh] md:pt-[120px] motion-reduce:h-auto motion-reduce:py-[12vh]" aria-labelledby="mo-h" data-theme="light"
      data-scene data-shape="4" data-x="0" data-name="Built to scale">
      <h2 id="mo-h" className="mo-h !text-[clamp(30px,4.4vw,76px)]" aria-label={home.mosaic.h2}>
        {home.mosaic.h2.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
      </h2>
      <ul className="flex h-[62svh] flex-col gap-2.5 md:h-[58vh] md:flex-row md:gap-3 motion-reduce:h-auto">
        {cards.map((c, i) => (
          <li key={c.t} data-theme="dark" className={`mp group relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-3xl border border-white/10 shadow-[var(--raise)] motion-reduce:min-h-[40vh] ${on === i ? "on" : ""}`}>
            <Image src={c.img} alt="" fill sizes="(max-width:768px) 100vw, 60vw" className={`object-cover transition-opacity duration-700 ${on === i ? "opacity-95" : "opacity-45"} motion-reduce:opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-b from-bg/5 to-bg/90" />
            <span className={`display absolute bottom-3 left-5 z-[2] text-xs tracking-[.2em] text-[#c6ccd8] transition-opacity ${on === i ? "opacity-0" : ""}`}>{String(i + 1).padStart(2, "0")}</span>
            <div className={`absolute inset-x-7 bottom-6 z-[2] transition-all delay-200 duration-[.9s] ease-[cubic-bezier(.16,1,.3,1)] ${on === i ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"}`}>
              <h3 className="!text-[clamp(20px,2vw,34px)]">{c.t}</h3>
              <p className="mt-2 max-w-md text-ink/80 max-md:text-[14px]">{c.d}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
