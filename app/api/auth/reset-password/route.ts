import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  token: z.string().min(1, "토큰이 필요합니다."),
  email: z.string().email("이메일이 필요합니다."),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
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
    const msg = parsed.error.errors[0]?.message ?? "입력값을 확인해 주세요.";
    return NextResponse.json({ message: msg }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (!user) {
    return NextResponse.json(
      { message: "해당 이메일로 등록된 계정이 없습니다." },
      { status: 400 }
    );
  }

  const vt = await prisma.verificationToken.findFirst({
    where: {
      identifier: user.id,
      token: parsed.data.token,
      expires: { gt: new Date() },
    },
  });
  if (!vt) {
    return NextResponse.json(
      { message: "만료되었거나 잘못된 링크입니다. 비밀번호 재설정을 다시 요청해 주세요." },
      { status: 400 }
    );
  }

  const passwordHash = await hash(parsed.data.password, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });
  await prisma.verificationToken.deleteMany({
    where: { identifier: user.id, token: parsed.data.token },
  });

  return NextResponse.json({ ok: true, message: "비밀번호가 변경되었습니다. 로그인해 주세요." });
}
