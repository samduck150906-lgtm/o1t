import { landingKeywords } from "@/lib/seo-keywords";
import {
  STATIC_SEO_MAP,
  getAllDynamicSlugs,
  getDynamicSeo,
  getSiteUrl,
  getStaticSeoPaths,
} from "@/lib/seo";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const base = getSiteUrl();
  const now = new Date().toUTCString();
  const items: { title: string; link: string; desc: string }[] = [];

  for (const path of getStaticSeoPaths()) {
    const entry = path === "" ? STATIC_SEO_MAP[""] : STATIC_SEO_MAP[path];
    if (!entry) continue;
    const link = path === "" ? `${base}/` : `${base}/${path}`;
    items.push({
      title: entry.title,
      link,
      desc: entry.description,
    });
  }

  for (const slug of getAllDynamicSlugs()) {
    const seo = getDynamicSeo(slug);
    if (seo) {
      items.push({
        title: seo.title,
        link: seo.canonical,
        desc: seo.description,
      });
    }
  }

  for (const kw of landingKeywords) {
    items.push({
      title: `${kw.keyword} | 원툴러`,
      link: `${base}/landing/${kw.locationId}/${kw.industryId}/${kw.painId}`,
      desc: `${kw.keyword} — 원툴러 업종별 솔루션`,
    });
  }

  const channelItems = items
    .map(
      (it) => `
    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${escapeXml(it.link)}</link>
      <guid isPermaLink="true">${escapeXml(it.link)}</guid>
      <pubDate>${now}</pubDate>
      <description>${escapeXml(it.desc)}</description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>원툴러 ONETOOLER — 업데이트</title>
    <link>${escapeXml(base)}/</link>
    <description>B2B 예약·CRM 자동화 SaaS 원툴러의 프로그래매틱 SEO 및 솔루션 페이지 피드</description>
    <language>ko-KR</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${escapeXml(base)}/rss.xml" rel="self" type="application/rss+xml"/>
    ${channelItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
