import type { Reservation } from "@/lib/reservations";
import { getCustomerKey, getNoShowCountByCustomer } from "@/lib/customer-stats";
import { loadBlacklist } from "@/lib/blacklist";

const BOM = "\uFEFF";

function escapeCsvCell(value: string | number | null | undefined): string {
  if (value == null) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** 고객 명단 CSV (이름, 연락처, 방문횟수, 노쇼횟수, 블랙리스트여부) */
export function buildCustomerListCsv(reservations: Reservation[]): string {
  const blacklist = typeof window !== "undefined" ? loadBlacklist() : [];
  const noShowMap = getNoShowCountByCustomer(reservations);
  const countByCustomer = new Map<string, { name: string; phone: string; count: number }>();
  for (const r of reservations) {
    const key = getCustomerKey(r);
    const name = (r.name ?? "").trim() || "(이름 없음)";
    const phone = (r.phone ?? "").trim() || "";
    const cur = countByCustomer.get(key);
    if (!cur) {
      countByCustomer.set(key, { name, phone, count: 1 });
    } else {
      cur.count += 1;
    }
  }
  const rows: string[][] = [
    ["이름", "연락처", "방문횟수", "노쇼횟수", "블랙리스트"],
  ];
  for (const [key, v] of Array.from(countByCustomer.entries())) {
    const noShow = noShowMap.get(key) ?? 0;
    const blocked = v.phone ? blacklist.includes(v.phone.replace(/\s|-|\./g, "")) : false;
    rows.push([
      v.name,
      v.phone,
      String(v.count),
      String(noShow),
      blocked ? "Y" : "",
    ]);
  }
  return BOM + rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}

/** 예약 이력 CSV */
export function buildReservationHistoryCsv(reservations: Reservation[]): string {
  const rows: string[][] = [
    ["예약일시", "이름", "연락처", "인원", "금액", "상태", "메모", "등록일"],
  ];
  const sorted = [...reservations].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  for (const r of sorted) {
    rows.push([
      r.date ?? "",
      r.name ?? "",
      r.phone ?? "",
      r.people != null ? String(r.people) : "",
      r.amount != null ? String(r.amount) : "",
      r.status ?? "",
      r.notes ?? "",
      r.createdAt ?? "",
    ]);
  }
  return BOM + rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}

/** 세금계산서용 매출 데이터 CSV (거래일, 공급가, 세액 등 간단 형식) */
export function buildTaxSalesCsv(reservations: Reservation[]): string {
  const rows: string[][] = [
    ["거래일자", "고객명", "연락처", "공급가액", "비고"],
  ];
  const withAmount = reservations.filter((r) => (r.amount ?? 0) > 0);
  const sorted = [...withAmount].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
  for (const r of sorted) {
    const dateOnly = r.date ? new Date(r.date).toISOString().slice(0, 10) : "";
    const supply = r.amount ?? 0; // 공급가액 (VAT 별도 시 10% 세액 가정은 사용자 계산)
    rows.push([
      dateOnly,
      r.name ?? "",
      r.phone ?? "",
      String(supply),
      r.notes ?? "",
    ]);
  }
  return BOM + rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
