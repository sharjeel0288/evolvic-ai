"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "framer-motion";
import ParticleNetwork from "./ParticleNetwork";
import Video from "./Video";
import { home } from "@/lib/content";
import { fx } from "@/lib/fx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const beats = [...home.problems.slides, home.problems.closing];
const N = beats.length;

/**
 * Port + upgrade of the original reel()/theater scenes:
 * - sticky stage; a framed window (clip-path inset 22%/30%) irises open to full-bleed
 * - background video currentTime is scrubbed by scroll (all-intra encode → instant seeks), with a slow zoom-out
 * - each beat zooms in from 2.4× + blur and exits by shrinking/blurring (zoom-through)
 * - particle "chaos" calms as the problems resolve; camera pushes into the field; letterbox bars; scanlines
 * - 2D particle-network overlay (screen blend) reacts to the cursor
 */
export default function ScrollVideo() {
  const wrap = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useGSAP(() => {
    if (reduce) return;
    const v = video.current!, st = { t: 0 };
    if (window.matchMedia("(max-width: 767px)").matches) v.poster = "/videos/scrub-poster-m.webp";
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: wrap.current, start: "top top", end: "bottom bottom", scrub: 1.2 } });
    tl.fromTo(".rframe", { clipPath: "inset(22% 30% round 24px)" }, { clipPath: "inset(0% 0% round 0px)", duration: 1.2, ease: "power3.inOut" }, 0)
      .fromTo(".rvid", { scale: 1.35 }, { scale: 1, duration: N + 1.2, ease: "none" }, 0)
      .to(fx.state, { z: () => fx.base * 0.55, duration: N + 0.6, ease: "none" }, 0)
      .to(st, { t: 1 / (N + 1), duration: 1.0, ease: "none" }, 0);
    // Beat-locked scrub: the clip is split into N+1 segments; segment i plays exactly while beat i is on screen.
    const seek = () => { if (v.duration) { const t = Math.min(v.duration - 0.05, st.t * v.duration); if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t; } };
    tl.eventCallback("onUpdate", seek);
    const SH = [3, 3, 2, 1, 4]; // chaos → structure → order
    let lastBeat = -1;
    gsap.utils.toArray<HTMLElement>(".rw").forEach((e, i) => {
      const at = 1.0 + i;
      tl.to(st, { t: (i + 2) / (N + 1), duration: 1, ease: "sine.inOut" }, at)
        .fromTo(".rsweep", { xPercent: 0, opacity: 0 }, { xPercent: 400, opacity: 1, duration: 0.5, ease: "power2.inOut", immediateRender: false }, at - 0.15)
        .fromTo(".rvid", { filter: "brightness(1.6) saturate(1.2)" }, { filter: "brightness(1) saturate(1)", duration: 0.4, immediateRender: false }, at - 0.05)
        .call(() => { if (tl.scrollTrigger && !tl.scrollTrigger.isActive) return; const b = tl.scrollTrigger && tl.scrollTrigger.direction < 0 ? i - 1 : i; if (b !== lastBeat && b >= 0) { lastBeat = b; fx.setShape(SH[b % SH.length]); } }, [], at);
      tl.fromTo(e, { autoAlpha: 0, scale: 1.2, y: 40 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.45 }, at)
        .fromTo(e.querySelectorAll(".w i"), { yPercent: 120 }, { yPercent: 0, stagger: 0.008, duration: 0.4 }, at + 0.05)
        .to(fx.chaos, { value: Math.max(0, 1.1 - i * 0.28), duration: 0.4 }, at);
      if (i < N - 1) tl.to(e, { autoAlpha: 0, scale: 0.94, y: -40, duration: 0.35, ease: "power2.in" }, at + 0.7);
    });
    tl.to(fx.state, { z: () => fx.base, duration: 0.6 }, N + 0.6).to(".rbar", { scaleX: 1, ease: "none", duration: N + 1.2 }, 0);
    // iOS: a play/pause unlocks seeking
    const unlock = () => { v.play().then(() => v.pause()).catch(() => {}); };
    window.addEventListener("touchstart", unlock, { once: true, passive: true });
    return () => window.removeEventListener("touchstart", unlock);
  }, { scope: wrap, dependencies: [reduce] });

  return (
    <section ref={wrap} id="scroll-video" aria-labelledby="sv-h" className="relative" style={{ height: reduce ? "auto" : `${(N + 1) * 85}vh` }}
      data-scene data-shape="3" data-x="0" data-name="Sound familiar?" data-lb="1" data-keep-chaos="1">
      <h2 id="sv-h" className="sr-only">{home.problems.eyebrow}</h2>
      {reduce ? (
        <div className="relative isolate space-y-20 px-site py-[16vh]">
          <Image src="/videos/scrub-poster.webp" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-30" />
          {beats.map((b) => <div key={b.h}><h3>{b.h}</h3><p className="lead mt-4">{b.d}</p></div>)}
        </div>
      ) : (
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="rframe scan absolute inset-0 overflow-hidden border border-cyan/25 bg-bg shadow-[inset_0_0_120px_rgba(91,124,255,.15)]">
            <Video data-fx-media ref={video} name="scrub" webm={false} className="rvid absolute inset-0 h-full w-full object-cover object-[70%_50%] opacity-75 max-md:opacity-70" preload="auto" />
            <div aria-hidden className="rsweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-[rgba(169,156,255,.22)] to-transparent opacity-0 mix-blend-screen" />
            <ParticleNetwork className="opacity-35 mix-blend-screen" density={0.00004} linkDist={110} />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/70 to-bg/10 max-md:bg-gradient-to-t max-md:from-bg/95 max-md:via-bg/75 max-md:to-bg/30" />
          </div>
          <p className="mono absolute left-site top-[14vh] z-10 flex items-center gap-3"><span className="led" />{home.problems.eyebrow}</p>
          {beats.map((b, i) => {
            const last = i === N - 1;
            return (
              <div key={b.h} className="rw invisible absolute inset-x-site top-[50%] z-10 -translate-y-1/2 opacity-0"><div data-fx-text className="max-w-3xl">
                <p className="mono mb-5" data-nodecode>{last ? "Evolviq AI" : `${String(i + 1).padStart(2, "0")} / ${String(N - 1).padStart(2, "0")}`}</p>
                <h3 className={`!text-[clamp(30px,4.6vw,76px)] [text-shadow:0_2px_30px_#000] ${last ? "grad-chars" : ""}`} aria-label={b.h}>
                  {b.h.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
                </h3>
                <p className="lead mt-6 [text-shadow:0_2px_24px_#000]">{b.d}</p>
              </div></div>
            );
          })}
          <div aria-hidden className="absolute bottom-[12vh] inset-x-site z-10 h-px bg-white/10">
            <div className="rbar h-full origin-left scale-x-0 bg-gradient-to-r from-cyan to-violet" />
          </div>
        </div>
      )}
    </section>
  );
}
