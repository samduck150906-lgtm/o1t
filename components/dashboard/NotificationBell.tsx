"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = () => {
    fetch("/api/notifications", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { items?: NotificationItem[]; unreadCount?: number }) => {
        setItems(data?.items ?? []);
        setUnreadCount(data?.unreadCount ?? 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const t = setInterval(fetchNotifications, 60 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const markRead = (id: string) => {
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    }).then(() => fetchNotifications());
  };

  const markAllRead = () => {
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ all: true }),
    }).then(() => fetchNotifications());
  };

  const formatTime = (createdAt: string) => {
    try {
      const d = new Date(createdAt);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      if (diff < 60000) return "방금 전";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
      return d.toLocaleDateString("ko-KR");
    } catch {
      return "";
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative min-touch flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-foreground"
        aria-label={`알림 ${unreadCount > 0 ? `(${unreadCount}개 읽지 않음)` : ""}`}
        aria-expanded={open}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg"
          role="dialog"
          aria-label="알림 센터"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="font-semibold text-foreground">알림</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-sm text-primary hover:underline"
              >
                모두 읽음
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">알림이 없습니다.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.link ?? "/dashboard"}
                      onClick={() => {
                        if (!item.read) markRead(item.id);
                        setOpen(false);
                      }}
                      className={`block px-4 py-3 text-left hover:bg-gray-50 ${item.read ? "bg-gray-50/50" : "bg-primary/5"}`}
                    >
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-gray-600">{item.message}</p>
                      <p className="mt-1 text-xs text-gray-400">{formatTime(item.createdAt)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border-t border-gray-100 px-4 py-2 text-center">
            <Link
              href="/dashboard"
              className="text-sm text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              대시보드로 이동
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
