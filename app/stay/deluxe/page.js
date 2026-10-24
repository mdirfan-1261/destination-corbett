
"use client";

import Link from "next/link";
import Image from "next/image";
import { Send } from "lucide-react";

import deluxeHotels from "@/data/deluxeStays";
import StayCard from "@/components/stay/StayCard";

const FALLBACK_IMAGE = "/stay/resort-hero.webp";

export default function DeluxeHotelsPage() {
  return (
    <main className="bg-[#F7F5F0] dark:bg-[#0e1210]">
      <nav
  aria-label="Breadcrumb"
  className="mx-auto max-w-6xl px-3 pt-3 text-xs sm:px-5 sm:pt-4 sm:text-sm md:px-6"
>
  <div className="flex items-center gap-2">
    <Link href="/" className="text-[#B96928] transition-colors hover:underline">
      Home
    </Link>
    <span className="text-gray-400">›</span>
    <Link href="/stay" className="text-[#B96928] transition-colors hover:underline">
      Stay
    </Link>
    <span className="text-gray-400">›</span>
    <span aria-current="page" className="font-medium text-[#172033]">
      Deluxe Hotels
    </span>
  </div>
</nav>

      {/* ================= COMPACT HERO ================= */}
      {/* ================= COMPACT HERO ================= */}
<section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
  <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
    {/* Hero Image */}
    <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
      <Image
        src="/stay/stay-hero.webp"
        alt="Deluxe hotels and stays in Jim Corbett"
        fill
        priority
        quality={75}
        sizes="(max-width: 1023px) 100vw, 700px"
        className="object-cover object-center brightness-110"
      />
    </div>

    {/* Image Overlays */}
    <div className="pointer-events-none absolute inset-y-0 left-[45%] hidden w-[15%] bg-gradient-to-r from-[#172033] to-transparent lg:block" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#172033]/55 to-transparent" />

    {/* Hero Content */}
    <div className="relative z-10 flex h-full items-center px-4 py-4 sm:px-8 lg:px-10">
      <div className="max-w-2xl">
        <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Deluxe Hotels{" "}
          <span className="text-[#E0924F]">in Jim Corbett</span>
        </h1>

        <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
          Discover comfortable deluxe stays and peaceful surroundings in
          Jim Corbett.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href="/contact?type=stay"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
          >
            Make an Enquiry
            <Send size={13} />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ================= DELUXE PROPERTIES ================= */}
      <section
        id="deluxe-stays"
        className="py-5 sm:py-6 md:py-8"
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-5 md:px-6">

          {/* SECTION HEADING */}
          <div className="mb-4 sm:mb-5">
            <h2 className="text-lg font-bold leading-tight text-[#172033] dark:text-gray-100 sm:text-2xl">
              Comfortable Deluxe Stays
            </h2>

            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
              Explore deluxe properties, check their details
              and enquire about your stay.
            </p>
          </div>

          {/* EMPTY STATE */}
          {deluxeHotels.length === 0 ? (
            <p className="rounded-xl bg-white p-6 text-sm text-gray-600 dark:bg-[#161b18] dark:text-gray-300">
              Abhi koi deluxe property listing available nahi hai.
              Please baad mein dobara check karein.
            </p>
          ) : (

            /* SAME CARD GRID AS RESORTS & STAYS */
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">

              {deluxeHotels.map((hotel, index) => {

                // Deluxe location-based detail URL preserve rahega.
                const detailUrl =
                  `/stay/deluxe/${hotel.locationSlug}/${hotel.slug}`;

                // Same enquiry flow as static resorts.
                const enquiryUrl =
                  `/contact?hotel=${encodeURIComponent(
                    hotel.name || ""
                  )}&hotelImage=${encodeURIComponent(
                    hotel.image || FALLBACK_IMAGE
                  )}&location=${encodeURIComponent(
                    hotel.location || "Jim Corbett"
                  )}`;

                return (
                  <StayCard
                    key={
                      hotel.id ||
                      hotel.slug ||
                      `deluxe-${index}`
                    }
                    href={detailUrl}
                    enquiryHref={enquiryUrl}
                    image={hotel.image || FALLBACK_IMAGE}
                    name={hotel.name}
                    location={hotel.location || "Jim Corbett"}
                    badge={
                      hotel.location
                        ?.split(",")[0]
                        ?.trim() || "Jim Corbett"
                    }
                    rating={hotel.rating}
                    tags={["Deluxe Stay"]}
                    ctaLabel="View Resort"
                    unoptimized
                  />
                );
              })}

            </div>
          )}

        </div>
      </section>
    </main>
  );
}
