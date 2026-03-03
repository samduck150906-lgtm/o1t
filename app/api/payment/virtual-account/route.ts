import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { storePaymentSecret } from "@/lib/webhook-toss";

const bodySchema = z.object({
  amount: z.number().int().min(1),
  orderId: z.string().min(1),
  orderName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerName: z.string().max(100).optional(),
  validHours: z.number().int().min(1).max(720).optional().default(72),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "요청 본문이 올바른 JSON이 아닙니다." },
      { status: 400 }
    );
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "필수 파라미터가 누락되었거나 형식이 올바르지 않습니다." },
      { status: 400 }
    );
  }
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { message: "결제 설정이 완료되지 않았습니다." },
      { status: 503 }
    );
  }
  const orderId = parsed.data.orderId;
  const webhookSecret = randomBytes(24).toString("hex");
  await storePaymentSecret(orderId, webhookSecret);
  try {
    const res = await fetch("https://api.tosspayments.com/v1/virtual-accounts", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(secretKey + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parsed.data.amount,
        orderId,
        orderName: parsed.data.orderName,
        customerEmail: parsed.data.customerEmail,
        customerName: parsed.data.customerName,
        validHours: parsed.data.validHours,
        secret: webhookSecret,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message ?? "가상계좌 발급에 실패했습니다." },
        { status: res.status >= 400 && res.status < 500 ? res.status : 402 }
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "결제 서버와 통신할 수 없습니다." },
      { status: 502 }
    );
  }
}
