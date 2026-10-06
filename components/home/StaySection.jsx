
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { stayData } from "@/data/stay";

export default function StaySection() {
  return (
    <section className="bg-[#F7F5F0] py-9 sm:py-12 md:py-16 lg:py-18">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">

        {/* Heading */}
        <div className="mb-6 max-w-2xl sm:mb-8 md:mb-10">

          <p className="mb-2.5 text-[10px] font-semibold tracking-[2px] text-[#B96928] sm:mb-3 sm:text-[11px] md:mb-4 md:text-xs md:tracking-[3px]">
            {stayData.eyebrow}
          </p>

          <h2 className="text-[28px] font-bold leading-[1.12] sm:text-3xl md:text-4xl lg:text-[42px] lg:leading-[1.15]">
            <span
              className="
                bg-gradient-to-r
                from-[#B96928]
                via-[#C87532]
                to-[#18352A]
                bg-clip-text
                text-transparent
              "
            >
              {stayData.title}
            </span>
          </h2>

          {/* Destination Corbett Accent */}
          <div className="mt-3 flex items-center gap-1.5 sm:mt-4">
            <span className="h-[2px] w-9 rounded-full bg-[#B96928] sm:w-11" />
            <span className="h-[2px] w-14 rounded-full bg-[#18352A] sm:w-18" />
            <span className="h-[2px] w-5 rounded-full bg-[#C87532] sm:w-7" />
          </div>

          <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#4B5563] sm:mt-4 sm:text-sm md:mt-5 md:text-[15px] md:leading-7">
            {stayData.description}
          </p>

        </div>

        {/* Stay Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">

          {stayData.categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="
                group
                relative
                h-[255px]
                overflow-hidden
                rounded-xl
                border
                border-black/5
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                sm:h-[310px]
                md:rounded-2xl
                lg:h-[330px]
              "
            >

              {/* Image */}
              <img
                src={category.image}
                alt={category.title}
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/20 to-transparent" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#172033]/0 transition-colors duration-300 group-hover:bg-[#172033]/10" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">

                <div className="flex items-end justify-between gap-3">

                  <div className="min-w-0">

                    <h3 className="text-[20px] font-semibold leading-tight tracking-tight sm:text-lg md:text-xl">
                      {category.title}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-white/85 sm:text-xs md:text-sm">
                      {category.description}
                    </p>

                  </div>

                  {/* Arrow */}
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-white/95
                      text-[#172033]
                      shadow-lg
                      transition-all
                      duration-300
                      group-hover:rotate-45
                      group-hover:bg-[#B96928]
                      group-hover:text-white
                    "
                  >
                    <ArrowUpRight size={18} />
                  </div>

                </div>

              </div>
            </Link>
          ))}

        </div>

        {/* CTA */}
        <div className="mt-6 text-center sm:mt-7 md:mt-9">
          <Link
            href="/stay"
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#172033]
              px-5
              py-3
              text-[14px]
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:bg-[#B96928]
              hover:shadow-lg
              sm:px-6
              sm:text-sm
              md:text-[15px]
            "
          >
            Explore All Stays
            <ArrowUpRight size={17} />
          </Link>
        </div>

      </div>
    </section>
  );
}
