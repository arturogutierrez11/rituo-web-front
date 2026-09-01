import { NextResponse, type NextRequest } from "next/server";

import { createOrder } from "@/services/checkout-api";
import type { CheckoutRequestPayload } from "@/types/checkout";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function parsePayload(
  body: Partial<CheckoutRequestPayload>,
): CheckoutRequestPayload | null {
  if (!isNonEmptyString(body.productSlug, 60)) return null;

  if (
    typeof body.quantity !== "number" ||
    !Number.isInteger(body.quantity) ||
    body.quantity < 1 ||
    body.quantity > 20
  ) {
    return null;
  }

  if (body.shippingMethod !== "standard" && body.shippingMethod !== "express") {
    return null;
  }

  const customer = body.customer;
  if (
    !customer ||
    !isNonEmptyString(customer.firstName, 60) ||
    !isNonEmptyString(customer.lastName, 60) ||
    !isNonEmptyString(customer.phone, 30) ||
    typeof customer.email !== "string" ||
    customer.email.length > 160 ||
    !EMAIL_PATTERN.test(customer.email)
  ) {
    return null;
  }

  const address = body.shippingAddress;
  if (
    !address ||
    !isNonEmptyString(address.address, 160) ||
    !isNonEmptyString(address.city, 80) ||
    !isNonEmptyString(address.province, 80) ||
    !isNonEmptyString(address.postalCode, 12)
  ) {
    return null;
  }

  const billing = body.billing;
  if (!billing || !isNonEmptyString(billing.dni, 8)) {
    return null;
  }
  if (typeof billing.useShippingAddress !== "boolean") return null;
  if (!billing.useShippingAddress) {
    if (
      !isNonEmptyString(billing.address, 160) ||
      !isNonEmptyString(billing.city, 80) ||
      !isNonEmptyString(billing.province, 80) ||
      !isNonEmptyString(billing.postalCode, 12)
    ) {
      return null;
    }
  }
  if (typeof billing.isBusinessPurchase !== "boolean") return null;
  if (billing.isBusinessPurchase) {
    if (!isNonEmptyString(billing.cuit, 13) || !isNonEmptyString(billing.businessName, 160)) {
      return null;
    }
  }

  const tracking = body.tracking;

  return {
    productSlug: body.productSlug.trim(),
    quantity: body.quantity,
    shippingMethod: body.shippingMethod,
    customer: {
      firstName: customer.firstName.trim(),
      lastName: customer.lastName.trim(),
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone.trim(),
    },
    shippingAddress: {
      address: address.address.trim(),
      city: address.city.trim(),
      province: address.province.trim(),
      postalCode: address.postalCode.trim(),
    },
    billing: {
      dni: billing.dni.trim(),
      useShippingAddress: billing.useShippingAddress,
      address: billing.address?.trim(),
      city: billing.city?.trim(),
      province: billing.province?.trim(),
      postalCode: billing.postalCode?.trim(),
      isBusinessPurchase: billing.isBusinessPurchase,
      cuit: billing.cuit?.trim(),
      businessName: billing.businessName?.trim(),
    },
    tracking: {
      fbp: typeof tracking?.fbp === "string" ? tracking.fbp : null,
      fbc: typeof tracking?.fbc === "string" ? tracking.fbc : null,
    },
  };
}

export async function POST(request: NextRequest) {
  let payload: CheckoutRequestPayload | null;

  try {
    const body = (await request.json()) as Partial<CheckoutRequestPayload>;
    payload = parsePayload(body);
  } catch {
    return NextResponse.json({ message: "Datos inválidos." }, { status: 400 });
  }

  if (!payload) {
    return NextResponse.json(
      { message: "Revisá los datos e intentá nuevamente." },
      { status: 400 },
    );
  }

  const idempotencyKey = request.headers.get("idempotency-key");

  if (!idempotencyKey) {
    return NextResponse.json(
      { message: "Falta el identificador de intento de compra." },
      { status: 400 },
    );
  }

  const clientIpAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const clientUserAgent = request.headers.get("user-agent") ?? null;

  const payloadWithClient: CheckoutRequestPayload = {
    ...payload,
    tracking: {
      ...payload.tracking,
      fbp: payload.tracking?.fbp ?? null,
      fbc: payload.tracking?.fbc ?? null,
      clientIpAddress,
      clientUserAgent,
    },
  };

  try {
    const result = await createOrder(payloadWithClient, idempotencyKey);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("No pudimos crear la orden", error);
    const message =
      error instanceof Error
        ? error.message
        : "No pudimos iniciar el pago. Probá de nuevo en unos segundos.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
