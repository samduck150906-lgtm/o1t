import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://원툴러.kr").replace(
  /\/$/,
  ""
);

export const metadata: Metadata = {
  title: "솔루션 소개",
  description:
    "원툴러 도입 4단계: 데이터 마이그레이션, 채널 통합, 자동화, 최적화. 기존 예약·고객 데이터를 한곳에 모아 운영을 단순화합니다.",
  alternates: { canonical: `${SITE_URL}/solution` },
  openGraph: {
    title: "솔루션 소개 | 원툴러",
    description: "도입 4단계로 예약·고객·일정을 하나로 통합합니다.",
    url: `${SITE_URL}/solution`,
  },
};

const steps = [
  {
    title: "데이터 마이그레이션",
    description:
      "엑셀·기존 예약 앱에 있는 고객·예약 데이터를 업로드하면 1분 만에 통합됩니다. 수작업 정리 없이 바로 사용할 수 있습니다.",
  },
  {
    title: "채널 통합",
    description:
      "전화·카톡·문자·앱으로 들어오는 예약을 한 캘린더에 모읍니다. 채널별로 따로 확인할 필요 없이 실시간으로 반영됩니다.",
  },
  {
    title: "자동화",
    description:
      "예약 확정·리마인드·결제 안내를 자동 발송하고, 카톡 복붙만으로 고객 정보를 AI가 추출해 명단에 넣어줍니다.",
  },
  {
    title: "최적화",
    description:
      "대시보드에서 매출·예약률·노쇼 현황을 보고, 알림·요금 설정을 조정해 운영 효율을 높입니다.",
  },
];

export default function SolutionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">솔루션 소개</h1>
      <p className="mt-4 text-base text-gray-600 sm:text-lg">
        원툴러은 데이터 마이그레이션부터 채널 통합, 자동화, 최적화까지 네 단계로 도입됩니다.
      </p>
      <ol className="mt-12 space-y-8 sm:space-y-10" role="list">
        {steps.map((step, index) => (
          <li key={index} className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-white"
              aria-hidden
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-foreground sm:text-xl">{step.title}</h2>
              <p className="mt-2 text-gray-600 text-base sm:text-[1em]">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-16 text-center">
        <Link
          href="/diagnosis"
          className="inline-flex min-touch items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="무료 진단 받기"
        >
          무료 진단 받기
        </Link>
      </div>
    </div>
  );
}
