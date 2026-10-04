"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Hotel,
  Bus,
  CheckCircle2,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  Plus,
  PhoneCall,
  SlidersHorizontal,
  Check,
  Users,
} from "lucide-react";

// Package Categories Filter
const categories = [
  { id: "all", label: "All Packages" },
  { id: "safari", label: "Wildlife & Safari" },
  { id: "resort", label: "Luxury Resort Stays" },
  { id: "corporate", label: "Corporate & MICE" },
  { id: "family", label: "Family & Getaways" },
];

// Jim Corbett Packages Data
const packagesData = [
  {
    id: "corbett-wildlife-expedition",
    title: "Corbett Wildlife & Safari Expedition",
    category: "safari",
    tag: "Most Popular",
    duration: "2 Nights / 3 Days",
    groupSize: "2 - 6 Pax",
    location: "Bijrani & Garjiya Zones",
    price: "₹12,499",
    priceUnit: "per person",
    image: "/images/packages/safari-expedition.jpg",
    description:
      "Immerse yourself in the wilderness of Corbett with guaranteed jeep safari slots, premium resort stays, and guided nature trails.",
    inclusions: [
      "2 Nights Stay at 4-Star Riverside Resort",
      "1 Morning Jeep Safari + 1 Evening Zone Tour",
      "All Meals (Buffet Breakfast, Lunch & Dinner)",
      "Jeep Permits, Guide & Driver Charges Included",
      "Evening Bonfire with Live Folk Music",
    ],
  },

  {
    id: "luxury-resort-retreat",
    title: "Luxury Riverfront Resort Escape",
    category: "resort",
    tag: "Luxury Stay",
    duration: "3 Nights / 4 Days",
    groupSize: "2 - 8 Pax",
    location: "Kosi River Bank, Corbett",
    price: "₹18,999",
    priceUnit: "per person",
    image: "/images/packages/luxury-resort1.jpg",
    description:
      "Unwind in absolute luxury with private pool villas, spa therapy vouchers, gourmet dining, and exclusive riverfront experiences.",
    inclusions: [
      "3 Nights in Luxury Cottage / River View Villa",
      "1 Exclusive Jeep Safari (Dhikala / Bijrani)",
      "Daily Chef Special Buffet Meals & High Tea",
      "Complimentary Spa Massage Voucher",
      "Private Bonfire & Barbeque Dinner",
    ],
  },

  {
    id: "corporate-mice-retreat",
    title: "Corporate Leadership & Outing Retreat",
    category: "corporate",
    tag: "Corporate Special",
    duration: "2 Nights / 3 Days",
    groupSize: "15 - 100+ Pax",
    location: "Jim Corbett National Park",
    price: "₹14,500",
    priceUnit: "per delegate",
    image: "/images/packages/corporate-retreat1.jpg",
    description:
      "Seamlessly blend high-level corporate meetings with team building, safari adventures, and full-scale event production support.",
    inclusions: [
      "Conference Hall with AV & High-Speed Wi-Fi",
      "Group Accommodation in Luxury Resort",
      "Team Building Outdoor Activities & Games",
      "1 Exclusive Group Jeep Safari Tour",
      "Gala Dinner with Live DJ & Bar Setup",
    ],
  },

  {
    id: "dhikala-canter-adventure",
    title: "Dhikala Forest Zone Trail",
    category: "safari",
    tag: "Wildlife Special",
    duration: "1 Night / 2 Days",
    groupSize: "2 - 12 Pax",
    location: "Dhikala Core Zone",
    price: "₹8,999",
    priceUnit: "per person",
    image: "/images/packages/dhikala-zone.jpg",
    description:
      "Deep forest core zone experience designed for wildlife photographers, bird watchers, and nature lovers seeking tiger sightings.",
    inclusions: [
      "1 Night Accommodation inside Forest Rest House / Resort",
      "Canter Safari inside Dhikala Core Zone",
      "Forest Entry Permits & Forest Guide Fees",
      "All Meals & Tea / Snacks",
      "Pick-up & Drop from Ramnagar Station",
    ],
  },

  {
    id: "family-weekend-bonanza",
    title: "Family Weekend Wilderness Bonanza",
    category: "family",
    tag: "Best for Families",
    duration: "2 Nights / 3 Days",
    groupSize: "4 - 10 Pax",
    location: "Sitabani & Dhikuli",
    price: "₹10,999",
    priceUnit: "per person",
    image: "/images/packages/family-package.jpg",
    description:
      "A complete fun-filled family vacation packed with resort pool relaxation, elephant safari experiences, and cultural evenings.",
    inclusions: [
      "2 Nights Family Suite Accommodation",
      "1 Jeep Safari + Corbett Museum & Waterfalls Tour",
      "Kids Activity Zone Access & Swimming Pool",
      "All Buffet Meals (Breakfast, Lunch, Dinner)",
      "Local Transportation & Transfers",
    ],
  },

  {
    id: "adventure-thrill-seeker",
    title: "Corbett Adventure & River Rafting Package",
    category: "safari",
    tag: "Adventure Special",
    duration: "2 Nights / 3 Days",
    groupSize: "4 - 20 Pax",
    location: "Kosi River & Marchula",
    price: "₹11,800",
    priceUnit: "per person",
    image: "/images/packages/adventure-package.jpg",
    description:
      "Designed for thrill-seekers combining Kosi river rafting, ziplining, mountain trekking, and jungle safari into one trip.",
    inclusions: [
      "2 Nights Stay in Adventure Camp / Resort",
      "River Rafting & Zipline Activity",
      "1 Jungle Jeep Safari Tour",
      "Trekking & Nature Walk with Expert Guide",
      "Bonfire Nights with Music & Barbeque",
    ],
  },
];

const packageHighlights = [
  {
    title: "100% Guaranteed Safari Permits",
    description:
      "Hassle-free advance forest permits booked straight from official forest department portals.",
    icon: ShieldCheck,
  },
  {
    title: "Curated Resorts & Stays",
    description:
      "Handpicked 3-star, 4-star, and 5-star luxury resorts, eco-lodges, and riverside properties.",
    icon: Hotel,
  },
  {
    title: "Customizable Group Itineraries",
    description:
      "Tailor-made itineraries for families, couples, corporate MICE, and wildlife photographers.",
    icon: SlidersHorizontal,
  },
  {
    title: "End-to-End On-Ground Coordination",
    description:
      "Dedicated trip coordinator assigned from pick-up at Ramnagar to your return journey.",
    icon: Bus,
  },
];

const bookingSteps = [
  {
    number: "01",
    title: "Choose Your Package",
    description:
      "Select from safari tours, luxury resort getaways, or corporate retreat packages.",
  },
  {
    number: "02",
    title: "Customize & Reserve",
    description:
      "Pick your preferred dates, resort category, safari zones, and add-on activities.",
  },
  {
    number: "03",
    title: "Permit & Confirmation",
    description:
      "Receive instant booking confirmation and government forest safari permits.",
  },
  {
    number: "04",
    title: "Experience Jim Corbett",
    description:
      "Arrive in Corbett and enjoy seamless hospitality, safari tours, and nature stays.",
  },
];

const faqs = [
  {
    question: "What is included in a typical Corbett package?",
    answer:
      "Our packages generally include resort stay, all buffet meals (breakfast, lunch, dinner), jeep safari permits with guide and driver charges, bonfire evenings, and local transfers. Specific inclusions are listed under each package card.",
  },
  {
    question: "How early should I book jeep safari permits?",
    answer:
      "Forest permits for zones like Dhikala and Bijrani open 45 days in advance and fill up very fast. We recommend booking your package at least 30 to 45 days prior to your travel date.",
  },
  {
    question: "Can corporate and group packages be customized?",
    answer:
      "Yes! We offer 100% customized packages for corporate MICE, team outings, dealer meets, and family reunions including conference setups, stage production, team building, and custom meal menus.",
  },
  {
    question: "Are child policies and extra beds available?",
    answer:
      "Yes, children below 5 years are complimentary in most resorts. Children between 5 and 12 years are charged as per resort child policy. Extra beds/mattresses are provided upon request.",
  },
];

export default function PackagesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredPackages =
    activeCategory === "all"
      ? packagesData
      : packagesData.filter((pkg) => pkg.category === activeCategory);

  return (
    <main className="bg-[#F7F5F0] text-[#172033]">

      {/* ================= HERO ================= */}
      <section className="overflow-visible bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto min-h-[300px] max-w-[1440px] overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[420px] sm:rounded-[24px] md:min-h-[470px] md:rounded-[28px] lg:min-h-[560px]">

          <Image
            src="/images/packages/packages-hero.jpg"
            alt="Jim Corbett Tour Packages & Resort Stays"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 1440px"
            className="object-cover brightness-110"
          />

          <div className="absolute inset-0 bg-[#172033]/20" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/50 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/45 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[300px] items-center px-4 py-6 sm:min-h-[420px] sm:px-8 sm:py-10 md:min-h-[470px] md:px-10 lg:min-h-[560px] lg:px-14">

            <div className="max-w-2xl">

              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#C87532] backdrop-blur-xl sm:mb-4 sm:px-3 sm:py-1.5 sm:text-xs">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Corbett Tour & Resort Packages
              </div>

              <h1 className="max-w-2xl text-[28px] font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Curated Corbett Packages,
                <span className="mt-1 block text-[#C87532] sm:mt-2">
                  Designed for Every Journey.
                </span>
              </h1>

              <p className="mt-2 max-w-xl text-[11px] leading-5 text-white/75 sm:mt-4 sm:text-sm sm:leading-6 md:text-base md:leading-7">
                Discover all-inclusive Jim Corbett packages combining jeep
                safaris, luxury resort stays, gourmet dining, and corporate
                MICE arrangements. Handcrafted for families, couples, groups,
                and business retreats.
              </p>

              <div className="mt-4 flex flex-row flex-wrap gap-1.5 sm:mt-5 sm:gap-2">

                <a
                  href="#package-list"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-3.5 py-2 text-[10px] font-semibold text-white shadow-md transition hover:bg-[#B96928] sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Explore Packages
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[10px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Custom Plan Request
                </Link>

              </div>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-white/65 sm:mt-6 sm:gap-x-6 sm:text-xs">

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-[#C87532] sm:h-4 sm:w-4" />
                  Safari & Stays
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-[#C87532] sm:h-4 sm:w-4" />
                  Custom Packages
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-[#C87532] sm:h-4 sm:w-4" />
                  Group Experiences
                </span>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="px-4 py-9 sm:px-5 sm:py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-8">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
                Destination Corbett Packages
              </p>

              <h2 className="mt-1.5 text-[25px] font-semibold leading-tight sm:text-3xl md:text-4xl">
                Unforgettable Stay & Safari
                <br />
                <span className="text-[#C87532]">
                  Experiences in Corbett.
                </span>
              </h2>
            </div>

            <div className="rounded-xl border border-black/5 bg-white/70 p-4 shadow-sm backdrop-blur-xl sm:rounded-2xl sm:p-5">

              <p className="text-[11px] leading-5 text-black/60 sm:text-sm sm:leading-6">
                Whether you are seeking an adventurous tiger safari in core
                forest zones, a tranquil holiday at a riverside luxury resort,
                or an end-to-end corporate outing package, we bring together
                accommodation, permits, meals, transport, and on-ground
                assistance under one seamless itinerary.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ================= PACKAGES ================= */}
      <section
        id="package-list"
        className="scroll-mt-20 px-4 pb-9 sm:px-5 sm:pb-12 md:px-8 md:pb-14"
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
                Choose Your Experience
              </p>

              <h2 className="mt-1.5 text-[25px] font-semibold leading-tight sm:text-3xl">
                Featured Corbett Packages
              </h2>
            </div>

            {/* FILTER */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:justify-end sm:gap-2">

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold transition sm:px-4 sm:py-2 sm:text-xs ${
                    activeCategory === cat.id
                      ? "bg-[#C87532] text-white shadow-sm"
                      : "border border-black/10 bg-white text-black/65 hover:bg-black/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}

            </div>
          </div>

          {/* PACKAGE CARDS */}
          <div className="mt-5 grid gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">

            {filteredPackages.map((pkg) => (
              <article
                key={pkg.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                {/* IMAGE */}
                <div className="relative aspect-[16/10] overflow-hidden">

                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/85 via-[#172033]/15 to-transparent" />

                  {/* TAG */}
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-[#C87532] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-white shadow-md sm:text-[10px]">
                      {pkg.tag}
                    </span>
                  </div>

                  {/* IMAGE INFO */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 text-white">

                    <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-[9px] font-medium backdrop-blur-md sm:text-[10px]">
                      <Clock className="h-3 w-3 text-[#C87532]" />
                      {pkg.duration}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-[9px] font-medium backdrop-blur-md sm:text-[10px]">
                      <MapPin className="h-3 w-3 text-[#C87532]" />
                      {pkg.location}
                    </span>

                  </div>
                </div>

                {/* COMPACT CONTENT */}
                <div className="p-3.5 sm:p-4">

                  <h3 className="text-[14px] font-semibold leading-snug text-[#172033] sm:text-base">
                    {pkg.title}
                  </h3>

                  {/* GROUP SIZE */}
                  <div className="mt-2 flex flex-wrap gap-1.5">

                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F7F5F0] px-2 py-1 text-[9px] font-medium text-black/60 sm:text-[10px]">
                      <Users className="h-3 w-3 text-[#C87532]" />
                      {pkg.groupSize}
                    </span>

                    <span className="rounded-md bg-[#F7F5F0] px-2 py-1 text-[9px] font-medium text-black/60 sm:text-[10px]">
                      {pkg.category === "safari"
                        ? "Safari"
                        : pkg.category === "resort"
                        ? "Luxury Stay"
                        : pkg.category === "corporate"
                        ? "Corporate"
                        : "Family"}
                    </span>

                  </div>

                  {/* SHORT DESCRIPTION */}
                  <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-black/55 sm:text-[11px] sm:leading-5">
                    {pkg.description}
                  </p>

                  {/* VIEW DETAILS */}
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-[#C87532] transition hover:text-[#B96928] sm:text-xs"
                  >
                    View Full Details
                    <ArrowRight className="h-3 w-3" />
                  </Link>

                </div>

                {/* CARD FOOTER */}
                <div className="border-t border-black/5 bg-[#FAFAFA] p-3.5 sm:p-4">

                  <div className="flex items-center justify-between gap-3">

                    {/* PRICE */}
                    <div>

                      <span className="text-[8px] font-medium uppercase tracking-wide text-black/45 sm:text-[9px]">
                        Starting From
                      </span>

                      <div className="mt-0.5 flex items-baseline gap-1">

                        <span className="text-base font-bold text-[#172033] sm:text-lg">
                          {pkg.price}
                        </span>

                        <span className="text-[8px] text-black/45 sm:text-[9px]">
                          / {pkg.priceUnit}
                        </span>

                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-1.5 sm:gap-2">

                      <Link
                        href={`/packages/${pkg.id}`}
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#172033] bg-white px-3 text-[9px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white active:bg-[#172033] active:text-white sm:h-10 sm:px-4 sm:text-xs"
                      >
                        Details
                      </Link>

                      <Link
                        href={`/booking?type=package&package=${encodeURIComponent(pkg.id)}`}
                        className="inline-flex h-9 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-3 text-[9px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:h-10 sm:px-4 sm:text-xs"
                      >
                        <CalendarDays className="h-3 w-3" />
                        Book
                      </Link>

                    </div>

                  </div>

                </div>

              </article>
            ))}

          </div>

          {/* EMPTY STATE */}
          {filteredPackages.length === 0 && (
            <div className="mt-6 rounded-2xl border border-black/10 bg-white p-8 text-center">

              <p className="text-sm font-semibold text-[#172033]">
                No packages found.
              </p>

              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-3 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#B96928]"
              >
                View All Packages
              </button>

            </div>
          )}

        </div>
      </section>

      {/* ================= WHY BOOK ================= */}
      <section className="px-4 py-9 sm:px-5 sm:py-12 md:px-8 md:py-14">

        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-2xl bg-[#172033] px-4 py-5 text-white sm:px-6 sm:py-8 md:px-8 md:py-9">

            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C87532]/10 blur-3xl" />

            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#C87532]/10 blur-3xl" />

            <div className="relative z-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-8">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
                  Why Destination Corbett
                </p>

                <h2 className="mt-1.5 text-[25px] font-semibold leading-tight sm:text-3xl">
                  Seamless Booking.
                  <br />
                  <span className="text-[#C87532]">
                    Unmatched Hospitality.
                  </span>
                </h2>

                <p className="mt-2 max-w-lg text-[11px] leading-5 text-white/65 sm:text-sm sm:leading-6">
                  We eliminate the hassle of managing individual safari
                  permissions, resort availability, and local transfers by
                  giving you a unified, transparent package experience.
                </p>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#C87532] px-3.5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#B96928] sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Request Customized Quote
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Link>

              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">

                {packageHighlights.map((item) => {

                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-white/10 bg-white/[0.06] p-2.5 backdrop-blur-xl sm:p-4"
                    >

                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C87532]/15 text-[#C87532] sm:h-9 sm:w-9">
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>

                      <h3 className="mt-2 text-[10px] font-semibold leading-tight sm:text-xs">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-[9px] leading-4 text-white/55 sm:text-[10px] sm:leading-4">
                        {item.description}
                      </p>

                    </div>
                  );
                })}

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW BOOKING WORKS ================= */}
      <section className="bg-white px-4 py-9 sm:px-5 sm:py-12 md:px-8 md:py-14">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-10">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
                Simple Booking Flow
              </p>

              <h2 className="mt-1.5 text-[25px] font-semibold leading-tight sm:text-3xl">
                4 Easy steps to your
                <span className="text-[#C87532]">
                  {" "}Corbett getaway.
                </span>
              </h2>

              <p className="mt-2 max-w-md text-[11px] leading-5 text-black/60 sm:text-sm sm:leading-6">
                We simplify your travel planning so you can sit back, relax,
                and look forward to your jungle adventure.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-0">

              {bookingSteps.map((step, index) => (

                <div
                  key={step.number}
                  className="relative"
                >

                  {index < bookingSteps.length - 1 && (
                    <div className="absolute left-[30px] top-[13px] hidden h-px w-[calc(100%-18px)] bg-black/10 sm:block" />
                  )}

                  <div className="relative z-10">

                    <span className="text-base font-semibold leading-none text-[#C87532]/40 sm:text-xl">
                      {step.number}
                    </span>

                    <h3 className="mt-1.5 text-[11px] font-semibold leading-tight sm:text-sm">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-black/55 sm:text-[11px] sm:leading-5">
                      {step.description}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="px-4 py-9 sm:px-5 sm:py-12 md:px-8 md:py-14">

        <div className="mx-auto max-w-4xl">

          <div className="text-center">

            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
              Package FAQs
            </p>

            <h2 className="mt-1.5 text-[25px] font-semibold leading-tight sm:text-3xl">
              Frequently Asked Questions
            </h2>

          </div>

          <div className="mt-5 space-y-2.5 sm:mt-7 sm:space-y-3">

            {faqs.map((faq, index) => {

              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="rounded-xl border border-black/[0.08] bg-white p-3.5 transition sm:rounded-2xl sm:p-4"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >

                    <span className="text-[11px] font-semibold text-[#172033] sm:text-sm">
                      {faq.question}
                    </span>

                    <Plus
                      className={`h-4 w-4 shrink-0 text-[#C87532] transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />

                  </button>

                  {isOpen && (
                    <p className="mt-2.5 text-[10px] leading-5 text-black/65 sm:text-xs sm:leading-6">
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
      <section className="px-4 pb-9 sm:px-5 sm:pb-12 md:px-8 md:pb-14">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#172033] px-4 py-7 text-center text-white sm:px-6 sm:py-9">

          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-[#C87532]/15 blur-3xl" />

          <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-[#C87532]/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">

            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
              Plan Your Trip to Jim Corbett
            </p>

            <h2 className="mt-1.5 text-[24px] font-semibold leading-tight sm:text-3xl">
              Ready for an Unforgettable Wilderness Adventure?
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-[11px] leading-5 text-white/60 sm:text-sm sm:leading-6">
              Talk to our Corbett travel specialists today. We will help you
              select the ideal safari zones, book luxury stays, and build your
              custom package itinerary.
            </p>

            <div className="mt-4 flex flex-row justify-center gap-2 sm:mt-5 sm:gap-3">

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-3.5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#B96928] sm:px-6 sm:py-2.5 sm:text-xs"
              >
                Plan Your Package
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>

              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-6 sm:py-2.5 sm:text-xs"
              >
                <PhoneCall className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Speak to Expert
              </a>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}