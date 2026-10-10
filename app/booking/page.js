"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  MapPin,
  ChevronLeft,
  ShieldCheck,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Building2,
  BedDouble,
  Trees,
  Package,
  BriefcaseBusiness,
  Heart,
  Send,
  Minus,
  Plus,
} from "lucide-react";

// ==========================================
// BACKEND API URL
// Local development ke liye localhost.
// Production mein Vercel environment variable use hoga.
// ==========================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const BOOKING_CONFIG = {
  stay: {
    label: "Stay",
    title: "Plan Your Stay",
    description: "Choose your dates, guests and room details.",
    icon: Building2,
    dateLabel: "Check-in",
    secondDateLabel: "Check-out",
  },

  safari: {
    label: "Safari",
    title: "Plan Your Safari",
    description: "Choose your safari date, zone and guests.",
    icon: Trees,
    dateLabel: "Safari Date",
    secondDateLabel: null,
  },

  package: {
    label: "Package",
    title: "Plan Your Package",
    description: "Share your preferred dates and guest details.",
    icon: Package,
    dateLabel: "Start Date",
    secondDateLabel: "End Date",
  },

  event: {
    label: "Event",
    title: "Plan Your Event",
    description: "Tell us about your event and requirements.",
    icon: BriefcaseBusiness,
    dateLabel: "Event Date",
    secondDateLabel: null,
  },

  conference: {
    label: "Conference",
    title: "Plan Your Conference",
    description: "Share your conference requirements with our team.",
    icon: BriefcaseBusiness,
    dateLabel: "Event Date",
    secondDateLabel: null,
  },

  "corporate-meeting": {
    label: "Corporate Meeting",
    title: "Plan Your Corporate Meeting",
    description: "Share your meeting requirements with our team.",
    icon: BriefcaseBusiness,
    dateLabel: "Meeting Date",
    secondDateLabel: null,
  },

  wedding: {
    label: "Wedding",
    title: "Plan Your Destination Wedding",
    description: "Tell us your wedding date, guests and requirements.",
    icon: Heart,
    dateLabel: "Wedding Date",
    secondDateLabel: null,
  },
};



export default function BookingPage() {
  const router = useRouter();

  const [bookingData, setBookingData] = useState({
    type: "stay",
    propertyId: "",
    roomTypeId: "",
    packageId: "",
    safariId: "",
    eventId: "",
    venueId: "",
    checkIn: "",
    checkOut: "",
    date: "",
    adults: 2,
    children: 0,
    rooms: 1,
    zone: "",
  });

  const [guest, setGuest] = useState({
    name: "",
    phone: "",
    email: "",
    specialRequest: "",
  });

  const [submitted, setSubmitted] = useState(false);
  // ==========================================
// BOOKING SUBMISSION ERROR
// API fail hone par customer ko error dikhayenge.
// ==========================================

const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const type = params.get("type") || "stay";

    setBookingData({
      type,

      propertyId:
        params.get("property_id") ||
        params.get("property") ||
        "",

      roomTypeId:
        params.get("room_type_id") ||
        params.get("room") ||
        "",

      packageId: params.get("package_id") || "",
      safariId: params.get("safari_id") || "",
      eventId: params.get("event_id") || "",
      venueId: params.get("venue_id") || "",

      checkIn:
        params.get("check_in") ||
        params.get("start_date") ||
        "",

      checkOut:
        params.get("check_out") ||
        params.get("end_date") ||
        "",

      date: params.get("date") || "",

      adults: Number(params.get("adults")) || 2,
      children: Number(params.get("children")) || 0,
      rooms: Number(params.get("rooms")) || 1,

      zone: params.get("zone") || "",
    });
  }, []);

  const config =
    BOOKING_CONFIG[bookingData.type] ||
    BOOKING_CONFIG.stay;

  const Icon = config.icon;

  const isStay = bookingData.type === "stay";
  const isSafari = bookingData.type === "safari";
  const isPackage = bookingData.type === "package";

  const isEvent = [
    "event",
    "conference",
    "corporate-meeting",
    "wedding",
  ].includes(bookingData.type);

  const selectedItem = useMemo(() => {
    let value = "";

    if (bookingData.type === "stay") {
      value = bookingData.propertyId;
    }

    if (bookingData.type === "safari") {
      value = bookingData.safariId;
    }

    if (bookingData.type === "package") {
      value = bookingData.packageId;
    }

    if (
      bookingData.type === "event" ||
      bookingData.type === "conference" ||
      bookingData.type === "corporate-meeting"
    ) {
      value = bookingData.eventId;
    }

    if (bookingData.type === "wedding") {
      value = bookingData.venueId;
    }

    if (!value) {
      return `Selected ${config.label.toLowerCase()}`;
    }

    return value
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }, [bookingData, config.label]);

  const roomLabel = useMemo(() => {
    if (!bookingData.roomTypeId) {
      return "Room selection pending";
    }

    return bookingData.roomTypeId
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }, [bookingData.roomTypeId]);

  const totalGuests =
    Number(bookingData.adults || 0) +
    Number(bookingData.children || 0);

  const handleGuestChange = (e) => {
    const { name, value } = e.target;

    setGuest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateBooking = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateGuestCount = (field, amount) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: Math.max(
        field === "adults" ? 1 : 0,
        Number(prev[field] || 0) + amount
      ),
    }));
  };


// =====================================================
// CONFIRM BOOKING
// Backend API mein booking save karna
// Successful response ke baad hi confirmation page khulega
// =====================================================

const handleConfirm = async (e) => {
  e.preventDefault();

  // Already request chal rahi ho toh duplicate submit nahi karna
  if (submitted) return;

  // ==========================================
  // VALIDATE CUSTOMER DETAILS
  // ==========================================

  if (
    !guest.name.trim() ||
    !guest.phone.trim() ||
    !guest.email.trim()
  ) {
    setSubmitError("Please fill all required details.");
    return;
  }

  // ==========================================
  // PREPARE API PAYLOAD
  // Backend apne aap booking group aur reference set karega
  // ==========================================

  const payload = {
    type: bookingData.type,

    propertyId: bookingData.propertyId,
    roomTypeId: bookingData.roomTypeId,
    packageId: bookingData.packageId,
    safariId: bookingData.safariId,
    eventId: bookingData.eventId,
    venueId: bookingData.venueId,

    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    date: bookingData.date,
    zone: bookingData.zone,

    adults: bookingData.adults,
    children: bookingData.children,
    rooms: bookingData.rooms,

    name: guest.name.trim(),
    phone: guest.phone.trim(),
    email: guest.email.trim(),
    specialRequest: guest.specialRequest.trim(),
  };

  // ==========================================
  // SUBMIT BOOKING TO BACKEND
  // ==========================================

  setSubmitted(true);
  setSubmitError("");

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    // Response JSON parse karo
    const result = await response.json();

    // Failed HTTP response ya unsuccessful API response
    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Booking submission failed."
      );
    }

    // ==========================================
    // BUILD CONFIRMATION URL
    // Backend se mila actual reference use karo
    // ==========================================

    const params = new URLSearchParams();

    params.set("type", bookingData.type);

    if (result.booking?.bookingReference) {
      params.set(
        "booking_reference",
        result.booking.bookingReference
      );
    }

    if (bookingData.propertyId) {
      params.set("property_id", bookingData.propertyId);
    }

    if (bookingData.roomTypeId) {
      params.set("room_type_id", bookingData.roomTypeId);
    }

    if (bookingData.packageId) {
      params.set("package_id", bookingData.packageId);
    }

    if (bookingData.safariId) {
      params.set("safari_id", bookingData.safariId);
    }

    if (bookingData.eventId) {
      params.set("event_id", bookingData.eventId);
    }

    if (bookingData.venueId) {
      params.set("venue_id", bookingData.venueId);
    }

    if (bookingData.checkIn) {
      params.set("check_in", bookingData.checkIn);
    }

    if (bookingData.checkOut) {
      params.set("check_out", bookingData.checkOut);
    }

    if (bookingData.date) {
      params.set("date", bookingData.date);
    }

    params.set("adults", String(bookingData.adults));
    params.set("children", String(bookingData.children));
    params.set("rooms", String(bookingData.rooms));

    if (bookingData.zone) {
      params.set("zone", bookingData.zone);
    }

    // ==========================================
    // SUCCESS
    // Ab booking database mein save ho chuki hai
    // ==========================================

    router.push(
      `/booking/confirmation?${params.toString()}`
    );
  } catch (error) {
    // ==========================================
    // ERROR HANDLING
    // Failure par retry allow karo
    // ==========================================

    console.error("Booking submission error:", error);

    setSubmitError(
      error.message ||
        "Unable to submit your booking. Please try again."
    );

    setSubmitted(false);
  }
};



  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">

      {/* HEADER */}

      <header className="border-b border-[#E8E1D7] bg-white">
        <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-3 sm:h-[64px] sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => router.back()}
            className="group flex items-center gap-1 text-xs font-medium text-[#64748B] transition hover:text-[#172033] sm:text-sm"
          >
            <ChevronLeft
              size={16}
              className="transition group-hover:-translate-x-0.5"
            />
            Back
          </button>

          <div className="text-center">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#C87532] sm:text-[10px]">
              Destination Corbett
            </p>

            <h1 className="mt-0.5 text-sm font-semibold sm:text-base">
              {config.label} Booking
            </h1>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-medium text-[#64748B] sm:text-xs">
            <ShieldCheck
              size={14}
              className="text-[#C87532]"
            />

            <span className="hidden sm:inline">
              Secure Enquiry
            </span>
          </div>

        </div>
      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-7">

        {/* TITLE */}

        <div className="mb-4 sm:mb-5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="rounded-full bg-[#F3E5D1] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#A66D2B] sm:px-2.5 sm:py-1 sm:text-[10px]">
              {config.label}
            </span>
          </div>

          <h2 className="text-lg font-semibold tracking-tight sm:text-2xl">
            {config.title}
          </h2>

          <p className="mt-0.5 text-[11px] text-[#64748B] sm:text-sm">
            {config.description}
          </p>
        </div>

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* LEFT */}

          <div className="space-y-4">

            {/* SELECTED EXPERIENCE */}

            <div className="rounded-xl border border-[#E7E0D5] bg-white p-3 shadow-[0_3px_16px_rgba(23,32,51,0.035)] sm:rounded-2xl sm:p-4">

              <div className="mb-3 flex items-center justify-between">

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C87532]">
                    {config.label} Details
                  </p>

                  <h3 className="mt-0.5 text-sm font-semibold sm:text-base">
                    Selected experience
                  </h3>
                </div>

                <div className="rounded-lg bg-[#F7F5F0] p-1.5">
                  <Icon
                    size={15}
                    className="text-[#C87532]"
                  />
                </div>

              </div>

              {/* SELECTED ITEM */}

              <div className="mb-2 rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">

                <div className="flex items-center gap-2.5">

                  <div className="rounded-md bg-white p-1.5">
                    <Icon
                      size={14}
                      className="text-[#C87532]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] text-[#7B8798]">
                      Selected {config.label.toLowerCase()}
                    </p>

                    <p className="mt-0.5 break-words text-xs font-semibold sm:text-sm">
                      {selectedItem}
                    </p>
                  </div>

                </div>

              </div>

              {/* ROOM */}

              {isStay && (
                <div className="mb-2 rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">

                  <div className="flex items-center gap-2.5">

                    <div className="rounded-md bg-white p-1.5">
                      <BedDouble
                        size={14}
                        className="text-[#C87532]"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] text-[#7B8798]">
                        Room Type
                      </p>

                      <p className="mt-0.5 break-words text-xs font-semibold sm:text-sm">
                        {roomLabel}
                      </p>
                    </div>

                  </div>

                </div>
              )}

              {/* DATES */}

              <div
                className={`grid gap-2 ${
                  config.secondDateLabel
                    ? "grid-cols-2"
                    : "grid-cols-1"
                }`}
              >

                {/* FIRST DATE */}

                <div className="rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">

                  <div className="flex items-center gap-1.5">

                    <CalendarDays
                      size={14}
                      className="shrink-0 text-[#C87532]"
                    />

                    <span className="text-[9px] font-medium text-[#7B8798] sm:text-[10px]">
                      {config.dateLabel}
                    </span>

                  </div>

                  <input
                    type="date"
                    min={today}
                    value={
                      isSafari || isEvent
                        ? bookingData.date
                        : bookingData.checkIn
                    }
                    onChange={(e) => {
                      if (isSafari || isEvent) {
                        updateBooking(
                          "date",
                          e.target.value
                        );
                      } else {
                        updateBooking(
                          "checkIn",
                          e.target.value
                        );
                      }
                    }}
                    className="mt-1.5 w-full bg-transparent text-[11px] font-semibold outline-none sm:text-xs"
                  />

                </div>

                {/* SECOND DATE */}

                {config.secondDateLabel && (
                  <div className="rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">

                    <div className="flex items-center gap-1.5">

                      <CalendarDays
                        size={14}
                        className="shrink-0 text-[#C87532]"
                      />

                      <span className="text-[9px] font-medium text-[#7B8798] sm:text-[10px]">
                        {config.secondDateLabel}
                      </span>

                    </div>

                    <input
                      type="date"
                      min={
                        bookingData.checkIn ||
                        today
                      }
                      value={bookingData.checkOut}
                      onChange={(e) =>
                        updateBooking(
                          "checkOut",
                          e.target.value
                        )
                      }
                      className="mt-1.5 w-full bg-transparent text-[11px] font-semibold outline-none sm:text-xs"
                    />

                  </div>
                )}

              </div>

              {/* SAFARI ZONE */}

              {isSafari && (
                <div className="mt-2 rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">

                  <div className="flex items-center gap-2.5">

                    <div className="rounded-md bg-white p-1.5">
                      <MapPin
                        size={14}
                        className="text-[#C87532]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-[9px] text-[#7B8798]">
                        Safari Zone
                      </p>

                      <select
                        value={bookingData.zone}
                        onChange={(e) =>
                          updateBooking(
                            "zone",
                            e.target.value
                          )
                        }
                        className="mt-0.5 w-full bg-transparent text-[11px] font-semibold outline-none"
                      >
                        <option value="">
                          Select safari zone
                        </option>

                        <option value="Dhikala">
                          Dhikala
                        </option>

                        <option value="Bijrani">
                          Bijrani
                        </option>

                        <option value="Jhirna">
                          Jhirna
                        </option>

                        <option value="Durgadevi">
                          Durgadevi
                        </option>

                        <option value="Dhela">
                          Dhela
                        </option>
                      </select>

                    </div>

                  </div>

                </div>
              )}

              {/* GUESTS */}

              <div className="mt-2 grid gap-2 sm:grid-cols-3">

                {/* ADULTS */}

                <div className="rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">

                  <div className="flex items-center justify-between gap-2">

                    <div className="flex items-center gap-1.5">
                      <Users
                        size={14}
                        className="text-[#C87532]"
                      />

                      <span className="text-[9px] font-medium text-[#7B8798] sm:text-[10px]">
                        Adults
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">

                      <button
                        type="button"
                        onClick={() =>
                          updateGuestCount(
                            "adults",
                            -1
                          )
                        }
                        className="flex h-5 w-5 items-center justify-center rounded border border-[#E4DDD3] bg-white hover:border-[#C87532]"
                      >
                        <Minus size={10} />
                      </button>

                      <span className="w-5 text-center text-[10px] font-semibold">
                        {bookingData.adults}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateGuestCount(
                            "adults",
                            1
                          )
                        }
                        className="flex h-5 w-5 items-center justify-center rounded border border-[#E4DDD3] bg-white hover:border-[#C87532]"
                      >
                        <Plus size={10} />
                      </button>

                    </div>

                  </div>

                </div>

                {/* CHILDREN */}

                <div className="rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">

                  <div className="flex items-center justify-between gap-2">

                    <div className="flex items-center gap-1.5">
                      <Users
                        size={14}
                        className="text-[#C87532]"
                      />

                      <span className="text-[9px] font-medium text-[#7B8798] sm:text-[10px]">
                        Children
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">

                      <button
                        type="button"
                        onClick={() =>
                          updateGuestCount(
                            "children",
                            -1
                          )
                        }
                        className="flex h-5 w-5 items-center justify-center rounded border border-[#E4DDD3] bg-white hover:border-[#C87532]"
                      >
                        <Minus size={10} />
                      </button>

                      <span className="w-5 text-center text-[10px] font-semibold">
                        {bookingData.children}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateGuestCount(
                            "children",
                            1
                          )
                        }
                        className="flex h-5 w-5 items-center justify-center rounded border border-[#E4DDD3] bg-white hover:border-[#C87532]"
                      >
                        <Plus size={10} />
                      </button>

                    </div>

                  </div>

                </div>

                {/* ROOMS */}

                {isStay && (
                  <div className="rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">

                    <div className="flex items-center justify-between gap-2">

                      <div className="flex items-center gap-1.5">
                        <BedDouble
                          size={14}
                          className="text-[#C87532]"
                        />

                        <span className="text-[9px] font-medium text-[#7B8798] sm:text-[10px]">
                          Rooms
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5">

                        <button
                          type="button"
                          onClick={() =>
                            setBookingData(
                              (prev) => ({
                                ...prev,
                                rooms: Math.max(
                                  1,
                                  prev.rooms - 1
                                ),
                              })
                            )
                          }
                          className="flex h-5 w-5 items-center justify-center rounded border border-[#E4DDD3] bg-white hover:border-[#C87532]"
                        >
                          <Minus size={10} />
                        </button>

                        <span className="w-5 text-center text-[10px] font-semibold">
                          {bookingData.rooms}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setBookingData(
                              (prev) => ({
                                ...prev,
                                rooms:
                                  prev.rooms + 1,
                              })
                            )
                          }
                          className="flex h-5 w-5 items-center justify-center rounded border border-[#E4DDD3] bg-white hover:border-[#C87532]"
                        >
                          <Plus size={10} />
                        </button>

                      </div>

                    </div>

                  </div>
                )}

              </div>

              {/* TOTAL */}

              <div className="mt-2 flex items-center justify-between rounded-lg bg-[#F8F6F1] px-2.5 py-2">

                <span className="text-[10px] text-[#64748B]">
                  Total guests
                </span>

                <span className="text-[10px] font-semibold sm:text-xs">
                  {totalGuests}{" "}
                  {totalGuests === 1
                    ? "Guest"
                    : "Guests"}
                </span>

              </div>

            </div>

            {/* CONTACT FORM */}

            <form
              onSubmit={handleConfirm}
              className="rounded-xl border border-[#E7E0D5] bg-white p-3 shadow-[0_3px_16px_rgba(23,32,51,0.035)] sm:rounded-2xl sm:p-4"
            >

              <div className="mb-3">

                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C87532]">
                  Contact Information
                </p>

                <h3 className="mt-0.5 text-sm font-semibold sm:text-base">
                  Tell us how to reach you
                </h3>

                <p className="mt-0.5 text-[10px] text-[#64748B] sm:text-xs">
                  We&apos;ll use these details to confirm
                  availability and your request.
                </p>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {/* NAME */}

                <div>
                  <label className="mb-1 block text-[10px] font-semibold sm:text-xs">
                    Full Name{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    />

                    <input
                      type="text"
                      name="name"
                      value={guest.name}
                      onChange={handleGuestChange}
                      placeholder="Enter full name"
                      required
                      className="h-9 w-full rounded-lg border border-[#DDE3EA] bg-white pl-8 pr-2.5 text-[11px] outline-none transition placeholder:text-[#A0A9B5] focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10 sm:text-xs"
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-1 block text-[10px] font-semibold sm:text-xs">
                    Phone Number{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={guest.phone}
                      onChange={handleGuestChange}
                      placeholder="Enter phone number"
                      required
                      className="h-9 w-full rounded-lg border border-[#DDE3EA] bg-white pl-8 pr-2.5 text-[11px] outline-none transition placeholder:text-[#A0A9B5] focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10 sm:text-xs"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-semibold sm:text-xs">
                    Email Address{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    />

                    <input
                      type="email"
                      name="email"
                      value={guest.email}
                      onChange={handleGuestChange}
                      placeholder="Enter email address"
                      required
                      className="h-9 w-full rounded-lg border border-[#DDE3EA] bg-white pl-8 pr-2.5 text-[11px] outline-none transition placeholder:text-[#A0A9B5] focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10 sm:text-xs"
                    />
                  </div>
                </div>

                {/* SPECIAL REQUEST */}

                <div className="sm:col-span-2">
                  <label className="mb-1 flex items-center gap-1 text-[10px] font-semibold sm:text-xs">
                    Special Request

                    <span className="text-[9px] font-normal text-[#94A3B8]">
                      Optional
                    </span>
                  </label>

                  <div className="relative">
                    <FileText
                      size={14}
                      className="absolute left-2.5 top-2.5 text-[#94A3B8]"
                    />

                    <textarea
                      name="specialRequest"
                      value={guest.specialRequest}
                      onChange={handleGuestChange}
                      placeholder="Any special requirement or request?"
                      rows={2}
                      className="w-full resize-none rounded-lg border border-[#DDE3EA] bg-white py-2 pl-8 pr-2.5 text-[11px] outline-none transition placeholder:text-[#A0A9B5] focus:border-[#C87532] focus:ring-2 focus:ring-[#C87532]/10 sm:text-xs"
                    />
                  </div>
                </div>

              </div>

              {/* MOBILE BUTTON */}

              <button
                type="submit"
                disabled={submitted}
                className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-3 text-[11px] font-semibold text-white transition hover:bg-[#B96928] disabled:cursor-not-allowed disabled:opacity-70 lg:hidden"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 size={14} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Booking Request
                  </>
                )}
              </button>

            </form>

          </div>

          {/* RIGHT SUMMARY */}

          <aside className="lg:sticky lg:top-4">

            <div className="overflow-hidden rounded-xl border border-[#E7E0D5] bg-white shadow-[0_4px_20px_rgba(23,32,51,0.045)] sm:rounded-2xl">

              {/* HEADER */}

              <div className="bg-[#172033] px-4 py-3 text-white">

                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#E1A05B]">
                  Reservation
                </p>

                <h3 className="mt-0.5 text-sm font-semibold">
                  {config.label} Summary
                </h3>

              </div>

              <div className="p-3">

                {/* SELECTED */}

                <div className="rounded-lg bg-[#F7F5F0] p-2.5">

                  <div className="flex items-start gap-2.5">

                    <div className="rounded-md bg-white p-1.5">
                      <Icon
                        size={14}
                        className="text-[#C87532]"
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[9px] text-[#7B8798]">
                        {config.label}
                      </p>

                      <p className="mt-0.5 break-words text-xs font-semibold">
                        {selectedItem}
                      </p>

                    </div>

                  </div>

                </div>

                {/* ROOM */}

                {isStay && (
                  <div className="mt-1.5 rounded-lg bg-[#F7F5F0] p-2.5">

                    <div className="flex items-start gap-2.5">

                      <div className="rounded-md bg-white p-1.5">
                        <BedDouble
                          size={14}
                          className="text-[#C87532]"
                        />
                      </div>

                      <div>
                        <p className="text-[9px] text-[#7B8798]">
                          Room Type
                        </p>

                        <p className="mt-0.5 text-[11px] font-semibold">
                          {roomLabel}
                        </p>
                      </div>

                    </div>

                  </div>
                )}

                {/* DETAILS */}

                <div className="mt-3 divide-y divide-[#EEE9E1]">

                  {isStay || isPackage ? (
                    <>
                      <div className="flex items-center justify-between py-2 text-[10px]">
                        <span className="text-[#64748B]">
                          Start
                        </span>

                        <span className="font-semibold">
                          {bookingData.checkIn || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 text-[10px]">
                        <span className="text-[#64748B]">
                          End
                        </span>

                        <span className="font-semibold">
                          {bookingData.checkOut || "—"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between py-2 text-[10px]">
                      <span className="text-[#64748B]">
                        Date
                      </span>

                      <span className="font-semibold">
                        {bookingData.date || "—"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 text-[10px]">
                    <span className="text-[#64748B]">
                      Adults
                    </span>

                    <span className="font-semibold">
                      {bookingData.adults}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 text-[10px]">
                    <span className="text-[#64748B]">
                      Children
                    </span>

                    <span className="font-semibold">
                      {bookingData.children}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 text-[10px]">
                    <span className="text-[#64748B]">
                      Total guests
                    </span>

                    <span className="font-semibold">
                      {totalGuests}
                    </span>
                  </div>

                  {isStay && (
                    <div className="flex items-center justify-between py-2 text-[10px]">
                      <span className="text-[#64748B]">
                        Rooms
                      </span>

                      <span className="font-semibold">
                        {bookingData.rooms}
                      </span>
                    </div>
                  )}

                  {isSafari && (
                    <div className="flex items-center justify-between py-2 text-[10px]">
                      <span className="text-[#64748B]">
                        Zone
                      </span>

                      <span className="font-semibold">
                        {bookingData.zone || "—"}
                      </span>
                    </div>
                  )}

                </div>

                {/* AMOUNT */}

                <div className="my-2.5 rounded-lg border border-[#E8E0D4] bg-[#FCFBF8] p-2.5">

                  <div className="flex items-center justify-between gap-2">

                    <span className="text-[10px] text-[#64748B]">
                      Amount
                    </span>

                    <span className="text-xs font-semibold text-[#172033]">
                      On request
                    </span>

                  </div>

                  <p className="mt-0.5 text-[9px] leading-3.5 text-[#94A3B8]">
                    Our team will confirm availability,
                    pricing and final booking details.
                  </p>

                </div>

                {/* SECURITY */}

                <div className="rounded-lg border border-[#E9E2D8] bg-[#FCFBF8] p-2.5">

                  <div className="flex gap-2">

                    <ShieldCheck
                      size={15}
                      className="mt-0.5 shrink-0 text-[#C87532]"
                    />

                    <div>

                      <p className="text-[10px] font-semibold">
                        Secure enquiry
                      </p>

                      <p className="mt-0.5 text-[9px] leading-3.5 text-[#7B8798]">
                        Your contact details are used only
                        to process your booking request.
                      </p>

                    </div>

                  </div>

                </div>

                {/* DESKTOP BUTTON */}

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submitted}
                  className="mt-3 hidden h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#C87532] px-3 text-[11px] font-semibold text-white transition hover:bg-[#B96928] disabled:cursor-not-allowed disabled:opacity-70 lg:flex"
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 size={14} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Booking Request
                    </>
                  )}
                </button>

                <p className="mt-2 text-center text-[8px] leading-3.5 text-[#A0A9B5]">
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