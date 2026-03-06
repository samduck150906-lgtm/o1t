import type { Metadata } from "next";
import { FAQJsonLd } from "./FAQJsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owneronetool.com";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "원툴러 자주 묻는 질문: 예약 데이터 이전, 다중 매장 관리, 카톡 복붙 고객 등록, 결제 수단, 무료 체험, 데이터 보안, 기술 지원.",
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: "FAQ | 원툴러",
    description: "자주 묻는 질문과 답변.",
    url: `${SITE_URL}/faq`,
  },
};

const faqData = [
  {
    question: "기존 예약 데이터 이전 방법은 어떻게 되나요?",
    answer: "엑셀 업로드 1분 만에 통합 가능합니다. 기존 예약 앱이나 엑셀에 있는 고객·예약 데이터를 업로드하면 자동으로 매핑되어 바로 사용할 수 있습니다.",
  },
  {
    question: "여러 매장을 동시에 관리할 수 있나요?",
    answer: "프리미엄 플랜 이상에서 다중 지점을 지원합니다. 지점별 예약·매출·고객을 한 대시보드에서 통합 관리할 수 있습니다.",
  },
  {
    question: "카톡/문자 복붙으로 고객 등록이 된다고요?",
    answer: "AI가 대화 내용에서 이름, 연락처, 예약일시를 자동으로 추출해 고객 명단에 정리해 줍니다. 붙여넣기만 하면 됩니다.",
  },
  {
    question: "결제 수단은 무엇이 있나요?",
    answer: "신용카드 정기결제, 가상계좌(무통장입금), 계좌이체를 지원합니다. 가맹점에 따라 이용 가능한 수단이 달라질 수 있습니다.",
  },
  {
    question: "무료 체험 기간이 있나요?",
    answer: "14일 무료 체험 후 유료 전환이 가능합니다. 약정 없이 언제든 해지할 수 있습니다.",
  },
  {
    question: "데이터는 안전한가요?",
    answer: "AWS 기반 클라우드 서버에서 운영하며, SSL 암호화와 일일 자동 백업으로 데이터를 보호합니다.",
  },
  {
    question: "기술 지원은 어떻게 받나요?",
    answer: "Starter는 이메일, Pro는 채팅, Enterprise는 전담 매니저를 통해 지원합니다.",
  },
];

export default function FAQPage() {
  return (
    <>
      <FAQJsonLd faq={faqData} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 md:py-20">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">자주 묻는 질문</h1>
        <p className="mt-4 text-gray-600 text-base sm:text-[1em]">
          원툴러 도입과 이용에 대해 자주 묻는 질문과 답변입니다.
        </p>
        <dl className="mt-8 sm:mt-12 space-y-4 sm:space-y-6" role="list">
          {faqData.map((item, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <dt className="text-lg font-semibold text-foreground">{item.question}</dt>
              <dd className="mt-3 text-gray-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
