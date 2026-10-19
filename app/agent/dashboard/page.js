"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  CalendarCheck,
  Wallet,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { agentApiRequest } from "@/lib/agentApi";

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();
  let styles = "bg-gray-100 text-gray-700";

  if (["confirmed", "paid", "approved"].includes(normalized)) {
    styles = "bg-emerald-50 text-emerald-700 border border-emerald-200";
  } else if (["pending", "unpaid"].includes(normalized)) {
    styles = "bg-amber-50 text-amber-700 border border-amber-200";
  } else if (["cancelled", "rejected"].includes(normalized)) {
    styles = "bg-red-50 text-red-700 border border-red-200";
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize ${styles}`}
    >
      {status || "Pending"}
    </span>
  );
}

export default function AgentDashboardPage() {
  const router = useRouter();

  const [agent, setAgent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [commissionSummary, setCommissionSummary] = useState({
    totalCommission: 0,
    paidCommission: 0,
    pendingCommission: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("agentToken");
    if (!token) {
      router.replace("/agent/login");
      return;
    }

    setLoading(true);
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [profileRes, bookingRes, commissionRes] = await Promise.allSettled([
        agentApiRequest("agent/auth/me", { headers }),
        agentApiRequest("agent/bookings", { headers }),
        agentApiRequest("commissions/agent", { headers })
      ]);

      if (profileRes.status === "fulfilled") {
        setAgent(profileRes.value?.data?.agent || profileRes.value?.data || null);
      }

      if (bookingRes.status === "fulfilled") {
        const bData = bookingRes.value?.data;
        const list = Array.isArray(bData?.bookings)
          ? bData.bookings
          : Array.isArray(bData)
          ? bData
          : [];
        setBookings(list);
      }

      if (commissionRes.status === "fulfilled") {
        const commData =
          commissionRes.value?.data?.summary || commissionRes.value?.data;
        if (commData) {
          setCommissionSummary({
            totalCommission: Number(commData.totalCommission || 0),
            paidCommission: Number(commData.paidCommission || 0),
            pendingCommission: Number(commData.pendingCommission || 0),
          });
        }
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <div className="mx-auto max-w-[1350px] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#B96928]">
            Travel Agent Portal
          </p>
          <h1 className="mt-1 text-[25px] font-semibold tracking-[-0.04em] text-[#172033] sm:text-[30px]">
            Welcome, {agent?.name || "Agent"}.
          </h1>
          <p className="mt-1 text-[12px] leading-5 text-[#737987]">
            Book Jim Corbett stays for your clients and track your commissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 hover:text-[#B96928] disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            href="/agent/explore"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#B96928] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#99531F]"
          >
            <Compass size={16} />
            Explore & Book Resorts
          </Link>
        </div>
      </div>

      {/* Agent Account Status Card */}
      <section className="rounded-2xl border border-[#E4DED3] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#B96928]">
              <ShieldCheck size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-[#172033]">
                Agency: {agent?.businessName || agent?.name || "Partner Agency"}
              </p>
              <p className="text-xs text-[#737987]">
                Status:{" "}
                {agent?.accountStatus === "approved"
                  ? "Approved — You have full B2B booking access"
                  : "Awaiting Admin Approval (Bookings will unlock once verified)"}
              </p>
            </div>
          </div>
          <StatusBadge status={agent?.accountStatus} />
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#E4DED3] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <CalendarCheck size={20} className="text-[#B96928]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Bookings
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-[#172033]">{bookings.length}</p>
          <p className="mt-1 text-xs text-[#596170]">Client Bookings</p>
        </div>

        <div className="rounded-2xl border border-[#E4DED3] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <Wallet size={20} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Commission
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-emerald-700">
            {formatCurrency(commissionSummary.totalCommission)}
          </p>
          <p className="mt-1 text-xs text-[#596170]">Total Earned</p>
        </div>

        <div className="rounded-2xl border border-[#E4DED3] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <Clock size={20} className="text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pending Payout
            </span>
          </div>
          <p className="mt-4 text-3xl font-black text-amber-600">
            {formatCurrency(commissionSummary.pendingCommission)}
          </p>
          <p className="mt-1 text-xs text-[#596170]">Awaiting Admin Transfer</p>
        </div>

        <div className="rounded-2xl border border-[#E4DED3] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <Compass size={20} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Inventory
            </span>
          </div>
          <Link
            href="/agent/explore"
            className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#B96928] hover:underline"
          >
            Browse All Resorts <ArrowRight size={14} />
          </Link>
          <p className="mt-1 text-xs text-[#596170]">Special B2B Rates</p>
        </div>
      </div>

      {/* Recent Client Bookings */}
      <section className="overflow-hidden rounded-2xl border border-[#E4DED3] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAE5DC] p-4 sm:p-5">
          <div>
            <h2 className="text-sm font-bold text-[#172033]">Recent Client Bookings</h2>
            <p className="text-xs text-gray-500">
              Track client stays booked through your agent account.
            </p>
          </div>
          <Link
            href="/agent/bookings"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#B96928] hover:underline"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Aapne abhi tak koi client booking nahi ki hai.{" "}
            <Link
              href="/agent/explore"
              className="font-bold text-[#B96928] underline hover:text-[#99531F]"
            >
              Corbett resorts dekhein aur pehli booking karein!
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {bookings.slice(0, 5).map((b) => (
              <div
                key={b._id}
                className="flex flex-wrap items-center justify-between gap-3 p-4 transition hover:bg-gray-50/75 sm:px-6"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {b.guestName || b.name || b.customerName || "Guest"} &bull;{" "}
                    <span className="font-semibold text-slate-600">
                      {b.propertyName || "Resort Stay"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Ref: {b.bookingReference || b._id?.slice(-8)} &bull; Check-in:{" "}
                    {b.checkIn || b.date || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-gray-900">
                    {formatCurrency(b.totalAmount)}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}