import { Arimo } from "next/font/google";

import { HeroVideo } from "@/components/redesign/hero-video";
import { HeroCard } from "@/components/redesign/hero-card";
import { AppsPills } from "@/components/redesign/apps-pills";
import { ModosRituales } from "@/components/redesign/modos-rituales";
import { CardReveal } from "@/components/redesign/card-reveal";
import { ComoFunciona } from "@/components/redesign/como-funciona";
import { LifeSections } from "@/components/redesign/life-sections";
import { Producto } from "@/components/redesign/producto";
import { Faq } from "@/components/redesign/faq";
import { RtFooter } from "@/components/redesign/rt-footer";

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arimo",
});

export default function Home() {
  return (
    <main className={`rt-page ${arimo.variable}`}>
      <HeroVideo />
      <HeroCard />
      <AppsPills />
      <ModosRituales />
      <CardReveal />
      <ComoFunciona />
      <LifeSections />
      <Producto />
      <Faq />
      <RtFooter />
    </main>
  );
}
