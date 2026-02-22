import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

const bodySchema = z.object({
  rawText: z.string().min(1, "텍스트를 입력해 주세요.").max(10000),
});

const systemPrompt = `너는 고객 관리 전문가야.
고객과의 대화 내용이나 캡처 텍스트가 들어오면
다음 항목을 추출해서 JSON 형식으로 응답해줘.
필드: 이름(name), 연락처(phone), 예약날짜(date), 예약인원(people), 특이사항(notes), 상태(status: '예약대기'|'확정'|'문의').
만약 정보가 없으면 null로 표기해.
"내일", "이번 주 토요일" 같은 상대 날짜는 오늘 기준 ISO 날짜로 변환해.`;

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
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "서버 설정이 완료되지 않았습니다." },
      { status: 503 }
    );
  }
  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: parsed.data.rawText },
      ],
      response_format: { type: "json_object" },
    });
    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { message: "응답을 생성하지 못했습니다." },
        { status: 502 }
      );
    }
    const data = JSON.parse(content) as {
      name?: string | null;
      phone?: string | null;
      date?: string | null;
      people?: number | null;
      notes?: string | null;
      status?: string | null;
    };
    return NextResponse.json({
      name: data.name ?? null,
      phone: data.phone ?? null,
      date: data.date ?? null,
      people: data.people ?? null,
      notes: data.notes ?? null,
      status: data.status ?? null,
    });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { message: "응답 파싱에 실패했습니다." },
        { status: 502 }
      );
    }
    const message =
      err && typeof err === "object" && "status" in err && (err as { status?: number }).status === 429
        ? "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요."
        : err && typeof err === "object" && "code" in err && (err as { code?: string }).code === "insufficient_quota"
          ? "서비스 사용량 한도를 초과했습니다. 잠시 후 다시 시도해 주세요."
          : "고객 정보 추출에 실패했습니다. 잠시 후 다시 시도해 주세요.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
