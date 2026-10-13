export const SITE = {
  name: "Evolviq AI",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.evolviq.ai",
  tagline: "Smarter Systems. Better Business.",
  supporting: "AI built around the way your business works.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@evolviqai.com",
  phone: "(773) 997-1211",
  address: {
    label: "Initial Registered Office",
    streetAddress: "3925 W North Ave",
    addressLocality: "Chicago",
    addressRegion: "IL",
    postalCode: "60647-4617",
    county: "Cook County",
  },
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
};

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/solutions", label: "Solutions" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/industries", label: "Industries" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
] as const;
