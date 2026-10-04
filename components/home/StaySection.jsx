import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { stayData } from "@/data/stay";

export default function StaySection() {
  return (
    <section className="bg-[#F7F5F0] py-14 md:py-16 lg:py-18">
      <div className="max-w-7xl mx-auto px-5 md:px-6">

        {/* Heading */}
        <div className="max-w-2xl mb-8 md:mb-10">
          <p className="text-[11px] md:text-xs font-semibold tracking-[3px] text-[#C87532] mb-3 md:mb-4">
            {stayData.eyebrow}
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#172033] leading-[1.15]">
            {stayData.title}
          </h2>

          <p className="mt-4 md:mt-5 text-sm md:text-[15px] text-gray-600 leading-6 md:leading-7 max-w-xl">
            {stayData.description}
          </p>
        </div>

        {/* Stay Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">

          {stayData.categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative h-[290px] sm:h-[310px] lg:h-[330px] overflow-hidden rounded-xl md:rounded-2xl border border-black/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Premium Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/20 to-transparent" />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#172033]/0 transition-colors duration-300 group-hover:bg-[#172033]/10" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-5.5 text-white">

                <div className="flex items-end justify-between gap-3">

                  <div className="min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold tracking-tight">
                      {category.title}
                    </h3>

                    <p className="mt-1.5 text-xs md:text-sm text-white/75 leading-5 line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/95 text-[#172033] flex items-center justify-center shadow-lg transition-all duration-300 group-hover:bg-[#C87532] group-hover:text-white group-hover:rotate-45">
                    <ArrowUpRight size={17} />
                  </div>

                </div>

              </div>
            </Link>
          ))}

        </div>

        {/* CTA */}
        <div className="mt-7 md:mt-9 text-center">
          <Link
            href="/stay"
            className="inline-flex items-center justify-center gap-2 bg-[#172033] text-white px-6 py-3 rounded-full text-sm md:text-[15px] font-semibold hover:bg-[#C87532] transition-all duration-300"
          >
            Explore All Stays
            <ArrowUpRight size={17} />
          </Link>
        </div>

      </div>
    </section>
  );
}