
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
  ExternalLink,
  Footprints,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Star,
  Trees,
  Utensils,
  Users,
  Waves,
  Wifi,
} from "lucide-react";

import resorts from "@/data/resorts";

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

function normalizeRoom(room) {
  return {
    ...room,
    id: room._id || room.id,
    name: room.name || room.roomName || "Room",
    price: Number(room.basePrice ?? room.price ?? 0),
    description: room.description || "",
    bed: room.bed || room.bedType || "",
    guests:
      room.maxOccupancy ??
      room.maxAdults ??
      room.guests ??
      0,
    size: room.size || "",
    cancellation: room.cancellation || "",
  };
}

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

function getPropertyLocation(property) {
  const parts = [
    property.locality,
    property.city,
    property.district,
    property.state,
  ].filter(Boolean);

  const uniqueParts = parts.filter(
    (value, index) =>
      parts.findIndex(
        (item) =>
          item.toLowerCase() === value.toLowerCase()
      ) === index
  );

  return (
    uniqueParts.join(", ") ||
    property.address ||
    "Jim Corbett"
  );
}

function formatTime(time) {
  if (!time) return "12 PM";

  const match = String(time).match(/^(\d{1,2}):(\d{2})$/);

  if (!match) return time;

  const hour = Number(match[1]);
  const minute = match[2];
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute === "00" ? "00" : minute} ${period}`;
}

/* =====================================================
   MAIN PAGE
===================================================== */

export default function ResortDetailPage() {
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

  /* =====================================================
     EXISTING STATIC PROPERTY
  ====================================================== */

  const staticProperty = useMemo(() => {
    return resorts.find(
      (item) =>
        item.locationSlug === locationParam &&
        item.slug === propertySlug
    ) || null;
  }, [locationParam, propertySlug]);

  /* =====================================================
     FETCH AGENT PROPERTY FROM BACKEND
  ====================================================== */

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProperty() {
      if (!propertySlug) {
        setLoading(false);
        setAgentProperty(null);
        return;
      }

      // Existing static resorts don't need an API request.
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
            result?.message ||
              "Property details could not be loaded."
          );
        }

        const item = result.data.property;
        const images = normalizeImages(item.images);

        const normalizedProperty = {
          ...item,
          id: item._id || item.id,
          slug: item.slug || propertySlug,
          locationSlug: locationParam || "corbett",
          name: item.name || "Resort",
          location: getPropertyLocation(item),
          image: images[0] || FALLBACK_IMAGE,
          images: images.length ? images : [FALLBACK_IMAGE],
          description:
            item.description &&
            item.description.trim().length > 3
              ? item.description
              : "Property details will be updated soon.",
          checkIn: item.checkInTime || "12:00",
          checkOut: item.checkOutTime || "11:00",
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
        };

        setAgentProperty(normalizedProperty);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Public property detail error:", error);

        setDetailError(
          error.message || "Unable to load resort details."
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

  /* =====================================================
     SELECT STATIC OR AGENT PROPERTY
  ====================================================== */

  const property = staticProperty || agentProperty;

  /* =====================================================
     NORMALIZED DISPLAY DATA
  ====================================================== */

  const imagesList =
    property?.images?.length > 0
      ? property.images
      : property?.image
        ? [property.image]
        : [FALLBACK_IMAGE];

  const rooms = property?.rooms || [];
  const amenities = property?.amenities || [];
  const policies = property?.policies || {};

  const lowestPriceRoom = rooms.length
    ? [...rooms].sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      )[0]
    : null;

  const ratingNumber = Number(property?.rating) || 0;

  const locationName =
    property?.location?.split(",")[0]?.trim() ||
    property?.locationSlug ||
    "Jim Corbett";

  /* =====================================================
     IMAGE SLIDER
  ====================================================== */

  const handleNextImage = () => {
    setCurrentImgIdx(
      (previous) => (previous + 1) % imagesList.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImgIdx(
      (previous) =>
        (previous - 1 + imagesList.length) % imagesList.length
    );
  };

  /* =====================================================
     BOOKING URL
  ====================================================== */

  const getBookingUrl = (room) => {
  if (!room) return "#";

  const propertyId = property?.id || property?._id || "";
  const roomId = room.id || room._id || "";
  const price = Number(room.price ?? room.basePrice ?? 0);

  const params = new URLSearchParams({
    type: "stay",
    property_id: String(propertyId),
    room_type_id: String(roomId),
    property_name: property?.name || "",
    room_name: room.name || "Room",
  });

  // Only pass a price when the listing has a positive price.
  if (Number.isFinite(price) && price > 0) {
    params.set("price", String(price));
  }

  return `/booking?${params.toString()}`;
};
  /* =====================================================
     TABS
  ====================================================== */

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    const sectionMap = {
      Overview: "overview",
      Rooms: "rooms",
      Amenities: "amenities",
      Cancellation: "policies",
      Policies: "policies",
      Reviews: "reviews",
    };

    const targetId = sectionMap[tab];

    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =====================================================
     SHARE
  ====================================================== */

  const handleShare = async () => {
    if (!property) return;

    const shareData = {
      title: property.name,
      text: `Check out ${property.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Resort link copied!");
      }
    } catch {
      // The user may cancel sharing.
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I need help with booking ${property?.name || "a resort"}.`
  );

  /* =====================================================
     LOADING STATE
  ====================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#B96928]/20 border-t-[#B96928]" />

          <h1 className="text-lg font-bold text-[#172033]">
            Loading resort details...
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we load the property information.
          </p>
        </div>
      </main>
    );
  }

  /* =====================================================
     NOT FOUND STATE
  ====================================================== */

  if (!property) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#B96928]/10">
            <Info className="h-6 w-6 text-[#B96928]" />
          </div>

          <h1 className="text-xl font-bold text-[#172033]">
            Resort not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {detailError ||
              "The resort you are looking for could not be found."}
          </p>

          <Link
            href="/stay/resorts"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A65C23]"
          >
            <ArrowLeft size={15} />
            Back to Resorts
          </Link>
        </div>
      </main>
    );
  }

  /* =====================================================
     PROPERTY DETAIL PAGE
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#F7F5F0] pb-16 text-[#172033]">
      {/* BREADCRUMB */}
      <section className="px-3 pt-3 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-1 text-[11px] font-medium text-gray-500 sm:text-xs">
            <Link
              href="/stay/resorts"
              className="transition hover:text-[#B96928]"
            >
              Resorts
            </Link>

            <ChevronRight size={12} />
            <span>{locationName}</span>
            <ChevronRight size={12} />

            <span className="max-w-[150px] truncate font-semibold text-[#172033] sm:max-w-none">
              {property.name}
            </span>
          </div>
        </div>
      </section>

      {/* PROPERTY HEADER */}
      <section className="px-3 pb-2 pt-1.5 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-[#0B3B32]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0B3B32] sm:text-[11px]">
              {locationName}
            </span>

            {ratingNumber > 0 && (
              <>
                <div className="flex items-center gap-1 rounded bg-[#0B3B32] px-2 py-0.5 text-[10px] font-bold text-white sm:text-[11px]">
                  <Star
                    size={11}
                    fill="currentColor"
                    className="text-yellow-400"
                  />
                  <span>{ratingNumber}</span>
                </div>

                <div className="flex items-center text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      fill={
                        star <= Math.round(ratingNumber)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>

                <span className="text-[11px] text-gray-500 sm:text-xs">
                  ({property.reviews || 0} reviews)
                </span>
              </>
            )}
          </div>

          <h1 className="mt-1 text-xl font-bold tracking-tight text-[#0B3B32] sm:text-2xl md:text-3xl">
            {property.name}
          </h1>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-gray-600 sm:text-xs">
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} className="shrink-0 text-[#0B3B32]" />
              {property.location}
            </span>

            <span className="inline-flex items-center gap-1">
              <Footprints size={13} className="shrink-0 text-[#0B3B32]" />
              {property.distance}
            </span>

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
              text="Free Cancellation"
              variant="green"
            />
            <BenefitBadge
              icon={<Car size={12} />}
              text="Free Parking"
              variant="gray"
            />
            <BenefitBadge
              icon={<Check size={12} />}
              text="Enquiry Available"
              variant="amber"
            />
          </div>
        </div>
      </section>

      {/* HERO IMAGE + BOOKING SIDEBAR */}
      <section className="px-3 pt-1.5 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[1fr_310px]">
            <div className="group relative h-[190px] w-full overflow-hidden rounded-2xl border border-gray-200/60 bg-gray-900 shadow-sm sm:h-[250px] md:h-[290px]">
              <Image
                src={imagesList[currentImgIdx] || FALLBACK_IMAGE}
                alt={`${property.name} ${currentImgIdx + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, calc(100vw - 350px)"
                className="object-cover transition-all duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

              {imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share resort"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md"
                >
                  <Share2 size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLiked((value) => !value)}
                  aria-label="Save resort"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md"
                >
                  <Heart
                    size={14}
                    fill={isLiked ? "#ef4444" : "transparent"}
                    className={isLiked ? "text-red-500" : "text-gray-600"}
                  />
                </button>
              </div>

              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                <div className="rounded-md bg-black/65 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md sm:text-xs">
                  {property.name}
                </div>

                {imagesList.length > 1 && (
                  <div className="rounded-md bg-black/65 px-2 py-1 text-[10px] font-bold text-white/90">
                    {currentImgIdx + 1} / {imagesList.length}
                  </div>
                )}
              </div>
            </div>

            {/* BOOKING SIDEBAR */}
            <aside className="space-y-3 lg:sticky lg:top-16">
              {ratingNumber > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-sm font-bold text-blue-600">
                        G
                      </div>

                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-wider text-blue-700">
                          Guest Rating
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-gray-900">
                            {ratingNumber}
                          </span>
                          <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={10}
                                fill={
                                  star <= Math.round(ratingNumber)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400">
                            ({property.reviews || 0})
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500">
                      Reviews <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:p-4">
                {lowestPriceRoom && (
                  <span className="inline-block rounded bg-[#0B3B32]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0B3B32] sm:text-[10px]">
                    {lowestPriceRoom.name}
                  </span>
                )}

                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-xl font-black text-gray-900 sm:text-2xl">
                    {lowestPriceRoom
                      ? `₹${Number(
                          lowestPriceRoom.price
                        ).toLocaleString("en-IN")}`
                      : "Price on request"}
                  </span>

                  {lowestPriceRoom && (
                    <span className="text-[11px] text-gray-500">
                      + taxes/night
                    </span>
                  )}
                </div>

                <div className="mt-2.5 space-y-1 border-t border-gray-100 pt-2.5 text-[11px] font-semibold text-emerald-700">
                  <div className="flex items-center gap-1.5">
                    <Check size={12} />
                    Enquiry available
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={12} />
                    Room details available
                  </div>
                </div>

                {lowestPriceRoom ? (
                  <Link
                    href={getBookingUrl(lowestPriceRoom)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#B96928] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#A65C23] sm:py-3"
                  >
                    Book Now <ArrowRight size={13} />
                  </Link>
                ) : (
                  <Link
                    href={`/contact?type=stay&hotel=${encodeURIComponent(
                      property.name
                    )}&location=${encodeURIComponent(property.location)}`}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#B96928] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#A65C23] sm:py-3"
                  >
                    Enquire for Price <ArrowRight size={13} />
                  </Link>
                )}
              </div>

              <div className="rounded-xl border border-[#B96928]/20 bg-[#B96928]/5 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B96928]/10">
                    <ShieldCheck size={15} className="text-[#B96928]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#172033]">
                      Booking Assistance
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Confirm room availability before booking.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="px-3 pt-3 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-[#0B3B32]/10 bg-[#0B3B32]/5 px-3 py-2.5 text-xs leading-5 text-gray-700">
            <strong className="font-bold text-[#0B3B32]">
              About this stay:
            </strong>{" "}
            {property.description}
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <section className="sticky top-0 z-20 mt-3 border-b border-gray-200 bg-[#F7F5F0]/95 px-3 backdrop-blur-md sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="no-scrollbar flex items-center gap-5 overflow-x-auto text-xs font-bold text-gray-600">
            {[
              "Overview",
              "Rooms",
              "Amenities",
              "Cancellation",
              "Policies",
              "Reviews",
            ].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`whitespace-nowrap border-b-2 py-2 transition ${
                  activeTab === tab
                    ? "border-[#0B3B32] text-[#0B3B32]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* LOWER CONTENT */}
      <section className="px-3 py-4 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
          {/* OVERVIEW */}
          <section
            id="overview"
            className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:p-4"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#B96928] sm:text-[10px]">
              Stay details
            </p>

            <h2 className="mt-0.5 text-base font-bold text-[#0B3B32]">
              Plan your stay at {property.name}
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-gray-600">
              {property.description}
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <InfoBox
                icon={<MapPin size={15} />}
                label="Location"
                value={property.location}
              />

              <InfoBox
                icon={<Footprints size={15} />}
                label="Area"
                value={property.distance}
              />
            </div>
          </section>

          {/* ROOMS */}
          <section id="rooms" className="scroll-mt-20 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700 sm:text-[11px]">
                <span className="h-0.5 w-4 bg-amber-700" />
                Accommodation
              </div>

              <h2 className="text-lg font-bold text-[#0B3B32] sm:text-xl">
                Select Your Retreat
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Choose your preferred room type at {property.name}.
              </p>
            </div>

            <div className="space-y-3">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <RoomCard
                    key={room.id || room._id || room.name}
                    room={room}
                    bookingUrl={getBookingUrl(room)}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-5 text-center text-xs text-gray-500 sm:text-sm">
                  Room information is not available yet. Please enquire
                  about availability and pricing.
                  <Link
                    href={`/contact?type=stay&hotel=${encodeURIComponent(
                      property.name
                    )}`}
                    className="mt-3 inline-flex items-center gap-1 font-bold text-[#B96928]"
                  >
                    Enquire now <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* ABOUT PROPERTY */}
          <section className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:p-4">
            <h2 className="text-base font-bold text-[#0B3B32] sm:text-lg">
              About {property.name}
            </h2>

            <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
              {property.description}
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
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

          {/* AMENITIES */}
          <section
            id="amenities"
            className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:p-4"
          >
            <h2 className="text-base font-bold text-[#0B3B32] sm:text-lg">
              Amenities at {property.name}
            </h2>

            {amenities.length > 0 ? (
              <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {amenities.map((amenity, index) => {
                  const name =
                    typeof amenity === "string"
                      ? amenity
                      : amenity?.name || amenity?.label || "Amenity";

                  return (
                    <div
                      key={`${name}-${index}`}
                      className="flex items-center gap-1.5 rounded-lg bg-[#F7F5F0] p-2 text-xs font-medium text-gray-700"
                    >
                      <AmenityIcon name={name} />
                      <span>{name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-500">
                Amenity information will be available soon.
              </p>
            )}
          </section>

          {/* POLICIES */}
          <section
            id="policies"
            className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:p-4"
          >
            <h2 className="text-base font-bold text-[#0B3B32] sm:text-lg">
              Policies at {property.name}
            </h2>

            <div className="mt-2.5 divide-y divide-gray-100 text-xs">
              <PolicyRow
                title="Cancellation"
                text={policies.cancellation}
              />
              <PolicyRow title="Payment" text={policies.payment} />
              <PolicyRow title="Parking" text={policies.parking} />
            </div>

            {!policies.cancellation &&
              !policies.payment &&
              !policies.parking && (
                <p className="mt-2 text-xs text-gray-500">
                  Please contact us to confirm property policies.
                </p>
              )}
          </section>

          {/* REVIEWS */}
          <section
            id="reviews"
            className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-blue-600">
                  Guest feedback
                </p>

                <h2 className="mt-0.5 text-base font-bold text-[#0B3B32] sm:text-lg">
                  Reviews for {property.name}
                </h2>
              </div>

              {ratingNumber > 0 ? (
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl font-black text-[#172033] sm:text-3xl">
                    {ratingNumber}
                  </span>

                  <div>
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={13}
                          fill={
                            star <= Math.round(ratingNumber)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>

                    <p className="mt-0.5 text-[10px] text-gray-500">
                      {property.reviews || 0} reviews
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  No ratings available yet.
                </p>
              )}
            </div>
          </section>

          {/* SUPPORT */}
          <section className="rounded-xl bg-[#0B3B32] p-3.5 text-white shadow-sm sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xs font-bold sm:text-sm">
                  Planning your stay at {property.name}?
                </h3>

                <p className="text-[11px] text-white/70">
                  Contact our team to confirm room availability and
                  pricing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/contact?type=stay&hotel=${encodeURIComponent(
                    property.name
                  )}&location=${encodeURIComponent(property.location)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#0B3B32] transition hover:bg-gray-100"
                >
                  Get Quote <ArrowRight size={13} />
                </Link>

                <a
                  href={`https://wa.me/919205299338?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  WhatsApp <MessageCircle size={13} />
                </a>
              </div>
            </div>
          </section>
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
    <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm transition hover:border-gray-300 sm:p-4">
      <div>
        <h3 className="text-sm font-bold text-[#0B3B32] sm:text-base">
          {room.name}
        </h3>

        {room.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {room.description}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap gap-1">
          {room.bed && (
            <RoomFeature
              icon={<BedDouble size={11} />}
              text={room.bed}
            />
          )}

          {room.guests > 0 && (
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

      <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-gray-100 pt-2.5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
            Per night
          </p>

          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-gray-900 sm:text-xl">
              ₹{Number(room.price || 0).toLocaleString("en-IN")}
            </span>

            <span className="text-[11px] text-gray-500">
              /night
            </span>
          </div>

          <p className="text-[9px] text-gray-400 sm:text-[10px]">
            + applicable taxes
          </p>
        </div>

        <Link
          href={bookingUrl}
          className="inline-flex items-center gap-1 rounded-lg bg-[#B96928] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#A65C23]"
        >
          Select &amp; Book <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

/* =====================================================
   UI HELPERS
===================================================== */

function RoomFeature({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-[#EDF4F2] px-2 py-0.5 text-[9px] font-bold uppercase text-[#0B3B32] sm:text-[10px]">
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
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${styles[variant]}`}
    >
      {icon}
      {text}
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-[#F7F5F0] p-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B96928]/10 text-[#B96928]">
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
    <div className="py-1.5 first:pt-0 last:pb-0">
      <h4 className="text-xs font-bold text-gray-900">{title}</h4>

      <p className="mt-0.5 text-[11px] leading-relaxed text-gray-600">
        {text}
      </p>
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
