/**
 * 첫 로그인 온보딩 & 업종 선택
 */

const ONBOARDING_DONE_KEY = "o1t_onboarding_done";
const INDUSTRY_KEY = "o1t_industry";

export type Industry =
  | "restaurant"
  | "cafe"
  | "salon"
  | "clinic"
  | "fitness"
  | "retail"
  | "other";

export const INDUSTRY_LABELS: Record<Industry, string> = {
  restaurant: "음식점 / 카페",
  cafe: "카페 / 베이커리",
  salon: "미용실 / 네일",
  clinic: "병원 / 클리닉",
  fitness: "헬스 / 필라테스",
  retail: "소매 / 숍",
  other: "기타",
};

export function isOnboardingDone(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(ONBOARDING_DONE_KEY) === "1";
}

export function setOnboardingDone(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDING_DONE_KEY, "1");
}

export function getIndustry(): Industry {
  if (typeof window === "undefined") return "other";
  const v = localStorage.getItem(INDUSTRY_KEY);
  if (
    v === "restaurant" ||
    v === "cafe" ||
    v === "salon" ||
    v === "clinic" ||
    v === "fitness" ||
    v === "retail"
  )
    return v;
  return "other";
}

export function setIndustry(industry: Industry): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INDUSTRY_KEY, industry);
}

/** 업종별 맞춤 셋팅 가이드 문구 */
export function getSetupGuide(industry: Industry): string {
  const guides: Record<Industry, string> = {
    restaurant:
      "• 예약 시 인원·날짜·시간을 꼭 확인하세요.\n• 노쇼 시 블랙리스트로 등록해 재예약을 막을 수 있습니다.\n• 매출 통계에서 피크 시간대를 확인해보세요.",
    cafe: "• 단체 예약은 메모에 인원·요청사항을 적어두세요.\n• 재방문 고객은 연락처로 자동 집계됩니다.",
    salon: "• 시술별 소요 시간을 메모에 적어 관리하세요.\n• 노쇼 고객은 '노쇼' 버튼으로 처리 후 필요 시 블랙리스트 등록.",
    clinic: "• 예약 상태를 '확정'/'대기'/'노쇼'로 구분해 관리하세요.\n• 세금계산서용 매출은 '데이터 내보내기'에서 CSV로 다운로드.",
    fitness: "• 회원별 방문 이력을 예약 리스트에서 확인할 수 있습니다.\n• 일별/주별 매출 그래프로 수업별 매출을 파악하세요.",
    retail: "• 예약·주문 겸용으로 사용 시 메모에 상품명을 적어두세요.\n• 고객 명단 CSV로 마케팅용 리스트를 내보낼 수 있습니다.",
    other: "• 결제·예약 자료를 붙여넣기만 하면 자동으로 정리됩니다.\n• 블랙리스트와 매출 통계를 활용해 운영을 개선해보세요.",
  };
  return guides[industry];
}
