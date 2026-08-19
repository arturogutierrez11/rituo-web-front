import { NextResponse } from "next/server";

import {
  downloadShippingLabel,
  generateShippingLabel,
} from "@/services/checkout-api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    return NextResponse.json(await generateShippingLabel(id));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos generar la etiqueta de envío",
      },
      { status: 400 },
    );
  }
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const label = await downloadShippingLabel(id);
    return new NextResponse(label.buffer, {
      headers: {
        "Content-Type": label.contentType,
        "Content-Disposition": `attachment; filename="etiqueta-${id.slice(0, 8)}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos descargar la etiqueta",
      },
      { status: 400 },
    );
  }
}
