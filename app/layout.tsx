import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ParticleField from "@/components/ParticleField";
import FxChrome from "@/components/FxChrome";
import { SITE } from "@/lib/site";

// Fontshare (ITF Free Font License — free for commercial use), self-hosted woff2
const satoshi = localFont({ variable: "--font-satoshi", display: "swap", src: [
  { path: "./fonts/Satoshi-400.woff2", weight: "400" }, { path: "./fonts/Satoshi-500.woff2", weight: "500" }, { path: "./fonts/Satoshi-700.woff2", weight: "700" }] });
const clash = localFont({ variable: "--font-clash", display: "swap", src: [
  { path: "./fonts/ClashDisplay-500.woff2", weight: "500" }, { path: "./fonts/ClashDisplay-600.woff2", weight: "600" }] });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

export const viewport: Viewport = { themeColor: "#07080c", colorScheme: "dark" };

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "AI Automation Company & Business AI Solutions | Evolviq AI", template: "%s" },
  description: "Evolviq AI builds AI agents, voice receptionists, chatbots, CRM automations and custom AI solutions that help businesses work smarter and respond faster.",
  applicationName: SITE.name,
  icons: { icon: "/icon.svg" },
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Evolviq AI — Smarter Systems. Better Business." }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  robots: { index: true, follow: true },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.svg`,
  slogan: SITE.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${satoshi.variable} ${clash.variable} ${geistMono.variable} ${instrument.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("evq-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-intro")}catch(e){}` }} />
        <noscript><style>{`.ld{display:none!important}`}</style></noscript>
      </head>
      <body>
        <a href="#main" className="skip btn p">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <ParticleField />
        <div className="field-dim" aria-hidden />
        <SmoothScroll />
        <Nav />
        <main id="main" className="relative z-[2]">{children}</main>
        <div className="relative z-[2]"><Footer /></div>
        <FxChrome />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
