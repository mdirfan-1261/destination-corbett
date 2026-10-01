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

const values = [
  { icon: Compass, title: "Local Expertise", text: "Practical local knowledge and carefully planned Corbett experiences." },
  { icon: ShieldCheck, title: "Reliable Planning", text: "Stays, safaris and events coordinated so your journey stays simple." },
  { icon: Heart, title: "Personal Touch", text: "Every trip shaped around your group, occasion, budget and style." },
  { icon: Users, title: "One Travel Partner", text: "Stay, safari, events, weddings and packages in one place." },
];

const services = [
  "Corbett stays & resorts",
  "Jeep & safari experiences",
  "Weekend & holiday packages",
  "Corporate events & MICE",
  "Destination weddings",
  "Travel assistance & enquiries",
];

const stats = [
  { value: "01", label: "Travel platform" },
  { value: "05+", label: "Experience categories" },
  { value: "24/7", label: "Enquiry assistance" },
  { value: "100%", label: "Personalized planning" },
];

const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.18em]";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B99255]";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#24302A]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#234235]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(185,146,85,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#E8D8B8]/25 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-[0.16em] text-[#E8D8B8] sm:text-[11px]">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                ABOUT DESTINATION CORBETT
              </div>

              <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your gateway to
                <span className="block text-[#E8D8B8]">Corbett experiences.</span>
              </h1>

              <p className="mt-4 text-sm leading-6 text-white/70 sm:text-[15px]">
                A travel facilitation platform that makes planning your Corbett journey easier,
                from the right stay to safaris, packages, celebrations and events.
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="/packages"
                  className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#B99255] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C8A968] ${focus}`}
                >
                  Explore Packages
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 ${focus}`}
                >
                  Talk to Us
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-2xl">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <img
                  src="/images/about/corbett-about.jpg"
                  alt="Jim Corbett landscape"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/15 bg-black/25 px-3.5 py-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/70">
                    <MapPin className="h-3 w-3 text-[#E8D8B8]" aria-hidden="true" />
                    Jim Corbett, Uttarakhand
                  </div>
                  <p className="text-sm font-medium text-white">Explore. Experience. Connect.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-[#DDD8CE] bg-white/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[#DDD8CE] sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-4 text-center sm:py-5 ${i > 1 ? "border-t border-[#DDD8CE] sm:border-t-0" : ""}`}
            >
              <p className="font-serif text-xl font-semibold text-[#234235] sm:text-2xl">{s.value}</p>
              <p className="text-[11px] text-[#737C75] sm:text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className={`${eyebrow} text-[#B99255]`}>Who we are</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#234235] sm:text-3xl">
              More than a stay.
              <span className="block text-[#3B6752]">It is the experience.</span>
            </h2>
          </div>

          <div className="space-y-3 text-sm leading-6 text-[#647067]">
            <p>
              Destination Corbett brings the essential parts of a Corbett trip together. Whether it is a
              family holiday, a wildlife experience, a weekend escape or a larger celebration, we help you
              explore the options and connect with the right services.
            </p>
            <p>
              Our focus is simple: make planning more convenient, transparent and personalized, from
              accommodation and safaris to weddings, events and curated packages.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 md:pb-14 lg:px-8">
        <div className="mb-5 max-w-xl">
          <p className={`${eyebrow} text-[#B99255]`}>What matters to us</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#234235] sm:text-3xl">
            Built around your journey.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-[#DDD8CE] border-t-2 border-t-[#B99255] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#234235]/10 text-[#3B6752]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="text-[15px] font-semibold text-[#24302A]">{title}</h3>
              </div>
              <p className="mt-2.5 text-[13px] leading-5 text-[#737C75]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#234235]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
            <div>
              <p className={`${eyebrow} text-[#E8D8B8]`}>What we offer</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Everything you need for a Corbett trip.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                Pick individual services or let us put together a complete experience for you.
              </p>
            </div>

            <ul className="grid gap-2 sm:grid-cols-2">
              {services.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C8A968]" aria-hidden="true" />
                  <span className="text-[13px] text-white/80">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="rounded-2xl bg-[#E8D8B8]/45 p-5 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className={`${eyebrow} text-[#B99255]`}>Start planning</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#234235] sm:text-3xl">
                Ready to plan your Corbett experience?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#647067]">
                Tell us what you are looking for and we will help you explore suitable stays, safaris,
                packages or event options.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
              <Link
                href="/contact"
                className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#234235] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#315846] ${focus}`}
              >
                Send an Enquiry
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/safari"
                className={`inline-flex items-center justify-center rounded-full border border-[#234235]/20 bg-white/60 px-5 py-2.5 text-sm font-semibold text-[#234235] transition hover:bg-white ${focus}`}
              >
                Explore Safari
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="border-t border-[#DDD8CE] px-4 py-6 text-center sm:px-6">
        <p className="mx-auto max-w-3xl text-[11px] leading-5 text-[#7A817C]">
          Destination Corbett is an independent travel facilitation platform. It is not an official website
          of the Forest Department, Government of India, or any government authority. Safari availability,
          permits, timings and other forest-related services are subject to applicable rules and official
          authorities.
        </p>
      </section>
    </main>
  );
}