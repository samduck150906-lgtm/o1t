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
      const key = formatDayKey(r.date);
      if (key) {
        const list = map.get(key) ?? [];
        list.push(r);
        map.set(key, list);
      }
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

  const cells: { day: number | null; key: string | null }[] = [];
  for (let i = 0; i < startPad; i++) cells.push({ day: null, key: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, key });
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6" aria-labelledby="cal-title">
      <h2 id="cal-title" className="text-lg font-semibold text-foreground">
        예약 캘린더
      </h2>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="min-touch rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="이전 달"
        >
          ←
        </button>
        <p className="text-base font-medium text-foreground" aria-live="polite">
          {year}년 {month}월
        </p>
        <button
          type="button"
          onClick={nextMonth}
          className="min-touch rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="다음 달"
        >
          →
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
        {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map(({ day, key }, i) => (
          <div
            key={i}
            className="min-h-10 rounded-lg border border-gray-100 p-1 text-sm"
          >
            {day != null && (
              <>
                <span className="text-foreground">{day}</span>
                {key && (byDay.get(key)?.length ?? 0) > 0 && (
                  <div className="mt-0.5 flex flex-wrap gap-0.5">
                    {(byDay.get(key) ?? []).slice(0, 3).map((r) => (
                      <span
                        key={r.id}
                        className="inline-block max-w-full truncate rounded bg-primary/15 px-1 text-xs text-primary"
                        title={r.name ?? undefined}
                      >
                        {r.name ?? "?"}
                      </span>
                    ))}
                    {(byDay.get(key)?.length ?? 0) > 3 && (
                      <span className="text-xs text-gray-500">+{(byDay.get(key)?.length ?? 0) - 3}</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500">
          날짜별로 예약이 표시됩니다. 결제·예약 자료를 붙여넣으면 여기에 자동 반영됩니다.
        </p>
      </div>
    </section>
  );
}
