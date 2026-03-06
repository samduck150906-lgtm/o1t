/**
 * 알림 발송 채널
 * - 이메일: Resend (RESEND_API_KEY, NOTIFICATION_EMAIL)
 * - 브라우저 Push: web-push + VAPID (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY), 구독은 Redis 저장
 * - 카카오 알림톡: 카카오 비즈니스 채널 API (KAKAO_ALIMTALK_*)
 */

import { redis } from "@/lib/redis";

export type NewBookingPayload = {
  slug: string;
  customerName: string;
  customerPhone: string;
  date: string;
  reservationId: string;
};

const PUSH_SUBS_KEY_PREFIX = "push_subs:";
const PUSH_SUBS_MAX_PER_SLUG = 50;

/** slug별 수신 이메일. 환경변수 NOTIFICATION_EMAIL 또는 NOTIFICATION_EMAIL_<SLUG> (대문자, 슬러그는 대시로) */
function getOwnerEmail(slug: string): string | null {
  const slugEnv = slug.toUpperCase().replace(/-/g, "_");
  const perSlug = process.env[`NOTIFICATION_EMAIL_${slugEnv}`];
  if (perSlug?.trim()) return perSlug.trim();
  return process.env.NOTIFICATION_EMAIL?.trim() ?? null;
}

/** 이메일 알림: 사장님에게 "새 예약 접수" 메일 (Resend) */
export async function sendEmailNotification(payload: NewBookingPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = getOwnerEmail(payload.slug);
  if (!apiKey || !to) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM ?? "원툴러 <onboarding@resend.dev>";
    const subject = `[새 예약] ${payload.customerName}님 · ${payload.date}`;
    const html = `
      <p>새 예약이 접수되었습니다.</p>
      <ul>
        <li>이름: ${payload.customerName}</li>
        <li>연락처: ${payload.customerPhone}</li>
        <li>예약일시: ${payload.date}</li>
        <li>예약 ID: ${payload.reservationId}</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/dashboard">대시보드에서 확인</a></p>
    `;
    await resend.emails.send({ from, to: [to], subject, html });
  } catch (e) {
    console.error("[notification-channels] sendEmailNotification error:", e);
  }
}

/** Push 구독 저장 (Redis). slug당 최대 PUSH_SUBS_MAX_PER_SLUG개 */
export async function savePushSubscription(
  slug: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
): Promise<void> {
  if (!redis) return;
  const key = `${PUSH_SUBS_KEY_PREFIX}${slug}`;
  const sub = JSON.stringify(subscription);
  await redis.lpush(key, sub);
  await redis.ltrim(key, 0, PUSH_SUBS_MAX_PER_SLUG - 1);
  await redis.expire(key, 60 * 60 * 24 * 30); // 30일
}

/** slug에 등록된 모든 Push 구독 조회 */
async function getPushSubscriptions(slug: string): Promise<Array<{ endpoint: string; keys: { p256dh: string; auth: string } }>> {
  if (!redis) return [];
  const key = `${PUSH_SUBS_KEY_PREFIX}${slug}`;
  const raw = await redis.lrange(key, 0, -1);
  const out: Array<{ endpoint: string; keys: { p256dh: string; auth: string } }> = [];
  for (const s of raw) {
    try {
      const parsed = JSON.parse(s as string) as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
      if (parsed?.endpoint && parsed?.keys?.p256dh && parsed?.keys?.auth) {
        out.push({
          endpoint: parsed.endpoint,
          keys: { p256dh: parsed.keys.p256dh, auth: parsed.keys.auth },
        });
      }
    } catch {
      // skip invalid
    }
  }
  return out;
}

/** 브라우저 Push 알림 (web-push + VAPID) */
export async function sendPushNotification(payload: NewBookingPayload): Promise<void> {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return;

  const subs = await getPushSubscriptions(payload.slug);
  if (subs.length === 0) return;

  try {
    const webpush = (await import("web-push")).default;
    webpush.setVapidDetails(
      "mailto:" + (process.env.NOTIFICATION_EMAIL ?? "noreply@example.com"),
      publicKey,
      privateKey
    );
    const body = {
      title: "새 예약 접수",
      body: `${payload.customerName}님 · ${payload.date}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/dashboard`,
    };
    const payloadStr = JSON.stringify(body);
    await Promise.allSettled(
      subs.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payloadStr,
          { TTL: 3600 }
        )
      )
    );
  } catch (e) {
    console.error("[notification-channels] sendPushNotification error:", e);
  }
}

/**
 * 카카오 알림톡: 고객에게 예약 확인/리마인드 발송
 * 환경변수: KAKAO_ALIMTALK_SENDER_KEY, KAKAO_ALIMTALK_CHANNEL_KEY, KAKAO_ALIMTALK_TEMPLATE_CODE 등
 * 카카오 비즈니스 채널·알림톡 템플릿 승인 후 공식 API 연동 시 구현
 */
export async function sendKakaoAlimtalk(_params: {
  templateCode: string;
  phone: string;
  message: string;
  link?: string;
  variables?: Record<string, string>;
}): Promise<void> {
  // TODO: 카카오 비즈니스 알림톡 API (https://kakaobusiness.gitbook.io) 연동
  // 예: POST https://kakaoapi.example.com/v2/... + 인증 헤더
}

/** 새 예약 시 사장님 대상 채널 일괄 발송 (이메일 + 푸시). 알림톡은 고객 대상이라 별도 호출 */
export async function notifyOwnerNewBooking(payload: NewBookingPayload): Promise<void> {
  await Promise.allSettled([
    sendEmailNotification(payload),
    sendPushNotification(payload),
  ]);
}
