
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  BedDouble,
  CalendarDays,
  LoaderCircle,
  Save,
  Send,
  ImagePlus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { ownerApiRequest } from "@/lib/ownerApi";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#B96928] focus:ring-2 focus:ring-[#B96928]/10";

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export default function OwnerPropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [form, setForm] = useState(null);
  const [propertyStatus, setPropertyStatus] = useState("draft");
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageAction, setImageAction] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const loadProperty = useCallback(async () => {
    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await ownerApiRequest(`owner/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = result?.data?.data ?? result?.data ?? result;
      const property = data?.property || data;

      setPropertyStatus(property.propertyStatus || "draft");
      setImages(Array.isArray(property.images) ? property.images : []);

      setForm({
        name: property.name || property.propertyName || "",
        propertyType: property.propertyType || property.type || "resort",
        description: property.description || "",
        address: property.address || "",
        city: property.city || property.location || "",
        state: property.state || "",
        pincode: property.pincode || "",
        contactName: property.contactName || property.contact?.name || "",
        contactPhone: property.contactPhone || property.contact?.phone || "",
        contactEmail: property.contactEmail || property.contact?.email || "",
        totalRooms: property.totalRooms ?? "",
        checkInTime: property.checkInTime || "12:00",
        checkOutTime: property.checkOutTime || "11:00",
      });
    } catch (err) {
      if ([401, 403].includes(Number(err?.status))) {
        localStorage.removeItem("destin_owner_token");
        localStorage.removeItem("destin_owner_user");
        router.replace("/owner/login");
        return;
      }

      setError(err?.message || "Unable to load property details.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) loadProperty();
  }, [id, loadProperty]);

  function update(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setMessage("");
  }

  async function save(event) {
    event.preventDefault();

    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await ownerApiRequest(`owner/properties/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          totalRooms:
            form.totalRooms === "" ? undefined : Number(form.totalRooms),
        }),
      });

      const data = result?.data?.data ?? result?.data ?? result;
      const property = data?.property || data;

      if (property?.propertyStatus) {
        setPropertyStatus(property.propertyStatus);
      }

      setMessage("Property details saved successfully.");
      await loadProperty();
    } catch (err) {
      setError(err?.message || "Unable to save property details.");
    } finally {
      setSaving(false);
    }
  }

  function selectImages(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    setError("");
    setMessage("");

    if (!files.length) return;

    const invalidType = files.find(
      (file) => !ALLOWED_TYPES.includes(file.type)
    );

    if (invalidType) {
      setError("Only JPEG, PNG, WebP and AVIF images are allowed.");
      return;
    }

    const oversized = files.find((file) => file.size > MAX_FILE_SIZE);

    if (oversized) {
      setError("Each image must be 10 MB or smaller.");
      return;
    }

    if (images.length + selectedFiles.length + files.length > MAX_IMAGES) {
      setError(
        `You can keep a maximum of ${MAX_IMAGES} images for this property.`
      );
      return;
    }

    setSelectedFiles((current) => [...current, ...files]);
  }

  async function uploadImages() {
    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    if (!selectedFiles.length) {
      setError("Please select at least one image.");
      return;
    }

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setError(`A maximum of ${MAX_IMAGES} images is allowed.`);
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const body = new FormData();
      selectedFiles.forEach((file) => body.append("images", file));

      const result = await ownerApiRequest(
        `owner/properties/${id}/images`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body,
        }
      );

      const data = result?.data?.data ?? result?.data ?? result;
      const returnedImages = data?.images;

      if (Array.isArray(returnedImages)) {
        setImages(returnedImages);
      } else {
        await loadProperty();
      }

      setSelectedFiles([]);
      setMessage(
        result?.data?.message ||
          result?.message ||
          "Property images uploaded successfully."
      );

      await loadProperty();
    } catch (err) {
      if ([401, 403].includes(Number(err?.status))) {
        localStorage.removeItem("destin_owner_token");
        localStorage.removeItem("destin_owner_user");
        router.replace("/owner/login");
        return;
      }

      setError(err?.message || "Unable to upload property images.");
    } finally {
      setUploading(false);
    }
  }

  async function setCoverImage(imageUrl) {
    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setImageAction(`cover:${imageUrl}`);
    setError("");
    setMessage("");

    try {
      await ownerApiRequest(
        `owner/properties/${id}/images/cover`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ imageUrl }),
        }
      );

      await loadProperty();
      setMessage("Cover image updated successfully.");
    } catch (err) {
      setError(err?.message || "Unable to update cover image.");
    } finally {
      setImageAction("");
    }
  }

  async function deleteImage(imageUrl) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property image?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setImageAction(`delete:${imageUrl}`);
    setError("");
    setMessage("");

    try {
      await ownerApiRequest(`owner/properties/${id}/images`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageUrl }),
      });

      await loadProperty();
      setMessage("Property image removed successfully.");
    } catch (err) {
      setError(err?.message || "Unable to delete property image.");
    } finally {
      setImageAction("");
    }
  }

  async function submitForReview() {
    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await ownerApiRequest(`owner/properties/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          totalRooms:
            form.totalRooms === "" ? undefined : Number(form.totalRooms),
        }),
      });

      const result = await ownerApiRequest(
        `owner/properties/${id}/submit`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = result?.data?.data ?? result?.data ?? result;
      const property = data?.property || data;

      setPropertyStatus(property?.propertyStatus || "pending");
      setMessage(
        result?.data?.message ||
          result?.message ||
          "Property submitted successfully. It is awaiting admin review."
      );

      await loadProperty();
    } catch (err) {
      setError(err?.message || "Unable to submit property for review.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] text-sm text-gray-500">
        Loading property...
      </main>
    );
  }

  if (!form) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-white p-6">
          <p className="text-sm text-red-700">
            {error || "Property not found."}
          </p>
          <button
            onClick={loadProperty}
            className="mt-4 font-bold text-[#B96928]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const canSubmit = !["pending", "approved", "suspended"].includes(
    propertyStatus
  );

  const statusLabel = {
    draft: "Draft",
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    suspended: "Suspended",
  }[propertyStatus] || propertyStatus;

  return (
    <main className="min-h-screen bg-[#F7F5F0] p-4 text-[#172033] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/owner/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#B96928]"
        >
          <ArrowLeft size={16} /> My Properties
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">
              Manage Property
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Update your property information and images.
            </p>
            <p className="mt-3 text-sm">
              Property status:{" "}
              <span className="font-extrabold text-[#B96928]">
                {statusLabel}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/owner/properties/${id}/rooms`}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold"
            >
              <BedDouble size={17} /> Rooms
            </Link>

            <Link
              href={`/owner/properties/${id}/availability`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-3 text-sm font-bold text-white"
            >
              <CalendarDays size={17} /> Availability
            </Link>
          </div>
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

        {/* Property image management */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <ImagePlus className="text-[#B96928]" size={24} />
                <h2 className="text-lg font-extrabold">Property Images</h2>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Upload clear photos of your property. The cover image is shown
                first.
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#F7F5F0] px-3 py-1.5 text-xs font-bold text-gray-600">
              {images.length}/{MAX_IMAGES} images
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-[#F7F5F0]/60 p-4 sm:p-5">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg px-3 py-5 text-center hover:bg-white/70">
              <ImagePlus size={28} className="text-[#B96928]" />
              <span className="text-sm font-extrabold">
                Choose property images
              </span>
              <span className="text-xs text-gray-500">
                JPEG, PNG, WebP or AVIF · Maximum 10 MB per image
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                disabled={uploading || images.length >= MAX_IMAGES}
                onChange={selectImages}
                className="sr-only"
              />
            </label>
          </div>

          {previews.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-bold">Selected images</h3>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {previews.map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative overflow-hidden rounded-xl border border-gray-200"
                  >
                    <img
                      src={src}
                      alt={`Selected property image ${index + 1}`}
                      className="h-32 w-full object-cover sm:h-40"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFiles((current) =>
                          current.filter((_, fileIndex) => fileIndex !== index)
                        )
                      }
                      disabled={uploading}
                      aria-label="Remove selected image"
                      className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-gray-700 shadow hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={uploadImages}
                disabled={uploading || !selectedFiles.length}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <ImagePlus size={17} />
                )}
                {uploading ? "Uploading..." : `Upload ${selectedFiles.length} image(s)`}
              </button>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-extrabold">
              Uploaded images ({images.length})
            </h3>

            {images.length === 0 ? (
              <div className="mt-3 rounded-xl border border-gray-200 px-4 py-8 text-center">
                <ImagePlus
                  size={30}
                  className="mx-auto text-gray-400"
                />
                <p className="mt-2 text-sm font-bold text-gray-600">
                  No images uploaded yet
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Select images above to add them to this property.
                </p>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((image) => {
                  const isCover = Boolean(image.isCover);
                  const actionBusy =
                    imageAction === `cover:${image.url}` ||
                    imageAction === `delete:${image.url}`;

                  return (
                    <article
                      key={image._id || image.url}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.alt || "Property image"}
                          loading="lazy"
                          className="h-32 w-full object-cover sm:h-40"
                        />

                        {isCover && (
                          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#172033] px-2.5 py-1 text-[11px] font-bold text-white">
                            <Star size={12} fill="currentColor" />
                            Cover
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 p-3">
                        {!isCover ? (
                          <button
                            type="button"
                            onClick={() => setCoverImage(image.url)}
                            disabled={Boolean(imageAction) || uploading}
                            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#B96928] px-2 py-2 text-xs font-bold text-[#B96928] hover:bg-[#B96928]/5 disabled:opacity-50"
                          >
                            {imageAction === `cover:${image.url}` ? (
                              <LoaderCircle
                                size={14}
                                className="animate-spin"
                              />
                            ) : (
                              <Star size={14} />
                            )}
                            Set as Cover
                          </button>
                        ) : (
                          <div className="rounded-lg bg-[#F7F5F0] px-2 py-2 text-center text-xs font-bold text-gray-600">
                            Main cover image
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteImage(image.url)}
                          disabled={Boolean(imageAction) || uploading}
                          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {imageAction === `delete:${image.url}` ? (
                            <LoaderCircle
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          Delete image
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {propertyStatus === "approved" && (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              Changing property images may send this property back for admin
              review. It may no longer be publicly visible until it is approved
              and published again.
            </p>
          )}
        </section>

        <form
          onSubmit={save}
          className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"
        >
          <div className="mb-6 flex items-center gap-3">
            <Building2 className="text-[#B96928]" size={24} />
            <h2 className="text-lg font-extrabold">Property Details</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["Property Name", "name", true],
              ["Address", "address", true],
              ["City / Area", "city", true],
              ["State", "state", true],
              ["PIN Code", "pincode", false],
              ["Contact Person", "contactName", false],
              ["Contact Phone", "contactPhone", false],
              ["Contact Email", "contactEmail", false],
              ["Total Rooms", "totalRooms", false],
              ["Check-in Time", "checkInTime", false],
              ["Check-out Time", "checkOutTime", false],
            ].map(([label, name, required]) => (
              <label key={name} className="block">
                <span className="mb-2 block text-sm font-bold">{label}</span>
                <input
                  name={name}
                  value={form[name]}
                  onChange={update}
                  required={required}
                  type={
                    name === "contactEmail"
                      ? "email"
                      : name === "totalRooms"
                        ? "number"
                        : ["checkInTime", "checkOutTime"].includes(name)
                          ? "time"
                          : "text"
                  }
                  min={name === "totalRooms" ? 0 : undefined}
                  className={inputClass}
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-2 block text-sm font-bold">
                Property Type
              </span>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={update}
                className={inputClass}
              >
                <option value="resort">Resort</option>
                <option value="hotel">Hotel</option>
                <option value="homestay">Homestay</option>
                <option value="villa">Villa</option>
                <option value="guest_house">Guest House</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={update}
              rows={4}
              className={inputClass}
            />
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || submitting || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {canSubmit && (
              <button
                type="button"
                onClick={submitForReview}
                disabled={saving || submitting || uploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B96928] bg-white px-5 py-3 text-sm font-bold text-[#B96928] disabled:opacity-60"
              >
                {submitting ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Send size={17} />
                )}
                {submitting ? "Submitting..." : "Submit for Review"}
              </button>
            )}
          </div>

          {propertyStatus === "pending" && (
            <p className="mt-4 text-sm text-gray-500">
              Your property is awaiting admin review. You can check its status
              from My Properties.
            </p>
          )}

          {propertyStatus === "approved" && (
            <p className="mt-4 text-sm text-gray-500">
              This property is approved. Contact the administrator if you need
              to change its approval or publication status.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
