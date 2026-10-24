"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Footprints,
  Heart,
  Info,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Wifi,
  Utensils,
  Waves,
  Trees,
  CalendarDays,
} from "lucide-react";

import luxuryStays from "@/data/luxuryStays";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const PUBLIC_API_BASE = /\/api$/i.test(API_BASE_URL)
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

const FALLBACK_IMAGE = "/stay/resort-hero.webp";

/* =====================================================
   HELPERS
===================================================== */

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];

  return images
    .map((image) => {
      if (typeof image === "string") return image;

      return (
        image?.url ||
        image?.imageUrl ||
        image?.src ||
        image?.path ||
        ""
      );
    })
    .filter(Boolean);
}

function normalizeRoom(room) {
  return {
    ...room,
    id: room?._id || room?.id || room?.roomTypeId || "",
    name: room?.name || room?.roomName || room?.type || "Room",
    price: Number(room?.basePrice ?? room?.price ?? 0),
    description: room?.description || "",
    bed: room?.bed || room?.bedType || "",
    guests:
      room?.maxOccupancy ??
      room?.maxAdults ??
      room?.guests ??
      room?.capacity ??
      0,
    size: room?.size || room?.roomSize || "",
    cancellation: room?.cancellation || "",
  };
}

function getPropertyLocation(property) {
  const parts = [
    property?.locality,
    property?.city,
    property?.district,
    property?.state,
  ].filter(Boolean);

  const uniqueParts = parts.filter(
    (value, index) =>
      parts.findIndex(
        (item) =>
          String(item).toLowerCase() === String(value).toLowerCase()
      ) === index
  );

  return (
    uniqueParts.join(", ") ||
    property?.address ||
    property?.location ||
    "Jim Corbett"
  );
}

function formatTime(time) {
  if (!time) return "12:00 PM";

  const match = String(time).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;

  const hour = Number(match[1]);
  const minute = match[2];
  const period = hour >= 12 ? "PM" : "AM";

  return `${hour % 12 || 12}:${minute} ${period}`;
}

function formatINR(value) {
  const price = Number(value || 0);

  if (!Number.isFinite(price) || price <= 0) {
    return "Price on request";
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

/* =====================================================
   MAIN LUXURY DETAIL PAGE
===================================================== */

export default function LuxuryPropertyDetailPage() {
  const params = useParams();

  const locationParam = Array.isArray(params?.location)
    ? params.location[0]
    : params?.location;

  const propertySlug = Array.isArray(params?.propertySlug)
    ? params.propertySlug[0]
    : params?.propertySlug;

  const [activeTab, setActiveTab] = useState("Overview");
  const [isLiked, setIsLiked] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const [agentProperty, setAgentProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailError, setDetailError] = useState("");

  /* STATIC LUXURY DATA — LOCATION + PROPERTY SLUG */
  const staticProperty = useMemo(() => {
    if (!Array.isArray(luxuryStays)) return null;

    return (
      luxuryStays.find((item) => {
        const itemSlug = item?.slug || item?.propertySlug;

        const itemLocationSlug =
          item?.locationSlug ||
          item?.location_slug ||
          item?.location?.slug;

        return (
          itemSlug === propertySlug &&
          (!itemLocationSlug || itemLocationSlug === locationParam)
        );
      }) || null
    );
  }, [locationParam, propertySlug]);

  /* AGENT PROPERTY FALLBACK */
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProperty() {
      if (!propertySlug) {
        setAgentProperty(null);
        setLoading(false);
        return;
      }

      if (staticProperty) {
        setAgentProperty(null);
        setDetailError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setDetailError("");

        const response = await fetch(
          `${PUBLIC_API_BASE}/agent/public/properties/${encodeURIComponent(
            propertySlug
          )}`,
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (
          !response.ok ||
          !result?.success ||
          !result?.data?.property
        ) {
          throw new Error(
            result?.message || "Property details could not be loaded."
          );
        }

        const item = result.data.property;
        const images = normalizeImages(item.images);

        setAgentProperty({
          ...item,
          id: item._id || item.id,
          slug: item.slug || propertySlug,
          locationSlug: locationParam || "corbett",
          name: item.name || item.title || "Luxury Stay",
          location: getPropertyLocation(item),
          image: images[0] || item.image || FALLBACK_IMAGE,
          images: images.length
            ? images
            : [item.image || FALLBACK_IMAGE],
          description:
            item.description?.trim()?.length > 3
              ? item.description
              : "Discover your luxury stay in Jim Corbett.",
          checkIn: item.checkInTime || item.checkIn || "12:00",
          checkOut: item.checkOutTime || item.checkOut || "11:00",
          rating: Number(item.rating) || 0,
          reviews: Number(item.reviews) || 0,
          distance: item.distance || "Jim Corbett",
          amenities: Array.isArray(item.amenities)
            ? item.amenities
            : [],
          policies: item.policies || {},
          rooms: Array.isArray(result.data.rooms)
            ? result.data.rooms.map(normalizeRoom)
            : [],
        });
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Luxury property detail error:", error);

        setDetailError(
          error.message || "Unable to load property details."
        );

        setAgentProperty(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProperty();

    return () => controller.abort();
  }, [propertySlug, locationParam, staticProperty]);

  const property = staticProperty || agentProperty;

  const rooms = useMemo(() => {
    if (!Array.isArray(property?.rooms)) return [];
    return property.rooms.map(normalizeRoom);
  }, [property]);

  const imagesList = useMemo(() => {
    const images = normalizeImages(property?.images);

    if (images.length) return images;
    if (property?.image) return [property.image];

    return [FALLBACK_IMAGE];
  }, [property]);

  const amenities = Array.isArray(property?.amenities)
    ? property.amenities
    : [];

  const policies = property?.policies || {};
  const ratingNumber = Number(property?.rating) || 0;

  const locationName =
    property?.location?.split(",")[0]?.trim() ||
    property?.locationSlug ||
    locationParam ||
    "Jim Corbett";

  const propertyName = property?.name || property?.title || "Luxury Stay";

  const propertyId =
    property?.id || property?._id || property?.propertyId || "";

  const lowestPriceRoom = useMemo(() => {
    const pricedRooms = rooms.filter((room) => Number(room.price) > 0);

    if (!pricedRooms.length) return null;

    return [...pricedRooms].sort(
      (a, b) => Number(a.price) - Number(b.price)
    )[0];
  }, [rooms]);

  function getBookingUrl(room = {}) {
    const roomId = room?.id || room?._id || room?.roomTypeId || "";
    const price = Number(room?.price ?? room?.basePrice ?? 0);

    const bookingParams = new URLSearchParams({
      type: "stay",
      property_id: String(propertyId || propertySlug || ""),
      room_type_id: String(roomId),
      property_name: propertyName,
      room_name: room?.name || room?.roomName || "Room",
    });

    if (Number.isFinite(price) && price > 0) {
      bookingParams.set("price", String(price));
    }

    return `/booking?${bookingParams.toString()}`;
  }

  function handleNextImage() {
    setCurrentImgIdx((previous) => (previous + 1) % imagesList.length);
  }

  function handlePrevImage() {
    setCurrentImgIdx(
      (previous) => (previous - 1 + imagesList.length) % imagesList.length
    );
  }

  function handleTabClick(tab) {
    setActiveTab(tab);

    const sectionMap = {
      Overview: "overview",
      Rooms: "rooms",
      Amenities: "amenities",
      Cancellation: "policies",
      Reviews: "reviews",
    };

    const targetId = sectionMap[tab];

    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  /* LOADING */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#0B3B32]/20 border-t-[#0B3B32]" />

          <h1 className="text-lg font-bold text-[#0B3B32]">
            Loading luxury stay...
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we load the property details.
          </p>
        </div>
      </main>
    );
  }

  /* NOT FOUND */
  if (!property) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B3B32]/10">
            <Info className="h-6 w-6 text-[#0B3B32]" />
          </div>

          <h1 className="text-xl font-bold text-[#0B3B32]">
            Luxury property not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {detailError ||
              "The property you are looking for could not be found."}
          </p>

          <Link
            href="/stay/luxury"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B3B32] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#082D26]"
          >
            <ArrowLeft size={15} />
            Back to Luxury Stays
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] pb-12 text-[#172033]">
      {/* BREADCRUMB */}
      <section className="px-3 pt-3 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-1 text-[11px] font-medium text-gray-500 sm:text-xs">
            <Link href="/stay" className="transition hover:text-[#0B3B32]">
              Stay
            </Link>

            <ChevronRight size={12} />

            <Link
              href="/stay/luxury"
              className="transition hover:text-[#0B3B32]"
            >
              Luxury Stays
            </Link>

            <ChevronRight size={12} />

            <span>{locationName}</span>

            <ChevronRight size={12} />

            <span className="max-w-[180px] truncate font-semibold text-[#172033] sm:max-w-none">
              {propertyName}
            </span>
          </div>
        </div>
      </section>

      {/* PROPERTY HEADER */}
      <section className="px-3 pb-2 pt-2 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-[#0B3B32]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0B3B32] sm:text-[11px]">
              {locationName}
            </span>

            {ratingNumber > 0 && (
              <div className="flex items-center gap-1 rounded bg-[#0B3B32] px-2 py-0.5 text-[10px] font-bold text-white sm:text-[11px]">
                <Star
                  size={11}
                  fill="currentColor"
                  className="text-yellow-400"
                />
                {ratingNumber.toFixed(1)}
              </div>
            )}

            {property.category && (
              <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                {property.category}
              </span>
            )}
          </div>

          <h1 className="mt-1 text-xl font-bold tracking-tight text-[#0B3B32] sm:text-2xl md:text-3xl">
            {propertyName}
          </h1>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-gray-600 sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} className="shrink-0 text-[#0B3B32]" />
              {property.location || locationName}
            </span>

            {property.distance && (
              <span className="inline-flex items-center gap-1">
                <Footprints size={13} className="shrink-0 text-[#0B3B32]" />
                {property.distance}
              </span>
            )}

            <span className="inline-flex items-center gap-1">
              <Clock3 size={13} className="shrink-0 text-[#0B3B32]" />
              Check-in <strong>from {formatTime(property.checkIn)}</strong>
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock3 size={13} className="shrink-0 text-[#0B3B32]" />
              Check-out <strong>until {formatTime(property.checkOut)}</strong>
            </span>
          </div>

          <div className="no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto py-0.5">
            <BenefitBadge
              icon={<ShieldCheck size={12} />}
              text="Booking Conditions"
              variant="green"
            />

            <BenefitBadge
              icon={<Car size={12} />}
              text="Parking"
              variant="gray"
            />

            <BenefitBadge
              icon={<Check size={12} />}
              text="Luxury Stay"
              variant="amber"
            />
          </div>
        </div>
      </section>

      {/* HERO GALLERY + BOOKING CARD */}
      <section className="px-3 pt-1.5 sm:px-6 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="relative h-[250px] overflow-hidden rounded-2xl bg-gray-200 sm:h-[360px] lg:h-[410px]">
              <Image
                src={imagesList[currentImgIdx] || FALLBACK_IMAGE}
                alt={propertyName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
                unoptimized
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#172033] shadow transition hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#172033] shadow transition hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>

              <button
                type="button"
                onClick={() => setIsLiked((previous) => !previous)}
                aria-label={
                  isLiked ? "Remove from favourites" : "Add to favourites"
                }
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-white"
              >
                <Heart
                  size={18}
                  className={
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                  }
                />
              </button>

              <div className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white">
                {currentImgIdx + 1} / {imagesList.length} Photos
              </div>
            </div>

            {imagesList.length > 1 && (
              <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {imagesList.slice(0, 5).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setCurrentImgIdx(index)}
                    aria-label={`Show photo ${index + 1}`}
                    className={`relative h-16 overflow-hidden rounded-lg bg-gray-200 sm:h-20 ${
                      currentImgIdx === index
                        ? "ring-2 ring-[#0B3B32] ring-offset-2"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${propertyName} photo ${index + 1}`}
                      fill
                      sizes="160px"
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BOOKING SIDEBAR */}
          <aside className="space-y-3 lg:sticky lg:top-24">
            {ratingNumber > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-[#172033]">
                    Guest Rating
                  </p>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    Based on guest feedback
                  </p>
                </div>

                <div className="rounded-lg bg-[#0B3B32] px-3 py-2 text-center text-white">
                  <div className="flex items-center justify-center gap-1 text-sm font-extrabold">
                    <Star
                      size={12}
                      fill="currentColor"
                      className="text-yellow-400"
                    />
                    {ratingNumber.toFixed(1)}
                  </div>
                  <p className="mt-0.5 text-[9px] text-white/75">
                    {property.reviews || 0} reviews
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:p-4">
              {lowestPriceRoom && (
                <span className="inline-block rounded bg-[#0B3B32]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0B3B32] sm:text-[10px]">
                  {lowestPriceRoom.name}
                </span>
              )}

              <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Starting price
              </p>

              <div className="mt-0.5 flex flex-wrap items-baseline gap-1">
                <span className="text-xl font-black text-gray-900 sm:text-2xl">
                  {lowestPriceRoom
                    ? formatINR(lowestPriceRoom.price)
                    : "Price on request"}
                </span>

                {lowestPriceRoom && (
                  <span className="text-[11px] text-gray-500">
                    + taxes/night
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3 text-[11px] font-semibold text-emerald-700">
                <div className="flex items-center gap-1.5">
                  <Check size={12} />
                  Room options
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={12} />
                  Property details
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={12} />
                  Booking details at checkout
                </div>
              </div>

              <Link
                href={getBookingUrl(lowestPriceRoom || {})}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0B3B32] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#082D26] sm:py-3"
              >
                Book Now <ArrowRight size={13} />
              </Link>

              <p className="mt-2 text-center text-[10px] leading-relaxed text-gray-500">
                Select your stay details on the booking page.
              </p>
            </div>

            <div className="rounded-xl border border-[#0B3B32]/15 bg-[#0B3B32]/5 p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0B3B32]/10">
                  <ShieldCheck size={17} className="text-[#0B3B32]" />
                </div>

                <div>
                  <p className="text-xs font-bold text-[#172033]">
                    Booking Information
                  </p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-gray-500">
                    Select a room and review the details before booking.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* STICKY NAVIGATION */}
      <section className="sticky top-0 z-30 mt-5 border-y border-gray-200 bg-white/95 px-3 shadow-sm backdrop-blur sm:px-6 md:px-8">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-5 overflow-x-auto">
          {["Overview", "Rooms", "Amenities", "Cancellation", "Reviews"].map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`whitespace-nowrap border-b-2 py-3 text-xs font-bold transition ${
                  activeTab === tab
                    ? "border-[#0B3B32] text-[#0B3B32]"
                    : "border-transparent text-gray-500 hover:text-[#172033]"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="px-3 pt-5 sm:px-6 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-5">
            {/* OVERVIEW */}
            <section
              id="overview"
              className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <SectionEyebrow text="Discover your stay" />

              <h2 className="mt-1 text-lg font-bold text-[#0B3B32] sm:text-xl">
                About {propertyName}
              </h2>

              <p className="mt-2 whitespace-pre-line text-xs leading-6 text-gray-600 sm:text-sm">
                {property.description ||
                  `Experience a luxury stay at ${propertyName} in ${
                    property.location || locationName
                  }.`}
              </p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <InfoBox
                  icon={<MapPin size={15} />}
                  label="Location"
                  value={property.location || locationName}
                />
                <InfoBox
                  icon={<Footprints size={15} />}
                  label="Area"
                  value={property.distance || locationName}
                />
                <InfoBox
                  icon={<Clock3 size={15} />}
                  label="Check-in"
                  value={`From ${formatTime(property.checkIn)}`}
                />
                <InfoBox
                  icon={<Clock3 size={15} />}
                  label="Check-out"
                  value={`Until ${formatTime(property.checkOut)}`}
                />
              </div>
            </section>

            {/* ROOMS */}
            <section id="rooms" className="scroll-mt-20 space-y-3">
              <div>
                <SectionEyebrow text="Accommodation" />
                <h2 className="mt-1 text-lg font-bold text-[#0B3B32] sm:text-xl">
                  Select Your Room
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Choose your preferred room at {propertyName}.
                </p>
              </div>

              <div className="space-y-3">
                {rooms.length > 0 ? (
                  rooms.map((room, index) => (
                    <RoomCard
                      key={room.id || room.name || index}
                      room={room}
                      bookingUrl={getBookingUrl(room)}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
                    <BedDouble
                      size={25}
                      className="mx-auto text-[#0B3B32]"
                    />

                    <h3 className="mt-2 text-sm font-bold text-[#172033]">
                      Room details coming soon
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-gray-500">
                      Continue to the booking page to enter your stay details.
                    </p>

                    <Link
                      href={getBookingUrl({})}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#0B3B32] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#082D26]"
                    >
                      Book Now <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* AMENITIES */}
            <section
              id="amenities"
              className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <SectionEyebrow text="Comfort and convenience" />

              <h2 className="mt-1 text-lg font-bold text-[#0B3B32] sm:text-xl">
                Amenities
              </h2>

              {amenities.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {amenities.map((amenity, index) => {
                    const name =
                      typeof amenity === "string"
                        ? amenity
                        : amenity?.name ||
                          amenity?.title ||
                          amenity?.label ||
                          "";

                    if (!name) return null;

                    return (
                      <div
                        key={`${name}-${index}`}
                        className="flex items-center gap-2 rounded-lg bg-[#F7F5F0] p-2.5 text-xs font-medium text-gray-700"
                      >
                        <AmenityIcon name={name} />
                        <span>{name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-2 text-xs text-gray-500">
                  Amenity details will be updated soon.
                </p>
              )}
            </section>

            {/* POLICIES */}
            <section
              id="policies"
              className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <SectionEyebrow text="Before you book" />

              <h2 className="mt-1 text-lg font-bold text-[#0B3B32] sm:text-xl">
                Cancellation &amp; Policies
              </h2>

              <div className="mt-3 divide-y divide-gray-100">
                <PolicyRow
                  title="Check-in"
                  text={`Check-in starts from ${formatTime(property.checkIn)}.`}
                />
                <PolicyRow
                  title="Check-out"
                  text={`Check-out is until ${formatTime(property.checkOut)}.`}
                />
                <PolicyRow
                  title="Cancellation policy"
                  text={
                    policies.cancellation ||
                    policies.cancellationPolicy ||
                    policies.refund ||
                    "Cancellation terms depend on the selected room and booking conditions."
                  }
                />
                <PolicyRow
                  title="Child policy"
                  text={
                    policies.children ||
                    policies.childPolicy ||
                    "Child accommodation rules are subject to the property's booking conditions."
                  }
                />
                <PolicyRow
                  title="Property rules"
                  text={
                    policies.rules ||
                    policies.propertyRules ||
                    policies.general ||
                    "Please review the property's applicable rules before confirming your stay."
                  }
                />
              </div>
            </section>

            {/* REVIEWS */}
            <section
              id="reviews"
              className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <SectionEyebrow text="Guest experiences" />

              <h2 className="mt-1 text-lg font-bold text-[#0B3B32] sm:text-xl">
                Guest Reviews
              </h2>

              {ratingNumber > 0 ? (
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#F7F5F0] p-4">
                  <div className="rounded-xl bg-[#0B3B32] px-4 py-3 text-center text-white">
                    <div className="flex items-center justify-center gap-1 text-xl font-extrabold">
                      {ratingNumber.toFixed(1)}
                      <Star
                        size={15}
                        fill="currentColor"
                        className="text-yellow-400"
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-white/75">
                      Guest rating
                    </p>
                  </div>

                  <div>
                    <div className="flex gap-0.5 text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          fill={
                            star <= Math.round(ratingNumber)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>

                    <p className="mt-1 text-xs font-semibold text-[#172033]">
                      {property.reviews || 0} reviews
                    </p>

                    <p className="mt-0.5 text-[11px] text-gray-500">
                      Rating information provided for this property.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  Guest ratings and reviews are not available yet.
                </p>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-3 lg:sticky lg:top-16">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-[#172033]">
                Your luxury stay
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                Choose a room, review the available price and continue to
                booking.
              </p>

              <div className="mt-3 flex items-start gap-2 border-t border-gray-100 pt-3">
                <CalendarDays
                  size={15}
                  className="mt-0.5 shrink-0 text-[#0B3B32]"
                />

                <div>
                  <p className="text-xs font-bold text-[#172033]">
                    Flexible stay details
                  </p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
                    Enter your check-in date, check-out date and guest details
                    on the booking page.
                  </p>
                </div>
              </div>

              <Link
                href={getBookingUrl(lowestPriceRoom || {})}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#0B3B32] py-3 text-xs font-bold text-white transition hover:bg-[#082D26]"
              >
                Book Now <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="text-xs font-bold text-[#172033]">
                Property highlights
              </h3>

              <div className="mt-3 space-y-2.5">
                <HighlightRow
                  icon={<BedDouble size={15} />}
                  text={`${rooms.length} room option${rooms.length === 1 ? "" : "s"}`}
                />

                <HighlightRow
                  icon={<MapPin size={15} />}
                  text={property.location || locationName}
                />

                <HighlightRow
                  icon={<ShieldCheck size={15} />}
                  text="Review booking conditions"
                />

                {amenities.length > 0 && (
                  <HighlightRow
                    icon={<Wifi size={15} />}
                    text={`${amenities.length} listed amenities`}
                  />
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* =====================================================
   ROOM CARD
===================================================== */

function RoomCard({ room, bookingUrl }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm transition hover:border-gray-300 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#0B3B32] sm:text-base">
            {room.name}
          </h3>

          {room.description && (
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {room.description}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {room.bed && (
              <RoomFeature
                icon={<BedDouble size={11} />}
                text={room.bed}
              />
            )}

            {Number(room.guests) > 0 && (
              <RoomFeature
                icon={<Users size={11} />}
                text={`Up to ${room.guests} guests`}
              />
            )}

            {room.size && <RoomFeature text={room.size} />}
          </div>

          {room.cancellation && (
            <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <Check size={12} />
              {room.cancellation}
            </div>
          )}
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
            Per night
          </p>

          <p className="mt-0.5 text-lg font-extrabold text-gray-900 sm:text-xl">
            {formatINR(room.price)}
          </p>

          <p className="text-[9px] text-gray-400 sm:text-[10px]">
            Applicable taxes may apply
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <span className="text-[10px] text-gray-500">
          {Number(room.guests) > 0
            ? `Capacity: ${room.guests} guests`
            : "Room details"}
        </span>

        <Link
          href={bookingUrl}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B3B32] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#082D26]"
        >
          Select &amp; Book <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}

/* =====================================================
   UI HELPERS
===================================================== */

function SectionEyebrow({ text }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700 sm:text-[11px]">
      <span className="h-0.5 w-4 bg-amber-700" />
      {text}
    </div>
  );
}

function RoomFeature({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-[#EDF4F2] px-2 py-1 text-[9px] font-bold uppercase text-[#0B3B32] sm:text-[10px]">
      {icon}
      {text}
    </span>
  );
}

function BenefitBadge({ icon, text, variant = "gray" }) {
  const styles = {
    green: "border-emerald-600/30 bg-emerald-50/60 text-emerald-700",
    gray: "border-gray-300 bg-white text-gray-700",
    amber: "border-amber-300 bg-amber-50 text-amber-800",
  };

  return (
    <div
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-semibold sm:text-[11px] ${styles[variant]}`}
    >
      {icon}
      {text}
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-[#F7F5F0] p-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B3B32]/10 text-[#0B3B32]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 break-words text-xs font-semibold text-[#172033]">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

function PolicyRow({ title, text }) {
  if (!text) return null;

  return (
    <div className="py-2 first:pt-0 last:pb-0">
      <h4 className="text-xs font-bold text-gray-900">{title}</h4>
      <p className="mt-1 text-[11px] leading-relaxed text-gray-600">
        {text}
      </p>
    </div>
  );
}

function HighlightRow({ icon, text }) {
  return (
    <div className="flex items-start gap-2 text-xs text-gray-600">
      <span className="mt-0.5 shrink-0 text-[#0B3B32]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function AmenityIcon({ name }) {
  const lower = String(name).toLowerCase();

  if (lower.includes("wifi") || lower.includes("internet")) {
    return <Wifi size={13} className="shrink-0 text-[#0B3B32]" />;
  }

  if (lower.includes("parking")) {
    return <Car size={13} className="shrink-0 text-[#0B3B32]" />;
  }

  if (lower.includes("pool")) {
    return <Waves size={13} className="shrink-0 text-[#0B3B32]" />;
  }

  if (lower.includes("restaurant") || lower.includes("food")) {
    return <Utensils size={13} className="shrink-0 text-[#0B3B32]" />;
  }

  if (lower.includes("garden") || lower.includes("nature")) {
    return <Trees size={13} className="shrink-0 text-[#0B3B32]" />;
  }

  return <Check size={13} className="shrink-0 text-[#0B3B32]" />;
}