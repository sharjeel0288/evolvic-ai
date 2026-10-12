import { IconTile } from "@/lib/icons";
import Hero from "@/components/Hero";
import Workflow from "@/components/Workflow";
import ScrollVideo from "@/components/ScrollVideo";
import SolutionsShowcase from "@/components/SolutionsShowcase";
import Marquee from "@/components/Marquee";
import AgentRing from "@/components/AgentRing";
import Approach from "@/components/Approach";
import Phases from "@/components/Phases";
import Mosaic from "@/components/Mosaic";
import Principles from "@/components/Principles";
import ParticleNetwork from "@/components/ParticleNetwork";
import SectionHead from "@/components/SectionHead";
import CardGrid from "@/components/CardGrid";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import Manifesto from "@/components/Manifesto";
import VideoCta from "@/components/VideoCta";
import Image from "next/image";
import { home } from "@/lib/content";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("/", "AI Automation Company & Business AI Solutions | Evolviq AI",
  "Evolviq AI builds AI agents, voice receptionists, chatbots, CRM automations and custom AI solutions that help businesses work smarter and respond faster.");

export default function Home() {
  return (
    <>
      <Hero />
      <Workflow />
      <ScrollVideo />
      <SolutionsShowcase />
      <Marquee />
      <AgentRing />
      <Approach />
      <Phases />
      <Mosaic />

      <section className="section" aria-labelledby="uc-h" data-scene data-shape="1" data-x="1.9" data-name="Use cases">
        <SectionHead id="uc-h" eyebrow={home.useCases.eyebrow} title={home.useCases.h2} />
        <CardGrid items={home.useCases.cards} />
        <Reveal className="mt-10"><Button href="/use-cases">{home.useCases.cta}</Button></Reveal>
      </section>

      <Principles />

      <section className="section grid gap-6 lg:grid-cols-2" aria-label="Products and about" data-scene data-shape="6" data-x="0" data-name="Products">
        <Reveal className="nm relative overflow-hidden p-10 md:p-14">
          <Image src="/images/design-orb.webp" alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="kb object-cover opacity-25" />
          <div className="relative">
            <IconTile k="Products" className="mb-6" /><p className="mono mb-4">{home.products.eyebrow}</p>
            <h2 className="!text-[clamp(28px,3.6vw,60px)]">{home.products.h2}</h2>
            <p className="mt-5 text-ink/80">{home.products.copy}</p>
            <div className="mt-8"><Button href="/contact">{home.products.cta}</Button></div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="nm relative overflow-hidden p-10 md:p-14">
          <Image src="/images/team.webp" alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="kb object-cover opacity-20" />
          <div className="relative">
            <IconTile k="About" className="mb-6" /><p className="mono mb-4">{home.about.eyebrow}</p>
            <h2 className="!text-[clamp(28px,3.6vw,60px)]">{home.about.h2}</h2>
            <p className="mt-5 text-ink/80">{home.about.copy}</p>
            <p className="lead !text-xl mt-4 !text-gold">{home.about.line}</p>
            <div className="mt-8"><Button href="/about">{home.about.cta}</Button></div>
          </div>
        </Reveal>
      </section>

      <Manifesto />

      <section className="section relative isolate" aria-labelledby="in-h" data-scene data-shape="2" data-x="1.9" data-name="Insights">
        <ParticleNetwork className="-z-10 opacity-40" density={0.00005} />
        <SectionHead id="in-h" eyebrow={home.insights.eyebrow} title={home.insights.h2} lead={home.insights.intro} />
        <ul className="divide-y divide-white/5 border-y border-white/5">
          {home.insights.titles.map((t, i) => (
            <li key={t}><Reveal delay={i * 0.06} className="group flex items-center justify-between gap-6 py-7">
              <span className="text-[clamp(18px,1.8vw,28px)] transition-transform duration-500 group-hover:translate-x-3">{t}</span>
              <span className="chip shrink-0">Coming soon</span>
            </Reveal></li>
          ))}
        </ul>
      </section>

      <VideoCta title={home.cta.h2} copy={home.cta.copy} primary={home.cta.primary} secondary={home.cta.secondary} />
    </>
  );
}
