import { MetadataRoute } from "next";
import { landingKeywords } from "@/lib/seo-keywords";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owneronetool.com";

const staticRoutes: { url: string; priority: number }[] = [
  { url: "/", priority: 1.0 },
  { url: "/solution", priority: 0.8 },
  { url: "/pricing", priority: 0.8 },
  { url: "/diagnosis", priority: 0.8 },
  { url: "/faq", priority: 0.8 },
  { url: "/o1t", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${baseUrl}${r.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r.priority,
  }));
  const landingEntries: MetadataRoute.Sitemap = landingKeywords.map((kw) => ({
    url: `${baseUrl}/landing/${kw.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticEntries, ...landingEntries];
}
