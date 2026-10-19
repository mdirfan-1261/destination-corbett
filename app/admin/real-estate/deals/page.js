"use client";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, AlertCircle, Plus, CheckCircle2, X, IndianRupee } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "").replace(/\/api$/, "");

function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

const EMPTY_DEAL = { propertyId: "", ownerId: "", buyerName: "", buyerPhone: "", buyerEmail: "", listingAgentId: "", dealPrice: "", listingAgentRate: "2", platformRate: "0.5" };

export default function AdminREDealsPage() {
  const [deals, setDeals] = useState([]);
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_DEAL);
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fetchAll = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const [dealsRes, propsRes, agentsRes] = await Promise.all([
        fetch(`${API_BASE}/api/re/deals/admin`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/re/properties/admin?status=listed`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/agent/admin/agents`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const dealsData = await dealsRes.json();
      const propsData = await propsRes.json().catch(() => ({}));
      const agentsData = await agentsRes.json().catch(() => ({}));
      if (!dealsRes.ok) throw new Error(dealsData.message);
      setDeals(dealsData.deals || []);
      setProperties(propsData.properties || []);
      setAgents(agentsData.agents || agentsData.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handlePropertySelect = (propertyId) => {
    const prop = properties.find(p => p._id === propertyId);
    set("propertyId", propertyId);
    if (prop) {
      set("ownerId", prop.ownerId?._id || prop.ownerId || "");
      set("listingAgentId", prop.listingAgentId?._id || prop.listingAgentId || "");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/api/re/deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, dealPrice: Number(form.dealPrice), listingAgentRate: Number(form.listingAgentRate), platformRate: Number(form.platformRate) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setShowModal(false); setForm(EMPTY_DEAL);
      await fetchAll();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleClose = async (id) => {
    if (!confirm("Close this deal?")) return;
    setClosing(id);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/api/re/deals/admin/${id}/close`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetchAll();
    } catch (e) { alert(e.message); }
    finally { setClosing(null); }
  };

  const price = Number(form.dealPrice) || 0;
  const agentComm = (price * (Number(form.listingAgentRate) || 0)) / 100;
  const platformComm = (price * (Number(form.platformRate) || 0)) / 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Real Estate — Deals</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage property deals</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition">
          <Plus size={16} /> Create Deal
        </button>
      </div>

      {error && <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700 text-sm"><AlertCircle size={18} />{error}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3"><RefreshCw size={20} className="animate-spin" />Loading...</div>
        ) : deals.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-semibold">No deals yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <tr>
                  {["Property","Buyer","Deal Price","Agent Commission","Platform","Status","Action"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deals.map(d => (
                  <tr key={d._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{d.propertyId?.title || "—"}</p>
                      <p className="text-xs text-slate-500">{d.propertyId?.city || ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">{d.buyerName || "—"}</p>
                      <p className="text-xs text-slate-500">{d.buyerPhone || ""}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">{formatPrice(d.dealPrice)}</td>
                    <td className="px-5 py-4 text-slate-700">{formatPrice(d.listingAgentCommission)} <span className="text-xs text-slate-400">({d.listingAgentRate}%)</span></td>
                    <td className="px-5 py-4 text-slate-700">{formatPrice(d.platformCommission)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        d.status === "closed" ? "bg-emerald-100 text-emerald-700" : d.status === "cancelled" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      }`}>{d.status?.replace("_", " ")}</span>
                    </td>
                    <td className="px-5 py-4">
                      {d.status === "in_progress" && (
                        <button onClick={() => handleClose(d._id)} disabled={closing === d._id}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                          {closing === d._id ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} Close Deal
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Create New Deal</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Property *</label>
                <select value={form.propertyId} onChange={e => handlePropertySelect(e.target.value)} required
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  <option value="">Select property</option>
                  {properties.map(p => <option key={p._id} value={p._id}>{p.title} — {p.city}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Buyer Name *</label>
                  <input value={form.buyerName} onChange={e => set("buyerName", e.target.value)} required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Buyer Phone *</label>
                  <input value={form.buyerPhone} onChange={e => set("buyerPhone", e.target.value)} required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Deal Price (₹) *</label>
                <input type="number" value={form.dealPrice} onChange={e => set("dealPrice", e.target.value)} required min={0}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Agent Commission %</label>
                  <input type="number" value={form.listingAgentRate} onChange={e => set("listingAgentRate", e.target.value)} min={0} max={100} step={0.1}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Platform %</label>
                  <input type="number" value={form.platformRate} onChange={e => set("platformRate", e.target.value)} min={0} max={100} step={0.1}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                </div>
              </div>
              {/* Commission Preview */}
              {price > 0 && (
                <div className="rounded-xl bg-slate-50 p-3 text-sm space-y-1">
                  <p className="font-semibold text-slate-700 mb-2">Commission Preview</p>
                  <div className="flex justify-between"><span className="text-slate-500">Agent gets:</span><span className="font-bold text-emerald-700">{formatPrice(agentComm)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Platform gets:</span><span className="font-bold text-blue-700">{formatPrice(platformComm)}</span></div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                  {saving ? "Creating..." : "Create Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}