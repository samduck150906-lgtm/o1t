const industries = [
  {
    icon: "🎉",
    name: "파티룸",
    hook: "룸별 예약·입금 확인, 자동 리마인드까지",
  },
  {
    icon: "📚",
    name: "스터디카페",
    hook: "좌석·시간권 관리 한 화면에서",
  },
  {
    icon: "🧘",
    name: "필라테스·요가",
    hook: "강사별 수강생·출석 완전 자동화",
  },
  {
    icon: "✂️",
    name: "미용실·네일",
    hook: "예약·리마인드 알림 자동 발송",
  },
  {
    icon: "🐶",
    name: "펫샵·동물병원",
    hook: "반려동물 이력·예약 통합 관리",
  },
  {
    icon: "🏋️",
    name: "PT·헬스장",
    hook: "회원권·출석·상담 한번에",
  },
  {
    icon: "🍽️",
    name: "식당·카페",
    hook: "테이블 예약·대기 알림 자동화",
  },
  {
    icon: "🏠",
    name: "공간 대여",
    hook: "시간대별 공간 예약 충돌 방지",
  },
  {
    icon: "🎓",
    name: "학원·과외",
    hook: "수강생 관리·수업료 정산 간편하게",
  },
];

export function IndustryHook() {
  return (
    <section
      className="-mx-3 sm:-mx-4 bg-white px-4 py-14 sm:py-20"
      aria-labelledby="industry-hook-heading"
    >
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
          업종별 맞춤 제공
        </span>
        <h2
          id="industry-hook-heading"
          className="mt-4 text-2xl font-bold leading-snug text-foreground sm:text-3xl"
        >
          이런 편리함이,
          <br />
          <span className="text-primary">사장님 업종에 딱 맞게</span> 제공됩니다
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600 leading-relaxed">
          파티룸부터 학원까지—어떤 업종이든 원툴러 하나로
          <br className="hidden sm:block" />
          복잡한 운영을 단순하게 만들 수 있습니다.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-9 sm:gap-4">
          {industries.map((ind, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm sm:p-5"
            >
              <span className="block text-3xl sm:text-4xl" aria-hidden>
                {ind.icon}
              </span>
              <p className="mt-2 text-sm font-bold text-gray-800 break-keep">{ind.name}</p>
              <p className="mt-1 hidden text-xs text-gray-500 leading-relaxed lg:block">
                {ind.hook}
              </p>
            </div>
          ))}
        </div>

        {/* 업종 훅 텍스트 (모바일/중간 화면용 대체) */}
        <div className="mt-8 lg:hidden grid grid-cols-1 gap-2 sm:grid-cols-3">
          {industries.map((ind, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3 text-left"
            >
              <span className="text-xl" aria-hidden>{ind.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{ind.name}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{ind.hook}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
