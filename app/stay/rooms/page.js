
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  Hotel,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";

/* -------------------------------------------------------
   CATEGORIES
------------------------------------------------------- */

const categories = [
  { id: "all", label: "All Rooms" },
  { id: "luxury", label: "Luxury" },
  { id: "deluxe", label: "Deluxe" },
  { id: "family", label: "Family" },
  { id: "cottage", label: "Cottages" },
];

/* -------------------------------------------------------
   ROOMS DATA
------------------------------------------------------- */

const rooms = [
  {
    id: "luxury-forest-room",
    name: "Luxury Forest Room",
    category: "luxury",
    tag: "Premium Stay",
    location: "Jim Corbett, Uttarakhand",
    price: 6499,
    priceUnit: "per night",
    guests: 2,
    bedrooms: "1 Bedroom",
    image: "/stay/rooms-1.webp",
    images: ["/stay/rooms-1.webp"],
    description:
      "Enjoy a relaxing forest-inspired stay with comfortable interiors and a peaceful atmosphere near Jim Corbett.",
    features: [
      "Comfortable king-size bed",
      "Air-conditioned room",
      "Attached bathroom",
      "Seating area",
      "Room service",
      "Nature-inspired surroundings",
    ],
    highlights: ["Couples", "Premium comfort"],
  },
  {
    id: "deluxe-nature-room",
    name: "Deluxe Nature Room",
    category: "deluxe",
    tag: "Guest Favourite",
    location: "Jim Corbett, Uttarakhand",
    price: 4499,
    priceUnit: "per night",
    guests: 2,
    bedrooms: "1 Bedroom",
    image: "/stay/rooms-2.webp",
    images: ["/stay/rooms-2.webp"],
    description:
      "A comfortable accommodation option for travellers looking for a refreshing getaway with practical amenities and a relaxed setting.",
    features: [
      "Comfortable double bed",
      "Air-conditioned room",
      "Attached bathroom",
      "Wardrobe",
      "Seating space",
      "Daily housekeeping",
    ],
    highlights: ["Couples", "Short getaways"],
  },
  {
    id: "cozy-resort-room",
    name: "Cozy Resort Room",
    category: "deluxe",
    tag: "Comfort Stay",
    location: "Jim Corbett, Uttarakhand",
    price: 3499,
    priceUnit: "per night",
    guests: 2,
    bedrooms: "1 Bedroom",
    image: "/stay/rooms-3.webp",
    images: ["/stay/rooms-3.webp"],
    description:
      "A welcoming room option for guests who want a comfortable base for exploring the Corbett region.",
    features: [
      "Comfortable bed",
      "Attached bathroom",
      "Air-conditioning",
      "Storage space",
      "Seating area",
      "Essential room amenities",
    ],
    highlights: ["Couples", "Value stay"],
  },
  {
    id: "family-room",
    name: "Family Comfort Room",
    category: "family",
    tag: "Family Friendly",
    location: "Jim Corbett, Uttarakhand",
    price: 5499,
    priceUnit: "per night",
    guests: 4,
    bedrooms: "Family Room",
    image: "/stay/rooms-4.webp",
    images: ["/stay/rooms-4.webp"],
    description:
      "A family-friendly room option with additional guest capacity and space to relax after a day of activities.",
    features: [
      "Family-friendly layout",
      "Comfortable bedding",
      "Attached bathroom",
      "Air-conditioning",
      "Storage space",
      "Space for family luggage",
    ],
    highlights: ["Families", "Group trips"],
  },
  {
    id: "forest-cottage",
    name: "Forest View Cottage",
    category: "cottage",
    tag: "Nature Escape",
    location: "Jim Corbett, Uttarakhand",
    price: 7499,
    priceUnit: "per night",
    guests: 3,
    bedrooms: "Private Cottage",
    image: "/stay/rooms-5.webp",
    images: ["/stay/rooms-5.webp"],
    description:
      "Enjoy a cottage-style stay with a nature-inspired atmosphere and a little more privacy.",
    features: [
      "Private cottage-style accommodation",
      "Comfortable bedding",
      "Attached bathroom",
      "Relaxing seating space",
      "Nature-inspired setting",
      "Ideal for a peaceful getaway",
    ],
    highlights: ["Nature lovers", "Quiet getaway"],
  },
  {
    id: "balcony-room",
    name: "Balcony Retreat Room",
    category: "luxury",
    tag: "Relax & Unwind",
    location: "Jim Corbett, Uttarakhand",
    price: 5999,
    priceUnit: "per night",
    guests: 2,
    bedrooms: "1 Bedroom",
    image: "/stay/rooms-6.webp",
    images: ["/stay/rooms-6.webp"],
    description:
      "A relaxing room option for travellers who want a comfortable stay and a place to unwind during their Corbett getaway.",
    features: [
      "Comfortable double bed",
      "Private balcony where available",
      "Attached bathroom",
      "Air-conditioning",
      "Seating space",
      "Storage space",
    ],
    highlights: ["Couples", "Relaxing breaks"],
  },
];

/* -------------------------------------------------------
   PAGE HIGHLIGHTS
------------------------------------------------------- */

const roomHighlights = [
  {
    icon: Hotel,
    title: "Stay Options",
    description: "Explore room and cottage options.",
  },
  {
    icon: BedDouble,
    title: "Comfortable Rooms",
    description: "Choose a stay that suits your trip.",
  },
  {
    icon: ShieldCheck,
    title: "Enquiry Assistance",
    description: "Get help choosing your accommodation.",
  },
  {
    icon: MessageCircle,
    title: "Direct Contact",
    description: "Discuss your requirements with our team.",
  },
];

/* -------------------------------------------------------
   FAQ DATA
------------------------------------------------------- */

const faqs = [
  {
    question: "How can I book a room?",
    answer:
      "Choose a room and click Book Now to continue to the booking page. You can also use Enquiry to share your requirements with the Destination Corbett team.",
  },
  {
    question: "Are the displayed prices final?",
    answer:
      "The displayed prices are indicative starting prices. Final pricing and availability may vary by property, room type, travel dates, occupancy and inclusions. Confirm the final quote before booking.",
  },
  {
    question: "Can I enquire about a family stay?",
    answer:
      "Yes. Open a room's details and select Enquire Now. Share your travel dates, number of guests and room requirements so the team can help you find a suitable option.",
  },
  {
    question: "Are meals and safari bookings included?",
    answer:
      "Inclusions depend on the selected property and package. Meals, safari permits, transfers and other services should be confirmed separately before you finalise your booking.",
  },
];

/* -------------------------------------------------------
   HELPERS
------------------------------------------------------- */

function normalisePhoneNumber(value = "") {
  let digits = String(value).replace(/\D/g, "");

  if (!digits) return "";

  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  return digits;
}

function getWhatsAppUrl(phone, message) {
  const number = normalisePhoneNumber(phone);

  if (!number) return "";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function formatINR(amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "Price on request";
  }

  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function getEnquiryUrl(room) {
  const params = new URLSearchParams({
    type: "stay",
    hotel: room.name,
    hotelImage: room.image,
    location: room.location,
    room_type: room.name,
    guests: String(room.guests),
  });

  return `/contact?${params.toString()}`;
}

function getBookingUrl(room) {
  const params = new URLSearchParams({
    type: "stay",
    property_name: room.name,
    room_name: room.name,
    room_type: room.name,
    location: room.location,
    price: String(room.price),
    guests: String(room.guests),
  });

  return `/booking?${params.toString()}`;
}

/* -------------------------------------------------------
   ROOMS PAGE
------------------------------------------------------- */

export default function RoomsPage() {
  const organisationResult = useOrganisationProfile() || {};

  const organisation = useMemo(
    () =>
      organisationResult.profile ||
      organisationResult.organisationProfile ||
      organisationResult.data ||
      organisationResult.organisation ||
      organisationResult,
    [organisationResult]
  );

  const phone =
    organisation?.phone ||
    organisation?.phoneNumber ||
    organisation?.contactNumber ||
    organisation?.mobile ||
    organisation?.contact?.phone ||
    "";

  const whatsapp =
    organisation?.whatsapp ||
    organisation?.whatsappNumber ||
    organisation?.whatsapp_number ||
    organisation?.contact?.whatsapp ||
    phone;

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const filteredRooms = useMemo(() => {
    if (activeCategory === "all") return rooms;

    return rooms.filter((room) => room.category === activeCategory);
  }, [activeCategory]);

  const selectedImages = selectedRoom
    ? selectedRoom.images?.length
      ? selectedRoom.images
      : [selectedRoom.image]
    : [];

  const currentImage =
    selectedImages[activeImageIndex] ||
    selectedRoom?.image ||
    "/stay/rooms-hero.webp";

  function openRoom(room) {
    setSelectedRoom(room);
    setActiveImageIndex(0);
  }

  function closeRoom() {
    setSelectedRoom(null);
    setActiveImageIndex(0);
  }

  function nextImage() {
    if (!selectedImages.length) return;

    setActiveImageIndex(
      (current) => (current + 1) % selectedImages.length
    );
  }

  function previousImage() {
    if (!selectedImages.length) return;

    setActiveImageIndex(
      (current) =>
        (current - 1 + selectedImages.length) % selectedImages.length
    );
  }

  useEffect(() => {
    if (!selectedRoom) return undefined;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") closeRoom();
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") previousImage();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom]);

  const generalWhatsAppUrl = getWhatsAppUrl(
    whatsapp,
    "Hello Destination Corbett, I would like to enquire about room availability and stay options."
  );

  const selectedRoomWhatsAppUrl = selectedRoom
    ? getWhatsAppUrl(
        whatsapp,
        `Hello Destination Corbett, I am interested in ${selectedRoom.name} in ${selectedRoom.location}. Please share availability and final pricing.`
      )
    : "";

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
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
      Rooms &amp; Stays
    </span>
  </div>
</nav>
{/* ================= COMPACT HERO ================= */}
<section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
  <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
    {/* Hero Image */}
    <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
      <Image
        src="/stay/rooms-hero.webp"
        alt="Stay and accommodation options in Jim Corbett"
        fill
        priority
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
          <Sparkles className="h-3 w-3 text-[#E0924F]" />
          Stay Your Way
        </div>

        <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Rooms &amp;{" "}
          <span className="text-[#E0924F]">Stays</span>
        </h1>

        <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
          Find your comfortable stay for your next Jim Corbett getaway.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href="#available-rooms"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
          >
            Explore Rooms
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ROOM LIST */}
      <section
        id="available-rooms"
        className="mx-auto max-w-6xl scroll-mt-20 px-3 pb-8 sm:px-5 sm:pb-10 md:px-6 md:pb-12"
      >
        <div className="mb-3 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B96928] sm:text-xs">
              Find your stay
            </p>

            <h2 className="mt-1 text-lg font-bold sm:text-2xl">
              Choose Your Room
            </h2>

            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              Select a room image to view full details.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500 sm:text-sm">
            {filteredRooms.length}{" "}
            {filteredRooms.length === 1 ? "option" : "options"}
          </span>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1.5">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                  isActive
                    ? "border-[#B96928] bg-[#B96928] text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#B96928] hover:text-[#B96928]"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* ROOM CARDS */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <article
                key={room.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:rounded-2xl"
              >
                {/* CLICKABLE IMAGE */}
                <button
                  type="button"
                  onClick={() => openRoom(room)}
                  aria-label={`View details for ${room.name}`}
                  className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B96928]"
                >
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

                  <span className="absolute left-1.5 top-1.5 max-w-[calc(100%-12px)] truncate rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-[#8b4b20] shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:text-xs">
                    {room.tag}
                  </span>

                  <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[9px] font-semibold text-white backdrop-blur-sm sm:bottom-3 sm:right-3 sm:px-2.5 sm:py-1.5 sm:text-xs">
                    View Details
                    <ArrowRight size={11} />
                  </span>
                </button>

                {/* CARD CONTENT */}
                <div className="flex flex-1 flex-col p-2 sm:p-3.5">
                  <h3 className="line-clamp-2 min-h-9 text-xs font-bold leading-4 text-[#172033] sm:min-h-0 sm:text-base sm:leading-5">
                    {room.name}
                  </h3>

                  <p className="mt-1 flex items-start gap-1 text-[9px] leading-3.5 text-slate-500 sm:text-xs sm:leading-4">
                    <MapPin
                      size={12}
                      className="mt-0.5 shrink-0 text-[#B96928]"
                    />
                    <span className="line-clamp-2">{room.location}</span>
                  </p>

                  <div className="mt-2.5 border-t border-slate-100 pt-2.5 sm:mt-3 sm:pt-3">
                    <p className="text-[9px] text-slate-500 sm:text-xs">
                      Starting from
                    </p>

                    <div className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-1 gap-y-0.5">
                      <p className="text-sm font-extrabold text-[#B96928] sm:text-xl">
                        {formatINR(room.price)}
                      </p>

                      <span className="flex shrink-0 items-center gap-1 text-[9px] text-slate-600 sm:text-xs">
                        <Users size={12} />
                        {room.guests} guests
                      </span>
                    </div>

                    <p className="mt-0.5 text-[9px] text-slate-500 sm:text-xs">
                      {room.priceUnit}
                    </p>
                  </div>

                  {/* BOTH BUTTONS: SAME ROW, SAME SIZE */}
                  <div className="mt-auto grid grid-cols-2 gap-1.5 pt-2.5 sm:gap-2 sm:pt-3">
                    <Link
                      href={getBookingUrl(room)}
                      className="inline-flex min-h-9 min-w-0 items-center justify-center gap-1 rounded-lg bg-[#B96928] px-1.5 py-2 text-center text-[10px] font-bold text-white transition hover:bg-[#9f5720] sm:min-h-10 sm:px-2 sm:text-sm"
                    >
                      <CalendarDays size={13} className="shrink-0" />
                      <span>Book Now</span>
                    </Link>

                    <Link
                      href={getEnquiryUrl(room)}
                      className="inline-flex min-h-9 min-w-0 items-center justify-center gap-1 rounded-lg border border-[#B96928]/40 bg-white px-1.5 py-2 text-center text-[10px] font-bold text-[#9f5720] transition hover:bg-orange-50 sm:min-h-10 sm:px-2 sm:text-sm"
                    >
                      <MessageCircle size={13} className="shrink-0" />
                      <span>Enquiry</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <Hotel className="mx-auto text-slate-400" size={30} />

            <h3 className="mt-3 font-bold">No rooms found</h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another category to see available options.
            </p>

            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="mt-4 rounded-xl bg-[#B96928] px-4 py-2 text-sm font-semibold text-white"
            >
              View All Rooms
            </button>
          </div>
        )}
      </section>

      {/* WHY DESTINATION CORBETT */}
      <section className="border-y border-slate-200/80 bg-white px-3 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-5 max-w-2xl text-center sm:mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B96928] sm:text-xs">
              Stay with confidence
            </p>

            <h2 className="mt-2 text-lg font-bold sm:text-2xl">
              Why Destination Corbett?
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
              Explore your options and get assistance with your stay enquiry.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {roomHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-[#F7F5F0]/70 p-3 sm:rounded-2xl sm:p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-[#B96928] sm:h-10 sm:w-10 sm:rounded-xl">
                    <Icon size={18} />
                  </div>

                  <h3 className="mt-2.5 text-xs font-bold sm:mt-3 sm:text-base">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-slate-600 sm:text-sm sm:leading-5">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-3 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 text-center">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-[#B96928] sm:h-10 sm:w-10">
              <CircleHelp size={20} />
            </div>

            <h2 className="mt-3 text-lg font-bold sm:text-2xl">
              Frequently Asked Questions
            </h2>

            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Helpful information before choosing your stay.
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left sm:px-4 sm:py-4"
                  >
                    <span className="text-xs font-semibold text-[#172033] sm:text-base">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-[#B96928] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-3.5 py-3.5 text-xs leading-5 text-slate-600 sm:px-4 sm:py-4 sm:text-sm sm:leading-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-3 pb-8 sm:px-6 sm:pb-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 rounded-2xl bg-[#172033] p-4 sm:flex-row sm:items-center sm:gap-4 sm:rounded-3xl sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-white sm:text-2xl">
              Need help choosing a room?
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-white/75 sm:mt-2 sm:text-sm sm:leading-6">
              Share your travel dates and guest count with our team to discuss
              suitable stay options.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            {generalWhatsAppUrl ? (
              <a
                href={generalWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#1fb85a] sm:flex-none sm:rounded-xl sm:px-4 sm:text-sm"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
            ) : (
              <Link
                href="/contact?type=stay"
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#B96928] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#9f5720] sm:flex-none sm:rounded-xl sm:px-4 sm:text-sm"
              >
                <MessageCircle size={16} />
                Send Enquiry
              </Link>
            )}

            {phone && (
              <a
                href={`tel:${String(phone).replace(/[^\d+]/g, "")}`}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/25 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 sm:flex-none sm:rounded-xl sm:px-4 sm:text-sm"
              >
                <Phone size={15} />
                Call Us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* SAME-PAGE ROOM DETAILS POPUP */}
      {selectedRoom && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0b1220]/70 p-2 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeRoom();
          }}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-modal-title"
            className="relative flex max-h-[88dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[82dvh] sm:rounded-2xl"
          >
            {/* POPUP HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-2 sm:px-5 sm:py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-[#B96928] sm:h-8 sm:w-8">
                  <Hotel size={16} />
                </span>

                <span className="truncate text-xs font-bold text-[#172033] sm:text-base">
                  Room Details
                </span>
              </div>

              <button
                type="button"
                onClick={closeRoom}
                aria-label="Close room details"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 sm:h-9 sm:w-9"
              >
                <X size={18} />
              </button>
            </div>

            {/* SCROLLABLE POPUP CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr]">
                {/* ROOM IMAGE */}
                <div className="p-2.5 sm:p-4">
                  <div className="relative mx-auto aspect-[16/9] max-h-[190px] overflow-hidden rounded-xl bg-slate-100 sm:aspect-[4/3] sm:max-h-[280px] md:max-h-none">
                    <Image
                      key={currentImage}
                      src={currentImage}
                      alt={selectedRoom.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover"
                      priority
                    />

                    <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#8b4b20] shadow-sm sm:left-3 sm:top-3 sm:text-xs">
                      {selectedRoom.tag}
                    </div>

                    {selectedImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={previousImage}
                          aria-label="Previous image"
                          className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={nextImage}
                          aria-label="Next image"
                          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                        >
                          <ChevronRight size={18} />
                        </button>

                        <div className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white">
                          {activeImageIndex + 1} / {selectedImages.length}
                        </div>
                      </>
                    )}
                  </div>

                  {selectedImages.length > 1 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto">
                      {selectedImages.map((image, index) => (
                        <button
                          type="button"
                          key={`${image}-${index}`}
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={`Show image ${index + 1}`}
                          className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 sm:h-14 sm:w-[4.5rem] ${
                            activeImageIndex === index
                              ? "border-[#B96928]"
                              : "border-transparent"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${selectedRoom.name} image ${index + 1}`}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 hidden rounded-xl bg-[#F7F5F0] p-3 md:block">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#172033]">
                      <ShieldCheck size={16} className="text-[#B96928]" />
                      Need help with your stay?
                    </div>

                    <p className="mt-1 text-xs leading-4 text-slate-600">
                      Confirm dates, room availability and final pricing before
                      booking.
                    </p>
                  </div>
                </div>

                {/* FULL ROOM DETAILS */}
                <div className="px-3 pb-3 pt-0 sm:px-4 sm:pb-4 sm:pt-1 md:py-4 md:pr-5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#9f5720] sm:text-[10px]">
                    <Sparkles size={11} />

                    {categories.find(
                      (category) => category.id === selectedRoom.category
                    )?.label || "Stay"}
                  </span>

                  <h2
                    id="room-modal-title"
                    className="mt-2 text-lg font-extrabold leading-tight text-[#172033] sm:mt-2.5 sm:text-2xl"
                  >
                    {selectedRoom.name}
                  </h2>

                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
                    <MapPin size={14} className="shrink-0 text-[#B96928]" />
                    {selectedRoom.location}
                  </p>

                  {/* PRICE */}
                  <div className="mt-3 rounded-xl border border-orange-100 bg-[#FFF9F3] p-3 sm:mt-4 sm:p-4">
                    <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
                      Starting price
                    </p>

                    <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                      <span className="text-xl font-extrabold text-[#B96928] sm:text-3xl">
                        {formatINR(selectedRoom.price)}
                      </span>

                      <span className="text-[10px] text-slate-500 sm:text-xs">
                        / {selectedRoom.priceUnit}
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
                      Final rate and availability must be confirmed for your
                      travel dates.
                    </p>
                  </div>

                  {/* ROOM FACTS */}
                  <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-3">
                    <div className="rounded-lg border border-slate-200 p-2.5 sm:rounded-xl sm:p-3">
                      <Users size={16} className="text-[#B96928]" />

                      <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                        Guest capacity
                      </p>

                      <p className="mt-0.5 text-xs font-bold sm:text-sm">
                        Up to {selectedRoom.guests} guests
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-2.5 sm:rounded-xl sm:p-3">
                      <BedDouble size={16} className="text-[#B96928]" />

                      <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                        Room type
                      </p>

                      <p className="mt-0.5 text-xs font-bold sm:text-sm">
                        {selectedRoom.bedrooms}
                      </p>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mt-3">
                    <h3 className="text-xs font-bold text-[#172033] sm:text-sm">
                      About this room
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                      {selectedRoom.description}
                    </p>
                  </div>

                  {/* FACILITIES */}
                  <div className="mt-3">
                    <h3 className="text-xs font-bold text-[#172033] sm:text-sm">
                      Room facilities
                    </h3>

                    <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">
                      {selectedRoom.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-1.5 text-xs leading-4 text-slate-600"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                            <Check size={10} />
                          </span>

                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HIGHLIGHTS */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedRoom.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-600 sm:text-xs"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#F7F5F0] p-2.5 md:hidden">
                    <Clock
                      size={15}
                      className="mt-0.5 shrink-0 text-[#B96928]"
                    />

                    <p className="text-[10px] leading-4 text-slate-600">
                      Confirm your dates, final room price and availability
                      before booking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* STICKY ACTIONS: EQUAL WIDTH AND HEIGHT */}
            <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-2.5 pb-[max(10px,env(safe-area-inset-bottom))] sm:px-4 sm:py-3">
              <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:gap-3">
                <Link
                  href={getBookingUrl(selectedRoom)}
                  className="inline-flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-2 py-2.5 text-center text-xs font-bold text-white transition hover:bg-[#9f5720] sm:min-h-11 sm:rounded-xl sm:text-sm"
                >
                  <CalendarDays size={15} className="shrink-0" />
                  <span>Book Now</span>
                </Link>

                <Link
                  href={getEnquiryUrl(selectedRoom)}
                  className="inline-flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-[#B96928]/40 bg-white px-2 py-2.5 text-center text-xs font-bold text-[#9f5720] transition hover:bg-orange-50 sm:min-h-11 sm:rounded-xl sm:text-sm"
                >
                  <MessageCircle size={15} className="shrink-0" />
                  <span>Enquire Now</span>
                </Link>
              </div>

              {selectedRoomWhatsAppUrl && (
                <a
                  href={selectedRoomWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mx-auto mt-2 flex w-fit items-center justify-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-[#128C7E] sm:text-xs"
                >
                  <MessageCircle size={13} />
                  Ask about this room on WhatsApp
                </a>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
