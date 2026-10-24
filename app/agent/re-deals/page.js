"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  X,
  Handshake,
  IndianRupee,
  Building,
  User,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Wallet,
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

function getAgentToken() {
  if (typeof window === "undefined") return null;
  for (const key of ["agentToken", "destin_agent_token", "agent_token"]) {
    const t = localStorage.getItem(key);
    if (t && t !== "null" && t !== "undefined") return t.trim();
  }
  return null;
}

async function agentFetch(path, options = {}) {
  const token = getAgentToken();
  if (!token) throw new Error("Agent login nahi mila. Please dobara login karein.");
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

const EMPTY_DEAL_FORM = {
  propertyId: "",
  leadId: "",
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  dealPrice: "",
  agentCommissionPct: "2",
  notes: "",
};

function AgentREDealsContent() {
  const searchParams = useSearchParams();

  const [tab, setTab] = useState("deals"); // "deals" | "payouts"
  const [deals, setDeals] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [activeProperties, setActiveProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_DEAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill from query params if navigating from leads page
  useEffect(() => {
    const propId = searchParams.get("propertyId");
    const leadId = searchParams.get("leadId");
    const buyerName = searchParams.get("buyerName");
    const buyerPhone = searchParams.get("buyerPhone");
    const buyerEmail = searchParams.get("buyerEmail");
    const price = searchParams.get("price");

    if (propId || leadId || buyerName) {
      setForm((prev) => ({
        ...prev,
        propertyId: propId || prev.propertyId,
        leadId: leadId || prev.leadId,
        buyerName: buyerName || prev.buyerName,
        buyerPhone: buyerPhone || prev.buyerPhone,
        buyerEmail: buyerEmail || prev.buyerEmail,
        dealPrice: price || prev.dealPrice,
      }));
      setModalOpen(true);
    }
  }, [searchParams]);

  const fetchDealsAndPayouts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsRes, payoutsRes, propsRes, leadsRes] = await Promise.all([
        agentFetch("/api/re/deals/agent/my").catch(() => ({ deals: [] })),
        agentFetch("/api/re/deals/agent/payouts").catch(() => ({ payouts: [] })),
        agentFetch("/api/re/properties/agent/my").catch(() => ({ properties: [] })),
        agentFetch("/api/re/leads/agent/my").catch(() => ({ leads: [] })),
      ]);

      setDeals(dealsRes.deals || []);
      setPayouts(payoutsRes.payouts || []);
      setActiveProperties(propsRes.properties || []);
      setLeads(leadsRes.leads || []);
    } catch (err) {
      setError(err.message || "Failed to load deals data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDealsAndPayouts();
  }, [fetchDealsAndPayouts]);

  // Live Commission Calculations
  const calculatedBreakdown = useMemo(() => {
    const price = Number(form.dealPrice) || 0;
    const rate = Number(form.agentCommissionPct) || 2;
    const platRate = 0.5;

    const agentComm = (price * rate) / 100;
    const platComm = (price * platRate) / 100;
    const ownerNet = Math.max(0, price - agentComm - platComm);

    return {
      price,
      rate,
      agentComm,
      platComm,
      ownerNet,
    };
  }, [form.dealPrice, form.agentCommissionPct]);

  // Summary Metrics
  const stats = useMemo(() => {
    const totalDeals = deals.length;
    const inProgress = deals.filter((d) => d.status === "in_progress").length;
    const closed = deals.filter((d) => d.status === "closed").length;

    const pendingEarnings = deals
      .filter((d) => d.commissionStatus !== "paid")
      .reduce((sum, d) => sum + (Number(d.listingAgentCommission) || 0), 0);

    const paidEarnings = payouts
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return { totalDeals, inProgress, closed, pendingEarnings, paidEarnings };
  }, [deals, payouts]);

  const handleCreateDealSubmit = async (e) => {
    e.preventDefault();
    if (!form.propertyId) return alert("Please select a property.");
    if (!form.dealPrice || Number(form.dealPrice) <= 0) {
      return alert("Please enter a valid agreed price.");
    }

    setSubmitting(true);
    setError("");
    try {
      await agentFetch("/api/re/deals", {
        method: "POST",
        body: JSON.stringify({
          propertyId: form.propertyId,
          leadId: form.leadId || undefined,
          buyerName: form.buyerName,
          buyerPhone: form.buyerPhone,
          buyerEmail: form.buyerEmail,
          agreedPrice: Number(form.dealPrice),
          agentCommissionPct: Number(form.agentCommissionPct) || 2,
          notes: form.notes,
        }),
      });

      setSuccessMsg("Deal successfully initiated! It is now pending admin review & owner approval.");
      setTimeout(() => setSuccessMsg(""), 5000);
      setModalOpen(false);
      setForm(EMPTY_DEAL_FORM);
      await fetchDealsAndPayouts();
    } catch (err) {
      setError(err.message || "Failed to create deal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 overflow-hidden rounded-2xl bg-[#172033] p-5 text-white sm:p-7">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D8A36B]">
              Real Estate Partner
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
              Commission Ledger Active
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Property Deals & Earnings</h1>
          <p className="mt-2 text-sm text-slate-300">
            Create buyer deals, track frozen commissions, and review payout status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDealsAndPayouts}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a0571e]"
          >
            <Plus size={16} /> Create New Deal
          </button>
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
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.totalDeals}</p>
          <p className="mt-1 text-xs text-slate-400">
            {stats.inProgress} in progress • {stats.closed} closed
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            In Progress Deals
          </p>
          <p className="mt-2 text-3xl font-extrabold text-amber-600">{stats.inProgress}</p>
          <p className="mt-1 text-xs text-slate-400">Active negotiations</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Commission
          </p>
          <p className="mt-2 text-3xl font-extrabold text-[#B96928]">
            {formatPrice(stats.pendingEarnings)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Awaiting closing & payout</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Paid Commission
          </p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-700">
            {formatPrice(stats.paidEarnings)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Received via bank transfer</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setTab("deals")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            tab === "deals"
              ? "bg-[#172033] text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Handshake size={16} /> Deals List ({deals.length})
        </button>

        <button
          onClick={() => setTab("payouts")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            tab === "payouts"
              ? "bg-[#172033] text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Wallet size={16} /> Commission Payouts ({payouts.length})
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <RefreshCw size={24} className="animate-spin text-[#B96928]" />
          <p className="text-sm font-medium">Loading deals...</p>
        </div>
      ) : null}

      {/* TAB 1: DEALS TABLE */}
      {!loading && tab === "deals" && (
        <div className="space-y-4">
          {deals.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Handshake size={28} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">No Deals Created Yet</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                When you negotiate an agreed price with a buyer, click "Create New Deal" to submit
                it for admin commission freezing and owner approval.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#B96928] px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#a0571e]"
              >
                <Plus size={16} /> Create First Deal
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Property</th>
                      <th className="px-5 py-4">Buyer</th>
                      <th className="px-5 py-4">Agreed Deal Price</th>
                      <th className="px-5 py-4">Your Commission</th>
                      <th className="px-5 py-4">Commission Status</th>
                      <th className="px-5 py-4">Owner Approval</th>
                      <th className="px-5 py-4">Deal Status</th>
                      <th className="px-5 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deals.map((deal) => {
                      const commStatus = deal.commissionStatus || "requested";
                      const ownerStatus = deal.ownerApprovalStatus || "pending";

                      return (
                        <tr key={deal._id} className="hover:bg-slate-50/80 transition">
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-900">
                              {deal.propertyId?.title || "Property"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {deal.propertyId?.city || "Jim Corbett"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-800">
                              {deal.buyerName || "—"}
                            </p>
                            {deal.buyerPhone && (
                              <p className="text-xs text-slate-500">{deal.buyerPhone}</p>
                            )}
                          </td>

                          <td className="px-5 py-4 font-bold text-slate-900">
                            {formatPrice(deal.dealPrice || deal.agreedPrice)}
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-bold text-[#B96928]">
                              {formatPrice(deal.listingAgentCommission)}
                            </p>
                            <p className="text-xs text-slate-500">
                              {deal.listingAgentRate || deal.agentCommissionPct}% rate
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            {commStatus === "paid" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                <CheckCircle2 size={12} /> Paid
                              </span>
                            ) : commStatus === "frozen" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                                <ShieldCheck size={12} /> Rate Frozen
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                                <Clock size={12} /> Requested
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {ownerStatus === "approved" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                                <CheckCircle2 size={12} /> Approved
                              </span>
                            ) : ownerStatus === "rejected" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                                <XCircle size={12} /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                                <Clock size={12} /> Pending
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                                deal.status === "closed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : deal.status === "cancelled"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {deal.status?.replace(/_/g, " ")}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-500">
                            {formatDate(deal.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYOUTS TABLE */}
      {!loading && tab === "payouts" && (
        <div className="space-y-4">
          {payouts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Wallet size={28} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">No Payout Entries Yet</h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                When deals are created, commission ledger entries are automatically allocated to
                your account. Once admin marks payment, reference details will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Deal / Property</th>
                      <th className="px-5 py-4">Payout Amount</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Paid Date</th>
                      <th className="px-5 py-4">Payment Method / Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payouts.map((p) => {
                      const deal = p.dealId || {};
                      const isPaid = p.status === "paid";
                      return (
                        <tr key={p._id} className="hover:bg-slate-50/80 transition">
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-800">
                              {deal.propertyId?.title || "Real Estate Deal"}
                            </p>
                            <p className="text-xs text-slate-500">
                              Deal Total: {formatPrice(deal.dealPrice)}
                            </p>
                          </td>
                          <td className="px-5 py-4 font-extrabold text-base text-emerald-700">
                            {formatPrice(p.amount)}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                isPaid
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                              {isPaid ? "Paid" : "Pending Payout"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-500">
                            {formatDate(p.paidAt)}
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-600">
                            {p.transactionRef ? (
                              <span>
                                {p.paymentMethod || "Bank"} • Ref:{" "}
                                <strong className="text-slate-900">{p.transactionRef}</strong>
                              </span>
                            ) : (
                              <span className="text-slate-400">Scheduled on deal closing</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE DEAL MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#B96928]">
                  Deal Creation
                </p>
                <h3 className="text-xl font-bold text-slate-900">Initiate Property Deal</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDealSubmit} className="mt-5 space-y-4">
              {/* Select Property */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Represented Property *
                </label>
                <select
                  required
                  value={form.propertyId}
                  onChange={(e) => {
                    const selected = activeProperties.find((p) => p._id === e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      propertyId: e.target.value,
                      dealPrice: selected?.price ? String(selected.price) : prev.dealPrice,
                      agentCommissionPct: selected?.ownerCommissionOffer
                        ? String(selected.ownerCommissionOffer)
                        : prev.agentCommissionPct,
                    }));
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium focus:border-[#B96928] focus:outline-none focus:ring-1 focus:ring-[#B96928]"
                >
                  <option value="">-- Choose from your active properties --</option>
                  {activeProperties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.city}) — {formatPrice(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select from Lead (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Associated Buyer Lead (Optional)
                </label>
                <select
                  value={form.leadId}
                  onChange={(e) => {
                    const lead = leads.find((l) => l._id === e.target.value);
                    if (lead) {
                      setForm((prev) => ({
                        ...prev,
                        leadId: lead._id,
                        buyerName: lead.buyerName || prev.buyerName,
                        buyerPhone: lead.buyerPhone || prev.buyerPhone,
                        buyerEmail: lead.buyerEmail || prev.buyerEmail,
                        propertyId: lead.propertyId?._id || prev.propertyId,
                        dealPrice: lead.propertyId?.price
                          ? String(lead.propertyId.price)
                          : prev.dealPrice,
                      }));
                    } else {
                      setForm((prev) => ({ ...prev, leadId: "" }));
                    }
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-[#B96928] focus:outline-none focus:ring-1 focus:ring-[#B96928]"
                >
                  <option value="">-- Select buyer lead or enter details below --</option>
                  {leads.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.buyerName} ({l.buyerPhone}) — {l.propertyId?.title || "Lead"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buyer Info Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Buyer Name
                  </label>
                  <input
                    type="text"
                    value={form.buyerName}
                    onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#B96928] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Buyer Phone
                  </label>
                  <input
                    type="tel"
                    value={form.buyerPhone}
                    onChange={(e) => setForm({ ...form, buyerPhone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#B96928] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Buyer Email
                  </label>
                  <input
                    type="email"
                    value={form.buyerEmail}
                    onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#B96928] focus:outline-none"
                  />
                </div>
              </div>

              {/* Financials: Agreed Price & Commission % */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Agreed Property Price (₹) *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.dealPrice}
                    onChange={(e) => setForm({ ...form, dealPrice: e.target.value })}
                    placeholder="e.g. 5000000"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-bold text-slate-900 focus:border-[#B96928] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Requested Commission Rate (%) *
                  </label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={form.agentCommissionPct}
                    onChange={(e) => setForm({ ...form, agentCommissionPct: e.target.value })}
                    placeholder="e.g. 2 or 2.5"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-bold text-[#B96928] focus:border-[#B96928] focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Transparent Commission Breakdown Card */}
              {calculatedBreakdown.price > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-900">
                    <TrendingUp size={14} />
                    Commission & Payout Breakdown
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-200/60">
                    <div>
                      <p className="text-slate-500">Agreed Property Price</p>
                      <p className="font-extrabold text-sm text-slate-900">
                        {formatPrice(calculatedBreakdown.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">
                        Your Commission ({calculatedBreakdown.rate}%)
                      </p>
                      <p className="font-extrabold text-sm text-[#B96928]">
                        {formatPrice(calculatedBreakdown.agentComm)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Platform Fee (0.5%)</p>
                      <p className="font-bold text-slate-700">
                        {formatPrice(calculatedBreakdown.platComm)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Owner Net Payout</p>
                      <p className="font-bold text-emerald-800">
                        {formatPrice(calculatedBreakdown.ownerNet)}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-800 italic">
                    Note: Admin will review & freeze the final commission rate. Owner will approve
                    before final closing.
                  </p>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Deal Notes / Terms
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Buyer agreed on 10% token deposit within 7 days."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-[#B96928] focus:outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-[#172033] px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-slate-800 disabled:opacity-50"
                >
                  <Handshake size={16} className="text-[#D8A36B]" />
                  {submitting ? "Initiating Deal..." : "Submit Deal for Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgentREDealsHubPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
          Loading agent deals...
        </div>
      }
    >
      <AgentREDealsContent />
    </Suspense>
  );
}
