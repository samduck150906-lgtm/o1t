import type { Metadata } from "next";
import Link from "next/link";
import { STATIC_SEO_MAP, getSiteUrl, SITE } from "@/lib/seo";
const seo = STATIC_SEO_MAP["consulting/automation"];
const base = getSiteUrl();

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: `${base}/consulting/automation` },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${base}/consulting/automation`,
    siteName: SITE.name,
    locale: "ko_KR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function ConsultingAutomationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 md:py-20">
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">업무 자동화 컨설팅</h1>
        <p className="mt-4 text-lg text-gray-700">{seo.description}</p>
        <ul className="mt-8 list-inside list-disc space-y-2 text-gray-700">
          <li>견적서·인보이스 등 반복 입력 업무 자동화</li>
          <li>AI 기반 문서 생성·정리 파이프라인 설계</li>
          <li>기업 규모에 맞춘 업무 프로세스 재설계</li>
        </ul>
        <Link
          href="/diagnosis"
          className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-8 py-3 text-lg font-medium text-white hover:bg-primary/90"
        >
          견적·문의하기
        </Link>
      </div>
  );
}
