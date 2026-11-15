import { NextResponse } from "next/server";

import { sendOrderToFullarg } from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    shippingMethod?: unknown;
    quantity?: unknown;
  };
  const shippingMethod =
    typeof body.shippingMethod === "string" && body.shippingMethod.trim()
      ? body.shippingMethod.trim()
      : undefined;
  const quantity =
    typeof body.quantity === "number" && Number.isInteger(body.quantity)
      ? body.quantity
      : undefined;

  try {
    return NextResponse.json(await sendOrderToFullarg(id, { shippingMethod, quantity }));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos enviar la orden a Fullarg",
      },
      { status: 400 },
    );
  }
}
