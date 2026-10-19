"use client";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, AlertCircle, UserCheck, Phone, Mail, MapPin, X } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "").replace(/\/api$/, "");

const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-700", contacted: "bg-amber-100 text-amber-700",
  site_visit: "bg-purple-100 text-purple-700", negotiating: "bg-orange-100 text-orange-700",
  converted: "bg-emerald-100 text-emerald-700", lost: "bg-rose-100 text-rose-700",
};

export default function AdminRELeadsPage() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [assignModal, setAssignModal] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const [leadsRes, agentsRes] = await Promise.all([
        fetch(`${API_BASE}/api/re/leads/admin?${params}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/agent/admin/agents`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const leadsData = await leadsRes.json();
      const agentsData = await agentsRes.json().catch(() => ({}));
      if (!leadsRes.ok) throw new Error(leadsData.message);
      setLeads(leadsData.leads || []);
      setAgents(agentsData.agents || agentsData.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleAssign = async () => {
    if (!selectedAgent) return alert("Select an agent.");
    setAssigning(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE}/api/re/leads/admin/${assignModal}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ agentId: selectedAgent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetchLeads();
      setAssignModal(null); setSelectedAgent("");
    } catch (e) { alert(e.message); }
    finally { setAssigning(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Real Estate — Leads</h1>
          <p className="text-sm text-slate-500 mt-1">Buyer enquiries — assign agents</p>
        </div>
        <button onClick={fetchLeads} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["", "new", "contacted", "site_visit", "negotiating", "converted", "lost"].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${statusFilter === s ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {error && <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700 text-sm"><AlertCircle size={18} />{error}</div>}

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3"><RefreshCw size={20} className="animate-spin" />Loading...</div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-semibold">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <tr>
                  {["Buyer","Property","Status","Assigned Agent","Date","Action"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map(l => (
                  <tr key={l._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{l.buyerName}</p>
                      <p className="text-xs text-slate-500">{l.buyerPhone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">{l.propertyId?.title || "—"}</p>
                      <p className="text-xs text-slate-500">{l.propertyId?.city || "—"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[l.status] || "bg-slate-100 text-slate-600"}`}>
                        {l.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {l.assignedAgentId ? (
                        <p className="font-medium text-slate-700">{l.assignedAgentId?.name || "Agent"}</p>
                      ) : <span className="text-xs text-amber-600 font-medium">Not assigned</span>}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => { setAssignModal(l._id); setSelectedAgent(""); }}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
                        <UserCheck size={13} /> {l.assignedAgentId ? "Reassign" : "Assign"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Assign Agent</h3>
              <button onClick={() => setAssignModal(null)}><X size={20} className="text-slate-400" /></button>
            </div>
            <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300">
              <option value="">Select Agent</option>
              {agents.map(a => <option key={a._id} value={a._id}>{a.name} — {a.phone || a.email}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setAssignModal(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>
              <button onClick={handleAssign} disabled={assigning} className="flex-1 rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {assigning ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}