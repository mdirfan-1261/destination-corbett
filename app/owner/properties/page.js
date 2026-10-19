
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  MapPin,
  ArrowRight,
  BedDouble,
  CalendarDays,
  CircleAlert,
} from "lucide-react";
import { ownerApiRequest } from "@/lib/ownerApi";

const ORANGE = "#B96928";

function getList(result) {
  const data = result?.data?.data ?? result?.data ?? result;
  if (Array.isArray(data)) return data;
  return data?.properties || data?.items || data?.results || [];
}


function getLocationText(property) {
  const location = property?.location;

  // Location object: { latitude, longitude }
  if (location && typeof location === "object") {
    const parts = [
      property?.city,
      property?.state,
      property?.address,
    ].filter((value) => typeof value === "string" && value.trim());

    if (parts.length) {
      return parts.join(", ");
    }

    const latitude = location.latitude;
    const longitude = location.longitude;

    if (latitude != null && longitude != null) {
      return `${latitude}, ${longitude}`;
    }

    return "Location not provided";
  }

  // Location string or fallback fields
  const value = location || property?.city || property?.address;

  return typeof value === "string" && value.trim()
    ? value
    : "Location not provided";
}


function Status({ value }) {
  const status = String(value || "pending").toLowerCase();
  const approved = ["approved", "active", "published"].includes(status);
  const rejected = ["rejected", "inactive", "suspended"].includes(status);

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
      approved ? "bg-green-50 text-green-700" :
      rejected ? "bg-red-50 text-red-700" :
      "bg-amber-50 text-amber-700"
    }`}>
      {status.replace(/[_-]/g, " ")}
    </span>
  );
}

export default function OwnerPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadProperties = useCallback(async (refresh = false) => {
    const token = localStorage.getItem("destin_owner_token");

    if (!token) {
      router.replace("/owner/login");
      return;
    }

    refresh ? setRefreshing(true) : setLoading(true);
    setError("");

    try {
      const result = await ownerApiRequest("owner/properties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(getList(result));
    } catch (err) {
      if ([401, 403].includes(Number(err?.status))) {
        localStorage.removeItem("destin_owner_token");
        localStorage.removeItem("destin_owner_user");
        router.replace("/owner/login");
        return;
      }
      setError(err?.message || "Unable to load properties.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const filtered = properties.filter((property) => {
    const name = property.name || property.propertyName || property.title || "";
    const location = getLocationText(property);
    const status = String(property.status || property.publicationStatus || "pending").toLowerCase();

    return `${name} ${location}`.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || status === filter);
  });

  return (
    <main className="min-h-screen bg-[#F7F5F0] p-4 text-[#172033] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B96928]">
              Partner Workspace
            </p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">My Properties</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your registered properties, rooms and availability.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadProperties(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <Link
              href="/owner/properties/new"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: ORANGE }}
            >
              <Plus size={17} /> Add Property
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <Building2 className="text-[#B96928]" size={22} />
            <p className="mt-3 text-sm text-gray-500">Total properties</p>
            <p className="mt-1 text-3xl font-black">
              {loading ? "—" : properties.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <CalendarDays className="text-[#B96928]" size={22} />
            <p className="mt-3 text-sm text-gray-500">Pending review</p>
            <p className="mt-1 text-3xl font-black">
              {loading ? "—" : properties.filter((p) =>
                ["pending", "pending_review", "draft"].includes(
                  String(p.status || p.publicationStatus || "").toLowerCase()
                )
              ).length}
            </p>
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="relative w-full sm:max-w-sm">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search property or location..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#B96928]"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#B96928]"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {error && (
            <div role="alert" className="m-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <CircleAlert size={18} /> {error}
              <button onClick={() => loadProperties()} className="ml-auto font-bold underline">
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : !error && filtered.length === 0 ? (
            <div className="p-10 text-center">
              <Building2 size={34} className="mx-auto text-gray-400" />
              <h2 className="mt-3 font-bold">No properties found</h2>
              <p className="mt-1 text-sm text-gray-500">
                Add a property or change your search filters.
              </p>
              <Link href="/owner/properties/new" className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
                <Plus size={16} /> Add Property
              </Link>
            </div>
          ) : !error ? (
            <div className="divide-y divide-gray-100">
              {filtered.map((property, index) => {
                const id = property._id || property.id || property.propertyId;
                const name = property.name || property.propertyName || property.title || "Untitled Property";
                const location = getLocationText(property);
                const status = property.status || property.publicationStatus || "pending";

                return (
                  <article key={id || index} className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#B96928]">
                          <Building2 size={23} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="break-words font-extrabold">{name}</h3>
                          <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-500">
                            <MapPin size={15} className="mt-0.5 shrink-0" />
                            {location}
                          </p>
                          <div className="mt-3"><Status value={status} /></div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {id && (
                          <>
                            <Link href={`/owner/properties/${id}`} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold hover:border-[#B96928]">
                              Manage
                            </Link>
                            <Link href={`/owner/properties/${id}/rooms`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold hover:border-[#B96928]">
                              <BedDouble size={15} /> Rooms
                            </Link>
                            <Link href={`/owner/properties/${id}/availability`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
                              Availability <ArrowRight size={15} />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
