/**
 * Rate Limiting — Upstash Redis 기반
 * 브루트포스·남용 방지를 위해 /api/auth/register, forgot-password, parse-booking 등에 적용
 *
 * 환경변수: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 * 없으면 개발 환경에서 한도 체크를 건너뜀(항상 success)
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/** 회원가입: IP당 5회/15분 */
export const registerLimiter =
  redis &&
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "rl:register",
    analytics: true,
  });

/** 비밀번호 재설정 요청: IP당 5회/시간 */
export const forgotPasswordLimiter =
  redis &&
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "rl:forgot",
    analytics: true,
  });

/** AI 파싱(parse-booking): 사용자당 30회/분 (로그인 시), IP당 10회/분 (비로그인) */
export const parseBookingLimiter =
  redis &&
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    prefix: "rl:parse",
    analytics: true,
  });

/** 리드/문의 제출: IP당 20회/시간 */
export const leadsLimiter =
  redis &&
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    prefix: "rl:leads",
    analytics: true,
  });

/** 식별자(IP 또는 userId)로 한도 체크. Redis 없으면 항상 통과 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; remaining: number; limit: number; reset: number }> {
  if (!limiter) {
    return { success: true, remaining: 999, limit: 999, reset: 0 };
  }
  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    limit: result.limit,
    reset: result.reset,
  };
}

/** 요청에서 IP 추출 (Vercel/프록시 헤더 지원) */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIp) return realIp;
  return "unknown";
}
