"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Users,
  MapPin,
  CheckCircle2,
  Heart,
  CalendarCheck2,
  Send,
} from "lucide-react";

const weddingPageData = {
  hero: {
    eyebrow: "DESTINATION WEDDINGS IN JIM CORBETT",
    title: "Your Love Story,",
    highlight: "Surrounded by Nature.",
    description:
      "Celebrate your special day in the heart of Jim Corbett with beautiful venues, comfortable stays, curated experiences and complete wedding planning support.",
    image: "/weddings/wedding-hero1.jpg",
  },

  introduction: {
    eyebrow: "CELEBRATE DIFFERENTLY",
    title: "A destination wedding.",
    highlight: "Made for unforgettable moments.",
    paragraphs: [
      "Imagine exchanging vows surrounded by the forests, mountains and peaceful beauty of Jim Corbett.",
      "From intimate celebrations to grand destination weddings, we create beautiful experiences where every moment feels personal, effortless and unforgettable.",
    ],
  },

  venues: [
    {
      id: "forest-view-resort",
      title: "Forest View Resort",
      location: "Dhikuli, Jim Corbett",
      guests: "100–300 Guests",
      price: "Custom Quote",
      image: "/weddings/venue-1.jpg",
    },
    {
      id: "riverside-wedding",
      title: "Riverside Wedding Venue",
      location: "Near Kosi River",
      guests: "150–500 Guests",
      price: "Custom Quote",
      image: "/weddings/venue-2.jpg",
    },
    {
      id: "luxury-jungle-resort",
      title: "Luxury Jungle Resort",
      location: "Ramnagar, Corbett",
      guests: "100–400 Guests",
      price: "Custom Quote",
      image: "/weddings/venue-3.jpg",
    },
  ],

  services: [
    {
      image: "/weddings/venue-stay.jpg",
      title: "Venue & Stay",
      text: "Beautiful wedding venues with comfortable accommodation for your guests.",
    },
    {
      image: "/weddings/catering.jpg",
      title: "Catering",
      text: "Curated menus, local flavours and customised dining experiences.",
    },
    {
      image: "/weddings/decor-styling.jpg",
      title: "Decor & Styling",
      text: "Wedding decor designed around your theme, colours and celebration style.",
    },
    {
      image: "/weddings/photography.jpg",
      title: "Photography & Films",
      text: "Capture every meaningful moment with professional wedding photography and films.",
    },
    {
      image: "/weddings/entertainment.jpg",
      title: "Entertainment",
      text: "Music, DJ, performances and entertainment for every wedding function.",
    },
    {
      image: "/weddings/guest-transport.jpg",
      title: "Guest Transport",
      text: "Comfortable transportation arrangements for your family and guests.",
    },
    {
      image: "/weddings/mehndi-makeup.jpg",
      title: "Mehndi & Makeup",
      text: "Bridal makeup, mehndi and beauty services for your special celebrations.",
    },
    {
      image: "/weddings/wedding-planning.jpg",
      title: "Wedding Planning",
      text: "Complete planning, coordination and on-ground support for your wedding.",
    },
  ],

  experience: {
    eyebrow: "THE CORBETT EXPERIENCE",
    title: "Make your wedding a",
    highlight: "Corbett experience.",
    description:
      "Give your guests more than a wedding. Combine your celebration with jungle experiences, nature, local culture, comfortable stays and unforgettable moments.",
    image: "/weddings/wedding-experience.jpg",
  },

  packages: [
    {
      id: "intimate",
      title: "Intimate Wedding",
      subtitle: "For close family & friends",
      features: [
        "Venue arrangement",
        "Guest accommodation",
        "Wedding decor",
        "Catering",
      ],
    },
    {
      id: "destination",
      title: "Destination Wedding",
      subtitle: "A complete Corbett celebration",
      featured: true,
      features: [
        "Premium venue",
        "Guest accommodation",
        "Multi-function decor",
        "Catering & hospitality",
        "Photography",
        "Entertainment",
      ],
    },
    {
      id: "grand",
      title: "Grand Celebration",
      subtitle: "For a larger wedding experience",
      features: [
        "Large wedding venue",
        "Premium accommodation",
        "Complete event styling",
        "Premium catering",
        "Entertainment",
        "Guest transportation",
      ],
    },
  ],

  process: [
    {
      number: "01",
      title: "Tell Us Your Plan",
      text: "Share your wedding date, guest count, functions and requirements with our team.",
    },
    {
      number: "02",
      title: "Choose Your Venue",
      text: "Explore suitable Corbett venues based on your guest count, style and budget.",
    },
    {
      number: "03",
      title: "Customise",
      text: "Build your wedding experience with stay, food, decor, photography and entertainment.",
    },
    {
      number: "04",
      title: "Celebrate",
      text: "Our team coordinates the experience so you can focus on your special moments.",
    },
  ],
};

export default function WeddingsPage() {
  const data = weddingPageData;

  return (
    <main className="bg-[#F7F5F0] text-[#172033]">
      {/* HERO */}
      <section className="overflow-visible bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto min-h-[300px] max-w-[1440px] overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[420px] sm:rounded-[24px] md:min-h-[470px] md:rounded-[28px] lg:min-h-[560px]">
          <div className="absolute inset-0 lg:left-auto lg:w-[62%]">
            <Image
              src={data.hero.image}
              alt="Destination wedding couple in Jim Corbett"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 900px"
              className="object-cover brightness-110 lg:object-bottom"
            />
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-[38%] hidden w-[16%] bg-gradient-to-r from-[#172033] to-transparent lg:block" />

          <div className="absolute inset-0 bg-black/5" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/70 via-[#172033]/25 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/40 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[300px] items-center px-4 py-6 sm:min-h-[420px] sm:px-8 sm:py-10 md:min-h-[470px] md:px-10 lg:min-h-[560px] lg:px-14">
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] backdrop-blur-xl sm:mb-4 sm:px-3 sm:py-1.5 sm:text-xs">
                <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {data.hero.eyebrow}
              </div>

              <h1 className="max-w-2xl text-[28px] font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {data.hero.title}
                <span className="mt-1 block text-[#C87532] sm:mt-2">
                  {data.hero.highlight}
                </span>
              </h1>

              <p className="mt-2 max-w-xl text-[12px] leading-5 text-white/75 sm:mt-4 sm:text-sm sm:leading-6 md:text-base md:leading-7 lg:max-w-md xl:max-w-xl">
                {data.hero.description}
              </p>

              <div className="mt-4 flex flex-row flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                <Link
                  href="/contact?type=wedding"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-3.5 py-2 text-[10px] font-semibold text-white shadow-md transition hover:bg-[#B96928] sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Plan Wedding
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Link>

                <Link
                  href="/booking?type=wedding"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[10px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  <CalendarCheck2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Book Now
                </Link>

                <a
                  href="#venues"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-[10px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Explore Venues
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-white/65 sm:mt-6 sm:gap-x-6 sm:gap-y-3 sm:text-xs">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#C87532] sm:h-4 sm:w-4" />
                  Wedding Planning
                </span>

                <span className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#C87532] sm:h-4 sm:w-4" />
                  Stay & Hospitality
                </span>

                <span className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#C87532] sm:h-4 sm:w-4" />
                  Custom Packages
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-4 py-9 sm:px-5 sm:py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
                {data.introduction.eyebrow}
              </p>

              <h2 className="mt-1.5 text-[25px] font-semibold leading-tight sm:text-3xl md:text-4xl">
                {data.introduction.title}
                <br />
                <span className="text-[#C87532]">
                  {data.introduction.highlight}
                </span>
              </h2>
            </div>

            <div className="rounded-xl border border-black/5 bg-white/70 p-4 shadow-sm backdrop-blur-xl sm:rounded-2xl sm:p-5">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#C87532]/10 text-[#C87532] sm:h-10 sm:w-10 sm:rounded-xl">
                <Heart className="h-4 w-4" />
              </div>

              <div className="space-y-2.5 text-[11px] leading-5 text-[#172033]/65 sm:space-y-3 sm:text-sm sm:leading-6">
                {data.introduction.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VENUES */}
      {/* VENUES */}
<section
  id="venues"
  className="scroll-mt-20 bg-white px-4 py-10 sm:px-5 sm:py-12 md:px-8 md:py-16"
>
  <div className="mx-auto max-w-7xl">
    {/* SECTION HEADER */}
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#C87532] sm:text-xs">
          Wedding Venues
        </p>

        <h2 className="mt-2 text-[27px] font-semibold leading-[1.1] tracking-tight text-[#172033] sm:text-3xl md:text-4xl">
          Find your perfect{" "}
          <span className="text-[#C87532]">setting.</span>
        </h2>

        <p className="mt-2.5 max-w-xl text-[12px] leading-5 text-[#172033]/60 sm:text-sm sm:leading-6">
          Choose a beautiful Corbett venue and customise your celebration
          according to your guest count and requirements.
        </p>
      </div>

      <Link
        href="/stay/resorts-stays"
        className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold text-[#172033] transition hover:text-[#C87532] sm:text-sm"
      >
        Explore Stays
        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Link>
    </div>

    {/* VENUE CARDS */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {data.venues.map((venue) => (
        <article
          key={venue.id}
          className="group overflow-hidden rounded-2xl border border-black/[0.08] bg-[#F7F5F0] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          {/* IMAGE */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={venue.image}
              alt={venue.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            {/* IMAGE OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-[#172033]/10 to-transparent" />

            {/* BADGE */}
            <div className="absolute left-3 top-3">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-md">
                Wedding Venue
              </span>
            </div>

            {/* IMAGE TEXT */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <h3 className="text-[17px] font-semibold leading-tight text-white sm:text-lg">
                {venue.title}
              </h3>

              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/75 sm:text-xs">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{venue.location}</span>
              </div>
            </div>
          </div>

          {/* CARD CONTENT */}
          <div className="p-3.5 sm:p-4">
            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-black/[0.05] bg-white px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wide text-[#172033]/45 sm:text-[10px]">
                  <Users className="h-3 w-3" />
                  Capacity
                </div>

                <p className="mt-1 text-[11px] font-bold text-[#172033] sm:text-xs">
                  {venue.guests}
                </p>
              </div>

              <div className="rounded-xl border border-black/[0.05] bg-white px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wide text-[#172033]/45 sm:text-[10px]">
                  <CalendarDays className="h-3 w-3" />
                  Pricing
                </div>

                <p className="mt-1 text-[11px] font-bold text-[#172033] sm:text-xs">
                  {venue.price}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href={`/contact?type=wedding&venue=${encodeURIComponent(
                  venue.id
                )}&venueName=${encodeURIComponent(
                  venue.title
                )}&venueImage=${encodeURIComponent(
                  venue.image
                )}&location=${encodeURIComponent(venue.location)}`}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#C87532]/30 bg-[#C87532]/5 px-3 text-[10px] font-semibold text-[#C87532] transition hover:border-[#C87532] hover:bg-[#C87532]/10 sm:text-xs"
              >
                Enquire
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href={`/booking?type=wedding&venue=${encodeURIComponent(
                  venue.id
                )}&venueName=${encodeURIComponent(
                  venue.title
                )}&venueImage=${encodeURIComponent(
                  venue.image
                )}&location=${encodeURIComponent(venue.location)}`}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#172033] px-3 text-[10px] font-semibold text-white transition hover:bg-[#C87532] sm:text-xs"
              >
                <CalendarCheck2 className="h-3.5 w-3.5" />
                Book Now
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>

      {/* SERVICES */}
      <section className="bg-[#F7F5F0] px-4 py-9 sm:px-5 sm:py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
              Complete Wedding Support
            </p>

            <h2 className="mt-1.5 text-[25px] font-semibold leading-tight sm:text-3xl md:text-4xl">
              Everything you need for
              <span className="text-[#C87532]"> your celebration.</span>
            </h2>

            <p className="mt-2 text-[11px] leading-5 text-black/60 sm:text-sm sm:leading-6">
              Build your wedding around the services you actually need.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {data.services.map((service) => (
              <div
                key={service.title}
                className="group overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>

                <div className="p-2.5 sm:p-4">
                  <h3 className="text-[11px] font-semibold leading-tight sm:text-sm">
                    {service.title}
                  </h3>

                  <p className="mt-1.5 text-[10px] leading-4 text-black/55 sm:text-[11px] sm:leading-5">
                    {service.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORBETT EXPERIENCE */}
      <section className="px-4 py-9 sm:px-5 sm:py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-xl bg-[#EDE9E1] sm:rounded-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[330px]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                >
                  <source
                    src="/videos/wedding-experience.mp4"
                    type="video/mp4"
                  />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/55 via-transparent to-transparent" />

                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
                  <span className="rounded-full border border-white/20 bg-black/20 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-xl sm:px-3 sm:py-1.5 sm:text-[9px]">
                    Experience Corbett
                  </span>
                </div>
              </div>

              <div className="flex items-center p-4 sm:p-6 md:p-8">
                <div className="max-w-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
                    {data.experience.eyebrow}
                  </p>

                  <h2 className="mt-1.5 text-[23px] font-semibold leading-tight sm:mt-2 sm:text-3xl md:text-4xl">
                    {data.experience.title}
                    <span className="text-[#C87532]">
                      {" "}
                      {data.experience.highlight}
                    </span>
                  </h2>

                  <p className="mt-2 text-[11px] leading-5 text-black/60 sm:mt-3 sm:text-sm sm:leading-6">
                    {data.experience.description}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:mt-4 sm:gap-x-4 sm:gap-y-2">
                    {[
                      "Nature experiences",
                      "Outdoor activities",
                      "Local experiences",
                      "Flexible planning",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-1.5 text-[10px] font-medium leading-4 sm:gap-2 sm:text-[11px] sm:leading-5"
                      >
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#C87532] sm:h-3.5 sm:w-3.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/contact?type=wedding"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#C87532] px-3.5 py-2 text-[10px] font-semibold text-white transition hover:bg-[#B96928] sm:mt-4 sm:px-4 sm:py-2.5 sm:text-xs"
                  >
                    <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Start Planning
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="bg-[#172033] px-4 py-9 sm:px-5 sm:py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
              Wedding Packages
            </p>

            <h2 className="mt-1.5 text-[25px] font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
              Start with a package,
              <span className="text-[#C87532]"> customise the rest.</span>
            </h2>

            <p className="mt-2 text-[11px] leading-5 text-white/60 sm:text-sm sm:leading-6">
              Choose a starting point and customise the celebration according
              to your wedding plans.
            </p>
          </div>

          <div className="mt-5 grid gap-2.5 sm:mt-7 sm:grid-cols-3 sm:gap-4">
            {data.packages.map((pkg) => (
              <article
                key={pkg.id}
                className={`relative rounded-xl border p-3.5 sm:rounded-2xl sm:p-5 ${
                  pkg.featured
                    ? "border-[#C87532]/60 bg-[#C87532]/10"
                    : "border-white/10 bg-white/[0.05]"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute right-2 top-2 rounded-full bg-[#C87532] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white sm:right-3 sm:top-3 sm:px-2.5 sm:text-[9px]">
                    Popular
                  </div>
                )}

                <div className="pr-12">
                  <h3 className="text-sm font-semibold text-white sm:text-base">
                    {pkg.title}
                  </h3>

                  <p className="mt-1 text-[10px] text-white/55 sm:text-[11px]">
                    {pkg.subtitle}
                  </p>
                </div>

                <div className="my-3 h-px bg-white/10 sm:my-4" />

                <ul className="space-y-1.5 sm:space-y-2">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-1.5 text-[10px] leading-4 text-white/70 sm:gap-2 sm:text-[11px] sm:leading-5"
                    >
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#C87532] sm:h-3.5 sm:w-3.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 grid grid-cols-2 gap-1.5 sm:mt-5 sm:gap-2">
                  <Link
                    href={`/contact?type=wedding&package=${encodeURIComponent(
                      pkg.id
                    )}`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#C87532]/40 bg-[#C87532]/10 px-2 py-2 text-[9px] font-semibold text-[#C87532] transition hover:bg-[#C87532]/20 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[10px]"
                  >
                    Get Quote
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Link>

                  <Link
                    href={`/booking?type=wedding&package=${encodeURIComponent(
                      pkg.id
                    )}`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#C87532] px-2 py-2 text-[9px] font-semibold text-white transition hover:bg-[#B96928] sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[10px]"
                  >
                    <CalendarCheck2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    Book Now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white px-4 py-9 sm:px-5 sm:py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C87532] sm:text-xs">
                How It Works
              </p>

              <h2 className="mt-1.5 text-[25px] font-semibold leading-tight sm:text-3xl md:text-4xl">
                From idea to
                <span className="text-[#C87532]"> celebration.</span>
              </h2>

              <p className="mt-2 max-w-md text-[11px] leading-5 text-black/60 sm:text-sm sm:leading-6">
                Tell us what you are planning and we help bring the different
                pieces together.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-0">
              {data.process.map((step, index) => (
                <div key={step.number} className="relative">
                  {index < data.process.length - 1 && (
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
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 pb-9 sm:px-5 sm:pb-12 md:px-8 md:pb-14">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#C87532] px-4 py-7 text-center text-white sm:rounded-2xl sm:px-6 sm:py-9">
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <Heart className="mx-auto h-6 w-6 text-white/90 sm:h-7 sm:w-7" />

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80 sm:text-xs">
              Plan Your Wedding in Jim Corbett
            </p>

            <h2 className="mt-1.5 text-[24px] font-semibold leading-tight sm:text-3xl md:text-4xl">
              Ready to plan your Corbett wedding?
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-[11px] leading-5 text-white/75 sm:text-sm sm:leading-6">
              Tell us what you have in mind and our wedding team will help you
              create the right experience.
            </p>

            <div className="mt-4 flex flex-row justify-center gap-1.5 sm:gap-2">
              <Link
                href="/contact?type=wedding"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[10px] font-semibold text-[#172033] transition hover:bg-white/90 sm:px-5 sm:py-2.5 sm:text-xs"
              >
                <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Wedding Enquiry
                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Link>

              <Link
                href="/booking?type=wedding"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/40 bg-white/10 px-3.5 py-2 text-[10px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/15 sm:px-5 sm:py-2.5 sm:text-xs"
              >
                <CalendarCheck2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}