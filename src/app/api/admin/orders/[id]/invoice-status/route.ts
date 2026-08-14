import { NextResponse } from "next/server";

import { setInvoiceStatus } from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = (await request.json()) as { invoiced: boolean };
    return NextResponse.json(await setInvoiceStatus(id, body.invoiced));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos actualizar el estado de facturación",
      },
      { status: 400 },
    );
  }
}
