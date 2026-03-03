"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const dashboardNavItems = [
  { href: "/", label: "대시보드", ariaLabel: "대시보드" },
  { href: "/diagnosis", label: "무료 진단", ariaLabel: "무료 진단" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex w-56 flex-col border-r border-gray-200 bg-white"
      role="navigation"
      aria-label="사이드바 메뉴"
    >
      <nav className="flex flex-col gap-1 p-4">
        {dashboardNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`min-touch flex items-center rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-gray-100"
              }`}
              aria-label={item.ariaLabel}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
