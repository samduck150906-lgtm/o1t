import type { Metadata } from "next";
import Link from "next/link";
import { DashboardRedirectBanner } from "./DashboardRedirectBanner";

import { PRICING_PAGE_SEO } from "@/lib/seo-pricing";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://원툴러.kr").replace(
  /\/$/,
  ""
);
const pricingSeo = PRICING_PAGE_SEO;

export const metadata: Metadata = {
  title: pricingSeo.title,
  description: `${pricingSeo.description} Starter 29,000원, Pro 59,000원, Enterprise 별도 문의. 14일 무료 체험.`,
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: pricingSeo.title,
    description: pricingSeo.description,
    url: `${SITE_URL}/pricing`,
  },
};

const plans = [
  {
    name: "Starter",
    target: "1인 매장, 초기 창업자",
    price: "29,000",
    period: "월",
    features: [
      "통합 캘린더 2개",
      "기본 고객관리 500명",
      "이메일 지원",
    ],
    cta: "무료 진단",
    ctaHref: "/diagnosis",
    ctaAria: "무료 진단받기",
    badge: null,
  },
  {
    name: "Pro",
    target: "직원 있는 중소형 매장",
    price: "59,000",
    period: "월",
    features: [
      "무제한 캘린더",
      "무제한 고객",
      "알림톡 자동발송",
      "매출분석 대시보드",
    ],
    cta: "무료 진단",
    ctaHref: "/diagnosis",
    ctaAria: "무료 진단받기",
    badge: "가장 많이 선택하는 플랜",
  },
  {
    name: "Enterprise",
    target: "다중 지점, 프랜차이즈",
    price: "별도 문의",
    period: "",
    features: [
      "다중 지점 통합",
      "직원별 권한",
      "전담 매니저",
      "커스텀 API",
    ],
    cta: "도입 문의하기",
    ctaHref: "/diagnosis",
    ctaAria: "도입 문의하기",
    badge: null,
  },
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-20">
      {params.redirect === "dashboard" && <DashboardRedirectBanner />}
      <h1 className="text-center text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">가격</h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-700 md:text-lg">
        14일 무료 체험 후 유료 전환. 약정 없이 언제든 해지 가능합니다.
      </p>
      <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative rounded-2xl border p-6 sm:p-8 ${
              plan.badge ? "border-primary bg-primary/5 shadow-lg" : "border-gray-200 bg-white"
            }`}
            aria-labelledby={`plan-${plan.name}`}
          >
            {plan.badge && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white"
                aria-hidden
              >
                {plan.badge}
              </span>
            )}
            <h2 id={`plan-${plan.name}`} className="text-2xl font-bold text-foreground">
              {plan.name}
            </h2>
            <p className="mt-1 text-base text-gray-700">{plan.target}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              {plan.period && <span className="text-base text-gray-700">원/{plan.period}</span>}
            </p>
            <ul className="mt-6 space-y-3" role="list">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-base text-gray-700">
                  <span className="text-primary" aria-hidden>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.ctaHref}
              className={`mt-8 flex min-touch w-full items-center justify-center rounded-xl px-4 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                plan.badge
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "border-2 border-gray-300 bg-white text-foreground hover:bg-gray-50"
              }`}
              aria-label={plan.ctaAria}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
