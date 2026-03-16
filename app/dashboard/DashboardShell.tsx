"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NotificationBell } from "@/components/dashboard/NotificationBell";

const navItems = [
  {
    href: "/dashboard",
    label: "홈 대시보드",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/dashboard/reservations",
    label: "예약 & 상담",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    exact: false,
  },
  {
    href: "/dashboard/calendar",
    label: "캘린더",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    exact: false,
  },
  {
    href: "/dashboard/customers",
    label: "고객 명단",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    exact: false,
  },
];

export function DashboardShell({
  children,
  readOnly,
}: {
  children: React.ReactNode;
  readOnly: boolean;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="erp-shell">
      {/* 사이드바 오버레이 (모바일) */}
      {sidebarOpen && (
        <div
          className="erp-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 */}
      <aside className={`erp-sidebar ${sidebarOpen ? "erp-sidebar--open" : ""}`} aria-label="대시보드 네비게이션">
        {/* 로고 */}
        <div className="erp-sidebar__logo">
          <div className="erp-logo-icon">
            <svg viewBox="0 0 32 32" fill="none" className="h-6 w-6">
              <rect width="32" height="32" rx="8" fill="#0052FF" />
              <path d="M8 16l5 5 11-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="erp-logo-name">원툴러</p>
            <p className="erp-logo-sub">예약·상담 ERP</p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="erp-divider" />

        {/* 네비게이션 */}
        <nav className="erp-nav" aria-label="주요 메뉴">
          <p className="erp-nav__section-label">관리</p>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`erp-nav__item ${isActive ? "erp-nav__item--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="erp-nav__icon">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <span className="erp-nav__active-dot" />}
              </Link>
            );
          })}
        </nav>

        <div className="erp-sidebar__footer">
          <Link href="/pricing" className="erp-sidebar__upgrade-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            프리미엄 업그레이드
          </Link>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className="erp-main">
        {/* 상단 헤더 */}
        <header className="erp-topbar">
          <div className="erp-topbar__left">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="erp-topbar__menu-btn"
              aria-label="메뉴 열기"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
            <div className="erp-topbar__breadcrumb">
              <span className="erp-topbar__breadcrumb-root">원툴러</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 text-gray-400">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="erp-topbar__breadcrumb-current">
                {navItems.find((n) =>
                  n.exact ? pathname === n.href : pathname.startsWith(n.href)
                )?.label ?? "대시보드"}
              </span>
            </div>
          </div>
          <div className="erp-topbar__right">
            <NotificationBell />
            <div className="erp-topbar__avatar" title="내 계정">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </header>

        {/* 읽기 전용 배너 */}
        {readOnly && (
          <div className="erp-readonly-banner" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p>
              결제에 문제가 있어 현재 <strong>읽기 전용</strong>입니다.{" "}
              <Link href="/pricing" className="underline font-semibold hover:no-underline">
                결제하기 →
              </Link>
            </p>
          </div>
        )}

        {/* 페이지 콘텐츠 */}
        <main className="erp-content" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
