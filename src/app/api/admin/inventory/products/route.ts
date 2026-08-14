import { NextResponse } from "next/server";

import { listInventoryProducts } from "@/services/checkout-api";

export async function GET() {
  try {
    return NextResponse.json(await listInventoryProducts());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos cargar el inventario",
      },
      { status: 400 },
    );
  }
}
