import Hero from "@/components/home/Hero";
import HomeConversionCTA from "@/components/home/HomeConversionCTA";
import Services from "@/components/home/Services";
import MICESection from "@/components/home/MICESection";
import StaySection from "@/components/home/StaySection";
import HomeAboutSection from "@/components/home/HomeAboutSection";

export default function Home() {
  return (
    <main className="min-w-0 overflow-x-clip">
      <Hero />
      <HomeConversionCTA />
      <Services />
      <MICESection />
      <StaySection />
      <HomeAboutSection />
    </main>
  );
}