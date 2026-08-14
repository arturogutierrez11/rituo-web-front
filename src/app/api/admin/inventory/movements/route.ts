import { NextResponse } from "next/server";

import { listInventoryMovements } from "@/services/checkout-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId") ?? undefined;

  try {
    return NextResponse.json(await listInventoryMovements(productId));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos cargar los movimientos",
      },
      { status: 400 },
    );
  }
}
