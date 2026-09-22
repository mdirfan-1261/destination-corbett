"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";

const rooms = [
  {
    id: 1,
    name: "Luxury Forest Room",
    location: "Dhikuli, Jim Corbett",
    image: "/stay/rooms-1.jpg",
    description:
      "A beautifully designed room offering premium comfort with peaceful forest surroundings.",
  },
  {
    id: 2,
    name: "Deluxe Nature Room",
    location: "Ramnagar, Jim Corbett",
    image: "/stay/rooms-2.jpg",
    description:
      "Comfortable accommodation with modern amenities and a relaxing natural atmosphere.",
  },
  {
    id: 3,
    name: "Cozy Resort Room",
    location: "Sitabani, Jim Corbett",
    image: "/stay/rooms-3.jpg",
    description:
      "A cozy room perfect for couples and travellers looking for a peaceful Corbett stay.",
  },
  {
    id: 4,
    name: "Family Room",
    location: "Dhangari, Jim Corbett",
    image: "/stay/rooms-4.jpg",
    description:
      "Spacious and comfortable accommodation designed for families and small groups.",
  },
  {
    id: 5,
    name: "Forest Cottage",
    location: "Mohokand, Jim Corbett",
    image: "/stay/rooms-5.jpg",
    description:
      "Enjoy a unique cottage stay surrounded by greenery, nature and peaceful surroundings.",
  },
  {
    id: 6,
    name: "Balcony Room",
    location: "Ramnagar, Jim Corbett",
    image: "/stay/rooms-6.jpg",
    description:
      "Relax in a comfortable room with a private balcony and beautiful views of nature.",
  },
];

export default function RoomsAccommodationPage() {
  const [expanded, setExpanded] = useState(null);

  const handleToggle = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Hero Section */}

      <section className="relative h-[500px] overflow-hidden">

        <Image
          src="/stay/rooms-hero.jpg"
          alt="Rooms and Accommodation in Jim Corbett"
          fill
          priority
          className="object-cover"
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
              Rooms & Accommodation
            </h1>

            <p className="max-w-2xl mx-auto text-gray-200 text-lg">
              Find comfortable rooms and accommodations for a relaxing
              and memorable stay in Jim Corbett.
            </p>

          </div>

        </div>

      </section>


      {/* Rooms Section */}

      <section className="py-16">

        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}

          <div className="mb-10">

            <h2 className="text-3xl font-bold text-gray-900">
              Explore Rooms & Accommodation
            </h2>

            <p className="text-gray-600 mt-2">
              Choose the perfect room for your Jim Corbett holiday.
            </p>

          </div>


          {/* Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {rooms.map((room) => (

              <div
                key={room.id}
                onClick={() => handleToggle(room.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
              >

                {/* Image */}

                <div className="relative h-60 w-full">

                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />

                </div>


                {/* Content */}

                <div className="p-6">

                  {/* Location + Toggle */}

                  <div className="flex items-center justify-between">

                    <p className="flex items-center gap-2 text-sm text-green-700 font-medium mb-2">

                      <MapPin size={16} />

                      {room.location}

                    </p>

                    <ChevronDown
                      size={18}
                      className={`text-green-700 transition-transform ${
                        expanded === room.id ? "rotate-180" : ""
                      }`}
                    />

                  </div>


                  {/* Title */}

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {room.name}
                  </h3>


                  {/* Description */}

                  {expanded === room.id ? (

                    <p className="text-gray-600 text-sm leading-6 mb-5">
                      {room.description}
                    </p>

                  ) : (

                    <p className="text-gray-600 text-sm leading-6 mb-5 line-clamp-1">
                      {room.description}
                    </p>

                  )}


                  {/* Enquire */}

                  <Link
                    href={`/contact?hotel=${encodeURIComponent(
                      room.name
                    )}&hotelImage=${encodeURIComponent(
                      room.image
                    )}&location=${encodeURIComponent(
                      room.location
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