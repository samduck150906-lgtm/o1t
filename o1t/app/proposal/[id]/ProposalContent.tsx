"use client";

import { useEffect, useRef, useState } from "react";
import { Prospect, AutomationScenario } from "@/types/proposal";
import { AUTOMATION_SCENARIOS } from "@/lib/proposal-scenarios";

interface Props {
  prospect: Prospect;
}

function useIntersectionFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function FadeSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useIntersectionFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function ProposalContent({ prospect }: Props) {
  const [ctaClicked, setCtaClicked] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const scenarios: AutomationScenario[] =
    AUTOMATION_SCENARIOS[prospect.category] ??
    AUTOMATION_SCENARIOS["default"];

  const totalTimeSaved = scenarios.reduce((sum, s) => sum + s.timeSaved, 0);

  function handleCta() {
    const url = `/diagnosis?from=proposal&store=${encodeURIComponent(
      prospect.store_name
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setCtaClicked(true);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FB" }}>
      <div className="mx-auto max-w-[640px]">

        {/* ── 섹션 1: Hero ── */}
        <section
          className="relative overflow-hidden px-5 pb-10 pt-10"
          style={{
            background: "linear-gradient(160deg, #0052FF 0%, #002E99 100%)",
          }}
        >
          <div className="mb-5 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-white/80"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            OWNER ONE-TOOL &nbsp;·&nbsp; 맞춤 AI 자동화 제안서
          </div>

          <h1 className="text-[22px] font-bold leading-snug text-white sm:text-[26px]">
            <span className="block">{prospect.store_name} 대표님,</span>
            <span className="block mt-1">
              매일 반복하는 업무를{" "}
              <span style={{ color: "#7EB8FF" }}>AI로 자동화</span>하세요
            </span>
          </h1>

          <p className="mt-3 text-sm text-white/70">
            {prospect.category} 카테고리 · 리뷰 {prospect.review_count.toLocaleString()}개 스토어 분석 기반
          </p>

          <div
            className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full opacity-10"
            style={{ backgroundColor: "#7EB8FF" }}
            aria-hidden
          />
          <div
            className="absolute -top-10 -left-10 h-32 w-32 rounded-full opacity-10"
            style={{ backgroundColor: "#7EB8FF" }}
            aria-hidden
          />
        </section>

        <div className="px-4 pb-16 pt-6 space-y-5">

          {/* ── 섹션 2: 현재 예상 반복 작업 (Pain) ── */}
          <FadeSection>
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  현재 예상 반복 작업
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {prospect.category} 카테고리 월매출 {prospect.monthly_sales_tier} 스토어 기준 분석
                </p>
              </div>

              <div className="mx-5 mb-5 rounded-xl px-4 py-3" style={{ backgroundColor: "#FFF1F1" }}>
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <p className="text-sm font-semibold" style={{ color: "#D32F2F" }}>
                    매월 약 <span className="text-lg font-bold">{totalTimeSaved}시간</span>을 반복 작업에 소모 중
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {scenarios.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-4">
                    <span className="mt-0.5 text-xl">{s.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{s.pain}</p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        월 {s.timeSaved}시간 소요 추정
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeSection>

          {/* ── 섹션 3: 전환 표시 ── */}
          <FadeSection className="flex flex-col items-center py-2">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full shadow-md"
              style={{ backgroundColor: "#0052FF" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <path
                  d="M10 3v11M5 9l5 5 5-5"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="mt-2 text-sm font-semibold" style={{ color: "#0052FF" }}>
              AI 자동화 적용
            </p>
          </FadeSection>

          {/* ── 섹션 4: 자동화 적용 후 (Solution) ── */}
          <FadeSection>
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  자동화 적용 후 변화
                </p>
              </div>
              <div className="divide-y divide-gray-50 pb-2">
                {scenarios.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setActiveCard(activeCard === i ? null : i)
                    }
                    className={`w-full text-left px-5 py-4 transition-all duration-200 ${
                      activeCard === i
                        ? "bg-[#F0F7FF]"
                        : "hover:bg-gray-50/80"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-xl">{s.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {s.solution}
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span>⏱ 월 {s.timeSaved}시간 절약</span>
                          <span>💰 {s.monthlySaved}</span>
                        </div>
                      </div>
                      <span
                        className={`mt-0.5 h-4 w-4 shrink-0 rounded-full transition-all duration-200 ${
                          activeCard === i
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-75"
                        }`}
                        style={{ backgroundColor: "#0052FF" }}
                        aria-hidden
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </FadeSection>

          {/* ── 섹션 5: 총 절감 효과 카드 ── */}
          <FadeSection>
            <div
              className="rounded-2xl px-6 py-7 text-center text-white"
              style={{
                background: "linear-gradient(135deg, #0052FF 0%, #002E99 100%)",
              }}
            >
              <p className="text-sm font-medium text-white/70">예상 월간 절감 효과</p>
              <p className="mt-2 text-5xl font-bold tracking-tight">
                {totalTimeSaved}
                <span className="text-3xl">시간+</span>
              </p>
              <p className="mt-2 text-sm text-white/70">매월 반복 업무에서 해방</p>
            </div>
          </FadeSection>

          {/* ── 섹션 6: 맞춤 자동화 패키지 ── */}
          <FadeSection>
            <div
              className="rounded-2xl overflow-hidden bg-white"
              style={{ border: "2px solid #0052FF" }}
            >
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ backgroundColor: "#0052FF" }}
              >
                <p className="text-sm font-bold text-white">스마트스토어 AI 자동화 세팅</p>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                  추천 패키지
                </span>
              </div>

              <div className="px-5 pt-5 pb-2">
                <ul className="space-y-3">
                  {[
                    "GPT 기반 상품 설명 자동생성 시스템 구축",
                    "CS 자동응답 챗봇 세팅 (카카오톡/네이버톡톡)",
                    "리뷰 자동 응답 시스템 세팅",
                    "1주일 운영 지원 및 최적화",
                    "사용 매뉴얼 제공",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: "#0052FF" }}
                        fill="none"
                        viewBox="0 0 16 16"
                        aria-hidden
                      >
                        <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity=".25" />
                        <path
                          d="M5 8.5l2 2 4-4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-5 py-5 border-t border-gray-100 mt-4">
                <p className="text-3xl font-bold text-gray-900">200만원</p>
                <p className="mt-0.5 text-sm text-gray-400">VAT 별도 · 7일 세팅</p>
                <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2.5 text-xs text-gray-500">
                  계약금 50% 선입금 → 세팅 완료 후 잔금 50%
                </p>
              </div>
            </div>
          </FadeSection>

          {/* ── 섹션 7: 얼리어답터 혜택 ── */}
          <FadeSection>
            <div
              className="rounded-2xl px-5 py-6 text-white"
              style={{ backgroundColor: "#1a1a2e" }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    3월 한정 · 첫 5곳 특별가
                  </span>
                  <p className="mt-3 text-2xl font-bold">
                    <span className="line-through text-white/40 text-lg mr-2">200만원</span>
                    150만원
                  </p>
                  <p className="mt-1 text-sm text-white/60">25% 할인 적용</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-white/50">잔여</p>
                  <p className="text-2xl font-bold" style={{ color: "#7EB8FF" }}>3석</p>
                </div>
              </div>

              <div
                className="mt-5 rounded-xl px-4 py-3 flex items-center gap-2"
                style={{ backgroundColor: "rgba(126,184,255,0.12)" }}
              >
                <span className="text-base">🔒</span>
                <p className="text-sm text-white/80">
                  세팅 완료 후 만족하지 않으시면 <strong className="text-white">100% 환불</strong>
                </p>
              </div>
            </div>
          </FadeSection>

          {/* ── 섹션 8: CTA ── */}
          <FadeSection>
            <div
              className="rounded-2xl px-5 py-6"
              style={{ backgroundColor: "#1F2937" }}
            >
              <p className="text-lg font-bold text-white">무료 상담으로 시작하세요</p>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                {prospect.store_name} 스토어에 맞는 자동화 방안을 15분 무료 통화로 안내드립니다
              </p>

              <button
                type="button"
                onClick={handleCta}
                className="mt-5 w-full rounded-xl py-4 text-base font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                style={{
                  backgroundColor: ctaClicked ? "#16a34a" : "#0052FF",
                }}
              >
                {ctaClicked ? "✅ 신청 완료!" : "무료 상담 신청하기"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                부담 없이 편하게 신청하세요. 영업 전화 없습니다.
              </p>
            </div>
          </FadeSection>

          {/* ── 섹션 9: 미니 푸터 ── */}
          <FadeSection>
            <div className="pb-4 pt-2 text-center">
              <p className="text-xs font-medium text-gray-400">
                OWNER ONE-TOOL | ETERNAL SIX
              </p>
              <p className="mt-1 text-xs text-gray-400">AI 기반 업무 자동화 컨설팅</p>
            </div>
          </FadeSection>

        </div>
      </div>
    </div>
  );
}
