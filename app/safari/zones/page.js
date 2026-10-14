
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
} from "lucide-react";

const SERVER_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_BASE = SERVER_URL.endsWith("/api")
  ? SERVER_URL
  : `${SERVER_URL}/api`;

const DEFAULT_ZONES = [
  {
    id: "default-dhikala",
    name: "Dhikala Zone",
    slug: "dhikala",
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/dhikala-zone1.webp",
    description:
      "One of Corbett's popular safari zones, known for its forest landscapes, wildlife experience and natural surroundings.",
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
      "A scenic forest zone offering a memorable wildlife experience with dense forests and open grassland areas.",
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
      "A beautiful safari zone with diverse landscapes and opportunities to experience Corbett's natural wilderness.",
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
      "Known for its peaceful forest environment, Dhela offers an exciting safari experience surrounded by nature.",
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
      "A serene forest area offering a relaxed wildlife experience away from the busier tourist zones.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
  },
];

const HERO_IMAGE = "/safari/zones/zones-hero.webp";

function createSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getZoneId(zone) {
  return String(zone?._id || zone?.id || "");
}

function getZoneSlug(zone) {
  return createSlug(zone?.slug || zone?.name || "");
}

function getZoneDetailUrl(zone) {
  const slug = getZoneSlug(zone);

  if (!slug) {
    return "/safari/zones";
  }

  return `/safari/zones/${encodeURIComponent(slug)}`;
}

function getImageUrl(image) {
  if (!image || typeof image !== "string") {
    return "";
  }

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
      zone?.location ||
      zone?.area ||
      fallback?.location ||
      "Jim Corbett",

    image:
      getImageUrl(
        zone?.image || zone?.imageUrl || zone?.image_url
      ) ||
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

    // Keep the actual status from the API.
    status: String(zone?.status || "").trim().toLowerCase(),

    isDeleted: zone?.isDeleted === true,
    deletedAt: zone?.deletedAt ?? null,
  };
}

/*
 * IMPORTANT:
 * Do not merge DEFAULT_ZONES into API results.
 * That would make inactive zones visible again.
 */
function mapActiveZones(apiZones) {
  return apiZones
    .filter((zone) => {
      const status = String(zone?.status || "")
        .trim()
        .toLowerCase();

      return (
        status === "active" &&
        zone?.isDeleted !== true &&
        zone?.deletedAt == null
      );
    })
    .map((zone, index) => normalizeZone(zone, index));
}

export default function SafariZonesPage() {
  // Start empty. Do not show hardcoded zones while the API loads.
  const [zones, setZones] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadZones = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await fetch(
        `${API_BASE}/public/safari/zones`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Safari zones API returned ${response.status}`
        );
      }

      if (!result || result.success === false) {
        throw new Error(
          result?.message || "Unable to load safari zones."
        );
      }

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.zones)
            ? result.zones
            : null;

      if (!data) {
        throw new Error(
          "Invalid API response. Expected a list of safari zones."
        );
      }

      // Only zones explicitly marked active can be displayed.
      const activeZones = mapActiveZones(data);

      setZones(activeZones);
    } catch (error) {
      console.error("Safari zones loading error:", error);

      // Never fall back to DEFAULT_ZONES after an API error.
      setZones([]);

      setLoadError(
        "Safari zone information could not be loaded. Please retry."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadZones();
  }, [loadZones]);

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">
          <div className="relative h-[300px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[560px]">
            <Image
              src={HERO_IMAGE}
              alt="Jim Corbett Safari Zones"
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
                <p className="mb-2 text-[9px] font-semibold tracking-[0.18em] text-[#C88A3D] sm:mb-3 sm:text-xs">
                  JIM CORBETT SAFARI
                </p>

                <h1 className="text-[27px] font-bold leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl">
                  Explore Corbett Safari Zones
                </h1>

                <p className="mt-3 max-w-xl text-[11px] leading-[1.55] text-white/85 sm:mt-5 sm:text-sm sm:leading-6 md:text-base">
                  Discover the different safari zones of Jim
                  Corbett and explore their landscapes,
                  surroundings and wildlife experience.
                </p>

                <div className="mt-5 flex flex-row gap-2 sm:mt-7 sm:gap-3">
                  <Link
                    href="#zones"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-3 text-[10px] font-semibold text-white transition hover:bg-[#9D5721] sm:h-11 sm:px-5 sm:text-xs"
                  >
                    Explore Zones
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    href="/contact?type=safari"
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-white/60 bg-white/10 px-3 text-[10px] font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#172033] sm:h-11 sm:px-5 sm:text-xs"
                  >
                    Make an Enquiry
                  </Link>
                </div>

                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
                  <div className="rounded-lg border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-3">
                    <p className="text-[9px] font-semibold sm:text-xs">
                      Multiple
                    </p>
                    <p className="mt-0.5 text-[8px] text-white/70 sm:text-[10px]">
                      Safari Zones
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-3">
                    <p className="text-[9px] font-semibold sm:text-xs">
                      Wildlife
                    </p>
                    <p className="mt-0.5 text-[8px] text-white/70 sm:text-[10px]">
                      Experience
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-3">
                    <p className="text-[9px] font-semibold sm:text-xs">
                      Easy
                    </p>
                    <p className="mt-0.5 text-[8px] text-white/70 sm:text-[10px]">
                      Enquiry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZONES */}
      <section
        id="zones"
        className="bg-[#F7F5F0] py-7 sm:py-10 md:py-12"
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="mb-5 max-w-3xl sm:mb-8">
            <p className="text-[9px] font-semibold tracking-[0.16em] text-[#B96928] sm:text-xs">
              CHOOSE YOUR ZONE
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#172033] sm:mt-2 sm:text-3xl">
              Safari Zones in Jim Corbett
            </h2>

            <p className="mt-2 text-[10px] leading-5 text-gray-600 sm:mt-3 sm:text-sm sm:leading-6">
              Explore the available safari zones and learn more
              about each area before planning your safari.
            </p>
          </div>

          {/* LOADING */}
          {isLoading && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-black/10 bg-white p-5 text-sm text-gray-600"
            >
              <RefreshCw size={16} className="animate-spin" />
              Loading safari zones...
            </div>
          )}

          {/* ERROR */}
          {!isLoading && loadError && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
            >
              <p>{loadError}</p>

              <button
                type="button"
                onClick={loadZones}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#B96928] px-4 font-semibold text-white hover:bg-[#9D5721]"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          )}

          {/* NO ACTIVE ZONES */}
          {!isLoading && !loadError && zones.length === 0 && (
            <div className="rounded-2xl border border-black/10 bg-white px-5 py-10 text-center">
              <Trees className="mx-auto h-8 w-8 text-[#B96928]" />

              <h3 className="mt-3 text-lg font-bold text-[#172033]">
                No Safari Zones Available
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                There are currently no active safari zones. Please contact
                our team for assistance.
              </p>

              <Link
                href="/contact?type=safari"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#B96928] px-5 text-sm font-bold text-white hover:bg-[#9D5721]"
              >
                Make an Enquiry
              </Link>
            </div>
          )}

          {/* ACTIVE ZONES ONLY */}
          {!isLoading && !loadError && zones.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">
              {zones.map((zone) => {
                const zoneSlug = getZoneSlug(zone);
                const detailUrl = getZoneDetailUrl(zone);

                return (
                  <div
                    key={zone.id || zoneSlug}
                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:rounded-2xl"
                  >
                    <div className="relative h-[125px] overflow-hidden sm:h-[180px] md:h-[195px]">
                      <Image
                        src={zone.image || DEFAULT_ZONES[0].image}
                        alt={zone.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[8px] font-semibold text-[#172033] backdrop-blur-sm sm:px-2.5 sm:py-1.5 sm:text-[10px]">
                          <Trees
                            size={11}
                            className="text-[#B96928]"
                          />
                          Safari Zone
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-4">
                      <h3 className="text-sm font-bold leading-tight text-[#172033] sm:text-lg">
                        {zone.name}
                      </h3>

                      <div className="mt-1 flex items-start gap-1 text-[8px] text-[#B96928] sm:text-[10px]">
                        <MapPin
                          size={11}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{zone.location}</span>
                      </div>

                      <p className="mt-2 line-clamp-3 text-[9px] leading-[1.5] text-gray-600 sm:mt-3 sm:text-xs sm:leading-5">
                        {zone.description}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between gap-1 border-t border-gray-100 pt-2.5 sm:mt-4 sm:pt-3">
                        <div className="flex items-center gap-1 text-[8px] text-gray-500 sm:text-[10px]">
                          <Clock3
                            size={11}
                            className="shrink-0 text-[#B96928]"
                          />
                          {zone.duration}
                        </div>

                        <div className="text-right text-[8px] font-medium text-gray-500 sm:text-[10px]">
                          {zone.safari}
                        </div>
                      </div>

                      <div className="mt-2.5 sm:mt-4">
                        <Link
                          href={detailUrl}
                          className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-[#172033] px-2 text-[9px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white sm:h-10 sm:gap-1.5 sm:px-3 sm:text-xs"
                        >
                          Explore Zone
                          <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
