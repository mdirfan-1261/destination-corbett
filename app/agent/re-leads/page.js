"use client";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, AlertCircle, Phone, MapPin, ChevronDown, IndianRupee } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "").replace(/\/api$/, "");

const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-700", contacted: "bg-amber-100 text-amber-700",
  site_visit: "bg-purple-100 text-purple-700", negotiating: "bg-orange-100 text-orange-700",
  converted: "bg-emerald-100 text-emerald-700", lost: "bg-rose-100 text-rose-700",
};
const NEXT_STATUSES = { new: "contacted", contacted: "site_visit", site_visit: "negotiating", negotiating: "converted" };

function formatPrice(p) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
  return `₹${p.toLocaleString("en-IN")}`;
}

export default function AgentRELeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("agentToken");
      const res = await fetch(`${API_BASE}/api/re/leads/agent/my`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLeads(data.leads || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const token = localStorage.getItem("agentToken");
      const res = await fetch(`${API_BASE}/api/re/leads/agent/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLeads(l => l.map(x => x._id === id ? { ...x, status } : x));
    } catch (e) { alert(e.message); }
    finally { setUpdating(null); }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="overflow-hidden rounded-2xl bg-[#172033] p-5 text-white sm:p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-[#D8A36B]">Real Estate</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Property Leads</h1>
        <p className="mt-2 text-sm text-slate-300">Buyer enquiries assigned to you — follow up and convert!</p>
      </div>

      {error && <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700 text-sm"><AlertCircle size={18} />{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3"><RefreshCw size={20} className="animate-spin" />Loading leads...</div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-slate-200 bg-white">
          <p className="font-bold text-slate-600">No leads assigned yet</p>
          <p className="text-sm text-slate-400 mt-1">Admin will assign buyer leads to you</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {leads.map(l => (
            <div key={l._id} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800">{l.buyerName}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5"><Phone size={11} />{l.buyerPhone}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[l.status] || "bg-slate-100 text-slate-600"}`}>
                  {l.status?.replace("_", " ")}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-slate-700 text-sm">{l.propertyId?.title || "Property"}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-1"><MapPin size={11} />{l.propertyId?.city || "—"}</p>
                {l.propertyId?.price && (
                  <p className="flex items-center gap-1 text-sm font-bold text-emerald-700 mt-1">
                    <IndianRupee size={13} />{formatPrice(l.propertyId.price)}
                  </p>
                )}
              </div>

              {l.message && (
                <p className="text-xs text-slate-500 italic">"{l.message}"</p>
              )}

              <p className="text-xs text-slate-400">
                Received: {new Date(l.createdAt).toLocaleDateString("en-IN")}
              </p>

              {NEXT_STATUSES[l.status] && (
                <button
                  onClick={() => updateStatus(l._id, NEXT_STATUSES[l.status])}
                  disabled={updating === l._id}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#172033] py-2.5 text-sm font-semibold text-white hover:bg-[#1e2d45] disabled:opacity-50 transition capitalize">
                  {updating === l._id ? <RefreshCw size={15} className="animate-spin" /> : null}
                  Move to: {NEXT_STATUSES[l.status].replace("_", " ")}
                </button>
              )}
              {l.status === "negotiating" && (
                <button
                  onClick={() => updateStatus(l._id, "converted")}
                  disabled={updating === l._id}
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                  ✅ Mark Converted
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}