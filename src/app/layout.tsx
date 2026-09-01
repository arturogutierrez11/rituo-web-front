import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { MetaPixel } from "@/components/analytics/meta-pixel";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "rituo — Volvé al presente.",
  description:
    "rituo convierte el impulso de abrir una app en una decisión consciente, agregando un pequeño ritual entre vos y las distracciones.",
  other: {
    "facebook-domain-verification": "flmoprmoci0pucm9vfjvb4kkxupz1s",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <MetaPixel />
      </head>
      <body className={manrope.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
