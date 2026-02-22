import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseBookingLimiter, checkRateLimit } from "@/lib/ratelimit";
import { apiError } from "@/lib/api-response";

const bodySchema = z.object({
  rawText: z.string().max(20000).optional(),
  imageBase64: z.string().max(10_000_000).optional(),
}).refine((d) => d.rawText?.trim() || d.imageBase64, {
  message: "텍스트 또는 이미지를 입력해 주세요.",
});

export type ParsedBooking = {
  name: string | null;
  phone: string | null;
  date: string | null;
  people: number | null;
  notes: string | null;
  status: string | null;
  amount?: number | null;
};

const systemPrompt = `너는 예약·결제 정보 추출 및 OCR 전문가야.
입력은 (1) 텍스트 붙여넣기 또는 (2) 이미지(스크린샷)일 수 있어.
이미지가 주어지면 먼저 이미지 안의 글자를 읽어(OCR) 텍스트로 해석한 뒤, 아래 규칙으로 정보를 추출해.

처리 대상 예시:
- 카카오톡/문자 예약 대화 캡처, 카톡 캡쳐
- 네이버 예약·네이버톡 스크린샷
- 입금 확인 캡쳐, 계좌이체·결제 확인 화면
- 영수증·결제 완료 스크린샷, 예약 확인 메시지

추출 필드(JSON으로만 응답):
name(이름), phone(연락처), date(예약일시 ISO 8601), people(인원 수), notes(특이사항), status('예약대기'|'확정'|'문의'|'결제완료'), amount(결제금액 숫자, 있으면).
정보 없으면 null. "내일", "다음 주 토요일" 같은 상대 날짜는 오늘 기준 ISO 날짜로 변환.`;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return apiError("로그인이 필요합니다.", 401, "UNAUTHORIZED");
  }
  const limit = await checkRateLimit(parseBookingLimiter, session.userId);
  if (!limit.success) {
    return apiError("요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.", 429, "RATE_LIMITED");
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문이 올바른 JSON이 아닙니다.", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "텍스트 또는 이미지를 입력해 주세요.";
    return NextResponse.json({ error: msg, code: "VALIDATION_ERROR" }, { status: 400 });
  }
  if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "서버 설정 오류: OpenAI API 키는 서버 전용으로만 사용해야 합니다.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "서버 설정이 완료되지 않았습니다." },
      { status: 503 }
    );
  }

  const openai = new OpenAI({ apiKey });
  const { rawText, imageBase64 } = parsed.data;

  try {
    let content: string;

    if (imageBase64) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
              ...(rawText?.trim() ? [{ type: "text" as const, text: rawText }] : []),
            ],
          },
        ],
        max_tokens: 500,
      });
      content = response.choices[0]?.message?.content ?? "";
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: (rawText ?? "").trim() },
        ],
        response_format: { type: "json_object" },
      });
      content = response.choices[0]?.message?.content ?? "";
    }

    if (!content.trim()) {
      return NextResponse.json(
        { message: "정보를 추출하지 못했습니다." },
        { status: 502 }
      );
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const data = JSON.parse(jsonMatch ? jsonMatch[0] : content) as Record<string, unknown>;
    const result: ParsedBooking = {
      name: (data.name as string) ?? null,
      phone: (data.phone as string) ?? null,
      date: (data.date as string) ?? null,
      people: typeof data.people === "number" ? data.people : null,
      notes: (data.notes as string) ?? null,
      status: (data.status as string) ?? null,
      amount: typeof data.amount === "number" ? data.amount : null,
    };

    const session = await getServerSession(authOptions);
    if (session?.userId) {
      await prisma.parseLog.create({
        data: {
          userId: session.userId,
          type: "booking",
          rawInput: rawText?.slice(0, 2000) ?? (imageBase64 ? "image" : null),
          result: result as Prisma.InputJsonValue,
          success: true,
        },
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { message: "추출 결과를 파싱할 수 없습니다." },
        { status: 502 }
      );
    }
    const message =
      err && typeof err === "object" && "status" in err && (err as { status?: number }).status === 429
        ? "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요."
        : err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "insufficient_quota"
          ? "서비스 사용량 한도를 초과했습니다."
          : "예약·결제 정보 추출에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
