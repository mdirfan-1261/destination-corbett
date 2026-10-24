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

const primaryButton =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#9F5721]";

const secondaryButton =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#172033]/15 bg-white px-4 py-2 text-xs font-semibold text-[#172033] transition hover:border-[#B96928] hover:text-[#B96928]";

const sectionLabel =
  "text-[10px] font-semibold tracking-[0.18em] text-[#B96928]";

const sectionHeading =
  "mt-2 text-2xl font-bold leading-tight text-[#172033] sm:text-3xl md:text-4xl";

const sectionDescription =
  "mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600";

export default function CorporateMeetingsPage() {
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
      href="/events/meetings"
      className="font-semibold text-[#B96928] transition hover:underline"
      aria-current="page"
    >
      Corporate Meetings
    </Link>
  </nav>
</div>

      {/* ================= COMPACT HERO ================= */}
<section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
  <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
    {/* Hero Image */}
    <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
      <Image
        src="/images/events/optimized/corporate-meetings-hero.webp"
        alt="Corporate meetings in Jim Corbett"
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
        <div className="mb-2 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl">
          Corporate Events
        </div>

        <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
          Corporate Meetings{" "}
          <span className="text-[#E0924F]">in Jim Corbett</span>
        </h1>

        <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
          Productive meetings, comfortable stays and thoughtfully planned
          corporate gatherings in the peaceful surroundings of Jim Corbett.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href="/booking?type=corporate-meeting"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
          >
            Book Now
            <ArrowRight size={13} />
          </Link>

          <Link
            href="/contact?type=corporate-meeting"
            className="hidden items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:inline-flex sm:text-sm"
          >
            Enquire Now
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* INTRO + FEATURES */}
      <section id="meetings" className="px-4 py-8 sm:px-5 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className={sectionLabel}>CORPORATE MEETINGS</p>

            <h2 className={sectionHeading}>
              Business Meetings, Naturally Elevated
            </h2>

            <p className={sectionDescription}>
              Bring your team together with thoughtfully planned venues, stays
              and event support.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-2 md:grid-cols-4">
            {meetingFeatures.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B96928]/10 text-[#B96928]">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-[#172033] sm:text-base">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-gray-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLAN YOUR MEETING */}
      <section className="bg-white px-4 py-8 sm:px-5 sm:py-10">
        <div className="mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-2 md:gap-10">
          {/* VIDEO */}
          <div className="overflow-hidden rounded-2xl bg-[#172033] shadow-sm">
            <video
              className="aspect-video w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
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
            <p className={sectionLabel}>PLAN YOUR MEETING</p>

            <h2 className="mt-2 text-2xl font-bold leading-tight text-[#172033] sm:text-3xl">
              A Productive Meeting in a Natural Setting
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Whether you are planning a leadership meeting, team discussion,
              business review or corporate gathering, Jim Corbett offers a
              refreshing environment away from the usual city workspace.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {meetingBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-[#B96928]"
                  />

                  <span className="text-sm leading-5 text-gray-700">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/booking?type=corporate-meeting"
                className={primaryButton}
              >
                <CalendarDays size={15} />
                Book Meeting
              </Link>

              <Link
                href="/contact?type=corporate-meeting"
                className={secondaryButton}
              >
                Enquire Now
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE GALLERY */}
      <section className="px-4 py-8 sm:px-5 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className={sectionLabel}>CORPORATE EXPERIENCE</p>

            <h2 className={sectionHeading}>
              Create the Right Setting for Your Team
            </h2>

            <p className={sectionDescription}>
              Combine meetings, team interactions and comfortable stays for a
              complete corporate experience.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 md:grid-cols-3">
            {meetingGallery.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-44 overflow-hidden sm:h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    quality={75}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 384px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-[#172033]">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-sm leading-5 text-gray-600">
                    {item.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href="/booking?type=corporate-meeting"
                      className={`${primaryButton} px-2 text-[11px] sm:text-xs`}
                    >
                      Book
                      <ArrowRight size={13} />
                    </Link>

                    <Link
                      href="/contact?type=corporate-meeting"
                      className={`${secondaryButton} px-2 text-[11px] sm:text-xs`}
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

      {/* MEETING SUPPORT */}
      <section className="bg-white px-4 py-8 sm:px-5 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className={sectionLabel}>MEETING SUPPORT</p>

            <h2 className={sectionHeading}>Everything Your Team Needs</h2>

            <p className={sectionDescription}>
              From venue coordination to accommodation and refreshments,
              organise your corporate meeting with complete event support.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#18352A] p-5 text-white">
              <MapPin size={21} className="text-[#E3A15D]" />

              <h3 className="mt-3 font-bold">Convenient Locations</h3>

              <p className="mt-2 text-sm leading-5 text-white/75">
                Choose suitable locations around Jim Corbett for your
                corporate gathering.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F5F0] p-5">
              <Building2 size={21} className="text-[#B96928]" />

              <h3 className="mt-3 font-bold text-[#172033]">
                Meeting Arrangements
              </h3>

              <p className="mt-2 text-sm leading-5 text-gray-600">
                Plan meeting spaces and arrangements according to your
                corporate requirements.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7F5F0] p-5">
              <Users size={21} className="text-[#B96928]" />

              <h3 className="mt-3 font-bold text-[#172033]">
                Group Coordination
              </h3>

              <p className="mt-2 text-sm leading-5 text-gray-600">
                Get support for corporate groups, stays, meals and event
                coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#18352A] px-4 py-9 sm:px-5 sm:py-12">
        <div className="mx-auto max-w-3xl text-center text-white">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-[#E3A15D]">
            READY TO PLAN?
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            Plan Your Corporate Meeting in Jim Corbett
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/75">
            Share your dates, group size and requirements with our team to plan
            your corporate meeting experience.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <Link
              href="/booking?type=corporate-meeting"
              className={primaryButton}
            >
              <CalendarDays size={15} />
              Book Meeting
            </Link>

            <Link
              href="/contact?type=corporate-meeting"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-white/50 bg-white px-4 py-2 text-xs font-semibold text-[#172033] transition hover:bg-white/90"
            >
              Enquire Now
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}