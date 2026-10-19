
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock,
  Eye,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { agentApiRequest } from "@/lib/agentApi";

function getPayload(result) {
  return result?.data?.data ?? result?.data ?? result ?? {};
}

function getBookings(result) {
  const payload = getPayload(result);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.bookings)) return payload.bookings;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
}

function getBookingId(booking) {
  return booking?._id || booking?.id || booking?.booking_id || "";
}

function getReference(booking) {
  return (
    booking?.bookingReference ||
    booking?.booking_reference ||
    booking?.reference ||
    booking?.bookingNumber ||
    booking?.booking_number ||
    getBookingId(booking) ||
    "—"
  );
}

function getCustomerName(booking) {
  return (
    booking?.name ||                    // ← Yeh missing tha! Direct field
    booking?.guestName ||
    booking?.customerName ||
    booking?.customer_name ||
    booking?.customer?.name ||
    booking?.guest?.name ||
    booking?.guestDetails?.name ||
    booking?.customerDetails?.name ||
    booking?.fullName ||
    booking?.full_name ||
    "—"
  );
}

function getPropertyName(booking) {
  return (
    booking?.propertyId?.name ||        // ← Populated ObjectId
    booking?.propertyId?.title ||
    booking?.property?.name ||
    booking?.propertyName ||
    booking?.property_name ||
    booking?.stay?.name ||
    booking?.resortName ||
    booking?.serviceName ||
    "—"
  );
}

function getBookingDate(booking) {
  return (
    booking?.checkIn ||
    booking?.check_in ||
    booking?.checkInDate ||
    booking?.check_in_date ||
    booking?.bookingDate ||
    booking?.createdAt ||
    booking?.created_at ||
    null
  );
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
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

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

function getStatus(booking) {
  return String(
    booking?.bookingStatus ||
      booking?.booking_status ||
      booking?.status ||
      "pending"
  ).toLowerCase();
}

function StatusBadge({ status }) {
  const value = String(status || "pending")
    .replace(/[_-]/g, " ")
    .trim();

  const normalized = value.toLowerCase();

  let classes = "bg-amber-50 text-amber-700";

  if (
    ["confirmed", "completed", "approved", "paid"].includes(normalized)
  ) {
    classes = "bg-green-50 text-green-700";
  } else if (
    ["cancelled", "canceled", "rejected", "failed"].includes(normalized)
  ) {
    classes = "bg-red-50 text-red-700";
  } else if (
    ["pending", "pending payment", "requested", "processing"].includes(
      normalized
    )
  ) {
    classes = "bg-amber-50 text-amber-700";
  } else {
    classes = "bg-gray-100 text-gray-600";
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold capitalize ${classes}`}
    >
      {value || "Pending"}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 px-5 py-12 text-center">
      <CalendarDays className="mx-auto text-gray-400" size={34} />
      <p className="mt-3 text-sm font-semibold text-gray-600">{message}</p>
    </div>
  );
}

export default function AgentBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadBookings = useCallback(
    async (silent = false) => {
      if (typeof window === "undefined") return;

      const token = window.localStorage.getItem("agentToken");

      if (!token) {
        setLoading(false);
        setRefreshing(false);
        router.replace("/agent/login");
        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const result = await agentApiRequest("agent/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(getBookings(result));
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

        setError(
          err?.message ||
            "Unable to load bookings. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = bookings.filter((booking) => {
    const status = getStatus(booking);

    const matchesStatus =
      statusFilter === "all" || status === statusFilter;

    const searchText = [
      getReference(booking),
      getCustomerName(booking),
      getPropertyName(booking),
      booking?.customer?.email,
      booking?.email,
      booking?.phone,
      booking?.type,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesStatus && searchText.includes(search.toLowerCase().trim());
  });

  const confirmedCount = bookings.filter((booking) =>
    ["confirmed", "completed"].includes(getStatus(booking))
  ).length;

  const pendingCount = bookings.filter((booking) =>
    ["pending", "requested", "processing"].includes(getStatus(booking))
  ).length;

  const cancelledCount = bookings.filter((booking) =>
    ["cancelled", "canceled", "rejected"].includes(getStatus(booking))
  ).length;

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#172033]">
      <main className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/agent/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#B96928]"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>

            <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#B96928]">
              PARTNER WORKSPACE
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Bookings
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Track and review bookings associated with your properties.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadBookings(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold transition hover:border-[#B96928] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh bookings
          </button>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-500">
                Total bookings
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                <CalendarDays size={20} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-black">
              {loading ? "—" : bookings.length}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Bookings returned by the server
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-500">
                Confirmed
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <CheckCircle2 size={20} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-black">
              {loading ? "—" : confirmedCount}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Confirmed or completed bookings
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-gray-500">
                Pending
              </p>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock size={20} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-black">
              {loading ? "—" : pendingCount}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Awaiting further processing
            </p>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2 text-sm text-red-700">
              <CircleAlert size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => loadBookings()}
              className="self-start text-sm font-bold text-red-700 underline sm:self-center"
            >
              Try again
            </button>
          </div>
        )}

        {/* Bookings table */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold">All bookings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Search by reference, guest, property or contact details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-64">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search bookings..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#B96928]"
                aria-label="Filter bookings by status"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-5 sm:p-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : !error && filteredBookings.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                message={
                  bookings.length === 0
                    ? "No bookings have been received yet."
                    : "No bookings match your search or selected status."
                }
              />
            </div>
          ) : !error ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Booking reference
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Guest
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Property / Service
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Check-in / Date
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((booking, index) => {
                      const id = getBookingId(booking);

                      return (
                        <tr
                          key={id || getReference(booking) || index}
                          className="transition hover:bg-gray-50/70"
                        >
                          <td className="px-6 py-4 text-sm font-bold">
                            {getReference(booking)}
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm font-bold">
                              {getCustomerName(booking)}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {booking?.customer?.email ||
                                booking?.email ||
                                booking?.customerEmail ||
                                "—"}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {getPropertyName(booking)}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(getBookingDate(booking))}
                          </td>

                          <td className="px-6 py-4 text-sm font-bold">
                            {formatAmount(getAmount(booking))}
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge status={getStatus(booking)} />
                          </td>

                          <td className="px-6 py-4">
                            {id ? (
                              <Link
                                href={`/agent/bookings/${id}`}
                                aria-label={`View booking ${getReference(booking)}`}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-[#B96928] hover:text-[#B96928]"
                              >
                                <Eye size={17} />
                              </Link>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile and tablet booking cards */}
              <div className="space-y-3 p-4 lg:hidden">
                {filteredBookings.map((booking, index) => {
                  const id = getBookingId(booking);

                  return (
                    <article
                      key={id || getReference(booking) || index}
                      className="rounded-xl border border-gray-100 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-all text-sm font-extrabold">
                            {getReference(booking)}
                          </p>
                          <p className="mt-1 break-words text-sm text-gray-600">
                            {getCustomerName(booking)}
                          </p>
                        </div>

                        <StatusBadge status={getStatus(booking)} />
                      </div>

                      <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-xs text-gray-500">
                            Property / Service
                          </span>
                          <span className="max-w-[60%] break-words text-right text-sm font-semibold">
                            {getPropertyName(booking)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-gray-500">
                            Check-in / Date
                          </span>
                          <span className="text-sm font-semibold">
                            {formatDate(getBookingDate(booking))}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-gray-500">Amount</span>
                          <span className="text-sm font-extrabold">
                            {formatAmount(getAmount(booking))}
                          </span>
                        </div>
                      </div>

                      {id && (
                        <Link
                          href={`/agent/bookings/${id}`}
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold transition hover:border-[#B96928] hover:text-[#B96928]"
                        >
                          View booking
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          ) : null}

          {!loading && !error && filteredBookings.length > 0 && (
            <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500 sm:px-6">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          )}
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-gray-200 py-5 text-xs text-gray-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Destination Corbett. Partner workspace.
          </p>

          <Link
            href="/contact"
            className="font-semibold transition hover:text-[#B96928]"
          >
            Need help? Contact support
          </Link>
        </footer>
      </main>
    </div>
  );
}
