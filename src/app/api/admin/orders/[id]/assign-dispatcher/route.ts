import { NextResponse } from "next/server";

import { assignOrderDispatcher } from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = (await request.json()) as { dispatcher: string | null };
    return NextResponse.json(await assignOrderDispatcher(id, body.dispatcher));
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
