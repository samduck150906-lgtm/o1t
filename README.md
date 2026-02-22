# 토스페이먼츠 결제 연동

토스페이먼츠 결제위젯을 사용한 결제 연동 예제입니다.

## 필요한 키

- **클라이언트 키 (live_gck_...)**  
  결제 화면(프론트)에서 사용. 이미 `checkout.html`에 설정되어 있습니다.
- **시크릿 키 (live_gsk_...)**  
  결제 승인은 서버에서만 사용. **절대 클라이언트나 GitHub에 올리지 마세요.**

시크릿 키는 [토스페이먼츠 개발자센터](https://developers.tosspayments.com/my/api-keys) → API 키 → 결제위젯 연동 키에서 확인할 수 있습니다.

## 실행 방법

1. 시크릿 키 설정  
   프로젝트 폴더에 `.env` 파일을 만들고 다음 내용을 넣습니다.
   ```env
   TOSS_SECRET_KEY=live_gsk_여기에_시크릿키
   ```
   (Windows에서 `.env` 자동 로드가 안 되면) 터미널에서 직접 지정해서 실행할 수 있습니다.
   ```bash
   set TOSS_SECRET_KEY=live_gsk_여기에_시크릿키
   node server.js
   ```

2. 서버 실행  
   ```bash
   node server.js
   ```

3. 브라우저에서 결제 테스트  
   http://localhost:3000 접속 후 결제하기 버튼으로 결제를 진행합니다.

## 흐름

1. **checkout.html** – 결제위젯 표시, 주문 생성(`/api/orders`) 후 결제 요청
2. **success.html** – 결제 성공 리다이렉트 후 서버에 승인 요청(`/api/confirm`)
3. **server.js** – 주문 저장, 토스페이먼츠 결제 승인 API 호출

## 주의사항

- `live_` 키는 **실제 결제**가 발생합니다. 테스트 시에는 테스트 키(`test_gck_...`, `test_gsk_...`) 사용을 권장합니다.
- 시크릿 키는 반드시 서버 환경 변수로만 관리하고, 코드나 클라이언트에 포함하지 마세요.
