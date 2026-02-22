"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

const STORAGE_KEY = "owneronetool-senior-mode";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/dashboard", label: "대시보드" },
  { href: "/solution", label: "솔루션" },
  { href: "/pricing", label: "가격" },
  { href: "/faq", label: "FAQ" },
  { href: "/diagnosis", label: "무료진단" },
];

export function Header() {
  const { status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seniorMode, setSeniorMode] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1";
    setSeniorMode(saved);
    if (typeof document !== "undefined" && saved) document.body.classList.add("senior-mode");
  }, []);

  function toggleSeniorMode() {
    const next = !seniorMode;
    setSeniorMode(next);
    if (typeof document !== "undefined") {
      if (next) {
        document.body.classList.add("senior-mode");
        typeof window !== "undefined" && localStorage.setItem(STORAGE_KEY, "1");
      } else {
        document.body.classList.remove("senior-mode");
        typeof window !== "undefined" && localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
      aria-label="메인 내비게이션"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 md:h-16 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          aria-label="OWNER ONE-TOOL 홈으로 이동"
        >
          <Image
            src="/logo.png"
            alt="OWNER ONE-TOOL"
            width={160}
            height={40}
            className="h-8 w-auto md:h-9"
            priority
          />
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-touch text-base font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg px-3 py-2"
              aria-label={`${item.label} 페이지로 이동`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-2">
          <button
            type="button"
            onClick={toggleSeniorMode}
            className="min-touch inline-flex items-center justify-center rounded-lg px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-pressed={seniorMode}
            aria-label={seniorMode ? "글자 크게 보기 끄기" : "글자 크게 보기"}
            title={seniorMode ? "글자 크게 보기 끄기" : "글자 크게 보기"}
          >
            <span className="hidden sm:inline">{seniorMode ? "글자 보통" : "글자 크게"}</span>
            <span className="sm:ml-1" aria-hidden>🔤</span>
          </button>
          {status === "authenticated" ? (
            <>
              <Link
                href="/dashboard"
                className="min-touch inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-base font-medium text-foreground hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="내 대시보드"
              >
                내 대시보드
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="min-touch inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-foreground hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="로그아웃"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="min-touch inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-base font-medium text-foreground hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="로그인"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="min-touch inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="회원가입"
              >
                회원가입
              </Link>
            </>
          )}
          <Link
            href="/diagnosis"
            className="min-touch inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-base font-medium text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="무료 진단 시작하기"
          >
            무료 진단
          </Link>
        </div>

        <button
          type="button"
          className="flex min-touch min-w-[44px] items-center justify-center rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <span className="sr-only">{mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
          <svg
            className="h-6 w-6 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="border-t border-gray-200 bg-background md:hidden"
          role="dialog"
          aria-label="모바일 메뉴"
        >
          <nav className="flex flex-col px-4 py-4 gap-1" aria-label="모바일 메뉴">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-touch flex items-center rounded-lg px-4 py-4 text-lg font-medium text-foreground hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                onClick={() => setMobileMenuOpen(false)}
                aria-label={`${item.label} 페이지로 이동`}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                toggleSeniorMode();
                setMobileMenuOpen(false);
              }}
              className="min-touch flex items-center rounded-lg px-4 py-4 text-lg font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
              aria-pressed={seniorMode}
              aria-label={seniorMode ? "글자 크게 보기 끄기" : "글자 크게 보기"}
            >
              {seniorMode ? "🔤 글자 보통으로" : "🔤 글자 크게 보기"}
            </button>
            {status === "authenticated" ? (
              <>
                <Link
                  href="/dashboard"
                  className="min-touch flex items-center rounded-lg px-4 py-4 text-lg font-medium text-foreground hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="내 대시보드"
                >
                  내 대시보드
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="min-touch flex w-full items-center rounded-lg px-4 py-4 text-lg font-medium text-foreground hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  aria-label="로그아웃"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="min-touch flex items-center rounded-lg px-4 py-4 text-lg font-medium text-foreground hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="로그인"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="min-touch flex items-center rounded-lg px-4 py-4 text-lg font-medium text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="회원가입"
                >
                  회원가입
                </Link>
              </>
            )}
            <Link
              href="/diagnosis"
              className="min-touch flex items-center justify-center rounded-lg bg-primary px-4 py-4 text-lg font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset mt-2"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="무료 진단 시작하기"
            >
              무료 진단
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
