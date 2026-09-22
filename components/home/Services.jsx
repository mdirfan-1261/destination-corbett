import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/Services";

export default function Services() {
  return (
    <section className="bg-[#F7F5F0] py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-4">
            WHAT WE DO
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#172033] leading-tight">
            Complete Corbett Solutions,
            <br />
            All in One Place
          </h2>

          <p className="mt-5 text-gray-600 leading-7">
            From stays and safaris to corporate events and destination
            weddings, we handle your complete Corbett experience.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative h-90 overflow-hidden rounded-2xl"
            >
              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/15 to-transparent" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {service.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/80 leading-6 max-w-sm">
                      {service.description}
                    </p>
                  </div>

                  <div className="shrink-0 w-11 h-11 rounded-full bg-white text-[#172033] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={20} />
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