import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cacheDelete, cacheKeyReservations } from "@/lib/cache";
import { canWrite } from "@/lib/subscription";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (!session.businessId) {
    return NextResponse.json({ message: "업장 정보가 없습니다. 관리자에게 문의하세요." }, { status: 403 });
  }
  const { id } = await params;
  const r = await prisma.reservation.findFirst({
    where: { id, businessId: session.businessId },
  });
  if (!r) {
    return NextResponse.json({ message: "예약을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({
    id: r.id,
    name: r.name,
    phone: r.phone,
    date: r.date?.toISOString() ?? null,
    people: r.people,
    notes: r.notes,
    status: r.status,
    amount: r.amount,
    customerId: r.customerId,
    createdAt: r.createdAt.toISOString(),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (!canWrite(session.subscriptionStatus)) {
    return NextResponse.json(
      { message: "결제 문제로 수정할 수 없습니다. 결제를 완료해 주세요." },
      { status: 403 }
    );
  }
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const dateValue =
    body.date !== undefined
      ? body.date == null || body.date === ""
        ? null
        : new Date(body.date)
      : undefined;

  if (!session.businessId) {
    return NextResponse.json({ message: "업장 정보가 없습니다. 관리자에게 문의하세요." }, { status: 403 });
  }
  const r = await prisma.reservation.updateMany({
    where: { id, businessId: session.businessId },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(dateValue !== undefined && { date: dateValue }),
      ...(body.people !== undefined && { people: body.people }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.amount !== undefined && { amount: body.amount }),
      ...(body.customerId !== undefined && { customerId: body.customerId }),
    },
  });
  if (r.count === 0) {
    return NextResponse.json({ message: "예약을 찾을 수 없습니다." }, { status: 404 });
  }
  await cacheDelete(cacheKeyReservations(session.businessId));
  const updated = await prisma.reservation.findFirst({
    where: { id, businessId: session.businessId },
  });
  if (!updated) {
    return NextResponse.json({ message: "예약을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    phone: updated.phone,
    date: updated.date?.toISOString() ?? null,
    people: updated.people,
    notes: updated.notes,
    status: updated.status,
    amount: updated.amount,
    customerId: updated.customerId,
    createdAt: updated.createdAt.toISOString(),
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }
  if (!canWrite(session.subscriptionStatus)) {
    return NextResponse.json(
      { message: "결제 문제로 수정할 수 없습니다. 결제를 완료해 주세요." },
      { status: 403 }
    );
  }
  const { id } = await params;
  if (!session.businessId) {
    return NextResponse.json({ message: "업장 정보가 없습니다. 관리자에게 문의하세요." }, { status: 403 });
  }
  const r = await prisma.reservation.deleteMany({
    where: { id, businessId: session.businessId },
  });
  if (r.count === 0) {
    return NextResponse.json({ message: "예약을 찾을 수 없습니다." }, { status: 404 });
  }
  await cacheDelete(cacheKeyReservations(session.businessId));
  return NextResponse.json({ ok: true });
}
