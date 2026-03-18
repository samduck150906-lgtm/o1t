/**
 * 공통 SEO: 정적 페이지 메타 + 프로그래매틱 slug (`/{slug}`) 데이터
 */

import {
  getLandingDataBySlug,
  getMetaDescription,
  INDUSTRY_PAIN_COPY,
  landingKeywords,
  type SeoKeyword,
} from "@/lib/seo-keywords";
import { PRICING_PAGE_SEO } from "@/lib/seo-pricing";

export const SITE = {
  name: "원툴러 ONETOOLER",
};

/** 공식 도메인: 원툴러.kr (배포 시 NEXT_PUBLIC_SITE_URL 권장) */
export const SITE_ORIGIN = "https://원툴러.kr";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? SITE_ORIGIN).replace(/\/$/, "");
}

export type StaticSeoEntry = {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
};

/** RSS·정적 솔루션/컨설팅 페이지용 메타 (경로 → title/description) */
export const STATIC_SEO_MAP: Record<string, StaticSeoEntry> = {
    "": {
      title: "원툴러 — 자영업 예약·CRM 자동화",
      description:
        "카톡·전화 예약을 AI로 한번에 정리. 노쇼 방지, 블랙리스트, 캘린더까지 원툴러 하나로.",
      keywords:
        "원툴러, 예약 자동화, 카톡 예약, 노쇼 방지, 자영업 CRM, 파티룸 예약, 네일샵 예약",
      ogTitle: "원툴러 ONETOOLER — 예약·CRM 자동화",
    },
    "consulting/automation": {
      title: "업무 자동화 컨설팅 | 원툴러",
      description:
        "견적서·인보이스 등 반복 입력 업무를 자동화하고, AI 기반 문서 파이프라인을 설계합니다.",
    },
    "consulting/sales": {
      title: "영업 자동화 컨설팅 | 원툴러",
      description:
        "리드 관리·후속 조치까지 영업 프로세스를 재설계하고 자동화합니다.",
    },
    pricing: { ...PRICING_PAGE_SEO },
  };

export function getStaticSeoPaths(): string[] {
  return Object.keys(STATIC_SEO_MAP);
}

// --- 프로그래매틱 랜딩 (`app/[slug]/page.tsx`, RSS) ---

export type DynamicSeo = {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  h1: string;
  region: string;
  industry: string;
  featureKeyword: string;
  landingPath: string;
  /** 히어로 부제에 쓰는 키워드 구문 (예: 카톡 예약 자동화) */
  kwText: string;
  /** 본문 두 번째 문단 (업종 맞춤 카피) */
  kwDesc: string;
};

function metaTitle(kw: SeoKeyword): string {
  return `${kw.location} ${kw.industry} 사장님을 위한 5분 만에 끝내는 예약 자동화`;
}

export function getDynamicSeo(slug: string): DynamicSeo | null {
  const decoded = decodeURIComponent(slug.trim());
  const data = getLandingDataBySlug(decoded);
  if (!data) return null;

  const landingPath = `/landing/${data.locationId}/${data.industryId}/${data.painId}`;
  const description =
    getMetaDescription(data.location, data.industry, data.industryCategory) ||
    data.description;

  const prefix = `${data.location} ${data.industry}`.trim();
  const kwText =
    data.keyword.replace(new RegExp(`^${prefix}\\s*`), "").trim() ||
    data.painCta;
  const kwDesc =
    INDUSTRY_PAIN_COPY[data.industryId] ??
    `${data.painPoint} 원툴러로 줄이고 매출에 집중하세요.`;

  return {
    title: metaTitle(data),
    description,
    keywords: data.keyword,
    canonical: `${getSiteUrl()}${landingPath}`,
    h1: `${data.location} ${data.industry} — ${data.title}`,
    region: data.location,
    industry: data.industry,
    featureKeyword: data.painEmphasis,
    landingPath,
    kwText,
    kwDesc,
  };
}

export function getAllDynamicSlugs(): string[] {
  return landingKeywords.map((k) => k.slug);
}
