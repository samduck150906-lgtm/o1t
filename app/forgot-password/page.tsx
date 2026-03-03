"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "요청에 실패했습니다.");
        setLoading(false);
        return;
      }
      setMessage((data as { message?: string }).message ?? "재설정 링크를 발송했습니다.");
      if ((data as { resetLink?: string }).resetLink) {
        setMessage(
          (prev) =>
            prev + " (개발 모드: 링크는 아래에 표시됩니다.)"
        );
      }
      setEmail("");
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">비밀번호 재설정</h1>
      <p className="mt-2 text-gray-600">
        가입한 이메일을 입력하면 재설정 링크를 보내드립니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
            {message}
          </p>
        )}
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground">
            이메일
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="min-touch w-full rounded-xl bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "전송 중…" : "재설정 링크 받기"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        <Link href="/login" className="font-medium text-primary hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
