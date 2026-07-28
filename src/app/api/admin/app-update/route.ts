import { NextResponse, type NextRequest } from "next/server";

import {
  getAppUpdateConfiguration,
  saveAppUpdateConfiguration,
} from "@/services/app-update-admin";
import type { SaveAppUpdateConfigurationPayload } from "@/types/app-update";

export async function GET() {
  try {
    return NextResponse.json(await getAppUpdateConfiguration());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos cargar la configuración",
      },
      { status: 502 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload =
      (await request.json()) as SaveAppUpdateConfigurationPayload;
    return NextResponse.json(await saveAppUpdateConfiguration(payload));
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "No pudimos guardar la configuración",
      },
      { status: 400 },
    );
  }
}
