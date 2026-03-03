import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  customerKey: z.string().min(1),
  amount: z.number().int().min(1),
  orderName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerName: z.string().max(100).optional(),
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
  const orderId = `billing_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return NextResponse.json({
    orderId,
    customerKey: parsed.data.customerKey,
    amount: parsed.data.amount,
    orderName: parsed.data.orderName,
    customerEmail: parsed.data.customerEmail,
    customerName: parsed.data.customerName,
  });
}
