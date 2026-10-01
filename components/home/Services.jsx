import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/Services";

export default function Services() {
  return (
    <section className="bg-[#F7F5F0] py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-6">

        {/* Heading */}
        <div className="max-w-2xl mb-8 md:mb-10">
          <p className="text-[11px] md:text-xs font-semibold tracking-[3px] text-[#C88A3D] mb-3">
            WHAT WE DO
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-[#172033] leading-[1.15]">
            Complete Corbett Solutions,
            <br />
            All in One Place
          </h2>

          <p className="mt-4 text-sm md:text-[15px] text-gray-600 leading-6 max-w-xl">
            From stays and safaris to corporate events and destination
            weddings, we handle your complete Corbett experience.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative h-[300px] md:h-[315px] overflow-hidden rounded-xl border border-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Premium Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/20 to-transparent" />

              {/* Subtle Hover Overlay */}
              <div className="absolute inset-0 bg-[#172033]/0 transition-colors duration-300 group-hover:bg-[#172033]/10" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 text-white">

                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-[22px] font-semibold tracking-tight">
                      {service.title}
                    </h3>

                    <p className="mt-1.5 text-xs md:text-sm text-white/75 leading-5 max-w-sm line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 w-10 h-10 rounded-full bg-white/95 text-[#172033] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:bg-[#C88A3D] group-hover:text-white group-hover:rotate-45">
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