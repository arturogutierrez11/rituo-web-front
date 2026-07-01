import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AppExperience } from "@/components/sections/app-experience";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PresaleWaitlist } from "@/components/sections/presale-waitlist";
import { StatsStrip } from "@/components/sections/stats-strip";
import { VideoStory } from "@/components/sections/video-story";

export default function Home() {
  return (
    <main>
      <div className="page-shell">
        <Header />
        <Hero />
        <StatsStrip />
        <AppExperience />
        <HowItWorks />
        <VideoStory />
        <PresaleWaitlist />
        <Footer />
      </div>
    </main>
  );
}
