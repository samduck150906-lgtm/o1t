"use client";

import Link from "next/link";

export function TopHeader() {
  return (
    <header
      className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6"
      role="banner"
      aria-label="대시보드 상단"
    >
      <h1 className="text-lg font-semibold text-foreground">원툴러</h1>
      <Link
        href="/diagnosis"
        className="min-touch inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="무료 진단 시작하기"
      >
        무료 진단
      </Link>
    </header>
  );
}
