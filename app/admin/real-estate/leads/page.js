"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Search,
  Filter,
  X,
  Handshake,
  MessageSquare,
  Building,
  User,
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
  if (!token) throw new Error("Admin session not found. Please log in again.");
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

const ALL_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New Leads" },
  { value: "contacted", label: "Contacted" },
  { value: "site_visit", label: "Site Visit" },
  { value: "negotiating", label: "Negotiating" },
  { value: "converted", label: "Converted / Deal Made" },
  { value: "lost", label: "Lost" },
];

const STATUS_BADGES = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  contacted: "bg-amber-100 text-amber-800 border-amber-200",
  site_visit: "bg-purple-100 text-purple-800 border-purple-200",
  site_visit_scheduled: "bg-purple-100 text-purple-800 border-purple-200",
  negotiating: "bg-orange-100 text-orange-800 border-orange-200",
  negotiation: "bg-orange-100 text-orange-800 border-orange-200",
  deal_created: "bg-emerald-100 text-emerald-800 border-emerald-200",
  converted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  lost: "bg-rose-100 text-rose-800 border-rose-200",
};

export default function AdminRELeadsManagementPage() {
  const router = useRouter();

  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Assign Agent Modal
  const [assignModalLead, setAssignModalLead] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchLeadsAndAgents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [leadsRes, agentsRes] = await Promise.all([
        adminFetch("/api/re/leads/admin"),
        adminFetch("/api/agent/admin/agents").catch(() => ({ agents: [] })),
      ]);

      setLeads(leadsRes.leads || []);
      setAgents(agentsRes.agents || agentsRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load real estate leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeadsAndAgents();
  }, [fetchLeadsAndAgents]);

  // Status counters
  const counts = useMemo(() => {
    return {
      total: leads.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      inProgress: leads.filter(
        (l) =>
          l.status === "contacted" ||
          l.status === "site_visit" ||
          l.status === "site_visit_scheduled" ||
          l.status === "negotiating" ||
          l.status === "negotiation"
      ).length,
      converted: leads.filter((l) => l.status === "converted" || l.status === "deal_created")
        .length,
      lost: leads.filter((l) => l.status === "lost").length,
    };
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const bName = lead.buyerName?.toLowerCase() || "";
        const bPhone = lead.buyerPhone?.toLowerCase() || "";
        const pTitle = lead.propertyId?.title?.toLowerCase() || "";
        const pCity = lead.propertyId?.city?.toLowerCase() || "";
        return (
          bName.includes(q) || bPhone.includes(q) || pTitle.includes(q) || pCity.includes(q)
        );
      }
      return true;
    });
  }, [leads, statusFilter, search]);

  // Handle Assign Agent Submit
  const handleAssignAgentSubmit = async (e) => {
    e.preventDefault();
    if (!assignModalLead || !selectedAgentId) return;

    setAssigning(true);
    setError("");
    try {
      await adminFetch(`/api/re/leads/admin/${assignModalLead._id}/assign`, {
        method: "PATCH",
        body: JSON.stringify({ agentId: selectedAgentId }),
      });

      setSuccessMsg("Agent assigned successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      setAssignModalLead(null);
      setSelectedAgentId("");
      await fetchLeadsAndAgents();
    } catch (err) {
      setError(err.message || "Failed to assign agent.");
    } finally {
      setAssigning(false);
    }
  };

  // Quick Status Update
  const handleQuickStatusChange = async (leadId, newStatus) => {
    try {
      await adminFetch(`/api/re/leads/admin/${leadId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      alert(err.message || "Failed to update status.");
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
              Admin Module
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Property Buyer Leads</h1>
          <p className="mt-2 text-sm text-slate-300">
            Monitor buyer enquiries, assign listing agents, and initiate deals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeadsAndAgents}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <Link
            href="/admin/real-estate/deals"
            className="flex items-center gap-2 rounded-xl bg-[#B96928] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a0571e]"
          >
            <Handshake size={16} /> Manage Deals & Commission
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

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setStatusFilter("all")}
          className={`cursor-pointer rounded-2xl border p-4 transition ${
            statusFilter === "all"
              ? "border-[#B96928] bg-white ring-2 ring-[#B96928]/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold uppercase text-slate-500">Total Leads</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{counts.total}</p>
        </div>

        <div
          onClick={() => setStatusFilter("new")}
          className={`cursor-pointer rounded-2xl border p-4 transition ${
            statusFilter === "new"
              ? "border-blue-500 bg-white ring-2 ring-blue-500/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold uppercase text-slate-500">New</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-600">{counts.newLeads}</p>
        </div>

        <div
          onClick={() => setStatusFilter("contacted")}
          className={`cursor-pointer rounded-2xl border p-4 transition ${
            statusFilter === "contacted"
              ? "border-amber-500 bg-white ring-2 ring-amber-500/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold uppercase text-slate-500">In Progress</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-600">{counts.inProgress}</p>
        </div>

        <div
          onClick={() => setStatusFilter("converted")}
          className={`cursor-pointer rounded-2xl border p-4 transition ${
            statusFilter === "converted"
              ? "border-emerald-500 bg-white ring-2 ring-emerald-500/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold uppercase text-slate-500">Converted</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{counts.converted}</p>
        </div>

        <div
          onClick={() => setStatusFilter("lost")}
          className={`cursor-pointer rounded-2xl border p-4 transition ${
            statusFilter === "lost"
              ? "border-rose-500 bg-white ring-2 ring-rose-500/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold uppercase text-slate-500">Lost</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-600">{counts.lost}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-1 items-center gap-2 min-w-[240px]">
          <Search size={18} className="text-slate-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by buyer name, phone, or property..."
            className="w-full bg-transparent px-2 py-1.5 text-sm focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <RefreshCw size={24} className="animate-spin text-[#B96928]" />
          <p className="text-sm font-medium">Loading leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <UserCheck size={28} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800">No Leads Found</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            {search || statusFilter !== "all"
              ? "No leads matched your search or status filter."
              : "Buyer inquiries from the public website will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Buyer Details</th>
                  <th className="px-5 py-4">Inquired Property</th>
                  <th className="px-5 py-4">Assigned Agent</th>
                  <th className="px-5 py-4">Lead Status</th>
                  <th className="px-5 py-4">Received On</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const prop = lead.propertyId || {};
                  const agent = lead.assignedAgentId;
                  const badgeCls =
                    STATUS_BADGES[lead.status] || "bg-slate-100 text-slate-700";

                  return (
                    <tr key={lead._id} className="hover:bg-slate-50/80 transition">
                      {/* Buyer Details */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{lead.buyerName}</p>
                        <div className="mt-0.5 space-y-0.5 text-xs text-slate-500">
                          <p className="flex items-center gap-1">
                            <Phone size={11} className="text-slate-400" />
                            <a
                              href={`tel:${lead.buyerPhone}`}
                              className="text-emerald-700 hover:underline"
                            >
                              {lead.buyerPhone}
                            </a>
                          </p>
                          {lead.buyerEmail && (
                            <p className="flex items-center gap-1 text-slate-400">
                              <Mail size={11} /> {lead.buyerEmail}
                            </p>
                          )}
                          {lead.message && (
                            <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-1">
                              "{lead.message}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Property Details */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800">{prop.title || "—"}</p>
                        <p className="text-xs text-slate-500">
                          {prop.city || "Jim Corbett"} •{" "}
                          <span className="font-semibold text-emerald-800">
                            {formatPrice(prop.price)}
                          </span>
                        </p>
                      </td>

                      {/* Assigned Agent */}
                      <td className="px-5 py-4">
                        {agent ? (
                          <div>
                            <p className="font-semibold text-slate-900 flex items-center gap-1">
                              <UserCheck size={13} className="text-emerald-600" />
                              {agent.name}
                            </p>
                            {agent.phone && (
                              <p className="text-xs text-slate-400">{agent.phone}</p>
                            )}
                            <button
                              onClick={() => {
                                setAssignModalLead(lead);
                                setSelectedAgentId(agent._id);
                              }}
                              className="mt-1 text-[11px] font-medium text-[#B96928] hover:underline"
                            >
                              Reassign Agent
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAssignModalLead(lead);
                              setSelectedAgentId("");
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
                          >
                            <UserPlus size={13} /> Assign Agent
                          </button>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-5 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleQuickStatusChange(lead._id, e.target.value)}
                          className={`rounded-full border px-3 py-1 text-xs font-bold capitalize focus:outline-none ${badgeCls}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="site_visit">Site Visit</option>
                          <option value="negotiating">Negotiating</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {formatDate(lead.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            router.push(
                              `/admin/real-estate/deals?leadId=${lead._id}&propertyId=${
                                prop._id || ""
                              }&agentId=${agent?._id || ""}&price=${prop.price || ""}`
                            );
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#172033] px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-slate-800"
                        >
                          <Handshake size={13} className="text-[#D8A36B]" />
                          Create Deal
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ASSIGN AGENT MODAL */}
      {assignModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Assign Listing Agent</h3>
              <button
                onClick={() => setAssignModalLead(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignAgentSubmit} className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">
                  Buyer: {assignModalLead.buyerName} ({assignModalLead.buyerPhone})
                </p>
                <p className="text-slate-500">
                  Property: {assignModalLead.propertyId?.title || "Property"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Registered Agent *
                </label>
                <select
                  required
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-[#B96928] focus:outline-none"
                >
                  <option value="">-- Choose Agent --</option>
                  {agents.map((ag) => (
                    <option key={ag._id} value={ag._id}>
                      {ag.name} ({ag.phone || ag.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignModalLead(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning || !selectedAgentId}
                  className="rounded-xl bg-[#172033] px-5 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 disabled:opacity-50"
                >
                  {assigning ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
