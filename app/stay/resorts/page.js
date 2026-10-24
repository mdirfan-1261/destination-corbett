"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";

import resorts from "@/data/resorts";
import StayCard from "@/components/stay/StayCard";

// Backend URL: NEXT_PUBLIC_API_URL mein /api ho ya na ho, dono support hain.
const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const PUBLIC_PROPERTIES_URL = `${API_BASE_URL}${
    /\/api$/i.test(API_BASE_URL) ? "" : "/api"
}/agent/public/properties`;

const FALLBACK_IMAGE = "/stay/resort-hero.webp";

function slugify(value = "") {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getPropertyImage(images) {
    if (!Array.isArray(images) || images.length === 0) {
        return FALLBACK_IMAGE;
    }

    const firstImage = images[0];

    const imageUrl =
        typeof firstImage === "string"
            ? firstImage
            : firstImage?.url ||
              firstImage?.imageUrl ||
              firstImage?.src ||
              firstImage?.path;

    return imageUrl || FALLBACK_IMAGE;
}

function normalizeAgentProperty(property) {
    const name = property.name?.trim() || "Resort";

    const location =
        [
            property.locality,
            property.city,
            property.district,
            property.state,
        ]
            .filter(Boolean)
            .filter(
                (value, index, array) =>
                    array.findIndex(
                        (item) =>
                            item.toLowerCase() === value.toLowerCase()
                    ) === index
            )
            .join(", ") ||
        property.address ||
        "Jim Corbett";

    return {
        id: property._id,
        slug: property.slug || slugify(name),
        locationSlug: slugify(
            property.locality ||
                property.city ||
                property.district ||
                "corbett"
        ),
        name,
        location,
        description:
            property.description?.trim() ||
            "Explore this property and enquire about your stay.",
        image: getPropertyImage(property.images),
        rating: Number(property.rating) || 0,
        isAgentProperty: true,
    };
}

export default function ResortsStaysPage() {
    const [agentResorts, setAgentResorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function fetchAgentResorts() {
            try {
                setLoading(true);
                setApiError("");

                const response = await fetch(
                    `${PUBLIC_PROPERTIES_URL}?propertyType=resort&limit=50`,
                    {
                        method: "GET",
                        signal: controller.signal,
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Properties load nahi hui (${response.status}).`
                    );
                }

                const result = await response.json();

                if (!result?.success || !Array.isArray(result?.data?.properties)) {
                    throw new Error("Backend response ka format sahi nahi hai.");
                }

                setAgentResorts(
                    result.data.properties.map(normalizeAgentProperty)
                );
            } catch (error) {
                if (error.name === "AbortError") return;

                console.error("Public resort listing error:", error);
                setApiError(
                    "Agent properties abhi load nahi ho pa rahi hain."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchAgentResorts();

        return () => controller.abort();
    }, []);

    // Existing static resorts ko preserve karo aur duplicate entries hatao.
    const staticResorts = resorts.map((resort) => ({
        ...resort,
        isAgentProperty: false,
    }));

    const existingKeys = new Set(
        staticResorts.flatMap((resort) =>
            [resort.slug, resort.name]
                .filter(Boolean)
                .map((value) => String(value).toLowerCase())
        )
    );

    const uniqueAgentResorts = agentResorts.filter((resort) => {
        const keys = [resort.slug, resort.name]
            .filter(Boolean)
            .map((value) => String(value).toLowerCase());

        return !keys.some((key) => existingKeys.has(key));
    });

    const allResorts = [...staticResorts, ...uniqueAgentResorts];

    return (
        <main className="bg-[#F7F5F0] dark:bg-[#0e1210]">
            <nav
  aria-label="Breadcrumb"
  className="mx-auto max-w-6xl px-3 pt-3 text-xs sm:px-5 sm:pt-4 sm:text-sm md:px-6"
>
  <div className="flex items-center gap-2">
    <Link href="/" className="text-[#B96928] transition-colors hover:underline">
      Home
    </Link>
    <span className="text-gray-400">›</span>
    <Link href="/stay" className="text-[#B96928] transition-colors hover:underline">
      Stay
    </Link>
    <span className="text-gray-400">›</span>
    <span aria-current="page" className="font-medium text-[#172033]">
      Resorts
    </span>
  </div>
</nav>

            {/* ================= COMPACT HERO ================= */}
            {/* ================= COMPACT HERO ================= */}
<section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
  <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
    {/* Hero Image */}
    <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
      <Image
        src="/stay/resort-hero.webp"
        alt="Resorts and Stays in Jim Corbett"
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
        <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Resorts &amp;{" "}
          <span className="text-[#E0924F]">Stays in Jim Corbett</span>
        </h1>

        <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
          Comfortable resorts and peaceful stays surrounded by the natural
          beauty of Jim Corbett.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href="/contact?type=stay"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
          >
            Make an Enquiry
            <Send size={13} />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

            {/* ================= RESORTS ================= */}
            <section id="resorts" className="py-5 sm:py-6 md:py-8">
                <div className="mx-auto max-w-6xl px-3 sm:px-5 md:px-6">

                    <div className="mb-4 sm:mb-5">
                        <h2 className="text-lg font-bold leading-tight text-[#172033] dark:text-gray-100 sm:text-2xl">
                            Comfortable Stays in Nature
                        </h2>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                            Choose a resort to see rooms, amenities and pricing.
                        </p>
                    </div>

                    {loading && (
                        <p
                            role="status"
                            className="mb-4 text-sm text-gray-600 dark:text-gray-300"
                        >
                            Loading available resorts...
                        </p>
                    )}

                    {apiError && (
                        <p
                            role="status"
                            className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200"
                        >
                            {apiError} Existing resorts are still available.
                        </p>
                    )}

                    {!loading && allResorts.length === 0 && (
                        <p className="rounded-xl bg-white p-6 text-sm text-gray-600 dark:bg-[#161b18] dark:text-gray-300">
                            Abhi koi resort listing available nahi hai.
                            Please baad mein dobara check karein.
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                        {allResorts.map((resort) => {
                            // Route: /stay/resorts/<location>/<property-slug>
                            const detailUrl = `/stay/resorts/${resort.locationSlug}/${resort.slug}`;

                            const enquiryUrl = resort.isAgentProperty
                                ? `/contact?hotel=${encodeURIComponent(
                                      resort.name
                                  )}&location=${encodeURIComponent(
                                      resort.location
                                  )}`
                                : `/contact?hotel=${encodeURIComponent(
                                      resort.name
                                  )}&hotelImage=${encodeURIComponent(
                                      resort.image
                                  )}&location=${encodeURIComponent(
                                      resort.location
                                  )}`;

                            return (
                                <StayCard
                                    key={
                                        resort.isAgentProperty
                                            ? `agent-${resort.id}`
                                            : `static-${resort.id}`
                                    }
                                    href={detailUrl}
                                    enquiryHref={enquiryUrl}
                                    image={resort.image || FALLBACK_IMAGE}
                                    name={resort.name}
                                    location={resort.location}
                                    badge={resort.location?.split(",")[0]?.trim()}
                                    rating={resort.rating}
                                    tags={resort.isAgentProperty ? ["Partner Stay"] : []}
                                    ctaLabel="View Resort"
                                    unoptimized
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}