"use client";

import { useCallback, useEffect, useState } from "react";
import { PasteDropZone } from "@/components/dashboard/PasteDropZone";
import { ReservationList } from "@/components/dashboard/ReservationList";
import { ReservationCalendar } from "@/components/dashboard/ReservationCalendar";
import { BookingLinkCard } from "@/components/dashboard/BookingLinkCard";
import Link from "next/link";

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

export function DashboardClient() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [revenueMonth, setRevenueMonth] = useState(0);

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
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear && r.amount != null;
          })
          .reduce((sum, r) => sum + (r.amount ?? 0), 0)
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

  const handleRemove = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/reservations/${id}`, { method: "DELETE" });
        setReservations((prev) => prev.filter((x) => x.id !== id));
      } catch {
        // ignore
      }
    },
    []
  );

  return (
    <>
      <h1 className="sr-only">내 대시보드</h1>

      <BookingLinkCard />

      {/* 즉시 복붙 창 — 상단 50% 대형 영역 */}
      <section
        className="min-h-[50vh] rounded-2xl border-2 border-dashed border-gray-200 bg-white p-4 shadow-sm md:min-h-[320px] md:p-6"
        aria-label="즉시 복붙"
      >
        <PasteDropZone onAdd={handleAdd} onSaved={fetchReservations} />
      </section>

      {/* 오늘의 예약 · 매출 요약 */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
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
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">이번 달 매출 (예약 기준)</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {loading ? "—" : revenueMonth.toLocaleString()}원
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
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
      </div>

      {/* 예약 리스트 · 캘린더 미리보기 */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <ReservationList items={reservations} onRemove={handleRemove} />
        <ReservationCalendar items={reservations} />
      </div>
    </>
  );
}
