import { NextResponse } from "next/server";

import { getBankTransferDetails } from "@/services/checkout-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getBankTransferDetails());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "El pago por transferencia no está disponible por el momento.",
      },
      { status: 503 },
    );
  }
}
