"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setToken(searchParams.get("token") ?? "");
    setEmail(searchParams.get("email") ?? "");
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "비밀번호 변경에 실패했습니다.");
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-lg text-foreground">비밀번호가 변경되었습니다.</p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-white hover:bg-primary/90"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  if (!token || !email) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-gray-600">잘못된 링크입니다. 비밀번호 재설정을 다시 요청해 주세요.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-primary hover:underline">
          재설정 요청하기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">새 비밀번호 설정</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="email" value={email} />
        <div>
          <label htmlFor="reset-password" className="block text-sm font-medium text-foreground">
            새 비밀번호 (8자 이상)
          </label>
          <input
            id="reset-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="min-touch w-full rounded-xl bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "변경 중…" : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-12">로딩 중…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
