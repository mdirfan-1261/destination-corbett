import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Send } from "lucide-react";
import { stayData } from "@/data/stay";

export default function StayPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative h-[400px] sm:h-[440px] md:h-[480px] overflow-hidden">
        <Image
          src={stayData.categories[0].image}
          alt="Jim Corbett Stay"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-110"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/65 via-[#111827]/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[3px] text-[#E1A05B] mb-3">
              {stayData.eyebrow}
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12]">
              Find Your Perfect Stay in Jim Corbett
            </h1>

            <p className="mt-4 md:mt-5 text-sm sm:text-base md:text-lg text-white/80 leading-6 md:leading-7 max-w-xl">
              {stayData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stay Categories */}
      <section className="py-12 md:py-14 lg:py-16 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          {/* Heading */}
          <div className="max-w-2xl mb-7 md:mb-9">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[3px] text-[#C88A3D] mb-2.5 md:mb-3">
              EXPLORE STAYS
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#172033] leading-[1.15]">
              Stay Options for Every Requirement
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {stayData.categories.map((category) => (
              <div
                key={category.id}
                className="group relative h-[300px] sm:h-[320px] md:h-[330px] overflow-hidden rounded-xl md:rounded-2xl border border-black/5 shadow-sm"
              >
                {/* Image */}
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/85 via-[#111827]/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">
                    {category.title}
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm text-white/75 leading-5 max-w-xl line-clamp-2">
                    {category.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-2.5 mt-4">
                    {/* View Stay */}
                    <Link
                      href={category.href}
                      className="inline-flex items-center justify-center gap-1.5 bg-white text-[#172033] px-4 py-2.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#C88A3D] hover:text-white transition-all duration-300"
                    >
                      View Stay
                      <ArrowRight size={15} />
                    </Link>

                    {/* Enquiry */}
                    <Link
                      href={`/contact?hotel=${encodeURIComponent(
                        category.title
                      )}&hotelImage=${encodeURIComponent(
                        category.image
                      )}&location=${encodeURIComponent(
                        "Jim Corbett, Uttarakhand"
                      )}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#C88A3D] text-white px-4 py-2.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-[#A96F2E] transition-all duration-300"
                    >
                      Enquire Now
                      <Send size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}