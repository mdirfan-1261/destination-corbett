"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Building,
  User,
  Phone,
  IndianRupee,
  Handshake,
  TrendingUp,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

function formatPrice(p) {
  const n = Number(p) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getOwnerToken() {
  if (typeof window === "undefined") return null;
  const t = localStorage.getItem("destin_owner_token");
  if (!t || t === "null" || t === "undefined") return null;
  return t.trim();
}

async function ownerFetch(path, options = {}) {
  const token = getOwnerToken();
  if (!token) throw new Error("Owner login nahi mila. Please dobara login karein.");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    },
  });
  let data = {};
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status}).`);
  return data;
}

export default function OwnerREDealsTrackingPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [actingDealId, setActingDealId] = useState(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await ownerFetch("/api/re/deals/owner/my");
      setDeals(data.deals || []);
    } catch (err) {
      setError(err.message || "Failed to load deals.");
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Financial summary
  const summary = useMemo(() => {
    const totalDeals = deals.length;
    const closed = deals.filter((d) => d.status === "closed").length;
    const inProgress = deals.filter((d) => d.status === "in_progress").length;

    const totalSales = deals
      .filter((d) => d.status !== "cancelled")
      .reduce((sum, d) => sum + (Number(d.dealPrice) || 0), 0);

    const netReceivable = deals
      .filter((d) => d.status !== "cancelled")
      .reduce((sum, d) => sum + (Number(d.ownerPayoutAmount) || 0), 0);

    return { totalDeals, closed, inProgress, totalSales, netReceivable };
  }, [deals]);

  // Handle Owner Approval / Rejection
  const handleOwnerDecision = async (dealId, decision) => {
    const msg =
      decision === "approved"
        ? "Confirm agreement to sell at this price and commission structure?"
        : "Are you sure you want to decline this deal?";
    if (!confirm(msg)) return;

    setActingDealId(dealId);
    setError("");
    setSuccessMsg("");
    try {
      await ownerFetch(`/api/re/deals/${dealId}/owner-approve`, {
        method: "PATCH",
        body: JSON.stringify({ decision }),
      });

      setSuccessMsg(
        decision === "approved"
          ? "Deal successfully approved by you! Admin will complete settlement."
          : "Deal declined."
      );
      setTimeout(() => setSuccessMsg(""), 5000);
      await fetchDeals();
    } catch (err) {
      setError(err.message || "Failed to submit decision.");
    } finally {
      setActingDealId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 overflow-hidden rounded-2xl bg-[#111c24] p-5 text-white sm:p-7">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Resort & Property Owner
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
              Transparent Settlements
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Property Deals & Settlements</h1>
          <p className="mt-2 text-sm text-slate-300">
            Review buyer offers, approve deals, and track your net property proceeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDeals}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <Link
            href="/owner/re-properties"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Building size={16} /> My Property Listings
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          <AlertCircle size={18} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Deals
          </p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{summary.totalDeals}</p>
          <p className="mt-1 text-xs text-slate-400">
            {summary.closed} closed • {summary.inProgress} active
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Sales Value
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {formatPrice(summary.totalSales)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Gross property value</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Net Owner Payout Expected
          </p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-700">
            {formatPrice(summary.netReceivable)}
          </p>
          <p className="mt-1 text-xs text-slate-400">After commission deductions</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Approval
          </p>
          <p className="mt-2 text-3xl font-extrabold text-amber-600">
            {deals.filter((d) => d.ownerApprovalStatus === "pending").length}
          </p>
          <p className="mt-1 text-xs text-slate-400">Awaiting your approval</p>
        </div>
      </div>

      {/* Deals List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <RefreshCw size={24} className="animate-spin text-emerald-600" />
          <p className="text-sm font-medium">Loading deals...</p>
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Handshake size={28} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">No Deals Yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            When an assigned agent secures a buyer for your property, the deal with clear payout
            numbers will appear here for your review and approval.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => {
            const prop = deal.propertyId || {};
            const agent = deal.listingAgentId;
            const ownerStatus = deal.ownerApprovalStatus || "pending";
            const isPendingApproval = ownerStatus === "pending";
            const busy = actingDealId === deal._id;

            return (
              <div
                key={deal._id}
                className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${
                  isPendingApproval ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200"
                }`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                      <Building size={20} />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{prop.title}</h3>
                      <p className="text-xs text-slate-500">
                        {prop.city || "Jim Corbett"} • Deal created {formatDate(deal.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        deal.status === "closed"
                          ? "bg-emerald-100 text-emerald-800"
                          : deal.status === "cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {deal.status?.replace(/_/g, " ")}
                    </span>

                    {ownerStatus === "approved" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 size={13} /> Approved by You
                      </span>
                    ) : ownerStatus === "rejected" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-800">
                        <XCircle size={13} /> Declined
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-900 animate-pulse">
                        <Clock size={13} /> Action Required: Review Offer
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-6">
                  {/* Buyer & Agent Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-2xl border border-slate-100 bg-[#F7F5F0] p-4">
                      <p className="font-bold uppercase tracking-wider text-slate-500">
                        Buyer Details
                      </p>
                      <p className="mt-1 text-base font-bold text-slate-800">
                        {deal.buyerName || "Registered Buyer"}
                      </p>
                      <p className="text-slate-400 mt-0.5">
                        Client verification managed by JimCollaborate platform
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-[#F7F5F0] p-4">
                      <p className="font-bold uppercase tracking-wider text-slate-500">
                        Listing Agent
                      </p>
                      <p className="mt-1 text-base font-bold text-slate-800">
                        {agent ? agent.name : "Direct Platform Listing"}
                      </p>
                      {agent?.phone && (
                        <p className="text-slate-600 mt-0.5">Phone: {agent.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Financial Settlement Breakdown */}
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-700" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                        Financial Settlement Statement
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-emerald-200/60 text-xs">
                      <div>
                        <p className="text-slate-500 font-medium">Agreed Property Price</p>
                        <p className="text-lg font-extrabold text-slate-900">
                          {formatPrice(deal.dealPrice)}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500 font-medium">
                          Agent Commission ({deal.listingAgentRate || deal.agentCommissionPct}%)
                        </p>
                        <p className="text-lg font-bold text-[#B96928]">
                          - {formatPrice(deal.listingAgentCommission)}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500 font-medium">
                          Platform Fee ({deal.platformRate || 0.5}%)
                        </p>
                        <p className="text-lg font-bold text-slate-700">
                          - {formatPrice(deal.platformCommission)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-emerald-100/80 p-2.5">
                        <p className="text-emerald-900 font-bold uppercase text-[10px] tracking-wider">
                          Your Net Payout
                        </p>
                        <p className="text-xl font-extrabold text-emerald-800">
                          {formatPrice(deal.ownerPayoutAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons for Pending Approval */}
                  {isPendingApproval && (
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-amber-50 p-4 border border-amber-200">
                      <div>
                        <p className="text-sm font-bold text-amber-900">
                          Owner Approval Needed
                        </p>
                        <p className="text-xs text-amber-700">
                          Do you approve selling at {formatPrice(deal.dealPrice)} with net proceeds of{" "}
                          <strong>{formatPrice(deal.ownerPayoutAmount)}</strong>?
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOwnerDecision(deal._id, "approved")}
                          disabled={busy}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow transition hover:bg-emerald-800 disabled:opacity-50"
                        >
                          <Check size={16} />
                          {busy ? "Processing..." : "Approve Deal"}
                        </button>
                        <button
                          onClick={() => handleOwnerDecision(deal._id, "rejected")}
                          disabled={busy}
                          className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          <X size={16} /> Decline
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
