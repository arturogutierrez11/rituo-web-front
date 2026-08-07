import { NextResponse, type NextRequest } from "next/server";

import { sendContactEmail } from "@/services/contact-email";
import type { ContactPayload } from "@/types/contact";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPayload(payload: ContactPayload) {
  return (
    payload.name.length >= 2 &&
    payload.name.length <= 80 &&
    EMAIL_PATTERN.test(payload.email) &&
    payload.email.length <= 160 &&
    payload.subject.length >= 2 &&
    payload.subject.length <= 120 &&
    payload.message.length >= 10 &&
    payload.message.length <= 3000
  );
}

export async function POST(request: NextRequest) {
  let payload: ContactPayload;

  try {
    const body = (await request.json()) as Partial<ContactPayload>;
    payload = {
      name: body.name?.trim() ?? "",
      email: body.email?.trim().toLowerCase() ?? "",
      subject: body.subject?.trim() ?? "",
      message: body.message?.trim() ?? "",
      website: body.website?.trim() ?? "",
    };
  } catch {
    return NextResponse.json({ message: "Datos inválidos." }, { status: 400 });
  }

  if (payload.website) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidPayload(payload)) {
    return NextResponse.json(
      { message: "Revisá los datos e intentá nuevamente." },
      { status: 400 },
    );
  }

  try {
    await sendContactEmail(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("No pudimos enviar el mensaje de contacto", error);
    return NextResponse.json(
      { message: "No pudimos enviar tu mensaje. Probá de nuevo en unos segundos." },
      { status: 502 },
    );
  }
}
