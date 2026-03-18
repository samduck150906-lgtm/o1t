import type { Metadata } from "next";
import Link from "next/link";
import { STATIC_SEO_MAP, getSiteUrl, SITE } from "@/lib/seo";
const seo = STATIC_SEO_MAP["consulting/sales"];
const base = getSiteUrl();

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: `${base}/consulting/sales` },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${base}/consulting/sales`,
    siteName: SITE.name,
    locale: "ko_KR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function ConsultingSalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 md:py-20">
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">매출 증대 AI 컨설팅</h1>
        <p className="mt-4 text-lg text-gray-700">{seo.description}</p>
        <ul className="mt-8 list-inside list-disc space-y-2 text-gray-700">
          <li>상담·예약 노쇼 방지 리마인드 설계</li>
          <li>AI 영업 대행(SDR)으로 리드 → 상담 전환 자동화</li>
          <li>유입 DB가 매출로 이어지는 파이프라인 구축</li>
        </ul>
        <Link
          href="/diagnosis"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-8 py-3 text-lg font-medium text-white hover:bg-primary/90"
        >
          도입 문의하기
        </Link>
      </div>
  );
}
