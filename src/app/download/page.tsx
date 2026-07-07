import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DownloadHero } from "@/components/sections/download-hero";

export const metadata: Metadata = {
  title: "Descargá rituo — App Store y Google Play",
  description:
    "Descargá la app de rituo en App Store o Google Play y empezá a crear tus rituales de foco.",
};

export default function DownloadPage() {
  return (
    <main>
      <Header />
      <DownloadHero />
      <Footer />
    </main>
  );
}
