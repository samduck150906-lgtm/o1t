"use client";

import { useCallback, useEffect, useState } from "react";
import { ReservationCalendar } from "@/components/dashboard/ReservationCalendar";
import type { ReservationItem } from "@/app/dashboard/DashboardClient";
import Link from "next/link";

export default function CalendarPage() {
  const [items, setItems] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch("/api/reservations");
      if (!res.ok) return;
      const data = (await res.json()) as ReservationItem[];
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">예약 캘린더</h2>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← 대시보드 홈
        </Link>
      </div>

      {loading ? (
        <p className="py-8 text-center text-gray-500">불러오는 중…</p>
      ) : (
        <ReservationCalendar items={items} />
      )}
    </div>
  );
}
