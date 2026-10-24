"use client";
import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2, XCircle, RefreshCw, Home,
  MapPin, AlertCircle, Search, UserPlus, X,
  Bed, Bath, Maximize2, User, Phone, Mail,
} from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "").replace(/\/api$/, "");

function getAdminToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("adminToken");
  if (!token || token === "null" || token === "undefined") return null;
  return token.trim();
}

async function adminFetch(path, options = {}) {
  const token = getAdminToken();
  if (!token) throw new Error("Admin login nahi mila. Please admin account se dobara login karein.");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
  let data = {};
  try { data = await res.json(); } catch { /* non-JSON */ }
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status}).`);
  return data;
}

const STATUS_STYLES = {
  pending:  "bg-amber-100 text-amber-700",
  listed:   "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  sold:     "bg-blue-100 text-blue-700",
  draft:    "bg-slate-100 text-slate-500",
};

function formatPrice(price) {
  const n = Number(price) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

// ── Property Detail Modal ──────────────────────────────────────
function PropertyDetailModal({ property: p, onClose, onAssignAgent }) {
  if (!p) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl my-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{p.title}</h2>
            <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <MapPin size={13} /> {p.address ? `${p.address}, ` : ""}{p.city}, {p.state} {p.pincode || ""}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition ml-4">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">Price</p>
              <p className="font-bold text-emerald-700 text-sm">{formatPrice(p.price)}</p>
              {p.priceNegotiable && <p className="text-[10px] text-slate-400">Negotiable</p>}
            </div>
            {p.bedrooms != null && (
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <Bed size={14} className="mx-auto text-slate-400 mb-1" />
                <p className="font-bold text-slate-700 text-sm">{p.bedrooms} BHK</p>
                <p className="text-[10px] text-slate-400">Bedrooms</p>
              </div>
            )}
            {p.bathrooms != null && (
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <Bath size={14} className="mx-auto text-slate-400 mb-1" />
                <p className="font-bold text-slate-700 text-sm">{p.bathrooms}</p>
                <p className="text-[10px] text-slate-400">Bathrooms</p>
              </div>
            )}
            {p.areaSqft && (
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <Maximize2 size={14} className="mx-auto text-slate-400 mb-1" />
                <p className="font-bold text-slate-700 text-sm">{p.areaSqft.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">sq.ft</p>
              </div>
            )}
          </div>

          {/* Type */}
          <div className="flex gap-3 text-sm">
            <span className="capitalize rounded-lg bg-indigo-50 text-indigo-700 px-3 py-1 font-medium">{p.propertyType}</span>
            <span className="capitalize rounded-lg bg-teal-50 text-teal-700 px-3 py-1 font-medium">{p.transactionType}</span>
            {p.furnished && <span className="capitalize rounded-lg bg-orange-50 text-orange-700 px-3 py-1 font-medium">{p.furnished}</span>}
            <span className={`capitalize rounded-lg px-3 py-1 font-medium text-xs ${STATUS_STYLES[p.status] || "bg-slate-100 text-slate-600"}`}>{p.status}</span>
          </div>

          {/* Description */}
          {p.description && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
            </div>
          )}

          {/* Amenities */}
          {p.amenities?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {p.amenities.map((a, i) => (
                  <span key={i} className="rounded-full bg-slate-100 text-slate-600 text-xs px-3 py-1">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Info */}
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Owner</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={16} className="text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-700 text-sm">{p.ownerId?.name || "—"}</p>
                <p className="text-xs text-slate-400">{p.ownerId?.email || ""}</p>
              </div>
            </div>
          </div>

          {/* Assigned Agent */}
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Assigned Agent</p>
            {p.listingAgentId ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User size={16} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">{p.listingAgentId?.name || "—"}</p>
                    <p className="text-xs text-slate-400">{p.listingAgentId?.email || ""}</p>
                    <p className="text-xs text-slate-400">{p.listingAgentId?.phone || ""}</p>
                  </div>
                </div>
                <span className={`text-xs rounded-full px-2 py-1 font-semibold capitalize ${
                  p.agentAssignmentStatus === "accepted" ? "bg-emerald-100 text-emerald-700" :
                  p.agentAssignmentStatus === "rejected" ? "bg-rose-100 text-rose-700" :
                  "bg-amber-100 text-amber-700"
                }`}>{p.agentAssignmentStatus || "invited"}</span>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No agent assigned yet</p>
            )}
            <button
              onClick={() => onAssignAgent(p)}
              className="mt-3 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
            >
              <UserPlus size={13} />
              {p.listingAgentId ? "Reassign Agent" : "Assign Agent"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Assign Agent Modal ─────────────────────────────────────────
function AssignAgentModal({ property, agents, agentsLoading, onClose, onAssign, assigning }) {
  const [selectedAgent, setSelectedAgent] = useState("");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Assign Agent</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <p className="text-sm text-slate-500">
          Property: <span className="font-semibold text-slate-700">{property?.title}</span>
        </p>

        {agentsLoading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
            <RefreshCw size={14} className="animate-spin" /> Loading agents...
          </div>
        ) : agents.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No agents found.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {agents.map(agent => (
              <label key={agent._id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  selectedAgent === agent._id
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="agent"
                  value={agent._id}
                  checked={selectedAgent === agent._id}
                  onChange={() => setSelectedAgent(agent._id)}
                  className="accent-indigo-600"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-700">{agent.name}</p>
                  <p className="text-xs text-slate-400">{agent.email}</p>
                  {agent.phone && <p className="text-xs text-slate-400">{agent.phone}</p>}
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onAssign(selectedAgent)}
            disabled={!selectedAgent || assigning}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {assigning ? "Assigning..." : "Assign Agent"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function AdminREPropertiesPage() {
  const [properties, setProperties]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch]             = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Detail modal
  const [detailProperty, setDetailProperty] = useState(null);

  // Reject modal
  const [rejectModal, setRejectModal]   = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Assign agent modal
  const [assignModal, setAssignModal]   = useState(null); // property object
  const [agents, setAgents]             = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [assigning, setAssigning]       = useState(false);

  // ── Fetch Properties ──
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      const data = await adminFetch(`/api/re/properties/admin?${params}`);
      setProperties(data.properties || []);
    } catch (e) {
      setError(e.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  // ── Fetch Agents for dropdown ──
  const fetchAgents = async () => {
    setAgentsLoading(true);
    try {
      // GET /api/admin/agents?status=approved&limit=100
      const data = await adminFetch("/api/admin/agents?status=approved&limit=100");
      setAgents(data.data || data.agents || []);
    } catch (e) {
      console.error("fetchAgents error:", e.message);
      setAgents([]);
    } finally {
      setAgentsLoading(false);
    }
  };

  // ── Approve ──
  const handleApprove = async (id) => {
    setActionLoading(id + "_approve");
    try {
      const data = await adminFetch(`/api/re/properties/admin/${id}/approve`, { method: "PATCH" });
      setProperties(prev =>
        statusFilter === "all"
          ? prev.map(x => x._id === id ? { ...x, status: "listed" } : x)
          : prev.filter(x => x._id !== id)
      );
    } catch (e) { alert(e.message); }
    finally { setActionLoading(null); }
  };

  // ── Reject ──
  const handleReject = async () => {
    if (!rejectReason.trim()) return alert("Rejection reason required.");
    setActionLoading(rejectModal + "_reject");
    try {
      await adminFetch(`/api/re/properties/admin/${rejectModal}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason: rejectReason }),
      });
      setProperties(prev =>
        statusFilter === "all"
          ? prev.map(x => x._id === rejectModal ? { ...x, status: "rejected" } : x)
          : prev.filter(x => x._id !== rejectModal)
      );
      setRejectModal(null);
      setRejectReason("");
      if (detailProperty?._id === rejectModal) setDetailProperty(null);
    } catch (e) { alert(e.message); }
    finally { setActionLoading(null); }
  };

  // ── Open Assign Modal ──
  const openAssignModal = (property) => {
    setAssignModal(property);
    setDetailProperty(null);
    fetchAgents();
  };

  // ── Assign Agent ──
  const handleAssignAgent = async (agentId) => {
    if (!agentId || !assignModal) return;
    setAssigning(true);
    try {
      const data = await adminFetch(`/api/re/properties/admin/${assignModal._id}/assign-agent`, {
        method: "PATCH",
        body: JSON.stringify({ agentId }),
      });
      // Update property in list
      setProperties(prev =>
        prev.map(x => x._id === assignModal._id ? data.property : x)
      );
      alert(`✅ ${data.message}`);
      setAssignModal(null);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setAssigning(false);
    }
  };

  // ── Filter & Search ──
  const q = search.toLowerCase();
  const filtered = properties.filter(p =>
    (p.title?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q) || p.ownerId?.name?.toLowerCase().includes(q))
  );

  const STATUS_TABS = ["all", "pending", "listed", "rejected", "sold", "draft"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Real Estate — Properties</h1>
          <p className="text-sm text-slate-500 mt-1">
            All property listings · {loading ? "…" : `${filtered.length} properties`}
          </p>
        </div>
        <button onClick={fetchProperties}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
              statusFilter === s
                ? "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
            }`}>
            {s === "all" ? "All Properties" : s}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, city, owner..."
            className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-56" />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <RefreshCw size={20} className="animate-spin" /> Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Home size={32} className="text-slate-200 mb-3" />
            <p className="text-slate-500 font-semibold">No {statusFilter !== "all" ? statusFilter : ""} properties found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 text-left font-semibold">Property</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Type</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Price</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Owner</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Assigned Agent</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50 transition">
                    {/* Property Name */}
                    
{/* Property Image + Name */}
<td className="px-5 py-4">
  <button
    onClick={() => setDetailProperty(p)}
    className="flex items-center gap-3 text-left group"
  >
    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
      {p.images?.[0]?.url ? (
        <img
          src={p.images[0].url}
          alt={p.title || "Property image"}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <Home size={22} className="text-slate-300" />
      )}
    </div>

    <div>
      <p className="font-semibold text-slate-800 group-hover:text-indigo-600">
        {p.title}
      </p>
      <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
        <MapPin size={11} />
        {p.city || "—"}, {p.state || "—"}
      </p>
    </div>
  </button>
</td>


                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className="capitalize text-slate-600">{p.propertyType}</span>
                      <p className="text-xs text-slate-400 capitalize">{p.transactionType}</p>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 font-semibold text-emerald-700">
                      {formatPrice(p.price)}
                    </td>

                    {/* Owner */}
                    <td className="px-5 py-4 text-slate-600">
                      {p.ownerId?.name || "—"}
                      <p className="text-xs text-slate-400">{p.ownerId?.email || ""}</p>
                    </td>

                    {/* Assigned Agent */}
                    <td className="px-5 py-4">
                      {p.listingAgentId ? (
                        <div>
                          <p className="text-slate-700 font-medium text-xs">{p.listingAgentId?.name || "—"}</p>
                          <p className="text-xs text-slate-400">{p.listingAgentId?.email || ""}</p>
                          <span className={`inline-flex mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                            p.agentAssignmentStatus === "accepted" ? "bg-emerald-100 text-emerald-700" :
                            p.agentAssignmentStatus === "rejected" ? "bg-rose-100 text-rose-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>{p.agentAssignmentStatus || "invited"}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not assigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[p.status] || "bg-slate-100 text-slate-600"}`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Approve / Reject for pending */}
                        {p.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(p._id)}
                              disabled={actionLoading === p._id + "_approve"}
                              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition">
                              {actionLoading === p._id + "_approve"
                                ? <RefreshCw size={11} className="animate-spin" />
                                : <CheckCircle2 size={11} />} Approve
                            </button>
                            <button
                              onClick={() => { setRejectModal(p._id); setRejectReason(""); }}
                              className="flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition">
                              <XCircle size={11} /> Reject
                            </button>
                          </>
                        )}

                        {/* Assign Agent — always available for listed/pending */}
                        {(p.status === "listed" || p.status === "pending") && (
                          <button
                            onClick={() => openAssignModal(p)}
                            className="flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition">
                            <UserPlus size={11} />
                            {p.listingAgentId ? "Reassign" : "Assign Agent"}
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => setDetailProperty(p)}
                          className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          onAssignAgent={openAssignModal}
        />
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Reject Property</h3>
            <p className="text-sm text-slate-500">Reason likhein — owner ko dikhega.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Images unclear, price not specified..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={handleReject}
                disabled={actionLoading?.includes("_reject")}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50">
                {actionLoading?.includes("_reject") ? "Rejecting..." : "Reject Property"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Agent Modal */}
      {assignModal && (
        <AssignAgentModal
          property={assignModal}
          agents={agents}
          agentsLoading={agentsLoading}
          onClose={() => setAssignModal(null)}
          onAssign={handleAssignAgent}
          assigning={assigning}
        />
      )}
    </div>
  );
}
