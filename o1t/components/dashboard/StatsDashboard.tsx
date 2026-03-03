"use client";

import { useMemo, useState } from "react";
import type { Reservation } from "@/lib/reservations";
import {
  getSalesByDay,
  getSalesByWeek,
  getSalesByMonth,
  getConversionRate,
  getNoShowRate,
  getRevisitRate,
  type Period,
} from "@/lib/stats";

type StatsDashboardProps = {
  items: Reservation[];
};

export function StatsDashboard({ items }: StatsDashboardProps) {
  const [period, setPeriod] = useState<Period>("day");

  const byDay = useMemo(() => getSalesByDay(items), [items]);
  const byWeek = useMemo(() => getSalesByWeek(items), [items]);
  const byMonth = useMemo(() => getSalesByMonth(items), [items]);

  const conversionRate = useMemo(() => getConversionRate(items), [items]);
  const noShowRate = useMemo(() => getNoShowRate(items), [items]);
  const revisitRate = useMemo(() => getRevisitRate(items), [items]);

  const chartData =
    period === "day"
      ? byDay.slice(-30).map((d) => ({ label: d.date, amount: d.amount, count: d.count }))
      : period === "week"
        ? byWeek.slice(-12).map((w) => ({ label: w.week, amount: w.amount, count: w.count }))
        : byMonth.slice(-12).map((m) => ({ label: m.month, amount: m.amount, count: m.count }));

  const maxAmount = Math.max(1, ...chartData.map((d) => d.amount));

  return (
    <section
      className="rounded-2xl border border-gray-200 bg-white p-6"
      aria-labelledby="stats-title"
    >
      <h2 id="stats-title" className="text-lg font-semibold text-foreground">
        매출 통계
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-600">예약 전환율</p>
          <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
          <p className="text-xs text-gray-500">결제 완료 건 / 전체 예약</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-600">노쇼율</p>
          <p className="text-2xl font-bold text-foreground">{noShowRate}%</p>
          <p className="text-xs text-gray-500">노쇼 건 / 전체 예약</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-600">재방문율</p>
          <p className="text-2xl font-bold text-foreground">{revisitRate}%</p>
          <p className="text-xs text-gray-500">2회 이상 방문 고객 비율</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex gap-2">
          {(["day", "week", "month"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                period === p
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p === "day" ? "일별" : p === "week" ? "주별" : "월별"}
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[200px] space-y-2">
          {chartData.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              매출 데이터가 없습니다. 예약에 금액을 입력하면 그래프에 표시됩니다.
            </p>
          ) : (
            chartData.map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="w-24 shrink-0 truncate text-xs text-gray-600">
                  {d.label}
                </span>
                <div className="flex-1">
                  <div
                    className="h-6 rounded bg-primary/20"
                    style={{
                      width: `${Math.max(4, (d.amount / maxAmount) * 100)}%`,
                    }}
                    title={`${d.amount.toLocaleString()}원 (${d.count}건)`}
                  />
                </div>
                <span className="w-20 shrink-0 text-right text-xs font-medium text-foreground">
                  {d.amount.toLocaleString()}원
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
