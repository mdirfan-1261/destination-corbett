"use client";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .replace(/\/+$/, "").replace(/\/api$/, "");

function formatPrice(p) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
  return `₹${Number(p).toLocaleString("en-IN")}`;
}

export default function OwnerREDealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDeals = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("destin_owner_token");
      const res = await fetch(`${API_BASE}/api/re/deals/owner/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDeals(data.deals || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="overflow-hidden rounded-2xl bg-[#111c24] p-5 text-white sm:p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Real Estate</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Property Deals</h1>
        <p className="mt-2 text-sm text-slate-300">Track all deals on your listed properties</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-700 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <RefreshCw size={20} className="animate-spin" /> Loading...
        </div>
      ) : deals.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-slate-200 bg-white">
          <p className="font-bold text-slate-600">No deals yet</p>
          <p className="text-sm text-slate-400 mt-1">Deals will appear here once admin creates them for your properties</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <tr>
                  {["Property", "Buyer", "Deal Price", "Agent Commission", "Status", "Date"].map(h => (
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
                    <td className="px-5 py-4 text-slate-700">{d.buyerName || "—"}</td>
                    <td className="px-5 py-4 font-bold text-slate-800">{formatPrice(d.dealPrice)}</td>
                    <td className="px-5 py-4 text-emerald-700 font-semibold">{formatPrice(d.listingAgentCommission)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        d.status === "closed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {d.status === "closed" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {d.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}