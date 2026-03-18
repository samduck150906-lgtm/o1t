import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLandingDataByParams,
  getLandingParamTriples,
  getMetaDescription,
  getSameIndustryOtherLocations,
  INDUSTRY_PAIN_COPY,
  type SeoKeyword,
} from "@/lib/seo-keywords";
import { FloatingDiagnosisCta } from "@/components/landing/FloatingDiagnosisCta";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://원툴러.kr").replace(
  /\/$/,
  ""
);
const BRAND = "ETERNAL SIX";

/** 랜딩 페이지가 받는 3개 props (params 기준) */
export type LandingPageParams = {
  location: string;
  industryType: string;
  painType: string;
};

export async function generateStaticParams() {
  return getLandingParamTriples();
}

function getMetaTitle(kw: SeoKeyword): string {
  return `${kw.location} ${kw.industry} 사장님을 위한 5분 만에 끝내는 예약 자동화`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<LandingPageParams>;
}): Promise<Metadata> {
  const { location, industryType, painType } = await params;
  const data = getLandingDataByParams(location, industryType, painType);
  if (!data) return { title: "페이지를 찾을 수 없습니다" };

  const title = getMetaTitle(data);
  const description =
    getMetaDescription(data.location, data.industry, data.industryCategory) ||
    `${data.location} ${data.industry} 사장님들의 고민인 ${data.painPoint}를 해결합니다.`;
  const canonical = `${SITE_URL}/landing/${location}/${industryType}/${painType}`;

  /** 네이버 SEO용 동적 OG 이미지 (페이지별 고유 이미지) */
  const ogImageUrl = `${canonical}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${BRAND}`,
      description,
      url: canonical,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${data.location} ${data.industry} ${data.title} | ${BRAND}`,
        },
      ],
    },
  };
}

function getThreeBenefits(kw: SeoKeyword) {
  return [
    {
      title: "한곳에서 관리",
      description: `예약·고객·일정을 하나의 플랫폼에서 관리해 ${kw.industry} 운영이 단순해집니다.`,
    },
    {
      title: kw.painEmphasis,
      description: `${kw.painCta}. 리마인드·확정 안내를 자동 발송해 수동 업무를 줄입니다.`,
    },
    {
      title: "맞춤 진단",
      description: `내 ${kw.industry}에 맞는 도입 단계와 예상 효과를 무료로 진단받을 수 있습니다.`,
    },
  ];
}

function buildSoftwareApplicationJsonLd(kw: SeoKeyword, canonical: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND,
    applicationCategory: "BusinessApplication",
    description: `${kw.location} ${kw.industry} 사장님을 위한 예약 자동화·${kw.title} 솔루션`,
    url: canonical,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<LandingPageParams>;
}) {
  const { location, industryType, painType } = await params;
  const kw = getLandingDataByParams(location, industryType, painType);
  if (!kw) notFound();

  const benefits = getThreeBenefits(kw);
  const canonical = `${SITE_URL}/landing/${location}/${industryType}/${painType}`;
  const softwareApplicationJsonLd = buildSoftwareApplicationJsonLd(kw, canonical);
  const industryPainCopy =
    INDUSTRY_PAIN_COPY[kw.industryId] ??
    `${kw.industry} 예약·고객 관리를 한곳에서 하고, 카톡 복붙만으로 자동 정리할 수 있습니다.`;

  const sameIndustryLinks = getSameIndustryOtherLocations(
    kw.industryId,
    `${location}-${industryType}-${painType}`
  ).slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
      <div className="mx-auto max-w-4xl px-4 pb-28 pt-16 md:pb-32 md:pt-20">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {kw.location} · {kw.industry} 전용
        </span>
        <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
          {getMetaTitle(kw)}
        </h1>

        <section
          className="mt-8 rounded-xl border border-gray-200 bg-gray-50/50 p-6"
          aria-labelledby="pain-section"
        >
          <h2 id="pain-section" className="text-lg font-semibold text-foreground">
            {kw.industry}에서 자주 묻는 고민
          </h2>
          <p className="mt-3 text-gray-700">{industryPainCopy}</p>
        </section>

        <p className="mt-6 text-sm text-gray-600">
          이미 {kw.location}의 <strong>{kw.usageCount}명</strong>의 사장님이 사용
          중입니다.
        </p>

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
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`내 ${kw.industry} 맞춤형 무료 진단받기`}
          >
            지금 {kw.industry} 사장님들이 가장 많이 놓치는 매출 포인트 3가지
            진단하기
          </Link>
        </div>

        {sameIndustryLinks.length > 0 && (
          <section
            className="mt-16 border-t border-gray-200 pt-12"
            aria-labelledby="other-locations-heading"
          >
            <h2
              id="other-locations-heading"
              className="text-lg font-semibold text-foreground"
            >
              다른 지역의 {kw.industry} 솔루션 보기
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {sameIndustryLinks.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={`/landing/${link.locationId}/${link.industryId}/${link.painId}`}
                    className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-primary hover:text-primary"
                  >
                    {link.location} {link.industry}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <FloatingDiagnosisCta industryName={kw.industry} />
    </>
  );
}
