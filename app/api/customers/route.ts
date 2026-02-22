import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { cacheGet, cacheSet, cacheDelete, cacheKeyCustomers } from "@/lib/cache";

const createBodySchema = z.object({
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  memo: z.string().nullable().optional(),
});

const CACHE_TTL = 60;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const cacheKey = cacheKeyCustomers(session.userId);
  const cached = await cacheGet<unknown>(cacheKey);
  if (cached != null) {
    return NextResponse.json(cached);
  }

  const list = await prisma.customer.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: "desc" },
  });

  const payload = list.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    memo: c.memo,
    metadata: c.metadata,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
  await cacheSet(cacheKey, payload, CACHE_TTL);

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
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

  const customer = await prisma.customer.create({
    data: {
      userId: session.userId,
      name: parsed.data.name ?? null,
      phone: parsed.data.phone ?? null,
      memo: parsed.data.memo ?? null,
    },
  });

  await cacheDelete(cacheKeyCustomers(session.userId));

  return NextResponse.json({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    memo: customer.memo,
    metadata: customer.metadata,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  });
}
