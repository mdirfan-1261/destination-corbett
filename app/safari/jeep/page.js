
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  MapPin,
  MessageCircle,
  PhoneCall,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trees,
  Users,
} from "lucide-react";

const FALLBACK_IMAGE = "/safari/jeep-safari.webp";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL
  ?.trim()
  .replace(/\/+$/, "");

const API_BASE = configuredApiUrl
  ? configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`
  : "http://localhost:5000/api";

// =====================================================
// HELPERS
// =====================================================

function normalisePhoneNumber(value) {
  let digits = String(value || "").replace(/\D/g, "");

  if (!digits) return "";

  if (digits.startsWith("0091")) {
    digits = digits.slice(2);
  }

  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  return digits;
}

function getWhatsAppUrl(message, number) {
  const phone = normalisePhoneNumber(number);

  if (!phone || phone.length < 10) return "";

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function WhatsAppLink({
  message,
  number,
  className = "",
  children,
  label,
}) {
  const url = getWhatsAppUrl(message, number);

  return (
    <a
      href={url || undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label || "Contact us on WhatsApp"}
      aria-disabled={!url}
      onClick={(event) => {
        if (!url) event.preventDefault();
      }}
      className={`${className} ${
        !url ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      {children}
    </a>
  );
}

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

function getZoneNames(service) {
  if (Array.isArray(service?.zoneNames)) {
    const names = service.zoneNames
      .map((zone) =>
        typeof zone === "string" ? zone : zone?.name || ""
      )
      .filter(Boolean);

    if (names.length) return names;
  }

  if (typeof service?.zones === "string") {
    return service.zones ? [service.zones] : [];
  }

  if (!Array.isArray(service?.zones)) return [];

  return service.zones
    .map((zone) => {
      if (typeof zone === "string") return zone;

      return zone?.name || zone?.zoneName || "";
    })
    .filter(Boolean);
}

function getImageUrl(image) {
  if (!image || typeof image !== "string") {
    return FALLBACK_IMAGE;
  }

  const value = image.trim();

  if (!value) return FALLBACK_IMAGE;

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

function mapJeepService(service, index) {
  const zones = getZoneNames(service);
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
        `live-${index}`
    ),
    serviceCode: service?.serviceCode || "",
    name: service?.name || "Jeep Safari",
    location:
      service?.location ||
      service?.area ||
      "Jim Corbett National Park",
    zones,
    image: getImageUrl(
      service?.image ||
        service?.imageUrl ||
        service?.imageURL ||
        FALLBACK_IMAGE
    ),
    description:
      service?.description ||
      "Explore the wildlife of Jim Corbett with a Jeep Safari.",
    price: Number.isFinite(price) ? price : null,
    duration: service?.duration || "Contact for details",
    capacity:
      Number.isFinite(capacity) && capacity > 0
        ? capacity
        : null,
    guests:
      Number.isFinite(capacity) && capacity > 0
        ? `Up to ${capacity} Guests`
        : "Capacity on request",
  };
}

function getEnquiryUrl(safari) {
  return `/contact?type=safari&safari=${encodeURIComponent(
    safari.name
  )}&service_code=${encodeURIComponent(
    safari.serviceCode
  )}&location=${encodeURIComponent(safari.location)}`;
}

function getBookingUrl(safari) {
  return `/booking?type=safari&safari=${encodeURIComponent(
    safari.name
  )}&serviceId=${encodeURIComponent(
    safari.id
  )}&price=${encodeURIComponent(
    safari.price ?? ""
  )}&service_code=${encodeURIComponent(safari.serviceCode)}`;
}

// =====================================================
// PAGE
// =====================================================

export default function JeepSafariPage() {
  const { profile } = useOrganisationProfile();

  // No hardcoded default service cards.
  // Public cards come only from active API records.
  const [safariOptions, setSafariOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const whatsappNumber = profile?.whatsapp || profile?.phone || "";
  const contactPhone = normalisePhoneNumber(profile?.phone);

  // ===================================================
  // LOAD ACTIVE JEEP SAFARI SERVICES
  // ===================================================

  const loadJeepSafaris = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await fetch(
        `${API_BASE}/public/safari/jeep-services`,
        { cache: "no-store" }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Unable to load Jeep Safari services (${response.status}).`
        );
      }

      if (
        !result ||
        result.success !== true ||
        !Array.isArray(result.data)
      ) {
        throw new Error(
          "Invalid Jeep Safari API response. Please check the backend route."
        );
      }

      // Strict status check:
      // only records explicitly marked active are public.
      const activeServices = result.data.filter((service) => {
        const status = String(service?.status || "")
          .trim()
          .toLowerCase();

        return status === "active";
      });

      const liveSafaris = activeServices.map(
        (service, index) => mapJeepService(service, index)
      );

      setSafariOptions(liveSafaris);
      setExpanded(null);
    } catch (error) {
      console.error("Public Jeep Safari load error:", error);

      // Do not show defaults when the API fails.
      // This prevents stale/hardcoded cards from appearing.
      setSafariOptions([]);

      setLoadError(
        error?.message ||
          "Unable to load live Jeep Safari services."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJeepSafaris();
  }, [loadJeepSafaris]);

  // ===================================================
  // WHATSAPP MESSAGES
  // ===================================================

  const generalMessage = [
    "Hi Destination Corbett,",
    "",
    "I am interested in Jeep Safari.",
    "Please share available dates, prices and booking details.",
  ].join("\n");

  const helpMessage = [
    "Hi Destination Corbett,",
    "",
    "Please help me choose a Jeep Safari.",
    "Please share availability, zones, group capacity and final pricing.",
  ].join("\n");

  const customMessage = [
    "Hi Destination Corbett,",
    "",
    "I would like a customised Jeep Safari enquiry.",
    "Please help me with availability and final pricing.",
  ].join("\n");

  function getSafariMessage(safari) {
    return [
      "Hi Destination Corbett,",
      "",
      "I am interested in this Jeep Safari:",
      `Service: ${safari.name}`,
      `Location: ${safari.location}`,
      `Zones: ${safari.zones.join(", ") || "Please advise"}`,
      `Displayed price: ${formatPrice(safari.price)}`,
      `Duration: ${safari.duration}`,
      `Capacity: ${safari.guests}`,
      "",
      "Please confirm availability, applicable permits, final price and booking process.",
    ].join("\n");
  }

  return (
    <main className="bg-[#F7F5F0] text-[#172033]">
      {/* HERO */}

      <section className="px-2 py-2 sm:px-4 sm:py-4 md:px-6">
        <div className="relative mx-auto min-h-[260px] max-w-[1440px] overflow-hidden rounded-2xl bg-[#172033] text-white sm:min-h-[420px] sm:rounded-3xl lg:min-h-[500px]">
          <Image
            src="/safari/safari-hero.webp"
            alt="Jeep Safari adventure in Jim Corbett"
            fill
            priority
            quality={70}
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#172033]/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/55 to-[#172033]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/45 to-transparent" />

          <div className="relative z-10 flex min-h-[260px] items-center px-4 py-6 sm:min-h-[420px] sm:px-9 sm:py-12 lg:min-h-[500px] lg:px-14">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md sm:mb-4 sm:py-2 sm:text-sm">
                <Trees className="h-4 w-4 text-[#E6A76D]" />
                Destination Corbett Safari
              </div>

              <h1 className="text-[1.6rem] font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Explore the Wild
                <span className="mt-1 block text-[#E6A76D]">
                  Jeep Safari
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/90 sm:mt-4 sm:text-base sm:leading-7">
                Explore available Jeep Safari services, compare prices and
                enquire about dates and availability with our team.
              </p>

              <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                <a
                  href="#jeep-options"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B96928] px-5 text-sm font-bold text-white transition hover:bg-[#9F5520]"
                >
                  Explore Safaris
                  <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  href="/contact?type=safari"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Send an Enquiry
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 hidden flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/90 sm:flex">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#E6A76D]" />
                  Booking Assistance
                </span>

                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#E6A76D]" />
                  Group Capacity
                </span>

                <span className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[#E6A76D]" />
                  Quick Enquiry
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JEEP SAFARI LIST */}

      <section
        id="jeep-options"
        className="scroll-mt-20 px-3 py-6 sm:px-6 sm:py-10 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="hidden text-sm font-bold uppercase tracking-wider text-[#B96928] sm:block">
                Available Services
              </p>

              <h2 className="text-xl font-bold leading-tight sm:mt-2 sm:text-3xl md:text-4xl">
                Jeep Safari Options
              </h2>

              <p className="mt-1 text-sm leading-5 text-[#4B5563] sm:mt-2 sm:text-base sm:leading-6">
                Compare available services, prices, duration and capacity.
              </p>
            </div>

            <WhatsAppLink
              number={whatsappNumber}
              message={helpMessage}
              label="Get Jeep Safari recommendations on WhatsApp"
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#172033] px-3 text-xs font-bold text-white transition hover:bg-[#26344D] sm:min-h-11 sm:gap-2 sm:px-5 sm:text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help Me Choose</span>
              <span className="sm:hidden">Help</span>
            </WhatsAppLink>
          </div>

          {/* LOADING */}

          {loading && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-black/10 bg-white p-8 text-center sm:mt-6 sm:rounded-2xl"
            >
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#B96928]/20 border-t-[#B96928]" />

              <p className="mt-3 text-sm font-medium">
                Loading Jeep Safari services...
              </p>
            </div>
          )}

          {/* API ERROR */}

          {!loading && loadError && (
            <div
              role="status"
              className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#B96928]/20 bg-white p-4 sm:mt-6 sm:rounded-2xl sm:p-5"
            >
              <p className="text-sm leading-5 text-[#4B5563]">
                Live Jeep Safari services could not be loaded. Please retry
                or contact our team.
              </p>

              <button
                type="button"
                onClick={loadJeepSafaris}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#B96928] px-4 text-sm font-bold text-white transition hover:bg-[#9F5520]"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          )}

          {/* ACTIVE SERVICE CARDS ONLY */}

          {!loading && !loadError && safariOptions.length > 0 && (
            <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {safariOptions.map((safari) => {
                const isExpanded = expanded === safari.id;

                return (
                  <article
                    key={safari.id}
                    className="group flex min-w-0 items-stretch overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition duration-200 hover:shadow-md sm:flex-col"
                  >
                    {/* IMAGE */}

                    <Link
                      href={getEnquiryUrl(safari)}
                      aria-label={`Enquire about ${safari.name}`}
                      className="relative block min-h-[180px] w-[132px] shrink-0 self-stretch overflow-hidden bg-[#E8E3DA] sm:aspect-[16/9] sm:min-h-0 sm:w-full sm:self-auto"
                    >
                      <Image
                        src={safari.image}
                        alt={safari.name}
                        fill
                        sizes="(max-width: 640px) 132px, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />

                      <span className="absolute left-1 top-1 max-w-[calc(100%-0.5rem)] truncate rounded-full bg-[#B96928] px-1.5 py-1 text-[9px] font-bold leading-none text-white shadow sm:left-2 sm:top-2 sm:px-2 sm:text-xs">
                        Jeep Safari
                      </span>
                    </Link>

                    {/* CARD CONTENT */}

                    <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4">
                      <div className="flex min-w-0 items-center gap-1 text-[10px] leading-4 text-[#4B5563] sm:text-xs">
                        <MapPin className="h-3 w-3 shrink-0 text-[#B96928] sm:h-3.5 sm:w-3.5" />
                        <span className="truncate">{safari.location}</span>
                      </div>

                      <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-[#172033] sm:text-base">
                        {safari.name}
                      </h3>

                      <p
                        className={`mt-1 text-xs leading-4 text-[#4B5563] sm:text-sm sm:leading-5 ${
                          isExpanded ? "" : "line-clamp-2"
                        }`}
                      >
                        {safari.description}
                      </p>

                      {isExpanded && (
                        <div className="mt-2 space-y-2 border-t border-black/10 pt-2">
                          {safari.zones.length > 0 && (
                            <div className="flex items-start justify-between gap-2 text-xs">
                              <span className="text-[#6B7280]">Zones</span>

                              <span className="text-right font-semibold text-[#172033]">
                                {safari.zones.join(", ")}
                              </span>
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-2 text-xs">
                            <span className="text-[#6B7280]">Duration</span>

                            <span className="text-right font-semibold text-[#172033]">
                              {safari.duration}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-2 text-xs">
                            <span className="text-[#6B7280]">Capacity</span>

                            <span className="text-right font-semibold text-[#172033]">
                              {safari.guests}
                            </span>
                          </div>

                          <p className="text-xs leading-5 text-[#6B7280]">
                            Availability, permits and final charges must be
                            confirmed before booking.
                          </p>
                        </div>
                      )}

                      {/* PRICE */}

                      <div className="mt-auto border-t border-black/10 pt-2">
                        <div className="flex min-w-0 items-center justify-between gap-1.5">
                          <div className="min-w-0">
                            <p className="text-[9px] leading-3 text-[#6B7280] sm:text-xs sm:leading-4">
                              Starting from
                            </p>

                            <p className="mt-0.5 break-words text-sm font-bold leading-tight text-[#172033] sm:text-xl">
                              {formatPrice(safari.price)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setExpanded(isExpanded ? null : safari.id)
                            }
                            aria-expanded={isExpanded}
                            className="inline-flex min-h-8 shrink-0 items-center gap-0.5 rounded-lg px-1 text-[11px] font-semibold text-[#9F5520] hover:bg-[#F7F5F0] sm:min-h-9 sm:gap-1 sm:px-2 sm:text-sm"
                          >
                            {isExpanded ? "Less" : "Details"}

                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform sm:h-4 sm:w-4 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* ACTIONS */}

                        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_34px_minmax(0,0.82fr)] items-center gap-1 sm:mt-3 sm:grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] sm:gap-2">
                          <Link
                            href={getBookingUrl(safari)}
                            className="inline-flex h-9 min-w-0 items-center justify-center gap-1 rounded-lg bg-[#B96928] px-1 text-[10px] font-bold text-white transition hover:bg-[#9F5520] focus:outline-none focus:ring-2 focus:ring-[#B96928] focus:ring-offset-1 sm:h-11 sm:gap-1.5 sm:px-2.5 sm:text-sm"
                          >
                            <CalendarDays className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />

                            <span className="sm:hidden">Book</span>

                            <span className="hidden sm:inline">
                              Book Safari
                            </span>
                          </Link>

                          <WhatsAppLink
                            number={whatsappNumber}
                            message={getSafariMessage(safari)}
                            label={`WhatsApp enquiry for ${safari.name}`}
                            className="inline-flex h-9 w-[34px] shrink-0 items-center justify-center rounded-lg border border-[#16794B]/30 bg-[#16794B]/5 text-[#126640] transition hover:bg-[#16794B]/10 sm:h-11 sm:w-11"
                          >
                            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                          </WhatsAppLink>

                          <Link
                            href={getEnquiryUrl(safari)}
                            className="inline-flex h-9 min-w-0 items-center justify-center gap-0.5 rounded-lg border border-black/10 bg-white px-1 text-[10px] font-bold text-[#172033] transition hover:bg-[#F7F5F0] focus:outline-none focus:ring-2 focus:ring-[#B96928] focus:ring-offset-1 sm:h-11 sm:gap-1.5 sm:px-2.5 sm:text-sm"
                          >
                            <MessageCircle className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                            <span className="truncate">Enquiry</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* NO ACTIVE SERVICES */}

          {!loading && !loadError && safariOptions.length === 0 && (
            <div className="mt-6 rounded-2xl border border-black/10 bg-white px-5 py-10 text-center">
              <Trees className="mx-auto h-8 w-8 text-[#B96928]" />

              <h3 className="mt-3 text-lg font-bold text-[#172033]">
                No Jeep Safaris Available
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Please contact our team for availability.
              </p>

              <Link
                href="/contact?type=safari"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#B96928] px-5 text-sm font-bold text-white hover:bg-[#9F5520]"
              >
                Contact Us
              </Link>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-[#6B7280]">
            Safari prices and availability are subject to confirmation.
            Official permits and zone access depend on the applicable booking
            process.
          </p>
        </div>
      </section>

      {/* QUICK HELP */}

      <section className="px-4 py-4 sm:px-6 sm:py-8 md:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#172033] px-4 py-6 text-white sm:px-8 sm:py-9">
          <div className="grid gap-5 sm:gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="hidden text-sm font-bold uppercase tracking-wider text-[#E6A76D] sm:block">
                Safari Assistance
              </p>

              <h2 className="text-xl font-bold leading-tight sm:mt-2 sm:text-3xl">
                Need Help Choosing a Jeep Safari?
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
                Share your dates and group size. Our team can help you enquire
                about suitable options.
              </p>

              <WhatsAppLink
                number={whatsappNumber}
                message={customMessage}
                label="Request customised Jeep Safari assistance"
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B96928] px-5 text-sm font-bold text-white transition hover:bg-[#9F5520] sm:mt-5"
              >
                <MessageCircle className="h-4 w-4" />
                Get Safari Assistance
              </WhatsAppLink>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {[
                {
                  title: "Safari Options",
                  description: "Compare available services.",
                  icon: Trees,
                },
                {
                  title: "Group Capacity",
                  description: "Discuss your group requirements.",
                  icon: Users,
                },
                {
                  title: "Booking Support",
                  description: "Ask about the booking process.",
                  icon: ShieldCheck,
                },
                {
                  title: "Quick Enquiry",
                  description: "Connect with our team.",
                  icon: MessageCircle,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/15 bg-white/[0.06] p-3 sm:p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B96928]/20 text-[#F0B77F] sm:h-10 sm:w-10 sm:rounded-xl">
                      <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                    </div>

                    <h3 className="mt-2.5 text-sm font-bold sm:mt-3 sm:text-base">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-white/80 sm:text-sm sm:leading-6">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="px-4 py-6 sm:px-6 sm:py-10 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="hidden text-sm font-bold uppercase tracking-wider text-[#B96928] sm:block">
              Before You Book
            </p>

            <h2 className="text-xl font-bold sm:mt-2 sm:text-3xl">
              Jeep Safari FAQs
            </h2>
          </div>

          <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
            {[
              {
                question: "Are safari permits guaranteed?",
                answer:
                  "No. Permit approval and availability depend on the applicable official booking process and selected dates.",
              },
              {
                question: "Is the displayed price final?",
                answer:
                  "Displayed prices are indicative. Confirm the final price, inclusions, applicable charges and availability with the team.",
              },
              {
                question: "Can I enquire about a particular service?",
                answer:
                  "Yes. Use the Enquiry or WhatsApp button on the service card to contact the team about that service.",
              },
              {
                question: "Can I request help with booking?",
                answer:
                  "Yes. Use Help Me Choose or Get Safari Assistance to discuss your requirements.",
              },
            ].map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="rounded-xl border border-black/10 bg-white px-4 py-1.5 sm:p-5"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex min-h-11 w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-sm font-bold leading-5 text-[#172033] sm:text-base sm:leading-6">
                      {faq.question}
                    </span>

                    <Plus
                      className={`h-5 w-5 shrink-0 text-[#B96928] transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="pb-3 text-sm leading-6 text-[#4B5563] sm:mt-3 sm:pb-0">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="px-4 pb-8 sm:px-6 sm:pb-14 md:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl bg-[#172033] px-4 py-6 text-center text-white sm:px-8 sm:py-10">
          <p className="hidden text-sm font-bold uppercase tracking-wider text-[#E6A76D] sm:block">
            Plan Your Adventure
          </p>

          <h2 className="mx-auto max-w-2xl text-xl font-bold leading-tight sm:mt-2 sm:text-3xl">
            Ready for a Jeep Safari?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
            Tell us your travel dates and group size to discuss available
            services.
          </p>

          <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2.5 sm:mt-6 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3">
            <Link
              href="/contact?type=safari"
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B96928] px-6 text-sm font-bold text-white transition hover:bg-[#9F5520] sm:col-span-1 sm:min-h-12"
            >
              Send an Enquiry
              <ArrowRight className="h-4 w-4" />
            </Link>

            <WhatsAppLink
              number={whatsappNumber}
              message={generalMessage}
              label="Plan your Jeep Safari on WhatsApp"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/20 sm:min-h-12 sm:px-6"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Now
            </WhatsAppLink>

            <a
              href={contactPhone ? `tel:+${contactPhone}` : undefined}
              aria-disabled={!contactPhone}
              onClick={(event) => {
                if (!contactPhone) event.preventDefault();
              }}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 px-4 text-sm font-bold text-white transition hover:bg-white/10 sm:min-h-12 sm:px-6 ${
                !contactPhone ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <PhoneCall className="h-4 w-4" />
              Call Us
            </a>
          </div>

          {!normalisePhoneNumber(whatsappNumber) && (
            <p className="mt-4 text-xs leading-5 text-white/70">
              WhatsApp is not configured. Add the WhatsApp or phone number in
              Organization Profile.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
