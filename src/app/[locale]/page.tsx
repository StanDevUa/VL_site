import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { ServicesSection } from "@/components/home/services-section";
import { FactsSection } from "@/components/home/facts-section";
import { MethodSection } from "@/components/home/method-section";
import { ReviewsSection } from "@/components/home/reviews-section";
import { WorksSection } from "@/components/home/works-section";
import { ProcessSection } from "@/components/home/process-section";
import { NewsSection } from "@/components/home/news-section";
import { VideoSection } from "@/components/home/video-section";
import { ShopSection } from "@/components/home/shop-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FactsSection />
      <MethodSection />
      <ReviewsSection />
      <WorksSection />
      <ProcessSection />
      <NewsSection />
      <VideoSection />
      <ShopSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
