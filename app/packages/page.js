
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";
import {
  ArrowRight,
  Sparkles,
  Hotel,
  Bus,
  CheckCircle2,
  Plus,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  MessageCircle,
  Compass,
  Trees,
  ShieldCheck,
  Star,
  Heart,
  TentTree,
} from "lucide-react";

const categories = [
  { id: "all", label: "All Packages" },
  { id: "safari", label: "Safari" },
  { id: "resort", label: "Resort Stays" },
  { id: "corporate", label: "Corporate & MICE" },
  { id: "family", label: "Family Getaways" },
];

const packagesData = [
  {
    id: "corbett-wildlife-expedition",
    title: "Corbett Wildlife & Safari Expedition",
    category: "safari",
    tag: "Popular Choice",
    duration: "2 Nights / 3 Days",
    groupSize: "2–6 Guests",
    location: "Jim Corbett",
    price: "₹12,499",
    priceUnit: "per person",
    image: "/images/packages/safari-expedition.webp",
    description:
      "Discover Corbett with a comfortable stay and an unforgettable wildlife experience.",
    inclusions: [
      "2 nights resort stay",
      "Safari assistance, subject to availability",
      "Meals as per confirmed itinerary",
      "Nature experiences, where available",
    ],
  },
  {
    id: "luxury-resort-retreat",
    title: "Luxury Riverfront Resort Escape",
    category: "resort",
    tag: "Luxury Stay",
    duration: "3 Nights / 4 Days",
    groupSize: "2–8 Guests",
    location: "Kosi River Area",
    price: "₹18,999",
    priceUnit: "per person",
    image: "/images/packages/luxury-resort1.webp",
    description:
      "Relax in a premium resort setting with comfortable stays and curated experiences.",
    inclusions: [
      "3 nights accommodation",
      "Meals as per confirmed itinerary",
      "Optional safari arrangements",
      "Resort activities, subject to availability",
    ],
  },
  {
    id: "corporate-mice-retreat",
    title: "Corporate Leadership & Outing Retreat",
    category: "corporate",
    tag: "Corporate Special",
    duration: "2 Nights / 3 Days",
    groupSize: "15–100+ Guests",
    location: "Jim Corbett",
    price: "₹14,500",
    priceUnit: "per delegate",
    image: "/images/packages/corporate-retreat1.webp",
    description:
      "Bring your team together with accommodation, meetings and group experiences.",
    inclusions: [
      "Group accommodation",
      "Meeting venue, subject to availability",
      "Team activities as agreed",
      "Meals as per confirmed itinerary",
    ],
  },
  {
    id: "dhikala-canter-adventure",
    title: "Dhikala Forest Zone Trail",
    category: "safari",
    tag: "Wildlife Experience",
    duration: "1 Night / 2 Days",
    groupSize: "2–12 Guests",
    location: "Dhikala Zone",
    price: "₹8,999",
    priceUnit: "per person",
    image: "/images/packages/dhikala-zone.webp",
    description:
      "Plan a forest-zone adventure with arrangements based on permit availability.",
    inclusions: [
      "Accommodation, subject to availability",
      "Canter safari assistance",
      "Applicable permits as confirmed",
      "Meals as per itinerary",
    ],
  },
  {
    id: "family-weekend-bonanza",
    title: "Family Weekend Wilderness Getaway",
    category: "family",
    tag: "Family Favourite",
    duration: "2 Nights / 3 Days",
    groupSize: "4–10 Guests",
    location: "Dhikuli & Nearby Areas",
    price: "₹10,999",
    priceUnit: "per person",
    image: "/images/packages/family-package.webp",
    description:
      "Spend quality time together with a comfortable stay and optional local experiences.",
    inclusions: [
      "2 nights family accommodation",
      "Meals as confirmed",
      "Optional safari or sightseeing",
      "Resort facilities as per property policy",
    ],
  },
  {
    id: "adventure-thrill-seeker",
    title: "Corbett Adventure Getaway",
    category: "safari",
    tag: "Adventure Trip",
    duration: "2 Nights / 3 Days",
    groupSize: "4–20 Guests",
    location: "Corbett & Nearby Areas",
    price: "₹11,800",
    priceUnit: "per person",
    image: "/images/packages/adventure-package.webp",
    description:
      "Combine a comfortable stay with outdoor activities and nature experiences.",
    inclusions: [
      "2 nights camp or resort stay",
      "Activities as agreed",
      "Safari option, subject to availability",
      "Meals as per confirmed itinerary",
    ],
  },
];

const solutions = [
  {
    title: "Comfortable Stays",
    description:
      "Explore accommodation options for different budgets and group sizes.",
    icon: Hotel,
  },
  {
    title: "Safari Assistance",
    description:
      "Get help exploring safari options, permits and availability.",
    icon: Compass,
  },
  {
    title: "Family Holidays",
    description:
      "Plan memorable getaways with family-friendly experiences.",
    icon: Heart,
  },
  {
    title: "Nature Experiences",
    description:
      "Explore outdoor activities and experiences around Corbett.",
    icon: Trees,
  },
  {
    title: "Group Packages",
    description:
      "Discuss customised arrangements for corporate and larger groups.",
    icon: Users,
  },
  {
    title: "Trip Coordination",
    description:
      "Coordinate your stay, activities and other travel requirements.",
    icon: Bus,
  },
];

const whyCorbett = [
  {
    title: "Wildlife & Nature",
    description:
      "Explore nature experiences and safari options around Jim Corbett.",
  },
  {
    title: "Stay Options",
    description:
      "Choose from available resort and accommodation options.",
  },
  {
    title: "Flexible Plans",
    description:
      "Discuss dates, group size and package customisation.",
  },
  {
    title: "Trip Assistance",
    description:
      "Coordinate your requirements with the Destination Corbett team.",
  },
];

const process = [
  {
    number: "01",
    title: "Choose a Package",
    description:
      "Explore packages and find an experience that suits your trip.",
  },
  {
    number: "02",
    title: "Share Details",
    description:
      "Tell us your dates, guest count and accommodation preferences.",
  },
  {
    number: "03",
    title: "Confirm Your Plan",
    description:
      "Review availability, inclusions and the final quotation.",
  },
  {
    number: "04",
    title: "Enjoy Corbett",
    description:
      "Get ready for your planned stay and experiences.",
  },
];

const faqs = [
  {
    question: "What is included in a package?",
    answer:
      "Package inclusions depend on the selected itinerary. Please confirm accommodation, meals, safari arrangements, transfers, taxes and other inclusions with our team before booking.",
  },
  {
    question: "Can I customise a package?",
    answer:
      "Yes. Share your preferred dates, number of guests, budget and requirements with our team to discuss available custom options.",
  },
  {
    question: "Are safari permits guaranteed?",
    answer:
      "No. Safari permits, zones and dates are subject to official rules, permit approval and availability.",
  },
  {
    question: "Are the displayed prices final?",
    answer:
      "Displayed prices are indicative. Final prices can vary based on travel dates, occupancy, property availability, confirmed inclusions and applicable taxes.",
  },
];

const HERO_IMAGE = "/images/packages/packages-hero.webp";

function normalisePhoneNumber(value) {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.length === 10) digits = `91${digits}`;

  return digits;
}

function getWhatsAppUrl(message, number) {
  const whatsappNumber = normalisePhoneNumber(number);

  if (!whatsappNumber) return "";

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function WhatsAppLink({
  message,
  number,
  className = "",
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

function PackageCard({ pkg, whatsappNumber }) {
  const [showInclusions, setShowInclusions] = useState(false);

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#172033]/[0.08] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl">
      <Link
        href={`/packages/${pkg.id}`}
        aria-label={`View ${pkg.title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[#E9E4DA] sm:aspect-[16/9]"
      >
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/85 via-[#172033]/10 to-transparent" />

        <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-1.25rem)] truncate rounded-lg border border-white/20 bg-black/25 px-2.5 py-1.5 text-[9px] font-bold text-white backdrop-blur-md sm:left-3 sm:top-3 sm:text-[10px]">
          {pkg.tag}
        </span>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium text-white/90 sm:text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-black/25 px-2 py-1 backdrop-blur-sm">
              <Clock size={12} />
              {pkg.duration}
            </span>
          </div>

          <h3 className="mt-2 text-base font-bold leading-tight text-white sm:text-lg">
            {pkg.title}
          </h3>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="line-clamp-2 min-h-10 text-[11px] leading-5 text-gray-600 sm:text-xs sm:leading-5">
          {pkg.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-gray-500 sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="shrink-0 text-[#B96928]" />
            {pkg.location}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Users size={13} className="shrink-0 text-[#B96928]" />
            {pkg.groupSize}
          </span>
        </div>

        <div className="mt-3 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={() => setShowInclusions(!showInclusions)}
            aria-expanded={showInclusions}
            className="flex min-h-7 w-full items-center justify-between gap-2 text-left text-[11px] font-bold text-[#172033] sm:text-xs"
          >
            <span>Package Highlights</span>

            <Plus
              size={14}
              className={`shrink-0 text-[#B96928] transition-transform ${
                showInclusions ? "rotate-45" : ""
              }`}
            />
          </button>

          {showInclusions && (
            <ul className="mt-2 space-y-2 pb-1">
              {pkg.inclusions.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[10px] leading-4 text-gray-600 sm:text-xs sm:leading-5"
                >
                  <CheckCircle2
                    size={13}
                    className="mt-0.5 shrink-0 text-[#B96928]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-auto border-t border-gray-100 pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-[10px] text-gray-500 sm:text-xs">
                Starting from
              </p>

              <p className="mt-0.5 text-xl font-black leading-tight text-[#172033] sm:text-2xl">
                {pkg.price}
              </p>

              <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
                {pkg.priceUnit}
              </p>
            </div>

            <Link
              href={`/packages/${pkg.id}`}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B96928] transition hover:text-[#9D5721] sm:text-xs"
            >
              View Details
              <ChevronRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <Link
              href={`/booking?type=package&package=${encodeURIComponent(pkg.id)}`}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#B96928] px-3 text-[11px] font-bold text-white transition hover:bg-[#9D5721] sm:text-xs"
            >
              <CalendarDays size={14} />
              Enquire / Book
            </Link>

            <WhatsAppLink
              number={whatsappNumber}
              message={`Hi Destination Corbett, I am interested in the ${pkg.title}. Please share availability, final pricing and package details.`}
              label={`Enquire about ${pkg.title} on WhatsApp`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#16794B]/20 bg-[#16794B]/5 text-[#16794B] transition hover:bg-[#16794B]/10"
            >
              <MessageCircle size={17} />
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PackagesPage() {
  const { profile } = useOrganisationProfile();

  const [activeCategory, setActiveCategory] = useState("all");
  const [openWhy, setOpenWhy] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const whatsappNumber = profile?.whatsapp || profile?.phone || "";

  const filteredPackages =
    activeCategory === "all"
      ? packagesData
      : packagesData.filter((pkg) => pkg.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
      {/* BREADCRUMB */}
      <div className="px-3 pt-2 sm:px-6 sm:pt-3">
        <nav
          aria-label="Breadcrumb"
          className="mx-auto flex max-w-6xl items-center gap-2 text-xs sm:text-sm"
        >
          <Link
            href="/"
            className="text-gray-500 transition-colors hover:text-[#B96928]"
          >
            Home
          </Link>

          <span className="text-gray-400">/</span>

          <span className="font-semibold text-[#B96928]">Packages</span>
        </nav>
      </div>

      {/* ================= COMPACT HERO ================= */}
<section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
  <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
    {/* Hero Image */}
    <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
      <Image
        src={HERO_IMAGE}
        alt="Holiday packages, resort stays and wildlife experiences in Jim Corbett"
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
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl">
          <Sparkles className="h-3 w-3 text-[#E0924F]" />
          Destination Corbett Packages
        </div>

        <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Discover Your Corbett,{" "}
          <span className="text-[#E0924F]">Your Way.</span>
        </h1>

        <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
          Resort stays, wildlife adventures and family getaways — explore
          packages for your next Corbett trip.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href="#package-list"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
          >
            Explore Packages
            <ArrowRight size={13} />
          </Link>

          <Link
            href="/contact?type=package"
            className="hidden items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:inline-flex sm:text-sm"
          >
            Custom Enquiry
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* PACKAGES LIST */}
      <section
        id="package-list"
        className="scroll-mt-5 px-3 py-5 sm:px-6 sm:py-7 lg:py-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 max-w-2xl sm:mb-5">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#B96928]">
              FIND YOUR EXPERIENCE
            </p>

            <h2 className="mt-1.5 text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              Explore Corbett Packages
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
              Find the right stay, adventure or getaway for your trip.
            </p>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="-mx-3 mb-4 flex gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:mb-5 sm:flex-wrap sm:px-0">
            {categories.map((category) => {
              const active = activeCategory === category.id;

              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={active}
                  className={`min-h-9 shrink-0 rounded-xl px-3.5 text-[11px] font-bold transition sm:text-xs ${
                    active
                      ? "bg-[#B96928] text-white"
                      : "border border-[#172033]/10 bg-white text-gray-600 hover:border-[#B96928] hover:text-[#B96928]"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>

          {filteredPackages.length === 0 && (
            <div className="rounded-2xl border border-[#172033]/10 bg-white px-5 py-10 text-center">
              <Compass className="mx-auto h-8 w-8 text-[#B96928]" />

              <p className="mt-3 text-sm font-bold">
                No packages available in this category.
              </p>

              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-4 rounded-xl bg-[#B96928] px-4 py-2.5 text-xs font-bold text-white"
              >
                View All Packages
              </button>
            </div>
          )}

          <p className="mt-3 text-[10px] leading-4 text-gray-500 sm:text-xs sm:leading-5">
            Prices shown are indicative. Final pricing depends on travel
            dates, availability, occupancy, confirmed inclusions and applicable
            taxes.
          </p>
        </div>
      </section>

      {/* WHY CORBETT */}
      <section className="px-3 py-5 sm:px-6 sm:py-7 lg:py-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#172033] px-5 py-6 text-white sm:px-7 sm:py-8 lg:px-9">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#B96928]/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#B96928]/10 blur-3xl" />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] text-[#F0BD83]">
                WHY DESTINATION CORBETT
              </p>

              <h2 className="mt-1.5 text-xl font-black leading-tight sm:text-2xl lg:text-3xl">
                Your next getaway starts here.
              </h2>

              <p className="mt-2 max-w-lg text-xs leading-5 text-white/70 sm:text-sm sm:leading-6">
                Find a package that fits your dates, group size and travel
                preferences.
              </p>

              <Link
                href="/contact?type=package"
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#B96928] px-4 text-xs font-bold text-white transition hover:bg-[#9D5721] sm:text-sm"
              >
                Plan Your Trip
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {whyCorbett.map((item, index) => {
                const isOpen = openWhy === index;

                return (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setOpenWhy(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-left transition hover:bg-white/[0.10] sm:p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-[#F0BD83]"
                      />

                      <Plus
                        size={13}
                        className={`shrink-0 text-white/60 transition-transform ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </div>

                    <h3 className="mt-2 text-[11px] font-bold leading-tight sm:text-sm">
                      {item.title}
                    </h3>

                    {isOpen && (
                      <p className="mt-2 text-[10px] leading-4 text-white/65 sm:text-xs sm:leading-5">
                        {item.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGE SERVICES */}
      <section className="px-3 py-5 sm:px-6 sm:py-7 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#B96928]">
              PLAN YOUR EXPERIENCE
            </p>

            <h2 className="mt-1.5 text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              Everything for your getaway
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
              Choose your preferred experience and discuss the details with
              our team.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:mt-6 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-6">
            {solutions.map((solution) => {
              const Icon = solution.icon;

              return (
                <div
                  key={solution.title}
                  className="flex min-w-0 items-start gap-2.5 sm:gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#B96928]/10 text-[#B96928]">
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-bold leading-tight sm:text-sm">
                      {solution.title}
                    </h3>

                    <p className="mt-1.5 text-[10px] leading-4 text-gray-600 sm:text-xs sm:leading-5">
                      {solution.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-3 py-5 sm:px-6 sm:py-7 lg:py-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#B96928]">
              SIMPLE PLANNING
            </p>

            <h2 className="mt-1.5 text-xl font-black leading-tight sm:text-2xl lg:text-3xl">
              Plan your Corbett trip.
            </h2>

            <p className="mt-2 max-w-md text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
              Select a package, share your requirements and confirm your
              itinerary with our team.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-0">
            {process.map((step, index) => (
              <div key={step.number} className="relative">
                {index < process.length - 1 && (
                  <div className="absolute left-8 top-3 hidden h-px w-[calc(100%-20px)] bg-[#172033]/15 sm:block" />
                )}

                <div className="relative z-10">
                  <span className="text-xl font-black leading-none text-[#B96928]/60">
                    {step.number}
                  </span>

                  <h3 className="mt-2 text-xs font-bold leading-tight sm:text-sm">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-[10px] leading-4 text-gray-600 sm:text-xs sm:leading-5">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGE FAQ */}
      <section className="px-3 py-5 sm:px-6 sm:py-7 lg:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 text-center sm:mb-5">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#B96928]">
              NEED TO KNOW?
            </p>

            <h2 className="mt-1.5 text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-[#172033]/[0.08] bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <span className="text-xs font-bold leading-5 sm:text-sm">
                      {faq.question}
                    </span>

                    <Plus
                      size={16}
                      className={`shrink-0 text-[#B96928] transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4">
                      <p className="border-t border-gray-100 pt-3 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-3 pb-7 pt-5 sm:px-6 sm:pb-9 sm:pt-7">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#172033] px-5 py-7 text-center text-white sm:px-8 sm:py-9">
          <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-[#B96928]/15 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-[#B96928]/15 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#F0BD83]">
              YOUR CORBETT GETAWAY
            </p>

            <h2 className="mt-2 text-xl font-black leading-tight sm:text-3xl">
              Find Your Stay. Plan Your Adventure.
            </h2>

            <p className="mx-auto mt-2.5 max-w-xl text-xs leading-5 text-white/70 sm:text-sm sm:leading-6">
              Share your travel dates, group size and budget to discuss the
              right package for your trip.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/contact?type=package"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 text-xs font-bold text-white transition hover:bg-[#9D5721] sm:px-5 sm:text-sm"
              >
                Plan Your Trip
                <ArrowRight size={14} />
              </Link>

              <WhatsAppLink
                number={whatsappNumber}
                message="Hi Destination Corbett, I would like to plan a Corbett trip. Please share suitable packages, availability and final pricing."
                label="Discuss a Corbett package on WhatsApp"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-xs font-bold text-white transition hover:bg-white hover:text-[#172033] sm:px-5 sm:text-sm"
              >
                <MessageCircle size={14} />
                WhatsApp Us
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
