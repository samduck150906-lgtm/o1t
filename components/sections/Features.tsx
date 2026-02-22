const features = [
  {
    title: "통합 대시보드",
    description: "예약 현황, 오늘의 고객, 매출 요약을 한 화면에서 확인합니다. 지점이 여러 개여도 한곳에서 관리할 수 있습니다.",
  },
  {
    title: "고객 관리",
    description: "고객별 연락처, 이용 이력, 메모를 한곳에 저장합니다. 카톡 복붙만으로 AI가 자동 추출해 명단에 넣어줍니다.",
  },
  {
    title: "일정 관리",
    description: "룸·강사·직원별 캘린더를 통합해 예약 가능 시간을 명확히 합니다. 청소·준비 시간도 반영할 수 있습니다.",
  },
  {
    title: "자동 알림",
    description: "예약 확정·리마인드·리콜을 자동 발송해 노쇼를 줄이고, 사장님은 중요한 일에만 집중할 수 있습니다.",
  },
];

export function Features() {
  return (
    <section className="bg-white px-4 py-12 sm:py-16 md:py-20" aria-labelledby="features-heading">
      <div className="mx-auto max-w-6xl">
        <h2 id="features-heading" className="text-center text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
          네 가지 핵심 기능
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-700">
          예약·고객·일정·알림을 하나의 플랫폼에서 처리합니다.
        </p>
        <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={index}
              className="rounded-xl border border-gray-200 bg-background p-6"
              aria-labelledby={`feature-${index}`}
            >
              <h3 id={`feature-${index}`} className="text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-base text-gray-700 leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
