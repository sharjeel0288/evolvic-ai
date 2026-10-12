import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found | Evolviq AI", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="hero-grad relative flex min-h-[100svh] items-end px-site pb-[14vh]" data-theme="dark" data-scene data-shape="3" data-x="0" data-name="404">
      <div className="scrim relative max-w-3xl">
        <p className="mono mb-6">Error 404</p>
        <h1 className="!text-[clamp(40px,6vw,96px)]">This page drifted <span className="tone">out of the network.</span></h1>
        <p className="lead mt-6">The link may be broken or the page may have moved.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn p">Back to home</Link>
          <Link href="/contact" className="btn">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
