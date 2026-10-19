"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  X,
  Loader2,
  AlertCircle,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { agentApiRequest } from "@/lib/agentApi";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const FALLBACK_RESORT_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
];

function getPropertyImage(prop, index = 0) {
  if (!prop) return FALLBACK_RESORT_IMAGES[0];

  let rawSrc = null;

  if (Array.isArray(prop.images) && prop.images.length > 0) {
    const first = prop.images[0];
    rawSrc = typeof first === "object" ? (first.url || first.secure_url || first.path) : first;
  } else if (prop.featuredImage) {
    rawSrc = typeof prop.featuredImage === "object" ? prop.featuredImage.url : prop.featuredImage;
  } else if (prop.coverImage) {
    rawSrc = typeof prop.coverImage === "object" ? prop.coverImage.url : prop.coverImage;
  } else if (prop.thumbnail) {
    rawSrc = typeof prop.thumbnail === "object" ? prop.thumbnail.url : prop.thumbnail;
  } else if (Array.isArray(prop.photos) && prop.photos.length > 0) {
    const first = prop.photos[0];
    rawSrc = typeof first === "object" ? (first.url || first.secure_url) : first;
  }

  if (!rawSrc || typeof rawSrc !== "string" || rawSrc.trim() === "") {
    return FALLBACK_RESORT_IMAGES[index % FALLBACK_RESORT_IMAGES.length];
  }

  if (rawSrc.startsWith("http://") || rawSrc.startsWith("https://") || rawSrc.startsWith("data:")) {
    return rawSrc;
  }

  const cleanPath = rawSrc.startsWith("/") ? rawSrc : `/${rawSrc}`;
  return `${API_BASE}${cleanPath}`;
}

function formatLocation(loc) {
  if (!loc) return "Jim Corbett, Uttarakhand";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    if (loc.address) return String(loc.address);
    if (loc.city) return `${loc.city}, Uttarakhand`;
    if (loc.name) return String(loc.name);
    if (loc.latitude && loc.longitude) {
      return `Jim Corbett (${Number(loc.latitude).toFixed(2)}, ${Number(loc.longitude).toFixed(2)})`;
    }
  }
  return "Jim Corbett National Park";
}

export default function AgentExplorePage() {
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const [formData, setFormData] = useState({
    roomTypeId: "",
    checkIn: "",
    checkOut: "",
    roomsCount: 1,
    guestsCount: 2,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
  });

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await agentApiRequest("agent/properties");
      if (res && res.success && Array.isArray(res.data)) {
        setProperties(res.data);
      } else if (Array.isArray(res)) {
        setProperties(res);
      } else {
        const pubRes = await agentApiRequest("properties");
        if (pubRes && pubRes.success && Array.isArray(pubRes.data)) {
          setProperties(pubRes.data);
        }
      }
    } catch (err) {
      console.error("Error loading properties:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleOpenBooking = async (property) => {
    setSelectedProperty(property);
    setBookingError("");
    setBookingSuccess("");
    setRooms([]);
    setFormData({
      roomTypeId: "",
      checkIn: "",
      checkOut: "",
      roomsCount: 1,
      guestsCount: 2,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      specialRequests: "",
    });

    setLoadingRooms(true);
    try {
      const res = await agentApiRequest(`agent/properties/${property._id}/rooms`);
      if (res && res.success && Array.isArray(res.data)) {
        setRooms(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, roomTypeId: res.data[0]._id }));
        }
      } else {
        const altRes = await agentApiRequest(`properties/${property._id}/rooms`);
        if (altRes && altRes.success && Array.isArray(altRes.data)) {
          setRooms(altRes.data);
          if (altRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, roomTypeId: altRes.data[0]._id }));
          }
        }
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const selectedRoomObj = useMemo(() => {
    return rooms.find((r) => r._id === formData.roomTypeId) || null;
  }, [rooms, formData.roomTypeId]);

  const staySummary = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) {
      return { nights: 0, totalAmount: 0, pricePerNight: 0 };
    }
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = end.getTime() - start.getTime();
    const nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const pricePerNight = selectedRoomObj
      ? Number(selectedRoomObj.basePrice || selectedRoomObj.price || 0)
      : 0;
    const totalAmount = nights * pricePerNight * (Number(formData.roomsCount) || 1);

    return { nights, totalAmount, pricePerNight };
  }, [formData.checkIn, formData.checkOut, formData.roomsCount, selectedRoomObj]);

  // ==========================================
  // FIXED: Added bookingType: "stay"
  // ==========================================
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    const name = formData.guestName.trim();
    const email = formData.guestEmail.trim();
    const phone = formData.guestPhone.trim();

    if (!name || !email || !phone) {
      setBookingError("Please enter client full name, email and phone number.");
      return;
    }
    if (!formData.roomTypeId) {
      setBookingError("Please select a valid Room Category for this resort.");
      return;
    }
    if (!formData.checkIn || !formData.checkOut) {
      setBookingError("Please select both Check-In and Check-Out dates.");
      return;
    }
    if (staySummary.nights <= 0) {
      setBookingError("Check-Out date must be after Check-In date.");
      return;
    }

    setBookingLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("agentToken") : null;
      const agentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("agentUser") || "{}") : {};

      const payload = {
        // 🔥 Crucial Fix: Explicit Booking Type
        bookingType: "stay",
        type: "stay",

        // Guest root fields
        name: name,
        email: email,
        phone: phone,

        // Flat variations
        guestName: name,
        guestEmail: email,
        guestPhone: phone,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,

        // Nested variations
        customer: { name, email, phone },
        customerDetails: { name, email, phone },
        guest: { name, email, phone },
        guestDetails: { name, email, phone },

        // Stay details
        propertyId: selectedProperty._id,
        roomTypeId: formData.roomTypeId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        roomsCount: Number(formData.roomsCount) || 1,
        guestsCount: Number(formData.guestsCount) || 2,
        specialRequests: formData.specialRequests || "",
        totalAmount: staySummary.totalAmount,

        // Agent details
        agentId: agentUser._id || agentUser.id,
        bookedByRole: "agent",
        source: "agent",
        
      };

      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let res = await fetch(`${API_BASE}/api/agent/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (res.status === 404) {
        res = await fetch(`${API_BASE}/api/bookings`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      const contentType = res.headers.get("content-type") || "";
      let data;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned status ${res.status}: ${text.slice(0, 100)}`);
      }

      if (res.ok && (data.success || data._id || data.booking)) {
        setBookingSuccess("Booking created successfully! Your commission has been recorded.");
        setTimeout(() => {
          setSelectedProperty(null);
          router.push("/agent/bookings");
        }, 1500);
      } else {
        setBookingError(data.message || data.error || "Failed to create booking.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError(err.message || "Something went wrong creating the booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const title = String(p.title || p.name || "").toLowerCase();
    const loc = formatLocation(p.location || p.city).toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || loc.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Explore Resorts & Properties
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse premium Jim Corbett resorts and book stays directly for your clients.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by resort name, zone or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#B96928] focus:ring-1 focus:ring-[#B96928]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#B96928]" />
            <span>Loading Corbett resorts...</span>
          </div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <Building2 className="h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-base font-semibold text-slate-800">No Resorts Found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery ? "Try adjusting your search criteria." : "No approved resorts currently active."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((prop, idx) => {
            const propTitle = String(prop.title || prop.name || "Corbett Resort");
            const propCategory =
              typeof prop.category === "object"
                ? prop.category?.name || "Resort"
                : prop.category || "Resort";
            const propLocationStr = formatLocation(prop.location || prop.city);
            const propStartingPrice = Number(
              prop.priceStarting || prop.basePrice || prop.price || 2499
            ).toLocaleString("en-IN");
            const imageUrl = getPropertyImage(prop, idx);

            return (
              <div
                key={prop._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={imageUrl}
                    alt={propTitle}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        FALLBACK_RESORT_IMAGES[idx % FALLBACK_RESORT_IMAGES.length];
                    }}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                    {propCategory}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#B96928] transition">
                    {propTitle}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-[#B96928] shrink-0" />
                    <span className="truncate">{propLocationStr}</span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {typeof prop.description === "string"
                      ? prop.description
                      : "Scenic resort offering comfortable stays with Corbett jungle views."}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-[11px] font-medium text-slate-400">Starting from</p>
                        <p className="text-base font-bold text-slate-900">
                          ₹{propStartingPrice}
                          <span className="text-xs font-normal text-slate-500"> / night</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(prop)}
                        className="rounded-xl bg-[#18352A] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#18352A]/90 active:scale-95"
                      >
                        Book for Client
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B96928]">
                B2B Client Booking
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {String(selectedProperty.title || selectedProperty.name || "Resort")}
              </h2>
              <p className="text-xs text-slate-500">
                {formatLocation(selectedProperty.location || selectedProperty.city)}
              </p>
            </div>

            {bookingError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {bookingSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{bookingSuccess}</span>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Select Room Category *
                </label>
                {loadingRooms ? (
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-[#B96928]" />
                    <span>Loading available rooms for this resort...</span>
                  </div>
                ) : rooms.length === 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    No room categories found for this resort yet.
                  </div>
                ) : (
                  <select
                    value={formData.roomTypeId}
                    onChange={(e) =>
                      setFormData({ ...formData, roomTypeId: e.target.value })
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-[#B96928] focus:ring-1 focus:ring-[#B96928]"
                  >
                    {rooms.map((room) => {
                      const rTitle = String(room.title || room.name || "Standard Room");
                      const rPrice = Number(room.basePrice || room.price || 0).toLocaleString("en-IN");
                      const rCapacity = room.maxGuests || room.capacity || 2;
                      return (
                        <option key={room._id} value={room._id}>
                          {rTitle} — ₹{rPrice}/night (Max: {rCapacity} guests)
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Check-In Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkIn}
                    onChange={(e) =>
                      setFormData({ ...formData, checkIn: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#B96928]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Check-Out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkOut}
                    onChange={(e) =>
                      setFormData({ ...formData, checkOut: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#B96928]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Number of Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.roomsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, roomsCount: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#B96928]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Total Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.guestsCount}
                    onChange={(e) =>
                      setFormData({ ...formData, guestsCount: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#B96928]"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-xs font-bold text-slate-800">
                  Client (Guest) Details
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Guest Full Name *"
                    value={formData.guestName}
                    onChange={(e) =>
                      setFormData({ ...formData, guestName: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#B96928]"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number *"
                      value={formData.guestPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, guestPhone: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#B96928]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={formData.guestEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, guestEmail: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#B96928]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Special Requests (e.g. Ground floor, jungle facing)"
                  value={formData.specialRequests}
                  onChange={(e) =>
                    setFormData({ ...formData, specialRequests: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:border-[#B96928]"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Duration</span>
                  <span className="font-semibold text-slate-900">
                    {staySummary.nights} Night{staySummary.nights > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
                  <span>Room Rate</span>
                  <span className="font-semibold text-slate-900">
                    ₹{(staySummary.pricePerNight || 0).toLocaleString("en-IN")} × {formData.roomsCount} room(s)
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-slate-200 pt-2">
                  <span className="text-sm font-bold text-slate-900">Total Booking Amount</span>
                  <span className="text-lg font-extrabold text-[#18352A]">
                    ₹{staySummary.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProperty(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading || rooms.length === 0 || staySummary.nights === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#18352A] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#18352A]/90 disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Booking...</span>
                    </>
                  ) : (
                    <span>Confirm & Book Stay</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}