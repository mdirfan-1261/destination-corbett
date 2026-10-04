import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Send,
  MapPin,
  BedDouble,
} from "lucide-react";
import { stayData } from "@/data/stay";

export default function StayPage() {
  return (
    <main className="bg-white">

      {/* ================= HERO ================= */}
      <section className="overflow-hidden bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto min-h-[300px] max-w-[1440px] overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[410px] sm:rounded-[24px] md:min-h-[450px] md:rounded-[28px] lg:min-h-[560px]">

          {/* Hero Image */}
          <div className="absolute inset-0 lg:left-auto lg:w-[62%]">
            <Image
              src={stayData.categories[0].image}
              alt="Jim Corbett Stay"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 900px"
              className="object-cover object-center brightness-110"
            />
          </div>

          {/* Hero Image Blend */}
          <div className="pointer-events-none absolute inset-y-0 left-[38%] hidden w-[18%] bg-gradient-to-r from-[#172033] to-transparent lg:block" />

          <div className="absolute inset-0 bg-black/5" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/45 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/55 via-transparent to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 flex min-h-[300px] items-center px-5 py-8 sm:min-h-[410px] sm:px-8 sm:py-10 md:min-h-[450px] md:px-10 lg:min-h-[560px] lg:px-14">
            <div className="max-w-2xl">

              {/* Eyebrow */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl sm:mb-4 sm:px-3">
                <BedDouble className="h-3 w-3 text-[#C87532] sm:h-3.5 sm:w-3.5" />
                {stayData.eyebrow}
              </div>

              {/* Heading */}
              <h1 className="max-w-2xl text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Find Your Perfect

                <span className="mt-1 block text-[#C87532] sm:mt-2">
                  Stay in Jim Corbett
                </span>
              </h1>

              {/* Description */}
              <p className="mt-3 max-w-xl text-xs leading-5 text-white/80 sm:mt-4 sm:text-sm sm:leading-6 md:text-base md:leading-7">
                {stayData.description}
              </p>

              {/* Hero Buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5">

                <Link
                  href="#stays"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] hover:shadow-lg sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  Explore Stays
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/contact?type=stay"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl transition-all duration-200 hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  Make an Enquiry
                  <Send size={14} />
                </Link>

              </div>

              {/* Highlights */}
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-white/70 sm:mt-6 sm:gap-x-6 sm:text-xs">
                <span>✓ Budget to Luxury</span>
                <span>✓ Corbett Locations</span>
                <span>✓ Easy Enquiry</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= STAY CATEGORIES ================= */}
      <section
        id="stays"
        className="bg-[#F7F5F0] py-10 sm:py-12 md:py-14 lg:py-16"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-5 md:px-6">

          {/* Section Heading */}
          <div className="mb-6 max-w-2xl sm:mb-7 md:mb-9">

            <div className="mb-2.5 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[2.5px] text-[#C87532] sm:mb-3 sm:text-xs">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              EXPLORE STAYS
            </div>

            <h2 className="text-xl font-bold leading-[1.15] text-[#172033] sm:text-3xl md:text-4xl">
              Stay Options for Every Requirement
            </h2>

            <p className="mt-2.5 text-xs leading-5 text-gray-600 sm:mt-3 sm:text-sm sm:leading-6">
              Choose from comfortable stays across Jim Corbett, from
              budget-friendly options to premium resort experiences.
            </p>

          </div>

          {/* ================= STAY CARDS ================= */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 md:gap-5">

            {stayData.categories.map((category, index) => (
              <div
                key={category.id}
                className="group relative h-[205px] overflow-hidden rounded-lg border border-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:h-[285px] md:h-[330px] md:rounded-2xl"
              >

                {/* Image */}
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/40 to-transparent" />

                {/* Card Content */}
                <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 md:p-5">

                  {/* Title */}
                  <h3 className="line-clamp-2 text-[11px] font-semibold leading-[1.25] tracking-tight text-white sm:text-lg md:text-xl">
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-1 line-clamp-2 text-[7.5px] leading-3 text-white/75 sm:mt-1.5 sm:text-xs sm:leading-5 md:text-sm">
                    {category.description}
                  </p>

                  {/* Buttons */}
                  <div className="mt-2 flex flex-nowrap gap-1 sm:mt-3 sm:gap-2">

                    {/* View Stay */}
                    <Link
                      href={category.href}
                      className="inline-flex h-6 min-w-0 flex-1 items-center justify-center gap-0.5 rounded-full bg-white px-1 text-[7px] font-semibold whitespace-nowrap text-[#172033] transition-all duration-300 hover:bg-[#C87532] hover:text-white sm:h-9 sm:flex-none sm:gap-1.5 sm:px-3 sm:text-xs md:h-10 md:px-4 md:text-sm"
                    >
                      View Stay

                      <ArrowRight
                        size={9}
                        className="shrink-0 sm:h-3.5 sm:w-3.5"
                      />
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
                      className="inline-flex h-6 min-w-0 flex-1 items-center justify-center gap-0.5 rounded-full bg-[#C87532] px-1 text-[7px] font-semibold whitespace-nowrap text-white transition-all duration-300 hover:bg-[#B96928] sm:h-9 sm:flex-none sm:gap-1.5 sm:px-3 sm:text-xs md:h-10 md:px-4 md:text-sm"
                    >
                      Enquire

                      <Send
                        size={9}
                        className="shrink-0 sm:h-3.5 sm:w-3.5"
                      />
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