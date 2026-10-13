"use client";
import Image from "next/image";
import ZoomStack from "./ZoomStack";
import { home } from "@/lib/content";
import { fx } from "@/lib/fx";

const imgs = ["/images/vortex.webp", "/images/data-rain.webp", "/images/orb.webp", "/images/tunnel.webp"];

/** Original phases(): four implementation phases zoom-through; the particle pulse sweeps across per phase. */
export default function Phases() {
  const steps = home.phases.map((p, i) => (
    <article key={p.t} className="grid w-full items-center gap-5 md:grid-cols-2 md:gap-10">
      <div data-fx-text className="scrim relative">
        <p className="num mb-4" data-nodecode>Phase {String(i + 1).padStart(2, "0")} / 04</p>
        <h2 className="!text-[clamp(28px,4.4vw,72px)]" aria-label={p.t}>
          {p.t.split(" ").map((w, k) => <span key={k} aria-hidden className="w">{[...w].map((c, z) => <i key={z}>{c}</i>)} </span>)}
        </h2>
        <p className="lead mt-3 !text-gold md:mt-4">{p.s}</p>
        <p className="mt-3 text-ink/80 max-md:text-[15px] md:mt-4">{p.d}</p>
      </div>
      <div data-theme="dark" className="zs-img nm relative min-h-[210px] overflow-hidden md:min-h-[360px]">
        <Image src={imgs[i]} alt="" fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f13] via-[#0d0f13]/60 to-transparent" />
        <div className="relative flex h-full min-h-[210px] flex-col justify-end p-6 md:min-h-[360px] md:p-8">
          <p><span className="mono">Outcome</span><span className="mt-1 block text-lg text-ink">{p.o}</span></p>
          <ul className="mt-5 flex flex-wrap gap-2">{p.tags.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
        </div>
      </div>
    </article>
  ));
  return (
    <ZoomStack steps={steps} onStep={(n) => { fx.pulse.value = -3 + n * 2; }} aria-label="Implementation phases" data-theme="light"
      data-scene="" data-shape="2" data-x="-1.7" data-name="Phases" />
  );
}
