"use client";
import Image from "next/image";
import Link from "next/link";
import ZoomStack from "./ZoomStack";
import { home, services } from "@/lib/content";
import { fx } from "@/lib/fx";
import { IconTile } from "@/lib/icons";
import { ArrowUpRight } from "lucide-react";

const SHAPE = [7, 6, 1, 2, 4, 5];

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
      <article key={s.id} className="grid w-full items-center gap-8 md:grid-cols-[1.1fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,.6)]">
          <Image src={s.img} alt="" fill sizes="(max-width:768px) 100vw, 55vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-bg/80 via-transparent to-transparent" />
          <span className="display absolute bottom-3 left-6 text-[clamp(56px,7vw,110px)] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.45)]">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <div className="scrim relative">
          <div className="mb-5 flex items-center gap-3"><IconTile k={s.id} /><span className="num">{String(i + 1).padStart(2, "0")} / 06</span></div>
          <h3 className="!text-[clamp(26px,3vw,46px)]" aria-label={s.short}>
            {s.short.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
          </h3>
          <p className="mt-5 text-ink/80">{s.slide}</p>
          <Link href={`/solutions#${s.id}`} className="btn mt-8">{s.slideCta} <ArrowUpRight size={16} aria-hidden /></Link>
        </div>
      </article>
    )),
  ];
  return (
    <ZoomStack steps={steps} onStep={(n) => fx.setShape(n === 0 ? 2 : SHAPE[n - 1])} aria-labelledby="sol-h"
      data-scene="" data-shape="2" data-x="1.7" data-name="Core solutions" />
  );
}
