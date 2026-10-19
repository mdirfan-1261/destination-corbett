"use client";
import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2, XCircle, Eye, RefreshCw, Home,
  MapPin, IndianRupee, Clock, AlertCircle, Search,
} from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "").replace(/\/api$/, "");

const STATUS_STYLES = {
  pending:  "bg-amber-100 text-amber-700",
  listed:   "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  sold:     "bg-blue-100 text-blue-700",
  draft:    "bg-slate-100 text-slate-500",
};

function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function AdminREPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch]         = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`${API_BASE}/api/re/properties/admin?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProperties(data.properties || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const handleApprove = async (id) => {
    setActionLoading(id + "_approve");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/api/re/properties/admin/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProperties(p => p.filter(x => x._id !== id));
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return alert("Rejection reason required.");
    setActionLoading(rejectModal + "_reject");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/api/re/properties/admin/${rejectModal}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProperties(p => p.filter(x => x._id !== rejectModal));
      setRejectModal(null); setRejectReason("");
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = properties.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Real Estate — Properties</h1>
          <p className="text-sm text-slate-500 mt-1">Review and approve property listings</p>
        </div>
        <button onClick={fetchProperties}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {["pending","listed","rejected","sold","draft"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
              statusFilter === s ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
            }`}>
            {s}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 w-48" />
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
            <p className="text-slate-500 font-semibold">No {statusFilter} properties</p>
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
                  <th className="px-5 py-3.5 text-left font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{p.title}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin size={11} /> {p.city || "—"}, {p.state || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="capitalize text-slate-600">{p.propertyType}</span>
                      <p className="text-xs text-slate-400 capitalize">{p.transactionType}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-700">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {p.ownerId?.name || "—"}
                      <p className="text-xs text-slate-400">{p.ownerId?.email || ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[p.status] || "bg-slate-100 text-slate-600"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {p.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(p._id)}
                              disabled={actionLoading === p._id + "_approve"}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition">
                              {actionLoading === p._id + "_approve"
                                ? <RefreshCw size={12} className="animate-spin" />
                                : <CheckCircle2 size={12} />} Approve
                            </button>
                            <button
                              onClick={() => { setRejectModal(p._id); setRejectReason(""); }}
                              className="flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition">
                              <XCircle size={12} /> Reject
                            </button>
                          </>
                        )}
                        {p.status !== "pending" && (
                          <span className="text-xs text-slate-400 italic">No action needed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Reject Property</h3>
            <p className="text-sm text-slate-500">Provide a reason — the owner will see this.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Images are unclear, price not mentioned properly..."
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
    </div>
  );
}
