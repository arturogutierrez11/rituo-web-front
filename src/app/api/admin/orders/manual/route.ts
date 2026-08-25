import { NextResponse } from "next/server";

import { createManualOrder } from "@/services/checkout-api";
import type { CreateManualOrderPayload } from "@/types/order";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateManualOrderPayload;
    return NextResponse.json(await createManualOrder(body));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos registrar la venta",
      },
      { status: 400 },
    );
  }
}
