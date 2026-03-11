import type { Metadata } from "next";
import Link from "next/link";
import { Bot, FileSpreadsheet, Mail, Zap } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xn--vl2b95y7ri.kr";

export const metadata: Metadata = {
  title: "자동화 솔루션 | 반복 업무 AI 자동화 | 원툴러",
  description:
    "콜드메일·콜드콜 노가다, 견적서·인보이스 수작업에서 벗어나세요. AI SDR·서류 자동 입력으로 직원 3명 몫을 시스템 하나로 끝내세요.",
  alternates: { canonical: `${SITE_URL}/solution/automation` },
  openGraph: {
    title: "자동화 솔루션 · 반복 업무 AI 자동화 | 원툴러",
    description:
      "잠재 고객 수집부터 개인화 제안서 발송, 서류 자동 입력까지. 인건비 절감이 즉시 계산되는 자동화 시스템.",
    url: `${SITE_URL}/solution/automation`,
    siteName: "원툴러",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "원툴러 자동화 솔루션" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "자동화 솔루션 | 원툴러",
    description: "AI SDR·서류 자동 입력으로 반복 업무를 시스템에 맡기세요.",
  },
};

const solutions = [
  {
    icon: Mail,
    title: "AI SDR (영업 대행 에이전트)",
    description:
      "잠재 고객 수집부터 개인화된 제안서 발송까지. 직원들이 하루 종일 리스트 뽑고 메일 보내느라 진이 빠지는 일을 시스템 하나로 끝냅니다.",
    target: "마케팅 대행사, 헤드헌팅, 분양 대행사",
  },
  {
    icon: FileSpreadsheet,
    title: "견적·인보이스 자동 입력",
    description:
      "매일 쏟아지는 주문서·영수증 타이핑으로 하루가 다 가고 실수도 잦다면, 이미지/PDF로 들어오는 서류를 AI가 1초 만에 읽어 엑셀·ERP에 자동 입력합니다.",
    target: "수출입 물류, 식자재 유통, 프랜차이즈 본사",
  },
  {
    icon: Bot,
    title: "예약·상담 운영 자동화",
    description:
      "전화·카톡·앱 예약을 한 캘린더에 모아 실시간 반영하고, 확정·리마인드까지 자동화해 놓친 예약 없이 운영합니다.",
    target: "오프라인 자영업 전 업종",
  },
];

export default function SolutionAutomationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy px-4 py-16 text-white sm:py-20 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
            자동화 솔루션
          </span>
          <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            반복 업무에
            <br />
            <span className="text-primary">직원 수명</span> 쓰고 계신가요?
          </h1>
          <p className="mt-4 text-lg text-gray-300 sm:text-xl">
            복잡한 제안서보다, 실제 데이터 기준으로 어떻게 자동화되는지 샘플로 보여드립니다.
          </p>
        </div>
      </section>

      {/* Solutions */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-bold text-foreground sm:text-2xl">
            업무별 자동화 패키지
          </h2>
          <div className="mt-10 space-y-8">
            {solutions.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="h-6 w-6" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{s.description}</p>
                    <p className="mt-2 text-sm font-medium text-primary">{s.target}</p>
                  </div>
                </div>
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
            귀사의 실제 데이터를 5분만 주시면, 어떻게 자동화되는지 샘플 영상으로 보내드립니다.
          </p>
          <Link
            href="/diagnosis?source=solution-automation"
            className="mt-6 inline-flex min-h-touch items-center justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-navy"
          >
            무료 자동화 진단 받기
          </Link>
        </div>
      </section>
    </div>
  );
}
