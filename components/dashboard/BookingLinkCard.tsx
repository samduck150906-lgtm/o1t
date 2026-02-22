"use client";

import { useEffect, useState } from "react";

export function BookingLinkCard() {
  const [slug, setSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/reservations/slug", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { slug?: string }) => setSlug(data?.slug ?? "default"))
      .catch(() => setSlug("default"));
  }, []);

  const fullUrl =
    typeof window !== "undefined" && slug
      ? `${window.location.origin}/book/${encodeURIComponent(slug)}`
      : "";

  const handleCopy = () => {
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (slug === null) return null;

  return (
    <section
      className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-6"
      aria-labelledby="booking-link-title"
    >
      <h2 id="booking-link-title" className="text-lg font-semibold text-foreground">
        고객 예약 링크
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        이 링크를 카톡 프로필, 인스타 바이오에 걸어두면 고객이 직접 예약할 수 있고, 예약이 자동으로 캘린더에 반영됩니다.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          readOnly
          value={fullUrl}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-foreground"
          aria-label="예약 페이지 URL"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="min-touch rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
    </section>
  );
}
