import { NextResponse, type NextRequest } from "next/server";

import { sendWaitlistRegistrationEmails } from "@/services/waitlist-email";
import type { WaitlistPayload } from "@/types/waitlist";

const BACKEND_API_URL =
  process.env.RITUO_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://159.89.37.132";


function getCreatedLeadId(data: unknown) {
  if (!data || typeof data !== "object" || !("id" in data)) {
    return undefined;
  }

  const id = data.id;

  return typeof id === "string" ? id : undefined;
}

function buildBackendUrl(path: string) {
  const baseUrl = BACKEND_API_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export async function POST(request: NextRequest) {
  let payload: WaitlistPayload;

  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return NextResponse.json(
      { message: "Payload inválido" },
      { status: 400 },
    );
  }

  const response = await fetch(buildBackendUrl("/landing/waitlist-leads"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    return NextResponse.json(
      data ?? { message: "No pudimos guardar el lead" },
      { status: response.status },
    );
  }

  try {
    await sendWaitlistRegistrationEmails(payload, {
      leadId: getCreatedLeadId(data),
    });
  } catch (error) {
    console.error("No pudimos enviar el email de lista de espera", error);
  }

  return NextResponse.json(data, { status: response.status });
}
