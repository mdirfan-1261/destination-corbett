"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { heroData } from "@/data/hero";
import {
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  Users2,
} from "lucide-react";

export default function Hero() {
  const router = useRouter();

  // Slideshow State
  const [currentImage, setCurrentImage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Exact Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [guests, setGuests] = useState("3 Guests");

  // Auto Slideshow
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroData.images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % heroData.images.length);
  };

  const prevSlide = () => {
    setCurrentImage(
      (prev) => (prev - 1 + heroData.images.length) % heroData.images.length
    );
  };

  // Search Action
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();

    // Direct Exact Redirect according to input
    if (query.toLowerCase().includes("safari") || query.toLowerCase().includes("zone")) {
      router.push(`/safari?search=${encodeURIComponent(query)}&date=${travelDate}`);
    } else if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&date=${travelDate}&guests=${guests}`);
    } else {
      router.push(`/packages?date=${travelDate}&guests=${guests}`);
    }
  };

  return (
    <section
      className="relative min-h-[480px] md:min-h-[540px] lg:min-h-[580px] overflow-hidden bg-[#172033]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ================= HERO SLIDESHOW IMAGES ================= */}
      {heroData.images.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt="Jim Corbett National Park"
          fill
          sizes="100vw"
          priority={index === 0}
          loading={index === 0 ? "eager" : "lazy"}
          className={`object-cover object-center transition-all duration-1000 ease-in-out ${
            currentImage === index
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105 pointer-events-none"
          }`}
        />
      ))}

      {/* ================= LUXURY OVERLAYS ================= */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/90 via-transparent to-black/20" />

      {/* ================= HERO CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 md:pt-16 md:pb-28 min-h-[480px] md:min-h-[540px] flex flex-col justify-center">
        <div className="max-w-xl text-white">

          {/* 👆 TOP STRIP: EYEBROW + TRUST BADGES UPAR */}
       

          {/* COMPACT & SLEEK TITLE (NO HEAVY BOLD) */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight mb-3 text-white">
            {heroData.title}
          </h1>

          {/* COMPACT DESCRIPTION */}
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6 max-w-lg font-normal">
            {heroData.description}
          </p>

          {/* COMPACT BUTTONS ROW */}
          <div className="flex flex-wrap items-center gap-2.5">
            {heroData.buttons.map((button, index) => {
              const isPrimary = index === 0;
              return (
                <Link
                  key={button.text}
                  href={button.href}
                  className={`
                    group inline-flex items-center justify-center gap-1.5
                    px-5 py-2 rounded-full text-xs font-semibold tracking-wide
                    transition-all duration-200 shadow-sm
                    ${
                      isPrimary
                        ? "bg-[#C87532] text-white hover:bg-[#b96928] hover:shadow-md"
                        : "bg-white/10 text-white border border-white/30 backdrop-blur-xl hover:bg-white/20"
                    }
                  `}
                >
                  <span>{button.text}</span>
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              );
            })}
          </div>

        </div>
      </div>

      {/* ================= CAROUSEL CONTROLS & SLIDE DOTS ================= */}
      <div className="absolute right-5 bottom-20 md:bottom-16 z-20 hidden sm:flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2">
          {heroData.images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentImage(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentImage === idx
                  ? "w-4 bg-[#C87532]"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={prevSlide}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={14} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
          aria-label="Next Slide"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* ================= EXACT COMPACT SEARCH BAR ================= */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 -mt-10 md:-mt-12 pb-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-lg overflow-hidden p-1.5 sm:p-2">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_auto] items-center gap-1.5"
          >
            {/* 1. SAFARI ZONE / RESORT SEARCH INPUT */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-[#EEF5F2] border border-[#D5E6DF] focus-within:ring-1 focus-within:ring-[#C87532] transition">
              <Search size={16} className="text-[#18352A] shrink-0" />
              <div className="flex flex-col min-w-0 w-full">
                <label
                  htmlFor="search-query"
                  className="text-[9px] font-bold uppercase tracking-wider text-[#4B6358]"
                >
                  Safari Zone / Resort
                </label>
                <input
                  id="search-query"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Dhikala, Bijrani, Jhirna..."
                  className="bg-transparent text-xs font-medium text-[#172033] focus:outline-none placeholder:text-[#8AA398] w-full"
                />
              </div>
            </div>

            {/* 2. CHECK IN - CHECK OUT DATE PICKER */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-white hover:bg-gray-50 border-y sm:border-y-0 sm:border-r border-gray-200 transition">
              <CalendarDays size={16} className="text-[#172033] shrink-0" />
              <div className="flex flex-col min-w-0 w-full">
                <label
                  htmlFor="search-date"
                  className="text-[9px] font-bold uppercase tracking-wider text-gray-500"
                >
                  Check In - Check Out
                </label>
                <input
                  id="search-date"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172033] focus:outline-none cursor-pointer w-full"
                />
              </div>
            </div>

            {/* 3. GUESTS & ROOMS SELECTOR */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-white hover:bg-gray-50 border-r border-gray-200 transition">
              <Users2 size={16} className="text-[#172033] shrink-0" />
              <div className="flex flex-col min-w-0 w-full">
                <label
                  htmlFor="search-guests"
                  className="text-[9px] font-bold uppercase tracking-wider text-gray-500"
                >
                  Guests & Rooms
                </label>
                <select
                  id="search-guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172033] focus:outline-none cursor-pointer w-full"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="3 Guests">3 Guests</option>
                  <option value="4 Guests">4 Guests</option>
                  <option value="5+ Guests">5+ Guests (Family/Group)</option>
                </select>
              </div>
            </div>

            {/* 4. EXACT MATCHING GOLD SEARCH BUTTON */}
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 rounded-md bg-[#D97706] hover:bg-[#B45309] px-5 py-2.5 text-xs font-bold text-white shadow transition hover:scale-[1.01] cursor-pointer shrink-0"
            >
              <Search size={15} />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}