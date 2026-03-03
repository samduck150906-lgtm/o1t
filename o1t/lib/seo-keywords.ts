/**
 * ETERNAL SIX - 고효율 SEO 키워드 매트릭스
 * [업종 10 × 지역 10 × 고통/해결 2] = 200개 고유 데이터셋
 * SSG(정적 생성) 및 generateMetadata에서 바로 활용
 */

/** 업종별 메타 설명 카테고리 (CTR용 템플릿 매칭) */
export type IndustryCategory = "space" | "beauty" | "pet" | "general";

/** 업종 정의: id, 한글명, 메타 템플릿용 카테고리 */
export const INDUSTRIES = [
  { id: "party-room", name: "파티룸", category: "space" as IndustryCategory },
  { id: "rental-studio", name: "렌탈스튜디오", category: "space" as IndustryCategory },
  { id: "nail-shop", name: "네일샵", category: "beauty" as IndustryCategory },
  { id: "pet-grooming", name: "애견미용", category: "pet" as IndustryCategory },
  { id: "oneday-class", name: "원데이클래스", category: "general" as IndustryCategory },
  { id: "waxing-shop", name: "왁싱샵", category: "beauty" as IndustryCategory },
  { id: "counseling", name: "심리상담소", category: "general" as IndustryCategory },
  { id: "coworking", name: "공유오피스", category: "space" as IndustryCategory },
  { id: "cake-shop", name: "수제케이크", category: "general" as IndustryCategory },
  { id: "taekwondo", name: "태권도장", category: "general" as IndustryCategory },
] as const;

/** 지역 (10개) */
export const LOCATIONS = [
  { id: "gangnam", name: "강남" },
  { id: "hongdae", name: "홍대" },
  { id: "seongsu", name: "성수" },
  { id: "pangyo", name: "판교" },
  { id: "bundang", name: "분당" },
  { id: "incheon", name: "인천" },
  { id: "busan", name: "부산" },
  { id: "daegu", name: "대구" },
  { id: "gwangju", name: "광주" },
  { id: "daejeon", name: "대전" },
] as const;

/** 고통/해결 포인트 (2개) — 10×10×2 = 200개 키워드 */
export const PAINS = [
  {
    id: "auto",
    suffix: "카톡 예약 자동화",
    point: "일일이 답장하기 힘든 예약 문의",
    emphasis: "AI 파싱",
    cta: "카톡 복붙만으로 예약 정리",
  },
  {
    id: "noshow",
    suffix: "노쇼 방지 블랙리스트",
    point: "예약 노쇼와 진상 고객 대응",
    emphasis: "CRM",
    cta: "노쇼 고객 자동 관리",
  },
] as const;

/** 업종별 맞춤형 Pain Point 한 줄 카피 (중복 콘텐츠 방지) */
export const INDUSTRY_PAIN_COPY: Record<string, string> = {
  "party-room":
    "보증금 입금 확인, 카톡 복붙으로 끝내세요. 파티룸 예약 문의가 밤늦게까지 몰려도 한 화면에서 처리할 수 있습니다.",
  "rental-studio":
    "촬영팀·개인 고객의 DM 예약을 한곳에 모으고, 타임슬롯 겹침 없이 실시간 반영됩니다.",
  "nail-shop":
    "디자이너별 예약이 카톡·전화에 흩어져 있어도, 한 시스템에서 실시간으로 통합 관리됩니다.",
  "pet-grooming":
    "펫시터·애견미용 예약과 돌봄 일정을 한 캘린더에서 관리하고, 반려견별 특이사항을 CRM에 남겨 두세요.",
  "oneday-class":
    "원데이클래스 신청·결제·확정을 자동화하고, 노쇼 리마인드로 공강을 줄일 수 있습니다.",
  "waxing-shop":
    "시술 중 오는 카톡 문의, 이제 AI가 정리해 드립니다. 왁싱 예약과 리필 주기까지 자동 알림됩니다.",
  counseling:
    "상담 예약과 회기 관리를 한곳에서 하세요. 노쇼·취소 정책을 자동 안내해 공실을 줄입니다.",
  coworking:
    "좌석·회의실 예약을 실시간으로 받고, 결제 연동으로 이중 예약과 미입금을 방지할 수 있습니다.",
  "cake-shop":
    "수제케이크 주문·픽업 일정을 한곳에서 관리하고, 카톡 복붙만으로 주문 장부를 자동 정리할 수 있습니다.",
  taekwondo:
    "도장 수업·시험 일정과 출결을 한 캘린더에서 관리하고, 노쇼 리마인드로 공강을 줄일 수 있습니다.",
};

/** CTR용 메타 설명 템플릿 (업종 카테고리별, 최대 140자 권장) */
export const META_DESCRIPTION_TEMPLATES: Record<IndustryCategory, string> = {
  space:
    "{location} {industry} 운영, 아직도 입금 확인 후 직접 캘린더 입력하시나요? 카톡/문자 복붙 한 번에 AI가 예약 장부를 완성합니다. 지금 무료 진단받기!",
  beauty:
    "시술 중 예약 문의 전화에 흐름 끊기지 마세요. {location} {industry} 전용 노쇼 방지 블랙리스트와 자동 예약 관리로 매출에만 집중하세요.",
  pet: "{location} {industry} 사장님을 위한 올인원 SaaS. 흩어져 있는 고객 예약 내역을 AI가 하나로 모아드립니다. 수기 장부 대신 스마트한 관리를 시작하세요.",
  general:
    "자영업자 1위 고민 '예약 관리', 이제 AI에게 맡기세요. {location} {industry} 맞춤형 솔루션으로 업무 시간은 줄이고 단골 고객은 늘어납니다.",
};

export function getMetaDescription(
  location: string,
  industry: string,
  category: IndustryCategory
): string {
  const tpl = META_DESCRIPTION_TEMPLATES[category];
  return tpl.replace(/\{location\}/g, location).replace(/\{industry\}/g, industry);
}

/** slug → 지역별 사용 중인 사장님 수 (일관된 수치) */
function getUsageCountBySlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return (h % 41) + 12;
}

export interface SeoKeyword {
  id: string;
  slug: string;
  location: string;
  locationId: string;
  industry: string;
  industryId: string;
  industryCategory: IndustryCategory;
  painPoint: string;
  painId: string;
  painEmphasis: string;
  painCta: string;
  keyword: string;
  title: string;
  description: string;
  usageCount: number;
}

function buildLandingKeywords(): SeoKeyword[] {
  const result: SeoKeyword[] = [];
  for (const industry of INDUSTRIES) {
    for (const location of LOCATIONS) {
      for (const pain of PAINS) {
        const id = `${location.id}-${industry.id}-${pain.id}`;
        const title = `${location.name} ${industry.name} ${pain.suffix}`;
        const description = `${location.name} ${industry.name} 사장님! ${pain.point} 때문에 힘드셨죠? ETERNAL SIX의 AI 파싱 솔루션으로 10초 만에 예약을 정리하세요.`;
        result.push({
          id,
          slug: id,
          location: location.name,
          locationId: location.id,
          industry: industry.name,
          industryId: industry.id,
          industryCategory: industry.category,
          painPoint: pain.point,
          painId: pain.id,
          painEmphasis: pain.emphasis,
          painCta: pain.cta,
          keyword: title,
          title,
          description,
          usageCount: getUsageCountBySlug(id),
        });
      }
    }
  }
  return result;
}

export const landingKeywords: SeoKeyword[] = buildLandingKeywords();

/** slug로 랜딩 데이터 조회 (generateMetadata / page에서 사용) */
export function getLandingDataBySlug(slug: string): SeoKeyword | undefined {
  return landingKeywords.find((k) => k.slug === slug);
}

/** location + industryType + painType 으로 랜딩 데이터 조회 (페이지 props용) */
export function getLandingDataByParams(
  location: string,
  industryType: string,
  painType: string
): SeoKeyword | undefined {
  const slug = `${location}-${industryType}-${painType}`;
  return getLandingDataBySlug(slug);
}

/** 정적 파라미터용 slug 목록 (generateStaticParams) */
export function getLandingSlugs(): { slug: string }[] {
  return landingKeywords.map((k) => ({ slug: k.slug }));
}

/** 정적 파라미터용 3개 props 목록 (generateStaticParams — location/industryType/painType 라우트용) */
export function getLandingParamTriples(): {
  location: string;
  industryType: string;
  painType: string;
}[] {
  return landingKeywords.map((k) => ({
    location: k.locationId,
    industryType: k.industryId,
    painType: k.painId,
  }));
}

/** 같은 업종·다른 지역 랜딩 slug 목록 (내부 링크용) */
export function getSameIndustryOtherLocations(
  industryId: string,
  excludeSlug: string
): SeoKeyword[] {
  return landingKeywords.filter(
    (k) => k.industryId === industryId && k.slug !== excludeSlug
  );
}
