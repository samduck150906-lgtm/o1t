import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * 현재 세션의 기본 비즈니스(업장) 정보 반환.
 * 대시보드 업종별 preset·위젯 순서에 사용.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  const businessId = (session as { businessId?: string }).businessId;
  if (!businessId) {
    return NextResponse.json({ message: "업장 정보를 찾을 수 없습니다." }, { status: 400 });
  }
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true, slug: true, name: true, industryType: true },
  });
  if (!business) {
    return NextResponse.json({ message: "업장을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({
    id: business.id,
    slug: business.slug,
    name: business.name,
    industryType: business.industryType,
  });
}
