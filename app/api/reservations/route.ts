import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { cacheGet, cacheSet, cacheDelete, cacheKeyReservations } from "@/lib/cache";
import { canWrite } from "@/lib/subscription";

const createBodySchema = z.object({
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  people: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  amount: z.number().nullable().optional(),
  customerId: z.string().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(), // 업종별 preset
});

const CACHE_TTL = 45;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (!session.businessId) {
    return NextResponse.json({ message: "업장 정보가 없습니다. 관리자에게 문의하세요." }, { status: 403 });
  }

  const cacheKey = cacheKeyReservations(session.businessId);
  const cached = await cacheGet<unknown[]>(cacheKey);
  if (cached != null) {
    return NextResponse.json(cached);
  }

  const list = await prisma.reservation.findMany({
    where: { businessId: session.businessId },
    orderBy: { date: "desc" },
    include: { customer: { select: { id: true, name: true, phone: true } } },
  });

  const items = list.map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    date: r.date?.toISOString() ?? null,
    people: r.people,
    notes: r.notes,
    status: r.status,
    amount: r.amount,
    customerId: r.customerId,
    metadata: r.metadata ?? null,
    createdAt: r.createdAt.toISOString(),
  }));

  await cacheSet(cacheKey, items, CACHE_TTL);
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (!session.businessId) {
    return NextResponse.json({ message: "업장 정보가 없습니다. 관리자에게 문의하세요." }, { status: 403 });
  }
  if (!canWrite(session.subscriptionStatus)) {
    return NextResponse.json(
      { message: "결제 문제로 수정할 수 없습니다. 결제를 완료해 주세요." },
      { status: 403 }
    );
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
  const parsed = createBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.errors[0]?.message ?? "입력값을 확인해 주세요." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const dateValue =
    data.date != null && data.date !== ""
      ? new Date(data.date)
      : null;

  const reservation = await prisma.reservation.create({
    data: {
      userId: session.userId,
      businessId: session.businessId,
      name: data.name ?? null,
      phone: data.phone ?? null,
      date: dateValue,
      people: data.people ?? null,
      notes: data.notes ?? null,
      status: data.status ?? null,
      amount: data.amount ?? null,
      customerId: data.customerId ?? null,
      metadata: (data.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });

  await cacheDelete(cacheKeyReservations(session.businessId));

  return NextResponse.json({
    id: reservation.id,
    name: reservation.name,
    phone: reservation.phone,
    date: reservation.date?.toISOString() ?? null,
    people: reservation.people,
    notes: reservation.notes,
    status: reservation.status,
    amount: reservation.amount,
    customerId: reservation.customerId,
    metadata: reservation.metadata ?? null,
    createdAt: reservation.createdAt.toISOString(),
  });
}
