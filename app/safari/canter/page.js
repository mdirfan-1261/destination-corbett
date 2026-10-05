"use client";

import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Clock3,
    Users,
    ArrowRight,
    Trees,
    CalendarDays,
} from "lucide-react";

const canterSafari = {
    name: "Canter Safari",
    image: "/safari/canter.jpg",
    duration: "3–4 hrs",
    price: "₹1,500",
    group: "Up to 16",
    location: "Jim Corbett National Park",
};

export default function CanterSafariPage() {
    return (
        <main className="bg-white">

            {/* HERO */}
            <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">
                    <div className="relative h-[300px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[560px]">

                        <Image
                            src={canterSafari.image}
                            alt="Canter Safari in Jim Corbett"
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
                                    CANTER SAFARI
                                </p>

                                <h1 className="text-[27px] font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                    Explore Corbett{" "}
                                    <span className="text-[#C87532]">
                                        on a Canter Safari
                                    </span>
                                </h1>

                                <p className="mt-2 max-w-xl text-[11px] leading-[1.55] text-white/85 sm:mt-4 sm:text-base sm:leading-7 md:mt-5 md:text-lg">
                                    Experience the wilderness of Jim Corbett
                                    with a comfortable canter safari designed
                                    for larger groups and families.
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">

                                    <Link
                                        href="#canter"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#B96928] sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
                                    >
                                        View Canter Safari
                                        <ArrowRight size={15} />
                                    </Link>

                                    <Link
                                        href="/contact?type=canter-safari"
                                        className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
                                    >
                                        Make an Enquiry
                                        <ArrowRight size={15} />
                                    </Link>

                                </div>

                                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-white/75 sm:mt-6 sm:gap-x-6 sm:text-xs">

                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#C87532]">✓</span>
                                        Up to 16 Guests
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#C87532]">✓</span>
                                        3–4 Hours
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[#C87532]">✓</span>
                                        Easy Booking
                                    </span>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SINGLE CANTER BOX */}
            <section
                id="canter"
                className="bg-[#F7F5F0] py-7 sm:py-10 md:py-12"
            >
                <div className="mx-auto max-w-7xl px-3 sm:px-6">

                    <div className="mb-6 sm:mb-8">
                        <p className="mb-2 text-[9px] font-semibold tracking-[1.8px] text-[#C87532] sm:mb-3 sm:text-xs sm:tracking-[2.5px]">
                            GROUP WILDLIFE EXPERIENCE
                        </p>

                        <h2 className="text-2xl font-bold leading-tight text-[#172033] sm:text-3xl md:text-4xl">
                            Canter Safari in Jim Corbett
                        </h2>

                        <p className="mt-2.5 max-w-xl text-[11px] leading-[1.55] text-gray-600 sm:mt-3 sm:text-sm sm:leading-6">
                            A comfortable safari option for families, groups
                            and travellers who want to explore Corbett
                            together.
                        </p>
                    </div>

                    {/* ONE BOX */}
                    <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2 md:rounded-[24px]">

                        {/* IMAGE */}
                        <div className="relative h-[230px] overflow-hidden sm:h-[320px] md:h-[380px]">

                            <Image
                                src={canterSafari.image}
                                alt="Canter Safari in Jim Corbett"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                            <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5">
                                <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">

                                    <Trees
                                        size={14}
                                        className="text-[#C87532]"
                                    />

                                    <span className="text-xs font-semibold text-[#172033]">
                                        Canter Safari
                                    </span>

                                </div>
                            </div>

                        </div>

                        {/* DETAILS */}
                        <div className="flex flex-col justify-center p-4 sm:p-7 md:p-9">

                            <p className="text-[9px] font-semibold tracking-[1.8px] text-[#C87532] sm:text-xs sm:tracking-[2px]">
                                SAFARI EXPERIENCE
                            </p>

                            <h3 className="mt-1.5 text-xl font-bold leading-tight text-[#172033] sm:text-2xl md:text-3xl">
                                Canter Safari
                            </h3>

                            <p className="mt-2.5 text-[11px] leading-[1.6] text-gray-600 sm:mt-3 sm:text-sm sm:leading-6">
                                Enjoy a shared wildlife safari experience
                                through Jim Corbett National Park. The canter
                                offers a practical option for larger groups
                                travelling together.
                            </p>

                            {/* DETAILS */}
                            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">

                                <div className="rounded-lg bg-[#F7F5F0] p-2.5 sm:rounded-xl sm:p-3">

                                    <Clock3
                                        size={16}
                                        className="text-[#C87532]"
                                    />

                                    <p className="mt-1 text-[9px] text-gray-500 sm:text-xs">
                                        Duration
                                    </p>

                                    <p className="text-[11px] font-semibold text-[#172033] sm:text-sm">
                                        3–4 hrs
                                    </p>

                                </div>

                                <div className="rounded-lg bg-[#F7F5F0] p-2.5 sm:rounded-xl sm:p-3">

                                    <Users
                                        size={16}
                                        className="text-[#C87532]"
                                    />

                                    <p className="mt-1 text-[9px] text-gray-500 sm:text-xs">
                                        Group Size
                                    </p>

                                    <p className="text-[11px] font-semibold text-[#172033] sm:text-sm">
                                        Up to 16
                                    </p>

                                </div>

                            </div>

                            {/* LOCATION */}
                            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-500 sm:mt-4 sm:text-xs">

                                <MapPin
                                    size={14}
                                    className="shrink-0 text-[#C87532]"
                                />

                                <span>
                                    Jim Corbett National Park
                                </span>

                            </div>

                            {/* PRICE */}
                            <div className="mt-4 border-t border-gray-100 pt-3 sm:mt-5 sm:pt-4">

                                <p className="text-[9px] text-gray-500 sm:text-[11px]">
                                    Starting from
                                </p>

                                <p className="mt-0.5 text-xl font-bold leading-tight text-[#172033] sm:text-2xl">
                                    ₹1,500
                                    <span className="text-[9px] font-normal text-gray-500 sm:text-xs">
                                        {" "} / person
                                    </span>
                                </p>

                            </div>

                            {/* BUTTONS */}
                            <div className="mt-3 flex flex-row gap-1.5 sm:mt-4 sm:gap-2">

                                <Link
                                    href={`/contact?safari=${encodeURIComponent(
                                        canterSafari.name
                                    )}&image=${encodeURIComponent(
                                        canterSafari.image
                                    )}`}
                                    className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[#172033] px-2 text-[10px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
                                >
                                    Enquire
                                    <ArrowRight size={12} />
                                </Link>

                                <Link
    href={`/booking?type=safari&safari_id=${encodeURIComponent(
        canterSafari.id
    )}&safari=${encodeURIComponent(
        canterSafari.name
    )}&image=${encodeURIComponent(
        canterSafari.image
    )}`}
    className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-[#C87532] px-2 text-[10px] font-semibold text-white transition hover:bg-[#B96928] sm:h-10 sm:flex-none sm:px-4 sm:text-xs"
>
    <CalendarDays size={12} />
    Book
</Link>

                            </div>

                        </div>

                    </div>
                </div>
            </section>

        </main>
    );
}