const COOKIE_NAME = "rituo_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export interface AdminSessionPayload {
  uid: string;
  email: string | null;
  exp: number;
}

interface AdminIdentity {
  id: string;
  email: string | null;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function getSecretKey(): Promise<CryptoKey> {
  const secret = process.env.RITUO_ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("RITUO_ADMIN_SESSION_SECRET is not configured");
  }

  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createAdminSessionToken(
  admin: AdminIdentity,
): Promise<string> {
  const payload: AdminSessionPayload = {
    uid: admin.id,
    email: admin.email,
    exp: Date.now() + SESSION_TTL_MS,
  };

  const payloadPart = toBase64Url(
    new TextEncoder().encode(JSON.stringify(payload)),
  );
  const key = await getSecretKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadPart),
  );

  return `${payloadPart}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null,
): Promise<AdminSessionPayload | null> {
  if (!token) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split(".");

  if (!payloadPart || !signaturePart) {
    return null;
  }

  try {
    const key = await getSecretKey();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signaturePart) as BufferSource,
      new TextEncoder().encode(payloadPart),
    );

    if (!isValid) {
      return null;
    }

    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payloadPart)),
    ) as AdminSessionPayload;

    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
