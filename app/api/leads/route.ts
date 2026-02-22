import { NextResponse } from "next/server";
import { z } from "zod";
import { leadsLimiter, checkRateLimit, getClientIdentifier } from "@/lib/ratelimit";
import { apiError } from "@/lib/api-response";

const bodySchema = z.object({
  email: z.string().email("올바른 이메일을 입력해 주세요."),
  source: z.string().max(200).optional().default(""),
});

// DB 교체 포인트: Prisma, Supabase 등 연동
const store: { email: string; source: string; at: string }[] = [];

/** 동일 이메일 재제출 제한: 5분 내 중복 시 거절 (메모리 기반, 프로덕션에서는 Redis 등 권장) */
const lastSubmitByEmail = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000;

export async function POST(request: Request) {
  const identifier = getClientIdentifier(request);
  const limit = await checkRateLimit(leadsLimiter, identifier);
  if (!limit.success) {
    return apiError("요청이 너무 많습니다. 1시간 후 다시 시도해 주세요.", 429, "RATE_LIMITED");
  }
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
    const msg = parsed.error.errors[0]?.message ?? "입력값을 확인해 주세요.";
    return NextResponse.json({ message: msg }, { status: 400 });
  }
  const { email, source } = parsed.data;
  const now = Date.now();
  const last = lastSubmitByEmail.get(email.toLowerCase());
  if (last != null && now - last < COOLDOWN_MS) {
    return NextResponse.json(
      { message: "같은 이메일로는 잠시 후 다시 신청해 주세요." },
      { status: 429 }
    );
  }
  lastSubmitByEmail.set(email.toLowerCase(), now);
  store.push({ email, source, at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
