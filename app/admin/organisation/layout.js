"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

// Helper function to safely detect Super Admin across all formats
function verifyIsSuperAdmin(user, rawRole) {
  if (!user && !rawRole) return false;

  // 1. Direct boolean flag check
  if (user?.isSuperAdmin === true || user?.is_super_admin === true) {
    return true;
  }

  // 2. Primary super admin email check (failsafe)
  if (
    user?.email &&
    String(user.email).toLowerCase().trim() === "admin@destinationcorbett.com"
  ) {
    return true;
  }

  // 3. Extract all possible role fields
  const candidates = [
    typeof user?.role === "string" ? user.role : null,
    user?.role?.slug,
    user?.role?.name,
    user?.roleName,
    user?.role_name,
    user?.roleTitle,
    rawRole,
  ].filter(Boolean);

  for (const candidate of candidates) {
    // Normalize string: removes spaces, underscores, dashes and makes lowercase
    // "Super Admin" -> "superadmin"
    // "super_admin" -> "superadmin"
    const normalized = String(candidate)
      .toLowerCase()
      .replace(/[\s_-]+/g, "");

    if (normalized === "superadmin" || normalized.includes("superadmin")) {
      return true;
    }
  }

  return false;
}

export default function OrganisationLayout({ children }) {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkRole() {
      try {
        // 1. Check from multiple localStorage keys
        const userStr =
          localStorage.getItem("adminUser") ||
          localStorage.getItem("user") ||
          localStorage.getItem("admin") ||
          localStorage.getItem("adminProfile");

        const user = userStr ? JSON.parse(userStr) : null;
        const rawRole =
          localStorage.getItem("adminRole") || localStorage.getItem("role");

        // First fast-check from localStorage
        if (verifyIsSuperAdmin(user, rawRole)) {
          setIsSuperAdmin(true);
          setChecking(false);
          return;
        }

        // 2. Fallback: Verify with backend profile using adminToken
        const token =
          localStorage.getItem("adminToken") ||
          localStorage.getItem("token");

        if (token) {
          const res = await fetch(`${API_URL}/api/admin/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }).then((r) => r.json()).catch(() => null);

          const liveAdmin =
            res?.admin || res?.data || res?.user || res?.profile || res;

          if (verifyIsSuperAdmin(liveAdmin, liveAdmin?.role)) {
            setIsSuperAdmin(true);
            setChecking(false);
            return;
          }
        }

        setIsSuperAdmin(false);
      } catch (err) {
        console.error("Super Admin verification error:", err);
        setIsSuperAdmin(false);
      } finally {
        setChecking(false);
      }
    }

    checkRole();
  }, []);

  // Jab tak check ho raha hai
  if (checking) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#B96928]/20 border-t-[#B96928]" />
      </div>
    );
  }

  // AGAR SUPER ADMIN NAHI HAI — TO YE RESTRICTION SCREEN DIKHEGI
  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center p-6 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 shadow-sm border border-amber-200">
          <Lock size={36} />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow">
            <ShieldAlert size={14} />
          </span>
        </div>

        <span className="mt-5 rounded-full bg-red-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-red-700">
          Access Restricted
        </span>

        <h2 className="mt-2 text-2xl font-black text-gray-900">
          Super Admin Access Required
        </h2>

        <p className="mt-2 max-w-md text-xs leading-relaxed text-gray-500 sm:text-sm">
          You do not have permission to view or manage the Organisation Department. 
          Only the <strong>Super Administrator</strong> can access company profile, 
          department settings, booking policies, and team members.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#A65C23]"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // AGAR SUPER ADMIN HAI TO NORMAL ORGANISATION PAGES OPEN HONGE
  return <>{children}</>;
}