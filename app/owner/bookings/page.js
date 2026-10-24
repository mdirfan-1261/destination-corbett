"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  RefreshCw,
  Search,
  ClipboardList,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const API_ROOT = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_BASE = API_ROOT.endsWith("/api")
  ? API_ROOT
  : `${API_ROOT}/api`;

function getBookingList(result) {
  if (Array.isArray(result?.data?.bookings)) return result.data.bookings;
  if (Array.isArray(result?.bookings)) return result.bookings;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getReference(booking) {
  return (
    booking.bookingReference ||
    booking.bookingNumber ||
    booking.reference ||
    booking.bookingId ||
    (booking._id ? `#${String(booking._id).slice(-8).toUpperCase()}` : "—")
  );
}

function getPropertyName(booking) {
  return (
    booking.propertyName ||
    booking.property?.propertyName ||
    booking.property?.name ||
    booking.resortName ||
    booking.hotelName ||
    "Property details unavailable"
  );
}

function getGuestName(booking) {
  return (
    booking.guestName ||
    booking.customerName ||
    booking.customer?.name ||
    booking.contactName ||
    booking.name ||
    "Guest details unavailable"
  );
}

function getBookingDate(booking) {
  return (
    booking.checkIn ||
    booking.checkInDate ||
    booking.bookingDate ||
    booking.createdAt ||
    booking.date
  );
}

function getAmount(booking) {
  return (
    booking.totalAmount ??
    booking.grandTotal ??
    booking.totalPrice ??
    booking.amount ??
    booking.pricing?.total ??
    null
  );
}

function getStatus(booking) {
  return String(booking.status || booking.bookingStatus || "pending")
    .toLowerCase()
    .replaceAll("_", " ");
}

function statusClass(status) {
  const value = status.toLowerCase();

  if (["confirmed", "completed", "approved"].includes(value)) {
    return "bg-green-50 text-green-700";
  }

  if (["cancelled", "rejected", "failed"].includes(value)) {
    return "bg-red-50 text-red-700";
  }

  if (["pending", "pending review"].includes(value)) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function OwnerBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("destin_owner_token")
          : null;

      if (!token) {
        router.replace("/owner/login");
        return;
      }

      const response = await fetch(`${API_BASE}/owner/bookings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("destin_owner_token");
        router.replace("/owner/login");
        return;
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Bookings API abhi backend mein available nahi hai. Backend route add karna hoga."
          );
        }

        throw new Error(
          result.message || "Booking records load nahi ho paaye."
        );
      }

      if (result.success === false) {
        throw new Error(result.message || "Booking records load nahi ho paaye.");
      }

      setBookings(getBookingList(result));
    } catch (err) {
      setError(
        err.message ||
          "Server se connect nahi ho paaya. Backend server check karein."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = bookings.filter((booking) => {
    const searchableText = [
      getReference(booking),
      getPropertyName(booking),
      getGuestName(booking),
      booking.guestPhone,
      booking.phone,
      booking.customer?.phone,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(search.toLowerCase());

    const status = getStatus(booking);
    const matchesStatus =
      statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    ...new Set(bookings.map((booking) => getStatus(booking))),
  ].sort();

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/owner/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#596170] transition hover:text-[#B96928]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B96928]">
              Resort Owner Portal
            </p>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Bookings
            </h1>

            <p className="mt-2 text-sm text-[#687080]">
              Apni properties ki reservation requests aur booking status dekhein.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadBookings(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4DED3] bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-[#B96928] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E4DED3] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#687080]">
                Total bookings loaded
              </span>
              <CalendarDays className="text-[#B96928]" size={20} />
            </div>

            <p className="mt-4 text-3xl font-bold">
              {loading ? "—" : bookings.length}
            </p>
            <p className="mt-1 text-xs text-[#858B95]">
              Count from the backend response
            </p>
          </div>

          <div className="rounded-xl border border-[#E4DED3] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#687080]">
                Matching bookings
              </span>
              <ClipboardList className="text-[#B96928]" size={20} />
            </div>

            <p className="mt-4 text-3xl font-bold">
              {loading ? "—" : filteredBookings.length}
            </p>
            <p className="mt-1 text-xs text-[#858B95]">
              Current search and status filters
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-[#E4DED3] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#EAE5DC] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <h2 className="font-bold">All booking records</h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858B95]"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search booking or guest..."
                  className="w-full rounded-lg border border-[#E4DED3] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#B96928] sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-[#E4DED3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#B96928]"
              >
                <option value="all">All statuses</option>

                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <div className="m-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 sm:m-5">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <div>
                <p className="font-semibold text-amber-900">
                  Bookings unavailable
                </p>
                <p className="mt-1 text-sm text-amber-800">{error}</p>

                <button
                  type="button"
                  onClick={() => loadBookings(true)}
                  className="mt-3 text-sm font-bold text-[#9A4E18] underline underline-offset-4"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="p-12 text-center text-sm text-[#687080]">
              Loading booking records...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <ClipboardList
                size={36}
                className="mx-auto mb-3 text-[#B9B1A5]"
              />

              <h3 className="font-semibold">
                {bookings.length === 0
                  ? "No bookings available"
                  : "No matching bookings"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#687080]">
                {bookings.length === 0
                  ? "Backend se abhi koi booking record return nahi hua."
                  : "Search ya status filter change karke dobara check karein."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#FAF8F4]">
                    {[
                      "Booking reference",
                      "Guest",
                      "Property",
                      "Check-in / Date",
                      "Amount",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#858B95]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking, index) => {
                    const status = getStatus(booking);

                    return (
                      <tr
                        key={booking._id || booking.id || index}
                        className="border-t border-[#F0ECE5] hover:bg-[#FCFBF9]"
                      >
                        <td className="px-5 py-4 text-sm font-semibold">
                          {getReference(booking)}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {getGuestName(booking)}
                        </td>

                        <td className="max-w-56 px-5 py-4 text-sm text-[#596170]">
                          {getPropertyName(booking)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-[#596170]">
                          {formatDate(getBookingDate(booking))}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold">
                          {formatAmount(getAmount(booking))}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(status)}`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}