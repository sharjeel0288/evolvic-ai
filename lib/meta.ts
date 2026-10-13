import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export function pageMeta(path: string, title: string, description: string, extra: Partial<Metadata> = {}): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
    ...extra,
  };
}
