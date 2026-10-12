import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import GlowCard from "@/components/GlowCard";
import VideoCta from "@/components/VideoCta";
import { useCasesPage as u } from "@/lib/content";
import { pageMeta } from "@/lib/meta";
import { IconTile } from "@/lib/icons";

export const metadata = pageMeta("/use-cases", "AI Automation Use Cases for Business | Evolviq AI",
  "See how AI agents and automation can help with customer calls, bookings, lead follow-ups, document processing, CRM updates and business reporting.");

export default function UseCases() {
  return (
    <>
      <PageHero eyebrow={u.hero.eyebrow} title={u.hero.h1} lead={u.hero.lead} img="/images/neon-dashboard.webp" shape={2} />
      <section className="section" aria-label="Use cases" data-scene data-shape="3" data-x="0" data-name="Use cases">
        <ol className="grid gap-6 lg:grid-cols-2">
          {u.items.map((it, i) => (
            <li key={it.k}>
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <GlowCard className="h-full p-8 md:p-10">
                  <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-3"><IconTile k={it.k} /><p className="text-sm font-medium text-ink2">{it.k}</p></div><span className="num">{String(i + 1).padStart(2, "0")}</span></div>
                  <h2 className="card-title !text-[clamp(20px,1.8vw,28px)]">{it.h}</h2>
                  <p className="card-body mt-3">{it.d}</p>
                  <p className="mt-6 text-xs font-medium uppercase tracking-[.12em] text-mut">Typical workflow</p>
                  <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    {it.flow.map((f, k) => (
                      <li key={f} className="flex items-center gap-2"><span className="chip !normal-case !tracking-normal !font-sans !text-[13px]">{f}</span>{k < it.flow.length - 1 && <span aria-hidden className="text-iris">→</span>}</li>
                    ))}
                  </ol>
                  <p className="mt-6 border-t border-white/[.06] pt-5 text-sm"><span className="text-ink">Useful for:</span> <span className="text-mut">{it.fit}</span></p>
                </GlowCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
      <VideoCta title={u.cta.h2} copy={u.cta.p} primary={u.cta.cta} />
    </>
  );
}
