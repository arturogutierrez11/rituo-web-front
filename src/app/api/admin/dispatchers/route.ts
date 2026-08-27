import { NextResponse } from "next/server";

import { listDispatchers } from "@/services/checkout-api";

export async function GET() {
  try {
    return NextResponse.json(await listDispatchers());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos cargar los responsables",
      },
      { status: 400 },
    );
  }
}
