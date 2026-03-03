/**
 * Sentry 서버 초기화 (Node.js)
 * 환경변수: SENTRY_DSN 또는 NEXT_PUBLIC_SENTRY_DSN
 */

import * as Sentry from "@sentry/nextjs";

const dsn =
  process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    environment: process.env.NODE_ENV,
  });
}
