import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

/* =========================================================
   ABOUT PAGE DATA
========================================================= */

const aboutData = {
  hero: {
    eyebrow: "ABOUT DESTINATION CORBETT",
    title: "Your gateway to",
    highlight: "Corbett experiences.",
    description:
      "A travel facilitation platform that makes planning your Corbett journey easier, from the right stay to safaris, packages, celebrations and events.",
    image: "/images/about/corbett-about.jpg",
    location: "Jim Corbett, Uttarakhand",
    tagline: "Explore. Experience. Connect.",
  },

  stats: [
    { value: "01", label: "Travel platform" },
    { value: "05+", label: "Experience categories" },
    { value: "24/7", label: "Enquiry assistance" },
    { value: "100%", label: "Personalized planning" },
  ],

  intro: {
    eyebrow: "Who we are",
    title: "More than a stay.",
    highlight: "It is the experience.",
    paragraphs: [
      "Destination Corbett brings the essential parts of a Corbett trip together. Whether it is a family holiday, a wildlife experience, a weekend escape or a larger celebration, we help you explore the options and connect with the right services.",
      "Our focus is simple: make planning more convenient, transparent and personalized, from accommodation and safaris to weddings, events and curated packages.",
    ],
  },

  values: [
    {
      icon: Compass,
      title: "Local Expertise",
      text: "Practical local knowledge and carefully planned Corbett experiences.",
    },
    {
      icon: ShieldCheck,
      title: "Reliable Planning",
      text: "Stays, safaris and events coordinated so your journey stays simple.",
    },
    {
      icon: Heart,
      title: "Personal Touch",
      text: "Every trip shaped around your group, occasion, budget and style.",
    },
    {
      icon: Users,
      title: "One Travel Partner",
      text: "Stay, safari, events, weddings and packages in one place.",
    },
  ],

  services: [
    "Corbett stays & resorts",
    "Jeep & safari experiences",
    "Weekend & holiday packages",
    "Corporate events & MICE",
    "Destination weddings",
    "Travel assistance & enquiries",
  ],

  servicesSection: {
    eyebrow: "What we offer",
    title: "Everything you need for a Corbett trip.",
    description:
      "Pick individual services or let us put together a complete experience for you.",
  },

  cta: {
    eyebrow: "Start planning",
    title: "Ready to plan your Corbett experience?",
    description:
      "Tell us what you are looking for and we will help you explore suitable stays, safaris, packages or event options.",
  },

  disclaimer:
    "Destination Corbett is an independent travel facilitation platform. It is not an official website of the Forest Department, Government of India, or any government authority. Safari availability, permits, timings and other forest-related services are subject to applicable rules and official authorities.",
};

/* =========================================================
   COMMON STYLES
========================================================= */

const eyebrow =
  "text-[9px] font-semibold uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.18em]";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C87532]";

/* =========================================================
   ABOUT PAGE
========================================================= */

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#24302A]">

      {/* =====================================================
          HERO
          Same image/layout as your original
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#234235]">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,117,50,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-3.5 py-8 sm:px-6 sm:py-10 md:py-14 lg:px-8">

          <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">

            {/* HERO CONTENT */}

            <div className="max-w-xl">

              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#C87532]/30 bg-white/5 px-2.5 py-1 text-[8px] font-medium tracking-[0.14em] text-[#F0C18F] sm:mb-4 sm:px-3 sm:py-1 sm:text-[11px] sm:tracking-[0.16em]">

                <Sparkles
                  className="h-3 w-3"
                  aria-hidden="true"
                />

                {aboutData.hero.eyebrow}

              </div>

              <h1 className="text-[27px] font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">

                {aboutData.hero.title}

                <span className="block text-[#C87532]">
                  {aboutData.hero.highlight}
                </span>

              </h1>

              <p className="mt-3 text-[11px] leading-4.5 text-white/70 sm:mt-4 sm:text-[15px] sm:leading-6">

                {aboutData.hero.description}

              </p>

              <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-2.5">

                <Link
                  href="/packages"
                  className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-3.5 py-1.5 text-[9px] font-semibold text-white transition hover:bg-[#B96928] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm ${focus}`}
                >

                  Explore Packages

                  <ArrowRight
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    aria-hidden="true"
                  />

                </Link>

                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[9px] font-semibold text-white transition hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-sm ${focus}`}
                >
                  Talk to Us
                </Link>

              </div>

            </div>

            {/* HERO IMAGE
                Original image/card layout preserved
            */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-2xl">

              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">

                <img
                  src={aboutData.hero.image}
                  alt="Jim Corbett landscape"
                  className="h-full w-full object-cover"
                  loading="eager"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/15 bg-black/25 px-3.5 py-2.5 backdrop-blur-md">

                  <div className="flex items-center gap-1.5 text-[9px] text-white/70 sm:text-[11px]">

                    <MapPin
                      className="h-3 w-3 text-[#C87532]"
                      aria-hidden="true"
                    />

                    {aboutData.hero.location}

                  </div>

                  <p className="text-[11px] font-medium text-white sm:text-sm">
                    {aboutData.hero.tagline}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="border-b border-[#DDD8CE] bg-white/60">

        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[#DDD8CE] sm:grid-cols-4">

          {aboutData.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-3 py-3.5 text-center sm:px-4 sm:py-5 ${
                index > 1
                  ? "border-t border-[#DDD8CE] sm:border-t-0"
                  : ""
              }`}
            >

              <p className="font-serif text-xl font-semibold text-[#234235] sm:text-2xl">
                {stat.value}
              </p>

              <p className="text-[9px] text-[#737C75] sm:text-xs">
                {stat.label}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-3.5 py-8 sm:px-6 sm:py-10 md:py-14 lg:px-8">

        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">

          <div>

            <p className={`${eyebrow} text-[#C87532]`}>
              {aboutData.intro.eyebrow}
            </p>

            <h2 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-[#234235] sm:text-3xl">

              {aboutData.intro.title}

              <span className="block text-[#3B6752]">
                {aboutData.intro.highlight}
              </span>

            </h2>

          </div>

          <div className="space-y-3 text-[11px] leading-5 text-[#647067] sm:text-sm sm:leading-6">

            {aboutData.intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                {paragraph}
              </p>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-3.5 pb-8 sm:px-6 md:pb-14 lg:px-8">

        <div className="mb-5 max-w-xl">

          <p className={`${eyebrow} text-[#C87532]`}>
            What matters to us
          </p>

          <h2 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-[#234235] sm:text-3xl">
            Built around your journey.
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {aboutData.values.map(
            ({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl border border-[#DDD8CE] border-t-2 border-t-[#C87532] bg-white p-3.5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
              >

                <div className="flex items-center gap-2.5">

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#234235]/10 text-[#C87532]">

                    <Icon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                  </span>

                  <h3 className="text-[13px] font-semibold text-[#24302A] sm:text-[15px]">
                    {title}
                  </h3>

                </div>

                <p className="mt-2.5 text-[10px] leading-4.5 text-[#737C75] sm:text-[13px] sm:leading-5">
                  {text}
                </p>

              </div>
            )
          )}

        </div>

      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="bg-[#234235]">

        <div className="mx-auto max-w-6xl px-3.5 py-8 sm:px-6 sm:py-10 md:py-12 lg:px-8">

          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">

            <div>

              <p className={`${eyebrow} text-[#C87532]`}>
                {aboutData.servicesSection.eyebrow}
              </p>

              <h2 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                {aboutData.servicesSection.title}
              </h2>

              <p className="mt-3 max-w-md text-[10px] leading-4.5 text-white/65 sm:text-sm sm:leading-6">
                {aboutData.servicesSection.description}
              </p>

            </div>

            <ul className="grid gap-2 sm:grid-cols-2">

              {aboutData.services.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 sm:gap-2.5 sm:px-3.5"
                >

                  <CheckCircle2
                    className="h-3.5 w-3.5 shrink-0 text-[#C87532] sm:h-4 sm:w-4"
                    aria-hidden="true"
                  />

                  <span className="text-[10px] text-white/80 sm:text-[13px]">
                    {service}
                  </span>

                </li>
              ))}

            </ul>

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="mx-auto max-w-6xl px-3.5 py-8 sm:px-6 sm:py-10 md:py-14 lg:px-8">

        <div className="rounded-2xl bg-[#E8D8B8]/45 p-4 sm:p-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-xl">

              <p className={`${eyebrow} text-[#C87532]`}>
                {aboutData.cta.eyebrow}
              </p>

              <h2 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-[#234235] sm:text-3xl">
                {aboutData.cta.title}
              </h2>

              <p className="mt-2 text-[10px] leading-4.5 text-[#647067] sm:text-sm sm:leading-6">
                {aboutData.cta.description}
              </p>

            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:gap-2.5">

              <Link
                href="/contact"
                className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-[9px] font-semibold text-white transition hover:bg-[#B96928] sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm ${focus}`}
              >

                Send an Enquiry

                <ArrowRight
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />

              </Link>

              <Link
                href="/safari"
                className={`inline-flex items-center justify-center rounded-full border border-[#234235]/20 bg-white/60 px-4 py-2 text-[9px] font-semibold text-[#234235] transition hover:bg-white sm:px-5 sm:py-2.5 sm:text-sm ${focus}`}
              >
                Explore Safari
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          DISCLAIMER
      ===================================================== */}

      <section className="border-t border-[#DDD8CE] px-3.5 py-5 text-center sm:px-6 sm:py-6">

        <p className="mx-auto max-w-3xl text-[9px] leading-4.5 text-[#7A817C] sm:text-[11px] sm:leading-5">
          {aboutData.disclaimer}
        </p>

      </section>

    </main>
  );
}