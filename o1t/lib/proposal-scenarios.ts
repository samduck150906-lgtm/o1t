import { AutomationScenario } from "@/types/proposal";

export const AUTOMATION_SCENARIOS: Record<string, AutomationScenario[]> = {
  의류: [
    {
      pain: "상품 설명 작성에 건당 15~20분 소요",
      solution: "AI가 상품 사진 + 키워드 기반 SEO 최적화 상세 설명 자동 생성",
      timeSaved: 40,
      monthlySaved: "인건비 약 80만원 절감",
      icon: "📝",
    },
    {
      pain: "CS 문의 수동 응대 (사이즈·배송·교환)",
      solution: "반복 문의 90%를 AI 자동응답으로 즉시 처리",
      timeSaved: 30,
      monthlySaved: "CS 인력 1명분 절감",
      icon: "💬",
    },
    {
      pain: "리뷰 하나하나 수동 답변 작성",
      solution: "리뷰 톤 분석 → 맞춤 감사 답변 AI 자동 생성",
      timeSaved: 15,
      monthlySaved: "리뷰 응답률 2배 → 전환율 상승",
      icon: "⭐",
    },
  ],
  식품: [
    {
      pain: "상품 등록 반복 (유통기한·영양정보·설명)",
      solution: "AI가 식품 카테고리 맞춤 상세페이지 자동 생성",
      timeSaved: 35,
      monthlySaved: "신상품 등록 속도 3배",
      icon: "📋",
    },
    {
      pain: "CS 문의 (배송일·보관법·알레르기)",
      solution: "상품별 FAQ 기반 AI 자동응답",
      timeSaved: 25,
      monthlySaved: "CS 비용 50% 절감",
      icon: "💬",
    },
    {
      pain: "재구매 유도 메시지 수동 작성",
      solution: "구매 이력 기반 개인화 재구매 알림 자동 발송",
      timeSaved: 10,
      monthlySaved: "재구매율 20% 상승 기대",
      icon: "🔁",
    },
  ],
  뷰티: [
    {
      pain: "상품 상세 설명 + 성분 정보 작성",
      solution: "AI가 성분·효능 기반 SEO 최적화 상세 설명 생성",
      timeSaved: 35,
      monthlySaved: "콘텐츠 외주비 월 60만원 절감",
      icon: "📝",
    },
    {
      pain: "피부 타입별 CS 문의 응대",
      solution: "성분·피부타입 매칭 AI 자동응답",
      timeSaved: 25,
      monthlySaved: "CS 응대 시간 70% 절감",
      icon: "💬",
    },
    {
      pain: "리뷰 관리 (사진 리뷰 답변·부정 리뷰 대응)",
      solution: "AI가 리뷰 감성 분석 후 톤에 맞는 답변 자동 생성",
      timeSaved: 15,
      monthlySaved: "리뷰 관리 시간 80% 절감",
      icon: "⭐",
    },
  ],
  "가전·디지털": [
    {
      pain: "스펙 비교표·상세 설명 작성",
      solution: "AI가 제품 스펙 기반 비교표 + 상세 설명 자동 생성",
      timeSaved: 40,
      monthlySaved: "상품 등록 속도 4배",
      icon: "📊",
    },
    {
      pain: "기술 CS 문의 (호환성·사용법·AS)",
      solution: "제품 매뉴얼 기반 AI 기술 자동응답",
      timeSaved: 35,
      monthlySaved: "CS 전문 인력 비용 절감",
      icon: "💬",
    },
    {
      pain: "제품 비교 콘텐츠 제작",
      solution: "AI가 경쟁 제품 대비 장점 콘텐츠 자동 생성",
      timeSaved: 10,
      monthlySaved: "콘텐츠 마케팅 효율 2배",
      icon: "📈",
    },
  ],
  "가구·인테리어": [
    {
      pain: "공간별 연출 설명·사이즈 가이드 작성",
      solution: "AI가 공간 타입별 맞춤 상세 설명 자동 생성",
      timeSaved: 35,
      monthlySaved: "콘텐츠 제작비 월 70만원 절감",
      icon: "📝",
    },
    {
      pain: "배송·설치·반품 CS 문의",
      solution: "대형 배송 FAQ 기반 AI 자동응답",
      timeSaved: 30,
      monthlySaved: "CS 인력 1명분 절감",
      icon: "💬",
    },
    {
      pain: "리뷰 응대 (사진 리뷰 감사·불만 대응)",
      solution: "AI 감성 분석 기반 맞춤 리뷰 답변",
      timeSaved: 15,
      monthlySaved: "고객 만족도 향상",
      icon: "⭐",
    },
  ],
  default: [
    {
      pain: "상품 설명 작성에 건당 15~20분 소요",
      solution: "AI 기반 SEO 최적화 상품 설명 자동 생성",
      timeSaved: 40,
      monthlySaved: "인건비 약 80만원 절감",
      icon: "📝",
    },
    {
      pain: "CS 문의 수동 응대",
      solution: "반복 문의 90%를 AI 자동응답으로 처리",
      timeSaved: 30,
      monthlySaved: "CS 인력 1명분 절감",
      icon: "💬",
    },
    {
      pain: "리뷰 수동 답변 작성",
      solution: "리뷰 톤 분석 후 맞춤 답변 자동 생성",
      timeSaved: 15,
      monthlySaved: "리뷰 응답률 2배 → 전환율 상승",
      icon: "⭐",
    },
  ],
};
