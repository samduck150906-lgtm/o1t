"use client";

import { useCallback, useEffect, useState } from "react";
import { PasteDropZone } from "@/components/dashboard/PasteDropZone";
import { ReservationList } from "@/components/dashboard/ReservationList";
import { ReservationCalendar } from "@/components/dashboard/ReservationCalendar";
import { BookingLinkCard } from "@/components/dashboard/BookingLinkCard";
import { BlacklistCard } from "@/components/dashboard/BlacklistCard";
import Link from "next/link";
import { getIndustry } from "@/lib/onboarding";
import {
  getDashboardWidgetOrder,
  getDashboardWidgetOrderByIndustryType,
  type DashboardWidgetId,
} from "@/lib/dashboard-widget-order";

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

const STATS_WIDGETS: DashboardWidgetId[] = [
  "todayReservation",
  "revenueMonth",
  "quickMenu",
];

function isStatsWidget(id: DashboardWidgetId): boolean {
  return STATS_WIDGETS.includes(id);
}

export function DashboardClient() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [revenueMonth, setRevenueMonth] = useState(0);
  const [industry, setIndustry] = useState<ReturnType<typeof getIndustry>>(
    "other"
  );
  const [industryTypeFromApi, setIndustryTypeFromApi] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch("/api/reservations");
      if (!res.ok) return;
      const data = (await res.json()) as ReservationItem[];
      setReservations(data);
      const today = new Date().toISOString().slice(0, 10);
      setTodayCount(data.filter((r) => r.date?.startsWith(today)).length);
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      setRevenueMonth(
        data
          .filter((r) => {
            if (!r.date) return false;
            const d = new Date(r.date);
            return (
              d.getMonth() === thisMonth &&
              d.getFullYear() === thisYear &&
              r.amount != null
            );
          })
          .reduce((sum, r) => sum + (r.amount ?? 0), 0)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIndustry(getIndustry());
  }, []);

  useEffect(() => {
    fetch("/api/business")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { industryType?: string } | null) => {
        if (data?.industryType) setIndustryTypeFromApi(data.industryType);
      })
      .catch(() => {});
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

  const widgetOrder =
    industryTypeFromApi != null
      ? getDashboardWidgetOrderByIndustryType(industryTypeFromApi)
      : getDashboardWidgetOrder(industry);

  const renderWidget = (id: DashboardWidgetId) => {
    switch (id) {
      case "bookingLink":
        return <BookingLinkCard key={id} />;
      case "calendar":
        return (
          <section key={id} aria-label="예약 캘린더">
            <ReservationCalendar items={reservations} />
          </section>
        );
      case "deposit":
        return (
          <div
            key={id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">입금 확인</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {loading ? "—" : revenueMonth.toLocaleString()}원
            </p>
            <p className="mt-1 text-xs text-gray-500">이번 달 예약 기준</p>
          </div>
        );
      case "pasteDropZone":
        return (
          <section
            key={id}
            className="min-h-[50vh] rounded-2xl border-2 border-dashed border-gray-200 bg-white p-4 shadow-sm md:min-h-[320px] md:p-6"
            aria-label="즉시 복붙"
          >
            <PasteDropZone onAdd={handleAdd} onSaved={fetchReservations} />
          </section>
        );
      case "todayReservation":
        return (
          <div
            key={id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">오늘 예약</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {loading ? "—" : todayCount}건
            </p>
            <Link
              href="/dashboard/reservations"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              예약 리스트 보기 →
            </Link>
          </div>
        );
      case "customerHistory":
        return (
          <div
            key={id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">고객 히스토리</p>
            <p className="mt-1 text-sm text-foreground">
              방문·시술 이력을 한눈에 확인하세요.
            </p>
            <Link
              href="/dashboard/customers"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              고객 명단 보기 →
            </Link>
          </div>
        );
      case "blacklist":
        return (
          <div key={id}>
            <BlacklistCard />
          </div>
        );
      case "classStudents":
        return (
          <div
            key={id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">수강생 리스트</p>
            <p className="mt-1 text-sm text-foreground">
              수강생 명단과 방문 이력을 관리하세요.
            </p>
            <Link
              href="/dashboard/customers"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              수강생 명단 보기 →
            </Link>
          </div>
        );
      case "attendance":
        return (
          <div
            key={id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">출결</p>
            <p className="mt-1 text-sm text-foreground">
              예약·출결을 한 화면에서 확인하세요.
            </p>
            <Link
              href="/dashboard/reservations"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              출결·예약 리스트 보기 →
            </Link>
          </div>
        );
      case "reservationList":
        return (
          <section key={id} aria-label="예약 리스트">
            <ReservationList items={reservations} onRemove={handleRemove} />
          </section>
        );
      case "revenueMonth":
        return (
          <div
            key={id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              이번 달 매출 (예약 기준)
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {loading ? "—" : revenueMonth.toLocaleString()}원
            </p>
          </div>
        );
      case "quickMenu":
        return (
          <div
            key={id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1"
          >
            <p className="text-sm font-medium text-gray-500">빠른 메뉴</p>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/dashboard/reservations"
                  className="text-foreground hover:text-primary hover:underline"
                >
                  예약 리스트
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/calendar"
                  className="text-foreground hover:text-primary hover:underline"
                >
                  예약 캘린더
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/customers"
                  className="text-foreground hover:text-primary hover:underline"
                >
                  고객 명단
                </Link>
              </li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  // 연속된 stats 위젯(오늘 예약·매출·빠른 메뉴)은 한 줄 그리드로 묶기
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < widgetOrder.length) {
    const id = widgetOrder[i];
    if (
      isStatsWidget(id) &&
      widgetOrder[i + 1] !== undefined &&
      isStatsWidget(widgetOrder[i + 1]) &&
      widgetOrder[i + 2] !== undefined &&
      isStatsWidget(widgetOrder[i + 2])
    ) {
      nodes.push(
        <div
          key={`stats-${i}`}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {renderWidget(widgetOrder[i] as DashboardWidgetId)}
          {renderWidget(widgetOrder[i + 1] as DashboardWidgetId)}
          {renderWidget(widgetOrder[i + 2] as DashboardWidgetId)}
        </div>
      );
      i += 3;
      continue;
    }
    nodes.push(renderWidget(id));
    i += 1;
  }

  return (
    <>
      <h1 className="sr-only">내 대시보드</h1>
      <div className="flex flex-col gap-8">
        {nodes.map((node, idx) => (
          <div key={idx}>{node}</div>
        ))}
      </div>
    </>
  );
}
