import { NextResponse } from "next/server";

import { listAdmins } from "@/services/checkout-api";

export async function GET() {
  try {
    return NextResponse.json(await listAdmins());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos cargar los admins",
      },
      { status: 400 },
    );
  }
}
