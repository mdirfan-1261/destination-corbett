"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CalendarDays,
    Users,
    MapPin,
    ChevronLeft,
    ShieldCheck,
    CreditCard,
    User,
    Mail,
    Phone,
    FileText,
    CheckCircle2,
    Building2,
    BedDouble,
} from "lucide-react";

export default function BookingPage() {
    const router = useRouter();

    const [bookingData, setBookingData] = useState({
        type: "stay",
        propertyId: "",
        roomTypeId: "",
        checkIn: "",
        checkOut: "",
        adults: 2,
        children: 0,
    });

    const [guest, setGuest] = useState({
        name: "",
        phone: "",
        email: "",
        specialRequest: "",
    });

    const [submitted, setSubmitted] = useState(false);

    // -----------------------------------------
    // READ BOOKING DATA FROM URL
    // -----------------------------------------

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        setBookingData({
            type: params.get("type") || "stay",
            propertyId: params.get("property_id") || "",
            roomTypeId: params.get("room_type_id") || "",
            checkIn: params.get("check_in") || "",
            checkOut: params.get("check_out") || "",
            adults: Number(params.get("adults")) || 2,
            children: Number(params.get("children")) || 0,
        });
    }, []);

    // -----------------------------------------
    // BOOKING TYPE
    // -----------------------------------------

    const typeLabel = useMemo(() => {
        const labels = {
            stay: "Stay",
            safari: "Safari",
            package: "Package",
            event: "Event",
            wedding: "Wedding",
        };

        return labels[bookingData.type] || "Booking";
    }, [bookingData.type]);

    // -----------------------------------------
    // DYNAMIC PROPERTY LABEL
    // -----------------------------------------

    const propertyLabel = useMemo(() => {
        if (!bookingData.propertyId) {
            return "Selected property";
        }

        return bookingData.propertyId
            .replace(/-/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }, [bookingData.propertyId]);

    // -----------------------------------------
    // DYNAMIC ROOM LABEL
    // -----------------------------------------

    const roomLabel = useMemo(() => {
        if (!bookingData.roomTypeId) {
            return "Room selection pending";
        }

        return bookingData.roomTypeId
            .replace(/-/g, " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }, [bookingData.roomTypeId]);

    // -----------------------------------------
    // TOTAL GUESTS
    // -----------------------------------------

    const totalGuests =
        bookingData.adults + bookingData.children;

    // -----------------------------------------
    // GUEST INPUT
    // -----------------------------------------

    const handleGuestChange = (e) => {
        const { name, value } = e.target;

        setGuest((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // -----------------------------------------
    // CONFIRM BOOKING
    // -----------------------------------------

    const handleConfirm = (e) => {
        e.preventDefault();

        if (!guest.name || !guest.phone || !guest.email) {
            alert("Please fill all required guest details.");
            return;
        }

        setSubmitted(true);

        /*
         * Backend booking API yahan baad mein connect hoga.
         *
         * Example future flow:
         *
         * POST /api/bookings
         *
         * {
         *   type,
         *   propertyId,
         *   roomTypeId,
         *   checkIn,
         *   checkOut,
         *   adults,
         *   children,
         *   guestName,
         *   phone,
         *   email,
         *   specialRequest
         * }
         */

        setTimeout(() => {
            router.push(
                `/booking/confirmation?type=${encodeURIComponent(
                    bookingData.type
                )}&property_id=${encodeURIComponent(
                    bookingData.propertyId
                )}&room_type_id=${encodeURIComponent(
                    bookingData.roomTypeId
                )}`
            );
        }, 700);
    };

    return (
        <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">

            {/* =========================================
                TOP BAR
            ========================================= */}

            <header className="border-b border-[#E8E1D7] bg-white">
                <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-1.5 text-sm font-medium text-[#64748B] transition hover:text-[#172033]"
                    >
                        <ChevronLeft
                            size={17}
                            className="transition group-hover:-translate-x-0.5"
                        />

                        Back
                    </button>

                    <div className="text-center">

                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C88A3D]">
                            Destination Corbett
                        </p>

                        <h1 className="mt-0.5 text-base font-semibold sm:text-lg">
                            Complete Booking
                        </h1>

                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">

                        <ShieldCheck
                            size={16}
                            className="text-[#C88A3D]"
                        />

                        <span className="hidden sm:inline">
                            Secure Booking
                        </span>

                    </div>

                </div>
            </header>

            {/* =========================================
                PAGE
            ========================================= */}

            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                {/* PAGE TITLE */}

                <div className="mb-5 flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <div className="mb-1.5 flex items-center gap-2">

                            <span className="rounded-full bg-[#F3E5D1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#A66D2B]">
                                {typeLabel} Booking
                            </span>

                        </div>

                        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                            Review & complete your reservation
                        </h2>

                        <p className="mt-1 text-xs text-[#64748B] sm:text-sm">
                            Check your selected experience and enter the
                            primary guest information.
                        </p>

                    </div>

                </div>

                <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">

                    {/* =========================================
                        LEFT
                    ========================================= */}

                    <div className="space-y-5">

                        {/* =====================================
                            SELECTED EXPERIENCE
                        ===================================== */}

                        <div className="rounded-2xl border border-[#E7E0D5] bg-white p-4 shadow-[0_4px_20px_rgba(23,32,51,0.035)] sm:p-5">

                            <div className="mb-4 flex items-center justify-between">

                                <div>

                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C88A3D]">
                                        Booking Details
                                    </p>

                                    <h3 className="mt-0.5 text-base font-semibold">
                                        Selected experience
                                    </h3>

                                </div>

                                <div className="rounded-lg bg-[#F7F5F0] p-2">

                                    {bookingData.type === "stay" ? (
                                        <Building2
                                            size={17}
                                            className="text-[#C88A3D]"
                                        />
                                    ) : (
                                        <MapPin
                                            size={17}
                                            className="text-[#C88A3D]"
                                        />
                                    )}

                                </div>

                            </div>

                            {/* PROPERTY */}

                            <div className="mb-3 rounded-xl border border-[#ECE7DF] bg-[#FCFBF8] p-3">

                                <div className="flex items-center gap-3">

                                    <div className="rounded-lg bg-white p-2">

                                        <Building2
                                            size={16}
                                            className="text-[#C88A3D]"
                                        />

                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-[10px] text-[#7B8798]">
                                            Selected {typeLabel.toLowerCase()}
                                        </p>

                                        <p className="mt-0.5 truncate text-sm font-semibold">
                                            {propertyLabel}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* ROOM */}

                            {bookingData.type === "stay" && (
                                <div className="mb-3 rounded-xl border border-[#ECE7DF] bg-[#FCFBF8] p-3">

                                    <div className="flex items-center gap-3">

                                        <div className="rounded-lg bg-white p-2">

                                            <BedDouble
                                                size={16}
                                                className="text-[#C88A3D]"
                                            />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-[10px] text-[#7B8798]">
                                                Room
                                            </p>

                                            <p className="mt-0.5 truncate text-sm font-semibold">
                                                {roomLabel}
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* DATE + GUEST GRID */}

                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">

                                {/* CHECK IN */}

                                <div className="rounded-xl border border-[#ECE7DF] bg-[#FCFBF8] p-3">

                                    <div className="flex items-center gap-2">

                                        <CalendarDays
                                            size={16}
                                            className="shrink-0 text-[#C88A3D]"
                                        />

                                        <span className="text-[10px] font-medium text-[#7B8798]">
                                            Check-in
                                        </span>

                                    </div>

                                    <p className="mt-2 truncate text-xs font-semibold sm:text-sm">
                                        {bookingData.checkIn || "Select date"}
                                    </p>

                                </div>

                                {/* CHECK OUT */}

                                <div className="rounded-xl border border-[#ECE7DF] bg-[#FCFBF8] p-3">

                                    <div className="flex items-center gap-2">

                                        <CalendarDays
                                            size={16}
                                            className="shrink-0 text-[#C88A3D]"
                                        />

                                        <span className="text-[10px] font-medium text-[#7B8798]">
                                            Check-out
                                        </span>

                                    </div>

                                    <p className="mt-2 truncate text-xs font-semibold sm:text-sm">
                                        {bookingData.checkOut || "Select date"}
                                    </p>

                                </div>

                                {/* ADULTS */}

                                <div className="rounded-xl border border-[#ECE7DF] bg-[#FCFBF8] p-3">

                                    <div className="flex items-center gap-2">

                                        <Users
                                            size={16}
                                            className="shrink-0 text-[#C88A3D]"
                                        />

                                        <span className="text-[10px] font-medium text-[#7B8798]">
                                            Adults
                                        </span>

                                    </div>

                                    <p className="mt-2 text-xs font-semibold sm:text-sm">
                                        {bookingData.adults}
                                    </p>

                                </div>

                                {/* CHILDREN */}

                                <div className="rounded-xl border border-[#ECE7DF] bg-[#FCFBF8] p-3">

                                    <div className="flex items-center gap-2">

                                        <Users
                                            size={16}
                                            className="shrink-0 text-[#C88A3D]"
                                        />

                                        <span className="text-[10px] font-medium text-[#7B8798]">
                                            Children
                                        </span>

                                    </div>

                                    <p className="mt-2 text-xs font-semibold sm:text-sm">
                                        {bookingData.children}
                                    </p>

                                </div>

                            </div>

                            {/* TOTAL GUESTS */}

                            <div className="mt-3 flex items-center justify-between rounded-lg bg-[#F8F6F1] px-3 py-2.5">

                                <span className="text-xs text-[#64748B]">
                                    Total guests
                                </span>

                                <span className="text-xs font-semibold">
                                    {totalGuests}{" "}
                                    {totalGuests === 1
                                        ? "Guest"
                                        : "Guests"}
                                </span>

                            </div>

                        </div>

                        {/* =====================================
                            GUEST FORM
                        ===================================== */}

                        <form
                            onSubmit={handleConfirm}
                            className="rounded-2xl border border-[#E7E0D5] bg-white p-4 shadow-[0_4px_20px_rgba(23,32,51,0.035)] sm:p-5"
                        >

                            <div className="mb-4">

                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C88A3D]">
                                    Guest Information
                                </p>

                                <h3 className="mt-0.5 text-base font-semibold">
                                    Primary guest details
                                </h3>

                                <p className="mt-1 text-xs text-[#64748B]">
                                    We&apos;ll use these details for your
                                    booking confirmation.
                                </p>

                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">

                                {/* NAME */}

                                <div>

                                    <label className="mb-1.5 block text-xs font-semibold">
                                        Full Name{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">

                                        <User
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                                        />

                                        <input
                                            type="text"
                                            name="name"
                                            value={guest.name}
                                            onChange={handleGuestChange}
                                            placeholder="Enter full name"
                                            required
                                            className="h-10 w-full rounded-lg border border-[#DDE3EA] bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-[#A0A9B5] focus:border-[#C88A3D] focus:ring-2 focus:ring-[#C88A3D]/10"
                                        />

                                    </div>

                                </div>

                                {/* PHONE */}

                                <div>

                                    <label className="mb-1.5 block text-xs font-semibold">
                                        Phone Number{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">

                                        <Phone
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                                        />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={guest.phone}
                                            onChange={handleGuestChange}
                                            placeholder="Enter phone number"
                                            required
                                            className="h-10 w-full rounded-lg border border-[#DDE3EA] bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-[#A0A9B5] focus:border-[#C88A3D] focus:ring-2 focus:ring-[#C88A3D]/10"
                                        />

                                    </div>

                                </div>

                                {/* EMAIL */}

                                <div className="sm:col-span-2">

                                    <label className="mb-1.5 block text-xs font-semibold">
                                        Email Address{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                                        />

                                        <input
                                            type="email"
                                            name="email"
                                            value={guest.email}
                                            onChange={handleGuestChange}
                                            placeholder="Enter email address"
                                            required
                                            className="h-10 w-full rounded-lg border border-[#DDE3EA] bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-[#A0A9B5] focus:border-[#C88A3D] focus:ring-2 focus:ring-[#C88A3D]/10"
                                        />

                                    </div>

                                </div>

                                {/* SPECIAL REQUEST */}

                                <div className="sm:col-span-2">

                                    <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold">

                                        Special Request

                                        <span className="text-[10px] font-normal text-[#94A3B8]">
                                            Optional
                                        </span>

                                    </label>

                                    <div className="relative">

                                        <FileText
                                            size={15}
                                            className="absolute left-3 top-3 text-[#94A3B8]"
                                        />

                                        <textarea
                                            name="specialRequest"
                                            value={guest.specialRequest}
                                            onChange={handleGuestChange}
                                            placeholder="Any special requirement or request?"
                                            rows={3}
                                            className="w-full resize-none rounded-lg border border-[#DDE3EA] bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition placeholder:text-[#A0A9B5] focus:border-[#C88A3D] focus:ring-2 focus:ring-[#C88A3D]/10"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* MOBILE BUTTON */}

                            <button
                                type="submit"
                                disabled={submitted}
                                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#172033] px-4 text-xs font-semibold text-white transition hover:bg-[#25314A] disabled:cursor-not-allowed disabled:opacity-70 lg:hidden"
                            >

                                {submitted ? (
                                    <>
                                        <CheckCircle2 size={16} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={16} />
                                        Confirm Booking
                                    </>
                                )}

                            </button>

                        </form>

                    </div>

                    {/* =========================================
                        RIGHT SUMMARY
                    ========================================= */}

                    <aside className="lg:sticky lg:top-5">

                        <div className="overflow-hidden rounded-2xl border border-[#E7E0D5] bg-white shadow-[0_6px_25px_rgba(23,32,51,0.05)]">

                            {/* HEADER */}

                            <div className="bg-[#172033] px-5 py-4 text-white">

                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E1A05B]">
                                    Reservation
                                </p>

                                <h3 className="mt-0.5 text-base font-semibold">
                                    Booking Summary
                                </h3>

                            </div>

                            <div className="p-4">

                                {/* DYNAMIC PROPERTY */}

                                <div className="rounded-xl bg-[#F7F5F0] p-3">

                                    <div className="flex items-start gap-3">

                                        <div className="rounded-lg bg-white p-2">

                                            <Building2
                                                size={16}
                                                className="text-[#C88A3D]"
                                            />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="text-[10px] text-[#7B8798]">
                                                {typeLabel}
                                            </p>

                                            <p className="mt-0.5 break-words text-sm font-semibold">
                                                {propertyLabel}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* ROOM */}

                                {bookingData.type === "stay" && (
                                    <div className="mt-2 rounded-xl bg-[#F7F5F0] p-3">

                                        <div className="flex items-start gap-3">

                                            <div className="rounded-lg bg-white p-2">

                                                <BedDouble
                                                    size={16}
                                                    className="text-[#C88A3D]"
                                                />

                                            </div>

                                            <div className="min-w-0">

                                                <p className="text-[10px] text-[#7B8798]">
                                                    Room Type
                                                </p>

                                                <p className="mt-0.5 break-words text-xs font-semibold">
                                                    {roomLabel}
                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                )}

                                {/* DETAILS */}

                                <div className="mt-4 divide-y divide-[#EEE9E1]">

                                    <div className="flex items-center justify-between py-2.5 text-xs">

                                        <span className="text-[#64748B]">
                                            Check-in
                                        </span>

                                        <span className="font-semibold">
                                            {bookingData.checkIn || "—"}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between py-2.5 text-xs">

                                        <span className="text-[#64748B]">
                                            Check-out
                                        </span>

                                        <span className="font-semibold">
                                            {bookingData.checkOut || "—"}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between py-2.5 text-xs">

                                        <span className="text-[#64748B]">
                                            Adults
                                        </span>

                                        <span className="font-semibold">
                                            {bookingData.adults}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between py-2.5 text-xs">

                                        <span className="text-[#64748B]">
                                            Children
                                        </span>

                                        <span className="font-semibold">
                                            {bookingData.children}
                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between py-2.5 text-xs">

                                        <span className="text-[#64748B]">
                                            Total guests
                                        </span>

                                        <span className="font-semibold">
                                            {totalGuests}
                                        </span>

                                    </div>

                                </div>

                                {/* PRICE */}

                                <div className="my-3 rounded-xl border border-[#E8E0D4] bg-[#FCFBF8] p-3">

                                    <div className="flex items-center justify-between gap-3">

                                        <span className="text-xs text-[#64748B]">
                                            Booking amount
                                        </span>

                                        <span className="text-right text-sm font-semibold text-[#172033]">
                                            Calculated at confirmation
                                        </span>

                                    </div>

                                    <p className="mt-1 text-[10px] leading-4 text-[#94A3B8]">
                                        Final amount will be calculated from
                                        actual availability and selected
                                        service.
                                    </p>

                                </div>

                                {/* SECURITY */}

                                <div className="rounded-xl border border-[#E9E2D8] bg-[#FCFBF8] p-3">

                                    <div className="flex gap-2.5">

                                        <ShieldCheck
                                            size={17}
                                            className="mt-0.5 shrink-0 text-[#C88A3D]"
                                        />

                                        <div>

                                            <p className="text-xs font-semibold">
                                                Secure reservation
                                            </p>

                                            <p className="mt-0.5 text-[10px] leading-4 text-[#7B8798]">
                                                Your booking information is
                                                handled securely.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {/* DESKTOP BUTTON */}

                                <button
                                    onClick={handleConfirm}
                                    disabled={submitted}
                                    className="mt-4 hidden h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#C88A3D] px-4 text-xs font-semibold text-white transition hover:bg-[#B9782F] disabled:cursor-not-allowed disabled:opacity-70 lg:flex"
                                >

                                    {submitted ? (
                                        <>
                                            <CheckCircle2 size={16} />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={16} />
                                            Confirm Booking
                                        </>
                                    )}

                                </button>

                                <p className="mt-3 text-center text-[9px] leading-4 text-[#A0A9B5]">
                                    By continuing, you agree to the booking
                                    details and applicable terms.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </section>

        </main>
    );
}