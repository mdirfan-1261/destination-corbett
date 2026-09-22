import Image from "next/image";

import Hero from "@/components/home/Hero"
import Stats from "@/components/home/Stats";
import Services from "@/components/home/Services";
import MICESection from "@/components/home/MICESection";
import StaySection from "@/components/home/StaySection";

export default function Home() {
  return (
   <main>
    <Hero/>
    <Services/>
    <MICESection/>
    <StaySection/>
   {/* <Stats/>*/}
    
   </main>
  );
}
