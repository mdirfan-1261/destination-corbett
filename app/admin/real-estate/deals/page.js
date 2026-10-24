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
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  IndianRupee,
  Wallet,
  TrendingUp,
  Percent,
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

function getAdminToken() {
  if (typeof window === "undefined") return null;
  const t = localStorage.getItem("adminToken");
  if (t && t !== "null" && t !== "undefined") return t.trim();
  return null;
}

async function adminFetch(path, options = {}) {
  const token = getAdminToken();
  if (!token) throw new Error("Admin session not found. Please log in.");
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
  listingAgentId: "",
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  dealPrice: "",
  listingAgentRate: "2",
  platformRate: "0.5",
  notes: "",
};

function AdminREDealsContent() {
  const searchParams = useSearchParams();

  const [deals, setDeals] = useState([]);
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Create Deal Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_DEAL_FORM);
  const [submittingDeal, setSubmittingDeal] = useState(false);

  // Freeze Commission Modal
  const [freezeModalDeal, setFreezeModalDeal] = useState(null);
  const [freezeRate, setFreezeRate] = useState("2");
  const [freezing, setFreezing] = useState(false);

  // Pay Commission Modal
  const [payModalDeal, setPayModalDeal] = useState(null);
  const [payForm, setPayForm] = useState({ paymentMethod: "NEFT / Bank Transfer", transactionRef: "" });
  const [paying, setPaying] = useState(false);

  // Closing deal
  const [actionInProgress, setActionInProgress] = useState(null);

  // Pre-fill modal from query params if redirected from leads
  useEffect(() => {
    const propId = searchParams.get("propertyId");
    const leadId = searchParams.get("leadId");
    const agId = searchParams.get("agentId");
    const price = searchParams.get("price");

    if (propId || leadId) {
      setForm((prev) => ({
        ...prev,
        propertyId: propId || prev.propertyId,
        leadId: leadId || prev.leadId,
        listingAgentId: agId || prev.listingAgentId,
        dealPrice: price || prev.dealPrice,
      }));
      setCreateModalOpen(true);
    }
  }, [searchParams]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dealsRes, propsRes, agentsRes, leadsRes] = await Promise.all([
        adminFetch("/api/re/deals/admin"),
        adminFetch("/api/re/properties/admin").catch(() => ({ properties: [] })),
        adminFetch("/api/agent/admin/agents").catch(() => ({ agents: [] })),
        adminFetch("/api/re/leads/admin").catch(() => ({ leads: [] })),
      ]);

      setDeals(dealsRes.deals || []);
      setProperties(propsRes.properties || []);
      setAgents(agentsRes.agents || agentsRes.data || []);
      setLeads(leadsRes.leads || []);
    } catch (err) {
      setError(err.message || "Failed to load deals data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Financial KPI Metrics
  const stats = useMemo(() => {
    const totalDeals = deals.length;
    const closedDeals = deals.filter((d) => d.status === "closed").length;
    const inProgressDeals = deals.filter((d) => d.status === "in_progress").length;

    const totalSalesVolume = deals
      .filter((d) => d.status !== "cancelled")
      .reduce((sum, d) => sum + (Number(d.dealPrice) || 0), 0);

    const totalAgentCommission = deals
      .filter((d) => d.status !== "cancelled")
      .reduce((sum, d) => sum + (Number(d.listingAgentCommission) || 0), 0);

    const totalPlatformRevenue = deals
      .filter((d) => d.status !== "cancelled")
      .reduce((sum, d) => sum + (Number(d.platformCommission) || 0), 0);

    return {
      totalDeals,
      closedDeals,
      inProgressDeals,
      totalSalesVolume,
      totalAgentCommission,
      totalPlatformRevenue,
    };
  }, [deals]);

  // Live breakdown calculation for create deal modal
  const liveCalculation = useMemo(() => {
    const price = Number(form.dealPrice) || 0;
    const agentRate = Number(form.listingAgentRate) || 2;
    const platRate = Number(form.platformRate) || 0.5;

    const agentComm = (price * agentRate) / 100;
    const platComm = (price * platRate) / 100;
    const ownerNet = Math.max(0, price - agentComm - platComm);

    return { price, agentRate, platRate, agentComm, platComm, ownerNet };
  }, [form.dealPrice, form.listingAgentRate, form.platformRate]);

  // Handle Create Deal
  const handleCreateDealSubmit = async (e) => {
    e.preventDefault();
    if (!form.propertyId || !form.dealPrice) {
      return alert("Please select a property and set deal price.");
    }

    setSubmittingDeal(true);
    setError("");
    try {
      await adminFetch("/api/re/deals", {
        method: "POST",
        body: JSON.stringify({
          propertyId: form.propertyId,
          leadId: form.leadId || undefined,
          listingAgentId: form.listingAgentId || undefined,
          buyerName: form.buyerName,
          buyerPhone: form.buyerPhone,
          buyerEmail: form.buyerEmail,
          dealPrice: Number(form.dealPrice),
          agreedPrice: Number(form.dealPrice),
          listingAgentRate: Number(form.listingAgentRate) || 2,
          agentCommissionPct: Number(form.listingAgentRate) || 2,
          platformRate: Number(form.platformRate) || 0.5,
          notes: form.notes,
        }),
      });

      setSuccessMsg("Deal successfully created!");
      setTimeout(() => setSuccessMsg(""), 5000);
      setCreateModalOpen(false);
      setForm(EMPTY_DEAL_FORM);
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to create deal.");
    } finally {
      setSubmittingDeal(false);
    }
  };

  // Handle Freeze Commission
  const handleFreezeCommissionSubmit = async (e) => {
    e.preventDefault();
    if (!freezeModalDeal) return;
    setFreezing(true);
    try {
      await adminFetch(`/api/re/deals/${freezeModalDeal._id}/commission`, {
        method: "PATCH",
        body: JSON.stringify({
          listingAgentRate: Number(freezeRate),
          agentCommissionPct: Number(freezeRate),
        }),
      });

      setSuccessMsg(`Commission frozen at ${freezeRate}%.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      setFreezeModalDeal(null);
      await fetchAll();
    } catch (err) {
      alert(err.message || "Failed to freeze commission.");
    } finally {
      setFreezing(false);
    }
  };

  // Handle Close Deal
  const handleCloseDeal = async (dealId) => {
    if (!confirm("Are you sure you want to close this deal? This marks the property as sold/rented.")) {
      return;
    }
    setActionInProgress(dealId);
    try {
      await adminFetch(`/api/re/deals/${dealId}/close`, { method: "PATCH" });
      setSuccessMsg("Deal successfully closed!");
      setTimeout(() => setSuccessMsg(""), 4000);
      await fetchAll();
    } catch (err) {
      alert(err.message || "Failed to close deal.");
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle Pay Commission
  const handlePayCommissionSubmit = async (e) => {
    e.preventDefault();
    if (!payModalDeal) return;
    setPaying(true);
    try {
      await adminFetch(`/api/re/deals/${payModalDeal._id}/pay-commission`, {
        method: "PATCH",
        body: JSON.stringify(payForm),
      });

      setSuccessMsg("Commission payment recorded successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      setPayModalDeal(null);
      setPayForm({ paymentMethod: "NEFT / Bank Transfer", transactionRef: "" });
      await fetchAll();
    } catch (err) {
      alert(err.message || "Failed to record commission payment.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 overflow-hidden rounded-2xl bg-[#172033] p-5 text-white sm:p-7">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D8A36B]">
              Real Estate Control
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
              Commission Engine
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Property Deals & Settlements</h1>
          <p className="mt-2 text-sm text-slate-300">
            Review agent commission requests, freeze rates, and execute payouts upon closing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a0571e]"
          >
            <Plus size={16} /> Create Deal
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

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Sales Volume
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {formatPrice(stats.totalSalesVolume)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {stats.totalDeals} deals ({stats.closedDeals} closed)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Agent Commissions
          </p>
          <p className="mt-2 text-2xl font-extrabold text-[#B96928]">
            {formatPrice(stats.totalAgentCommission)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Allocated to listing agents</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Platform Revenue (0.5%)
          </p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-700">
            {formatPrice(stats.totalPlatformRevenue)}
          </p>
          <p className="mt-1 text-xs text-slate-400">JimCollaborate fees</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Deals
          </p>
          <p className="mt-2 text-2xl font-extrabold text-blue-600">
            {stats.inProgressDeals}
          </p>
          <p className="mt-1 text-xs text-slate-400">In negotiation / closing</p>
        </div>
      </div>

      {/* Deals Management Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <RefreshCw size={24} className="animate-spin text-[#B96928]" />
          <p className="text-sm font-medium">Loading deals...</p>
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Handshake size={28} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">No Real Estate Deals Found</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Create a deal from a lead or click the "Create Deal" button to record agreed terms.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Property & Owner</th>
                  <th className="px-5 py-4">Buyer Info</th>
                  <th className="px-5 py-4">Listing Agent</th>
                  <th className="px-5 py-4">Agreed Price</th>
                  <th className="px-5 py-4">Commission Breakdown</th>
                  <th className="px-5 py-4">Commission Status</th>
                  <th className="px-5 py-4">Owner Approval</th>
                  <th className="px-5 py-4">Deal Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deals.map((deal) => {
                  const commStatus = deal.commissionStatus || "requested";
                  const ownerStatus = deal.ownerApprovalStatus || "pending";
                  const busy = actionInProgress === deal._id;

                  return (
                    <tr key={deal._id} className="hover:bg-slate-50/80 transition">
                      {/* Property & Owner */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {deal.propertyId?.title || "Property"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {deal.propertyId?.city || "Jim Corbett"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Owner: {deal.ownerId?.name || "Resort Owner"}
                        </p>
                      </td>

                      {/* Buyer */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{deal.buyerName || "—"}</p>
                        {deal.buyerPhone && (
                          <p className="text-xs text-slate-500">{deal.buyerPhone}</p>
                        )}
                      </td>

                      {/* Agent */}
                      <td className="px-5 py-4">
                        {deal.listingAgentId ? (
                          <div>
                            <p className="font-semibold text-slate-800">
                              {deal.listingAgentId.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {deal.listingAgentId.phone || ""}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Direct / No Agent</span>
                        )}
                      </td>

                      {/* Deal Price */}
                      <td className="px-5 py-4 font-extrabold text-slate-900">
                        {formatPrice(deal.dealPrice)}
                      </td>

                      {/* Breakdown */}
                      <td className="px-5 py-4 text-xs space-y-0.5">
                        <p className="font-bold text-[#B96928]">
                          Agent ({deal.listingAgentRate || deal.agentCommissionPct}%):{" "}
                          {formatPrice(deal.listingAgentCommission)}
                        </p>
                        <p className="text-slate-600">
                          Platform ({deal.platformRate || 0.5}%):{" "}
                          {formatPrice(deal.platformCommission)}
                        </p>
                        <p className="font-semibold text-emerald-800">
                          Owner Net: {formatPrice(deal.ownerPayoutAmount)}
                        </p>
                      </td>

                      {/* Commission Status */}
                      <td className="px-5 py-4">
                        {commStatus === "paid" ? (
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                              <CheckCircle2 size={12} /> Paid
                            </span>
                            {deal.commissionPaidRef && (
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Ref: {deal.commissionPaidRef}
                              </p>
                            )}
                          </div>
                        ) : commStatus === "frozen" ? (
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                              <ShieldCheck size={12} /> Rate Frozen
                            </span>
                            <button
                              onClick={() => {
                                setPayModalDeal(deal);
                                setPayForm({ paymentMethod: "NEFT / Bank Transfer", transactionRef: "" });
                              }}
                              className="block mt-1 text-[11px] font-bold text-emerald-700 hover:underline"
                            >
                              Mark Paid
                            </button>
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                              <Clock size={12} /> Requested
                            </span>
                            <button
                              onClick={() => {
                                setFreezeModalDeal(deal);
                                setFreezeRate(String(deal.listingAgentRate || deal.agentCommissionPct || 2));
                              }}
                              className="block mt-1 text-[11px] font-bold text-[#B96928] hover:underline"
                            >
                              Review & Freeze
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Owner Approval */}
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

                      {/* Deal Status */}
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

                      {/* Actions */}
                      <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        {deal.status === "in_progress" && (
                          <button
                            onClick={() => handleCloseDeal(deal._id)}
                            disabled={busy}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-800 disabled:opacity-50"
                          >
                            <CheckCircle2 size={13} />
                            {busy ? "Closing..." : "Close Deal"}
                          </button>
                        )}

                        {commStatus !== "paid" && (
                          <button
                            onClick={() => {
                              setPayModalDeal(deal);
                              setPayForm({ paymentMethod: "NEFT / Bank Transfer", transactionRef: "" });
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            <Wallet size={13} /> Pay Comm
                          </button>
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

      {/* CREATE DEAL MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#B96928]">
                  Admin Deal Desk
                </p>
                <h3 className="text-xl font-bold text-slate-900">Create Property Deal</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDealSubmit} className="mt-5 space-y-4">
              {/* Select Property */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Property *
                </label>
                <select
                  required
                  value={form.propertyId}
                  onChange={(e) => {
                    const sel = properties.find((p) => p._id === e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      propertyId: e.target.value,
                      dealPrice: sel?.price ? String(sel.price) : prev.dealPrice,
                      listingAgentId:
                        sel?.listingAgentId?._id || sel?.listingAgentId || prev.listingAgentId,
                      listingAgentRate: sel?.ownerCommissionOffer
                        ? String(sel.ownerCommissionOffer)
                        : prev.listingAgentRate,
                    }));
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-[#B96928] focus:outline-none"
                >
                  <option value="">-- Choose Property --</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.city}) — {formatPrice(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Lead (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Lead (Optional)
                </label>
                <select
                  value={form.leadId}
                  onChange={(e) => {
                    const l = leads.find((x) => x._id === e.target.value);
                    if (l) {
                      setForm((prev) => ({
                        ...prev,
                        leadId: l._id,
                        buyerName: l.buyerName || prev.buyerName,
                        buyerPhone: l.buyerPhone || prev.buyerPhone,
                        buyerEmail: l.buyerEmail || prev.buyerEmail,
                        propertyId: l.propertyId?._id || prev.propertyId,
                        listingAgentId:
                          l.assignedAgentId?._id || l.assignedAgentId || prev.listingAgentId,
                        dealPrice: l.propertyId?.price
                          ? String(l.propertyId.price)
                          : prev.dealPrice,
                      }));
                    } else {
                      setForm((prev) => ({ ...prev, leadId: "" }));
                    }
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-[#B96928] focus:outline-none"
                >
                  <option value="">-- Choose Lead (or enter buyer manually) --</option>
                  {leads.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.buyerName} ({l.buyerPhone}) — {l.propertyId?.title || "Property"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Listing Agent */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Listing Agent
                </label>
                <select
                  value={form.listingAgentId}
                  onChange={(e) => setForm({ ...form, listingAgentId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-[#B96928] focus:outline-none"
                >
                  <option value="">-- Direct Deal / No Agent --</option>
                  {agents.map((ag) => (
                    <option key={ag._id} value={ag._id}>
                      {ag.name} ({ag.phone || ag.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Buyer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Buyer Name</label>
                  <input
                    type="text"
                    value={form.buyerName}
                    onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                    placeholder="e.g. Amit Verma"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Buyer Phone</label>
                  <input
                    type="tel"
                    value={form.buyerPhone}
                    onChange={(e) => setForm({ ...form, buyerPhone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Buyer Email</label>
                  <input
                    type="email"
                    value={form.buyerEmail}
                    onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
                    placeholder="e.g. amit@example.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Pricing & Commission Rates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Deal Price (₹) *
                  </label>
                  <input
                    required
                    type="number"
                    value={form.dealPrice}
                    onChange={(e) => setForm({ ...form, dealPrice: e.target.value })}
                    placeholder="e.g. 5000000"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Agent Comm (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.listingAgentRate}
                    onChange={(e) => setForm({ ...form, listingAgentRate: e.target.value })}
                    placeholder="e.g. 2"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-[#B96928] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Platform Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.platformRate}
                    onChange={(e) => setForm({ ...form, platformRate: e.target.value })}
                    placeholder="0.5"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Calculation Preview */}
              {liveCalculation.price > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2 text-xs">
                  <p className="font-bold uppercase tracking-wider text-amber-900">
                    Payout Preview
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-amber-200/60">
                    <div>
                      <p className="text-slate-500">Agreed Price</p>
                      <p className="font-bold text-sm text-slate-900">
                        {formatPrice(liveCalculation.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Agent Commission ({liveCalculation.agentRate}%)</p>
                      <p className="font-bold text-sm text-[#B96928]">
                        {formatPrice(liveCalculation.agentComm)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Platform ({liveCalculation.platRate}%)</p>
                      <p className="font-bold text-sm text-slate-700">
                        {formatPrice(liveCalculation.platComm)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Owner Net Payout</p>
                      <p className="font-bold text-sm text-emerald-800">
                        {formatPrice(liveCalculation.ownerNet)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">Notes / Remarks</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Terms, earnest money details, etc."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDeal}
                  className="rounded-xl bg-[#172033] px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-slate-800 disabled:opacity-50"
                >
                  {submittingDeal ? "Creating Deal..." : "Create Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FREEZE COMMISSION MODAL */}
      {freezeModalDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Freeze Commission Rate</h3>
              <button
                onClick={() => setFreezeModalDeal(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFreezeCommissionSubmit} className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
                <p className="font-bold text-slate-800">
                  Deal Price: {formatPrice(freezeModalDeal.dealPrice)}
                </p>
                <p className="text-slate-500">
                  Property: {freezeModalDeal.propertyId?.title}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Final Agreed Agent Commission Rate (%) *
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  min="0"
                  max="15"
                  value={freezeRate}
                  onChange={(e) => setFreezeRate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-bold text-[#B96928] focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Calculated Amount:{" "}
                  <strong>
                    {formatPrice(((Number(freezeModalDeal.dealPrice) || 0) * (Number(freezeRate) || 0)) / 100)}
                  </strong>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFreezeModalDeal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={freezing}
                  className="rounded-xl bg-[#172033] px-5 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 disabled:opacity-50"
                >
                  {freezing ? "Freezing..." : "Freeze Commission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAY COMMISSION MODAL */}
      {payModalDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Mark Commission Paid</h3>
              <button
                onClick={() => setPayModalDeal(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePayCommissionSubmit} className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-3 text-xs space-y-1">
                <p className="font-bold text-slate-800">
                  Agent Commission to Pay:{" "}
                  <span className="text-emerald-700 text-sm font-extrabold">
                    {formatPrice(payModalDeal.listingAgentCommission)}
                  </span>
                </p>
                <p className="text-slate-500">
                  Recipient: {payModalDeal.listingAgentId?.name || "Listing Agent"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Payment Method</label>
                <input
                  type="text"
                  value={payForm.paymentMethod}
                  onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}
                  placeholder="e.g. NEFT, RTGS, UPI"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Transaction Reference / UTR Number *
                </label>
                <input
                  required
                  type="text"
                  value={payForm.transactionRef}
                  onChange={(e) => setPayForm({ ...payForm, transactionRef: e.target.value })}
                  placeholder="e.g. CMS1234567890"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayModalDeal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paying}
                  className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow hover:bg-emerald-800 disabled:opacity-50"
                >
                  {paying ? "Saving Payment..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminREDealsManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
          Loading deals management...
        </div>
      }
    >
      <AdminREDealsContent />
    </Suspense>
  );
}
