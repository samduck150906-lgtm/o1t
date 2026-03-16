import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    console.error("TOSS_SECRET_KEY is missing");
    return NextResponse.redirect(new URL("/pricing?error=server_setup", request.url));
  }

  try {
    // 1. 토스페이먼츠 승인 요청
    const basicAuth = Buffer.from(`${secretKey}:`).toString("base64");
    const confirmResponse = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const confirmData = await confirmResponse.json();

    if (!confirmResponse.ok) {
      console.error("토스 승인 실패:", confirmData);
      return NextResponse.redirect(new URL(`/pricing?error=payment_failed&message=${encodeURIComponent(confirmData.message || "")}`, request.url));
    }

    // 2. DB 업데이트 (로그인된 사용자가 있는 경우)
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token?.sub) {
      const { prisma } = await import("@/lib/prisma");
      // 간단한 구독 활성화 logic (실제로는 요금제에 따라 분기 필요)
      await prisma.subscription.upsert({
        where: { userId: token.sub },
        update: {
          status: "active",
          paymentKey,
          orderId,
          currentPeriodEnd: new Error("not implemented").message === "1" ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
        },
        create: {
          userId: token.sub,
          businessId: token.businessId as string || "temp-business-id", // 토큰에 businessId가 있다고 가정
          plan: orderId.startsWith("billing_") ? "pro" : "starter",
          status: "active",
          paymentKey,
          orderId,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
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
  } catch (error) {
    console.error("결제 승인 중 예외 발생:", error);
    return NextResponse.redirect(new URL("/pricing?error=internal_error", request.url));
  }
}
