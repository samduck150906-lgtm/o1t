"use client";

import { useCallback, useEffect, useState } from "react";
import { ReservationCalendar } from "@/components/dashboard/ReservationCalendar";
import type { ReservationItem } from "@/app/dashboard/DashboardClient";

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
      <div className="erp-page-header">
        <h2 className="erp-page-title">예약 캘린더</h2>
        <p className="erp-page-subtitle">이달의 예약 및 상담 일정을 한눈에 파악합니다.</p>
      </div>

      <div className="erp-card">
        <div className="erp-card__body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center" }}>
               <div className="erp-skeleton" style={{ width: 300, height: 40, margin: "0 auto 20px" }} />
               <div className="erp-skeleton" style={{ width: "100%", height: 500 }} />
            </div>
          ) : (
            <ReservationCalendar items={items} />
          )}
        </div>
      </div>
    </div>
  );
}
