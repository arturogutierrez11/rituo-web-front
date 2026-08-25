import { NextResponse } from "next/server";

import { adjustStock } from "@/services/checkout-api";
import type { AdjustStockPayload } from "@/types/inventory";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AdjustStockPayload;
    return NextResponse.json(await adjustStock(body));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos ajustar el stock",
      },
      { status: 400 },
    );
  }
}
