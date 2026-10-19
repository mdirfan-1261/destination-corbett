"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  LoaderCircle,
  RefreshCw,
  Save,
} from "lucide-react";
import { ownerApiRequest } from "@/lib/ownerApi";

const OWNER_TOKEN_KEY = "destin_owner_token";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#B96928]";

function localDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dateFromString(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getData(result) {
  let value = result;

  for (let i = 0; i < 3; i += 1) {
    if (value?.data !== undefined) {
      value = value.data;
    } else {
      break;
    }
  }

  return value;
}

function getRooms(result) {
  const data = getData(result);

  if (Array.isArray(data)) return data;

  return (
    data?.rooms ||
    data?.roomTypes ||
    data?.items ||
    data?.results ||
    []
  );
}

function getAvailability(result) {
  const data = getData(result);

  if (Array.isArray(data)) return data;

  return (
    data?.availability ||
    data?.items ||
    data?.results ||
    []
  );
}

function getProperty(result) {
  const data = getData(result);
  return data?.property || data;
}

function getRoomId(room) {
  return String(room?._id || room?.id || "");
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function getStatus(item) {
  if (item?.isClosed) return "Unavailable";

  const available =
    item?.availableRooms ??
    Math.max(
      0,
      Number(item?.totalRooms || 0) -
        Number(item?.bookedRooms || 0) -
        Number(item?.blockedRooms || 0)
    );

  if (available === 0) return "Sold Out";

  if (
    Number(item?.totalRooms || 0) > 0 &&
    available <= 2
  ) {
    return "Limited";
  }

  return "Available";
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export default function OwnerPropertyAvailabilityPage() {
  const { id } = useParams();
  const router = useRouter();

  const [propertyName, setPropertyName] = useState(
    "Property Availability"
  );

  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [availability, setAvailability] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    startDate: localDate(new Date()),
    endDate: localDate(
      new Date(Date.now() + 6 * 86400000)
    ),
    totalRooms: "1",
    price: "0",
    status: "available",
    minimumStay: "1",
    notes: "",
  });

  const selectedRoom = rooms.find(
    (room) => getRoomId(room) === selectedRoomId
  );

  const loadAvailability = useCallback(
    async (roomId, from, to) => {
      if (!roomId || !from || !to) {
        setAvailability([]);
        return;
      }

      const token = localStorage.getItem(OWNER_TOKEN_KEY);

      if (!token) {
        router.replace("/owner/login");
        return;
      }

      const result = await ownerApiRequest(
        `owner/properties/${id}/rooms/${roomId}/availability?from=${encodeURIComponent(
          from
        )}&to=${encodeURIComponent(to)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAvailability(getAvailability(result));
    },
    [id, router]
  );

  const loadPage = useCallback(async () => {
    const token = localStorage.getItem(OWNER_TOKEN_KEY);

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [propertyResult, roomsResult] = await Promise.all([
        ownerApiRequest(`owner/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        ownerApiRequest(`owner/properties/${id}/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const property = getProperty(propertyResult);
      const roomList = getRooms(roomsResult);

      setPropertyName(
        property?.name ||
          property?.propertyName ||
          "Property Availability"
      );

      setRooms(roomList);

      if (roomList.length === 0) {
        setSelectedRoomId("");
        setAvailability([]);
        setError(
          "No room categories found. Add a room category before managing availability."
        );
        return;
      }

      const currentRoomStillExists = roomList.some(
        (room) => getRoomId(room) === selectedRoomId
      );

      const nextRoomId = currentRoomStillExists
        ? selectedRoomId
        : getRoomId(roomList[0]);

      setSelectedRoomId(nextRoomId);

      const room = roomList.find(
        (item) => getRoomId(item) === nextRoomId
      );

      if (room) {
        setForm((current) => ({
          ...current,
          totalRooms: String(
            room.totalRooms ?? room.quantity ?? 1
          ),
          price: String(
            room.basePrice ?? room.pricePerNight ?? room.price ?? 0
          ),
        }));
      }

      await loadAvailability(
        nextRoomId,
        form.startDate,
        form.endDate
      );
    } catch (err) {
      if ([401, 403].includes(Number(err?.status))) {
        localStorage.removeItem(OWNER_TOKEN_KEY);
        router.replace("/owner/login");
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [
    id,
    router,
    selectedRoomId,
    form.startDate,
    form.endDate,
    loadAvailability,
  ]);

  useEffect(() => {
    if (id) {
      loadPage();
    }
  }, [id]); // Load initial property data once per property ID.

  useEffect(() => {
    if (!selectedRoomId || !id) return;

    let cancelled = false;

    async function fetchSelectedAvailability() {
      const token = localStorage.getItem(OWNER_TOKEN_KEY);

      if (!token) {
        router.replace("/owner/login");
        return;
      }

      setError("");

      try {
        const result = await ownerApiRequest(
          `owner/properties/${id}/rooms/${selectedRoomId}/availability?from=${encodeURIComponent(
            form.startDate
          )}&to=${encodeURIComponent(form.endDate)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setAvailability(getAvailability(result));
        }
      } catch (err) {
        if (!cancelled) {
          setAvailability([]);
          setError(getErrorMessage(err));
        }
      }
    }

    fetchSelectedAvailability();

    return () => {
      cancelled = true;
    };
  }, [
    id,
    selectedRoomId,
    form.startDate,
    form.endDate,
    router,
  ]);

  function update(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  function handleRoomChange(event) {
    const nextRoomId = event.target.value;
    const room = rooms.find(
      (item) => getRoomId(item) === nextRoomId
    );

    setSelectedRoomId(nextRoomId);
    setAvailability([]);
    setMessage("");
    setError("");

    if (room) {
      setForm((current) => ({
        ...current,
        totalRooms: String(
          room.totalRooms ?? room.quantity ?? 1
        ),
        price: String(
          room.basePrice ?? room.pricePerNight ?? room.price ?? 0
        ),
      }));
    }
  }

  async function save(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!selectedRoom) {
      setError("Please select a room category.");
      return;
    }

    if (form.endDate < form.startDate) {
      setError(
        "End date must be the same as or later than the start date."
      );
      return;
    }

    const start = dateFromString(form.startDate);
    const end = dateFromString(form.endDate);
    const dayCount =
      Math.round((end - start) / 86400000) + 1;

    if (dayCount > 366) {
      setError(
        "Please select a date range of no more than 366 days."
      );
      return;
    }

    const roomCapacity = Number(
      selectedRoom.totalRooms ??
        selectedRoom.quantity ??
        0
    );

    const roomsToOffer =
      form.status === "unavailable"
        ? 0
        : Number(form.totalRooms);

    const price = Number(form.price);
    const minimumStay = Number(form.minimumStay);

    if (
      !Number.isInteger(roomsToOffer) ||
      roomsToOffer < 0 ||
      roomsToOffer > roomCapacity
    ) {
      setError(
        `Rooms offered must be between 0 and ${roomCapacity}, based on this room category's inventory.`
      );
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid nightly price.");
      return;
    }

    if (
      !Number.isInteger(minimumStay) ||
      minimumStay < 1 ||
      minimumStay > 365
    ) {
      setError("Minimum stay must be between 1 and 365 nights.");
      return;
    }

    if (form.notes.trim().length > 300) {
      setError("Notes cannot exceed 300 characters.");
      return;
    }

    const token = localStorage.getItem(OWNER_TOKEN_KEY);

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setSaving(true);

    try {
      const existingByDate = new Map(
        availability.map((item) => [
          localDate(new Date(item.date)),
          item,
        ])
      );

      const dates = [];

      for (let i = 0; i < dayCount; i += 1) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        dates.push(localDate(date));
      }

      // Do not reduce inventory below already booked or blocked rooms.
      for (const date of dates) {
        const existing = existingByDate.get(date);

        if (
          existing &&
          roomsToOffer <
            Number(existing.bookedRooms || 0) +
              Number(existing.blockedRooms || 0)
        ) {
          throw new Error(
            `${date}: rooms offered cannot be lower than the rooms already booked or blocked.`
          );
        }
      }

      // The backend accepts one date per PUT request.
      for (const date of dates) {
        await ownerApiRequest(
          `owner/properties/${id}/rooms/${selectedRoomId}/availability`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date,
              totalRooms: roomsToOffer,
              price,
              isClosed: form.status === "unavailable",
              minimumStay,
              note: form.notes.trim(),
            }),
          }
        );
      }

      setMessage(
        `Availability saved for ${dayCount} date${
          dayCount === 1 ? "" : "s"
        }.`
      );

      await loadAvailability(
        selectedRoomId,
        form.startDate,
        form.endDate
      );
    } catch (err) {
      if ([401, 403].includes(Number(err?.status))) {
        localStorage.removeItem(OWNER_TOKEN_KEY);
        router.replace("/owner/login");
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] p-4 text-[#172033] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/owner/properties/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#B96928]"
        >
          <ArrowLeft size={16} />
          Back to Property
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#B96928]">
              Inventory Management
            </p>

            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              {propertyName}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage room inventory and nightly prices by date.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPage}
            disabled={loading || saving}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {message}
          </p>
        )}

        <form
          onSubmit={save}
          className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold">
                Update Availability
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose a room category and the dates to update.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-gray-500">
              <LoaderCircle size={18} className="animate-spin" />
              Loading property and room categories...
            </div>
          ) : rooms.length === 0 ? (
            <p className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              Add a room category first, then manage its availability here.
            </p>
          ) : (
            <>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-bold">
                    Room Category *
                  </span>

                  <select
                    required
                    value={selectedRoomId}
                    onChange={handleRoomChange}
                    className={inputClass}
                  >
                    {rooms.map((room) => (
                      <option
                        key={getRoomId(room)}
                        value={getRoomId(room)}
                      >
                        {room.name || "Room"} —{" "}
                        {room.totalRooms ?? 0} total rooms
                      </option>
                    ))}
                  </select>

                  {selectedRoom && (
                    <span className="mt-2 block text-xs text-gray-500">
                      Category inventory:{" "}
                      {selectedRoom.totalRooms ?? 0} rooms · Base
                      price:{" "}
                      {formatMoney(
                        selectedRoom.basePrice ??
                          selectedRoom.pricePerNight ??
                          selectedRoom.price
                      )}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Start Date *
                  </span>
                  <input
                    required
                    type="date"
                    name="startDate"
                    min={localDate(new Date())}
                    value={form.startDate}
                    onChange={update}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    End Date *
                  </span>
                  <input
                    required
                    type="date"
                    name="endDate"
                    min={form.startDate}
                    value={form.endDate}
                    onChange={update}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Rooms Offered Per Night *
                  </span>
                  <input
                    required
                    min="0"
                    max={
                      selectedRoom?.totalRooms ??
                      selectedRoom?.quantity ??
                      0
                    }
                    type="number"
                    step="1"
                    name="totalRooms"
                    value={form.totalRooms}
                    onChange={update}
                    className={inputClass}
                  />
                  <span className="mt-1 block text-xs text-gray-500">
                    Cannot exceed this category's total inventory.
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Nightly Price (₹) *
                  </span>
                  <input
                    required
                    min="0"
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={update}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Minimum Stay (Nights) *
                  </span>
                  <input
                    required
                    min="1"
                    max="365"
                    type="number"
                    step="1"
                    name="minimumStay"
                    value={form.minimumStay}
                    onChange={update}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold">
                    Availability Status *
                  </span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={update}
                    className={inputClass}
                  >
                    <option value="available">Available</option>
                    <option value="limited">Limited Availability</option>
                    <option value="unavailable">Unavailable / Closed</option>
                  </select>
                  <span className="mt-1 block text-xs text-gray-500">
                    Unavailable closes the date and sets rooms offered to 0.
                  </span>
                </label>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-bold">
                  Notes
                </span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={update}
                  rows={3}
                  maxLength={300}
                  className={inputClass}
                  placeholder="Optional notes for these dates..."
                />
                <span className="mt-1 block text-xs text-gray-500">
                  {form.notes.length}/300 characters
                </span>
              </label>

              <button
                type="submit"
                disabled={saving || !selectedRoomId}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}
                {saving ? "Saving Dates..." : "Save Availability"}
              </button>
            </>
          )}
        </form>

        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-5">
            <h2 className="font-extrabold">Saved Daily Availability</h2>
            <p className="mt-1 text-sm text-gray-500">
              Records for the selected room category and date range.
            </p>
          </div>

          {loading ? (
            <p className="p-5 text-sm text-gray-500">
              Loading availability...
            </p>
          ) : availability.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No availability records found for this room category and date range.
              Save availability to create daily records.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Date",
                      "Price / Night",
                      "Total Rooms",
                      "Booked",
                      "Blocked",
                      "Available",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-xs font-bold uppercase text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {[...availability]
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() -
                        new Date(b.date).getTime()
                    )
                    .map((item, index) => {
                      const available =
                        item.availableRooms ??
                        Math.max(
                          0,
                          Number(item.totalRooms || 0) -
                            Number(item.bookedRooms || 0) -
                            Number(item.blockedRooms || 0)
                        );

                      const status = getStatus(item);

                      return (
                        <tr
                          key={item._id || item.id || index}
                        >
                          <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold">
                            {formatDate(item.date)}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {formatMoney(item.price)}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {item.totalRooms ?? "—"}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {item.bookedRooms ?? 0}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            {item.blockedRooms ?? 0}
                          </td>

                          <td className="px-5 py-4 text-sm font-bold">
                            {available}
                          </td>

                          <td className="px-5 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                status === "Unavailable" ||
                                status === "Sold Out"
                                  ? "bg-red-50 text-red-700"
                                  : status === "Limited"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-green-50 text-green-700"
                              }`}
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