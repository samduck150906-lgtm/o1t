import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
} from "@/lib/notification-store";

const PAID_COOKIE_NAME = "o1t_paid";
const SLUG_COOKIE_NAME = "o1t_slug";
const DEFAULT_SLUG = "default";

function getSlug(cookieStore: Awaited<ReturnType<typeof cookies>>): string {
  return cookieStore.get(SLUG_COOKIE_NAME)?.value ?? DEFAULT_SLUG;
}

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get(PAID_COOKIE_NAME)?.value !== "1") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const slug = getSlug(cookieStore);
  const list = getNotifications(slug);
  const unreadCount = getUnreadCount(slug);
  return NextResponse.json({ items: list, unreadCount });
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get(PAID_COOKIE_NAME)?.value !== "1") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const slug = getSlug(cookieStore);
  const body = await request.json().catch(() => ({}));
  if (body.all === true) {
    markAllRead(slug);
    return NextResponse.json({ ok: true });
  }
  if (typeof body.id === "string") {
    const ok = markRead(slug, body.id);
    return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "id or all required" }, { status: 400 });
}
