import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/rituo-admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rituo Admin",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: "#161a33",
};

export default function RituoAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
