"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── 샘플 데이터 ─────────────────────────────── */
const SAMPLE_RESERVATIONS = [
  {
    id: "r1",
    name: "김민지",
    phone: "010-1234-5678",
    date: "2026-03-17T10:00:00",
    people: 1,
    notes: "네일아트 젤 제거 후 새 시술",
    status: "확정",
    amount: 45000,
  },
  {
    id: "r2",
    name: "박서연",
    phone: "010-9876-5432",
    date: "2026-03-17T13:30:00",
    people: 2,
    notes: "커플 패키지",
    status: "확정",
    amount: 80000,
  },
  {
    id: "r3",
    name: "이준호",
    phone: "010-5555-1234",
    date: "2026-03-17T15:00:00",
    people: 1,
    notes: "첫 방문 / 두피 케어",
    status: "대기",
    amount: 60000,
  },
  {
    id: "r4",
    name: "최유진",
    phone: "010-2233-4455",
    date: "2026-03-18T11:00:00",
    people: 1,
    notes: "",
    status: "확정",
    amount: 35000,
  },
  {
    id: "r5",
    name: "정하늘",
    phone: "010-7788-9900",
    date: "2026-03-18T14:00:00",
    people: 3,
    notes: "단체 예약 – 생일 파티",
    status: "확정",
    amount: 150000,
  },
  {
    id: "r6",
    name: "강도윤",
    phone: "010-3344-5566",
    date: "2026-03-15T09:00:00",
    people: 1,
    notes: "",
    status: "노쇼",
    amount: 0,
  },
  {
    id: "r7",
    name: "윤소희",
    phone: "010-6677-8899",
    date: "2026-03-16T17:30:00",
    people: 1,
    notes: "스킨케어 + 마사지",
    status: "완료",
    amount: 95000,
  },
  {
    id: "r8",
    name: "임재혁",
    phone: "010-1122-3344",
    date: "2026-03-19T16:00:00",
    people: 2,
    notes: "커플 마사지",
    status: "확정",
    amount: 110000,
  },
];

const SAMPLE_CUSTOMERS = [
  {
    id: "c1",
    name: "김민지",
    phone: "010-1234-5678",
    visits: 12,
    totalSpent: 480000,
    lastVisit: "2026-03-17",
    memo: "젤 네일 선호, 견과류 알러지",
    tag: "VIP",
  },
  {
    id: "c2",
    name: "박서연",
    phone: "010-9876-5432",
    visits: 5,
    totalSpent: 320000,
    lastVisit: "2026-03-17",
    memo: "커플 패키지 고정 예약",
    tag: "단골",
  },
  {
    id: "c3",
    name: "윤소희",
    phone: "010-6677-8899",
    visits: 8,
    totalSpent: 610000,
    lastVisit: "2026-03-16",
    memo: "스킨케어 + 마사지 패키지 선호",
    tag: "VIP",
  },
  {
    id: "c4",
    name: "임재혁",
    phone: "010-1122-3344",
    visits: 3,
    totalSpent: 240000,
    lastVisit: "2026-02-28",
    memo: "커플 마사지 예약 주로",
    tag: "",
  },
  {
    id: "c5",
    name: "강도윤",
    phone: "010-3344-5566",
    visits: 2,
    totalSpent: 0,
    lastVisit: "2026-03-15",
    memo: "노쇼 이력 1회",
    tag: "주의",
  },
];

/* ─── 타입 ────────────────────────────────────── */
type Tab = "home" | "reservations" | "calendar" | "customers";

/* ─── 유틸 ────────────────────────────────────── */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("ko-KR", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function statusStyle(status: string) {
  if (status === "노쇼") return "bg-red-100 text-red-700";
  if (status === "완료") return "bg-gray-100 text-gray-600";
  if (status === "대기") return "bg-yellow-100 text-yellow-700";
  return "bg-blue-100 text-blue-700";
}

/* ─── 캘린더 서브 컴포넌트 ────────────────────── */
function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const reserved = new Set(
    SAMPLE_RESERVATIONS.map((r) => new Date(r.date).getDate())
  );

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {year}년 {month + 1}월 예약 캘린더
      </h2>
      <table className="w-full table-fixed text-center text-sm">
        <thead>
          <tr className="text-xs font-semibold text-gray-400">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <th key={d} className="py-1">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                const isToday = day === today.getDate();
                const hasRes = day != null && reserved.has(day);
                return (
                  <td key={di} className="py-1">
                    {day != null ? (
                      <span
                        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors
                          ${isToday ? "bg-primary text-white" : "text-foreground"}
                          ${!isToday && hasRes ? "ring-2 ring-primary/40" : ""}
                        `}
                      >
                        {day}
                        {hasRes && !isToday && (
                          <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                        )}
                      </span>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-400">● 예약 있는 날 · 파란 원: 오늘</p>
    </div>
  );
}

/* ─── 메인 컴포넌트 ───────────────────────────── */
export function DemoERP() {
  const [tab, setTab] = useState<Tab>("home");
  const [searchQ, setSearchQ] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = SAMPLE_RESERVATIONS.filter((r) =>
    r.date.startsWith(today)
  ).length;
  const monthRevenue = SAMPLE_RESERVATIONS.filter(
    (r) =>
      new Date(r.date).getMonth() === new Date().getMonth() && r.amount > 0
  ).reduce((sum, r) => sum + r.amount, 0);
  const totalCustomers = SAMPLE_CUSTOMERS.length;

  const filteredCustomers = SAMPLE_CUSTOMERS.filter(
    (c) =>
      searchQ === "" ||
      c.name.includes(searchQ) ||
      c.phone.includes(searchQ)
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* ── 데모 배너 ── */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-amber-400 px-4 py-2.5 text-sm font-semibold text-amber-900 shadow">
        <span>
          👀 이것은 <strong>데모 미리보기</strong>입니다 — 실제 데이터가 아니며 편집은 제한됩니다.
        </span>
        <Link
          href="/pricing"
          className="rounded-full bg-amber-900 px-4 py-1 text-xs font-bold text-amber-100 hover:bg-amber-800 transition-colors"
        >
          무료로 시작하기 →
        </Link>
      </div>

      {/* ── 상단 헤더 ── */}
      <header className="border-b border-gray-200 bg-white px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <span className="text-base font-bold text-white">O</span>
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-foreground">
                OwnerOneTool
              </p>
              <p className="text-xs text-gray-400">뷰티샵 예시 (데모)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
              🔒 읽기 전용
            </span>
            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              로그인
            </Link>
          </div>
        </div>
      </header>

      {/* ── 탭 네비게이션 ── */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <nav className="flex gap-1 overflow-x-auto pb-0 pt-3" aria-label="데모 메뉴">
            {(
              [
                { id: "home", label: "🏠 홈" },
                { id: "reservations", label: "📋 예약 리스트" },
                { id: "calendar", label: "📅 캘린더" },
                { id: "customers", label: "👥 고객 명단" },
              ] as { id: Tab; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none ${
                  tab === t.id
                    ? "border-b-2 border-primary bg-blue-50 text-primary"
                    : "text-gray-500 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── 본문 ── */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* ══ 홈 탭 ══ */}
        {tab === "home" && (
          <div className="flex flex-col gap-8">
            {/* 통계 카드 3개 */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">오늘 예약</p>
                <p className="mt-2 text-4xl font-extrabold text-foreground">
                  {todayCount}
                  <span className="ml-1 text-lg font-semibold text-gray-400">건</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">3월 17일 기준</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">이번 달 매출</p>
                <p className="mt-2 text-4xl font-extrabold text-foreground">
                  {monthRevenue.toLocaleString()}
                  <span className="ml-1 text-lg font-semibold text-gray-400">원</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">3월 예약 기준</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-500">등록 고객 수</p>
                <p className="mt-2 text-4xl font-extrabold text-foreground">
                  {totalCustomers}
                  <span className="ml-1 text-lg font-semibold text-gray-400">명</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">VIP 2명 포함</p>
              </div>
            </div>

            {/* 오늘 예약 미리보기 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                오늘 예약 ({todayCount}건)
              </h2>
              {todayCount === 0 ? (
                <p className="text-sm text-gray-400">오늘 예약이 없습니다.</p>
              ) : (
                <ul className="space-y-3">
                  {SAMPLE_RESERVATIONS.filter((r) =>
                    r.date.startsWith(today)
                  ).map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{r.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(r.date)} · {r.people}명
                          {r.notes ? ` · ${r.notes}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyle(r.status)}`}
                        >
                          {r.status}
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                          {r.amount.toLocaleString()}원
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 빠른 메뉴 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">빠른 메뉴</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "예약 추가", icon: "➕", locked: true },
                  { label: "예약 리스트", icon: "📋", locked: false, action: () => setTab("reservations") },
                  { label: "캘린더", icon: "📅", locked: false, action: () => setTab("calendar") },
                  { label: "고객 명단", icon: "👥", locked: false, action: () => setTab("customers") },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    disabled={item.locked}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-5 text-sm font-medium transition-colors
                      ${item.locked
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                        : "border-gray-200 bg-white text-foreground hover:bg-blue-50 hover:border-primary hover:text-primary"
                      }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.locked && (
                      <span className="text-xs text-gray-300">🔒 로그인 필요</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ 예약 리스트 탭 ══ */}
        {tab === "reservations" && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                예약 리스트 ({SAMPLE_RESERVATIONS.length}건)
              </h2>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-300"
              >
                🔒 예약 추가
              </button>
            </div>
            <ul className="space-y-3" role="list">
              {SAMPLE_RESERVATIONS.slice()
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((r) => (
                  <li
                    key={r.id}
                    className={`flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4 ${
                      r.status === "노쇼"
                        ? "border-red-200 bg-red-50/40"
                        : "border-gray-100 bg-gray-50/50"
                    }`}
                  >
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="font-semibold text-foreground">{r.name}</p>
                      <p className="text-gray-500">{r.phone}</p>
                      <p className="text-gray-500">
                        {formatDate(r.date)} · {r.people}명
                      </p>
                      {r.amount > 0 && (
                        <p className="text-gray-500">{r.amount.toLocaleString()}원</p>
                      )}
                      {r.notes && (
                        <p className="mt-1 text-gray-400">{r.notes}</p>
                      )}
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyle(
                          r.status
                        )}`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-300"
                        title="로그인 후 사용 가능"
                      >
                        🔒 노쇼
                      </button>
                      <button
                        type="button"
                        disabled
                        className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-300"
                        title="로그인 후 사용 가능"
                      >
                        🔒 삭제
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* ══ 캘린더 탭 ══ */}
        {tab === "calendar" && (
          <div className="flex flex-col gap-6">
            <MiniCalendar />
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-foreground">
                이번 달 예약 요약
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-center text-sm">
                {[
                  { label: "총 예약", value: `${SAMPLE_RESERVATIONS.length}건` },
                  { label: "확정", value: `${SAMPLE_RESERVATIONS.filter((r) => r.status === "확정").length}건` },
                  { label: "노쇼", value: `${SAMPLE_RESERVATIONS.filter((r) => r.status === "노쇼").length}건` },
                  { label: "완료", value: `${SAMPLE_RESERVATIONS.filter((r) => r.status === "완료").length}건` },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ 고객 명단 탭 ══ */}
        {tab === "customers" && (
          <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">
                고객 명단 ({SAMPLE_CUSTOMERS.length}명)
              </h2>
              <div className="flex gap-2">
                <input
                  type="search"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="이름 또는 전화번호 검색"
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-300"
                >
                  🔒 고객 추가
                </button>
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2" role="list">
              {filteredCustomers.map((c) => (
                <li
                  key={c.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{c.name}</p>
                        {c.tag && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              c.tag === "VIP"
                                ? "bg-yellow-100 text-yellow-700"
                                : c.tag === "주의"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {c.tag}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">{c.phone}</p>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs text-gray-300"
                    >
                      🔒 수정
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3 text-center text-xs">
                    <div>
                      <p className="text-gray-400">방문 횟수</p>
                      <p className="mt-0.5 font-bold text-foreground">{c.visits}회</p>
                    </div>
                    <div>
                      <p className="text-gray-400">총 결제</p>
                      <p className="mt-0.5 font-bold text-foreground">
                        {c.totalSpent.toLocaleString()}원
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">최근 방문</p>
                      <p className="mt-0.5 font-bold text-foreground">{c.lastVisit}</p>
                    </div>
                  </div>
                  {c.memo && (
                    <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                      📝 {c.memo}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* ── 하단 CTA ── */}
      <footer className="mt-8 border-t border-gray-200 bg-white px-4 py-10 text-center">
        <p className="text-lg font-bold text-foreground">
          내 업장 데이터로 바로 시작해보세요
        </p>
        <p className="mt-1 text-sm text-gray-500">
          무료 플랜으로 예약·고객·매출을 한 번에 관리
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
          >
            무료로 시작하기
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            요금제 보기
          </Link>
        </div>
      </footer>
    </div>
  );
}
