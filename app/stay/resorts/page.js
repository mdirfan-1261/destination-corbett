"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
    ArrowRight,
    MapPin,
    ChevronDown,
    CalendarDays,
} from "lucide-react";

import resorts from "@/data/resorts";

export default function ResortsStaysPage() {
    const [expanded, setExpanded] = useState(null);

    const handleToggle = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <main className="bg-white">

            {/* ================= HERO ================= */}

            <section className="overflow-hidden bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">

                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">

                    <div className="relative h-[300px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[560px]">

                        <Image
                            src="/stay/resort-hero.webp"
                            alt="Resorts and Stays in Jim Corbett"
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
                                    JIM CORBETT STAYS
                                </p>

                                <h1 className="text-[27px] font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                    Resorts & Stays in{" "}
                                    <span className="text-[#C87532]">
                                        Jim Corbett
                                    </span>
                                </h1>

                                <p className="mt-2 max-w-xl text-[11px] leading-[1.55] text-white/85 sm:mt-4 sm:text-base sm:leading-7 md:mt-5 md:text-lg">
                                    Discover comfortable resorts and peaceful
                                    stays surrounded by the natural beauty of
                                    Jim Corbett.
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">

                                    <Link
                                        href="#resorts"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#B96928] sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
                                    >
                                        Explore Resorts
                                        <ArrowRight size={15} />
                                    </Link>

                                    <Link
                                        href="/contact?type=stay"
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
                                        Nature Stays
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#C87532]">
                                            ✓
                                        </span>
                                        Prime Locations
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


            {/* ================= RESORTS ================= */}

            <section
                id="resorts"
                className="bg-[#F7F5F0] py-7 sm:py-10 md:py-12"
            >

                <div className="mx-auto max-w-7xl px-3 sm:px-6">

                    {/* SECTION INTRO */}

                    <div className="mb-6 max-w-2xl sm:mb-8 md:mb-9">

                        <p className="mb-2 text-[9px] font-semibold tracking-[1.8px] text-[#C87532] sm:mb-3 sm:text-xs sm:tracking-[2.5px]">
                            EXPLORE RESORTS & STAYS
                        </p>

                        <h2 className="text-2xl font-bold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
                            Comfortable Stays in Nature
                        </h2>

                        <p className="mt-2.5 max-w-xl text-[11px] leading-[1.55] text-gray-600 sm:mt-3 sm:text-sm sm:leading-6">
                            Choose from comfortable resorts and peaceful
                            accommodation options for your Jim Corbett trip.
                        </p>

                    </div>


                    {/* ================= RESORT CARDS ================= */}

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">

                        {resorts.map((resort) => {

                            // Dynamic property detail URL
                            const propertyUrl =
                                `/stay/resorts/${resort.locationSlug}/${resort.slug}`;

                            const enquiryUrl =
                                `/contact?hotel=${encodeURIComponent(
                                    resort.name
                                )}` +
                                `&hotelImage=${encodeURIComponent(
                                    resort.image
                                )}` +
                                `&location=${encodeURIComponent(
                                    resort.location
                                )}`;

                            return (
                                <div
                                    key={resort.id}
                                    onClick={() =>
                                        handleToggle(resort.id)
                                    }
                                    className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg sm:rounded-2xl"
                                >

                                    {/* IMAGE */}

                                    <Link
                                        href={propertyUrl}
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                        className="block"
                                    >
                                        <div className="h-[125px] overflow-hidden sm:h-[180px] md:h-[195px] lg:h-[190px]">

                                            <Image
                                                src={resort.image}
                                                alt={resort.name}
                                                width={400}
                                                height={240}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />

                                        </div>
                                    </Link>


                                    {/* CONTENT */}

                                    <div className="p-2.5 sm:p-4">

                                        {/* LOCATION + CHEVRON */}

                                        <div className="flex items-center justify-between gap-1">

                                            <div className="flex min-w-0 items-center gap-1 text-[9px] font-medium text-[#C87532] sm:gap-1.5 sm:text-xs">

                                                <MapPin
                                                    size={12}
                                                    className="shrink-0 sm:h-3.5 sm:w-3.5"
                                                />

                                                <span className="truncate">
                                                    {resort.location}
                                                </span>

                                            </div>

                                            <ChevronDown
                                                size={14}
                                                className={`shrink-0 text-[#C87532] transition-transform duration-300 sm:h-4 sm:w-4 ${
                                                    expanded === resort.id
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />

                                        </div>


                                        {/* RESORT NAME */}

                                        <Link
                                            href={propertyUrl}
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                            className="block"
                                        >
                                            <h3 className="mt-1.5 text-sm font-bold leading-tight text-[#172033] transition-colors hover:text-[#C87532] sm:text-lg">
                                                {resort.name}
                                            </h3>
                                        </Link>


                                        {/* DESCRIPTION */}

                                        {expanded !== resort.id && (
                                            <p className="mt-1 line-clamp-1 text-[9px] leading-3.5 text-gray-600 sm:text-xs sm:leading-5">
                                                {resort.description}
                                            </p>
                                        )}


                                        {/* EXPANDED DESCRIPTION */}

                                        {expanded === resort.id && (
                                            <div className="mt-2">

                                                <p className="text-[9px] leading-3.5 text-gray-600 sm:text-xs sm:leading-5">
                                                    {resort.description}
                                                </p>

                                                <div className="mt-2.5 border-t border-gray-100 pt-2.5">

                                                    <p className="text-[9px] text-gray-500 sm:text-[11px]">
                                                        Stay Experience
                                                    </p>

                                                    <p className="mt-0.5 text-[9px] font-semibold text-[#172033] sm:text-xs">
                                                        Nature & Comfort
                                                    </p>

                                                </div>

                                            </div>
                                        )}


                                        {/* BUTTONS */}

                                        <div className="mt-2.5 flex flex-row gap-1.5 sm:mt-4 sm:flex-row sm:gap-2">

                                            <Link
                                                href={enquiryUrl}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-[#172033] px-1.5 text-[9px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white sm:h-10 sm:flex-1 sm:gap-1.5 sm:px-3 sm:text-xs"
                                            >
                                                Enquire
                                                <ArrowRight size={11} />
                                            </Link>

                                            <Link
                                                href={propertyUrl}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-1.5 text-[9px] font-semibold text-white transition hover:bg-[#B96928] sm:h-10 sm:flex-1 sm:gap-1.5 sm:px-3 sm:text-xs"
                                            >
                                                <CalendarDays size={11} />
                                                View Resort
                                            </Link>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>

        </main>
    );
}
