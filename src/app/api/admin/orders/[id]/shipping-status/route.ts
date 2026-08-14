import { NextResponse } from "next/server";

import { setShippingStatus } from "@/services/checkout-api";
import type { ShippingStatusValue } from "@/types/order";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = (await request.json()) as { status: ShippingStatusValue };
    return NextResponse.json(await setShippingStatus(id, body.status));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos actualizar el estado de envío",
      },
      { status: 400 },
    );
  }
}
