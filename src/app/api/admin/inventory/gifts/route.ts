import { NextResponse } from "next/server";

import { recordGift } from "@/services/checkout-api";
import type { RecordGiftPayload } from "@/types/inventory";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecordGiftPayload;
    return NextResponse.json(await recordGift(body));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos registrar el regalo",
      },
      { status: 400 },
    );
  }
}
