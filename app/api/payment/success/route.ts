import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const PAID_COOKIE_NAME = "o1t_paid";
const SLUG_COOKIE_NAME = "o1t_slug";
const PAID_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1년

function generateSlug(orderId: string): string {
  const safe = orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  if (safe.length >= 6) return safe.toLowerCase();
  return `${safe}${Math.random().toString(36).slice(2, 10 - safe.length)}`.toLowerCase();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");
  if (!orderId || !paymentKey || !amount) {
    return NextResponse.redirect(new URL("/pricing?error=missing", request.url));
  }
  const base = request.nextUrl.origin;
  const dashboardUrl = new URL("/dashboard", base);
  const res = NextResponse.redirect(dashboardUrl);
  res.cookies.set(PAID_COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PAID_COOKIE_MAX_AGE,
    path: "/",
  });
  const slug = generateSlug(orderId);
  res.cookies.set(SLUG_COOKIE_NAME, slug, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PAID_COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}
