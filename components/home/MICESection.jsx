
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { miceData } from "@/data/mice";

export default function MICESection() {
  return (
    <section className="bg-[#F7F5F0] py-9 sm:py-12 md:py-16 lg:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">

        <div className="grid items-center gap-7 md:gap-10 lg:grid-cols-2 lg:gap-12">

          {/* Image */}
          <div className="h-[280px] overflow-hidden rounded-2xl sm:h-[340px] md:h-[400px] md:rounded-3xl lg:h-[470px]">
            <img
              src="/mice/mice.webp"
              alt={miceData.title}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>

          {/* Content */}
          <div className="max-w-xl">

            {/* Eyebrow */}
            <p className="mb-2.5 text-[10px] font-semibold tracking-[2px] text-[#B96928] sm:mb-3 sm:text-[11px] md:mb-4 md:text-xs md:tracking-[3px]">
              EVENTS & EXPERIENCES
            </p>

            {/* Heading */}
            <h2 className="text-[28px] font-bold leading-[1.12] sm:text-3xl md:text-4xl lg:text-[42px] lg:leading-[1.15]">
              <span
                className="
      bg-gradient-to-r
      from-[#B96928]
      via-[#C87532]
      to-[#18352A]
      bg-clip-text
      text-transparent
      transition-all
      duration-700
    "
              >
                {miceData.title}
              </span>
            </h2>

            {/* Destination Corbett accent */}
            <div className="mt-3 flex items-center gap-1.5 sm:mt-4">
              <span className="h-[2px] w-9 rounded-full bg-[#B96928] sm:w-11" />
              <span className="h-[2px] w-14 rounded-full bg-[#18352A] sm:w-18" />
              <span className="h-[2px] w-5 rounded-full bg-[#C87532] sm:w-7" />
            </div>

            {/* Description */}
            <p className="mt-3 text-[14px] leading-5.5 text-gray-600 sm:mt-4 sm:text-sm md:mt-5 md:text-base md:leading-7">
              {miceData.description}
            </p>

            {/* Supporting text */}
            <p className="mt-2.5 text-[14px] leading-5.5 text-gray-600 sm:mt-3 sm:text-sm md:mt-4 md:text-[15px] md:leading-7">
              From corporate meetings and conferences to team outings,
              dealer meets and retreats, we manage your complete Corbett
              event experience.
            </p>

            {/* CTA */}
            <Link
              href="/events"
              className="
                mt-5
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#172033]
                px-5
                py-3
                text-[13px]
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-300
                hover:bg-[#B96928]
                hover:shadow-lg
                sm:mt-6
                sm:px-6
                sm:text-sm
                md:mt-7
                md:text-[15px]
              "
            >
              Explore Events
              <ArrowRight size={17} />
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}


