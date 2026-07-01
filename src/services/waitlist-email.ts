import "server-only";

import type { WaitlistPayload } from "@/types/waitlist";

const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";
const INSTAGRAM_URL = "https://www.instagram.com/rituo.io/";
const WAITLIST_EMAIL_TEMPLATE_VERSION = "v5";

interface SendWaitlistRegistrationEmailsOptions {
  leadId?: string;
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

function getFullName(payload: WaitlistPayload) {
  return `${payload.firstName} ${payload.lastName}`.trim();
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function parseRecipients(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
}

function createIdempotencyKey(kind: string, payload: WaitlistPayload, leadId?: string) {
  const identifier = leadId ?? normalizeEmail(payload.email);

  return `${kind}-${WAITLIST_EMAIL_TEMPLATE_VERSION}-${identifier}`
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 256);
}

function createConfirmationEmail(
  payload: WaitlistPayload,
  from: string,
): ResendEmailPayload {
  const email = escapeHtml(normalizeEmail(payload.email));
  const instagramUrl = INSTAGRAM_URL;

  return {
    from,
    to: [normalizeEmail(payload.email)],
    subject: "Gracias por unirte a la lista de espera de Rituo",
    text: `Hola,\n\nGracias por sumarte a la lista de espera de rituo.\n\nEstamos creando una forma mas simple de recuperar la atencion en el dia a dia: elegis que apps queres dejar afuera por un rato y, si despues queres volver a usarlas, necesitas tu tarjeta.\n\nLa tarjeta no esta para impedirte usar el telefono. Esta para asegurarse de que, cuando vuelvas a usarlo, sea porque realmente lo elegiste.\n\nEn las proximas semanas vamos a compartir novedades sobre el lanzamiento, las primeras unidades disponibles y como va a funcionar todo.\n\nGracias por estar desde el principio.\n\nValen y Arturo :)\nrituo\n\nTe avisaremos a este email: ${normalizeEmail(payload.email)}`,
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="color-scheme" content="dark">
        <meta name="supported-color-schemes" content="dark">
        <title>rituo — Lista de espera</title>
        <style>
          @media only screen and (max-width:480px) {
            .card { border-radius:0 !important; }
            .header { padding:44px 24px 40px !important; }
            .body { padding:32px 24px 28px !important; }
            .logo-img { width:100px !important; height:auto !important; }
            .h1 { font-size:30px !important; }
            .sub { font-size:15px !important; }
            .body-text { font-size:15px !important; }
            .notify-box td { padding:14px 16px !important; }
            .notify-label { font-size:12px !important; }
            .notify-email { font-size:14px !important; }
          }
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#08101e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

        <!-- Wrapper -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background-color:#08101e;padding:32px 0;">
          <tr>
            <td align="center" style="padding:0 16px;">

              <!-- Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" class="card" style="width:100%;max-width:560px;border-collapse:separate;border-spacing:0;border-radius:22px;overflow:hidden;border:1px solid rgba(156,178,198,0.14);box-shadow:0 48px 120px rgba(0,0,0,0.55);">

                <!-- ── HEADER ── -->
                <tr>
                  <td class="header" align="center" style="padding:56px 40px 48px;background:linear-gradient(160deg,#0d1c3c 0%,#102248 50%,#14295a 100%);border-bottom:1px solid rgba(156,178,198,0.10);">

                    <!-- Logo image -->
                    <img
                      src="https://rituo.io/images/rituo-logo-white.png"
                      alt="rituo"
                      width="140"
                      height="81"
                      class="logo-img"
                      style="display:block;width:140px;height:auto;margin:0 auto 36px;border:0;"
                    />

                    <!-- Chip -->
                    <div style="display:inline-block;padding:7px 18px;border:1px solid rgba(156,178,198,0.24);border-radius:999px;background:rgba(156,178,198,0.08);color:#9cb2c6;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;">LISTA DE ESPERA</div>

                    <!-- Heading -->
                    <h1 class="h1" style="margin:0 0 12px;color:#f0f3fa;font-size:34px;line-height:1.08;font-weight:800;letter-spacing:-0.04em;">Gracias por unirte</h1>
                    <p class="sub" style="margin:0;color:rgba(156,178,198,0.72);font-size:16px;line-height:1.55;">Te avisaremos en cuanto haya novedades.</p>
                  </td>
                </tr>

                <!-- ── BODY ── -->
                <tr>
                  <td class="body" style="padding:40px 44px 32px;background-color:#0b1530;">

                    <p class="body-text" style="margin:0 0 18px;color:rgba(230,238,248,0.90);font-size:16px;line-height:1.70;">Hola,</p>
                    <p class="body-text" style="margin:0 0 18px;color:rgba(230,238,248,0.90);font-size:16px;line-height:1.70;">Gracias por sumarte a la lista de espera de rituo.</p>
                    <p class="body-text" style="margin:0 0 18px;color:rgba(156,178,198,0.68);font-size:16px;line-height:1.70;">Estamos creando una forma más simple de recuperar la atención en el día a día: elegís qué apps querés dejar afuera por un rato y, si después querés volver a usarlas, necesitás tu tarjeta.</p>
                    <p class="body-text" style="margin:0 0 18px;color:rgba(156,178,198,0.68);font-size:16px;line-height:1.70;">La tarjeta no está para impedirte usar el teléfono. Está para asegurarse de que, cuando vuelvas a usarlo, sea porque realmente lo elegiste.</p>
                    <p class="body-text" style="margin:0 0 18px;color:rgba(156,178,198,0.68);font-size:16px;line-height:1.70;">En las próximas semanas vamos a compartir novedades sobre el lanzamiento, las primeras unidades disponibles y cómo va a funcionar todo.</p>
                    <p class="body-text" style="margin:0 0 18px;color:rgba(230,238,248,0.90);font-size:16px;line-height:1.70;">Gracias por estar desde el principio.</p>
                    <p class="body-text" style="margin:0 0 32px;color:#f0f3fa;font-size:16px;line-height:1.5;font-weight:700;">Valen y Arturo :)<br>rituo</p>

                    <!-- Email notification box -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="notify-box" style="width:100%;border-collapse:separate;border-spacing:0;margin:0 0 28px;border:1px solid rgba(156,178,198,0.18);border-radius:16px;background:rgba(156,178,198,0.06);">
                      <tr>
                        <td style="padding:20px 24px;">
                          <p class="notify-label" style="margin:0 0 6px;color:rgba(156,178,198,0.58);font-size:12px;line-height:1.3;text-transform:uppercase;letter-spacing:0.10em;font-weight:700;">Recibirás novedades en</p>
                          <p class="notify-email" style="margin:0;color:#f0f3fa;font-size:16px;line-height:1.3;font-weight:800;word-break:break-all;">${email}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <div style="height:1px;background:rgba(156,178,198,0.10);margin:0 0 24px;"></div>

                    <!-- Footer row -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td valign="middle">
                          <img src="https://rituo.io/images/rituo-logo-white.png" alt="rituo" width="56" height="32" style="display:block;width:56px;height:auto;opacity:0.40;border:0;">
                        </td>
                        <td align="right" valign="middle">
                          <a href="${instagramUrl}" target="_blank" rel="noreferrer" style="color:rgba(156,178,198,0.50);font-size:12px;font-weight:700;text-decoration:none;letter-spacing:0.02em;">@rituo.io</a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:20px 0 5px;color:rgba(156,178,198,0.32);font-size:11px;line-height:1.6;">Recibiste este email porque te uniste a la lista de espera de rituo.</p>
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
      { name: "type", value: "confirmation" },
      { name: "os", value: payload.operatingSystem.toLowerCase() },
    ],
  };
}

function createAdminNotificationEmail(
  payload: WaitlistPayload,
  from: string,
  recipients: string[],
): ResendEmailPayload {
  const fullName = escapeHtml(getFullName(payload));
  const email = escapeHtml(normalizeEmail(payload.email));
  const phoneNumber = escapeHtml(payload.phoneNumber);
  const operatingSystem = escapeHtml(payload.operatingSystem);

  return {
    from,
    to: recipients,
    subject: `Nuevo lead de Rituo: ${getFullName(payload)}`,
    text: `Nuevo lead de lista de espera\n\nNombre: ${getFullName(payload)}\nEmail: ${payload.email}\nTelefono: ${payload.phoneNumber}\nSistema: ${payload.operatingSystem}`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#0d1528;">
        <h1 style="margin:0 0 16px;">Nuevo lead de lista de espera</h1>
        <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:520px;">
          <tr><td style="padding:10px;border:1px solid #d8e0ea;font-weight:bold;">Nombre</td><td style="padding:10px;border:1px solid #d8e0ea;">${fullName}</td></tr>
          <tr><td style="padding:10px;border:1px solid #d8e0ea;font-weight:bold;">Email</td><td style="padding:10px;border:1px solid #d8e0ea;">${email}</td></tr>
          <tr><td style="padding:10px;border:1px solid #d8e0ea;font-weight:bold;">Telefono</td><td style="padding:10px;border:1px solid #d8e0ea;">${phoneNumber}</td></tr>
          <tr><td style="padding:10px;border:1px solid #d8e0ea;font-weight:bold;">Sistema</td><td style="padding:10px;border:1px solid #d8e0ea;">${operatingSystem}</td></tr>
        </table>
      </div>
    `,
    tags: [
      { name: "source", value: "waitlist" },
      { name: "type", value: "admin_notification" },
      { name: "os", value: payload.operatingSystem.toLowerCase() },
    ],
  };
}

async function sendResendEmail(
  apiKey: string,
  payload: ResendEmailPayload,
  idempotencyKey: string,
) {
  const response = await fetch(RESEND_EMAILS_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      `Resend no pudo enviar el email (${response.status}): ${message}`,
    );
  }
}

export async function sendWaitlistRegistrationEmails(
  payload: WaitlistPayload,
  options: SendWaitlistRegistrationEmailsOptions = {},
) {
  const resendConfig = getResendConfig();

  if (!resendConfig) {
    return;
  }

  const adminRecipients = parseRecipients(process.env.RESEND_WAITLIST_NOTIFY_TO);
  const emails = [
    {
      idempotencyKey: createIdempotencyKey(
        "waitlist_confirmation",
        payload,
        options.leadId,
      ),
      payload: createConfirmationEmail(payload, resendConfig.from),
    },
    ...adminRecipients.map((recipient) => ({
      idempotencyKey: createIdempotencyKey(
        `waitlist_admin_${recipient}`,
        payload,
        options.leadId,
      ),
      payload: createAdminNotificationEmail(
        payload,
        resendConfig.from,
        [recipient],
      ),
    })),
  ];

  const results = await Promise.allSettled(
    emails.map((email) =>
      sendResendEmail(resendConfig.apiKey, email.payload, email.idempotencyKey),
    ),
  );
  const failedResult = results.find((result) => result.status === "rejected");

  if (failedResult?.status === "rejected") {
    throw failedResult.reason;
  }
}
