
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";
import {
  ArrowRight,
  Sparkles,
  Hotel,
  CheckCircle2,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Plus,
  PhoneCall,
  SlidersHorizontal,
  Users,
  MessageCircle,
  BedDouble,
} from "lucide-react";

// ================= ROOM DATA =================

const categories = [
  { id: "all", label: "All Rooms" },
  { id: "luxury", label: "Luxury Rooms" },
  { id: "deluxe", label: "Deluxe Rooms" },
  { id: "family", label: "Family Rooms" },
  { id: "cottage", label: "Cottages" },
];

const rooms = [
  {
    id: "luxury-forest-room",
    title: "Luxury Forest Room",
    category: "luxury",
    tag: "Luxury Stay",
    location: "Jim Corbett",
    price: "₹4,999",
    priceUnit: "per night",
    guests: "2–3 Guests",
    image: "/stay/rooms-1.webp",
    description:
      "Enjoy a relaxing stay with comfortable interiors and a nature-inspired atmosphere.",
    features: [
      "Comfortable bedding",
      "Attached bathroom",
      "Room service as per property policy",
    ],
  },
  {
    id: "deluxe-nature-room",
    title: "Deluxe Nature Room",
    category: "deluxe",
    tag: "Popular Choice",
    location: "Jim Corbett",
    price: "₹3,499",
    priceUnit: "per night",
    guests: "2–3 Guests",
    image: "/stay/rooms-2.webp",
    description:
      "A comfortable room option for couples and small groups exploring Corbett.",
    features: [
      "Comfortable sleeping space",
      "Attached bathroom",
      "Resort facilities as available",
    ],
  },
  {
    id: "cozy-resort-room",
    title: "Cozy Resort Room",
    category: "deluxe",
    tag: "Comfort Stay",
    location: "Jim Corbett",
    price: "₹2,999",
    priceUnit: "per night",
    guests: "2 Guests",
    image: "/stay/rooms-3.webp",
    description:
      "A practical stay option for guests looking for comfort during their Corbett trip.",
    features: [
      "Comfortable bed",
      "Private bathroom",
      "Property amenities as available",
    ],
  },
  {
    id: "family-room",
    title: "Family Room",
    category: "family",
    tag: "Family Favourite",
    location: "Jim Corbett",
    price: "₹5,499",
    priceUnit: "per night",
    guests: "4–5 Guests",
    image: "/stay/rooms-4.webp",
    description:
      "A spacious accommodation option for families travelling together.",
    features: [
      "Family-friendly layout",
      "Sleeping arrangements as confirmed",
      "Resort facilities as available",
    ],
  },
  {
    id: "forest-cottage",
    title: "Forest Cottage",
    category: "cottage",
    tag: "Nature Escape",
    location: "Jim Corbett",
    price: "₹6,499",
    priceUnit: "per night",
    guests: "2–4 Guests",
    image: "/stay/rooms-5.webp",
    description:
      "Enjoy a cottage-style stay for a relaxed break near the Corbett region.",
    features: [
      "Cottage-style accommodation",
      "Comfortable sleeping space",
      "Facilities as confirmed by the property",
    ],
  },
  {
    id: "balcony-room",
    title: "Balcony Room",
    category: "luxury",
    tag: "Relaxing Stay",
    location: "Jim Corbett",
    price: "₹4,499",
    priceUnit: "per night",
    guests: "2–3 Guests",
    image: "/stay/rooms-6.webp",
    description:
      "Choose a comfortable room with a balcony-style setting, subject to property details.",
    features: [
      "Comfortable bedding",
      "Balcony, subject to room confirmation",
      "Property facilities as available",
    ],
  },
];

// ================= HIGHLIGHTS =================

const roomHighlights = [
  {
    title: "Stay Options",
    description:
      "Explore room styles for couples, families and small groups.",
    icon: Hotel,
  },
  {
    title: "Comfortable Stays",
    description:
      "Compare accommodation options before choosing your room.",
    icon: BedDouble,
  },
  {
    title: "Custom Plans",
    description:
      "Share your dates, guest count and budget for suitable options.",
    icon: SlidersHorizontal,
  },
  {
    title: "Booking Assistance",
    description:
      "Confirm room availability, facilities and final pricing before booking.",
    icon: ShieldCheck,
  },
];

// ================= FAQ =================

const faqs = [
  {
    question: "How can I check room availability?",
    answer:
      "Choose your preferred room and travel dates, then use Book Now or Send an Enquiry to discuss availability.",
  },
  {
    question: "Are the displayed prices final?",
    answer:
      "Prices shown are indicative. The final quotation can vary by date, occupancy, room availability, meals and applicable taxes.",
  },
  {
    question: "Can I book a room for my family?",
    answer:
      "Yes. Select a suitable family room or contact our team with your guest count so that we can discuss appropriate options.",
  },
  {
    question: "Are meals included in the room price?",
    answer:
      "Meal inclusions vary by property and room plan. Confirm the final inclusions with our team before completing your booking.",
  },
];

// ================= CONTACT HELPERS =================

function normalisePhoneNumber(value) {
  let digits = String(value || "").replace(/\D/g, "");

  if (!digits) return "";

  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  return digits;
}

function getWhatsAppUrl(message, number) {
  const whatsappNumber = normalisePhoneNumber(number);

  if (!whatsappNumber) return "";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

function WhatsAppLink({
  message,
  number,
  className,
  children,
  label,
}) {
  const url = getWhatsAppUrl(message, number);

  return (
    <a
      href={url || undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label || "Contact us on WhatsApp"}
      aria-disabled={!url}
      onClick={(event) => {
        if (!url) event.preventDefault();
      }}
      className={`${className} ${
        !url ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      {children}
    </a>
  );
}

// ================= PAGE =================

export default function RoomsPage() {
  const { profile } = useOrganisationProfile();

  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  const whatsappNumber = profile?.whatsapp || profile?.phone || "";
  const contactPhone = normalisePhoneNumber(profile?.phone);

  const filteredRooms =
    activeCategory === "all"
      ? rooms
      : rooms.filter((room) => room.category === activeCategory);

  const chooseRoomMessage =
    "Hi Destination Corbett, please suggest suitable rooms based on my travel dates, guest count and budget.";

  const customStayMessage =
    "Hi Destination Corbett, I would like to enquire about room availability and stay options.";

  const finalEnquiryMessage =
    "Hi Destination Corbett, I want to plan my Jim Corbett stay. Please share suitable rooms and pricing.";

  function getEnquiryUrl(room) {
    const params = new URLSearchParams({
      type: "stay",
      hotel: room.title,
      hotelImage: room.image,
      location: room.location,
    });

    return `/contact?${params.toString()}`;
  }

  function getBookingUrl(room) {
    const params = new URLSearchParams({
      type: "stay",
      property_name: room.title,
      property_id: room.id,
    });

    return `/booking?${params.toString()}`;
  }

  return (
    <main className="bg-[#F7F5F0] text-[#172033]">
      {/* ================= HERO ================= */}

      <section className="px-2 py-2 sm:px-4 sm:py-4 md:px-6">
        <div className="relative mx-auto min-h-[260px] max-w-[1440px] overflow-hidden rounded-2xl bg-[#172033] text-white sm:min-h-[420px] sm:rounded-3xl lg:min-h-[500px]">
          <Image
            src="/stay/rooms-hero.webp"
            alt="Room and accommodation options in Jim Corbett"
            fill
            priority
            quality={70}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1440px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#172033]/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/55 to-[#172033]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/45 to-transparent" />

          <div className="relative z-10 flex min-h-[260px] items-center px-4 py-6 sm:min-h-[420px] sm:px-9 sm:py-12 lg:min-h-[500px] lg:px-14">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md sm:mb-4 sm:gap-2 sm:py-2 sm:text-sm">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Destination Corbett Stays
              </div>

              <h1 className="text-[1.6rem] font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Find Your Perfect Stay
                <span className="mt-0.5 block text-[#E6A76D] sm:mt-1">
                  Rooms, Comfort & Nature
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/90 sm:mt-4 sm:text-base sm:leading-7">
                Explore rooms for your Corbett trip. Choose an option or send
                us an enquiry for availability and pricing.
              </p>

              <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                <a
                  href="#room-list"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B96928] px-5 text-sm font-bold text-white transition hover:bg-[#9F5520] focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Explore Rooms
                  <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  href="/contact?type=stay"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Send an Enquiry
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 hidden flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/90 sm:flex">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#E6A76D]" />
                  Room Options
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#E6A76D]" />
                  Booking Assistance
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#E6A76D]" />
                  Flexible Choices
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROOM LIST ================= */}

      <section
        id="room-list"
        className="scroll-mt-20 px-4 py-6 sm:px-6 sm:py-10 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="hidden text-sm font-bold uppercase tracking-wider text-[#B96928] sm:block">
                Find Your Stay
              </p>

              <h2 className="text-xl font-bold leading-tight sm:mt-2 sm:text-3xl md:text-4xl">
                Explore Rooms
              </h2>

              <p className="mt-1 text-sm leading-5 text-[#4B5563] sm:mt-2 sm:text-base sm:leading-6">
                Compare room options and enquire about your preferred stay.
              </p>
            </div>

            <WhatsAppLink
              number={whatsappNumber}
              message={chooseRoomMessage}
              label="Get room recommendations on WhatsApp"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#172033] px-3.5 text-sm font-bold text-white transition hover:bg-[#26344D] sm:px-5"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help Me Choose</span>
              <span className="sm:hidden">Help</span>
            </WhatsAppLink>
          </div>

          {/* CATEGORY FILTER */}

          <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-5 sm:flex-wrap sm:px-0 sm:pb-2 [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const active = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  aria-pressed={active}
                  className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#B96928] focus:ring-offset-2 ${
                    active
                      ? "bg-[#B96928] text-white shadow-sm"
                      : "border border-black/10 bg-white text-[#374151] hover:border-[#B96928] hover:text-[#9F5520]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ROOM CARDS */}

          <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <article
                key={room.id}
                className="group flex min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition duration-200 hover:shadow-md sm:flex-col"
              >
                <Link
                  href={getEnquiryUrl(room)}
                  aria-label={`Enquire about ${room.title}`}
                  className="relative block w-[112px] shrink-0 self-stretch overflow-hidden bg-[#E8E3DA] sm:aspect-[16/9] sm:w-full sm:self-auto"
                >
                  <Image
                    src={room.image}
                    alt={room.title}
                    fill
                    quality={70}
                    sizes="(max-width: 639px) 112px, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-[#B96928] px-2 py-1 text-[10px] font-bold leading-none text-white shadow sm:px-2.5 sm:py-1.5 sm:text-xs">
                    {room.tag}
                  </span>
                </Link>

                <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                  <Link href={getEnquiryUrl(room)}>
                    <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#172033] hover:text-[#9F5520] sm:text-base">
                      {room.title}
                    </h3>
                  </Link>

                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#4B5563]">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-[#B96928]" />
                      {room.guests}
                    </span>

                    <span className="inline-flex min-w-0 items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B96928]" />
                      <span className="truncate">{room.location}</span>
                    </span>
                  </div>

                  <p className="mt-2 hidden text-sm leading-5 text-[#4B5563] sm:line-clamp-2">
                    {room.description}
                  </p>

                  <div className="mt-auto pt-3">
                    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                      <span className="text-[11px] font-semibold text-[#6B7280]">
                        From
                      </span>

                      <span className="text-lg font-bold text-[#172033] sm:text-xl">
                        {room.price}
                      </span>

                      <span className="text-xs text-[#6B7280]">
                        {room.priceUnit}
                      </span>
                    </div>

                    {/* MOBILE: BOOK NOW + WHATSAPP */}
                    {/* DESKTOP: ENQUIRE + BOOK NOW + WHATSAPP */}

                    <div className="mt-2 flex gap-2">
                      <Link
                        href={getEnquiryUrl(room)}
                        className="hidden min-h-11 items-center justify-center rounded-lg border border-[#172033]/20 px-4 text-sm font-bold text-[#172033] transition hover:bg-[#F7F5F0] sm:inline-flex"
                      >
                        Enquire
                      </Link>

                      <Link
                        href={getBookingUrl(room)}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-3 text-sm font-bold text-white transition hover:bg-[#9F5520] focus:outline-none focus:ring-2 focus:ring-[#B96928] focus:ring-offset-2"
                      >
                        <CalendarDays className="h-4 w-4" />
                        Book Now
                      </Link>

                      <WhatsAppLink
                        number={whatsappNumber}
                        message={`Hi Destination Corbett, I am interested in ${room.title}. Please share availability, final pricing and room details.`}
                        label={`Ask about ${room.title} on WhatsApp`}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#16794B]/30 bg-[#16794B]/5 text-[#126640] transition hover:bg-[#16794B]/10"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </WhatsAppLink>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="mt-4 rounded-xl border border-black/10 bg-white p-6 text-center sm:mt-6 sm:rounded-2xl sm:p-8">
              <p className="text-base font-semibold text-[#172033]">
                No rooms found.
              </p>

              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-3 min-h-11 rounded-xl bg-[#B96928] px-5 text-sm font-bold text-white hover:bg-[#9F5520] sm:mt-4"
              >
                View All Rooms
              </button>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-[#6B7280]">
            Prices are indicative. Confirm room availability, occupancy,
            inclusions and applicable taxes before booking.
          </p>
        </div>
      </section>

      {/* ================= WHY DESTINATION CORBETT ================= */}

      <section className="px-4 py-3 sm:px-6 sm:py-8 md:px-8">
  <div className="mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] px-4 py-4 text-white sm:px-6 sm:py-6">
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <div>
        <p className="hidden text-xs font-bold uppercase tracking-wider text-[#E6A76D] sm:block">
          Why Destination Corbett
        </p>

        <h2 className="text-lg font-bold leading-tight sm:mt-1 sm:text-2xl">
          Your Stay, Made Simpler
        </h2>

        <p className="mt-1.5 text-xs leading-5 text-white/80 sm:text-sm">
          Share your dates, guests and budget. We’ll help you find the right stay.
        </p>

        <WhatsAppLink
          number={whatsappNumber}
          message={customStayMessage}
          label="Request room options on WhatsApp"
          className="mt-3 inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-[#B96928] px-4 text-xs font-bold text-white transition hover:bg-[#9F5520] sm:text-sm"
        >
          Get Stay Options
          <ArrowRight className="h-3.5 w-3.5" />
        </WhatsAppLink>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {roomHighlights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.05] p-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B96928]/20 text-[#F0B77F]">
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xs font-bold sm:text-sm">
                  {item.title}
                </h3>

                <p className="mt-0.5 text-[11px] leading-4 text-white/70 sm:text-xs sm:leading-5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</section>

      {/* ================= FAQ ================= */}

      <section className="px-4 py-6 sm:px-6 sm:py-12 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="hidden text-sm font-bold uppercase tracking-wider text-[#B96928] sm:block">
              Need to Know?
            </p>

            <h2 className="text-xl font-bold sm:mt-2 sm:text-3xl">
              Room Booking FAQs
            </h2>
          </div>

          <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="rounded-xl border border-black/10 bg-white px-4 py-1.5 sm:p-5"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex min-h-11 w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="text-sm font-bold leading-5 text-[#172033] sm:text-base sm:leading-6">
                      {faq.question}
                    </span>

                    <Plus
                      className={`h-5 w-5 shrink-0 text-[#B96928] transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="pb-3 text-sm leading-6 text-[#4B5563] sm:mt-3 sm:pb-0">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}

      <section className="px-4 pb-8 sm:px-6 sm:pb-14 md:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl bg-[#172033] px-4 py-6 text-center text-white sm:px-8 sm:py-10">
          <p className="hidden text-sm font-bold uppercase tracking-wider text-[#E6A76D] sm:block">
            Let's Plan Your Corbett Stay
          </p>

          <h2 className="mx-auto max-w-2xl text-xl font-bold leading-tight sm:mt-2 sm:text-3xl">
            Find a Room That Fits Your Trip
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
            Share your travel dates and guest count to discuss suitable
            accommodation options.
          </p>

          <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2.5 sm:mt-6 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3">
            <Link
              href="/contact?type=stay"
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B96928] px-6 text-sm font-bold text-white transition hover:bg-[#9F5520] sm:col-span-1 sm:min-h-12"
            >
              Send an Enquiry
              <ArrowRight className="h-4 w-4" />
            </Link>

            <WhatsAppLink
              number={whatsappNumber}
              message={finalEnquiryMessage}
              label="Plan your Corbett stay on WhatsApp"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/20 sm:min-h-12 sm:px-6"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Now
            </WhatsAppLink>

            <a
              href={contactPhone ? `tel:+${contactPhone}` : undefined}
              aria-disabled={!contactPhone}
              onClick={(event) => {
                if (!contactPhone) event.preventDefault();
              }}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 px-5 text-sm font-bold text-white transition hover:bg-white/10 sm:min-h-12 sm:px-6 ${
                !contactPhone ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <PhoneCall className="h-4 w-4" />
              Call Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
