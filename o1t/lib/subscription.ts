/**
 * 구독 상태에 따른 read-only(grace) 처리.
 * status === "grace" 인 경우 쓰기(생성/수정/삭제) 차단, 읽기만 허용.
 */

import type { Session } from "next-auth";

export const GRACE_STATUS = "grace";
export const GRACE_DAYS = 7;

export function isReadOnly(session: Session | null): boolean {
  return (session as { subscriptionStatus?: string | null } | null)?.subscriptionStatus === GRACE_STATUS;
}

/** API에서 사용: subscriptionStatus가 grace가 아니면 쓰기 허용 */
export function canWrite(subscriptionStatus?: string | null): boolean {
  return subscriptionStatus !== GRACE_STATUS;
}

export function requireWrite(session: Session | null): { allowed: boolean; message?: string } {
  if (!session?.userId) {
    return { allowed: false, message: "로그인이 필요합니다." };
  }
  if (isReadOnly(session)) {
    return {
      allowed: false,
      message: "결제 유예 기간 중에는 새로 추가·수정·삭제할 수 없습니다. 조회만 가능합니다.",
    };
  }
  return { allowed: true };
}
