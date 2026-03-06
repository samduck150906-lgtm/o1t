"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

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

  return (
    <header
      className="sticky top-0 z-50 border-b border-amber-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm safe-area-inset-top"
      role="banner"
      aria-label="메인 내비게이션"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:px-4 md:h-14 md:px-5">
        <Link
          href="/"
          className="flex min-h-[44px] min-w-[44px] items-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-lg -ml-1"
          aria-label="원툴러 홈으로 이동"
        >
          <Image
            src="/logo.png"
            alt="원툴러"
            width={140}
            height={36}
            className="h-7 w-auto sm:h-8"
            priority
          />
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg px-3 text-sm font-medium text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 break-keep"
              aria-label={`${item.label} 페이지로 이동`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex md:items-center md:gap-1">
          {status === "authenticated" ? (
            <>
              <Link
                href="/dashboard"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="내 대시보드"
              >
                내 대시보드
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="로그아웃"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="로그인"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="회원가입"
              >
                회원가입
              </Link>
            </>
          )}
          <Link
            href="/diagnosis"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-100 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 break-keep transition-all"
            aria-label="무료진단 시작하기"
          >
            무료진단
          </Link>
        </div>

        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg md:hidden -mr-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
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
          className="border-t border-amber-100 bg-white md:hidden shadow-lg safe-area-inset-bottom"
          role="dialog"
          aria-label="모바일 메뉴"
        >
          <nav className="flex flex-col px-3 py-3 gap-0" aria-label="모바일 메뉴">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-[48px] flex items-center rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 active:bg-amber-50 text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset break-keep"
                onClick={() => setMobileMenuOpen(false)}
                aria-label={`${item.label} 페이지로 이동`}
              >
                {item.label}
              </Link>
            ))}
            {status === "authenticated" ? (
              <>
                <Link
                  href="/dashboard"
                  className="min-h-[48px] flex items-center rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 active:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset"
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
                  className="min-h-[48px] flex w-full items-center rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 active:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset text-left"
                  aria-label="로그아웃"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="min-h-[48px] flex items-center rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 active:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="로그인"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="min-h-[48px] flex items-center rounded-lg px-4 py-3 text-base font-semibold text-amber-700 hover:bg-amber-50 active:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="회원가입"
                >
                  회원가입
                </Link>
              </>
            )}
            <Link
              href="/diagnosis"
              className="min-h-[48px] flex items-center justify-center rounded-lg bg-amber-500 px-4 py-3 text-base font-bold text-white hover:bg-amber-600 active:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset mt-2 break-keep shadow-md"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="무료진단 시작하기"
            >
              무료진단
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
