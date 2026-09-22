"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";

const safariOptions = [
    {
        id: 1,
        name: "Jeep Safari",
        location: "Jim Corbett National Park",
        image: "/safari/jeep-safari.jpg",
        description:
            "Explore the wilderness of Jim Corbett in an open gypsy with an experienced naturalist and driver.",
        price: "₹5,500",
        duration: "3–4 Hours",
        guests: "Up to 6 Guests",
    },
    {
        id: 2,
        name: "Canter Safari",
        location: "Jim Corbett National Park",
        image: "/safari/canter-safari.jpg",
        description:
            "Enjoy a shared safari experience through Corbett's forest zones with fellow wildlife enthusiasts.",
        price: "₹1,500",
        duration: "3–4 Hours",
        guests: "Up to 16 Guests",
    },
    {
        id: 3,
        name: "Elephant Safari",
        location: "Corbett Forest Area",
        image: "/safari/elephant-safari1.jpg",
        description:
            "Experience the forest from a unique perspective with a memorable elephant safari adventure.",
        price: "₹2,500",
        duration: "2–3 Hours",
        guests: "Limited Seats",
    },
];

export default function SafariPage() {
    const [expanded, setExpanded] = useState(null);

    const handleToggle = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <main className="bg-white">

           

{/* ================= HERO ================= */}

<section className="py-2 sm:py-4 md:py-6 bg-white">

    <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6">

        <div className="relative h-[280px] sm:h-[350px] md:h-[450px] lg:h-[480px] overflow-hidden rounded-xl sm:rounded-2xl">

            <Image
                src="/safari/safari-hero.jpg"
                alt="Safari in Jim Corbett"
                fill
                priority
                quality={75}
                sizes="100vw"
                className="object-cover brightness-110"
            />

            <div className="absolute inset-0 bg-black/25" />

            <div className="relative z-10 h-full flex items-center px-4 sm:px-8 md:px-12 lg:px-16">

                <div className="max-w-2xl text-white">

                    <p className="text-[9px] sm:text-xs md:text-sm font-semibold tracking-[1.5px] sm:tracking-[3px] text-[#C88A3D] mb-1.5 sm:mb-3">
                        WILDLIFE & ADVENTURE
                    </p>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        Safari in Jim Corbett
                    </h1>

                    <p className="mt-2 sm:mt-4 md:mt-5 text-xs sm:text-base md:text-lg text-white/85 leading-5 sm:leading-7 max-w-xl">
                        Discover the wild side of Jim Corbett with unforgettable
                        safari experiences through its forests, grasslands and
                        wildlife zones.
                    </p>

                    <Link
                        href="#safari-options"
                        className="inline-flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-6 bg-[#C88A3D] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#A96F2E] transition"
                    >
                        Explore Safaris
                        <ArrowRight size={15} />
                    </Link>

                </div>

            </div>

        </div>

    </div>

</section>

            {/* ================= INTRO ================= */}

            {/* ================= INTRO ================= */}

<section className="py-10 sm:py-12 md:py-14 bg-white">

    <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">

        <div className="max-w-2xl">

            <p className="text-[10px] sm:text-xs font-semibold tracking-[2px] sm:tracking-[3px] text-[#C88A3D] mb-2">
                EXPERIENCE THE WILD
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#172033]">
                Your Journey Into the Jungle
            </h2>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-600 leading-5 sm:leading-6">
                Discover Jim Corbett through unforgettable safari experiences,
                from thrilling jeep rides to scenic canter journeys across the wild.
            </p>

        </div>

    </div>

</section>

            {/* ================= SAFARI OPTIONS ================= */}

            <section
                id="safari-options"
                className="py-12 sm:py-14 md:py-18 bg-[#F7F5F0]"
            >

                <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">

                    <div className="max-w-2xl mb-7 sm:mb-8 md:mb-10">

                        <p className="text-[10px] sm:text-xs font-semibold tracking-[2px] sm:tracking-[3px] text-[#C88A3D] mb-2 sm:mb-3">
                            EXPLORE SAFARI EXPERIENCES
                        </p>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#172033]">
                            Choose Your Safari
                        </h2>

                        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 leading-6">
                            Select the safari experience that suits your group,
                            schedule and adventure preferences.
                        </p>

                    </div>

                    {/* ================= CARDS ================= */}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">

                        {safariOptions.map((safari) => (

                            <div
                                key={safari.id}
                                onClick={() => handleToggle(safari.id)}
                                className={`group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
                                    expanded === safari.id ? "shadow-xl" : ""
                                }`}
                            >

                                {/* ================= IMAGE ================= */}

                                <div className="h-[120px] sm:h-[155px] md:h-[210px] lg:h-[230px] overflow-hidden">

                                    <Image
                                        src={safari.image}
                                        alt={safari.name}
                                        width={600}
                                        height={400}
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                                        className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${
                                            safari.id === 3
                                                ? "object-contain bg-gray-100"
                                                : "object-cover"
                                        }`}
                                    />

                                </div>

                                {/* ================= CARD CONTENT ================= */}

                                <div className="p-3 sm:p-4 md:p-5">

                                    {/* NAME + ICON */}

                                    <div className="flex items-start justify-between gap-2 sm:gap-3">

                                        <div className="flex-1 min-w-0">

                                            {/* LOCATION */}

                                            <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm text-[#C88A3D] font-medium">

                                                <MapPin
                                                    size={13}
                                                    className="flex-shrink-0 sm:w-[14px] sm:h-[14px]"
                                                />

                                                <span className="truncate">
                                                    {safari.location}
                                                </span>

                                            </div>

                                            {/* NAME */}

                                            <h3 className="mt-1 sm:mt-1.5 text-base sm:text-lg md:text-xl font-bold text-[#172033] leading-tight">
                                                {safari.name}
                                            </h3>

                                        </div>

                                        {/* CHEVRON */}

                                        <div
                                            className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#172033] transition-transform duration-300 ${
                                                expanded === safari.id
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        >
                                            <ChevronDown size={16} />
                                        </div>

                                    </div>

                                    {/* ================= SHORT DESCRIPTION ================= */}

                                    {expanded !== safari.id && (

                                        <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-5 line-clamp-1">
                                            {safari.description}
                                        </p>

                                    )}

                                    {/* ================= CLOSED CARD PRICE ================= */}

                                    {expanded !== safari.id && (

                                        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2">

                                            {/* PRICE */}

                                            <div>

                                                <p className="text-[10px] sm:text-xs text-gray-500">
                                                    Starting from
                                                </p>

                                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#172033]">
                                                    {safari.price}
                                                </p>

                                            </div>

                                            {/* ENQUIRE */}

                                            <Link
                                                href={`/contact?safari=${encodeURIComponent(
                                                    safari.name
                                                )}&image=${encodeURIComponent(
                                                    safari.image
                                                )}`}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="inline-flex items-center gap-1 sm:gap-2 bg-[#C88A3D] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold hover:bg-[#A96F2E] transition whitespace-nowrap"
                                            >
                                                Enquire
                                                <ArrowRight size={14} />
                                            </Link>

                                        </div>

                                    )}

                                    {/* ================= EXPANDED CONTENT ================= */}

                                    <div
                                        className={`grid transition-all duration-500 ease-in-out ${
                                            expanded === safari.id
                                                ? "grid-rows-[1fr] opacity-100 mt-4 sm:mt-5"
                                                : "grid-rows-[0fr] opacity-0"
                                        }`}
                                    >

                                        <div className="overflow-hidden">

                                            {/* FULL DESCRIPTION */}

                                            <p className="text-xs sm:text-sm text-gray-600 leading-5 sm:leading-6">
                                                {safari.description}
                                            </p>

                                            {/* DETAILS */}

                                            <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100 space-y-2 sm:space-y-3">

                                                {/* DURATION */}

                                                <div className="flex justify-between text-xs sm:text-sm gap-3">

                                                    <span className="text-gray-500">
                                                        Duration
                                                    </span>

                                                    <span className="font-medium text-[#172033] text-right">
                                                        {safari.duration}
                                                    </span>

                                                </div>

                                                {/* CAPACITY */}

                                                <div className="flex justify-between text-xs sm:text-sm gap-3">

                                                    <span className="text-gray-500">
                                                        Capacity
                                                    </span>

                                                    <span className="font-medium text-[#172033] text-right">
                                                        {safari.guests}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* PRICE + ENQUIRE */}

                                            <div className="mt-4 sm:mt-5 flex items-end justify-between gap-2 sm:gap-4">

                                                {/* PRICE */}

                                                <div>

                                                    <p className="text-[10px] sm:text-xs text-gray-500">
                                                        Starting from
                                                    </p>

                                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#172033]">
                                                        {safari.price}
                                                    </p>

                                                    <p className="text-[10px] sm:text-xs text-green-600 font-medium mt-1">
                                                        + taxes
                                                    </p>

                                                </div>

                                                {/* ENQUIRE */}

                                                <Link
                                                    href={`/contact?safari=${encodeURIComponent(
                                                        safari.name
                                                    )}&image=${encodeURIComponent(
                                                        safari.image
                                                    )}`}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className="inline-flex items-center gap-1 sm:gap-2 bg-[#C88A3D] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs md:text-sm font-semibold hover:bg-[#A96F2E] transition whitespace-nowrap"
                                                >
                                                    Enquire
                                                    <ArrowRight size={14} />
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

            {/* ================= BOTTOM CTA ================= */}

            <section className="py-10 sm:py-12 md:py-16 bg-white">

                <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">

                    <div className="relative overflow-hidden rounded-2xl bg-[#172033] px-5 py-9 sm:px-8 sm:py-10 md:px-12 md:py-12 text-center text-white">

                        <p className="text-[10px] sm:text-xs font-semibold tracking-[2px] md:tracking-[3px] text-[#C88A3D]">
                            PLAN YOUR ADVENTURE
                        </p>

                        <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">
                            Ready to Explore Corbett?
                        </h2>

                        <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-white/70 leading-6">
                            Tell us your travel plans and let us help you create
                            an unforgettable Corbett safari experience.
                        </p>

                        <Link
                            href="/contact?safari=Safari%20Experience"
                            className="inline-flex items-center gap-2 mt-5 bg-[#C88A3D] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-semibold hover:bg-[#A96F2E] transition"
                        >
                            Plan Your Safari
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}