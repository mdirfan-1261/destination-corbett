
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Plus,
  RefreshCw,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import StatusBadge from "@/components/agent/StatusBadge";

const API_ROOT = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_BASE = API_ROOT.endsWith("/api")
  ? API_ROOT
  : `${API_ROOT}/api`;

function getPropertiesFromResponse(result) {
  const data = result?.data;

  if (Array.isArray(data?.properties)) return data.properties;
  if (Array.isArray(result?.properties)) return result.properties;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;

  return [];
}

function getPropertyStatus(property) {
  return (
    property?.propertyStatus ||
    property?.status ||
    (property?.isApproved ? "approved" : "pending")
  );
}

function getPropertyLocation(property) {
  const location = property?.location;

  if (typeof location === "string" && location.trim()) {
    return location;
  }

  if (location && typeof location === "object") {
    const parts = [
      location.locality,
      location.city,
      location.state,
    ].filter(Boolean);

    if (parts.length) return parts.join(", ");
  }

  return [
    property?.address,
    property?.locality,
    property?.city,
  ]
    .filter(Boolean)
    .join(", ") || "Location not provided";
}

export default function PropertiesSection() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchOwnerProperties = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("destin_owner_token")
          : null;

      if (!token) {
        throw new Error("Owner login session nahi mila. Please login again.");
      }

      const response = await fetch(`${API_BASE}/owner/properties`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message || `Properties load nahi hui (${response.status}).`
        );
      }

      setProperties(getPropertiesFromResponse(result));
    } catch (err) {
      setError(err?.message || "Properties load karte waqt error aaya.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnerProperties();
  }, [fetchOwnerProperties]);

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-bold text-[#172033]">
            My Listed Properties
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your resorts, hotels and other stays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchOwnerProperties(true)}
            disabled={loading || refreshing}
            aria-label="Refresh properties"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
          </button>

          <Link
            href="/owner/properties/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#B96928] px-4 text-sm font-semibold text-white transition hover:bg-[#9f5720]"
          >
            <Plus size={17} />
            Add Property
          </Link>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {loading ? (
          <div className="space-y-3" aria-label="Loading properties">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-600"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-red-800">
                  Properties load nahi hui
                </p>
                <p className="mt-1 break-words text-sm text-red-700">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => fetchOwnerProperties()}
                  className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#B96928]">
              <Building2 size={27} />
            </div>

            <h3 className="mt-4 font-semibold text-[#172033]">
              No properties found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Aapki properties yahan tab dikhenगी jab backend se property
              record available hoga.
            </p>

            <Link
              href="/owner/properties/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#9f5720]"
            >
              <Plus size={17} />
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.slice(0, 5).map((property, index) => {
              const id = property?._id || property?.id;
              const name =
                property?.name ||
                property?.propertyName ||
                "Untitled Property";

              return (
                <div
                  key={id || `${name}-${index}`}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-orange-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                      <Building2 size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-[#172033]">
                        {name}
                      </h3>

                      <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-500">
                        <MapPin size={15} className="mt-0.5 shrink-0" />
                        <span>{getPropertyLocation(property)}</span>
                      </p>

                      <div className="mt-2">
                        <StatusBadge status={getPropertyStatus(property)} />
                      </div>
                    </div>
                  </div>

                  {id ? (
                    <Link
                      href={`/owner/properties/${id}`}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-[#172033] hover:border-[#B96928] hover:text-[#B96928]"
                    >
                      Manage
                      <ArrowRight size={15} />
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Property ID unavailable
                    </span>
                  )}
                </div>
              );
            })}

            {properties.length > 5 && (
              <div className="pt-2 text-center">
                <Link
                  href="/owner/properties"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#B96928] hover:underline"
                >
                  View all {properties.length} properties
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
