import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, MessageCircle, CalendarCheck, Zap } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xn--vl2b95y7ri.kr";

export const metadata: Metadata = {
  title: "자영업자 온라인솔루션 | 수익 증대 | 원툴러",
  description:
    "광고비는 쓰는데 상담 노쇼로 고통받는 사장님을 위한 AI 예약 확정·리마인드 자동화. 상담 전환율을 올리고 수익을 높입니다.",
  alternates: { canonical: `${SITE_URL}/solution/online` },
  openGraph: {
    title: "자영업자 온라인솔루션 · 수익 증대 | 원툴러",
    description:
      "광고 유입을 상담으로 연결하는 AI 예약 확정 봇. 노쇼 방지 리마인드로 상담 전환율 30% 이상 향상.",
    url: `${SITE_URL}/solution/online`,
    siteName: "원툴러",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "원툴러 수익증대 솔루션" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "자영업자 온라인솔루션 · 수익 증대 | 원툴러",
    description: "광고 유입을 상담으로 연결하는 AI 예약 확정·노쇼 방지 자동화.",
  },
};

const benefits = [
  {
    icon: MessageCircle,
    title: "AI 예약 확정 봇",
    description:
      "고객 유입 즉시 카톡/전화로 응대해 방문 확약을 받습니다. 상담 예약 잡아놓고 안 오는 절반 문제를 해결합니다.",
  },
  {
    icon: CalendarCheck,
    title: "노쇼 방지 리마인드",
    description:
      "예약 전 자동 리마인드 발송으로 노쇼를 줄이고, 상담 전환율을 30% 이상 올릴 수 있습니다.",
  },
  {
    icon: TrendingUp,
    title: "광고비 대비 전환 극대화",
    description:
      "이미 쓰고 있는 광고비를 아끼는 게 아니라, 유입된 DB가 상담까지 이어지도록 자동화해 수익을 높입니다.",
  },
];

const targetIndustries = [
  "성형외과·치과",
  "대형 헬스장·PT샵",
  "법률 사무소",
  "인테리어 업체",
];

export default function SolutionOnlinePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy px-4 py-16 text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
            수익 증대
          </span>
          <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            광고비는 쓰는데
            <br />
            <span className="text-primary">상담 노쇼</span>로 고통받고 계신가요?
          </h1>
          <p className="mt-4 text-lg text-gray-300 sm:text-xl">
            유입된 DB가 상담까지 이어지지 않고 증발하는 분들을 위한 AI 예약 확정·리마인드 자동화
          </p>
        </div>
      </section>

      {/* Pain → Solution */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-bold text-foreground sm:text-2xl">
            이런 업종에 특히 효과적입니다
          </h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {targetIndustries.map((name) => (
              <li
                key={name}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-foreground dark:border-gray-700 dark:bg-gray-800"
              >
                {name}
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{b.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-navy px-6 py-10 text-center text-white sm:px-8 sm:py-12">
          <Zap className="mx-auto h-10 w-10 text-primary" aria-hidden />
          <p className="mt-4 text-lg font-medium sm:text-xl">
            고객 유입 즉시 AI가 응대해 방문 확약을 받고, 노쇼 방지 리마인드까지 자동화해 드립니다.
          </p>
          <Link
            href="/diagnosis?source=solution-online"
            className="mt-6 inline-flex min-h-touch items-center justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-navy"
          >
            무료 자동화 진단 받기
          </Link>
        </div>
      </section>
    </div>
  );
}
