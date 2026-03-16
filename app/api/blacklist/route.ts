/**
 * 블랙리스트 API — Multi-Tenant: 모든 쿼리는 session.businessId로만 필터
 * GET: 업장별 차단 연락처 목록
 * POST: 추가 (body: { phone })
 * DELETE: 제거 (query: phone=)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function normalizePhone(phone: string): string {
  return phone.replace(/\s|-|\./g, "").trim() || "";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (!session.businessId) {
    return NextResponse.json({ message: "업장 정보가 없습니다." }, { status: 403 });
  }

  const list = await prisma.blacklist.findMany({
    where: { businessId: session.businessId },
    orderBy: { createdAt: "desc" },
    select: { phone: true, createdAt: true },
  });

  return NextResponse.json(list.map((r: { phone: string }) => r.phone));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (!session.businessId) {
    return NextResponse.json({ message: "업장 정보가 없습니다." }, { status: 403 });
  }

  let body: { phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "올바른 JSON이 아닙니다." }, { status: 400 });
  }
  const phone = normalizePhone(body.phone ?? "");
  if (!phone) {
    return NextResponse.json({ message: "연락처를 입력해 주세요." }, { status: 400 });
  }

  await prisma.blacklist.upsert({
    where: {
      businessId_phone: { businessId: session.businessId, phone },
    },
    create: { businessId: session.businessId, phone },
    update: {},
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (!session.businessId) {
    return NextResponse.json({ message: "업장 정보가 없습니다." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const phone = normalizePhone(searchParams.get("phone") ?? "");
  if (!phone) {
    return NextResponse.json({ message: "연락처를 지정해 주세요." }, { status: 400 });
  }

  await prisma.blacklist.deleteMany({
    where: { businessId: session.businessId, phone },
  });

  return NextResponse.json({ ok: true });
}
