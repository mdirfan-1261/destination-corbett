"use client";

import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Trees,
    ArrowRight,
    Clock3,
} from "lucide-react";

const zones = [
    {
        id: 1,
        name: "Dhikala Zone",
        slug: "dhikala",
        location: "Ramnagar, Jim Corbett",
        image: "/safari/zones/dhikala-zone1.jpg",
        description:
            "One of Corbett's popular safari zones, known for its forest landscapes, wildlife experience and natural surroundings.",
        safari: "Jeep Safari",
        duration: "3–4 hrs",
    },
    {
        id: 2,
        name: "Bijrani Zone",
        slug: "bijrani",
        location: "Ramnagar, Jim Corbett",
        image: "/safari/zones/bijrani-zone.jpg",
        description:
            "A scenic forest zone offering a memorable wildlife experience with dense forests and open grassland areas.",
        safari: "Jeep Safari",
        duration: "3–4 hrs",
    },
    {
        id: 3,
        name: "Jhirna Zone",
        slug: "jhirna",
        location: "Jim Corbett National Park",
        image: "/safari/zones/jhirna-zone.jpg",
        description:
            "A beautiful safari zone with diverse landscapes and opportunities to experience Corbett's natural wilderness.",
        safari: "Jeep Safari",
        duration: "3–4 hrs",
    },
    {
        id: 4,
        name: "Dhela Zone",
        slug: "dhela",
        location: "Ramnagar, Jim Corbett",
        image: "/safari/zones/dhela-zone.jpg",
        description:
            "Known for its peaceful forest environment, Dhela offers an exciting safari experience surrounded by nature.",
        safari: "Jeep Safari",
        duration: "3–4 hrs",
    },
    {
        id: 5,
        name: "Sitabani Zone",
        slug: "sitabani",
        location: "Sitabani, Corbett",
        image: "/safari/zones/sitabani-zone.jpg",
        description:
            "A serene forest area offering a relaxed wildlife experience away from the busier tourist zones.",
        safari: "Jeep Safari",
        duration: "3–4 hrs",
    },
];

export default function SafariZonesPage() {
    return (
        <main className="bg-white">

            {/* HERO */}
            <section className="bg-[#F7F5F0] px-1.5 py-1.5 sm:px-4 sm:py-4 md:px-6 md:py-5">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#172033] text-white sm:rounded-[24px] md:rounded-[28px]">

                    <div className="relative h-[300px] overflow-hidden sm:h-[420px] md:h-[470px] lg:h-[560px]">

                        <Image
                            src="/safari/zones/zones-hero.jpg"
                            alt="Jim Corbett Safari Zones"
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

                                <p className="mb-2 text-[9px] font-semibold tracking-[0.18em] text-[#C87532] sm:mb-3 sm:text-xs">
                                    JIM CORBETT SAFARI
                                </p>

                                <h1 className="text-[27px] font-bold leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl">
                                    Explore Corbett Safari Zones
                                </h1>

                                <p className="mt-3 max-w-xl text-[11px] leading-[1.55] text-white/85 sm:mt-5 sm:text-sm sm:leading-6 md:text-base">
                                    Discover the different safari zones of Jim
                                    Corbett and explore their landscapes,
                                    surroundings and wildlife experience.
                                </p>

                                <div className="mt-5 flex flex-row gap-2 sm:mt-7 sm:gap-3">

                                    <Link
                                        href="#zones"
                                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-3 text-[10px] font-semibold text-white transition hover:bg-[#B96928] sm:h-11 sm:px-5 sm:text-xs"
                                    >
                                        Explore Zones
                                        <ArrowRight size={13} />
                                    </Link>

                                    <Link
                                        href="/contact?type=safari"
                                        className="inline-flex h-9 items-center justify-center rounded-lg border border-white/60 bg-white/10 px-3 text-[10px] font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#172033] sm:h-11 sm:px-5 sm:text-xs"
                                    >
                                        Make an Enquiry
                                    </Link>

                                </div>

                                <div className="mt-5 grid max-w-lg grid-cols-3 gap-2 sm:mt-8 sm:gap-4">

                                    <div className="rounded-lg border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-3">
                                        <p className="text-[9px] font-semibold sm:text-xs">
                                            Multiple
                                        </p>
                                        <p className="mt-0.5 text-[8px] text-white/70 sm:text-[10px]">
                                            Safari Zones
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-3">
                                        <p className="text-[9px] font-semibold sm:text-xs">
                                            Wildlife
                                        </p>
                                        <p className="mt-0.5 text-[8px] text-white/70 sm:text-[10px]">
                                            Experience
                                        </p>
                                    </div>

                                    <div className="rounded-lg border border-white/15 bg-white/10 px-2 py-2 backdrop-blur-sm sm:rounded-xl sm:px-3 sm:py-3">
                                        <p className="text-[9px] font-semibold sm:text-xs">
                                            Easy
                                        </p>
                                        <p className="mt-0.5 text-[8px] text-white/70 sm:text-[10px]">
                                            Enquiry
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ZONES */}
            <section
                id="zones"
                className="bg-[#F7F5F0] py-7 sm:py-10 md:py-12"
            >
                <div className="mx-auto max-w-7xl px-3 sm:px-6">

                    {/* INTRO */}
                    <div className="mb-5 max-w-3xl sm:mb-8">

                        <p className="text-[9px] font-semibold tracking-[0.16em] text-[#C87532] sm:text-xs">
                            CHOOSE YOUR ZONE
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-[#172033] sm:mt-2 sm:text-3xl">
                            Safari Zones in Jim Corbett
                        </h2>

                        <p className="mt-2 text-[10px] leading-5 text-gray-600 sm:mt-3 sm:text-sm sm:leading-6">
                            Explore the major safari zones of Corbett and learn
                            more about each area before planning your safari.
                        </p>

                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-4">

                        {zones.map((zone) => (
                            <div
                                key={zone.id}
                                className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:rounded-2xl"
                            >

                                {/* IMAGE */}
                                <div className="relative h-[125px] overflow-hidden sm:h-[180px] md:h-[195px]">

                                    <Image
                                        src={zone.image}
                                        alt={zone.name}
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                    <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[8px] font-semibold text-[#172033] backdrop-blur-sm sm:px-2.5 sm:py-1.5 sm:text-[10px]">
                                            <Trees
                                                size={11}
                                                className="text-[#C87532]"
                                            />
                                            Safari Zone
                                        </span>
                                    </div>

                                </div>

                                {/* CONTENT */}
                                <div className="p-2.5 sm:p-4">

                                    <h3 className="text-sm font-bold leading-tight text-[#172033] sm:text-lg">
                                        {zone.name}
                                    </h3>

                                    <div className="mt-1 flex items-center gap-1 text-[8px] text-[#C87532] sm:text-[10px]">
                                        <MapPin size={11} />
                                        <span>{zone.location}</span>
                                    </div>

                                    <p className="mt-2 line-clamp-3 text-[9px] leading-[1.5] text-gray-600 sm:mt-3 sm:text-xs sm:leading-5">
                                        {zone.description}
                                    </p>

                                    <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2.5 sm:mt-4 sm:pt-3">

                                        <div className="flex items-center gap-1 text-[8px] text-gray-500 sm:text-[10px]">
                                            <Clock3
                                                size={11}
                                                className="text-[#C87532]"
                                            />
                                            {zone.duration}
                                        </div>

                                        <div className="text-[8px] font-medium text-gray-500 sm:text-[10px]">
                                            {zone.safari}
                                        </div>

                                    </div>

                                    {/* EXPLORE ZONE */}
                                    <div className="mt-2.5 sm:mt-4">

                                        <Link
                                            href={`/safari/zones/${zone.slug}`}
                                            className="inline-flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-[#172033] px-2 text-[9px] font-semibold text-[#172033] transition hover:bg-[#172033] hover:text-white sm:h-10 sm:gap-1.5 sm:px-3 sm:text-xs"
                                        >
                                            Explore Zone
                                            <ArrowRight size={11} />
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