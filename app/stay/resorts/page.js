"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";

const resorts = [
  {
    id: 1,
    name: "Corbett Forest Resort",
    location: "Dhikuli, Jim Corbett",
    image: "/stay/resort-1.jpg",
    description:
      "A peaceful forest resort surrounded by nature, perfect for families and weekend getaways.",
  },
  {
    id: 2,
    name: "Riverside Retreat",
    location: "Ramnagar, Jim Corbett",
    image: "/stay/resort-2.jpg",
    description:
      "Enjoy a relaxing stay with beautiful surroundings and a peaceful riverside atmosphere.",
  },
  {
    id: 3,
    name: "Jungle View Resort",
    location: "Sitabani, Jim Corbett",
    image: "/stay/resort-3.jpg",
    description:
      "Experience nature, comfort and adventure with a beautiful jungle view.",
  },
  {
    id: 4,
    name: "Corbett Nature Stay",
    location: "Dhangari, Jim Corbett",
    image: "/stay/resort-4.jpg",
    description:
      "Comfortable rooms, peaceful surroundings and easy access to Jim Corbett attractions.",
  },
  {
    id: 5,
    name: "Wildlife Retreat",
    location: "Mohokand, Jim Corbett",
    image: "/stay/resort-5.jpg",
    description:
      "A comfortable retreat for travellers looking for a relaxing wildlife experience.",
  },
  {
    id: 6,
    name: "Green Valley Resort",
    location: "Ramnagar, Jim Corbett",
    image: "/stay/resort-6.jpg",
    description:
      "A beautiful nature stay offering comfort, greenery and a memorable Corbett experience.",
  },
];

export default function ResortsStaysPage() {
  const [expanded, setExpanded] = useState(null);

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Hero Section */}

      <section className="relative h-[500px] overflow-hidden">

        <Image
          src="/stay/resort-hero.jpg"
          alt="Resorts and Stays in Jim Corbett"
          fill
          priority
          className="object-cover brightness-110"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/16" />

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="px-6">

            <p className="text-green-300 font-semibold mb-3">
              JIM CORBETT
            </p>

            <h1 className="text-4xl md:text-5xl font-bold mb-5">
              Resorts & Stays
            </h1>

            <p className="max-w-2xl mx-auto text-gray-200 text-lg">
              Discover comfortable resorts and peaceful stays surrounded by
              the natural beauty of Jim Corbett.
            </p>

          </div>
        </div>

      </section>


      {/* Resorts Section */}

      <section className="py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-10">

            <h2 className="text-3xl font-bold text-gray-900">
              Explore Resorts & Stays
            </h2>

            <p className="text-gray-600 mt-2">
              Choose the perfect stay for your Jim Corbett trip.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {resorts.map((resort) => (

              <div
                key={resort.id}
                onClick={() => handleToggle(resort.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
              >

                {/* Image */}

                <div className="relative h-60 w-full">

                  <Image
                    src={resort.image}
                    alt={resort.name}
                    fill
                    className="object-cover"
                  />

                </div>


                {/* Content */}

                <div className="p-6">

                  <div className="flex items-center justify-between">

                    <p className="flex items-center gap-2 text-sm text-green-700 font-medium mb-2">
                      <MapPin size={16} />
                      {resort.location}
                    </p>

                    <ChevronDown
                      size={18}
                      className={`text-green-700 transition-transform ${
                        expanded === resort.id ? "rotate-180" : ""
                      }`}
                    />

                  </div>


                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {resort.name}
                  </h3>


                  {expanded === resort.id ? (
                    <p className="text-gray-600 text-sm leading-6 mb-5">
                      {resort.description}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm leading-6 mb-5 line-clamp-1">
                      {resort.description}
                    </p>
                  )}


                  {/* Enquire */}

                  <Link
                    href={`/contact?hotel=${encodeURIComponent(
                      resort.name
                    )}&hotelImage=${encodeURIComponent(
                      resort.image
                    )}&location=${encodeURIComponent(
                      resort.location
                    )}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition"
                  >
                    Enquire Now
                    <ArrowRight size={18} />
                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}