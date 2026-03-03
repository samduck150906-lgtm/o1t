import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerLimiter, checkRateLimit, getClientIdentifier } from "@/lib/ratelimit";
import { apiError } from "@/lib/api-response";

const bodySchema = z.object({
  email: z.string().email("올바른 이메일을 입력해 주세요."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  name: z.string().min(1, "이름을 입력해 주세요.").optional(),
});

export async function POST(request: Request) {
  const identifier = getClientIdentifier(request);
  const limit = await checkRateLimit(registerLimiter, identifier);
  if (!limit.success) {
    return apiError("요청이 너무 많습니다. 15분 후 다시 시도해 주세요.", 429, "RATE_LIMITED");
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

  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
  });
  if (existing) {
    return NextResponse.json(
      { message: "이미 사용 중인 이메일입니다." },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 12);

  // Multi-Tenant: User 생성 시 업장(Business) 1개 + 해당 업장 구독(Subscription) 생성
  const slugBase = email.replace(/@.*$/, "").replace(/[^a-z0-9]/gi, "-").toLowerCase() || "user";
  const uniqueSlug = `${slugBase}-${Date.now().toString(36)}`;

  await prisma.user.create({
    data: {
      email,
      name: name ?? null,
      passwordHash,
      businesses: {
        create: {
          slug: uniqueSlug,
          name: name ?? undefined,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: { email },
    include: { businesses: { orderBy: { createdAt: "asc" }, take: 1 } },
  });
  const business = user?.businesses?.[0];
  if (business) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        businessId: business.id,
        plan: "trial",
        status: "trialing",
      },
    });
  }

  return NextResponse.json({ ok: true, message: "회원가입이 완료되었습니다. 로그인해 주세요." });
}
