
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Home,
  UserCheck,
  Handshake,
  MessageSquare,
  Building,
} from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

function formatPrice(price) {
  const amount = Number(price) || 0;

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getAgentToken() {
  if (typeof window === "undefined") return null;

  for (const key of [
    "agentToken",
    "destin_agent_token",
    "agent_token",
  ]) {
    const token = localStorage.getItem(key);

    if (token && token !== "null" && token !== "undefined") {
      return token.trim();
    }
  }

  return null;
}

async function agentFetch(path, options = {}) {
  const token = getAgentToken();

  if (!token) {
    throw new Error("Agent login nahi mila. Please dobara login karein.");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status}).`
    );
  }

  return data;
}

const LEAD_STATUS_CONFIG = {
  new: {
    label: "New Lead",
    cls: "bg-blue-100 text-blue-800 border-blue-200",
  },
  contacted: {
    label: "Contacted",
    cls: "bg-amber-100 text-amber-800 border-amber-200",
  },
  site_visit: {
    label: "Site Visit Scheduled",
    cls: "bg-purple-100 text-purple-800 border-purple-200",
  },
  site_visit_scheduled: {
    label: "Site Visit Scheduled",
    cls: "bg-purple-100 text-purple-800 border-purple-200",
  },
  negotiating: {
    label: "In Negotiation",
    cls: "bg-orange-100 text-orange-800 border-orange-200",
  },
  negotiation: {
    label: "In Negotiation",
    cls: "bg-orange-100 text-orange-800 border-orange-200",
  },
  deal_created: {
    label: "Deal Created",
    cls: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  converted: {
    label: "Deal Converted",
    cls: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  lost: {
    label: "Lost",
    cls: "bg-rose-100 text-rose-800 border-rose-200",
  },
};

export default function AgentRELeadsAndInvitesPage() {
  const router = useRouter();

  const [tab, setTab] = useState("invites");
  const [invites, setInvites] = useState([]);
  const [leads, setLeads] = useState([]);
  const [activeProperties, setActiveProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch invitations, leads and accepted properties.
  // API errors are no longer silently converted to empty arrays.
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        agentFetch("/api/re/properties/agent/invites"),
        agentFetch("/api/re/leads/agent/my"),
        agentFetch("/api/re/properties/agent/my"),
      ]);

      const [invitesResult, leadsResult, propertiesResult] = results;

      // Pending invitations are essential to this page.
      if (invitesResult.status === "rejected") {
        setInvites([]);

        console.error(
          "Pending invites API failed:",
          invitesResult.reason
        );

        throw new Error(
          `Pending Invites API: ${
            invitesResult.reason?.message || "Request failed"
          }`
        );
      }

      const invitesData = invitesResult.value;

      if (!Array.isArray(invitesData.properties)) {
        console.error("Unexpected invites API response:", invitesData);
        setInvites([]);

        throw new Error(
          "Pending Invites API ne expected properties list return nahi ki."
        );
      }

      setInvites(invitesData.properties);

      // Assigned leads
      if (leadsResult.status === "fulfilled") {
        const leadsData = leadsResult.value;

        setLeads(
          Array.isArray(leadsData.leads) ? leadsData.leads : []
        );
      } else {
        setLeads([]);
        console.error("Agent leads API failed:", leadsResult.reason);
      }

      // Accepted properties
      if (propertiesResult.status === "fulfilled") {
        const propertiesData = propertiesResult.value;

        setActiveProperties(
          Array.isArray(propertiesData.properties)
            ? propertiesData.properties
            : []
        );
      } else {
        setActiveProperties([]);
        console.error(
          "Agent active properties API failed:",
          propertiesResult.reason
        );
      }

      // Open leads tab only when no invitations exist.
      if (
        invitesData.properties.length === 0 &&
        leadsResult.status === "fulfilled" &&
        Array.isArray(leadsResult.value.leads) &&
        leadsResult.value.leads.length > 0
      ) {
        setTab("leads");
      }
    } catch (err) {
      setError(err.message || "Failed to load agent data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Accept or reject a property invitation.
  const handleInviteDecision = async (propertyId, decision) => {
    setActionLoading(propertyId);
    setError("");
    setSuccessMsg("");

    try {
      await agentFetch(
        `/api/re/properties/agent/${propertyId}/invite-respond`,
        {
          method: "PATCH",
          body: JSON.stringify({ decision }),
        }
      );

      setSuccessMsg(
        decision === "accepted"
          ? "Invite accepted! Property is now in your Active Properties."
          : "Invite rejected."
      );

      await fetchAllData();
    } catch (err) {
      setError(err.message || "Failed to respond to invite.");
    } finally {
      setActionLoading(null);
    }
  };

  // Update assigned lead status.
  const handleUpdateLeadStatus = async (leadId, nextStatus) => {
    setActionLoading(leadId);
    setError("");
    setSuccessMsg("");

    try {
      await agentFetch(`/api/re/leads/agent/${leadId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      setLeads((previous) =>
        previous.map((lead) =>
          lead._id === leadId
            ? { ...lead, status: nextStatus }
            : lead
        )
      );

      setSuccessMsg("Lead status updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update lead status.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 overflow-hidden rounded-2xl bg-[#172033] p-5 text-white sm:p-7">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D8A36B]">
              Real Estate Partner
            </span>

            {invites.length > 0 && (
              <span className="rounded-full border border-amber-400 bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                {invites.length} Pending{" "}
                {invites.length === 1 ? "Invite" : "Invites"}
              </span>
            )}
          </div>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Property Leads & Invites
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Accept owner invitations, follow up on buyer leads, and close property deals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href="/agent/re-deals"
            className="flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a0571e]"
          >
            <Handshake size={16} />
            RE Deals & Payouts
          </Link>
        </div>
      </div>

      {/* Error and success notifications */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-600" />
          <div className="flex-1">{error}</div>

          <button
            type="button"
            onClick={() => setError("")}
            className="font-bold text-rose-700"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setTab("invites")}
          className={`rounded-2xl border p-5 text-left transition ${
            tab === "invites"
              ? "border-[#B96928] bg-white ring-2 ring-[#B96928]/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Invites
            </p>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {invites.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {invites.length > 0
              ? "Awaiting your response"
              : "No pending invites"}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setTab("leads")}
          className={`rounded-2xl border p-5 text-left transition ${
            tab === "leads"
              ? "border-[#B96928] bg-white ring-2 ring-[#B96928]/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              My Assigned Leads
            </p>
            <UserCheck size={18} className="text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {leads.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Active buyer inquiries
          </p>
        </button>

        <button
          type="button"
          onClick={() => setTab("properties")}
          className={`rounded-2xl border p-5 text-left transition ${
            tab === "properties"
              ? "border-[#B96928] bg-white ring-2 ring-[#B96928]/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              My Active Properties
            </p>
            <Building size={18} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {activeProperties.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Properties you represent
          </p>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        <button
          type="button"
          onClick={() => setTab("invites")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            tab === "invites"
              ? "bg-[#172033] text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Clock size={16} />
          Pending Property Invites
          {invites.length > 0 && (
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">
              {invites.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTab("leads")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            tab === "leads"
              ? "bg-[#172033] text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <UserCheck size={16} />
          My Assigned Leads
          {leads.length > 0 && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
              {leads.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTab("properties")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            tab === "properties"
              ? "bg-[#172033] text-white shadow"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building size={16} />
          My Active Properties
          {activeProperties.length > 0 && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
              {activeProperties.length}
            </span>
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
          <RefreshCw size={24} className="animate-spin text-[#B96928]" />
          <p className="text-sm font-medium">Loading property data...</p>
        </div>
      )}

      {/* Pending invites */}
      {!loading && tab === "invites" && (
        <div className="space-y-4">
          {invites.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Clock size={28} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No Pending Invites
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                When property owners invite you to represent their listing,
                their requests will appear here for you to accept or decline.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {invites.map((property) => {
                const busy = actionLoading === property._id;

                return (
                  <div
                    key={property._id}
                    className="flex flex-col justify-between rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/40 to-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                          <Clock size={12} />
                          Owner Invitation
                        </span>

                        <p className="text-lg font-extrabold text-emerald-800">
                          {formatPrice(property.price)}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {property.title || "Untitled Property"}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1 capitalize">
                            <Home size={13} className="text-slate-400" />
                            {property.propertyType || "Property"} • For{" "}
                            {property.transactionType || "Sale"}
                          </span>

                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-slate-400" />
                            {property.city || property.address || "Jim Corbett"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs">
                        <div>
                          <p className="font-medium text-slate-500">
                            Offered Commission
                          </p>
                          <p className="mt-0.5 text-base font-extrabold text-[#B96928]">
                            {property.ownerCommissionOffer
                              ? `${property.ownerCommissionOffer}%`
                              : "Negotiable"}
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-slate-500">
                            Owner Contact
                          </p>
                          <p className="mt-0.5 truncate font-bold text-slate-800">
                            {property.ownerId?.name || "Property Owner"}
                          </p>

                          {property.ownerId?.phone && (
                            <a
                              href={`tel:${property.ownerId.phone}`}
                              className="text-emerald-700 hover:underline"
                            >
                              {property.ownerId.phone}
                            </a>
                          )}
                        </div>
                      </div>

                      {property.description && (
                        <p className="line-clamp-2 text-xs text-slate-500">
                          {property.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() =>
                          handleInviteDecision(property._id, "accepted")
                        }
                        disabled={busy}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 size={16} />
                        {busy ? "Updating..." : "Accept Assignment"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleInviteDecision(property._id, "rejected")
                        }
                        disabled={busy}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Assigned leads */}
      {!loading && tab === "leads" && (
        <div className="space-y-4">
          {leads.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <UserCheck size={28} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No Leads Assigned Yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Assigned buyer inquiries will appear here for follow-up.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {leads.map((lead) => {
                const statusMeta = LEAD_STATUS_CONFIG[lead.status] || {
                  label: lead.status || "New",
                  cls: "bg-slate-100 text-slate-700 border-slate-200",
                };

                const busy = actionLoading === lead._id;
                const property = lead.propertyId || {};
                const isConverted =
                  lead.status === "converted" ||
                  lead.status === "deal_created";
                const isLost = lead.status === "lost";

                return (
                  <div
                    key={lead._id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            {lead.buyerName || "Buyer"}
                          </h4>
                          <p className="mt-0.5 text-xs text-slate-400">
                            Received {formatDate(lead.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusMeta.cls}`}
                        >
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                        {lead.buyerPhone && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <Phone size={13} className="shrink-0 text-slate-400" />
                            <a
                              href={`tel:${lead.buyerPhone}`}
                              className="font-semibold text-emerald-800 hover:underline"
                            >
                              {lead.buyerPhone}
                            </a>
                          </div>
                        )}

                        {lead.buyerEmail && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail size={13} className="shrink-0 text-slate-400" />
                            <a
                              href={`mailto:${lead.buyerEmail}`}
                              className="truncate hover:underline"
                            >
                              {lead.buyerEmail}
                            </a>
                          </div>
                        )}

                        {lead.message && (
                          <div className="mt-2 flex items-start gap-2 border-t border-slate-200/60 pt-2 text-slate-500">
                            <MessageSquare size={13} className="mt-0.5 shrink-0 text-slate-400" />
                            <p className="line-clamp-2 italic">
                              "{lead.message}"
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-[#F7F5F0] p-3 text-xs">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Inquired Property
                        </p>

                        <p className="mt-1 truncate font-bold text-slate-800">
                          {property.title || "Real Estate Listing"}
                        </p>

                        <div className="mt-1 flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} className="text-slate-400" />
                            {property.city || "Jim Corbett"}
                          </span>

                          <span className="font-bold text-emerald-800">
                            {formatPrice(property.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                      {!isConverted && !isLost && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {lead.status === "new" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateLeadStatus(lead._id, "contacted")
                              }
                              disabled={busy}
                              className="flex-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                            >
                              Mark Contacted
                            </button>
                          )}

                          {["new", "contacted"].includes(lead.status) && (
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateLeadStatus(lead._id, "site_visit")
                              }
                              disabled={busy}
                              className="flex-1 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800 hover:bg-purple-100 disabled:opacity-50"
                            >
                              Schedule Visit
                            </button>
                          )}

                          {[
                            "contacted",
                            "site_visit",
                            "site_visit_scheduled",
                          ].includes(lead.status) && (
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateLeadStatus(lead._id, "negotiating")
                              }
                              disabled={busy}
                              className="flex-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-800 hover:bg-orange-100 disabled:opacity-50"
                            >
                              Negotiation
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to mark this lead as lost?"
                                )
                              ) {
                                handleUpdateLeadStatus(lead._id, "lost");
                              }
                            }}
                            disabled={busy}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 disabled:opacity-50"
                          >
                            Lost
                          </button>
                        </div>
                      )}

                      {!isConverted && !isLost && (
                        <button
                          type="button"
                          onClick={() => {
                            const query = new URLSearchParams({
                              leadId: lead._id,
                              propertyId: property._id || "",
                              buyerName: lead.buyerName || "",
                              buyerPhone: lead.buyerPhone || "",
                              buyerEmail: lead.buyerEmail || "",
                              price: property.price || "",
                            });

                            router.push(`/agent/re-deals?${query.toString()}`);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172033] px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-slate-800"
                        >
                          <Handshake size={14} className="text-[#D8A36B]" />
                          Create Deal from Lead
                        </button>
                      )}

                      {isConverted && (
                        <div className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-xs font-bold text-emerald-800">
                          <CheckCircle2 size={14} />
                          Deal In Progress / Converted
                        </div>
                      )}

                      {isLost && (
                        <div className="py-1 text-center text-xs text-slate-400">
                          Lead marked as lost
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Accepted properties */}
      {!loading && tab === "properties" && (
        <div className="space-y-4">
          {activeProperties.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Building size={28} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No Active Properties
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                You haven't accepted any property listings yet. Check your
                Pending Invites tab to accept invitations from owners.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {activeProperties.map((property) => (
                <div
                  key={property._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-44 w-full bg-slate-100">
                    {property.images?.[0]?.url ? (
                      <img
                        src={property.images[0].url}
                        alt={property.title || "Property"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <Home size={40} />
                      </div>
                    )}

                    <span className="absolute left-3 top-3 rounded-lg bg-emerald-900/90 px-2.5 py-1 text-xs font-bold text-emerald-200 backdrop-blur-sm">
                      Listing Agent
                    </span>

                    <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2.5 py-1 text-sm font-extrabold text-white backdrop-blur-sm">
                      {formatPrice(property.price)}
                    </span>
                  </div>

                  <div className="space-y-3 p-5">
                    <div>
                      <h4 className="truncate text-base font-bold text-slate-900">
                        {property.title || "Untitled Property"}
                      </h4>

                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} className="text-slate-400" />
                        {property.city || property.address || "Jim Corbett"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-xs">
                      <div>
                        <p className="text-[11px] text-slate-400">Type</p>
                        <p className="font-semibold capitalize text-slate-700">
                          {property.propertyType || "Property"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400">
                          Commission Offer
                        </p>
                        <p className="font-semibold text-[#B96928]">
                          {property.ownerCommissionOffer
                            ? `${property.ownerCommissionOffer}%`
                            : "Standard (2%)"}
                        </p>
                      </div>
                    </div>

                    {property.ownerId && (
                      <div className="border-t border-slate-100 pt-2 text-xs text-slate-500">
                        <p className="font-medium text-slate-700">
                          Owner: {property.ownerId.name || "Property Owner"}
                        </p>

                        {property.ownerId.phone && (
                          <a
                            href={`tel:${property.ownerId.phone}`}
                            className="text-emerald-700 hover:underline"
                          >
                            {property.ownerId.phone}
                          </a>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const query = new URLSearchParams({
                          propertyId: property._id,
                          price: property.price || "",
                        });

                        router.push(`/agent/re-deals?${query.toString()}`);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172033] px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-slate-800"
                    >
                      <Handshake size={14} className="text-[#D8A36B]" />
                      Initiate Deal for this Property
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
