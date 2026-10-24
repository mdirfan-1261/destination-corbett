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
  return normalizeSlug(zone?.slug || zone?.name || zone?.title || "");
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

// Jeep / Canter  -> booking page
// Elephant / other -> enquiry page (no booking page exists for them)
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
      canBook: true,
      type: "canter",
    };
  }

  if (rawType.includes("jeep")) {
    return {
      label: "Jeep Safari",
      buttonLabel: "Book Jeep Safari",
      canBook: true,
      type: "jeep",
    };
  }

  if (rawType.includes("elephant")) {
    return {
      label: "Elephant Safari",
      buttonLabel: "Enquire About Elephant Safari",
      canBook: false,
      type: "elephant",
    };
  }

  return {
    label: rawType
      ? rawType.replace(/\b\w/g, (char) => char.toUpperCase())
      : "Not specified",
    buttonLabel: "Enquire About Safari",
    canBook: false,
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

  const fallback = DEFAULT_ZONES.find((item) => item.slug === slug);

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

    duration: zone?.duration || fallback?.duration || "3–4 hrs",

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
    canBook: safariConfig.canBook,
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
    return null;
  }
}

function ZoneHeroImage({ src, alt }) {
  return (
    <Image
      src={src || FALLBACK_IMAGE}
      alt={alt}
      fill
      priority
      quality={75}
      sizes="(max-width: 1023px) 100vw, 700px"
      className="object-cover object-center brightness-110"
    />
  );
}

export default async function SafariZoneDetailPage({ params }) {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlug(rawSlug);

  if (!slug) {
    notFound();
  }

  const zone = await getZoneBySlug(slug);

  if (!zone) {
    notFound();
  }

  const enquiryUrl = `/contact?type=safari&zone=${encodeURIComponent(
    zone.name
  )}&location=${encodeURIComponent(zone.location)}`;

  const bookingUrl = zone.canBook
    ? `/booking?type=safari&service_code=${encodeURIComponent(
        zone.safariType
      )}&zone=${encodeURIComponent(zone.slug)}&zone_name=${encodeURIComponent(
        zone.name
      )}&safari=${encodeURIComponent(
        zone.safari
      )}&image=${encodeURIComponent(zone.image)}`
    : enquiryUrl;

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
      {/* ================= BREADCRUMB ================= */}
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

          <Link
            href="/safari/zones"
            className="text-[#B96928] transition-colors hover:underline"
          >
            Zones
          </Link>

          <span className="text-gray-400">›</span>

          <span
            aria-current="page"
            className="line-clamp-1 font-medium text-[#172033]"
          >
            {zone.name}
          </span>
        </div>
      </nav>

      {/* ================= COMPACT HERO ================= */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
        <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
          {/* Hero Image */}
          <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
            <ZoneHeroImage
              src={zone.image}
              alt={`${zone.name} safari zone`}
            />
          </div>

          {/* Image Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-[45%] hidden w-[15%] bg-gradient-to-r from-[#172033] to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#172033]/55 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 flex h-full items-center px-4 py-4 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl">
                Jim Corbett · Safari Experience
              </div>

              <h1 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                {zone.name}
              </h1>

              <div className="mt-1.5 hidden items-center gap-1.5 text-xs text-white/85 sm:flex">
                <MapPin size={13} className="shrink-0 text-[#E0924F]" />
                <span className="line-clamp-1">{zone.location}</span>
              </div>

              <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
                {zone.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href={bookingUrl}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
                >
                  {zone.bookingLabel}
                  <ArrowRight size={13} />
                </Link>

                {zone.canBook && (
                  <Link
                    href={enquiryUrl}
                    className="hidden items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:inline-flex sm:text-sm"
                  >
                    Make an Enquiry
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DETAILS ================= */}
      <section className="px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-3 sm:gap-4 md:grid-cols-[1.35fr_1fr]">
            {/* MAIN INFO */}
            <article className="rounded-xl border border-black/5 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 md:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B96928] sm:text-xs">
                About the Zone
              </p>

              <h2 className="mt-1.5 text-lg font-bold leading-tight tracking-tight text-[#172033] sm:text-xl md:text-2xl">
                Explore {zone.name}
              </h2>

              <p className="mt-2 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
                {zone.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                <div className="rounded-lg bg-[#F7F5F0] p-2.5 sm:rounded-xl sm:p-3">
                  <div className="flex items-center gap-1.5">
                    <Clock3
                      size={15}
                      className="shrink-0 text-[#B96928]"
                    />
                    <span className="text-[11px] font-semibold text-[#172033] sm:text-xs">
                      Duration
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs font-bold text-[#172033] sm:text-sm">
                    {zone.duration}
                  </p>
                </div>

                <div className="rounded-lg bg-[#F7F5F0] p-2.5 sm:rounded-xl sm:p-3">
                  <div className="flex items-center gap-1.5">
                    <Trees
                      size={15}
                      className="shrink-0 text-[#B96928]"
                    />
                    <span className="text-[11px] font-semibold text-[#172033] sm:text-xs">
                      Safari Type
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs font-bold text-[#172033] sm:text-sm">
                    {zone.safari}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-gray-100 p-2.5 sm:rounded-xl sm:p-3">
                <div className="flex items-start gap-2.5">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-[#B96928]"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#172033] sm:text-sm">
                      Safari Zone Location
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-gray-600 sm:text-sm">
                      {zone.location}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={enquiryUrl}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#B96928] px-4 text-xs font-bold text-[#B96928] transition hover:bg-[#B96928] hover:text-white sm:text-sm"
              >
                Ask About This Zone
                <ArrowRight size={15} />
              </Link>
            </article>

            {/* HIGHLIGHTS */}
            <aside className="rounded-xl bg-[#18352A] p-4 text-white shadow-sm sm:rounded-2xl sm:p-5 md:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E4AD70] sm:text-xs">
                Zone Highlights
              </p>

              <h2 className="mt-1.5 text-lg font-bold leading-tight tracking-tight sm:text-xl md:text-2xl">
                What You Can Explore
              </h2>

              <div className="mt-4 space-y-2.5 sm:space-y-3">
                {zone.highlights.map((highlight, index) => (
                  <div
                    key={`${highlight}-${index}`}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#E4AD70]"
                    />

                    <span className="text-xs leading-5 text-white/90 sm:text-sm">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={bookingUrl}
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#B96928] px-4 text-xs font-bold text-white transition hover:bg-[#9D5721] sm:text-sm"
              >
                {zone.bookingLabel}
                <ArrowRight size={15} />
              </Link>

              <p className="mt-3 text-[11px] leading-4 text-white/65 sm:text-xs sm:leading-5">
                Contact our team to confirm availability and booking details.
              </p>
            </aside>
          </div>

          {/* BACK TO ZONES */}
          <div className="mt-4 sm:mt-5">
            <Link
              href="/safari/zones"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#172033] transition hover:text-[#B96928] sm:text-sm"
            >
              <ArrowLeft size={15} />
              Back to All Safari Zones
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}