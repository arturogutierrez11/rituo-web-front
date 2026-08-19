import { NextResponse } from "next/server";

import { updateProductPrice } from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = (await request.json()) as { price?: unknown };

    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0) {
      return NextResponse.json(
        { message: "El precio tiene que ser un número mayor o igual a 0." },
        { status: 400 },
      );
    }

    return NextResponse.json(await updateProductPrice(id, body.price));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos actualizar el precio",
      },
      { status: 400 },
    );
  }
}
