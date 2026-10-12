"use client";
import { useState } from "react";
import ZoomStack from "./ZoomStack";
import { home } from "@/lib/content";
import { fx } from "@/lib/fx";

const SH = [0, 6, 1, 5];

/** Original princ(): pinned zoom-through of the four principles with a progress ring; each morphs the particles. */
export default function Principles() {
  const p = home.principles;
  const [n, setN] = useState(0);
  const steps = p.items.map((it, i) => (
    <article key={it.t} className="grid w-full items-center gap-10 md:grid-cols-[auto_1fr]">
      <svg viewBox="0 0 100 100" className="h-40 w-40 md:h-64 md:w-64" aria-hidden>
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="#5ce1e6" strokeWidth="2" strokeLinecap="round" pathLength={1}
          strokeDasharray="1" strokeDashoffset={1 - (Math.max(n, i) + 1) / 4} transform="rotate(-90 50 50)" className="transition-[stroke-dashoffset] duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)]" />
        <text x="50" y="58" textAnchor="middle" fill="#ecedf1" fontSize="26" fontFamily="var(--font-clash)" fontWeight="600">{String(i + 1).padStart(2, "0")}</text>
      </svg>
      <div className="scrim relative">
        <p className="mono mb-4" data-nodecode>{p.eyebrow} · {String(i + 1).padStart(2, "0")} / 04</p>
        <h3 className="!text-[clamp(28px,3.8vw,64px)]" aria-label={it.t}>
          {it.t.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
        </h3>
        <p className="lead mt-5">{it.d}</p>
      </div>
    </article>
  ));
  return (
    <ZoomStack steps={steps} onStep={(k) => { setN(k); fx.setShape(SH[k]); }} aria-labelledby="pr-h"
      data-scene="" data-shape="0" data-x="1.9" data-name="Principles">
      <h2 id="pr-h" className="sr-only">{p.h2}</h2>
    </ZoomStack>
  );
}
