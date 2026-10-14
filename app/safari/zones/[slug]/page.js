
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  MapPin,
  Trees,
  CheckCircle2,
} from "lucide-react";
import { notFound } from "next/navigation";

const SERVER_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_BASE = SERVER_URL.endsWith("/api")
  ? SERVER_URL
  : `${SERVER_URL}/api`;

const FALLBACK_IMAGE = "/safari/zones/dhikala-zone1.webp";

const DEFAULT_ZONES = [
  {
    name: "Dhikala Zone",
    slug: "dhikala",
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/dhikala-zone1.webp",
    description:
      "One of Corbett's popular safari zones, known for its forest landscapes, wildlife experience and natural surroundings.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
    highlights: [
      "Forest landscapes",
      "Wildlife experience",
      "Natural surroundings",
      "Jeep safari experience",
    ],
  },
  {
    name: "Bijrani Zone",
    slug: "bijrani",
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/bijrani-zone.webp",
    description:
      "A scenic forest zone offering a memorable wildlife experience with dense forests and open grassland areas.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
    highlights: [
      "Dense forest areas",
      "Open grasslands",
      "Scenic surroundings",
      "Wildlife experience",
    ],
  },
  {
    name: "Jhirna Zone",
    slug: "jhirna",
    location: "Jim Corbett National Park",
    image: "/safari/zones/jhirna-zone.webp",
    description:
      "A beautiful safari zone with diverse landscapes and opportunities to experience Corbett's natural wilderness.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
    highlights: [
      "Diverse landscapes",
      "Natural wilderness",
      "Forest surroundings",
      "Jeep safari experience",
    ],
  },
  {
    name: "Dhela Zone",
    slug: "dhela",
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/dhela-zone.webp",
    description:
      "Known for its peaceful forest environment, Dhela offers an exciting safari experience surrounded by nature.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
    highlights: [
      "Peaceful forest environment",
      "Natural surroundings",
      "Wildlife experience",
      "Jeep safari experience",
    ],
  },
  {
    name: "Sitabani Zone",
    slug: "sitabani",
    location: "Sitabani, Corbett",
    image: "/safari/zones/sitabani-zone.webp",
    description:
      "A serene forest area offering a relaxed wildlife experience away from the busier tourist zones.",
    safari: "Jeep Safari",
    duration: "3–4 hrs",
    highlights: [
      "Serene forest area",
      "Natural surroundings",
      "Wildlife experience",
      "Jeep safari experience",
    ],
  },
];

function normalizeSlug(value = "") {
  return String(value)
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getZoneSlug(zone) {
  return normalizeSlug(
    zone?.slug || zone?.name || zone?.title || ""
  );
}

function getImageUrl(image) {
  if (!image || typeof image !== "string") {
    return FALLBACK_IMAGE;
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

function getSafariConfig(zone) {
  const rawType = String(
    zone?.safariType ||
      zone?.safari_type ||
      zone?.safari ||
      zone?.safariName ||
      zone?.type ||
      ""
  )
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (rawType.includes("canter")) {
    return {
      label: "Canter Safari",
      buttonLabel: "Book Canter Safari",
      path: "/safari/canter",
      type: "canter",
    };
  }

  if (rawType.includes("elephant")) {
    return {
      label: "Elephant Safari",
      buttonLabel: "Book Elephant Safari",
      path: "/safari/elephant",
      type: "elephant",
    };
  }

  if (rawType.includes("jeep")) {
    return {
      label: "Jeep Safari",
      buttonLabel: "Book Jeep Safari",
      path: "/safari/jeep",
      type: "jeep",
    };
  }

  return {
    label: rawType
      ? rawType.replace(/\b\w/g, (char) => char.toUpperCase())
      : "Not specified",
    buttonLabel: "Enquire About Safari",
    path: null,
    type: "other",
  };
}

function getHighlights(zone, slug) {
  if (Array.isArray(zone?.highlights) && zone.highlights.length > 0) {
    return zone.highlights
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.title || item?.name || ""
      )
      .filter(Boolean);
  }

  const fallback = DEFAULT_ZONES.find(
    (item) => item.slug === slug
  );

  return (
    fallback?.highlights || [
      "Explore natural surroundings",
      "Discover the local landscape",
      "Experience the wilderness",
    ]
  );
}

function normalizeZone(zone, requestedSlug) {
  const actualSlug = requestedSlug || getZoneSlug(zone);

  const fallback = DEFAULT_ZONES.find(
    (item) => item.slug === actualSlug
  );

  const normalized = {
    ...fallback,
    ...zone,

    name:
      zone?.name ||
      zone?.title ||
      fallback?.name ||
      "Safari Zone",

    slug: actualSlug,

    location:
      zone?.location ||
      zone?.area ||
      fallback?.location ||
      "Jim Corbett",

    image: getImageUrl(
      zone?.image ||
        zone?.imageUrl ||
        zone?.image_url ||
        fallback?.image
    ),

    description:
      zone?.description ||
      fallback?.description ||
      "Contact our team to learn more about this safari zone and plan your visit.",

    duration:
      zone?.duration ||
      fallback?.duration ||
      "3–4 hrs",

    highlights: getHighlights(zone, actualSlug),
  };

  const safariConfig = getSafariConfig({
    ...fallback,
    ...zone,
    safari:
      zone?.safari ||
      zone?.safariType ||
      zone?.safari_type ||
      fallback?.safari,
  });

  return {
    ...normalized,
    safari: safariConfig.label,
    safariType: safariConfig.type,
    bookingPath: safariConfig.path,
    bookingLabel: safariConfig.buttonLabel,
  };
}

function extractZones(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.zones)) return result.zones;
  if (Array.isArray(result?.data?.zones)) return result.data.zones;
  if (Array.isArray(result?.data?.data)) return result.data.data;

  return [];
}

async function getZoneBySlug(slug) {
  try {
    const response = await fetch(
      `${API_BASE}/public/safari/zones`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Public safari zones API returned:",
        response.status
      );

      return null;
    }

    const result = await response.json();

    if (!result || result.success === false) {
      return null;
    }

    const apiZones = extractZones(result);

    // Match the requested zone, but never use an inactive record.
    const apiZone = apiZones.find((item) => {
      const itemSlug = getZoneSlug(item);

      const status = String(item?.status || "")
        .trim()
        .toLowerCase();

      return (
        itemSlug === slug &&
        status === "active" &&
        item?.isDeleted !== true &&
        item?.deletedAt == null
      );
    });

    if (!apiZone) {
      return null;
    }

    return normalizeZone(apiZone, slug);
  } catch (error) {
    console.error("Failed to fetch safari zones:", error);

    // Do not serve hardcoded zones if the API is unavailable.
    return null;
  }
}

export default async function SafariZoneDetailPage({ params }) {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlug(rawSlug);

  if (!slug) {
    notFound();
  }

  const zone = await getZoneBySlug(slug);

  // Inactive, deleted, missing or unavailable zone -> 404.
  if (!zone) {
    notFound();
  }

  const enquiryUrl = `/contact?type=safari&zone=${encodeURIComponent(
    zone.name
  )}`;

  const bookingUrl = zone.bookingPath
    ? `${zone.bookingPath}?zone=${encodeURIComponent(zone.slug)}`
    : enquiryUrl;

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">
          <div className="relative h-[340px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[500px]">
            <Image
              src={zone.image}
              alt={`${zone.name} safari zone`}
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#172033]/55 to-transparent" />

            <div className="relative z-10 flex h-full items-center px-5 sm:px-8 md:px-12 lg:px-16">
              <div className="max-w-2xl">
                <Link
                  href="/safari/zones"
                  className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/85 transition hover:text-white sm:text-sm"
                >
                  <ArrowLeft size={15} />
                  All Safari Zones
                </Link>

                <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-[#C88A3D] sm:text-xs">
                  JIM CORBETT SAFARI
                </p>

                <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  {zone.name}
                </h1>

                <div className="mt-4 flex items-center gap-2 text-xs text-white/85 sm:text-sm">
                  <MapPin
                    size={16}
                    className="shrink-0 text-[#C88A3D]"
                  />
                  <span>{zone.location}</span>
                </div>

                <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 sm:mt-5 sm:text-base">
                  {zone.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3 sm:mt-7">
                  <Link
                    href={bookingUrl}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#9D5721] sm:px-5 sm:text-sm"
                  >
                    {zone.bookingLabel}
                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    href={enquiryUrl}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/60 bg-white/10 px-4 py-3 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#172033] sm:px-5 sm:text-sm"
                  >
                    Make an Enquiry
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="bg-[#F7F5F0] py-8 sm:py-10 md:py-12">
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div className="grid gap-5 md:grid-cols-[1.4fr_1fr] md:gap-6">
            {/* MAIN INFO */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7 md:p-8">
              <p className="text-[10px] font-bold tracking-[0.16em] text-[#B96928] sm:text-xs">
                ABOUT THE ZONE
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#172033] sm:text-3xl">
                Explore {zone.name}
              </h2>

              <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                {zone.description}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#F7F5F0] p-4">
                  <div className="flex items-center gap-2">
                    <Clock3 size={18} className="text-[#B96928]" />
                    <span className="text-sm font-semibold text-[#172033]">
                      Duration
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-[#172033]">
                    {zone.duration}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F7F5F0] p-4">
                  <div className="flex items-center gap-2">
                    <Trees size={18} className="text-[#B96928]" />
                    <span className="text-sm font-semibold text-[#172033]">
                      Safari Type
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-[#172033]">
                    {zone.safari}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[#B96928]"
                  />

                  <div>
                    <p className="text-sm font-bold text-[#172033]">
                      Safari Zone Location
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {zone.location}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={enquiryUrl}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#B96928] px-4 py-3 text-sm font-bold text-[#B96928] transition hover:bg-[#B96928] hover:text-white"
              >
                Ask About This Zone
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* HIGHLIGHTS */}
            <div className="rounded-2xl bg-[#18352A] p-5 text-white shadow-sm sm:p-7 md:p-8">
              <p className="text-[10px] font-bold tracking-[0.16em] text-[#C88A3D] sm:text-xs">
                ZONE HIGHLIGHTS
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                What You Can Explore
              </h2>

              <div className="mt-6 space-y-4">
                {zone.highlights.map((highlight, index) => (
                  <div
                    key={`${highlight}-${index}`}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-[#C88A3D]"
                    />

                    <span className="text-sm leading-6 text-white/90">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={bookingUrl}
                className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#9D5721]"
              >
                {zone.bookingLabel}
                <ArrowRight size={16} />
              </Link>

              <p className="mt-3 text-xs leading-5 text-white/65">
                Contact our team to confirm availability and booking details.
              </p>
            </div>
          </div>

          {/* BACK */}
          <div className="mt-6 sm:mt-8">
            <Link
              href="/safari/zones"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#172033] transition hover:text-[#B96928]"
            >
              <ArrowLeft size={16} />
              Back to All Safari Zones
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
