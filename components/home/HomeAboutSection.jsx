import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Compass,
  BedDouble,
  MapPin,
} from "lucide-react";

const experiences = [
  {
    icon: Compass,
    title: "Jungle Experiences",
    description: "Explore safari experiences around Corbett.",
  },
  {
    icon: BedDouble,
    title: "Comfortable Stays",
    description: "Discover stays and resorts for your getaway.",
  },
  {
    icon: MapPin,
    title: "Personalized Planning",
    description: "Find suitable packages, events and experiences.",
  },
];

export default function HomeAboutSection() {
  return (
    <section className="overflow-hidden bg-[#F7F5F0] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-7 lg:grid-cols-2 lg:gap-14">
        {/* About image */}
        <div className="relative">
          <div className="absolute -left-3 -top-3 h-20 w-20 rounded-tl-3xl border-l-2 border-t-2 border-[#B96928]/50 sm:-left-4 sm:-top-4 sm:h-28 sm:w-28" />

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E7E2D8] shadow-lg">
            <Image
              src="/images/about/corbett-about.webp"
              alt="Discover the natural beauty of Jim Corbett"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-3 right-3 rounded-xl border border-white/20 bg-[#234235] px-4 py-3 text-white shadow-lg sm:bottom-5 sm:-right-4 sm:px-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E6B77E] sm:text-[10px]">
              Destination Corbett
            </p>
            <p className="mt-1 text-sm font-medium sm:text-base">
              Explore. Experience. Connect.
            </p>
          </div>
        </div>

        {/* About content */}
        <div className="pt-2 lg:pt-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B96928] sm:text-xs">
            Discover Our Story
          </p>

          <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#234235] sm:text-4xl lg:text-[42px]">
            More Than a Stay.
            <span className="mt-1 block text-[#B96928]">
              It Is the Experience.
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-[#647067] sm:text-base sm:leading-7">
            Destination Corbett brings the essential parts of your Corbett
            journey together. From comfortable stays and safari experiences
            to holiday packages, weddings and events, discover options for
            your next getaway in one place.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {experiences.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-xl border border-[#DDD8CE] bg-white/80 p-3 sm:flex-col sm:gap-2 lg:flex-row lg:items-center xl:flex-col xl:items-start"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#234235]/10 text-[#B96928]">
                  <Icon size={19} aria-hidden="true" />
                </span>

                <div>
                  <h3 className="text-xs font-semibold text-[#24302A] sm:text-sm">
                    {title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-4 text-[#737C75] sm:text-xs">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#B96928] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9F5721] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B96928]"
            >
              Read More About Us
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <Link
              href="/contact"
              className="text-sm font-semibold text-[#234235] underline decoration-[#B96928]/60 underline-offset-4 transition hover:text-[#B96928]"
            >
              Plan Your Trip
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}