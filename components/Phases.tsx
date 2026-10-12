"use client";
import Image from "next/image";
import ZoomStack from "./ZoomStack";
import { home } from "@/lib/content";
import { fx } from "@/lib/fx";

const imgs = ["/images/design-core.webp", "/images/design-grid.webp", "/images/design-orb.webp", "/images/design-tunnel.webp"];

/** Original phases(): four implementation phases zoom-through; the particle pulse sweeps across per phase. */
export default function Phases() {
  const steps = home.phases.map((p, i) => (
    <article key={p.t} className="grid w-full items-center gap-10 md:grid-cols-2">
      <div className="scrim relative">
        <p className="num mb-4" data-nodecode>Phase {String(i + 1).padStart(2, "0")} / 04</p>
        <h2 className="!text-[clamp(32px,4.4vw,72px)]" aria-label={p.t}>
          {p.t.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
        </h2>
        <p className="lead mt-4 !text-gold">{p.s}</p>
        <p className="mt-4 text-ink/80">{p.d}</p>
      </div>
      <div className="nm relative min-h-[360px] overflow-hidden">
        <Image src={imgs[i]} alt="" fill sizes="(max-width:768px) 100vw, 45vw" className="kb object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f13] via-[#0d0f13]/60 to-transparent" />
        <div className="relative flex h-full min-h-[360px] flex-col justify-end p-8">
          <p><span className="mono">Outcome</span><span className="mt-1 block text-lg text-ink">{p.o}</span></p>
          <ul className="mt-5 flex flex-wrap gap-2">{p.tags.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
        </div>
      </div>
    </article>
  ));
  return (
    <ZoomStack steps={steps} onStep={(n) => { fx.pulse.value = -3 + n * 2; }} aria-label="Implementation phases"
      data-scene="" data-shape="2" data-x="-1.7" data-name="Phases" />
  );
}
