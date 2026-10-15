"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SplitHeading from "./SplitHeading";
import Reveal from "./Reveal";
import { home } from "@/lib/content";
import { fx } from "@/lib/fx";

export default function AgentRing() {
  const a = home.agents;
  const [act, setAct] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setAct((x) => (x + 1) % a.states.length), 3200);
    return () => clearInterval(t);
  }, [paused, reduce, a.states.length]);
  const R = 150;
  return (
    <section className="section" data-theme="dark" aria-labelledby="ag-h" data-scene data-shape="12" data-x="-1.9" data-name="Under the hood">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <Reveal><p className="mono mb-5">{a.eyebrow}</p></Reveal>
          <SplitHeading id="ag-h" text={a.h2} />
          <Reveal delay={0.15}><p className="lead mt-6">{a.intro}</p></Reveal>
          <Reveal delay={0.25}><p className="mt-8 border-l border-cyan/50 pl-5 text-mut">{a.line}</p></Reveal>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[460px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <svg viewBox="-200 -200 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
            <motion.circle r={R} fill="none" stroke="#a59cff" strokeWidth="2" strokeLinecap="round" pathLength={1}
              strokeDasharray="0.25 0.75" animate={{ strokeDashoffset: -act * 0.25 + 0.125 }} transition={{ type: "spring", stiffness: 60, damping: 14 }} transform="rotate(-90)" />
            {!reduce && <circle r="7" fill="#a59cff" style={{ filter: "drop-shadow(0 0 8px #a59cff)" }}>
              <animateMotion dur="7s" repeatCount="indefinite" path={`M0,-${R} A${R},${R} 0 1,1 -0.01,-${R}`} />
            </circle>}
            <motion.circle r={R - 34} fill="none" stroke="rgba(142,123,255,.25)" strokeDasharray="2 8" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} />
          </svg>
          <div className="absolute inset-[28%] grid place-items-center rounded-full well text-center">
            <AnimatePresence mode="wait">
              <motion.div key={act} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.4 }} className="px-4" aria-live="polite">
                <p className="display text-2xl">{a.states[act].t}</p>
                <p className="mt-2 text-xs text-mut">{a.states[act].d}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          {a.states.map((s, i) => {
            const ang = (i / a.states.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / 4;
            return (
              <motion.button key={s.t} type="button" initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 0.01, margin: "0px 0px -10% 0px" }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: i * 0.15 }} onPointerEnter={() => fx.setShape(12)} onClick={() => setAct(i)} onFocus={() => setPaused(true)} aria-pressed={act === i}
                className={`btn !absolute !px-4 !py-2.5 ${act === i ? "!border-cyan/70 text-cyan" : ""}`}
                style={{ left: `${50 + Math.cos(ang) * 37.5}%`, top: `${50 + Math.sin(ang) * 37.5}%`, x: "-50%", y: "-50%" }}>
                {String(i + 1).padStart(2, "0")} {s.t}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
