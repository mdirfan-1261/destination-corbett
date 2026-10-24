
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  MapPin,
  Trees,
  ArrowRight,
  Clock3,
  RefreshCw,
  ChevronRight,
  Compass,
  Leaf,
  CalendarDays,
} from "lucide-react";

const SERVER_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_BASE = SERVER_URL.endsWith("/api")
  ? SERVER_URL
  : `${SERVER_URL}/api`;

const HERO_IMAGE = "/safari/zones/zones-hero.webp";

const DEFAULT_ZONES = [
  {
    id: "default-dhikala",
    name: "Dhikala Zone",
    slug: "dhikala",
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/dhikala-zone1.webp",
    description:
      "Discover forest landscapes, grasslands and the natural wilderness of Corbett.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
  },
  {
    id: "default-bijrani",
    name: "Bijrani Zone",
    slug: "bijrani",
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/bijrani-zone.webp",
    description:
      "Explore scenic forest trails and open grasslands in this popular safari zone.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
  },
  {
    id: "default-jhirna",
    name: "Jhirna Zone",
    slug: "jhirna",
    location: "Jim Corbett National Park",
    image: "/safari/zones/jhirna-zone.webp",
    description:
      "Experience Corbett's diverse natural landscapes and peaceful forest surroundings.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
  },
  {
    id: "default-dhela",
    name: "Dhela Zone",
    slug: "dhela",
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/dhela-zone.webp",
    description:
      "Discover a quieter forest environment surrounded by Corbett's natural beauty.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
  },
  {
    id: "default-sitabani",
    name: "Sitabani Zone",
    slug: "sitabani",
    location: "Sitabani, Corbett",
    image: "/safari/zones/sitabani-zone.webp",
    description:
      "Explore serene woodland landscapes and enjoy a peaceful nature experience.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
  },
];

function createSlug(value = "") {
  return String(value)
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getZoneId(zone) {
  return String(zone?._id || zone?.id || "");
}

function getZoneSlug(zone) {
  return createSlug(zone?.slug || zone?.name || zone?.title || "");
}

function getZoneDetailUrl(zone) {
  const slug = getZoneSlug(zone);
  return slug ? `/safari/zones/${encodeURIComponent(slug)}` : "/safari/zones";
}

function getImageUrl(image) {
  if (!image || typeof image !== "string") return "";

  const value = image.trim();

  if (
    value.startsWith("https://") ||
    value.startsWith("http://") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return `/${value}`;
}

function normalizeZone(zone, index = 0) {
  const name = String(zone?.name || zone?.title || "").trim();
  const slug = createSlug(zone?.slug) || createSlug(name);

  const fallback = DEFAULT_ZONES.find(
    (item) => item.slug === slug || item.slug === createSlug(name)
  );

  return {
    id: getZoneId(zone) || `api-zone-${slug || index}`,
    name: name || fallback?.name || "Safari Zone",
    slug: slug || `zone-${index + 1}`,
    location:
      zone?.location || zone?.area || fallback?.location || "Jim Corbett",
    image:
      getImageUrl(zone?.image || zone?.imageUrl || zone?.image_url) ||
      fallback?.image ||
      DEFAULT_ZONES[0].image,
    description:
      zone?.description ||
      fallback?.description ||
      "Explore this safari zone in Jim Corbett.",
    safari:
      zone?.safari ||
      zone?.safariType ||
      zone?.safari_type ||
      fallback?.safari ||
      "Jeep Safari",
    duration: zone?.duration || fallback?.duration || "3–4 hrs",
    status: String(zone?.status || "").trim().toLowerCase(),
    isDeleted: zone?.isDeleted === true,
    deletedAt: zone?.deletedAt ?? null,
  };
}

function mapActiveZones(apiZones) {
  return apiZones
    .filter((zone) => {
      const status = String(zone?.status || "").trim().toLowerCase();

      return (
        status === "active" &&
        zone?.isDeleted !== true &&
        zone?.deletedAt == null
      );
    })
    .map((zone, index) => normalizeZone(zone, index));
}

function ZoneImage({ src, alt }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!src || imageFailed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#E9E4DA]">
        <Trees className="h-9 w-9 text-[#B96928]/70" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setImageFailed(true)}
    />
  );
}

function ZoneCard({ zone }) {
  const detailUrl = getZoneDetailUrl(zone);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#172033]/[0.08] bg-white shadow-[0_3px_14px_rgba(23,32,51,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(23,32,51,0.10)]">
      <Link
        href={detailUrl}
        aria-label={`Explore ${zone.name}`}
        className="relative block h-[175px] overflow-hidden bg-[#E9E4DA] sm:h-[190px] lg:h-[200px]"
      >
        <ZoneImage src={zone.image} alt={zone.name} />

        <div className="absolute inset-0 bg-gradient-to-t from-[#101827]/75 via-transparent to-[#101827]/10" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-bold text-[#172033] shadow-sm">
          <Trees size={12} className="text-[#B96928]" />
          Safari Zone
        </span>

        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-[11px] font-medium text-white">
          <MapPin size={13} className="shrink-0 text-[#F0BD83]" />
          <span className="line-clamp-1">{zone.location}</span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-bold tracking-tight text-[#172033] sm:text-lg">
          {zone.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-gray-600 sm:text-[13px]">
          {zone.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7F5F0] px-2.5 py-2 text-[10px] font-semibold text-[#172033] sm:text-[11px]">
            <Clock3 size={13} className="text-[#B96928]" />
            {zone.duration}
          </span>

          <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#F7F5F0] px-2.5 py-2 text-[10px] font-semibold text-[#172033] sm:text-[11px]">
            <Compass size={13} className="shrink-0 text-[#B96928]" />
            <span className="truncate">{zone.safari}</span>
          </span>
        </div>

        <Link
          href={detailUrl}
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#172033] px-3 text-xs font-bold text-white transition hover:bg-[#B96928] sm:text-sm"
        >
          Explore Zone
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}

function LoadingCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-black/5 bg-white"
        >
          <div className="h-[175px] animate-pulse bg-[#E9E4DA] sm:h-[190px]" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
            <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SafariZonesPage() {
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadZones = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await fetch(`${API_BASE}/public/safari/zones`, {
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || `Safari zones API returned ${response.status}`
        );
      }

      if (!result || result.success === false) {
        throw new Error(result?.message || "Unable to load safari zones.");
      }

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.zones)
            ? result.zones
            : Array.isArray(result?.data?.zones)
              ? result.data.zones
              : null;

      if (!data) {
        throw new Error("Invalid API response. Expected a list of safari zones.");
      }

      setZones(mapActiveZones(data));
    } catch (error) {
      console.error("Safari zones loading error:", error);
      setZones([]);
      setLoadError("Safari zone information could not be loaded. Please retry.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadZones();
  }, [loadZones]);

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-4 pb-1 pt-3 sm:px-6 sm:pt-4"
      >
        <div className="flex items-center gap-1.5 overflow-hidden text-[11px] text-gray-500 sm:text-xs">
          <Link href="/" className="shrink-0 transition hover:text-[#B96928]">
            Home
          </Link>
          <ChevronRight size={13} className="shrink-0" />
          <Link
            href="/safari"
            className="shrink-0 transition hover:text-[#B96928]"
          >
            Safari
          </Link>
          <ChevronRight size={13} className="shrink-0" />
          <span className="truncate font-semibold text-[#172033]">
            Safari Zones
          </span>
        </div>
      </nav>

      {/* COMPACT HERO — MATCHING STAY PAGE SPACING */}
      {/* ================= COMPACT HERO ================= */}
<section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
  <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
    {/* Hero Image */}
    <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
      <Image
        src={HERO_IMAGE}
        alt="Explore Jim Corbett Safari Zones"
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
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl">
          <Compass className="h-3 w-3 text-[#E0924F]" />
          Jim Corbett National Park
        </div>

        <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Explore Corbett{" "}
          <span className="text-[#E0924F]">Safari Zones</span>
        </h1>

        <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
          Find your safari zone and explore Corbett&apos;s natural wilderness.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href="#zones"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
          >
            Explore Zones
            <ArrowRight size={13} />
          </Link>

          <Link
            href="/contact?type=safari"
            className="hidden items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:inline-flex sm:text-sm"
          >
            Make an Enquiry
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ZONE LISTING */}
      <section id="zones" className="scroll-mt-5 py-5 sm:py-7 lg:py-8">
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-[10px] font-bold tracking-[0.16em] text-[#B96928]">
                FIND YOUR EXPERIENCE
              </p>

              <h2 className="mt-1.5 text-xl font-black tracking-tight text-[#172033] sm:text-2xl lg:text-3xl">
                Safari Zones in Jim Corbett
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-gray-600 sm:text-sm">
                Explore available zones and choose the right safari experience.
              </p>
            </div>

            {!isLoading && !loadError && zones.length > 0 && (
              <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#B96928]/20 bg-white px-3 py-2 text-xs font-semibold text-[#172033] shadow-sm">
                <Trees size={14} className="text-[#B96928]" />
                {zones.length} {zones.length === 1 ? "Zone" : "Zones"} Available
              </div>
            )}
          </div>

          {isLoading && <LoadingCards />}

          {!isLoading && loadError && (
            <div
              role="alert"
              className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6"
            >
              <div>
                <h3 className="text-base font-bold text-[#172033]">
                  Unable to load safari zones
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-gray-600 sm:text-sm">
                  {loadError}
                </p>
              </div>

              <button
                type="button"
                onClick={loadZones}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 text-xs font-bold text-white transition hover:bg-[#9D5721] sm:text-sm"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !loadError && zones.length === 0 && (
            <div className="rounded-2xl border border-black/5 bg-white px-5 py-9 text-center shadow-sm sm:py-11">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B96928]/10">
                <Trees className="h-7 w-7 text-[#B96928]" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#172033]">
                No Safari Zones Available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-600 sm:text-sm">
                There are currently no active safari zones. Contact our team
                for help planning your visit.
              </p>

              <Link
                href="/contact?type=safari"
                className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 text-xs font-bold text-white transition hover:bg-[#9D5721] sm:text-sm"
              >
                Make an Enquiry
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {!isLoading && !loadError && zones.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {zones.map((zone) => (
                <ZoneCard key={zone.id || zone.slug} zone={zone} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM ENQUIRY CTA */}
      {!isLoading && !loadError && zones.length > 0 && (
        <section className="px-3 pb-7 sm:px-6 sm:pb-9">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 overflow-hidden rounded-2xl bg-[#172033] px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
            <div className="flex items-start gap-3">
              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 sm:flex">
                <CalendarDays size={21} className="text-[#F0BD83]" />
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-[#F0BD83]">
                  PLAN YOUR SAFARI
                </p>
                <h2 className="mt-1.5 text-base font-bold sm:text-xl">
                  Need help choosing a zone?
                </h2>
                <p className="mt-1 text-xs leading-5 text-white/70 sm:text-sm">
                  Contact our team for help planning your Corbett experience.
                </p>
              </div>
            </div>

            <Link
              href="/contact?type=safari"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 text-xs font-bold text-white transition hover:bg-[#9D5721] sm:text-sm"
            >
              Enquire Now
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
