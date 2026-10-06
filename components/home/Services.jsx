import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/Services";

export default function Services() {
  return (
    <section className="bg-[#F7F5F0] py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">

        {/* Heading */}
        <div className="mb-6 max-w-2xl sm:mb-8 md:mb-10">

          <p className="mb-2 text-[10px] font-semibold tracking-[2px] text-[#B96928] sm:mb-3 sm:text-[11px] md:text-xs md:tracking-[3px]">
            WHAT WE DO
          </p>

          <h2 className="text-[28px] font-bold leading-[1.12] text-[#172033] sm:text-3xl md:text-4xl md:leading-[1.15]">
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
            ,
            <br />
            All in One Place
          </h2>

          {/* Destination Corbett Accent */}
          <div className="mt-3 flex items-center gap-1.5">
            <span
              className="
                h-[2px]
                w-10
                rounded-full
                bg-[#B96928]
                transition-all
                duration-700
                sm:w-12
              "
            />

            <span
              className="
                h-[2px]
                w-16
                rounded-full
                bg-[#18352A]
                transition-all
                duration-700
                sm:w-20
              "
            />

            <span
              className="
                h-[2px]
                w-6
                rounded-full
                bg-[#C87532]
                transition-all
                duration-700
                sm:w-8
              "
            />
          </div>

          <p className="mt-3 max-w-xl text-[14px] leading-5.5 text-gray-600 sm:mt-4 sm:text-sm md:text-[15px] md:leading-6">
            From stays and safaris to corporate events and destination
            weddings, we handle your complete Corbett experience.
          </p>

        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">

          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
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
                sm:h-[290px]
                md:h-[315px]
              "
            >

              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
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

              {/* Subtle Hover Overlay */}
              <div className="absolute inset-0 bg-[#172033]/0 transition-colors duration-300 group-hover:bg-[#172033]/10" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5 md:p-6">

                <div className="flex items-end justify-between gap-3 sm:gap-4">

                  <div className="min-w-0">

                    <h3 className="text-[20px] font-semibold tracking-tight sm:text-xl md:text-[22px]">
                      {service.title}
                    </h3>

                    <p className="mt-1 max-w-sm line-clamp-2 text-[12px] leading-4.5 text-white/80 sm:text-xs md:text-sm md:leading-5">
                      {service.description}
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
                      group-hover:bg-[#C87532]
                      group-hover:text-white
                      group-hover:rotate-45
                      sm:h-10
                      sm:w-10
                    "
                  >
                    <ArrowUpRight
                      size={18}
                      strokeWidth={2}
                    />
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