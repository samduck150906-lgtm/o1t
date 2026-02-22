/**
 * slug별 예약 저장소 (서버 메모리).
 * DB 연동 시 Prisma 등으로 교체 가능.
 */

export type StoredReservation = {
  id: string;
  name: string | null;
  phone: string | null;
  date: string | null;
  people: number | null;
  notes: string | null;
  status: string | null;
  amount: number | null;
  createdAt: string;
  source?: "owner" | "customer"; // 대시보드 입력 vs 고객 예약 페이지
};

const store = new Map<string, StoredReservation[]>();

function nextId(): string {
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getReservationsBySlug(slug: string): StoredReservation[] {
  const list = store.get(slug) ?? [];
  return [...list].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

export function addReservation(
  slug: string,
  data: Omit<StoredReservation, "id" | "createdAt">,
  source: "owner" | "customer" = "owner"
): StoredReservation {
  const list = store.get(slug) ?? [];
  const reservation: StoredReservation = {
    ...data,
    id: nextId(),
    createdAt: new Date().toISOString(),
    source,
  };
  list.push(reservation);
  store.set(slug, list);
  return reservation;
}

export function removeReservation(slug: string, id: string): boolean {
  const list = store.get(slug) ?? [];
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  store.set(slug, list);
  return true;
}

export function setReservations(slug: string, items: StoredReservation[]): void {
  store.set(slug, items);
}
