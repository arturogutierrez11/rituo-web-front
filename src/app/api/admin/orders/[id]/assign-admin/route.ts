import { NextResponse } from "next/server";

import { assignOrderAdmin } from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = (await request.json()) as { adminUserId: string | null };
    return NextResponse.json(await assignOrderAdmin(id, body.adminUserId));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos asignar el responsable",
      },
      { status: 400 },
    );
  }
}
