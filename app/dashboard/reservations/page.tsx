"use client";

import { useCallback, useEffect, useState } from "react";
import { ReservationList } from "@/components/dashboard/ReservationList";
import type { ReservationItem } from "@/app/dashboard/DashboardClient";
import Link from "next/link";
import { PasteDropZone } from "@/components/dashboard/PasteDropZone";

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

  const handleAdd = useCallback(
    (r: ReservationItem) => {
      setItems((prev) => [r, ...prev]);
      fetchList();
    },
    [fetchList]
  );

  const handleRemove = useCallback(async (id: string) => {
    try {
      await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch {
      // ignore
    }
  }, []);

  const dataToDisplay = filter ? filtered.filter((r) => r.status === filter) : filtered;

  return (
    <div>
      <div className="erp-page-header">
        <h2 className="erp-page-title">예약 및 상담 리스트</h2>
        <p className="erp-page-subtitle">모든 예약, 상담 내역을 최신순으로 확인하고 관리합니다.</p>
      </div>

      <div className="erp-card" style={{ marginBottom: 24 }}>
        <div className="erp-card__header">
          <h3 className="erp-card__title">✨ AI 예약 자동 추가</h3>
        </div>
        <div className="erp-card__body">
          <PasteDropZone onAdd={handleAdd} onSaved={fetchList} />
        </div>
      </div>

      <div className="erp-card">
        <div className="erp-card__header" style={{ flexWrap: "wrap" }}>
          <h3 className="erp-card__title">전체 예약 목록 ({dataToDisplay.length})</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="search"
              placeholder="이름, 연락처 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="erp-input"
              style={{ width: "200px" }}
              aria-label="예약 검색"
            />
            <div style={{ position: "relative" }}>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="erp-input"
                style={{ width: "120px", appearance: "none", paddingRight: 30 }}
                aria-label="상태 필터"
              >
                <option value="">전체 상태</option>
                <option value="예약대기">예약대기</option>
                <option value="확정">확정</option>
                <option value="문의">문의</option>
                <option value="결제완료">결제완료</option>
                <option value="노쇼">노쇼</option>
              </select>
              <svg 
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, pointerEvents: "none", color: "#6b7280" }}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="erp-card__body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 20 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="erp-skeleton" style={{ height: 48, marginBottom: 10 }} />
              ))}
            </div>
          ) : (
            <ReservationList
              items={dataToDisplay}
              onRemove={handleRemove}
              onUpdateStatus={async (id, status) => {
                await fetch(`/api/reservations/${id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status }),
                });
                fetchList();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
