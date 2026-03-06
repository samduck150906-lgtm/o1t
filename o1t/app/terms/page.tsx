import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owneronetool.com";

export const metadata: Metadata = {
  title: "이용약관",
  description: "원툴러 서비스 이용약관.",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: "index, follow",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">이용약관</h1>
      <p className="mt-2 text-sm text-gray-500">시행일: {new Date().toLocaleDateString("ko-KR")}</p>

      <div className="prose prose-gray mt-8 max-w-none text-gray-700">
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">제1조 (목적)</h2>
          <p>
            본 약관은 ETERNAL SIX(이하 &quot;회사&quot;)가 제공하는 원툴러(이하 &quot;서비스&quot;)의 이용과 관련하여
            회사와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">제2조 (정의)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>&quot;서비스&quot;: 회사가 제공하는 예약·고객·일정 통합 운영 도구 및 관련 제반 서비스</li>
            <li>&quot;이용자&quot;: 본 약관에 따라 서비스를 이용하는 자</li>
            <li>&quot;콘텐츠&quot;: 이용자가 서비스를 통해 입력·저장·전송한 데이터(예약, 고객 정보 등)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">제3조 (약관의 효력 및 변경)</h2>
          <p>
            회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 서비스 내 공지 또는
            이메일 등으로 안내합니다. 변경된 약관 시행 이후에도 서비스를 계속 이용하면 변경에 동의한 것으로 봅니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">제4조 (서비스의 제공 및 변경)</h2>
          <p>
            회사는 예약·고객 관리, 캘린더, 결제 연동 등 서비스를 제공하며, 필요한 경우 서비스 내용을 변경할 수 있습니다.
            무료 체험·유료 구독 정책은 별도 가격 페이지에 안내된 내용을 따릅니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">제5조 (이용자의 의무)</h2>
          <p>
            이용자는 법령 및 본 약관을 준수하여야 하며, 타인의 정보를 부정하게 이용하거나 서비스를 방해하는 행위를
            해서는 안 됩니다. 이용자가 입력한 콘텐츠에 대한 책임은 이용자 본인에게 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">제6조 (개인정보 처리)</h2>
          <p>
            회사는 이용자의 개인정보를 <Link href="/privacy" className="text-primary underline">개인정보처리방침</Link>에 따라
            처리하며, 이용자 및 고객 정보의 보호에 최선을 다합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">제7조 (서비스 중단)</h2>
          <p>
            회사는 시스템 점검, 장애 복구, 법령 준수 등 필요한 경우 서비스의 전부 또는 일부를 일시 중단할 수 있으며,
            중대한 경우 사전에 공지합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">제8조 (면책)</h2>
          <p>
            회사는 천재지변, 통신 장애, 이용자의 귀책 등으로 인한 서비스 이용 불가에 대해 책임을 지지 않습니다.
            이용자가 서비스를 통해 수집·저장한 고객 정보의 정확성·적법성에 대한 책임은 이용자에게 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground">제9조 (준거법 및 관할)</h2>
          <p>본 약관은 대한민국 법률에 따르며, 서비스와 관련된 분쟁에 대해서는 회사 본사 소재지 관할 법원을 전속 관할로 합니다.</p>
        </section>
      </div>

      <p className="mt-10 text-sm text-gray-500">
        문의: <a href="mailto:ceo@eternalsix.com" className="text-primary underline">ceo@eternalsix.com</a>
      </p>
    </div>
  );
}
