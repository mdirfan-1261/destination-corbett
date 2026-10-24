"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useOrganisationProfile } from "@/hooks/useOrganisationProfile";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Users,
  Plane,
  TrainFront,
  Trees,
  Route,
  Phone,
  Mail,
  Building2,
} from "lucide-react";

const VEHICLES = [
  {
    id: "sedan",
    name: "Sedan",
    passengers: 3,
    subtitle: "Ideal for couples",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "suv",
    name: "SUV",
    passengers: 6,
    subtitle: "Comfortable family travel",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "innova",
    name: "Innova / Crysta",
    passengers: 6,
    subtitle: "Extra comfort for long trips",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "tempo",
    name: "Tempo Traveller",
    passengers: 12,
    subtitle: "Group and family journeys",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=700&q=80",
  },
];

const SERVICES = [
  {
    title: "Airport Transfers",
    description: "Convenient airport pickup and drop.",
    icon: Plane,
  },
  {
    title: "Railway Transfers",
    description: "Transfers to and from Ramnagar station.",
    icon: TrainFront,
  },
  {
    title: "Local Sightseeing",
    description: "Explore nearby attractions comfortably.",
    icon: Trees,
  },
  {
    title: "Resort & Safari",
    description: "Travel between resorts and safari locations.",
    icon: Route,
  },
];

function localDateISO() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function getContactDetails(profile) {
  const phone = normalizePhone(
    profile?.phone ||
      profile?.contactNumber ||
      profile?.contactPhone ||
      profile?.mobile ||
      profile?.contact?.phone
  );

  const whatsapp = normalizePhone(
    profile?.whatsapp ||
      profile?.whatsappNumber ||
      profile?.whatsappPhone ||
      profile?.contact?.whatsapp ||
      phone
  );

  return {
    phone,
    whatsapp,
    email:
      profile?.email ||
      profile?.contactEmail ||
      profile?.contact?.email ||
      "",
    name:
      profile?.name ||
      profile?.organisationName ||
      profile?.organizationName ||
      profile?.businessName ||
      "Destination Corbett",
  };
}

/* ================= SHARED SIZES (same as Stay / Weddings) ================= */
const sectionWrap = "mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-6 md:px-6";

const sectionHeading =
  "text-lg font-bold leading-tight text-[#172033] dark:text-gray-100 sm:text-xl md:text-2xl";

const sectionSub =
  "mt-1 text-[11px] leading-4 text-gray-600 dark:text-gray-300 sm:text-sm sm:leading-5";

const panel =
  "rounded-xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-white/5";

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-[#172033] outline-none transition placeholder:text-gray-400 focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/15 dark:border-white/15 dark:bg-[#131c36] dark:text-gray-100 dark:placeholder:text-gray-400 sm:text-sm";

const labelClass =
  "text-xs font-semibold text-gray-700 dark:text-gray-200";

export default function TransportPage() {
  const { profile, loading } = useOrganisationProfile();

  const contact = useMemo(() => getContactDetails(profile), [profile]);

  const today = useMemo(() => localDateISO(), []);

  const [vehicleId, setVehicleId] = useState("suv");
  const [tripType, setTripType] = useState("one-way");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const selectedVehicle =
    VEHICLES.find((item) => item.id === vehicleId) || VEHICLES[1];

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!pickup.trim() || !dropoff.trim()) {
      setError("Pickup aur destination dono enter karein.");
      return;
    }

    if (!travelDate || travelDate < today) {
      setError("Valid travel date select karein.");
      return;
    }

    if (
      tripType === "round-trip" &&
      (!returnDate || returnDate < travelDate)
    ) {
      setError("Return date travel date ke barabar ya uske baad honi chahiye.");
      return;
    }

    if (passengers > selectedVehicle.passengers) {
      setError(
        `${selectedVehicle.name} mein maximum ${selectedVehicle.passengers} passengers hain.`
      );
      return;
    }

    if (loading) {
      setError("Organisation contact details load ho rahi hain. Please wait.");
      return;
    }

    if (!contact.whatsapp || contact.whatsapp.length < 10) {
      setError("Organisation Profile mein valid WhatsApp number nahi mila.");
      return;
    }

    const formatDate = (value) => {
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    };

    const message = [
      `Hello ${contact.name}, transport enquiry karni hai.`,
      "",
      `Vehicle: ${selectedVehicle.name}`,
      `Trip: ${tripType === "round-trip" ? "Round trip" : "One way"}`,
      `Pickup: ${pickup.trim()}`,
      `Destination: ${dropoff.trim()}`,
      `Travel date: ${formatDate(travelDate)}`,
      `Pickup time: ${travelTime || "Flexible"}`,
      ...(tripType === "round-trip"
        ? [`Return date: ${formatDate(returnDate)}`]
        : []),
      `Passengers: ${passengers}`,
      `Additional details: ${notes.trim() || "None"}`,
      "",
      "Please confirm availability and final fare.",
    ].join("\n");

    window.open(
      `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033] dark:bg-[#0e1210] dark:text-gray-100">
      {/* ================= BREADCRUMB ================= */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-6xl px-3 pt-3 text-xs sm:px-5 sm:pt-4 sm:text-sm md:px-6"
      >
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-[#B96928] transition-colors hover:underline"
          >
            Home
          </Link>

          <span className="text-gray-400">›</span>

          <span
            aria-current="page"
            className="font-medium text-[#172033] dark:text-gray-100"
          >
            Transport
          </span>
        </div>
      </nav>

      {/* ================= COMPACT HERO ================= */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4 md:px-6">
        <div className="relative mx-auto h-[190px] max-w-6xl overflow-hidden rounded-xl bg-[#172033] text-white sm:h-[230px] sm:rounded-2xl lg:h-[260px]">
          {/* Hero Image */}
          <div className="absolute inset-0 lg:left-auto lg:w-[55%]">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80"
              alt="Mountain road for travel in Jim Corbett"
              fetchPriority="high"
              className="h-full w-full object-cover object-center brightness-110"
            />
          </div>

          {/* Image Overlays */}
          <div className="pointer-events-none absolute inset-y-0 left-[45%] hidden w-[15%] bg-gradient-to-r from-[#172033] to-transparent lg:block" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#172033]/90 via-[#172033]/55 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 flex h-full items-center px-4 py-4 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-xl">
                <CarFront className="h-3 w-3 text-[#E0924F]" />
                {contact.name} Transport
              </div>

              <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
                Your Journey,{" "}
                <span className="text-[#E0924F]">Made Easy.</span>
              </h1>

              <p className="mt-2 hidden max-w-md line-clamp-2 text-xs leading-5 text-white/80 sm:block sm:text-sm">
                Airport transfers, railway pickups, sightseeing and
                comfortable travel around Jim Corbett.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href="#transport-enquiry"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#C87532] px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#B96928] sm:text-sm"
                >
                  Enquire Now
                  <ArrowRight size={13} />
                </a>

                <a
                  href="#vehicles"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:text-sm"
                >
                  View Vehicles
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className={sectionWrap}>
        <div className="mb-3.5 sm:mb-4">
          <h2 className={sectionHeading}>Transport for Every Plan</h2>

          <p className={sectionSub}>
            Choose a service and request your preferred vehicle.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {SERVICES.map(({ title, description, icon: Icon }) => (
            <article key={title} className={`${panel} p-3 sm:p-3.5`}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B96928]/10 text-[#B96928] dark:text-[#E0924F]">
                <Icon size={17} />
              </div>

              <h3 className="mt-2 text-xs font-semibold leading-tight text-[#172033] dark:text-gray-100 sm:text-sm">
                {title}
              </h3>

              <p className="mt-1 text-[10px] leading-4 text-gray-600 dark:text-gray-300 sm:text-xs">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ================= VEHICLES ================= */}
      <section id="vehicles" className={`${sectionWrap} scroll-mt-20`}>
        <div className="mb-3.5 sm:mb-4">
          <h2 className={sectionHeading}>Select a Vehicle</h2>

          <p className={sectionSub}>
            Pick the vehicle that fits your group size and journey.
          </p>
        </div>

        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-4">
          {VEHICLES.map((vehicle) => {
            const active = vehicleId === vehicle.id;

            return (
              <button
                key={vehicle.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setVehicleId(vehicle.id);
                  setError("");
                }}
                className={`group relative h-[170px] overflow-hidden rounded-xl border bg-[#172033] text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:h-[200px] ${
                  active
                    ? "border-[#B96928] ring-2 ring-[#B96928]/40"
                    : "border-black/5 dark:border-white/10"
                }`}
              >
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111827]/95 via-[#111827]/40 to-transparent" />

                {active && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#B96928] text-white shadow">
                    <CheckCircle2 size={15} />
                  </span>
                )}

                <span className="absolute left-2 top-2 rounded-full border border-white/20 bg-black/30 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur">
                  {vehicle.passengers} seats
                </span>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5">
                  <h3 className="line-clamp-1 text-[12px] font-semibold leading-[1.25] text-white sm:text-base">
                    {vehicle.name}
                  </h3>

                  <p className="mt-0.5 line-clamp-1 text-[9px] leading-3 text-white/80 sm:text-xs sm:leading-4">
                    {vehicle.subtitle}
                  </p>

                  <p className="mt-1.5 text-[10px] font-semibold text-[#E0924F] sm:text-xs">
                    {active ? "Selected" : "Select vehicle"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= ENQUIRY ================= */}
      <section
        id="transport-enquiry"
        className={`${sectionWrap} grid scroll-mt-20 gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:gap-5`}
      >
        <div>
          <h2 className={sectionHeading}>Let’s Get You There</h2>

          <p className={sectionSub}>
            Share your trip details. The enquiry will open in the
            organisation’s WhatsApp.
          </p>

          <div className={`${panel} mt-3 p-3.5 sm:p-4`}>
            <div className="flex items-center gap-2">
              <Building2
                size={16}
                className="text-[#B96928] dark:text-[#E0924F]"
              />
              <h3 className="text-sm font-semibold text-[#172033] dark:text-gray-100">
                {contact.name}
              </h3>
            </div>

            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="mt-2.5 flex items-center gap-2 text-xs text-gray-700 hover:text-[#B96928] dark:text-gray-200 sm:text-sm"
              >
                <Phone size={14} /> {contact.phone}
              </a>
            )}

            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="mt-2 flex items-center gap-2 break-all text-xs text-gray-700 hover:text-[#B96928] dark:text-gray-200 sm:text-sm"
              >
                <Mail size={14} /> {contact.email}
              </a>
            )}

            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-green-50 px-3 text-[11px] font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-300 sm:h-9 sm:text-xs"
              >
                <MessageCircle size={13} /> Chat on WhatsApp
              </a>
            )}

            {!loading &&
              !contact.phone &&
              !contact.email &&
              !contact.whatsapp && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-300">
                  Organisation contact details are not available.
                </p>
              )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={`${panel} p-3.5 sm:p-4`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5 dark:border-white/10">
            <div>
              <h3 className="text-sm font-bold text-[#172033] dark:text-gray-100 sm:text-base">
                Transport Enquiry
              </h3>
              <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-300 sm:text-xs">
                Request availability and fare
              </p>
            </div>

            <span className="rounded-full bg-[#B96928]/10 px-2.5 py-1 text-[11px] font-semibold text-[#9B4E1C] dark:bg-[#B96928]/20 dark:text-[#F0B77D] sm:text-xs">
              {selectedVehicle.name}
            </span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            <label className={labelClass}>
              Pickup location *
              <span className="relative mt-1 block">
                <MapPin
                  size={14}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  required
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Railway station, hotel..."
                  className={`${fieldClass} pl-9`}
                />
              </span>
            </label>

            <label className={labelClass}>
              Destination *
              <span className="relative mt-1 block">
                <Route
                  size={14}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  required
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Resort or destination"
                  className={`${fieldClass} pl-9`}
                />
              </span>
            </label>

            <label className={labelClass}>
              Trip type
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className={`${fieldClass} mt-1`}
              >
                <option value="one-way">One way</option>
                <option value="round-trip">Round trip</option>
              </select>
            </label>

            <label className={labelClass}>
              Travel date *
              <span className="relative mt-1 block">
                <CalendarDays
                  size={14}
                  className="pointer-events-none absolute left-3 top-3 text-gray-400"
                />
                <input
                  required
                  type="date"
                  min={today}
                  value={travelDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTravelDate(value);
                    if (returnDate && returnDate < value) {
                      setReturnDate("");
                    }
                  }}
                  className={`${fieldClass} pl-9`}
                />
              </span>
            </label>

            {tripType === "round-trip" && (
              <label className={labelClass}>
                Return date *
                <input
                  required
                  type="date"
                  min={travelDate || today}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className={`${fieldClass} mt-1`}
                />
              </label>
            )}

            <label className={labelClass}>
              Pickup time
              <input
                type="time"
                value={travelTime}
                onChange={(e) => setTravelTime(e.target.value)}
                className={`${fieldClass} mt-1`}
              />
            </label>

            <div>
              <span className={labelClass}>Passengers</span>
              <div className="mt-1 flex h-[40px] items-center justify-between rounded-lg border border-gray-200 px-3 dark:border-white/15">
                <span className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
                  <Users size={14} /> Passengers
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={passengers <= 1}
                    onClick={() => setPassengers((n) => Math.max(1, n - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[#172033] disabled:opacity-30 dark:border-white/20 dark:text-gray-100"
                    aria-label="Decrease passengers"
                  >
                    <Minus size={13} />
                  </button>

                  <span className="min-w-4 text-center text-sm font-bold text-[#172033] dark:text-gray-100">
                    {passengers}
                  </span>

                  <button
                    type="button"
                    disabled={passengers >= 30}
                    onClick={() => setPassengers((n) => Math.min(30, n + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[#172033] disabled:opacity-30 dark:border-white/20 dark:text-gray-100"
                    aria-label="Increase passengers"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-300">
                Selected vehicle capacity: {selectedVehicle.passengers}
              </p>
            </div>

            <label className={`${labelClass} sm:col-span-2`}>
              Additional details
              <textarea
                rows={2}
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Luggage, train details or other requirements..."
                className={`${fieldClass} mt-1 resize-y`}
              />
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-[#F7F5F0] p-2.5 dark:bg-white/5 sm:p-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[#172033] dark:text-gray-100">
                {pickup.trim() || "Pickup"} → {dropoff.trim() || "Destination"}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-300">
                {travelDate || "Choose date"} · {passengers} passenger
                {passengers === 1 ? "" : "s"}
              </p>
            </div>

            <CarFront
              size={20}
              className="shrink-0 text-[#B96928] dark:text-[#E0924F]"
            />
          </div>

          <button
            type="submit"
            className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#B96928] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A85C22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B96928] focus-visible:ring-offset-2 sm:text-sm"
          >
            <MessageCircle size={16} />
            Send Enquiry on WhatsApp
            <ArrowRight size={14} />
          </button>

          <p className="mt-2 text-center text-[10px] text-gray-500 dark:text-gray-300">
            Enquiry only. Vehicle and fare are confirmed separately.
          </p>
        </form>
      </section>

      {/* ================= CONTACT STRIP ================= */}
      <section className="mx-auto max-w-6xl px-3 pb-6 pt-1 sm:px-5 sm:pb-8 md:px-6">
        <div className="relative overflow-hidden rounded-xl bg-[#172033] px-4 py-4 text-white shadow-sm sm:rounded-2xl sm:px-6 sm:py-5">
          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold leading-tight sm:text-xl">
                Need help planning your transfer?
              </h2>
              <p className="mt-1 text-[11px] text-white/70 sm:text-sm">
                Contact {contact.name} for travel assistance.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-white/25 px-4 text-[11px] font-semibold text-white transition hover:bg-white/10 sm:h-9 sm:text-xs"
                >
                  <Phone size={13} /> Call
                </a>
              )}

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-white/25 px-4 text-[11px] font-semibold text-white transition hover:bg-white/10 sm:h-9 sm:text-xs"
                >
                  <Mail size={13} /> Email
                </a>
              )}

              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#B96928] px-4 text-[11px] font-semibold text-white transition hover:bg-[#A85C22] sm:h-9 sm:text-xs"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}