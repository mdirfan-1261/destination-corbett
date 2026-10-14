
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
      className="grid overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg md:grid-cols-2 md:rounded-[24px]"
    >
      {/* IMAGE */}

      <div className="relative h-[230px] overflow-hidden bg-[#E8E3DA] sm:h-[320px] md:min-h-[380px]">
        <Image
          src={safari.image}
          alt={safari.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={75}
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5">
          <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">
            <Trees size={14} className="text-[#B96928]" />

            <span className="text-xs font-semibold text-[#172033]">
              {safari.name}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS */}

      <div className="flex min-w-0 flex-col justify-center p-4 sm:p-7 md:p-9">
        <p className="text-[9px] font-semibold tracking-[1.8px] text-[#C88A3D] sm:text-xs sm:tracking-[2px]">
          SAFARI EXPERIENCE
        </p>

        <h3 className="mt-1.5 break-words text-xl font-bold leading-tight text-[#172033] sm:text-2xl md:text-3xl">
          {safari.name}
        </h3>

        <p className="mt-2.5 text-[12px] leading-[1.6] text-gray-600 sm:mt-3 sm:text-sm sm:leading-6">
          {safari.description}
        </p>

        {/* DURATION AND CAPACITY */}

        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
          <div className="rounded-lg bg-[#F7F5F0] p-2.5 sm:rounded-xl sm:p-3">
            <Clock3 size={16} className="text-[#B96928]" />

            <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
              Duration
            </p>

            <p className="text-xs font-semibold text-[#172033] sm:text-sm">
              {safari.duration}
            </p>
          </div>

          <div className="rounded-lg bg-[#F7F5F0] p-2.5 sm:rounded-xl sm:p-3">
            <Users size={16} className="text-[#B96928]" />

            <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
              Group Size
            </p>

            <p className="text-xs font-semibold text-[#172033] sm:text-sm">
              {safari.group}
            </p>
          </div>
        </div>

        {/* LOCATION */}

        <div className="mt-3 flex items-start gap-1.5 text-[11px] text-gray-500 sm:mt-4 sm:text-xs">
          <MapPin
            size={14}
            className="mt-0.5 shrink-0 text-[#B96928]"
          />

          <span>{safari.location}</span>
        </div>

        {/* PRICE */}

        <div className="mt-4 border-t border-gray-100 pt-3 sm:mt-5 sm:pt-4">
          <p className="text-[10px] text-gray-500 sm:text-[11px]">
            Starting from
          </p>

          <p className="mt-0.5 text-xl font-bold leading-tight text-[#172033] sm:text-2xl">
            {formatPrice(safari.price)}

            <span className="text-[10px] font-normal text-gray-500 sm:text-xs">
              {" "}
              / person
            </span>
          </p>
        </div>

        {/* BUTTONS */}

        <div className="mt-3 flex gap-2 sm:mt-4">
          <Link
            href={getEnquiryUrl(safari)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#172033] px-2 text-xs font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white sm:flex-none sm:px-4"
          >
            Enquire
            <ArrowRight size={13} />
          </Link>

          <Link
            href={getBookingUrl(safari)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-2 text-xs font-semibold text-white transition hover:bg-[#9F5520] sm:flex-none sm:px-4"
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
  // IMPORTANT: store all active services in an array.
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

      // Keep every active record; do not use .find() here.
      const activeServices = result.data.filter((service) => {
        const status = String(
          service?.status || "active"
        ).toLowerCase();

        return ![
          "inactive",
          "disabled",
          "deleted",
          "archived",
        ].includes(status);
      });

      // Map every active service to its public card data.
      const mappedServices = activeServices.map(mapCanterService);

      // Empty array is valid: it means there are no active services.
      setCanterSafaris(mappedServices);
    } catch (error) {
      console.error("Public Canter Safari load error:", error);

      // Use the default card only when the API request fails.
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

  // The first service supplies the hero content.
  // All services are rendered below.
  const heroSafari =
    canterSafaris[0] || DEFAULT_CANTER_SAFARI;

  const heroGuestsLabel = heroSafari.capacity
    ? `Up to ${heroSafari.capacity} guests`
    : "Capacity on request";

  return (
    <main className="bg-white">
      {/* HERO */}

      <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">
          <div className="relative h-[300px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[560px]">
            <Image
              src={heroSafari.image}
              alt={heroSafari.name}
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/50 to-transparent" />

            <div className="relative z-10 flex h-full items-center px-5 sm:px-8 md:px-12 lg:px-16">
              <div className="max-w-2xl">
                <p className="mb-2 text-[9px] font-semibold tracking-[2px] text-[#C88A3D] sm:mb-3 sm:text-xs sm:tracking-[3px] md:text-sm">
                  CANTER SAFARI
                </p>

                <h1 className="text-[27px] font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Explore Corbett{" "}
                  <span className="text-[#C88A3D]">
                    on a Canter Safari
                  </span>
                </h1>

                <p className="mt-2 max-w-xl text-[12px] leading-[1.6] text-white/90 sm:mt-4 sm:text-base sm:leading-7 md:mt-5 md:text-lg">
                  {heroSafari.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
                  <a
                    href="#canter-services"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#B96928] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#9F5520] sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    View Canter Safaris
                    <ArrowRight size={15} />
                  </a>

                  <Link
                    href={getEnquiryUrl(heroSafari)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    Make an Enquiry
                    <ArrowRight size={15} />
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-white/85 sm:mt-6 sm:gap-x-6 sm:text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#C88A3D]">✓</span>
                    {heroGuestsLabel}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="text-[#C88A3D]">✓</span>
                    {heroSafari.duration}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="text-[#C88A3D]">✓</span>
                    Booking Assistance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL ACTIVE CANTER SERVICES */}

      <section
        id="canter-services"
        className="scroll-mt-20 bg-[#F7F5F0] py-7 sm:py-10 md:py-12"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <p className="mb-2 text-[9px] font-semibold tracking-[1.8px] text-[#C88A3D] sm:mb-3 sm:text-xs sm:tracking-[2.5px]">
              GROUP WILDLIFE EXPERIENCE
            </p>

            <h2 className="text-2xl font-bold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
              Canter Safaris in Jim Corbett
            </h2>

            <p className="mt-2.5 max-w-xl text-[12px] leading-[1.6] text-gray-600 sm:mt-3 sm:text-sm sm:leading-6">
              Explore the available Canter Safari options and choose
              the experience that suits your group.
            </p>
          </div>

          {/* LOADING */}

          {loading && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-black/10 bg-white p-5 text-center sm:rounded-2xl"
            >
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-[#B96928]/20 border-t-[#B96928]" />

              <p className="mt-3 text-sm font-medium text-[#172033]">
                Loading Canter Safari details...
              </p>
            </div>
          )}

          {/* API ERROR */}

          {!loading && loadError && (
            <div
              role="status"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#B96928]/20 bg-white p-4 sm:rounded-2xl sm:p-5"
            >
              <p className="text-sm leading-5 text-gray-600">
                Live Canter Safari data could not be loaded.
                Showing standard details instead.
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
            <div className="space-y-5 sm:space-y-7">
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
              <div className="rounded-2xl border border-black/10 bg-white px-5 py-10 text-center sm:px-8">
                <Trees
                  size={32}
                  className="mx-auto text-[#B96928]"
                />

                <h3 className="mt-3 text-lg font-bold text-[#172033]">
                  No Canter Safaris Available
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
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

          <p className="mt-5 text-xs leading-5 text-gray-500">
            Safari prices and availability are subject to confirmation.
            Official permits and zone access depend on the applicable
            booking process.
          </p>
        </div>
      </section>
    </main>
  );
}
