import { NextResponse } from "next/server";
import { z } from "zod";
import {
  isWebhookAlreadyProcessed,
  markWebhookProcessed,
  verifyPaymentStatusWebhook,
  verifyDepositWebhookSecret,
} from "@/lib/webhook-toss";
import { prisma } from "@/lib/prisma";
import { GRACE_DAYS } from "@/lib/subscription";

// 토스 문서: PAYMENT_STATUS_CHANGED는 data, DEPOSIT_CALLBACK은 secret/orderId/transactionKey 등
const webhookPayloadSchema = z.object({
  paymentKey: z.string().optional(),
  orderId: z.string().optional(),
  status: z.string().optional(),
  secret: z.string().optional(),
  transactionKey: z.string().optional(),
}).passthrough();

const webhookSchema = z.object({
  eventType: z.string(),
  data: webhookPayloadSchema.optional(),
  payload: webhookPayloadSchema.optional(),
  // DEPOSIT_CALLBACK 형식 (최상위에 secret, orderId 등)
  secret: z.string().optional(),
  orderId: z.string().optional(),
  transactionKey: z.string().optional(),
  status: z.string().optional(),
}).passthrough();

function getPayload(parsed: z.infer<typeof webhookSchema>) {
  const d = parsed.data ?? parsed.payload;
  if (d) return d;
  return {
    orderId: parsed.orderId,
    status: parsed.status,
    secret: parsed.secret,
    transactionKey: parsed.transactionKey,
  };
}

function getOrderId(p: Record<string, unknown>): string | undefined {
  return typeof p.orderId === "string" ? p.orderId : undefined;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const parsed = webhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { eventType } = parsed.data;
  const payload = getPayload(parsed.data);
  const orderId = getOrderId(payload as Record<string, unknown>) ?? parsed.data.orderId;
  const paymentKey = payload.paymentKey;
  const transactionKey = payload.transactionKey ?? (parsed.data as { transactionKey?: string }).transactionKey;

  function idemKey(): string {
    const k = [orderId ?? "", eventType, paymentKey ?? transactionKey ?? ""].join(":");
    return k || `unknown:${eventType}:${Date.now()}`;
  }

  // ——— 멱등성: 이미 처리된 이벤트면 200만 반환 ———
  const key = idemKey();
  if (await isWebhookAlreadyProcessed(key)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // ——— 서명/검증 ———
  if (eventType === "PAYMENT_STATUS_CHANGED") {
    if (!paymentKey) {
      return NextResponse.json({ error: "Missing paymentKey" }, { status: 400 });
    }
    const verification = await verifyPaymentStatusWebhook(paymentKey);
    if (!verification.valid) {
      return NextResponse.json({ error: "Invalid payment verification" }, { status: 401 });
    }
    if (orderId && verification.orderId && orderId !== verification.orderId) {
      return NextResponse.json({ error: "OrderId mismatch" }, { status: 401 });
    }
  } else if (
    eventType === "DEPOSIT_CALLBACK" ||
    eventType === "VIRTUAL_ACCOUNT_DEPOSIT_COMPLETED"
  ) {
    const secret = payload.secret ?? (parsed.data as { secret?: string }).secret;
    if (!orderId || !secret) {
      return NextResponse.json({ error: "Missing orderId or secret" }, { status: 400 });
    }
    const valid = await verifyDepositWebhookSecret(orderId, secret);
    if (!valid) {
      return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
    }
  }

  await markWebhookProcessed(key, eventType, orderId ?? "unknown");

  // ——— 비즈니스 처리 ———
  if (eventType === "PAYMENT_STATUS_CHANGED") {
    const oid = orderId ?? (payload as { orderId?: string }).orderId;
    const status = (payload as { status?: string }).status;
    if (oid) {
      if (status === "DONE") {
        await prisma.subscription.updateMany({
          where: { orderId: oid },
          data: { status: "active", paymentKey: payload.paymentKey ?? undefined },
        });
      } else if (
        status &&
        ["ABORTED", "CANCELED", "EXPIRED", "PARTIAL_CANCELED"].includes(status)
      ) {
        // 결제 실패/취소/만료 → grace 상태로 변경 (GRACE_DAYS: 7일 후 읽기 전용)
        void GRACE_DAYS; // graceEndsAt은 Prisma 스키마 미지원, 상태만 변경
        await prisma.subscription.updateMany({
          where: { orderId: oid },
          data: { status: "grace" },
        });
      }
    }
  }
  if (
    (eventType === "DEPOSIT_CALLBACK" || eventType === "VIRTUAL_ACCOUNT_DEPOSIT_COMPLETED") &&
    (payload.status === "DONE" || (parsed.data as { status?: string }).status === "DONE")
  ) {
    const oid = orderId ?? (parsed.data as { orderId?: string }).orderId;
    if (oid) {
      await prisma.subscription.updateMany({
        where: { orderId: oid },
        data: { status: "active" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
