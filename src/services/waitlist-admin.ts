import "server-only";

import type { WaitlistLead } from "@/types/waitlist";

const DEFAULT_BACKEND_API_URL = "http://159.89.37.132";

function getBackendApiUrl() {
  return (
    process.env.RITUO_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_BACKEND_API_URL
  );
}

function buildBackendUrl(path: string) {
  const baseUrl = getBackendApiUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

function parseWaitlistLeads(data: unknown): WaitlistLead[] {
  if (!Array.isArray(data)) {
    throw new Error("La API no devolvió una lista de espera válida");
  }

  return data as WaitlistLead[];
}

export async function getWaitlistLeads() {
  const internalApiKey = process.env.RITUO_INTERNAL_API_KEY;

  if (!internalApiKey) {
    throw new Error("Falta configurar RITUO_INTERNAL_API_KEY");
  }

  const response = await fetch(buildBackendUrl("/landing/waitlist-leads"), {
    headers: {
      Accept: "application/json",
      "x-internal-api-key": internalApiKey,
    },
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : [];

  if (!response.ok) {
    throw new Error(`No pudimos cargar la lista de espera (${response.status})`);
  }

  return parseWaitlistLeads(data);
}
