import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-background px-4 py-12 sm:py-16 md:py-24 lg:py-32"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h1 id="hero-heading" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          엑셀·카톡·예약앱 따로 쓰지 마세요.
          <br />
          <span className="text-primary">OWNER ONE-TOOL</span> 하나면 끝.
        </h1>
        <p className="mt-6 text-body-lg text-gray-700 md:text-xl leading-relaxed">
          사장님을 위한 단 하나의 운영툴. 예약·고객·일정을 하나로 통합하고, 카톡 복붙만으로 고객 명단을 자동 정리합니다.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/diagnosis"
            className="min-touch inline-flex w-full items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto break-keep"
            aria-label="무료진단 시작하기"
          >
            무료진단 시작하기
          </Link>
          <Link
            href="/pricing"
            className="min-touch inline-flex w-full items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-medium text-foreground hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto break-keep"
            aria-label="가격보기"
          >
            가격보기
          </Link>
        </div>
      </div>
    </section>
  );
}
