/**
 * 업종별 예약 metadata preset — industryType에 따라 구조 분기.
 * 랜딩/예약폼 자동 커스터마이징 시 이 preset 참조.
 */

export const IndustryType = {
  PARTYROOM: "PARTYROOM",
  BEAUTY: "BEAUTY",
  PET: "PET",
  CLASS: "CLASS",
  RENTAL: "RENTAL",
  CONSULTING: "CONSULTING",
  CUSTOM: "CUSTOM",
} as const;

export type IndustryType = (typeof IndustryType)[keyof typeof IndustryType];

// ——— 업종별 metadata 타입 ———

export interface PartyRoomMetadata {
  depositAmount?: number;      // 보증금(원)
  guestCount?: number;        // 인원
  afterUseCleaning?: boolean; // 사용 후 청소 여부
}

export interface BeautyMetadata {
  procedureType?: string;     // 시술 종류 (네일/펌/컷 등)
  designerName?: string;      // 담당 디자이너
  noshowRiskScore?: number;   // 노쇼 위험 점수
}

export interface PetMetadata {
  petType?: string;           // 반려동물 종류
  vaccination?: boolean;      // 접종 여부
  pickupTime?: string;        // 픽업 시간 (ISO 또는 "HH:mm")
}

export interface ClassMetadata {
  className?: string;         // 수업/클래스명
  instructorName?: string;   // 강사명
  capacity?: number;          // 정원
  level?: string;             // 레벨 (입문/중급 등)
}

export interface RentalMetadata {
  itemName?: string;          // 대여 품목
  rentalStart?: string;       // 대여 시작 (ISO)
  rentalEnd?: string;         // 대여 종료 (ISO)
  depositAmount?: number;     // 보증금
}

export interface ConsultingMetadata {
  consultType?: string;       // 상담 유형
  durationMinutes?: number;   // 상담 소요 시간
  preferredChannel?: string;  // 선호 채널 (전화/방문 등)
}

export type CustomMetadata = Record<string, unknown>;

export type ReservationMetadataByIndustry = {
  [IndustryType.PARTYROOM]: PartyRoomMetadata;
  [IndustryType.BEAUTY]: BeautyMetadata;
  [IndustryType.PET]: PetMetadata;
  [IndustryType.CLASS]: ClassMetadata;
  [IndustryType.RENTAL]: RentalMetadata;
  [IndustryType.CONSULTING]: ConsultingMetadata;
  [IndustryType.CUSTOM]: CustomMetadata;
};

/** 업종별 metadata preset — 기본 키 목록(스키마). 랜딩/폼 자동 생성 시 사용 */
export const METADATA_PRESET_KEYS: Record<IndustryType, readonly string[]> = {
  [IndustryType.PARTYROOM]: ["depositAmount", "guestCount", "afterUseCleaning"],
  [IndustryType.BEAUTY]: ["procedureType", "designerName", "noshowRiskScore"],
  [IndustryType.PET]: ["petType", "vaccination", "pickupTime"],
  [IndustryType.CLASS]: ["className", "instructorName", "capacity", "level"],
  [IndustryType.RENTAL]: ["itemName", "rentalStart", "rentalEnd", "depositAmount"],
  [IndustryType.CONSULTING]: ["consultType", "durationMinutes", "preferredChannel"],
  [IndustryType.CUSTOM]: [],
} as const;

/** 업종별 한글 라벨 (랜딩/폼 라벨용) */
export const METADATA_PRESET_LABELS: Record<IndustryType, Record<string, string>> = {
  [IndustryType.PARTYROOM]: {
    depositAmount: "보증금(원)",
    guestCount: "인원",
    afterUseCleaning: "사용 후 청소",
  },
  [IndustryType.BEAUTY]: {
    procedureType: "시술 종류",
    designerName: "담당 디자이너",
    noshowRiskScore: "노쇼 위험 점수",
  },
  [IndustryType.PET]: {
    petType: "반려동물 종류",
    vaccination: "접종 여부",
    pickupTime: "픽업 시간",
  },
  [IndustryType.CLASS]: {
    className: "수업/클래스명",
    instructorName: "강사명",
    capacity: "정원",
    level: "레벨",
  },
  [IndustryType.RENTAL]: {
    itemName: "대여 품목",
    rentalStart: "대여 시작",
    rentalEnd: "대여 종료",
    depositAmount: "보증금",
  },
  [IndustryType.CONSULTING]: {
    consultType: "상담 유형",
    durationMinutes: "상담 소요(분)",
    preferredChannel: "선호 채널",
  },
  [IndustryType.CUSTOM]: {},
};

/** 업종 한글명 (랜딩/SEO용) */
export const INDUSTRY_DISPLAY_NAMES: Record<IndustryType, string> = {
  [IndustryType.PARTYROOM]: "파티룸",
  [IndustryType.BEAUTY]: "네일/미용",
  [IndustryType.PET]: "펫 서비스",
  [IndustryType.CLASS]: "클래스",
  [IndustryType.RENTAL]: "대여",
  [IndustryType.CONSULTING]: "상담",
  [IndustryType.CUSTOM]: "기타",
};

/**
 * 업종에 맞는 metadata 기본 구조 반환 (빈 preset).
 * 랜딩/폼에서 필드 목록 꺼낼 때 사용.
 */
export function getMetadataPresetKeys(industryType: IndustryType): readonly string[] {
  return METADATA_PRESET_KEYS[industryType] ?? METADATA_PRESET_KEYS[IndustryType.CUSTOM];
}

export function getMetadataPresetLabels(industryType: IndustryType): Record<string, string> {
  return METADATA_PRESET_LABELS[industryType] ?? {};
}
