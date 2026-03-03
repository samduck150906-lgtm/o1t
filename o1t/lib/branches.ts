/**
 * 매장(지점) 타입 및 유틸
 * Pro/Enterprise 플랜에서 사장님 1명이 여러 매장 관리, 매장별 예약/고객 분리
 */

export type Branch = {
  id: string;
  name: string;
  address: string | null;
  openAt: string | null;  // HH:mm
  closeAt: string | null;  // HH:mm
  memo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BranchInput = {
  name: string;
  address?: string | null;
  openAt?: string | null;
  closeAt?: string | null;
  memo?: string | null;
};

/** 운영시간 포맷 (예: "09:00 - 18:00") */
export function formatBranchHours(openAt: string | null, closeAt: string | null): string {
  if (!openAt && !closeAt) return "—";
  if (openAt && closeAt) return `${openAt} - ${closeAt}`;
  return openAt ?? closeAt ?? "—";
}
