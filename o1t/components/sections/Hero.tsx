import Link from "next/link";

const stats = [
  { value: "무료", label: "지금 바로 시작" },
  { value: "3분", label: "도입 소요 시간" },
  { value: "노쇼↓", label: "자동 리마인드" },
];

const pills = ["✅ 예약 자동화", "✅ AI 고객 정리", "✅ 통합 대시보드"];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:py-24 md:py-32"
      style={{ background: "linear-gradient(160deg, #FFFBEB 0%, #FEF9EE 55%, #ffffff 100%)" }}
      aria-labelledby="hero-heading"
    >
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-48 -right-36 h-96 w-96 rounded-full bg-amber-200 opacity-30 blur-3xl" />
        <div className="absolute -bottom-48 -left-36 h-96 w-96 rounded-full bg-amber-100 opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50 opacity-60 blur-2xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* 상단 배지 */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-1.5 text-sm font-semibold text-amber-700 shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" aria-hidden />
          지금 베타 무료 서비스 중
        </div>

        <h1
          id="hero-heading"
          className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl"
        >
          엑셀·카톡·예약앱 따로 쓰지 마세요.
          <br />
          <span className="relative inline-block">
            <span className="relative z-10 text-amber-500">원툴러</span>
            <span
              className="absolute bottom-1 left-0 -z-0 h-3 w-full rounded bg-amber-100 sm:h-4"
              aria-hidden
            />
          </span>{" "}
          하나면 끝.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
          사장님을 위한 단 하나의 운영툴.
          <br className="hidden sm:block" />
          예약·고객·일정을 하나로 통합하고, 카톡 복붙만으로 고객 명단을 자동 정리합니다.
        </p>

        {/* 기능 pill 목록 */}
        <div className="mt-8 flex flex-wrap justify-center gap-2" aria-label="주요 기능">
          {pills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-amber-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm"
            >
              {pill}
            </span>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/diagnosis"
            className="min-touch inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-amber-200 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:w-auto break-keep transition-all hover:-translate-y-0.5"
            aria-label="무료진단 시작하기"
          >
            무료진단 시작하기
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/pricing"
            className="min-touch inline-flex w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-amber-300 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 sm:w-auto break-keep transition-all"
            aria-label="가격보기"
          >
            가격보기
          </Link>
        </div>

        {/* 통계 바 */}
        <div className="mx-auto mt-14 grid max-w-sm grid-cols-3 gap-6 sm:max-w-md">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-extrabold text-gray-900 sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
