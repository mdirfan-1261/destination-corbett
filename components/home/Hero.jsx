"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { heroData } from "@/data/hero";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  Users2,
} from "lucide-react";

export default function Hero() {
  const router = useRouter();

  // Slideshow
  const [currentImage, setCurrentImage] = useState(0);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [guests, setGuests] = useState("3 Guests");

  // ================= AUTOMATIC SLIDESHOW =================
  useEffect(() => {
    if (!heroData.images || heroData.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        return (prev + 1) % heroData.images.length;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // ================= SLIDE CONTROLS =================

  const nextSlide = () => {
    setCurrentImage(
      (prev) => (prev + 1) % heroData.images.length
    );
  };

  const prevSlide = () => {
    setCurrentImage(
      (prev) =>
        (prev - 1 + heroData.images.length) %
        heroData.images.length
    );
  };

  // ================= SEARCH =================

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (
      query.toLowerCase().includes("safari") ||
      query.toLowerCase().includes("zone")
    ) {
      router.push(
        `/safari?search=${encodeURIComponent(
          query
        )}&date=${travelDate}`
      );
    } else if (query) {
      router.push(
        `/search?q=${encodeURIComponent(
          query
        )}&date=${travelDate}&guests=${guests}`
      );
    } else {
      router.push(
        `/packages?date=${travelDate}&guests=${guests}`
      );
    }
  };

  return (
    <section className="overflow-visible bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">

      {/* =====================================================
          HERO
      ====================================================== */}

      <div className="relative mx-auto min-h-[285px] max-w-[1440px] overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[420px] sm:rounded-[24px] md:min-h-[470px] md:rounded-[28px] lg:min-h-[560px]">

        {/* ================= SLIDESHOW IMAGES ================= */}

        {heroData.images.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt="Jim Corbett National Park"
            fill
            sizes="100vw"
            priority={index === 0}
            className={`
              object-cover
              object-center
              transition-all
              duration-1000
              ease-in-out
              ${
                currentImage === index
                  ? "scale-100 opacity-100"
                  : "pointer-events-none scale-105 opacity-0"
              }
            `}
          />
        ))}

        {/* ================= OVERLAYS ================= */}

        <div className="absolute inset-0 bg-black/5" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/45 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-transparent to-black/10" />

        {/* ================= HERO CONTENT ================= */}

        <div className="relative z-10 flex min-h-[285px] items-center px-4 py-6 sm:min-h-[420px] sm:px-8 sm:py-10 md:min-h-[470px] md:px-10 lg:min-h-[560px] lg:px-14">

          <div className="max-w-2xl">

            {/* Eyebrow */}

            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/85 backdrop-blur-xl sm:mb-4 sm:px-3 sm:py-1.5 sm:text-[9px] sm:tracking-[0.12em]">

              <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />

              EXPLORE JIM CORBETT

            </div>

            {/* Heading */}

            <h1 className="max-w-2xl text-[25px] font-bold leading-[1.05] tracking-tight sm:text-4xl sm:leading-[1.08] md:text-5xl lg:text-6xl">
              {heroData.title}
            </h1>

            {/* Description */}

            <p className="mt-2 max-w-xl text-[11px] leading-4 text-white/80 sm:mt-4 sm:text-sm sm:leading-6 md:text-base md:leading-7">
              {heroData.description}
            </p>

            {/* Buttons */}

            <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-5 sm:gap-2">

              {heroData.buttons.map((button, index) => {
                const isPrimary = index === 0;

                return (
                  <Link
                    key={button.text}
                    href={button.href}
                    className={`
                      group
                      inline-flex
                      items-center
                      justify-center
                      gap-1
                      rounded-full
                      px-3.5
                      py-1.5
                      text-[11px]
                      font-semibold
                      transition-all
                      duration-200
                      sm:gap-1.5
                      sm:px-5
                      sm:py-2.5
                      sm:text-sm
                      ${
                        isPrimary
                          ? "bg-[#C87532] text-white shadow-md hover:bg-[#B96928] hover:shadow-lg"
                          : "border border-white/25 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20"
                      }
                    `}
                  >
                    <span>{button.text}</span>

                    <ArrowRight
                      size={12}
                      className="transition-transform duration-200 group-hover:translate-x-1 sm:h-4 sm:w-4"
                    />
                  </Link>
                );
              })}

            </div>

            {/* Highlights */}

            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[8px] text-white/65 sm:mt-6 sm:gap-x-6 sm:gap-y-2 sm:text-xs sm:text-white/70">

              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />
                Safari Experiences
              </span>

              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />
                Premium Stays
              </span>

              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />
                Events & Weddings
              </span>

            </div>

          </div>
        </div>

        {/* =====================================================
            DESKTOP CAROUSEL CONTROLS
        ====================================================== */}

        <div className="absolute bottom-28 right-7 z-20 hidden items-center gap-2 md:flex">

          <div className="mr-2 flex items-center gap-1">
            {heroData.images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentImage(idx)}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    currentImage === idx
                      ? "w-4 bg-[#C87532]"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  }
                `}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={prevSlide}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
            aria-label="Next Slide"
          >
            <ChevronRight size={15} />
          </button>

        </div>

        {/* =====================================================
            DESKTOP SEARCH BAR
            HERO KE ANDAR BOTTOM
        ====================================================== */}

        <div className="absolute bottom-5 left-1/2 z-30 hidden w-[calc(100%-48px)] max-w-5xl -translate-x-1/2 md:block">

          <div className="overflow-hidden rounded-xl border border-white/20 bg-white p-2 shadow-2xl">

            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-[1.3fr_1fr_1fr_auto] items-center gap-1.5"
            >

              {/* Safari / Resort */}

              <div className="flex items-center gap-2.5 rounded-lg border border-[#D5E6DF] bg-[#EEF5F2] px-3 py-2.5 transition focus-within:ring-1 focus-within:ring-[#C87532]">

                <Search
                  size={16}
                  className="shrink-0 text-[#18352A]"
                />

                <div className="flex min-w-0 w-full flex-col">

                  <label
                    htmlFor="desktop-search-query"
                    className="text-[10px] font-bold uppercase tracking-wide text-[#385247]"
                  >
                    Safari Zone / Resort
                  </label>

                  <input
                    id="desktop-search-query"
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="Dhikala, Bijrani, Jhirna..."
                    className="w-full bg-transparent text-sm font-semibold text-[#172033] placeholder:text-[#7B8F86] focus:outline-none"
                  />

                </div>
              </div>

              {/* Check In */}

              <div className="flex items-center gap-2.5 rounded-lg border-y border-gray-200 bg-white px-3 py-2.5 transition hover:bg-gray-50">

                <CalendarDays
                  size={16}
                  className="shrink-0 text-[#172033]"
                />

                <div className="flex min-w-0 w-full flex-col">

                  <label
                    htmlFor="desktop-search-date"
                    className="text-[10px] font-bold uppercase tracking-wide text-gray-600"
                  >
                    Check In - Check Out
                  </label>

                  <input
                    id="desktop-search-date"
                    type="date"
                    value={travelDate}
                    onChange={(e) =>
                      setTravelDate(e.target.value)
                    }
                    className="w-full cursor-pointer bg-transparent text-sm font-semibold text-[#172033] focus:outline-none"
                  />

                </div>
              </div>

              {/* Guests */}

              <div className="flex items-center gap-2.5 rounded-lg border-r border-gray-200 bg-white px-3 py-2.5 transition hover:bg-gray-50">

                <Users2
                  size={16}
                  className="shrink-0 text-[#172033]"
                />

                <div className="flex min-w-0 w-full flex-col">

                  <label
                    htmlFor="desktop-search-guests"
                    className="text-[10px] font-bold uppercase tracking-wide text-gray-600"
                  >
                    Guests & Rooms
                  </label>

                  <select
                    id="desktop-search-guests"
                    value={guests}
                    onChange={(e) =>
                      setGuests(e.target.value)
                    }
                    className="w-full cursor-pointer bg-transparent text-sm font-semibold text-[#172033] focus:outline-none"
                  >
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="3 Guests">3 Guests</option>
                    <option value="4 Guests">4 Guests</option>
                    <option value="5+ Guests">
                      5+ Guests (Family/Group)
                    </option>
                  </select>

                </div>
              </div>

              {/* Search Button */}

              <button
                type="submit"
                className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:scale-[1.01] hover:bg-[#B96928] hover:shadow-md"
              >
                <Search size={15} />
                <span>Search</span>
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE SEARCH BAR
      ====================================================== */}

      <div className="relative z-30 mx-auto -mt-10 max-w-5xl px-3 md:hidden">

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">

          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 gap-1"
          >

            {/* Safari / Resort */}

            <div className="flex items-center gap-2 rounded-lg border border-[#D5E6DF] bg-[#EEF5F2] px-2.5 py-1.5">

              <Search
                size={14}
                className="shrink-0 text-[#18352A]"
              />

              <div className="flex min-w-0 w-full flex-col">

                <label
                  htmlFor="mobile-search-query"
                  className="text-[8px] font-bold uppercase tracking-wide text-[#385247]"
                >
                  Safari Zone / Resort
                </label>

                <input
                  id="mobile-search-query"
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Dhikala, Bijrani, Jhirna..."
                  className="w-full bg-transparent text-[12px] font-semibold text-[#172033] placeholder:text-[#7B8F86] focus:outline-none"
                />

              </div>
            </div>

            {/* Date + Guests Row */}

            <div className="grid grid-cols-2 gap-1">

              {/* Date */}

              <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5">

                <CalendarDays
                  size={14}
                  className="shrink-0 text-[#172033]"
                />

                <div className="flex min-w-0 w-full flex-col">

                  <label
                    htmlFor="mobile-search-date"
                    className="text-[8px] font-bold uppercase tracking-wide text-gray-600"
                  >
                    Check In - Out
                  </label>

                  <input
                    id="mobile-search-date"
                    type="date"
                    value={travelDate}
                    onChange={(e) =>
                      setTravelDate(e.target.value)
                    }
                    className="w-full min-w-0 bg-transparent text-[11px] font-semibold text-[#172033] focus:outline-none"
                  />

                </div>
              </div>

              {/* Guests */}

              <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5">

                <Users2
                  size={14}
                  className="shrink-0 text-[#172033]"
                />

                <div className="flex min-w-0 w-full flex-col">

                  <label
                    htmlFor="mobile-search-guests"
                    className="text-[8px] font-bold uppercase tracking-wide text-gray-600"
                  >
                    Guests
                  </label>

                  <select
                    id="mobile-search-guests"
                    value={guests}
                    onChange={(e) =>
                      setGuests(e.target.value)
                    }
                    className="w-full min-w-0 bg-transparent text-[11px] font-semibold text-[#172033] focus:outline-none"
                  >
                    <option value="1 Guest">1 Guest</option>
                    <option value="2 Guests">2 Guests</option>
                    <option value="3 Guests">3 Guests</option>
                    <option value="4 Guests">4 Guests</option>
                    <option value="5+ Guests">
                      5+ Guests
                    </option>
                  </select>

                </div>
              </div>
            </div>

            {/* Search */}

            <button
              type="submit"
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#C87532] text-[11px] font-bold text-white transition hover:bg-[#B96928]"
            >
              <Search size={13} />
              Search
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}