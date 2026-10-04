import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { miceData } from "@/data/mice";

export default function MICESection() {
  return (
    <section className="py-14 md:py-16 lg:py-18 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-6">

        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">

          {/* Image */}
          <div className="h-[280px] sm:h-[340px] md:h-[400px] lg:h-[470px] overflow-hidden rounded-2xl md:rounded-3xl">
            <img
              src="/mice/mice.jpg"
              alt={miceData.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>

          {/* Content */}
          <div className="max-w-xl">

            <p className="text-[11px] md:text-xs font-semibold tracking-[3px] text-[#C87532] mb-3 md:mb-4">
              EVENTS & EXPERIENCES
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#172033] leading-[1.15]">
              {miceData.title}
            </h2>

            <p className="mt-4 md:mt-5 text-sm md:text-base text-gray-600 leading-6 md:leading-7">
              {miceData.description}
            </p>

            <p className="mt-3 md:mt-4 text-sm md:text-[15px] text-gray-600 leading-6 md:leading-7">
              From corporate meetings and conferences to team outings,
              dealer meets and retreats, we manage your complete Corbett
              event experience.
            </p>

            <Link
              href="/events"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                mt-6
                md:mt-7
                bg-[#172033]
                text-white
                px-6
                py-3
                rounded-full
                text-sm
                md:text-[15px]
                font-semibold
                hover:bg-[#C87532]
                transition-all
                duration-300
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