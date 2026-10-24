
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  MapPin,
  IndianRupee,
  Info,
  ArrowLeft,
  Loader2,
  Save,
  RefreshCw,
  ImagePlus,
  UploadCloud,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
  priceNegotiable: false,
};

const inputCls =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-slate-100";

function getOwnerToken() {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem("destin_owner_token");
  if (!value) return null;

  let token = value.trim();

  if (token.startsWith('"') && token.endsWith('"')) {
    try {
      token = JSON.parse(token);
    } catch {
      token = token.slice(1, -1);
    }
  }

  return token && token !== "null" && token !== "undefined"
    ? token
    : null;
}

async function readResponse(response) {
  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status}).`
    );
  }

  return data;
}

function normalizeProperty(property) {
  return {
    ...EMPTY,
    title: property.title || "",
    description: property.description || "",
    propertyType: property.propertyType || "",
    transactionType: property.transactionType || "",
    price: property.price ?? "",
    address: property.address || "",
    city: property.city || "",
    state: property.state || "",
    pincode: property.pincode || "",
    areaSqft: property.areaSqft ?? "",
    bedrooms: property.bedrooms ?? "",
    bathrooms: property.bathrooms ?? "",
    parking: Boolean(property.parking),
    furnished: property.furnished || "unfurnished",
    amenities: Array.isArray(property.amenities)
      ? property.amenities.join(", ")
      : "",
    priceNegotiable: Boolean(property.priceNegotiable),
  };
}

function getImageUrl(image) {
  if (typeof image === "string") return image;
  return image?.url || image?.secure_url || "";
}

function getImagePublicId(image) {
  if (typeof image === "string") return "";
  return image?.public_id || image?.publicId || "";
}

export default function EditREPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id;

  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingImage, setDeletingImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const fetchProperty = useCallback(async () => {
    if (!propertyId) {
      setLoading(false);
      setError("Property ID was not found in the URL.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = getOwnerToken();

      if (!token) {
        router.replace("/owner/login");
        return;
      }

      const response = await fetch(
        `${API_BASE}/api/re/properties/${encodeURIComponent(
          String(propertyId)
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        router.replace("/owner/login");
        throw new Error("Owner session has expired. Please log in again.");
      }

      const data = await readResponse(response);
      const property = data.property || data.data?.property;

      if (!property) {
        throw new Error("Property details were not found in the API response.");
      }

      setForm(normalizeProperty(property));
      setImages(Array.isArray(property.images) ? property.images : []);
    } catch (err) {
      setError(err.message || "Failed to load the property.");
    } finally {
      setLoading(false);
    }
  }, [propertyId, router]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  useEffect(() => {
    return () => {
      selectedImages.forEach((item) => {
        URL.revokeObjectURL(item.preview);
      });
    };
  }, [selectedImages]);

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    setError("");
    setSuccess("");

    if (!files.length) return;

    const available = MAX_IMAGES - images.length - selectedImages.length;

    if (available <= 0) {
      setError(`A maximum of ${MAX_IMAGES} images is allowed per property.`);
      return;
    }

    const accepted = [];
    const rejected = [];

    for (const file of files) {
      if (
        !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
          file.type
        )
      ) {
        rejected.push(`${file.name}: Please select a JPG, PNG, WEBP, or GIF image.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name}: The image exceeds 5 MB.`);
        continue;
      }

      const duplicate = selectedImages.some(
        (item) =>
          item.file.name === file.name &&
          item.file.size === file.size &&
          item.file.lastModified === file.lastModified
      );

      if (!duplicate) accepted.push(file);
    }

    const allowed = accepted.slice(0, available);

    const additions = allowed.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((previous) => [...previous, ...additions]);

    const messages = [...rejected];

    if (accepted.length > available) {
      messages.push(`You can add only ${available} more image(s).`);
    }

    if (messages.length) setError(messages.join(" "));
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((previous) => {
      const item = previous[index];

      if (item) URL.revokeObjectURL(item.preview);

      return previous.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleUploadImages = async () => {
    if (!propertyId || !selectedImages.length || uploading) return;

    const token = getOwnerToken();

    if (!token) {
      router.replace("/owner/login");
      setError("Owner session not found. Please log in again.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const pending = [...selectedImages];

      for (let index = 0; index < pending.length; index++) {
        const item = pending[index];

        setUploadProgress(
          `Uploading image ${index + 1}/${pending.length}: ${item.file.name}`
        );

        const body = new FormData();
        body.append("image", item.file);

        const url = `${API_BASE}/api/re/properties/${encodeURIComponent(
          String(propertyId)
        )}/images`;

        console.log("PROPERTY IMAGE UPLOAD URL:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body,
        });

        const data = await readResponse(response);

        setSelectedImages((previous) =>
          previous.filter((selected) => selected !== item)
        );

        URL.revokeObjectURL(item.preview);

        if (Array.isArray(data.images)) {
          setImages(data.images);
        } else {
          // Reload the latest record if the server response does not include updated images.
          const refreshed = await fetch(
            `${API_BASE}/api/re/properties/${encodeURIComponent(
              String(propertyId)
            )}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            }
          );

          if (refreshed.ok) {
            const refreshedData = await readResponse(refreshed);
            const property =
              refreshedData.property || refreshedData.data?.property;

            if (property && Array.isArray(property.images)) {
              setImages(property.images);
            }
          }
        }
      }

      setSuccess("Property images uploaded successfully.");
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  const handleDeleteImage = async (image) => {
    const publicId = getImagePublicId(image);

    if (!publicId) {
      setError(
        "The public_id for this image was not found in the response. The backend delete endpoint requires the image public_id."
      );
      return;
    }

    if (!window.confirm("Are you sure you want to delete this property image?")) {
      return;
    }

    const token = getOwnerToken();

    if (!token) {
      router.replace("/owner/login");
      setError("Owner session not found. Please log in again.");
      return;
    }

    setDeletingImage(publicId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_BASE}/api/re/properties/${encodeURIComponent(
          String(propertyId)
        )}/images`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ publicId }),
        }
      );

      await readResponse(response);
      setImages((previous) =>
        previous.filter(
          (item) => getImagePublicId(item) !== publicId
        )
      );
      setSuccess("Image deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete the image.");
    } finally {
      setDeletingImage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = getOwnerToken();

      if (!token) {
        router.replace("/owner/login");
        throw new Error("Please log in to your owner account again.");
      }

      if (!propertyId) {
        throw new Error("Property ID is missing.");
      }

      if (!form.title.trim()) {
        throw new Error("Property title is required.");
      }

      if (
        form.price === "" ||
        !Number.isFinite(Number(form.price)) ||
        Number(form.price) < 0
      ) {
        throw new Error("Please enter a valid property price.");
      }

      const body = {
        title: form.title.trim(),
        description: form.description,
        propertyType: form.propertyType,
        transactionType: form.transactionType,
        price: Number(form.price),
        priceNegotiable: form.priceNegotiable,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        areaSqft: Number(form.areaSqft) || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        parking: form.parking,
        furnished: form.furnished,
        amenities: form.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await fetch(
        `${API_BASE}/api/re/properties/${encodeURIComponent(
          String(propertyId)
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.status === 401) {
        router.replace("/owner/login");
        throw new Error("Owner session has expired. Please log in again.");
      }

      await readResponse(response);

      setSuccess("Property details saved successfully.");

      setTimeout(() => {
        router.push(
          `/owner/re-properties/${encodeURIComponent(String(propertyId))}`
        );
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to update the property.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-5 p-6">
        <div className="h-8 w-52 rounded bg-slate-200" />
        <div className="h-64 rounded-2xl bg-slate-200" />
        <div className="h-64 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10">
      <Link
        href={`/owner/re-properties/${encodeURIComponent(String(propertyId))}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to property
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Edit Property</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage property details and photos here.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="break-words rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          {error}
          <button
            type="button"
            onClick={fetchProperty}
            className="ml-3 inline-flex items-center gap-1 font-semibold underline"
          >
            <RefreshCw size={14} />
            Reload
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={17} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset
          disabled={saving}
          className="space-y-6 disabled:opacity-75"
        >
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
                onChange={(event) => set("title", event.target.value)}
                className={inputCls}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Property Type
                </label>
                <select
                  value={form.propertyType}
                  onChange={(event) => set("propertyType", event.target.value)}
                  className={inputCls}
                  disabled
                >
                  {!PROPERTY_TYPES.some(
                    (type) => type.value === form.propertyType
                  ) && form.propertyType && (
                    <option value={form.propertyType}>
                      {form.propertyType}
                    </option>
                  )}
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Transaction Type
                </label>
                <input
                  value={form.transactionType}
                  className={`${inputCls} bg-slate-50`}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => set("description", event.target.value)}
                className={inputCls}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 font-bold text-slate-700">
              <IndianRupee size={18} />
              Pricing
            </h2>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => set("price", event.target.value)}
                className={inputCls}
                required
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.priceNegotiable}
                onChange={(event) =>
                  set("priceNegotiable", event.target.checked)
                }
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-slate-700">
                Price Negotiable
              </span>
            </label>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 font-bold text-slate-700">
              <MapPin size={18} />
              Location
            </h2>

            {[
              ["address", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-sm font-medium text-slate-700">
                  {label}
                </label>
                <input
                  value={form[key]}
                  onChange={(event) => set(key, event.target.value)}
                  className={inputCls}
                />
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="flex items-center gap-2 font-bold text-slate-700">
              <Info size={18} />
              Property Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["areaSqft", "Area (sq ft)"],
                ["bedrooms", "Bedrooms"],
                ["bathrooms", "Bathrooms"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form[key]}
                    onChange={(event) => set(key, event.target.value)}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Furnished Status
              </label>
              <select
                value={form.furnished}
                onChange={(event) => set("furnished", event.target.value)}
                className={inputCls}
              >
                {FURNISHED.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.parking}
                onChange={(event) => set("parking", event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-slate-700">
                Parking Available
              </span>
            </label>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Amenities (comma separated)
              </label>
              <input
                value={form.amenities}
                onChange={(event) => set("amenities", event.target.value)}
                placeholder="Gym, Pool, Security, Lift"
                className={inputCls}
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B96928] py-3.5 text-sm font-bold text-white transition hover:bg-[#98551F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving details...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Property Details
              </>
            )}
          </button>
        </fieldset>
      </form>

      {/* PROPERTY IMAGES */}
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-slate-700">
              <ImagePlus size={20} />
              Property Images
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage existing photos and upload new ones.
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            {images.length + selectedImages.length}/{MAX_IMAGES}
          </span>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => {
              const url = getImageUrl(image);
              const publicId = getImagePublicId(image);

              return (
                <div
                  key={publicId || url || index}
                  className="overflow-hidden rounded-xl border border-slate-200"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={`Property image ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 items-center justify-center bg-slate-100 text-xs text-slate-500">
                      Image URL unavailable
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 p-2">
                    <span className="truncate text-xs text-slate-500">
                      Photo {index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      disabled={Boolean(deletingImage) || uploading}
                      title="Delete image"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      {deletingImage === publicId ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <ImagePlus size={28} className="mx-auto text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-600">
              No property images available yet.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Select and upload photos below.
            </p>
          </div>
        )}

        {images.length + selectedImages.length < MAX_IMAGES && (
          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-orange-400 hover:bg-orange-50 ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <UploadCloud size={30} className="text-[#B96928]" />
            <span className="mt-2 text-sm font-semibold text-slate-700">
              Choose New Property Photos
            </span>
            <span className="mt-1 text-xs text-slate-500">
              JPG, PNG, WEBP, GIF · Maximum 5 MB each
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              disabled={uploading}
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        )}

        {selectedImages.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {selectedImages.map((item, index) => (
                <div
                  key={`${item.file.name}-${item.file.lastModified}-${index}`}
                  className="overflow-hidden rounded-xl border border-orange-200"
                >
                  <img
                    src={item.preview}
                    alt={`New image preview ${index + 1}`}
                    className="h-36 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 p-2">
                    <span className="truncate text-xs text-slate-600">
                      {item.file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSelectedImage(index)}
                      disabled={uploading}
                      aria-label="Remove selected image"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleUploadImages}
              disabled={uploading || !selectedImages.length}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading Images...
                </>
              ) : (
                <>
                  <UploadCloud size={18} />
                  Upload {selectedImages.length} Selected Image(s)
                </>
              )}
            </button>
          </>
        )}

        {uploadProgress && (
          <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            {uploadProgress}
          </p>
        )}

        <p className="text-xs text-slate-400">
          Owner authentication and image endpoints must be available on the
          backend to upload and delete photos.
        </p>
      </section>
    </div>
  );
}
