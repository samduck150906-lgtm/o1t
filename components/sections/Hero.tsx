import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-background px-4 py-10 sm:py-14 md:py-20 lg:py-24"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h1 id="hero-heading" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
          엑셀·카톡·예약앱 따로 쓰지 마세요.
          <br />
          <span className="text-primary">원툴러</span> 하나면 끝.
        </h1>
        <p className="mt-4 text-base text-gray-700 sm:mt-5 sm:text-lg md:text-xl leading-relaxed">
          사장님을 위한 단 하나의 운영툴. 예약·고객·일정을 하나로 통합하고, 카톡 복붙만으로 고객 명단을 자동 정리합니다.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/diagnosis"
            className="min-h-[48px] inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-base font-medium text-white hover:bg-primary/90 active:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto break-keep"
            aria-label="무료진단 시작하기"
          >
            무료진단
          </Link>
          <Link
            href="/demo"
            className="min-h-[48px] inline-flex w-full items-center justify-center rounded-xl border-2 border-primary bg-white px-6 py-3.5 text-base font-medium text-primary hover:bg-blue-50 active:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto break-keep"
            aria-label="ERP 데모 미리보기"
          >
            👀 ERP 데모 보기
          </Link>
          <Link
            href="/pricing"
            className="min-h-[48px] inline-flex w-full items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-6 py-3.5 text-base font-medium text-foreground hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto break-keep"
            aria-label="가격보기"
          >
            가격
          </Link>
        </div>
      </div>
    </section>
  );
}
