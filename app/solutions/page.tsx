import ZoomImage from "@/components/ZoomImage";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import VideoCta from "@/components/VideoCta";
import SplitHeading from "@/components/SplitHeading";
import { services, solutionsPage as s } from "@/lib/content";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("/solutions", "AI Automation Services & Custom AI Solutions | Evolviq AI",
  "Explore AI automation services from Evolviq AI: voice agents, customer support chatbots, CRM workflows, custom AI development and AI-powered websites.");

export default function Solutions() {
  return (
    <>
      <PageHero eyebrow={s.hero.eyebrow} title={s.hero.h1} lead={s.hero.lead} img="/images/design-network.webp" shape={1} />
      <section className="section" aria-labelledby="int-h"><SectionHead id="int-h" title={s.intro.h2} lead={s.intro.p} /></section>
      {services.map((sv, i) => (
        <section key={sv.id} id={sv.id} className="section scroll-mt-24 grid items-center gap-12 lg:grid-cols-2" aria-labelledby={`${sv.id}-h`} data-scene data-shape={String([7, 3, 6, 1, 2, 5, 4][i])} data-x={i % 2 ? "-1.9" : "1.9"} data-name={sv.short}>
          <div className={`relative ${i % 2 ? "lg:order-2" : ""}`}>
            <ZoomImage src={sv.img} alt="" className="min-h-[420px]" />
            <span className="display pointer-events-none absolute left-6 top-4 text-7xl text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.6)]">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <div>
            <p className="mono mb-4">Service {String(i + 1).padStart(2, "0")}</p>
            <SplitHeading id={`${sv.id}-h`} text={sv.h2} className="!text-[clamp(26px,3.4vw,56px)]" />
            <Reveal delay={0.1}><p className="lead mt-5 !text-gold">{sv.lead}</p></Reveal>
            {sv.body.map((b, k) => <Reveal key={k} delay={0.15}><p className="mt-4 text-ink/80">{b}</p></Reveal>)}
            <Reveal delay={0.2}>
              <p className="mt-6"><span className="mono">Common applications</span><span className="mt-1 block text-ink/80">{sv.apps}</span></p>
              {"note" in sv && sv.note && <p className="well mt-5 p-4 text-sm"><strong className="font-medium text-ink">{sv.note.k}:</strong> <span className="text-mut">{sv.note.v}</span></p>}
              <div className="mt-8"><Button href="/contact">{sv.cta}</Button></div>
            </Reveal>
          </div>
        </section>
      ))}
      <section className="section" aria-labelledby="tools-h" data-scene data-shape="1" data-x="0" data-name="Integrations">
        <SectionHead id="tools-h" title={s.integrations.h2} lead={s.integrations.p} />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {s.integrations.cats.map((c, i) => <li key={c}><Reveal delay={i * 0.05} className="nm p-6 text-center font-mono text-sm uppercase tracking-[.14em] transition hover:-translate-y-1 hover:text-cyan">{c}</Reveal></li>)}
        </ul>
      </section>
      <VideoCta title={s.cta.h2} copy={s.cta.p} primary={s.cta.cta} />
    </>
  );
}
