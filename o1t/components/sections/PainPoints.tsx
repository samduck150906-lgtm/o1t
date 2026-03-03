const points = [
  {
    title: "예약 관리가 여기저기 흩어져 있어요",
    description:
      "전화, 카톡, 예약 앱, 엑셀까지. 한곳에 모아두지 못해 이중 예약과 누락이 반복됩니다.",
    icon: "📅",
    color: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100",
  },
  {
    title: "고객 정보가 정리되지 않아요",
    description:
      "연락처와 이용 이력이 카톡·문자·수첩에 흩어져 있어 단골 관리와 재방문 유도가 어렵습니다.",
    icon: "👥",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
  },
  {
    title: "일정이 겹치고 혼란스러워요",
    description:
      "직원·강사·룸별 스케줄을 한눈에 보지 못해 겹침과 공실이 발생합니다.",
    icon: "🕐",
    color: "bg-yellow-50 border-yellow-200",
    iconBg: "bg-yellow-100",
  },
  {
    title: "수기 관리에 시간이 너무 들어요",
    description:
      "예약 확인, 리마인드, 정산을 손으로 하다 보니 밤늦게까지 일하게 됩니다.",
    icon: "✍️",
    color: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100",
  },
];

export function PainPoints() {
  return (
    <section
      className="bg-gray-50 px-4 py-16 sm:py-20 md:py-24"
      aria-labelledby="painpoints-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* 섹션 헤더 */}
        <div className="text-center">
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 mb-3">
            사장님 공통 고충
          </span>
          <h2
            id="painpoints-heading"
            className="text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl"
          >
            이런 상황, 지금도 반복되고 있나요?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500 md:text-lg">
            예약·고객·일정이 흩어져 있어 하루가 바쁘게만 느껴지시나요?
            <br className="hidden sm:block" />
            하나의 툴로 정리하면 됩니다.
          </p>
        </div>

        {/* 카드 그리드 */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => (
            <article
              key={index}
              className={`group rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${point.color}`}
              aria-labelledby={`painpoint-${index}`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${point.iconBg}`}
                aria-hidden
              >
                {point.icon}
              </div>
              <h3
                id={`painpoint-${index}`}
                className="mt-4 text-lg font-bold text-gray-900"
              >
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {point.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
