import Image from "next/image";
import Link from "next/link";
import { PhoneCall, Mail, Settings, Network, Tag, Layers, CalendarClock, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import VideoCta from "@/components/VideoCta";
import { productsPage as p, home, services } from "@/lib/content";
import { pageMeta } from "@/lib/meta";

// Holding page: noindex until a real, approved product exists (content master §07 — no invented names, pricing or dates).
export const metadata = pageMeta("/products", "Products | Evolviq AI", p.copy, { robots: { index: false, follow: true } });

const ICONS = [PhoneCall, Mail, Settings, Network];
const STATUS = [
  { I: Tag, t: "Product names" },
  { I: Layers, t: "Features" },
  { I: CalendarClock, t: "Availability and demos" },
];

export default function Products() {
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.h1} lead={p.copy} img="/images/orb.webp" shape={5} />

      {/* light band — what the products are designed around (content: home.problems) */}
      <section className="section" aria-labelledby="pr-h">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <p className="mono mb-5">{home.products.eyebrow}</p>
            <h2 id="pr-h" className="!text-[clamp(30px,4vw,64px)]">{home.products.h2}</h2>
          </div>
          <p className="lead">{home.products.copy}</p>
        </div>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.problems.slides.map((s, i) => {
            const I = ICONS[i % ICONS.length];
            return (
              <Reveal key={s.h} delay={i * 0.06} className="nm flex h-full flex-col p-7">
                <span className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-[#0a0a0a] text-white"><I size={20} aria-hidden /></span>
                <h3 className="card-title !text-[19px] leading-snug">{s.h}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mut">{s.d}</p>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* dark band — status (wording from the holding copy, nothing invented) */}
      <section className="section" data-theme="dark" aria-labelledby="st-h" data-scene data-shape="7" data-x="0" data-name="In development">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div data-fx-text className="scrim relative">
            <p className="mono mb-5 flex items-center gap-3"><span className="led" />{p.eyebrow}</p>
            <h2 id="st-h" className="!text-[clamp(30px,4vw,64px)]">{p.h1}</h2>
            <p className="lead mt-6">{p.copy}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/contact" primary>{p.cta}</Button>
              <Button href="/solutions">Explore our solutions</Button>
            </div>
          </div>
          <ul className="grid gap-3">
            {STATUS.map(({ I, t }) => (
              <li key={t} className="nm glass flex items-center gap-5 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10"><I size={20} aria-hidden /></span>
                <span className="card-title flex-1 !text-[18px]">{t}</span>
                <span className="chip whitespace-nowrap max-sm:!text-[11px]">Published when ready</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* light band — available today: custom solutions */}
      <section className="section" aria-labelledby="now-h">
        <p className="mono mb-5">{home.solutions.eyebrow}</p>
        <h2 id="now-h" className="max-w-3xl !text-[clamp(28px,3.6vw,56px)]">{home.solutions.h2}</h2>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <Link href={`/solutions#${s.id}`} className="nm group relative flex h-full flex-col overflow-hidden" aria-label={s.slideCta}>
                {s.img && <div className="relative aspect-[16/9]"><Image src={s.img} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /></div>}
                <span className="flex flex-1 flex-col p-6">
                  <span className="card-title !text-[19px]">{s.short}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[14px] font-medium">{s.slideCta} <ArrowUpRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <VideoCta id="pr-cta" title={home.products.h2} copy={p.copy} primary={p.cta} secondary={home.products.cta} />
    </>
  );
}
