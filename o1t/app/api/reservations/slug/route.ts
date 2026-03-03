import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const PAID_COOKIE_NAME = "o1t_paid";
const SLUG_COOKIE_NAME = "o1t_slug";
const DEFAULT_SLUG = "default";

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get(PAID_COOKIE_NAME)?.value !== "1") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const slug = cookieStore.get(SLUG_COOKIE_NAME)?.value ?? DEFAULT_SLUG;
  return NextResponse.json({ slug });
}
