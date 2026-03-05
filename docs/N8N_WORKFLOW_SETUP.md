# n8n 워크플로우 세팅 가이드 (JSON 생성 엔진)

프론트엔드(`/proposal/[id]`)가 준비되었으므로, n8n에서 셀러 데이터를 받아 GPT로 제안서 JSON을 생성 → Supabase 저장 → 콜드메일 발송까지 무인 파이프라인을 구성하는 방법입니다.

---

## 1. 전체 흐름 (4 Step)

| 순서 | 노드 | 역할 |
|------|------|------|
| 1 | **Trigger** | 웹훅(Webhook) 또는 Google Sheets (셀러 리스트 업데이트 시 실행) |
| 2 | **OpenAI (Chat)** | GPT-4o-mini로 셀러 정보 기반 제안서 JSON 생성 |
| 3 | **Supabase** | Upsert로 `proposals` 테이블에 JSON 저장 |
| 4 | **Gmail / SMTP** | 생성된 링크 `onetooler.kr/proposal/[id]` 포함해 콜드메일 발송 |

---

## 2. Step 1 — Trigger 노드

### 옵션 A: Webhook

- **Trigger** → **Webhook** 선택
- HTTP Method: `POST`
- 경로: 예) `/proposal-generate` (원하는 경로로 설정)
- Body에 셀러 정보가 오도록 API 호출 측과 약속

**예시 Body (JSON):**

```json
{
  "store_name": "OO스토어",
  "store_url": "https://smartstore.naver.com/...",
  "category": "의류",
  "owner_name": "홍길동",
  "email": "seller@example.com",
  "review_count": 1200,
  "monthly_sales_tier": "5천만+"
}
```

- Webhook이 한 번 실행될 때 **prospect 1건 생성/확인 후** 그 `id`를 다음 단계로 넘기는 구성이 필요합니다.  
  (아래 Supabase 단계에서 `prospects` 먼저 Insert/Select한 뒤 `proposal` Upsert와 이어주면 됩니다.)

### 옵션 B: Google Sheets

- **Trigger** → **Google Sheets** → **Row Added** 또는 **Row Updated**
- 스프레드시트에서 셀러 리스트 시트 지정
- 컬럼 매핑: 스토어명, 카테고리, 이메일 등 → 다음 노드로 전달

---

## 3. Step 2 — OpenAI (Chat) 노드

### 3.1 기본 설정

- **Model**: `gpt-4o-mini` (비용·속도 균형 추천)
- **Response Format**: **JSON Object** 로 반드시 설정 (마크다운 없이 순수 JSON만 받기 위함)

### 3.2 System Message (그대로 복사해 넣기)

```
너는 스마트스토어 및 온라인 쇼핑몰 오너의 운영 효율을 극대화하는 SaaS '원툴러(onetooler.kr)'의 자동화 제안서 작성 AI야.
제공되는 셀러 정보(스토어명, 카테고리 등)를 바탕으로 아래 JSON 스키마에 정확히 맞춰서 맞춤형 제안서 카피를 생성해 줘.
반드시 마크다운이나 다른 설명 없이 순수한 JSON 데이터만 반환해야 해.

[출력 JSON 구조]
{
  "hero": {
    "headline": "[스토어명] 대표님을 위한 맞춤 자동화 제안",
    "sub_headline": "[카테고리] 상위 1% 셀러들이 이미 원툴러로 해결한 업무 절감 리포트"
  },
  "before_after": {
    "current_hours": (카테고리를 고려해 15~30 사이의 정수로 추정),
    "saved_hours": (current_hours의 20~30% 수준의 정수로 추정),
    "pain_points": [
      "[카테고리]에 맞는 구체적인 수동 업무 1",
      "[카테고리]에 맞는 구체적인 수동 업무 2",
      "[카테고리]에 맞는 구체적인 수동 업무 3"
    ]
  },
  "solutions": [
    {
      "title": "솔루션 제목 1",
      "description": "솔루션 설명 1"
    },
    {
      "title": "솔루션 제목 2",
      "description": "솔루션 설명 2"
    },
    {
      "title": "솔루션 제목 3",
      "description": "솔루션 설명 3"
    }
  ],
  "cta": {
    "message": "지금 운영 방식을 기준으로 원툴러의 무료 진단을 받아보세요.",
    "button_text": "무료 자동화 진단 받기"
  }
}
```

### 3.3 User Message (트리거/이전 노드 데이터 참조)

- Trigger 또는 이전 노드에서 넘어온 **셀러 정보**를 문자열로 조합해 User Message에 넣습니다.

**예시 (n8n 표현식):**

```text
아래 셀러 정보를 바탕으로 제안서 JSON을 생성해 줘.

스토어명: {{ $json.store_name }}
카테고리: {{ $json.category }}
월매출 구간: {{ $json.monthly_sales_tier }}
리뷰 수: {{ $json.review_count }}
```

- Google Sheets 사용 시: 시트 컬럼명에 맞게 `{{ $json["스토어명"] }}` 등으로 매핑하면 됩니다.

---

## 4. Step 3 — Supabase 노드

### 4.1 `proposals` 테이블 스키마 (미리 생성)

n8n에서 Upsert하려면 아래 테이블이 있어야 합니다. Supabase SQL Editor에서 실행하세요.

```sql
-- proposals: GPT가 생성한 제안서 JSON 저장 (1 prospect = 1 proposal)
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(prospect_id)
);

CREATE INDEX IF NOT EXISTS idx_proposals_prospect_id ON proposals(prospect_id);
```

- **prospect_id**: `prospects` 테이블의 `id`. 워크플로에서 prospect를 먼저 Insert하거나 기존 행을 조회해 얻은 ID를 사용합니다.
- **content**: OpenAI 노드에서 나온 전체 JSON 객체를 그대로 저장합니다.

### 4.2 워크플로 순서 (prospect → proposal)

1. **Trigger**에서 셀러 정보 수신
2. **Supabase – Insert (prospects)**  
   - 테이블: `prospects`  
   - 새 행이면 Insert, 이미 있으면 Skip 또는 **Supabase – Get by prospect_id** 등으로 `id` 확보
3. **OpenAI** 노드에서 위 System/User Message로 JSON 생성
4. **Supabase – Upsert (proposals)**  
   - 테이블: `proposals`  
   - **Conflict Key**: `prospect_id`  
   - **Rows**:  
     - `prospect_id`: 이전 단계에서 확보한 `prospects.id`  
     - `content`: OpenAI 노드 출력(JSON)  
     - `updated_at`: `now()` 또는 n8n 표현식

n8n Supabase 노드에서:

- **Operation**: Upsert
- **Table**: `proposals`
- **Columns** (또는 필드 매핑):
  - `prospect_id` ← 이전 노드의 prospect `id`
  - `content` ← OpenAI 노드의 JSON 출력 (객체 전체)

### 4.3 참고: prospects 먼저 채우기

- Webhook/Sheets에서 넘어온 데이터로 `prospects`에 **Insert** 한 뒤, 반환된 `id`를 사용하거나,
- 이메일 등으로 기존 prospect를 **Select**해서 `id`를 가져와도 됩니다.

---

## 5. Step 4 — Gmail / SMTP 노드

- **To**: 셀러 이메일 (Trigger/Sheets에서 온 `email`)
- **Subject**: 예) `[원툴러] {{ $json.store_name }} 대표님을 위한 맞춤 자동화 제안서`
- **Body (HTML 또는 텍스트)** 에 아래 링크 포함:

**제안서 링크 (필수):**

```text
https://onetooler.kr/proposal/{{ $('Supabase 또는 prospect 조회 노드').item.json.id }}
```

- `{{ ... }}` 안의 경로는 **prospect의 `id`**를 사용합니다.  
  (`/proposal/[id]` 라우트가 현재 `prospects.id`로 조회하므로, `prospect_id`가 아닌 **prospect의 id**를 넣어야 합니다.)

예시 문구:

```text
{{ $json.owner_name }} 대표님,

{{ $json.store_name }}에 맞춘 무료 자동화 제안서를 준비했습니다.
아래 링크에서 확인해 보세요.

👉 https://onetooler.kr/proposal/{{ $('prospect 노드이름').item.json.id }}

원툴러 드림
```

---

## 6. 요약 체크리스트

- [ ] Trigger: Webhook 또는 Google Sheets로 셀러 데이터 수신
- [ ] (선택) Supabase에서 `prospects` Insert/Select로 `prospect_id` 확보
- [ ] OpenAI: Model `gpt-4o-mini`, Response Format **JSON Object**, System Message 위 내용 그대로
- [ ] Supabase: `proposals` 테이블 생성 후, `prospect_id` + `content` Upsert
- [ ] Gmail/SMTP: 본문에 `https://onetooler.kr/proposal/[prospect_id]` 포함

이렇게 세팅하면 셀러 데이터가 들어올 때마다 GPT가 제안서 JSON을 생성하고, Supabase에 저장한 뒤 해당 prospect용 제안서 링크가 포함된 콜드메일이 자동 발송되는 무인 파이프라인이 완성됩니다.

---

## 7. 프론트 연동 참고

현재 `/proposal/[id]` 페이지는 `prospects`만 조회하고 카테고리별 정적 시나리오(`proposal-scenarios.ts`)를 사용합니다.  
n8n으로 `proposals.content`에 GPT 결과를 저장한 뒤, **프론트에서 해당 prospect에 대한 proposal이 있으면 `content`(hero, before_after, solutions, cta)를 우선 렌더링**하도록 수정하면, 메일로 보낸 링크와 동일한 맞춤 제안서가 그대로 노출됩니다.
