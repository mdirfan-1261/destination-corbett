"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Hotel,
  MapPin,
  Send,
  Users,
  Clock3,
  Trees,
  Mail,
  Phone,
} from "lucide-react";

const initialFormData = {
  name: "",
  company: "",
  phone: "",
  email: "",
  inquiryType: "",
  hotel: "",
  safariType: "",
  date: "",
  checkIn: "",
  checkOut: "",
  guests: "",
  rooms: "",
  preferredTime: "Morning",
  zone: "",
  location: "",
  message: "",
};

function ContactPage() {
  const searchParams = useSearchParams();

  const hotelName = searchParams.get("hotel");
  const hotelImage = searchParams.get("hotelImage");

  const safariName = searchParams.get("safari");
  const safariImage = searchParams.get("image");

  const weddingVenueName = searchParams.get("venueName");
  const weddingImage = searchParams.get("venueImage");

  const urlLocation = searchParams.get("location");

  const isSelectedHotel = Boolean(hotelName);
  const isSelectedSafari = Boolean(safariName);
  const isSelectedWedding = Boolean(weddingVenueName);

  const selectedName =
    hotelName ||
    safariName ||
    weddingVenueName ||
    "Let's plan your Corbett experience";

  const selectedImage =
    hotelImage ||
    safariImage ||
    weddingImage ||
    null;

  const selectedLocation =
    urlLocation ||
    (isSelectedSafari
      ? "Jim Corbett National Park"
      : "Jim Corbett, Uttarakhand");

  const [formData, setFormData] = useState(() => ({
    ...initialFormData,

    inquiryType: isSelectedHotel
      ? "hotel-enquiry"
      : isSelectedSafari
        ? "safari-enquiry"
        : isSelectedWedding
          ? "destination-wedding"
          : "",

    hotel: hotelName || "",
    safariType: safariName || "",
    location: urlLocation || "",
  }));

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,

      inquiryType: isSelectedHotel
        ? "hotel-enquiry"
        : isSelectedSafari
          ? "safari-enquiry"
          : isSelectedWedding
            ? "destination-wedding"
            : prev.inquiryType,

      hotel: hotelName || prev.hotel,
      safariType: safariName || prev.safariType,
      location: urlLocation || prev.location,
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hotelName,
    safariName,
    weddingVenueName,
    urlLocation,
  ]);

  // ================= INPUT HANDLER =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setStatus("");
  };

  // ================= INQUIRY TYPE =================

  const handleInquiryChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      inquiryType: value,
      hotel: "",
      safariType: "",
      date: "",
      checkIn: "",
      checkOut: "",
      guests: "",
      rooms: "",
      preferredTime: "Morning",
      zone: "",
      location: "",
    }));

    setStatus("");
  };

  const isHotel =
    formData.inquiryType === "hotel-booking" ||
    formData.inquiryType === "hotel-enquiry";

  const isSafari =
    formData.inquiryType === "safari-booking" ||
    formData.inquiryType === "safari-enquiry";

  const isOther =
    formData.inquiryType === "packages" ||
    formData.inquiryType === "events" ||
    formData.inquiryType === "destination-wedding" ||
    formData.inquiryType === "transportation" ||
    formData.inquiryType === "general-enquiry";

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("Submitting...");

    try {
      const inquiryTypeMap = {
        "hotel-booking": "Hotel Booking",
        "hotel-enquiry": "Hotel Enquiry",
        "safari-booking": "Safari Booking",
        "safari-enquiry": "Safari Enquiry",
        packages: "Packages",
        events: "Events",
        "destination-wedding": "Destination Wedding",
        transportation: "Transportation",
        "general-enquiry": "General Enquiry",
      };

      const enquiryData = {
        inquiryType:
          inquiryTypeMap[formData.inquiryType] ||
          "General Enquiry",

        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,

        hotel: isHotel
          ? formData.hotel || hotelName || ""
          : "",

        checkIn: isHotel
          ? formData.checkIn
          : "",

        checkOut: isHotel
          ? formData.checkOut
          : "",

        rooms: isHotel
          ? Number(formData.rooms) || 0
          : 0,

        safariType: isSafari
          ? formData.safariType
          : "",

        safariDate: isSafari
          ? formData.date
          : "",

        preferredTime: isSafari
          ? formData.preferredTime
          : "",

        zone: isSafari
          ? formData.zone
          : "",

        location: formData.location || "",

        guests: Number(formData.guests) || 0,

        message: formData.message,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enquiryData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Request failed with status ${response.status}`
        );
      }

      setStatus(
        data.message ||
          "Enquiry submitted successfully!"
      );

      setFormData(initialFormData);

      setTimeout(() => {
        setStatus("");
      }, 3000);
    } catch (error) {
      console.error("Enquiry form error:", error);

      setStatus(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= COMMON CLASSES =================

  const inputClass =
    "w-full rounded-xl border border-[#18352A]/15 bg-[#F9F8F5] px-3.5 py-2.5 text-sm text-[#172033] outline-none placeholder:text-[#172033]/45 transition-all duration-200 focus:border-[#C87532] focus:bg-white focus:ring-2 focus:ring-[#C87532]/15 sm:px-4 sm:py-2.5";

  const selectClass =
    "w-full rounded-xl border border-[#18352A]/15 bg-[#F9F8F5] px-3.5 py-2.5 text-sm text-[#172033] outline-none transition-all duration-200 focus:border-[#C87532] focus:bg-white focus:ring-2 focus:ring-[#C87532]/15 sm:px-4 sm:py-2.5";

  const inputWithIconClass =
    "w-full rounded-xl border border-[#18352A]/15 bg-[#F9F8F5] pl-10 pr-3.5 py-2.5 text-sm text-[#172033] outline-none placeholder:text-[#172033]/45 transition-all duration-200 focus:border-[#C87532] focus:bg-white focus:ring-2 focus:ring-[#C87532]/15 sm:pl-10 sm:pr-4 sm:py-2.5";

  const selectWithIconClass =
    "w-full rounded-xl border border-[#18352A]/15 bg-[#F9F8F5] pl-10 pr-3.5 py-2.5 text-sm text-[#172033] outline-none transition-all duration-200 focus:border-[#C87532] focus:bg-white focus:ring-2 focus:ring-[#C87532]/15 sm:pl-10 sm:pr-4 sm:py-2.5";

  return (
    <main className="min-h-screen bg-[#F7F5F0]">

      {/* =====================================================
          HERO BANNER (ULTRA-PREMIUM & COMPACT)
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E1F18] via-[#18352A] to-[#122A21] py-6 text-white sm:py-8">

        {/* TOP COPPER GLOW LINE */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C87532] to-transparent opacity-80" />

        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={selectedName}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-15"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#18352A]/80 to-[#172033]/90" />
        )}

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* LEFT: TEXT */}

            <div className="max-w-xl">

              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C87532]/35 bg-[#C87532]/15 px-3 py-0.5 text-[10px] font-bold tracking-widest text-[#C87532] uppercase sm:text-xs">

                <span className="h-1.5 w-1.5 rounded-full bg-[#C87532] animate-pulse" />

                {isSelectedHotel
                  ? "HOTEL ENQUIRY"
                  : isSelectedSafari
                    ? "SAFARI ENQUIRY"
                    : "DESTINATION CORBETT"}

              </span>

              <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
                {isSelectedHotel || isSelectedSafari ? (
                  selectedName
                ) : (
                  <>
                    Plan Your{" "}
                    <span className="bg-gradient-to-r from-[#E59754] via-[#C87532] to-[#D9843F] bg-clip-text text-transparent">
                      Corbett Experience
                    </span>
                  </>
                )}
              </h1>

              {(isSelectedHotel ||
                isSelectedSafari) && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/90">

                  <MapPin
                    size={14}
                    className="shrink-0 text-[#C87532]"
                  />

                  <span>
                    {selectedLocation}
                  </span>

                </div>
              )}

              <p className="mt-1.5 text-xs leading-relaxed text-white/75 sm:text-sm">
                {isSelectedHotel
                  ? "Tell us your requirements and our team will help you plan your stay."
                  : isSelectedSafari
                    ? "Tell us your requirements and our team will help you plan your safari experience."
                    : "Tell us what you are looking for and our team will help you plan your stay, safari, events or other Jim Corbett experiences."}
              </p>

            </div>

            {/* QUICK CONTACT ACTION BAR */}

            <div className="flex items-center gap-2 pt-1 sm:pt-0">

              <a
                href="tel:+919205299338"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-[#C87532]/50 active:scale-[0.98] sm:flex-initial"
              >

                <Phone
                  size={14}
                  className="text-[#C87532]"
                />

                <div className="text-left">

                  <p className="text-[9px] uppercase tracking-wider text-white/60 font-medium">
                    Call Us
                  </p>

                  <p className="text-xs font-semibold text-white">
                    +91 9205299338
                  </p>

                </div>

              </a>

              <a
                href="mailto:marketing@texora.ai"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-[#C87532]/50 active:scale-[0.98] sm:flex-initial"
              >

                <Mail
                  size={14}
                  className="text-[#C87532]"
                />

                <div className="text-left min-w-0">

                  <p className="text-[9px] uppercase tracking-wider text-white/60 font-medium">
                    Email Us
                  </p>

                  <p className="truncate text-xs font-semibold text-white">
                    marketing@texora.ai
                  </p>

                </div>

              </a>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="py-4 sm:py-8">

        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-6">

            {/* =================================================
                LEFT SIDEBAR (INFO CARD + CONTACTS + MAP)
            ================================================== */}

            <div className="space-y-3 md:col-span-1 lg:col-span-2 lg:sticky lg:top-6 lg:self-start">

              {/* GREEN INFO CARD */}

              <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#18352A] to-[#11271F] border border-[#254F3F] shadow-lg">

                {/* IMAGE */}

                <div className="relative h-[130px] overflow-hidden sm:h-[180px]">

                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt={selectedName}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#28513E] via-[#18352A] to-[#172033]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#11271F] via-[#18352A]/40 to-transparent" />

                  {!selectedImage && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Trees size={100} />
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4">

                    <span className="inline-block rounded-md bg-[#C87532]/90 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase">
                      {isSelectedHotel
                        ? "HOTEL ENQUIRY"
                        : isSelectedSafari
                          ? "SAFARI ENQUIRY"
                          : "DESTINATION CORBETT"}
                    </span>

                    <h2 className="mt-1 text-base font-bold leading-snug text-white sm:text-xl">
                      {selectedName}
                    </h2>

                  </div>

                </div>

                {/* INFO CONTENT */}

                <div className="p-3.5 text-white sm:p-4">

                  <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-sm">

                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-[#C87532]"
                    />

                    <div>

                      <p className="text-[10px] uppercase tracking-wider text-white/50 font-medium">
                        Location
                      </p>

                      <p className="text-xs font-semibold text-white/90 sm:text-sm">
                        {selectedLocation}
                      </p>

                    </div>

                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed text-white/75">
                    {isSelectedHotel
                      ? `Send your requirement for ${hotelName} and our team will help you with your stay.`
                      : isSelectedSafari
                        ? `Send your requirement for ${safariName} and our team will help you plan your safari.`
                        : "Get in touch with our team for help with hotels, safaris, transport, events and other Jim Corbett experiences."}
                  </p>

                  {/* TWO SMALL CARDS */}

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10">

                      <Hotel
                        size={16}
                        className="text-[#C87532]"
                      />

                      <p className="mt-1 text-[10px] text-white/50 uppercase tracking-wider font-medium">
                        Stays
                      </p>

                      <p className="text-xs font-semibold text-white">
                        Hotels & Resorts
                      </p>

                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition hover:bg-white/10">

                      <Trees
                        size={16}
                        className="text-[#C87532]"
                      />

                      <p className="mt-1 text-[10px] text-white/50 uppercase tracking-wider font-medium">
                        Experiences
                      </p>

                      <p className="text-xs font-semibold text-white">
                        Safari & Events
                      </p>

                    </div>

                  </div>

                </div>
              </div>

              {/* CLICKABLE CONTACT DETAILS CARDS */}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">

                <a
                  href="tel:+919205299338"
                  className="group flex items-center gap-3 rounded-2xl border border-[#18352A]/10 bg-white p-3 shadow-sm transition-all duration-200 hover:border-[#C87532]/50 hover:shadow-md active:scale-[0.98] cursor-pointer"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C87532]/10 text-[#C87532] transition-colors group-hover:bg-[#C87532] group-hover:text-white">

                    <Phone
                      size={15}
                    />

                  </div>

                  <div>

                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#172033]/50">
                      Call us
                    </p>

                    <p className="text-xs font-bold text-[#18352A] transition-colors group-hover:text-[#C87532] sm:text-sm">
                      +91 9205299338
                    </p>

                  </div>

                </a>

                <a
                  href="mailto:marketing@texora.ai"
                  className="group flex items-center gap-3 rounded-2xl border border-[#18352A]/10 bg-white p-3 shadow-sm transition-all duration-200 hover:border-[#C87532]/50 hover:shadow-md active:scale-[0.98] cursor-pointer"
                >

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C87532]/10 text-[#C87532] transition-colors group-hover:bg-[#C87532] group-hover:text-white">

                    <Mail
                      size={15}
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#172033]/50">
                      Email us
                    </p>

                    <p className="break-all text-xs font-bold text-[#18352A] transition-colors group-hover:text-[#C87532] sm:text-sm">
                      marketing@texora.ai
                    </p>

                  </div>

                </a>

              </div>

              {/* EMBEDDED GOOGLE MAP CARD */}

              <div className="overflow-hidden rounded-2xl border border-[#18352A]/10 bg-white shadow-sm">

                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">

                  <div className="min-w-0">

                    <p className="text-[10px] font-bold tracking-wider text-[#C87532] uppercase">
                      FIND US
                    </p>

                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-semibold text-[#18352A]">

                      <MapPin
                        size={13}
                        className="shrink-0 text-[#C87532]"
                      />

                      Jim Corbett National Park, Uttarakhand

                    </p>

                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Jim+Corbett+National+Park+Ramnagar+Uttarakhand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg bg-gradient-to-r from-[#C87532] to-[#B86625] px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition-all hover:brightness-105 active:scale-[0.97]"
                  >
                    View Map
                  </a>

                </div>

                <div className="h-[135px] w-full sm:h-[150px]">

                  <iframe
                    title="Jim Corbett National Park Map"
                    src="https://www.google.com/maps?q=Jim%20Corbett%20National%20Park%2C%20Ramnagar%2C%20Uttarakhand&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                RIGHT FORM CARD
            ================================================== */}

            <div className="md:col-span-1 lg:col-span-3">

              <div className="rounded-2xl border border-[#18352A]/10 bg-white p-4 shadow-[0_8px_30px_rgba(24,53,42,0.06)] sm:rounded-3xl sm:p-6 md:p-7">

                <p className="text-xs font-bold tracking-wider text-[#C87532] uppercase">
                  SEND YOUR REQUIREMENT
                </p>

                <h2 className="mt-0.5 text-xl font-bold leading-tight text-[#18352A] sm:text-2xl">
                  Tell us what you need
                </h2>

                <p className="mt-1 text-xs text-[#172033]/60">
                  Share your requirement and our team will get back to you.
                </p>

                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5"
                >

                  {/* NAME + COMPANY */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">

                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />

                    <input
                      type="text"
                      name="company"
                      placeholder="Company / Agency"
                      value={formData.company}
                      onChange={handleChange}
                      className={inputClass}
                    />

                  </div>

                  {/* PHONE + EMAIL */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />

                  </div>

                  {/* INQUIRY TYPE */}

                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInquiryChange}
                    required
                    className={selectClass}
                  >
                    <option value="">
                      How can we help you?
                    </option>

                    <option value="hotel-booking">
                      Hotel Booking
                    </option>

                    <option value="hotel-enquiry">
                      Hotel Enquiry
                    </option>

                    <option value="safari-booking">
                      Safari Booking
                    </option>

                    <option value="safari-enquiry">
                      Safari Enquiry
                    </option>

                    <option value="packages">
                      Packages
                    </option>

                    <option value="events">
                      Events
                    </option>

                    <option value="destination-wedding">
                      Destination Wedding
                    </option>

                    <option value="transportation">
                      Transportation
                    </option>

                    <option value="general-enquiry">
                      General Enquiry
                    </option>

                  </select>

                  {/* =================================================
                      HOTEL FIELDS
                  ================================================== */}

                  {isHotel && (
                    <>
                      <select
                        name="hotel"
                        value={formData.hotel}
                        onChange={handleChange}
                        required
                        className={selectClass}
                      >
                        <option value="">
                          Select Hotel
                        </option>

                        <option value="Corbett Nature Retreat">
                          Corbett Nature Retreat
                        </option>

                        <option value="Other Hotel">
                          Other Hotel
                        </option>
                      </select>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">

                        <div className="relative">

                          <CalendarDays
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="date"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleChange}
                            required
                            className={inputWithIconClass}
                          />

                        </div>

                        <div className="relative">

                          <CalendarDays
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="date"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleChange}
                            required
                            className={inputWithIconClass}
                          />

                        </div>

                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">

                        <div className="relative">

                          <Users
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="number"
                            name="guests"
                            placeholder="Number of guests"
                            value={formData.guests}
                            onChange={handleChange}
                            min="1"
                            required
                            className={inputWithIconClass}
                          />

                        </div>

                        <div className="relative">

                          <Hotel
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="number"
                            name="rooms"
                            placeholder="Rooms required"
                            value={formData.rooms}
                            onChange={handleChange}
                            min="1"
                            required
                            className={inputWithIconClass}
                          />

                        </div>

                      </div>
                    </>
                  )}

                  {/* =================================================
                      SAFARI FIELDS
                  ================================================== */}

                  {isSafari && (
                    <>
                      <select
                        name="safariType"
                        value={formData.safariType}
                        onChange={handleChange}
                        required
                        className={selectClass}
                      >
                        <option value="">
                          Select Safari
                        </option>

                        <option value="Jeep Safari">
                          Jeep Safari
                        </option>

                        <option value="Canter Safari">
                          Canter Safari
                        </option>

                        <option value="Elephant Safari">
                          Elephant Safari
                        </option>
                      </select>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">

                        <div className="relative">

                          <CalendarDays
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className={inputWithIconClass}
                          />

                        </div>

                        <div className="relative">

                          <Clock3
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <select
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                            required
                            className={selectWithIconClass}
                          >
                            <option value="Morning">
                              Morning
                            </option>

                            <option value="Afternoon">
                              Afternoon
                            </option>

                            <option value="Evening">
                              Evening
                            </option>

                          </select>

                        </div>

                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">

                        <div className="relative">

                          <Users
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="number"
                            name="guests"
                            placeholder="Number of guests"
                            value={formData.guests}
                            onChange={handleChange}
                            min="1"
                            required
                            className={inputWithIconClass}
                          />

                        </div>

                        <div className="relative">

                          <MapPin
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <select
                            name="zone"
                            value={formData.zone}
                            onChange={handleChange}
                            required
                            className={selectWithIconClass}
                          >
                            <option value="">
                              Preferred Zone
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

                            <option value="Dhela">
                              Dhela
                            </option>

                            <option value="Sitabani">
                              Sitabani
                            </option>

                          </select>

                        </div>

                      </div>
                    </>
                  )}

                  {/* =================================================
                      OTHER ENQUIRIES
                  ================================================== */}

                  {isOther && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">

                      <div className="relative">

                        <CalendarDays
                          size={16}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                        />

                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={inputWithIconClass}
                        />

                      </div>

                      <div className="relative">

                        <Users
                          size={16}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                        />

                        <input
                          type="number"
                          name="guests"
                          placeholder="Number of guests"
                          value={formData.guests}
                          onChange={handleChange}
                          min="1"
                          className={inputWithIconClass}
                        />

                      </div>

                      <div className="relative sm:col-span-2">

                        <MapPin
                          size={16}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87532]"
                        />

                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className={selectWithIconClass}
                        >
                          <option value="">
                            Preferred Location
                          </option>

                          <option value="Dhikuli">
                            Dhikuli
                          </option>

                          <option value="Ramnagar">
                            Ramnagar
                          </option>

                          <option value="Near Kosi River">
                            Near Kosi River
                          </option>

                          <option value="Jim Corbett">
                            Jim Corbett
                          </option>

                          <option value="Other">
                            Other
                          </option>

                        </select>

                      </div>

                    </div>
                  )}

                  {/* =================================================
                      MESSAGE
                  ================================================== */}

                  <textarea
                    name="message"
                    placeholder="Tell us about your requirement..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={2.5}
                    className={`${inputClass} resize-none`}
                  />

                  {/* =================================================
                      STATUS
                  ================================================== */}

                  {status && (
                    <div
                      className={`rounded-xl border px-3.5 py-2.5 text-center text-xs font-semibold sm:px-4 sm:py-3 ${
                        status.includes("successfully")
                          ? "border-green-200 bg-green-50 text-green-700"
                          : status === "Submitting..."
                            ? "border-[#18352A]/10 bg-[#F7F5F0] text-[#172033]"
                            : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {status}
                    </div>
                  )}

                  {/* =================================================
                      SEND BUTTON
                  ================================================== */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C87532] to-[#B86625] py-3 text-sm font-semibold text-white shadow-md shadow-[#C87532]/25 transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Send Enquiry"}

                    {!isSubmitting && (
                      <Send size={15} />
                    )}
                  </button>

                </form>
              </div>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

export default function ContactPageWrapper() {
  return (
    <Suspense fallback={null}>
      <ContactPage />
    </Suspense>
  );
}