# OWNER ONE-TOOL (O1T)

ETERNAL SIX 산하 SaaS 공식 웹사이트. Next.js 14 (App Router) + TypeScript 기반.

## 실행 순서

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   - `.env.example`을 복사해 `.env.local` 생성
   - 실제 키 입력 (Toss, OpenAI, 구글/네이버 인증 코드)

3. **로고 이미지**
   - `public/logo.png` — 워드마크 포함 가로형 로고
   - `public/logo-icon.png` — 심볼 아이콘만
   - 제공된 로고 이미지를 위 경로에 배치하세요.

4. **개발 서버**
   ```bash
   npm run dev
   ```

5. **품질 검증**
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

6. **프로덕션 실행**
   ```bash
   npm run start
   ```

## 주요 경로

- `/` — 홈
- `/solution` — 솔루션 소개
- `/pricing` — 가격
- `/diagnosis` — 무료 진단 폼
- `/faq` — FAQ
- `/o1t` — 제품 상세
- `/landing/[slug]` — 키워드 랜딩 200개 (SSG)

Base URL: https://owneronetool.com
