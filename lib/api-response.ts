/**
 * API 에러 응답 포맷 통일
 * 형태: { error: string, code?: string } — 모니터링·클라이언트 처리 용이
 */

import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "BAD_REQUEST"
  | "INTERNAL_ERROR";

export function apiError(
  message: string,
  status: number,
  code?: ApiErrorCode
): NextResponse {
  return NextResponse.json(
    { error: message, code: code ?? inferCode(status) },
    { status }
  );
}

function inferCode(status: number): ApiErrorCode {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 429) return "RATE_LIMITED";
  if (status >= 400 && status < 500) return "VALIDATION_ERROR";
  return "INTERNAL_ERROR";
}
