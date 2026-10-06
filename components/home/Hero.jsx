"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { heroData } from "@/data/hero";
import stays from "@/data/stays";
import safariOptions from "@/data/safari";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  Users2,
  Minus,
  Plus,
  X,
  MapPin,
} from "lucide-react";

export default function Hero() {
  const router = useRouter();

  // =========================================================
  // SLIDESHOW
  // =========================================================

  const [currentImage, setCurrentImage] = useState(0);

  // =========================================================
  // SEARCH
  // =========================================================

  const [searchQuery, setSearchQuery] = useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [selectedSearchItem, setSelectedSearchItem] = useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // =========================================================
  // GUESTS & ROOMS
  // =========================================================

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [guestPopupOpen, setGuestPopupOpen] = useState(false);

  // =========================================================
  // AUTOMATIC SLIDESHOW
  // =========================================================

  useEffect(() => {
    if (!heroData.images || heroData.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        return (prev + 1) % heroData.images.length;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // =========================================================
  // SLIDE CONTROLS
  // =========================================================

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

  // =========================================================
  // GUEST SUMMARY
  // =========================================================

  const guestSummary = `${adults} ${
    adults === 1 ? "Adult" : "Adults"
  }, ${children} ${
    children === 1 ? "Child" : "Children"
  }, ${rooms} ${rooms === 1 ? "Room" : "Rooms"}`;

  // =========================================================
  // DYNAMIC SEARCH RESULTS
  // =========================================================

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    // ---------------------------------------------------------
    // STAYS
    // ---------------------------------------------------------

    const stayResults = stays
      .filter((stay) => {
        const name = stay.name?.toLowerCase() || "";
        const location = stay.location?.toLowerCase() || "";
        const locationSlug =
          stay.locationSlug?.toLowerCase() || "";
        const slug = stay.slug?.toLowerCase() || "";

        return (
          name.includes(query) ||
          location.includes(query) ||
          locationSlug.includes(query) ||
          slug.includes(query)
        );
      })
      .map((stay) => ({
        id: `stay-${stay.id}`,
        type: "stay",
        name: stay.name,
        location: stay.location,
        image: stay.image,
        href: `/stay/${stay.slug}`,
      }));

    // ---------------------------------------------------------
    // SAFARI
    // ---------------------------------------------------------

    const safariResults = safariOptions
      .filter((safari) => {
        const name = safari.name?.toLowerCase() || "";
        const location =
          safari.location?.toLowerCase() || "";
        const description =
          safari.description?.toLowerCase() || "";

        return (
          name.includes(query) ||
          location.includes(query) ||
          description.includes(query)
        );
      })
      .map((safari) => ({
        id: `safari-${safari.id}`,
        type: "Safari",
        name: safari.name,
        location: safari.location,
        image: safari.image,
        href: `/safari?search=${encodeURIComponent(
          safari.name
        )}`,
      }));

    return [...safariResults, ...stayResults].slice(0, 6);
  }, [searchQuery]);

  // =========================================================
  // SEARCH ITEM SELECT
  // =========================================================

  const handleSearchItemSelect = (item) => {
    setSearchQuery(item.name);
    setSelectedSearchItem(item);
    setSearchDropdownOpen(false);
  };

  // =========================================================
  // SEARCH SUBMIT
  // =========================================================

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query || !checkIn || !checkOut) {
      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.set("checkIn", checkIn);
    searchParams.set("checkOut", checkOut);
    searchParams.set("adults", adults);
    searchParams.set("children", children);
    searchParams.set("rooms", rooms);

    // ---------------------------------------------------------
    // SELECTED SEARCH RESULT
    // ---------------------------------------------------------

    if (selectedSearchItem) {
      // -------------------------------------------------------
      // SAFARI
      // -------------------------------------------------------

      if (selectedSearchItem.type === "Safari") {
        searchParams.set(
          "search",
          selectedSearchItem.name
        );

        router.push(
          `/safari?${searchParams.toString()}`
        );

        setSearchDropdownOpen(false);
        return;
      }

      // -------------------------------------------------------
      // STAY
      // -------------------------------------------------------

      if (selectedSearchItem.type === "stay") {
        router.push(
          `${selectedSearchItem.href}?${searchParams.toString()}`
        );

        setSearchDropdownOpen(false);
        return;
      }
    }

    // ---------------------------------------------------------
    // EXACT SAFARI MATCH
    // ---------------------------------------------------------

    const safariMatch = safariOptions.find(
      (safari) =>
        safari.name?.toLowerCase() === query.toLowerCase()
    );

    if (safariMatch) {
      searchParams.set("search", safariMatch.name);

      router.push(
        `/safari?${searchParams.toString()}`
      );

      setSearchDropdownOpen(false);
      return;
    }

    // ---------------------------------------------------------
    // EXACT STAY MATCH
    // ---------------------------------------------------------

    const stayMatch = stays.find(
      (stay) =>
        stay.name?.toLowerCase() === query.toLowerCase()
    );

    if (stayMatch) {
      router.push(
        `/stay/${stayMatch.slug}?${searchParams.toString()}`
      );

      setSearchDropdownOpen(false);
      return;
    }

    // ---------------------------------------------------------
    // SAFARI / ZONE SEARCH
    // ---------------------------------------------------------

    if (
      query.toLowerCase().includes("safari") ||
      query.toLowerCase().includes("zone")
    ) {
      searchParams.set("search", query);

      router.push(
        `/safari?${searchParams.toString()}`
      );

      setSearchDropdownOpen(false);
      return;
    }

    // ---------------------------------------------------------
    // OTHER SEARCH
    // ---------------------------------------------------------

    searchParams.set("q", query);

    router.push(
      `/search?${searchParams.toString()}`
    );

    setSearchDropdownOpen(false);
  };

  // =========================================================
  // COUNTERS
  // =========================================================

  const decreaseAdults = () => {
    setAdults((prev) => Math.max(1, prev - 1));
  };

  const increaseAdults = () => {
    setAdults((prev) => prev + 1);
  };

  const decreaseChildren = () => {
    setChildren((prev) => Math.max(0, prev - 1));
  };

  const increaseChildren = () => {
    setChildren((prev) => prev + 1);
  };

  const decreaseRooms = () => {
    setRooms((prev) => Math.max(1, prev - 1));
  };

  const increaseRooms = () => {
    setRooms((prev) => prev + 1);
  };

  return (
    <section className="overflow-visible bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">

      {/* =====================================================
          HERO
      ====================================================== */}

      <div className="relative mx-auto min-h-[285px] max-w-[1440px] overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[420px] sm:rounded-[24px] md:min-h-[470px] md:rounded-[28px] lg:min-h-[560px]">

        {/* =====================================================
            SLIDESHOW
        ====================================================== */}

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

        {/* =====================================================
            OVERLAYS
        ====================================================== */}

        <div className="absolute inset-0 bg-black/5" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/45 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-transparent to-black/10" />

        {/* =====================================================
            HERO CONTENT
        ====================================================== */}

        <div className="relative z-10 flex min-h-[285px] items-center px-4 py-6 sm:min-h-[420px] sm:px-8 sm:py-10 md:min-h-[470px] md:px-10 lg:min-h-[560px] lg:px-14">

          <div className="max-w-2xl">

            {/* EYEBROW */}

            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/85 backdrop-blur-xl sm:mb-4 sm:px-3 sm:py-1.5 sm:text-[9px] sm:tracking-[0.12em]">

              <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />

              EXPLORE JIM CORBETT

            </div>

            {/* HEADING */}

            <h1 className="max-w-2xl text-[29px] font-bold leading-[1.08] tracking-tight sm:text-4xl sm:leading-[1.08] md:text-5xl lg:text-6xl">
              {heroData.title}
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-2 max-w-xl text-[13px] leading-5 text-white/80 sm:mt-4 sm:text-sm sm:leading-6 md:text-base md:leading-7">
              {heroData.description}
            </p>

            {/* BUTTONS */}

            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-2">

              {heroData.buttons.map((button, index) => {
                const isPrimary = index === 0;

                return (
                  <Link
                    key={button.text}
                    href={button.href}
                    className={`
                      group
                      inline-flex
                      min-h-[40px]
                      items-center
                      justify-center
                      gap-1.5
                      rounded-full
                      px-4
                      py-2
                      text-[12px]
                      font-semibold
                      transition-all
                      duration-200
                      sm:min-h-0
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
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1 sm:h-4 sm:w-4"
                    />
                  </Link>
                );
              })}

            </div>

            {/* HIGHLIGHTS */}

            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-white/70 sm:mt-6 sm:gap-x-6 sm:gap-y-2 sm:text-xs sm:text-white/70">

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
        ====================================================== */}

        <div className="absolute bottom-5 left-1/2 z-30 hidden w-[calc(100%-48px)] max-w-5xl -translate-x-1/2 md:block">

          <div className="overflow-visible rounded-xl border border-white/20 bg-white p-2 shadow-2xl">

            <form
              onSubmit={handleSearchSubmit}
              className="grid grid-cols-[1.3fr_1fr_1fr_auto] items-center gap-1.5"
            >

              {/* SEARCH */}

              <div className="relative">

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
                      Safari Zone / stay
                    </label>

                    <input
                      id="desktop-search-query"
                      type="text"
                      value={searchQuery}
                      onFocus={() => {
                        if (searchQuery.trim()) {
                          setSearchDropdownOpen(true);
                        }
                      }}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedSearchItem(null);
                        setSearchDropdownOpen(
                          Boolean(e.target.value.trim())
                        );
                      }}
                      placeholder="Dhikuli, Bijrani, Jhirna..."
                      className="w-full bg-transparent text-sm font-semibold text-[#172033] placeholder:text-[#7B8F86] focus:outline-none"
                    />

                  </div>

                </div>

                {searchDropdownOpen &&
                  searchQuery.trim() && (
                    <SearchResultsDropdown
                      results={searchResults}
                      onSelect={handleSearchItemSelect}
                      desktop
                    />
                  )}

              </div>

              {/* DATES */}

              <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5">

                <CalendarDays
                  size={16}
                  className="shrink-0 text-[#172033]"
                />

                <div className="grid min-w-0 w-full grid-cols-2 gap-2">

                  <div className="min-w-0">

                    <label
                      htmlFor="desktop-check-in"
                      className="text-[9px] font-bold uppercase tracking-wide text-gray-500"
                    >
                      Check In
                    </label>

                    <input
                      id="desktop-check-in"
                      type="date"
                      value={checkIn}
                      onChange={(e) =>
                        setCheckIn(e.target.value)
                      }
                      className="w-full min-w-0 bg-transparent text-[12px] font-semibold text-[#172033] focus:outline-none"
                    />

                  </div>

                  <div className="min-w-0 border-l border-gray-200 pl-2">

                    <label
                      htmlFor="desktop-check-out"
                      className="text-[9px] font-bold uppercase tracking-wide text-gray-500"
                    >
                      Check Out
                    </label>

                    <input
                      id="desktop-check-out"
                      type="date"
                      value={checkOut}
                      min={checkIn || undefined}
                      onChange={(e) =>
                        setCheckOut(e.target.value)
                      }
                      className="w-full min-w-0 bg-transparent text-[12px] font-semibold text-[#172033] focus:outline-none"
                    />

                  </div>

                </div>

              </div>

              {/* GUESTS */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setGuestPopupOpen(!guestPopupOpen)
                  }
                  className="flex w-full items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left transition hover:bg-gray-50"
                >

                  <Users2
                    size={16}
                    className="shrink-0 text-[#172033]"
                  />

                  <div className="min-w-0">

                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-600">
                      Guests & Rooms
                    </p>

                    <p className="truncate text-[12px] font-semibold text-[#172033]">
                      {guestSummary}
                    </p>

                  </div>

                </button>

                {guestPopupOpen && (
                  <GuestPopup
                    adults={adults}
                    children={children}
                    rooms={rooms}
                    decreaseAdults={decreaseAdults}
                    increaseAdults={increaseAdults}
                    decreaseChildren={decreaseChildren}
                    increaseChildren={increaseChildren}
                    decreaseRooms={decreaseRooms}
                    increaseRooms={increaseRooms}
                    onDone={() => setGuestPopupOpen(false)}
                  />
                )}

              </div>

              {/* SEARCH BUTTON */}

              <button
                type="submit"
                disabled={
                  !searchQuery.trim() ||
                  !checkIn ||
                  !checkOut
                }
                className="flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:scale-[1.01] hover:bg-[#B96928] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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

        <div className="overflow-visible rounded-xl border border-gray-200 bg-white p-2 shadow-xl">

          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 gap-2"
          >

            {/* MOBILE SEARCH */}

            <div className="relative">

              <div className="flex min-h-[52px] items-center gap-2.5 rounded-lg border border-[#D5E6DF] bg-[#EEF5F2] px-3 py-2">

                <Search
                  size={17}
                  className="shrink-0 text-[#18352A]"
                />

                <div className="flex min-w-0 w-full flex-col">

                  <label
                    htmlFor="mobile-search-query"
                    className="text-[10px] font-bold uppercase tracking-wide text-[#385247]"
                  >
                    Safari Zone / Stay
                  </label>

                  <input
                    id="mobile-search-query"
                    type="text"
                    value={searchQuery}
                    onFocus={() => {
                      if (searchQuery.trim()) {
                        setSearchDropdownOpen(true);
                      }
                    }}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedSearchItem(null);
                      setSearchDropdownOpen(
                        Boolean(e.target.value.trim())
                      );
                    }}
                    placeholder="Search safari or stay..."
                    className="w-full bg-transparent text-[14px] font-semibold text-[#172033] placeholder:text-[#7B8F86] focus:outline-none"
                  />

                </div>

              </div>

              {/* MOBILE RESULTS */}

              {searchDropdownOpen &&
                searchQuery.trim() && (
                  <SearchResultsDropdown
                    results={searchResults}
                    onSelect={handleSearchItemSelect}
                    mobile
                  />
                )}

            </div>

            {/* MOBILE DATE ROW */}

            <div className="grid grid-cols-2 gap-2">

              {/* CHECK IN */}

              <div className="flex min-h-[54px] min-w-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2">

                <CalendarDays
                  size={16}
                  className="shrink-0 text-[#172033]"
                />

                <div className="min-w-0 flex-1">

                  <label
                    htmlFor="mobile-check-in"
                    className="block text-[9px] font-bold uppercase tracking-wide text-gray-600"
                  >
                    Check In
                  </label>

                  <input
                    id="mobile-check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) =>
                      setCheckIn(e.target.value)
                    }
                    className="mt-0.5 w-full min-w-0 bg-transparent text-[12px] font-semibold text-[#172033] focus:outline-none"
                  />

                </div>

              </div>

              {/* CHECK OUT */}

              <div className="flex min-h-[54px] min-w-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2">

                <CalendarDays
                  size={16}
                  className="shrink-0 text-[#172033]"
                />

                <div className="min-w-0 flex-1">

                  <label
                    htmlFor="mobile-check-out"
                    className="block text-[9px] font-bold uppercase tracking-wide text-gray-600"
                  >
                    Check Out
                  </label>

                  <input
                    id="mobile-check-out"
                    type="date"
                    value={checkOut}
                    min={checkIn || undefined}
                    onChange={(e) =>
                      setCheckOut(e.target.value)
                    }
                    className="mt-0.5 w-full min-w-0 bg-transparent text-[12px] font-semibold text-[#172033] focus:outline-none"
                  />

                </div>

              </div>

            </div>

            {/* MOBILE GUESTS */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setGuestPopupOpen(!guestPopupOpen)
                }
                className="flex min-h-[54px] w-full items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left"
              >

                <Users2
                  size={17}
                  className="shrink-0 text-[#172033]"
                />

                <div className="min-w-0">

                  <p className="text-[9px] font-bold uppercase tracking-wide text-gray-600">
                    Guests & Rooms
                  </p>

                  <p className="truncate text-[13px] font-semibold text-[#172033]">
                    {guestSummary}
                  </p>

                </div>

              </button>

              {guestPopupOpen && (
                <GuestPopup
                  mobile
                  adults={adults}
                  children={children}
                  rooms={rooms}
                  decreaseAdults={decreaseAdults}
                  increaseAdults={increaseAdults}
                  decreaseChildren={decreaseChildren}
                  increaseChildren={increaseChildren}
                  decreaseRooms={decreaseRooms}
                  increaseRooms={increaseRooms}
                  onDone={() => setGuestPopupOpen(false)}
                />
              )}

            </div>

            {/* MOBILE SEARCH BUTTON */}

            <button
              type="submit"
              disabled={
                !searchQuery.trim() ||
                !checkIn ||
                !checkOut
              }
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#C87532] text-[13px] font-bold text-white transition hover:bg-[#B96928] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Search size={16} />
              Search
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   SEARCH RESULTS DROPDOWN
========================================================= */

function SearchResultsDropdown({
  results,
  onSelect,
  desktop = false,
  mobile = false,
}) {
  return (
    <div
      className={`
        absolute z-[200] overflow-hidden rounded-xl
        border border-gray-200 bg-white text-[#172033]
        shadow-2xl
        ${
          desktop
            ? "bottom-full left-0 mb-2 w-full min-w-[320px]"
            : ""
        }
        ${
          mobile
            ? "left-0 right-0 top-full mt-1 w-full"
            : ""
        }
      `}
    >

      {results.length > 0 ? (

        <div className="max-h-[280px] overflow-y-auto p-1.5">

          {results.map((item) => (

            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#EEF5F2]"
            >

              {/* IMAGE */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7F5F0]">

                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MapPin
                    size={18}
                    className="text-[#C87532]"
                  />
                )}

              </div>

              {/* TEXT */}

              <div className="min-w-0 flex-1">

                <div className="flex items-center gap-2">

                  <p className="truncate text-[13px] font-bold">
                    {item.name}
                  </p>

                  <span className="shrink-0 rounded-full bg-[#F7F5F0] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#C87532]">
                    {item.type}
                  </span>

                </div>

                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-gray-500">

                  <MapPin
                    size={11}
                    className="shrink-0"
                  />

                  {item.location}

                </p>

              </div>

            </button>

          ))}

        </div>

      ) : (

        <div className="px-4 py-5 text-center">

          <Search
            size={20}
            className="mx-auto text-gray-300"
          />

          <p className="mt-2 text-[13px] font-semibold text-gray-600">
            No matching safari or stay found
          </p>

          <p className="mt-1 text-[11px] text-gray-400">
            Try a stay name, location or safari type
          </p>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   GUEST POPUP
========================================================= */

function GuestPopup({
  adults,
  children,
  rooms,
  decreaseAdults,
  increaseAdults,
  decreaseChildren,
  increaseChildren,
  decreaseRooms,
  increaseRooms,
  onDone,
  mobile = false,
}) {
  return (
    <div
      className={`
        absolute z-[100] w-[300px] max-w-[calc(100vw-32px)]
        rounded-xl border border-gray-200
        bg-white p-4 text-[#172033] shadow-2xl
        ${
          mobile
            ? "bottom-full left-0 mb-2"
            : "bottom-full right-0 mb-2"
        }
      `}
    >

      {/* HEADER */}

      <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">

        <div>

          <h3 className="text-[15px] font-bold">
            Guests & Rooms
          </h3>

          <p className="mt-0.5 text-[11px] text-gray-500">
            Select your group size
          </p>

        </div>

        <button
          type="button"
          onClick={onDone}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          aria-label="Close"
        >
          <X size={15} />
        </button>

      </div>

      {/* ADULTS */}

      <GuestRow
        title="Adults"
        subtitle="12+ years"
        value={adults}
        onDecrease={decreaseAdults}
        onIncrease={increaseAdults}
        min={1}
      />

      {/* CHILDREN */}

      <GuestRow
        title="Children"
        subtitle="0-11 years"
        value={children}
        onDecrease={decreaseChildren}
        onIncrease={increaseChildren}
        min={0}
      />

      {/* ROOMS */}

      <GuestRow
        title="Rooms"
        subtitle=""
        value={rooms}
        onDecrease={decreaseRooms}
        onIncrease={increaseRooms}
        min={1}
      />

      {/* DONE */}

      <button
        type="button"
        onClick={onDone}
        className="mt-3 flex min-h-[42px] w-full items-center justify-center rounded-lg bg-[#C87532] py-2.5 text-[13px] font-bold text-white transition hover:bg-[#B96928]"
      >
        Done
      </button>

    </div>
  );
}

/* =========================================================
   GUEST ROW
========================================================= */

function GuestRow({
  title,
  subtitle,
  value,
  onDecrease,
  onIncrease,
  min,
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">

      <div>

        <p className="text-[13px] font-semibold text-[#172033]">

          {title}

          {subtitle && (
            <span className="ml-1 font-normal text-gray-500">
              ({subtitle})
            </span>
          )}

        </p>

      </div>

      <div className="flex items-center gap-2.5">

        <button
          type="button"
          onClick={onDecrease}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#C87532] hover:text-[#C87532] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Decrease ${title}`}
        >
          <Minus size={14} />
        </button>

        <span className="w-6 text-center text-[13px] font-bold">
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-[#C87532] hover:text-[#C87532]"
          aria-label={`Increase ${title}`}
        >
          <Plus size={14} />
        </button>

      </div>

    </div>
  );
}