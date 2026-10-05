"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Building2,
  Users,
  Presentation,
  Mountain,
  Handshake,
  Clapperboard,
  ArrowRight,
  Sparkles,
  Hotel,
  UtensilsCrossed,
  Bus,
  Trees,
  CheckCircle2,
  Plus,
} from "lucide-react";

const eventTypes = [
  {
    title: "Corporate Meetings",
    description:
      "Professional meeting spaces and complete hospitality solutions for focused business gatherings.",
    href: "/events/meetings",
    image: "/images/events/optimized/corporate-meetings.webp",
    icon: Users,
  },
  {
    title: "Conferences",
    description:
      "Plan conferences with venue, accommodation, food, technology and on-ground coordination.",
    href: "/events/conferences",
    image: "/images/events/optimized/conferences.webp",
    icon: Presentation,
  },
  {
    title: "Team Outings",
    description:
      "Bring your team together with memorable outings, activities and unique Corbett experiences.",
    href: "/events/team-outings",
    image: "/images/events/optimized/team-outings.webp",
    icon: Mountain,
  },
  {
    title: "Corporate Retreats",
    description:
      "Combine productive sessions with comfortable stays, nature, relaxation and team experiences.",
    href: "/events/retreats",
    image: "/images/events/optimized/corporate-retreats.webp",
    icon: Building2,
  },
  {
    title: "Dealer Meets",
    description:
      "Create professional dealer meets with comfortable stays, curated experiences and seamless arrangements.",
    href: "/events/dealer-meets",
    image: "/images/events/optimized/dealer-meets.webp",
    icon: Handshake,
  },
  {
    title: "Event Production",
    description:
      "Sound, lights, LED, stage, branding and complete production support for your event.",
    href: "/event-production",
    image: "/images/events/optimized/event-production1.webp",
    icon: Clapperboard,
  },
];

const solutions = [
  {
    title: "Venues",
    description:
      "Suitable spaces for meetings, conferences, celebrations and corporate gatherings.",
    icon: Building2,
  },
  {
    title: "Stays",
    description:
      "Comfortable accommodation options for teams, guests and event participants.",
    icon: Hotel,
  },
  {
    title: "Food & Hospitality",
    description:
      "Meals, refreshments and hospitality support planned around your event schedule.",
    icon: UtensilsCrossed,
  },
  {
    title: "Corbett Experiences",
    description:
      "Nature, outdoor activities and experiences that make corporate events memorable.",
    icon: Trees,
  },
  {
    title: "Transportation",
    description:
      "Guest transfers and local transportation coordination for a smoother experience.",
    icon: Bus,
  },
  {
    title: "Event Production",
    description:
      "Stage, sound, lighting, LED, branding and technical production support.",
    icon: Clapperboard,
  },
];

const process = [
  {
    number: "01",
    title: "Tell Us Your Requirement",
    description:
      "Share your dates, group size, event type, stay requirements and expectations.",
  },
  {
    number: "02",
    title: "Build Your Event Plan",
    description:
      "Our team helps structure the venue, stay, food, activities and event requirements.",
  },
  {
    number: "03",
    title: "Coordinate Everything",
    description:
      "From hospitality to logistics and production, the different elements are coordinated together.",
  },
  {
    number: "04",
    title: "Experience Corbett",
    description:
      "Arrive, connect, experience and enjoy a memorable event in the Corbett landscape.",
  },
];

export default function EventsPage() {
  const [openEvent, setOpenEvent] = useState(null);
  const [openSolution, setOpenSolution] = useState(null);
  const [openWhy, setOpenWhy] = useState(null);
  const [openProcess, setOpenProcess] = useState(null);

  return (
    <main className="bg-[#F7F5F0] text-[#172033]">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">

        <div className="relative mx-auto min-h-[300px] max-w-[1440px] overflow-hidden rounded-xl bg-[#172033] text-white sm:min-h-[420px] sm:rounded-[24px] md:min-h-[470px] md:rounded-[28px] lg:min-h-[560px]">

          <Image
            src="/images/events/optimized/events-hero.webp"
            alt="Corporate events in Jim Corbett"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1440px"
            className="object-cover"
          />

          {/* OVERLAYS */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/50 to-transparent" />

          {/* CONTENT */}

          <div className="relative z-10 flex min-h-[300px] items-center px-5 py-6 sm:min-h-[420px] sm:px-8 sm:py-8 md:min-h-[470px] md:px-12 lg:min-h-[560px] lg:px-16">

            <div className="max-w-2xl">

              {/* EYEBROW */}

              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#C87532] backdrop-blur-xl sm:mb-3 sm:px-3 sm:py-1.5 sm:text-[9px]">

                <Sparkles size={10} />

                Destination Corbett Events

              </div>

              {/* HEADING */}

              <h1 className="max-w-2xl text-[28px] font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">

                Corporate Events,
                <br />

                <span className="text-[#C87532]">
                  Inspired by Corbett.
                </span>

              </h1>

              {/* DESCRIPTION */}

              <p className="mt-2 max-w-xl text-[11px] leading-5 text-white/80 sm:mt-4 sm:text-base sm:leading-7 md:text-lg">

                Plan meetings, conferences, team outings, retreats and
                corporate experiences in the unique setting of Jim Corbett.
                From venue and stay to activities, hospitality and production,
                bring your event together in one destination.

              </p>

              {/* BUTTONS */}

              <div className="mt-4 flex flex-row items-center gap-2 sm:mt-6 sm:gap-2">

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-[11px] font-semibold text-white shadow-md transition hover:bg-[#B96928] sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Plan Your Event
                  <ArrowRight size={12} />
                </Link>

                <a
                  href="#event-solutions"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Explore Solutions
                </a>

              </div>

              {/* MOBILE HIGHLIGHTS */}

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-white/75 sm:hidden">

                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />
                  Meetings
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />
                  Conferences
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />
                  Retreats
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          INTRO
      ========================================================= */}

      


      {/* =========================================================
          EVENT SOLUTIONS
      ========================================================= */}

      <section
        id="event-solutions"
        className="px-4 pb-10 sm:px-5 sm:pb-12 md:px-8 md:pb-14"
      >

        <div className="mx-auto max-w-7xl">

          {/* HEADING */}

          <div className="max-w-2xl">

            <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#C87532] sm:text-xs sm:tracking-[3px]">
              What We Plan
            </p>

            <h2 className="mt-1.5 text-[25px] font-bold leading-[1.15] sm:text-3xl">
              Event solutions for every occasion
            </h2>

            <p className="mt-2 text-[13px] leading-5.5 text-black/60 sm:text-sm sm:leading-6">

              Choose the type of event you are planning and explore the
              services designed around it.

            </p>

          </div>


          {/* EVENT CARDS */}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-7 sm:grid-cols-3 sm:gap-4">

            {eventTypes.map((event) => {

              const Icon = event.icon;

              return (
                <Link
                  key={event.title}
                  href={event.href}
                  className="group overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">

                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                      className="object-cover object-center transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/80 via-[#172033]/10 to-transparent" />

                    {/* ICON */}

                    <div className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-black/20 text-white backdrop-blur-md sm:left-3 sm:top-3 sm:h-8 sm:w-8">

                      <Icon
                        size={13}
                        className="sm:h-[15px] sm:w-[15px]"
                      />

                    </div>

                    {/* TITLE */}

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3">

                      <h3 className="text-[11px] font-semibold leading-tight text-white sm:text-sm">
                        {event.title}
                      </h3>

                    </div>

                  </div>


                  {/* BOTTOM */}

                  <div className="flex items-center justify-between gap-2 px-2.5 py-2.5 sm:px-3.5 sm:py-3">

                    <span className="text-[9px] font-medium text-black/50 sm:text-[10px]">
                      Corporate Events
                    </span>

                    <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-semibold text-[#C87532] sm:text-[10px]">

                      Explore

                      <ArrowRight
                        size={10}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />

                    </span>

                  </div>

                </Link>
              );

            })}

          </div>

        </div>

      </section>


      {/* =========================================================
          WHY CORBETT
      ========================================================= */}

      <section className="px-4 py-10 sm:px-5 sm:py-12 md:px-8 md:py-14">

        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-2xl bg-[#172033] px-5 py-7 text-white sm:rounded-[24px] sm:px-7 sm:py-9 md:px-8 md:py-10">

            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C87532]/10 blur-3xl" />

            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#C87532]/10 blur-3xl" />

            <div className="relative z-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-8">

              {/* LEFT */}

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#C87532] sm:text-xs sm:tracking-[3px]">
                  Why Jim Corbett
                </p>

                <h2 className="mt-1.5 text-[25px] font-bold leading-[1.15] sm:text-3xl">
                  Take your corporate
                  <br />
                  gathering somewhere different.
                </h2>

                <p className="mt-2 max-w-lg text-[13px] leading-5.5 text-white/65 sm:text-sm sm:leading-6">

                  Step away from conventional conference environments and
                  create an event that combines business, hospitality, nature
                  and memorable experiences.

                </p>

                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#B96928] sm:mt-5 sm:px-5 sm:py-2.5 sm:text-xs"
                >
                  Start Planning
                  <ArrowRight size={11} />
                </Link>

              </div>


              {/* RIGHT */}

              <div className="grid grid-cols-2 gap-2 sm:gap-3">

                {[
                  {
                    title: "Nature + Business",
                    description:
                      "A distinctive environment for focused meetings and memorable team experiences.",
                  },
                  {
                    title: "Comfortable Stays",
                    description:
                      "Accommodation options can be planned around your group and event requirements.",
                  },
                  {
                    title: "Team Experiences",
                    description:
                      "Add activities and outdoor experiences to make your corporate gathering more engaging.",
                  },
                  {
                    title: "End-to-End Support",
                    description:
                      "Coordinate venue, hospitality, activities, logistics and production through one planning flow.",
                  },
                ].map((item, index) => {

                  const open = openWhy === index;

                  return (
                    <button
                      type="button"
                      key={item.title}
                      onClick={() =>
                        setOpenWhy(open ? null : index)
                      }
                      aria-expanded={open}
                      className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-left backdrop-blur-xl transition hover:bg-white/[0.1] sm:rounded-xl sm:p-4"
                    >

                      <div className="flex items-center justify-between">

                        <CheckCircle2
                          size={13}
                          className="text-[#C87532] sm:h-4 sm:w-4"
                        />

                        <Plus
                          size={11}
                          className={`text-white/50 transition-transform ${
                            open ? "rotate-45" : ""
                          }`}
                        />

                      </div>

                      <h3 className="mt-1 text-[10px] font-semibold leading-tight sm:mt-2 sm:text-xs">
                        {item.title}
                      </h3>

                      {open && (
                        <p className="mt-1 text-[9px] leading-4 text-white/55 sm:mt-1.5 sm:text-[10px]">

                          {item.description}

                        </p>
                      )}

                    </button>
                  );

                })}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          COMPLETE EVENT SUPPORT
      ========================================================= */}

      <section className="px-4 py-10 sm:px-5 sm:py-12 md:px-8 md:py-14">

        <div className="mx-auto max-w-7xl">

          {/* HEADING */}

          <div className="max-w-2xl">

            <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#C87532] sm:text-xs sm:tracking-[3px]">
              Complete Event Support
            </p>

            <h2 className="mt-1.5 text-[25px] font-bold leading-[1.15] sm:text-3xl">
              Everything your event needs
            </h2>

            <p className="mt-2 text-[13px] leading-5.5 text-black/60 sm:text-sm sm:leading-6">

              Build your event around the services you actually need and
              coordinate the experience from one place.

            </p>

          </div>


          {/* SERVICES */}

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:mt-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-7">

            {solutions.map((solution) => {

              const Icon = solution.icon;

              return (
                <div
                  key={solution.title}
                  className="group flex items-start gap-2.5 sm:gap-3"
                >

                  {/* ICON */}

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C87532]/10 text-[#C87532] sm:h-9 sm:w-9">

                    <Icon
                      size={13}
                      className="sm:h-4 sm:w-4"
                    />

                  </div>


                  {/* CONTENT */}

                  <div className="min-w-0">

                    <h3 className="text-[10px] font-semibold leading-tight sm:text-xs">
                      {solution.title}
                    </h3>

                    <p className="mt-1 text-[9px] leading-4 text-black/55 sm:text-[10px] sm:leading-4">

                      {solution.description}

                    </p>

                  </div>

                </div>
              );

            })}

          </div>

        </div>

      </section>


      {/* =========================================================
          CORBETT EXPERIENCE
      ========================================================= */}

      <section className="px-4 py-10 sm:px-5 sm:py-12 md:px-8 md:py-14">

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
                  poster="/images/events/optimized/events-hero.webp"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                >

                  <source
                    src="/videos/optimized/corbett-experience.mp4"
                    type="video/mp4"
                  />

                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/45 via-transparent to-transparent" />

                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">

                  <span className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-xl sm:px-3 sm:py-1.5 sm:text-[9px]">
                    Experience Corbett
                  </span>

                </div>

              </div>


              {/* CONTENT */}

              <div className="flex items-center p-5 sm:p-7 md:p-8">

                <div className="max-w-xl">

                  <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#C87532] sm:text-xs sm:tracking-[3px]">
                    The Corbett Experience
                  </p>

                  <h2 className="mt-1.5 text-[25px] font-bold leading-[1.15] sm:mt-2 sm:text-3xl">
                    Turn a business trip into a memorable experience.
                  </h2>

                  <p className="mt-2.5 text-[13px] leading-5.5 text-black/60 sm:mt-3 sm:text-sm sm:leading-6">

                    Add nature, outdoor activities, local experiences and
                    time away from the conference room to create a more
                    engaging corporate gathering.

                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 sm:mt-5 sm:gap-x-4 sm:gap-y-2.5">

                    {[
                      "Outdoor team experiences",
                      "Nature and leisure activities",
                      "Curated group experiences",
                      "Flexible event planning",
                    ].map((item) => (

                      <div
                        key={item}
                        className="flex items-start gap-1.5 text-[9px] font-medium leading-4 sm:gap-2 sm:text-[10px]"
                      >

                        <CheckCircle2
                          size={11}
                          className="mt-0.5 shrink-0 text-[#C87532] sm:h-3.5 sm:w-3.5"
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

      </section>


      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section className="px-4 py-10 sm:px-5 sm:py-12 md:px-8 md:py-14">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-10">

            {/* LEFT */}

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#C87532] sm:text-xs sm:tracking-[3px]">
                Simple Planning
              </p>

              <h2 className="mt-1.5 text-[25px] font-bold leading-[1.15] sm:text-3xl">
                From idea to event.
              </h2>

              <p className="mt-2 max-w-md text-[13px] leading-5.5 text-black/60 sm:text-sm sm:leading-6">

                Tell us what you are planning. We help bring the different
                pieces together so you can focus on your guests and your event.

              </p>

            </div>


            {/* RIGHT */}

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-0">

              {process.map((step, index) => (

                <div
                  key={step.number}
                  className="relative"
                >

                  {/* CONNECTING LINE */}

                  {index < process.length - 1 && (
                    <div className="absolute left-[30px] top-[15px] hidden h-px w-[calc(100%-18px)] bg-black/10 sm:block" />
                  )}

                  <div className="relative z-10">

                    <span className="text-lg font-semibold leading-none text-[#C87532]/45 sm:text-xl">
                      {step.number}
                    </span>

                    <h3 className="mt-1.5 text-[10px] font-semibold leading-tight sm:text-xs">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-[9px] leading-4 text-black/55 sm:text-[10px]">

                      {step.description}

                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="px-4 pb-5 sm:px-5 sm:pb-8 md:px-8 md:pb-10">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] px-5 py-8 text-center text-white sm:rounded-2xl sm:px-7 sm:py-10">

          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-[#C87532]/15 blur-3xl" />

          <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-[#C87532]/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">

            <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#C87532] sm:text-xs sm:tracking-[3px]">
              Plan Your Event in Jim Corbett
            </p>

            <h2 className="mt-1.5 text-[24px] font-bold leading-[1.15] sm:text-3xl">
              Meetings â€¢ Retreats â€¢ Conferences â€¢ Celebrations
            </h2>

            <p className="mx-auto mt-2.5 max-w-xl text-[13px] leading-5.5 text-white/60 sm:mt-3 sm:text-sm sm:leading-6">

              Tell us about your event, group size and requirements. Let our
              team help you shape the venue, stay, activities and complete
              event experience.

            </p>

            <div className="mt-4 flex flex-row justify-center gap-2 sm:mt-5 sm:gap-2">

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#B96928] sm:px-5 sm:py-2.5 sm:text-xs"
              >
                Plan Your Event
                <ArrowRight size={11} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-xl sm:px-5 sm:py-2.5 sm:text-xs"
              >
                Contact Our Team
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

