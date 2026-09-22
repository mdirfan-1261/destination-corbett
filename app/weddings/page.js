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
      <section className="overflow-hidden bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto min-h-[270px] max-w-[1440px] overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[410px] sm:rounded-[24px] md:min-h-[450px] md:rounded-[28px] lg:min-h-[600px]">
          {/* IMAGE: full-width on mobile/tablet, right 62% on desktop so the couple sits clear of the text */}
          <div className="absolute inset-0 lg:left-auto lg:w-[62%]">
            <Image
              src="/weddings/wedding-hero1.jpg"
              alt="Destination wedding couple in Jim Corbett"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 900px"
              className="object-cover brightness-110 lg:object-bottom"
            />
          </div>

          {/* Desktop only: soft blend from the solid navy text side into the photo */}
          <div className="pointer-events-none absolute inset-y-0 left-[38%] hidden w-[16%] bg-gradient-to-r from-[#172033] to-transparent lg:block" />

          {/* LIGHTER OVERLAYS */}
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/65 via-[#172033]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/40 via-transparent to-transparent" />

          <div className="relative z-10 flex min-h-[270px] items-center px-4 py-6 sm:min-h-[410px] sm:px-8 sm:py-10 md:min-h-[450px] md:px-10 lg:min-h-[600px] lg:px-14">
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#E2A45F] backdrop-blur-xl sm:mb-4 sm:px-3 sm:py-1.5 sm:text-[9px]">
                <Heart className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                {data.hero.eyebrow}
              </div>

              <h1 className="max-w-2xl text-[24px]  leading-[1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {data.hero.title}
                <span className="mt-1 block text-[#E2A45F] sm:mt-2">
                  {data.hero.highlight}
                </span>
              </h1>

              <p className="mt-2 max-w-xl text-[9px] leading-3.5 text-white/75 sm:mt-4 sm:text-xs sm:leading-6 md:text-sm md:leading-7 lg:max-w-md xl:max-w-xl">
                {data.hero.description}
              </p>

              <div className="mt-3 flex flex-row flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
                <Link
                  href="/contact?type=wedding"
                  className="inline-flex items-center justify-center gap-1 rounded-full bg-[#C88A3D] px-3 py-1.5 text-[8px] font-semibold text-white shadow-md transition hover:bg-[#b97932] sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  <Send className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  Plan Wedding
                  <ArrowRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                </Link>

                <Link
                  href="/booking?type=wedding"
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[8px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  <CalendarCheck2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  Book Now
                </Link>

                <a
                  href="#venues"
                  className="inline-flex items-center justify-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[8px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Explore Venues
                  <ArrowRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[7px] text-white/60 sm:mt-6 sm:gap-x-6 sm:gap-y-3 sm:text-xs lg:max-w-md xl:max-w-none">
                <span className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#E2A45F] sm:h-4 sm:w-4" />
                  Wedding Planning
                </span>

                <span className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#E2A45F] sm:h-4 sm:w-4" />
                  Stay & Hospitality
                </span>

                <span className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle2 className="h-3 w-3 text-[#E2A45F] sm:h-4 sm:w-4" />
                  Custom Packages
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-3.5 py-4 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-7">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C88A3D] sm:text-xs">
                {data.introduction.eyebrow}
              </p>

              <h2 className="mt-1 text-lg font-semibold leading-tight sm:text-2xl md:text-3xl">
                {data.introduction.title}
                <br />
                <span className="text-[#C88A3D]">
                  {data.introduction.highlight}
                </span>
              </h2>
            </div>

            <div className="rounded-xl border border-black/5 bg-white/70 p-3.5 shadow-sm backdrop-blur-xl sm:rounded-2xl sm:p-5">
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#C88A3D]/10 text-[#C88A3D] sm:mb-3 sm:h-10 sm:w-10 sm:rounded-xl">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>

              <div className="space-y-2 text-[9px] leading-3.5 text-[#172033]/65 sm:space-y-3 sm:text-xs sm:leading-5">
                {data.introduction.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VENUES */}
      <section
        id="venues"
        className="scroll-mt-20 bg-white px-3.5 py-5 sm:px-5 sm:py-8 md:px-8 md:py-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#C88A3D] sm:text-xs">
                Wedding Venues
              </p>

              <h2 className="mt-1 text-lg font-semibold leading-tight sm:text-2xl md:text-3xl">
                Find your perfect
                <span className="text-[#C88A3D]"> setting.</span>
              </h2>

              <p className="mt-1 max-w-2xl text-[9px] leading-3.5 text-black/60 sm:mt-2 sm:text-xs sm:leading-5">
                Choose a beautiful Corbett venue and customise your celebration
                according to your guest count and requirements.
              </p>
            </div>

            <Link
              href="/stay/resorts-stays"
              className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#172033] transition hover:text-[#C88A3D] sm:text-xs"
            >
              Explore Stays
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {data.venues.map((venue) => (
              <article
                key={venue.id}
                className="group overflow-hidden rounded-xl border border-black/10 bg-[#F7F5F0] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
                  <Image
                    src={venue.image}
                    alt={venue.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-[#172033]/15 to-transparent" />

                  <div className="absolute left-1.5 top-1.5 rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-[6px] font-semibold uppercase tracking-wider text-white backdrop-blur-md sm:left-2.5 sm:top-2.5 sm:px-2.5 sm:py-1 sm:text-[8px]">
                    Wedding Venue
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5">
                    <h3 className="text-[10px] font-semibold leading-tight text-white sm:text-sm">
                      {venue.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-[7px] text-white/75 sm:text-[9px]">
                      <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {venue.location}
                    </div>
                  </div>
                </div>

                <div className="p-2 sm:p-3">
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div className="rounded-lg bg-white p-1.5 sm:rounded-xl sm:p-2.5">
                      <div className="flex items-center gap-1 text-[7px] text-[#172033]/50 sm:text-[9px]">
                        <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        Capacity
                      </div>

                      <p className="mt-0.5 text-[8px] font-semibold sm:text-[10px]">
                        {venue.guests}
                      </p>
                    </div>

                    <div className="rounded-lg bg-white p-1.5 sm:rounded-xl sm:p-2.5">
                      <div className="flex items-center gap-1 text-[7px] text-[#172033]/50 sm:text-[9px]">
                        <CalendarDays className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        Pricing
                      </div>

                      <p className="mt-0.5 text-[8px] font-semibold sm:text-[10px]">
                        {venue.price}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-1.5 sm:mt-3 sm:gap-2">
                    <Link
                      href={`/contact?type=wedding&venue=${encodeURIComponent(
                        venue.id
                      )}&venueName=${encodeURIComponent(
                        venue.title
                      )}&venueImage=${encodeURIComponent(
                        venue.image
                      )}&location=${encodeURIComponent(
                        venue.location
                      )}`}


                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#C88A3D]/30 bg-[#C88A3D]/5 px-2 py-2 text-[7px] font-semibold text-[#C88A3D] transition hover:bg-[#C88A3D]/10 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[10px]"
                    >
                      Enquire
                      <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </Link>

                    <Link
                      href={`/booking?type=wedding&venue=${encodeURIComponent(
                        venue.id
                      )}&venueName=${encodeURIComponent(
                        venue.title
                      )}&venueImage=${encodeURIComponent(
                        venue.image
                      )}&location=${encodeURIComponent(
                        venue.location
                      )}`}


                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#172033] px-2 py-2 text-[7px] font-semibold text-white transition hover:bg-[#26334b] sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[10px]"
                    >
                      <CalendarCheck2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
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
      <section className="bg-[#F7F5F0] px-3.5 py-5 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C88A3D] sm:text-xs">
              Complete Wedding Support
            </p>

            <h2 className="mt-1 text-lg font-semibold leading-tight sm:text-2xl md:text-3xl">
              Everything you need for
              <span className="text-[#C88A3D]"> your celebration.</span>
            </h2>

            <p className="mt-1 text-[9px] leading-3.5 text-black/60 sm:mt-2 sm:text-xs sm:leading-5">
              Build your wedding around the services you actually need.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
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
                  <h3 className="text-[9px] font-semibold leading-tight sm:text-sm">
                    {service.title}
                  </h3>

                  <p className="mt-1 text-[8px] leading-3 text-black/55 sm:text-[10px] sm:leading-4">
                    {service.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORBETT EXPERIENCE */}
      <section className="px-3.5 py-5 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-xl bg-[#EDE9E1] sm:rounded-2xl">
            <div className="grid lg:grid-cols-2">
              {/* VIDEO */}
              <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[330px]">

                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                 //{/* poster="/weddings/wedding-experience.jpg" */} 
                  className="absolute inset-0 h-full w-full object-cover object-center"
                >

                  <source
                    src="/videos/wedding-experience.mp4"
                    type="video/mp4"
                  />

                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/55 via-transparent to-transparent" />

                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
                  <span className="rounded-full border border-white/20 bg-black/20 px-2 py-0.5 text-[6px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-xl sm:px-3 sm:py-1.5 sm:text-[9px]">
                    Experience Corbett
                  </span>
                </div>
              </div>

              <div className="flex items-center p-3.5 sm:p-6 md:p-8">
                <div className="max-w-xl">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C88A3D] sm:text-xs">
                    {data.experience.eyebrow}
                  </p>

                  <h2 className="mt-1 text-base font-semibold leading-tight sm:mt-2 sm:text-2xl md:text-3xl">
                    {data.experience.title}
                    <span className="text-[#C88A3D]">
                      {" "}
                      {data.experience.highlight}
                    </span>
                  </h2>

                  <p className="mt-1.5 text-[9px] leading-3.5 text-black/60 sm:mt-3 sm:text-xs sm:leading-5">
                    {data.experience.description}
                  </p>

                  <div className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1 sm:mt-4 sm:gap-x-4 sm:gap-y-2">
                    {[
                      "Nature experiences",
                      "Outdoor activities",
                      "Local experiences",
                      "Flexible planning",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-1 text-[8px] font-medium leading-3 sm:gap-2 sm:text-[10px] sm:leading-4"
                      >
                        <CheckCircle2 className="mt-0.5 h-2.5 w-2.5 shrink-0 text-[#C88A3D] sm:h-3.5 sm:w-3.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/contact?type=wedding"
                    className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#C88A3D] px-3 py-1.5 text-[8px] font-semibold text-white transition hover:bg-[#b97932] sm:mt-4 sm:px-4 sm:py-2 sm:text-xs"
                  >
                    <Send className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                    Start Planning
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="bg-[#172033] px-3.5 py-5 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#E2A45F] sm:text-xs">
              Wedding Packages
            </p>

            <h2 className="mt-1 text-lg font-semibold leading-tight text-white sm:text-2xl md:text-3xl">
              Start with a package,
              <span className="text-[#E2A45F]"> customise the rest.</span>
            </h2>

            <p className="mt-1 text-[9px] leading-3.5 text-white/60 sm:mt-2 sm:text-xs sm:leading-5">
              Choose a starting point and customise the celebration according
              to your wedding plans.
            </p>
          </div>

          <div className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
            {data.packages.map((pkg) => (
              <article
                key={pkg.id}
                className={`relative rounded-xl border p-3 sm:rounded-2xl sm:p-4 ${pkg.featured
                    ? "border-[#C88A3D]/60 bg-[#C88A3D]/10"
                    : "border-white/10 bg-white/[0.05]"
                  }`}
              >
                {pkg.featured && (
                  <div className="absolute right-2 top-2 rounded-full bg-[#C88A3D] px-2 py-0.5 text-[6px] font-bold uppercase tracking-wider text-white sm:right-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[8px]">
                    Popular
                  </div>
                )}

                <div className="pr-12">
                  <h3 className="text-sm font-semibold text-white sm:text-base">
                    {pkg.title}
                  </h3>

                  <p className="mt-1 text-[8px] text-white/55 sm:text-[10px]">
                    {pkg.subtitle}
                  </p>
                </div>

                <div className="my-3 h-px bg-white/10 sm:my-4" />

                <ul className="space-y-1.5 sm:space-y-2">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-1.5 text-[8px] text-white/70 sm:gap-2 sm:text-[10px]"
                    >
                      <CheckCircle2 className="mt-0.5 h-2.5 w-2.5 shrink-0 text-[#E2A45F] sm:h-3.5 sm:w-3.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 grid grid-cols-2 gap-1.5 sm:mt-5 sm:gap-2">
                  <Link
                    href={`/contact?type=wedding&package=${encodeURIComponent(
                      pkg.id
                    )}`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#C88A3D]/40 bg-[#C88A3D]/10 px-2 py-2 text-[7px] font-semibold text-[#E2A45F] transition hover:bg-[#C88A3D]/20 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[10px]"
                  >
                    Get Quote
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Link>

                  <Link
                    href={`/booking?type=wedding&package=${encodeURIComponent(
                      pkg.id
                    )}`}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#C88A3D] px-2 py-2 text-[7px] font-semibold text-white transition hover:bg-[#d69a4e] sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[10px]"
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
      <section className="bg-white px-3.5 py-5 sm:px-5 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-10">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[#C88A3D] sm:text-xs">
                How It Works
              </p>

              <h2 className="mt-1 text-lg font-semibold leading-tight sm:text-2xl md:text-3xl">
                From idea to
                <span className="text-[#C88A3D]"> celebration.</span>
              </h2>

              <p className="mt-1 max-w-md text-[9px] leading-3.5 text-black/60 sm:mt-2 sm:text-xs sm:leading-5">
                Tell us what you are planning and we help bring the different
                pieces together.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-0">
              {data.process.map((step, index) => (
                <div key={step.number} className="relative">
                  {index < data.process.length - 1 && (
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
      <section className="px-3.5 pb-5 sm:px-5 sm:pb-8 md:px-8 md:pb-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#C88A3D] px-3.5 py-5 text-center text-white sm:rounded-2xl sm:px-6 sm:py-8">
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <Heart className="mx-auto h-5 w-5 text-white/90 sm:h-7 sm:w-7" />

            <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/80 sm:text-xs">
              Plan Your Wedding in Jim Corbett
            </p>

            <h2 className="mt-1 text-lg font-semibold leading-tight sm:text-2xl md:text-3xl">
              Ready to plan your Corbett wedding?
            </h2>

            <p className="mx-auto mt-1 max-w-xl text-[9px] leading-3.5 text-white/75 sm:mt-2 sm:text-xs sm:leading-5">
              Tell us what you have in mind and our wedding team will help you
              create the right experience.
            </p>

            <div className="mt-3 flex flex-row justify-center gap-1.5 sm:mt-4 sm:gap-2">
              <Link
                href="/contact?type=wedding"
                className="inline-flex items-center justify-center gap-1 rounded-full bg-white px-3 py-1.5 text-[8px] font-semibold text-[#172033] transition hover:bg-white/90 sm:px-5 sm:py-2.5 sm:text-xs"
              >
                <Send className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                Wedding Enquiry
                <ArrowRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              </Link>

              <Link
                href="/booking?type=wedding"
                className="inline-flex items-center justify-center gap-1 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-[8px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/15 sm:px-5 sm:py-2.5 sm:text-xs"
              >
                <CalendarCheck2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}