import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FeaturesStrip } from "@/components/sections/features-strip";
import { WaitlistSection } from "@/components/sections/waitlist-section";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <FeaturesStrip />
      <WaitlistSection />
      <Footer />
    </main>
  );
}
