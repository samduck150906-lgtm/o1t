# 보안 및 인가 정리

## 1. CSRF 보호

- **NextAuth**: 로그인/로그아웃 등 NextAuth 경로는 NextAuth가 제공하는 CSRF 토큰을 사용합니다.
- **커스텀 API (POST/PATCH/DELETE)**  
  - 세션 기반 API(`getServerSession`)는 **httpOnly, SameSite 쿠키**를 사용하므로, 타 도메인에서의 요청에는 쿠키가 전송되지 않아 동일 출처가 아닌 CSRF 공격은 차단됩니다.  
  - 동일 출처 내 악의적 페이지에 대한 추가 보호가 필요하면, 중요한 변경 API에 대해 **Custom CSRF 토큰** 또는 **Double-Submit Cookie** 패턴을 도입할 수 있습니다.

## 2. Rate Limiting

- **Upstash Redis** 기반 (`@upstash/ratelimit`).
- 적용 구간:
  - `POST /api/auth/register`: IP당 5회/15분
  - `POST /api/auth/forgot-password`: IP당 5회/1시간
  - `POST /api/parse-booking`: 로그인 사용자당 30회/1분
  - `POST /api/leads`: IP당 20회/1시간
- 환경변수: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`  
  - 미설정 시 한도 검사는 건너뜁니다(개발 편의). **프로덕션에서는 반드시 설정**하세요.

## 3. API 인가 (Authorization)

- **로그인 필수 API**  
  - `getServerSession(authOptions)`로 세션 확인. 없으면 `401 Unauthorized`.
- **리소스 소유자 검증**  
  - 예약·고객 등은 **항상 `userId`(session.userId)로 필터**합니다.  
  - 예: `prisma.reservation.findFirst({ where: { id, userId: session.userId } })`,  
    `updateMany`/`deleteMany`에서도 `userId` 조건 사용 → 타인의 예약 수정/삭제 불가.
- 적용 API: `/api/reservations`, `/api/reservations/[id]`, `/api/customers`, `/api/parse-booking`(로그인 필수).

## 4. OpenAI API 키

- **서버 전용**: `OPENAI_API_KEY`만 사용합니다.  
- `NEXT_PUBLIC_OPENAI_API_KEY`가 설정되어 있으면 에러를 반환하도록 되어 있으며, 클라이언트에 키가 노출되지 않아야 합니다.

## 5. 토스페이먼츠 웹훅

- **검증**  
  - `PAYMENT_STATUS_CHANGED`: `paymentKey`로 Toss API에 조회 요청해 유효한 결제인지 확인.  
  - `DEPOSIT_CALLBACK` / `VIRTUAL_ACCOUNT_DEPOSIT_COMPLETED`: 수신 `secret`과 DB에 저장한 해당 주문(`orderId`)의 secret 비교.
- **멱등성**  
  - `WebhookEvent` 테이블에 `eventKey(orderId:eventType:paymentKey 등)`로 기록.  
  - 이미 처리된 이벤트는 200만 반환하고 비즈니스 로직을 다시 수행하지 않습니다.

## 6. 에러 응답 형식

- API 오류는 `{ error: string, code?: string }` 형태로 통일합니다.  
- 예: `{ error: "로그인이 필요합니다.", code: "UNAUTHORIZED" }`  
- 코드: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `RATE_LIMITED`, `BAD_REQUEST`, `INTERNAL_ERROR`.
