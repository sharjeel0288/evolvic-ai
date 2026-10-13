import Link from "next/link";
import Logo from "./Logo";
import FooterNav from "./FooterNav";
import { SITE } from "@/lib/site";
import { footer, services } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="foot-grad relative overflow-hidden px-site pb-10 pt-24" data-theme="dark">
      <div aria-hidden className="pointer-events-none absolute -bottom-[5vw] left-0 right-0 select-none text-center font-display text-[17vw] font-semibold leading-none tracking-[-.04em] text-transparent [-webkit-text-stroke:1px_rgba(214,212,253,.1)]">Evolviq</div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-iris/40 to-transparent" />
      <div className="relative grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo height={34} />
          <p className="mt-6 font-display text-2xl font-semibold tracking-[-.02em]">{footer.headline}</p>
          <p className="mt-3 max-w-sm text-mut">{footer.p}</p>
        </div>
        <div>
          <h2 className="mb-5 text-[12px] font-medium uppercase tracking-[.14em] text-mut">Navigation</h2>
          <FooterNav />
        </div>
        <div>
          <h2 className="mb-5 text-[12px] font-medium uppercase tracking-[.14em] text-mut">Solutions</h2>
          <ul className="space-y-2.5">{services.map((s) => <li key={s.id}><Link className="text-[15px] text-ink2 transition-colors hover:text-ink" href={`/solutions#${s.id}`}>{s.short.replace(" & Receptionists", "").replace(" & Customer Support", "").replace(" & Software", "").replace("-Integrated Websites & eCommerce", "-Powered Websites")}</Link></li>)}</ul>
        </div>
        <div>
          <h2 className="mb-5 text-[12px] font-medium uppercase tracking-[.14em] text-mut">Contact</h2>
          <ul className="space-y-2.5 text-ink/80">
            <li><Link className="ul" href="/contact#faqs">FAQs</Link></li>
            <li><a className="ul" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><a className="ul" href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`}>{SITE.phone}</a></li>
            <li className="max-w-xs text-sm text-mut">
              {SITE.address.label}: {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode} ({SITE.address.county})
            </li>
          </ul>
        </div>
      </div>
      <div className="relative mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 font-mono text-[11px] uppercase tracking-[.14em] text-mut">
        <span>{footer.copyright}</span>
        <span><span className="led mr-2" />{footer.micro}</span>
      </div>
    </footer>
  );
}
