
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { optimizeImage } from "@/lib/imageOptimizer";
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  CheckCircle2,
  Power,
  Clock3,
  Trees,
  Link2,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

async function safariApi(path, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken")
      : null;

  if (!token) {
    throw new Error("Admin session expired. Please log in again.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Request failed (${response.status})`
    );
  }

  return result;
}

function createSlug(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapZone(item) {
  return {
    ...item,
    id: item._id || item.id,
    name: item.name || item.zoneName || "",
    slug: item.slug || createSlug(item.name || item.zoneName),
    location: item.location || item.area || "",
    description: item.description || "",
    duration: item.duration || "3–4 hrs",
    safari: item.safari || "Jeep Safari",
    status: item.status || "active",
    image: item.image || item.imageUrl || "",
    imageAssetId: item.imageAssetId || "",
  };
}

const EMPTY_ZONE = {
  name: "",
  slug: "",
  location: "",
  description: "",
  duration: "3–4 hrs",
  safari: "Jeep Safari",
  status: "active",
  image: "",
  imageAssetId: "",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10 disabled:bg-gray-50 disabled:text-gray-500";

const labelClass =
  "mb-1.5 block text-sm font-semibold text-gray-700";

export default function SafariZonesManagementPage() {
  const [zones, setZones] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await safariApi("/api/safari/zones");

      const items = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.zones)
          ? result.data.zones
          : [];

      setZones(items.map(mapZone));
    } catch (error) {
      setMessage(error.message || "Unable to load safari zones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function updateDraft(field, value) {
    setDraft((previous) => {
      if (!previous) return previous;

      const updated = {
        ...previous,
        [field]: value,
      };

      // Auto-generate slug only while adding a new zone.
      if (field === "name" && isAdding && !previous.slug) {
        updated.slug = createSlug(value);
      }

      return updated;
    });
  }

  function startAdd() {
    setEditingId(null);
    setIsAdding(true);
    setDraft({ ...EMPTY_ZONE });
    setMessage("");
  }

  function startEdit(zone) {
    setIsAdding(false);
    setEditingId(zone.id);
    setDraft({ ...zone });
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
      setMessage("Please select a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setMessage("Uploading image...");

    try {
      const optimizedFile = await optimizeImage(file);

      const formData = new FormData();
      formData.append("image", optimizedFile);
      formData.append("folder", "safari-zones");

      const result = await safariApi("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      const imageData = result.data || {};
      const imageUrl = imageData.url || imageData.secure_url;

      if (!imageUrl) {
        throw new Error("Upload response did not include an image URL.");
      }

      setDraft((previous) => ({
        ...previous,
        image: imageUrl,
        imageAssetId:
          imageData.assetId || imageData.public_id || "",
      }));

      setMessage("Image uploaded. Click Save Zone to store it.");
    } catch (error) {
      setMessage(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveZone() {
    if (!draft?.name?.trim()) {
      setMessage("Safari zone name is required.");
      return;
    }

    const finalSlug = (draft.slug || createSlug(draft.name)).trim();

    if (!finalSlug) {
      setMessage("A valid zone slug is required.");
      return;
    }

    const duplicateName = zones.some(
      (zone) =>
        String(zone.id) !== String(editingId) &&
        zone.name.trim().toLowerCase() ===
          draft.name.trim().toLowerCase()
    );

    if (duplicateName) {
      setMessage("A zone with this name already exists.");
      return;
    }

    const duplicateSlug = zones.some(
      (zone) =>
        String(zone.id) !== String(editingId) &&
        String(zone.slug || "").toLowerCase() ===
          finalSlug.toLowerCase()
    );

    if (duplicateSlug) {
      setMessage("A zone with this slug already exists.");
      return;
    }

    const payload = {
      name: draft.name.trim(),
      slug: finalSlug,
      location: (draft.location || "").trim(),
      description: (draft.description || "").trim(),
      duration: (draft.duration || "3–4 hrs").trim(),
      safari: (draft.safari || "Jeep Safari").trim(),
      status: draft.status || "active",
      image: draft.image || "",
      imageAssetId: draft.imageAssetId || "",
    };

    setSaving(true);
    setMessage("");

    try {
      const wasAdding = isAdding;

      if (wasAdding) {
        await safariApi("/api/safari/zones", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await safariApi(`/api/safari/zones/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      setEditingId(null);
      setIsAdding(false);
      setDraft(null);

      await loadData();

      setMessage(
        wasAdding
          ? "Safari zone created successfully."
          : "Safari zone updated successfully."
      );
    } catch (error) {
      setMessage(error.message || "Unable to save safari zone.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteZone(zone) {
    const confirmed = window.confirm(
      `Permanently delete "${zone.name}"?`
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");

    try {
      await safariApi(`/api/safari/zones/${zone.id}`, {
        method: "DELETE",
      });

      if (String(editingId) === String(zone.id)) {
        cancelEdit();
      }

      await loadData();
      setMessage("Safari zone deleted successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to delete safari zone.");
    } finally {
      setSaving(false);
    }
  }

  const activeZones = zones.filter(
    (zone) => zone.status === "active"
  ).length;

  const inactiveZones = zones.length - activeZones;

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 text-[#172033] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* PAGE HEADER */}
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
                Safari Zones
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage zone names, locations, descriptions, safari type,
                duration and cover images.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={startAdd}
            disabled={loading || saving || isAdding || editingId !== null}
            className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-3 text-sm font-bold text-white hover:bg-[#9D5721] disabled:opacity-50"
          >
            <Plus size={17} />
            Add Safari Zone
          </button>
        </header>

        {/* STATUS MESSAGE */}
        {message && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm"
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

        {/* SUMMARY CARDS */}
        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<MapPin size={20} />}
            title="Total Zones"
            value={zones.length}
            subtitle="Zones stored in the database"
          />

          <SummaryCard
            icon={<CheckCircle2 size={20} />}
            title="Active Zones"
            value={activeZones}
            subtitle="Currently marked active"
          />

          <SummaryCard
            icon={<Power size={20} />}
            title="Inactive Zones"
            value={inactiveZones}
            subtitle="Currently marked inactive"
          />
        </section>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading safari zones...
          </div>
        )}

        {/* ADD FORM */}
        {isAdding && draft && (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <ZoneEditor
              title="Add Safari Zone"
              draft={draft}
              inputClass={inputClass}
              labelClass={labelClass}
              fileInputRef={fileInputRef}
              updateDraft={updateDraft}
              handleImageChange={handleImageChange}
              saveZone={saveZone}
              cancelEdit={cancelEdit}
              saving={saving}
              uploading={uploading}
            />
          </section>
        )}

        {/* ZONE LIST */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-black">All Safari Zones</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add, edit or remove the safari zones available on your website.
            </p>
          </div>

          {!loading && zones.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <ImagePlus className="mx-auto text-gray-400" size={38} />

              <h3 className="mt-3 font-bold">No safari zones found</h3>

              <p className="mt-1 text-sm text-gray-500">
                No zones were returned by the backend. Add a zone or seed
                your existing public zones into the database.
              </p>

              <button
                type="button"
                onClick={startAdd}
                className="mt-4 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#9D5721]"
              >
                Add Safari Zone
              </button>
            </div>
          ) : (
            !loading && (
              <div className="grid gap-5 xl:grid-cols-2">
                {zones.map((zone) => {
                  const isEditing =
                    String(editingId) === String(zone.id);

                  return (
                    <article
                      key={zone.id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 p-5">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-extrabold">
                              {zone.name}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                zone.status === "active"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {zone.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>

                          <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin
                              size={15}
                              className="shrink-0 text-[#B96928]"
                            />
                            {zone.location || "Location not added"}
                          </p>
                        </div>

                        {!isEditing && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={
                                saving ||
                                editingId !== null ||
                                isAdding
                              }
                              onClick={() => startEdit(zone)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold hover:bg-gray-50 disabled:opacity-40"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={
                                saving ||
                                editingId !== null ||
                                isAdding
                              }
                              onClick={() => deleteZone(zone)}
                              aria-label={`Delete ${zone.name}`}
                              className="flex items-center justify-center rounded-xl border border-red-200 px-3 text-red-600 hover:bg-red-50 disabled:opacity-40"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing && draft ? (
                        <div className="p-5">
                          <ZoneEditor
                            title={`Edit ${zone.name}`}
                            draft={draft}
                            inputClass={inputClass}
                            labelClass={labelClass}
                            fileInputRef={fileInputRef}
                            updateDraft={updateDraft}
                            handleImageChange={handleImageChange}
                            saveZone={saveZone}
                            cancelEdit={cancelEdit}
                            saving={saving}
                            uploading={uploading}
                          />
                        </div>
                      ) : (
                        <div className="grid gap-4 p-5 sm:grid-cols-[150px_1fr]">
                          <div className="relative h-36 overflow-hidden rounded-xl bg-gray-100">
                            {zone.image ? (
                              <img
                                src={zone.image}
                                alt={`${zone.name} cover`}
                                loading="lazy"
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                                <ImagePlus size={30} />
                                <span className="mt-2 text-xs">
                                  No cover image
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <InfoItem
                                icon={<Link2 size={16} />}
                                label="Slug"
                                value={zone.slug || "Not set"}
                              />

                              <InfoItem
                                icon={<Trees size={16} />}
                                label="Safari Type"
                                value={zone.safari || "Jeep Safari"}
                              />

                              <InfoItem
                                icon={<Clock3 size={16} />}
                                label="Duration"
                                value={zone.duration || "Not specified"}
                              />

                              <InfoItem
                                icon={<Power size={16} />}
                                label="Status"
                                value={zone.status}
                              />
                            </div>

                            <p className="text-sm leading-6 text-gray-600">
                              {zone.description || "No description added."}
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )
          )}
        </section>
      </div>
    </main>
  );
}

function ZoneEditor({
  title,
  draft,
  inputClass,
  labelClass,
  fileInputRef,
  updateDraft,
  handleImageChange,
  saveZone,
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
          aria-label="Cancel editing"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ZONE IMAGE */}
        <div className="space-y-3">
          <label className={labelClass}>Zone Cover Image</label>

          <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            {draft.image ? (
              <img
                key={draft.image}
                src={draft.image}
                alt="Safari zone cover preview"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                onLoad={(event) => {
                  event.currentTarget.style.display = "block";
                }}
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

            <p className="mt-1 text-xs text-gray-500">
              Upload an image or paste its URL, then save the zone.
            </p>
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
            JPG, PNG or WebP. Maximum 5 MB before optimization.
          </p>
        </div>

        {/* ZONE DETAILS */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Zone Name *</label>
            <input
              className={inputClass}
              value={draft.name || ""}
              disabled={saving}
              onChange={(event) =>
                updateDraft("name", event.target.value)
              }
              placeholder="e.g. Bijrani Zone"
            />
          </div>

          <div>
            <label className={labelClass}>Zone Slug *</label>
            <input
              className={inputClass}
              value={draft.slug || ""}
              disabled={saving}
              onChange={(event) =>
                updateDraft("slug", createSlug(event.target.value))
              }
              placeholder="e.g. bijrani"
            />
            <p className="mt-1 text-xs text-gray-500">
              Used in the safari booking URL.
            </p>
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input
              className={inputClass}
              value={draft.location || ""}
              disabled={saving}
              onChange={(event) =>
                updateDraft("location", event.target.value)
              }
              placeholder="e.g. Ramnagar, Uttarakhand"
            />
          </div>

          <div>
            <label className={labelClass}>Safari Type</label>
            <input
              className={inputClass}
              value={draft.safari || ""}
              disabled={saving}
              onChange={(event) =>
                updateDraft("safari", event.target.value)
              }
              placeholder="e.g. Jeep Safari"
            />
          </div>

          <div>
            <label className={labelClass}>Safari Duration</label>
            <input
              className={inputClass}
              value={draft.duration || ""}
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
              className={`${inputClass} min-h-32 resize-y`}
              value={draft.description || ""}
              disabled={saving}
              onChange={(event) =>
                updateDraft("description", event.target.value)
              }
              placeholder="Enter a short description of this zone"
            />
          </div>

          <div>
            <label className={labelClass}>Zone Status</label>
            <select
              className={inputClass}
              value={draft.status || "active"}
              disabled={saving}
              onChange={(event) =>
                updateDraft("status", event.target.value)
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <p className="mt-1 text-xs text-gray-500">
              Only active zones are returned by the public zones API.
            </p>
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
          onClick={saveZone}
          className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#9D5721] disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Zone"}
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
        <span className="text-sm font-semibold text-gray-600">
          {title}
        </span>
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
