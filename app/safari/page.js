"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, MapPin, ChevronDown } from "lucide-react";
import safariOptions from "@/data/safari";


export default function SafariPage() {
    const [expanded, setExpanded] = useState(null);

    const handleToggle = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <main className="bg-white">

            {/* ================= HERO ================= */}

            <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">

                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl sm:rounded-[24px] md:rounded-[28px] bg-[#172033] text-white">

                    <div className="relative h-[300px] sm:h-[420px] md:h-[470px] lg:h-[560px] overflow-hidden">

                        <Image
                            src="/safari/safari-hero.jpg"
                            alt="Safari in Jim Corbett"
                            fill
                            priority
                            quality={75}
                            sizes="100vw"
                            className="object-cover"
                        />

                        {/* DARK OVERLAY */}
                        <div className="absolute inset-0 bg-black/25" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/50 to-transparent" />

                        {/* HERO CONTENT */}

                        <div className="relative z-10 flex h-full items-center px-5 sm:px-8 md:px-12 lg:px-16">

                            <div className="max-w-2xl">

                                <p className="mb-2 text-[9px] font-semibold tracking-[2px] text-[#C87532] sm:mb-3 sm:text-xs sm:tracking-[3px] md:text-sm">
                                    WILDLIFE & ADVENTURE
                                </p>

                                <h1 className="text-[27px] font-bold leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl">
                                    Safari in{" "}
                                    <span className="text-[#C87532]">
                                        Jim Corbett
                                    </span>
                                </h1>

                                <p className="mt-2 max-w-xl text-[11px] leading-[1.55] text-white/85 sm:mt-4 sm:text-base sm:leading-7 md:mt-5 md:text-lg">
                                    Discover the wild side of Jim Corbett with
                                    unforgettable safari experiences through its
                                    forests, grasslands and wildlife zones.
                                </p>

                                <Link
                                    href="#safari-options"
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#B96928] sm:mt-6 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
                                >
                                    Explore Safaris
                                    <ArrowRight size={15} />
                                </Link>

                                {/* MOBILE HIGHLIGHTS */}

                                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-white/75 sm:hidden">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />
                                        Jeep Safari
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />
                                        Canter Safari
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#C87532]" />
                                        Wildlife
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= INTRO ================= */}

            <section className="bg-white py-9 sm:py-12 md:py-14">

                <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">

                    <div className="max-w-2xl">

                        <p className="mb-2 text-[10px] font-semibold tracking-[2.5px] text-[#C87532] sm:mb-3 sm:text-xs sm:tracking-[3px]">
                            EXPERIENCE THE WILD
                        </p>

                        <h2 className="text-[25px] font-bold leading-[1.15] text-[#172033] sm:text-3xl md:text-4xl">
                            Your Journey Into the Jungle
                        </h2>

                        <p className="mt-2 text-[13px] leading-5 text-gray-600 sm:mt-3 sm:text-sm sm:leading-6 md:text-base">
                            Discover Jim Corbett through unforgettable safari
                            experiences, from thrilling jeep rides to scenic
                            canter journeys across the wild.
                        </p>

                    </div>

                </div>

            </section>

            {/* ================= SAFARI OPTIONS ================= */}

            <section
                id="safari-options"
                className="bg-[#F7F5F0] py-10 sm:py-14 md:py-18"
            >

                <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">

                    <div className="mb-6 max-w-2xl sm:mb-8 md:mb-10">

                        <p className="mb-2 text-[10px] font-semibold tracking-[2.5px] text-[#C87532] sm:mb-3 sm:text-xs sm:tracking-[3px]">
                            EXPLORE SAFARI EXPERIENCES
                        </p>

                        <h2 className="text-[25px] font-bold leading-[1.15] text-[#172033] sm:text-3xl md:text-4xl">
                            Choose Your Safari
                        </h2>

                        <p className="mt-2 text-[13px] leading-5.5 text-gray-600 sm:mt-3 sm:text-base sm:leading-6">
                            Select the safari experience that suits your group,
                            schedule and adventure preferences.
                        </p>

                    </div>

                    {/* ================= CARDS ================= */}

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6">

                        {safariOptions.map((safari) => (

                            <div
                                key={safari.id}
                                onClick={() => handleToggle(safari.id)}
                                className={`group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl sm:rounded-2xl ${
                                    expanded === safari.id
                                        ? "shadow-xl"
                                        : ""
                                }`}
                            >

                                {/* ================= IMAGE ================= */}

                                <div className="h-[120px] overflow-hidden sm:h-[155px] md:h-[210px] lg:h-[230px]">

                                    <Image
                                        src={safari.image}
                                        alt={safari.name}
                                        width={600}
                                        height={400}
                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                                        className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${
                                            safari.id === 3
                                                ? "bg-gray-100 object-contain"
                                                : "object-cover"
                                        }`}
                                    />

                                </div>

                                {/* ================= CARD CONTENT ================= */}

                                <div className="p-3 sm:p-4 md:p-5">

                                    {/* NAME + ICON */}

                                    <div className="flex items-start justify-between gap-2 sm:gap-3">

                                        <div className="min-w-0 flex-1">

                                            {/* LOCATION */}

                                            <div className="flex items-center gap-1 text-[9px] font-medium text-[#C87532] sm:text-xs md:text-sm">

                                                <MapPin
                                                    size={12}
                                                    className="shrink-0 sm:h-[14px] sm:w-[14px]"
                                                />

                                                <span className="truncate">
                                                    {safari.location}
                                                </span>

                                            </div>

                                            {/* NAME */}

                                            <h3 className="mt-1 text-[15px] font-bold leading-tight text-[#172033] sm:mt-1.5 sm:text-lg md:text-xl">
                                                {safari.name}
                                            </h3>

                                        </div>

                                        {/* CHEVRON */}

                                        <div
                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7F5F0] text-[#172033] transition-transform duration-300 sm:h-8 sm:w-8 ${
                                                expanded === safari.id
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        >
                                            <ChevronDown size={15} />
                                        </div>

                                    </div>

                                    {/* ================= SHORT DESCRIPTION ================= */}

                                    {expanded !== safari.id && (

                                        <p className="mt-2 line-clamp-1 text-[10px] leading-4 text-gray-600 sm:text-sm sm:leading-5">
                                            {safari.description}
                                        </p>

                                    )}

                                    {/* ================= CLOSED CARD PRICE ================= */}

                                    {expanded !== safari.id && (

                                        <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">

                                            {/* PRICE */}

                                            <div>

                                                <p className="text-[9px] text-gray-500 sm:text-xs">
                                                    Starting from
                                                </p>

                                                <p className="text-[17px] font-bold text-[#172033] sm:text-xl md:text-2xl">
                                                    {safari.price}
                                                </p>

                                            </div>

                                            {/* ENQUIRE */}

                                            <Link
  href={`/booking?type=safari&safari_id=${encodeURIComponent(
    safari.id
  )}&safari=${encodeURIComponent(safari.name)}&image=${encodeURIComponent(
    safari.image
  )}`}
  onClick={(e) => e.stopPropagation()}
  className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#C87532] px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#B96928] sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs md:text-sm"
>
  Book Safari
  <ArrowRight size={13} />
</Link>

                                        </div>

                                    )}

                                    {/* ================= EXPANDED CONTENT ================= */}

                                    <div
                                        className={`grid transition-all duration-500 ease-in-out ${
                                            expanded === safari.id
                                                ? "mt-4 grid-rows-[1fr] opacity-100 sm:mt-5"
                                                : "grid-rows-[0fr] opacity-0"
                                        }`}
                                    >

                                        <div className="overflow-hidden">

                                            {/* FULL DESCRIPTION */}

                                            <p className="text-[11px] leading-5 text-gray-600 sm:text-sm sm:leading-6">
                                                {safari.description}
                                            </p>

                                            {/* DETAILS */}

                                            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 sm:mt-5 sm:space-y-3 sm:pt-5">

                                                {/* DURATION */}

                                                <div className="flex justify-between gap-3 text-[11px] sm:text-sm">

                                                    <span className="text-gray-500">
                                                        Duration
                                                    </span>

                                                    <span className="text-right font-medium text-[#172033]">
                                                        {safari.duration}
                                                    </span>

                                                </div>

                                                {/* CAPACITY */}

                                                <div className="flex justify-between gap-3 text-[11px] sm:text-sm">

                                                    <span className="text-gray-500">
                                                        Capacity
                                                    </span>

                                                    <span className="text-right font-medium text-[#172033]">
                                                        {safari.guests}
                                                    </span>

                                                </div>

                                            </div>

                                            {/* PRICE + ENQUIRE */}

                                            <div className="mt-4 flex items-end justify-between gap-2 sm:mt-5 sm:gap-4">

                                                {/* PRICE */}

                                                <div>

                                                    <p className="text-[9px] text-gray-500 sm:text-xs">
                                                        Starting from
                                                    </p>

                                                    <p className="text-[17px] font-bold text-[#172033] sm:text-xl md:text-2xl">
                                                        {safari.price}
                                                    </p>

                                                    <p className="mt-1 text-[9px] font-medium text-green-600 sm:text-xs">
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
                                                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#C87532] px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#B96928] sm:gap-2 sm:px-4 sm:py-2.5 sm:text-xs md:text-sm"
                                                >
                                                    Enquire
                                                    <ArrowRight size={13} />
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

            <section className="bg-white py-9 sm:py-12 md:py-16">

                <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">

                    <div className="relative overflow-hidden rounded-2xl bg-[#172033] px-5 py-8 text-center text-white sm:px-8 sm:py-10 md:px-12 md:py-12">

                        <p className="text-[10px] font-semibold tracking-[2.5px] text-[#C87532] sm:text-xs md:tracking-[3px]">
                            PLAN YOUR ADVENTURE
                        </p>

                        <h2 className="mt-2 text-[25px] font-bold leading-[1.15] sm:mt-3 sm:text-3xl md:text-4xl">
                            Ready to Explore Corbett?
                        </h2>

                        <p className="mx-auto mt-2.5 max-w-2xl text-[13px] leading-5.5 text-white/70 sm:mt-3 sm:text-base sm:leading-6">
                            Tell us your travel plans and let us help you create
                            an unforgettable Corbett safari experience.
                        </p>

                        <Link
                            href="/contact?safari=Safari%20Experience"
                            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#C87532] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#B96928] sm:mt-5 sm:px-6 sm:py-3 sm:text-sm"
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