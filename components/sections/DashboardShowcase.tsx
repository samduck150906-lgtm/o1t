const mockStats = [
  { label: "오늘 예약", value: "12건", change: "+3건", positive: true },
  { label: "총 고객", value: "847명", change: "+12명", positive: true },
  { label: "이번달 매출", value: "3,240,000원", change: "+8%", positive: true },
  { label: "미확인 메시지", value: "7건", change: "처리 필요", positive: false },
];

const mockReservations = [
  { time: "10:00", name: "김민지", type: "파티룸 A", status: "확정", color: "green" },
  { time: "11:30", name: "이준호", type: "상담", status: "대기", color: "yellow" },
  { time: "13:00", name: "박소연", type: "파티룸 B", status: "확정", color: "green" },
  { time: "14:30", name: "최영훈", type: "파티룸 C", status: "확정", color: "green" },
  { time: "16:00", name: "정다현", type: "상담", status: "신청", color: "blue" },
  { time: "18:00", name: "강민수", type: "파티룸 A", status: "확정", color: "green" },
];

const mockChannels = [
  { icon: "💬", name: "카카오톡 예약", badge: "3", desc: "신규 3건" },
  { icon: "📞", name: "전화 예약", badge: "1", desc: "콜백 1건" },
  { icon: "🌐", name: "예약 페이지", badge: "2", desc: "온라인 2건" },
  { icon: "📱", name: "문자 상담", badge: "1", desc: "신규 1건" },
];

const navItems = [
  { icon: "📊", label: "대시보드", active: true },
  { icon: "📅", label: "예약 관리" },
  { icon: "👥", label: "고객 관리" },
  { icon: "💬", label: "상담 창구" },
  { icon: "📈", label: "매출 분석" },
  { icon: "⚙️", label: "설정" },
];

const statusStyle: Record<string, string> = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue: "bg-blue-100 text-blue-700",
};

export function DashboardShowcase() {
  return (
    <section
      className="-mx-3 sm:-mx-4 bg-gray-50 px-4 py-14 sm:py-20"
      aria-labelledby="dashboard-showcase-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* 섹션 헤더 버튼 */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-white shadow-lg shadow-primary/30">
            <span className="text-xl" aria-hidden>✨</span>
            <span
              id="dashboard-showcase-heading"
              className="text-lg font-bold sm:text-xl"
            >
              원툴러 사용시, 이렇게 편해집니다
            </span>
            <span className="text-xl" aria-hidden>✨</span>
          </div>
          <p className="text-base text-gray-500">
            모든 예약, 상담, 모든 창구가 아래 화면 하나로 모입니다
          </p>
        </div>

        {/* 데모 대시보드 */}
        <div
          className="relative pointer-events-none select-none overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          aria-label="원툴러 대시보드 미리보기"
          role="img"
        >
          {/* DEMO 배지 */}
          <div className="absolute right-4 top-4 z-10 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            DEMO
          </div>

          <div className="flex h-[580px] sm:h-[660px]">
            {/* 사이드바 */}
            <aside className="hidden w-52 flex-col bg-navy text-white sm:flex">
              <div className="border-b border-white/10 p-5">
                <p className="text-lg font-bold">원툴러</p>
                <p className="mt-0.5 text-xs text-white/40">파티룸 마포점</p>
              </div>
              <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                      item.active
                        ? "bg-primary font-semibold text-white"
                        : "text-white/60"
                    }`}
                  >
                    <span aria-hidden>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </nav>
              <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/30 text-center text-xs leading-7 text-white">
                    김
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">김사장님</p>
                    <p className="text-[10px] text-white/40">관리자</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* 상단 바 */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3.5">
                <h3 className="text-sm font-bold text-gray-800 sm:text-base">
                  오늘의 대시보드 · 2025년 3월 6일 목요일
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400" aria-hidden />
                  <span className="text-xs text-gray-400">실시간 연동 중</span>
                </div>
              </div>

              {/* 콘텐츠 영역 */}
              <div className="flex-1 overflow-hidden bg-gray-50 p-4 sm:p-5">
                <div className="space-y-4">
                  {/* 통계 카드 */}
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {mockStats.map((stat, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                      >
                        <p className="text-xs text-gray-400">{stat.label}</p>
                        <p className="mt-1 text-base font-bold text-gray-900 sm:text-lg">
                          {stat.value}
                        </p>
                        <p
                          className={`mt-0.5 text-xs ${
                            stat.positive ? "text-green-500" : "text-orange-500"
                          }`}
                        >
                          {stat.change}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 예약 목록 + 채널 패널 */}
                  <div className="grid gap-4 lg:grid-cols-3">
                    {/* 오늘 예약 */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:col-span-2">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">오늘 예약</h4>
                        <span className="text-xs text-gray-400">
                          총 {mockReservations.length}건
                        </span>
                      </div>
                      <div className="space-y-2">
                        {mockReservations.map((r, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5"
                          >
                            <span className="w-12 font-mono text-sm text-gray-400">
                              {r.time}
                            </span>
                            <span className="flex-1 text-sm font-medium text-gray-800">
                              {r.name}
                            </span>
                            <span className="hidden text-xs text-gray-400 sm:block">
                              {r.type}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[r.color]}`}
                            >
                              {r.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 실시간 창구 */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <h4 className="mb-1 font-semibold text-gray-800">실시간 창구</h4>
                      <p className="mb-3 text-xs text-gray-400">
                        모든 채널이 여기로 모입니다
                      </p>
                      <div className="space-y-2">
                        {mockChannels.map((ch, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2.5"
                          >
                            <span aria-hidden>{ch.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm text-gray-700">{ch.name}</p>
                              <p className="text-xs text-gray-400">{ch.desc}</p>
                            </div>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                              {ch.badge}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-lg border border-green-100 bg-green-50 p-3">
                        <p className="text-xs font-semibold text-green-700">
                          ✅ 놓친 예약 0건
                        </p>
                        <p className="mt-0.5 text-xs text-green-600">
                          전 채널 통합 모니터링 중
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
