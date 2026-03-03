/**
 * slug별 알림 저장소 (서버 메모리).
 * 새 예약 시 여기에 추가하고, 대시보드에서 GET /api/notifications 로 조회.
 */

export type NotificationItem = {
  id: string;
  slug: string;
  type: "new_booking" | "reminder" | "system";
  title: string;
  message: string;
  link?: string;
  reservationId?: string;
  read: boolean;
  createdAt: string;
};

const store = new Map<string, NotificationItem[]>();

function nextId(): string {
  return `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function addNotification(
  slug: string,
  data: Omit<NotificationItem, "id" | "slug" | "read" | "createdAt">
): NotificationItem {
  const list = store.get(slug) ?? [];
  const item: NotificationItem = {
    ...data,
    id: nextId(),
    slug,
    read: false,
    createdAt: new Date().toISOString(),
  };
  list.unshift(item);
  store.set(slug, list);
  return item;
}

export function getNotifications(slug: string, limit = 50): NotificationItem[] {
  const list = store.get(slug) ?? [];
  return list.slice(0, limit);
}

export function getUnreadCount(slug: string): number {
  const list = store.get(slug) ?? [];
  return list.filter((n) => !n.read).length;
}

export function markRead(slug: string, id: string): boolean {
  const list = store.get(slug) ?? [];
  const item = list.find((n) => n.id === id);
  if (!item) return false;
  item.read = true;
  return true;
}

export function markAllRead(slug: string): void {
  const list = store.get(slug) ?? [];
  list.forEach((n) => (n.read = true));
}
