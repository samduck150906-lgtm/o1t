import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { landingKeywords } from "@/lib/seo-keywords";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owneronetool.com";

export async function generateStaticParams() {
  return landingKeywords.map((kw) => ({ slug: kw.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kw = landingKeywords.find((k) => k.slug === slug);
  if (!kw) return { title: "페이지를 찾을 수 없습니다" };
  const title = kw.title;
  const description = `${kw.industry} ${kw.title}. ${kw.painPoint.slice(0, 80)}… ${kw.benefit}`;
  const canonical = `${SITE_URL}/landing/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | OWNER ONE-TOOL`,
      description,
      url: canonical,
    },
  };
}

function getThreeBenefits(kw: (typeof landingKeywords)[0]) {
  return [
    { title: "한곳에서 관리", description: `예약·고객·일정을 하나의 플랫폼에서 관리해 ${kw.industry} 운영이 단순해집니다.` },
    { title: "자동화로 시간 절약", description: `리마인드·확정 안내를 자동 발송해 수동 업무를 줄이고, ${kw.benefit}` },
    { title: "맞춤 진단", description: `내 ${kw.industry}에 맞는 도입 단계와 예상 효과를 무료로 진단받을 수 있습니다.` },
  ];
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kw = landingKeywords.find((k) => k.slug === slug);
  if (!kw) notFound();

  const benefits = getThreeBenefits(kw);
  const canonical = `${SITE_URL}/landing/${slug}`;
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: kw.title,
    description: `${kw.industry} ${kw.title}. ${kw.painPoint} ${kw.benefit}`,
    url: canonical,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {kw.industry} 전용 솔루션
        </span>
        <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">{kw.title}</h1>
        <p className="mt-6 text-lg text-gray-600">{kw.painPoint}</p>
        <p className="mt-4 font-medium text-foreground">{kw.benefit}</p>

        <section className="mt-12 space-y-8" aria-labelledby="changes-heading">
          <h2 id="changes-heading" className="text-xl font-semibold text-foreground">
            도입 후 달라지는 점
          </h2>
          {benefits.map((b, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-foreground">{b.title}</h3>
              <p className="mt-2 text-gray-600">{b.description}</p>
            </div>
          ))}
        </section>

        <div className="mt-16 text-center">
          <Link
            href="/diagnosis"
            className="inline-flex min-touch items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`내 ${kw.industry} 맞춤형 무료 진단받기`}
          >
            내 {kw.industry} 맞춤형 무료 진단받기
          </Link>
        </div>
      </div>
    </>
  );
}
