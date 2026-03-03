const steps = [
  {
    step: 1,
    title: "예약 자동화",
    description:
      "전화·카톡·앱 예약을 한 캘린더에 모아 실시간 반영하고, 결제와 연동해 확정까지 자동화합니다.",
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "CRM 자동 생성",
    description:
      "카톡·문자 대화를 복붙하면 AI가 이름·연락처·예약일시를 추출해 고객 명단에 자동 정리합니다.",
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "운영 통합",
    description:
      "대시보드에서 예약·고객·매출을 한눈에 보고, 알림과 리마인드를 설정해 놓치지 않습니다.",
    icon: (
      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export function SolutionSteps() {
  return (
    <section
      className="bg-white px-4 py-16 sm:py-20 md:py-24"
      aria-labelledby="solution-steps-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* 섹션 헤더 */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 mb-3">
            도입 프로세스
          </span>
          <h2
            id="solution-steps-heading"
            className="text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl"
          >
            세 단계로 정리되는 운영
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 md:text-lg">
            데이터 마이그레이션부터 채널 통합, 자동화까지. 도입 후 바로 쓸 수 있습니다.
          </p>
        </div>

        {/* 스텝 카드 */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((item, idx) => (
            <article
              key={item.step}
              className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200"
              aria-labelledby={`step-${item.step}-title`}
            >
              {/* 스텝 번호 + 아이콘 */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 shadow-md shadow-amber-200">
                  {item.icon}
                </div>
                <span className="text-4xl font-black text-gray-100">
                  {String(item.step).padStart(2, "0")}
                </span>
              </div>

              <h3
                id={`step-${item.step}-title`}
                className="mt-5 text-xl font-bold text-gray-900"
              >
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                {item.description}
              </p>

              {/* 화살표 연결선 (마지막 제외) */}
              {idx < steps.length - 1 && (
                <div
                  className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 md:block"
                  aria-hidden
                >
                  <svg className="h-8 w-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
