"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/dashboard/NotificationBell";

const tabs = [
  { href: "/dashboard", label: "홈" },
  { href: "/dashboard/reservations", label: "예약 리스트" },
  { href: "/dashboard/calendar", label: "캘린더" },
  { href: "/dashboard/customers", label: "고객 명단" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
      <nav className="flex flex-wrap gap-2" aria-label="대시보드 메뉴">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`min-touch rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isActive
                ? "bg-primary text-white"
                : "bg-gray-100 text-foreground hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
      </nav>
      <NotificationBell />
    </div>
  );
}
