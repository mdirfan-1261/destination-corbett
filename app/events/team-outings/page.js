
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Coffee,
  MapPin,
  Trees,
  Users,
} from "lucide-react";

const outingFeatures = [
  {
    icon: Trees,
    title: "Nature Experiences",
    description:
      "Give your team a refreshing outdoor experience surrounded by the natural beauty of Jim Corbett.",
  },
  {
    icon: Users,
    title: "Team Bonding",
    description:
      "Create opportunities for teams to connect, interact and build stronger working relationships.",
  },
  {
    icon: MapPin,
    title: "Outdoor Activities",
    description:
      "Plan engaging outdoor experiences and activities suitable for corporate teams and groups.",
  },
  {
    icon: Coffee,
    title: "Food & Hospitality",
    description:
      "Combine team activities with comfortable stays, meals, refreshments and hospitality support.",
  },
];

const outingBenefits = [
  "Refreshing natural surroundings",
  "Comfortable accommodation options",
  "Outdoor team activities",
  "Food and refreshment support",
  "Corporate group coordination",
  "Customised outing planning",
];

const outingGallery = [
  {
    image: "/images/events/optimized/team-outings-1.webp",
    title: "Team Adventures",
    description:
      "Take your team outside the usual workplace and create memorable shared experiences.",
  },
  {
    image: "/images/events/optimized/team-outings-2.webp",
    title: "Outdoor Team Activities",
    description:
      "Plan engaging outdoor activities that encourage interaction, collaboration and team bonding.",
  },
  {
    image: "/images/events/optimized/team-outings-3.webp",
    title: "Relax & Reconnect",
    description:
      "Combine adventure, nature and comfortable hospitality for a refreshing team getaway.",
  },
];

const primaryButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#B96928] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#98501F] sm:px-5 sm:text-sm";

const secondaryButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#172033]/15 bg-white px-4 py-2.5 text-xs font-semibold text-[#172033] transition hover:border-[#B96928] hover:bg-[#B96928] hover:text-white sm:px-5 sm:text-sm";

export default function TeamOutingsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
      {/* BREADCRUMB */}
      <div className="mx-auto max-w-6xl px-4 pb-1 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs sm:text-sm"
        >
          <Link
            href="/"
            className="text-gray-500 transition hover:text-[#B96928]"
          >
            Home
          </Link>

          <span className="text-gray-400">/</span>

          <Link
            href="/events"
            className="text-gray-500 transition hover:text-[#B96928]"
          >
            Events
          </Link>

          <span className="text-gray-400">/</span>

          <Link
            href="/events/team-outings"
            aria-current="page"
            className="font-semibold text-[#B96928] hover:underline"
          >
            Team Outings
          </Link>
        </nav>
      </div>

      {/* ================= COMPACT HERO ================= */}
<section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
  <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
    {/* Hero Image */}
    <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
      <Image
        src="/images/events/optimized/team-outings-hero.webp"
        alt="Team outing in Jim Corbett"
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
        <div className="mb-2 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl">
          Corporate Events
        </div>

        <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Team Outings{" "}
          <span className="text-[#E0924F]">in Jim Corbett</span>
        </h1>

        <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
          Take your team away from the usual workplace and create memorable
          experiences through nature, adventure and meaningful team
          activities in Jim Corbett.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href="/booking?type=team-outing"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
          >
            <CalendarDays size={13} />
            Book Now
          </Link>

          <Link
            href="/contact?type=team-outing"
            className="hidden items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:inline-flex sm:text-sm"
          >
            Enquire
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* INTRO & FEATURES */}
      <section className="px-4 py-8 sm:px-5 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B96928] sm:text-xs">
              TEAM OUTINGS
            </p>

            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
              Bring Your Team Together in Nature
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Give your team a refreshing break from the workplace with
              outdoor experiences, comfortable stays and engaging activities
              in the peaceful surroundings of Jim Corbett.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
            {outingFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B96928]/10 text-[#B96928] sm:h-11 sm:w-11">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold leading-snug text-[#172033] sm:text-base">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLAN YOUR OUTING */}
      <section className="bg-white px-4 py-8 sm:px-5 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
            {/* VIDEO */}
            <div className="overflow-hidden rounded-xl bg-[#172033] shadow-sm sm:rounded-2xl">
              <video
                className="aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/events/optimized/team-outings-hero.webp"
              >
                <source
                  src="/videos/optimized/team-outings-video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* CONTENT */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B96928] sm:text-xs">
                PLAN YOUR TEAM OUTING
              </p>

              <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl">
                A Refreshing Experience for Your Team
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                Step away from the usual office environment and give your
                team time to connect, explore and relax together in the
                natural surroundings of Jim Corbett.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {outingBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-2 text-xs leading-relaxed text-gray-600 sm:text-sm"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#B96928]"
                    />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                <Link
                  href="/booking?type=team-outing"
                  className={primaryButton}
                >
                  <CalendarDays size={14} />
                  Book Now
                </Link>

                <Link
                  href="/contact?type=team-outing"
                  className={secondaryButton}
                >
                  Enquire
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-4 py-8 sm:px-5 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B96928] sm:text-xs">
              TEAM EXPERIENCE
            </p>

            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
              More Than Just a Team Trip
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Create shared experiences that help your team relax, connect
              and return with memorable moments from Jim Corbett.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-3">
            {outingGallery.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl"
              >
                <div className="relative h-[190px] sm:h-[210px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-base font-semibold text-[#172033] sm:text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                    {item.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href="/booking?type=team-outing"
                      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-2 py-2 text-xs font-semibold text-white transition hover:bg-[#98501F]"
                    >
                      <CalendarDays size={13} />
                      Book
                    </Link>

                    <Link
                      href="/contact?type=team-outing"
                      className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-[#172033]/15 px-2 py-2 text-xs font-semibold text-[#172033] transition hover:border-[#B96928] hover:bg-[#B96928] hover:text-white"
                    >
                      Enquire
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUTING SUPPORT */}
      <section className="bg-white px-4 py-8 sm:px-5 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B96928] sm:text-xs">
              OUTING SUPPORT
            </p>

            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
              Everything Your Team Needs
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              From accommodation and activities to meals and group
              coordination, organise your team outing with complete support.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-3 md:gap-4">
            <div className="rounded-xl border border-gray-100 bg-[#F7F5F0] p-4 sm:rounded-2xl sm:p-5">
              <MapPin className="text-[#B96928]" size={23} />

              <h3 className="mt-3 text-base font-semibold text-[#172033] sm:text-lg">
                Outdoor Experiences
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Plan nature-based experiences and outdoor activities that
                give your team a refreshing break.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F7F5F0] p-4 sm:rounded-2xl sm:p-5">
              <Coffee className="text-[#B96928]" size={23} />

              <h3 className="mt-3 text-base font-semibold text-[#172033] sm:text-lg">
                Stay & Hospitality
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Comfortable accommodation, meals and refreshments for your
                complete team outing.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F7F5F0] p-4 sm:rounded-2xl sm:p-5">
              <Users className="text-[#B96928]" size={23} />

              <h3 className="mt-3 text-base font-semibold text-[#172033] sm:text-lg">
                Group Coordination
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Coordinate team size, activities, schedules and event
                requirements with dedicated support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-8 sm:px-5 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#172033] px-5 py-8 text-center text-white sm:rounded-3xl sm:px-10 sm:py-11">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F0B36A] sm:text-xs">
            READY TO PLAN?
          </p>

          <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
            Plan Your Team Outing in Jim Corbett
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Share your dates, team size and requirements with us. Our team
            will help you plan a memorable corporate outing.
          </p>

          <div className="mt-5 grid grid-cols-2 justify-center gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
            <Link
              href="/booking?type=team-outing"
              className={primaryButton}
            >
              <CalendarDays size={14} />
              Book Now
            </Link>

            <Link
              href="/contact?type=team-outing"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/40 bg-white px-4 py-2.5 text-xs font-semibold text-[#172033] transition hover:bg-[#F7F5F0] sm:px-5 sm:text-sm"
            >
              Enquire
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
