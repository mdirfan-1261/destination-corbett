"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Mail,
    MapPin,
    Phone,
    User,
    Users,
} from "lucide-react";

export default function BookingCheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const propertyId = searchParams.get("property_id") || "";
    const roomTypeId = searchParams.get("room_type_id") || "";
    const checkIn = searchParams.get("check_in") || "";
    const checkOut = searchParams.get("check_out") || "";
    const adults = Number(searchParams.get("adults")) || 2;
    const children = Number(searchParams.get("children")) || 0;

    /*
     * TEMPORARY PROPERTY DATA
     *
     * Abhi frontend testing ke liye.
     * Baad mein isi jagah backend/API se property data aayega.
     */
    const properties = [
        {
            id: "7",
            name: "The Tiger Groove",
            location: "Ramnagar, Jim Corbett",
            rooms: [
                {
                    id: "18",
                    name: "Palm Groove Deluxe",
                    price: 6500,
                    guests: 2,
                },
                {
                    id: "19",
                    name: "Palm Groove Super Deluxe",
                    price: 7500,
                    guests: 3,
                },
            ],
        },
    ];

    const property = useMemo(() => {
        return properties.find(
            (item) => String(item.id) === String(propertyId)
        );
    }, [propertyId]);

    const room = useMemo(() => {
        return property?.rooms?.find(
            (item) => String(item.id) === String(roomTypeId)
        );
    }, [property, roomTypeId]);

    const [guest, setGuest] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [specialRequest, setSpecialRequest] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 1;

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        const difference =
            (end.getTime() - start.getTime()) /
            (1000 * 60 * 60 * 24);

        return difference > 0 ? difference : 1;
    }, [checkIn, checkOut]);

    const roomTotal = room ? room.price * nights : 0;

    const taxes = Math.round(roomTotal * 0.12);

    const totalAmount = roomTotal + taxes;

    const formatDate = (date) => {
        if (!date) return "Not selected";

        const value = new Date(`${date}T00:00:00`);

        return value.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatPrice = (price) => {
        return `₹${Number(price || 0).toLocaleString("en-IN")}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setGuest((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!guest.name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!guest.email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!guest.phone.trim()) {
            setError("Please enter your phone number.");
            return;
        }

        /*
         * Abhi backend connect nahi kiya hai.
         *
         * Next step mein yahin:
         *
         * POST /api/bookings
         *
         * karenge.
         */

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            const confirmationUrl =
                `/booking/success` +
                `?type=stay` +
                `&property_id=${encodeURIComponent(propertyId)}` +
                `&room_type_id=${encodeURIComponent(roomTypeId)}` +
                `&check_in=${encodeURIComponent(checkIn)}` +
                `&check_out=${encodeURIComponent(checkOut)}`;

            router.push(confirmationUrl);
        }, 700);
    };

    /*
     * Agar property ya room nahi mila
     */

    if (!property || !room) {
        return (
            <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 sm:px-6 md:py-16">
                <div className="mx-auto max-w-xl rounded-2xl bg-white p-7 text-center shadow-lg sm:rounded-3xl sm:p-10">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                        <CalendarDays
                            size={25}
                            className="text-red-500"
                        />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-[#172033]">
                        Booking Details Not Found
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        The selected property or room could not be found.
                        Please go back and select your room again.
                    </p>

                    <Link
                        href="/stay"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C87532] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#B96928]"
                    >
                        <ArrowLeft size={16} />
                        Back to Stays
                    </Link>

                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F7F5F0]">

            {/* HEADER */}

            <section className="border-b border-black/5 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 md:py-5">

                    <Link
                        href={`/stay/${encodeURIComponent(propertyId)}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#172033] transition hover:text-[#C87532] sm:text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to property
                    </Link>

                    <div className="mt-4">
                        <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#C87532] sm:text-xs">
                            Secure Booking
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-[#172033] sm:text-3xl md:text-4xl">
                            Complete Your Booking
                        </h1>
                    </div>

                </div>
            </section>

            {/* MAIN */}

            <section className="px-4 py-6 sm:px-6 sm:py-9 md:py-12">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_380px]">

                    {/* LEFT */}

                    <div className="space-y-5">

                        {/* PROPERTY */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

                            <div className="flex items-start gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C87532]/10">
                                    <MapPin
                                        size={20}
                                        className="text-[#C87532]"
                                    />
                                </div>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C87532]">
                                        Property
                                    </p>

                                    <h2 className="mt-1 text-lg font-bold text-[#172033] sm:text-xl">
                                        {property.name}
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                        {property.location}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* STAY DETAILS */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

                            <h2 className="text-lg font-bold text-[#172033] sm:text-xl">
                                Your Stay
                            </h2>

                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

                                <div className="rounded-xl bg-[#F7F5F0] p-3">
                                    <CalendarDays
                                        size={17}
                                        className="text-[#C87532]"
                                    />

                                    <p className="mt-2 text-[10px] text-gray-500">
                                        Check-in
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-[#172033]">
                                        {formatDate(checkIn)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#F7F5F0] p-3">
                                    <CalendarDays
                                        size={17}
                                        className="text-[#C87532]"
                                    />

                                    <p className="mt-2 text-[10px] text-gray-500">
                                        Check-out
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-[#172033]">
                                        {formatDate(checkOut)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#F7F5F0] p-3">
                                    <Users
                                        size={17}
                                        className="text-[#C87532]"
                                    />

                                    <p className="mt-2 text-[10px] text-gray-500">
                                        Guests
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-[#172033]">
                                        {adults} Adults
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#F7F5F0] p-3">
                                    <Users
                                        size={17}
                                        className="text-[#C87532]"
                                    />

                                    <p className="mt-2 text-[10px] text-gray-500">
                                        Children
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-[#172033]">
                                        {children}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* ROOM */}

                        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C87532]">
                                Selected Room
                            </p>

                            <div className="mt-2 flex items-center justify-between gap-4">

                                <div>
                                    <h2 className="text-lg font-bold text-[#172033]">
                                        {room.name}
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Up to {room.guests} guests
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold text-[#172033]">
                                        {formatPrice(room.price)}
                                    </p>

                                    <p className="text-[10px] text-gray-500">
                                        per night
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* GUEST FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"
                        >

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C87532]/10">
                                    <User
                                        size={19}
                                        className="text-[#C87532]"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-[#172033] sm:text-xl">
                                        Guest Details
                                    </h2>

                                    <p className="text-xs text-gray-500">
                                        Enter the details of the primary guest.
                                    </p>
                                </div>

                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">

                                {/* NAME */}

                                <div className="sm:col-span-2">

                                    <label className="mb-1.5 block text-xs font-semibold text-[#172033]">
                                        Full Name
                                    </label>

                                    <div className="relative">
                                        <User
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="text"
                                            name="name"
                                            value={guest.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                                        />
                                    </div>

                                </div>

                                {/* EMAIL */}

                                <div>

                                    <label className="mb-1.5 block text-xs font-semibold text-[#172033]">
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={guest.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                                        />
                                    </div>

                                </div>

                                {/* PHONE */}

                                <div>

                                    <label className="mb-1.5 block text-xs font-semibold text-[#172033]">
                                        Phone Number
                                    </label>

                                    <div className="relative">
                                        <Phone
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={guest.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                                        />
                                    </div>

                                </div>

                                {/* REQUEST */}

                                <div className="sm:col-span-2">

                                    <label className="mb-1.5 block text-xs font-semibold text-[#172033]">
                                        Special Request
                                        <span className="ml-1 font-normal text-gray-400">
                                            (Optional)
                                        </span>
                                    </label>

                                    <textarea
                                        value={specialRequest}
                                        onChange={(e) =>
                                            setSpecialRequest(
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        placeholder="Any special request for your stay?"
                                        className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none transition focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10"
                                    />

                                </div>

                            </div>

                            {/* ERROR */}

                            {error && (
                                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* MOBILE BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C87532] text-sm font-semibold text-white transition hover:bg-[#B96928] disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
                            >
                                {loading ? (
                                    "Processing..."
                                ) : (
                                    <>
                                        Confirm Booking
                                        <CheckCircle2 size={17} />
                                    </>
                                )}
                            </button>

                        </form>

                    </div>

                    {/* RIGHT SUMMARY */}

                    <aside className="lg:sticky lg:top-6 lg:h-fit">

                        <div className="rounded-2xl bg-[#172033] p-5 text-white shadow-xl sm:p-6">

                            <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#C87532]">
                                Booking Summary
                            </p>

                            <h2 className="mt-2 text-xl font-bold">
                                {property.name}
                            </h2>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                                <MapPin size={13} />
                                {property.location}
                            </p>

                            {/* ROOM */}

                            <div className="mt-6 border-t border-white/10 pt-5">

                                <p className="text-[10px] uppercase tracking-wider text-white/50">
                                    Room
                                </p>

                                <p className="mt-1 text-sm font-semibold">
                                    {room.name}
                                </p>

                            </div>

                            {/* DATES */}

                            <div className="mt-5 grid grid-cols-2 gap-3">

                                <div>
                                    <p className="text-[10px] text-white/50">
                                        Check-in
                                    </p>

                                    <p className="mt-1 text-xs font-semibold">
                                        {formatDate(checkIn)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] text-white/50">
                                        Check-out
                                    </p>

                                    <p className="mt-1 text-xs font-semibold">
                                        {formatDate(checkOut)}
                                    </p>
                                </div>

                            </div>

                            {/* GUESTS */}

                            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">

                                <span className="text-xs text-white/60">
                                    Guests
                                </span>

                                <span className="text-xs font-semibold">
                                    {adults} Adults, {children} Children
                                </span>

                            </div>

                            {/* PRICE */}

                            <div className="mt-6 border-t border-white/10 pt-5">

                                <div className="flex items-center justify-between text-xs text-white/60">
                                    <span>
                                        {formatPrice(room.price)} × {nights}{" "}
                                        night
                                        {nights > 1 ? "s" : ""}
                                    </span>

                                    <span>
                                        {formatPrice(roomTotal)}
                                    </span>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                                    <span>
                                        Taxes & fees
                                    </span>

                                    <span>
                                        {formatPrice(taxes)}
                                    </span>
                                </div>

                                <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">

                                    <span className="text-sm font-semibold">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold text-[#C87532]">
                                        {formatPrice(totalAmount)}
                                    </span>

                                </div>

                            </div>

                            {/* DESKTOP BUTTON */}

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="mt-6 hidden h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C87532] text-sm font-semibold text-white transition hover:bg-[#B96928] disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
                            >
                                {loading ? (
                                    "Processing..."
                                ) : (
                                    <>
                                        Confirm Booking
                                        <CheckCircle2 size={17} />
                                    </>
                                )}
                            </button>

                            <p className="mt-4 text-center text-[10px] leading-4 text-white/40">
                                Your booking request will be reviewed by
                                our team before final confirmation.
                            </p>

                        </div>

                    </aside>

                </div>
            </section>
        </main>
    );
}