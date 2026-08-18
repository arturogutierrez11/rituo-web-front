import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
} from "@/lib/admin-session";

const AUTH_API_URL = process.env.RITUO_AUTH_API_URL ?? "https://auth.rituo.io";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let payload: LoginPayload;

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }

  if (
    typeof payload.email !== "string" ||
    typeof payload.password !== "string" ||
    payload.email.trim().length === 0 ||
    payload.password.length === 0
  ) {
    return NextResponse.json(
      { message: "Email y contraseña son requeridos." },
      { status: 400 },
    );
  }

  let response: Response;

  try {
    response = await fetch(`${AUTH_API_URL}/auth/admin/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "rituo-web-admin",
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });
  } catch {
    return NextResponse.json(
      { message: "No pudimos conectar con el servidor. Probá de nuevo en unos segundos." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return NextResponse.json({ message: "Credenciales inválidas." }, { status: 401 });
  }

  const admin = (await response.json()) as { id: string; email: string | null };
  const token = await createAdminSessionToken(admin);

  const result = NextResponse.json({ ok: true });
  result.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  return result;
}
