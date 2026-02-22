"use client";

import { useMemo, useState } from "react";
import { loadBlacklist, removeFromBlacklist } from "@/lib/blacklist";

export function BlacklistCard() {
  const [refresh, setRefresh] = useState(0);
  const list = useMemo(
    () => (typeof window !== "undefined" ? loadBlacklist() : []),
    // refresh는 목록 갱신 시 재계산을 위한 의도적 트리거
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh]
  );

  if (list.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4"
      aria-labelledby="blacklist-title"
    >
      <h2 id="blacklist-title" className="text-sm font-semibold text-amber-800">
        블랙리스트 ({list.length}명) — 예약 추가 시 자동 차단
      </h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {list.map((phone) => (
          <li
            key={phone}
            className="flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-sm text-amber-900 shadow-sm"
          >
            <span>{phone}</span>
            <button
              type="button"
              onClick={() => {
                removeFromBlacklist(phone);
                setRefresh((n) => n + 1);
              }}
              className="rounded p-0.5 text-amber-600 hover:bg-amber-100"
              aria-label={`${phone} 블랙리스트 해제`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
