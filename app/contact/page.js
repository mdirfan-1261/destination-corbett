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
        : "",

    hotel: hotelName || "",
    safariType: safariName || "",
  }));

  // =====================================================
  // FIX: Next.js App Router same-route navigation par
  // component remount nahi hota, isliye useState() ka
  // initializer dobara nahi chalta jab tum ek listing card
  // se doosre pe navigate karte ho (dono /contact route hi hain,
  // sirf query params badalte hain). Ye useEffect ensure karta
  // hai ki jab bhi URL ke hotel/safari params badlein,
  // formData bhi turant sync ho jaye.
  // =====================================================

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      inquiryType: isSelectedHotel
        ? "hotel-enquiry"
        : isSelectedSafari
          ? "safari-enquiry"
          : prev.inquiryType,
      hotel: hotelName || prev.hotel,
      safariType: safariName || prev.safariType,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelName, safariName, isSelectedHotel, isSelectedSafari]);

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
    formData.inquiryType === "transportation";

  // ================= SUBMIT =================

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus("Submitting...");

    try {
      // Frontend values ko backend ke actual enum values
      // mein convert kar rahe hain.
      const inquiryTypeMap = {
        "hotel-booking": "Hotel Booking",
        "hotel-enquiry": "Hotel Enquiry",
        "safari-booking": "Safari Booking",
        "safari-enquiry": "Safari Enquiry",
        "packages": "Packages",
        "events": "Events",
        "mice-events": "MICE & Corporate Events",
        "destination-wedding": "Destination Wedding",
        "transportation": "Transportation",
        "general-enquiry": "General Enquiry",
      };

      // ================= DATA SENT TO BACKEND =================

      const enquiryData = {
        // Kis cheez ki enquiry hai
        inquiryType:
          inquiryTypeMap[formData.inquiryType] ||
          "General Enquiry",

        // ================= HOTEL =================

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

        // ================= SAFARI =================

        safariType: isSafari
          ? formData.safariType
          : "",

        safariDate: isSafari
          ? formData.date
          : "",

        preferredTime: isSafari
          ? formData.preferredTime
          : "",

        // ✅ YAHAN CHANGE KIYA HAI:
        // Safari me Safari ka zone jayega,
        // Wedding/Event me formData.location jayega!
        zone: isSafari
          ? formData.zone
          : (formData.location || ""),

        // ================= CUSTOMER =================

        name: formData.name,

        company: formData.company,

        phone: formData.phone,

        email: formData.email,

        location: formData.location || "",

        // ================= COMMON =================

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

      <section className="relative h-[280px] sm:h-[320px] md:h-[350px] overflow-hidden">

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
          <div className="absolute inset-0 bg-[#172033]" />
        )}

        <div className="absolute inset-0 bg-black/16" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 h-full flex items-center">

          <div className="max-w-2xl text-white">

            <p className="text-xs sm:text-sm font-semibold tracking-[3px] text-[#C88A3D] mb-3">

              {isSelectedHotel
                ? "HOTEL ENQUIRY"
                : isSelectedSafari
                  ? "SAFARI ENQUIRY"
                  : "GET IN TOUCH"}

            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">

              {isSelectedHotel ||
              isSelectedSafari ? (
                selectedName
              ) : (
                <>
                  Plan Your

                  <span className="block">
                    Corbett Experience
                  </span>
                </>
              )}

            </h1>

            {(isSelectedHotel ||
              isSelectedSafari) && (
              <div className="flex items-center gap-2 mt-4 text-sm sm:text-base text-white/85">

                <MapPin
                  size={17}
                  className="text-[#C88A3D] shrink-0"
                />

                <span>
                  {selectedLocation}
                </span>

              </div>
            )}

            <p className="mt-3 text-sm sm:text-base text-white/75 leading-6 max-w-xl">

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

      <section className="py-10 sm:py-14 md:py-16">

        <div className="max-w-6xl mx-auto px-5 sm:px-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">

            {/* ================= LEFT INFO ================= */}

            <div className="md:col-span-1 lg:col-span-2 lg:sticky lg:top-6 lg:self-start">

              <div className="bg-[#172033] rounded-2xl overflow-hidden shadow-xl">

                {/* CARD HEADER */}

                <div className="relative h-[220px] sm:h-[240px] overflow-hidden">

                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt={selectedName}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2A3B54] via-[#172033] to-[#101827]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  {!selectedImage && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Trees size={190} />
                    </div>
                  )}

                  <div className="absolute bottom-5 left-5 right-5">

                    <p className="text-[10px] sm:text-xs tracking-[2px] text-[#C88A3D] font-semibold">

                      {isSelectedHotel
                        ? "HOTEL ENQUIRY"
                        : isSelectedSafari
                          ? "SAFARI ENQUIRY"
                          : "DESTINATION CORBETT"}

                    </p>

                    <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white leading-snug">

                      {selectedName}

                    </h2>

                  </div>

                </div>

                {/* CARD CONTENT */}

                <div className="p-5 sm:p-6 text-white">

                  <div className="flex items-start gap-3">

                    <MapPin
                      size={18}
                      className="text-[#C88A3D] shrink-0 mt-0.5"
                    />

                    <div>

                      <p className="text-xs text-white/45">
                        Location
                      </p>

                      <p className="text-sm font-semibold text-white/85">
                        {selectedLocation}
                      </p>

                    </div>

                  </div>

                  <p className="mt-4 text-sm text-white/60 leading-6">

                    {isSelectedHotel
                      ? `Send your requirement for ${hotelName} and our team will help you with your stay.`
                      : isSelectedSafari
                        ? `Send your requirement for ${safariName} and our team will help you plan your safari.`
                        : "Get in touch with our team for help with hotels, safaris, transport, events and other Jim Corbett experiences."}

                  </p>

                  {/* INFO BOXES */}

                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <div className="border border-white/10 rounded-xl p-4">

                      <Hotel
                        size={18}
                        className="text-[#C88A3D]"
                      />

                      <p className="mt-2 text-xs text-white/45">
                        Stays
                      </p>

                      <p className="text-sm font-semibold mt-1">
                        Hotels & Resorts
                      </p>

                    </div>

                    <div className="border border-white/10 rounded-xl p-4">

                      <Trees
                        size={18}
                        className="text-[#C88A3D]"
                      />

                      <p className="mt-2 text-xs text-white/45">
                        Experiences
                      </p>

                      <p className="text-sm font-semibold mt-1">
                        Safari & Events
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* CONTACT DETAILS */}

              <div className="mt-5 space-y-3">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-white border border-white/70 flex items-center justify-center shadow-sm">

                    <Phone
                      size={17}
                      className="text-[#C88A3D]"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Call us
                    </p>

                    <p className="text-sm font-semibold text-[#172033]">
                      +91 9205299338
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-white border border-white/70 flex items-center justify-center shadow-sm">

                    <Mail
                      size={17}
                      className="text-[#C88A3D]"
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-xs text-gray-500">
                      Email us
                    </p>

                    <p className="text-sm font-semibold text-[#172033] break-all">
                      marketing@texora.ai
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= FORM ================= */}

            <div className="md:col-span-1 lg:col-span-3">

              <div className="rounded-3xl bg-white/45 backdrop-blur-2xl border border-white/70 shadow-2xl p-5 sm:p-7 md:p-8">

                <p className="text-xs sm:text-sm font-semibold tracking-[2px] text-[#C88A3D]">
                  SEND YOUR REQUIREMENT
                </p>

                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#172033]">
                  Tell us what you need
                </h2>

                <p className="mt-2 text-sm text-gray-500 leading-6">
                  Share your requirement and our team will get back to you.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4"
                >

                  {/* NAME + COMPANY */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 px-4 py-3 text-sm text-[#172033] placeholder:text-gray-500 outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                    />

                    <input
                      type="text"
                      name="company"
                      placeholder="Company / Agency"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 px-4 py-3 text-sm text-[#172033] placeholder:text-gray-500 outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                    />

                  </div>

                  {/* PHONE + EMAIL */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 px-4 py-3 text-sm text-[#172033] placeholder:text-gray-500 outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 px-4 py-3 text-sm text-[#172033] placeholder:text-gray-500 outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                    />

                  </div>

                  {/* INQUIRY TYPE */}

                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInquiryChange}
                    required
                    className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 px-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
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
                        className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 px-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="relative">

                          <CalendarDays
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                          />

                          <input
                            type="date"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                          />

                        </div>

                        <div className="relative">

                          <CalendarDays
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                          />

                          <input
                            type="date"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                          />

                        </div>

                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="relative">

                          <Users
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                          />

                          <input
                            type="number"
                            name="guests"
                            placeholder="Number of guests"
                            value={formData.guests}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] placeholder:text-gray-500 outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                          />

                        </div>

                        <div className="relative">

                          <Hotel
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                          />

                          <input
                            type="number"
                            name="rooms"
                            placeholder="Rooms required"
                            value={formData.rooms}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] placeholder:text-gray-500 outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
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
                        className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 px-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="relative">

                          <CalendarDays
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                          />

                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                          />

                        </div>

                        <div className="relative">

                          <Clock3
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                          />

                          <select
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="relative">

                          <Users
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                          />

                          <input
                            type="number"
                            name="guests"
                            placeholder="Number of guests"
                            value={formData.guests}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] placeholder:text-gray-500 outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                          />

                        </div>

                        <div className="relative">

                          <MapPin
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                          />

                          <select
                            name="zone"
                            value={formData.zone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
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
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    {/* DATE */}

    <div className="relative">

      <CalendarDays
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
      />

    </div>

    {/* GUESTS */}

    <div className="relative">

      <Users
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
      />

      <input
        type="number"
        name="guests"
        placeholder="Number of guests"
        value={formData.guests}
        onChange={handleChange}
        min="1"
        className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] placeholder:text-gray-500 outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
      />

    </div>

    {/* LOCATION */}

    <div className="relative">

      <MapPin
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
      />

      <select
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 pl-11 pr-4 py-3 text-sm text-[#172033] outline-none focus:bg-white/70 focus:border-[#C88A3D] transition"
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
                    rows={5}
                    className="w-full rounded-xl bg-white/55 backdrop-blur-md border border-white/80 px-4 py-3 text-sm text-[#172033] placeholder:text-gray-500 outline-none resize-none focus:bg-white/70 focus:border-[#C88A3D] transition"
                  />

                  {/* ================= STATUS ================= */}

                  {status && (
                    <div
                      className={`text-sm text-center font-semibold rounded-xl px-4 py-3 ${
                        status.includes("successfully")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : status === "Submitting..."
                            ? "bg-gray-50 text-[#172033] border border-gray-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {status}
                    </div>
                  )}

                  {/* ================= BUTTON ================= */}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#C88A3D] text-white text-sm sm:text-base font-semibold rounded-xl py-3.5 hover:bg-[#A96F2E] disabled:opacity-60 disabled:cursor-not-allowed transition"
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