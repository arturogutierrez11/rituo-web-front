import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      name: "Rituo Admin",
      short_name: "Rituo Admin",
      description: "Panel interno de Rituo: órdenes, inventario y contenidos.",
      start_url: "/rituo-admin/panel",
      scope: "/rituo-admin",
      display: "standalone",
      background_color: "#161a33",
      theme_color: "#161a33",
      icons: [
        {
          src: "/icon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
        {
          src: "/icon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "maskable",
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/manifest+json",
      },
    },
  );
}
