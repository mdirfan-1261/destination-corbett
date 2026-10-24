
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

/* =========================================================
   HELPERS
========================================================= */

const PRIMARY = "#B96928";

const getLocalISODate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const addDaysToISO = (value, days = 1) => {
  if (!value) return "";

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  return getLocalISODate(date);
};

const formatDate = (value) => {
  if (!value) return "DD/MM/YYYY";

  const parts = value.split("-");

  if (parts.length !== 3) return "DD/MM/YYYY";

  const [year, month, day] = parts;

  if (!year || !month || !day) return "DD/MM/YYYY";

  return `${day}/${month}/${year}`;
};

const safariToItem = (s) => ({
  id: `safari-${s.id}`,
  type: "safari",
  name: s.name,
  location: s.location,
  image: s.image,
});

const stayToItem = (s) => ({
  id: `stay-${s.id}`,
  type: "stay",
  name: s.name,
  location: s.location,
  image: s.image,
  href: `/stay/${s.slug}`,
});

const POPULAR = [
  ...safariOptions.slice(0, 3).map(safariToItem),
  ...stays.slice(0, 3).map(stayToItem),
];

/* =========================================================
   SEARCH LOGIC
========================================================= */

function useSearchForm() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [adults, setAdults] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [guestOpen, setGuestOpen] = useState(false);

  // Local date avoids UTC timezone conversion problems.
  const today = getLocalISODate();

  // Checkout must be at least one day after check-in.
  const minCheckOut = addDaysToISO(checkIn || today, 1);

  /* Close dropdowns on outside click. */
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest("[data-search-box]")) {
        setOpen(false);
      }

      if (!e.target.closest("[data-guest-box]")) {
        setGuestOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, []);

  /* Search results. */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return POPULAR;

    const has = (...vals) =>
      vals.some((v) =>
        String(v || "").toLowerCase().includes(q)
      );

    const safariResults = safariOptions
      .filter((x) => has(x.name, x.location, x.description))
      .map(safariToItem);

    const stayResults = stays
      .filter((x) =>
        has(x.name, x.location, x.locationSlug, x.slug)
      )
      .map(stayToItem);

    return [...safariResults, ...stayResults].slice(0, 6);
  }, [query]);

  const guestSummary = `${adults} ${
    adults === 1 ? "Adult" : "Adults"
  }, ${childCount} ${
    childCount === 1 ? "Child" : "Children"
  }, ${rooms} ${rooms === 1 ? "Room" : "Rooms"}`;

  const totalGuests = adults + childCount;

  const guestShort = `${totalGuests} ${
    totalGuests === 1 ? "Guest" : "Guests"
  }, ${rooms} ${rooms === 1 ? "Room" : "Rooms"}`;

  /* Select a result. */
  const selectItem = (item) => {
    setQuery(item.name);
    setSelected(item);
    setOpen(false);
    setError("");
  };

  /* Clear search. */
  const clearQuery = () => {
    setQuery("");
    setSelected(null);
    setError("");
    setOpen(true);
  };

  /* Search text changes. */
  const onQueryChange = (value) => {
    setQuery(value);
    setSelected(null);
    setError("");
    setOpen(true);
  };

  /* Check-in validation. */
  const onCheckInChange = (value) => {
    if (value && value < today) {
      setError("Choose a valid check-in date");
      return;
    }

    setCheckIn(value);
    setError("");

    // Checkout must be later than check-in.
    if (checkOut && value && checkOut <= value) {
      setCheckOut("");
    }

    // When check-in is cleared, checkout must still be in the future.
    if (!value && checkOut && checkOut <= today) {
      setCheckOut("");
    }
  };

  /* Check-out validation. */
  const onCheckOutChange = (value) => {
    if (!value) {
      setCheckOut("");
      setError("");
      return;
    }

    const earliestCheckout = addDaysToISO(
      checkIn || today,
      1
    );

    if (value < earliestCheckout) {
      setError("Check-out must be after check-in");
      return;
    }

    setCheckOut(value);
    setError("");
  };

  /* Submit search and preserve routing. */
  const submit = (e) => {
    e.preventDefault();

    const q = query.trim();

    if (checkIn && checkIn < today) {
      setError("Choose a valid check-in date");
      return;
    }

    if (checkOut && checkOut < minCheckOut) {
      setError("Check-out must be after check-in");
      return;
    }

    if (!q) {
      setError("Choose a safari or stay");
      setOpen(true);
      return;
    }

    setError("");
    setOpen(false);

    const params = new URLSearchParams();

    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    params.set("adults", String(adults));
    params.set("children", String(childCount));
    params.set("rooms", String(rooms));

    const lower = q.toLowerCase();

    const match =
      selected ||
      [
        ...safariOptions.map(safariToItem),
        ...stays.map(stayToItem),
      ].find((item) => item.name?.toLowerCase() === lower);

    if (match?.type === "safari") {
      params.set("search", match.name);
      router.push(`/safari?${params.toString()}`);
      return;
    }

    if (match?.type === "stay") {
      router.push(`${match.href}?${params.toString()}`);
      return;
    }

    if (lower.includes("safari") || lower.includes("zone")) {
      params.set("search", q);
      router.push(`/safari?${params.toString()}`);
      return;
    }

    params.set("q", q);
    router.push(`/search?${params.toString()}`);
  };

  return {
    query,
    open,
    setOpen,
    error,
    results,

    checkIn,
    checkOut,
    today,
    minCheckOut,
    onCheckInChange,
    onCheckOutChange,
    setCheckOut,

    adults,
    setAdults,
    childCount,
    setChildCount,
    rooms,
    setRooms,

    guestOpen,
    setGuestOpen,
    guestSummary,
    guestShort,

    selectItem,
    clearQuery,
    onQueryChange,
    submit,
  };
}

/* =========================================================
   HERO
========================================================= */

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const form = useSearchForm();

  const total = heroData.images?.length || 0;

  useEffect(() => {
    if (total <= 1) return;

    const id = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % total);
    }, 6000);

    return () => clearInterval(id);
  }, [total]);

  const nextSlide = () => {
    if (total > 1) {
      setCurrentImage((prev) => (prev + 1) % total);
    }
  };

  const prevSlide = () => {
    if (total > 1) {
      setCurrentImage((prev) => (prev - 1 + total) % total);
    }
  };

  return (
    <section className="overflow-visible bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
      <div className="relative mx-auto min-h-[250px] max-w-[1440px] overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[420px] sm:rounded-[24px] md:min-h-[470px] md:rounded-[28px] lg:min-h-[560px]">
        {/* Active hero image only. */}
        {heroData.images?.[currentImage] && (
          <Image
            key={heroData.images[currentImage]}
            src={heroData.images[currentImage]}
            alt="Jim Corbett National Park"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1440px) calc(100vw - 32px), 1400px"
            quality={70}
            priority={currentImage === 0}
            loading={currentImage === 0 ? "eager" : "lazy"}
            className="object-cover object-center transition-opacity duration-700"
          />
        )}

        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-transparent to-black/10" />

        <div className="relative z-10 flex min-h-[250px] items-center px-3 pb-10 pt-4 sm:min-h-[420px] sm:px-8 sm:py-10 md:min-h-[470px] md:px-10 lg:min-h-[560px] lg:px-14">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/90 backdrop-blur-xl sm:mb-4 sm:py-1.5 sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B96928]" />
              EXPLORE JIM CORBETT
            </div>

            <h1 className="max-w-2xl text-[26px] font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {heroData.title}
            </h1>

            <p className="mt-2 line-clamp-2 max-w-xl text-[13px] leading-5 text-white/90 sm:mt-4 sm:line-clamp-none sm:text-base sm:leading-6 md:text-lg md:leading-7">
              {heroData.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-5">
              {heroData.buttons.map((button, index) => {
                const isPrimary = index === 0;

                return (
                  <Link
                    key={button.text}
                    href={button.href}
                    className={`group inline-flex min-h-[38px] items-center justify-center gap-1 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:min-h-[44px] sm:gap-1.5 sm:px-5 sm:text-sm ${
                      isPrimary
                        ? "bg-[#B96928] text-white shadow-md hover:bg-[#A65C22] hover:shadow-lg"
                        : "border border-white/25 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20"
                    }`}
                  >
                    <span>{button.text}</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1 sm:h-4 sm:w-4"
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 hidden flex-wrap gap-x-6 gap-y-1.5 text-sm text-white/80 sm:mt-6 sm:flex">
              {[
                "Safari Experiences",
                "Premium Stays",
                "Events & Weddings",
              ].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B96928]" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel controls. */}
        {total > 1 && (
          <div className="absolute bottom-28 right-7 z-20 hidden items-center gap-2 md:flex">
            <div className="mr-2 flex items-center gap-1">
              {heroData.images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentImage(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    currentImage === index
                      ? "w-4 bg-[#B96928]"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={prevSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition outline-none hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous slide"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition outline-none hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next slide"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Desktop search bar. */}
        <div className="absolute bottom-5 left-1/2 z-30 hidden w-[calc(100%-48px)] max-w-5xl -translate-x-1/2 md:block">
          <div className="overflow-visible rounded-xl border border-white/20 bg-white p-2 shadow-2xl">
            <SearchForm f={form} variant="desktop" />
          </div>
        </div>
      </div>

      {/* Mobile search bar. */}
      <div className="relative z-30 mx-auto -mt-7 max-w-5xl px-2 sm:-mt-10 sm:px-3 md:hidden">
        <div className="overflow-visible rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl sm:p-2">
          <SearchForm f={form} variant="mobile" />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SEARCH FORM
========================================================= */

function SearchForm({ f, variant }) {
  const mobile = variant === "mobile";

  return (
    <form
      onSubmit={f.submit}
      className={
        mobile
          ? "grid grid-cols-2 items-stretch gap-1.5"
          : "grid grid-cols-[1.3fr_1fr_1fr_auto] items-center gap-1.5"
      }
    >
      {/* Search field. */}
      <div
        className={`relative min-w-0 ${mobile ? "col-span-2" : ""}`}
        data-search-box
      >
        <div
          className={`flex min-h-[40px] items-center gap-2 rounded-lg border bg-[#EEF5F2] px-2.5 py-1 transition-colors sm:min-h-[50px] sm:gap-2.5 sm:px-3 sm:py-2 ${
            f.error
              ? "border-red-400"
              : "border-[#D5E6DF]"
          }`}
        >
          <Search
            size={16}
            className="shrink-0 text-[#18352A] sm:h-[18px] sm:w-[18px]"
          />

          <div className="flex w-full min-w-0 flex-col">
            <label
              htmlFor={`${variant}-query`}
              className={`text-[9px] font-bold uppercase leading-[11px] tracking-wide sm:text-[11px] sm:leading-normal ${
                f.error ? "text-red-600" : "text-[#385247]"
              }`}
            >
              {f.error || "Safari Zone / Stay"}
            </label>

            <input
              id={`${variant}-query`}
              type="text"
              value={f.query}
              autoComplete="off"
              onFocus={() => f.setOpen(true)}
              onChange={(e) => f.onQueryChange(e.target.value)}
              placeholder="Dhikuli, Bijrani, Jhirna..."
              className="w-full min-w-0 truncate border-0 bg-transparent p-0 text-[13px] font-semibold leading-5 text-[#172033] outline-none ring-0 placeholder:text-[#5F7A6E] focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none sm:text-[15px]"
            />
          </div>

          {f.query && (
            <button
              type="button"
              onClick={f.clearQuery}
              aria-label="Clear search"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/70 text-gray-500 outline-none sm:h-7 sm:w-7"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {f.open && (
          <ResultsDropdown
            results={f.results}
            onSelect={f.selectItem}
            showHeading={!f.query.trim()}
            mobile={mobile}
          />
        )}
      </div>

      {/* Dates. */}
      {mobile ? (
        <div className="col-span-2 grid grid-cols-2 gap-1.5">
          <MobileDate
            id="mobile-check-in"
            label="Check In"
            value={f.checkIn}
            min={f.today}
            onChange={f.onCheckInChange}
          />

          <MobileDate
            id="mobile-check-out"
            label="Check Out"
            value={f.checkOut}
            min={f.minCheckOut}
            onChange={f.onCheckOutChange}
          />
        </div>
      ) : (
        <div className="flex min-w-0 items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
          <CalendarDays
            size={18}
            className="shrink-0 text-[#172033]"
          />

          <div className="grid w-full min-w-0 grid-cols-2 gap-2">
            <div className="min-w-0">
              <label
                htmlFor="desktop-check-in"
                className="text-[10px] font-bold uppercase tracking-wide text-gray-700"
              >
                Check In
              </label>

              <input
                id="desktop-check-in"
                type="date"
                value={f.checkIn}
                min={f.today}
                onChange={(e) => f.onCheckInChange(e.target.value)}
                className="w-full min-w-0 cursor-pointer border-0 bg-transparent text-[13px] font-semibold text-[#172033] outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
              />
            </div>

            <div className="min-w-0 border-l border-gray-200 pl-2">
              <label
                htmlFor="desktop-check-out"
                className="text-[10px] font-bold uppercase tracking-wide text-gray-700"
              >
                Check Out
              </label>

              <input
                id="desktop-check-out"
                type="date"
                value={f.checkOut}
                min={f.minCheckOut}
                onChange={(e) => f.onCheckOutChange(e.target.value)}
                className="w-full min-w-0 cursor-pointer border-0 bg-transparent text-[13px] font-semibold text-[#172033] outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Guests. */}
      <div className="relative min-w-0" data-guest-box>
        <button
          type="button"
          onClick={() => f.setGuestOpen(!f.guestOpen)}
          aria-expanded={f.guestOpen}
          className={`flex min-h-[40px] w-full min-w-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-left transition outline-none hover:bg-gray-50 focus:outline-none focus-visible:ring-0 sm:min-h-[50px] sm:gap-2.5 sm:px-3 sm:py-2 ${
            mobile ? "h-full" : ""
          }`}
        >
          <Users2
            size={16}
            className="shrink-0 text-[#172033] sm:h-[18px] sm:w-[18px]"
          />

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase leading-[11px] tracking-wide text-gray-700 sm:text-[11px] sm:leading-normal">
              <span className="sm:hidden">Guests</span>
              <span className="hidden sm:inline">Guests & Rooms</span>
            </p>

            <p className="truncate text-[12px] font-semibold leading-4 text-[#172033] sm:text-[14px] sm:leading-normal">
              <span className="sm:hidden">{f.guestShort}</span>
              <span className="hidden sm:inline">{f.guestSummary}</span>
            </p>
          </div>
        </button>

        {f.guestOpen && (
          <GuestPopup
            f={f}
            mobile={mobile}
            onDone={() => f.setGuestOpen(false)}
          />
        )}
      </div>

      {/* Search button. */}
      <button
        type="submit"
        className={`flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-3 text-[13px] font-bold text-white shadow-md shadow-[#B96928]/20 transition outline-none hover:bg-[#A65C22] active:scale-[0.98] focus:outline-none focus-visible:ring-0 sm:min-h-[50px] sm:gap-2 sm:px-6 sm:text-[15px] ${
          mobile ? "w-full" : ""
        }`}
      >
        <Search size={16} />
        <span>Search</span>
      </button>
    </form>
  );
}

/* =========================================================
   MOBILE DATE CELL
========================================================= */

function MobileDate({
  id,
  label,
  value,
  onChange,
  min,
}) {
  const openPicker = (e) => {
    if (typeof e.currentTarget.showPicker === "function") {
      try {
        e.currentTarget.showPicker();
      } catch {
        // Native picker remains available through the input.
      }
    }
  };

  return (
    <div className="flex min-h-[44px] min-w-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 py-1.5 sm:min-h-[50px] sm:gap-2 sm:px-2.5 sm:py-2">
      <CalendarDays
        size={15}
        className="shrink-0 text-[#172033]"
      />

      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className="block text-[9px] font-bold uppercase leading-[11px] tracking-wide text-gray-700 sm:text-[11px] sm:leading-normal"
        >
          {label}
        </label>

        <div className="relative mt-0.5 h-[20px] min-w-0 sm:h-[22px]">
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 flex items-center truncate text-[12px] font-semibold sm:text-[14px] ${
              value ? "text-[#172033]" : "text-gray-400"
            }`}
          >
            {formatDate(value)}
          </span>

          <input
            id={id}
            type="date"
            value={value}
            min={min}
            onChange={(e) => onChange(e.target.value)}
            onClick={openPicker}
            aria-label={label}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none border-0 bg-transparent opacity-0 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SEARCH RESULTS DROPDOWN
========================================================= */

function ResultsDropdown({
  results,
  onSelect,
  showHeading,
  mobile,
}) {
  return (
    <div
      className={`absolute z-[200] overflow-hidden rounded-xl border border-gray-200 bg-white text-[#172033] shadow-2xl ${
        mobile
          ? "left-0 right-0 top-full mt-1 w-full"
          : "bottom-full left-0 mb-2 w-full min-w-[320px]"
      }`}
    >
      {results.length > 0 ? (
        <div className="max-h-[300px] overflow-y-auto p-1.5">
          {showHeading && (
            <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
              Popular
            </p>
          )}

          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition outline-none hover:bg-[#EEF5F2] active:bg-[#EEF5F2] focus:outline-none focus-visible:bg-[#EEF5F2]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7F5F0]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={44}
                    height={44}
                    quality={50}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MapPin
                    size={18}
                    className="text-[#B96928]"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-bold">
                    {item.name}
                  </p>

                  <span className="shrink-0 rounded-full bg-[#F7F5F0] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#B96928]">
                    {item.type}
                  </span>
                </div>

                {item.location && (
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-gray-500">
                    <MapPin size={12} className="shrink-0" />
                    {item.location}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-5 text-center">
          <Search size={20} className="mx-auto text-gray-300" />

          <p className="mt-2 text-[14px] font-semibold text-gray-600">
            No matching safari or stay found
          </p>

          <p className="mt-1 text-[12px] text-gray-400">
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

function GuestPopup({ f, onDone, mobile }) {
  return (
    <div
      className={`absolute z-[100] w-[300px] max-w-[calc(100vw-32px)] rounded-xl border border-gray-200 bg-white p-4 text-[#172033] shadow-2xl ${
        mobile
          ? "bottom-full left-0 mb-2"
          : "bottom-full right-0 mb-2"
      }`}
    >
      <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-[16px] font-bold">
            Guests & Rooms
          </h3>

          <p className="mt-0.5 text-[12px] text-gray-500">
            Select your group size
          </p>
        </div>

        <button
          type="button"
          onClick={onDone}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 outline-none transition hover:bg-gray-200 focus:outline-none"
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>

      <GuestRow
        title="Adults"
        subtitle="12+ years"
        value={f.adults}
        setValue={f.setAdults}
        min={1}
      />

      <GuestRow
        title="Children"
        subtitle="0-11 years"
        value={f.childCount}
        setValue={f.setChildCount}
        min={0}
      />

      <GuestRow
        title="Rooms"
        value={f.rooms}
        setValue={f.setRooms}
        min={1}
      />

      <button
        type="button"
        onClick={onDone}
        className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#B96928] py-2.5 text-[14px] font-bold text-white outline-none transition hover:bg-[#A65C22] focus:outline-none"
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
  setValue,
  min,
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
      <p className="text-[14px] font-semibold text-[#172033]">
        {title}

        {subtitle && (
          <span className="ml-1 font-normal text-gray-500">
            ({subtitle})
          </span>
        )}
      </p>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setValue(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 outline-none transition hover:border-[#B96928] hover:text-[#B96928] focus:outline-none disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Decrease ${title}`}
        >
          <Minus size={14} />
        </button>

        <span className="w-6 text-center text-[14px] font-bold">
          {value}
        </span>

        <button
          type="button"
          onClick={() => setValue(value + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 outline-none transition hover:border-[#B96928] hover:text-[#B96928] focus:outline-none"
          aria-label={`Increase ${title}`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
