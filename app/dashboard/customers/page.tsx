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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

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
      <div className="erp-page-header">
        <h2 className="erp-page-title">고객 관리</h2>
        <p className="erp-page-subtitle">방문 이력, 매출, 노쇼 등 모든 상태를 종합적으로 관리합니다.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 24 }}>
        <div className="erp-card">
          <div className="erp-card__header">
            <h3 className="erp-card__title">✨ AI 대화 분석으로 빠른 추가</h3>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
              카카오톡이나 문자 대화만 복사/붙여넣기 해도 자동으로 이름과 연락처를 추출합니다.
            </p>
          </div>
          <div className="erp-card__body">
            <QuickAdd onSave={handleSaveCustomer} />
          </div>
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card__header" style={{ flexWrap: "wrap", borderBottom: loading || filtered.length === 0 ? "none" : "1px solid var(--erp-border)" }}>
          <h3 className="erp-card__title">고객 목록 ({filtered.length}명)</h3>
          <input
            type="search"
            placeholder="이름, 연락처, 메모 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="erp-input"
            style={{ width: "240px" }}
            aria-label="고객 검색"
          />
        </div>

        <div className="erp-card__body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 20 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="erp-skeleton" style={{ height: 48, marginBottom: 10 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="erp-empty">
              <div className="erp-empty__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <p className="erp-empty__title">검색된 고객이 없습니다</p>
              <p className="erp-empty__desc">위의 빠른 추가 기능이나 예약 등록을 통해 고객을 추가해주세요.</p>
            </div>
          ) : (
            <div className="erp-table-wrap">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>고객 정보</th>
                    <th>방문 횟수</th>
                    <th>총 결제액</th>
                    <th>마지막 방문</th>
                    <th>특이사항 / 메모</th>
                    <th>등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--erp-primary-light)", color: "var(--erp-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>
                            {c.name ? c.name.charAt(0) : "?"}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>
                              {c.name ?? "(이름 없음)"}
                            </p>
                            <p style={{ fontSize: 12, color: "#6b7280" }}>{c.phone ?? "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>
                        <span className="erp-badge" style={{ background: "#f3f4f6", color: "#374151" }}>
                          {c.visitCount}회
                        </span>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>
                        {c.totalPayment > 0 ? `${c.totalPayment.toLocaleString()}원` : "-"}
                      </td>
                      <td style={{ fontSize: 13, color: "#4b5563" }}>
                        {formatDate(c.lastVisitAt)}
                      </td>
                      <td style={{ fontSize: 13, color: "#6b7280", maxWidth: 220 }}>
                        <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }} title={c.memo ?? ""}>
                          {c.memo || "-"}
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: "#9ca3af" }}>
                        {formatDate(c.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
