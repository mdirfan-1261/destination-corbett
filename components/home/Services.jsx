
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/Services";

export default function Services() {
  return (
    <section className="bg-[#F7F5F0] py-6 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-5 md:px-6">
        {/* Heading: compact on mobile, original desktop styling */}
        <div className="mb-5 max-w-2xl sm:mb-8 md:mb-10">
          <p className="mb-2 text-[10px] font-semibold tracking-[2px] text-[#B96928] sm:mb-3 sm:text-[11px] md:text-xs md:tracking-[3px]">
            WHAT WE DO
          </p>

          <h2 className="text-[25px] font-bold leading-[1.18] text-[#172033] sm:text-3xl md:text-4xl md:leading-[1.15]">
            Complete{" "}
            <span
              className="
                inline-block
                bg-gradient-to-r
                from-[#B96928]
                via-[#C87532]
                to-[#18352A]
                bg-clip-text
                text-transparent
                transition-all
                duration-700
                hover:from-[#18352A]
                hover:via-[#C87532]
                hover:to-[#B96928]
              "
            >
              Corbett Solutions
            </span>
            <br className="hidden sm:block" />{" "}
            <span className="whitespace-nowrap sm:whitespace-normal">
              All in One Place
            </span>
          </h2>

          {/* Accent */}
          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-[2px] w-10 rounded-full bg-[#B96928] sm:w-12" />
            <span className="h-[2px] w-16 rounded-full bg-[#18352A] sm:w-20" />
            <span className="h-[2px] w-6 rounded-full bg-[#C87532] sm:w-8" />
          </div>

          {/* Shorter text on mobile */}
          <p className="mt-3 max-w-xl text-[13px] leading-5 text-gray-700 sm:mt-4 sm:text-sm md:text-[15px] md:leading-6">
            <span className="sm:hidden">
              Safari, stays and special events. Choose your experience.
            </span>
            <span className="hidden sm:inline">
              From stays and safaris to corporate events and destination
              weddings, we handle your complete Corbett experience.
            </span>
          </p>
        </div>

        {/* Service Cards: desktop grid remains unchanged */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              aria-label={`Explore ${service.title}`}
              className="
                group
                relative
                h-[230px]
                overflow-hidden
                rounded-xl
                border
                border-black/5
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#B96928]
                sm:h-[290px]
                md:h-[315px]
              "
            >
              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.04]
                "
              />

              {/* Premium Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/85 via-[#111827]/20 to-transparent" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#172033]/0 transition-colors duration-300 group-hover:bg-[#172033]/10" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-5 md:p-6">
                <div className="flex items-end justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <h3 className="text-[19px] font-semibold tracking-tight sm:text-xl md:text-[22px]">
                      {service.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 max-w-sm text-[12px] leading-4.5 text-white/95 sm:text-xs md:text-sm md:leading-5">
                      {service.description}
                    </p>

                    {/* Visible action cue on mobile */}
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white sm:hidden">
                      Explore options
                      <ArrowUpRight size={14} />
                    </span>
                  </div>

                  {/* Desktop arrow remains as before */}
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white/95
                      text-[#172033]
                      shadow-lg
                      transition-all
                      duration-300
                      group-hover:bg-[#B96928]
                      group-hover:text-white
                      group-hover:rotate-45
                      sm:h-10
                      sm:w-10
                    "
                  >
                    <ArrowUpRight size={18} strokeWidth={2} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
