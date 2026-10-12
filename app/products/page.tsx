import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import { productsPage as p } from "@/lib/content";
import { pageMeta } from "@/lib/meta";

// Holding page: noindex until a real, approved product exists (content master §07).
export const metadata = pageMeta("/products", "Products | Evolviq AI", p.copy, { robots: { index: false, follow: true } });

export default function Products() {
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.h1} lead={p.copy} img="/images/design-orb.webp" shape={5} />
      <section className="section !pt-0"><Button href="/contact" primary>{p.cta}</Button></section>
    </>
  );
}
