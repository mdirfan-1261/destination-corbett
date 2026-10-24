"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Send,
  Binoculars,
  Compass,
  Trees,
  CalendarDays,
} from "lucide-react";

const safariCategories = [
  {
    id: "jeep",
    title: "Jeep Safari",
    description:
      "Explore Jim Corbett's forest trails and wildlife in an open jeep.",
    href: "/safari/jeep",
    image: "/safari/jeep-safari.webp",
    icon: Binoculars,
  },
  {
    id: "canter",
    title: "Canter Safari",
    description:
      "Discover the forest on a shared canter safari experience.",
    href: "/safari/canter",
    image: "/safari/canter-safari.webp",
    icon: Trees,
  },
  {
    id: "activities",
    title: "Safari Activities",
    description:
      "Explore nature, outdoor experiences and activities around Corbett.",
    href: "/safari/activities",
    image: "/safari/safari-hero.webp",
    icon: Compass,
  },
  {
    id: "zones",
    title: "Safari Zones",
    description:
      "Discover Corbett's safari zones and choose your forest experience.",
    href: "/safari/zones",
    image: "/safari/safari-hero.webp",
    icon: Trees,
  },
];

export default function SafariPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] dark:bg-[#0e1210]">
      {/* ================= BREADCRUMB ================= */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-3 pt-3 text-xs sm:px-5 sm:pt-4 sm:text-sm md:px-6"
      >
        <div className="flex flex-wrap items-center gap-2">
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
            Safari
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
        src="/safari/safari-hero.webp"
        alt="Wildlife safari in Jim Corbett"
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
          <Binoculars className="h-3 w-3 text-[#E0924F]" />
          WILDLIFE EXPERIENCES
        </div>

        <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Explore the Wild{" "}
          <span className="text-[#E0924F]">Jim Corbett Safari</span>
        </h1>

        <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
          Discover safari experiences, forest zones and outdoor
          adventures in Jim Corbett National Park.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href="/contact?type=safari"
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

      {/* ================= SAFARI OPTIONS ================= */}
      <section
        id="safari-options"
        className="py-5 sm:py-6 md:py-8"
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-5 md:px-6">
          {/* Section Heading */}
          <div className="mb-4 sm:mb-5">
            <h2 className="text-lg font-bold leading-tight text-[#172033] dark:text-gray-100 sm:text-2xl">
              Explore Safari Experiences
            </h2>

            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
              Choose your experience and discover the wild side of Corbett.
            </p>
          </div>

          {/* ================= SAFARI CARDS ================= */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {safariCategories.map((category, index) => {
              const CategoryIcon = category.icon;

              return (
                <article
                  key={category.id}
                  className="group relative h-[190px] overflow-hidden rounded-xl border border-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 sm:h-[230px] md:h-[250px]"
                >
                  {/* Card Image */}
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/35 to-transparent" />

                  {/* Entire Card Clickable */}
                  <Link
                    href={category.href}
                    aria-label={`Explore ${category.title}`}
                    className="absolute inset-0 z-[1] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E0924F]"
                  />

                  {/* Card Content */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] p-2.5 sm:p-3.5">
                    <div className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/20 px-2 py-1 text-[9px] font-medium text-white/90 backdrop-blur-sm sm:text-[10px]">
                      <CategoryIcon
                        size={11}
                        className="text-[#E0924F]"
                      />
                      Safari Experience
                    </div>

                    <h3 className="line-clamp-2 text-[12px] font-semibold leading-[1.25] tracking-tight text-white transition-colors group-hover:text-[#E0924F] sm:text-base">
                      {category.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-[9px] leading-3 text-white/80 sm:text-xs sm:leading-4">
                      {category.description}
                    </p>

                    {/* Card Action */}
                    <div className="pointer-events-auto mt-2 sm:mt-2.5">
                      <Link
                        href={category.href}
                        className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full bg-white px-2 text-[10px] font-semibold whitespace-nowrap text-[#172033] transition-all duration-300 hover:bg-[#B96928] hover:text-white sm:h-9 sm:text-xs"
                      >
                        Explore Now
                        <ArrowRight
                          size={12}
                          className="shrink-0"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= QUICK ENQUIRY ================= */}
      <section className="px-3 pb-6 sm:px-5 sm:pb-8 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 rounded-xl border border-[#B96928]/15 bg-white p-4 shadow-sm dark:bg-[#171c19] sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:p-5">
          <div>
            <h2 className="text-sm font-bold text-[#172033] dark:text-white sm:text-lg">
              Need Help Planning Your Safari?
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-300 sm:text-sm">
              Contact our team for safari details and booking assistance.
            </p>
          </div>

          <Link
            href="/contact?type=safari"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#B96928] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A85C22] sm:text-sm"
          >
            Make an Enquiry
            <CalendarDays size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}