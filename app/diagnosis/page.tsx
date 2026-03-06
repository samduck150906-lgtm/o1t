import type { Metadata } from "next";
import { DiagnosisForm } from "@/components/DiagnosisForm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://owneronetool.com";

export const metadata: Metadata = {
  title: "무료 진단",
  description:
    "이메일과 유입 경로만 알려주시면 원툴러 맞춤 도입 단계와 예상 효과를 안내해 드립니다. 무료 진단 신청.",
  alternates: { canonical: `${SITE_URL}/diagnosis` },
  openGraph: {
    title: "무료 진단 | 원툴러",
    description: "맞춤 도입 단계와 예상 효과를 무료로 안내해 드립니다.",
    url: `${SITE_URL}/diagnosis`,
  },
};

export default function DiagnosisPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16 md:py-20">
      <h1 className="text-center text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">무료 진단</h1>
      <p className="mt-4 text-center text-base text-gray-700 md:text-lg leading-relaxed">
        이메일과 유입 경로를 알려주시면, 맞춤 도입 단계와 예상 효과를 안내해 드립니다.
      </p>
      <div className="mt-8 sm:mt-12">
        <DiagnosisForm />
      </div>
    </div>
  );
}
