"use client";

import { useMemo, useState } from "react";
import type { Reservation } from "@/lib/reservations";

type ReservationCalendarProps = {
  items: Reservation[];
};

function formatDayKey(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ReservationCalendar({ items }: ReservationCalendarProps) {
  const [focusMonth, setFocusMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [year, month] = focusMonth.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startPad = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const byDay = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of items) {
      if (!r.date) continue; // date가 없는 예약 방지
      const key = formatDayKey(r.date);
      if (key) {
        const list = map.get(key) ?? [];
        list.push(r);
        map.set(key, list);
      }
    }
    // 날짜 내부에서 시간순 정렬
    for (const [k, list] of Array.from(map.entries())) {
      list.sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
      map.set(k, list);
    }
    return map;
  }, [items]);

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setFocusMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };
  const nextMonth = () => {
    const d = new Date(year, month, 1);
    setFocusMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };
  const todayMonth = () => {
    const d = new Date();
    setFocusMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const cells: { day: number | null; key: string | null; isToday: boolean }[] = [];
  const todayKey = formatDayKey(new Date().toISOString());

  for (let i = 0; i < startPad; i++) cells.push({ day: null, key: null, isToday: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, key, isToday: key === todayKey });
  }

  // 달력 행 채우기 (마지막 줄 빈칸)
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, key: null, isToday: false });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* 캘린더 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--erp-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>
            {year}년 {month}월
          </h3>
          <button type="button" onClick={todayMonth} className="erp-btn erp-btn--secondary erp-btn--sm" style={{ fontWeight: 600 }}>
            오늘
          </button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" onClick={prevMonth} className="erp-btn erp-btn--ghost" style={{ padding: "8px 12px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" onClick={nextMonth} className="erp-btn erp-btn--ghost" style={{ padding: "8px 12px" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {/* 캘린더 요일 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
        {["일", "월", "화", "수", "목", "금", "토"].map((w, i) => (
          <div key={w} style={{ padding: "12px 0", textAlign: "center", fontSize: 13, fontWeight: 600, color: i === 0 ? "#ef4444" : i === 6 ? "#3b82f6" : "#6b7280" }}>
            {w}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#e5e7eb", gap: "1px", borderBottomLeftRadius: 14, borderBottomRightRadius: 14, overflow: "hidden" }}>
        {cells.map(({ day, key, isToday }, i) => {
          const isWeekend = i % 7 === 0 || i % 7 === 6;
          return (
            <div
              key={i}
              style={{
                background: day ? (isToday ? "#f0fdf4" : "#ffffff") : "#f9fafb",
                minHeight: 120,
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}
            >
              {day && (
                <>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8
                  }}>
                    <span style={{
                      display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26,
                      fontSize: 14, fontWeight: isToday ? 700 : 500,
                      color: isToday ? "#059669" : (i % 7 === 0 ? "#ef4444" : i % 7 === 6 ? "#3b82f6" : "#111827"),
                      background: isToday ? "#d1fae5" : "transparent",
                      borderRadius: "50%"
                    }}>
                      {day}
                    </span>
                    {key && (byDay.get(key)?.length ?? 0) > 0 && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--erp-primary)", background: "var(--erp-primary-light)", padding: "1px 6px", borderRadius: 4 }}>
                        {byDay.get(key)?.length}건
                      </span>
                    )}
                  </div>
                  
                  {key && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, overflowY: "auto" }}>
                      {(byDay.get(key) ?? []).map((r) => {
                        const isNoShow = (r.status ?? "").toLowerCase().includes("노쇼");
                        const timeStr = r.date ? new Date(r.date).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }) : "";
                        return (
                          <div
                            key={r.id}
                            style={{
                              padding: "4px 6px",
                              borderRadius: 4,
                              background: isNoShow ? "#fee2e2" : "#f1f5f9",
                              borderLeft: `2px solid ${isNoShow ? "#ef4444" : "var(--erp-primary)"}`,
                              fontSize: 11,
                              display: "flex",
                              gap: 4,
                              alignItems: "center",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                            title={`${timeStr} ${r.name ?? "(이름 없음)"} ${r.people ? `(${r.people}명)` : ""} - ${r.notes ?? ""}`}
                          >
                            <span style={{ color: isNoShow ? "#b91c1c" : "#64748b", fontWeight: 600, flexShrink: 0 }}>
                              {timeStr || "-"}
                            </span>
                            <span style={{ fontWeight: 600, color: isNoShow ? "#991b1b" : "#334155", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {r.name ?? "(이름 없음)"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
