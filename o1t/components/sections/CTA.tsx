import Link from "next/link";

export function CTA() {
  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-24"
      style={{ background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" }}
      aria-labelledby="cta-heading"
    >
      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white opacity-5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white opacity-5 blur-3xl" />
        <div className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        {/* 아이콘 */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>

        <h2
          id="cta-heading"
          className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl"
        >
          지금 바로 무료 진단받기
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-amber-100">
          이메일과 유입 경로만 알려주시면,
          <br className="hidden sm:block" />
          맞춤 도입 단계와 예상 효과를 안내해 드립니다.
        </p>

        {/* 체크리스트 */}
        <ul className="mx-auto mt-6 inline-flex flex-col items-start gap-2 text-amber-50" aria-label="무료 진단 혜택">
          {["진단 결과 즉시 확인", "맞춤 도입 플랜 제공", "부담 없는 무료 상담"].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm font-medium">
              <svg className="h-4 w-4 flex-shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        <Link
          href="/diagnosis"
          className="mt-8 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-white px-10 py-4 text-lg font-bold text-amber-600 shadow-xl hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-500 break-keep transition-all hover:-translate-y-0.5"
          aria-label="무료진단 시작하기"
        >
          무료진단 시작하기
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
