"use client";
import Image from "next/image";
import Link from "next/link";
import ZoomStack from "./ZoomStack";
import { home, services } from "@/lib/content";
import { fx } from "@/lib/fx";
import { IconTile } from "@/lib/icons";
import { ArrowUpRight } from "lucide-react";

// particle shape per service: gear, phone, chat, database, agent, globe
const SHAPE = [8, 9, 10, 11, 12, 13];

/** Original svc(): six solution slides zoom-through in a pinned scene; each slide morphs the particle field. */
export default function SolutionsShowcase() {
  const list = services.slice(0, 6);
  const steps = [
    <div key="i" className="max-w-5xl">
      <p className="mono mb-5">{home.solutions.eyebrow}</p>
      <h2 id="sol-h" className="!text-[clamp(36px,5.6vw,96px)]" aria-label={home.solutions.h2}>
        {home.solutions.h2.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
      </h2>
    </div>,
    ...list.map((s, i) => (
      <article key={s.id} className="grid w-full items-center gap-5 md:grid-cols-[1.1fr_1fr] md:gap-8">
        <div data-fx-media className="zs-img relative aspect-[16/10] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,.6)] max-md:aspect-[16/9]">
          <Image src={s.img} alt="" fill sizes="(max-width:768px) 100vw, 55vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-bg/80 via-transparent to-transparent" />
          <div aria-hidden className="zs-sweep absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent mix-blend-overlay" />
          <span className="display absolute bottom-3 left-6 text-[clamp(56px,7vw,110px)] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.45)]">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <div data-fx-text className="scrim relative">
          <div className="mb-5 flex items-center gap-3"><IconTile k={s.id} /><span className="num">{String(i + 1).padStart(2, "0")} / 06</span></div>
          <h3 className="!text-[clamp(26px,3vw,46px)]" aria-label={s.short}>
            {s.short.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
          </h3>
          <p className="mt-4 text-ink/80 max-md:text-[15px] max-md:leading-relaxed md:mt-5">{s.slide}</p>
          <Link href={`/solutions#${s.id}`} aria-label={s.slideCta} className="btn mt-6 md:mt-8">{s.slideCta} <ArrowUpRight size={16} aria-hidden /></Link>
        </div>
      </article>
    )),
  ];
  return (
    <ZoomStack steps={steps} onStep={(n) => fx.setShape(n === 0 ? 2 : SHAPE[n - 1])} aria-labelledby="sol-h"
      data-scene="" data-shape="2" data-x="1.7" data-name="Core solutions" />
  );
}
