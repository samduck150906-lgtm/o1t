/**
 * Upstash Redis 기반 캐시 레이어
 * 환경변수: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 * 없으면 캐시 미동작(항상 캐시 미스)
 */

import { redis } from "@/lib/redis";

const CACHE_PREFIX = "cache:";
const DEFAULT_TTL_SECONDS = 60;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const raw = await redis.get<string>(CACHE_PREFIX + key);
    if (raw == null) return null;
    return typeof raw === "string" ? (JSON.parse(raw) as T) : (raw as T);
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> {
  if (!redis) return;
  try {
    const fullKey = CACHE_PREFIX + key;
    await redis.set(fullKey, JSON.stringify(value), { ex: ttlSeconds });
  } catch (e) {
    console.error("[cache] set error:", e);
  }
}

export async function cacheDelete(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(CACHE_PREFIX + key);
  } catch {
    // ignore
  }
}

/** 사용자별 예약 목록 캐시 키 */
export function cacheKeyReservations(userId: string): string {
  return `reservations:${userId}`;
}

/** 사용자별 고객 목록 캐시 키 */
export function cacheKeyCustomers(userId: string): string {
  return `customers:${userId}`;
}
