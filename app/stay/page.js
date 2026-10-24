
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Send, BedDouble } from "lucide-react";
import { stayData } from "@/data/stay";

export default function StayPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033] dark:bg-[#0e1210] dark:text-gray-100">
      {/* ================= BREADCRUMB ================= */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-3 pt-3 text-xs sm:px-5 sm:pt-4 sm:text-sm md:px-6"
      >
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-[#B96928] transition-colors hover:underline"
          >
            Home
          </Link>

          <span className="text-gray-400">›</span>

          <span
            aria-current="page"
            className="font-medium text-[#172033] dark:text-gray-100"
          >
            Stay
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
        src={stayData.categories[0].image}
        alt="Jim Corbett Stay"
        fill
        priority
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
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl">
          <BedDouble className="h-3 w-3 text-[#E0924F]" />
          {stayData.eyebrow}
        </div>

        <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Find Your Perfect{" "}
          <span className="text-[#E0924F]">Stay in Jim Corbett</span>
        </h1>

        <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
          {stayData.description}
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
      {/* ================= STAY CATEGORIES ================= */}
      <section
        id="stays"
        className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-6 md:px-6"
      >
        {/* Section Heading */}
        <div className="mb-3.5 sm:mb-4">
          <h2 className="text-lg font-bold leading-tight text-[#172033] dark:text-gray-100 sm:text-xl md:text-2xl">
            Stay Options for Every Requirement
          </h2>

          <p className="mt-1 text-[11px] leading-4 text-gray-600 dark:text-gray-300 sm:text-sm sm:leading-5">
            From budget-friendly rooms to premium resorts in Jim Corbett.
          </p>
        </div>

        {/* ================= STAY CARDS ================= */}
        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3">
          {stayData.categories.map((category, index) => (
            <article
              key={category.id}
              className="group relative h-[190px] overflow-hidden rounded-xl border border-black/5 bg-[#172033] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 sm:h-[230px] md:h-[250px]"
            >
              {/* Category Image */}
              <Image
                src={category.image}
                alt={category.title}
                fill
                priority={index === 0}
                sizes="(max-width: 639px) 50vw, (max-width: 767px) 45vw, 33vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Image Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/40 to-transparent" />

              {/* Entire Card Click */}
              <Link
                href={category.href}
                aria-label={`View ${category.title}`}
                className="absolute inset-0 z-[1] rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#E0924F]"
              />

              {/* Card Content */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] p-2.5 sm:p-3.5">
                <h3 className="line-clamp-2 text-[12px] font-semibold leading-[1.25] tracking-tight text-white transition-colors group-hover:text-[#E0924F] sm:text-base">
                  {category.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-[9px] leading-3 text-white/80 sm:text-xs sm:leading-4">
                  {category.description}
                </p>

                {/* Action Buttons */}
                <div className="pointer-events-auto mt-2 flex flex-nowrap gap-1.5 sm:mt-2.5 sm:gap-2">
                  <Link
                    href={category.href}
                    aria-label={`View stay: ${category.title}`}
                    className="inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-white px-1 text-[10px] font-semibold text-[#172033] transition-all duration-300 hover:bg-[#B96928] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0924F] sm:h-9 sm:px-3 sm:text-xs"
                  >
                    View Stay
                    <ArrowRight size={11} className="shrink-0" />
                  </Link>

                  <Link
                    href={`/contact?hotel=${encodeURIComponent(
                      category.title
                    )}&hotelImage=${encodeURIComponent(
                      category.image
                    )}&location=${encodeURIComponent(
                      "Jim Corbett, Uttarakhand"
                    )}`}
                    aria-label={`Enquire about ${category.title}`}
                    className="inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-[#B96928] px-1 text-[10px] font-semibold text-white transition-all duration-300 hover:bg-[#A85C22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-9 sm:px-3 sm:text-xs"
                  >
                    Enquire
                    <Send size={11} className="shrink-0" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
