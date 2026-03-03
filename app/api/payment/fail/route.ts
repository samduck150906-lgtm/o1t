import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const base = request.nextUrl.origin;
  const params = new URLSearchParams();
  params.set("fail", "1");
  if (code) params.set("code", code);
  if (message) params.set("message", message);
  return NextResponse.redirect(new URL(`/pricing?${params.toString()}`, base));
}
