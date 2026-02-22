"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "회원가입에 실패했습니다.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-lg text-foreground">회원가입이 완료되었습니다.</p>
        <p className="mt-2 text-gray-600">로그인 페이지로 이동합니다…</p>
        <Link href="/login" className="mt-6 inline-block text-primary hover:underline">
          바로 로그인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">회원가입</h1>
      <p className="mt-2 text-gray-600">
        이메일과 비밀번호로 가입하거나 카카오로 간편 가입할 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-foreground">
            이름 (선택)
          </label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-foreground">
            이메일
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-foreground">
            비밀번호 (8자 이상)
          </label>
          <input
            id="signup-password"
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
          {loading ? "가입 중…" : "회원가입"}
        </button>
      </form>

      {process.env.NEXT_PUBLIC_KAKAO_ENABLED !== "false" && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/api/auth/signin/kakao";
              }
            }}
            className="min-touch flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-[#FEE500] px-4 py-3 text-base font-medium text-[#191919] hover:bg-[#FEE500]/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span aria-hidden>💬</span>
            카카오로 간편 가입
          </button>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
