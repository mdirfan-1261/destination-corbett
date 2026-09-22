import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { miceData } from "@/data/mice";

export default function MICESection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Image */}
          <div className="h-130 overflow-hidden rounded-3xl">
            <img
              src="/mice/mice.jpg"
              alt={miceData.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="max-w-xl">

            <p className="text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-5">
              {miceData.eyebrow}
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-[#172033] leading-tight">
              {miceData.title}
            </h2>

            <p className="mt-6 text-gray-600 text-lg leading-8">
              {miceData.description}
            </p>

            <p className="mt-5 text-gray-600 leading-7">
              From corporate meetings and conferences to team outings,
              dealer meets and retreats, we manage your complete Corbett
              event experience.
            </p>

            <Link
              href="/mice"
              className="inline-flex items-center gap-3 mt-8 bg-[#172033] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#C88A3D] transition"
            >
              Explore MICE Solutions
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}