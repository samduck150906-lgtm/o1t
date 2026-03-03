import type { Reservation } from "@/lib/reservations";
import { getCustomerKey, getNoShowCountByCustomer } from "@/lib/customer-stats";

export type Period = "day" | "week" | "month";

/** 일별 매출: date 문자열을 YYYY-MM-DD로 정규화해 그룹 */
export function getSalesByDay(reservations: Reservation[]): { date: string; amount: number; count: number }[] {
  const map = new Map<string, { amount: number; count: number }>();
  for (const r of reservations) {
    const amt = r.amount ?? 0;
    if (amt <= 0) continue;
    const dateStr = r.date ? toDateOnly(r.date) : null;
    if (!dateStr) continue;
    const cur = map.get(dateStr) ?? { amount: 0, count: 0 };
    cur.amount += amt;
    cur.count += 1;
    map.set(dateStr, cur);
  }
  return Array.from(map.entries())
    .map(([date, v]) => ({ date, amount: v.amount, count: v.count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** 주별: 해당 주 일요일(또는 월요일) 기준 키 */
function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.getDay();
  const diff = day === 0 ? 0 : -day; // 일요일 시작
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function getSalesByWeek(reservations: Reservation[]): { week: string; amount: number; count: number }[] {
  const map = new Map<string, { amount: number; count: number }>();
  for (const r of reservations) {
    const amt = r.amount ?? 0;
    if (amt <= 0 || !r.date) continue;
    const week = getWeekKey(r.date);
    if (!week) continue;
    const cur = map.get(week) ?? { amount: 0, count: 0 };
    cur.amount += amt;
    cur.count += 1;
    map.set(week, cur);
  }
  return Array.from(map.entries())
    .map(([week, v]) => ({ week, amount: v.amount, count: v.count }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

/** 월별 */
function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getSalesByMonth(reservations: Reservation[]): { month: string; amount: number; count: number }[] {
  const map = new Map<string, { amount: number; count: number }>();
  for (const r of reservations) {
    const amt = r.amount ?? 0;
    if (amt <= 0 || !r.date) continue;
    const month = getMonthKey(r.date);
    if (!month) continue;
    const cur = map.get(month) ?? { amount: 0, count: 0 };
    cur.amount += amt;
    cur.count += 1;
    map.set(month, cur);
  }
  return Array.from(map.entries())
    .map(([month, v]) => ({ month, amount: v.amount, count: v.count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function toDateOnly(dateStr: string): string {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

/** 예약 전환율: 금액 있는 예약 / 전체 예약 */
export function getConversionRate(reservations: Reservation[]): number {
  if (reservations.length === 0) return 0;
  const withAmount = reservations.filter((r) => (r.amount ?? 0) > 0).length;
  return Math.round((withAmount / reservations.length) * 100);
}

/** 노쇼율: 노쇼 건수 / 전체 예약 */
export function getNoShowRate(reservations: Reservation[]): number {
  if (reservations.length === 0) return 0;
  const noShowCount = reservations.filter((r) =>
    (r.status ?? "").toLowerCase().includes("노쇼")
  ).length;
  return Math.round((noShowCount / reservations.length) * 100);
}

/** 재방문율: 2회 이상 방문 고객 수 / 전체 고객 수 */
export function getRevisitRate(reservations: Reservation[]): number {
  const countByCustomer = new Map<string, number>();
  for (const r of reservations) {
    const key = getCustomerKey(r);
    countByCustomer.set(key, (countByCustomer.get(key) ?? 0) + 1);
  }
  const customers = Array.from(countByCustomer.values());
  if (customers.length === 0) return 0;
  const revisitCount = customers.filter((c) => c >= 2).length;
  return Math.round((revisitCount / customers.length) * 100);
}
