import "server-only";

import type {
  LegalDocument,
  PublishLegalDocumentPayload,
} from "@/types/legal";

const DEFAULT_BACKEND_API_URL = "http://159.89.37.132";

function buildBackendUrl(path: string) {
  const baseUrl = (
    process.env.RITUO_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    DEFAULT_BACKEND_API_URL
  ).replace(/\/$/, "");

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getInternalHeaders() {
  const internalApiKey = process.env.RITUO_INTERNAL_API_KEY;
  if (!internalApiKey) {
    throw new Error("Falta configurar RITUO_INTERNAL_API_KEY");
  }

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-internal-api-key": internalApiKey,
  };
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  return text ? (JSON.parse(text) as unknown) : null;
}

export async function getLegalDocuments(): Promise<LegalDocument[]> {
  const response = await fetch(buildBackendUrl("/legal/admin/documents"), {
    headers: getInternalHeaders(),
    cache: "no-store",
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error(`No pudimos cargar los documentos (${response.status})`);
  }
  if (!Array.isArray(data)) {
    throw new Error("La API no devolvió documentos legales válidos");
  }

  return data as LegalDocument[];
}

export async function publishLegalDocument(
  payload: PublishLegalDocumentPayload,
): Promise<LegalDocument> {
  const response = await fetch(buildBackendUrl("/legal/admin/documents"), {
    method: "POST",
    headers: getInternalHeaders(),
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await readJson(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String(data.message)
        : `No pudimos publicar el documento (${response.status})`;
    throw new Error(message);
  }

  return data as LegalDocument;
}
