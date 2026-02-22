const points = [
  {
    title: "예약 관리가 여기저기 흩어져 있어요",
    description: "전화, 카톡, 예약 앱, 엑셀까지. 한곳에 모아두지 못해 이중 예약과 누락이 반복됩니다.",
    icon: "📅",
  },
  {
    title: "고객 정보가 정리되지 않아요",
    description: "연락처와 이용 이력이 카톡·문자·수첩에 흩어져 있어 단골 관리와 재방문 유도가 어렵습니다.",
    icon: "👥",
  },
  {
    title: "일정이 겹치고 혼란스러워요",
    description: "직원·강사·룸별 스케줄을 한눈에 보지 못해 겹침과 공실이 발생합니다.",
    icon: "🕐",
  },
  {
    title: "수기 관리에 시간이 너무 들어요",
    description: "예약 확인, 리마인드, 정산을 손으로 하다 보니 밤늦게까지 일하게 됩니다.",
    icon: "✍️",
  },
];

export function PainPoints() {
  return (
    <section className="bg-white px-4 py-12 sm:py-16 md:py-20" aria-labelledby="painpoints-heading">
      <div className="mx-auto max-w-6xl">
        <h2 id="painpoints-heading" className="text-center text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
          사장님들이 가장 많이 겪는 고충
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-700">
          예약·고객·일정이 흩어져 있어 하루가 바쁘게만 느껴지시나요? 하나의 툴로 정리하면 됩니다.
        </p>
        <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => (
            <article
              key={index}
              className="rounded-xl border border-gray-200 bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              aria-labelledby={`painpoint-${index}`}
            >
              <span className="text-3xl" aria-hidden>
                {point.icon}
              </span>
              <h3 id={`painpoint-${index}`} className="mt-4 text-xl font-semibold text-foreground">
                {point.title}
              </h3>
              <p className="mt-2 text-base text-gray-700 leading-relaxed">{point.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
