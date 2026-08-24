import "server-only";

import type { WaitlistLead } from "@/types/waitlist";

const RESEND_BATCH_ENDPOINT = "https://api.resend.com/emails/batch";
const BATCH_SIZE = 100;

export interface WaitlistBroadcastInput {
  subject: string;
  message: string;
  /** When set, sends a single preview to this address instead of the whole list. */
  testEmail?: string;
}

export interface WaitlistBroadcastResult {
  totalRecipients: number;
  batchesSent: number;
}

interface ResendEmailPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  tags?: Array<{ name: string; value: string }>;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function applyPlaceholders(template: string, lead: WaitlistLead) {
  return template.replaceAll("{{nombre}}", lead.firstName.trim() || "Hola");
}

function textToHtmlParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 18px;color:rgba(230,238,248,0.90);font-size:16px;line-height:1.70;white-space:pre-wrap;">${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
}

function buildEmailForLead(
  lead: WaitlistLead,
  subject: string,
  message: string,
  from: string,
): ResendEmailPayload {
  const personalizedSubject = applyPlaceholders(subject, lead);
  const personalizedMessage = applyPlaceholders(message, lead);

  return {
    from,
    to: [lead.email],
    subject: personalizedSubject,
    text: `${personalizedMessage}\n\n—\nrituo\n\nRecibiste este email porque te uniste a la lista de espera de rituo. Si no querés recibir más, respondé este mensaje.`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="color-scheme" content="dark">
        <meta name="supported-color-schemes" content="dark">
        <title>${escapeHtml(personalizedSubject)}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#08101e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background-color:#08101e;padding:32px 0;">
          <tr>
            <td align="center" style="padding:0 16px;">
              <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;max-width:560px;border-collapse:separate;border-spacing:0;border-radius:22px;overflow:hidden;border:1px solid rgba(156,178,198,0.14);box-shadow:0 48px 120px rgba(0,0,0,0.55);">
                <tr>
                  <td align="center" style="padding:44px 40px 36px;background:linear-gradient(160deg,#0d1c3c 0%,#102248 50%,#14295a 100%);border-bottom:1px solid rgba(156,178,198,0.10);">
                    <img
                      src="https://rituo.io/images/rituo-logo-white.png"
                      alt="rituo"
                      width="120"
                      height="69"
                      style="display:block;width:120px;height:auto;margin:0 auto;border:0;"
                    />
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px 44px 32px;background-color:#0b1530;">
                    ${textToHtmlParagraphs(personalizedMessage)}
                    <div style="height:1px;background:rgba(156,178,198,0.10);margin:24px 0;"></div>
                    <p style="margin:0 0 5px;color:rgba(156,178,198,0.32);font-size:11px;line-height:1.6;">Recibiste este email porque te uniste a la lista de espera de rituo.</p>
                    <p style="margin:0;color:rgba(156,178,198,0.32);font-size:11px;line-height:1.6;">Si no querés recibir más emails, respondé este mensaje y te damos de baja.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    tags: [
      { name: "source", value: "waitlist" },
      { name: "type", value: "broadcast" },
    ],
  };
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export async function sendWaitlistBroadcast(
  input: WaitlistBroadcastInput,
  leads: WaitlistLead[],
): Promise<WaitlistBroadcastResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("El servicio de correo no está configurado.");
  }

  const uniqueLeadsByEmail = new Map(
    leads.map((lead) => [lead.email.trim().toLowerCase(), lead]),
  );
  const recipients = input.testEmail
    ? [
        {
          id: "test",
          firstName: "Nombre",
          lastName: "",
          email: input.testEmail.trim(),
          phoneNumber: "",
          operatingSystem: "iOS" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } satisfies WaitlistLead,
      ]
    : [...uniqueLeadsByEmail.values()];

  if (recipients.length === 0) {
    return { totalRecipients: 0, batchesSent: 0 };
  }

  const subject = input.testEmail ? `[PRUEBA] ${input.subject}` : input.subject;
  const emails = recipients.map((lead) =>
    buildEmailForLead(lead, subject, input.message, from),
  );
  const batches = chunk(emails, BATCH_SIZE);

  for (const batch of batches) {
    const response = await fetch(RESEND_BATCH_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Resend rechazó el envío masivo (${response.status}): ${detail}`);
    }
  }

  return { totalRecipients: recipients.length, batchesSent: batches.length };
}
