import { NextResponse } from "next/server";

const AUTH_API_URL = process.env.RITUO_AUTH_API_URL ?? "https://auth.rituo.io";

type ResetPasswordPayload = {
  token?: unknown;
  newPassword?: unknown;
  newPasswordConfirmation?: unknown;
};

export async function POST(request: Request) {
  let payload: ResetPasswordPayload;

  try {
    payload = (await request.json()) as ResetPasswordPayload;
  } catch {
    return NextResponse.json(
      { message: "Solicitud inválida." },
      { status: 400 },
    );
  }

  if (
    typeof payload.token !== "string" ||
    typeof payload.newPassword !== "string" ||
    typeof payload.newPasswordConfirmation !== "string"
  ) {
    return NextResponse.json(
      { message: "Faltan datos para cambiar la contraseña." },
      { status: 400 },
    );
  }

  const response = await fetch(`${AUTH_API_URL}/auth/email/reset-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "rituo-web",
    },
    body: JSON.stringify({
      token: payload.token,
      newPassword: payload.newPassword,
      newPasswordConfirmation: payload.newPasswordConfirmation,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      {
        message:
          response.status === 401
            ? "El link venció o no es válido. Pedí uno nuevo desde la app."
            : "No pudimos cambiar la contraseña. Intentá nuevamente.",
      },
      { status: response.status },
    );
  }

  return new Response(null, { status: 204 });
}
