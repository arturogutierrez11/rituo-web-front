import "server-only";

import type {
  CreateSupportResetPayload,
  SupportResetRequest,
  SupportResetUser,
} from "@/types/support-reset";

const DEFAULT_BACKEND_API_URL = "https://api.rituo.io";

function buildBackendUrl(path: string) {
  const baseUrl = (
    process.env.RITUO_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_BACKEND_API_URL
  ).replace(/\/$/, "");
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getHeaders() {
  const key = process.env.RITUO_INTERNAL_API_KEY;
  if (!key) throw new Error("Falta configurar RITUO_INTERNAL_API_KEY");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-internal-api-key": key,
  };
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  return text ? (JSON.parse(text) as unknown) : null;
}

export async function searchSupportResetUsers(query: string) {
  const response = await fetch(
    buildBackendUrl(`/support-resets/admin/users?query=${encodeURIComponent(query)}`),
    { headers: getHeaders(), cache: "no-store" },
  );
  const data = await readJson(response);
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String(data.message)
        : `No pudimos buscar el usuario (${response.status})`;
    throw new Error(message);
  }
  return data as SupportResetUser[];
}

export async function createSupportReset(payload: CreateSupportResetPayload) {
  const response = await fetch(
    buildBackendUrl("/support-resets/admin/requests"),
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );
  const data = await readJson(response);
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String(data.message)
        : `No pudimos solicitar el rescate (${response.status})`;
    throw new Error(message);
  }
  return data as SupportResetRequest;
}
