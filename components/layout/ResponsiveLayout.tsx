"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopHeader } from "./TopHeader";

export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col md:min-h-0">
        <TopHeader />
        <div className="flex-1 p-4 pb-20 md:pb-4 md:pt-6">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}
