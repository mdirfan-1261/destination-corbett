
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Home,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { ownerApiRequest } from "@/lib/ownerApi";
import PropertiesSection from "@/components/owner/PropertiesSection";

function getPayload(result) {
  return result?.data ?? result ?? {};
}

function getList(result, keys) {
  const payload = getPayload(result);

  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  }

  return [];
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  let styles = "bg-[#F0EEE9] text-[#626875]";
  let label = status || "Status unavailable";

  if (
    ["approved", "active", "published", "confirmed", "completed"].includes(
      normalized
    )
  ) {
    styles = "bg-[#E8F2E8] text-[#32623B]";
  } else if (
    ["pending", "pending_review", "draft"].includes(normalized)
  ) {
    styles = "bg-[#FFF2DF] text-[#96601F]";
  } else if (
    ["rejected", "suspended", "cancelled"].includes(normalized)
  ) {
    styles = "bg-[#FCEAEA] text-[#A33D3D]";
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

export default function OwnerDashboardPage() {
  const router = useRouter();

  const [owner, setOwner] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadDashboard = useCallback(
    async (isRefresh = false) => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("destin_owner_token");

      if (!token) {
        router.replace("/owner/login");
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMsg("");

      try {
        const results = await Promise.allSettled([
          ownerApiRequest("owner/auth/me"),
          ownerApiRequest("owner/properties"),
          ownerApiRequest("owner/bookings"),
        ]);

        const [profileResult, propertyResult, bookingResult] = results;
        const failedSections = [];

        if (profileResult.status === "fulfilled") {
          const payload = getPayload(profileResult.value);
          const profile =
            payload?.owner ||
            payload?.data?.owner ||
            payload?.user ||
            payload?.data?.user ||
            null;

          if (profile) {
            setOwner(profile);
          } else {
            failedSections.push("owner profile");
          }
        } else {
          failedSections.push("owner profile");
        }

        if (propertyResult.status === "fulfilled") {
          setProperties(
            getList(propertyResult.value, ["properties", "items"])
          );
        } else {
          failedSections.push("properties");
        }

        if (bookingResult.status === "fulfilled") {
          setBookings(
            getList(bookingResult.value, ["bookings", "items"])
          );
        } else {
          failedSections.push("bookings");
        }

        if (failedSections.length > 0) {
          setErrorMsg(
            `Could not load ${failedSections.join(
              ", "
            )}. Please check the backend API and refresh.`
          );
        }
      } catch (error) {
        setErrorMsg(
          error?.message || "Failed to load owner dashboard data."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [router]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const confirmedBookings = bookings.filter((booking) =>
    ["confirmed", "completed"].includes(
      String(booking?.status || "").toLowerCase()
    )
  ).length;

  const accountStatus = owner?.accountStatus;

  return (
    <div className="mx-auto max-w-[1350px]">
      {/* Dashboard header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-700">
            Resort Partner Extranet
          </p>

          <h1 className="mt-2 text-[25px] font-semibold tracking-[-0.04em] text-[#172033] sm:text-[30px]">
            Welcome, {owner?.name || "Resort Owner"}.
          </h1>

          <p className="mt-2 text-[12px] leading-5 text-[#737987]">
            Manage your property, room inventory, and guest bookings.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing || loading}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#DCD5C9] bg-white px-3.5 text-[12px] font-semibold text-[#596170] hover:text-emerald-700 disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <Link
            href="/owner/properties/new"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-[12px] font-semibold text-white transition hover:bg-emerald-800"
          >
            <Plus size={16} />
            Add Property
          </Link>
        </div>
      </div>

      {/* API error */}
      {errorMsg && (
        <div
          role="alert"
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p>{errorMsg}</p>

          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="font-semibold underline disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      {/* Owner account status */}
      <section className="mt-6 rounded-lg border border-[#E4DED3] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <ShieldCheck size={20} />
            </span>

            <div>
              <p className="text-[12px] font-bold text-[#172033]">
                Owner Account Status
              </p>

              <p className="mt-1 text-[11px] text-[#737987]">
                {!accountStatus
                  ? "Account status is not available."
                  : String(accountStatus).toLowerCase() === "approved"
                    ? "Your account is verified."
                    : "Your account approval status is shown here."}
              </p>
            </div>
          </div>

          <StatusBadge status={accountStatus} />
        </div>
      </section>

      {/* Dashboard statistics */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-[#E4DED3] bg-white p-5">
          <div className="flex items-center justify-between text-[#8B9099]">
            <Building2 size={20} className="text-emerald-700" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Properties
            </span>
          </div>

          <p className="mt-4 text-3xl font-semibold text-[#172033]">
            {loading ? "—" : properties.length}
          </p>

          <p className="mt-1 text-xs text-[#596170]">
            Your listed properties
          </p>
        </div>

        <div className="rounded-lg border border-[#E4DED3] bg-white p-5">
          <div className="flex items-center justify-between text-[#8B9099]">
            <CalendarDays size={20} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Bookings
            </span>
          </div>

          <p className="mt-4 text-3xl font-semibold text-[#172033]">
            {loading ? "—" : bookings.length}
          </p>

          <p className="mt-1 text-xs text-[#596170]">
            Guest bookings returned by the API
          </p>
        </div>

        <div className="rounded-lg border border-[#E4DED3] bg-white p-5">
          <div className="flex items-center justify-between text-[#8B9099]">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Confirmed
            </span>
          </div>

          <p className="mt-4 text-3xl font-semibold text-[#172033]">
            {loading ? "—" : confirmedBookings}
          </p>

          <p className="mt-1 text-xs text-[#596170]">
            Confirmed or completed bookings
          </p>
        </div>

        <div className="rounded-lg border border-[#E4DED3] bg-white p-5">
          <div className="flex items-center justify-between text-[#8B9099]">
            <Home size={20} className="text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Availability
            </span>
          </div>

          <Link
            href="/owner/calendar"
            className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline"
          >
            Manage Calendar Rates →
          </Link>

          <p className="mt-1 text-xs text-[#596170]">
            Manage room availability and rates
          </p>
        </div>
      </div>

      {/* Connected PropertiesSection component */}
      <div className="mt-6">
        <PropertiesSection />
      </div>
    </div>
  );
}
