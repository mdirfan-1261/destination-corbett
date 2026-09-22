"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";

const deluxeHotels = [
    {
        id: 1,
        name: "Corbett Deluxe Retreat",
        location: "Dhikuli, Jim Corbett",
        image: "/stay/deluxe-1.jpg",
        description:
            "Comfortable deluxe accommodation with modern amenities for families, groups and corporate travellers.",
        price: "₹4,499",
        rating: "4.4",
        reviews: "48 reviews",
        guests: "2 Guests",
        cancellation: "Free cancellation",
    },
    {
        id: 2,
        name: "River View Deluxe Resort",
        location: "Sitabani Road, Corbett",
        image: "/stay/deluxe-2.jpg",
        description:
            "A peaceful deluxe stay surrounded by nature, offering comfortable rooms and a relaxing experience.",
        price: "₹4,999",
        rating: "4.5",
        reviews: "52 reviews",
        guests: "2 Guests",
        cancellation: "Free cancellation",
    },
    {
        id: 3,
        name: "Forest Crown Resort",
        location: "Dhela, Jim Corbett",
        image: "/stay/deluxe-3.jpg",
        description:
            "Well-appointed accommodation suitable for corporate groups, families and leisure travellers.",
        price: "₹5,499",
        rating: "4.6",
        reviews: "61 reviews",
        guests: "2 Guests",
        cancellation: "Free cancellation",
    },
    {
        id: 4,
        name: "Corbett Valley Resort",
        location: "Ramnagar, Uttarakhand",
        image: "/stay/deluxe-4.jpg",
        description:
            "A comfortable deluxe property offering a convenient stay for groups and travellers visiting Corbett.",
        price: "₹5,999",
        rating: "4.7",
        reviews: "67 reviews",
        guests: "2 Guests",
        cancellation: "Free cancellation",
    },
];

export default function DeluxeHotelsPage() {
    const [expanded, setExpanded] = useState(null);

    const handleToggle = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <main className="bg-white">

            {/* ================= HERO ================= */}

            <section className="relative h-[560px] overflow-hidden">

                <Image
                    src="/stay/stay-hero.jpg"
                    alt="Deluxe Hotels in Jim Corbett"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover brightness-140"
                />

                <div className="absolute inset-0 bg-black/15" />

                <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 h-full flex items-center">

                    <div className="max-w-2xl text-white">

                        <p className="text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-5">
                            STAY & ACCOMMODATION
                        </p>

                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Deluxe Hotels in Jim Corbett
                        </h1>

                        <p className="mt-6 text-lg text-white/80 leading-8">
                            Comfortable and well-appointed stays for families,
                            groups, corporate teams and travellers exploring Jim Corbett.
                        </p>

                    </div>

                </div>

            </section>

            {/* ================= HOTELS ================= */}

            <section className="py-16 sm:py-20 bg-[#F7F5F0]">

                <div className="max-w-7xl mx-auto px-5 sm:px-6">

                    {/* Heading */}

                    <div className="max-w-2xl mb-10 sm:mb-12">

                        <p className="text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-4">
                            EXPLORE DELUXE STAYS
                        </p>

                        <h2 className="text-4xl md:text-5xl font-bold text-[#172033]">
                            Comfort, Quality & Experience
                        </h2>

                        <p className="mt-5 text-gray-600 leading-7">
                            Choose from carefully selected deluxe accommodation
                            options designed for comfortable stays, corporate groups
                            and leisure travellers.
                        </p>

                    </div>

                    {/* ================= CARDS ================= */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">

                        {deluxeHotels.map((hotel) => (

                            <div
                                key={hotel.id}
                                onClick={() => handleToggle(hotel.id)}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >

                                {/* Image */}

                                <div className="h-[220px] sm:h-[240px] overflow-hidden">

                                    <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                </div>

                                {/* Content */}

                                <div className="p-5">

                                    {/* Location + Chevron */}

                                    <div className="flex items-center justify-between gap-3">

                                        <div className="flex items-center gap-1.5 text-sm text-[#C88A3D] font-medium min-w-0">

                                            <MapPin
                                                size={15}
                                                className="shrink-0"
                                            />

                                            <span className="truncate">
                                                {hotel.location}
                                            </span>

                                        </div>

                                        <ChevronDown
                                            size={19}
                                            className={`shrink-0 text-[#C88A3D] transition-transform duration-300 ${
                                                expanded === hotel.id
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />

                                    </div>

                                    {/* Hotel Name */}

                                    <h3 className="mt-2 text-xl sm:text-2xl font-bold text-[#172033]">
                                        {hotel.name}
                                    </h3>

                                    {/* Rating + Reviews */}

                                    <div className="flex items-center gap-2 mt-2">

                                        <span className="text-[#C88A3D] font-semibold">
                                            ★ {hotel.rating}
                                        </span>

                                        <span className="text-sm text-gray-500">
                                            ({hotel.reviews})
                                        </span>

                                    </div>

                                    {/* Short Description */}

                                    {expanded !== hotel.id && (

                                        <p className="mt-2 text-sm text-gray-600 leading-6 line-clamp-1">
                                            {hotel.description}
                                        </p>

                                    )}

                                    {/* ================= EXPANDED DETAILS ================= */}

                                    {expanded === hotel.id && (

                                        <div className="mt-3">

                                            {/* Full Description */}

                                            <p className="text-sm text-gray-600 leading-6">
                                                {hotel.description}
                                            </p>

                                            {/* Guests + Cancellation */}

                                            <div className="mt-4 pt-4 border-t border-gray-100">

                                                <div className="grid grid-cols-2 gap-4">

                                                    <div>

                                                        <p className="text-xs text-gray-500">
                                                            Guests
                                                        </p>

                                                        <p className="text-sm font-semibold text-[#172033] mt-1">
                                                            {hotel.guests}
                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-xs text-gray-500">
                                                            Cancellation
                                                        </p>

                                                        <p className="text-sm font-semibold text-green-600 mt-1">
                                                            {hotel.cancellation}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    )}

                                    {/* ================= PRICE ================= */}

                                    <div className="mt-4 pt-4 border-t border-gray-100">

                                        <p className="text-xs text-gray-500">
                                            Starting from
                                        </p>

                                        <p className="text-xl sm:text-2xl font-bold text-[#172033]">

                                            {hotel.price}

                                            <span className="text-sm font-normal text-gray-500">
                                                {" "} / night
                                            </span>

                                        </p>

                                        <p className="text-xs text-green-500 mt-1">
                                            + taxes
                                        </p>

                                    </div>

                                    {/* ================= ENQUIRE ================= */}

                                    <Link
                                        href={`/contact?hotel=${encodeURIComponent(
                                            hotel.name
                                        )}&hotelImage=${encodeURIComponent(
                                            hotel.image
                                        )}&location=${encodeURIComponent(
                                            hotel.location
                                        )}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-2 mt-4 text-sm sm:text-base text-[#172033] font-semibold hover:text-[#C88A3D] transition"
                                    >
                                        Enquire Now

                                        <ArrowRight size={17} />

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