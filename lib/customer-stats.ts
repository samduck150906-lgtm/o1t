import type { Reservation } from "@/lib/reservations";

/** 고객 키: 연락처 우선, 없으면 이름 */
export function getCustomerKey(r: Reservation): string {
  const phone = (r.phone ?? "").replace(/\s|-|\./g, "").trim();
  if (phone) return `phone:${phone}`;
  return `name:${(r.name ?? "").trim() || "unknown"}`;
}

/** 예약 목록에서 고객별 노쇼 횟수 */
export function getNoShowCountByCustomer(reservations: Reservation[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const r of reservations) {
    if ((r.status ?? "").toLowerCase().includes("노쇼")) {
      const key = getCustomerKey(r);
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }
  return map;
}

/** 특정 예약의 고객 키에 대한 노쇼 횟수 */
export function getNoShowCountFor(
  reservations: Reservation[],
  customerKey: string
): number {
  return getNoShowCountByCustomer(reservations).get(customerKey) ?? 0;
}
