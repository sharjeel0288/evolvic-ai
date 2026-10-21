import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif, Inter, Sora } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import ParticleField from "@/components/ParticleField";
import FxChrome from "@/components/FxChrome";
import { SITE } from "@/lib/site";

// Google Fonts (SIL OFL 1.1): Sora for headings, Inter for body — closest free matches to the reference's geometric grotesk
const sora = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-head", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "AI Automation Company & Business AI Solutions | Evolviq AI", template: "%s" },
  description: "Evolviq AI builds AI agents, voice receptionists, chatbots, CRM automations and custom AI solutions that help businesses work smarter and respond faster.",
  applicationName: SITE.name,
  keywords: ["AI automation", "business AI", "AI agents", "voice agents", "chatbots", "CRM automation", "custom AI", "AI solutions", "AI receptionist", "Evolviq AI"],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Technology",
  classification: "AI Automation Company",
  formatDetection: { email: false, address: false, telephone: false },
  referrer: "origin-when-cross-origin",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
    other: [
      { rel: "mask-icon", url: "/icon.png", color: "#000000" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE.name,
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Evolviq AI: Smarter Systems. Better Business." }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  verification: {
    google: "google-site-verification-code",
  },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.svg`,
  slogan: SITE.tagline,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SITE.phone,
    contactType: "sales",
    areaServed: "US",
    availableLanguage: ["English"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.streetAddress,
    addressLocality: SITE.address.addressLocality,
    addressRegion: SITE.address.addressRegion,
    postalCode: SITE.address.postalCode,
  },
};

const webSiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.supporting,
  publisher: { "@id": `${SITE.url}/#organization` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable} ${geistMono.variable} ${instrument.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("evq-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-intro")}catch(e){}try{if(/Mac/.test(navigator.platform||navigator.userAgent)&&!(navigator.maxTouchPoints>1))document.documentElement.classList.add("is-mac")}catch(e){}` }} />
        <noscript><style>{`.ld{display:none!important}`}</style></noscript>
      </head>
      <body>
        <a href="#main" className="skip btn p">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
        <ParticleField />
        <div className="field-dim" aria-hidden />
        <SmoothScroll />
        <Nav />
        <main id="main" className="relative z-[2] overflow-x-clip">{children}</main>
        <div className="relative z-[2] overflow-x-clip"><Footer /></div>
        <FxChrome />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
