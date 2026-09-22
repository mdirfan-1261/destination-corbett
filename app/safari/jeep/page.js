"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock3,
  Users,
  ArrowRight,
  Trees,
} from "lucide-react";

const safaris = [
  {
    name: "Dhikala Zone Safari",
    zone: "Dhikala",
    image: "/safari/dhikala.jpg",
    duration: "Full Day (6-7 hrs)",
    price: "₹4,500",
    group: "Up to 6",
  },
  {
    name: "Bijrani Zone Safari",
    zone: "Bijrani",
    image: "/safari/bijrani.jpg",
    duration: "Half Day (3-4 hrs)",
    price: "₹3,200",
    group: "Up to 6",
  },
  {
    name: "Jhirna Zone Safari",
    zone: "Jhirna",
    image: "/safari/jhirna.jpg",
    duration: "Half Day (3-4 hrs)",
    price: "₹3,000",
    group: "Up to 6",
  },
  {
    name: "Dhela Zone Safari",
    zone: "Dhela",
    image: "/safari/dhela.jpg",
    duration: "Half Day (3-4 hrs)",
    price: "₹2,800",
    group: "Up to 6",
  },
  {
    name: "Sitabani Zone Safari",
    zone: "Sitabani",
    image: "/safari/sitabani.jpg",
    duration: "Half Day (3-4 hrs)",
    price: "₹2,500",
    group: "Up to 6",
  },
];

export default function SafariPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0]">

      {/* ================= HERO ================= */}

      <section className="relative h-[300px] sm:h-[340px] md:h-[380px] overflow-hidden">

        <Image
          src="/safari/safari-hero.jpg"
          alt="Jeep Safari in Jim Corbett"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 h-full flex items-center">

          <div className="max-w-2xl text-white">

            <p className="text-xs sm:text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-3">
              JEEP SAFARI
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Explore Corbett
              <span className="block">
                in a Jeep Safari
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-white/80 leading-7 max-w-xl">
              Choose your zone and let us arrange a thrilling wildlife
              jeep safari through Jim Corbett National Park.
            </p>

          </div>

        </div>

      </section>


      {/* ================= SAFARI LISTING ================= */}

      <section className="py-10 sm:py-14 md:py-16">

        <div className="max-w-6xl mx-auto px-5 sm:px-6">

          {/* Section Heading */}

          <div className="max-w-2xl mb-8 sm:mb-10">

            <p className="text-xs sm:text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-3">
              CHOOSE YOUR ZONE
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#172033]">
              Jeep Safari Options
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-6">
              Select a safari zone that fits your time, group size and
              budget.
            </p>

          </div>


          {/* Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {safaris.map((safari) => (

              <div
                key={safari.zone}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >

                {/* Image */}

                <div className="relative h-[190px] sm:h-[200px] overflow-hidden">

                  <Image
                    src={safari.image}
                    alt={safari.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />


                  {/* Zone */}

                  <div className="absolute bottom-3 left-3">

                    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">

                      <Trees
                        size={14}
                        className="text-[#C88A3D]"
                      />

                      <span className="text-xs font-semibold text-[#172033]">
                        {safari.zone}
                      </span>

                    </div>

                  </div>

                </div>


                {/* Content */}

                <div className="p-5">

                  <h3 className="text-lg sm:text-xl font-bold text-[#172033]">
                    {safari.name}
                  </h3>


                  {/* Info */}

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs sm:text-sm text-gray-500">

                    <span className="flex items-center gap-1.5">

                      <Clock3
                        size={14}
                        className="text-[#C88A3D]"
                      />

                      {safari.duration}

                    </span>

                    <span className="flex items-center gap-1.5">

                      <Users
                        size={14}
                        className="text-[#C88A3D]"
                      />

                      {safari.group}

                    </span>

                  </div>


                  {/* Location */}

                  <div className="flex items-center gap-1.5 mt-3 text-xs sm:text-sm text-gray-500">

                    <MapPin
                      size={14}
                      className="text-[#C88A3D]"
                    />

                    Jim Corbett National Park

                  </div>


                  {/* Bottom */}

                  <div className="flex items-end justify-between gap-3 mt-5 pt-4 border-t border-gray-100">

                    <div>

                      <p className="text-[11px] text-gray-500">
                        Starting from
                      </p>

                      <p className="text-xl font-bold text-[#172033]">
                        {safari.price}

                        <span className="text-xs font-normal text-gray-500">
                          {" "} / jeep
                        </span>
                      </p>

                    </div>


                    {/* ================= ENQUIRE → CONTACT ================= */}

                    <Link
                      href={`/contact?safari=${encodeURIComponent(
                        safari.name
                      )}&image=${encodeURIComponent(
                        safari.image
                      )}`}
                      className="inline-flex items-center gap-1.5 bg-[#C88A3D] text-white text-xs sm:text-sm font-semibold rounded-lg px-3.5 py-2.5 hover:bg-[#A96F2E] transition"
                    >
                      Enquire
                      <ArrowRight size={15} />
                    </Link>

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