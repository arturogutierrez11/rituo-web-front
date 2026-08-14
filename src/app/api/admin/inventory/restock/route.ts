import { NextResponse } from "next/server";

import { restockProduct } from "@/services/checkout-api";
import type { RestockPayload } from "@/types/inventory";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RestockPayload;
    return NextResponse.json(await restockProduct(body));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos registrar el ingreso",
      },
      { status: 400 },
    );
  }
}
