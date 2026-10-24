
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Home,
  MapPin,
  IndianRupee,
  Eye,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
)
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

const STATUS_STYLES = {
  draft: "bg-slate-100 text-slate-600",
  pending: "bg-amber-100 text-amber-700",
  listed: "bg-emerald-100 text-emerald-700",
  sold: "bg-blue-100 text-blue-700",
  rented: "bg-purple-100 text-purple-700",
  rejected: "bg-rose-100 text-rose-700",
};

const STATUS_ICONS = {
  draft: Clock,
  pending: Clock,
  listed: CheckCircle2,
  sold: CheckCircle2,
  rented: CheckCircle2,
  rejected: XCircle,
};

function getOwnerToken() {
  if (typeof window === "undefined") return null;

  const clean = (value) => {
    if (!value) return null;

    let token = value.trim();

    if (token.startsWith('"') && token.endsWith('"')) {
      try {
        token = JSON.parse(token);
      } catch {
        token = token.slice(1, -1);
      }
    }

    if (
      !token ||
      token === "null" ||
      token === "undefined"
    ) {
      return null;
    }

    return token;
  };

  const directToken = clean(
    window.localStorage.getItem("destin_owner_token")
  );

  if (directToken) return directToken;

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);

    if (key && /owner/i.test(key) && /token/i.test(key)) {
      const token = clean(window.localStorage.getItem(key));

      if (token) return token;
    }
  }

  return null;
}

async function readResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (response.status === 204) {
    return {};
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Server error (${response.status}): ${
        text.slice(0, 200) || "Request failed."
      }`
    );
  }

  throw new Error(
    "Backend se valid JSON response nahi mila. API route check karein."
  );
}

function getPropertiesFromResponse(data) {
  // Supported response formats:
  // { properties: [...] }
  // { data: { properties: [...] } }
  // { success: true, data: [...] }

  if (Array.isArray(data?.properties)) {
    return data.properties;
  }

  if (Array.isArray(data?.data?.properties)) {
    return data.data.properties;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return null;
}

function formatPrice(price) {
  const amount = Number(price);

  if (!Number.isFinite(amount) || amount < 0) {
    return "Price not set";
  }

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function getStatusLabel(status) {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function OwnerREPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = getOwnerToken();

      if (!token) {
        throw new Error(
          "Owner login token nahi mila. Owner account se login karein."
        );
      }

      const response = await fetch(
        `${API_BASE}/api/re/properties/my`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await readResponse(response);

      if (response.status === 401) {
        throw new Error(
          data.message ||
            "Owner session invalid ya expire ho gaya. Dobara login karein."
        );
      }

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.message || `Properties load nahi hui (${response.status}).`
        );
      }

      const list = getPropertiesFromResponse(data);

      if (!list) {
        throw new Error(
          "API response mein properties list nahi mili. Backend response format verify karein."
        );
      }

      setProperties(list);
    } catch (err) {
      setError(err.message || "Properties load nahi ho paayi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = async (id) => {
    if (!id || deleting) return;

    const confirmed = window.confirm(
      "Kya aap is property ko delete karna chahte hain?"
    );

    if (!confirmed) return;

    setDeleting(id);
    setError("");

    try {
      const token = getOwnerToken();

      if (!token) {
        throw new Error(
          "Owner login token nahi mila. Dobara login karein."
        );
      }

      const response = await fetch(
        `${API_BASE}/api/re/properties/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await readResponse(response);

      if (response.status === 401) {
        throw new Error(
          data.message || "Owner session invalid hai. Dobara login karein."
        );
      }

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.message || `Property delete nahi hui (${response.status}).`
        );
      }

      setProperties((current) =>
        current.filter((property) => property._id !== id)
      );
    } catch (err) {
      setError(err.message || "Property delete nahi ho paayi.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            My Properties
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your real estate listings.
          </p>
        </div>

        <Link
          href="/owner/re-properties/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus size={18} />
          Add Property
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span className="min-w-0 flex-1 break-words">{error}</span>

          <button
            type="button"
            onClick={fetchProperties}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-1 underline disabled:opacity-50"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
          <RefreshCw size={20} className="animate-spin" />
          Loading properties...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center">
          <Home size={32} className="mx-auto text-slate-300" />
          <p className="mt-3 font-semibold text-slate-700">
            Properties load nahi ho paayi.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Error ko fix karke Retry par click karein.
          </p>
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Home size={28} className="text-slate-400" />
          </div>

          <h3 className="text-lg font-bold text-slate-700">
            No properties yet
          </h3>

          <p className="mb-4 mt-1 text-sm text-slate-500">
            Add your first property to get started.
          </p>

          <Link
            href="/owner/re-properties/new"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Plus size={16} />
            Add Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => {
            const status = String(property.status || "draft").toLowerCase();
            const StatusIcon = STATUS_ICONS[status] || Clock;

            return (
              <div
                key={property._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="relative h-44 bg-slate-100">
                  {property.images?.[0]?.url ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title || "Property"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Home size={40} className="text-slate-300" />
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      STATUS_STYLES[status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <StatusIcon size={12} />
                    {getStatusLabel(status)}
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="font-bold leading-tight text-slate-800">
                      {property.title || "Untitled property"}
                    </h3>

                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={12} />
                      {property.city || "Location not set"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-lg font-bold text-emerald-700">
                      <IndianRupee size={16} />
                      {formatPrice(property.price)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                      {property.transactionType || "Not specified"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    {Number(property.bedrooms) > 0 && (
                      <span>{property.bedrooms} BHK</span>
                    )}

                    {Number(property.areaSqft) > 0 && (
                      <span>• {property.areaSqft} sqft</span>
                    )}

                    {property.propertyType && (
                      <span>• {property.propertyType}</span>
                    )}
                  </div>

                  {status === "rejected" && property.rejectionReason && (
                    <p className="rounded-lg bg-rose-50 p-2 text-xs text-rose-600">
                      Rejection reason: {property.rejectionReason}
                    </p>
                  )}

                  <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                    <Link
                      href={`/owner/re-properties/${property._id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Eye size={14} />
                      View
                    </Link>

                    {["draft", "pending", "rejected"].includes(status) && (
                      <>
                        <Link
                          href={`/owner/re-properties/${property._id}/edit`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(property._id)}
                          disabled={deleting !== null}
                          aria-label="Delete property"
                          title="Delete property"
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          {deleting === property._id ? (
                            <RefreshCw
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
