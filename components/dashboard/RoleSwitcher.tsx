"use client";

import { useMemo, useState } from "react";
import { getRole, setRole, setPlan, isEnterprise, type Role } from "@/lib/roles";

export function RoleSwitcher() {
  const [refresh, setRefresh] = useState(0);
  const role = useMemo(() => getRole(), [refresh]);
  const [open, setOpen] = useState(false);

  const roles: { value: Role; label: string }[] = [
    { value: "admin", label: "관리자" },
    { value: "manager", label: "매니저" },
    { value: "staff", label: "스태프" },
  ];

  if (!isEnterprise()) {
    return (
      <button
        type="button"
        onClick={() => {
          setPlan("enterprise");
          setRefresh((n) => n + 1);
        }}
        className="rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 py-2 text-sm font-medium text-primary"
      >
        Enterprise 데모 (역할 체험)
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="text-gray-500">역할:</span>
        <span className="font-medium">
          {roles.find((r) => r.value === role)?.label ?? role}
        </span>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => {
                  setRole(r.value);
                  setRefresh((n) => n + 1);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  role === r.value ? "bg-primary/10 font-medium text-primary" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {r.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPlan("free");
                setRefresh((n) => n + 1);
                setOpen(false);
              }}
              className="block w-full border-t border-gray-100 px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-50"
            >
              데모 해제
            </button>
          </div>
        </>
      )}
    </div>
  );
}
