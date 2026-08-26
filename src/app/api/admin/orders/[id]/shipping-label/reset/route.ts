import { NextResponse } from "next/server";

import { resetShippingLabel } from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    return NextResponse.json(await resetShippingLabel(id));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos reiniciar la etiqueta de envío",
      },
      { status: 400 },
    );
  }
}
