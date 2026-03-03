"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1>일시적인 오류가 발생했습니다</h1>
          <p>잠시 후 다시 시도해 주세요.</p>
          <button type="button" onClick={() => reset()} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
