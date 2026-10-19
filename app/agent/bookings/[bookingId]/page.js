"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  UserRound,
  Wallet,
  FileText,
  BedDouble,
  Users,
} from "lucide-react";
import { agentApiRequest } from "@/lib/agentApi";

// ─── Helpers ──────────────────────────────────────────────

function getPayload(result) {
  return result?.data?.data ?? result?.data ?? result ?? {};
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(value) {
  if (value === null || value === undefined || value === "") return "Not available";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Not available";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getAmount(booking) {
  return (
    booking?.totalAmount ??
    booking?.total_amount ??
    booking?.grandTotal ??
    booking?.grand_total ??
    booking?.amount ??
    booking?.price ??
    null
  );
}

function getStatusClasses(status) {
  const value = String(status || "pending").toLowerCase();
  if (["confirmed", "completed", "paid", "approved"].includes(value)) {
    return "bg-green-50 text-green-700 border-green-200";
  }
  if (["cancelled", "canceled", "rejected", "failed"].includes(value)) {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-amber-50 text-amber-700 border-amber-200";
}

// ─── Detail Item Component ─────────────────────────────────

function DetailItem({ icon: Icon, label, value, breakAll = false }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
        <Icon size={19} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <p
          className={`mt-1 text-sm font-bold text-[#172033] ${
            breakAll ? "break-all" : "break-words"
          }`}
        >
          {value === null || value === undefined || value === ""
            ? "Not available"
            : String(value)}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────

export default function AgentBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadBooking = useCallback(
    async (silent = false) => {
      if (!bookingId || typeof window === "undefined") return;

      const token = window.localStorage.getItem("agentToken");
      if (!token) {
        router.replace("/agent/login");
        return;
      }

      if (silent) setRefreshing(true);
      else setLoading(true);

      setError("");

      try {
        const result = await agentApiRequest(
          `agent/bookings/${encodeURIComponent(bookingId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const payload = getPayload(result);
        const bookingData = payload?.booking ?? payload;

        if (
          !bookingData ||
          typeof bookingData !== "object" ||
          Array.isArray(bookingData)
        ) {
          throw new Error("Booking details were not found in the server response.");
        }

        setBooking(bookingData);
      } catch (err) {
        if (
          [401, 403].includes(Number(err?.status)) ||
          /unauthorized|invalid token|token expired|jwt expired/i.test(
            String(err?.message || "")
          )
        ) {
          window.localStorage.removeItem("agentToken");
          window.localStorage.removeItem("agentUser");
          router.replace("/agent/login");
          return;
        }
        setError(err?.message || "Unable to load booking details. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [bookingId, router]
  );

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  // Derived values
  const guestName =
    booking?.name || booking?.guestName || booking?.customerName ||
    booking?.guestDetails?.name || booking?.customer?.name || "Guest";

  const guestEmail =
    booking?.email || booking?.guestEmail || booking?.customerEmail ||
    booking?.guestDetails?.email || booking?.customer?.email || "";

  const guestPhone =
    booking?.phone || booking?.guestPhone || booking?.customerPhone ||
    booking?.guestDetails?.phone || booking?.customer?.phone || "";

  const propertyName =
    booking?.propertyId?.name || booking?.propertyId?.title ||
    booking?.property?.name || booking?.propertyName || "";

  const roomName =
    booking?.roomTypeId?.name || booking?.roomTypeId?.title ||
    booking?.roomType?.name || booking?.roomName || "";

  const status = booking?.status || "pending";
  const reference = booking?.bookingRef || booking?.bookingReference || booking?._id;
  const bookingType = String(booking?.bookingType || booking?.type || "Stay")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const amount = getAmount(booking);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#172033]">
      <main className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">

        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/agent/bookings"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition hover:text-[#B96928]"
          >
            <ArrowLeft size={17} />
            Back to bookings
          </Link>

          <button
            type="button"
            onClick={() => loadBooking(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-[#B96928] disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Heading */}
        <section>
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#B96928]">
            PARTNER WORKSPACE
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Booking Details
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Review the guest information and booking details for this reservation.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5"
          >
            <div className="flex items-start gap-3">
              <CircleAlert size={20} className="mt-0.5 shrink-0 text-red-600" />
              <div className="min-w-0">
                <h2 className="font-extrabold text-red-800">Could not load booking</h2>
                <p className="mt-1 break-words text-sm text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={() => loadBooking()}
                  className="mt-3 text-sm font-bold text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            <div className="h-36 animate-pulse rounded-2xl bg-white" />
            <div className="h-64 animate-pulse rounded-2xl bg-white" />
            <div className="h-64 animate-pulse rounded-2xl bg-white" />
          </div>
        )}

        {/* Booking Content */}
        {!loading && booking && (
          <>
            {/* Summary Card */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Booking Reference
                  </p>
                  <h2 className="mt-2 break-all text-lg font-black sm:text-xl">
                    {reference}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{bookingType}</p>
                </div>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold capitalize ${getStatusClasses(status)}`}
                >
                  {["confirmed", "completed", "approved", "paid"].includes(
                    String(status).toLowerCase()
                  ) ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Clock3 size={14} />
                  )}
                  {String(status).replace(/[_-]/g, " ")}
                </span>
              </div>

              {/* Quick Summary Row */}
              <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
                <div className="rounded-xl bg-[#F7F5F0] p-4">
                  <p className="text-xs font-semibold text-gray-500">Check-In</p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm font-extrabold">
                    <CalendarDays size={16} className="text-[#B96928]" />
                    {formatDate(booking?.checkIn)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F7F5F0] p-4">
                  <p className="text-xs font-semibold text-gray-500">Check-Out</p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm font-extrabold">
                    <CalendarDays size={16} className="text-[#B96928]" />
                    {formatDate(booking?.checkOut)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F7F5F0] p-4">
                  <p className="text-xs font-semibold text-gray-500">Total Amount</p>
                  <p className="mt-1.5 flex items-center gap-2 text-sm font-extrabold">
                    <Wallet size={16} className="text-[#B96928]" />
                    {formatAmount(amount)}
                  </p>
                </div>
              </div>
            </section>

            {/* Guest Information */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                  <UserRound size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold">Guest Information</h2>
                  <p className="text-sm text-gray-500">
                    Contact details provided with this booking
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem icon={UserRound} label="Guest Name" value={guestName} />
                <DetailItem icon={Mail} label="Email Address" value={guestEmail} breakAll />
                <DetailItem icon={Phone} label="Phone Number" value={guestPhone} />
                <DetailItem icon={FileText} label="Booking Type" value={bookingType} />
              </div>
            </section>

            {/* Stay Details */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                  <MapPin size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold">Stay Details</h2>
                  <p className="text-sm text-gray-500">Resort & room information</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={MapPin}
                  label="Property / Resort"
                  value={propertyName || "Not specified"}
                />
                <DetailItem
                  icon={BedDouble}
                  label="Room Category"
                  value={roomName || "Not specified"}
                />
                <DetailItem
                  icon={CalendarDays}
                  label="Check-In Date"
                  value={formatDate(booking?.checkIn)}
                />
                <DetailItem
                  icon={CalendarDays}
                  label="Check-Out Date"
                  value={formatDate(booking?.checkOut)}
                />
                <DetailItem
                  icon={BedDouble}
                  label="Number of Rooms"
                  value={booking?.roomsCount ?? booking?.rooms ?? "—"}
                />
                <DetailItem
                  icon={Users}
                  label="Total Guests"
                  value={booking?.guestsCount ?? booking?.adults ?? "—"}
                />
              </div>

              {/* Special Requests */}
              {(booking?.specialRequests || booking?.specialRequest) && (
                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                    Special Requests
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-amber-900">
                    {booking.specialRequests || booking.specialRequest}
                  </p>
                </div>
              )}
            </section>

            {/* Payment Summary */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                  <Wallet size={20} />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold">Payment Summary</h2>
                  <p className="text-sm text-gray-500">Booking financials & commission</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={Wallet}
                  label="Total Booking Amount"
                  value={formatAmount(amount)}
                />
                {booking?.commission != null && (
                  <DetailItem
                    icon={Wallet}
                    label="Your Commission"
                    value={formatAmount(booking.commission)}
                  />
                )}
                {booking?.paymentStatus && (
                  <DetailItem
                    icon={FileText}
                    label="Payment Status"
                    value={String(booking.paymentStatus).replace(/[_-]/g, " ")}
                  />
                )}
                <DetailItem
                  icon={CalendarDays}
                  label="Booked On"
                  value={formatDate(booking?.createdAt)}
                />
              </div>
            </section>

            {/* Footer Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/agent/bookings"
                className="inline-flex items-center gap-2 rounded-xl bg-[#18352A] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#18352A]/90"
              >
                <ArrowLeft size={16} />
                All Bookings
              </Link>
              <Link
                href="/agent/explore"
                className="inline-flex items-center gap-2 rounded-xl border border-[#B96928] px-5 py-3 text-sm font-extrabold text-[#B96928] transition hover:bg-[#B96928] hover:text-white"
              >
                Book Another Stay
              </Link>
            </div>
          </>
        )}

        <footer className="border-t border-gray-200 py-5 text-xs text-gray-500">
          © {new Date().getFullYear()} Destination Corbett. Partner workspace.
        </footer>
      </main>
    </div>
  );
}