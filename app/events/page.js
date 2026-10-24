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
  Send,
} from "lucide-react";

const eventTypes = [
  {
    title: "Corporate Meetings",
    description:
      "Professional meeting spaces and hospitality for focused business gatherings.",
    href: "/events/meetings",
    image: "/images/events/optimized/corporate-meetings.webp",
    icon: Users,
  },
  {
    title: "Conferences",
    description:
      "Venue, accommodation, food and coordination for your conference.",
    href: "/events/conferences",
    image: "/images/events/optimized/conferences.webp",
    icon: Presentation,
  },
  {
    title: "Team Outings",
    description:
      "Bring your team together with memorable outings and Corbett experiences.",
    href: "/events/team-outings",
    image: "/images/events/optimized/team-outings.webp",
    icon: Mountain,
  },
  {
    title: "Corporate Retreats",
    description:
      "Combine productive sessions with comfortable stays and nature.",
    href: "/events/retreats",
    image: "/images/events/optimized/corporate-retreats.webp",
    icon: Building2,
  },
  {
    title: "Dealer Meets",
    description:
      "Plan dealer meets with stays, hospitality and coordinated arrangements.",
    href: "/events/dealer-meets",
    image: "/images/events/optimized/dealer-meets.webp",
    icon: Handshake,
  },
  {
    title: "Event Production",
    description:
      "Stage, sound, lighting, LED, branding and production support.",
    href: "/event-production",
    image: "/images/events/optimized/event-production1.webp",
    icon: Clapperboard,
  },
];

const solutions = [
  {
    title: "Venues",
    description:
      "Spaces for meetings, conferences and corporate gatherings.",
    icon: Building2,
  },
  {
    title: "Stays",
    description:
      "Accommodation options for teams, guests and event participants.",
    icon: Hotel,
  },
  {
    title: "Food & Hospitality",
    description:
      "Meals, refreshments and hospitality planned around your schedule.",
    icon: UtensilsCrossed,
  },
  {
    title: "Corbett Experiences",
    description:
      "Nature, outdoor activities and experiences for your group.",
    icon: Trees,
  },
  {
    title: "Transportation",
    description:
      "Guest transfers and local transportation coordination.",
    icon: Bus,
  },
  {
    title: "Event Production",
    description:
      "Stage, sound, lighting, LED and technical production support.",
    icon: Clapperboard,
  },
];

const whyCorbett = [
  {
    title: "Nature + Business",
    description:
      "A distinctive environment for focused meetings and team experiences.",
  },
  {
    title: "Comfortable Stays",
    description:
      "Accommodation options planned around your group and requirements.",
  },
  {
    title: "Team Experiences",
    description:
      "Add outdoor activities to make your corporate gathering engaging.",
  },
  {
    title: "End-to-End Support",
    description:
      "Coordinate venue, hospitality, logistics and production in one plan.",
  },
];

const process = [
  {
    number: "01",
    title: "Share Requirements",
    description:
      "Tell us your dates, group size, event type and stay requirements.",
  },
  {
    number: "02",
    title: "Build Your Plan",
    description:
      "Plan the venue, accommodation, food and activities.",
  },
  {
    number: "03",
    title: "Coordinate",
    description:
      "Bring hospitality, logistics and production together.",
  },
  {
    number: "04",
    title: "Experience Corbett",
    description:
      "Arrive, connect and enjoy your corporate gathering.",
  },
];

const HERO_IMAGE = "/images/events/optimized/events-hero.webp";

function EventCard({ event }) {
  const Icon = event.icon;

  return (
    <Link
      href={event.href}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#172033]/[0.08] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E9E4DA] sm:aspect-[16/9]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/85 via-[#172033]/10 to-transparent" />

        <div className="absolute left-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-black/20 text-white backdrop-blur-md sm:left-3 sm:top-3 sm:h-9 sm:w-9">
          <Icon size={15} />
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xs font-bold leading-tight text-white sm:text-base">
            {event.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="line-clamp-2 min-h-10 text-[11px] leading-5 text-gray-600 sm:text-xs sm:leading-5">
          {event.description}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
            Event Solutions
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B96928] sm:text-xs">
            Explore
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function EventsPage() {
  const [openWhy, setOpenWhy] = useState(null);

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
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
            className="font-medium text-[#172033]"
          >
            Events
          </span>
        </div>
      </nav>

      {/* ================= COMPACT HERO ================= */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
        <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
          {/* Hero Image */}
          <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
            <Image
              src={HERO_IMAGE}
              alt="Corporate meetings, conferences and events in Jim Corbett"
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
                Destination Corbett Events
              </div>

              <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                Corporate Events,{" "}
                <span className="text-[#E0924F]">Inspired by Corbett.</span>
              </h1>

              <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
                Meetings, conferences, team outings and retreats — plan your
                event with venue, stays, hospitality and experiences.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link
                  href="/contact?type=event"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
                >
                  Plan Your Event
                  <Send size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT SOLUTIONS */}
      <section
        id="event-solutions"
        className="scroll-mt-5 px-3 py-5 sm:px-6 sm:py-7 lg:py-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 max-w-2xl sm:mb-5">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#B96928]">
              WHAT WE PLAN
            </p>

            <h2 className="mt-1.5 text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              Event solutions for every occasion
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
              Choose your event type and explore the services designed around
              your requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {eventTypes.map((event) => (
              <EventCard key={event.title} event={event} />
            ))}
          </div>
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
                WHY JIM CORBETT
              </p>

              <h2 className="mt-1.5 text-xl font-black leading-tight sm:text-2xl lg:text-3xl">
                Take your corporate gathering somewhere different.
              </h2>

              <p className="mt-2 max-w-lg text-xs leading-5 text-white/70 sm:text-sm sm:leading-6">
                Bring business, hospitality and outdoor experiences together
                in the distinctive surroundings of Jim Corbett.
              </p>

              <Link
                href="/contact?type=event"
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#B96928] px-4 text-xs font-bold text-white transition hover:bg-[#9D5721] sm:text-sm"
              >
                Start Planning
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

      {/* COMPLETE EVENT SUPPORT */}
      <section className="px-3 py-5 sm:px-6 sm:py-7 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#B96928]">
              COMPLETE EVENT SUPPORT
            </p>

            <h2 className="mt-1.5 text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              Everything your event needs
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
              Build your event around the services you need and coordinate the
              experience in one place.
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

      {/* CORBETT EXPERIENCE */}
      <section className="px-3 py-5 sm:px-6 sm:py-7 lg:py-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#EDE9E1]">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#172033] lg:aspect-auto lg:min-h-[320px]">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={HERO_IMAGE}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source
                  src="/videos/optimized/corbett-experience.mp4"
                  type="video/mp4"
                />
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/50 via-transparent to-transparent" />

              <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md sm:bottom-4 sm:left-4">
                Experience Corbett
              </span>
            </div>

            <div className="flex items-center p-5 sm:p-7 lg:p-8">
              <div className="max-w-xl">
                <p className="text-[10px] font-bold tracking-[0.16em] text-[#B96928]">
                  THE CORBETT EXPERIENCE
                </p>

                <h2 className="mt-1.5 text-xl font-black leading-tight sm:text-2xl lg:text-3xl">
                  Turn a business trip into a memorable experience.
                </h2>

                <p className="mt-2.5 text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
                  Add nature, outdoor activities and time away from the
                  conference room to create a more engaging corporate gathering.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3">
                  {[
                    "Outdoor team experiences",
                    "Nature and leisure activities",
                    "Curated group experiences",
                    "Flexible event planning",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-[10px] font-medium leading-4 text-[#172033] sm:text-xs sm:leading-5"
                    >
                      <CheckCircle2
                        size={14}
                        className="mt-0.5 shrink-0 text-[#B96928]"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact?type=event"
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#172033] px-4 text-xs font-bold text-white transition hover:bg-[#B96928] sm:text-sm"
                >
                  Explore Event Options
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
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
              From idea to event.
            </h2>

            <p className="mt-2 max-w-md text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
              Tell us what you are planning. We help bring the venue, stay,
              hospitality and experiences together.
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

      {/* FINAL CTA */}
      <section className="px-3 pb-7 pt-5 sm:px-6 sm:pb-9 sm:pt-7">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[#172033] px-5 py-7 text-center text-white sm:px-8 sm:py-9">
          <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-[#B96928]/15 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-[#B96928]/15 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[#F0BD83]">
              PLAN YOUR EVENT IN JIM CORBETT
            </p>

            <h2 className="mt-2 text-xl font-black leading-tight sm:text-3xl">
              Meetings · Retreats · Conferences · Celebrations
            </h2>

            <p className="mx-auto mt-2.5 max-w-xl text-xs leading-5 text-white/70 sm:text-sm sm:leading-6">
              Share your event dates, group size and requirements. Let our
              team help you plan the venue, stay, activities and event
              experience.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/contact?type=event"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 text-xs font-bold text-white transition hover:bg-[#9D5721] sm:px-5 sm:text-sm"
              >
                Plan Your Event
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 text-xs font-bold text-white transition hover:bg-white hover:text-[#172033] sm:px-5 sm:text-sm"
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