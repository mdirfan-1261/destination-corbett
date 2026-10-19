
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
} from "lucide-react";
import StatusBadge from "@/components/agent/StatusBadge";

function formatDate(value) {
  if (!value) return "Date not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(value) {
  const amount = Number(value);

  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (!Number.isFinite(amount)) return null;

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function RecentBookings({
  bookings = [],
  loading = false,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-[#172033]">
            Recent Bookings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Latest bookings for your properties.
          </p>
        </div>

        <Link
          href="/agent/bookings"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[#B96928] hover:underline"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3 p-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#B96928]">
            <ClipboardList size={28} />
          </span>

          <h3 className="mt-4 font-bold text-[#172033]">
            No recent bookings
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            New bookings will appear here when they become available.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {bookings.slice(0, 5).map((booking, index) => {
            const id =
              booking._id ||
              booking.id ||
              booking.bookingId ||
              `booking-${index}`;

            const reference =
              booking.bookingReference ||
              booking.bookingCode ||
              (booking._id
                ? String(booking._id).slice(-8).toUpperCase()
                : booking.bookingId || "—");

            const guestName =
              booking.guestName ||
              booking.customerName ||
              booking.user?.name ||
              booking.guest?.name ||
              booking.contactName ||
              "Guest";

            const propertyName =
              booking.property?.name ||
              booking.propertyName ||
              booking.stayName ||
              "";

            const checkIn =
              booking.checkIn ||
              booking.check_in ||
              booking.checkInDate ||
              booking.startDate;

            const amount = formatAmount(
              booking.totalAmount ??
                booking.totalPrice ??
                booking.amount
            );

            const status =
              booking.status ||
              booking.bookingStatus ||
              "pending";

            return (
              <article
                key={id}
                className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                    <ClipboardList size={21} />
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-[#172033]">
                      {guestName}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Booking #{reference}
                    </p>

                    {propertyName && (
                      <p className="mt-1 truncate text-sm text-gray-600">
                        {propertyName}
                      </p>
                    )}

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <CalendarDays size={14} className="shrink-0" />
                      Check-in: {formatDate(checkIn)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <StatusBadge status={status} />

                  {amount && (
                    <p className="text-sm font-extrabold text-[#172033]">
                      {amount}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {!loading && bookings.length > 5 && (
        <div className="border-t border-gray-100 p-4 text-center">
          <Link
            href="/agent/bookings"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#B96928] hover:underline"
          >
            View all bookings
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
