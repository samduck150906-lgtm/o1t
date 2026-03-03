import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isReadOnly } from "@/lib/subscription";
import { DashboardNav } from "./DashboardNav";

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
  const readOnly = isReadOnly(session as import("next-auth").Session | null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <DashboardNav />
      {readOnly && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800"
        >
          <p className="font-medium">
            결제에 문제가 있습니다. 기간 내 결제를 완료해 주세요.
          </p>
          <p className="mt-1 text-sm text-amber-700">
            현재 대시보드는 <strong>읽기 전용</strong>입니다. 결제 완료 후 다시
            수정할 수 있습니다.
          </p>
          <Link
            href="/pricing"
            className="mt-2 inline-block text-sm font-medium text-amber-900 underline hover:no-underline"
          >
            결제하기 →
          </Link>
        </div>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}
