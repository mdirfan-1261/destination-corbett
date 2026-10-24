"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock3,
  Users,
  ArrowRight,
  Trees,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

// =====================================================
// API CONFIGURATION
// =====================================================

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL
  ?.trim()
  .replace(/\/+$/, "");

const API_BASE = configuredApiUrl
  ? configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : "http://localhost:5000/api";

const DEFAULT_CANTER_SAFARI = {
  id: "default-canter",
  serviceCode: "canter",
  name: "Canter Safari",
  image: "/safari/canter.webp",
  duration: "3–4 hrs",
  price: 1500,
  capacity: 16,
  group: "Up to 16",
  location: "Jim Corbett National Park",
  description:
    "Experience a shared wildlife safari in Jim Corbett, suitable for families and larger groups.",
};

// =====================================================
// HELPERS
// =====================================================

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "Price on request";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getImageUrl(image) {
  if (!image || typeof image !== "string" || !image.trim()) {
    return DEFAULT_CANTER_SAFARI.image;
  }

  const value = image.trim();

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (
    value.startsWith("/uploads/") ||
    value.startsWith("/api/uploads/")
  ) {
    return `${API_BASE.replace(/\/api$/, "")}${value}`;
  }

  if (
    value.startsWith("/safari/") ||
    value.startsWith("/images/") ||
    value.startsWith("/logo/")
  ) {
    return value;
  }

  return value.startsWith("/") ? value : `/${value}`;
}

function mapCanterService(service) {
  const capacity = Number(service?.capacity);

  const price =
    service?.price === "" || service?.price == null
      ? null
      : Number(service.price);

  return {
    id: String(
      service?._id ||
        service?.id ||
        service?.serviceCode ||
        DEFAULT_CANTER_SAFARI.id
    ),
    serviceCode: service?.serviceCode || "canter",
    name: service?.name || DEFAULT_CANTER_SAFARI.name,
    image: getImageUrl(
      service?.image ||
        service?.imageUrl ||
        service?.imageURL ||
        DEFAULT_CANTER_SAFARI.image
    ),
    duration: service?.duration || "Contact for details",
    price: Number.isFinite(price) ? price : null,
    capacity:
      Number.isFinite(capacity) && capacity > 0
        ? capacity
        : null,
    group:
      Number.isFinite(capacity) && capacity > 0
        ? `Up to ${capacity}`
        : "Capacity on request",
    location:
      service?.location ||
      service?.area ||
      DEFAULT_CANTER_SAFARI.location,
    description:
      service?.description ||
      DEFAULT_CANTER_SAFARI.description,
  };
}

function getEnquiryUrl(safari) {
  return `/contact?type=canter-safari&safari=${encodeURIComponent(
    safari.name
  )}&service_code=${encodeURIComponent(
    safari.serviceCode
  )}&location=${encodeURIComponent(
    safari.location
  )}&image=${encodeURIComponent(safari.image)}`;
}

function getBookingUrl(safari) {
  return `/booking?type=safari&safari_id=${encodeURIComponent(
    safari.id
  )}&serviceId=${encodeURIComponent(
    safari.id
  )}&safari=${encodeURIComponent(
    safari.name
  )}&image=${encodeURIComponent(
    safari.image
  )}&price=${encodeURIComponent(
    safari.price ?? ""
  )}&service_code=${encodeURIComponent(safari.serviceCode)}`;
}

// =====================================================
// REUSABLE SERVICE CARD
// =====================================================

function CanterServiceCard({ safari }) {
  return (
    <article
      id={`canter-${safari.id}`}
      className="group grid min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-white/10 dark:bg-[#171c19] sm:rounded-2xl md:grid-cols-2"
    >
      {/* IMAGE */}

      <div className="relative h-[190px] overflow-hidden bg-[#E8E3DA] sm:h-[260px] md:h-full md:min-h-[300px]">
        <Image
          src={safari.image}
          alt={safari.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={75}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
          <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">
            <Trees size={14} className="text-[#B96928]" />

            <span className="text-xs font-semibold text-[#172033]">
              {safari.name}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS */}

      <div className="flex min-w-0 flex-col justify-center p-3.5 sm:p-5 md:p-6">
        <p className="text-[9px] font-semibold tracking-[1.5px] text-[#B96928] sm:text-[10px] sm:tracking-[1.8px]">
          SAFARI EXPERIENCE
        </p>

        <h3 className="mt-1.5 break-words text-lg font-bold leading-tight text-[#172033] dark:text-gray-100 sm:text-xl md:text-2xl">
          {safari.name}
        </h3>

        <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300 sm:text-sm sm:leading-6">
          {safari.description}
        </p>

        {/* DURATION AND CAPACITY */}

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
          <div className="rounded-lg bg-[#F7F5F0] p-2.5 dark:bg-[#222923] sm:rounded-xl sm:p-3">
            <Clock3 size={15} className="text-[#B96928]" />

            <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
              Duration
            </p>

            <p className="break-words text-xs font-semibold text-[#172033] dark:text-gray-100 sm:text-sm">
              {safari.duration}
            </p>
          </div>

          <div className="rounded-lg bg-[#F7F5F0] p-2.5 dark:bg-[#222923] sm:rounded-xl sm:p-3">
            <Users size={15} className="text-[#B96928]" />

            <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
              Group Size
            </p>

            <p className="break-words text-xs font-semibold text-[#172033] dark:text-gray-100 sm:text-sm">
              {safari.group}
            </p>
          </div>
        </div>

        {/* LOCATION */}

        <div className="mt-3 flex items-start gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
          <MapPin
            size={14}
            className="mt-0.5 shrink-0 text-[#B96928]"
          />

          <span>{safari.location}</span>
        </div>

        {/* PRICE */}

        <div className="mt-3 border-t border-gray-100 pt-3 dark:border-white/10 sm:mt-4 sm:pt-3.5">
          <p className="text-[10px] text-gray-500 sm:text-[11px]">
            Starting from
          </p>

          <p className="mt-0.5 break-words text-xl font-bold leading-tight text-[#172033] dark:text-gray-100 sm:text-2xl">
            {formatPrice(safari.price)}

            <span className="text-[10px] font-normal text-gray-500 sm:text-xs">
              {" "}/ person
            </span>
          </p>
        </div>

        {/* BUTTONS */}

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:flex">
          <Link
            href={getEnquiryUrl(safari)}
            className="inline-flex h-9 min-w-0 items-center justify-center gap-1 rounded-lg border border-[#172033] px-2 text-xs font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white dark:border-gray-300 dark:text-gray-100 sm:h-10 sm:flex-none sm:gap-1.5 sm:px-4"
          >
            Enquire
            <ArrowRight size={13} />
          </Link>

          <Link
            href={getBookingUrl(safari)}
            className="inline-flex h-9 min-w-0 items-center justify-center gap-1 rounded-lg bg-[#B96928] px-2 text-xs font-semibold text-white transition hover:bg-[#9F5520] sm:h-10 sm:flex-none sm:gap-1.5 sm:px-4"
          >
            <CalendarDays size={13} />
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}

// =====================================================
// PAGE
// =====================================================

export default function CanterSafariPage() {
  const [canterSafaris, setCanterSafaris] = useState([
    DEFAULT_CANTER_SAFARI,
  ]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadCanterSafaris = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await fetch(
        `${API_BASE}/public/safari/canter-services`,
        { cache: "no-store" }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Unable to load Canter Safari (${response.status}).`
        );
      }

      if (
        !result ||
        result.success !== true ||
        !Array.isArray(result.data)
      ) {
        throw new Error(
          "Invalid Canter Safari API response. Please check the backend route."
        );
      }

      // Keep all services except explicitly disabled records.
      const activeServices = result.data.filter((service) => {
        const status = String(
          service?.status || "active"
        )
          .trim()
          .toLowerCase();

        return ![
          "inactive",
          "disabled",
          "deleted",
          "archived",
        ].includes(status);
      });

      const mappedServices = activeServices.map(
        mapCanterService
      );

      setCanterSafaris(mappedServices);
    } catch (error) {
      console.error("Public Canter Safari load error:", error);

      // Retain the default service as a fallback on API failure.
      setCanterSafaris([DEFAULT_CANTER_SAFARI]);

      setLoadError(
        error?.message ||
          "Unable to load live Canter Safari details."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCanterSafaris();
  }, [loadCanterSafaris]);

  const heroSafari =
    canterSafaris[0] || DEFAULT_CANTER_SAFARI;

  const heroGuestsLabel = heroSafari.capacity
    ? `Up to ${heroSafari.capacity} guests`
    : "Capacity on request";

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033] dark:bg-[#0e1210]">
      {/* BREADCRUMB */}

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

          <Link
            href="/safari"
            className="text-[#B96928] transition-colors hover:underline"
          >
            Safari
          </Link>

          <span className="text-gray-400">›</span>

          <span
            aria-current="page"
            className="font-medium text-[#172033] dark:text-gray-100"
          >
            Canter Safari
          </span>
        </div>
      </nav>

      {/* COMPACT HERO */}

      <section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
        <div className="relative mx-auto min-h-[150px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[180px] sm:rounded-2xl lg:min-h-[210px]">
          {/* HERO IMAGE */}

          <div className="absolute inset-0 lg:left-auto lg:w-[58%]">
            <Image
              src={heroSafari.image}
              alt={heroSafari.name}
              fill
              priority
              quality={75}
              sizes="(max-width: 1023px) 100vw, 700px"
              className="object-cover object-center brightness-110"
            />
          </div>

          {/* OVERLAYS */}

          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/95 via-[#172033]/75 to-[#172033]/20 lg:via-[#172033]/70 lg:to-transparent" />

          <div className="relative z-10 flex min-h-[150px] items-center px-4 py-5 sm:min-h-[180px] sm:px-8 lg:min-h-[210px] lg:px-10">
            <div className="max-w-xl">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur-xl">
                <Trees className="h-3 w-3 text-[#E6A76D]" />
                Destination Corbett Safari
              </div>

              <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                Explore Corbett{" "}
                <span className="text-[#E6A76D]">
                  on a Canter Safari
                </span>
              </h1>

              <p className="mt-2 hidden max-w-md text-xs leading-5 text-white/85 sm:block sm:text-sm">
                {heroSafari.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href="#canter-services"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#B96928] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#9F5520] sm:text-sm"
                >
                  View Canter Safaris
                  <ArrowRight size={14} />
                </a>

                <Link
                  href={getEnquiryUrl(heroSafari)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:text-sm"
                >
                  Make an Enquiry
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="mt-3 hidden flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-white/90 sm:flex">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#E6A76D]" />
                  {heroGuestsLabel}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-[#E6A76D]" />
                  {heroSafari.duration}
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-[#E6A76D]" />
                  Booking Assistance
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL ACTIVE CANTER SERVICES */}

      <section
        id="canter-services"
        className="scroll-mt-20 px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 sm:mb-5">
            <p className="hidden text-xs font-bold uppercase tracking-wider text-[#B96928] sm:block">
              Group Wildlife Experience
            </p>

            <h2 className="text-lg font-bold leading-tight text-[#172033] dark:text-gray-100 sm:mt-1 sm:text-2xl">
              Canter Safaris in Jim Corbett
            </h2>

            <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-300 sm:text-sm">
              Explore the available Canter Safari options and choose the
              experience that suits your group.
            </p>
          </div>

          {/* LOADING */}

          {loading && (
            <div
              role="status"
              className="rounded-xl border border-black/10 bg-white p-6 text-center dark:border-white/10 dark:bg-[#171c19] sm:rounded-2xl"
            >
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-[#B96928]/20 border-t-[#B96928]" />

              <p className="mt-3 text-sm font-medium text-[#172033] dark:text-gray-100">
                Loading Canter Safari details...
              </p>
            </div>
          )}

          {/* API ERROR */}

          {!loading && loadError && (
            <div
              role="status"
              className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#B96928]/20 bg-white p-4 dark:bg-[#171c19] sm:rounded-2xl sm:p-5"
            >
              <p className="text-sm leading-5 text-gray-600 dark:text-gray-300">
                Live Canter Safari data could not be loaded. Showing
                standard details instead.
              </p>

              <button
                type="button"
                onClick={loadCanterSafaris}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#B96928] px-4 text-sm font-bold text-white transition hover:bg-[#9F5520]"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          )}

          {/* SERVICE CARDS */}

          {!loading && canterSafaris.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              {canterSafaris.map((safari) => (
                <CanterServiceCard
                  key={safari.id}
                  safari={safari}
                />
              ))}
            </div>
          )}

          {/* NO ACTIVE SERVICES */}

          {!loading &&
            !loadError &&
            canterSafaris.length === 0 && (
              <div className="rounded-xl border border-black/10 bg-white px-5 py-8 text-center dark:border-white/10 dark:bg-[#171c19] sm:rounded-2xl sm:px-8 sm:py-10">
                <Trees
                  size={32}
                  className="mx-auto text-[#B96928]"
                />

                <h3 className="mt-3 text-lg font-bold text-[#172033] dark:text-gray-100">
                  No Canter Safaris Available
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Please check back later or contact us for assistance.
                </p>

                <Link
                  href="/contact?type=canter-safari"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#B96928] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9F5520]"
                >
                  Contact Us
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}

          <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Safari prices and availability are subject to confirmation.
            Official permits and zone access depend on the applicable
            booking process.
          </p>
        </div>
      </section>
    </main>
  );
}