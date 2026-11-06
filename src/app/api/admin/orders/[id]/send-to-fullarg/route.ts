import { NextResponse } from "next/server";

import { sendOrderToFullarg } from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    return NextResponse.json(await sendOrderToFullarg(id));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos enviar la orden a Fullarg",
      },
      { status: 400 },
    );
  }
}
