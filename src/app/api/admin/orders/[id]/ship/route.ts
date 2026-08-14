import { NextResponse } from "next/server";

import { markOrderShipped } from "@/services/checkout-api";
import type { MarkOrderShippedPayload } from "@/types/order";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = (await request.json().catch(() => ({}))) as MarkOrderShippedPayload;
    return NextResponse.json(await markOrderShipped(id, body));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos marcar la orden como enviada",
      },
      { status: 400 },
    );
  }
}
