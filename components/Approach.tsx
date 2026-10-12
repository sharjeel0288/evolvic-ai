"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { home } from "@/lib/content";
import { fx } from "@/lib/fx";

gsap.registerPlugin(ScrollTrigger);

/** Six-step horizontal scroll, pinned with GSAP ScrollTrigger (all screen sizes; stacks only for reduced motion). */
export default function Approach() {
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const a = home.approach;
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const t = track.current!, s = sec.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: s, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1.2, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (st) => { fx.pulse.value = -3.5 + 7 * st.progress; } } });
      gsap.utils.toArray<HTMLElement>(".ap-card").forEach((c) => {
        gsap.from(c, { rotateY: 18, scale: 0.88, opacity: 0.2, transformPerspective: 1200, ease: "none", scrollTrigger: { trigger: c, containerAnimation: tween, start: "left 98%", end: "left 55%", scrub: true } });
        gsap.from(c.querySelector(".ap-num"), { yPercent: 60, scale: 1.6, opacity: 0, ease: "power3.out", scrollTrigger: { trigger: c, containerAnimation: tween, start: "left 85%", end: "left 45%", scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <section ref={sec} className="relative flex h-[100svh] items-center overflow-hidden motion-reduce:block motion-reduce:h-auto motion-reduce:py-[14vh]" aria-labelledby="ap-h" data-scene data-shape="7" data-x="0" data-name="Approach">
      <div ref={track} className="flex w-max flex-row items-stretch gap-4 px-site md:gap-6 motion-reduce:w-auto motion-reduce:flex-col">
        <div className="flex w-[84vw] shrink-0 flex-col justify-center md:w-[52vw] lg:w-[38vw] motion-reduce:w-auto">
          <p className="mono mb-5">{a.eyebrow}</p>
          <h2 id="ap-h">{a.h2}</h2>
          <p className="mono mt-8 !text-mut">{a.micro}</p>
        </div>
        {a.steps.map((s, i) => (
          <article key={s.t} className="ap-card nm flex h-[58svh] w-[78vw] shrink-0 flex-col justify-between p-6 sm:w-[56vw] md:p-8 lg:w-[30vw] motion-reduce:h-auto motion-reduce:w-auto">
            <span className="ap-num display block text-[clamp(70px,9vw,150px)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(92,225,230,.6)]">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="mono mb-3">Step {String(i + 1).padStart(2, "0")}</p>
              <h3>{s.t}</h3>
              <p className="mt-3 text-ink/75">{s.d}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
