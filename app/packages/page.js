
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
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  Plus,
  PhoneCall,
  SlidersHorizontal,
  Users,
  MessageCircle,
} from "lucide-react";

// ================= PACKAGES DATA =================

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
    location: "Bijrani & Garjiya",
    price: "₹12,499",
    priceUnit: "per person",
    image: "/images/packages/safari-expedition.webp",
    description:
      "Enjoy a Corbett stay with safari options and nature experiences.",
    inclusions: [
      "2 nights resort stay",
      "Safari options, subject to availability",
      "Meals as per confirmed itinerary",
      "Applicable permits and guide charges, as confirmed",
      "Optional evening activities, subject to availability",
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
      "Plan a relaxing resort escape with dining and optional experiences.",
    inclusions: [
      "3 nights accommodation",
      "Safari option, subject to availability",
      "Meals as per confirmed itinerary",
      "Optional spa services, subject to availability",
      "Bonfire or barbecue, subject to resort arrangements",
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
      "Bring your team together with accommodation, meetings and group activities.",
    inclusions: [
      "Conference venue, subject to availability",
      "Group accommodation",
      "Team activities as agreed",
      "Safari option, subject to availability",
      "Dinner and entertainment as per quotation",
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
      "Explore a forest-zone experience with arrangements based on permit availability.",
    inclusions: [
      "1 night accommodation, subject to availability",
      "Canter safari option, subject to permits",
      "Applicable entry and guide charges as confirmed",
      "Meals as per itinerary",
      "Transfers, if included in your confirmed package",
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
      "Enjoy family time with a comfortable stay and optional local experiences.",
    inclusions: [
      "2 nights family accommodation",
      "Safari or sightseeing options, subject to availability",
      "Meals as per confirmed itinerary",
      "Resort facilities as per property policy",
      "Local transfers, if included in the package",
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
      "Combine a comfortable stay with selected outdoor experiences.",
    inclusions: [
      "2 nights camp or resort stay",
      "Activities as agreed in the final itinerary",
      "Safari option, subject to availability",
      "Nature walk or local experience, where available",
      "Meals and evening activities as confirmed",
    ],
  },
];

// ================= HIGHLIGHTS =================

const packageHighlights = [
  {
    title: "Safari Assistance",
    description:
      "We help coordinate permit requests. Availability is subject to official approval.",
    icon: ShieldCheck,
  },
  {
    title: "Stay Options",
    description: "Choose accommodation to suit your group and budget.",
    icon: Hotel,
  },
  {
    title: "Custom Packages",
    description: "Request changes to dates, stay and activities.",
    icon: SlidersHorizontal,
  },
  {
    title: "Trip Coordination",
    description:
      "Discuss transport and on-ground arrangements with our team.",
    icon: Bus,
  },
];

// ================= FAQ =================

const faqs = [
  {
    question: "What is included in the package price?",
    answer:
      "Inclusions vary by package. Check the package details and confirm the final inclusions, taxes and availability with our team before booking.",
  },
  {
    question: "Can you arrange a safari?",
    answer:
      "We can help coordinate safari arrangements. Permits, zones, dates and availability are subject to the applicable official booking process.",
  },
  {
    question: "Can I customise a package?",
    answer:
      "Yes. Send your travel dates, number of guests and budget through WhatsApp. Our team can discuss suitable options.",
  },
  {
    question: "Is the displayed price final?",
    answer:
      "Displayed prices are indicative starting prices. The final quotation may vary by dates, occupancy, property availability, inclusions and applicable taxes.",
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

export default function PackagesPage() {
  const { profile } = useOrganisationProfile();

  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  const whatsappNumber = profile?.whatsapp || profile?.phone || "";
  const contactPhone = normalisePhoneNumber(profile?.phone);

  const filteredPackages =
    activeCategory === "all"
      ? packagesData
      : packagesData.filter(
          (pkg) => pkg.category === activeCategory
        );

  const choosePackageMessage =
    "Hi Destination Corbett, please suggest a package based on my travel dates, guest count and budget.";

  const customQuoteMessage =
    "Hi Destination Corbett, I would like a customised package quotation.";

  const finalEnquiryMessage =
    "Hi Destination Corbett, I want to plan a Corbett trip. Please help me with packages and pricing.";

  return (
    <main className="bg-[#F7F5F0] text-[#172033]">
      {/* ================= HERO ================= */}

      <section className="px-2 py-2 sm:px-4 sm:py-4 md:px-6">
        <div className="relative mx-auto min-h-[260px] max-w-[1440px] overflow-hidden rounded-2xl bg-[#172033] text-white sm:min-h-[420px] sm:rounded-3xl lg:min-h-[500px]">
          <Image
            src="/images/packages/packages-hero.webp"
            alt="Tour packages and resort stays in Jim Corbett"
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
                Destination Corbett Packages
              </div>

              <h1 className="text-[1.6rem] font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Find Your Corbett Getaway
                <span className="mt-0.5 block text-[#E6A76D] sm:mt-1">
                  Stay, Safari & Experiences
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/90 sm:mt-4 sm:text-base sm:leading-7">
                Choose a package or tell us what you need. We’ll help you
                explore suitable options.
              </p>

              {/* Hero: WhatsApp intentionally removed */}
              <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                <a
                  href="#package-list"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B96928] px-5 text-sm font-bold text-white transition hover:bg-[#9F5520] focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Explore Packages
                  <ArrowRight className="h-4 w-4" />
                </a>

                <Link
                  href="/contact?type=package"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Send an Enquiry
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 hidden flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/90 sm:flex">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#E6A76D]" />
                  Stay Options
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#E6A76D]" />
                  Safari Assistance
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#E6A76D]" />
                  Custom Plans
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PACKAGE LIST ================= */}

      <section
        id="package-list"
        className="scroll-mt-20 px-4 py-6 sm:px-6 sm:py-10 md:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="hidden text-sm font-bold uppercase tracking-wider text-[#B96928] sm:block">
                Find Your Experience
              </p>

              <h2 className="text-xl font-bold leading-tight sm:mt-2 sm:text-3xl md:text-4xl">
                Explore Corbett Packages
              </h2>

              <p className="mt-1 text-sm leading-5 text-[#4B5563] sm:mt-2 sm:text-base sm:leading-6">
                Choose a package to view details and enquire.
              </p>
            </div>

            <WhatsAppLink
              number={whatsappNumber}
              message={choosePackageMessage}
              label="Get package recommendations on WhatsApp"
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

          {/* PACKAGE CARDS */}

          <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filteredPackages.map((pkg) => (
              <article
                key={pkg.id}
                className="group flex min-w-0 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition duration-200 hover:shadow-md sm:flex-col"
              >
                <Link
                  href={`/packages/${pkg.id}`}
                  aria-label={`View ${pkg.title} details`}
                  className="relative block w-[112px] shrink-0 self-stretch overflow-hidden bg-[#E8E3DA] sm:aspect-[16/9] sm:w-full sm:self-auto"
                >
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    quality={70}
                    sizes="(max-width: 639px) 112px, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-[#B96928] px-2 py-1 text-[10px] font-bold leading-none text-white shadow sm:px-2.5 sm:py-1.5 sm:text-xs">
                    {pkg.tag}
                  </span>
                </Link>

                <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                  <Link href={`/packages/${pkg.id}`}>
                    <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-[#172033] hover:text-[#9F5520] sm:text-base">
                      {pkg.title}
                    </h3>
                  </Link>

                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#4B5563]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#B96928]" />
                      {pkg.duration}
                    </span>

                    <span className="hidden items-center gap-1 sm:inline-flex">
                      <Users className="h-3.5 w-3.5 text-[#B96928]" />
                      {pkg.groupSize}
                    </span>

                    <span className="inline-flex min-w-0 items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B96928]" />
                      <span className="truncate">{pkg.location}</span>
                    </span>
                  </div>

                  <p className="mt-2 hidden text-sm leading-5 text-[#4B5563] sm:line-clamp-2">
                    {pkg.description}
                  </p>

                  <div className="mt-auto pt-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[11px] font-semibold text-[#6B7280]">
                        From
                      </span>
                      <span className="text-lg font-bold text-[#172033] sm:text-xl">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-[#6B7280]">
                        {pkg.priceUnit}
                      </span>
                    </div>

                    {/* Card actions: WhatsApp retained on every card */}
                    <div className="mt-2 flex gap-2">
                      <Link
                        href={`/packages/${pkg.id}`}
                        className="hidden min-h-11 items-center justify-center rounded-lg border border-[#172033]/20 px-4 text-sm font-bold text-[#172033] transition hover:bg-[#F7F5F0] sm:inline-flex"
                      >
                        Details
                      </Link>

                      <Link
                        href={`/booking?type=package&package=${encodeURIComponent(
                          pkg.id
                        )}`}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-3 text-sm font-bold text-white transition hover:bg-[#9F5520] focus:outline-none focus:ring-2 focus:ring-[#B96928] focus:ring-offset-2"
                      >
                        <CalendarDays className="h-4 w-4" />
                        Book Now
                      </Link>

                      <WhatsAppLink
                        number={whatsappNumber}
                        message={`Hi Destination Corbett, I am interested in the ${pkg.title}. Please share availability, final pricing and package details.`}
                        label={`Enquire on WhatsApp about ${pkg.title}`}
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

          {filteredPackages.length === 0 && (
            <div className="mt-4 rounded-xl border border-black/10 bg-white p-6 text-center sm:mt-6 sm:rounded-2xl sm:p-8">
              <p className="text-base font-semibold text-[#172033]">
                No packages found.
              </p>

              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className="mt-3 min-h-11 rounded-xl bg-[#B96928] px-5 text-sm font-bold text-white hover:bg-[#9F5520] sm:mt-4"
              >
                View All Packages
              </button>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-[#6B7280]">
            Prices are indicative starting prices. Final price depends on dates,
            occupancy and availability.
          </p>
        </div>
      </section>

      {/* ================= WHY DESTINATION CORBETT ================= */}

      <section className="px-4 py-4 sm:px-6 sm:py-12 md:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#172033] px-4 py-6 text-white sm:px-8 sm:py-9">
          <div className="grid gap-5 sm:gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="hidden text-sm font-bold uppercase tracking-wider text-[#E6A76D] sm:block">
                Why Destination Corbett
              </p>

              <h2 className="text-xl font-bold leading-tight sm:mt-2 sm:text-3xl">
                Your Trip, Made Simpler
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
                Tell us your travel dates, guest count and budget. We’ll help
                you explore suitable stays and experiences.
              </p>

              <WhatsAppLink
                number={whatsappNumber}
                message={customQuoteMessage}
                label="Request a custom package quote on WhatsApp"
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B96928] px-5 text-sm font-bold text-white transition hover:bg-[#9F5520] sm:mt-5"
              >
                Get a Custom Quote
                <ArrowRight className="h-4 w-4" />
              </WhatsAppLink>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {packageHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/15 bg-white/[0.06] p-3 sm:p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B96928]/20 text-[#F0B77F] sm:h-10 sm:w-10 sm:rounded-xl">
                      <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                    </div>

                    <h3 className="mt-2.5 text-sm font-bold sm:mt-3 sm:text-base">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-white/80 sm:text-sm sm:leading-6">
                      {item.description}
                    </p>
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
              Package FAQs
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
            Let's Plan Your Corbett Trip
          </p>

          <h2 className="mx-auto max-w-2xl text-xl font-bold leading-tight sm:mt-2 sm:text-3xl">
            Tell Us Your Dates. We’ll Help With the Rest.
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/85 sm:mt-3 sm:text-base sm:leading-7">
            Share your guest count and budget to discuss a suitable package.
          </p>

          <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-2.5 sm:mt-6 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3">
            <Link
              href="/contact?type=package"
              className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B96928] px-6 text-sm font-bold text-white transition hover:bg-[#9F5520] sm:col-span-1 sm:min-h-12"
            >
              Send an Enquiry
              <ArrowRight className="h-4 w-4" />
            </Link>

            <WhatsAppLink
              number={whatsappNumber}
              message={finalEnquiryMessage}
              label="Plan your Corbett trip on WhatsApp"
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
