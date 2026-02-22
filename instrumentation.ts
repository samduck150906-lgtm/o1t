/**
 * Next.js Instrumentation — Sentry 서버/엣지 로드
 * Next.js 14+ 지원
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
