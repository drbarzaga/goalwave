import { pageMetadata } from "@/lib/metadata";
import HeroSection from "@/components/features/marketing/hero-section";
import FeaturesSection from "@/components/features/marketing/features-section";
import CommunitySection from "@/components/features/marketing/community-section";
import CallToAction from "@/components/features/marketing/cta-section";
import Footer from "@/components/features/marketing/footer";

export const metadata = pageMetadata.home();

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
      <CallToAction />
      <Footer />
    </>
  );
}
