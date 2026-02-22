import Link from "next/link";

export function CTA() {
  return (
    <section
      className="bg-primary px-4 py-12 sm:py-16 md:py-20"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="cta-heading" className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
          지금 바로 무료 진단받기
        </h2>
        <p className="mt-4 text-body-lg text-white/95 leading-relaxed">
          이메일과 유입 경로만 알려주시면, 맞춤 도입 단계와 예상 효과를 안내해 드립니다.
        </p>
        <Link
          href="/diagnosis"
          className="mt-8 inline-flex min-touch items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-medium text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
          aria-label="무료 진단 시작하기"
        >
          무료 진단 시작하기
        </Link>
      </div>
    </section>
  );
}
