import { NextResponse } from "next/server";

import { returnOrder } from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = (await request.json().catch(() => ({}))) as { note?: string };
    return NextResponse.json(await returnOrder(id, body.note));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos registrar la devolución",
      },
      { status: 400 },
    );
  }
}
