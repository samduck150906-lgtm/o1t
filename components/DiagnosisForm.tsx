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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    if (!email.trim()) {
      setStatus("error");
      setMessage("이메일을 입력해 주세요.");
      return;
    }
    
    setLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "신청 중 오류가 발생했습니다.");
      }

      setStatus("idle");
      setMessage("무료 진단 신청이 완료되었습니다. 곧 메일로 연락드리겠습니다!");
      setEmail("");
      setSource("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "서버 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
        className="mt-6 flex min-touch w-full items-center justify-center rounded-xl bg-primary px-4 py-4 text-lg font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        aria-label={loading ? "신청 중..." : "무료 진단 신청하기"}
      >
        {loading ? "신청 중..." : "무료 진단 신청하기"}
      </button>
    </form>
  );
}
