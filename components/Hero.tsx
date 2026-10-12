"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "./Button";
import SplitHeading from "./SplitHeading";
import { home } from "@/lib/content";
import { fx } from "@/lib/fx";
import { IconTile } from "@/lib/icons";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Original hero(): pinned 280% — copy zooms to 1.9× and blurs out, camera dives into the particle core,
 * a giant outlined "AI" ghost zooms through the viewer (×34), then a white warp flash and the camera settles.
 * Plus: char-reveal intro after the loader, faint video plate (screen-blended, Ken Burns) behind the particles.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const h = home.hero;
  useGSAP(() => {
    const intro = () => {
      gsap.from(".hero-h .w i", { yPercent: 120, rotate: 4, stagger: 0.01, duration: 1.3, ease: "expo.out" });
      gsap.from(".hero-in", { y: 40, opacity: 0, stagger: 0.12, duration: 1.2, ease: "expo.out", delay: 0.4 });
    };
    if (fx.introDone) intro(); else window.addEventListener("evq:intro", intro, { once: true });
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=170%", scrub: 1.2, pin: true, anticipatePin: 1 } });
      tl.to(".h-copy", { scale: 1.3, opacity: 0, y: -60, duration: 1, ease: "power3.in" }, 0)
        .to(".hint", { opacity: 0, duration: 0.3 }, 0)
        .to(".h-plate", { scale: 1.6, opacity: 0, duration: 1.6, ease: "power2.in" }, 0)
        .to(fx.state, { z: 1.2, duration: 1.8, ease: "power2.in" }, 0.1)
        .fromTo(".ghost", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 0.35, duration: 0.6 }, 0.3)
        .to(".ghost", { scale: 34, opacity: 0, duration: 1.2, ease: "power4.in" }, 0.9)
        .fromTo(".warp", { scale: 0, opacity: 0 }, { scale: 5, opacity: 0.6, duration: 0.7, ease: "power2.in" }, 1.3)
        .to(".warp", { opacity: 0, duration: 0.5 }, 2.0)
        .add(() => {}, 2.0)
        .to(fx.state, { z: () => fx.base, duration: 0.5, ease: "power2.out" }, 2.0)
        .to({}, { duration: 0.01 }, 2.5);
    });
    return () => window.removeEventListener("evq:intro", intro);
  }, { scope: ref });

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden" aria-labelledby="hero-h" data-scene data-shape="0" data-x="1.7" data-name="Signal">
      <div aria-hidden className="h-plate plate-mask absolute inset-0 -z-10 opacity-25 mix-blend-screen">
        <video className="kb h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster="/videos/hero-loop-poster.webp">
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_25%_50%,rgba(7,8,12,.75),transparent_65%)]" />
      <div className="ghost" aria-hidden>AI</div>
      <div className="warp" aria-hidden />
      <div className="relative flex min-h-[100svh] flex-col justify-center px-site pb-16 pt-28 md:pb-20 md:pt-32">
        <div className="h-copy scrim relative max-w-[min(56rem,100%)] origin-left">
          <p className="hero-in mono mb-6 flex items-center gap-3"><span className="led" /> {h.eyebrow}</p>
          <h1 id="hero-h" className="hero-h hero-fringe !text-[clamp(38px,5.8vw,96px)]" aria-label={h.h1.join(" ")}>
            <SplitHeading as="div" manual text={h.h1[0]} />
            <SplitHeading as="div" manual text={h.h1[1]} className="grad-chars" />
          </h1>
          <p className="hero-in lead mt-6 !text-[clamp(18px,1.5vw,24px)]">{h.copy}</p>
          <div className="hero-in mt-8 flex flex-wrap gap-4">
            <Button href="/contact" primary dataC="BUILD">{h.primary}</Button>
            <Button href="/solutions" dataC="EXPLORE">{h.secondary}</Button>
          </div>
          <ul className="hero-in mt-10 grid max-w-3xl gap-3 sm:grid-cols-3 [@media(min-width:768px)_and_(max-height:780px)]:hidden">
            {h.tiles.map((t) => (
              <li key={t.t} className="nm flex items-start gap-3 p-4">
                <IconTile k={t.t} size={18} className="!h-9 !w-9 shrink-0 !rounded-[10px]" />
                <span><b className="card-title block !text-[15px]">{t.t}</b><span className="mt-0.5 block text-[13px] leading-snug text-mut">{t.d}</span></span>
              </li>
            ))}
          </ul>
        </div>
        <p className="hint mono absolute bottom-[4vh] right-site hidden md:flex items-center gap-3 !text-mut"><span aria-hidden className="inline-block h-8 w-px animate-pulse bg-cyan" />{h.scroll}</p>
      </div>
    </section>
  );
}
