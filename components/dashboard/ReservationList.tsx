"use client";

import { useMemo, useState } from "react";
import type { Reservation } from "@/lib/reservations";
import {
  getCustomerKey,
  getNoShowCountByCustomer,
} from "@/lib/customer-stats";
import { addToBlacklist, isBlacklisted } from "@/lib/blacklist";
import { canManageBlacklist } from "@/lib/roles";

type ReservationListProps = {
  items: Reservation[];
  onRemove: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
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
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function getStatusBadgeClass(status: string | null): string {
  if (!status) return "erp-badge erp-badge--default";
  if (status.includes("확정")) return "erp-badge erp-badge--확정";
  if (status.includes("예약대기")) return "erp-badge erp-badge--예약대기";
  if (status.includes("결제완료")) return "erp-badge erp-badge--결제완료";
  if (status.includes("문의")) return "erp-badge erp-badge--문의";
  if (status.includes("노쇼")) return "erp-badge erp-badge--노쇼";
  return "erp-badge erp-badge--default";
}

export function ReservationList({
  items,
  onRemove,
  onUpdateStatus,
}: ReservationListProps) {
  const noShowCountMap = useMemo(
    () => getNoShowCountByCustomer(items),
    [items]
  );
  const [, setBlacklistRefresh] = useState(0);

  if (items.length === 0) {
    return (
      <div className="erp-empty">
        <div className="erp-empty__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-gray-400">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="erp-empty__title">표시할 예약이 없습니다</p>
        <p className="erp-empty__desc">조건에 맞는 검색 결과가 없거나 아직 등록된 예약이 없습니다.</p>
      </div>
    );
  }

  const sortedItems = items
    .slice()
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <div className="erp-table-wrap">
      <table className="erp-table">
        <thead>
          <tr>
            <th>고객 / 연락처</th>
            <th>예약 일시</th>
            <th>인원수</th>
            <th>결제 금액</th>
            <th>상태</th>
            <th>메모</th>
            <th style={{ textAlign: "right", width: "160px" }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((r) => {
            const customerKey = getCustomerKey(r);
            const noShowCount = noShowCountMap.get(customerKey) ?? 0;
            const isNoShow = (r.status ?? "").toLowerCase().includes("노쇼");
            const blocked = r.phone ? isBlacklisted(r.phone) : false;

            return (
              <tr key={r.id} style={blocked || isNoShow ? { backgroundColor: "#fff5f5" } : undefined}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 13, color: blocked || isNoShow ? "#b91c1c" : "inherit" }}>
                        {r.name ?? "(이름 없음)"}
                      </p>
                      <p style={{ fontSize: 12, color: "#6b7280" }}>{r.phone ?? "-"}</p>
                    </div>
                    {blocked && (
                      <span title="블랙리스트 고객" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, background: "#fee2e2", borderRadius: "50%", color: "#dc2626" }}>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ fontSize: 13, color: "#4b5563" }}>{formatDate(r.date)}</td>
                <td style={{ fontSize: 13 }}>{r.people != null ? `${r.people}명` : "-"}</td>
                <td style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                  {r.amount != null ? `${r.amount.toLocaleString()}원` : "-"}
                </td>
                <td>
                  <span className={getStatusBadgeClass(r.status)} style={{ display: "flex", alignSelf: "flex-start", width: "max-content", flexWrap: "wrap" }}>
                    {r.status ?? "미정"}
                    {noShowCount > 0 && r.phone && (
                      <span style={{ fontSize: 11, color: "#dc2626", marginLeft: 4 }}>
                        (노쇼 {noShowCount}회)
                      </span>
                    )}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: "#6b7280", maxWidth: 200 }}>
                  <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }} title={r.notes ?? ""}>
                    {r.notes || "-"}
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                    {onUpdateStatus && !isNoShow && canManageBlacklist() && (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(r.id, "노쇼")}
                          className="erp-btn erp-btn--ghost erp-btn--sm"
                          style={{ color: "#b45309", borderColor: "#fde68a", background: "#fef3c7" }}
                        >
                          노쇼
                        </button>
                        {r.phone && !isBlacklisted(r.phone) && (
                          <button
                            type="button"
                            onClick={() => {
                              addToBlacklist(r.phone!);
                              setBlacklistRefresh((n) => n + 1);
                            }}
                            className="erp-btn erp-btn--ghost erp-btn--sm"
                            style={{ color: "#dc2626", borderColor: "#fecaca", background: "#fee2e2" }}
                          >
                            블랙등록
                          </button>
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemove(r.id)}
                      className="erp-btn erp-btn--ghost erp-btn--sm"
                    >
                      X
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
