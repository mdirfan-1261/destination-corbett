"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Coffee,
  MapPin,
  Users,
  Presentation,
} from "lucide-react";

const conferenceFeatures = [
  {
    icon: Presentation,
    title: "Professional Conference Setup",
    description:
      "Well-planned spaces for presentations, discussions and corporate gatherings.",
  },
  {
    icon: Users,
    title: "Large Group Support",
    description:
      "Flexible arrangements for corporate teams, delegates and larger gatherings.",
  },
  {
    icon: Building2,
    title: "Comfortable Venues",
    description:
      "Conference spaces combined with comfortable accommodation options.",
  },
  {
    icon: MapPin,
    title: "Jim Corbett Location",
    description:
      "A refreshing destination away from the usual city conference environment.",
  },
];

const conferenceBenefits = [
  "Professional conference arrangements",
  "Comfortable accommodation options",
  "Audio-visual and presentation support",
  "Food and refreshment arrangements",
  "Corporate group coordination",
  "Customised conference planning",
];

const conferenceGallery = [
  {
    image: "/images/events/optimized/conferences-1.webp",
    title: "Conference Sessions",
    description:
      "Create a focused environment for presentations, discussions and knowledge sharing.",
  },
  {
    image: "/images/events/optimized/conferences-2.webp",
    title: "Corporate Gatherings",
    description:
      "Bring teams, delegates and business partners together in a comfortable setting.",
  },
  {
    image: "/images/events/optimized/conferences-3.webp",
    title: "Conference Experience",
    description:
      "Combine productive business sessions with a refreshing Jim Corbett experience.",
  },
];

export default function ConferencesPage() {
  return (
    <main className="bg-[#F7F5F0] text-[#172033]">

      {/* HERO */}
      <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">
          <div className="relative h-[300px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[560px]">

            <Image
              src="/images/events/optimized/conferences-hero.webp"
              alt="Corporate conference in Jim Corbett"
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
                  Conferences in Jim Corbett
                </h1>

                <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/80 sm:mt-5 sm:text-base">
                  Bring your delegates together for productive conferences
                  surrounded by the refreshing natural environment of Jim
                  Corbett.
                </p>

                <div className="mt-5 flex flex-row gap-2 sm:mt-7 sm:gap-3">

                  <Link
                    href="/booking?type=conference"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-4 py-2 text-[9px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:px-5 sm:py-2.5 sm:text-xs"
                  >
                    <CalendarDays size={13} />
                    Book Now
                  </Link>

                  <Link
                    href="/contact?type=conference"
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
              CONFERENCES
            </p>

            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
              Business Conferences, Surrounded by Nature
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Plan focused conferences and corporate gatherings in the
              refreshing surroundings of Jim Corbett, with comfortable stays,
              meeting arrangements and complete event support.
            </p>

          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

            {conferenceFeatures.map((feature) => {
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

      {/* PLAN YOUR CONFERENCE */}
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
                poster="/images/events/optimized/conferences-hero.webp"
              >
                <source
                  src="/videos/optimized/conferences-video.mp4"
                  type="video/mp4"
                />

                Your browser does not support the video tag.
              </video>

            </div>

            {/* CONTENT */}
            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C87532] sm:text-xs">
                PLAN YOUR CONFERENCE
              </p>

              <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
                A Conference Experience Beyond the City
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                Give your conference a refreshing setting in Jim Corbett,
                where productive business sessions can be combined with
                comfortable stays, hospitality and a natural environment.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2 sm:gap-3">

                {conferenceBenefits.map((benefit) => (
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
                  href="/booking?type=conference"
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-3 text-[10px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
                >
                  <CalendarDays size={13} />
                  Book
                </Link>

                <Link
                  href="/contact?type=conference"
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
              CONFERENCE EXPERIENCE
            </p>

            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
              Create the Right Setting for Your Delegates
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Combine professional conference arrangements with comfortable
              stays and a refreshing Jim Corbett experience.
            </p>

          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">

            {conferenceGallery.map((item) => (
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
                      href="/booking?type=conference"
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-2 text-[10px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
                    >
                      <CalendarDays size={12} />
                      Book
                    </Link>

                    <Link
                      href="/contact?type=conference"
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

      {/* CONFERENCE SUPPORT */}
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C87532] sm:text-xs">
              CONFERENCE SUPPORT
            </p>

            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
              Everything Your Conference Needs
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              From venue coordination to accommodation, refreshments and
              delegate support, plan your conference with complete event
              assistance.
            </p>

          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">

            <div className="rounded-xl border border-gray-100 bg-[#F7F5F0] p-5 sm:rounded-2xl sm:p-6">
              <Building2 className="text-[#C87532]" size={23} />

              <h3 className="mt-4 text-base font-semibold text-[#172033] sm:text-lg">
                Conference Venues
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Choose suitable spaces for presentations, discussions,
                seminars and corporate gatherings.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F7F5F0] p-5 sm:rounded-2xl sm:p-6">
              <Coffee className="text-[#C87532]" size={23} />

              <h3 className="mt-4 text-base font-semibold text-[#172033] sm:text-lg">
                Hospitality & Refreshments
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Support your delegates with comfortable stays, meals,
                refreshments and hospitality arrangements.
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#F7F5F0] p-5 sm:rounded-2xl sm:p-6">
              <Users className="text-[#C87532]" size={23} />

              <h3 className="mt-4 text-base font-semibold text-[#172033] sm:text-lg">
                Delegate Coordination
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                Coordinate groups, schedules and event requirements with
                support from our event team.
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
            Plan Your Conference in Jim Corbett
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-white/70 sm:text-base">
            Share your dates, delegate count and requirements with us and
            our team will help you plan the right conference experience.
          </p>

          <div className="mt-6 flex flex-row justify-center gap-2 sm:mt-7 sm:gap-3">

            <Link
              href="/booking?type=conference"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-4 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:px-5 sm:text-xs"
            >
              <CalendarDays size={13} />
              Book Now
            </Link>

            <Link
              href="/contact?type=conference"
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

