import "server-only";

import type { ProductCommerce } from "@/types/product";
import type { CheckoutRequestPayload } from "@/types/checkout";

const DEFAULT_CHECKOUT_API_URL = "http://localhost:3001";

function getCheckoutApiUrl() {
  return process.env.RITUO_CHECKOUT_API_URL ?? DEFAULT_CHECKOUT_API_URL;
}

function buildCheckoutUrl(path: string) {
  const baseUrl = getCheckoutApiUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

function getInternalApiKey() {
  const key = process.env.RITUO_CHECKOUT_INTERNAL_API_KEY;

  if (!key) {
    throw new Error("Falta configurar RITUO_CHECKOUT_INTERNAL_API_KEY");
  }

  return key;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  return text ? (JSON.parse(text) as unknown) : undefined;
}

export async function listProducts(): Promise<ProductCommerce[]> {
  const response = await fetch(buildCheckoutUrl("/products"), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(`No pudimos cargar el catálogo (${response.status})`);
  }

  return data as ProductCommerce[];
}

export interface CreateOrderResult {
  orderId: string;
  initPoint: string;
}

export async function createOrder(
  payload: CheckoutRequestPayload,
  idempotencyKey: string,
): Promise<CreateOrderResult> {
  const response = await fetch(buildCheckoutUrl("/orders"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-internal-api-key": getInternalApiKey(),
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `No pudimos crear la orden (${response.status})`;
    throw new Error(message);
  }

  return data as CreateOrderResult;
}

export interface OrderStatus {
  id: string;
  status: string;
  productName: string;
  total: number;
  currency: string;
  mpPaymentId: string | null;
  mpPaymentStatus: string | null;
}

export async function getOrder(orderId: string): Promise<OrderStatus | null> {
  const response = await fetch(buildCheckoutUrl(`/orders/${orderId}`), {
    headers: {
      Accept: "application/json",
      "x-internal-api-key": getInternalApiKey(),
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(`No pudimos consultar la orden (${response.status})`);
  }

  return data as OrderStatus;
}
