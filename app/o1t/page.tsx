import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://원툴러.kr").replace(
  /\/$/,
  ""
);

export const metadata: Metadata = {
  title: "제품 상세",
  description:
    "원툴러 제품 상세: 통합 대시보드, CRM, 예약 자동화. 예약·고객·일정을 한곳에서 관리하고 카톡 복붙으로 고객 명단을 자동 정리합니다.",
  alternates: { canonical: `${SITE_URL}/o1t` },
  openGraph: {
    title: "제품 상세 | 원툴러",
    description: "대시보드, CRM, 예약 자동화 기능 상세.",
    url: `${SITE_URL}/o1t`,
  },
};

const features = [
  {
    title: "통합 대시보드",
    description:
      "예약 현황, 오늘의 고객, 매출 요약을 한 화면에서 확인합니다. 지점·강사·룸별로 필터링해 볼 수 있고, 노쇼·취소 추이도 한눈에 파악할 수 있습니다.",
  },
  {
    title: "CRM",
    description:
      "고객별 연락처, 이용 이력, 메모를 한곳에 저장합니다. 카톡·문자 대화를 복붙하면 AI가 이름·연락처·예약일시를 추출해 명단에 자동 등록해 줍니다. 단골·재방문 고객 관리와 프로모션 발송에 활용할 수 있습니다.",
  },
  {
    title: "예약 자동화",
    description:
      "전화·카톡·앱 예약을 한 캘린더에 모아 실시간 반영합니다. 결제와 연동해 확정·리마인드·취소 정책 안내를 자동 발송해 노쇼를 줄이고, 24시간 무인 예약도 가능합니다.",
  },
];

export default function O1tPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
      <h1 className="text-3xl font-bold text-foreground md:text-4xl">제품 상세</h1>
      <p className="mt-4 text-lg text-gray-600">
        원툴러의 대시보드, CRM, 예약 자동화 기능을 소개합니다.
      </p>
      <div className="mt-12 space-y-12">
        {features.map((feature, index) => (
          <section key={index} aria-labelledby={`o1t-feature-${index}`}>
            <h2 id={`o1t-feature-${index}`} className="text-2xl font-semibold text-foreground">
              {feature.title}
            </h2>
            <p className="mt-4 text-gray-600">{feature.description}</p>
          </section>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link
          href="/diagnosis"
          className="inline-flex min-touch items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="내 업종 맞춤형 무료 진단받기"
        >
          내 업종 맞춤형 무료 진단받기
        </Link>
      </div>
    </div>
  );
}
