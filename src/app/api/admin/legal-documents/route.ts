import { NextResponse, type NextRequest } from "next/server";

import {
  getLegalDocuments,
  publishLegalDocument,
} from "@/services/legal-admin";
import type { PublishLegalDocumentPayload } from "@/types/legal";

export async function GET() {
  try {
    return NextResponse.json(await getLegalDocuments());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos cargar los documentos",
      },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as PublishLegalDocumentPayload;
    const document = await publishLegalDocument(payload);
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No pudimos publicar el documento",
      },
      { status: 400 },
    );
  }
}
