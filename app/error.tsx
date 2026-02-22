"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16">
      <h1 className="text-2xl font-bold text-foreground">일시적인 오류가 발생했습니다</h1>
      <p className="mt-3 text-center text-gray-600">
        페이지를 불러오는 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="min-touch rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="다시 시도"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="min-touch flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-foreground hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="홈으로 이동"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
