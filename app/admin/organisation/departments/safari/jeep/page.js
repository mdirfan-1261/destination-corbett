
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { optimizeImage } from "@/lib/imageOptimizer";
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  IndianRupee,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  Users,
  X,
  Clock3,
  CheckCircle2,
  Power,
  RefreshCw,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const JEEP_API = "/api/safari/jeep";

async function safariApi(path, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  if (!token) {
    throw new Error("Admin session expired. Please log in again.");
  }

  const normalizedPath = path.startsWith("/api/")
    ? path
    : `/api${path.startsWith("/") ? path : `/${path}`}`;

  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${normalizedPath}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Request failed (${response.status})`
    );
  }

  return result;
}

function serviceCodeFromName(name) {
  const slug = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || `jeep-safari-${Date.now()}`;
}

function getZoneId(zone) {
  if (typeof zone === "string") return zone;
  return zone?._id || zone?.id || "";
}

function mapService(item) {
  return {
    ...item,
    id: item._id || item.id,
    serviceCode: item.serviceCode || serviceCodeFromName(item.name),
    name: item.name || "",
    location: item.location || item.area || "",
    price: item.price == null ? "" : String(item.price),
    capacity: String(item.capacity ?? 6),
    duration: item.duration || "",
    description: item.description || "",
    zones: Array.isArray(item.zones) ? item.zones : [],
    status: item.status || "active",
    image: item.image || item.imageUrl || item.imageURL || "",
    imageAssetId: item.imageAssetId || "",
  };
}

const EMPTY_SERVICE = {
  serviceCode: "",
  name: "",
  location: "",
  price: "",
  capacity: "6",
  duration: "3–4 hrs",
  description: "",
  zones: [],
  status: "active",
  image: "",
  imageAssetId: "",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10 disabled:bg-gray-50 disabled:text-gray-500";

const labelClass = "mb-1.5 block text-sm font-semibold text-gray-700";

function getPriceLabel(price) {
  if (price === "" || price == null) return "Price on request";

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Price on request";
  }

  return `₹${numericPrice.toLocaleString("en-IN")}`;
}

export default function JeepSafariManagementPage() {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const loadData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);

    try {
      const result = await safariApi(JEEP_API);

      const list = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.services)
          ? result.data.services
          : Array.isArray(result.services)
            ? result.services
            : [];

      setServices(list.map(mapService));
      setMessage("");
    } catch (error) {
      showMessage(
        error.message || "Unable to load Jeep Safari services.",
        "error"
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function updateDraft(field, value) {
    setDraft((previous) => {
      if (!previous) return previous;

      const updated = { ...previous, [field]: value };

      if (field === "name" && isAdding) {
        updated.serviceCode = serviceCodeFromName(value);
      }

      return updated;
    });
  }

  function startEdit(service) {
    setIsAdding(false);
    setEditingId(service.id);

    setDraft({
      ...service,
      serviceCode:
        service.serviceCode || serviceCodeFromName(service.name),
      location: service.location || "",
      zones: Array.isArray(service.zones)
        ? service.zones.map(getZoneId).filter(Boolean)
        : [],
    });

    setMessage("");
  }

  function startAdd() {
    setEditingId(null);
    setIsAdding(true);
    setDraft({ ...EMPTY_SERVICE });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setIsAdding(false);
    setDraft(null);
    setMessage("");
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file || !draft) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showMessage("Please select a JPG, PNG or WebP image.", "error");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image size must be 5 MB or less.", "error");
      event.target.value = "";
      return;
    }

    setUploading(true);
    showMessage("Uploading image...");

    try {
      const optimizedFile = await optimizeImage(file);
      const formData = new FormData();

      formData.append("image", optimizedFile);
      formData.append("folder", "safari");

      const result = await safariApi("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      const imageData = result.data || {};
      const imageUrl = imageData.url || imageData.secure_url;

      if (!imageUrl) {
        throw new Error("Image upload response did not include an image URL.");
      }

      setDraft((previous) =>
        previous
          ? {
              ...previous,
              image: imageUrl,
              imageAssetId:
                imageData.assetId || imageData.public_id || "",
            }
          : previous
      );

      showMessage("Image uploaded. Save the service to apply it.", "success");
    } catch (error) {
      showMessage(error.message || "Image upload failed.", "error");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveService() {
    if (!draft?.name?.trim()) {
      showMessage("Jeep Safari service name is required.", "error");
      return;
    }

    if (!draft?.location?.trim()) {
      showMessage("Service location is required.", "error");
      return;
    }

    if (
      draft.price === "" ||
      !Number.isFinite(Number(draft.price)) ||
      Number(draft.price) < 0
    ) {
      showMessage(
        "Enter a valid price. Use 0 only if it is an intentional price.",
        "error"
      );
      return;
    }

    if (
      !Number.isInteger(Number(draft.capacity)) ||
      Number(draft.capacity) < 1
    ) {
      showMessage("Capacity must be at least one passenger.", "error");
      return;
    }

    if (!draft.duration?.trim()) {
      showMessage("Duration is required.", "error");
      return;
    }

    const duplicateName = services.some(
      (item) =>
        String(item.id) !== String(editingId) &&
        item.name.trim().toLowerCase() === draft.name.trim().toLowerCase()
    );

    if (duplicateName) {
      showMessage("A service with this name already exists.", "error");
      return;
    }

    const payload = {
      serviceCode: draft.serviceCode || serviceCodeFromName(draft.name),
      name: draft.name.trim(),
      location: draft.location.trim(),
      price: Number(draft.price),
      capacity: Number(draft.capacity),
      duration: draft.duration.trim(),
      description: (draft.description || "").trim(),
      zones: Array.isArray(draft.zones)
        ? draft.zones.map(getZoneId).filter(Boolean)
        : [],
      status: draft.status || "active",
      image: draft.image || "",
      imageAssetId: draft.imageAssetId || "",
    };

    setSaving(true);
    setMessage("");

    try {
      const wasAdding = isAdding;

      if (wasAdding) {
        await safariApi(JEEP_API, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await safariApi(`${JEEP_API}/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      setEditingId(null);
      setIsAdding(false);
      setDraft(null);

      await loadData(false);

      showMessage(
        wasAdding
          ? "Jeep Safari service created successfully."
          : "Jeep Safari service updated successfully.",
        "success"
      );
    } catch (error) {
      showMessage(error.message || "Unable to save Jeep Safari service.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteService(service) {
    const confirmed = window.confirm(
      `Permanently delete "${service.name}" from the database?`
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");

    try {
      await safariApi(`${JEEP_API}/${service.id}`, {
        method: "DELETE",
      });

      if (String(editingId) === String(service.id)) {
        cancelEdit();
      }

      await loadData(false);
      showMessage("Jeep Safari service deleted successfully.", "success");
    } catch (error) {
      showMessage(
        error.message || "Unable to delete Jeep Safari service.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  const activeServices = services.filter(
    (service) => service.status === "active"
  ).length;

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/admin/organisation/departments/safari"
              aria-label="Back to Safari Management"
              className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B96928]">
                Organization / Departments / Safari
              </p>

              <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                Jeep Safari
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage Jeep Safari services, prices, locations and images.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadData()}
              disabled={loading || saving}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              onClick={startAdd}
              disabled={loading || saving || isAdding || editingId !== null}
              className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-3 text-sm font-bold text-white hover:bg-[#9D5721] disabled:opacity-50"
            >
              <Plus size={17} />
              Add Jeep Safari
            </button>
          </div>
        </header>

        {message && (
          <div
            role="status"
            className={`flex items-start justify-between gap-3 rounded-xl border bg-white p-4 text-sm ${
              messageType === "error"
                ? "border-red-200 text-red-700"
                : messageType === "success"
                  ? "border-green-200 text-green-700"
                  : "border-gray-200 text-gray-700"
            }`}
          >
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
              className="text-gray-500 hover:text-gray-900"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<MapPin size={20} />}
            title="Total Services"
            value={services.length}
            subtitle="Services stored in the database"
          />
          <SummaryCard
            icon={<CheckCircle2 size={20} />}
            title="Active Services"
            value={activeServices}
            subtitle="Currently marked active"
          />
          <SummaryCard
            icon={<Power size={20} />}
            title="Inactive Services"
            value={services.length - activeServices}
            subtitle="Currently marked inactive"
          />
        </section>

        {isAdding && draft && (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <ServiceEditor
              title="Add Jeep Safari"
              draft={draft}
              inputClass={inputClass}
              labelClass={labelClass}
              fileInputRef={fileInputRef}
              updateDraft={updateDraft}
              handleImageChange={handleImageChange}
              saveService={saveService}
              cancelEdit={cancelEdit}
              saving={saving}
              uploading={uploading}
            />
          </section>
        )}

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-black">Jeep Safari Services</h2>
            <p className="mt-1 text-sm text-gray-500">
              Changes saved here are stored in the backend database.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
              Loading Jeep Safari services...
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <ImagePlus className="mx-auto text-gray-400" size={38} />
              <h3 className="mt-3 font-bold">
                No Jeep Safari services found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                The API returned no records. Check the backend route and database.
              </p>
              <button
                type="button"
                onClick={startAdd}
                className="mt-4 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-bold text-white"
              >
                Add Jeep Safari
              </button>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {services.map((service) => {
                const isEditing =
                  String(editingId) === String(service.id);

                return (
                  <article
                    key={service.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 p-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-extrabold">
                            {service.name}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              service.status === "active"
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {service.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin size={15} className="shrink-0 text-[#B96928]" />
                          {service.location || "Location not added"}
                        </p>
                      </div>

                      {!isEditing && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={saving || editingId !== null || isAdding}
                            onClick={() => startEdit(service)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold hover:bg-gray-50 disabled:opacity-40"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={saving || editingId !== null || isAdding}
                            onClick={() => deleteService(service)}
                            aria-label={`Delete ${service.name}`}
                            className="flex items-center justify-center rounded-xl border border-red-200 px-3 text-red-600 hover:bg-red-50 disabled:opacity-40"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing && draft ? (
                      <div className="p-5">
                        <ServiceEditor
                          title={`Edit ${service.name}`}
                          draft={draft}
                          inputClass={inputClass}
                          labelClass={labelClass}
                          fileInputRef={fileInputRef}
                          updateDraft={updateDraft}
                          handleImageChange={handleImageChange}
                          saveService={saveService}
                          cancelEdit={cancelEdit}
                          saving={saving}
                          uploading={uploading}
                        />
                      </div>
                    ) : (
                      <div className="grid gap-4 p-5 sm:grid-cols-[150px_1fr]">
                        <div className="relative h-36 overflow-hidden rounded-xl bg-gray-100">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={`${service.name} cover`}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center text-gray-400">
                              <ImagePlus size={30} />
                              <span className="mt-2 text-xs">No cover image</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <InfoItem
                              icon={<IndianRupee size={16} />}
                              label="Price"
                              value={getPriceLabel(service.price)}
                            />
                            <InfoItem
                              icon={<Users size={16} />}
                              label="Capacity"
                              value={`${service.capacity || 0} passengers`}
                            />
                            <InfoItem
                              icon={<Clock3 size={16} />}
                              label="Duration"
                              value={service.duration || "Not specified"}
                            />
                            <InfoItem
                              icon={<Power size={16} />}
                              label="Status"
                              value={service.status}
                            />
                          </div>

                          <p className="text-sm leading-6 text-gray-600">
                            {service.description || "No description added."}
                          </p>
                        </div>
                      </div>
                    )}
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

function ServiceEditor({
  title,
  draft,
  inputClass,
  labelClass,
  fileInputRef,
  updateDraft,
  handleImageChange,
  saveService,
  cancelEdit,
  saving,
  uploading,
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-extrabold">{title}</h3>
        <button
          type="button"
          onClick={cancelEdit}
          disabled={saving || uploading}
          aria-label="Cancel editing"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <label className={labelClass}>Service Cover Image</label>

          <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            {draft.image ? (
              <img
                key={draft.image}
                src={draft.image}
                alt="Safari service preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="px-5 text-center">
                <ImagePlus className="mx-auto text-gray-400" size={36} />
                <p className="mt-2 text-sm font-bold text-gray-700">
                  No cover image
                </p>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="url"
              className={inputClass}
              value={draft.image || ""}
              disabled={saving || uploading}
              onChange={(event) => {
                updateDraft("image", event.target.value);
                updateDraft("imageAssetId", "");
              }}
              placeholder="Paste image URL here"
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={uploading || saving}
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                  fileInputRef.current.click();
                }
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
            >
              <Camera size={16} />
              {uploading
                ? "Uploading..."
                : draft.image
                  ? "Change Image"
                  : "Upload Image"}
            </button>

            {draft.image && (
              <button
                type="button"
                disabled={saving || uploading}
                onClick={() => {
                  updateDraft("image", "");
                  updateDraft("imageAssetId", "");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Remove
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            JPG, PNG or WebP. Maximum 5 MB for uploaded images.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Service Name *</label>
            <input
              className={inputClass}
              value={draft.name}
              disabled={saving}
              onChange={(event) => updateDraft("name", event.target.value)}
              placeholder="e.g. Dhikala Zone Safari"
            />
          </div>

          <div>
            <label className={labelClass}>Service Location *</label>
            <input
              className={inputClass}
              value={draft.location || ""}
              disabled={saving}
              onChange={(event) =>
                updateDraft("location", event.target.value)
              }
              placeholder="e.g. Dhikala, Ramnagar"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input
                className={inputClass}
                type="number"
                min="0"
                step="1"
                value={draft.price}
                disabled={saving}
                onChange={(event) => updateDraft("price", event.target.value)}
                placeholder="Enter confirmed price"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the confirmed price. Do not use zero to mean unknown.
              </p>
            </div>

            <div>
              <label className={labelClass}>Capacity *</label>
              <input
                className={inputClass}
                type="number"
                min="1"
                step="1"
                value={draft.capacity}
                disabled={saving}
                onChange={(event) =>
                  updateDraft("capacity", event.target.value)
                }
                placeholder="Passengers"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Duration *</label>
            <input
              className={inputClass}
              value={draft.duration}
              disabled={saving}
              onChange={(event) =>
                updateDraft("duration", event.target.value)
              }
              placeholder="e.g. 3–4 hrs"
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={draft.description}
              disabled={saving}
              onChange={(event) =>
                updateDraft("description", event.target.value)
              }
              placeholder="Enter service description"
            />
          </div>

          <div>
            <label className={labelClass}>Service Status</label>
            <select
              className={inputClass}
              value={draft.status}
              disabled={saving}
              onChange={(event) => updateDraft("status", event.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          disabled={saving || uploading}
          onClick={cancelEdit}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={saving || uploading}
          onClick={saveService}
          className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#9D5721] disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Service"}
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ icon, title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[#B96928]">
        {icon}
        <span className="text-sm font-semibold text-gray-600">{title}</span>
      </div>
      <p className="mt-3 text-2xl font-black text-[#172033]">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="min-w-0 rounded-xl bg-gray-50 p-3">
      <div className="flex items-center gap-1.5 text-gray-500">
        {icon}
        <span className="text-xs font-semibold">{label}</span>
      </div>
      <p className="mt-1 break-words text-sm font-extrabold text-[#172033]">
        {value}
      </p>
    </div>
  );
}
