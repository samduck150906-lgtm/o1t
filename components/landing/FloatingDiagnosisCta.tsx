"use client";

import Link from "next/link";

interface FloatingDiagnosisCtaProps {
  industryName: string;
}

/** 유입 후 전환: 무료 진단 플로팅 CTA - 검색 유입 사장님을 /diagnosis로 자연스럽게 유도 */
export function FloatingDiagnosisCta({ industryName }: FloatingDiagnosisCtaProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur-sm md:bottom-4 md:left-auto md:right-4 md:max-w-sm md:rounded-xl md:border md:py-4"
      role="complementary"
      aria-label="무료 예약 자동화 진단"
    >
      <p className="text-center text-sm font-medium text-foreground md:text-left">
        지금 {industryName} 사장님들이 가장 많이 놓치는 매출 포인트 3가지 진단하기
      </p>
      <Link
        href="/diagnosis"
        className="mt-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="우리 매장 예약 자동화 점수 확인하기"
      >
        우리 매장 예약 자동화 점수 확인하기
      </Link>
    </div>
  );
}
