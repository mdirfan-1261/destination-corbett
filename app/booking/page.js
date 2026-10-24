
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

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

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

const getToday = () => {
  const now = new Date();
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 10);
};

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (value) => {
  if (!value) return "Not selected";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isMongoId = (value) =>
  /^[a-f\d]{24}$/i.test(String(value || ""));

const getFirstValidPrice = (...values) => {
  for (const value of values) {
    if (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0
    ) {
      return Number(value);
    }
  }

  return null;
};

async function readApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(
      `Server ne JSON response nahi diya (HTTP ${response.status}). Backend URL aur API route check karein.`
    );
  }

  return response.json();
}

function getApiError(result, fallback) {
  return (
    result?.message ||
    result?.error ||
    result?.errors?.[0]?.message ||
    fallback
  );
}

function getPropertyPayload(result) {
  const first = result?.data ?? result;
  const nested = first?.data ?? first;

  const property =
    nested?.property ||
    nested?.item ||
    nested?.propertyDetails ||
    (nested?._id ? nested : null);

  const rooms = Array.isArray(nested?.rooms)
    ? nested.rooms
    : Array.isArray(property?.rooms)
      ? property.rooms
      : [];

  return { property, rooms };
}

function getRoomName(room) {
  return (
    room?.name ||
    room?.roomName ||
    room?.title ||
    room?.roomType ||
    room?.type ||
    "Room"
  );
}

function getRoomPrice(room) {
  return getFirstValidPrice(
    room?.basePrice,
    room?.pricePerNight,
    room?.price,
    room?.pricing?.basePrice,
    room?.pricing?.pricePerNight,
    room?.rates?.basePrice,
    room?.tariff
  );
}

function getPropertyName(property) {
  return (
    property?.name ||
    property?.propertyName ||
    property?.title ||
    property?.businessName ||
    ""
  );
}

function getPropertyLocation(property) {
  return [
    property?.locality,
    property?.city,
    property?.district,
    property?.location?.city,
  ]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");
}

export default function BookingPage() {
  const router = useRouter();

  const [bookingData, setBookingData] = useState({
    type: "stay",
    propertyId: "",
    propertyName: "",
    roomTypeId: "",
    roomName: "",
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

  const [urlPrice, setUrlPrice] = useState(null);

  const [guest, setGuest] = useState({
    name: "",
    phone: "",
    email: "",
    specialRequest: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [propertyDetails, setPropertyDetails] = useState(null);
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [propertyError, setPropertyError] = useState("");

  // URL se booking details read karo.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const requestedType = params.get("type") || "stay";
    const type = BOOKING_CONFIG[requestedType]
      ? requestedType
      : "stay";

    const rawProperty =
      params.get("property_id") ||
      params.get("property") ||
      "";

    const rawRoom =
      params.get("room_type_id") ||
      params.get("room") ||
      "";

    const rawPrice = [
      params.get("room_price"),
      params.get("price_per_night"),
      params.get("base_price"),
      params.get("price"),
    ].find(
      (value) =>
        value !== null &&
        value.trim() !== "" &&
        Number.isFinite(Number(value)) &&
        Number(value) >= 0
    );

    setUrlPrice(
      rawPrice === undefined ? null : Number(rawPrice)
    );

    setBookingData({
      type,
      propertyId: rawProperty,
      propertyName:
        params.get("property_name") ||
        params.get("hotel") ||
        params.get("property_title") ||
        params.get("name") ||
        "",
      roomTypeId: rawRoom,
      roomName:
        params.get("room_name") ||
        params.get("room_title") ||
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
      adults: Math.max(1, Number(params.get("adults")) || 2),
      children: Math.max(0, Number(params.get("children")) || 0),
      rooms: Math.max(1, Number(params.get("rooms")) || 1),
      zone: params.get("zone") || "",
    });
  }, []);

  // MongoDB property ID ho tabhi database se property fetch karo.
  useEffect(() => {
    if (
      bookingData.type !== "stay" ||
      !isMongoId(bookingData.propertyId)
    ) {
      setPropertyDetails(null);
      setPropertyError("");
      setPropertyLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchPropertyDetails() {
      setPropertyLoading(true);
      setPropertyError("");
      setPropertyDetails(null);

      try {
        const propertyId = encodeURIComponent(
          bookingData.propertyId
        );

        const response = await fetch(
          `${API_BASE_URL}/api/agent/public/properties/id/${propertyId}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result = await readApiResponse(response);

        if (!response.ok || result?.success === false) {
          throw new Error(
            getApiError(
              result,
              `Property details load nahi hue (HTTP ${response.status}).`
            )
          );
        }

        const data = getPropertyPayload(result);

        if (!data.property) {
          throw new Error(
            "API response mein property details nahi mile. Backend response format check karein."
          );
        }

        setPropertyDetails(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Property details error:", error);
          setPropertyDetails(null);
          setPropertyError(
            error.message || "Unable to load property details."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setPropertyLoading(false);
        }
      }
    }

    fetchPropertyDetails();

    return () => controller.abort();
  }, [bookingData.type, bookingData.propertyId]);

  const config =
    BOOKING_CONFIG[bookingData.type] || BOOKING_CONFIG.stay;

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

  const property = propertyDetails?.property || null;
  const rooms = propertyDetails?.rooms || [];

  const selectedItem = useMemo(() => {
    if (isStay) {
      if (propertyLoading) return "Loading property details...";

      return (
        getPropertyName(property) ||
        bookingData.propertyName ||
        (propertyError
          ? "Property details unavailable"
          : bookingData.propertyId
            ? "Selected stay"
            : "No property selected")
      );
    }

    let value = "";

    if (isSafari) value = bookingData.safariId;
    if (isPackage) value = bookingData.packageId;

    if (
      ["event", "conference", "corporate-meeting"].includes(
        bookingData.type
      )
    ) {
      value = bookingData.eventId;
    }

    if (bookingData.type === "wedding") {
      value = bookingData.venueId;
    }

    if (!value) return `Selected ${config.label.toLowerCase()}`;

    return value
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }, [
    isStay,
    isSafari,
    isPackage,
    propertyLoading,
    property,
    propertyError,
    bookingData,
    config.label,
  ]);

  const selectedRoom = useMemo(() => {
    if (!bookingData.roomTypeId || !rooms.length) return null;

    const requestedRoom = bookingData.roomTypeId.toLowerCase();

    return (
      rooms.find((room) => {
        const identifiers = [
          room?._id,
          room?.id,
          room?.slug,
          room?.roomId,
          room?.name,
          room?.roomName,
          room?.title,
          room?.roomType,
        ];

        return identifiers.some(
          (identifier) =>
            identifier != null &&
            String(identifier).toLowerCase() === requestedRoom
        );
      }) || null
    );
  }, [bookingData.roomTypeId, rooms]);

  const roomLabel =
    (selectedRoom && getRoomName(selectedRoom)) ||
    bookingData.roomName ||
    (propertyLoading
      ? "Loading room details..."
      : bookingData.roomTypeId
        ? "Selected room"
        : "Room on request");

  const totalGuests =
    Number(bookingData.adults || 0) +
    Number(bookingData.children || 0);

  const stayNights = useMemo(() => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;

    const start = new Date(`${bookingData.checkIn}T00:00:00`);
    const end = new Date(`${bookingData.checkOut}T00:00:00`);
    const difference = end.getTime() - start.getTime();

    if (!Number.isFinite(difference) || difference <= 0) return 0;

    return Math.round(difference / 86400000);
  }, [bookingData.checkIn, bookingData.checkOut]);

  const nightlyPrice = selectedRoom
    ? getRoomPrice(selectedRoom) ?? urlPrice
    : urlPrice;

  const estimatedAmount =
    nightlyPrice !== null &&
    stayNights > 0 &&
    Number(bookingData.rooms) > 0
      ? nightlyPrice * stayNights * Number(bookingData.rooms)
      : null;

  const handleGuestChange = (event) => {
    const { name, value } = event.target;

    setGuest((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (submitError) setSubmitError("");
  };

  const updateBooking = (field, value) => {
    setBookingData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (submitError) setSubmitError("");
  };

  const updateGuestCount = (field, amount) => {
    setBookingData((previous) => ({
      ...previous,
      [field]: Math.max(
        field === "adults" ? 1 : 0,
        Number(previous[field] || 0) + amount
      ),
    }));
  };

  const handleConfirm = async (event) => {
    event.preventDefault();

    if (submitted) return;

    setSubmitError("");
    setSubmitSuccess("");

    const hasDatabaseProperty = isMongoId(bookingData.propertyId);
    const isEnquiryOnlyStay = isStay && !hasDatabaseProperty;

    if (isStay) {
      if (hasDatabaseProperty) {
        if (propertyLoading) {
          setSubmitError("Please wait while property details load.");
          return;
        }

        if (propertyError || !property) {
          setSubmitError(
            propertyError ||
              "The selected property could not be verified."
          );
          return;
        }

        if (!selectedRoom || !isMongoId(selectedRoom._id)) {
          setSubmitError(
            "Please select a valid room from the property page before booking."
          );
          return;
        }
      }

      if (!bookingData.checkIn || !bookingData.checkOut) {
        setSubmitError(
          "Please select both check-in and check-out dates."
        );
        return;
      }

      if (bookingData.checkIn < getToday()) {
        setSubmitError("Check-in cannot be in the past.");
        return;
      }

      if (stayNights <= 0) {
        setSubmitError("Check-out must be later than check-in.");
        return;
      }
    }

    if ((isSafari || isEvent) && !bookingData.date) {
      setSubmitError(
        `Please select ${config.dateLabel.toLowerCase()}.`
      );
      return;
    }

    if (isSafari && !bookingData.zone) {
      setSubmitError("Please select a safari zone.");
      return;
    }

    if (
      !guest.name.trim() ||
      !guest.phone.trim() ||
      !guest.email.trim()
    ) {
      setSubmitError("Please fill all required contact details.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(guest.phone.trim())) {
      setSubmitError("Please enter a valid phone number.");
      return;
    }

    setSubmitted(true);

    try {
      // Static listings ke liye enquiry submit karo.
      if (isEnquiryOnlyStay) {
        const params = new URLSearchParams(
          window.location.search
        );

        const enquiryPayload = {
          inquiryType: "stay",
          hotel: bookingData.propertyName || "Stay enquiry",
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          rooms: Number(bookingData.rooms),
          name: guest.name.trim(),
          company: "",
          phone: guest.phone.trim(),
          email: guest.email.trim(),
          guests: totalGuests,
          message: [
            `Room type: ${bookingData.roomName || "Room on request"}`,
            `Adults: ${bookingData.adults}`,
            `Children: ${bookingData.children}`,
            `Rooms: ${bookingData.rooms}`,
            `Price per night: ${
              urlPrice !== null
                ? formatINR(urlPrice)
                : "Price on request"
            }`,
            `Estimated stay amount: ${
              estimatedAmount !== null
                ? formatINR(estimatedAmount)
                : "To be confirmed"
            }`,
            `Location: ${params.get("location") || "Jim Corbett"}`,
            guest.specialRequest.trim()
              ? `Special request: ${guest.specialRequest.trim()}`
              : "",
          ]
            .filter(Boolean)
            .join("\n"),
        };

        const enquiryResponse = await fetch(
          `${API_BASE_URL}/api/enquiries`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(enquiryPayload),
          }
        );

        const enquiryResult = await readApiResponse(enquiryResponse);

        if (
          !enquiryResponse.ok ||
          enquiryResult?.success === false
        ) {
          throw new Error(
            getApiError(
              enquiryResult,
              "Unable to send your stay enquiry."
            )
          );
        }

        setSubmitSuccess(
          "Your stay enquiry has been submitted successfully. Our team will contact you to confirm availability and the final price."
        );

        // Enquiry ko booking confirmation nahi dikhana.
        return;
      }

      // Existing database booking flow.
      const payload = {
        type: bookingData.type,
        propertyId: bookingData.propertyId,
        roomTypeId: selectedRoom?._id || bookingData.roomTypeId,
        packageId: bookingData.packageId,
        safariId: bookingData.safariId,
        eventId: bookingData.eventId,
        venueId: bookingData.venueId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        date: bookingData.date,
        zone: bookingData.zone,
        adults: Number(bookingData.adults),
        children: Number(bookingData.children),
        rooms: Number(bookingData.rooms),
        name: guest.name.trim(),
        phone: guest.phone.trim(),
        email: guest.email.trim(),
        specialRequest: guest.specialRequest.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await readApiResponse(response);

      if (!response.ok || result?.success === false) {
        throw new Error(
          getApiError(result, "Booking submission failed.")
        );
      }

      const params = new URLSearchParams();
      params.set("type", bookingData.type);

      const bookingReference =
        result?.booking?.bookingReference ||
        result?.data?.booking?.bookingReference ||
        result?.bookingReference;

      if (bookingReference) {
        params.set("booking_reference", bookingReference);
      }

      if (bookingData.propertyId) {
        params.set("property_id", bookingData.propertyId);
      }

      if (selectedRoom?._id || bookingData.roomTypeId) {
        params.set(
          "room_type_id",
          String(selectedRoom?._id || bookingData.roomTypeId)
        );
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

      router.push(`/booking/confirmation?${params.toString()}`);
    } catch (error) {
      console.error("Booking/enquiry submission error:", error);

      setSubmitError(
        error.message ||
          "Unable to submit your request. Please try again."
      );

      setSubmitted(false);
    }
  };

  const today = getToday();

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">
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
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#B96928] sm:text-[10px]">
              Destination Corbett
            </p>
            <h1 className="mt-0.5 text-sm font-semibold sm:text-base">
              {config.label} Booking
            </h1>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-medium text-[#64748B] sm:text-xs">
            <ShieldCheck size={14} className="text-[#B96928]" />
            <span className="hidden sm:inline">Secure Enquiry</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-7">
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
          <div className="space-y-4">
            <div className="rounded-xl border border-[#E7E0D5] bg-white p-3 shadow-[0_3px_16px_rgba(23,32,51,0.035)] sm:rounded-2xl sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#B96928]">
                    {config.label} Details
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold sm:text-base">
                    Selected experience
                  </h3>
                </div>
                <div className="rounded-lg bg-[#F7F5F0] p-1.5">
                  <Icon size={15} className="text-[#B96928]" />
                </div>
              </div>

              <div className="mb-2 rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-md bg-white p-1.5">
                    <Icon size={14} className="text-[#B96928]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-[#7B8798]">
                      Selected {config.label.toLowerCase()}
                    </p>
                    <p className="mt-0.5 break-words text-xs font-semibold sm:text-sm">
                      {selectedItem}
                    </p>
                    {isStay && property && (
                      <p className="mt-1 text-[10px] text-[#64748B]">
                        {getPropertyLocation(property)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isStay && propertyError && (
                <p
                  role="alert"
                  className="mb-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-700"
                >
                  {propertyError}
                </p>
              )}

              {isStay && (
                <div className="mb-2 rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-md bg-white p-1.5">
                      <BedDouble size={14} className="text-[#B96928]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-[#7B8798]">Room Type</p>
                      <p className="mt-0.5 break-words text-xs font-semibold sm:text-sm">
                        {roomLabel}
                      </p>
                      {selectedRoom?.bedType && (
                        <p className="mt-1 text-[10px] text-[#64748B]">
                          {selectedRoom.bedType}
                          {selectedRoom.roomSize
                            ? ` · ${selectedRoom.roomSize}`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`grid gap-2 ${
                  config.secondDateLabel ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                <div className="rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays
                      size={14}
                      className="shrink-0 text-[#B96928]"
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
                    onChange={(event) => {
                      const value = event.target.value;

                      if (isSafari || isEvent) {
                        updateBooking("date", value);
                      } else {
                        setBookingData((previous) => ({
                          ...previous,
                          checkIn: value,
                          checkOut:
                            previous.checkOut &&
                            value >= previous.checkOut
                              ? ""
                              : previous.checkOut,
                        }));
                      }
                    }}
                    className="mt-1.5 w-full bg-transparent text-[11px] font-semibold outline-none sm:text-xs"
                  />
                </div>

                {config.secondDateLabel && (
                  <div className="rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays
                        size={14}
                        className="shrink-0 text-[#B96928]"
                      />
                      <span className="text-[9px] font-medium text-[#7B8798] sm:text-[10px]">
                        {config.secondDateLabel}
                      </span>
                    </div>
                    <input
                      type="date"
                      min={
                        bookingData.checkIn && bookingData.checkIn >= today
                          ? bookingData.checkIn
                          : today
                      }
                      value={bookingData.checkOut}
                      onChange={(event) =>
                        updateBooking("checkOut", event.target.value)
                      }
                      className="mt-1.5 w-full bg-transparent text-[11px] font-semibold outline-none sm:text-xs"
                    />
                  </div>
                )}
              </div>

              {isSafari && (
                <div className="mt-2 rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-md bg-white p-1.5">
                      <MapPin size={14} className="text-[#B96928]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] text-[#7B8798]">Safari Zone</p>
                      <select
                        value={bookingData.zone}
                        onChange={(event) =>
                          updateBooking("zone", event.target.value)
                        }
                        className="mt-0.5 w-full bg-transparent text-[11px] font-semibold outline-none"
                      >
                        <option value="">Select safari zone</option>
                        <option value="Dhikala">Dhikala</option>
                        <option value="Bijrani">Bijrani</option>
                        <option value="Jhirna">Jhirna</option>
                        <option value="Durgadevi">Durgadevi</option>
                        <option value="Dhela">Dhela</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {[
                  {
                    field: "adults",
                    label: "Adults",
                    IconComponent: Users,
                    minimum: 1,
                  },
                  {
                    field: "children",
                    label: "Children",
                    IconComponent: Users,
                    minimum: 0,
                  },
                  ...(isStay
                    ? [
                        {
                          field: "rooms",
                          label: "Rooms",
                          IconComponent: BedDouble,
                          minimum: 1,
                        },
                      ]
                    : []),
                ].map((item) => {
                  const CounterIcon = item.IconComponent;

                  return (
                    <div
                      key={item.field}
                      className="rounded-lg border border-[#ECE7DF] bg-[#FCFBF8] p-2.5 sm:rounded-xl sm:p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <CounterIcon size={14} className="text-[#B96928]" />
                          <span className="text-[9px] font-medium text-[#7B8798] sm:text-[10px]">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.field === "rooms") {
                                updateBooking(
                                  "rooms",
                                  Math.max(1, Number(bookingData.rooms) - 1)
                                );
                              } else {
                                updateGuestCount(item.field, -1);
                              }
                            }}
                            disabled={
                              Number(bookingData[item.field]) <= item.minimum
                            }
                            className="flex h-5 w-5 items-center justify-center rounded border border-[#E4DDD3] bg-white hover:border-[#B96928] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Decrease ${item.label.toLowerCase()}`}
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-5 text-center text-[10px] font-semibold">
                            {bookingData[item.field]}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (item.field === "rooms") {
                                updateBooking(
                                  "rooms",
                                  Number(bookingData.rooms) + 1
                                );
                              } else {
                                updateGuestCount(item.field, 1);
                              }
                            }}
                            className="flex h-5 w-5 items-center justify-center rounded border border-[#E4DDD3] bg-white hover:border-[#B96928]"
                            aria-label={`Increase ${item.label.toLowerCase()}`}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 flex items-center justify-between rounded-lg bg-[#F8F6F1] px-2.5 py-2">
                <span className="text-[10px] text-[#64748B]">Total guests</span>
                <span className="text-[10px] font-semibold sm:text-xs">
                  {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                </span>
              </div>
            </div>

            <form
              onSubmit={handleConfirm}
              className="rounded-xl border border-[#E7E0D5] bg-white p-3 shadow-[0_3px_16px_rgba(23,32,51,0.035)] sm:rounded-2xl sm:p-4"
            >
              <div className="mb-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#B96928]">
                  Contact Information
                </p>
                <h3 className="mt-0.5 text-sm font-semibold sm:text-base">
                  Tell us how to reach you
                </h3>
                <p className="mt-0.5 text-[10px] text-[#64748B] sm:text-xs">
                  We&apos;ll use these details to confirm availability and
                  your request.
                </p>
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                >
                  {submitError}
                </p>
              )}

              {submitSuccess && (
                <div
                  role="status"
                  className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-xs leading-5 text-green-800"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="font-semibold">
                        Enquiry submitted successfully!
                      </p>
                      <p className="mt-1">{submitSuccess}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold sm:text-xs">
                    Full Name <span className="text-red-500">*</span>
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
                      autoComplete="name"
                      required
                      className="h-9 w-full rounded-lg border border-[#DDE3EA] bg-white pl-8 pr-2.5 text-[11px] outline-none transition placeholder:text-[#A0A9B5] focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10 sm:text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-semibold sm:text-xs">
                    Phone Number <span className="text-red-500">*</span>
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
                      autoComplete="tel"
                      required
                      className="h-9 w-full rounded-lg border border-[#DDE3EA] bg-white pl-8 pr-2.5 text-[11px] outline-none transition placeholder:text-[#A0A9B5] focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10 sm:text-xs"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-semibold sm:text-xs">
                    Email Address <span className="text-red-500">*</span>
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
                      autoComplete="email"
                      required
                      className="h-9 w-full rounded-lg border border-[#DDE3EA] bg-white pl-8 pr-2.5 text-[11px] outline-none transition placeholder:text-[#A0A9B5] focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10 sm:text-xs"
                    />
                  </div>
                </div>

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
                      className="w-full resize-none rounded-lg border border-[#DDE3EA] bg-white py-2 pl-8 pr-2.5 text-[11px] outline-none transition placeholder:text-[#A0A9B5] focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10 sm:text-xs"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitted || (isStay && propertyLoading)}
                className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-3 text-[11px] font-semibold text-white transition hover:bg-[#A85D22] disabled:cursor-not-allowed disabled:opacity-70 lg:hidden"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 size={14} />
                    {submitSuccess ? "Request Sent" : "Sending..."}
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

          <aside className="lg:sticky lg:top-4">
            <div className="overflow-hidden rounded-xl border border-[#E7E0D5] bg-white shadow-[0_4px_20px_rgba(23,32,51,0.045)] sm:rounded-2xl">
              <div className="bg-[#172033] px-4 py-3 text-white">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#E1A05B]">
                  Reservation
                </p>
                <h3 className="mt-0.5 text-sm font-semibold">
                  {config.label} Summary
                </h3>
              </div>

              <div className="p-3">
                <div className="rounded-lg bg-[#F7F5F0] p-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="rounded-md bg-white p-1.5">
                      <Icon size={14} className="text-[#B96928]" />
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

                {isStay && (
                  <div className="mt-1.5 rounded-lg bg-[#F7F5F0] p-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="rounded-md bg-white p-1.5">
                        <BedDouble size={14} className="text-[#B96928]" />
                      </div>
                      <div>
                        <p className="text-[9px] text-[#7B8798]">Room Type</p>
                        <p className="mt-0.5 text-[11px] font-semibold">
                          {roomLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 divide-y divide-[#EEE9E1]">
                  {isStay || isPackage ? (
                    <>
                      <div className="flex items-center justify-between gap-3 py-2 text-[10px]">
                        <span className="text-[#64748B]">Start</span>
                        <span className="text-right font-semibold">
                          {formatDate(bookingData.checkIn)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 py-2 text-[10px]">
                        <span className="text-[#64748B]">End</span>
                        <span className="text-right font-semibold">
                          {formatDate(bookingData.checkOut)}
                        </span>
                      </div>

                      {isStay && stayNights > 0 && (
                        <div className="flex items-center justify-between py-2 text-[10px]">
                          <span className="text-[#64748B]">Duration</span>
                          <span className="font-semibold">
                            {stayNights}{" "}
                            {stayNights === 1 ? "night" : "nights"}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-3 py-2 text-[10px]">
                      <span className="text-[#64748B]">Date</span>
                      <span className="text-right font-semibold">
                        {formatDate(bookingData.date)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 text-[10px]">
                    <span className="text-[#64748B]">Adults</span>
                    <span className="font-semibold">{bookingData.adults}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 text-[10px]">
                    <span className="text-[#64748B]">Children</span>
                    <span className="font-semibold">{bookingData.children}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 text-[10px]">
                    <span className="text-[#64748B]">Total guests</span>
                    <span className="font-semibold">{totalGuests}</span>
                  </div>

                  {isStay && (
                    <div className="flex items-center justify-between py-2 text-[10px]">
                      <span className="text-[#64748B]">Rooms</span>
                      <span className="font-semibold">{bookingData.rooms}</span>
                    </div>
                  )}

                  {isSafari && (
                    <div className="flex items-center justify-between py-2 text-[10px]">
                      <span className="text-[#64748B]">Zone</span>
                      <span className="font-semibold">
                        {bookingData.zone || "Not selected"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="my-2.5 rounded-lg border border-[#E8E0D4] bg-[#FCFBF8] p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#64748B]">
                      {estimatedAmount !== null
                        ? "Estimated amount"
                        : nightlyPrice !== null
                          ? "Price per night"
                          : "Amount"}
                    </span>
                    <span className="text-right text-xs font-semibold text-[#172033]">
                      {estimatedAmount !== null
                        ? formatINR(estimatedAmount)
                        : nightlyPrice !== null
                          ? `${formatINR(nightlyPrice)} / night`
                          : "Price on request"}
                    </span>
                  </div>

                  {estimatedAmount !== null && (
                    <p className="mt-1 text-[9px] leading-3.5 text-[#64748B]">
                      {formatINR(nightlyPrice)} × {stayNights}{" "}
                      {stayNights === 1 ? "night" : "nights"} ×{" "}
                      {bookingData.rooms}{" "}
                      {Number(bookingData.rooms) === 1 ? "room" : "rooms"}
                    </p>
                  )}

                  <p className="mt-1 text-[9px] leading-3.5 text-[#94A3B8]">
                    {estimatedAmount !== null
                      ? "Estimate only. Final price and availability will be confirmed by our team."
                      : nightlyPrice !== null
                        ? "Select check-in and check-out dates to calculate your estimated stay total."
                        : "Room pricing is unavailable. Our team will confirm the price and availability."}
                  </p>
                </div>

                {isStay && !isMongoId(bookingData.propertyId) && (
                  <div className="mb-2 rounded-lg border border-[#E9E2D8] bg-[#FCFBF8] p-2.5">
                    <p className="text-[10px] font-semibold">
                      Enquiry-only listing
                    </p>
                    <p className="mt-1 text-[9px] leading-3.5 text-[#7B8798]">
                      This listing does not have a verified online booking ID.
                      Our team needs to confirm availability and final pricing.
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-[#E9E2D8] bg-[#FCFBF8] p-2.5">
                  <div className="flex gap-2">
                    <ShieldCheck
                      size={15}
                      className="mt-0.5 shrink-0 text-[#B96928]"
                    />
                    <div>
                      <p className="text-[10px] font-semibold">
                        Secure enquiry
                      </p>
                      <p className="mt-0.5 text-[9px] leading-3.5 text-[#7B8798]">
                        Your contact details are used only to process your
                        booking request.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submitted || (isStay && propertyLoading)}
                  className="mt-3 hidden h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#B96928] px-3 text-[11px] font-semibold text-white transition hover:bg-[#A85D22] disabled:cursor-not-allowed disabled:opacity-70 lg:flex"
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 size={14} />
                      {submitSuccess ? "Request Sent" : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send Booking Request
                    </>
                  )}
                </button>

                <p className="mt-2 text-center text-[8px] leading-3.5 text-[#A0A9B5]">
                  By continuing, you agree to the booking details and
                  applicable terms.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
