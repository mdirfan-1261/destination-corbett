
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

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

// Existing UI metadata: images, locations and highlights remain unchanged.
const zoneDefaults = {
  dhikala: {
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/dhikala-zone1.webp",
    description:
      "One of Corbett's popular safari zones, known for its forest landscapes, wildlife experience and natural surroundings.",
    duration: "3–4 hrs",
    safari: "Jeep Safari",
    highlights: [
      "Forest landscapes",
      "Wildlife experience",
      "Natural surroundings",
      "Jeep safari experience",
    ],
  },
  bijrani: {
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/bijrani-zone.webp",
    description:
      "A scenic forest zone offering a memorable wildlife experience with dense forests and open grassland areas.",
    duration: "3–4 hrs",
    safari: "Jeep Safari",
    highlights: [
      "Dense forest areas",
      "Open grasslands",
      "Scenic surroundings",
      "Wildlife experience",
    ],
  },
  jhirna: {
    location: "Jim Corbett National Park",
    image: "/safari/zones/jhirna-zone.webp",
    description:
      "A beautiful safari zone with diverse landscapes and opportunities to experience Corbett's natural wilderness.",
    duration: "3–4 hrs",
    safari: "Jeep Safari",
    highlights: [
      "Diverse landscapes",
      "Natural wilderness",
      "Forest surroundings",
      "Jeep safari experience",
    ],
  },
  dhela: {
    location: "Ramnagar, Jim Corbett",
    image: "/safari/zones/dhela-zone.webp",
    description:
      "Known for its peaceful forest environment, Dhela offers an exciting safari experience surrounded by nature.",
    duration: "3–4 hrs",
    safari: "Jeep Safari",
    highlights: [
      "Peaceful forest environment",
      "Natural surroundings",
      "Wildlife experience",
      "Jeep safari experience",
    ],
  },
  sitabani: {
    location: "Sitabani, Corbett",
    image: "/safari/zones/sitabani-zone.webp",
    description:
      "A serene forest area offering a relaxed wildlife experience away from the busier tourist zones.",
    duration: "3–4 hrs",
    safari: "Jeep Safari",
    highlights: [
      "Serene forest area",
      "Relaxed wildlife experience",
      "Natural surroundings",
      "Jeep safari experience",
    ],
  },
};

const normalizeSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function getZoneBySlug(slug) {
  try {
    const response = await fetch(
      `${API_BASE}/api/public/safari/zones`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error(
        "Public safari zones API returned:",
        response.status
      );
      return null;
    }

    const result = await response.json();
    const zones = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];

    const match = zones.find(
      (item) => normalizeSlug(item.name) === slug
    );

    return match || null;
  } catch (error) {
    console.error("Failed to fetch public safari zones:", error);
    return null;
  }
}

function NotFoundContent() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F5F0] px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#172033] sm:text-4xl">
          Safari Zone Not Found
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          This safari zone does not exist or is currently unavailable.
        </p>

        <Link
          href="/safari/zones"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#B96928] px-5 text-sm font-semibold text-white transition hover:bg-[#A65D24]"
        >
          <ArrowLeft size={15} />
          Back to Safari Zones
        </Link>
      </div>
    </main>
  );
}

export default async function SafariZoneDetailPage({ params }) {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlug(rawSlug);

  const defaultZone = zoneDefaults[slug];
  const apiZone = await getZoneBySlug(slug);

  // Do not show stale hardcoded descriptions when the API fails.
  if (!apiZone || apiZone.status !== "active") {
    return <NotFoundContent />;
  }

  const zone = {
    name: apiZone.name,
    location: defaultZone?.location || "Jim Corbett",
    image: defaultZone?.image || "/safari/zones/dhikala-zone1.webp",
    description:
      typeof apiZone.description === "string"
        ? apiZone.description
        : "",
    duration: defaultZone?.duration || "3–4 hrs",
    safari: defaultZone?.safari || "Jeep Safari",
    highlights: defaultZone?.highlights || [
      "Explore natural surroundings",
      "Discover the local landscape",
      "Plan your safari",
    ],
  };

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">
          <div className="relative h-[300px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[500px]">
            <Image
              src={zone.image}
              alt={zone.name}
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
                  className="mb-4 inline-flex items-center gap-1.5 text-[10px] font-medium text-white/80 transition hover:text-white sm:text-xs"
                >
                  <ArrowLeft size={13} />
                  All Safari Zones
                </Link>

                <p className="mb-2 text-[9px] font-semibold tracking-[0.18em] text-[#C88A3D] sm:text-xs">
                  JIM CORBETT SAFARI
                </p>

                <h1 className="text-[29px] font-bold leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl">
                  {zone.name}
                </h1>

                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/80 sm:text-sm">
                  <MapPin size={14} className="text-[#C88A3D]" />
                  {zone.location}
                </div>

                <p className="mt-3 max-w-xl text-[11px] leading-[1.55] text-white/85 sm:mt-5 sm:text-sm sm:leading-6 md:text-base">
                  {zone.description || "Contact us to learn more about this safari zone."}
                </p>

                <div className="mt-5 flex flex-row gap-2 sm:mt-7 sm:gap-3">
                  <Link
                    href={`/safari/jeep?zone=${encodeURIComponent(zone.name)}`}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-3 text-[10px] font-semibold text-white transition hover:bg-[#A65D24] sm:h-11 sm:px-5 sm:text-xs"
                  >
                    Book Jeep Safari
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    href="/contact?type=safari"
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-white/60 bg-white/10 px-3 text-[10px] font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#172033] sm:h-11 sm:px-5 sm:text-xs"
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
      <section className="bg-[#F7F5F0] py-7 sm:py-10 md:py-12">
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr] md:gap-6">
            {/* MAIN INFO */}
            <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6 md:p-8">
              <p className="text-[9px] font-semibold tracking-[0.16em] text-[#C88A3D] sm:text-xs">
                ABOUT THE ZONE
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#172033] sm:mt-2 sm:text-3xl">
                Explore {zone.name}
              </h2>

              <p className="mt-3 text-[11px] leading-5 text-gray-600 sm:text-sm sm:leading-6">
                {zone.description || "Contact us for more information about this zone."}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-3">
                <div className="rounded-xl bg-[#F7F5F0] p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-[#B96928]" />
                    <span className="text-[10px] font-semibold text-[#172033] sm:text-xs">
                      Duration
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-[#172033] sm:text-sm">
                    {zone.duration}
                  </p>
                </div>

                <div className="rounded-xl bg-[#F7F5F0] p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <Trees size={16} className="text-[#B96928]" />
                    <span className="text-[10px] font-semibold text-[#172033] sm:text-xs">
                      Safari
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-[#172033] sm:text-sm">
                    {zone.safari}
                  </p>
                </div>
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div className="rounded-2xl bg-[#18352A] p-4 text-white shadow-sm sm:p-6 md:p-8">
              <p className="text-[9px] font-semibold tracking-[0.16em] text-[#C88A3D] sm:text-xs">
                ZONE HIGHLIGHTS
              </p>

              <h2 className="mt-1 text-xl font-bold sm:mt-2 sm:text-2xl">
                What you can explore
              </h2>

              <div className="mt-5 space-y-3">
                {zone.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#C88A3D]"
                    />
                    <span className="text-[11px] leading-5 text-white/85 sm:text-sm">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={`/safari/jeep?zone=${encodeURIComponent(zone.name)}`}
                className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#B96928] px-4 text-[10px] font-semibold text-white transition hover:bg-[#A65D24] sm:h-11 sm:text-xs"
              >
                Book Jeep Safari
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* BACK */}
          <div className="mt-5 sm:mt-7">
            <Link
              href="/safari/zones"
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#172033] transition hover:text-[#B96928] sm:text-xs"
            >
              <ArrowLeft size={13} />
              Back to All Safari Zones
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
