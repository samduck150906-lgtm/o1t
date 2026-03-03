"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "대시보드", ariaLabel: "대시보드" },
  { href: "/diagnosis", label: "무료 진단", ariaLabel: "무료 진단" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      role="navigation"
      aria-label="하단 탭 메뉴"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`min-touch flex flex-1 flex-col items-center justify-center gap-1 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset ${
              isActive ? "text-primary" : "text-gray-600"
            }`}
            aria-label={item.ariaLabel}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
