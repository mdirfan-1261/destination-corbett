"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";

import deluxeHotels from "@/data/deluxeStays";
import StayCard from "@/components/stay/StayCard";

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

  const coverImage = images.find(
    (image) =>
      typeof image === "object" &&
      image?.isCover &&
      (image.url || image.imageUrl || image.src || image.path)
  );

  const firstImage = coverImage || images.find(Boolean);

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
  const name = property.name?.trim() || "Deluxe Hotel";

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
            (item) => item.toLowerCase() === value.toLowerCase()
          ) === index
      )
      .join(", ") ||
    property.address ||
    "Jim Corbett";

  return {
    id: property._id || property.id,
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
      "Explore this deluxe property and enquire about your stay.",
    image: getPropertyImage(property.images),
    rating: Number(property.rating) || 4.2,
    price: Number(property.pricePerNight || property.price || 0),
    pricePerNight: Number(property.pricePerNight || property.price || 0),
    isAgentProperty: true,
  };
}

export default function DeluxeHotelsPage() {
  const [agentDeluxeHotels, setAgentDeluxeHotels] = useState([]);
  const [staticOverrides, setStaticOverrides] = useState({});
  const [deletedStaticIds, setDeletedStaticIds] = useState([]);

  useEffect(() => {
    try {
      const savedOverrides = localStorage.getItem("DC_STATIC_PROPERTIES_OVERRIDES");
      if (savedOverrides) setStaticOverrides(JSON.parse(savedOverrides));
      const savedDeleted = localStorage.getItem("DC_STATIC_PROPERTIES_DELETED");
      if (savedDeleted) setDeletedStaticIds(JSON.parse(savedDeleted));
    } catch {}
  }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDeluxeProperties() {
      try {
        setLoading(true);

        const response = await fetch(
          `${PUBLIC_PROPERTIES_URL}?stayCategory=deluxe&limit=50`,
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) return;

        const result = await response.json();

        if (result?.success && Array.isArray(result?.data?.properties)) {
          setAgentDeluxeHotels(
            result.data.properties.map(normalizeAgentProperty)
          );
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Public deluxe listing error:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDeluxeProperties();

    return () => controller.abort();
  }, []);

  const staticHotels = deluxeHotels.filter((h) => {
    const propId = `static-deluxe-${h.id || h.slug}`;
    if (deletedStaticIds.includes(propId)) return false;
    const ovr = staticOverrides[propId];
    if (ovr?.publicationStatus === "unpublished") return false;
    return true;
  }).map((hotel) => {
    const propId = `static-deluxe-${hotel.id || hotel.slug}`;
    const override = staticOverrides[propId];
    return {
  
      ...hotel,
      ...(override || {}),
      price: override?.pricePerNight ? Number(override.pricePerNight) : hotel.price,
      isAgentProperty: false,
    };
  });





  const existingKeys = new Set(
    staticHotels.flatMap((hotel) =>
      [hotel.slug, hotel.name]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase())
    )
  );

  const uniqueAgentHotels = agentDeluxeHotels.filter((hotel) => {
    const keys = [hotel.slug, hotel.name]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());

    return !keys.some((key) => existingKeys.has(key));
  });

  const allHotels = [...staticHotels, ...uniqueAgentHotels];

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
          <span aria-current="page" className="font-medium text-[#172033] dark:text-gray-100">
            Deluxe Hotels
          </span>
        </div>
      </nav>

      {/* COMPACT HERO */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
        <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
          <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
            <Image
              src="/stay/premium-hotel.webp"
              alt="Deluxe hotels in Jim Corbett"
              fill
              priority
              quality={75}
              sizes="(max-width: 1023px) 100vw, 700px"
              className="object-cover object-center brightness-110"
            />
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-[45%] hidden w-[15%] bg-gradient-to-r from-[#172033] to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#172033]/55 to-transparent" />

          <div className="relative z-10 flex h-full items-center px-4 py-4 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                Deluxe Hotels{" "}
                <span className="text-[#E0924F]">in Jim Corbett</span>
              </h1>

              <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
                Discover comfortable deluxe stays and peaceful surroundings in
                Jim Corbett.
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

      {/* DELUXE PROPERTIES */}
      <section
        id="deluxe-stays"
        className="py-5 sm:py-6 md:py-8"
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-5 md:px-6">
          <div className="mb-4 sm:mb-5">
            <h2 className="text-lg font-bold leading-tight text-[#172033] dark:text-gray-100 sm:text-2xl">
              Comfortable Deluxe Stays
            </h2>

            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
              Explore deluxe properties, check their details
              and enquire about your stay.
            </p>
          </div>

          {allHotels.length === 0 ? (
            <p className="rounded-xl bg-white p-6 text-sm text-gray-600 dark:bg-[#161b18] dark:text-gray-300">
              Abhi koi deluxe property listing available nahi hai.
              Please baad mein dobara check karein.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {allHotels.map((hotel, index) => {
                const detailUrl = `/stay/deluxe/${hotel.locationSlug || "corbett"}/${hotel.slug}`;

                const enquiryUrl = `/contact?hotel=${encodeURIComponent(
                  hotel.name || ""
                )}&hotelImage=${encodeURIComponent(
                  hotel.image || FALLBACK_IMAGE
                )}&location=${encodeURIComponent(
                  hotel.location || "Jim Corbett"
                )}`;

                return (
                  <StayCard
                    key={
                      hotel.id ||
                      hotel._id ||
                      hotel.slug ||
                      `deluxe-${index}`
                    }
                    href={detailUrl}
                    enquiryHref={enquiryUrl}
                    image={hotel.image || FALLBACK_IMAGE}
                    name={hotel.name}
                    location={hotel.location || "Jim Corbett"}
                    badge={
                      hotel.location?.split(",")[0]?.trim() || "Jim Corbett"
                    }
                    rating={hotel.rating}
                    tags={["Deluxe Stay"]}
                    ctaLabel="View Hotel"
                    unoptimized
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
