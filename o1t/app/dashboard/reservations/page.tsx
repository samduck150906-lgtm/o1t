"use client";

import { useCallback, useEffect, useState } from "react";
import { ReservationList } from "@/components/dashboard/ReservationList";
import type { ReservationItem } from "@/app/dashboard/DashboardClient";
import Link from "next/link";

export default function ReservationsPage() {
  const [items, setItems] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch("/api/reservations");
      if (!res.ok) return;
      const data = (await res.json()) as ReservationItem[];
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const filtered = items.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.name?.toLowerCase().includes(q)) ||
      (r.phone?.includes(q)) ||
      (r.notes?.toLowerCase().includes(q))
    );
  });

  const handleRemove = useCallback(async (id: string) => {
    try {
      await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">예약 리스트</h2>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← 대시보드 홈
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="이름, 연락처, 메모로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-[44px] flex-1 min-w-[200px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="예약 검색"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="상태 필터"
        >
          <option value="">전체 상태</option>
          <option value="예약대기">예약대기</option>
          <option value="확정">확정</option>
          <option value="문의">문의</option>
          <option value="결제완료">결제완료</option>
        </select>
      </div>

      {loading ? (
        <p className="py-8 text-center text-gray-500">불러오는 중…</p>
      ) : (
        <ReservationList
          items={filter ? filtered.filter((r) => r.status === filter) : filtered}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}
