
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  MapPin,
  IndianRupee,
  Info,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  ImagePlus,
  UploadCloud,
  Trash2,
} from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getOwnerToken() {
  if (typeof window === "undefined") return null;

  const clean = (v) => {
    if (!v) return null;

    let t = v.trim();

    if (t.startsWith('"') && t.endsWith('"')) {
      try {
        t = JSON.parse(t);
      } catch {
        t = t.slice(1, -1);
      }
    }

    return t && t !== "null" && t !== "undefined" ? t : null;
  };

  const direct = clean(localStorage.getItem("destin_owner_token"));
  if (direct) return direct;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key && /owner/i.test(key) && /token/i.test(key)) {
      const token = clean(localStorage.getItem(key));
      if (token) return token;
    }
  }

  return null;
}

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "house", label: "House" },
  { value: "plot", label: "Plot / Land" },
  { value: "commercial", label: "Commercial" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "studio", label: "Studio" },
];

const FURNISHED = [
  { value: "unfurnished", label: "Unfurnished" },
  { value: "semi-furnished", label: "Semi Furnished" },
  { value: "fully-furnished", label: "Fully Furnished" },
];

const EMPTY = {
  title: "",
  description: "",
  propertyType: "",
  transactionType: "",
  price: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  areaSqft: "",
  bedrooms: "",
  bathrooms: "",
  parking: false,
  furnished: "unfurnished",
  amenities: "",
  priceNegotiable: true,
};

const inputCls =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100";

export default function AddREPropertyPage() {
  const router = useRouter();

  const [form, setForm] = useState(EMPTY);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    return () => {
      selectedImages.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [selectedImages]);

  const handleImageSelect = (event) => {
    const incoming = Array.from(event.target.files || []);
    event.target.value = "";
    setError("");

    if (!incoming.length) return;

    const slots = MAX_IMAGES - selectedImages.length;

    if (slots <= 0) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    const accepted = [];
    const rejected = [];

    for (const file of incoming) {
      if (!file.type.startsWith("image/")) {
        rejected.push(`${file.name}: not an image`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name}: exceeds 5 MB`);
        continue;
      }

      if (
        selectedImages.some(
          (item) =>
            item.file.name === file.name &&
            item.file.size === file.size
        )
      ) {
        continue;
      }

      accepted.push(file);
    }

    const allowed = accepted.slice(0, slots);

    setSelectedImages((prev) => [
      ...prev,
      ...allowed.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ]);

    if (rejected.length) {
      setError(rejected.join(" | "));
    }

    if (accepted.length > slots) {
      setError(
        (current) =>
          (current ? current + " | " : "") +
          `Only ${slots} more image(s) allowed.`
      );
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => {
      const item = prev[index];

      if (item?.preview) {
        URL.revokeObjectURL(item.preview);
      }

      return prev.filter((_, i) => i !== index);
    });

    setError("");
  };

  // Submit property details and images in a single request.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setUploadProgress("");

    try {
      const token = getOwnerToken();

      if (!token) {
        throw new Error("Owner login required. Please log in again.");
      }

      const fd = new FormData();

      fd.append("title", form.title.trim());
      fd.append("description", form.description || "");
      fd.append("propertyType", form.propertyType);
      fd.append("transactionType", form.transactionType);
      fd.append("price", String(Number(form.price)));
      fd.append("priceNegotiable", String(form.priceNegotiable));
      fd.append("address", form.address || "");
      fd.append("city", form.city || "");
      fd.append("state", form.state || "");
      fd.append("pincode", form.pincode || "");
      fd.append("areaSqft", String(Number(form.areaSqft) || 0));
      fd.append("bedrooms", String(Number(form.bedrooms) || 0));
      fd.append("bathrooms", String(Number(form.bathrooms) || 0));
      fd.append("parking", String(form.parking));
      fd.append("furnished", form.furnished || "unfurnished");

      const amenitiesArr = (form.amenities || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      fd.append("amenities", JSON.stringify(amenitiesArr));

      for (const item of selectedImages) {
        fd.append("images", item.file);
      }

      if (selectedImages.length > 0) {
        setUploadProgress(
          `Uploading property and ${selectedImages.length} image(s)...`
        );
      } else {
        setUploadProgress("Submitting property...");
      }

      const res = await fetch(`${API_BASE}/api/re/properties`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      let data = {};

      try {
        data = await res.json();
      } catch {
        // Handle responses that are not valid JSON.
      }

      if (!res.ok) {
        throw new Error(data.message || `Request failed (${res.status}).`);
      }

      setUploadProgress("");
      setSuccess(true);

      setTimeout(() => {
        router.push("/owner/re-properties");
      }, 1800);
    } catch (err) {
      console.error("Property submit error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>

        <h2 className="text-xl font-bold text-slate-800">
          Property Submitted!
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {selectedImages.length > 0
            ? `Property and ${selectedImages.length} image(s) uploaded successfully. Admin will review your submission.`
            : "Your property has been submitted. Admin will review it soon."}
        </p>

        <p className="mt-4 text-xs text-slate-400">
          Redirecting to My Properties...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <Link
          href="/owner/re-properties"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Add New Property
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Add property details and photos. Admin will review your submission.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      {uploadProgress && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          <Loader2 size={16} className="animate-spin" />
          {uploadProgress}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-700">
            <Home size={18} />
            Basic Information
          </h2>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Property Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. 3BHK Apartment in Noida Sector 62"
              className={inputCls}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Property Type *
              </label>
              <select
                value={form.propertyType}
                onChange={(e) => set("propertyType", e.target.value)}
                className={inputCls}
                required
              >
                <option value="">Select type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Transaction Type *
              </label>
              <select
                value={form.transactionType}
                onChange={(e) => set("transactionType", e.target.value)}
                className={inputCls}
                required
              >
                <option value="">Select transaction type</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="lease">For Lease</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Describe your property..."
              className={inputCls}
            />
          </div>
        </section>

        {/* Pricing */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-700">
            <IndianRupee size={18} />
            Pricing
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Price (₹) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g. 5000000"
                className={inputCls}
                required
                min={0}
              />
            </div>

            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.priceNegotiable}
                  onChange={(e) => set("priceNegotiable", e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm font-medium text-slate-700">
                  Price Negotiable
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-700">
            <MapPin size={18} />
            Location
          </h2>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Address
            </label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Street address"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                City
              </label>
              <input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="City"
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                State
              </label>
              <input
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="State"
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Pincode
              </label>
              <input
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value)}
                placeholder="Pincode"
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-700">
            <Info size={18} />
            Property Details
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Area (sqft)
              </label>
              <input
                type="number"
                value={form.areaSqft}
                onChange={(e) => set("areaSqft", e.target.value)}
                className={inputCls}
                min={0}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Bedrooms
              </label>
              <input
                type="number"
                value={form.bedrooms}
                onChange={(e) => set("bedrooms", e.target.value)}
                className={inputCls}
                min={0}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Bathrooms
              </label>
              <input
                type="number"
                value={form.bathrooms}
                onChange={(e) => set("bathrooms", e.target.value)}
                className={inputCls}
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Furnished Status
              </label>
              <select
                value={form.furnished}
                onChange={(e) => set("furnished", e.target.value)}
                className={inputCls}
              >
                {FURNISHED.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.parking}
                  onChange={(e) => set("parking", e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm font-medium text-slate-700">
                  Parking Available
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Amenities (comma separated)
            </label>
            <input
              value={form.amenities}
              onChange={(e) => set("amenities", e.target.value)}
              placeholder="e.g. Gym, Pool, Security, Lift"
              className={inputCls}
            />
          </div>
        </section>

        {/* Property Images */}
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-slate-700">
                <ImagePlus size={19} />
                Property Images
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Property photos will be uploaded together with the property.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {selectedImages.length}/{MAX_IMAGES}
            </span>
          </div>

          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-emerald-500 hover:bg-emerald-50 ${
              loading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <UploadCloud size={32} className="text-emerald-600" />

            <span className="mt-3 text-sm font-semibold text-slate-700">
              Click to choose property photos
            </span>

            <span className="mt-1 text-xs text-slate-500">
              JPG, PNG, WEBP · Max 5 MB · Max {MAX_IMAGES} images
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              disabled={loading || selectedImages.length >= MAX_IMAGES}
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>

          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {selectedImages.map((item, index) => (
                <div
                  key={`${item.file.name}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-slate-200"
                >
                  <img
                    src={item.preview}
                    alt={`Property preview ${index + 1}`}
                    className="h-36 w-full object-cover"
                  />

                  <div className="truncate px-2 py-1 text-xs text-slate-600">
                    {item.file.name}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={loading}
                    aria-label={`Remove ${item.file.name}`}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-600 shadow hover:bg-rose-50 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Property"
          )}
        </button>
      </form>
    </div>
  );
}
