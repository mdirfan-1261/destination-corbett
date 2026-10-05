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
        image: "/safari/dhikala1.jpg",
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
        <main className="bg-white">

            {/* ================= HERO ================= */}

            <section className="overflow-hidden bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">

                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">

                    <div className="relative h-[300px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[560px]">

                        <Image
                            src="/safari/safari-hero.jpg"
                            alt="Jeep Safari in Jim Corbett"
                            fill
                            priority
                            quality={75}
                            sizes="100vw"
                            className="object-cover"
                        />

                        <div className="absolute inset-0 bg-black/25" />

                        <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/50 to-transparent" />

                        <div className="relative z-10 flex h-full items-center px-5 sm:px-8 md:px-12 lg:px-16">

                            <div className="max-w-2xl">

                                <p className="mb-2 text-[9px] font-semibold tracking-[2px] text-[#C87532] sm:mb-3 sm:text-xs sm:tracking-[3px] md:text-sm">
                                    JEEP SAFARI
                                </p>

                                <h1 className="text-[27px] font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                    Explore Corbett{" "}
                                    <span className="text-[#C87532]">
                                        in a Jeep Safari
                                    </span>
                                </h1>

                                <p className="mt-2 max-w-xl text-[11px] leading-[1.55] text-white/85 sm:mt-4 sm:text-base sm:leading-7 md:mt-5 md:text-lg">
                                    Choose your zone and let us arrange a
                                    thrilling wildlife jeep safari through
                                    Jim Corbett National Park.
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">

                                    <Link
                                        href="#safaris"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#B96928] sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
                                    >
                                        Explore Safaris
                                        <ArrowRight size={15} />
                                    </Link>

                                    <Link
                                        href="/contact?type=safari"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
                                    >
                                        Make an Enquiry
                                        <ArrowRight size={15} />
                                    </Link>

                                </div>

                                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-white/75 sm:mt-6 sm:gap-x-6 sm:text-xs">

                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#C87532]">
                                            ✓
                                        </span>
                                        Multiple Zones
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#C87532]">
                                            ✓
                                        </span>
                                        Jeep Safari
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#C87532]">
                                            ✓
                                        </span>
                                        Easy Enquiry
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= SAFARI LISTING ================= */}

            <section
                id="safaris"
                className="bg-[#F7F5F0] py-7 sm:py-10 md:py-12"
            >

                <div className="mx-auto max-w-7xl px-3 sm:px-6">

                    {/* SECTION INTRO */}

                    <div className="mb-6 max-w-2xl sm:mb-8 md:mb-9">

                        <p className="mb-2 text-[9px] font-semibold tracking-[1.8px] text-[#C87532] sm:mb-3 sm:text-xs sm:tracking-[2.5px]">
                            CHOOSE YOUR ZONE
                        </p>

                        <h2 className="text-2xl font-bold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
                            Jeep Safari Options
                        </h2>

                        <p className="mt-2.5 max-w-xl text-[11px] leading-[1.55] text-gray-600 sm:mt-3 sm:text-sm sm:leading-6">
                            Select a safari zone that fits your time, group
                            size and budget.
                        </p>

                    </div>


                    {/* ================= SAFARI CARDS ================= */}

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">

                        {safaris.map((safari) => (

                            <div
                                key={safari.zone}
                                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg sm:rounded-2xl"
                            >

                                {/* IMAGE */}

                                <div className="relative h-[125px] overflow-hidden sm:h-[180px] md:h-[195px] lg:h-[190px]">

                                    <Image
                                        src={safari.image}
                                        alt={safari.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                                    {/* ZONE */}

                                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">

                                        <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 backdrop-blur-sm sm:gap-1.5 sm:px-3 sm:py-1.5">

                                            <Trees
                                                size={11}
                                                className="text-[#C87532] sm:h-3.5 sm:w-3.5"
                                            />

                                            <span className="text-[9px] font-semibold text-[#172033] sm:text-xs">
                                                {safari.zone}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* CONTENT */}

                                <div className="p-2.5 sm:p-4">

                                    <h3 className="text-sm font-bold leading-tight text-[#172033] sm:text-lg">
                                        {safari.name}
                                    </h3>


                                    {/* INFO */}

                                    <div className="mt-2 flex flex-col gap-1.5 text-[9px] text-gray-500 sm:mt-3 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-2 sm:text-xs">

                                        <span className="flex items-center gap-1">

                                            <Clock3
                                                size={11}
                                                className="shrink-0 text-[#C87532] sm:h-3.5 sm:w-3.5"
                                            />

                                            {safari.duration}

                                        </span>

                                        <span className="flex items-center gap-1">

                                            <Users
                                                size={11}
                                                className="shrink-0 text-[#C87532] sm:h-3.5 sm:w-3.5"
                                            />

                                            {safari.group}

                                        </span>

                                    </div>


                                    {/* LOCATION */}

                                    <div className="mt-2 flex items-center gap-1 text-[9px] text-gray-500 sm:mt-3 sm:text-xs">

                                        <MapPin
                                            size={11}
                                            className="shrink-0 text-[#C87532] sm:h-3.5 sm:w-3.5"
                                        />

                                        <span>
                                            Jim Corbett National Park
                                        </span>

                                    </div>


                                   

{/* PRICE + ACTIONS */}

<div className="mt-2.5 border-t border-gray-100 pt-2.5 sm:mt-4 sm:pt-3">

    <p className="text-[9px] text-gray-500 sm:text-[11px]">
        Starting from
    </p>

    {/* PRICE */}

    <p className="mt-0.5 text-base font-bold leading-tight text-[#172033] sm:text-xl">
        {safari.price}

        <span className="text-[8px] font-normal text-gray-500 sm:text-xs">
            {" "} / jeep
        </span>
    </p>

    {/* ACTIONS */}

    <div className="mt-2.5 flex flex-row gap-1.5 sm:mt-4 sm:flex-row sm:gap-2">

        {/* ENQUIRE */}

        <Link
            href={`/contact?safari=${encodeURIComponent(
                safari.name
            )}&image=${encodeURIComponent(
                safari.image
            )}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-[#172033] px-1.5 text-[9px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white sm:h-10 sm:gap-1.5 sm:px-3 sm:text-xs"
        >
            Enquire
            <ArrowRight size={11} />
        </Link>

        {/* BOOK */}

       <Link
    href={`/booking?type=safari&safari=${encodeURIComponent(
        safari.name
    )}&zone=${encodeURIComponent(
        safari.zone
    )}&image=${encodeURIComponent(
        safari.image
    )}`}
    onClick={(e) => e.stopPropagation()}
    className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-1.5 text-[9px] font-semibold text-white transition hover:bg-[#B96928] sm:h-10 sm:gap-1.5 sm:px-3 sm:text-xs"
>
    Book
    <ArrowRight size={11} />
</Link>

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