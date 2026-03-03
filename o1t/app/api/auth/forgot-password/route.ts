import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordLimiter, checkRateLimit, getClientIdentifier } from "@/lib/ratelimit";
import { apiError } from "@/lib/api-response";

const bodySchema = z.object({
  email: z.string().email("올바른 이메일을 입력해 주세요."),
});

const RESET_EXPIRES_HOURS = 1;
const SITE_URL = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  const identifier = getClientIdentifier(request);
  const limit = await checkRateLimit(forgotPasswordLimiter, identifier);
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

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "해당 이메일로 등록된 계정이 있으면 재설정 링크를 발송했습니다.",
    });
  }

  if (!user.passwordHash) {
    return NextResponse.json(
      { message: "소셜 로그인으로 가입한 계정은 비밀번호 재설정이 불가합니다." },
      { status: 400 }
    );
  }

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + RESET_EXPIRES_HOURS * 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({
    where: { identifier: user.id },
  });
  await prisma.verificationToken.create({
    data: {
      identifier: user.id,
      token,
      expires,
    },
  });

  const resetLink = `${SITE_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email ?? "")}`;

  if (process.env.EMAIL_SERVER) {
    // TODO: 이메일 발송 (Resend, SendGrid 등 연동)
    // await sendEmail({ to: user.email, subject: "비밀번호 재설정", html: `링크: ${resetLink}` });
  }

  return NextResponse.json({
    ok: true,
    message: "해당 이메일로 등록된 계정이 있으면 재설정 링크를 발송했습니다.",
    resetLink: process.env.NODE_ENV === "development" ? resetLink : undefined,
  });
}
