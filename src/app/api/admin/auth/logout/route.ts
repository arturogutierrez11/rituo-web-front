import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-session";

export async function POST() {
  const result = NextResponse.json({ ok: true });
  result.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return result;
}
