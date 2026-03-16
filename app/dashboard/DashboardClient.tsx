"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PasteDropZone } from "@/components/dashboard/PasteDropZone";
import { ReservationCalendar } from "@/components/dashboard/ReservationCalendar";
import { BookingLinkCard } from "@/components/dashboard/BookingLinkCard";

export type ReservationItem = {
  id: string;
  name: string | null;
  phone: string | null;
  date: string | null;
  people: number | null;
  notes: string | null;
  status: string | null;
  amount: number | null;
  createdAt: string;
};

function getStatusBadgeClass(status: string | null): string {
  if (!status) return "erp-badge erp-badge--default";
  if (status.includes("확정")) return "erp-badge erp-badge--확정";
  if (status.includes("예약대기")) return "erp-badge erp-badge--예약대기";
  if (status.includes("결제완료")) return "erp-badge erp-badge--결제완료";
  if (status.includes("문의")) return "erp-badge erp-badge--문의";
  if (status.includes("노쇼")) return "erp-badge erp-badge--노쇼";
  return "erp-badge erp-badge--default";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function DashboardClient() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [revenueMonth, setRevenueMonth] = useState(0);
  const [monthCount, setMonthCount] = useState(0);
  const [noShowCount, setNoShowCount] = useState(0);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch("/api/reservations");
      if (!res.ok) return;
      const data = (await res.json()) as ReservationItem[];
      setReservations(data);

      const today = new Date().toISOString().slice(0, 10);
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      setTodayCount(data.filter((r) => r.date?.startsWith(today)).length);

      const monthData = data.filter((r) => {
        if (!r.date) return false;
        const d = new Date(r.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      });

      setMonthCount(monthData.length);
      setRevenueMonth(
        monthData
          .filter((r) => r.amount != null)
          .reduce((sum, r) => sum + (r.amount ?? 0), 0)
      );
      setNoShowCount(
        data.filter((r) => (r.status ?? "").toLowerCase().includes("노쇼")).length
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleAdd = useCallback(
    (r: ReservationItem) => {
      setReservations((prev) => [r, ...prev]);
      fetchReservations();
    },
    [fetchReservations]
  );

  const handleRemove = useCallback(async (id: string) => {
    try {
      await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      setReservations((prev) => prev.filter((x) => x.id !== id));
    } catch {
      // ignore
    }
  }, []);

  const recentReservations = reservations
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const todayReservations = reservations.filter((r) => {
    const today = new Date().toISOString().slice(0, 10);
    return r.date?.startsWith(today);
  });

  return (
    <>
      <h1 className="sr-only">내 대시보드</h1>

      {/* 페이지 헤더 */}
      <div className="erp-page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p className="erp-page-title">
            {loading ? "대시보드" : `오늘 예약 ${todayCount}건 ✦`}
          </p>
          <p className="erp-page-subtitle">
            {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
          </p>
        </div>
        <Link href="/dashboard/reservations" className="erp-btn erp-btn--primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          예약 추가
        </Link>
      </div>

      {/* KPI 카드 */}
      <div className="erp-kpi-grid">
        <div className="erp-kpi-card erp-kpi-card--blue">
          <div className="erp-kpi-icon erp-kpi-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <p className="erp-kpi-label">오늘 예약</p>
          <p className="erp-kpi-value">
            {loading ? <span className="erp-skeleton inline-block h-8 w-16" /> : todayCount}
            <span className="erp-kpi-unit">건</span>
          </p>
          <p className="erp-kpi-sub">
            <Link href="/dashboard/reservations" style={{ color: "#0052FF", textDecoration: "none" }}>
              리스트 보기 →
            </Link>
          </p>
        </div>

        <div className="erp-kpi-card erp-kpi-card--green">
          <div className="erp-kpi-icon erp-kpi-icon--green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <p className="erp-kpi-label">이번 달 매출</p>
          <p className="erp-kpi-value">
            {loading ? (
              <span className="erp-skeleton inline-block h-8 w-24" />
            ) : (
              revenueMonth.toLocaleString()
            )}
            <span className="erp-kpi-unit">원</span>
          </p>
          <p className="erp-kpi-sub">예약 기준 {monthCount}건</p>
        </div>

        <div className="erp-kpi-card erp-kpi-card--amber">
          <div className="erp-kpi-icon erp-kpi-icon--amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <p className="erp-kpi-label">총 고객</p>
          <p className="erp-kpi-value">
            {loading ? <span className="erp-skeleton inline-block h-8 w-14" /> : reservations.length}
            <span className="erp-kpi-unit">건</span>
          </p>
          <p className="erp-kpi-sub">
            <Link href="/dashboard/customers" style={{ color: "#f59e0b", textDecoration: "none" }}>
              명단 보기 →
            </Link>
          </p>
        </div>

        <div className="erp-kpi-card erp-kpi-card--rose">
          <div className="erp-kpi-icon erp-kpi-icon--rose">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
            </svg>
          </div>
          <p className="erp-kpi-label">노쇼 누적</p>
          <p className="erp-kpi-value">
            {loading ? <span className="erp-skeleton inline-block h-8 w-10" /> : noShowCount}
            <span className="erp-kpi-unit">건</span>
          </p>
          <p className="erp-kpi-sub">블랙리스트 확인 권장</p>
        </div>
      </div>

      {/* 중간 레이아웃: 오늘 예약 + 빠른 메뉴 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}
        className="dashboard-mid-grid">
        {/* 오늘 예약 */}
        <div className="erp-card">
          <div className="erp-card__header">
            <h2 className="erp-card__title">오늘 예약 현황</h2>
            {todayReservations.length > 0 && (
              <span className="erp-card__badge">{todayReservations.length}건</span>
            )}
          </div>
          <div className="erp-card__body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 20 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="erp-skeleton" style={{ height: 44, marginBottom: 10, borderRadius: 10 }} />
                ))}
              </div>
            ) : todayReservations.length === 0 ? (
              <div className="erp-empty">
                <div className="erp-empty__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <p className="erp-empty__title">오늘 예약 없음</p>
                <p className="erp-empty__desc">오늘 예약이 아직 없습니다</p>
              </div>
            ) : (
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>고객</th>
                    <th>시간</th>
                    <th>상태</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  {todayReservations.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>{r.name ?? "-"}</p>
                        <p style={{ fontSize: 12, color: "#9ca3af" }}>{r.phone ?? "-"}</p>
                      </td>
                      <td style={{ fontSize: 13 }}>{formatDate(r.date)}</td>
                      <td>
                        <span className={getStatusBadgeClass(r.status)}>
                          {r.status ?? "미정"}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>
                        {r.amount != null ? `${r.amount.toLocaleString()}원` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 빠른 메뉴 + 예약 링크 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="erp-card">
            <div className="erp-card__header">
              <h2 className="erp-card__title">빠른 메뉴</h2>
            </div>
            <div className="erp-card__body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { href: "/dashboard/reservations", label: "예약 & 상담 리스트", icon: "📋" },
                { href: "/dashboard/calendar", label: "예약 캘린더", icon: "📅" },
                { href: "/dashboard/customers", label: "고객 명단", icon: "👥" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="erp-quick-link">
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16, opacity: 0.4 }}>
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
          <BookingLinkCard />
        </div>
      </div>

      {/* AI 복붙 영역 */}
      <div className="erp-card" style={{ marginBottom: 20 }}>
        <div className="erp-card__header">
          <div>
            <h2 className="erp-card__title">✨ AI 예약 자동 추출</h2>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
              카톡·네이버 예약·입금 스크린샷을 붙여넣으면 자동으로 정리됩니다
            </p>
          </div>
        </div>
        <div className="erp-card__body">
          <PasteDropZone onAdd={handleAdd} onSaved={fetchReservations} />
        </div>
      </div>

      {/* 최근 예약 리스트 */}
      <div className="erp-card" style={{ marginBottom: 20 }}>
        <div className="erp-card__header">
          <h2 className="erp-card__title">최근 예약</h2>
          <Link href="/dashboard/reservations" className="erp-btn erp-btn--ghost erp-btn--sm">
            전체 보기 →
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: 20 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="erp-skeleton" style={{ height: 48, marginBottom: 10 }} />
              ))}
            </div>
          ) : recentReservations.length === 0 ? (
            <div className="erp-empty">
              <div className="erp-empty__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="erp-empty__title">예약이 없습니다</p>
              <p className="erp-empty__desc">위의 AI 자동 추출로 예약을 추가하세요</p>
            </div>
          ) : (
            <table className="erp-table">
              <thead>
                <tr>
                  <th>고객명</th>
                  <th>연락처</th>
                  <th>예약일시</th>
                  <th>인원</th>
                  <th>금액</th>
                  <th>상태</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.name ?? "(이름 없음)"}</td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>{r.phone ?? "-"}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(r.date)}</td>
                    <td style={{ fontSize: 13 }}>{r.people != null ? `${r.people}명` : "-"}</td>
                    <td style={{ fontWeight: 600 }}>
                      {r.amount != null ? `${r.amount.toLocaleString()}원` : "-"}
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(r.status)}>
                        {r.status ?? "미정"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemove(r.id)}
                        className="erp-btn erp-btn--danger erp-btn--sm"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 캘린더 */}
      <div className="erp-card">
        <div className="erp-card__header">
          <h2 className="erp-card__title">예약 캘린더</h2>
          <Link href="/dashboard/calendar" className="erp-btn erp-btn--ghost erp-btn--sm">
            전체 보기 →
          </Link>
        </div>
        <div className="erp-card__body">
          <ReservationCalendar items={reservations} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-mid-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
