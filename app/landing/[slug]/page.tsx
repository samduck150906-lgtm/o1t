import { redirect, notFound } from "next/navigation";
import { getLandingDataBySlug } from "@/lib/seo-keywords";

/** 기존 /landing/[slug] URL을 /landing/[location]/[industryType]/[painType] 로 리다이렉트 (SEO·기존 링크 호환) */
export async function generateStaticParams() {
  const { getLandingSlugs } = await import("@/lib/seo-keywords");
  return getLandingSlugs();
}

export default async function LegacySlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kw = getLandingDataBySlug(slug);
  if (!kw) notFound();
  redirect(`/landing/${kw.locationId}/${kw.industryId}/${kw.painId}`);
}
