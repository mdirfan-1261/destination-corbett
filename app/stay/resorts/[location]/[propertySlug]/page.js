"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
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

export default function ResortDetailPage() {
  const params = useParams();

  const [activeTab, setActiveTab] = useState("Overview");
  const [isLiked, setIsLiked] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  /* =====================================================
     FIND CURRENT PROPERTY
  ====================================================== */

  const property = useMemo(() => {
    return resorts.find(
      (item) =>
        item.locationSlug === params.location &&
        item.slug === params.propertySlug
    );
  }, [params.location, params.propertySlug]);

  /* =====================================================
     PROPERTY NOT FOUND
  ====================================================== */

  if (!property) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C87532]/10">
            <Info className="h-6 w-6 text-[#C87532]" />
          </div>

          <h1 className="text-xl font-bold text-[#172033]">
            Resort not found
          </h1>

          <p className="mt-2 text-xs text-gray-500">
            The resort you are looking for could not be found.
          </p>

          <Link
            href="/stay/resorts"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C87532] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#B96928]"
          >
            <ArrowLeft size={15} />
            Back to Resorts
          </Link>
        </div>
      </main>
    );
  }

  /* =====================================================
     DYNAMIC PROPERTY DATA & SLIDER IMAGES
  ====================================================== */

  const imagesList = useMemo(() => {
    if (property.images?.length) return property.images;
    if (property.image) return [property.image];
    return ["/placeholder.jpg"];
  }, [property]);

  const rooms = property.rooms || [];
  const amenities = property.amenities || [];
  const policies = property.policies || {};

  const locationName =
    property.location?.split(",")[0]?.trim() ||
    property.locationSlug ||
    "Jim Corbett";

  /* =====================================================
     SLIDER CONTROLS
  ====================================================== */

  const handleNextImage = () => {
    setCurrentImgIdx((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImage = () => {
    setCurrentImgIdx((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  /* =====================================================
     LOWEST PRICE ROOM
  ====================================================== */

  const lowestPriceRoom = useMemo(() => {
    if (!rooms.length) return null;

    return [...rooms].sort(
      (a, b) => Number(a.price) - Number(b.price)
    )[0];
  }, [rooms]);

  const ratingNumber = Number(property.rating) || 0;

  /* =====================================================
     MAIN BOOKING URL
  ====================================================== */

  const getBookingUrl = (room) => {
    if (!room) return "#";

    return `/booking?type=stay&property_id=${encodeURIComponent(
      room.id
    )}&property_name=${encodeURIComponent(room.name)}`;
  };

  /* =====================================================
     TAB NAVIGATION
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
    const shareData = {
      title: property.name,
      text: `Check out ${property.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      alert("Resort link copied!");
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I need help with booking ${property.name}.`
  );

  return (
    <main className="min-h-screen bg-[#F7F5F0] pb-16 text-[#172033]">
      {/* BREADCRUMB */}
      <section className="px-3 pt-3 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-1 text-[11px] sm:text-xs font-medium text-gray-500">
            <Link
              href="/stay/resorts"
              className="transition hover:text-[#C87532]"
            >
              Resorts
            </Link>

            <ChevronRight size={12} />

            <span>{locationName}</span>

            <ChevronRight size={12} />

            <span className="font-semibold text-[#172033] truncate max-w-[150px] sm:max-w-none">
              {property.name}
            </span>
          </div>
        </div>
      </section>

      {/* PROPERTY HEADER */}
      <section className="px-3 pb-2 pt-1.5 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-[#0B3B32]/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0B3B32]">
              {locationName}
            </span>

            <div className="flex items-center gap-1 rounded bg-[#0B3B32] px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-white">
              <Star
                size={11}
                fill="currentColor"
                className="text-yellow-400"
              />
              <span>{property.rating}</span>
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

            <span className="text-[11px] sm:text-xs text-gray-500">
              ({property.reviews} reviews)
            </span>
          </div>

          <h1 className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#0B3B32]">
            {property.name}
          </h1>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs font-medium text-gray-600">
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} className="text-[#0B3B32] shrink-0" />
              {property.location}
            </span>

            <span className="inline-flex items-center gap-1">
              <Footprints size={13} className="text-[#0B3B32] shrink-0" />
              {property.distance}
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock3 size={13} className="text-[#0B3B32] shrink-0" />
              Check-in <strong>from {formatTime(property.checkIn)}</strong>
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock3 size={13} className="text-[#0B3B32] shrink-0" />
              Check-out <strong>until {formatTime(property.checkOut)}</strong>
            </span>
          </div>

          {/* BENEFITS (Horizontal Scroll on Mobile) */}
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
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
              text="Pay at Property"
              variant="amber"
            />
          </div>
        </div>
      </section>

      {/* HERO IMAGE SLIDER (COMPACT ON MOBILE) + RIGHT SIDEBAR */}
      <section className="px-3 pt-1.5 sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[1fr_310px]">
            
            {/* HERO IMAGE CAROUSEL (Mobile Compact Height) */}
            <div className="group relative h-[190px] sm:h-[250px] md:h-[290px] w-full overflow-hidden rounded-2xl border border-gray-200/60 shadow-sm bg-gray-900">
              <Image
                src={imagesList[currentImgIdx]}
                alt={`${property.name} ${currentImgIdx + 1}`}
                fill
                priority
                quality={90}
                sizes="(max-width: 1024px) 100vw, calc(100vw - 350px)"
                className="object-cover transition-all duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

              {/* SLIDER CONTROLS */}
              {imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/70"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* SHARE + LIKE */}
              <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share resort"
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md backdrop-blur transition hover:scale-105"
                >
                  <Share2 size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLiked((value) => !value)}
                  aria-label="Save resort"
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-105"
                >
                  <Heart
                    size={14}
                    fill={isLiked ? "#ef4444" : "transparent"}
                    className={isLiked ? "text-red-500" : "text-gray-600"}
                  />
                </button>
              </div>

              {/* IMAGE LABEL & COUNTER */}
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                <div className="rounded-md bg-black/65 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-md">
                  {property.name}
                </div>

                {imagesList.length > 1 && (
                  <div className="rounded-md bg-black/65 px-2 py-1 text-[9px] sm:text-[10px] font-bold text-white/90 backdrop-blur-md">
                    {currentImgIdx + 1} / {imagesList.length}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="space-y-3 lg:sticky lg:top-16">
              
              {/* GOOGLE RATING */}
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-blue-50 text-xs sm:text-sm font-bold text-blue-600">
                      G
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-blue-700">
                        Rated on Google
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-900">
                          {property.rating}
                        </span>
                        <div className="flex text-yellow-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={10}
                              fill={star <= Math.round(ratingNumber) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-400">({property.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-[10px] sm:text-[11px] font-bold text-white transition hover:bg-blue-700"
                  >
                    Reviews
                    <ExternalLink size={10} />
                  </button>
                </div>
              </div>

              {/* PRICE + BOOK NOW CARD */}
              <div className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-sm">
                {lowestPriceRoom && (
                  <span className="inline-block rounded bg-[#0B3B32]/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#0B3B32]">
                    {lowestPriceRoom.name}
                  </span>
                )}

                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-gray-900">
                    ₹{lowestPriceRoom?.price ? Number(lowestPriceRoom.price).toLocaleString("en-IN") : "—"}
                  </span>
                  <span className="text-[11px] text-gray-500">+ taxes/night</span>
                </div>

                <div className="mt-2.5 space-y-1 border-t border-gray-100 pt-2.5 text-[11px] font-semibold text-emerald-700">
                  <div className="flex items-center gap-1.5">
                    <Check size={12} />
                    Free Cancellation
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={12} />
                    Rooms available
                  </div>
                </div>

                {/* MAIN BOOK NOW */}
                {lowestPriceRoom ? (
                  <Link
                    href={getBookingUrl(lowestPriceRoom)}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#C87532] py-2.5 sm:py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#B96928]"
                  >
                    Book Now
                    <ArrowRight size={13} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl bg-[#C87532] py-2.5 sm:py-3 text-xs font-bold text-white opacity-50"
                  >
                    Book Now
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>

              {/* DEPOSIT */}
              <div className="rounded-xl border border-[#C87532]/20 bg-[#C87532]/5 p-2.5 sm:p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-[#C87532]/10 shrink-0">
                    <ShieldCheck size={15} className="text-[#C87532]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#172033]">Pay 35% Deposit</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500">Deposit details confirmed during checkout.</p>
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
            <strong className="font-bold text-[#0B3B32]">About this stay:</strong>{" "}
            {property.description}
          </div>
        </div>
      </section>

      {/* NAV TABS */}
      <section className="sticky top-0 z-20 mt-3 border-b border-gray-200 bg-[#F7F5F0]/95 px-3 backdrop-blur-md sm:px-6 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-5 overflow-x-auto text-xs font-bold text-gray-600 no-scrollbar">
            {["Overview", "Rooms", "Amenities", "Cancellation", "Policies", "Reviews"].map((tab) => (
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
          <section id="overview" className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-sm">
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#C87532]">
              Stay details
            </p>
            <h2 className="mt-0.5 text-base font-bold text-[#0B3B32]">
              Plan your stay at {property.name}
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-gray-600">
              {property.description}
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg bg-[#F7F5F0] p-2.5">
                <MapPin size={14} className="text-[#0B3B32] shrink-0" />
                <div>
                  <p className="text-[9px] font-bold uppercase text-gray-400">Location</p>
                  <p className="text-xs font-semibold text-gray-700">{property.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-[#F7F5F0] p-2.5">
                <Footprints size={14} className="text-[#0B3B32] shrink-0" />
                <div>
                  <p className="text-[9px] font-bold uppercase text-gray-400">Distance</p>
                  <p className="text-xs font-semibold text-gray-700">{property.distance}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ROOMS */}
          <section id="rooms" className="scroll-mt-20 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-700">
                <span className="h-0.5 w-4 bg-amber-700" />
                Accommodation
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0B3B32]">Select Your Retreat</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Choose your preferred room type at {property.name}.
              </p>
            </div>

            <div className="space-y-3">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))
              ) : (
                <div className="rounded-xl border border-gray-200 bg-white p-5 text-center text-xs sm:text-sm text-gray-500">
                  No rooms available for this property.
                </div>
              )}
            </div>
          </section>

          {/* ABOUT PROPERTY */}
          <section className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-[#0B3B32]">About {property.name}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{property.description}</p>

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
          <section id="amenities" className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-[#0B3B32]">Amenities at {property.name}</h2>
            {amenities.length > 0 ? (
              <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-1.5 rounded-lg bg-[#F7F5F0] p-2 text-xs font-medium text-gray-700"
                  >
                    <AmenityIcon name={amenity} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-gray-500">Amenity information will be available soon.</p>
            )}
          </section>

          {/* POLICIES */}
          <section id="policies" className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-[#0B3B32]">Policies at {property.name}</h2>
            <div className="mt-2.5 divide-y divide-gray-100 text-xs">
              <PolicyRow title="Cancellation" text={policies.cancellation} />
              <PolicyRow title="Payment" text={policies.payment} />
              <PolicyRow title="Parking" text={policies.parking} />
            </div>
          </section>

          {/* REVIEWS */}
          <section id="reviews" className="scroll-mt-20 rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Guest feedback</p>
                <h2 className="mt-0.5 text-base sm:text-lg font-bold text-[#0B3B32]">Reviews for {property.name}</h2>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-[#172033]">{property.rating}</span>
                <div>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        fill={star <= Math.round(ratingNumber) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="mt-0.5 text-[10px] text-gray-500">Based on {property.reviews} reviews</p>
                </div>
              </div>
            </div>
          </section>

          {/* SUPPORT */}
          <section className="rounded-xl bg-[#0B3B32] p-3.5 sm:p-4 text-white shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold">Planning your stay at {property.name}?</h3>
                <p className="text-[11px] text-white/70">Our team can assist with instant room reservations.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/contact?hotel=${encodeURIComponent(property.name)}&location=${encodeURIComponent(property.location)}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#0B3B32] transition hover:bg-gray-100"
                >
                  Get Quote
                  <ArrowRight size={13} />
                </Link>

                <a
                  href={`https://wa.me/919205299338?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  WhatsApp
                  <MessageCircle size={13} />
                </a>
              </div>
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}

/* ============================================================
   ROOM CARD
============================================================ */

function RoomCard({ room }) {
  const propertyUrl = `/booking?type=stay&property_id=${encodeURIComponent(
    room.id
  )}&property_name=${encodeURIComponent(room.name)}`;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 shadow-sm transition hover:border-gray-300">
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#0B3B32]">
            {room.name}
          </h3>

          {room.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {room.description}
            </p>
          )}

          {/* ROOM FEATURES */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {room.bed && (
              <RoomFeature
                icon={<BedDouble size={11} />}
                text={room.bed}
              />
            )}

            {room.guests && (
              <RoomFeature
                icon={<Users size={11} />}
                text={`Up to ${room.guests} guests`}
              />
            )}

            {room.size && (
              <RoomFeature text={room.size} />
            )}
          </div>

          {room.cancellation && (
            <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <Check size={12} />
              {room.cancellation}
            </div>
          )}
        </div>

        {/* PRICE + BOOK */}
        <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-gray-100 pt-2.5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
              Per night
            </p>

            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                ₹{Number(room.price).toLocaleString("en-IN")}
              </span>

              <span className="text-[11px] text-gray-500">
                /night
              </span>
            </div>

            <p className="text-[9px] sm:text-[10px] text-gray-400">
              + applicable taxes
            </p>
          </div>

          <Link
            href={propertyUrl}
            className="inline-flex items-center gap-1 rounded-lg bg-[#C87532] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#B96928]"
          >
            Select & Book
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function RoomFeature({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-[#EDF4F2] px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase text-[#0B3B32]">
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
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold ${styles[variant]}`}
    >
      {icon}
      {text}
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-[#F7F5F0] p-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C87532]/10 text-[#C87532] shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-[9px] font-bold uppercase text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 text-xs font-semibold text-[#172033]">
          {value}
        </p>
      </div>
    </div>
  );
}

function PolicyRow({ title, text }) {
  if (!text) return null;

  return (
    <div className="py-1.5 first:pt-0 last:pb-0">
      <h4 className="font-bold text-gray-900 text-xs">
        {title}
      </h4>

      <p className="mt-0.5 text-gray-600 text-[11px] leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function AmenityIcon({ name }) {
  const lower = name.toLowerCase();

  if (lower.includes("wifi")) {
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

function formatTime(time) {
  if (!time) return "12 PM";

  return time
    .replace(":00 PM", " PM")
    .replace(":00 AM", " AM");
}