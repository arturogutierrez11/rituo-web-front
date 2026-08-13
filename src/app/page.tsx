import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FeaturesStrip } from "@/components/sections/features-strip";
import { Products } from "@/components/sections/products";
import { DownloadHero } from "@/components/sections/download-hero";
import { SpacesTeaser } from "@/components/sections/spaces-teaser";

export default async function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <FeaturesStrip />
      <Products />
      <DownloadHero />
      <SpacesTeaser />
      <Footer />
    </main>
  );
}
