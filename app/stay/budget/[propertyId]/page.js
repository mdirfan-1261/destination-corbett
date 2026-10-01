"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  Clock3,
  Car,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  TreePine,
  Users,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";

import { budgetHotels } from "@/data/stays";

export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const property = useMemo(() => {
    return budgetHotels.find(
      (hotel) => hotel.id === params.propertyId
    );
  }, [params.propertyId]);

  if (!property) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#172033]">
            Property not found
          </h1>

          <p className="mt-2 text-sm text-[#64748B]">
            The selected stay could not be found.
          </p>

          <Link
            href="/stay/budget"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#172033] px-5 py-3 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Stays
          </Link>
        </div>
      </main>
    );
  }

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  const handleBookNow = () => {
    if (!selectedRoom) {
      alert("Please select a room first.");
      return;
    }

    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    const url =
      `/booking?type=stay` +
      `&property_id=${encodeURIComponent(property.id)}` +
      `&room_type_id=${encodeURIComponent(selectedRoom.id)}` +
      `&check_in=${encodeURIComponent(checkIn)}` +
      `&check_out=${encodeURIComponent(checkOut)}` +
      `&adults=${adults}` +
      `&children=${children}`;

    router.push(url);
  };

  const getAmenityIcon = (amenity) => {
    const value = amenity.toLowerCase();

    if (value.includes("wi-fi")) {
      return <Wifi size={17} />;
    }

    if (value.includes("parking")) {
      return <Car size={17} />;
    }

    if (value.includes("restaurant")) {
      return <Utensils size={17} />;
    }

    if (value.includes("pool")) {
      return <Waves size={17} />;
    }

    if (value.includes("garden")) {
      return <TreePine size={17} />;
    }

    return <Check size={17} />;
  };

  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#172033]">

      {/* HEADER */}
      <section className="border-b border-[#E7E0D5] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 lg:px-8">

          <Link
            href="/stay/budget"
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#C88A3D]"
          >
            <ArrowLeft size={16} />
            Back to Budget Stays
          </Link>

          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F7F1E8] px-3 py-1.5 text-xs font-semibold text-[#A56E2D]">
                <ShieldCheck size={14} />
                Verified Stay
              </div>

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {property.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#64748B]">

                <span className="inline-flex items-center gap-1.5">
                  <MapPin
                    size={16}
                    className="text-[#C88A3D]"
                  />
                  {property.location}
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-[#CBD5E1] md:block" />

                <span className="inline-flex items-center gap-1.5">
                  <Star
                    size={15}
                    className="fill-[#C88A3D] text-[#C88A3D]"
                  />

                  <strong className="text-[#172033]">
                    {property.rating}
                  </strong>

                  {property.reviews}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#94A3B8]">
                Starting from
              </p>

              <p className="mt-1 text-2xl font-semibold">
                ₹{property.price.toLocaleString("en-IN")}
                <span className="ml-1 text-sm font-normal text-[#64748B]">
                  / night
                </span>
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <section className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">

        <div className="relative h-[300px] overflow-hidden rounded-[28px] md:h-[440px]">

          <img
            src={property.image}
            alt={property.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              Destination Corbett
            </p>

            <h2 className="mt-2 max-w-2xl text-2xl font-semibold text-white md:text-3xl">
              Stay closer to the Corbett experience
            </h2>

          </div>
        </div>
      </section>

      {/* SEARCH / DATES */}
      <section className="mx-auto max-w-7xl px-5 pt-6 lg:px-8">

        <div className="rounded-[24px] border border-[#E5DED2] bg-white p-5 shadow-sm md:p-6">

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C88A3D]">
              Plan your stay
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Choose dates & guests
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* CHECK IN */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                Check-in
              </label>

              <div className="relative">

                <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                />

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#FAFAF9] pl-11 pr-3 text-sm outline-none focus:border-[#C88A3D]"
                />

              </div>
            </div>

            {/* CHECK OUT */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                Check-out
              </label>

              <div className="relative">

                <CalendarDays
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C88A3D]"
                />

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-[#FAFAF9] pl-11 pr-3 text-sm outline-none focus:border-[#C88A3D]"
                />

              </div>
            </div>

            {/* ADULTS */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                Adults
              </label>

              <div className="flex h-12 items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#FAFAF9] px-4">

                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#C88A3D]" />
                  <span className="text-sm">
                    {adults} Adult{adults !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center gap-1">

                  <button
                    type="button"
                    onClick={() =>
                      setAdults(Math.max(1, adults - 1))
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg border bg-white"
                  >
                    <Minus size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border bg-white"
                  >
                    <Plus size={13} />
                  </button>

                </div>
              </div>
            </div>

            {/* CHILDREN */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                Children
              </label>

              <div className="flex h-12 items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#FAFAF9] px-4">

                <span className="text-sm">
                  {children} Child{children !== 1 ? "ren" : ""}
                </span>

                <div className="flex items-center gap-1">

                  <button
                    type="button"
                    onClick={() =>
                      setChildren(Math.max(0, children - 1))
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg border bg-white"
                  >
                    <Minus size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border bg-white"
                  >
                    <Plus size={13} />
                  </button>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* LEFT */}
          <div>

            {/* ABOUT */}
            <section className="rounded-[24px] border border-[#E5DED2] bg-white p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C88A3D]">
                About the stay
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {property.name}
              </h2>

              <p className="mt-4 leading-7 text-[#64748B]">
                {property.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="flex items-center gap-3 rounded-xl bg-[#F7F5F0] p-4">
                  <Clock3 className="text-[#C88A3D]" size={20} />

                  <div>
                    <p className="text-xs text-[#94A3B8]">
                      Check-in
                    </p>
                    <p className="text-sm font-semibold">
                      {property.checkIn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#F7F5F0] p-4">
                  <Clock3 className="text-[#C88A3D]" size={20} />

                  <div>
                    <p className="text-xs text-[#94A3B8]">
                      Check-out
                    </p>
                    <p className="text-sm font-semibold">
                      {property.checkOut}
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* AMENITIES */}
            <section className="mt-6 rounded-[24px] border border-[#E5DED2] bg-white p-6">

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C88A3D]">
                Stay amenities
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Everything you need
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 rounded-xl border border-[#EEE9E0] p-4 text-sm text-[#475569]"
                  >
                    <span className="text-[#C88A3D]">
                      {getAmenityIcon(amenity)}
                    </span>

                    {amenity}
                  </div>
                ))}

              </div>
            </section>

            {/* ROOMS */}
            <section className="mt-6">

              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C88A3D]">
                  Available accommodation
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  Choose your room
                </h2>

                <p className="mt-1 text-sm text-[#64748B]">
                  Select a room to continue with your booking.
                </p>
              </div>

              <div className="space-y-4">

                {property.rooms.map((room) => {

                  const isSelected =
                    selectedRoom?.id === room.id;

                  return (
                    <div
                      key={room.id}
                      className={`rounded-[24px] border bg-white p-5 transition ${
                        isSelected
                          ? "border-[#C88A3D] ring-2 ring-[#C88A3D]/10"
                          : "border-[#E5DED2]"
                      }`}
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:items-center">

                        {/* ROOM IMAGE */}
                        <div className="h-48 w-full overflow-hidden rounded-2xl md:h-40 md:w-52 md:shrink-0">

                          <img
                            src={property.image}
                            alt={room.name}
                            className="h-full w-full object-cover"
                          />

                        </div>

                        {/* ROOM INFO */}
                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                              <h3 className="text-xl font-semibold">
                                {room.name}
                              </h3>

                              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                                {room.description}
                              </p>
                            </div>

                            <div className="shrink-0 sm:text-right">

                              <p className="text-xl font-semibold">
                                ₹{room.price.toLocaleString("en-IN")}
                              </p>

                              <p className="text-xs text-[#94A3B8]">
                                per night
                              </p>

                            </div>

                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F5F0] px-3 py-1.5 text-xs text-[#64748B]">
                              <BedDouble size={14} />
                              {room.bed}
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F5F0] px-3 py-1.5 text-xs text-[#64748B]">
                              <Users size={14} />
                              Up to {room.guests} guests
                            </span>

                            <span className="rounded-full bg-[#F7F5F0] px-3 py-1.5 text-xs text-[#64748B]">
                              {room.size}
                            </span>

                          </div>

                          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2F7D4A]">
                              <Check size={14} />
                              {room.cancellation}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleSelectRoom(room)
                              }
                              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                                isSelected
                                  ? "bg-[#C88A3D] text-white"
                                  : "bg-[#172033] text-white hover:bg-[#24304A]"
                              }`}
                            >
                              {isSelected
                                ? "Room Selected"
                                : "Select Room"}

                              {isSelected ? (
                                <Check size={16} />
                              ) : (
                                <ArrowRight size={16} />
                              )}
                            </button>

                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>
            </section>
          </div>

          {/* RIGHT BOOKING SUMMARY */}
          <aside className="lg:sticky lg:top-6 lg:self-start">

            <div className="rounded-[24px] border border-[#E5DED2] bg-white p-6 shadow-sm">

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C88A3D]">
                Your selection
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Booking summary
              </h2>

              <div className="my-5 border-t border-[#EEE9E0]" />

              <div className="space-y-4">

                <div>
                  <p className="text-xs text-[#94A3B8]">
                    Property
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {property.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#94A3B8]">
                    Location
                  </p>

                  <p className="mt-1 flex items-center gap-1.5 text-sm">
                    <MapPin size={14} className="text-[#C88A3D]" />
                    {property.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#94A3B8]">
                    Room
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {selectedRoom
                      ? selectedRoom.name
                      : "Select a room"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#94A3B8]">
                    Dates
                  </p>

                  <p className="mt-1 text-sm">
                    {checkIn && checkOut
                      ? `${checkIn} → ${checkOut}`
                      : "Select your dates"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#94A3B8]">
                    Guests
                  </p>

                  <p className="mt-1 text-sm">
                    {adults} Adult{adults !== 1 ? "s" : ""}
                    {children > 0
                      ? ` · ${children} Child${children !== 1 ? "ren" : ""}`
                      : ""}
                  </p>
                </div>

              </div>

              <div className="my-5 border-t border-[#EEE9E0]" />

              {selectedRoom && (
                <div className="flex items-end justify-between">

                  <div>
                    <p className="text-xs text-[#94A3B8]">
                      Room price
                    </p>

                    <p className="mt-1 text-sm text-[#64748B]">
                      Per night
                    </p>
                  </div>

                  <p className="text-xl font-semibold">
                    ₹{selectedRoom.price.toLocaleString("en-IN")}
                  </p>

                </div>
              )}

              <button
                type="button"
                onClick={handleBookNow}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
                  selectedRoom && checkIn && checkOut
                    ? "bg-[#C88A3D] text-white hover:bg-[#B77931]"
                    : "cursor-not-allowed bg-[#E2E8F0] text-[#94A3B8]"
                }`}
                disabled={
                  !selectedRoom ||
                  !checkIn ||
                  !checkOut
                }
              >
                Continue to Booking
                <ArrowRight size={17} />
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-[#94A3B8]">
                You can review your booking details before confirmation.
              </p>

            </div>

            {/* ENQUIRE */}
            <Link
              href={`/contact?hotel=${encodeURIComponent(
                property.name
              )}&hotelImage=${encodeURIComponent(
                property.image
              )}&location=${encodeURIComponent(
                property.location
              )}`}
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#D9D1C4] bg-white px-5 py-3 text-sm font-semibold text-[#172033] hover:border-[#C88A3D] hover:text-[#C88A3D]"
            >
              Enquire About This Stay
            </Link>

          </aside>
        </div>
      </section>

      {/* BOTTOM TRUST */}
      <section className="border-t border-[#E7E0D5] bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 sm:grid-cols-3 lg:px-8">

          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#C88A3D]" size={21} />
            <div>
              <p className="text-sm font-semibold">
                Secure booking
              </p>
              <p className="text-xs text-[#64748B]">
                Your booking details stay protected.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Check className="text-[#2F7D4A]" size={21} />
            <div>
              <p className="text-sm font-semibold">
                Flexible enquiry
              </p>
              <p className="text-xs text-[#64748B]">
                Contact our team for stay assistance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-[#C88A3D]" size={21} />
            <div>
              <p className="text-sm font-semibold">
                Jim Corbett stays
              </p>
              <p className="text-xs text-[#64748B]">
                Explore stays across the Corbett region.
              </p>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}