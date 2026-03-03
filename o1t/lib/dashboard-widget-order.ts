/**
 * 업종(industry)별 대시보드 위젯 순서
 * — "내 업종 전용 SaaS" 느낌을 위한 초기 로딩 분기
 * Business.industryType(API) 또는 onboarding Industry(localStorage) 기반.
 */

import type { Industry } from "@/lib/onboarding";

export type DashboardWidgetId =
  | "bookingLink"
  | "calendar"
  | "deposit"
  | "pasteDropZone"
  | "todayReservation"
  | "customerHistory"
  | "blacklist"
  | "classStudents"
  | "attendance"
  | "reservationList"
  | "revenueMonth"
  | "quickMenu";

/** 업종별 위젯 노출 순서 (앞일수록 상단) */
const ORDER_BY_INDUSTRY: Record<Industry, DashboardWidgetId[]> = {
  // 파티룸: 캘린더 → 입금확인 → PasteDropZone
  party: [
    "bookingLink",
    "calendar",
    "deposit",
    "pasteDropZone",
    "todayReservation",
    "revenueMonth",
    "quickMenu",
    "reservationList",
    "blacklist",
    "customerHistory",
  ],
  // 뷰티샵: 오늘 예약 → 고객 히스토리 → 블랙리스트
  salon: [
    "bookingLink",
    "todayReservation",
    "customerHistory",
    "blacklist",
    "pasteDropZone",
    "calendar",
    "deposit",
    "revenueMonth",
    "quickMenu",
    "reservationList",
  ],
  // 클래스: 수강생 리스트 → 출결 → 예약
  class: [
    "bookingLink",
    "classStudents",
    "attendance",
    "reservationList",
    "pasteDropZone",
    "todayReservation",
    "calendar",
    "deposit",
    "revenueMonth",
    "quickMenu",
    "blacklist",
    "customerHistory",
  ],
  // 그 외 업종: 기본 순서
  restaurant: [
    "bookingLink",
    "pasteDropZone",
    "todayReservation",
    "revenueMonth",
    "quickMenu",
    "reservationList",
    "calendar",
    "blacklist",
    "customerHistory",
  ],
  cafe: [
    "bookingLink",
    "pasteDropZone",
    "todayReservation",
    "revenueMonth",
    "quickMenu",
    "reservationList",
    "calendar",
    "blacklist",
    "customerHistory",
  ],
  clinic: [
    "bookingLink",
    "pasteDropZone",
    "todayReservation",
    "revenueMonth",
    "quickMenu",
    "reservationList",
    "calendar",
    "blacklist",
    "customerHistory",
  ],
  fitness: [
    "bookingLink",
    "pasteDropZone",
    "todayReservation",
    "revenueMonth",
    "quickMenu",
    "reservationList",
    "calendar",
    "blacklist",
    "customerHistory",
  ],
  retail: [
    "bookingLink",
    "pasteDropZone",
    "todayReservation",
    "revenueMonth",
    "quickMenu",
    "reservationList",
    "calendar",
    "blacklist",
    "customerHistory",
  ],
  other: [
    "bookingLink",
    "pasteDropZone",
    "todayReservation",
    "revenueMonth",
    "quickMenu",
    "reservationList",
    "calendar",
    "blacklist",
    "customerHistory",
  ],
};

/** Prisma Business.industryType → onboarding Industry (위젯 순서용) */
const INDUSTRY_TYPE_TO_INDUSTRY: Record<string, Industry> = {
  PARTYROOM: "party",
  BEAUTY: "salon",
  PET: "other",
  CLASS: "class",
  RENTAL: "party",
  CONSULTING: "clinic",
  CUSTOM: "other",
};

export function getDashboardWidgetOrder(industry: Industry): DashboardWidgetId[] {
  return ORDER_BY_INDUSTRY[industry];
}

/**
 * API의 industryType(Prisma enum)으로 위젯 순서 반환.
 * 대시보드에서 /api/business 응답의 industryType에 사용.
 */
export function getDashboardWidgetOrderByIndustryType(
  industryType: string | null | undefined
): DashboardWidgetId[] {
  const industry = industryType
    ? INDUSTRY_TYPE_TO_INDUSTRY[industryType] ?? "other"
    : "other";
  return ORDER_BY_INDUSTRY[industry];
}
