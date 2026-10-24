"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";
import {
  ArrowRight,
  CalendarDays,
  Users,
  CheckCircle2,
  Heart,
  CalendarCheck2,
  Send,
  Coffee,
  Camera,
  Music,
  Car,
  Sparkles,
  BedDouble,
  Flower2,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

/* ================= ORGANISATION CONTACT HELPERS ================= */
function getContactDetails(profile) {
  const phone =
    profile?.phone ||
    profile?.contactNumber ||
    profile?.contactPhone ||
    profile?.mobile ||
    profile?.contact?.phone ||
    "";

  const whatsapp =
    profile?.whatsapp ||
    profile?.whatsappNumber ||
    profile?.whatsappPhone ||
    profile?.contact?.whatsapp ||
    phone;

  const email =
    profile?.email ||
    profile?.contactEmail ||
    profile?.contact?.email ||
    "";

  const name =
    profile?.name ||
    profile?.organisationName ||
    profile?.organizationName ||
    profile?.businessName ||
    "Destination Corbett";

  return {
    name,
    phone: String(phone).trim(),
    whatsapp: String(whatsapp).replace(/\D/g, ""),
    email: String(email).trim(),
  };
}

function whatsappLink(number, message) {
  if (!number) return "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/* ================= PAGE DATA ================= */
const weddingPageData = {
  hero: {
    eyebrow: "DESTINATION WEDDINGS IN JIM CORBETT",
    title: "Your Love Story,",
    highlight: "Surrounded by Nature.",
    description:
      "Celebrate your special day in Jim Corbett with beautiful venues, comfortable stays and personalised wedding planning.",
    image: "/weddings/wedding-hero1.webp",
  },

  introduction: {
    title: "A destination wedding, made for unforgettable moments",
    paragraphs: [
      "Imagine exchanging vows surrounded by the forests and peaceful beauty of Jim Corbett.",
      "From intimate celebrations to grand destination weddings, plan your special day with venue, stay, food and event coordination support.",
    ],
  },

  services: [
    {
      id: "venue-stay",
      image: "/weddings/venue-stay.webp",
      title: "Venue & Stay",
      text: "Wedding venues and comfortable accommodation for your guests.",
      icon: BedDouble,
    },
    {
      id: "catering",
      image: "/weddings/catering.webp",
      title: "Catering",
      text: "Custom menus, local flavours and memorable dining experiences.",
      icon: Coffee,
    },
    {
      id: "decor-styling",
      image: "/weddings/decor-styling.webp",
      title: "Decor & Styling",
      text: "Wedding decor tailored to your theme, colours and celebration.",
      icon: Flower2,
    },
    {
      id: "photography",
      image: "/weddings/photography.webp",
      title: "Photography & Films",
      text: "Capture the moments that make your celebration special.",
      icon: Camera,
    },
    {
      id: "entertainment",
      image: "/weddings/entertainment.webp",
      title: "Entertainment",
      text: "Music, DJs and performances for your wedding functions.",
      icon: Music,
    },
    {
      id: "guest-transport",
      image: "/weddings/guest-transport.webp",
      title: "Guest Transport",
      text: "Transport coordination for family members and guests.",
      icon: Car,
    },
    {
      id: "mehndi-makeup",
      image: "/weddings/mehndi-makeup.webp",
      title: "Mehndi & Makeup",
      text: "Beauty and mehndi services for your special celebrations.",
      icon: Sparkles,
    },
    {
      id: "wedding-planning",
      image: "/weddings/wedding-planning.webp",
      title: "Wedding Planning",
      text: "Planning and coordination support for your wedding events.",
      icon: CalendarCheck2,
    },
  ],

  experience: {
    title: "Make your wedding a Corbett experience",
    description:
      "Give your guests more than a wedding. Combine your celebration with nature, outdoor activities, local experiences and comfortable stays.",
    image: "/weddings/wedding-experience.webp",
    points: [
      "Nature experiences",
      "Outdoor activities",
      "Local experiences",
      "Flexible planning",
    ],
  },

  // Confirm these indicative prices with the organisation before publishing.
  packages: [
    {
      id: "silver",
      title: "Silver",
      price: "24",
      pax: "100 PAX",
      duration: "2 Nights / 3 Days",
      features: [
        "Accommodation",
        "Meals Included",
        "Wedding Venue",
        "Basic Décor",
        "Wedding Services",
      ],
    },
    {
      id: "gold",
      title: "Gold",
      price: "30",
      pax: "150 PAX",
      duration: "2 Nights / 3 Days",
      featured: true,
      features: [
        "Accommodation",
        "Meals Included",
        "Wedding Venue",
        "Premium Décor",
        "Wedding Services",
      ],
    },
    {
      id: "platinum",
      title: "Platinum",
      price: "35",
      pax: "200 PAX",
      duration: "2 Nights / 3 Days",
      features: [
        "Premium Accommodation",
        "All Meals Included",
        "Exclusive Wedding Venue",
        "Luxury Décor",
        "Complete Wedding Services",
      ],
    },
  ],

  process: [
    {
      number: "01",
      title: "Share Your Plan",
      text: "Tell us your wedding date, guest count and requirements.",
    },
    {
      number: "02",
      title: "Choose a Package",
      text: "Pick Silver, Gold or Platinum based on guests and budget.",
    },
    {
      number: "03",
      title: "Customise",
      text: "Plan your stay, food, decor and other wedding services.",
    },
    {
      number: "04",
      title: "Celebrate",
      text: "Bring your plans together with coordinated support.",
    },
  ],
};

const packageTones = {
  silver: {
    card: "dc-keep-colors border-[#D9C9A3]/70 bg-gradient-to-b from-[#FBF8F1] to-[#EFE8D8] text-[#172033]",
    tab: "bg-[#172033] text-[#E6C887]",
    price: "text-[#9A5E1E]",
    muted: "text-[#172033]/55",
    pill: "border-[#172033]/20 text-[#172033]",
    check: "text-[#B07A2A]",
    text: "text-[#172033]/80",
    divider: "from-transparent via-[#B07A2A]/50 to-transparent",
    ghost: "border-[#B07A2A]/50 text-[#8A561A] hover:bg-[#B07A2A]/10",
  },
  gold: {
    card: "dc-keep-colors border-[#D4A24C] bg-gradient-to-b from-[#FFF7E3] to-[#F2DDAE] text-[#172033] shadow-[0_18px_44px_-22px_rgba(212,162,76,0.7)] lg:-translate-y-2",
    tab: "bg-[#172033] text-[#F0C46E]",
    price: "text-[#8A4F12]",
    muted: "text-[#172033]/60",
    pill: "border-[#172033]/25 text-[#172033]",
    check: "text-[#A8691B]",
    text: "text-[#172033]/85",
    divider: "from-transparent via-[#A8691B]/60 to-transparent",
    ghost: "border-[#A8691B]/55 text-[#7A4510] hover:bg-[#A8691B]/10",
  },
  platinum: {
    card: "dc-keep-colors border-[#D4A24C]/60 bg-gradient-to-b from-[#1D2A45] to-[#0B1220] text-[#F6EBD3]",
    tab: "bg-gradient-to-r from-[#C98A2E] to-[#EBC274] text-[#172033]",
    price: "text-[#F0C46E]",
    muted: "text-[#F6EBD3]/55",
    pill: "border-[#F0C46E]/40 text-[#F6EBD3]",
    check: "text-[#F0C46E]",
    text: "text-[#F6EBD3]/80",
    divider: "from-transparent via-[#F0C46E]/50 to-transparent",
    ghost: "border-[#F0C46E]/50 text-[#F0C46E] hover:bg-white/5",
  },
};

const sectionWrap = "mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-6 md:px-6";

const sectionHeading =
  "text-lg font-bold leading-tight text-[#172033] dark:text-gray-100 sm:text-xl md:text-2xl";

const sectionSub =
  "mt-1 text-[11px] leading-4 text-gray-600 dark:text-gray-300 sm:text-sm sm:leading-5";

const pillPrimary =
  "inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-[#B96928] px-4 text-[10px] font-semibold text-white transition-all duration-300 hover:bg-[#A85C22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0924F] sm:h-9 sm:text-xs";

export default function WeddingsPage() {
  const data = weddingPageData;

  // Organisation contact details from the existing public profile hook.
  const { profile } = useOrganisationProfile();

  const contact = useMemo(() => getContactDetails(profile), [profile]);

  const createWhatsAppLink = (pkg) => {
    const message = [
      `Hello ${contact.name},`,
      `I am interested in the ${pkg.title} Wedding Package.`,
      `Indicative package price: ₹${pkg.price} Lakhs.`,
      `Guest count: ${pkg.pax}.`,
      "Please share the details and a customised quotation.",
    ].join(" ");

    return whatsappLink(contact.whatsapp, message);
  };

  const generalWhatsAppLink = whatsappLink(
    contact.whatsapp,
    `Hello ${contact.name}, I would like to enquire about planning a destination wedding in Jim Corbett. Please share the available packages and details.`
  );

  const phoneNumber = contact.phone.replace(/[^\d+]/g, "");

  return (
    <main
      className={`${serif.variable} min-h-screen bg-[#F7F5F0] text-[#172033] dark:bg-[#0e1210] dark:text-gray-100`}
    >
      {/* ================= BREADCRUMB ================= */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-3 pt-3 text-xs sm:px-5 sm:pt-4 sm:text-sm md:px-6"
      >
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-[#B96928] transition-colors hover:underline"
          >
            Home
          </Link>

          <span className="text-gray-400">›</span>

          <span
            aria-current="page"
            className="font-medium text-[#172033] dark:text-gray-100"
          >
            Weddings
          </span>
        </div>
      </nav>

      {/* ================= COMPACT HERO ================= */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
        <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
          {/* Hero Image */}
          <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
            <Image
              src={data.hero.image}
              alt="Destination wedding in Jim Corbett"
              fill
              priority
              quality={80}
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
                <Heart className="h-3 w-3 text-[#E0924F]" />
                {data.hero.eyebrow}
              </div>

              <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                {data.hero.title}{" "}
                <span className="text-[#E0924F]">{data.hero.highlight}</span>
              </h1>

              <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
                {data.hero.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href="/contact?type=wedding"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
                >
                  Plan Your Wedding
                  <Send size={13} />
                </Link>

                <a
                  href="#packages"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:text-sm"
                >
                  View Packages
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRODUCTION ================= */}
      <section className={sectionWrap}>
        <div className="rounded-xl border border-black/5 bg-white p-3.5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-4">
          <h2 className={sectionHeading}>{data.introduction.title}</h2>

          <div className="mt-1.5 space-y-1.5 text-[11px] leading-4 text-gray-600 dark:text-gray-300 sm:text-sm sm:leading-5">
            {data.introduction.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WEDDING PACKAGES ================= */}
      <section id="packages" className={`${sectionWrap} scroll-mt-20`}>
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#0B1220] via-[#121C30] to-[#172033] px-3 py-6 text-white shadow-sm dark:border dark:border-white/10 sm:rounded-2xl sm:px-6 sm:py-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F0C46E]/70 to-transparent" />
          <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-[#D4A24C]/10 blur-3xl" />

          {/* Heading */}
          <div className="relative mx-auto max-w-xl text-center">
            <div className="flex items-center justify-center gap-3 text-[#F0C46E]">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#F0C46E]/70" />
              <Heart size={13} />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#F0C46E]/70" />
            </div>

            <h2 className="mt-2.5 font-[family-name:var(--font-serif)] text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
              Wedding packages,{" "}
              <span className="italic text-[#F0C46E]">crafted for you.</span>
            </h2>

            <p className="mt-1.5 text-[11px] leading-4 text-white/60 sm:text-sm sm:leading-5">
              Prices are indicative for the stated guest count. Final
              quotations depend on your requirements and availability.
            </p>
          </div>

          {/* Cards: swipe on mobile, 3 columns from sm */}
          <div className="relative -mx-3 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-3 pt-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0">
            {data.packages.map((pkg) => {
              const t = packageTones[pkg.id];
              const packageWhatsApp = createWhatsAppLink(pkg);

              return (
                <article
                  key={pkg.id}
                  className={`relative flex min-w-[74%] shrink-0 snap-center flex-col rounded-xl border p-3.5 sm:min-w-0 sm:shrink sm:p-4 ${t.card}`}
                >
                  <div className="pointer-events-none absolute inset-1 rounded-lg border border-[#D4A24C]/30" />

                  {pkg.featured && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#B96928] to-[#D4A24C] px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                      Most Popular
                    </span>
                  )}

                  <div className="relative text-center">
                    <span
                      className={`inline-block rounded-md px-5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-xs ${t.tab}`}
                    >
                      {pkg.title}
                    </span>

                    <p
                      className={`mt-3 font-[family-name:var(--font-serif)] text-5xl font-bold leading-none ${t.price}`}
                    >
                      <span className="align-top text-2xl">₹</span>
                      {pkg.price}
                    </p>

                    <p
                      className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] ${t.muted}`}
                    >
                      Lakhs
                    </p>

                    <div
                      className={`mt-2.5 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-semibold ${t.pill}`}
                    >
                      <Users size={12} />
                      {pkg.pax}
                    </div>
                  </div>

                  <div
                    className={`relative my-3.5 h-px bg-gradient-to-r ${t.divider}`}
                  />

                  <p
                    className={`relative mb-2.5 flex items-center justify-center gap-1.5 text-[11px] font-medium sm:text-xs ${t.text}`}
                  >
                    <CalendarDays size={13} className={t.check} />
                    {pkg.duration}
                  </p>

                  <ul className="relative flex-1 space-y-1.5">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-2 text-[11px] leading-4 sm:text-xs ${t.text}`}
                      >
                        <CheckCircle2
                          size={13}
                          className={`mt-px shrink-0 ${t.check}`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-4 flex flex-nowrap gap-1.5 sm:gap-2">
                    {packageWhatsApp ? (
                      <a
                        href={packageWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-1 text-[10px] font-semibold transition sm:h-9 sm:text-xs ${t.ghost}`}
                      >
                        <MessageCircle size={12} className="shrink-0" />
                        WhatsApp
                      </a>
                    ) : (
                      <Link
                        href={`/contact?type=wedding&package=${encodeURIComponent(pkg.id)}`}
                        className={`inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-1 text-[10px] font-semibold transition sm:h-9 sm:text-xs ${t.ghost}`}
                      >
                        <MessageCircle size={12} className="shrink-0" />
                        Enquire
                      </Link>
                    )}

                    <Link
                      href={`/booking?type=wedding&package=${encodeURIComponent(pkg.id)}`}
                      className="inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r from-[#B96928] to-[#D4A24C] px-1 text-[10px] font-semibold text-white shadow-sm transition hover:brightness-110 sm:h-9 sm:text-xs"
                    >
                      <CalendarCheck2 size={12} className="shrink-0" />
                      Book Now
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= WEDDING SERVICES ================= */}
      <section className={sectionWrap}>
        <div className="mb-3.5 sm:mb-4">
          <h2 className={sectionHeading}>
            Everything You Need for Your Celebration
          </h2>

          <p className={sectionSub}>
            Tap a service to enquire and build your own wedding experience.
          </p>
        </div>

        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-4">
          {data.services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.id}
                className="group relative h-[150px] overflow-hidden rounded-xl border border-black/5 bg-[#172033] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 sm:h-[190px]"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 767px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/40 to-transparent" />

                <Link
                  href={`/contact?type=wedding&service=${encodeURIComponent(service.id)}`}
                  aria-label={`Enquire about ${service.title}`}
                  className="absolute inset-0 z-[1] rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#E0924F]"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] p-2.5 sm:p-3.5">
                  <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-[#E0924F] backdrop-blur sm:h-7 sm:w-7">
                    <Icon size={14} />
                  </div>

                  <h3 className="line-clamp-2 text-[12px] font-semibold leading-[1.25] tracking-tight text-white transition-colors group-hover:text-[#E0924F] sm:text-sm">
                    {service.title}
                  </h3>

                  <p className="mt-0.5 line-clamp-2 text-[9px] leading-3 text-white/80 sm:text-xs sm:leading-4">
                    {service.text}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= CORBETT EXPERIENCE ================= */}
      <section className={sectionWrap}>
        <div className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5 sm:rounded-2xl">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[170px] overflow-hidden sm:min-h-[220px] md:min-h-[260px]">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={data.experience.image}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source
                  src="/videos/wedding-experience.mp4"
                  type="video/mp4"
                />
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/45 to-transparent" />

              <span className="absolute bottom-2.5 left-2.5 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur sm:bottom-3 sm:left-3">
                Experience Corbett
              </span>
            </div>

            <div className="flex items-center p-4 sm:p-5">
              <div className="max-w-xl">
                <h2 className={sectionHeading}>{data.experience.title}</h2>

                <p className={sectionSub}>{data.experience.description}</p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {data.experience.points.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-1.5 text-[11px] leading-4 text-[#172033] dark:text-gray-200 sm:text-xs"
                    >
                      <CheckCircle2
                        size={13}
                        className="mt-px shrink-0 text-[#B96928]"
                      />
                      {item}
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact?type=wedding"
                  className={`${pillPrimary} mt-3.5`}
                >
                  Start Planning
                  <Send size={11} className="shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className={sectionWrap}>
        <div className="mb-3.5 sm:mb-4">
          <h2 className={sectionHeading}>From Idea to Celebration</h2>

          <p className={sectionSub}>
            Four simple steps to your Corbett wedding.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {data.process.map((step) => (
            <article
              key={step.number}
              className="rounded-xl border border-black/5 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-3.5"
            >
              <span className="text-lg font-bold text-[#B96928]/60 sm:text-xl">
                {step.number}
              </span>

              <h3 className="mt-1 text-xs font-semibold leading-tight text-[#172033] dark:text-gray-100 sm:text-sm">
                {step.title}
              </h3>

              <p className="mt-1 text-[10px] leading-4 text-gray-600 dark:text-gray-300 sm:text-xs sm:leading-4">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA + ORGANISATION CONTACT ================= */}
      <section className="mx-auto max-w-6xl px-3 pb-6 pt-1 sm:px-5 sm:pb-8 md:px-6">
        <div className="relative overflow-hidden rounded-xl bg-[#B96928] px-4 py-5 text-center text-white shadow-sm sm:rounded-2xl sm:px-6 sm:py-7">
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-xl">
            <Heart className="mx-auto h-5 w-5 sm:h-6 sm:w-6" />

            <h2 className="mt-2 text-lg font-bold leading-tight sm:text-xl md:text-2xl">
              Ready to plan your Corbett wedding?
            </h2>

            <p className="mx-auto mt-1 max-w-md text-[11px] leading-4 text-white/85 sm:text-sm sm:leading-5">
              Share your wedding date, guest count and preferences. Our team
              will help you with suitable arrangements.
            </p>

            <div className="mt-3.5 flex flex-wrap justify-center gap-2">
              <Link
                href="/contact?type=wedding"
                className="inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-white px-4 text-[10px] font-semibold text-[#172033] transition hover:bg-white/90 sm:h-9 sm:text-xs"
              >
                Wedding Enquiry
                <Send size={11} className="shrink-0" />
              </Link>

              <Link
                href="/booking?type=wedding"
                className="inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-white/40 bg-white/10 px-4 text-[10px] font-semibold text-white transition hover:bg-white/20 sm:h-9 sm:text-xs"
              >
                <CalendarCheck2 size={11} className="shrink-0" />
                Book Now
              </Link>

              {generalWhatsAppLink && (
                <a
                  href={generalWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-white/40 bg-white/10 px-4 text-[10px] font-semibold text-white transition hover:bg-white/20 sm:h-9 sm:text-xs"
                >
                  <MessageCircle size={11} className="shrink-0" />
                  WhatsApp Us
                </a>
              )}
            </div>

            {(phoneNumber || contact.email) && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/20 pt-3.5 text-[11px] text-white/90 sm:text-xs">
                {phoneNumber && (
                  <a
                    href={`tel:${phoneNumber}`}
                    className="inline-flex items-center gap-1.5 transition hover:text-white"
                  >
                    <Phone size={13} />
                    {contact.phone}
                  </a>
                )}

                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-1.5 transition hover:text-white"
                  >
                    <Mail size={13} />
                    {contact.email}
                  </a>
                )}
              </div>
            )}

            <p className="mt-2.5 text-[10px] text-white/70">{contact.name}</p>
          </div>
        </div>
      </section>
    </main>
  );
}