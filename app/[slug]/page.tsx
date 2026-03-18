import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDynamicSlugs, getDynamicSeo, getSiteUrl, SITE } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllDynamicSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const seo = getDynamicSeo(params.slug);
  if (!seo) notFound();
  const base = getSiteUrl();
  const ogImage = `${base}/og-image.jpg`;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: seo.canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      siteName: SITE.name,
      locale: "ko_KR",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default function ProgrammaticSeoPage({ params }: { params: { slug: string } }) {
  const seo = getDynamicSeo(params.slug);
  if (!seo) notFound();

  const { region, industry, h1, kwText, kwDesc, description } = seo;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="border-b border-gray-200 bg-white px-6 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-bold text-primary">
            {region} 지역 {industry} 사장님을 위한 {kwText}
          </p>
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            {h1}
          </h1>
          <p className="mb-4 text-lg text-gray-600">{description}</p>
          <p className="mb-10 text-base text-gray-600">{kwDesc}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/diagnosis"
              className="rounded-xl bg-primary px-8 py-4 font-bold text-white transition-colors hover:bg-primary/90"
            >
              무료 진단받기
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border-2 border-gray-200 bg-white px-8 py-4 font-bold text-gray-800 transition-colors hover:bg-gray-50"
            >
              요금제 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="mb-10 text-center text-2xl font-bold">
          {industry} 운영, 이런 점이 가장 힘드시죠?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="mb-3 text-xl font-bold">흩어진 예약 채널</h3>
            <p className="text-gray-600">
              전화, 카톡, 예약앱까지. 한곳에 모이지 않아 {industry} 이중 예약이나 누락이 자주 발생합니다.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="mb-3 text-xl font-bold">노쇼·무응답</h3>
            <p className="text-gray-600">
              예약 당일 연락 두절. 리마인드와 {kwText}로 방어하세요.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="mb-3 text-xl font-bold">수기·엑셀 관리</h3>
            <p className="text-gray-600">
              원툴러로 CRM 자동 정리 — 복붙과 야근을 줄이세요.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-primary px-6 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
            지금 바로 {region} {industry} 맞춤 자동화를 시작하세요
          </h2>
          <p className="mb-10 text-lg opacity-90">
            도입 문의부터 세팅까지 빠르게 지원합니다.
          </p>
          <Link
            href="/diagnosis"
            className="inline-block rounded-xl bg-white px-10 py-4 text-lg font-bold text-primary transition-colors hover:bg-gray-100"
          >
            우리 매장 무료 진단하기
          </Link>
        </div>
      </section>
    </main>
  );
}
