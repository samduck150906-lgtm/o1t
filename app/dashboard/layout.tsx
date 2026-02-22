import type { Metadata } from "next";
import Link from "next/link";
import { DashboardNav } from "./DashboardNav";

export const metadata: Metadata = {
  title: "내 대시보드",
  description: "예약·고객·일정을 한곳에서 관리하세요.",
  robots: "noindex",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <DashboardNav />
      <div className="mt-6">{children}</div>
    </div>
  );
}
