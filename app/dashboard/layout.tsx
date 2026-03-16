import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isReadOnly } from "@/lib/subscription";
import { DashboardShell } from "./DashboardShell";

export const metadata: Metadata = {
  title: "내 대시보드",
  description: "예약·고객·일정을 한곳에서 관리하세요.",
  robots: "noindex",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const readOnly = isReadOnly(session);

  return <DashboardShell readOnly={readOnly}>{children}</DashboardShell>;
}
