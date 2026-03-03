/**
 * 토스페이먼츠 웹훅: 서명(secret) 검증 + 멱등성 처리
 * - PAYMENT_STATUS_CHANGED: Toss API로 결제 조회하여 유효성 검증
 * - DEPOSIT_CALLBACK: payload.secret과 DB에 저장한 주문별 secret 비교
 * - 동일 이벤트 중복 도달 시 200 반환하고 재처리하지 않음
 */

import { prisma } from "@/lib/prisma";

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;

/** 멱등성 키 생성 */
function idempotencyKey(
  orderId: string,
  eventType: string,
  paymentKeyOrTransactionKey: string
): string {
  return `${orderId}:${eventType}:${paymentKeyOrTransactionKey}`;
}

/** 이미 처리된 웹훅이면 true */
export async function isWebhookAlreadyProcessed(key: string): Promise<boolean> {
  const existing = await prisma.webhookEvent.findUnique({
    where: { eventKey: key },
  });
  return !!existing;
}

/** 웹훅 처리 완료 기록 (멱등성) */
export async function markWebhookProcessed(
  key: string,
  eventType: string,
  orderId: string
): Promise<void> {
  await prisma.webhookEvent.upsert({
    where: { eventKey: key },
    create: { eventKey: key, eventType, orderId },
    update: {},
  });
}

/** PAYMENT_STATUS_CHANGED: paymentKey로 Toss API 조회하여 실제 결제인지 검증 */
export async function verifyPaymentStatusWebhook(
  paymentKey: string
): Promise<{ valid: boolean; orderId?: string; status?: string }> {
  if (!TOSS_SECRET_KEY) {
    return { valid: false };
  }
  try {
    const res = await fetch(
      `https://api.tosspayments.com/v1/payments/${encodeURIComponent(paymentKey)}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ":").toString("base64")}`,
        },
      }
    );
    if (!res.ok) return { valid: false };
    const data = (await res.json()) as { orderId?: string; status?: string };
    return {
      valid: true,
      orderId: data.orderId,
      status: data.status,
    };
  } catch {
    return { valid: false };
  }
}

/** DEPOSIT_CALLBACK: orderId에 대해 저장된 secret과 payload.secret 일치 여부 */
export async function verifyDepositWebhookSecret(
  orderId: string,
  receivedSecret: string
): Promise<boolean> {
  const row = await prisma.paymentOrderSecret.findUnique({
    where: { orderId },
  });
  if (!row) return false;
  return row.secret === receivedSecret;
}

/** 결제 생성 시 secret 저장 (가상계좌/빌링 요청 시 호출) */
export async function storePaymentSecret(
  orderId: string,
  secret: string
): Promise<void> {
  await prisma.paymentOrderSecret.upsert({
    where: { orderId },
    create: { orderId, secret },
    update: { secret },
  });
}
