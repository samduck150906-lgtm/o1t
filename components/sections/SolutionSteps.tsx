const steps = [
  {
    step: 1,
    title: "예약 자동화",
    description: "전화·카톡·앱 예약을 한 캘린더에 모아 실시간 반영하고, 결제와 연동해 확정까지 자동화합니다.",
  },
  {
    step: 2,
    title: "CRM 자동 생성",
    description: "카톡·문자 대화를 복붙하면 AI가 이름·연락처·예약일시를 추출해 고객 명단에 자동 정리합니다.",
  },
  {
    step: 3,
    title: "운영 통합",
    description: "대시보드에서 예약·고객·매출을 한눈에 보고, 알림과 리마인드를 설정해 놓치지 않습니다.",
  },
];

export function SolutionSteps() {
  return (
    <section className="bg-background px-4 py-12 sm:py-16 md:py-20" aria-labelledby="solution-steps-heading">
      <div className="mx-auto max-w-6xl">
        <h2 id="solution-steps-heading" className="text-center text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
          세 단계로 정리되는 운영
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-700">
          데이터 마이그레이션부터 채널 통합, 자동화, 최적화까지. 도입 후 바로 쓸 수 있습니다.
        </p>
        <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <article
              key={item.step}
              className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
              aria-labelledby={`step-${item.step}-title`}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white"
                aria-hidden
              >
                {item.step}
              </span>
              <h3 id={`step-${item.step}-title`} className="mt-6 text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-base text-gray-700 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
