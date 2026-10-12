import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// /products intentionally excluded (noindex until real products exist).
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/solutions", "/use-cases", "/industries", "/contact"].map((p) => ({
    url: `${SITE.url}${p}`, changeFrequency: "monthly", priority: p === "" ? 1 : 0.8,
  }));
}
