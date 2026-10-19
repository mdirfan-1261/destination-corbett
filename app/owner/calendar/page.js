
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  RefreshCw,
  Save,
  BedDouble,
  CircleAlert,
  CheckCircle2,
  IndianRupee,
  LoaderCircle,
} from "lucide-react";
import AvailabilityCalendar from "@/components/owner/AvailabilityCalendar";

const API_ROOT = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_BASE = API_ROOT.endsWith("/api")
  ? API_ROOT
  : `${API_ROOT}/api`;

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getRecordDate(record) {
  if (!record?.date) return "";

  if (typeof record.date === "string") {
    return record.date.slice(0, 10);
  }

  return toDateKey(new Date(record.date));
}

// IMPORTANT: This matches app/owner/login/page.js.
function getStoredOwnerToken() {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("destin_owner_token") || "";
}

async function apiRequest(path, options = {}) {
  const token = getStoredOwnerToken();

  if (!token) {
    throw new Error(
      "Owner login token nahi mila. Logout/login karke dobara try karein."
    );
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (response.status === 401) {
    throw new Error(
      "Owner session invalid ya expire ho gaya hai. Dobara login karein."
    );
  }

  if (response.status === 403) {
    throw new Error(
      result?.message ||
        "Access denied. Owner/partner approval aur backend authorization check karein."
    );
  }

  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.message ||
        `Backend request fail hui (HTTP ${response.status}).`
    );
  }

  if (!result) {
    throw new Error(
      `Backend se valid JSON response nahi mila (HTTP ${response.status}).`
    );
  }

  return result;
}

function getErrorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback;
}

export default function OwnerCalendarPage() {
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState("");

  const [rooms, setRooms] = useState([]);
  const [roomTypeId, setRoomTypeId] = useState("");

  const [availability, setAvailability] = useState([]);

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(
    () => toDateKey(new Date())
  );

  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [propertiesError, setPropertiesError] = useState("");
  const [roomsError, setRoomsError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);
  const [availabilityVersion, setAvailabilityVersion] = useState(0);

  const [form, setForm] = useState({
    totalRooms: "0",
    price: "0",
    isClosed: false,
    minimumStay: "1",
    note: "",
  });

  const selectedProperty = useMemo(
    () => properties.find((item) => item._id === propertyId) || null,
    [properties, propertyId]
  );

  const selectedRoom = useMemo(
    () => rooms.find((item) => item._id === roomTypeId) || null,
    [rooms, roomTypeId]
  );

  const selectedRecord = useMemo(
    () =>
      availability.find(
        (item) => getRecordDate(item) === selectedDate
      ) || null,
    [availability, selectedDate]
  );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const monthStart = toDateKey(new Date(year, month, 1));
  const monthEnd = toDateKey(new Date(year, month + 1, 0));

  // 1. Fetch properties belonging to the logged-in owner.
  useEffect(() => {
    let cancelled = false;

    async function loadProperties() {
      setPropertiesLoading(true);
      setPropertiesError("");

      try {
        const result = await apiRequest("/owner/properties");
        const list = result?.data?.properties;

        if (!Array.isArray(list)) {
          throw new Error(
            "Backend response mein data.properties array nahi mila."
          );
        }

        if (cancelled) return;

        setProperties(list);

        setPropertyId((currentId) => {
          if (list.some((item) => item._id === currentId)) {
            return currentId;
          }

          return list[0]?._id || "";
        });
      } catch (error) {
        if (cancelled) return;

        setProperties([]);
        setPropertyId("");
        setPropertiesError(
          getErrorMessage(error, "Properties load nahi hui.")
        );
      } finally {
        if (!cancelled) setPropertiesLoading(false);
      }
    }

    loadProperties();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // 2. Fetch room categories whenever the property changes.
  useEffect(() => {
    let cancelled = false;

    async function loadRooms() {
      setRooms([]);
      setRoomTypeId("");
      setRoomsError("");
      setAvailability([]);
      setAvailabilityError("");

      if (!propertyId) {
        setRoomsLoading(false);
        return;
      }

      setRoomsLoading(true);

      try {
        const result = await apiRequest(
          `/owner/properties/${encodeURIComponent(propertyId)}/rooms`
        );

        const list = result?.data?.rooms;

        if (!Array.isArray(list)) {
          throw new Error(
            "Backend response mein data.rooms array nahi mila."
          );
        }

        if (cancelled) return;

        setRooms(list);
        setRoomTypeId(list[0]?._id || "");

        if (list.length === 0) {
          setRoomsError(
            "Is property mein active room category nahi mili. Pehle room category add ya activate karein."
          );
        }
      } catch (error) {
        if (cancelled) return;

        setRooms([]);
        setRoomTypeId("");
        setRoomsError(
          getErrorMessage(error, "Room categories load nahi hui.")
        );
      } finally {
        if (!cancelled) setRoomsLoading(false);
      }
    }

    loadRooms();

    return () => {
      cancelled = true;
    };
  }, [propertyId, refreshKey]);

  // 3. Fetch saved availability for the selected room and month.
  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      setAvailability([]);
      setAvailabilityError("");

      if (!propertyId || !roomTypeId) {
        setAvailabilityLoading(false);
        return;
      }

      setAvailabilityLoading(true);

      try {
        const query = new URLSearchParams({
          from: monthStart,
          to: monthEnd,
        });

        const result = await apiRequest(
          `/owner/properties/${encodeURIComponent(propertyId)}` +
            `/rooms/${encodeURIComponent(roomTypeId)}` +
            `/availability?${query.toString()}`
        );

        const list = result?.data?.availability;

        if (!Array.isArray(list)) {
          throw new Error(
            "Backend response mein data.availability array nahi mila."
          );
        }

        if (!cancelled) {
          setAvailability(list);
        }
      } catch (error) {
        if (cancelled) return;

        setAvailability([]);
        setAvailabilityError(
          getErrorMessage(error, "Availability load nahi hui.")
        );
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [
    propertyId,
    roomTypeId,
    monthStart,
    monthEnd,
    refreshKey,
    availabilityVersion,
  ]);

  // 4. Populate the editor from the saved record, if one exists.
  useEffect(() => {
    setSaveError("");
    setSuccessMessage("");

    if (selectedRecord) {
      setForm({
        totalRooms: String(selectedRecord.totalRooms ?? 0),
        price: String(selectedRecord.price ?? 0),
        isClosed: selectedRecord.isClosed === true,
        minimumStay: String(selectedRecord.minimumStay ?? 1),
        note: selectedRecord.note || "",
      });

      return;
    }

    // These are room defaults, NOT a saved availability record.
    setForm({
      totalRooms: String(selectedRoom?.totalRooms ?? 0),
      price: String(selectedRoom?.basePrice ?? 0),
      isClosed: false,
      minimumStay: "1",
      note: "",
    });
  }, [selectedRecord, selectedRoom, selectedDate]);

  function changeMonth(amount) {
    const nextMonth = new Date(year, month + amount, 1);

    setVisibleMonth(nextMonth);
    setSelectedDate(toDateKey(nextMonth));
    setSaveError("");
    setSuccessMessage("");
  }

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaveError("");
    setSuccessMessage("");
  }

  async function handleSave(event) {
    event.preventDefault();

    setSaveError("");
    setSuccessMessage("");

    if (!propertyId || !roomTypeId || !selectedRoom) {
      setSaveError("Pehle property aur room category select karein.");
      return;
    }

    const totalRooms = Number(form.totalRooms);
    const price = Number(form.price);
    const minimumStay = Number(form.minimumStay);
    const note = form.note.trim();
    const inventoryLimit = Number(selectedRoom.totalRooms);

    if (!Number.isInteger(totalRooms) || totalRooms < 0) {
      setSaveError("Total rooms 0 ya usse zyada whole number hona chahiye.");
      return;
    }

    if (
      !Number.isFinite(inventoryLimit) ||
      totalRooms > inventoryLimit
    ) {
      setSaveError(
        `Total rooms configured inventory (${selectedRoom.totalRooms ?? "—"}) se zyada nahi ho sakte.`
      );
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setSaveError("Price valid non-negative number hona chahiye.");
      return;
    }

    if (
      !Number.isInteger(minimumStay) ||
      minimumStay < 1 ||
      minimumStay > 365
    ) {
      setSaveError("Minimum stay 1 se 365 nights ke beech hona chahiye.");
      return;
    }

    if (note.length > 300) {
      setSaveError("Note maximum 300 characters ka ho sakta hai.");
      return;
    }

    // Closed dates must have zero inventory.
    if (form.isClosed && totalRooms !== 0) {
      setSaveError("Closed date ke liye total rooms 0 rakhein.");
      return;
    }

    const booked = Number(selectedRecord?.bookedRooms || 0);
    const blocked = Number(selectedRecord?.blockedRooms || 0);

    if (selectedRecord && totalRooms < booked + blocked) {
      setSaveError(
        `Total rooms booked (${booked}) + blocked (${blocked}) rooms se kam nahi ho sakte.`
      );
      return;
    }

    setSaving(true);

    try {
      const result = await apiRequest(
        `/owner/properties/${encodeURIComponent(propertyId)}` +
          `/rooms/${encodeURIComponent(roomTypeId)}` +
          `/availability`,
        {
          method: "PUT",
          body: JSON.stringify({
            date: selectedDate,
            totalRooms,
            price,
            isClosed: form.isClosed,
            minimumStay,
            note,
          }),
        }
      );

      setSuccessMessage(
        result?.message || "Availability save ho gayi."
      );

      // Fetch saved data again from the backend.
      setAvailabilityVersion((value) => value + 1);
    } catch (error) {
      setSaveError(
        getErrorMessage(error, "Availability save nahi hui.")
      );
    } finally {
      setSaving(false);
    }
  }

  function refreshAll() {
    setPropertiesError("");
    setRoomsError("");
    setAvailabilityError("");
    setSaveError("");
    setSuccessMessage("");

    setRefreshKey((value) => value + 1);
  }

  const isLoading =
    propertiesLoading || roomsLoading || availabilityLoading;

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/owner/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#B96928]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#B96928]">
              <CalendarDays size={17} />
              Property Management
            </div>

            <h1 className="text-2xl font-extrabold text-[#172033] sm:text-3xl">
              Availability Calendar
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Select your property, choose a room category and manage daily
              room inventory, price and closure status.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshAll}
            disabled={isLoading || saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#9D5520] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <section className="mb-5 grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5">
          <div>
            <label
              htmlFor="owner-property"
              className="mb-2 block text-sm font-bold text-[#172033]"
            >
              Select Property
            </label>

            <select
              id="owner-property"
              value={propertyId}
              onChange={(event) => {
                setPropertyId(event.target.value);
                setSaveError("");
                setSuccessMessage("");
              }}
              disabled={propertiesLoading || properties.length === 0}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-[#B96928] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
            >
              <option value="">
                {propertiesLoading ? "Loading properties..." : "Select property"}
              </option>

              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.name || "Unnamed property"}
                </option>
              ))}
            </select>

            {selectedProperty && (
              <p className="mt-2 text-xs text-gray-500">
                Status: {selectedProperty.propertyStatus || "Not specified"}
              </p>
            )}

            {propertiesError && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {propertiesError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="owner-room"
              className="mb-2 block text-sm font-bold text-[#172033]"
            >
              Select Room Category
            </label>

            <select
              id="owner-room"
              value={roomTypeId}
              onChange={(event) => {
                setRoomTypeId(event.target.value);
                setSaveError("");
                setSuccessMessage("");
              }}
              disabled={!propertyId || roomsLoading || rooms.length === 0}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-[#B96928] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
            >
              <option value="">
                {roomsLoading ? "Loading rooms..." : "Select room category"}
              </option>

              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name || "Unnamed room"} — {Number(room.totalRooms) || 0} rooms
                </option>
              ))}
            </select>

            {selectedRoom && (
              <p className="mt-2 text-xs text-gray-500">
                Configured inventory: {selectedRoom.totalRooms ?? 0} rooms
                {" · "}Base price: ₹
                {Number(selectedRoom.basePrice || 0).toLocaleString("en-IN")}
              </p>
            )}

            {roomsError && (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {roomsError}
              </p>
            )}
          </div>
        </section>

        {!propertiesLoading &&
          !propertiesError &&
          properties.length === 0 && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Tumhare account par koi property nahi mili. Pehle property create
              karein.{" "}
              <Link
                href="/owner/properties"
                className="font-bold underline underline-offset-2"
              >
                View My Properties
              </Link>
            </div>
          )}

        {availabilityError && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <CircleAlert size={19} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Availability load nahi hui</p>
              <p className="mt-1">{availabilityError}</p>
            </div>
          </div>
        )}

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
          <AvailabilityCalendar
            availability={availability}
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              setSaveError("");
              setSuccessMessage("");
            }}
            visibleMonth={visibleMonth}
            onMonthChange={changeMonth}
            loading={availabilityLoading}
          />

          <aside className="space-y-5">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <h2 className="font-extrabold text-[#172033]">
                    Selected Date
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                {availabilityLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <LoaderCircle size={17} className="animate-spin" />
                    Loading saved availability...
                  </div>
                ) : selectedRecord ? (
                  <>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#172033]">
                      {selectedRecord.isClosed ? (
                        <CircleAlert size={18} className="text-red-600" />
                      ) : (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      )}

                      {selectedRecord.isClosed
                        ? "Closed"
                        : `${Math.max(
                            0,
                            Number(selectedRecord.totalRooms || 0) -
                              Number(selectedRecord.bookedRooms || 0) -
                              Number(selectedRecord.blockedRooms || 0)
                          )} rooms available`}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-[#172033]">
                          {selectedRecord.totalRooms}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Booked</p>
                        <p className="font-bold text-[#172033]">
                          {selectedRecord.bookedRooms || 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Blocked</p>
                        <p className="font-bold text-[#172033]">
                          {selectedRecord.blockedRooms || 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Daily price</p>
                        <p className="font-bold text-[#172033]">
                          ₹{Number(selectedRecord.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CircleAlert
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />
                    <p>
                      {propertyId && roomTypeId
                        ? "Is date ka saved availability record nahi mila. Neeche details set karke save karne par naya record create hoga."
                        : "Availability dekhne ke liye property aur room category select karein."}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <BedDouble size={22} className="text-[#B96928]" />
                <div>
                  <h2 className="font-extrabold text-[#172033]">
                    Manage Availability
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedRoom?.name || "Choose a room category first"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="total-rooms"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    Total rooms available for sale
                  </label>

                  <input
                    id="total-rooms"
                    type="number"
                    min="0"
                    max={selectedRoom?.totalRooms ?? undefined}
                    step="1"
                    required
                    value={form.totalRooms}
                    onChange={(event) =>
                      updateForm("totalRooms", event.target.value)
                    }
                    disabled={!selectedRoom || saving || form.isClosed}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#B96928] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Room category inventory: {selectedRoom?.totalRooms ?? "—"}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="daily-price"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    Price per night (₹)
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="daily-price"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form.price}
                      onChange={(event) =>
                        updateForm("price", event.target.value)
                      }
                      disabled={!selectedRoom || saving}
                      className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#B96928] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="minimum-stay"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    Minimum stay (nights)
                  </label>

                  <input
                    id="minimum-stay"
                    type="number"
                    min="1"
                    max="365"
                    step="1"
                    required
                    value={form.minimumStay}
                    onChange={(event) =>
                      updateForm("minimumStay", event.target.value)
                    }
                    disabled={!selectedRoom || saving}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#B96928] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="availability-note"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    Note (optional)
                  </label>

                  <textarea
                    id="availability-note"
                    rows={3}
                    maxLength={300}
                    value={form.note}
                    onChange={(event) =>
                      updateForm("note", event.target.value)
                    }
                    disabled={!selectedRoom || saving}
                    placeholder="Internal note for this date..."
                    className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#B96928] focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {form.note.length}/300
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3">
                  <input
                    type="checkbox"
                    checked={form.isClosed}
                    onChange={(event) => {
                      const isClosed = event.target.checked;

                      setForm((current) => ({
                        ...current,
                        isClosed,
                        totalRooms: isClosed ? "0" : current.totalRooms,
                      }));

                      setSaveError("");
                      setSuccessMessage("");
                    }}
                    disabled={!selectedRoom || saving}
                    className="mt-0.5 h-4 w-4 accent-red-600"
                  />

                  <span>
                    <span className="block text-sm font-bold text-red-800">
                      Close this date
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-red-700">
                      Room inventory will be set to zero for this date.
                    </span>
                  </span>
                </label>

                {saveError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    {saveError}
                  </div>
                )}

                {successMessage && (
                  <div
                    role="status"
                    className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
                  >
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    !selectedRoom ||
                    saving ||
                    propertiesLoading ||
                    roomsLoading ||
                    availabilityLoading
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#9D5520] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : selectedRecord
                    ? "Update Availability"
                    : "Save Availability"}
                </button>

                <p className="text-xs leading-5 text-gray-500">
                  Changes are saved to the backend for the selected room
                  category and date. Existing bookings and blocked inventory
                  are validated by the server.
                </p>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
