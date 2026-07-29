import { NextResponse, type NextRequest } from "next/server";
import { searchSupportResetUsers } from "@/services/support-reset-admin";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query") ?? "";
    return NextResponse.json(await searchSupportResetUsers(query));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "No pudimos buscar el usuario" },
      { status: 400 },
    );
  }
}
