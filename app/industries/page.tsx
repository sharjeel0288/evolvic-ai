import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import VideoCta from "@/components/VideoCta";
import { industriesPage as d } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { IconTile } from "@/lib/icons";

export const metadata = pageMeta("/industries", "AI Automation Solutions for Industries | Evolviq AI",
  "Explore business AI solutions for healthcare, real estate, home services, eCommerce, hospitality, travel, education and professional services.");

export default function Industries() {
  return (
    <>
      <PageHero eyebrow={d.hero.eyebrow} title={d.hero.h1} lead={d.hero.lead} img="/images/connections.webp" shape={13} />
      <section className="section" aria-label="Industries" data-scene data-shape="13" data-x="0" data-name="Industries">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {d.items.map((it, i) => (
            <li key={it.k}><Reveal delay={(i % 3) * 0.08} className="h-full">
              <GlowCard className="flex h-full flex-col p-8">
                <div className="mb-6 flex items-center gap-3"><IconTile k={it.k} /><p className="text-sm font-medium text-ink2">{it.k}</p></div>
                <h2 className="card-title !text-[clamp(19px,1.6vw,24px)]">{it.h}</h2>
                <p className="card-body mt-3 flex-1">{it.d}</p>
                <ul className="mt-6 flex flex-wrap gap-2">{it.apps.map((a) => <li key={a} className="chip">{a}</li>)}</ul>
              </GlowCard>
            </Reveal></li>
          ))}
        </ul>
      </section>
      <VideoCta title={d.cta.h2} copy={d.cta.p} primary={d.cta.cta} />
    </>
  );
}
