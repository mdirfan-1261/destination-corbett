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
} from "lucide-react";

const meetingFeatures = [
  {
    icon: Building2,
    title: "Meeting Spaces",
    description:
      "Well-equipped spaces for focused meetings and business discussions.",
  },
  {
    icon: Users,
    title: "Corporate Groups",
    description:
      "Flexible arrangements for teams, leadership meets and corporate gatherings.",
  },
  {
    icon: Coffee,
    title: "Stay & Refreshments",
    description:
      "Comfortable stays, meals and refreshments for a seamless experience.",
  },
  {
    icon: CalendarDays,
    title: "Flexible Planning",
    description:
      "Plans tailored around your dates, group size and requirements.",
  },
];

const meetingBenefits = [
  "Peaceful environment away from the city",
  "Comfortable accommodation options",
  "Meeting and gathering arrangements",
  "Food and refreshment support",
  "Corporate group coordination",
  "Customised event planning",
];

const meetingGallery = [
  {
    image: "/images/events/optimized/corporate-meetings-1.webp",
    title: "Meeting Venues",
    description:
      "Professional spaces for focused discussions and corporate gatherings.",
  },
  {
    image: "/images/events/optimized/corporate-meetings-2.webp",
    title: "Team Gatherings",
    description:
      "Comfortable settings for teams, discussions and business interactions.",
  },
  {
    image: "/images/events/optimized/corporate-meetings-3.webp",
    title: "Corporate Stay",
    description:
      "Combine your meeting with a comfortable stay surrounded by nature.",
  },
];

export default function CorporateMeetingsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">

      {/* ================= HERO ================= */}
      <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-3 sm:py-3 md:px-5 md:py-4">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-2xl md:rounded-[24px]">

          <div className="relative h-[285px] sm:h-[380px] md:h-[450px] lg:h-[500px]">

            <Image
              src="/images/events/optimized/corporate-meetings-hero.webp"
              alt="Corporate meetings in Jim Corbett"
              fill
              priority
              quality={75}
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#172033]/55 to-transparent" />

            <div className="relative z-10 flex h-full items-center px-5 sm:px-8 md:px-10 lg:px-14">
              <div className="max-w-xl">

                <p className="mb-2 text-[8px] font-semibold tracking-[0.2em] text-[#E3A15D] sm:mb-3 sm:text-[10px]">
                  CORPORATE EVENTS
                </p>

                <h1 className="text-3xl font-bold leading-[1.05] sm:text-4xl md:text-5xl lg:text-[56px]">
                  Corporate Meetings
                  <span className="block text-[#E3A15D]">
                    in Jim Corbett
                  </span>
                </h1>

                <p className="mt-3 max-w-lg text-[10px] leading-4 text-white/80 sm:mt-4 sm:text-sm sm:leading-6">
                  Create productive and memorable corporate meetings in the
                  peaceful surroundings of Jim Corbett, with comfortable stays
                  and flexible event arrangements.
                </p>

                <div className="mt-4 flex flex-row gap-2 sm:mt-6 sm:gap-3">

                  {/* HERO BOOK */}
                  <Link
                    href="/booking?type=corporate-meeting"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-4 py-2 text-[9px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:px-5 sm:py-2.5 sm:text-xs"
                  >
                    Book Now
                    <ArrowRight size={13} />
                  </Link>

                  {/* HERO ENQUIRE */}
                  <Link
                    href="/contact?type=corporate-meeting"
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

      {/* ================= INTRO ================= */}
      <section
        id="meetings"
        className="bg-[#F7F5F0] px-4 py-8 sm:px-5 sm:py-10 md:py-12"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-[8px] font-semibold tracking-[0.2em] text-[#C87532] sm:text-[10px]">
              CORPORATE MEETINGS
            </p>

            <h2 className="mt-2 text-xl font-bold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
              Business Meetings, Naturally Elevated
            </h2>

            <p className="mx-auto mt-2.5 max-w-xl text-[10px] leading-4 text-gray-600 sm:mt-3 sm:text-xs sm:leading-5 md:text-sm">
              Bring your team together in the peaceful surroundings of Jim
              Corbett, with thoughtfully planned venues, stays and event
              support.
            </p>

          </div>

          {/* FEATURE CARDS */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3 md:grid-cols-4">

            {meetingFeatures.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-4 md:p-5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C87532]/10 text-[#C87532] sm:h-9 sm:w-9">
                    <Icon size={16} />
                  </div>

                  <h3 className="mt-2.5 text-xs font-bold text-[#172033] sm:mt-3 sm:text-sm">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[9px] leading-3.5 text-gray-600 sm:text-[10px] sm:leading-4">
                    {item.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ================= PLAN YOUR MEETING ================= */}
      <section className="bg-white px-4 py-8 sm:px-5 sm:py-10 md:py-12">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-10">

            {/* VIDEO */}
            <div className="overflow-hidden rounded-xl bg-[#172033] shadow-sm sm:rounded-2xl">
              <video
  className="aspect-video w-full object-cover"
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  poster="/images/events/optimized/corporate-meetings-hero.webp"
>
  <source
    src="/videos/optimized/corporate-meetings-video.mp4"
    type="video/mp4"
  />
  Your browser does not support the video tag.
</video>
            </div>

            {/* CONTENT */}
            <div>

              <p className="text-[8px] font-semibold tracking-[0.2em] text-[#C87532] sm:text-[10px]">
                PLAN YOUR MEETING
              </p>

              <h2 className="mt-2 text-xl font-bold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
                A Productive Meeting in a Natural Setting
              </h2>

              <p className="mt-2.5 text-[10px] leading-4 text-gray-600 sm:mt-3 sm:text-xs sm:leading-5 md:text-sm">
                Whether you are planning a leadership meeting, team discussion,
                business review or corporate gathering, Jim Corbett offers a
                refreshing environment away from the usual city workspace.
              </p>

              {/* BENEFITS */}
              <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-2.5">

                {meetingBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-1.5"
                  >
                    <CheckCircle2
                      size={13}
                      className="mt-0.5 shrink-0 text-[#C87532]"
                    />

                    <span className="text-[10px] leading-4 text-gray-700 sm:text-xs">
                      {benefit}
                    </span>
                  </div>
                ))}

              </div>

              {/* BUTTONS */}
              <div className="mt-5 flex flex-row gap-2 sm:mt-6 sm:gap-3">

                {/* BOOK */}
                <Link
                  href="/booking?type=corporate-meeting"
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-2 text-[10px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
                >
                  <CalendarDays size={12} />
                  Book
                </Link>

                {/* ENQUIRE */}
                <Link
                  href="/contact?type=corporate-meeting"
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[#172033] bg-white px-2 text-[10px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white active:bg-[#172033] active:text-white sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
                >
                  Enquire
                  <ArrowRight size={12} />
                </Link>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= IMAGE GALLERY ================= */}
      <section className="bg-[#F7F5F0] px-4 py-8 sm:px-5 sm:py-10 md:py-12">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-[8px] font-semibold tracking-[0.2em] text-[#C87532] sm:text-[10px]">
              CORPORATE EXPERIENCE
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#172033] sm:text-3xl md:text-4xl">
              Create the Right Setting for Your Team
            </h2>

            <p className="mx-auto mt-2.5 max-w-xl text-[10px] leading-4 text-gray-600 sm:text-xs sm:leading-5 md:text-sm">
              Bring together meetings, team interactions and comfortable stays
              for a complete corporate experience in Jim Corbett.
            </p>

          </div>

          {/* GALLERY */}
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 md:grid-cols-3">

            {meetingGallery.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl"
              >

                <div className="relative h-[170px] overflow-hidden sm:h-[210px] md:h-[220px]">

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    quality={75}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                </div>

                <div className="p-3.5 sm:p-4">

                  <h3 className="text-sm font-bold text-[#172033] sm:text-base">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-gray-600 sm:text-xs sm:leading-5">
                    {item.description}
                  </p>

                  <div className="mt-3 flex flex-row gap-1.5">

                    {/* BOOK */}
                    <Link
                      href="/booking?type=corporate-meeting"
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-2 text-[9px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:h-10 sm:px-3 sm:text-[10px]"
                    >
                      Book
                      <ArrowRight size={11} />
                    </Link>

                    {/* ENQUIRE */}
                    <Link
                      href="/contact?type=corporate-meeting"
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[#172033] bg-white px-2 text-[9px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white active:bg-[#172033] active:text-white sm:h-10 sm:px-3 sm:text-[10px]"
                    >
                      Enquire
                      <ArrowRight size={11} />
                    </Link>

                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= MEETING SUPPORT ================= */}
      <section className="bg-white px-4 py-8 sm:px-5 sm:py-10 md:py-12">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-[8px] font-semibold tracking-[0.2em] text-[#C87532] sm:text-[10px]">
              MEETING SUPPORT
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#172033] sm:text-3xl md:text-4xl">
              Everything Your Team Needs
            </h2>

            <p className="mx-auto mt-2.5 max-w-xl text-[10px] leading-4 text-gray-600 sm:text-xs sm:leading-5 md:text-sm">
              From venue coordination to accommodation and refreshments,
              organise your corporate meeting with complete event support.
            </p>

          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">

            {/* CARD 1 */}
            <div className="rounded-xl bg-[#18352A] p-4 text-white sm:rounded-2xl sm:p-5">

              <MapPin
                size={19}
                className="text-[#E3A15D]"
              />

              <h3 className="mt-3 text-sm font-bold sm:text-base">
                Convenient Locations
              </h3>

              <p className="mt-1.5 text-[10px] leading-4 text-white/70 sm:text-xs sm:leading-5">
                Choose from suitable locations around Jim Corbett for your
                corporate gathering.
              </p>

            </div>

            {/* CARD 2 */}
            <div className="rounded-xl bg-[#F7F5F0] p-4 sm:rounded-2xl sm:p-5">

              <Building2
                size={19}
                className="text-[#C87532]"
              />

              <h3 className="mt-3 text-sm font-bold text-[#172033] sm:text-base">
                Meeting Arrangements
              </h3>

              <p className="mt-1.5 text-[10px] leading-4 text-gray-600 sm:text-xs sm:leading-5">
                Plan meeting spaces and arrangements according to your
                corporate requirements.
              </p>

            </div>

            {/* CARD 3 */}
            <div className="rounded-xl bg-[#F7F5F0] p-4 sm:rounded-2xl sm:p-5">

              <Users
                size={19}
                className="text-[#C87532]"
              />

              <h3 className="mt-3 text-sm font-bold text-[#172033] sm:text-base">
                Group Coordination
              </h3>

              <p className="mt-1.5 text-[10px] leading-4 text-gray-600 sm:text-xs sm:leading-5">
                Get support for corporate groups, stays, meals and event
                coordination.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-[#18352A] px-4 py-8 sm:px-5 sm:py-10 md:py-12">

        <div className="mx-auto max-w-3xl text-center text-white">

          <p className="text-[8px] font-semibold tracking-[0.2em] text-[#E3A15D] sm:text-[10px]">
            READY TO PLAN?
          </p>

          <h2 className="mt-2 text-xl font-bold sm:text-3xl md:text-4xl">
            Plan Your Corporate Meeting in Jim Corbett
          </h2>

          <p className="mx-auto mt-2.5 max-w-xl text-[10px] leading-4 text-white/70 sm:text-xs sm:leading-5 md:text-sm">
            Share your dates, group size and requirements with us and our team
            will help you plan the right corporate meeting experience.
          </p>

          <div className="mt-4 flex flex-row justify-center gap-2 sm:mt-5 sm:gap-3">

            {/* BOOK */}
            <Link
              href="/booking?type=corporate-meeting"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#C87532] px-4 text-[10px] font-semibold text-white transition hover:bg-[#B96928] active:bg-[#B96928] sm:h-10 sm:px-5 sm:text-xs"
            >
              <CalendarDays size={12} />
              Book
            </Link>

            {/* ENQUIRE */}
            <Link
              href="/contact?type=corporate-meeting"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/40 bg-white px-4 text-[10px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white active:bg-[#172033] active:text-white sm:h-10 sm:px-5 sm:text-xs"
            >
              Enquire
              <ArrowRight size={12} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

