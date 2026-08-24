import { NextResponse } from "next/server";

import { getWaitlistLeads } from "@/services/waitlist-admin";
import { sendWaitlistBroadcast } from "@/services/waitlist-broadcast-email";

interface BroadcastPayload {
  subject?: unknown;
  message?: unknown;
  testEmail?: unknown;
  operatingSystem?: unknown;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OS_FILTERS = ["iOS", "Android"] as const;

export async function POST(request: Request) {
  let payload: BroadcastPayload;

  try {
    payload = (await request.json()) as BroadcastPayload;
  } catch {
    return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  }

  const subject = typeof payload.subject === "string" ? payload.subject.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (subject.length < 2 || subject.length > 150) {
    return NextResponse.json(
      { message: "El asunto tiene que tener entre 2 y 150 caracteres." },
      { status: 400 },
    );
  }

  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { message: "El mensaje tiene que tener entre 10 y 5000 caracteres." },
      { status: 400 },
    );
  }

  const testEmail =
    typeof payload.testEmail === "string" && payload.testEmail.trim()
      ? payload.testEmail.trim()
      : undefined;

  if (testEmail && !EMAIL_PATTERN.test(testEmail)) {
    return NextResponse.json(
      { message: "El email de prueba no es válido." },
      { status: 400 },
    );
  }

  const operatingSystem =
    typeof payload.operatingSystem === "string" && payload.operatingSystem.length > 0
      ? payload.operatingSystem
      : undefined;

  if (
    operatingSystem !== undefined &&
    !OS_FILTERS.includes(operatingSystem as (typeof OS_FILTERS)[number])
  ) {
    return NextResponse.json(
      { message: "Filtro de sistema operativo inválido." },
      { status: 400 },
    );
  }

  try {
    const allLeads = await getWaitlistLeads();
    const leads = operatingSystem
      ? allLeads.filter((lead) => lead.operatingSystem === operatingSystem)
      : allLeads;
    const result = await sendWaitlistBroadcast({ subject, message, testEmail }, leads);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos enviar el email masivo.",
      },
      { status: 502 },
    );
  }
}
