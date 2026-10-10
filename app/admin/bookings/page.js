"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Users,
  Hotel,
  TreePine,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Edit3,
  Save,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  CircleAlert,
  CalendarCheck,
  BedDouble,
  FileText,
  Download,
  MessageCircle,
  Copy,
  Repeat,
  Check,
} from "lucide-react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const PRIMARY = "#B96928";
const BRAND_NAME = "Our Team";

const BOOKING_STATUSES = ["pending", "contacted", "confirmed", "cancelled"];
const BOOKING_TYPES = [
  "all",
  "safari",
  "hotel",
  "package",
  "event",
  "wedding",
  "general",
];
const ROOM_TYPES = ["hotel", "package", "wedding"];

/* ----------------------------- helpers ----------------------------- */

function getId(item) {
  return String(item?._id || item?.id || "");
}

function getName(item) {
  return (
    item?.name ||
    item?.customerName ||
    item?.fullName ||
    item?.user?.name ||
    item?.customer?.name ||
    "Guest"
  );
}

function getPhone(item) {
  return (
    item?.phone ||
    item?.mobile ||
    item?.phoneNumber ||
    item?.customer?.phone ||
    item?.user?.phone ||
    ""
  );
}

function getEmail(item) {
  return item?.email || item?.customer?.email || item?.user?.email || "";
}

function getReference(item) {
  return (
    item?.bookingReference ||
    item?.bookingId ||
    item?.reference ||
    item?.bookingNumber ||
    item?.confirmationCode ||
    getId(item).slice(-8).toUpperCase() ||
    "N/A"
  );
}

function getBookingType(item) {
  const value = String(
    item?.bookingType || item?.type || item?.category || item?.inquiryType || ""
  ).toLowerCase();

  if (value.includes("safari")) return "safari";

  if (
    value.includes("hotel") ||
    value.includes("stay") ||
    value.includes("resort") ||
    value.includes("room")
  ) {
    return "hotel";
  }

  if (value.includes("package")) return "package";

  if (
    value.includes("event") ||
    value.includes("mice") ||
    value.includes("corporate")
  ) {
    return "event";
  }

  if (value.includes("wedding")) return "wedding";

  return "general";
}

function getStatus(item) {
  const status = String(item?.status || "pending").toLowerCase();

  if (BOOKING_STATUSES.includes(status)) return status;

  if (status === "complete" || status === "completed") return "confirmed";

  return "pending";
}

function getLocation(item) {
  return (
    item?.location ||
    item?.zone ||
    item?.safariZone ||
    item?.hotel ||
    item?.resort ||
    item?.destination ||
    item?.city ||
    ""
  );
}

function getBookingDate(item) {
  return (
    item?.checkIn ||
    item?.safariDate ||
    item?.bookingDate ||
    item?.travelDate ||
    item?.date ||
    item?.createdAt ||
    ""
  );
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

function toDateInput(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getGuestCount(item) {
  const adults = Number(item?.adults || 0);
  const children = Number(item?.children || 0);
  const guests = Number(item?.guests || 0);

  return adults + children || guests || 0;
}

function getRoomCount(item) {
  return Number(item?.rooms || item?.roomCount || 1);
}

function getAmount(item) {
  const value = item?.totalAmount ?? item?.amount;

  return value != null && value !== "" ? Number(value) : null;
}

function formatLabel(value) {
  return String(value || "General")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getInitials(name) {
  return String(name || "Guest")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function getCustomerKey(item) {
  const phone = getPhone(item).replace(/\D/g, "").slice(-10);

  if (phone.length >= 10) return `p:${phone}`;

  const email = getEmail(item).trim().toLowerCase();

  if (email) return `e:${email}`;

  return "";
}

function getWhatsappNumber(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) return "";

  if (digits.length === 10) return `91${digits}`;

  return digits;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildFollowUp(booking, count) {
  const name = getName(booking);
  const first = name === "Guest" ? "Sir/Madam" : name.trim().split(/\s+/)[0];
  const type = formatLabel(getBookingType(booking)).toLowerCase();
  const ref = getReference(booking);
  const date = formatDate(getBookingDate(booking));
  const status = getStatus(booking);
  const guests = getGuestCount(booking);
  const repeat = count > 1;

  const greeting = repeat
    ? `Namaste ${first}, welcome back! Thank you for choosing us again. This is booking number ${count} with us.`
    : `Namaste ${first}, thank you for your enquiry with us.`;

  let body = "";

  if (status === "confirmed") {
    body = `Your ${type} booking (Ref #${ref}) for ${date}${
      guests ? ` for ${guests} guest(s)` : ""
    } is confirmed. We look forward to hosting you.`;
  } else if (status === "cancelled") {
    body = `Your ${type} booking (Ref #${ref}) for ${date} has been cancelled. If you would like to rebook or change the dates, just reply to this message.`;
  } else {
    body = `We are following up on your ${type} booking (Ref #${ref}) for ${date}${
      guests ? ` for ${guests} guest(s)` : ""
    }. Could you please confirm your travel details so we can lock your reservation?`;
  }

  return `${greeting}\n\n${body}\n\nRegards,\n${BRAND_NAME}`;
}

/* ----------------------------- small UI ----------------------------- */

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    contacted: "bg-blue-50 text-blue-700 border-blue-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const dots = {
    pending: "bg-amber-500",
    contacted: "bg-blue-500",
    confirmed: "bg-emerald-500",
    cancelled: "bg-red-500",
  };

  const value = BOOKING_STATUSES.includes(status) ? status : "pending";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${styles[value]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[value]}`} />
      {formatLabel(value)}
    </span>
  );
}

function TypeBadge({ type }) {
  const config = {
    safari: {
      icon: TreePine,
      style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    hotel: {
      icon: Hotel,
      style: "bg-amber-50 text-amber-700 border-amber-200",
    },
    package: {
      icon: CalendarCheck,
      style: "bg-orange-50 text-orange-700 border-orange-200",
    },
    event: {
      icon: Users,
      style: "bg-purple-50 text-purple-700 border-purple-200",
    },
    wedding: {
      icon: CalendarDays,
      style: "bg-rose-50 text-rose-700 border-rose-200",
    },
    general: {
      icon: FileText,
      style: "bg-slate-50 text-slate-700 border-slate-200",
    },
  };

  const selected = config[type] || config.general;
  const Icon = selected.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${selected.style}`}
    >
      <Icon size={10} />
      {formatLabel(type)}
    </span>
  );
}

function RepeatBadge({ count }) {
  if (count < 2) return null;

  return (
    <span
      title={`${count} bookings from this customer`}
      className="inline-flex items-center gap-1 rounded-full border border-[#B96928]/30 bg-[#FFF7EF] px-1.5 py-0.5 text-[10px] font-bold text-[#B96928]"
    >
      <Repeat size={9} />
      {count} bookings
    </span>
  );
}

function ContactLink({ type, value }) {
  if (!value) {
    return <span className="text-[11px] text-slate-400">—</span>;
  }

  const href =
    type === "phone"
      ? `tel:${String(value).replace(/\s/g, "")}`
      : `mailto:${value}`;

  const Icon = type === "phone" ? Phone : Mail;

  return (
    <a
      href={href}
      onClick={(event) => event.stopPropagation()}
      title={type === "phone" ? "Call" : "Send email"}
      className="inline-flex max-w-full items-center gap-1 text-[11px] font-medium text-[#172033] hover:text-[#B96928] hover:underline"
    >
      <Icon size={11} className="shrink-0 text-[#B96928]" />
      <span className="truncate">{value}</span>
    </a>
  );
}

function StatCard({ label, value, icon: Icon, color, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition hover:shadow-sm ${
        active
          ? "border-[#B96928] bg-[#FFF7EF]"
          : "border-[#E2E6EA] bg-white"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${color}`}
      >
        <Icon size={14} />
      </span>

      <span className="min-w-0">
        <span className="block text-[10px] font-medium text-[#718096]">
          {label}
        </span>
        <span className="block text-base font-bold leading-tight text-[#172033]">
          {value}
        </span>
      </span>
    </button>
  );
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex min-w-0 gap-2 rounded-md bg-[#F8FAFC] px-2 py-1.5">
      <Icon size={13} className="mt-0.5 shrink-0 text-[#B96928]" />

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-slate-500">{label}</p>
        <div className="mt-0.5 break-words text-xs font-semibold text-[#172033]">
          {children || "—"}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- details drawer ----------------------------- */

function BookingDetails({
  booking,
  customerBookings,
  onClose,
  onEdit,
  onStatusChange,
  onDelete,
  onSelect,
  updating,
}) {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const count = customerBookings.length;
  const id = getId(booking);
  const status = getStatus(booking);

  useEffect(() => {
    if (!booking) return;

    setMessage(buildFollowUp(booking, count));
    setCopied(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, status, count]);

  if (!booking) return null;

  const type = getBookingType(booking);
  const name = getName(booking);
  const phone = getPhone(booking);
  const email = getEmail(booking);
  const amount = getAmount(booking);
  const waNumber = getWhatsappNumber(phone);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const subject = `Booking ${
    status === "confirmed" ? "Confirmation" : "Follow-up"
  } - #${getReference(booking)}`;

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-l border-[#E2E6EA] bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-[#E8ECF0] bg-[#F8FAFC] px-3 py-1.5">
        <div>
          <p className="text-xs font-bold text-slate-600">Booking Details</p>
          <p className="text-[10px] text-slate-400">
            #{getReference(booking)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100"
          aria-label="Close details"
        >
          <X size={14} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
        <div className="flex items-center gap-2 rounded-lg border border-[#E2E6EA] bg-[#F8FAFC] p-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#172033] text-xs font-bold text-white">
            {getInitials(name)}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-[#172033]">
              {name}
            </h2>

            <div className="mt-1 flex flex-wrap items-center gap-1">
              <TypeBadge type={type} />
              <StatusBadge status={status} />
              <RepeatBadge count={count} />
            </div>
          </div>
        </div>

        <section>
          <h3 className="mb-1 text-[11px] font-bold text-slate-500">
            Contact
          </h3>

          <div className="space-y-1">
            <DetailRow icon={Phone} label="Phone">
              {phone ? (
                <span className="flex flex-wrap items-center gap-2">
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="hover:text-[#B96928] hover:underline"
                  >
                    {phone}
                  </a>

                  {waNumber && (
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      <MessageCircle size={10} />
                      WhatsApp
                    </a>
                  )}
                </span>
              ) : null}
            </DetailRow>

            <DetailRow icon={Mail} label="Email">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="hover:text-[#B96928] hover:underline"
                >
                  {email}
                </a>
              ) : null}
            </DetailRow>

            <DetailRow icon={MapPin} label="Location / Zone">
              {getLocation(booking)}
            </DetailRow>
          </div>
        </section>

        <section>
          <h3 className="mb-1 text-[11px] font-bold text-slate-500">
            Reservation
          </h3>

          <div className="grid grid-cols-2 gap-1">
            <DetailRow icon={CalendarDays} label="Travel / Check-in">
              {formatDate(
                booking.checkIn ||
                  booking.safariDate ||
                  booking.travelDate ||
                  booking.date
              )}
            </DetailRow>

            <DetailRow icon={CalendarDays} label="Check-out">
              {formatDate(booking.checkOut)}
            </DetailRow>

            <DetailRow icon={Users} label="Guests">
              {getGuestCount(booking) || "—"}
            </DetailRow>

            {ROOM_TYPES.includes(type) && (
              <DetailRow icon={BedDouble} label="Rooms">
                {getRoomCount(booking)}
              </DetailRow>
            )}
          </div>

          <div className="mt-1 space-y-1 rounded-lg border border-[#E2E6EA] px-2.5 py-1.5 text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Created</span>
              <span className="font-semibold text-[#172033]">
                {formatDate(booking.createdAt)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-slate-500">Amount</span>
              <span className="font-semibold text-[#172033]">
                {amount != null
                  ? `₹${amount.toLocaleString("en-IN")}`
                  : "—"}
              </span>
            </div>
          </div>
        </section>

        {count > 1 && (
          <section>
            <h3 className="mb-1 text-[11px] font-bold text-slate-500">
              Customer's Bookings ({count})
            </h3>

            <div className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-[#E2E6EA]">
              {customerBookings.map((item) => {
                const itemId = getId(item);
                const current = itemId === id;

                return (
                  <button
                    key={itemId || getReference(item)}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={`flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left hover:bg-[#FFF9F3] ${
                      current ? "bg-[#FFF7EF]" : "bg-white"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-bold text-[#172033]">
                        #{getReference(item)} ·{" "}
                        {formatLabel(getBookingType(item))}
                      </span>

                      <span className="block text-[10px] text-slate-500">
                        {formatDate(getBookingDate(item))}
                      </span>
                    </span>

                    <StatusBadge status={getStatus(item)} />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {(booking.specialRequest || booking.message || booking.notes) && (
          <section>
            <h3 className="mb-1 text-[11px] font-bold text-slate-500">
              Customer Notes
            </h3>

            <p className="whitespace-pre-wrap break-words rounded-lg border border-[#E2E6EA] bg-[#F8FAFC] p-2 text-xs leading-4 text-slate-700">
              {booking.specialRequest || booking.message || booking.notes}
            </p>
          </section>
        )}

        <section>
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-500">
              {status === "confirmed"
                ? "Confirmation Message"
                : "Follow-up Message"}
            </h3>

            <button
              type="button"
              onClick={() => setMessage(buildFollowUp(booking, count))}
              className="text-[10px] font-semibold text-[#B96928] hover:underline"
            >
              Reset
            </button>
          </div>

          <textarea
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full resize-y rounded-lg border border-slate-200 p-2 text-xs leading-4 text-slate-700 outline-none focus:border-[#B96928]"
          />

          <div className="mt-1 grid grid-cols-3 gap-1">
            <a
              href={
                waNumber
                  ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
                  : undefined
              }
              target="_blank"
              rel="noreferrer"
              aria-disabled={!waNumber}
              className={`flex items-center justify-center gap-1 rounded-md px-1.5 py-1.5 text-[10px] font-semibold text-white ${
                waNumber
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "pointer-events-none bg-slate-300"
              }`}
            >
              <MessageCircle size={11} />
              WhatsApp
            </a>

            <a
              href={
                email
                  ? `mailto:${email}?subject=${encodeURIComponent(
                      subject
                    )}&body=${encodeURIComponent(message)}`
                  : undefined
              }
              aria-disabled={!email}
              className={`flex items-center justify-center gap-1 rounded-md px-1.5 py-1.5 text-[10px] font-semibold text-white ${
                email
                  ? "bg-[#172033] hover:bg-[#0f1624]"
                  : "pointer-events-none bg-slate-300"
              }`}
            >
              <Mail size={11} />
              Email
            </a>

            <button
              type="button"
              onClick={copyMessage}
              className="flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>
      </div>

      <div className="shrink-0 space-y-1 border-t border-[#E8ECF0] bg-[#F8FAFC] p-2">
        <div className="flex items-center gap-1.5">
          <select
            value={status}
            disabled={updating}
            onChange={(event) => onStatusChange(booking, event.target.value)}
            className="h-7 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-[#172033] outline-none focus:border-[#B96928]"
          >
            {BOOKING_STATUSES.map((value) => (
              <option key={value} value={value}>
                {formatLabel(value)}
              </option>
            ))}
          </select>

          {status !== "confirmed" && (
            <button
              type="button"
              disabled={updating}
              onClick={() => onStatusChange(booking, "confirmed")}
              className="flex h-7 items-center gap-1 rounded-md bg-emerald-600 px-2 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 size={12} />
              Confirm
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => onEdit(booking)}
            className="flex items-center justify-center gap-1 rounded-md bg-[#B96928] px-2 py-1.5 text-xs font-semibold text-white hover:bg-[#A65B23]"
          >
            <Edit3 size={12} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(booking)}
            className="flex items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ----------------------------- edit modal ----------------------------- */

function EditBookingModal({ booking, onClose, onSave, saving }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!booking) {
      setForm(null);
      return;
    }

    setForm({
      name: getName(booking) === "Guest" ? "" : getName(booking),
      phone: getPhone(booking),
      email: getEmail(booking),
      bookingType:
        booking.bookingType || booking.type || getBookingType(booking),
      location: getLocation(booking),
      checkIn: toDateInput(
        booking.checkIn ||
          booking.safariDate ||
          booking.travelDate ||
          booking.date
      ),
      checkOut: toDateInput(booking.checkOut),
      adults: booking.adults ?? 2,
      children: booking.children ?? 0,
      guests: booking.guests ?? "",
      rooms: booking.rooms ?? 1,
      status: getStatus(booking),
      specialRequest:
        booking.specialRequest || booking.message || booking.notes || "",
    });
  }, [booking]);

  if (!booking || !form) return null;

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event) => {
    event.preventDefault();

    onSave(booking, {
      ...form,
      adults: Number(form.adults || 0),
      children: Number(form.children || 0),
      rooms: Number(form.rooms || 1),
    });
  };

  const inputClass =
    "h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs outline-none focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10";

  const labelClass = "mb-1 block text-[11px] font-semibold text-slate-600";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-white/50 bg-white shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-[#F8FAFC] px-4 py-2.5">
          <div>
            <h2 className="text-sm font-bold text-[#172033]">Edit Booking</h2>
            <p className="text-[11px] text-slate-500">
              Reference: {getReference(booking)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid min-h-0 grid-cols-2 gap-2.5 overflow-y-auto p-3">
          {[
            ["Customer Name", "name", "text"],
            ["Phone", "phone", "tel"],
            ["Email", "email", "email"],
            ["Location / Zone", "location", "text"],
          ].map(([label, key, type]) => (
            <label key={key} className="col-span-2 block sm:col-span-1">
              <span className={labelClass}>{label}</span>
              <input
                type={type}
                value={form[key]}
                onChange={(event) => updateField(key, event.target.value)}
                className={inputClass}
              />
            </label>
          ))}

          <label className="col-span-2 block sm:col-span-1">
            <span className={labelClass}>Booking Type</span>
            <select
              value={form.bookingType}
              onChange={(event) =>
                updateField("bookingType", event.target.value)
              }
              className={inputClass}
            >
              {BOOKING_TYPES.filter((type) => type !== "all").map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>
          </label>

          <label className="col-span-2 block sm:col-span-1">
            <span className={labelClass}>Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className={inputClass}
            >
              {BOOKING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </label>

          <label className="col-span-2 block sm:col-span-1">
            <span className={labelClass}>Check-in / Safari Date</span>
            <input
              type="date"
              value={form.checkIn}
              onChange={(event) => updateField("checkIn", event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="col-span-2 block sm:col-span-1">
            <span className={labelClass}>Check-out</span>
            <input
              type="date"
              value={form.checkOut}
              onChange={(event) => updateField("checkOut", event.target.value)}
              className={inputClass}
            />
          </label>

          {[
            ["Adults", "adults", 0],
            ["Children", "children", 0],
            ["Rooms", "rooms", 1],
            ["Guests (single field)", "guests", 0],
          ].map(([label, key, min]) => (
            <label key={key} className="col-span-1 block">
              <span className={labelClass}>{label}</span>
              <input
                type="number"
                min={min}
                value={form[key]}
                onChange={(event) => updateField(key, event.target.value)}
                className={inputClass}
              />
            </label>
          ))}

          <label className="col-span-2 block">
            <span className={labelClass}>Special Request / Notes</span>
            <textarea
              rows={3}
              value={form.specialRequest}
              onChange={(event) =>
                updateField("specialRequest", event.target.value)
              }
              className="w-full resize-y rounded-md border border-slate-200 p-2 text-xs outline-none focus:border-[#B96928]"
              placeholder="Customer requirements..."
            />
          </label>
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-slate-100 bg-[#F8FAFC] px-4 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-md bg-[#B96928] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#A65B23] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={13} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ----------------------------- main page ----------------------------- */

function AdminBookingsContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("adminToken") || "";
  };

  const request = useCallback(async (path, options = {}) => {
    const token = getToken();

    if (!token) {
      throw new Error("Admin session not found. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          data.message || "You are not authorized to perform this action."
        );
      }

      throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
  }, []);

  const loadBookings = useCallback(
    async (showRefresh = false) => {
      setError("");

      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const data = await request("/api/bookings");

        const list =
          data.bookings ||
          data.data?.bookings ||
          data.data ||
          data.results ||
          (Array.isArray(data) ? data : []);

        if (!Array.isArray(list)) {
          throw new Error("The bookings API returned an unexpected response.");
        }

        setBookings(list);
      } catch (err) {
        console.error("Load bookings error:", err);
        setError(
          `${err.message}. Check the bookings API route and backend server.`
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [request]
  );

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter, fromDate, toDate, itemsPerPage]);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 3500);

    return () => clearTimeout(timer);
  }, [notice]);

  const customerMap = useMemo(() => {
    const map = new Map();

    bookings.forEach((item) => {
      const key = getCustomerKey(item);

      if (!key) return;

      if (!map.has(key)) map.set(key, []);

      map.get(key).push(item);
    });

    return map;
  }, [bookings]);

  const getCustomerBookings = useCallback(
    (item) => {
      if (!item) return [];

      const key = getCustomerKey(item);

      return key && customerMap.has(key) ? customerMap.get(key) : [item];
    },
    [customerMap]
  );

  const counts = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter(
        (item) => getStatus(item) === "pending"
      ).length,
      confirmed: bookings.filter(
        (item) => getStatus(item) === "confirmed"
      ).length,
      cancelled: bookings.filter(
        (item) => getStatus(item) === "cancelled"
      ).length,
    }),
    [bookings]
  );

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((item) => {
      const statusMatch =
        statusFilter === "all" || getStatus(item) === statusFilter;

      const typeMatch =
        typeFilter === "all" || getBookingType(item) === typeFilter;

      const searchable = [
        getName(item),
        getPhone(item),
        getEmail(item),
        getReference(item),
        getLocation(item),
        item?.bookingType,
        item?.type,
        item?.hotel,
        item?.safariType,
        getId(item),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatch = !query || searchable.includes(query);

      const dateValue = toDateInput(getBookingDate(item));
      const fromMatch = !fromDate || (dateValue && dateValue >= fromDate);
      const toMatch = !toDate || (dateValue && dateValue <= toDate);

      return statusMatch && typeMatch && searchMatch && fromMatch && toMatch;
    });
  }, [bookings, search, statusFilter, typeFilter, fromDate, toDate]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / itemsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const pageBookings = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;

    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, safePage, itemsPerPage]);

  const allPageSelected =
    pageBookings.length > 0 &&
    pageBookings.every(
      (booking) => getId(booking) && selectedIds.includes(getId(booking))
    );

  /* ---------- export Excel .xls ---------- */

  const exportToDocument = () => {
    const dataToExport =
      selectedIds.length > 0
        ? bookings.filter((item) => selectedIds.includes(getId(item)))
        : filteredBookings;

    if (!dataToExport.length) {
      setNotice("No bookings available to download.");
      return;
    }

    const htmlContent = `
      <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th { background: #18352A; color: white; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; }
        </style>
      </head>
      <body>
        <h2>DESTINATION CORBETT - BOOKINGS REPORT</h2>
        <p>Generated on: ${new Date().toLocaleString("en-IN")} | Total Records: ${dataToExport.length}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Reference</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Type</th>
              <th>Location</th>
              <th>Travel Date</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Rooms</th>
              <th>Amount (INR)</th>
              <th>Status</th>
              <th>Customer Bookings</th>
              <th>Customer Note</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            ${dataToExport
              .map((item, index) => {
                const type = getBookingType(item);
                const hasRooms = ROOM_TYPES.includes(type);
                const amount = getAmount(item);

                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHtml(getReference(item))}</td>
                    <td><b>${escapeHtml(getName(item))}</b></td>
                    <td style="mso-number-format:'\\@'">${escapeHtml(getPhone(item) || "N/A")}</td>
                    <td>${escapeHtml(getEmail(item) || "N/A")}</td>
                    <td>${escapeHtml(formatLabel(type))}</td>
                    <td>${escapeHtml(getLocation(item) || "-")}</td>
                    <td>${escapeHtml(formatDate(getBookingDate(item)))}</td>
                    <td>${escapeHtml(formatDate(item.checkOut))}</td>
                    <td>${getGuestCount(item) || "-"}</td>
                    <td>${hasRooms ? getRoomCount(item) : "-"}</td>
                    <td>${amount != null ? amount : "-"}</td>
                    <td>${escapeHtml(getStatus(item).toUpperCase())}</td>
                    <td>${getCustomerBookings(item).length}</td>
                    <td>${escapeHtml(item.specialRequest || item.message || item.notes || "-")}</td>
                    <td>${escapeHtml(formatDate(item.createdAt))}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `Destination_Corbett_Bookings_${new Date()
      .toISOString()
      .slice(0, 10)}.xls`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setNotice(`${dataToExport.length} booking(s) exported.`);
  };

  /* ---------- update booking status ---------- */

  const changeStatus = async (booking, newStatus) => {
    const id = getId(booking);

    if (!id) {
      setNotice("This booking does not have a valid ID.");
      return;
    }

    if (getStatus(booking) === newStatus) return;

    if (newStatus === "confirmed") {
      const others = getCustomerBookings(booking);

      if (others.length > 1) {
        const ok = window.confirm(
          `${getName(booking)} has ${others.length} bookings.\n\nOnly booking #${getReference(
            booking
          )} will be confirmed. Other bookings will not change.\n\nContinue?`
        );

        if (!ok) return;
      }
    }

    setUpdatingId(id);

    try {
      await request(`/api/bookings/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      setBookings((current) =>
        current.map((item) =>
          getId(item) === id ? { ...item, status: newStatus } : item
        )
      );

      setSelectedBooking((current) =>
        current && getId(current) === id
          ? { ...current, status: newStatus }
          : current
      );

      setNotice(
        newStatus === "confirmed"
          ? `Booking #${getReference(booking)} confirmed.`
          : "Booking status updated successfully."
      );
    } catch (err) {
      setNotice(err.message);
    } finally {
      setUpdatingId("");
    }
  };

  /* ---------- edit booking ---------- */

  const saveBooking = async (booking, fields) => {
    const id = getId(booking);

    if (!id) {
      setNotice("This booking does not have a valid ID.");
      return;
    }

    setSaving(true);

    try {
      const data = await request(`/api/bookings/${encodeURIComponent(id)}`, {
        method: "PUT",
        body: JSON.stringify(fields),
      });

      const updated = data.booking || data.data?.booking || data.data || data;

      setBookings((current) =>
        current.map((item) =>
          getId(item) === id ? { ...item, ...fields, ...(updated || {}) } : item
        )
      );

      setSelectedBooking((current) =>
        current && getId(current) === id
          ? { ...current, ...fields, ...(updated || {}) }
          : current
      );

      setEditingBooking(null);
      setNotice("Booking updated successfully.");
    } catch (err) {
      setNotice(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- delete one booking ---------- */

  const deleteBooking = async (booking) => {
    const id = getId(booking);

    if (!id) {
      setNotice("This booking does not have a valid ID.");
      return;
    }

    const confirmed = window.confirm(
      `Delete booking ${getReference(booking)}?`
    );

    if (!confirmed) return;

    try {
      await request(`/api/bookings/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      setBookings((current) =>
        current.filter((item) => getId(item) !== id)
      );

      setSelectedIds((current) => current.filter((itemId) => itemId !== id));

      setSelectedBooking((current) =>
        current && getId(current) === id ? null : current
      );

      setEditingBooking((current) =>
        current && getId(current) === id ? null : current
      );

      setNotice("Booking deleted successfully.");
    } catch (err) {
      setNotice(err.message);
    }
  };

  /* ---------- bulk delete selected bookings ---------- */

  const deleteSelectedBookings = async () => {
    if (bulkDeleting || selectedIds.length === 0) return;

    const selectedBookings = bookings.filter(
      (booking) => selectedIds.includes(getId(booking)) && getId(booking)
    );

    if (selectedBookings.length === 0) {
      setNotice("Please select valid bookings to delete.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedBookings.length} selected booking(s)?\n\nThis action cannot be undone from this page.`
    );

    if (!confirmed) return;

    setBulkDeleting(true);

    const deletedIds = [];
    const failedReferences = [];

    try {
      for (const booking of selectedBookings) {
        const id = getId(booking);

        try {
          await request(`/api/bookings/${encodeURIComponent(id)}`, {
            method: "DELETE",
          });

          deletedIds.push(id);
        } catch (err) {
          failedReferences.push(
            `#${getReference(booking)}: ${err.message}`
          );
        }
      }

      if (deletedIds.length > 0) {
        const deletedSet = new Set(deletedIds);

        setBookings((current) =>
          current.filter((booking) => !deletedSet.has(getId(booking)))
        );

        setSelectedIds((current) =>
          current.filter((id) => !deletedSet.has(id))
        );

        setSelectedBooking((current) =>
          current && deletedSet.has(getId(current)) ? null : current
        );

        setEditingBooking((current) =>
          current && deletedSet.has(getId(current)) ? null : current
        );
      }

      if (failedReferences.length === 0) {
        setSelectedIds([]);
        setNotice(
          `${deletedIds.length} booking(s) deleted successfully.`
        );
      } else {
        setNotice(
          `${deletedIds.length} deleted. ${failedReferences.length} failed: ${failedReferences.join(
            "; "
          )}`
        );
      }
    } finally {
      setBulkDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setFromDate("");
    setToDate("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#172033] shadow-sm">
          <RefreshCw
            className="animate-spin text-[#B96928]"
            size={15}
          />
          Loading Bookings...
        </div>
      </div>
    );
  }

  const drawerOpen = Boolean(selectedBooking);

  const renderDetails = () => (
    <BookingDetails
      booking={selectedBooking}
      customerBookings={getCustomerBookings(selectedBooking)}
      onClose={() => setSelectedBooking(null)}
      onEdit={(booking) => setEditingBooking(booking)}
      onStatusChange={changeStatus}
      onDelete={deleteBooking}
      onSelect={(booking) => setSelectedBooking(booking)}
      updating={updatingId === getId(selectedBooking)}
    />
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F7F5F0] px-2.5 py-2 sm:px-3 lg:px-4">
      {notice && (
        <div className="fixed right-3 top-3 z-[120] flex max-w-[calc(100vw-1.5rem)] items-start gap-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-xl">
          <CircleAlert
            size={15}
            className="mt-0.5 shrink-0 text-[#B96928]"
          />

          <p className="max-w-sm text-xs font-medium leading-4 text-[#172033]">
            {notice}
          </p>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            <X size={13} className="text-slate-400" />
          </button>
        </div>
      )}

      <div className="mx-auto max-w-[1800px]">
        {/* header */}
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <CalendarCheck size={17} color={PRIMARY} />

            <h1 className="text-base font-bold tracking-tight text-[#172033]">
              Bookings Management
            </h1>

            <span className="rounded-full border border-[#B96928]/25 bg-[#FFF7EF] px-2 py-0.5 text-[10px] font-bold text-[#B96928]">
              {filteredBookings.length} Records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {selectedIds.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Clear selection
                </button>

                <button
                  type="button"
                  onClick={deleteSelectedBookings}
                  disabled={bulkDeleting}
                  className="flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  {bulkDeleting
                    ? "Deleting..."
                    : `Delete (${selectedIds.length})`}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={exportToDocument}
              className="flex items-center gap-1 rounded-md bg-[#172033] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0f1624]"
            >
              <Download size={12} />
              {selectedIds.length > 0
                ? `Export (${selectedIds.length})`
                : "Export"}
            </button>

            <button
              type="button"
              onClick={() => loadBookings(true)}
              disabled={refreshing}
              className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#172033] hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={12}
                className={refreshing ? "animate-spin" : ""}
              />
              Sync
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-2 flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <CircleAlert
                size={15}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-xs font-bold text-red-800">
                  Could not load bookings
                </p>

                <p className="mt-0.5 break-words text-[11px] leading-4 text-red-700">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadBookings(true)}
              className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* compact stats */}
        <div className="mb-2 grid grid-cols-2 gap-1.5 lg:grid-cols-4">
          <StatCard
            label="All Bookings"
            value={counts.all}
            icon={CalendarDays}
            color="bg-orange-50 text-[#B96928]"
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />

          <StatCard
            label="Pending"
            value={counts.pending}
            icon={Clock}
            color="bg-amber-50 text-amber-700"
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          />

          <StatCard
            label="Confirmed"
            value={counts.confirmed}
            icon={CheckCircle2}
            color="bg-emerald-50 text-emerald-700"
            active={statusFilter === "confirmed"}
            onClick={() => setStatusFilter("confirmed")}
          />

          <StatCard
            label="Cancelled"
            value={counts.cancelled}
            icon={CircleAlert}
            color="bg-red-50 text-red-700"
            active={statusFilter === "cancelled"}
            onClick={() => setStatusFilter("cancelled")}
          />
        </div>

        {/* compact filters */}
        <div className="mb-2 rounded-lg border border-[#E2E6EA] bg-white p-2 shadow-sm">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, phone, email, reference..."
                className="h-8 w-full rounded-md border border-slate-200 bg-white pl-8 pr-2 text-xs outline-none focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-[#172033] outline-none focus:border-[#B96928]"
            >
              {BOOKING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Booking Types" : formatLabel(type)}
                </option>
              ))}
            </select>

            <input
              type="date"
              aria-label="From date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(event) => setFromDate(event.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#B96928]"
            />

            <input
              type="date"
              aria-label="To date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => setToDate(event.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#B96928]"
            />

            <button
              type="button"
              onClick={clearFilters}
              className="flex h-8 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              title="Clear filters"
            >
              <X size={12} />
              Clear
            </button>
          </div>
        </div>

        {/* table + compact details drawer */}
        <div className="flex min-w-0 flex-col gap-2 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-[#E2E6EA] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-[#F8FAFC] px-2.5 py-1.5">
              <p className="text-[11px] text-slate-500">
                Showing{" "}
                <span className="font-semibold text-[#172033]">
                  {filteredBookings.length
                    ? (safePage - 1) * itemsPerPage + 1
                    : 0}
                  –
                  {Math.min(
                    safePage * itemsPerPage,
                    filteredBookings.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#172033]">
                  {filteredBookings.length}
                </span>

                {selectedIds.length > 0 && (
                  <span className="ml-2 font-semibold text-[#B96928]">
                    · {selectedIds.length} selected
                  </span>
                )}
              </p>

              <div className="flex items-center gap-1">
                <select
                  value={itemsPerPage}
                  onChange={(event) =>
                    setItemsPerPage(Number(event.target.value))
                  }
                  className="h-7 rounded-md border border-slate-200 bg-white px-1.5 text-[11px] outline-none"
                >
                  <option value={10}>10 / page</option>
                  <option value={15}>15 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                </select>

                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={13} />
                </button>

                <span className="min-w-10 text-center text-[11px] font-semibold text-[#172033]">
                  {safePage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            <div className="w-full min-w-0 overflow-x-hidden">
  <table className="w-full table-fixed border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-white text-[10px] font-bold text-slate-500">
                    <th className="w-8 px-2.5 py-1.5">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={(event) =>
                          setSelectedIds((current) =>
                            event.target.checked
                              ? [
                                  ...new Set([
                                    ...current,
                                    ...pageBookings
                                      .map(getId)
                                      .filter(Boolean),
                                  ]),
                                ]
                              : current.filter(
                                  (id) =>
                                    !pageBookings.some(
                                      (booking) => getId(booking) === id
                                    )
                                )
                          )
                        }
                        aria-label="Select all on this page"
                      />
                    </th>

                    <th className="px-2.5 py-1.5">Customer</th>
                    <th className="px-2.5 py-1.5">Phone</th>
                    <th className="px-2.5 py-1.5">Email</th>
                    <th className="px-2.5 py-1.5">Booking</th>
                    <th className="px-2.5 py-1.5">Travel Date</th>
                    <th className="px-2.5 py-1.5">Guests</th>
                    <th className="px-2.5 py-1.5">Status</th>
                    <th className="px-2.5 py-1.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {pageBookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center">
                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <CalendarDays size={17} />
                        </div>

                        <p className="mt-2 text-xs font-semibold text-[#172033]">
                          No bookings found
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          Try changing your search or filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    pageBookings.map((booking) => {
                      const id = getId(booking);
                      const selected =
                        selectedBooking && getId(selectedBooking) === id;
                      const status = getStatus(booking);
                      const type = getBookingType(booking);
                      const count = getCustomerBookings(booking).length;

                      return (
                        <tr
                          key={id || getReference(booking)}
                          onClick={() => setSelectedBooking(booking)}
                          className={`cursor-pointer transition hover:bg-[#FFF9F3] ${
                            selected ? "bg-[#FFF7EF]" : ""
                          }`}
                        >
                          <td
                            className="w-8 px-2.5 py-1.5"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(id) && selectedIds.includes(id)}
                              onChange={(event) =>
                                setSelectedIds((current) =>
                                  event.target.checked
                                    ? [...new Set([...current, id])]
                                    : current.filter((x) => x !== id)
                                )
                              }
                              aria-label="Select booking"
                            />
                          </td>

                          <td className="px-2.5 py-1.5">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#172033] text-[10px] font-bold text-white">
                                {getInitials(getName(booking))}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-40 truncate text-xs font-bold text-[#172033]">
                                  {getName(booking)}
                                </p>
                                <RepeatBadge count={count} />
                              </div>
                            </div>
                          </td>

                          <td className="px-2.5 py-1.5">
                            <ContactLink
                              type="phone"
                              value={getPhone(booking)}
                            />
                          </td>

                          <td className="max-w-48 px-2.5 py-1.5">
                            <ContactLink
                              type="email"
                              value={getEmail(booking)}
                            />
                          </td>

                          <td className="px-2.5 py-1.5">
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="whitespace-nowrap text-[11px] font-bold text-[#172033]">
                                #{getReference(booking)}
                              </span>
                              <TypeBadge type={type} />
                            </div>

                            {getLocation(booking) && (
                              <p className="mt-0.5 flex max-w-44 items-center gap-1 truncate text-[10px] text-slate-500">
                                <MapPin size={9} />
                                {getLocation(booking)}
                              </p>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-2.5 py-1.5">
                            <p className="text-[11px] font-semibold text-[#172033]">
                              {formatDate(getBookingDate(booking))}
                            </p>

                            {booking.checkOut &&
                              formatDate(booking.checkOut) !== "—" && (
                                <p className="text-[10px] text-slate-500">
                                  To {formatDate(booking.checkOut)}
                                </p>
                              )}
                          </td>

                          <td className="whitespace-nowrap px-2.5 py-1.5">
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#172033]">
                              <Users
                                size={11}
                                className="text-slate-400"
                              />

                              {getGuestCount(booking) || "—"}

                              {getGuestCount(booking)
                                ? getGuestCount(booking) === 1
                                  ? " guest"
                                  : " guests"
                                : ""}
                            </span>

                            {ROOM_TYPES.includes(type) && (
                              <p className="text-[10px] text-slate-500">
                                {getRoomCount(booking)}{" "}
                                {getRoomCount(booking) === 1
                                  ? "room"
                                  : "rooms"}
                              </p>
                            )}
                          </td>

                          <td
                            className="px-2.5 py-1.5"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <select
                              value={status}
                              disabled={updatingId === id}
                              onChange={(event) =>
                                changeStatus(booking, event.target.value)
                              }
                              className={`h-7 max-w-28 rounded-full border px-2 text-[10px] font-semibold outline-none disabled:opacity-50 ${
                                status === "confirmed"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : status === "cancelled"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : status === "contacted"
                                  ? "border-blue-200 bg-blue-50 text-blue-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700"
                              }`}
                            >
                              {BOOKING_STATUSES.map((value) => (
                                <option key={value} value={value}>
                                  {formatLabel(value)}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td
                            className="px-2.5 py-1.5"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              {status !== "confirmed" && (
                                <button
                                  type="button"
                                  disabled={updatingId === id}
                                  onClick={() =>
                                    changeStatus(booking, "confirmed")
                                  }
                                  title="Confirm this booking"
                                  className="rounded-md border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                  <CheckCircle2 size={13} />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedBooking(booking)}
                                title="View booking"
                                className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:border-[#B96928] hover:text-[#B96928]"
                              >
                                <Eye size={13} />
                              </button>

                              <button
                                type="button"
                                onClick={() => setEditingBooking(booking)}
                                title="Edit booking"
                                className="rounded-md border border-orange-200 bg-orange-50 p-1.5 text-[#B96928] hover:bg-orange-100"
                              >
                                <Edit3 size={13} />
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteBooking(booking)}
                                title="Delete booking"
                                className="rounded-md border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-[#F8FAFC] px-2.5 py-1.5">
              <p className="text-[11px] text-slate-500">
                {filteredBookings.length} booking(s) match your filters
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Compact desktop details drawer */}
          {drawerOpen && (
            <div className="sticky top-3 hidden h-[calc(100vh-90px)] w-full min-w-0 shrink-0 overflow-hidden rounded-lg border border-[#E2E6EA] bg-white shadow-sm xl:flex xl:w-[300px] 2xl:w-[320px]">
              {renderDetails()}
            </div>
          )}
        </div>
      </div>

      {/* Mobile details drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[80] bg-slate-950/40 xl:hidden">
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl">
            {renderDetails()}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={saveBooking}
          saving={saving}
        />
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  return <AdminBookingsContent />;
}