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
    isSelectedHotel,
    isSelectedSafari,
    isSelectedWedding,
  ]);

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      location: "",
      preferredTime: "Morning",
      zone: "",
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
    formData.inquiryType === "mice-events" ||
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
        "mice-events": "MICE & Corporate Events",
        "destination-wedding": "Destination Wedding",
        transportation: "Transportation",
        "general-enquiry": "General Enquiry",
      };

      const enquiryData = {
        inquiryType:
          inquiryTypeMap[formData.inquiryType] ||
          "General Enquiry",

        hotel: isHotel
          ? formData.hotel ||
            hotelName ||
            "Hotel Enquiry"
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
          : formData.location || "",

        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        location: formData.location || "",
        guests: Number(formData.guests) || 0,
        message: formData.message,
      };

      console.log(
        "Enquiry data being sent:",
        enquiryData
      );

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
        console.error("BACKEND ERROR:", {
          status: response.status,
          data,
        });

        throw new Error(
          data.error ||
            data.message ||
            `Request failed with status ${response.status}`
        );
      }

      console.log(
        "Enquiry submitted:",
        data
      );

      setStatus(
        data.message ||
          "Enquiry submitted successfully!"
      );

      setFormData(initialFormData);

      setTimeout(() => {
        setStatus("");
      }, 3000);
    } catch (error) {
      console.error(
        "Enquiry form error:",
        error
      );

      setStatus(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5F0]">

      {/* ================= HERO ================= */}

      <section className="relative h-[250px] overflow-hidden sm:h-[320px] md:h-[350px]">

        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={selectedName}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#18352A]" />
        )}

        <div className="absolute inset-0 bg-[#172033]/20" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#172033]/85 via-[#172033]/55 to-[#18352A]/25" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4 sm:px-6">

          <div className="max-w-2xl text-white">

            <p className="mb-2.5 text-[10px] font-semibold tracking-[2px] text-[#C87532] sm:mb-3 sm:text-sm sm:tracking-[3px]">
              {isSelectedHotel
                ? "HOTEL ENQUIRY"
                : isSelectedSafari
                  ? "SAFARI ENQUIRY"
                  : "GET IN TOUCH"}
            </p>

            <h1 className="text-[27px] font-bold leading-[1.08] sm:text-4xl md:text-5xl">
              {isSelectedHotel ||
              isSelectedSafari ? (
                selectedName
              ) : (
                <>
                  Plan Your

                  <span className="block text-[#C87532]">
                    Corbett Experience
                  </span>
                </>
              )}
            </h1>

            {(isSelectedHotel ||
              isSelectedSafari) && (
              <div className="mt-2.5 flex items-center gap-2 text-xs text-white/85 sm:mt-4 sm:text-sm md:text-base">

                <MapPin
                  size={16}
                  className="shrink-0 text-[#C87532]"
                />

                <span>
                  {selectedLocation}
                </span>

              </div>
            )}

            <p className="mt-2.5 max-w-xl text-[12px] leading-5 text-white/75 sm:mt-3 sm:text-base sm:leading-6">
              {isSelectedHotel
                ? "Tell us your requirements and our team will help you plan your stay."
                : isSelectedSafari
                  ? "Tell us your requirements and our team will help you plan your safari experience."
                  : "Tell us what you are looking for and our team will help you plan your stay, safari, events or other Jim Corbett experiences."}
            </p>

          </div>

        </div>

      </section>

      {/* ================= MAIN ================= */}

      <section className="py-7 sm:py-14 md:py-16">

        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">

            {/* ================= LEFT INFO ================= */}

            <div className="md:col-span-1 lg:col-span-2 lg:sticky lg:top-6 lg:self-start">

              <div className="overflow-hidden rounded-2xl bg-[#18352A] shadow-xl">

                {/* CARD HEADER */}

                <div className="relative h-[190px] overflow-hidden sm:h-[240px]">

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

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/90 via-[#18352A]/30 to-transparent" />

                  {!selectedImage && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Trees size={190} />
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">

                    <p className="text-[10px] font-semibold tracking-[2px] text-[#C87532] sm:text-xs">
                      {isSelectedHotel
                        ? "HOTEL ENQUIRY"
                        : isSelectedSafari
                          ? "SAFARI ENQUIRY"
                          : "DESTINATION CORBETT"}
                    </p>

                    <h2 className="mt-1.5 text-lg font-bold leading-snug text-white sm:mt-2 sm:text-2xl">
                      {selectedName}
                    </h2>

                  </div>

                </div>

                {/* CARD CONTENT */}

                <div className="p-4 text-white sm:p-6">

                  <div className="flex items-start gap-3">

                    <MapPin
                      size={17}
                      className="mt-0.5 shrink-0 text-[#C87532]"
                    />

                    <div>

                      <p className="text-[11px] text-white/45 sm:text-xs">
                        Location
                      </p>

                      <p className="text-[13px] font-semibold text-white/85 sm:text-sm">
                        {selectedLocation}
                      </p>

                    </div>

                  </div>

                  <p className="mt-3 text-[12px] leading-5 text-white/60 sm:mt-4 sm:text-sm sm:leading-6">
                    {isSelectedHotel
                      ? `Send your requirement for ${hotelName} and our team will help you with your stay.`
                      : isSelectedSafari
                        ? `Send your requirement for ${safariName} and our team will help you plan your safari.`
                        : "Get in touch with our team for help with hotels, safaris, transport, events and other Jim Corbett experiences."}
                  </p>

                  {/* INFO BOXES */}

                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">

                      <Hotel
                        size={17}
                        className="text-[#C87532]"
                      />

                      <p className="mt-1.5 text-[11px] text-white/45 sm:mt-2 sm:text-xs">
                        Stays
                      </p>

                      <p className="mt-0.5 text-[12px] font-semibold sm:mt-1 sm:text-sm">
                        Hotels & Resorts
                      </p>

                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">

                      <Trees
                        size={17}
                        className="text-[#C87532]"
                      />

                      <p className="mt-1.5 text-[11px] text-white/45 sm:mt-2 sm:text-xs">
                        Experiences
                      </p>

                      <p className="mt-0.5 text-[12px] font-semibold sm:mt-1 sm:text-sm">
                        Safari & Events
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* CONTACT DETAILS */}

              <div className="mt-4 space-y-3 sm:mt-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#18352A]/10 bg-white shadow-sm sm:h-10 sm:w-10">

                    <Phone
                      size={16}
                      className="text-[#C87532]"
                    />

                  </div>

                  <div>

                    <p className="text-[11px] text-[#172033]/45 sm:text-xs">
                      Call us
                    </p>

                    <p className="text-[13px] font-semibold text-[#18352A] sm:text-sm">
                      +91 9205299338
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#18352A]/10 bg-white shadow-sm sm:h-10 sm:w-10">

                    <Mail
                      size={16}
                      className="text-[#C87532]"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-[11px] text-[#172033]/45 sm:text-xs">
                      Email us
                    </p>

                    <p className="break-all text-[13px] font-semibold text-[#18352A] sm:text-sm">
                      marketing@texora.ai
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= FORM ================= */}

            <div className="md:col-span-1 lg:col-span-3">

              <div className="rounded-2xl border border-[#18352A]/10 bg-white p-4 shadow-[0_12px_40px_rgba(24,53,42,0.08)] sm:rounded-3xl sm:p-7 md:p-8">

                <p className="text-[10px] font-semibold tracking-[2px] text-[#C87532] sm:text-sm">
                  SEND YOUR REQUIREMENT
                </p>

                <h2 className="mt-1.5 text-[24px] font-bold text-[#18352A] sm:mt-2 sm:text-3xl">
                  Tell us what you need
                </h2>

                <p className="mt-1.5 text-[12px] leading-5 text-[#172033]/55 sm:mt-2 sm:text-sm sm:leading-6">
                  Share your requirement and our team will get back to you.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-5 space-y-3 sm:mt-6 sm:space-y-4"
                >

                  {/* NAME + COMPANY */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 px-4 py-3 text-[13px] text-[#172033] outline-none placeholder:text-[#172033]/45 transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                    />

                    <input
                      type="text"
                      name="company"
                      placeholder="Company / Agency"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 px-4 py-3 text-[13px] text-[#172033] outline-none placeholder:text-[#172033]/45 transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                    />

                  </div>

                  {/* PHONE + EMAIL */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 px-4 py-3 text-[13px] text-[#172033] outline-none placeholder:text-[#172033]/45 transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 px-4 py-3 text-[13px] text-[#172033] outline-none placeholder:text-[#172033]/45 transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                    />

                  </div>

                  {/* INQUIRY TYPE */}

                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInquiryChange}
                    required
                    className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 px-4 py-3 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
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

                  {/* ================= HOTEL ================= */}

                  {isHotel && (
                    <>

                      <select
                        name="hotel"
                        value={formData.hotel}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 px-4 py-3 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
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

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                        <div className="relative">

                          <CalendarDays
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="date"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                          />

                        </div>

                        <div className="relative">

                          <CalendarDays
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="date"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                          />

                        </div>

                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                        <div className="relative">

                          <Users
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="number"
                            name="guests"
                            placeholder="Number of guests"
                            value={formData.guests}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none placeholder:text-[#172033]/45 transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                          />

                        </div>

                        <div className="relative">

                          <Hotel
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="number"
                            name="rooms"
                            placeholder="Rooms required"
                            value={formData.rooms}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none placeholder:text-[#172033]/45 transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                          />

                        </div>

                      </div>

                    </>
                  )}

                  {/* ================= SAFARI ================= */}

                  {isSafari && (
                    <>

                      <select
                        name="safariType"
                        value={formData.safariType}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 px-4 py-3 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
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

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                        <div className="relative">

                          <CalendarDays
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                          />

                        </div>

                        <div className="relative">

                          <Clock3
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <select
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
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

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                        <div className="relative">

                          <Users
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <input
                            type="number"
                            name="guests"
                            placeholder="Number of guests"
                            value={formData.guests}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none placeholder:text-[#172033]/45 transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                          />

                        </div>

                        <div className="relative">

                          <MapPin
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                          />

                          <select
                            name="zone"
                            value={formData.zone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
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

                  {/* ================= OTHER SERVICES ================= */}

                  {isOther && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                      {/* DATE */}

                      <div className="relative">

                        <CalendarDays
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                        />

                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                        />

                      </div>

                      {/* GUESTS */}

                      <div className="relative">

                        <Users
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                        />

                        <input
                          type="number"
                          name="guests"
                          placeholder="Number of guests"
                          value={formData.guests}
                          onChange={handleChange}
                          min="1"
                          className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none placeholder:text-[#172033]/45 transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                        />

                      </div>

                      {/* LOCATION */}

                      <div className="relative">

                        <MapPin
                          size={17}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C87532]"
                        />

                        <select
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 py-3 pl-11 pr-4 text-[13px] text-[#172033] outline-none transition focus:border-[#C87532] focus:bg-white sm:text-sm"
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

                  {/* ================= MESSAGE ================= */}

                  <textarea
                    name="message"
                    placeholder="Tell us about your requirement..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#18352A]/10 bg-[#F7F5F0]/70 px-4 py-3 text-[13px] text-[#172033] outline-none placeholder:text-[#172033]/45 transition focus:border-[#C87532] focus:bg-white sm:text-sm"
                  />

                  {/* ================= STATUS ================= */}

                  {status && (
  <div
    className={`rounded-xl border px-4 py-3 text-center text-[12px] font-semibold sm:text-sm ${
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

                  {/* ================= BUTTON ================= */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C87532] py-3 text-[13px] font-semibold text-white transition hover:bg-[#B96928] disabled:cursor-not-allowed disabled:opacity-60 sm:py-3.5 sm:text-base"
                  >

                    {isSubmitting
                      ? "Submitting..."
                      : "Send Enquiry"}

                    {!isSubmitting && (
                      <Send size={17} />
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