import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { stayData } from "@/data/stay";

export default function StayPage() {
  return (
    <main className="bg-white">

      {/* Hero */}
      <section className="relative h-[520px] overflow-hidden">

        <img
          src={stayData.categories[0].image}
          alt="Jim Corbett Stay"
          className="absolute inset-0 w-full h-full object-cover brightness-140"
        />

        <div className="absolute inset-0 bg-black/15" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">

          <div className="max-w-2xl text-white">

            <p className="text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-5">
              {stayData.eyebrow}
            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Find Your Perfect Stay in Jim Corbett
            </h1>

            <p className="mt-6 text-lg text-white/80 leading-8">
              {stayData.description}
            </p>

          </div>

        </div>

      </section>


      {/* Stay Categories */}

      <section className="py-24 bg-[#F7F5F0]">

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-2xl mb-12">

            <p className="text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-4">
              EXPLORE STAYS
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-[#172033]">
              Stay Options for Every Requirement
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {stayData.categories.map((category) => (

              <div
                key={category.id}
                className="group relative h-[360px] overflow-hidden rounded-2xl"
              >

                {/* Image */}

                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />


                {/* Overlay */}

                <div className="absolute inset-0 bg-black/25" />


                {/* Content */}

                <div className="absolute bottom-0 left-0 right-0 p-7 text-white">

                  <div className="flex items-end justify-between gap-4">

                    <div>

                      <h3 className="text-2xl font-bold">
                        {category.title}
                      </h3>

                      <p className="mt-2 text-white/80 leading-6 max-w-lg">
                        {category.description}
                      </p>


                      {/* Buttons */}

                      <div className="flex flex-wrap gap-3 mt-5">

                        {/* View Stay */}

                        <Link
                          href={category.href}
                          className="inline-flex items-center gap-2 bg-white text-[#172033] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#C88A3D] hover:text-white transition"
                        >
                          View Stay
                          <ArrowRight size={16} />
                        </Link>


                        {/* Enquiry */}

                        <Link
                          href={`/contact?hotel=${encodeURIComponent(
                            category.title
                          )}&hotelImage=${encodeURIComponent(
                            category.image
                          )}&location=${encodeURIComponent(
                            "Jim Corbett, Uttarakhand"
                          )}`}
                          className="inline-flex items-center gap-2 bg-[#C88A3D] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#A96F2E] transition"
                        >
                          Enquire Now
                          <Send size={16} />
                        </Link>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}