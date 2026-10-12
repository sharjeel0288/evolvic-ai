import type { Metadata } from "next";

export function pageMeta(path: string, title: string, description: string, extra: Partial<Metadata> = {}): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: ["/og.png"] },
    twitter: { title, description },
    ...extra,
  };
}
