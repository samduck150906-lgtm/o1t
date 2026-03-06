import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owneronetool.com";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "원툴러 개인정보 처리방침.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: "index, follow",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">개인정보 처리방침</h1>
      <p className="mt-2 text-sm text-gray-500">시행일: {new Date().toLocaleDateString("ko-KR")}</p>

      <div className="prose prose-gray mt-8 max-w-none text-gray-700">
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">1. 개인정보의 수집·이용 목적</h2>
          <p>
            ETERNAL SIX(이하 &quot;회사&quot;)는 원툴러 서비스 제공, 결제·구독 처리, 고객 문의 대응, 서비스 개선을 위해
            최소한의 개인정보를 수집·이용합니다. 수집 항목과 보유 기간은 아래와 같습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">2. 수집하는 개인정보 항목</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>필수: 이메일, 결제·구독 관련 정보(결제 수단 정보는 결제 대행사에서 처리)</li>
            <li>선택: 이름, 연락처, 업종 등 (진단·문의 시)</li>
            <li>서비스 이용 과정에서 생성되는 데이터: 예약 정보, 고객 명단(이용자가 입력한 데이터)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">3. 개인정보의 보유·이용 기간</h2>
          <p>
            회사는 수집 목적이 달성된 후 해당 정보를 지체 없이 파기합니다. 단, 전자상거래 등에서의 소비자 보호에 관한
            법률 등 관련 법령에 따라 보존할 의무가 있는 경우 해당 기간 동안 보관합니다. 구독 해지 후에도 거래 내역
            확인 등을 위해 일정 기간 보관할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">4. 개인정보의 제3자 제공</h2>
          <p>
            회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 결제 처리(토스페이먼츠 등),
            이메일 발송, 클라우드 인프라 등 서비스 제공을 위해 제3자(수탁자)에게 위탁할 수 있으며, 위탁 시 관련 법령에
            따라 관리·감독합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">5. 이용자의 권리</h2>
          <p>
            이용자는 개인정보의 열람·정정·삭제·처리 정지를 요청할 수 있으며, 동의를 철회할 수 있습니다. 요청 시
            서비스 내 설정 또는 고객센터를 통해 처리할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">6. 쿠키 및 동일 시설 내 재방문 인식</h2>
          <p>
            서비스 이용 편의를 위해 쿠키를 사용할 수 있습니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 일부 기능은
            제한될 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">7. 개인정보의 안전성 확보</h2>
          <p>
            회사는 개인정보의 안전한 처리를 위해 접근 제한, 암호화, 접속 기록 관리 등 기술적·관리적 조치를 취합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">8. 개인정보처리방침의 변경</h2>
          <p>
            본 방침은 법령 및 정책에 따라 변경될 수 있으며, 변경 시 서비스 내 공지 또는 이메일로 안내합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">9. 문의</h2>
          <p>
            개인정보 처리와 관련한 문의·신고는 아래로 연락해 주세요.<br />
            이메일: <a href="mailto:privacy@owneronetool.com" className="text-primary underline">privacy@owneronetool.com</a>
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        <Link href="/terms" className="text-primary underline">이용약관</Link> 보기
      </p>
    </div>
  );
}
