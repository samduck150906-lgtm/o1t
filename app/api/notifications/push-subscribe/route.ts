import { NextResponse } from "next/server";
import { z } from "zod";
import { savePushSubscription } from "@/lib/notification-channels";

const bodySchema = z.object({
  slug: z.string().min(1).max(100),
  subscription: z.object({
    endpoint: z.string().url(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
});

/** Push 구독 등록 (예약 알림 수신용). slug별로 저장 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }
  const { slug, subscription } = parsed.data;
  await savePushSubscription(slug, subscription);
  return NextResponse.json({ ok: true });
}
