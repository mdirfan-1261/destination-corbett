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

export default function TeamOutingsPage() {
  return (
    <main className="bg-[#F7F5F0] text-[#172033]">

      {/* HERO */}
      <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">
          <div className="relative h-[300px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[560px]">

            <Image
              src="/images/events/optimized/team-outings-hero.webp"
              alt="Team outing in Jim Corbett"
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#172033]/55 to-transparent" />

            <div className="relative z-10 flex h-full items-center px-5 sm:px-8 md:px-12 lg:px-16">
              <div className="max-w-2xl">

                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F0B36A] sm:text-xs">
                  CORPORATE EVENTS
                </p>

                <h1 className="mt-2 max-w-xl text-3xl font-semibold leading-tight sm:mt-3 sm:text-5xl lg:text-6xl">
                  Team Outings in Jim Corbett
                </h1>

                <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/80 sm:mt-5 sm:text-base">
                  Take your team away from the usual workplace and create
                  memorable experiences through nature, adventure and
                  meaningful team activities in Jim Corbett.
                </p>

                <div className="mt-5 flex flex-row gap-2 sm:mt-7 sm:gap-3">

                  <Link
                    href="/booking?type=team-outing"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-4 py-2 text-[9px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:px-5 sm:py-2.5 sm:text-xs"
                  >
                    <CalendarDays size={13} />
                    Book Now
                  </Link>

                  <Link
                    href="/contact?type=team-outing"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/50 bg-white px-4 py-2 text-[9px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white active:bg-[#172033] active:text-white sm:px-5 sm:py-2.5 sm:text-xs"
                  >
                    Enquire
                    <ArrowRight size={13} />
                  </Link>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C87532] sm:text-xs">
              TEAM OUTINGS
            </p>

            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
              Bring Your Team Together in Nature
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Give your team a refreshing break from the workplace with
              outdoor experiences, comfortable stays and engaging activities
              in the peaceful surroundings of Jim Corbett.
            </p>

          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

            {outingFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C87532]/10 text-[#C87532] sm:h-11 sm:w-11">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold text-[#172033] sm:text-base">
                    {feature.title}
                  </h3>

                  <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* PLAN YOUR OUTING */}
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-7 md:grid-cols-2 md:gap-10 lg:gap-14">

            {/* VIDEO */}
            <div className="overflow-hidden rounded-xl bg-[#172033] shadow-sm sm:rounded-2xl">

              <video
                className="aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
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

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C87532] sm:text-xs">
                PLAN YOUR TEAM OUTING
              </p>

              <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
                A Refreshing Experience for Your Team
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                Step away from the usual office environment and give your
                team time to connect, explore and relax together in the
                natural surroundings of Jim Corbett.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2 sm:gap-3">

                {outingBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-2 text-xs text-gray-600 sm:text-sm"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#C87532]"
                    />

                    <span>{benefit}</span>
                  </div>
                ))}

              </div>

              <div className="mt-6 flex flex-row gap-2">

                <Link
                  href="/booking?type=team-outing"
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-3 text-[10px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
                >
                  <CalendarDays size={13} />
                  Book
                </Link>

                <Link
                  href="/contact?type=team-outing"
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[#172033] bg-white px-3 text-[10px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white active:bg-[#172033] active:text-white sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
                >
                  Enquire
                  <ArrowRight size={13} />
                </Link>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C87532] sm:text-xs">
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

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">

            {outingGallery.map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-xl bg-white shadow-sm sm:rounded-2xl"
              >

                <div className="relative h-[190px] sm:h-[220px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-4 sm:p-5">

                  <h3 className="text-base font-semibold text-[#172033] sm:text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-row gap-2">

                    <Link
                      href="/booking?type=team-outing"
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-2 text-[10px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
                    >
                      <CalendarDays size={12} />
                      Book
                    </Link>

                    <Link
                      href="/contact?type=team-outing"
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[#172033] bg-white px-2 text-[10px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white active:bg-[#172033] active:text-white sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
                    >
                      Enquire
                      <ArrowRight size={12} />
                    </Link>

                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* OUTING SUPPORT */}
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C87532] sm:text-xs">
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

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">

            <div className="rounded-xl border border-gray-100 bg-[#F7F5F0] p-5 sm:rounded-2xl sm:p-6">
              <MapPin className="text-[#C87532]" size={23} />

              <h3 className="mt-4 text-base font-semibold text-[#172033] sm:text-lg">
                Outdoor Experiences
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Plan nature-based experiences and outdoor activities that
                give your team a refreshing break.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F7F5F0] p-5 sm:rounded-2xl sm:p-6">
              <Coffee className="text-[#C87532]" size={23} />

              <h3 className="mt-4 text-base font-semibold text-[#172033] sm:text-lg">
                Stay & Hospitality
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Comfortable accommodation, meals and refreshments for your
                complete team outing.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F7F5F0] p-5 sm:rounded-2xl sm:p-6">
              <Users className="text-[#C87532]" size={23} />

              <h3 className="mt-4 text-base font-semibold text-[#172033] sm:text-lg">
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
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-[#172033] px-5 py-10 text-center text-white sm:rounded-[28px] sm:px-10 sm:py-14">

          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#F0B36A] sm:text-xs">
            READY TO PLAN?
          </p>

          <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
            Plan Your Team Outing in Jim Corbett
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-white/70 sm:text-base">
            Share your dates, team size and requirements with us and our
            team will help you plan a memorable corporate outing.
          </p>

          <div className="mt-6 flex flex-row justify-center gap-2 sm:mt-7 sm:gap-3">

            <Link
              href="/booking?type=team-outing"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:px-5 sm:text-xs"
            >
              <CalendarDays size={13} />
              Book Now
            </Link>

            <Link
              href="/contact?type=team-outing"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/40 bg-white px-4 py-2.5 text-[10px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white active:bg-[#172033] active:text-white sm:px-5 sm:text-xs"
            >
              Enquire
              <ArrowRight size={13} />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}

