/**
 * AI 파싱 결과의 신뢰도 점수(0~1)를 휴리스틱으로 계산합니다.
 * UI에서 낮은 신뢰도 시 빨간 표시·자동 등록 차단에 사용합니다.
 */

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

function hasValidIsoDate(date: string | null | undefined): boolean {
  if (!date || typeof date !== "string") return false;
  return ISO_DATE_REGEX.test(date.trim());
}

/** 예약 파싱 결과 기준 신뢰도 (0~1) */
export function bookingConfidence(data: {
  name?: string | null;
  phone?: string | null;
  date?: string | null;
  people?: number | null;
  notes?: string | null;
  status?: string | null;
}): number {
  let score = 0;
  if (data.name && String(data.name).trim().length > 0) score += 0.2;
  if (data.phone && String(data.phone).trim().length > 0) score += 0.25;
  if (data.date && String(data.date).trim().length > 0) {
    score += 0.25;
    if (hasValidIsoDate(data.date)) score += 0.1;
  }
  if (data.people != null && typeof data.people === "number") score += 0.05;
  if (data.status && String(data.status).trim().length > 0) score += 0.05;
  if (data.notes && String(data.notes).trim().length > 0) score += 0.1;
  return Math.min(1, Math.round(score * 100) / 100);
}

/** 고객 파싱 결과 기준 신뢰도 (0~1) */
export function customerConfidence(data: {
  name?: string | null;
  phone?: string | null;
  date?: string | null;
  people?: number | null;
  notes?: string | null;
  status?: string | null;
}): number {
  return bookingConfidence(data);
}

/** 신뢰도 낮음 기준 — 이하면 UI에서 경고·자동 등록 차단 */
export const CONFIDENCE_THRESHOLD = 0.5;

export function isLowConfidence(score: number): boolean {
  return score < CONFIDENCE_THRESHOLD;
}
