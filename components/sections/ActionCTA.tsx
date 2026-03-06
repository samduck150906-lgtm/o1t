import Link from "next/link";

export function ActionCTA() {
  return (
    <section
      className="-mx-3 sm:-mx-4 bg-white px-4 py-12 sm:py-16"
      aria-labelledby="action-cta-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="action-cta-heading"
          className="text-xl font-bold text-foreground sm:text-2xl"
        >
          지금 바로 시작하세요
        </h2>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          5분이면 충분합니다. 무료로 진단받고 나에게 맞는 플랜을 찾아보세요.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/pricing"
            className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-base font-medium text-foreground transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 break-keep"
            aria-label="가격 페이지 보기"
          >
            <span aria-hidden>💳</span>
            가격 보기
          </Link>
          <Link
            href="/diagnosis"
            className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-medium text-white shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 break-keep"
            aria-label="무료진단 시작하기"
          >
            <span aria-hidden>🔍</span>
            무료진단
          </Link>
          <Link
            href="/signup"
            className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-base font-medium text-white shadow-md shadow-navy/20 transition-colors hover:bg-navy/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 break-keep"
            aria-label="원툴러 신청하기"
          >
            <span aria-hidden>🚀</span>
            신청하기
          </Link>
        </div>
      </div>
    </section>
  );
}
