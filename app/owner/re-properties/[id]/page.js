
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  BedDouble,
  Bath,
  Maximize2,
  CarFront,
  Home,
  RefreshCw,
  Pencil,
  Image as ImageIcon,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

function formatPrice(value) {
  if (value === undefined || value === null || value === "") {
    return "Price not provided";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) return String(value);

  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatLabel(value) {
  if (value === undefined || value === null || value === "") {
    return "Not provided";
  }

  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getToken() {
  if (typeof window === "undefined") return "";

  let token = localStorage.getItem("destin_owner_token") || "";

  try {
    if (token.startsWith('"') && token.endsWith('"')) {
      token = JSON.parse(token);
    }
  } catch {
    token = token.slice(1, -1);
  }

  return token && token !== "null" && token !== "undefined"
    ? token.trim()
    : "";
}

async function readResponse(response) {
  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  return data;
}

export default function OwnerREPropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Next.js dynamic route: app/owner/re-properties/[id]/page.js
  const rawId = params?.id;
  const propertyId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProperty = useCallback(async () => {
    if (!propertyId || typeof propertyId !== "string") {
      setLoading(false);
      setError("Property ID URL mein nahi mila. My Properties se listing open karein.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        router.replace("/owner/login");
        return;
      }

      const url = `${API_BASE}/api/re/properties/${encodeURIComponent(propertyId)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data = await readResponse(response);

      if (response.status === 401) {
        localStorage.removeItem("destin_owner_token");
        localStorage.removeItem("destin_owner_user");
        router.replace("/owner/login");
        return;
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || `Property load nahi hui (${response.status}).`
        );
      }

      const item =
        data.property ||
        data.data?.property ||
        data.data;

      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw new Error("API response mein property details nahi mili.");
      }

      setProperty(item);
    } catch (err) {
      setError(err.message || "Property details load nahi ho sakin.");
    } finally {
      setLoading(false);
    }
  }, [propertyId, router]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] p-6">
        <div className="mx-auto max-w-5xl animate-pulse space-y-5">
          <div className="h-10 w-48 rounded-xl bg-stone-200" />
          <div className="h-64 rounded-3xl bg-stone-200" />
          <div className="h-40 rounded-3xl bg-stone-200" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-12">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Home size={26} />
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            Property details unavailable
          </h1>

          <p className="mt-3 break-words text-sm text-slate-600">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={fetchProperty}
              className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-5 py-3 font-semibold text-white"
            >
              <RefreshCw size={16} />
              Try again
            </button>

            <Link
              href="/owner/re-properties"
              className="rounded-xl border border-stone-200 px-5 py-3 font-semibold text-slate-700"
            >
              Back to properties
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!property) return null;

  const resolvedId = String(property._id || property.id || propertyId);

  const location = [
    property.address,
    property.city,
    property.state,
    property.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const statusKey = String(property.status || "pending").toLowerCase();
  const status = formatLabel(statusKey);

  const statusStyles = {
    approved: "bg-green-50 text-green-700",
    active: "bg-green-50 text-green-700",
    published: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    pending_review: "bg-amber-50 text-amber-700",
    rejected: "bg-red-50 text-red-700",
    suspended: "bg-red-50 text-red-700",
    draft: "bg-stone-100 text-stone-700",
  };

  const details = [
    {
      label: "Property type",
      value: formatLabel(property.propertyType),
      icon: Home,
    },
    {
      label: "Transaction",
      value: formatLabel(property.transactionType),
      icon: IndianRupee,
    },
    {
      label: "Bedrooms",
      value: property.bedrooms ?? "Not provided",
      icon: BedDouble,
    },
    {
      label: "Bathrooms",
      value: property.bathrooms ?? "Not provided",
      icon: Bath,
    },
    {
      label: "Area",
      value: property.areaSqft
        ? `${Number(property.areaSqft).toLocaleString("en-IN")} sq ft`
        : "Not provided",
      icon: Maximize2,
    },
    {
      label: "Parking",
      value:
        property.parking === true
          ? "Available"
          : property.parking === false
            ? "Not available"
            : "Not provided",
      icon: CarFront,
    },
  ];

  const images = Array.isArray(property.images)
    ? property.images
        .map((image) =>
          typeof image === "string" ? image : image?.url
        )
        .filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/owner/re-properties"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#B96928]"
        >
          <ArrowLeft size={18} />
          Back to my properties
        </Link>

        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#172033] to-[#344054] px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    statusStyles[statusKey] || "bg-stone-100 text-stone-700"
                  }`}
                >
                  {status}
                </span>

                <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
                  {property.title || "Untitled property"}
                </h1>

                <p className="mt-3 flex items-start gap-2 text-sm text-slate-200">
                  <MapPin size={18} className="mt-0.5 shrink-0" />
                  {location || "Location not provided"}
                </p>
              </div>

              <Link
                href={`/owner/re-properties/${encodeURIComponent(resolvedId)}/edit`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 hover:bg-orange-50"
              >
                <Pencil size={16} />
                Edit property
              </Link>
            </div>

            <div className="mt-7">
              <p className="text-sm text-slate-300">Listed price</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-3xl font-bold">
                {formatPrice(property.price)}
                {property.priceNegotiable && (
                  <span className="text-sm font-medium text-slate-300">
                    Negotiable
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {images.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <ImageIcon size={20} />
                  Property photos
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((src, index) => (
                    <a
                      key={`${src}-${index}`}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-xl border border-stone-200"
                    >
                      <img
                        src={src}
                        alt={`${property.title || "Property"} photo ${index + 1}`}
                        loading="lazy"
                        className="h-40 w-full object-cover transition hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              </section>
            )}

            <h2 className="text-lg font-bold text-slate-900">
              Property overview
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {details.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-stone-200 bg-[#FCFBF8] p-4"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Icon size={17} />
                    {label}
                  </div>
                  <p className="mt-2 font-semibold capitalize text-slate-900">
                    {formatLabel(value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-stone-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900">
                Description
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {property.description || "No description added."}
              </p>
            </div>

            {Array.isArray(property.amenities) &&
              property.amenities.length > 0 && (
                <div className="mt-8 border-t border-stone-200 pt-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Amenities
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={`${amenity}-${index}`}
                        className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-slate-700"
                      >
                        {String(amenity)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="mt-8 rounded-2xl bg-orange-50 p-4">
              <p className="text-sm font-semibold text-[#8F4D1F]">
                Property status: {status}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Approval and publishing depend on the admin review process.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
