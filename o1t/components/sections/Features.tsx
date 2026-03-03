const features = [
  {
    title: "통합 대시보드",
    description:
      "예약 현황, 오늘의 고객, 매출 요약을 한 화면에서 확인합니다. 지점이 여러 개여도 한곳에서 관리할 수 있습니다.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    badge: "핵심",
  },
  {
    title: "고객 관리",
    description:
      "고객별 연락처, 이용 이력, 메모를 한곳에 저장합니다. 카톡 복붙만으로 AI가 자동 추출해 명단에 넣어줍니다.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    badge: "AI",
  },
  {
    title: "일정 관리",
    description:
      "룸·강사·직원별 캘린더를 통합해 예약 가능 시간을 명확히 합니다. 청소·준비 시간도 반영할 수 있습니다.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    badge: null,
  },
  {
    title: "자동 알림",
    description:
      "예약 확정·리마인드·리콜을 자동 발송해 노쇼를 줄이고, 사장님은 중요한 일에만 집중할 수 있습니다.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    badge: "자동화",
  },
];

export function Features() {
  return (
    <section
      className="bg-amber-50 px-4 py-16 sm:py-20 md:py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* 섹션 헤더 */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-white border border-amber-200 px-3 py-1 text-sm font-semibold text-amber-700 mb-3">
            주요 기능
          </span>
          <h2
            id="features-heading"
            className="text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl"
          >
            네 가지 핵심 기능
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 md:text-lg">
            예약·고객·일정·알림을 하나의 플랫폼에서 처리합니다.
          </p>
        </div>

        {/* 피처 카드 그리드 */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={index}
              className="group relative rounded-2xl border border-white bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200"
              aria-labelledby={`feature-${index}`}
            >
              {feature.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                  {feature.badge}
                </span>
              )}

              {/* 아이콘 */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-100 transition-transform group-hover:scale-105">
                {feature.icon}
              </div>

              <h3
                id={`feature-${index}`}
                className="mt-5 text-lg font-bold text-gray-900"
              >
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
