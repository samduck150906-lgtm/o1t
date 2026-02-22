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
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
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
      <section className="rounded-2xl border border-gray-200 bg-white p-6" aria-labelledby="list-title">
        <h2 id="list-title" className="text-lg font-semibold text-foreground">
          예약 리스트
        </h2>
        <p className="mt-4 text-sm text-gray-500">아직 예약이 없습니다. 위에서 결제·예약 자료를 붙여넣어 추가하세요.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6" aria-labelledby="list-title">
      <h2 id="list-title" className="text-lg font-semibold text-foreground">
        예약 리스트 ({items.length}건)
      </h2>
      <ul className="mt-4 space-y-3" role="list">
        {items
          .slice()
          .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
          .map((r) => {
            const customerKey = getCustomerKey(r);
            const noShowCount = noShowCountMap.get(customerKey) ?? 0;
            const isNoShow = (r.status ?? "").toLowerCase().includes("노쇼");
            const blocked = r.phone ? isBlacklisted(r.phone) : false;
            return (
              <li
                key={r.id}
                className={`flex flex-wrap items-start justify-between gap-2 rounded-xl border p-4 ${
                  blocked ? "border-red-200 bg-red-50/50" : "border-gray-100 bg-gray-50/50"
                }`}
              >
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium text-foreground">{r.name ?? "(이름 없음)"}</p>
                  <p className="text-gray-600">{r.phone ?? "-"}</p>
                  <p className="text-gray-600">{formatDate(r.date)} · {r.people != null ? `${r.people}명` : "-"}</p>
                  {r.amount != null && (
                    <p className="text-gray-600">{r.amount.toLocaleString()}원</p>
                  )}
                  {r.notes && <p className="mt-1 text-gray-500">{r.notes}</p>}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {r.status && (
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          isNoShow ? "bg-red-100 text-red-700" : "bg-primary/10 text-primary"
                        }`}
                      >
                        {r.status}
                      </span>
                    )}
                    {noShowCount > 0 && (
                      <span className="text-xs text-amber-600">노쇼 {noShowCount}회</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {onUpdateStatus && !isNoShow && canManageBlacklist() && (
                    <>
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(r.id, "노쇼")}
                        className="min-touch rounded-lg border border-amber-300 bg-amber-50 px-2 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
                        aria-label="노쇼 처리"
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
                          className="min-touch rounded-lg border border-red-300 bg-red-50 px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                          aria-label="블랙리스트 등록"
                        >
                          블랙등록
                        </button>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(r.id)}
                    className="min-touch rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={`${r.name ?? "예약"} 삭제`}
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
