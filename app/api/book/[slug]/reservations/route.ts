import { NextResponse } from "next/server";
import { z } from "zod";
import { addReservation } from "@/lib/booking-store";
import { addNotification } from "@/lib/notification-store";
import { notifyOwnerNewBooking } from "@/lib/notification-channels";

const bodySchema = z.object({
  name: z.string().min(1, "이름을 입력해 주세요.").max(200),
  phone: z.string().min(1, "연락처를 입력해 주세요.").max(50),
  date: z.string().min(1, "예약일시를 선택해 주세요."),
  people: z.number().int().min(1).optional(),
  notes: z.string().max(2000).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug?.trim()) {
    return NextResponse.json({ message: "Invalid slug" }, { status: 400 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Invalid body";
    return NextResponse.json({ message: msg }, { status: 400 });
  }
  const { name, phone, date, people, notes } = parsed.data;
  const reservation = addReservation(
    slug.trim(),
    {
      name,
      phone,
      date,
      people: people ?? null,
      notes: notes ?? null,
      status: "예약대기",
      amount: null,
    },
    "customer"
  );
  addNotification(slug.trim(), {
    type: "new_booking",
    title: "새 예약 접수",
    message: `${name}님 · ${date} 예약이 접수되었습니다.`,
    link: "/dashboard",
    reservationId: reservation.id,
  });
  notifyOwnerNewBooking({
    slug: slug.trim(),
    customerName: name,
    customerPhone: phone,
    date,
    reservationId: reservation.id,
  }).catch((e) => console.error("[reservations] notifyOwnerNewBooking:", e));
  return NextResponse.json(reservation, { status: 201 });
}
