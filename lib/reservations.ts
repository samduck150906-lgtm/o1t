export type Reservation = {
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

export const RESERVATIONS_STORAGE_KEY = "o1t_reservations";

export function loadReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    return Array.isArray(parsed)
      ? parsed.filter(
          (r): r is Reservation =>
            !!r &&
            typeof r === "object" &&
            typeof (r as Reservation).id === "string" &&
            typeof (r as Reservation).createdAt === "string"
        )
      : [];
  } catch {
    return [];
  }
}

export function saveReservations(items: Reservation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function createReservation(
  data: Omit<Reservation, "id" | "createdAt">
): Reservation {
  return {
    ...data,
    id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
}

export function updateReservationStatus(
  items: Reservation[],
  id: string,
  status: string
): Reservation[] {
  return items.map((r) => (r.id === id ? { ...r, status } : r));
}
