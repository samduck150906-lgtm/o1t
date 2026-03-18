import { MetadataRoute } from "next";
import { landingKeywords } from "@/lib/seo-keywords";
import {
  getAllDynamicSlugs,
  getDynamicSeo,
  getSiteUrl,
  getStaticSeoPaths,
} from "@/lib/seo";

const extraStatic = [
  "/solution",
  "/solution/online",
  "/solution/automation",
  "/diagnosis",
  "/faq",
  "/o1t",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];

  const push = (path: string, priority: number, freq: MetadataRoute.Sitemap[0]["changeFrequency"]) => {
    const url = path === "/" || path === "" ? `${baseUrl}/` : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    if (seen.has(url)) return;
    seen.add(url);
    out.push({
      url,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    });
  };

  for (const p of getStaticSeoPaths()) {
    const path = p === "" ? "/" : `/${p}`;
    push(path, p === "" ? 1 : 0.85, "weekly");
  }

  for (const ep of extraStatic) {
    push(ep, 0.75, "weekly");
  }

  for (const slug of getAllDynamicSlugs()) {
    const seo = getDynamicSeo(slug);
    if (seo) {
      push(`/${slug}`, 0.7, "weekly");
    }
  }

  for (const kw of landingKeywords) {
    push(`/landing/${kw.locationId}/${kw.industryId}/${kw.painId}`, 0.65, "weekly");
  }

  return out;
}
