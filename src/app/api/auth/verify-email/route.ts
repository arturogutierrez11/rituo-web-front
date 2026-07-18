import { NextResponse } from "next/server";

const AUTH_API_URL = process.env.RITUO_AUTH_API_URL ?? "https://auth.rituo.io";

type VerifyEmailPayload = {
  token?: unknown;
};

export async function POST(request: Request) {
  let payload: VerifyEmailPayload;

  try {
    payload = (await request.json()) as VerifyEmailPayload;
  } catch {
    return NextResponse.json(
      { message: "Solicitud inválida." },
      { status: 400 },
    );
  }

  if (typeof payload.token !== "string" || payload.token.trim().length === 0) {
    return NextResponse.json(
      { message: "Falta el token para verificar el email." },
      { status: 400 },
    );
  }

  const response = await fetch(`${AUTH_API_URL}/auth/email/verify-email`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "rituo-web",
    },
    body: JSON.stringify({ token: payload.token }),
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        message:
          response.status === 401
            ? "El link venció o no es válido. Pedí uno nuevo desde la app."
            : "No pudimos verificar tu email. Intentá nuevamente.",
      },
      { status: response.status },
    );
  }

  return NextResponse.json({ ok: true });
}
