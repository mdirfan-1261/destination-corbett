
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  Plus,
  RefreshCw,
  Users,
  LoaderCircle,
  Pencil,
  X,
  Power,
} from "lucide-react";
import { ownerApiRequest } from "@/lib/ownerApi";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#B96928]";

function getRooms(result) {
  const data = result?.data?.data ?? result?.data ?? result;

  if (Array.isArray(data)) return data;

  return data?.rooms || data?.roomTypes || data?.items || data?.results || [];
}

function getRoomResponse(result) {
  const data = result?.data?.data ?? result?.data ?? result;
  return data?.room || data;
}

function getRoomId(room) {
  return room?._id || room?.id;
}

function getRoomPrice(room) {
  return room?.basePrice ?? room?.pricePerNight ?? room?.price;
}

function getRoomCapacity(room) {
  return room?.maxOccupancy ?? room?.maxGuests ?? room?.capacity;
}

function getRoomQuantity(room) {
  return room?.totalRooms ?? room?.quantity;
}

function createForm(room = null) {
  return {
    name: room?.name || room?.roomName || "",
    description: room?.description || "",
    quantity: String(getRoomQuantity(room) ?? 1),
    maxGuests: String(getRoomCapacity(room) ?? 2),
    bedType: room?.bedType || "double",
    pricePerNight: String(getRoomPrice(room) ?? ""),
  };
}

export default function OwnerPropertyRoomsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [rooms, setRooms] = useState([]);
  const [propertyName, setPropertyName] = useState("Property Rooms");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState("");
  const [form, setForm] = useState(createForm());

  const loadRooms = useCallback(async () => {
    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [roomResult, propertyResult] = await Promise.all([
        ownerApiRequest(`owner/properties/${id}/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        ownerApiRequest(`owner/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setRooms(getRooms(roomResult));

      const data =
        propertyResult?.data?.data ??
        propertyResult?.data ??
        propertyResult;

      const property = data?.property || data;

      setPropertyName(
        property?.name || property?.propertyName || "Property Rooms"
      );
    } catch (err) {
      setError(err?.message || "Unable to load room types.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) loadRooms();
  }, [id, loadRooms]);

  function update(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openAddForm() {
    setError("");
    setMessage("");
    setEditingRoomId("");
    setForm(createForm());
    setShowForm(true);
  }

  function openEditForm(room) {
    setError("");
    setMessage("");
    setEditingRoomId(getRoomId(room));
    setForm(createForm(room));
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingRoomId("");
    setForm(createForm());
  }

  async function saveRoom(event) {
    event.preventDefault();

    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    const quantity = Number(form.quantity);
    const maxGuests = Number(form.maxGuests);
    const price = Number(form.pricePerNight);

    if (
      !form.name.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isInteger(maxGuests) ||
      maxGuests < 1 ||
      form.pricePerNight.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError(
        "Please enter a valid room name, quantity, guest capacity and price."
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      bedType: form.bedType,
      totalRooms: quantity,
      maxOccupancy: maxGuests,
      maxAdults: maxGuests,
      maxChildren: 0,
      basePrice: price,
      extraAdultPrice: 0,
      extraChildPrice: 0,
    };

    try {
      if (editingRoomId) {
        await ownerApiRequest(
          `owner/properties/${id}/rooms/${editingRoomId}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        setMessage("Room type updated successfully.");
      } else {
        await ownerApiRequest(`owner/properties/${id}/rooms`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        setMessage("Room type added successfully.");
      }

      closeForm();
      await loadRooms();
    } catch (err) {
      setError(err?.message || "Unable to save room type.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleRoomStatus(room) {
    const roomId = getRoomId(room);

    if (!roomId) {
      setError("Room ID is missing. Please refresh and try again.");
      return;
    }

    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setTogglingId(roomId);
    setError("");
    setMessage("");

    try {
      await ownerApiRequest(
        `owner/properties/${id}/rooms/${roomId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: room.isActive === false,
          }),
        }
      );

      setMessage(
        room.isActive === false
          ? "Room type activated successfully."
          : "Room type deactivated successfully."
      );

      await loadRooms();
    } catch (err) {
      setError(err?.message || "Unable to update room status.");
    } finally {
      setTogglingId("");
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] p-4 text-[#172033] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
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
              Room Management
            </p>

            <h1 className="mt-2 text-2xl font-black sm:text-3xl">
              {propertyName}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage room categories, capacity and nightly rates.
            </p>
          </div>

          <button
            type="button"
            onClick={showForm ? closeForm : openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B96928] px-4 py-3 text-sm font-bold text-white"
          >
            {showForm ? <X size={17} /> : <Plus size={17} />}
            {showForm ? "Close Form" : "Add Room Type"}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700"
          >
            {message}
          </p>
        )}

        {showForm && (
          <form
            onSubmit={saveRoom}
            className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"
          >
            <h2 className="text-lg font-extrabold">
              {editingRoomId ? "Edit Room Category" : "Add Room Category"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingRoomId
                ? "Update the room details and save your changes."
                : "Enter the room details, available quantity and nightly price."}
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Room Name *
                </span>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="e.g. Deluxe Double Room"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Number of Rooms *
                </span>
                <input
                  required
                  min="1"
                  step="1"
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={update}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Maximum Guests *
                </span>
                <input
                  required
                  min="1"
                  step="1"
                  type="number"
                  name="maxGuests"
                  value={form.maxGuests}
                  onChange={update}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Bed Type *
                </span>
                <select
                  required
                  name="bedType"
                  value={form.bedType}
                  onChange={update}
                  className={inputClass}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="twin">Twin</option>
                  <option value="king">King</option>
                  <option value="multiple">Multiple Beds</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold">
                  Price Per Night (₹) *
                </span>
                <input
                  required
                  min="0"
                  step="0.01"
                  type="number"
                  name="pricePerNight"
                  value={form.pricePerNight}
                  onChange={update}
                  placeholder="e.g. 2500"
                  className={inputClass}
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold">
                Description
              </span>
              <textarea
                name="description"
                value={form.description}
                onChange={update}
                rows={3}
                placeholder="Describe the room and its facilities..."
                className={inputClass}
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {saving && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                {saving
                  ? "Saving..."
                  : editingRoomId
                    ? "Update Room Type"
                    : "Save Room Type"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={closeForm}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="font-extrabold">Room Categories</h2>
              <p className="mt-1 text-sm text-gray-500">
                Room types returned by the backend.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRooms}
              disabled={loading}
              aria-label="Refresh room types"
              className="rounded-lg border border-gray-200 p-2.5 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-gray-500">Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <div className="p-10 text-center">
              <BedDouble size={32} className="mx-auto text-gray-400" />
              <p className="mt-3 font-bold">No room types added yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Add the room categories available at this property.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              {rooms.map((room, index) => {
                const roomId = getRoomId(room);
                const price = getRoomPrice(room);
                const capacity = getRoomCapacity(room);
                const quantity = getRoomQuantity(room);
                const isActive = room.isActive !== false;

                return (
                  <article
                    key={roomId || index}
                    className={`rounded-xl border p-4 ${
                      isActive
                        ? "border-gray-200"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                          <BedDouble size={20} />
                        </span>

                        <div className="min-w-0">
                          <h3 className="break-words font-extrabold">
                            {room.name || room.roomName || "Room"}
                          </h3>

                          <p className="mt-1 text-xs capitalize text-gray-500">
                            {String(
                              room.bedType || "Bed type not specified"
                            ).replace(/[_-]/g, " ")}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-sm font-extrabold text-[#B96928]">
                        {price != null && Number.isFinite(Number(price))
                          ? `₹${Number(price).toLocaleString("en-IN")}`
                          : "Price on request"}
                        <span className="block text-right text-[10px] font-medium text-gray-400">
                          per night
                        </span>
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <BedDouble size={15} />
                        {quantity ?? "—"} rooms
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Users size={15} />
                        {capacity ?? "—"} guests
                      </span>
                    </div>

                    {room.description && (
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-500">
                        {room.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(room)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:border-[#B96928] hover:text-[#B96928]"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={!roomId || togglingId === roomId}
                          onClick={() => toggleRoomStatus(room)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50 ${
                            isActive
                              ? "border border-red-200 text-red-600 hover:bg-red-50"
                              : "bg-green-700 text-white hover:bg-green-800"
                          }`}
                        >
                          {togglingId === roomId ? (
                            <LoaderCircle
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Power size={14} />
                          )}
                          {isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
