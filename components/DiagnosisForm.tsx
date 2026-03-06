"use client";

import { useState } from "react";

const CONTACT_EMAIL = "ceo@eternalsix.com";

const sources = [
  "검색(구글/네이버)",
  "지인 소개",
  "SNS",
  "광고",
  "기타",
];

export function DiagnosisForm() {
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    if (!email.trim()) {
      setStatus("error");
      setMessage("이메일을 입력해 주세요.");
      return;
    }
    setStatus("idle");
    const subject = encodeURIComponent("상담 신청");
    const body = encodeURIComponent(
      `이메일: ${email}\n유입 경로: ${source || "(미선택)"}\n\n상담 요청 내용을 아래에 적어 주세요.`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setMessage("메일 앱이 열립니다. 메일을 보내 주시면 빠르게 연락드리겠습니다.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
      aria-labelledby="diagnosis-form-heading"
      noValidate
    >
      <h2 id="diagnosis-form-heading" className="text-2xl font-semibold text-foreground">
        무료 진단 / 상담 신청
      </h2>
      <p className="mt-2 text-base text-gray-700 leading-relaxed">
        이메일과 유입 경로를 알려주시면 맞춤 도입 단계와 예상 효과를 안내해 드립니다.
      </p>
      <div className="mt-6">
        <label htmlFor="diagnosis-email" className="block text-base font-medium text-foreground">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          id="diagnosis-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 block w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
          placeholder="example@email.com"
          autoComplete="email"
          aria-required="true"
          aria-invalid={status === "error" && !email}
        />
      </div>
      <div className="mt-5">
        <label htmlFor="diagnosis-source" className="block text-base font-medium text-foreground">
          유입 경로
        </label>
        <select
          id="diagnosis-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="mt-2 block w-full rounded-xl border-2 border-gray-300 px-4 py-4 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0"
          aria-label="유입 경로 선택"
        >
          <option value="">선택해 주세요</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {message && (
        <p
          role="alert"
          className={`mt-4 text-base ${status === "error" ? "text-red-600" : "text-green-600"}`}
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        className="mt-6 flex min-touch w-full items-center justify-center rounded-xl bg-primary px-4 py-4 text-lg font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        aria-label="상담 신청 메일 열기"
      >
        이메일로 상담 신청하기
      </button>
    </form>
  );
}
