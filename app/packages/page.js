"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Building2,
  Users,
  Mountain,
  ArrowRight,
  Sparkles,
  Hotel,
  UtensilsCrossed,
  Bus,
  Trees,
  CheckCircle2,
  CalendarDays,
  Clock,
  MapPin,
  Compass,
  Star,
  ShieldCheck,
  Plus,
  PhoneCall,
  SlidersHorizontal,
  Check,
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
      {/* HERO SECTION */}
      <section className="overflow-hidden bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto min-h-[260px] max-w-[1440px] overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[400px] sm:rounded-[24px] md:min-h-[440px] md:rounded-[28px]">
          <Image
            src="/images/packages/packages-hero.jpg"
            alt="Jim Corbett Tour Packages & Resort Stays"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1440px"
            className="object-cover brightness-110"
          />

          <div className="absolute inset-0 bg-[#172033]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/80 via-[#172033]/45 to-transparent" />

          <div className="relative z-10 flex min-h-[260px] items-center px-3.5 py-4 sm:min-h-[400px] sm:px-7 sm:py-8 md:min-h-[440px] md:px-10 lg:px-14">
            <div className="max-w-2xl">
              <div className="mb-1.5 inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] text-[#E1A05B] backdrop-blur-xl sm:mb-3 sm:px-3 sm:py-1.5 sm:text-[9px]">
                <Sparkles size={9} />
                Corbett Tour & Resort Packages
              </div>

              <h1 className="max-w-2xl text-[20px] leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Curated Corbett Packages,
                <br />
                <span className="text-[#E1A05B]">Designed for Every Journey.</span>
              </h1>

              <p className="mt-1.5 max-w-xl text-[9px] leading-3.5 text-white/75 sm:mt-3 sm:text-xs sm:leading-6 md:text-sm md:leading-7">
                Discover all-inclusive Jim Corbett packages combining jeep safaris, luxury resort stays, gourmet dining, and corporate MICE arrangements. Handcrafted for families, couples, groups, and business retreats.
              </p>

              <div className="mt-2.5 flex flex-row items-center gap-1.5 sm:mt-5 sm:flex-row sm:gap-2">
                <a
                  href="#package-list"
                  className="inline-flex items-center justify-center gap-1 rounded-full bg-[#C88A3D] px-3 py-1.5 text-[8px] font-semibold text-white shadow-md transition hover:bg-[#b97932] sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Explore Packages
                  <ArrowRight size={10} />
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[8px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Custom Plan Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO SUMMARY */}
      <section className="px-3.5 py-3.5 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-7">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C88A3D] sm:text-xs">
                Destination Corbett Packages
              </p>
              <h2 className="mt-0.5 text-base font-semibold leading-tight sm:text-2xl md:text-3xl">
                Unforgettable Stay & Safari
                <br />
                Experiences in Corbett.
              </h2>
            </div>

            <p className="max-w-3xl text-[9px] leading-3.5 text-black/60 sm:text-xs sm:leading-6">
              Whether you are seeking an adventurous tiger safari in core forest zones, a tranquil holiday at a riverside luxury resort, or an end-to-end corporate outing package, we bring together accommodation, permits, meals, transport, and on-ground assistance under one seamless itinerary.
            </p>
          </div>
        </div>
      </section>

      {/* PACKAGES FILTER & LIST SECTION */}
      <section id="package-list" className="px-3.5 pb-5 sm:px-5 sm:pb-8 md:px-8 md:pb-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C88A3D] sm:text-xs">
                Choose Your Experience
              </p>
              <h2 className="mt-0.5 text-base font-semibold leading-tight sm:text-2xl md:text-3xl">
                Featured Corbett Packages
              </h2>
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-2.5 py-1 text-[8px] font-semibold transition sm:px-4 sm:py-1.5 sm:text-xs ${
                    activeCategory === cat.id
                      ? "bg-[#C88A3D] text-white shadow-sm"
                      : "border border-black/10 bg-white text-black/70 hover:bg-black/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 md:gap-5">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-2xl"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-transparent to-transparent" />

                    <div className="absolute left-2.5 top-2.5">
                      <span className="rounded-full bg-[#C88A3D] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-wider text-white shadow backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[9px]">
                        {pkg.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                      <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-0.5 text-[8px] font-medium backdrop-blur-md sm:text-[10px]">
                        <Clock size={10} className="text-[#E1A05B]" />
                        {pkg.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-0.5 text-[8px] font-medium backdrop-blur-md sm:text-[10px]">
                        <MapPin size={10} className="text-[#E1A05B]" />
                        {pkg.location}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="text-xs font-semibold leading-snug text-[#172033] sm:text-base">
                      {pkg.title}
                    </h3>

                    <p className="mt-1 text-[8px] leading-3.5 text-black/60 sm:text-[11px] sm:leading-4">
                      {pkg.description}
                    </p>

                    <div className="mt-3 space-y-1 rounded-lg bg-[#F7F5F0] p-2 sm:mt-4 sm:space-y-1.5 sm:p-3">
                      <p className="text-[7px] font-semibold uppercase tracking-wider text-[#C88A3D] sm:text-[9px]">
                        Package Highlights:
                      </p>
                      {pkg.inclusions.slice(0, 4).map((inc, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1 text-[8px] font-medium text-black/75 sm:gap-1.5 sm:text-[10px]"
                        >
                          <Check
                            size={10}
                            className="mt-0.5 shrink-0 text-[#C88A3D]"
                          />
                          <span className="line-clamp-1">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-black/5 bg-[#FAFAFA] p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[7px] font-medium uppercase tracking-wide text-black/50 sm:text-[9px]">
                        Starting From
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-[#172033] sm:text-lg">
                          {pkg.price}
                        </span>
                        <span className="text-[7px] text-black/50 sm:text-[9px]">
                          / {pkg.priceUnit}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 rounded-full bg-[#172033] px-3 py-1.5 text-[8px] font-semibold text-white transition hover:bg-[#C88A3D] sm:px-4 sm:py-2 sm:text-xs"
                    >
                      Enquire Now
                      <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BOOK PACKAGES WITH US */}
      <section className="px-3.5 py-3.5 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-xl bg-[#172033] px-3.5 py-4 text-white sm:rounded-[24px] sm:px-6 sm:py-7 md:px-8 md:py-8">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C88A3D]/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#C88A3D]/10 blur-3xl" />

            <div className="relative z-10 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-7">
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#E1A05B] sm:text-xs">
                  Why Destination Corbett
                </p>
                <h2 className="mt-0.5 text-base font-semibold leading-tight sm:text-2xl md:text-3xl">
                  Seamless Booking.
                  <br />
                  Unmatched Hospitality.
                </h2>
                <p className="mt-1 max-w-lg text-[9px] leading-3.5 text-white/65 sm:mt-2 sm:text-xs sm:leading-5">
                  We eliminate the hassle of managing individual safari permissions, resort availability, and local transfers by giving you a unified, transparent package experience.
                </p>

                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#C88A3D] px-3.5 py-1.5 text-[8px] font-semibold text-white transition hover:bg-[#b97932] sm:mt-4 sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Request Customized Quote
                  <ArrowRight size={9} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {packageHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-lg border border-white/10 bg-white/[0.06] p-2 backdrop-blur-xl sm:rounded-xl sm:p-3.5"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#C88A3D]/20 text-[#E1A05B] sm:h-8 sm:w-8">
                        <Icon size={13} className="sm:h-4 sm:w-4" />
                      </div>
                      <h3 className="mt-1 text-[9px] font-semibold leading-tight sm:mt-2 sm:text-xs">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-[7px] leading-2.5 text-white/55 sm:mt-1 sm:text-[10px] sm:leading-4">
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

     {/* VIDEO BANNER */}
       {/*<section className="px-3.5 py-3.5 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-lg bg-[#EDE9E1] sm:rounded-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[340px]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/images/packages/corbett-experience.jpg"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                >
                  <source src="/videos/corbett-experience.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/50 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
                  <span className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-xl sm:px-3 sm:py-1.5 sm:text-[9px]">
                    Wilderness & Comfort
                  </span>
                </div>
              </div>

              <div className="flex items-center p-3.5 sm:p-6 md:p-8">
                <div className="max-w-xl">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C88A3D] sm:text-xs">
                    All-Inclusive Hospitality
                  </p>
                  <h2 className="mt-1 text-base font-semibold leading-tight sm:mt-2 sm:text-2xl md:text-3xl">
                    Every detail planned for an effortless journey.
                  </h2>
                  <p className="mt-1.5 text-[9px] leading-3.5 text-black/60 sm:mt-3 sm:text-xs sm:leading-5">
                    From early morning tiger safaris in Dhikala to candlelit riverside dinners and live acoustic evenings, our packages ensure you experience the absolute best of Jim Corbett National Park.
                  </p>

                  <div className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1 sm:mt-4 sm:gap-x-4 sm:gap-y-2">
                    {[
                      "Official Forest Safari Permits",
                      "Luxury & Eco-Resort Stays",
                      "Gourmet Buffet Dining & High-Tea",
                      "24/7 Dedicated Local Assistance",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-1 text-[8px] font-medium leading-3 sm:gap-2 sm:text-[10px] sm:leading-4"
                      >
                        <CheckCircle2
                          size={10}
                          className="mt-0.5 shrink-0 text-[#C88A3D] sm:h-3.5 sm:w-3.5"
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>*/}

      {/* HOW BOOKING WORKS */}
      <section className="px-3.5 py-3.5 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-10">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C88A3D] sm:text-xs">
                Simple Booking Flow
              </p>
              <h2 className="mt-0.5 text-base font-semibold leading-tight sm:text-2xl md:text-3xl">
                4 Easy steps to your Corbett getaway.
              </h2>
              <p className="mt-1 max-w-md text-[9px] leading-3.5 text-black/60 sm:mt-2 sm:text-xs sm:leading-5">
                We simplify your travel planning so you can sit back, relax, and look forward to your jungle adventure.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-0">
              {bookingSteps.map((step, index) => (
                <div key={step.number} className="relative">
                  {index < bookingSteps.length - 1 && (
                    <div className="absolute left-[30px] top-[13px] hidden h-px w-[calc(100%-18px)] bg-black/10 sm:block" />
                  )}

                  <div className="relative z-10">
                    <span className="text-sm font-semibold leading-none text-[#C88A3D]/40 sm:text-xl">
                      {step.number}
                    </span>
                    <h3 className="mt-1 text-[9px] font-semibold leading-tight sm:text-xs">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-[8px] leading-3 text-black/55 sm:text-[10px] sm:leading-4">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="px-3.5 py-3.5 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C88A3D] sm:text-xs">
              Package FAQs
            </p>
            <h2 className="mt-0.5 text-base font-semibold leading-tight sm:text-2xl md:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-black/10 bg-white p-3 transition sm:rounded-xl sm:p-4"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <span className="text-[10px] font-semibold text-[#172033] sm:text-sm">
                      {faq.question}
                    </span>
                    <Plus
                      size={14}
                      className={`shrink-0 text-[#C88A3D] transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-[9px] leading-4 text-black/65 sm:text-xs sm:leading-5">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="px-3.5 pb-3.5 sm:px-5 sm:pb-8 md:px-8 md:pb-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-lg bg-[#172033] px-3.5 py-5 text-center text-white sm:rounded-2xl sm:px-6 sm:py-8">
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-[#C88A3D]/15 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-[#C88A3D]/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#E1A05B] sm:text-xs">
              Plan Your Trip to Jim Corbett
            </p>

            <h2 className="mt-0.5 text-base font-semibold leading-tight sm:text-2xl md:text-3xl">
              Ready for an Unforgettable Wilderness Adventure?
            </h2>

            <p className="mx-auto mt-1 max-w-xl text-[9px] leading-3.5 text-white/60 sm:mt-2 sm:text-xs sm:leading-5">
              Talk to our Corbett travel specialists today. We will help you select the ideal safari zones, book luxury stays, and build your custom package itinerary.
            </p>

            <div className="mt-3 flex flex-row justify-center gap-2 sm:mt-5 sm:gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C88A3D] px-3.5 py-1.5 text-[8px] font-semibold text-white transition hover:bg-[#b97932] sm:px-6 sm:py-2.5 sm:text-xs"
              >
                Plan Your Package
                <ArrowRight size={10} />
              </Link>

              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-1 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[8px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-6 sm:py-2.5 sm:text-xs"
              >
                <PhoneCall size={10} />
                Speak to Expert
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}