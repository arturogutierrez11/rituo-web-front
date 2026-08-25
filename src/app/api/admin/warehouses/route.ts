import { NextResponse } from "next/server";

import { createWarehouse, listWarehouses } from "@/services/checkout-api";
import type { CreateWarehousePayload } from "@/types/warehouse";

export async function GET() {
  try {
    return NextResponse.json(await listWarehouses());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos cargar los depósitos",
      },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateWarehousePayload;
    return NextResponse.json(await createWarehouse(body));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos crear el depósito",
      },
      { status: 400 },
    );
  }
}
