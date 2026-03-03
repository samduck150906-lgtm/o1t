# CURSOR 프롬프트 — O1T 프로젝트에 /proposal/[id] 셀러 맞춤 제안서 페이지 추가

> **이 프롬프트를 Cursor AI에 붙여넣으세요. O1T 프로젝트에 AI 자동화 컨설팅 제안서 페이지를 추가합니다.**

---

## 역할

너는 시니어 Next.js 풀스택 개발자다.
기존 OWNER ONE-TOOL(O1T) 프로젝트 (`https://ootool.netlify.app/`)에
**스마트스토어 셀러 대상 AI 자동화 컨설팅 맞춤 제안서 페이지**를 추가한다.

---

## 절대 조건

- 기존 O1T 코드 구조, 스타일, 컴포넌트 패턴을 최대한 따른다
- placeholder 문구 금지
- TypeScript strict, lint error 0개
- 모바일 퍼스트 반응형 필수
- /proposal/[id] 페이지는 **독립 랜딩** — O1T 기존 네비게이션/헤더/푸터 사용하지 않음
- SEO: noindex, nofollow (개인화 페이지이므로 검색엔진 차단)

---

## [1] 추가할 파일 구조

```
app/
  proposal/
    [id]/
      page.tsx              ← 서버 컴포넌트 (SSR, 데이터 페칭)
      ProposalContent.tsx   ← 클라이언트 컴포넌트 (인터랙션)
      loading.tsx           ← 로딩 스켈레톤
      not-found.tsx         ← 404 처리

lib/
  supabase/
    proposal.ts             ← 제안서 관련 Supabase 쿼리 함수

types/
  proposal.ts               ← 타입 정의
```

---

## [2] Supabase 테이블 (이미 생성되어 있다고 가정)

```sql
-- prospects 테이블 구조 (참고용, 코드에서 이 컬럼명 사용)
-- id: UUID (PK)
-- store_name: TEXT
-- store_url: TEXT
-- category: TEXT
-- owner_name: TEXT (nullable)
-- email: TEXT
-- review_count: INT
-- monthly_sales_tier: TEXT ('3천만+', '5천만+', '1억+')
-- pain_keywords: TEXT[]
-- status: TEXT ('new','email_sent','opened','visited','replied','meeting','closed','lost')
-- proposal_visited_at: TIMESTAMPTZ
-- proposal_visit_count: INT
-- created_at: TIMESTAMPTZ
```

---

## [3] 타입 정의 — `types/proposal.ts`

```typescript
export interface Prospect {
  id: string;
  store_name: string;
  store_url: string | null;
  category: string;
  owner_name: string | null;
  email: string;
  review_count: number;
  monthly_sales_tier: string;
  pain_keywords: string[] | null;
  status: string;
  proposal_visited_at: string | null;
  proposal_visit_count: number;
  created_at: string;
}

export interface AutomationScenario {
  pain: string;
  solution: string;
  timeSaved: number;      // 월간 시간 (시간 단위)
  monthlySaved: string;   // 비용 절감 설명
  icon: string;           // 이모지
}
```

---

## [4] 카테고리별 시나리오 매핑 데이터 — `lib/proposal-scenarios.ts`

아래 데이터를 그대로 사용. 셀러의 category 필드에 매칭되는 시나리오를 보여준다.
매칭 안 되면 'default'를 사용한다.

```typescript
import { AutomationScenario } from '@/types/proposal';

export const AUTOMATION_SCENARIOS: Record<string, AutomationScenario[]> = {
  '의류': [
    {
      pain: '상품 설명 작성에 건당 15~20분 소요',
      solution: 'AI가 상품 사진 + 키워드 기반 SEO 최적화 상세 설명 자동 생성',
      timeSaved: 40,
      monthlySaved: '인건비 약 80만원 절감',
      icon: '📝',
    },
    {
      pain: 'CS 문의 수동 응대 (사이즈·배송·교환)',
      solution: '반복 문의 90%를 AI 자동응답으로 즉시 처리',
      timeSaved: 30,
      monthlySaved: 'CS 인력 1명분 절감',
      icon: '💬',
    },
    {
      pain: '리뷰 하나하나 수동 답변 작성',
      solution: '리뷰 톤 분석 → 맞춤 감사 답변 AI 자동 생성',
      timeSaved: 15,
      monthlySaved: '리뷰 응답률 2배 → 전환율 상승',
      icon: '⭐',
    },
  ],
  '식품': [
    {
      pain: '상품 등록 반복 (유통기한·영양정보·설명)',
      solution: 'AI가 식품 카테고리 맞춤 상세페이지 자동 생성',
      timeSaved: 35,
      monthlySaved: '신상품 등록 속도 3배',
      icon: '📋',
    },
    {
      pain: 'CS 문의 (배송일·보관법·알레르기)',
      solution: '상품별 FAQ 기반 AI 자동응답',
      timeSaved: 25,
      monthlySaved: 'CS 비용 50% 절감',
      icon: '💬',
    },
    {
      pain: '재구매 유도 메시지 수동 작성',
      solution: '구매 이력 기반 개인화 재구매 알림 자동 발송',
      timeSaved: 10,
      monthlySaved: '재구매율 20% 상승 기대',
      icon: '🔁',
    },
  ],
  '뷰티': [
    {
      pain: '상품 상세 설명 + 성분 정보 작성',
      solution: 'AI가 성분·효능 기반 SEO 최적화 상세 설명 생성',
      timeSaved: 35,
      monthlySaved: '콘텐츠 외주비 월 60만원 절감',
      icon: '📝',
    },
    {
      pain: '피부 타입별 CS 문의 응대',
      solution: '성분·피부타입 매칭 AI 자동응답',
      timeSaved: 25,
      monthlySaved: 'CS 응대 시간 70% 절감',
      icon: '💬',
    },
    {
      pain: '리뷰 관리 (사진 리뷰 답변·부정 리뷰 대응)',
      solution: 'AI가 리뷰 감성 분석 후 톤에 맞는 답변 자동 생성',
      timeSaved: 15,
      monthlySaved: '리뷰 관리 시간 80% 절감',
      icon: '⭐',
    },
  ],
  '가전·디지털': [
    {
      pain: '스펙 비교표·상세 설명 작성',
      solution: 'AI가 제품 스펙 기반 비교표 + 상세 설명 자동 생성',
      timeSaved: 40,
      monthlySaved: '상품 등록 속도 4배',
      icon: '📊',
    },
    {
      pain: '기술 CS 문의 (호환성·사용법·AS)',
      solution: '제품 매뉴얼 기반 AI 기술 자동응답',
      timeSaved: 35,
      monthlySaved: 'CS 전문 인력 비용 절감',
      icon: '💬',
    },
    {
      pain: '제품 비교 콘텐츠 제작',
      solution: 'AI가 경쟁 제품 대비 장점 콘텐츠 자동 생성',
      timeSaved: 10,
      monthlySaved: '콘텐츠 마케팅 효율 2배',
      icon: '📈',
    },
  ],
  '가구·인테리어': [
    {
      pain: '공간별 연출 설명·사이즈 가이드 작성',
      solution: 'AI가 공간 타입별 맞춤 상세 설명 자동 생성',
      timeSaved: 35,
      monthlySaved: '콘텐츠 제작비 월 70만원 절감',
      icon: '📝',
    },
    {
      pain: '배송·설치·반품 CS 문의',
      solution: '대형 배송 FAQ 기반 AI 자동응답',
      timeSaved: 30,
      monthlySaved: 'CS 인력 1명분 절감',
      icon: '💬',
    },
    {
      pain: '리뷰 응대 (사진 리뷰 감사·불만 대응)',
      solution: 'AI 감성 분석 기반 맞춤 리뷰 답변',
      timeSaved: 15,
      monthlySaved: '고객 만족도 향상',
      icon: '⭐',
    },
  ],
  'default': [
    {
      pain: '상품 설명 작성에 건당 15~20분 소요',
      solution: 'AI 기반 SEO 최적화 상품 설명 자동 생성',
      timeSaved: 40,
      monthlySaved: '인건비 약 80만원 절감',
      icon: '📝',
    },
    {
      pain: 'CS 문의 수동 응대',
      solution: '반복 문의 90%를 AI 자동응답으로 처리',
      timeSaved: 30,
      monthlySaved: 'CS 인력 1명분 절감',
      icon: '💬',
    },
    {
      pain: '리뷰 수동 답변 작성',
      solution: '리뷰 톤 분석 후 맞춤 답변 자동 생성',
      timeSaved: 15,
      monthlySaved: '리뷰 응답률 2배 → 전환율 상승',
      icon: '⭐',
    },
  ],
};
```

---

## [5] Supabase 쿼리 함수 — `lib/supabase/proposal.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { Prospect } from '@/types/proposal';

export async function getProspect(id: string): Promise<Prospect | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Prospect;
}

export async function trackProposalView(prospect: Prospect): Promise<void> {
  const supabase = createClient();

  // 방문 로그 추가
  await supabase.from('proposal_views').insert({
    prospect_id: prospect.id,
  });

  // prospect 상태 업데이트
  await supabase
    .from('prospects')
    .update({
      proposal_visited_at: new Date().toISOString(),
      proposal_visit_count: (prospect.proposal_visit_count || 0) + 1,
      status: prospect.status === 'email_sent' ? 'visited' : prospect.status,
    })
    .eq('id', prospect.id);
}
```

---

## [6] 서버 컴포넌트 — `app/proposal/[id]/page.tsx`

```typescript
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProspect, trackProposalView } from '@/lib/supabase/proposal';
import ProposalContent from './ProposalContent';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const prospect = await getProspect(params.id);
  return {
    title: prospect
      ? `${prospect.store_name} 맞춤 AI 자동화 제안서 | OWNER ONE-TOOL`
      : 'AI 자동화 제안서 | OWNER ONE-TOOL',
    robots: 'noindex, nofollow',
  };
}

export default async function ProposalPage({ params }: Props) {
  const prospect = await getProspect(params.id);
  if (!prospect) return notFound();

  await trackProposalView(prospect);

  return <ProposalContent prospect={prospect} />;
}
```

---

## [7] 클라이언트 컴포넌트 — `app/proposal/[id]/ProposalContent.tsx`

### 디자인 요구사항

- O1T 기존 네비게이션/헤더/푸터 **사용하지 않음** (독립 랜딩)
- 배경: #F8F9FB
- 메인 컬러: #0052FF (O1T 기존 Primary)
- 최대 너비: 640px 중앙 정렬
- 모바일 퍼스트 반응형
- 폰트: O1T 기존 프로젝트 폰트 그대로 사용

### 페이지 섹션 구성 (순서 반드시 지킬 것)

**섹션 1: Hero**
- 배경: #0052FF → #002E99 그라디언트
- 상단 뱃지: "OWNER ONE-TOOL · 맞춤 AI 자동화 제안서" (반투명 pill)
- 메인 타이틀: "{store_name} 대표님, 매일 반복하는 업무를 AI로 자동화하세요"
  - "AI로 자동화" 부분만 #7EB8FF 색상
- 서브: "{category} 카테고리 · 리뷰 {review_count}개 스토어 분석 기반"

**섹션 2: 현재 예상 반복 작업 (Pain)**
- 헤더: "현재 예상 반복 작업"
- 서브: "{category} 카테고리 월매출 {monthly_sales_tier} 스토어 기준 분석"
- 카드: 흰색 라운드 카드, 상단에 빨간 배경 경고 바
  - "매월 약 {totalTimeSaved}시간을 반복 작업에 소모 중"
- 각 시나리오의 pain을 아이콘과 함께 리스트 표시
  - 하단에 "월 {timeSaved}시간 소요 추정" 회색 텍스트

**섹션 3: 전환 표시**
- 중앙에 파란 원형 화살표 ↓
- 아래에 "AI 자동화 적용" 텍스트

**섹션 4: 자동화 적용 후 (Solution)**
- 헤더: "자동화 적용 후 변화"
- 각 시나리오의 solution을 초록 배경 카드로 표시
  - 하단에 "⏱ 월 {timeSaved}시간 절약 | 💰 {monthlySaved}"
- 카드 클릭 시 약간의 확대 애니메이션 (선택적)

**섹션 5: 총 절감 효과 카드**
- 파란 그라디언트 카드, 중앙 정렬
- "예상 월간 절감 효과"
- 큰 숫자: "{totalTimeSaved}시간+"
- "매월 반복 업무에서 해방"

**섹션 6: 맞춤 자동화 패키지**
- 헤더: "맞춤 자동화 패키지"
- 파란 테두리 카드, 상단 파란 배경 헤더
  - "추천 패키지" 뱃지 + "스마트스토어 AI 자동화 세팅"
- 포함 항목 체크리스트:
  - GPT 기반 상품 설명 자동생성 시스템 구축
  - CS 자동응답 챗봇 세팅 (카카오톡/네이버톡톡)
  - 리뷰 자동 응답 시스템 세팅
  - 1주일 운영 지원 및 최적화
  - 사용 매뉴얼 제공
- 가격: "200만원" 큰 글씨 + "VAT 별도 · 7일 세팅" 회색
- 하단: "계약금 50% 선입금 → 세팅 완료 후 잔금 50%"

**섹션 7: 얼리어답터 혜택 (사회적 증거 대신)**
- 다크 배경 카드 (#1a1a2e)
- "3월 한정 · 첫 5곳 특별가"
- "200만원 → 150만원 (25% 할인)"
- "세팅 완료 후 만족하지 않으시면 100% 환불"
- 남은 자리: "잔여 O석" (동적으로 바뀌지 않아도 됨, 고정 3 또는 2)

**섹션 8: CTA**
- 다크 배경 라운드 카드
- "무료 상담으로 시작하세요"
- "{store_name} 스토어에 맞는 자동화 방안을 15분 무료 통화로 안내드립니다"
- 버튼: "무료 상담 신청하기" → 클릭 시 새 탭으로 /diagnosis?from=proposal&store={store_name} 열기
- 버튼 클릭 후 "✅ 신청 완료!" 로 변경
- 하단: "부담 없이 편하게 신청하세요. 영업 전화 없습니다."

**섹션 9: 미니 푸터**
- 중앙 정렬, 작은 텍스트
- "OWNER ONE-TOOL | ETERNAL SIX"
- "AI 기반 업무 자동화 컨설팅"

### 인터랙션

- 스크롤 시 섹션별 fade-in 애니메이션 (Intersection Observer 사용)
- CTA 버튼 hover 시 scale(1.03) 트랜지션
- Solution 카드 클릭 시 border 색상 변경 (활성화 효과)

### 데이터 흐름

- `prospect` 데이터를 props로 받음
- `AUTOMATION_SCENARIOS`에서 prospect.category로 매칭
- totalTimeSaved = 각 시나리오 timeSaved 합산

---

## [8] 로딩 — `app/proposal/[id]/loading.tsx`

- 회색 스켈레톤 UI
- Hero 영역 높이 유지 + 본문 카드 3개 스켈레톤
- O1T 기존 로딩 패턴이 있으면 그대로 따르기

---

## [9] 404 — `app/proposal/[id]/not-found.tsx`

- 심플한 중앙 정렬 메시지
- "제안서를 찾을 수 없습니다"
- "링크가 만료되었거나 잘못된 주소입니다."
- 버튼: "홈으로 돌아가기" → /

---

## [10] Supabase 연결 주의사항

- 프로젝트에 이미 Supabase 클라이언트가 세팅되어 있다면 그대로 사용
- 아직 없다면 `@supabase/supabase-js` 설치하고 기존 O1T 패턴에 맞게 세팅
- ENV 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- proposal_views 테이블이 없어도 에러 나지 않게 try-catch 감싸기

---

## [11] 빌드 검증

```bash
npm run build
# 0 errors, 0 warnings 확인
# /proposal/[id] 동적 라우트 정상 생성 확인
```

---

## 요약

1. `types/proposal.ts` — 타입 정의
2. `lib/proposal-scenarios.ts` — 카테고리별 시나리오 데이터
3. `lib/supabase/proposal.ts` — DB 쿼리 함수
4. `app/proposal/[id]/page.tsx` — SSR 서버 컴포넌트
5. `app/proposal/[id]/ProposalContent.tsx` — 클라이언트 UI 컴포넌트
6. `app/proposal/[id]/loading.tsx` — 로딩 스켈레톤
7. `app/proposal/[id]/not-found.tsx` — 404 페이지

기존 O1T 프로젝트 코드 스타일, 컴포넌트 패턴, TailwindCSS 설정을 그대로 따르되,
/proposal 페이지는 독립 랜딩으로 기존 레이아웃(헤더/푸터)을 사용하지 않는다.
