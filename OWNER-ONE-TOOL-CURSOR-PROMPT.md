# OWNER ONE-TOOL (O1T) — Cursor 프로덕션 빌드 프롬프트

> **이 문서는 Cursor AI에 붙여넣어 프로젝트를 한 번에 빌드하기 위한 마스터 프롬프트입니다.**

---

## 역할 정의

너는 시니어 SaaS 풀스택 아키텍트이자 SEO 엔지니어다.
ETERNAL SIX 산하 SaaS **"OWNER ONE-TOOL"** 공식 웹사이트를
`https://owneronetool.com` 도메인 기준으로
**Next.js 14 (App Router) + TypeScript** 기반 프로덕션 수준으로 구축한다.

---

## 절대 조건 (위반 시 전체 재작업)

- placeholder 문구 금지 (Lorem ipsum, "여기에 내용", TBD 등 일절 금지)
- TODO 금지 (DB 교체 포인트 주석만 허용)
- `console.error` 0개
- `lint error` 0개
- `build error` 0개
- `TypeScript error` 0개
- 미완성 컴포넌트 금지
- 모든 파일은 실제 프로덕션 배포 가능한 완성 상태여야 한다

---

## [0] 기술 스택

| 항목 | 스택 |
|------|------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict: true) |
| Styling | TailwindCSS |
| Validation | Zod |
| Payment | Toss Payments SDK (정기결제 빌링 + 가상계좌) |
| AI Parsing | OpenAI API (gpt-4o-mini) — 채팅 복붙 → 고객 데이터 자동 추출 |
| Deploy | Vercel |
| Image | next/image 사용 |
| Rendering | Server Components 우선, 필요한 곳만 'use client' |
| SEO | 완전 적용 (메타데이터, JSON-LD, sitemap, robots, 200개 키워드 랜딩) |

```
Base URL: https://owneronetool.com
```

### ENV 변수 (.env.local)

```env
NEXT_PUBLIC_SITE_URL=https://owneronetool.com
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_XXXXXX
TOSS_SECRET_KEY=test_sk_XXXXXX
OPENAI_API_KEY=sk-XXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=구글서치콘솔_인증코드
NEXT_PUBLIC_NAVER_VERIFICATION=네이버서치어드바이저_인증코드
```

---

## [1] 브랜드 컨텍스트

| 항목 | 값 |
|------|-----|
| 모회사 | ETERNAL SIX |
| 제품명 | OWNER ONE-TOOL (O1T) |
| 핵심 슬로건 | "사장님을 위한 단 하나의 운영툴" |
| Primary Color | `#0052FF` (파란색) |
| Background | `#F9FAFB` |
| Foreground | `#111827` |
| 타겟 | 자영업자, 소상공인, 1인 사업자, 무인매장 운영자, 학원 원장, 뷰티샵 등 |

### 톤 & 매너

- B2B SaaS 신뢰감
- 직관적이고 깔끔한 표현
- 과한 마케팅 문구 금지 ("혁신적인!", "놀라운!" 등 사용 금지)
- 사장님의 실제 고충에 공감하는 현실적 톤

### 로고

- 로고 아이콘: 숫자 "1"과 건물/매장 형태를 결합한 네이비(#1B2A4A) 컬러 심볼
- 워드마크: "OWNER" (다크그레이) + "ONE-" (Primary Blue #0052FF) + "TOOL" (다크그레이)
- `/public/logo.png` — 워드마크 포함 가로형 로고
- `/public/logo-icon.png` — 심볼 아이콘만

---

## [2] 필수 페이지 구조 & 라우팅

### 정적 페이지 (6개)

| 경로 | 설명 |
|------|------|
| `/` | 홈 — Hero, PainPoints, SolutionSteps, Features, CTA 섹션 |
| `/solution` | 솔루션 소개 — 도입 4단계 (데이터 마이그레이션→채널통합→자동화→최적화) |
| `/pricing` | 가격 — Starter 29,000원 / Pro 59,000원 / Enterprise 별도문의 |
| `/diagnosis` | 무료 진단 폼 — 이메일 + 유입경로 수집 |
| `/faq` | FAQ — 최소 5개 이상 질문/답변, JSON-LD FAQPage 포함 |
| `/o1t` | 제품 상세 랜딩 — 대시보드, CRM, 예약자동화 기능 상세 |

### 동적 페이지 — 키워드 랜딩 200개

| 경로 | 설명 |
|------|------|
| `/landing/[slug]` | 업종별 롱테일 키워드 SEO 랜딩 페이지 |

`generateStaticParams()`로 빌드 타임 정적 생성 (SSG).
`lib/seo-keywords.ts`에 200개 키워드 데이터 배열 관리.

---

## [3] SEO 완전 구현 명세

### 3-1. 글로벌 메타데이터 (app/layout.tsx)

```typescript
metadata: {
  metadataBase: new URL(SITE_URL),
  title: { default: 'OWNER ONE-TOOL | 자영업자 올인원 원툴 SaaS', template: '%s | OWNER ONE-TOOL' },
  description: '...',
  alternates: { canonical: SITE_URL },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: { 'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_VERIFICATION }
  },
  openGraph: { ... },
  twitter: { card: 'summary_large_image', ... },
}
```

### 3-2. JSON-LD (3종 필수)

1. **Organization** — layout.tsx에 글로벌 삽입
   ```json
   { "@type": "Organization", "name": "ETERNAL SIX", "url": "https://owneronetool.com" }
   ```

2. **SoftwareApplication** — layout.tsx에 글로벌 삽입
   ```json
   { "@type": "SoftwareApplication", "name": "OWNER ONE-TOOL", "applicationCategory": "BusinessApplication", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" } }
   ```

3. **FAQPage** — /faq 페이지 전용
   ```json
   { "@type": "FAQPage", "mainEntity": [...] }
   ```

4. **WebPage** — /landing/[slug] 각 동적 페이지별 고유 JSON-LD

### 3-3. sitemap.ts — 자동 생성

- 정적 라우트 6개 + 동적 랜딩 200개 = 총 206개 URL
- `landingKeywords` 배열에서 자동 매핑
- 홈 priority 1.0, 정적 페이지 0.8, 랜딩 0.7

### 3-4. robots.ts

```typescript
rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
sitemap: `${baseUrl}/sitemap.xml`
```

### 3-5. 네이버 봇(Yeti) 대응

- `generateStaticParams()` 사용으로 완전한 정적 HTML 생성 (JS 렌더링 불필요)
- 네이버 서치어드바이저 메타 태그 인증 적용

---

## [4] 200개 키워드 랜딩 시스템

### 4-1. 키워드 데이터 구조

`lib/seo-keywords.ts`:

```typescript
export interface SeoKeyword {
  slug: string;       // URL 경로 (예: 'party-room-reservation')
  title: string;      // H1 및 메타 타이틀 (예: '파티룸 예약 관리')
  industry: string;   // 업종 분류 (예: '파티룸')
  painPoint: string;  // 고충 (예: '자정 넘어서 오는 문의와 겹치는 스케줄')
  benefit: string;    // 해결 혜택 (예: '100% 무인 예약 자동화')
}
```

### 4-2. 업종별 키워드 최소 200개 (아래 업종을 커버)

| 업종 | 예시 키워드 slug |
|------|------------------|
| 파티룸 | party-room-reservation, party-room-crm, party-room-noshow, party-room-automation, party-room-booking-system, party-room-customer-management, party-room-schedule, party-room-pricing, party-room-review-management, party-room-multi-branch |
| 렌탈스튜디오 | rental-studio-crm, rental-studio-booking, rental-studio-schedule, rental-studio-customer-management, rental-studio-automation, rental-studio-payment, rental-studio-noshow, rental-studio-pricing, rental-studio-review, rental-studio-multi-branch |
| 학원/교육 | academy-crm, academy-attendance, academy-parent-communication, academy-schedule, academy-enrollment, academy-billing, academy-student-management, academy-tutor-management, academy-curriculum, academy-report |
| 뷰티/헤어샵 | salon-booking-system, salon-designer-schedule, salon-customer-crm, salon-noshow-prevention, salon-review-management, salon-membership, salon-product-inventory, salon-staff-management, salon-promotion, salon-multi-branch |
| 무인매장 | unmanned-store-automation, unmanned-store-remote-management, unmanned-store-access-control, unmanned-store-cctv, unmanned-store-payment, unmanned-store-cs, unmanned-store-inventory, unmanned-store-pricing, unmanned-store-multi-branch, unmanned-store-dashboard |
| 카페/음식점 | cafe-reservation, cafe-crm, cafe-pos-integration, cafe-staff-schedule, cafe-inventory, restaurant-booking, restaurant-crm, restaurant-waitlist, restaurant-table-management, restaurant-review |
| 네일/속눈썹 | nail-shop-booking, nail-shop-crm, nail-shop-designer-schedule, nail-shop-noshow, nail-shop-membership, eyelash-booking, eyelash-crm, eyelash-customer-management, eyelash-schedule, eyelash-review |
| 피트니스/PT | gym-membership-management, gym-pt-schedule, gym-crm, gym-attendance, gym-billing, pt-booking-system, pt-customer-management, pt-schedule, pt-payment, pt-multi-trainer |
| 병원/의원 | clinic-reservation, clinic-crm, clinic-patient-management, clinic-schedule, clinic-billing, clinic-review, clinic-waitlist, clinic-recall, clinic-automation, clinic-multi-branch |
| 숙박/펜션 | pension-booking, pension-crm, pension-schedule, pension-pricing, pension-review, pension-automation, pension-customer-management, pension-noshow, pension-multi-branch, pension-channel-management |
| 공유오피스 | coworking-space-booking, coworking-crm, coworking-membership, coworking-meeting-room, coworking-billing, coworking-access, coworking-multi-branch, coworking-schedule, coworking-customer, coworking-automation |
| 반려동물 | pet-grooming-booking, pet-hotel-reservation, pet-crm, pet-customer-management, pet-schedule, pet-vaccination-tracking, pet-billing, pet-review, pet-multi-branch, pet-automation |
| 세차/차량관리 | car-wash-booking, car-wash-crm, car-wash-membership, car-wash-schedule, car-wash-automation, car-detailing-booking, car-detailing-crm, car-detailing-schedule, car-detailing-customer, car-detailing-review |
| 꽃집/플로리스트 | flower-shop-order, flower-shop-crm, flower-shop-delivery, flower-shop-schedule, flower-shop-customer, flower-shop-inventory, flower-shop-automation, flower-shop-review, flower-shop-membership, flower-shop-billing |
| 사진관/스튜디오 | photo-studio-booking, photo-studio-crm, photo-studio-schedule, photo-studio-customer, photo-studio-package, photo-studio-review, photo-studio-automation, photo-studio-pricing, photo-studio-gallery, photo-studio-multi-branch |
| 세탁소/수선 | laundry-order-management, laundry-crm, laundry-pickup-delivery, laundry-schedule, laundry-customer, laundry-automation, laundry-billing, laundry-review, laundry-membership, laundry-multi-branch |
| 부동산 | real-estate-crm, real-estate-customer-management, real-estate-listing, real-estate-schedule, real-estate-automation, real-estate-lead-management, real-estate-review, real-estate-billing, real-estate-multi-branch, real-estate-communication |
| 키즈카페 | kids-cafe-booking, kids-cafe-crm, kids-cafe-schedule, kids-cafe-customer, kids-cafe-membership, kids-cafe-party-booking, kids-cafe-automation, kids-cafe-review, kids-cafe-pricing, kids-cafe-multi-branch |
| 골프연습장 | golf-range-booking, golf-range-crm, golf-range-membership, golf-range-schedule, golf-range-lesson, golf-range-automation, golf-range-billing, golf-range-customer, golf-range-review, golf-range-multi-branch |
| 필라테스/요가 | pilates-booking, pilates-crm, pilates-schedule, pilates-membership, pilates-instructor, pilates-automation, yoga-booking, yoga-crm, yoga-schedule, yoga-membership |

**→ 위 업종 20개 × 10개 slug = 200개 키워드 완성**

각 키워드에 대해 `title`(한글), `industry`(한글), `painPoint`(한글 2문장), `benefit`(한글 1문장)을 반드시 채워서 작성할 것.

### 4-3. 동적 랜딩 페이지 구조

`app/landing/[slug]/page.tsx`:

- `generateStaticParams()` — 200개 slug 빌드 타임 생성
- `generateMetadata()` — 키워드별 고유 title, description, canonical, OpenGraph
- 페이지 본문 구조:
  1. Hero 섹션: `{industry} 전용 솔루션` 뱃지 + `{title}` H1 + `{painPoint}` 설명
  2. 3가지 변화 섹션: 키워드와 연계된 혜택 3개
  3. CTA: `내 {industry} 맞춤형 무료 진단받기` → `/diagnosis` 링크
- JSON-LD `WebPage` 삽입

### 4-4. 내부 링크 거미줄 아키텍처

Footer에서 `landingKeywords`를 `industry` 기준으로 그룹화하여
**업종별 솔루션 탐색** 섹션으로 200개 링크를 자동 렌더링.
→ 고립 페이지(Orphan Pages) 방지, PageRank 분산.

---

## [5] UI 섹션 컴포넌트

### 5-1. 경로: `components/sections/`

| 컴포넌트 | 내용 |
|----------|------|
| `Hero.tsx` | "엑셀·카톡·예약앱 따로 쓰지 마세요. OWNER ONE-TOOL 하나면 끝." + CTA 버튼 |
| `PainPoints.tsx` | 4가지 고충: 예약관리 분산, 고객정보 흩어짐, 일정 혼란, 수기 관리 |
| `SolutionSteps.tsx` | 3단계: ①예약 자동화 ②CRM 생성 ③운영 통합 |
| `Features.tsx` | 4가지 기능: 통합 대시보드, 고객관리, 일정관리, 자동 알림 |
| `CTA.tsx` | "무료 진단 시작하기" → `/diagnosis` 링크 |

### 5-2. 레이아웃 컴포넌트: `components/layout/`

| 컴포넌트 | 내용 |
|----------|------|
| `Header.tsx` | 로고 + 네비게이션 (홈, 솔루션, 가격, FAQ, 무료진단) + 모바일 햄버거 메뉴 |
| `Footer.tsx` | 회사정보 + 서비스링크 + 고객지원링크 + **업종별 SEO 내부 링크 200개** + 카피라이트 |
| `ResponsiveLayout.tsx` | 데스크탑: 사이드바 / 모바일: 하단 탭바 (대시보드용) |

---

## [6] 반응형 디자인 — 데스크탑 + 모바일

### 원칙

- 하나의 코드베이스, URL 분리 없음
- Tailwind 브레이크포인트(`md:`, `lg:`)로 기기별 최적화
- **데스크탑**: 넓은 그리드, 사이드 네비게이션
- **모바일**: 하단 탭바(Bottom Navigation), 카드형 리스트, 풀스크린 모달

### 모바일 최적화 사항

- 터치 친화적 버튼 크기 (최소 44px)
- `safe-area-inset-bottom` 대응 (iPhone 하단바)
- `-webkit-tap-highlight-color: transparent`
- 입력 폼 줌 방지 (`font-size: 16px` 이상)
- 플로팅 액션 버튼 (빠른 고객 등록)

### PWA 지원

- `manifest.json` 생성 (앱 이름, 아이콘, 테마 컬러)
- 홈 화면 추가 시 브라우저 주소창 없이 앱처럼 표시

---

## [7] API 엔드포인트

### 7-1. 리드 수집

```
POST /api/leads
Body: { email: string, source: string }
```

- Zod validation 필수
- 서버리스 환경 고려, 임시 메모리 저장
- DB 교체 포인트 주석: `// DB 교체 포인트: Prisma, Supabase 등 연동`

### 7-2. 결제 — Toss Payments

기존 UTE Space(파티룸) 토스페이먼츠 가맹점 계약 활용.

#### 정기결제(빌링) 플로우

```
POST /api/payment/billing/request   → 카드 등록 (빌링키 발급)
POST /api/payment/billing/approve   → 자동 결제 승인
POST /api/payment/webhook           → 결제 상태 변경 알림
```

#### 가상계좌 플로우

```
POST /api/payment/virtual-account   → 가상계좌 발급
POST /api/payment/webhook           → 입금 확인 알림 → 구독 활성화
```

#### 결제 성공/실패 콜백

```
GET /api/payment/success?orderId=...&paymentKey=...&amount=...
GET /api/payment/fail?code=...&message=...
```

- Toss Payments SDK: `@tosspayments/payment-sdk`
- 클라이언트: `loadTossPayments(clientKey)` → `requestPayment()`
- 서버: Secret Key로 결제 승인 API 호출
- Webhook: 가상계좌 입금 시 구독 상태 자동 업데이트

### 7-3. AI 채팅 파싱 — 고객 데이터 자동 추출

```
POST /api/parse-customer
Body: { rawText: string }
Response: { name, phone, date, people, notes, status }
```

#### 기능 상세

사장님이 카톡/문자/DM 대화를 **무지성으로 복붙 또는 캡쳐 텍스트**를 입력하면:

1. OpenAI API (gpt-4o-mini)가 비정형 텍스트를 파싱
2. 구조화된 고객 데이터 JSON으로 변환
3. 고객 명단에 자동 정리

#### 추출 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string \| null | 고객 이름 |
| phone | string \| null | 연락처 |
| date | string \| null | 예약 날짜/시간 (ISO 형식 변환) |
| people | number \| null | 예약 인원 |
| notes | string \| null | 특이사항 (알러지, 요청사항 등) |
| status | enum | '예약대기' \| '확정' \| '문의' |

#### 시스템 프롬프트

```
너는 고객 관리 전문가야.
고객과의 대화 내용이나 캡처 텍스트가 들어오면
다음 항목을 추출해서 JSON 형식으로 응답해줘.
필드: 이름(name), 연락처(phone), 예약날짜(date), 예약인원(people), 특이사항(notes), 상태(status: '예약대기'|'확정'|'문의').
만약 정보가 없으면 null로 표기해.
"내일", "이번 주 토요일" 같은 상대 날짜는 오늘 기준 ISO 날짜로 변환해.
```

#### UI: 무지성 복붙 퀵 액션

- `components/customer/QuickAdd.tsx` — 텍스트 영역에 붙여넣기 시 자동 파싱
- 파싱 결과를 미리보기로 보여주고 사장님이 확인 후 저장
- 모바일: 플로팅 (+) 버튼 → 풀스크린 모달로 복붙 입력

#### Server Action 구현

```typescript
'use server';
import OpenAI from 'openai';

export async function parseCustomerChat(rawText: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: '(위 시스템 프롬프트)' },
      { role: 'user', content: rawText }
    ],
    response_format: { type: 'json_object' }
  });
  return JSON.parse(response.choices[0].message.content!);
}
```

---

## [8] Pricing 플랜 상세

| 플랜 | 대상 | 월 가격 | 기능 |
|------|------|---------|------|
| Starter | 1인 매장, 초기 창업자 | 29,000원 | 통합 캘린더 2개, 기본 고객관리 500명, 이메일 지원 |
| Pro (추천) | 직원 있는 중소형 매장 | 59,000원 | 무제한 캘린더, 무제한 고객, 알림톡 자동발송, 매출분석 대시보드 |
| Enterprise | 다중 지점, 프랜차이즈 | 별도 문의 | 다중 지점 통합, 직원별 권한, 전담 매니저, 커스텀 API |

- Pro 플랜에 "가장 많이 선택하는 플랜" 뱃지 표시
- 모든 플랜 CTA → `/diagnosis`
- Enterprise CTA → "도입 문의하기"

---

## [9] FAQ 데이터 (최소 5개)

1. **기존 예약 데이터 이전 방법** — 엑셀 업로드 1분 만에 통합 가능
2. **여러 매장 동시 관리** — 프리미엄 플랜 이상 다중 지점 지원
3. **카톡/문자 복붙으로 고객 등록이 된다고요?** — AI가 자동으로 이름, 연락처, 예약일시 추출하여 명단에 정리
4. **결제 수단은 무엇이 있나요?** — 신용카드 정기결제, 가상계좌(무통장입금), 계좌이체 지원
5. **무료 체험 기간이 있나요?** — 14일 무료 체험 후 유료 전환, 약정 없이 언제든 해지 가능
6. **데이터는 안전한가요?** — AWS 기반 클라우드 서버, SSL 암호화, 일일 자동 백업
7. **기술 지원은 어떻게 받나요?** — Starter는 이메일, Pro는 채팅, Enterprise는 전담 매니저

---

## [10] 성능 & 접근성

- 모든 인터랙티브 요소에 `aria-label` 필수
- keyboard navigation 지원 (Tab, Enter, Escape)
- 이미지 `next/image` lazy load
- 불필요한 클라이언트 JS 최소화
- Lighthouse 성능 점수 90+ 목표
- `<html lang="ko">` 필수

---

## [11] 파일 구조 (전체)

```
owner-one-tool/
├── app/
│   ├── layout.tsx                    # 글로벌 레이아웃 + JSON-LD + 메타데이터
│   ├── globals.css                   # Tailwind + 글로벌 스타일
│   ├── page.tsx                      # 홈 (/, Hero+PainPoints+SolutionSteps+Features+CTA)
│   ├── solution/
│   │   └── page.tsx                  # 솔루션 소개
│   ├── pricing/
│   │   └── page.tsx                  # 가격 (3 플랜)
│   ├── diagnosis/
│   │   └── page.tsx                  # 무료 진단 폼
│   ├── faq/
│   │   └── page.tsx                  # FAQ + FAQPage JSON-LD
│   ├── o1t/
│   │   └── page.tsx                  # 제품 상세 랜딩
│   ├── landing/
│   │   └── [slug]/
│   │       └── page.tsx              # 200개 키워드 동적 랜딩
│   ├── api/
│   │   ├── leads/
│   │   │   └── route.ts             # POST 리드 수집
│   │   ├── parse-customer/
│   │   │   └── route.ts             # POST AI 채팅 파싱
│   │   └── payment/
│   │       ├── billing/
│   │       │   ├── request/route.ts  # 빌링키 발급
│   │       │   └── approve/route.ts  # 정기결제 승인
│   │       ├── virtual-account/
│   │       │   └── route.ts          # 가상계좌 발급
│   │       ├── success/route.ts      # 결제 성공 콜백
│   │       ├── fail/route.ts         # 결제 실패 콜백
│   │       └── webhook/route.ts      # 토스 웹훅 (입금확인 등)
│   ├── sitemap.ts                    # 206개 URL 자동 생성
│   └── robots.ts                     # 크롤러 접근 규칙
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # 네비게이션 + 모바일 햄버거
│   │   ├── Footer.tsx                # 회사정보 + SEO 내부 링크 200개
│   │   ├── ResponsiveLayout.tsx      # 데스크탑 사이드바 / 모바일 하단탭
│   │   ├── Sidebar.tsx               # 데스크탑 사이드바 메뉴
│   │   ├── BottomNav.tsx             # 모바일 하단 탭바
│   │   └── TopHeader.tsx             # 상단 헤더 (대시보드용)
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── PainPoints.tsx
│   │   ├── SolutionSteps.tsx
│   │   ├── Features.tsx
│   │   └── CTA.tsx
│   ├── customer/
│   │   └── QuickAdd.tsx              # 무지성 복붙 → AI 파싱 → 명단 등록
│   ├── payment/
│   │   └── PaymentButton.tsx         # 토스 결제 버튼
│   └── DiagnosisForm.tsx             # 진단 폼 (클라이언트)
├── lib/
│   └── seo-keywords.ts              # 200개 키워드 데이터 배열
├── public/
│   ├── logo.png                      # 워드마크 포함 가로형 로고
│   ├── logo-icon.png                 # 심볼 아이콘만
│   └── manifest.json                 # PWA 매니페스트
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── .eslintrc.json
└── .env.local
```

---

## [12] 품질 체크 (반드시 전부 통과)

```bash
npm run lint        # 0 errors
npm run typecheck   # 0 errors (tsc --noEmit)
npm run build       # 0 errors
```

문제 발생 시 원인 수정 후 다시 빌드.
에러를 무시하는 eslint-disable, @ts-ignore 등 금지.

---

## [13] package.json 의존성

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zod": "^3.23.0",
    "@tosspayments/payment-sdk": "^2.0.0",
    "openai": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## [14] 실행 순서 요약

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# → 실제 키 입력

# 3. 개발 서버
npm run dev

# 4. 품질 검증
npm run lint
npm run typecheck
npm run build

# 5. 프로덕션 실행
npm run start
```

---

## [15] 핵심 요약 — 반드시 구현해야 할 것

1. ✅ Next.js 14 App Router + TypeScript strict
2. ✅ 정적 페이지 6개 (/, /solution, /pricing, /diagnosis, /faq, /o1t)
3. ✅ 동적 키워드 랜딩 200개 (/landing/[slug]) + SSG
4. ✅ SEO 완전체 (metadata, OG, Twitter, canonical, JSON-LD 4종, sitemap 206개, robots)
5. ✅ 네이버/구글 검색엔진 인증 메타태그
6. ✅ 내부 링크 거미줄 (Footer에서 200개 랜딩 자동 링크)
7. ✅ 토스페이먼츠 정기결제(빌링) + 가상계좌 연동
8. ✅ AI 채팅 파싱 (카톡 복붙 → 고객 명단 자동 정리)
9. ✅ 반응형 (데스크탑: 사이드바 / 모바일: 하단 탭바 + PWA)
10. ✅ /api/leads Zod 기반 리드 수집
11. ✅ 접근성 (aria-label, keyboard nav)
12. ✅ 빌드 에러 0, 린트 에러 0, 타입 에러 0

---

**이 프롬프트 전체를 Cursor에 입력하고 빌드를 시작하라.**
**모든 코드는 완성 상태로 생성하라. 미완성, placeholder, TODO는 존재하지 않아야 한다.**
