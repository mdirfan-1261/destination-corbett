import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { stayData } from "@/data/stay";

export default function StaySection() {
  return (
    <section className="bg-[#F7F5F0] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-4">
            {stayData.eyebrow}
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#172033] leading-tight">
            {stayData.title}
          </h2>

          <p className="mt-5 text-gray-600 leading-7">
            {stayData.description}
          </p>
        </div>

        {/* Stay Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {stayData.categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative h-[390px] overflow-hidden rounded-2xl"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">

                <div className="flex items-end justify-between gap-3">

                  <div>
                    <h3 className="text-xl font-bold">
                      {category.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/80 leading-6">
                      {category.description}
                    </p>
                  </div>

                  <div className="shrink-0 w-10 h-10 rounded-full bg-white text-[#172033] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={18} />
                  </div>

                </div>

              </div>
            </Link>
          ))}

        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/stay"
            className="inline-flex items-center gap-2 bg-[#172033] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#C88A3D] transition"
          >
            Explore All Stays
            <ArrowUpRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}