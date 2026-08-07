import "server-only";

import type { ContactPayload } from "@/types/contact";

const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactEmail(payload: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_CONTACT_TO ?? "hello@rituo.io";

  if (!apiKey || !from) {
    throw new Error("El servicio de correo no está configurado.");
  }

  const response = await fetch(RESEND_EMAILS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `[Contacto web] ${payload.subject}`,
      text: `Nuevo mensaje desde rituo.io/redes\n\nNombre: ${payload.name}\nEmail: ${payload.email}\nAsunto: ${payload.subject}\n\n${payload.message}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#0d1528;line-height:1.6;">
          <h1 style="margin:0 0 20px;">Nuevo mensaje desde rituo.io</h1>
          <p><strong>Nombre:</strong> ${escapeHtml(payload.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
          <p><strong>Asunto:</strong> ${escapeHtml(payload.subject)}</p>
          <div style="margin-top:24px;padding:20px;border:1px solid #d8e0ea;border-radius:12px;white-space:pre-wrap;">${escapeHtml(payload.message)}</div>
        </div>
      `,
      tags: [
        { name: "source", value: "contact_page" },
        { name: "type", value: "contact" },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rechazó el mensaje (${response.status}): ${detail}`);
  }
}
