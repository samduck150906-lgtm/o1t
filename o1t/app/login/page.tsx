"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        setLoading(false);
        return;
      }
      window.location.href = callbackUrl;
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">로그인</h1>
      <p className="mt-2 text-gray-600">
        대시보드에 접속하려면 로그인해 주세요.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-foreground">
            이메일
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-foreground">
            비밀번호
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            비밀번호 재설정
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="min-touch w-full rounded-xl bg-primary px-4 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "로그인 중…" : "로그인"}
        </button>
      </form>

      {process.env.NEXT_PUBLIC_KAKAO_ENABLED !== "false" && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => signIn("kakao", { callbackUrl })}
            className="min-touch flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-[#FEE500] px-4 py-3 text-base font-medium text-[#191919] hover:bg-[#FEE500]/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span aria-hidden>💬</span>
            카카오로 로그인
          </button>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-gray-600">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
