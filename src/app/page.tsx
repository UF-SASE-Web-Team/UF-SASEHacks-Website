import { fetchFaqFromNotion } from "@/lib/notion";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import TracksSection from "@/components/sections/TracksSection";
import ScheduleSection from "@/components/sections/ScheduleSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import FaqSection from "@/components/sections/FaqSection";

async function getFaq() {
  try {
    const items = await fetchFaqFromNotion();
    console.log("FAQ items loaded:", items.length);
    return items;
  } catch (error) {
    console.error("Failed to load FAQ:", error);
    return [];
  }
}

export default async function Page() {
  const faq = await getFaq();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <TracksSection />
      <ScheduleSection />
      <SponsorsSection />
      <FaqSection faqItems={faq} />
    </>
  );
}
