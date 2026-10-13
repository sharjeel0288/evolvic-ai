import PageHero from "@/components/PageHero";
import SectionHead from "@/components/SectionHead";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import { contactPage as c } from "@/lib/content";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta("/contact", "Contact Evolviq AI | Discuss Your AI Project",
  "Talk to Evolviq AI about AI voice agents, business automation, custom AI development, chatbots, CRM integration or an AI-powered website.");

export default function Contact() {
  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.h1} lead={c.hero.lead} img="/images/laptop.webp" shape={16} />
      <section className="section grid gap-12 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="f-h" data-scene data-shape="17" data-x="0" data-name="Start here">
        <div>
          <SectionHead id="f-h" title={c.form.h2} lead={c.form.intro} className="!mb-10 [&_h2]:!text-[clamp(28px,3.4vw,56px)]" />
          <Reveal className="nm p-8">
            <h2 className="!text-2xl">{c.secondary.h2}</h2>
            <p className="mt-3 text-ink/75">{c.secondary.p}</p>
            {SITE.bookingUrl
              ? <a className="btn mt-6" href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer">{c.secondary.cta} →</a>
              : <p className="mono mt-6 !text-mut">{c.secondary.cta} — booking link coming soon</p>}
          </Reveal>
          <Reveal className="nm mt-6 p-8">
            <h2 className="!text-2xl">Reach us directly</h2>
            <ul className="mt-4 space-y-3 text-ink/75">
              <li><a className="ul" href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`}>{SITE.phone}</a></li>
              <li><a className="ul" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li>
                <address className="not-italic">
                  <span className="block text-sm text-mut">{SITE.address.label}</span>
                  {SITE.address.streetAddress}<br />
                  {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}<br />
                  {SITE.address.county}
                </address>
              </li>
            </ul>
          </Reveal>
        </div>
        <Reveal><ContactForm /></Reveal>
      </section>
      <section id="faqs" className="section scroll-mt-24" aria-labelledby="faq-h" data-scene data-shape="10" data-x="0" data-name="FAQs">
        <SectionHead id="faq-h" eyebrow="FAQs" title="Contact FAQs" />
        <Faq items={c.faqs} />
      </section>
    </>
  );
}
