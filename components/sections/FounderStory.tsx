export function FounderStory() {
  return (
    <section
      className="-mx-3 sm:-mx-4 bg-gray-50 px-4 py-14 sm:py-20"
      aria-labelledby="founder-story-heading"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:p-12">
          {/* 아이콘 + 레이블 */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              🎉
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              만든 사람 이야기
            </span>
          </div>

          {/* 인용문 */}
          <blockquote className="mt-6">
            <h2
              id="founder-story-heading"
              className="text-xl font-bold leading-snug text-foreground sm:text-2xl"
            >
              &ldquo;저는 파티룸 사장입니다.
              <br />
              비효율적인 운영 시스템에 못 이겨
              <br />
              직접 원툴러를 만들었습니다.&rdquo;
            </h2>
          </blockquote>

          {/* 본문 */}
          <div className="mt-6 space-y-3 text-base text-gray-600 leading-relaxed">
            <p>
              카카오톡으로 예약 받고, 엑셀에 옮기고, 문자로 확인하고,
              또 전화로 리마인드하고—하루에 몇 시간을 이런 반복 업무에 쏟았는지 모릅니다.
            </p>
            <p>
              예약이 겹치거나 누락되면 고객과 싸우게 되고,
              정신 차려 보면 운영이 아니라 업무에 치여 살고 있었습니다.
            </p>
            <p>
              어느 날 저는 결심했습니다.{" "}
              <span className="font-semibold text-foreground">
                이 모든 걸 하나로 해결하는 툴을 직접 만들겠다고.
              </span>{" "}
              원툴러는 그렇게 탄생했습니다.
            </p>
          </div>

          {/* 출처 */}
          <footer className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-base font-bold text-primary">
              K
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">원툴러 창업자</p>
              <p className="text-xs text-gray-400">파티룸 운영 3년차 · 직접 개발·운영 중</p>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
