import { NextResponse } from "next/server";

import { reserveOrderStock } from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = (await request.json()) as { warehouseId?: string };

    if (!body.warehouseId) {
      return NextResponse.json(
        { message: "Falta elegir el depósito." },
        { status: 400 },
      );
    }

    return NextResponse.json(await reserveOrderStock(id, body.warehouseId));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos asignar el depósito",
      },
      { status: 400 },
    );
  }
}
