"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { QuickAdd } from "@/components/customer/QuickAdd";

type CustomerItem = {
  id: string;
  name: string | null;
  phone: string | null;
  memo: string | null;
  visitCount: number;
  totalPayment: number;
  lastVisitAt: string | null;
  riskScore: number | null;
  createdAt: string;
  updatedAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch("/api/customers");
      if (!res.ok) return;
      const data = (await res.json()) as CustomerItem[];
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleSaveCustomer = useCallback(
    async (data: { name: string | null; phone: string | null; notes?: string | null }) => {
      try {
        const res = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            memo: data.notes ?? null,
          }),
        });
        if (!res.ok) return;
        const created = (await res.json()) as CustomerItem;
        setCustomers((prev) => [created, ...prev]);
      } catch {
        // ignore
      }
    },
    []
  );

  const filtered = customers.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.name?.toLowerCase().includes(q)) ||
      (r.phone?.includes(q)) ||
      (r.memo?.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">고객 명단</h2>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← 대시보드 홈
        </Link>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <QuickAdd onSave={handleSaveCustomer} />
      </div>

      <div className="mb-4">
        <input
          type="search"
          placeholder="이름, 연락처, 메모로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-[44px] w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="고객 검색"
        />
      </div>

      {loading ? (
        <p className="py-8 text-center text-gray-500">불러오는 중…</p>
      ) : filtered.length === 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">등록된 고객이 없습니다.</p>
          <p className="mt-2 text-sm text-gray-500">
            위에서 카톡·문자 대화를 붙여넣어 고객을 추가하거나, 예약 추가 시 자동으로 반영됩니다.
          </p>
        </section>
      ) : (
        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-foreground">고객 목록 ({filtered.length}명)</h3>
          <ul className="mt-4 space-y-3" role="list">
            {filtered.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50/50 p-4"
              >
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium text-foreground">{c.name ?? "(이름 없음)"}</p>
                  <p className="text-gray-600">{c.phone ?? "-"}</p>
                  {c.memo && <p className="mt-1 text-gray-500">{c.memo}</p>}
                  <p className="mt-1 text-gray-500">
                    방문 {c.visitCount}회 · 총 {c.totalPayment.toLocaleString()}원
                    {c.lastVisitAt && ` · 마지막 방문 ${new Date(c.lastVisitAt).toLocaleDateString("ko-KR")}`}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  등록: {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
