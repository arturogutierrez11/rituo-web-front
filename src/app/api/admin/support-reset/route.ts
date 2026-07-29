import { NextResponse, type NextRequest } from "next/server";
import { createSupportReset } from "@/services/support-reset-admin";
import type { CreateSupportResetPayload } from "@/types/support-reset";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CreateSupportResetPayload;
    return NextResponse.json(await createSupportReset(payload), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "No pudimos solicitar el rescate" },
      { status: 400 },
    );
  }
}
