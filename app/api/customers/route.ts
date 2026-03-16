import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { cacheGet, cacheSet, cacheDelete, cacheKeyCustomers } from "@/lib/cache";
import { canWrite } from "@/lib/subscription";

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
  if (!session.businessId) {
    return NextResponse.json({ message: "업장 정보가 없습니다. 관리자에게 문의하세요." }, { status: 403 });
  }

  const cacheKey = cacheKeyCustomers(session.businessId);
  const cached = await cacheGet<unknown>(cacheKey);
  if (cached != null) {
    return NextResponse.json(cached);
  }

  const list = await prisma.customer.findMany({
    where: { businessId: session.businessId },
    orderBy: { updatedAt: "desc" },
  });

  const payload = list.map((c: any) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    memo: c.memo,
    metadata: c.metadata,
    visitCount: c.visitCount,
    totalPayment: c.totalPayment,
    lastVisitAt: c.lastVisitAt?.toISOString() ?? null,
    riskScore: c.riskScore,
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

  const customer = await prisma.customer.create({
    data: {
      userId: session.userId,
      businessId: session.businessId,
      name: parsed.data.name ?? null,
      phone: parsed.data.phone ?? null,
      memo: parsed.data.memo ?? null,
    },
  });

  await cacheDelete(cacheKeyCustomers(session.businessId));

  return NextResponse.json({
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    memo: customer.memo,
    metadata: customer.metadata,
    visitCount: customer.visitCount,
    totalPayment: customer.totalPayment,
    lastVisitAt: customer.lastVisitAt?.toISOString() ?? null,
    riskScore: customer.riskScore,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  });
}
