import ZoomImage from "@/components/ZoomImage";
import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import CardGrid from "@/components/CardGrid";
import Reveal from "@/components/Reveal";
import VideoCta from "@/components/VideoCta";
import { aboutPage as a } from "@/lib/content";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("/about", "About Evolviq AI | Practical AI for Real Businesses",
  "Get to know Evolviq AI, an AI automation and software solutions company focused on useful integrations, better workflows and human-centered technology.");

export default function About() {
  return (
    <>
      <PageHero eyebrow={a.hero.eyebrow} title={a.hero.h1} lead={a.hero.lead} img="/images/human-ai.webp" shape={6} />
      <section className="section grid gap-14 lg:grid-cols-2" aria-labelledby="who-h" data-scene data-shape="1" data-x="1.9" data-name="Who we are">
        <div>
          <SectionHead id="who-h" title={a.who.h2} className="!mb-8" />
          {a.who.p.map((p, i) => <Reveal key={i} delay={i * 0.08}><p className="mb-5 text-ink/80">{p}</p></Reveal>)}
        </div>
        <ZoomImage src="/images/team-insights.webp" alt="A team reviewing reports and charts around a table" className="min-h-[420px]" />
      </section>
      <section className="section text-center" aria-labelledby="mi-h" data-scene data-shape="0" data-x="0" data-name="Mission">
        <Reveal><p className="mono mb-5">Our mission</p></Reveal>
        <SectionHead id="mi-h" title={a.mission.h2} lead={a.mission.p} className="mx-auto [&_.lead]:mx-auto" />
      </section>
      <section className="section" aria-labelledby="apr-h" data-scene data-shape="2" data-x="0" data-name="Approach">
        <SectionHead id="apr-h" eyebrow="Our approach" title={a.approach.h2} />
        <CardGrid items={a.approach.items} cols={4} />
      </section>
      <section className="section" aria-labelledby="br-h" data-scene data-shape="4" data-x="0" data-name="What we bring">
        <SectionHead id="br-h" eyebrow="What we bring together" title={a.bring.h2} />
        <CardGrid items={a.bring.items} cols={4} numbered={false} />
      </section>
      <section className="section grid items-center gap-14 lg:grid-cols-2" aria-labelledby="ov-h" data-scene data-shape="6" data-x="-1.9" data-name="Oversight">
        <ZoomImage src="/images/robot-touch.webp" alt="A robotic hand and a human hand reaching toward each other" className="min-h-[420px]" />
        <SectionHead id="ov-h" eyebrow="Why human oversight matters" title={a.oversight.h2} lead={a.oversight.p} className="!mb-0" />
      </section>
      <VideoCta title={a.cta.h2} copy={a.cta.p} primary={a.cta.cta} />
    </>
  );
}
