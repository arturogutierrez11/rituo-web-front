import "server-only";

import type { ProductCommerce } from "@/types/product";
import type { CheckoutRequestPayload } from "@/types/checkout";
import type {
  MarkOrderShippedPayload,
  Order,
  OrderStatusValue,
  ShippingStatusValue,
} from "@/types/order";
import type {
  InventoryMovement,
  ProductStock,
  RecordGiftPayload,
  RestockPayload,
} from "@/types/inventory";

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

export async function getOrder(orderId: string): Promise<Order | null> {
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

  return data as Order;
}

export async function listOrders(status?: OrderStatusValue): Promise<Order[]> {
  const query = status ? `?status=${status}&limit=200` : "?limit=200";
  const response = await fetch(buildCheckoutUrl(`/orders${query}`), {
    headers: {
      Accept: "application/json",
      "x-internal-api-key": getInternalApiKey(),
    },
    cache: "no-store",
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(`No pudimos cargar las órdenes (${response.status})`);
  }

  return data as Order[];
}

async function postOrderAction(
  orderId: string,
  action:
    | "cancel"
    | "ship"
    | "resync"
    | "shipping-status"
    | "invoice-status"
    | "return"
    | "shipping-label",
  body?: unknown,
): Promise<Order> {
  const response = await fetch(buildCheckoutUrl(`/orders/${orderId}/${action}`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-internal-api-key": getInternalApiKey(),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `No pudimos completar la acción (${response.status})`;
    throw new Error(message);
  }

  return data as Order;
}

export function cancelOrder(orderId: string): Promise<Order> {
  return postOrderAction(orderId, "cancel");
}

export function markOrderShipped(
  orderId: string,
  payload: MarkOrderShippedPayload,
): Promise<Order> {
  return postOrderAction(orderId, "ship", payload);
}

export function resyncOrder(orderId: string): Promise<Order> {
  return postOrderAction(orderId, "resync");
}

export function setShippingStatus(
  orderId: string,
  status: ShippingStatusValue,
): Promise<Order> {
  return postOrderAction(orderId, "shipping-status", { status });
}

export function setInvoiceStatus(
  orderId: string,
  invoiced: boolean,
): Promise<Order> {
  return postOrderAction(orderId, "invoice-status", { invoiced });
}

export function returnOrder(orderId: string, note?: string): Promise<Order> {
  return postOrderAction(orderId, "return", note ? { note } : undefined);
}

export function generateShippingLabel(orderId: string): Promise<Order> {
  return postOrderAction(orderId, "shipping-label");
}

export async function downloadShippingLabel(
  orderId: string,
): Promise<{ buffer: ArrayBuffer; contentType: string }> {
  const response = await fetch(
    buildCheckoutUrl(`/orders/${orderId}/shipping-label`),
    {
      headers: {
        Accept: "application/pdf",
        "x-internal-api-key": getInternalApiKey(),
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const data = await parseJson(response).catch(() => undefined);
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `No pudimos descargar la etiqueta (${response.status})`;
    throw new Error(message);
  }

  return {
    buffer: await response.arrayBuffer(),
    contentType: response.headers.get("content-type") ?? "application/pdf",
  };
}

export async function listInventoryProducts(): Promise<ProductStock[]> {
  const response = await fetch(buildCheckoutUrl("/inventory/products"), {
    headers: {
      Accept: "application/json",
      "x-internal-api-key": getInternalApiKey(),
    },
    cache: "no-store",
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(`No pudimos cargar el inventario (${response.status})`);
  }

  return data as ProductStock[];
}

export async function listInventoryMovements(
  productId?: string,
): Promise<InventoryMovement[]> {
  const query = productId ? `?productId=${productId}&limit=100` : "?limit=100";
  const response = await fetch(buildCheckoutUrl(`/inventory/movements${query}`), {
    headers: {
      Accept: "application/json",
      "x-internal-api-key": getInternalApiKey(),
    },
    cache: "no-store",
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(`No pudimos cargar los movimientos (${response.status})`);
  }

  return data as InventoryMovement[];
}

async function postInventoryAction(
  path: "restock" | "gifts",
  body: unknown,
): Promise<InventoryMovement> {
  const response = await fetch(buildCheckoutUrl(`/inventory/${path}`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-internal-api-key": getInternalApiKey(),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `No pudimos completar la acción (${response.status})`;
    throw new Error(message);
  }

  return data as InventoryMovement;
}

export function restockProduct(payload: RestockPayload): Promise<InventoryMovement> {
  return postInventoryAction("restock", payload);
}

export function recordGift(payload: RecordGiftPayload): Promise<InventoryMovement> {
  return postInventoryAction("gifts", payload);
}

export async function listAllProducts(): Promise<ProductStock[]> {
  const response = await fetch(buildCheckoutUrl("/products/all"), {
    headers: {
      Accept: "application/json",
      "x-internal-api-key": getInternalApiKey(),
    },
    cache: "no-store",
  });

  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(`No pudimos cargar el catálogo (${response.status})`);
  }

  return data as ProductStock[];
}

export async function updateProductPrice(
  productId: string,
  price: number,
): Promise<ProductStock> {
  const response = await fetch(buildCheckoutUrl(`/products/${productId}/price`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-internal-api-key": getInternalApiKey(),
    },
    body: JSON.stringify({ price }),
    cache: "no-store",
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : `No pudimos actualizar el precio (${response.status})`;
    throw new Error(message);
  }

  return data as ProductStock;
}
